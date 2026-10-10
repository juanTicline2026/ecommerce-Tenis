// backend/src/agents/inventory_agent.ts

// ============================================================
// TODO [PRODUCCIÓN]: Descomentar estas importaciones y configurar
// las conexiones cuando se tenga PostgreSQL y Redis disponibles.
//
// import { Pool } from 'pg';
// import Redis from 'ioredis';
//
// export const db = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });
//
// export const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
// ============================================================

const HOLD_DURATION_MS = 15 * 60 * 1000; // 15 minutos en milisegundos

// --- Almacenamiento en memoria (reemplaza PostgreSQL y Redis por ahora) ---

interface InventarioItem {
  id: string;
  variante_id: string;
  talla: number;
  cantidad_disponible: number;
  cantidad_reservada: number;
  version: number;
}

interface Reserva {
  cantidad: number;
  expiraEn: number; // timestamp
  timer: ReturnType<typeof setTimeout>;
}

// Simula la tabla "Inventario" de PostgreSQL
export const inventarioStore: Map<string, InventarioItem> = new Map();

// Simula las reservas temporales de Redis (con TTL)
const reservasStore: Map<string, Reserva> = new Map();

// --- Funciones auxiliares para gestionar el store en memoria ---

/**
 * Agrega productos de prueba al inventario en memoria.
 * Útil para desarrollo local.
 */
export function seedInventario(items: InventarioItem[]): void {
  for (const item of items) {
    inventarioStore.set(item.id, { ...item });
  }
  console.log(`[Inventario] Se cargaron ${items.length} items de prueba.`);
}

function getReservaKey(userId: string, inventarioId: string): string {
  return `reserva:${userId}:${inventarioId}`;
}

export class InventoryAgent {
  /**
   * Intenta reservar stock de un inventario específico.
   * En memoria simula el bloqueo pesimista (FOR UPDATE) que se usará con PostgreSQL.
   *
   * TODO [PRODUCCIÓN]: Reemplazar con queries a PostgreSQL usando
   * SELECT ... FOR UPDATE y transacciones.
   */
  async reserveStock(userId: string, inventarioId: string, cantidad: number): Promise<boolean> {
    const item = inventarioStore.get(inventarioId);

    if (!item) {
      throw new Error('Inventario no encontrado');
    }

    if (item.cantidad_disponible < cantidad) {
      return false; // Stock insuficiente
    }

    // Actualizar stock: restar de disponible y añadir a reservada
    item.cantidad_disponible -= cantidad;
    item.cantidad_reservada += cantidad;
    item.version += 1;

    // Registrar la reserva con un TTL (simula Redis SET con EX)
    const lockKey = getReservaKey(userId, inventarioId);

    // Si ya existía una reserva previa, limpiar el timer
    const reservaExistente = reservasStore.get(lockKey);
    if (reservaExistente) {
      clearTimeout(reservaExistente.timer);
    }

    const timer = setTimeout(() => {
      // Auto-liberar la reserva cuando expire (simula expiración de Redis)
      this.releaseStock(userId, inventarioId).catch((err) =>
        console.error('[Inventario] Error al auto-liberar reserva expirada:', err)
      );
    }, HOLD_DURATION_MS);

    reservasStore.set(lockKey, {
      cantidad,
      expiraEn: Date.now() + HOLD_DURATION_MS,
      timer,
    });

    console.log(`[Inventario] Reserva creada: ${cantidad} unidades del item ${inventarioId} para usuario ${userId}`);
    return true;
  }

  /**
   * Libera una reserva temporal si el tiempo expira o el usuario cancela.
   *
   * TODO [PRODUCCIÓN]: Reemplazar con queries a PostgreSQL + Redis DEL.
   */
  async releaseStock(userId: string, inventarioId: string): Promise<void> {
    const lockKey = getReservaKey(userId, inventarioId);
    const reserva = reservasStore.get(lockKey);

    if (!reserva) {
      // No hay reserva activa o ya expiró
      return;
    }

    const item = inventarioStore.get(inventarioId);
    if (item) {
      item.cantidad_disponible += reserva.cantidad;
      item.cantidad_reservada -= reserva.cantidad;
      item.version += 1;
    }

    // Limpiar timer y eliminar la reserva
    clearTimeout(reserva.timer);
    reservasStore.delete(lockKey);

    console.log(`[Inventario] Reserva liberada: ${reserva.cantidad} unidades del item ${inventarioId} para usuario ${userId}`);
  }

  /**
   * Confirma la reserva, convirtiéndola en una compra definitiva.
   * Resta la cantidad de `cantidad_reservada`.
   *
   * TODO [PRODUCCIÓN]: Reemplazar con queries a PostgreSQL dentro de una
   * transacción externa (parámetro externalClient).
   */
  async confirmStock(userId: string, items: { inventarioId: string; cantidad: number }[]): Promise<boolean> {
    for (const itemReq of items) {
      const lockKey = getReservaKey(userId, itemReq.inventarioId);
      const reserva = reservasStore.get(lockKey);

      if (!reserva || reserva.cantidad < itemReq.cantidad) {
        throw new Error(`Reserva no válida o expirada para el inventario ${itemReq.inventarioId}`);
      }

      const inventario = inventarioStore.get(itemReq.inventarioId);
      if (inventario) {
        // Restar de la cantidad reservada definitivamente
        inventario.cantidad_reservada -= itemReq.cantidad;
        inventario.version += 1;
      }

      // Eliminar el lock
      clearTimeout(reserva.timer);
      reservasStore.delete(lockKey);
    }

    console.log(`[Inventario] Stock confirmado para usuario ${userId}:`, items);
    return true;
  }

  /**
   * Consulta el inventario disponible de un item.
   */
  async getStock(inventarioId: string): Promise<InventarioItem | null> {
    return inventarioStore.get(inventarioId) || null;
  }

  /**
   * Lista todo el inventario disponible.
   */
  async getAllStock(): Promise<InventarioItem[]> {
    return Array.from(inventarioStore.values());
  }
}
