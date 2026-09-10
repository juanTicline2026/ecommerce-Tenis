// backend/src/agents/inventory_agent.ts
import { Pool } from 'pg';
import Redis from 'ioredis';

// Intentar configuración de PostgreSQL opcional (para modo autosuficiente/standalone)
export const db = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : null;

// Intentar configuración de Redis opcional
export const redis = process.env.REDIS_URL
  ? new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: 1, lazyConnect: true })
  : null;

if (redis) {
  redis.on('error', (err) => {
    console.warn('[Redis Warning] Error en la conexión a Redis:', err.message);
  });
}

const HOLD_DURATION_SECONDS = 15 * 60; // 15 minutos

// Base de datos en memoria para funcionamiento 100% autosuficiente y autónomo
export interface InMemProduct {
  id: string;
  marca: string;
  modelo: string;
  descripcion: string;
  precioBase: number;
  imageUrl?: string;
  variantes: Array<{
    id: string;
    colorway: string;
    tallas: Array<{
      inventarioId: string;
      talla: number;
      cantidadDisponible: number;
      cantidadReservada: number;
    }>;
  }>;
}

export const MOCK_CATALOG: InMemProduct[] = [
  {
    id: 'prod-1',
    marca: 'Aether',
    modelo: 'Urban X1',
    descripcion: 'Zapatilla diseñada para el profesional moderno. Combina la estética urbana con la máxima comodidad y soporte necesario para el día a día.',
    precioBase: 2500,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
    variantes: [
      {
        id: 'var-1',
        colorway: 'Off-White / Electric Blue',
        tallas: [
          { inventarioId: 'inv-1', talla: 25, cantidadDisponible: 10, cantidadReservada: 0 },
          { inventarioId: 'inv-2', talla: 26, cantidadDisponible: 8, cantidadReservada: 0 },
          { inventarioId: 'inv-3', talla: 27, cantidadDisponible: 0, cantidadReservada: 0 },
          { inventarioId: 'inv-4', talla: 28, cantidadDisponible: 5, cantidadReservada: 0 }
        ]
      },
      {
        id: 'var-2',
        colorway: 'Charcoal / Neon Green',
        tallas: [
          { inventarioId: 'inv-5', talla: 26, cantidadDisponible: 12, cantidadReservada: 0 },
          { inventarioId: 'inv-6', talla: 27, cantidadDisponible: 4, cantidadReservada: 0 }
        ]
      }
    ]
  },
  {
    id: 'prod-2',
    marca: 'Velocity',
    modelo: 'Aero-Cushion',
    descripcion: 'Amortiguación superior con diseño aero-dinámico para atletas exigentes.',
    precioBase: 3100,
    imageUrl: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=800',
    variantes: [
      {
        id: 'var-3',
        colorway: 'Black / Silver',
        tallas: [
          { inventarioId: 'inv-7', talla: 26, cantidadDisponible: 7, cantidadReservada: 0 },
          { inventarioId: 'inv-8', talla: 27, cantidadDisponible: 9, cantidadReservada: 0 }
        ]
      }
    ]
  },
  {
    id: 'prod-3',
    marca: 'Nike',
    modelo: 'Air Max Pulse',
    descripcion: 'Diseño icónico con máxima respuesta de aire en el talón.',
    precioBase: 2899,
    imageUrl: 'https://images.unsplash.com/photo-1552346154-21d32810baa3?auto=format&fit=crop&q=80&w=800',
    variantes: [
      {
        id: 'var-4',
        colorway: 'Pure Platinum',
        tallas: [
          { inventarioId: 'inv-9', talla: 25.5, cantidadDisponible: 6, cantidadReservada: 0 },
          { inventarioId: 'inv-10', talla: 27.5, cantidadDisponible: 10, cantidadReservada: 0 }
        ]
      }
    ]
  },
  {
    id: 'prod-4',
    marca: 'Adidas',
    modelo: 'Ultraboost Light',
    descripcion: 'Energía épica en cada zancada gracias al material Boost ultra ligero.',
    precioBase: 3499,
    imageUrl: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&q=80&w=800',
    variantes: [
      {
        id: 'var-5',
        colorway: 'Core Black / Cloud White',
        tallas: [
          { inventarioId: 'inv-11', talla: 26, cantidadDisponible: 15, cantidadReservada: 0 },
          { inventarioId: 'inv-12', talla: 28, cantidadDisponible: 8, cantidadReservada: 0 }
        ]
      }
    ]
  }
];

// Reservas en memoria cuando Redis no está presente
const inMemoryReservas = new Map<string, { cantidad: number; expiresAt: number }>();

