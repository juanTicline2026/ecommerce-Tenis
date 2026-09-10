// backend/src/agents/checkout_agent.ts
import { InventoryAgent, db } from './inventory_agent';

const inventoryAgent = new InventoryAgent();

interface CartItem {
  inventarioId: string;
  cantidad: number;
  precioUnitario: number;
}

const inMemoryOrders: Array<{ id: string; usuarioId: string; items: CartItem[]; total: number; estado: string; createdAt: Date }> = [];

export class CheckoutAgent {
  /**
   * Orquesta el proceso de checkout.
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
    inMemoryOrders.push({
      id: orderId,
      usuarioId: userId,
      items,
      total,
      estado: 'completada',
      createdAt: new Date()
    });

    console.log(`[CheckoutAgent] Orden ${orderId} creada exitosamente en modo standalone.`);
    return orderId;
  }

  private async mockPaymentGateway(userId: string, amount: number): Promise<boolean> {
    console.log(`Procesando pago por $${amount} para usuario ${userId}`);
    return new Promise(resolve => setTimeout(() => resolve(true), 300));
  }
}
