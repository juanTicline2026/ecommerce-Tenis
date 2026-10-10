// backend/src/agents/checkout_agent.ts
import { InventoryAgent } from './inventory_agent';

const inventoryAgent = new InventoryAgent();

interface CartItem {
  inventarioId: string;
  cantidad: number;
  precioUnitario: number;
}

interface Orden {
  id: string;
  usuario_id: string;
  detalles_items: CartItem[];
  total: number;
  estado: string;
  created_at: Date;
}

// Simula la tabla "Orden" de PostgreSQL
const ordenesStore: Map<string, Orden> = new Map();
let ordenCounter = 0;

function generateOrderId(): string {
  ordenCounter++;
  return `orden-${Date.now()}-${ordenCounter}`;
}

export class CheckoutAgent {
  /**
   * Orquesta el proceso de checkout.
   * 1. Calcula el total.
   * 2. Cobra al usuario (simulado).
   * 3. Confirma el stock con el Agente de Inventario.
   * 4. Crea la orden en memoria.
   *
   * TODO [PRODUCCIÓN]: Envolver todo en una transacción de PostgreSQL
   * usando db.connect() + BEGIN/COMMIT/ROLLBACK.
   */
  async processCheckout(userId: string, items: CartItem[]): Promise<string> {
    let total = 0;
    for (const item of items) {
      total += item.cantidad * item.precioUnitario;
    }

    try {
      // Paso 1: Intentar cobrar (Llamada a Payment Gateway simulada)
      const paymentSuccess = await this.mockPaymentGateway(userId, total);
      if (!paymentSuccess) {
        throw new Error('Fallo al procesar el pago.');
      }

      // Paso 2: Confirmar inventario a través del Agente de Inventario
      // Esto consume las reservas
      await inventoryAgent.confirmStock(
        userId,
        items.map((i) => ({
          inventarioId: i.inventarioId,
          cantidad: i.cantidad,
        }))
      );

      // Paso 3: Crear el registro de la orden (en memoria por ahora)
      const orderId = generateOrderId();
      const orden: Orden = {
        id: orderId,
        usuario_id: userId,
        detalles_items: items,
        total,
        estado: 'completada',
        created_at: new Date(),
      };

      ordenesStore.set(orderId, orden);
      console.log(`[Checkout] Orden ${orderId} creada exitosamente. Total: $${total}`);

      return orderId;
    } catch (error) {
      console.error('[Checkout] Error en checkout:', error);
      throw error;
    }
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
    // Simula procesamiento de pago (ej. Stripe, PayPal)
    console.log(`[Checkout] Procesando pago por $${amount} para usuario ${userId}`);
    return new Promise((resolve) => setTimeout(() => resolve(true), 500));
  }
}
