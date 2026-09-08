# Tenis-Arios E-Commerce Platform

Plataforma profesional e-commerce multimodelo y multiagente para la venta y gestión de inventario de tenis y calzado.

## Arquitectura de Carpetas y Organización del Proyecto

El repositorio está estructurado bajo las mejores prácticas de la industria en desarrollo de software, separando responsabilidades en **Frontend**, **Backend**, **Imágenes/Media** e **Infraestructura**:

```text
Tenis-Arios/
├── backend/                  # Código del servidor, servicios y persistencia
│   ├── src/                  # Código fuente TypeScript
│   │   ├── agents/           # Agentes inteligentes (InventoryAgent, CheckoutAgent)
│   │   └── index.ts          # Punto de entrada principal
│   ├── db/                   # Scripts DDL y esquemas relacionales (schema.sql)
│   ├── api/                  # Contratos de API OpenAPI v3 (openapi.yaml)
│   ├── package.json          # Dependencias y scripts de Backend
│   └── tsconfig.json         # Configuración de compilación TS para Node.js
├── frontend/                 # Aplicación cliente web (React + Vite + TypeScript)
│   ├── public/               # Recursos estáticos servidos públicamente
│   ├── src/                  # Componentes UI, páginas, tipos y estilos CSS
│   ├── package.json          # Dependencias del Frontend
│   └── tsconfig.json
├── imagenes/                 # Repositorio multimedia y catálogo de imágenes
│   ├── productos/            # Fotografías y renders de tenis por variante/colorway
│   ├── marca/                # Logotipos, marcas e imagotipos del e-commerce
│   └── README.md             # Guía de estándares de formato y naming
└── deploy/                   # Infraestructura y orquestación
    └── antigravity.yaml      # Manifiesto Docker Compose para PostgreSQL, Redis y Servicios
```

## Guía de Inicio Rápido

### 1. Backend
```bash
cd backend
npm install
npm run build
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3. Orquestación con Docker (Infraestructura)
```bash
docker-compose -f deploy/antigravity.yaml up -d
```