export class InventoryAgent {
  /**
   * Retorna el catálogo completo o filtrado por marca.
   */
  async getCatalog(marca?: string, limit: number = 20, offset: number = 0) {
    let result = MOCK_CATALOG;
    if (marca) {
      result = result.filter(p => p.marca.toLowerCase() === marca.toLowerCase());
    }
    return result.slice(offset, offset + limit).map(p => ({
      id: p.id,
      marca: p.marca,
      modelo: p.modelo,
      precioBase: p.precioBase,
      imageUrl: p.imageUrl
    }));
  }

  /**
   * Retorna el detalle de un producto por ID.
   */
  async getProductDetail(id: string) {
    const product = MOCK_CATALOG.find(p => p.id === id);
    if (!product) return null;

    return {
      id: product.id,
      marca: product.marca,
      modelo: product.modelo,
      descripcion: product.descripcion,
      precioBase: product.precioBase,
      imageUrl: product.imageUrl,
      variantes: product.variantes.map(v => ({
        id: v.id,
        colorway: v.colorway,
        tallas: v.tallas.map(t => ({
          inventarioId: t.inventarioId,
          talla: t.talla,
          disponible: t.cantidadDisponible > 0
        }))
      }))
    };
  }

  /**
   * Intenta reservar stock de un inventario específico.
   */
  async reserveStock(userId: string, inventarioId: string, cantidad: number): Promise<boolean> {
    // Si la DB y Redis están disponibles en producción
    if (db && redis) {
      const client = await db.connect();
      try {
        await client.query('BEGIN');
        const res = await client.query(
          'SELECT cantidad_disponible FROM Inventario WHERE id = $1 FOR UPDATE',
          [inventarioId]
        );
        if (res.rows.length === 0 || res.rows[0].cantidad_disponible < cantidad) {
          await client.query('ROLLBACK');
          return false;
        }

        await client.query(
          `UPDATE Inventario 
           SET cantidad_disponible = cantidad_disponible - $1,
               cantidad_reservada = cantidad_reservada + $1,
               version = version + 1
           WHERE id = $2`,
          [cantidad, inventarioId]
        );

        const lockKey = `reserva:${userId}:${inventarioId}`;
        await redis.set(lockKey, cantidad, 'EX', HOLD_DURATION_SECONDS);

        await client.query('COMMIT');
        return true;
      } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al reservar stock en DB/Redis:', error);
        throw error;
      } finally {
        client.release();
      }
    }

    // Modo Standalone en memoria (Autónomo sin dependencias externas)
    let itemEncontrado: any = null;
    for (const prod of MOCK_CATALOG) {
      for (const varr of prod.variantes) {
        const item = varr.tallas.find(t => t.inventarioId === inventarioId);
        if (item) {
          itemEncontrado = item;
          break;
        }
      }
    }

    if (!itemEncontrado || itemEncontrado.cantidadDisponible < cantidad) {
      return false;
    }

    itemEncontrado.cantidadDisponible -= cantidad;
    itemEncontrado.cantidadReservada += cantidad;

    const lockKey = `reserva:${userId}:${inventarioId}`;
    inMemoryReservas.set(lockKey, {
      cantidad,
      expiresAt: Date.now() + HOLD_DURATION_SECONDS * 1000
    });

    return true;
  }

  /**
   * Confirma la reserva convirtiéndola en compra definitiva.
   */
  async confirmStock(userId: string, items: { inventarioId: string; cantidad: number }[], externalClient?: any): Promise<boolean> {
    if (db && redis) {
      const client = externalClient || (await db.connect());
      try {
        if (!externalClient) await client.query('BEGIN');
        for (const item of items) {
          const lockKey = `reserva:${userId}:${item.inventarioId}`;
          const reservaActiva = await redis.get(lockKey);
          if (!reservaActiva || parseInt(reservaActiva, 10) < item.cantidad) {
            throw new Error(`Reserva expirada para inventario ${item.inventarioId}`);
          }

          await client.query(
            `UPDATE Inventario 
             SET cantidad_reservada = cantidad_reservada - $1, version = version + 1
             WHERE id = $2`,
            [item.cantidad, item.inventarioId]
          );
          await redis.del(lockKey);
        }
        if (!externalClient) await client.query('COMMIT');
        return true;
      } catch (error) {
        if (!externalClient) await client.query('ROLLBACK');
        throw error;
      } finally {
        if (!externalClient) client.release();
      }
    }

    // Modo Standalone en memoria
    for (const item of items) {
      const lockKey = `reserva:${userId}:${item.inventarioId}`;
      const reserva = inMemoryReservas.get(lockKey);
      if (!reserva || reserva.expiresAt < Date.now() || reserva.cantidad < item.cantidad) {
        throw new Error(`Reserva no válida o expirada para ${item.inventarioId}`);
      }

      for (const prod of MOCK_CATALOG) {
        for (const varr of prod.variantes) {
          const t = varr.tallas.find(ti => ti.inventarioId === item.inventarioId);
          if (t) {
            t.cantidadReservada -= item.cantidad;
          }
        }
      }
      inMemoryReservas.delete(lockKey);
    }

    return true;
  }
}
