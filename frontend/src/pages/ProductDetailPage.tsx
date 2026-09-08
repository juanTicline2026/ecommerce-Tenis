import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { ArrowLeft } from 'lucide-react';

// Mock product detail
const MOCK_DETAIL = {
  id: 'prod-1',
  marca: 'Aether',
  modelo: 'Urban X1',
  descripcion: 'Zapatilla diseñada para el profesional moderno. Combina la estética urbana con la máxima comodidad y soporte necesario para el día a día.',
  precioBase: 2500,
  variantes: [
    {
      id: 'var-1', colorway: 'Off-White / Electric Blue',
      tallas: [
        { talla: 25, disponible: true },
        { talla: 26, disponible: true },
        { talla: 27, disponible: false },
        { talla: 28, disponible: true },
      ]
    },
    {
      id: 'var-2', colorway: 'Charcoal / Neon Green',
      tallas: [
        { talla: 26, disponible: true },
        { talla: 27, disponible: true },
      ]
    }
  ],
  imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1200'
};

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedVariant, setSelectedVariant] = useState(MOCK_DETAIL.variantes[0]);
  const [selectedTalla, setSelectedTalla] = useState<number | null>(null);

  // Here we would normally fetch the product data based on `id`
  console.log("Fetching product with id:", id);
  const product = MOCK_DETAIL;

  return (
    <div className="container py-8 animate-fade-in">
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '24px', fontWeight: 500 }} className="hover:text-primary">
        <ArrowLeft size={20} /> Volver al catálogo
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          border: '1px solid var(--border-color)',
          aspectRatio: '1/1',
          position: 'relative'
        }}>
          <img 
            src={product.imageUrl} 
            alt={product.modelo}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <p className="text-base font-bold text-secondary uppercase tracking-wider mb-2">
            {product.marca}
          </p>
          <h1 className="text-4xl font-bold mb-4">{product.modelo}</h1>
          <p className="text-2xl font-bold text-accent mb-6">
            ${product.precioBase.toLocaleString()}
          </p>
          
          <p className="text-lg text-secondary mb-8">
            {product.descripcion}
          </p>

          <div className="mb-6">
            <h3 className="font-semibold mb-3">Color</h3>
            <div className="flex gap-4">
              {product.variantes.map(v => (
                <button 
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: selectedVariant.id === v.id ? '2px solid var(--text-primary)' : '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-secondary)',
                    fontWeight: selectedVariant.id === v.id ? 600 : 400
                  }}
                  className="hover-scale"
                >
                  {v.colorway}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-semibold mb-3">Talla (CM)</h3>
            <div className="grid grid-cols-4 gap-2">
              {selectedVariant.tallas.map(t => (
                <button
                  key={t.talla}
                  disabled={!t.disponible}
                  onClick={() => setSelectedTalla(t.talla)}
                  style={{
                    padding: '12px 0',
                    borderRadius: 'var(--radius-md)',
                    border: selectedTalla === t.talla ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                    backgroundColor: t.disponible ? (selectedTalla === t.talla ? 'var(--bg-secondary)' : 'var(--bg-secondary)') : 'var(--bg-tertiary)',
                    color: t.disponible ? (selectedTalla === t.talla ? 'var(--accent-primary)' : 'var(--text-primary)') : 'var(--text-tertiary)',
                    opacity: t.disponible ? 1 : 0.5,
                    cursor: t.disponible ? 'pointer' : 'not-allowed',
                    fontWeight: 600
                  }}
                >
                  {t.talla}
                </button>
              ))}
            </div>
          </div>

          <Button 
            variant="primary" 
            fullWidth 
            disabled={!selectedTalla}
            style={{ padding: '16px', fontSize: '1.125rem', opacity: !selectedTalla ? 0.5 : 1 }}
          >
            {selectedTalla ? 'Añadir al Carrito' : 'Selecciona una talla'}
          </Button>
          
          <p className="text-sm text-secondary mt-4 text-center">
            Envío y devoluciones gratuitas para miembros.
          </p>
        </div>
      </div>
    </div>
  );
};
