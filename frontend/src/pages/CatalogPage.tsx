import React from 'react';
import { ProductCard } from '../components/ProductCard';
import { ProductCarousel } from '../components/ProductCarousel';
import type { CarouselProduct } from '../components/ProductCarousel';

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

const CAROUSEL_PRODUCTS: CarouselProduct[] = [
  {
    id: 'prod-c1',
    marca: 'ASICS',
    modelo: 'Novablast 5 Tr',
    subtitulo: 'Masculino - Verde',
    precioOriginal: 749950,
    precioActual: 524965,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
    badge: 'Oferta'
  },
  {
    id: 'prod-c2',
    marca: 'ASICS',
    modelo: 'Metarun Split Short',
    subtitulo: 'Masculino - Negro',
    precioActual: 319950,
    imageUrl: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'prod-c3',
    marca: 'ASICS',
    modelo: 'SILVER SS TOP',
    subtitulo: 'Masculino - Gris',
    precioOriginal: 139950,
    precioActual: 89568,
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800',
    badge: 'Popular'
  },
  {
    id: 'prod-c4',
    marca: 'ASICS',
    modelo: 'PERFORMANCE RUNNING CAP',
    subtitulo: 'Unisex - Negro',
    precioActual: 139950,
    imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'prod-c5',
    marca: 'ASICS',
    modelo: 'Wrist Band Long',
    subtitulo: 'Unisex - Blanco',
    precioOriginal: 49950,
    precioActual: 27600,
    imageUrl: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'prod-c6',
    marca: 'Nike',
    modelo: 'Air Zoom Pegasus 40',
    subtitulo: 'Masculino - Azul',
    precioOriginal: 689900,
    precioActual: 499900,
    imageUrl: 'https://images.unsplash.com/photo-1552346154-21d32810baa3?auto=format&fit=crop&q=80&w=800',
    badge: 'Nuevo'
  }
];

export const CatalogPage: React.FC = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section style={{
        backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.4) 0%, rgba(10, 10, 15, 0.8) 100%), url('/hero_banner.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: 'var(--radius-xl)',
        margin: '24px',
        padding: '80px 24px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        color: '#ffffff'
      }}>
        <div style={{ maxWidth: '650px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <h1 className="text-5xl font-bold mb-4" style={{ letterSpacing: '-1px', textShadow: '0 4px 12px rgba(0,0,0,0.6)', color: '#ffffff' }}>
            Domina el Asfalto.
          </h1>
          <p className="text-lg mb-8" style={{ color: 'rgba(255, 255, 255, 0.9)', textShadow: '0 2px 8px rgba(0,0,0,0.6)', fontWeight: 500 }}>
            Descubre la nueva colección donde el diseño urbano se encuentra con el rendimiento profesional.
          </p>
          <button style={{
            backgroundColor: '#ffffff',
            color: '#000000',
            padding: '16px 36px',
            borderRadius: 'var(--radius-xl)',
            fontWeight: '800',
            fontSize: '1rem',
            boxShadow: '0 10px 25px rgba(255, 255, 255, 0.2)',
            border: 'none',
            cursor: 'pointer',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }} className="hover-scale">
            Explorar Colección
          </button>
        </div>
      </section>

      {/* Horizontal Cards Carousel Section: "Seleccionados para ti" */}
      <main className="container">
        <ProductCarousel title="Seleccionados para ti" products={CAROUSEL_PRODUCTS} />

        {/* Catalog Grid */}
        <div className="py-8">
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
        </div>
      </main>
    </div>
  );
};
