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
              backgroundColor: 'var(--text-primary)', 
              borderRadius: 'var(--radius-sm)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 900, fontFamily: 'Outfit'
            }}>
              TA
            </div>
            <span className="text-xl font-bold" style={{ letterSpacing: '-0.5px' }}>
              Tenis-Arios
            </span>
          </Link>
        </div>

        <div style={{ display: 'flex', gap: '32px' }} className="hidden md:flex font-medium text-secondary">
          <Link to="/" className="hover:text-primary transition-fast">Novedades</Link>
          <Link to="/" className="hover:text-primary transition-fast">Hombre</Link>
          <Link to="/" className="hover:text-primary transition-fast">Mujer</Link>
          <Link to="/" className="hover:text-primary transition-fast">Colecciones</Link>
        </div>

        <div className="flex items-center gap-4">
          <button style={{ color: 'var(--text-secondary)' }} className="hover-scale">
            <Search size={20} />
          </button>
          <button style={{ color: 'var(--text-primary)', position: 'relative' }} className="hover-scale">
            <ShoppingCart size={24} />
            <span style={{
              position: 'absolute',
              top: '-6px', right: '-6px',
              backgroundColor: 'var(--accent-primary)',
              color: 'white',
              fontSize: '10px',
              fontWeight: 700,
              width: '16px', height: '16px',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              2
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
};
