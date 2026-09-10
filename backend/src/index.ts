// backend/src/index.ts
import express from 'express';
import { InventoryAgent, db, redis } from './agents/inventory_agent';
import { CheckoutAgent } from './agents/checkout_agent';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// CORS habilitado para peticiones locales del frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

const inventoryAgent = new InventoryAgent();
const checkoutAgent = new CheckoutAgent();

// 1. Endpoint: Estado del Backend y Salud
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Tenis-Arios Backend',
    mode: db && redis ? 'DB/Redis Connected' : 'Standalone / Autónomo (In-Memory)',
    timestamp: new Date().toISOString()
  });
});

// 2. Endpoint OpenAPI: GET /api/tenis (Catálogo general)
app.get('/api/tenis', async (req, res) => {
  try {
    const marca = req.query.marca as string | undefined;
    const limit = parseInt(req.query.limit as string || '20', 10);
    const offset = parseInt(req.query.offset as string || '0', 10);

    const catalog = await inventoryAgent.getCatalog(marca, limit, offset);
    res.json(catalog);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Error al obtener catálogo' });
  }
});

// 3. Endpoint OpenAPI: GET /api/tenis/:id (Detalle de producto)
app.get('/api/tenis/:id', async (req, res) => {
  try {
    const product = await inventoryAgent.getProductDetail(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(product);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Error al obtener detalle del producto' });
  }
});

// 4. Endpoint OpenAPI: POST /api/carrito/reservar (Reservar inventario)
app.post('/api/carrito/reservar', async (req, res) => {
  try {
    const { usuarioId, inventarioId, cantidad } = req.body;
    if (!usuarioId || !inventarioId || !cantidad) {
      return res.status(400).json({ error: 'Faltan parámetros requeridos (usuarioId, inventarioId, cantidad)' });
    }

    const reserved = await inventoryAgent.reserveStock(usuarioId, inventarioId, cantidad);
    if (reserved) {
      return res.json({ message: 'Inventario reservado exitosamente', usuarioId, inventarioId, cantidad });
    } else {
      return res.status(400).json({ error: 'Stock insuficiente o inventario no disponible' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Error al reservar inventario' });
  }
});

// 5. Endpoint OpenAPI: POST /api/checkout (Procesar checkout)
app.post('/api/checkout', async (req, res) => {
  try {
    const { usuarioId, items } = req.body;
    if (!usuarioId || !items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Faltan parámetros requeridos (usuarioId, items[])' });
    }

    const ordenId = await checkoutAgent.processCheckout(usuarioId, items);
    res.status(201).json({ ordenId, message: 'Orden creada exitosamente' });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Error procesando checkout' });
  }
});

// Iniciar Servidor HTTP Standalone
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` Tenis-Arios Backend iniciado de forma standalone!`);
  console.log(` Servidor escuchando en: http://localhost:${PORT}`);
  console.log(` Modo: ${db && redis ? 'Servicios Externos (DB/Redis)' : 'Autónomo (In-Memory)'}`);
  console.log(` RUTA BASE API: http://localhost:${PORT}/api/tenis`);
  console.log(`=======================================================`);
});

export * from './agents/inventory_agent';
export * from './agents/checkout_agent';
