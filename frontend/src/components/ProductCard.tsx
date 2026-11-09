import React from 'react';
import { Button } from './Button';

interface ProductCardProps {
  id: string;
  marca: string;
  modelo: string;
  precioBase: number;
  imageUrl: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ id: _id, marca, modelo, precioBase, imageUrl }) => {
  return (
    <div style={{ display: 'block' }} className="hover-scale">
      <article style={{
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--border-color)',
        transition: 'box-shadow var(--transition-normal), border-color var(--transition-normal)'
      }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
          e.currentTarget.style.borderColor = 'transparent';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
          e.currentTarget.style.borderColor = 'var(--border-color)';
        }}>

        <div style={{
          aspectRatio: '1/1',
          backgroundColor: 'var(--bg-tertiary)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <img
            src={imageUrl}
            alt={`${marca} ${modelo}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            className="animate-fade-in"
          />
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-sm font-semibold text-secondary" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {marca}
              </p>
              <h3 className="text-lg font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
                {modelo}
              </h3>
            </div>
            <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              ${precioBase.toLocaleString()}
            </p>
          </div>

          <div className="mt-4">
            <Button variant="secondary" fullWidth>Ver Detalles</Button>
          </div>
        </div>

      </article>
    </div>
  );
};
