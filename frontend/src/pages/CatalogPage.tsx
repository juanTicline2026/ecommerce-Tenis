import React from 'react';
import { ImagePlus } from 'lucide-react';
import { ShoeCarousel } from '@/components/ShoeCarousel';
import { HeroVideoBackground } from '@/components/HeroVideoBackground';

// 10 empty card slots for products
const EMPTY_SLOTS = Array.from({ length: 10 }, (_, i) => ({
  id: `slot-${i + 1}`,
  number: i + 1,
}));

export const CatalogPage: React.FC = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section - Text only, no large images */}
      <section style={{
        background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.08) 0%, rgba(10, 10, 15, 0.6) 50%, rgba(59, 130, 246, 0.06) 100%)',
        borderRadius: 'var(--radius-xl)',
        margin: '24px',
        padding: '80px 24px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid var(--border-color)',
      }}>
        <HeroVideoBackground src="/hero-video.mp4" />

        {/* Decorative glow orb */}
        <div style={{
          position: 'absolute',
          top: '-40%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <h1 className="text-5xl font-bold mb-4" style={{ 
            letterSpacing: '-1px',
            background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--accent-primary) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Domina el Asfalto.
          </h1>
          <p className="text-lg text-secondary mb-8">
            Descubre la nueva colección donde el diseño urbano se encuentra con el rendimiento profesional.
          </p>
          <button style={{
            background: 'linear-gradient(135deg, var(--accent-primary) 0%, #6d28d9 100%)',
            color: 'white',
            padding: '16px 32px',
            borderRadius: 'var(--radius-xl)',
            fontWeight: 'bold',
            fontSize: '1rem',
            boxShadow: '0 4px 20px rgba(124, 58, 237, 0.3)',
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

      {/* Catalog Grid — 10 Empty Cards */}
      <main className="container py-8">
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {EMPTY_SLOTS.map((slot) => (
            <div key={slot.id} className="empty-card" style={{
              animationDelay: `${slot.number * 0.2}s`,
            }}>
              {/* Image placeholder */}
              <div className="image-placeholder">
                <ImagePlus size={32} strokeWidth={1.5} />
              </div>

              {/* Skeleton content */}
              <div className="card-body">
                <div className="skeleton-line short mb-2" />
                <div className="skeleton-line medium mb-4" />
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '12px',
                }}>
                  <div className="skeleton-line" style={{ width: '30%', height: '10px' }} />
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    border: '1px dashed rgba(124, 58, 237, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <span style={{ color: 'var(--text-tertiary)', fontSize: '10px' }}>+</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
