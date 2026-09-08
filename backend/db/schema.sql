-- backend/db/schema.sql

-- Tabla de Productos
CREATE TABLE Producto (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    marca VARCHAR(100) NOT NULL,
    modelo VARCHAR(150) NOT NULL,
    precio_base DECIMAL(10, 2) NOT NULL,
    descripcion TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Variantes (Colores/Modelos específicos)
CREATE TABLE Variante (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    producto_id UUID NOT NULL REFERENCES Producto(id) ON DELETE CASCADE,
    colorway VARCHAR(100) NOT NULL,
    sku_base VARCHAR(50) UNIQUE NOT NULL,
    array_imagenes TEXT[], -- URLs de las imágenes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Inventario (Tallas y stock)
CREATE TABLE Inventario (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    variante_id UUID NOT NULL REFERENCES Variante(id) ON DELETE CASCADE,
    talla NUMERIC(4, 1) NOT NULL,
    cantidad_disponible INTEGER NOT NULL DEFAULT 0,
    cantidad_reservada INTEGER NOT NULL DEFAULT 0,
    version INTEGER NOT NULL DEFAULT 1, -- Para control de concurrencia optimista
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    -- Restricción crítica: Prevenir inventario negativo
    CONSTRAINT chk_stock_positivo CHECK (cantidad_disponible >= 0),
    CONSTRAINT chk_reserva_positiva CHECK (cantidad_reservada >= 0)
);

-- Tabla de Órdenes
CREATE TABLE Orden (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL,
    detalles_items JSONB NOT NULL, -- Array de items con variante_id, talla, cantidad, precio
    total DECIMAL(10, 2) NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente', -- pendiente, completada, fallida
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para optimizar consultas de alta concurrencia
CREATE INDEX idx_variante_producto ON Variante(producto_id);
CREATE INDEX idx_inventario_variante_talla ON Inventario(variante_id, talla);
CREATE INDEX idx_orden_usuario ON Orden(usuario_id);
CREATE INDEX idx_orden_estado ON Orden(estado);

-- Función para actualizar el updated_at automáticamente
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_producto_modtime BEFORE UPDATE ON Producto FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_variante_modtime BEFORE UPDATE ON Variante FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_inventario_modtime BEFORE UPDATE ON Inventario FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_orden_modtime BEFORE UPDATE ON Orden FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
