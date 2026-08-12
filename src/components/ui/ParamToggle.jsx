import React from 'react';

/**
 * Componente unificado para parámetros booleanos (Switches)
 */
export function ParamToggle({
  label,
  description,
  value,
  isGlobal = false,
  onChange,
}) {
  return (
    <div className="param-item">
      <label className="switch-container">
        <div>
          <div className="param-item-header">
            <span className="param-label">{label}</span>
            {isGlobal && <span className="global-badge">Global</span>}
          </div>
          {description && <span className="param-description">{description}</span>}
        </div>
        <div className="switch">
          <input
            type="checkbox"
            checked={!!value}
            onChange={(e) => onChange(e.target.checked)}
          />
          <span className="slider-switch"></span>
        </div>
      </label>
    </div>
  );
}
