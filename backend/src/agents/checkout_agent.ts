// backend/src/agents/checkout_agent.ts
import { InventoryAgent, db } from './inventory_agent';

const inventoryAgent = new InventoryAgent();

interface CartItem {
  inventarioId: string;
  cantidad: number;
  precioUnitario: number;
}

export interface Orden {
  id: string;
  usuario_id: string;
  detalles_items: CartItem[];
  total: number;
  estado: string;
  created_at: Date;
}

// Simula la tabla "Orden" de PostgreSQL en modo standalone
const ordenesStore: Map<string, Orden> = new Map();

export class CheckoutAgent {
  /**
   * Orquesta el proceso de checkout.
   * 1. Calcula el total.
   * 2. Cobra al usuario (simulado).
   * 3. Confirma el stock con el Agente de Inventario.
   * 4. Crea la orden en PostgreSQL (si está configurado) o en memoria.
   */
  async processCheckout(userId: string, items: CartItem[]): Promise<string> {
    let total = 0;
    for (const item of items) {
      total += item.cantidad * item.precioUnitario;
    }

    // Modo con PostgreSQL si está presente la conexión
    if (db) {
      const client = await db.connect();
      try {
        await client.query('BEGIN');
        const paymentSuccess = await this.mockPaymentGateway(userId, total);
        if (!paymentSuccess) {
          throw new Error('Fallo al procesar el pago.');
        }

        await inventoryAgent.confirmStock(
          userId,
          items.map(i => ({ inventarioId: i.inventarioId, cantidad: i.cantidad })),
          client
        );

        const res = await client.query(
          `INSERT INTO Orden (usuario_id, detalles_items, total, estado)
           VALUES ($1, $2, $3, $4) RETURNING id`,
          [userId, JSON.stringify(items), total, 'completada']
        );

        const orderId = res.rows[0].id;
        await client.query('COMMIT');
        return orderId;
      } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error en checkout (DB):', error);
        throw error;
      } finally {
        client.release();
      }
    }

    // Modo Standalone en memoria (sin servidor DB externo)
    const paymentSuccess = await this.mockPaymentGateway(userId, total);
    if (!paymentSuccess) {
      throw new Error('Fallo al procesar el pago.');
    }

    await inventoryAgent.confirmStock(
      userId,
      items.map(i => ({ inventarioId: i.inventarioId, cantidad: i.cantidad }))
    );

    const orderId = `ord-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const orden: Orden = {
      id: orderId,
      usuario_id: userId,
      detalles_items: items,
      total,
      estado: 'completada',
      created_at: new Date(),
    };

    ordenesStore.set(orderId, orden);
    console.log(`[CheckoutAgent] Orden ${orderId} creada exitosamente en modo standalone. Total: $${total}`);
    return orderId;
  }

  /**
   * Obtiene una orden por su ID.
   */
  async getOrder(orderId: string): Promise<Orden | null> {
    return ordenesStore.get(orderId) || null;
  }

  /**
   * Lista las órdenes de un usuario.
   */
  async getOrdersByUser(userId: string): Promise<Orden[]> {
    return Array.from(ordenesStore.values()).filter((o) => o.usuario_id === userId);
  }

  private async mockPaymentGateway(userId: string, amount: number): Promise<boolean> {
    console.log(`[Checkout] Procesando pago por $${amount} para usuario ${userId}`);
    return new Promise((resolve) => setTimeout(() => resolve(true), 300));
  }
}
