import React from 'react';
import { ShoppingCart, Menu, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Navbar: React.FC = () => {
  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      borderBottom: '1px solid var(--border-color)'
    }} className="glass py-4">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="md:hidden" style={{ color: 'var(--text-primary)' }}>
            <Menu size={24} />
          </button>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px', height: '32px', 
              background: 'linear-gradient(135deg, var(--accent-primary) 0%, #6d28d9 100%)',
              borderRadius: 'var(--radius-sm)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 900, fontFamily: 'Outfit',
              fontSize: '11px',
              boxShadow: '0 2px 10px rgba(124, 58, 237, 0.3)',
            }}>
              TA
            </div>
            <span className="text-xl font-bold" style={{ letterSpacing: '-0.5px', color: 'var(--text-primary)' }}>
              Tenis-Arios
            </span>
          </Link>
        </div>

        <div style={{ display: 'flex', gap: '32px' }} className="hidden md:flex font-medium text-secondary">
          <Link to="/" style={{ transition: 'color var(--transition-fast)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
          >Novedades</Link>
          <Link to="/" style={{ transition: 'color var(--transition-fast)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
          >Hombre</Link>
          <Link to="/" style={{ transition: 'color var(--transition-fast)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
          >Mujer</Link>
          <Link to="/" style={{ transition: 'color var(--transition-fast)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
          >Colecciones</Link>
        </div>

        <div className="flex items-center gap-4">
          <button style={{ color: 'var(--text-secondary)', transition: 'color var(--transition-fast)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            <Search size={20} />
          </button>
          <button style={{ color: 'var(--text-primary)', position: 'relative' }} className="hover-scale">
            <ShoppingCart size={24} />
            <span style={{
              position: 'absolute',
              top: '-6px', right: '-6px',
              background: 'linear-gradient(135deg, var(--accent-primary) 0%, #6d28d9 100%)',
              color: 'white',
              fontSize: '10px',
              fontWeight: 700,
              width: '16px', height: '16px',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(124, 58, 237, 0.4)',
            }}>
              2
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
};
