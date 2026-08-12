import React from 'react';

/**
 * Componente unificado de Slider + Input Numérico + Unidad
 */
export function ParamSlider({
  label,
  description,
  value,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  isGlobal = false,
  onChange,
}) {
  const handleSliderChange = (e) => {
    const val = parseFloat(e.target.value);
    onChange(val);
  };

  const handleInputChange = (e) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val)) {
      onChange(val);
    }
  };

  return (
    <div className="param-item">
      <div className="param-item-header">
        <span className="param-label">{label}</span>
        {isGlobal && <span className="global-badge">Global</span>}
      </div>
      {description && <span className="param-description">{description}</span>}
      <div className="param-control-row">
        <input
          type="range"
          className="param-slider"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleSliderChange}
        />
        <input
          type="number"
          className="param-number-input"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleInputChange}
        />
        {unit && <span className="param-unit">{unit}</span>}
      </div>
    </div>
  );
}
