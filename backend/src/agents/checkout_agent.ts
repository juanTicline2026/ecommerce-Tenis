// backend/src/agents/checkout_agent.ts
import { InventoryAgent, db } from './inventory_agent';

const inventoryAgent = new InventoryAgent();

interface CartItem {
  inventarioId: string;
  cantidad: number;
  precioUnitario: number;
}

export class CheckoutAgent {
  /**
   * Orquesta el proceso de checkout.
   * 1. Verifica las reservas.
   * 2. Calcula el total.
   * 3. Cobra al usuario (simulado).
   * 4. Confirma el stock con el Agente de Inventario.
   * 5. Crea la orden en la BD.
   */
  async processCheckout(userId: string, items: CartItem[]): Promise<string> {
    let total = 0;
    for (const item of items) {
      total += item.cantidad * item.precioUnitario;
    }

    const client = await db.connect();
    try {
      await client.query('BEGIN');

      // Paso 1: Intentar cobrar (Llamada a Payment Gateway simulada)
      const paymentSuccess = await this.mockPaymentGateway(userId, total);
      if (!paymentSuccess) {
        throw new Error('Fallo al procesar el pago.');
      }

      // Paso 2: Confirmar inventario a través del Agente de Inventario
      // Esto consume las reservas
      await inventoryAgent.confirmStock(userId, items.map(i => ({
        inventarioId: i.inventarioId,
        cantidad: i.cantidad
      })), client);

      // Paso 3: Crear el registro de la orden
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
      console.error('Error en checkout:', error);
      
      // Intentar liberar el stock en caso de fallo crítico si no se ha consumido,
      // aunque el TTL de Redis también actuará como fallback.
      throw error;
    } finally {
      client.release();
    }
  }

  private async mockPaymentGateway(userId: string, amount: number): Promise<boolean> {
    // Simula procesamiento de pago (ej. Stripe, PayPal)
    console.log(`Procesando pago por $${amount} para usuario ${userId}`);
    return new Promise((resolve) => setTimeout(() => resolve(true), 1000));
  }
}
