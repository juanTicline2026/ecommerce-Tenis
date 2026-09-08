import React from 'react';
import { ProductCard } from '../components/ProductCard';

// Dummy data for initial render
const MOCK_PRODUCTS = [
  {
    id: 'prod-1',
    marca: 'Aether',
    modelo: 'Urban X1',
    precioBase: 2500,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'prod-2',
    marca: 'Velocity',
    modelo: 'Aero-Cushion',
    precioBase: 3100,
    imageUrl: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'prod-3',
    marca: 'Nike',
    modelo: 'Air Max Pulse',
    precioBase: 2899,
    imageUrl: 'https://images.unsplash.com/photo-1552346154-21d32810baa3?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'prod-4',
    marca: 'Adidas',
    modelo: 'Ultraboost Light',
    precioBase: 3499,
    imageUrl: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&q=80&w=800'
  }
];

export const CatalogPage: React.FC = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section style={{
        backgroundColor: 'var(--bg-tertiary)',
        borderRadius: 'var(--radius-xl)',
        margin: '24px',
        padding: '64px 24px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <h1 className="text-5xl font-bold mb-4" style={{ letterSpacing: '-1px' }}>
            Domina el Asfalto.
          </h1>
          <p className="text-lg text-secondary mb-8">
            Descubre la nueva colección donde el diseño urbano se encuentra con el rendimiento profesional.
          </p>
          <button style={{
            backgroundColor: 'var(--text-primary)',
            color: 'white',
            padding: '16px 32px',
            borderRadius: 'var(--radius-xl)',
            fontWeight: 'bold',
            fontSize: '1rem',
          }} className="hover-scale">
            Explorar Colección
          </button>
        </div>
      </section>

      {/* Catalog Grid */}
      <main className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Nuevos Lanzamientos</h2>
          <select style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-secondary)',
            fontFamily: 'inherit',
            fontWeight: 500
          }}>
            <option>Ordenar por Relevancia</option>
            <option>Precio: Menor a Mayor</option>
            <option>Precio: Mayor a Menor</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_PRODUCTS.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </main>
    </div>
  );
};
