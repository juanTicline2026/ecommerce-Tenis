import React from 'react';
import './PromoMarquee.css';

const MESSAGE = 'Si compras 2 pares de tenis te quedan en $230 + el domicilio en todo el área metropolitana para que no salgas de tu casa 👽🚀';

// Se repite el mensaje para que el bucle sea continuo y sin saltos
const REPETITIONS = 6;

export const PromoMarquee: React.FC = () => (
  <aside className="promo-marquee" role="region" aria-label="Promoción">
    <div className="promo-marquee__track">
      {[0, 1].map((group) => (
        <div className="promo-marquee__group" key={group} aria-hidden={group === 1}>
          {Array.from({ length: REPETITIONS }, (_, i) => (
            <span className="promo-marquee__item" key={i}>{MESSAGE}</span>
          ))}
        </div>
      ))}
    </div>
  </aside>
);
