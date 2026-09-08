import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '',
  ...props 
}) => {
  
  // Basic inline styles to mimic classes since we are using Vanilla CSS without Tailwind compilation
  // We apply the classes that we defined in index.css or simple style overrides
  const style: React.CSSProperties = {
    padding: '12px 24px',
    fontWeight: 600,
    borderRadius: 'var(--radius-md)',
    transition: 'all var(--transition-fast)',
    width: fullWidth ? '100%' : 'auto',
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
  };

  if (variant === 'primary') {
    style.backgroundColor = 'var(--accent-primary)';
    style.color = '#ffffff';
    style.boxShadow = 'var(--shadow-md)';
  } else if (variant === 'secondary') {
    style.backgroundColor = 'var(--bg-tertiary)';
    style.color = 'var(--text-primary)';
  } else if (variant === 'outline') {
    style.backgroundColor = 'transparent';
    style.border = '2px solid var(--border-color)';
    style.color = 'var(--text-primary)';
  }

  return (
    <button 
      style={style} 
      className={`hover-scale ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
