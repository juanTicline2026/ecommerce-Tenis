import React from 'react';
import './HeroVideoBackground.css';

interface HeroVideoBackgroundProps {
  src: string;
}

export const HeroVideoBackground: React.FC<HeroVideoBackgroundProps> = ({ src }) => (
  <div className="hero-video" aria-hidden="true">
    <video className="hero-video__media" src={src} autoPlay muted loop playsInline preload="auto" />
    <div className="hero-video__overlay" />
  </div>
);
