import React, { useRef, useState, useEffect } from 'react';

export type CarouselProduct = {
  id: string;
  marca: string;
  modelo: string;
  subtitulo?: string;
  precioOriginal?: number;
  precioActual: number;
  imageUrl: string;
  badge?: string;
  badgeStyle?: 'dark' | 'gold' | 'light';
};

interface ProductCarouselProps {
  title?: string;
  products: CarouselProduct[];
}

export const ProductCarousel: React.FC<ProductCarouselProps> = ({
  title = 'SELECCIONADOS PARA TI // MEDELLÍN STREET CULTURE',
  products,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    sectionRef.current.style.setProperty('--spot-x', `${x.toFixed(1)}%`);
    sectionRef.current.style.setProperty('--spot-y', `${y.toFixed(1)}%`);
  };

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
  }, [products]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 290;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const getBadgeStyles = (prod: CarouselProduct, index: number): React.CSSProperties => {
    const variant = prod.badgeStyle || (index === 0 ? 'dark' : index % 2 === 0 ? 'gold' : 'light');
    if (variant === 'gold') {
      return {
        background: 'linear-gradient(135deg, #e09f3e 0%, #c87d20 100%)',
        color: '#14110c',
        border: '1px solid rgba(255, 224, 150, 0.5)',
        transform: 'translateX(-50%) rotate(-2deg)',
      };
    }
    if (variant === 'light') {
      return {
        background: 'linear-gradient(135deg, #e7e5df 0%, #cfc9bc 100%)',
        color: '#18181b',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        transform: 'translateX(-50%) rotate(-1.5deg)',
      };
    }
    return {
      background: 'linear-gradient(135deg, #232220 0%, #151413 100%)',
      color: '#e5c07b',
      border: '1px solid rgba(212, 168, 83, 0.55)',
      transform: 'translateX(-50%) rotate(-3deg)',
    };
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      style={{
        position: 'relative',
        width: '100%',
        background: 'linear-gradient(180deg, #06070a 0%, #0e1015 38%, #13161c 68%, #07080b 100%)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        overflow: 'hidden',
        paddingBottom: '56px',
        boxShadow: 'inset 0 0 90px rgba(0, 0, 0, 0.9)',
      }}
    >
      {/* Top & Bottom Animated Metallic Rim-Light Beams */}
      <div className="mde-rim-beam" style={{ top: 0 }} />
      <div className="mde-rim-beam" style={{ bottom: 0, animationDelay: '-4.5s' }} />

      {/* Studio Obsidian Volumetric Backlight + Passing Night Streetlights + Interactive Spotlight */}
      <div className="mde-aurora-mesh" />
      <div className="mde-street-lamp-sweep" />
      <div className="mde-grid-shimmer" />
      <div className="mde-studio-backdrop" />

      {/* Concrete / Asphalt noise & subtle grunge radial texture */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage: `
            radial-gradient(circle at 18% 35%, rgba(251, 191, 36, 0.09) 0%, transparent 48%),
            radial-gradient(circle at 82% 65%, rgba(226, 232, 240, 0.06) 0%, transparent 52%),
            repeating-linear-gradient(90deg, rgba(255,255,255,0.014) 0px, rgba(255,255,255,0.014) 1px, transparent 1px, transparent 6px)
          `,
          zIndex: 1,
        }}
      />

      {/* Top Medellín Animated Night Passage Skyline + Illuminated Metrocable + Gold Mountains */}
      <div className="mde-night-sky">
        {/* Drifting Full Moon across the Medellín sky */}
        <div className="mde-moon-orb" />

        {/* Twinkling city lights in the valley */}
        <div
          className="mde-valley-lights"
          style={{
            backgroundImage: `
              radial-gradient(2px 2px at 6% 74%, rgba(251, 191, 36, 0.95), transparent),
              radial-gradient(1.5px 1.5px at 10% 78%, rgba(255, 237, 213, 0.85), transparent),
              radial-gradient(2.5px 2.5px at 15% 71%, rgba(245, 158, 11, 0.95), transparent),
              radial-gradient(1.5px 1.5px at 20% 82%, rgba(255, 255, 255, 0.85), transparent),
              radial-gradient(2px 2px at 24% 76%, rgba(251, 191, 36, 1), transparent),
              radial-gradient(1.5px 1.5px at 29% 73%, rgba(255, 255, 255, 0.8), transparent),
              radial-gradient(2.5px 2.5px at 34% 77%, rgba(251, 191, 36, 0.95), transparent),
              radial-gradient(2px 2px at 39% 83%, rgba(245, 158, 11, 0.9), transparent),
              radial-gradient(1.5px 1.5px at 44% 75%, rgba(254, 215, 170, 0.9), transparent),
              radial-gradient(2px 2px at 49% 74%, rgba(254, 215, 170, 0.95), transparent),
              radial-gradient(2.5px 2.5px at 55% 78%, rgba(251, 191, 36, 0.9), transparent),
              radial-gradient(1.5px 1.5px at 61% 73%, rgba(255, 255, 255, 0.8), transparent),
              radial-gradient(2px 2px at 67% 79%, rgba(251, 191, 36, 0.9), transparent),
              radial-gradient(2px 2px at 73% 75%, rgba(245, 158, 11, 0.85), transparent),
              radial-gradient(1.5px 1.5px at 81% 78%, rgba(251, 191, 36, 0.8), transparent)
            `,
          }}
        />

        {/* SVG Illustration: Metrocable, Silhouette Hills & Gold-etched Mountain Peaks */}
        <svg
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
          style={{ width: '100%', height: '100%', display: 'block', position: 'relative', zIndex: 2 }}
        >
          {/* Distant dark mountain range */}
          <path
            d="M0,135 L120,95 L260,115 L420,82 L590,122 L760,88 L920,110 L1120,70 L1290,95 L1440,80 L1440,200 L0,200 Z"
            fill="#0d1526"
            opacity="0.88"
          />

          {/* Illuminated warm city glow on mountain slopes */}
          <ellipse cx="240" cy="142" rx="235" ry="34" fill="rgba(245, 158, 11, 0.24)" />
          <ellipse cx="540" cy="148" rx="210" ry="28" fill="rgba(251, 191, 36, 0.18)" />
          <ellipse cx="820" cy="155" rx="180" ry="22" fill="rgba(245, 158, 11, 0.12)" />

          {/* Metrocable Cables */}
          <line x1="0" y1="92" x2="760" y2="18" stroke="#05070b" strokeWidth="2.2" />
          <line x1="0" y1="108" x2="760" y2="32" stroke="#05070b" strokeWidth="1.4" opacity="0.85" />

          {/* Metrocable Support Towers with warning beacon lights */}
          <g stroke="#05070b" strokeWidth="3.5" fill="none">
            <line x1="295" y1="58" x2="295" y2="165" />
            <line x1="278" y1="62" x2="312" y2="56" strokeWidth="3" />
            <circle cx="295" cy="55" r="2.5" fill="#fbbf24" stroke="none" />
            <line x1="500" y1="38" x2="500" y2="165" />
            <line x1="485" y1="42" x2="515" y2="36" strokeWidth="3" />
            <circle cx="500" cy="35" r="2.5" fill="#fbbf24" stroke="none" />
          </g>

          {/* Moving & Illuminated Metrocable Gondola Cabins */}
          {/* Cabin 1 (climbing) */}
          <g className="mde-cable-up">
            <g transform="translate(135, 76)">
              <line x1="10" y1="0" x2="10" y2="14" stroke="#05070b" strokeWidth="2" />
              <rect x="0" y="14" width="22" height="18" rx="3" fill="#0b0f17" stroke="#475569" strokeWidth="1.2" />
              <rect x="3" y="17" width="7" height="7" rx="1" fill="#fde68a" opacity="0.9" />
              <rect x="12" y="17" width="7" height="7" rx="1" fill="#fde68a" opacity="0.9" />
            </g>
          </g>
          {/* Cabin 2 (climbing) */}
          <g className="mde-cable-up">
            <g transform="translate(345, 55)">
              <line x1="9" y1="0" x2="9" y2="12" stroke="#05070b" strokeWidth="2" />
              <rect x="0" y="12" width="20" height="16" rx="3" fill="#0b0f17" stroke="#475569" strokeWidth="1.2" />
              <rect x="3" y="15" width="6" height="6" rx="1" fill="#fde68a" opacity="0.88" />
              <rect x="11" y="15" width="6" height="6" rx="1" fill="#fde68a" opacity="0.88" />
            </g>
          </g>
          {/* Cabin 3 (descending on lower cable) */}
          <g className="mde-cable-down">
            <g transform="translate(455, 58)">
              <line x1="8" y1="0" x2="8" y2="11" stroke="#05070b" strokeWidth="1.8" />
              <rect x="0" y="11" width="18" height="15" rx="2.5" fill="#0b0f17" stroke="#475569" strokeWidth="1" />
              <rect x="3" y="14" width="5" height="5" rx="1" fill="#fbbf24" opacity="0.85" />
              <rect x="10" y="14" width="5" height="5" rx="1" fill="#fbbf24" opacity="0.85" />
            </g>
          </g>
          {/* Cabin 4 (climbing high) */}
          <g className="mde-cable-up">
            <g transform="translate(585, 31)">
              <line x1="8" y1="0" x2="8" y2="10" stroke="#05070b" strokeWidth="1.8" />
              <rect x="0" y="10" width="17" height="14" rx="2.5" fill="#0b0f17" stroke="#475569" strokeWidth="1" />
              <rect x="3" y="13" width="5" height="5" rx="1" fill="#fde68a" opacity="0.9" />
              <rect x="9" y="13" width="5" height="5" rx="1" fill="#fde68a" opacity="0.9" />
            </g>
          </g>

          {/* Right-side Hand-drawn Gold/Ochre Mountain Peaks (Medellín Eastern Hills) */}
          <g stroke="#e0b268" strokeWidth="1.5" fill="#14171f">
            <polygon points="730,175 835,96 930,175" />
            <polygon points="865,175 985,68 1105,175" />
            <polygon points="1030,175 1145,58 1265,175" />
            <polygon points="1185,175 1295,88 1405,175" />
          </g>
          {/* Gold contour ridges inside the right mountains */}
          <g stroke="#e0b268" strokeWidth="1.1" fill="none" opacity="0.75">
            <polyline points="835,96 855,135 825,170" />
            <polyline points="985,68 1005,118 975,168" />
            <polyline points="985,68 950,125 915,165" />
            <polyline points="1145,58 1168,112 1140,168" />
            <polyline points="1145,58 1110,115 1085,165" />
            <polyline points="1295,88 1315,132 1290,170" />
          </g>

          {/* Torn / Jagged Dark Asphalt Foreground Transition */}
          <path
            d="M0,145 L95,125 L195,152 L340,140 L480,165 L680,158 L890,168 L1120,162 L1310,172 L1440,155 L1440,205 L0,205 Z"
            fill="#0d0f13"
          />
        </svg>
      </div>

      {/* Graffiti / Street Watermarks */}
      {/* Top-Left Glowing Orange "MEDALLO" */}
      <div
        className="medallo-neon-tag"
        style={{
          position: 'absolute',
          top: '148px',
          left: '3.5%',
          transform: 'rotate(-8deg)',
          fontFamily: "'Permanent Marker', 'Outfit', cursive",
          fontSize: 'clamp(1.5rem, 2.6vw, 2.35rem)',
          letterSpacing: '2px',
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 4,
        }}
      >
        MEDALLO
        <div className="medallo-neon-underline" />
      </div>

      {/* Top-Right "UNDERGOLD / MDE 05" */}
      <div
        style={{
          position: 'absolute',
          top: '118px',
          right: '2.5%',
          textAlign: 'right',
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 3,
          color: 'rgba(226, 232, 240, 0.35)',
        }}
      >
        <div
          style={{
            fontFamily: "'Permanent Marker', 'Outfit', cursive",
            fontSize: 'clamp(1.35rem, 2.4vw, 2.1rem)',
            letterSpacing: '2px',
            transform: 'rotate(3deg)',
          }}
        >
          UNDERGOLD
        </div>
        <div
          style={{
            fontFamily: "'Bebas Neue', 'Outfit', sans-serif",
            fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
            lineHeight: 0.9,
            letterSpacing: '3px',
            color: 'rgba(226, 232, 240, 0.25)',
            transform: 'rotate(6deg)',
            marginTop: '4px',
          }}
        >
          MDE
          <br />
          <span style={{ fontSize: '1.35em', WebkitTextStroke: '1px rgba(226,232,240,0.35)', color: 'transparent' }}>
            05
          </span>
        </div>
      </div>

      {/* Main Content Container */}
      <div
        style={{
          position: 'relative',
          zIndex: 5,
          maxWidth: '1380px',
          margin: '0 auto',
          padding: '8px 48px 16px',
        }}
      >
        {/* Condensed Bold Uppercase Header */}
        <h2
          style={{
            fontFamily: "'Bebas Neue', 'Outfit', sans-serif",
            fontSize: 'clamp(1.75rem, 3.2vw, 2.65rem)',
            fontWeight: 700,
            color: '#f5f2eb',
            textAlign: 'center',
            letterSpacing: '2.5px',
            textTransform: 'uppercase',
            marginBottom: '28px',
            textShadow: '0 4px 18px rgba(0, 0, 0, 0.9)',
          }}
        >
          {title}
        </h2>

        {/* Carousel Track + Metallic Industrial Arrows */}
        <div style={{ position: 'relative' }}>
          {/* Left Industrial Metal Plate Button */}
          <button
            onClick={() => handleScroll('left')}
            aria-label="Desplazar a la izquierda"
            style={{
              position: 'absolute',
              left: '-34px',
              top: '44%',
              transform: 'translateY(-50%)',
              zIndex: 20,
              width: '46px',
              height: '46px',
              borderRadius: '4px',
              background: 'linear-gradient(145deg, #78756e 0%, #4b4944 55%, #33312e 100%)',
              border: '1.5px solid #8c887f',
              boxShadow: '0 6px 16px rgba(0, 0, 0, 0.75), inset 0 1px 1px rgba(255,255,255,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: canScrollLeft ? 'pointer' : 'default',
              opacity: canScrollLeft ? 1 : 0.45,
              color: '#111111',
              fontFamily: 'monospace',
              fontSize: '1.65rem',
              fontWeight: 900,
              transition: 'transform 0.2s ease, filter 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = 'brightness(1.15)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.06)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = 'brightness(1)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            &lt;
          </button>

          {/* Right Industrial Metal Plate Button */}
          <button
            onClick={() => handleScroll('right')}
            aria-label="Desplazar a la derecha"
            style={{
              position: 'absolute',
              right: '-34px',
              top: '44%',
              transform: 'translateY(-50%)',
              zIndex: 20,
              width: '46px',
              height: '46px',
              borderRadius: '4px',
              background: 'linear-gradient(145deg, #78756e 0%, #4b4944 55%, #33312e 100%)',
              border: '1.5px solid #8c887f',
              boxShadow: '0 6px 16px rgba(0, 0, 0, 0.75), inset 0 1px 1px rgba(255,255,255,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: canScrollRight ? 'pointer' : 'default',
              opacity: canScrollRight ? 1 : 0.45,
              color: '#111111',
              fontFamily: 'monospace',
              fontSize: '1.65rem',
              fontWeight: 900,
              transition: 'transform 0.2s ease, filter 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = 'brightness(1.15)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.06)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = 'brightness(1)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            &gt;
          </button>

          {/* Horizontal Cards Track */}
          <div
            ref={scrollContainerRef}
            className="no-scrollbar"
            style={{
              display: 'flex',
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              scrollBehavior: 'smooth',
              padding: '22px 8px 16px',
              gap: '20px',
            }}
          >
            {products.map((prod, idx) => (
              <div
                key={prod.id}
                className="mde-street-card"
                style={{
                  flex: '0 0 238px',
                  scrollSnapAlign: 'start',
                  position: 'relative',
                  borderRadius: '8px',
                  background: `
                    linear-gradient(180deg, rgba(44, 43, 40, 0.95) 0%, rgba(26, 25, 24, 0.98) 65%, rgba(18, 18, 17, 1) 100%)
                  `,
                  border: '2px solid #4a4740',
                  boxShadow: '0 14px 28px rgba(0, 0, 0, 0.75), inset 0 0 0 1px rgba(255, 255, 255, 0.06)',
                  padding: '10px 10px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                {/* Subtle corrugated industrial texture on right edge of card */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    width: '28px',
                    background:
                      'repeating-linear-gradient(180deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 3px, rgba(0,0,0,0.25) 3px, rgba(0,0,0,0.25) 7px)',
                    pointerEvents: 'none',
                    borderTopRightRadius: '6px',
                    borderBottomRightRadius: '6px',
                  }}
                />

                {/* Top Tilted Stencil Tape Badge */}
                {prod.badge && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-13px',
                      left: '50%',
                      zIndex: 10,
                      padding: '4px 12px',
                      borderRadius: '3px',
                      fontFamily: "'Bebas Neue', 'Outfit', sans-serif",
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      letterSpacing: '1.2px',
                      whiteSpace: 'nowrap',
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.65)',
                      ...getBadgeStyles(prod, idx),
                    }}
                  >
                    [ {prod.badge} ]
                  </div>
                )}

                {/* Vertical Streetwear Image Frame */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '3 / 4',
                    borderRadius: '5px',
                    overflow: 'hidden',
                    backgroundColor: '#141416',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <img
                    src={prod.imageUrl}
                    alt={`${prod.marca} ${prod.modelo}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: 'contrast(1.05) saturate(1.05)',
                      transition: 'transform 0.35s ease',
                    }}
                  />

                  {/* Bottom dark vignette for SKU / [MDE] overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 'auto 0 0 0',
                      height: '48px',
                      background: 'linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.82) 100%)',
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'space-between',
                      padding: '6px 10px',
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.68rem',
                      fontWeight: 600,
                      letterSpacing: '0.8px',
                      color: 'rgba(226, 232, 240, 0.78)',
                    }}
                  >
                    <span>SKU</span>
                    <span>[MDE]</span>
                  </div>
                </div>

                {/* Card Footer Info (Dark Industrial Style) */}
                <div style={{ paddingTop: '12px', position: 'relative', zIndex: 2 }}>
                  <h3
                    style={{
                      fontFamily: "'Bebas Neue', 'Outfit', sans-serif",
                      fontSize: '1.15rem',
                      fontWeight: 700,
                      letterSpacing: '0.8px',
                      color: '#ffffff',
                      lineHeight: 1.15,
                      textTransform: 'uppercase',
                      marginBottom: '2px',
                    }}
                  >
                    {prod.marca} {prod.modelo} /
                  </h3>

                  {prod.subtitulo && (
                    <p
                      style={{
                        fontSize: '0.85rem',
                        color: '#cbd5e1',
                        fontWeight: 400,
                        lineHeight: 1.25,
                        marginBottom: '4px',
                      }}
                    >
                      {prod.subtitulo} -
                    </p>
                  )}

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                    <span
                      style={{
                        fontSize: '0.98rem',
                        fontWeight: 700,
                        color: '#f8fafc',
                        letterSpacing: '0.3px',
                      }}
                    >
                      ${prod.precioActual.toLocaleString('es-CO')} COP
                    </span>
                    {prod.precioOriginal && (
                      <span
                        style={{
                          fontSize: '0.75rem',
                          color: '#64748b',
                          textDecoration: 'line-through',
                        }}
                      >
                        ${prod.precioOriginal.toLocaleString('es-CO')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom-Left Watermark: Glowing "MEDALLO" + Mountain Sketch */}
      <div
        style={{
          position: 'absolute',
          bottom: '12px',
          left: '2.5%',
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 3,
        }}
      >
        <div
          className="medallo-neon-tag"
          style={{
            fontFamily: "'Permanent Marker', 'Outfit', cursive",
            fontSize: '1.55rem',
            letterSpacing: '1.5px',
            transform: 'rotate(-4deg)',
          }}
        >
          MEDALLO
        </div>
        <svg width="120" height="32" viewBox="0 0 120 32" fill="none" stroke="rgba(255, 152, 56, 0.45)" strokeWidth="1.3">
          <path d="M2 28 L22 10 L38 22 L58 6 L78 20 L98 12 L118 28 Z" />
        </svg>
      </div>

      {/* Bottom-Right Watermark: "[MDE] 05" + "[LA COMUNA]" */}
      <div
        style={{
          position: 'absolute',
          bottom: '12px',
          right: '2.5%',
          textAlign: 'right',
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 3,
        }}
      >
        <div
          style={{
            fontFamily: "'Bebas Neue', 'Outfit', sans-serif",
            fontSize: '1.35rem',
            letterSpacing: '2px',
            color: 'rgba(203, 213, 225, 0.32)',
            lineHeight: 1,
          }}
        >
          [MDE]
        </div>
        <div
          style={{
            fontFamily: "'Bebas Neue', 'Outfit', sans-serif",
            fontSize: '2.8rem',
            fontWeight: 800,
            color: 'rgba(203, 213, 225, 0.25)',
            lineHeight: 0.9,
          }}
        >
          05
        </div>
        <div
          style={{
            display: 'inline-block',
            marginTop: '2px',
            padding: '2px 8px',
            border: '1.5px solid rgba(217, 119, 6, 0.65)',
            fontFamily: "'Permanent Marker', 'Outfit', cursive",
            fontSize: '1.05rem',
            color: '#d97724',
            letterSpacing: '1.5px',
          }}
        >
          LA COMUNA
        </div>
      </div>
    </section>
  );
};
