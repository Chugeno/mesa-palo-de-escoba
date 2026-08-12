import React from 'react';

/**
 * Componente Botón Modular Unificado
 * @param {'primary' | 'secondary' | 'outline' | 'ghost' | 'success'} variant
 * @param {'sm' | 'md' | 'lg'} size
 * @param {boolean} isIcon
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isIcon = false,
  className = '',
  disabled = false,
  onClick,
  title,
  type = 'button',
  ...props
}) {
  const variantClass = `btn-${variant}`;
  const sizeClass = isIcon ? 'btn-icon' : `btn-${size}`;

  return (
    <button
      type={type}
      className={`btn ${variantClass} ${sizeClass} ${className}`.trim()}
      disabled={disabled}
      onClick={onClick}
      title={title}
      {...props}
    >
      {children}
    </button>
  );
}
