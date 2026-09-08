// backend/src/agents/inventory_agent.ts
import { Pool } from 'pg';
import Redis from 'ioredis';

// Configuración de conexiones
export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

const HOLD_DURATION_SECONDS = 15 * 60; // 15 minutos

export class InventoryAgent {
  /**
   * Intenta reservar stock de un inventario específico.
   * Utiliza control de concurrencia optimista mediante el campo `version`
   * o transacciones seguras para evitar condiciones de carrera.
   */
  async reserveStock(userId: string, inventarioId: string, cantidad: number): Promise<boolean> {
    const client = await db.connect();
    try {
      await client.query('BEGIN');

      // Seleccionar y bloquear la fila para actualización para evitar condiciones de carrera (Pessimistic Locking)
      const res = await client.query(
        'SELECT cantidad_disponible, cantidad_reservada FROM Inventario WHERE id = $1 FOR UPDATE',
        [inventarioId]
      );

      if (res.rows.length === 0) {
        throw new Error('Inventario no encontrado');
      }

      const { cantidad_disponible } = res.rows[0];

      if (cantidad_disponible < cantidad) {
        await client.query('ROLLBACK');
        return false; // Stock insuficiente
      }

      // Actualizar el stock: restar de disponible y añadir a reservada
      await client.query(
        `UPDATE Inventario 
         SET cantidad_disponible = cantidad_disponible - $1,
             cantidad_reservada = cantidad_reservada + $1,
             version = version + 1
         WHERE id = $2`,
        [cantidad, inventarioId]
      );

      // Registrar la reserva en Redis con un TTL
      // Clave: reserva:{userId}:{inventarioId} -> valor: cantidad
      const lockKey = `reserva:${userId}:${inventarioId}`;
      await redis.set(lockKey, cantidad, 'EX', HOLD_DURATION_SECONDS);

      await client.query('COMMIT');
      return true;

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error al reservar stock:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Libera una reserva temporal si el tiempo expira o el usuario cancela.
   * Debería ser llamado por un evento de expiración de Redis o manualmente.
   */
  async releaseStock(userId: string, inventarioId: string): Promise<void> {
    const lockKey = `reserva:${userId}:${inventarioId}`;
    const cantidadStr = await redis.get(lockKey);
    
    if (!cantidadStr) {
      // No hay reserva activa o ya expiró
      return;
    }

    const cantidad = parseInt(cantidadStr, 10);
    const client = await db.connect();
    
    try {
      await client.query('BEGIN');

      await client.query(
        `UPDATE Inventario 
         SET cantidad_disponible = cantidad_disponible + $1,
             cantidad_reservada = cantidad_reservada - $1,
             version = version + 1
         WHERE id = $2`,
        [cantidad, inventarioId]
      );

      // Eliminar la llave de Redis explícitamente
      await redis.del(lockKey);
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error al liberar stock:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Confirma la reserva, convirtiéndola en una compra definitiva.
   * Resta la cantidad de `cantidad_reservada`.
   * Puede recibir un `client` transaccional externo para ser parte de una transacción mayor.
   */
  async confirmStock(userId: string, items: {inventarioId: string, cantidad: number}[], externalClient?: any): Promise<boolean> {
    const client = externalClient || await db.connect();
    try {
      if (!externalClient) await client.query('BEGIN');

      for (const item of items) {
        const lockKey = `reserva:${userId}:${item.inventarioId}`;
        const reservaActiva = await redis.get(lockKey);

        if (!reservaActiva || parseInt(reservaActiva, 10) < item.cantidad) {
          throw new Error(`Reserva no válida o expirada para el inventario ${item.inventarioId}`);
        }

        // Restar de la cantidad reservada definitivamente
        await client.query(
          `UPDATE Inventario 
           SET cantidad_reservada = cantidad_reservada - $1,
               version = version + 1
           WHERE id = $2`,
          [item.cantidad, item.inventarioId]
        );

        // Eliminar el lock de Redis
        await redis.del(lockKey);
      }

      if (!externalClient) await client.query('COMMIT');
      return true;
    } catch (error) {
      if (!externalClient) await client.query('ROLLBACK');
      console.error('Error al confirmar stock:', error);
      throw error;
    } finally {
      if (!externalClient) client.release();
    }
  }
}
