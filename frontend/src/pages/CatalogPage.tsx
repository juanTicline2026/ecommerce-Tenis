import React from 'react';
import { ProductCard } from '../components/ProductCard';
import { ProductCarousel } from '../components/ProductCarousel';
import type { CarouselProduct } from '../components/ProductCarousel';
import { ShoeCarousel } from '@/components/ShoeCarousel';
import { HeroVideoBackground } from '@/components/HeroVideoBackground';

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
    marca: 'UNDERGOLD',
    modelo: 'SNEAKERS',
    subtitulo: 'Crimson Oxide',
    precioOriginal: 749950,
    precioActual: 524965,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
    badge: 'OFERTA - MEDELLÍN DROP',
    badgeStyle: 'dark',
  },
  {
    id: 'prod-c2',
    marca: 'UG TRAILER',
    modelo: '"04"',
    subtitulo: 'High-Top - Black',
    precioActual: 319950,
    imageUrl: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'prod-c3',
    marca: 'UG SHADOW',
    modelo: 'TECH',
    subtitulo: 'Runner - Gris',
    precioOriginal: 139950,
    precioActual: 89568,
    imageUrl: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&q=80&w=800',
    badge: 'MDE ORIGINAL',
    badgeStyle: 'gold',
  },
  {
    id: 'prod-c4',
    marca: 'UG',
    modelo: 'FREESTYLE',
    subtitulo: 'Sneaker - Blanco',
    precioActual: 139950,
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800',
    badge: 'MDE ORIGINAL',
    badgeStyle: 'light',
  },
  {
    id: 'prod-c5',
    marca: 'UG',
    modelo: 'OFF-ROAD',
    subtitulo: 'Low - Multicolor',
    precioActual: 139950,
    imageUrl: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'prod-c6',
    marca: 'NIKE',
    modelo: 'AIR ZOOM PEGASUS 40',
    subtitulo: 'Street Runner - Azul',
    precioOriginal: 689900,
    precioActual: 499900,
    imageUrl: 'https://images.unsplash.com/photo-1552346154-21d32810baa3?auto=format&fit=crop&q=80&w=800',
    badge: 'MDE ORIGINAL',
    badgeStyle: 'gold',
  }
];

export const CatalogPage: React.FC = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section — Dark Asphalt & Clear Video */}
      <section style={{
        background: 'linear-gradient(180deg, rgba(10, 12, 16, 0.35) 0%, rgba(12, 14, 18, 0.2) 50%, rgba(8, 9, 12, 0.65) 100%)',
        borderRadius: 'var(--radius-xl)',
        margin: '24px',
        padding: '80px 24px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}>
        <HeroVideoBackground src="/hero-video.mp4" />

        {/* Subtle warm-silver ambient highlight (no purple) */}
        <div style={{
          position: 'absolute',
          top: '-35%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '520px',
          height: '420px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <h1 className="text-5xl font-bold mb-4" style={{ 
            letterSpacing: '-1px',
            background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 65%, #94a3b8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 4px 16px rgba(0, 0, 0, 0.75))',
          }}>
            Domina el Asfalto.
          </h1>
          <p className="text-lg mb-8" style={{ color: 'rgba(255, 255, 255, 0.92)', textShadow: '0 2px 10px rgba(0,0,0,0.8)', fontWeight: 500 }}>
            Descubre la nueva colección donde el diseño urbano se encuentra con el rendimiento profesional.
          </p>
          <button style={{
            background: 'linear-gradient(135deg, #1e232d 0%, #0f1218 100%)',
            color: '#f8fafc',
            padding: '16px 34px',
            borderRadius: 'var(--radius-xl)',
            fontWeight: '800',
            fontSize: '1rem',
            border: '1px solid rgba(255, 255, 255, 0.22)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.18)',
            transition: 'all var(--transition-normal)',
          }} className="hover-scale">
            Explorar Colección
          </button>
        </div>

        {/* Animated sneaker carousel */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          <ShoeCarousel />
        </div>
      </section>

      {/* Full-width Medellín Street Culture Section */}
      <ProductCarousel
        title="SELECCIONADOS PARA TI // MEDELLÍN STREET CULTURE"
        products={CAROUSEL_PRODUCTS}
      />

      {/* Catalog Grid */}
      <main
        style={{
          background: 'linear-gradient(180deg, #090a0d 0%, #101217 50%, #07080a 100%)',
          paddingTop: '16px',
        }}
      >
        <div className="container py-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold" style={{
              background: 'linear-gradient(90deg, var(--text-primary) 0%, var(--text-secondary) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Nuevos Lanzamientos</h2>
            <select style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-secondary)',
              fontFamily: 'inherit',
              fontWeight: 500,
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
