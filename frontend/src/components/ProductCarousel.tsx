import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export type CarouselProduct = {
  id: string;
  marca: string;
  modelo: string;
  subtitulo?: string;
  precioOriginal?: number;
  precioActual: number;
  imageUrl: string;
  badge?: string;
};

interface ProductCarouselProps {
  title?: string;
  products: CarouselProduct[];
}

export const ProductCarousel: React.FC<ProductCarouselProps> = ({
  title = "Seleccionados para ti",
  products
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollPosition();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      window.addEventListener('resize', checkScrollPosition);
    }
    return () => {
      if (container) container.removeEventListener('scroll', checkScrollPosition);
      window.removeEventListener('resize', checkScrollPosition);
    };
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-8" style={{ position: 'relative', width: '100%' }}>
      {/* Title */}
      <h2 
        className="text-2xl font-bold text-center mb-6" 
        style={{ color: '#1e293b', fontSize: '1.75rem', letterSpacing: '-0.5px' }}
      >
        {title}
      </h2>

      {/* Carousel Container Wrapper */}
      <div style={{ position: 'relative', margin: '0 -12px' }}>
        
        {/* Left Arrow Button */}
        {canScrollLeft && (
          <button
            onClick={() => handleScroll('left')}
            aria-label="Desplazar a la izquierda"
            style={{
              position: 'absolute',
              left: '8px',
              top: '40%',
              transform: 'translateY(-50%)',
              zIndex: 20,
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              color: '#1e293b'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            }}
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {/* Right Arrow Button */}
        {canScrollRight && (
          <button
            onClick={() => handleScroll('right')}
            aria-label="Desplazar a la derecha"
            style={{
              position: 'absolute',
              right: '8px',
              top: '40%',
              transform: 'translateY(-50%)',
              zIndex: 20,
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              color: '#1e293b'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            }}
          >
            <ChevronRight size={24} />
          </button>
        )}

        {/* Horizontal Scrolling Track */}
        <div
          ref={scrollContainerRef}
          className="no-scrollbar"
          style={{
            display: 'flex',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            scrollBehavior: 'smooth',
            padding: '12px 24px',
            gap: '16px'
          }}
        >
          {products.map((prod) => (
            <div
              key={prod.id}
              style={{
                flex: '0 0 250px',
                scrollSnapAlign: 'start',
                borderRadius: '12px',
                overflow: 'hidden',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
              }}
              className="hover-scale"
            >
              <div style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* Image Container with light grey background */}
                <div style={{
                  backgroundColor: '#f5f5f7',
                  aspectRatio: '1/1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '12px',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <img
                    src={prod.imageUrl}
                    alt={prod.modelo}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      transition: 'transform 0.3s ease'
                    }}
                  />
                  {prod.badge && (
                    <span style={{
                      position: 'absolute',
                      top: '8px',
                      left: '8px',
                      backgroundColor: '#2563eb',
                      color: '#ffffff',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      textTransform: 'uppercase'
                    }}>
                      {prod.badge}
                    </span>
                  )}
                </div>

                {/* Content Box */}
                <div style={{ padding: '12px 14px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{
                      fontSize: '0.925rem',
                      fontWeight: 600,
                      color: '#1e293b',
                      lineHeight: '1.3',
                      marginBottom: '6px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {prod.marca} {prod.modelo}
                      {prod.subtitulo && ` - ${prod.subtitulo}`}
                    </h3>
                  </div>

                  {/* Price Row */}
                  <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    {prod.precioOriginal && (
                      <span style={{
                        fontSize: '0.825rem',
                        color: '#94a3b8',
                        textDecoration: 'line-through',
                        fontWeight: 500
                      }}>
                        ${prod.precioOriginal.toLocaleString()}
                      </span>
                    )}
                    {prod.precioOriginal && <span style={{ color: '#cbd5e1', fontSize: '0.8rem' }}>|</span>}
                    <span style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: '#0f172a'
                    }}>
                      ${prod.precioActual.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
