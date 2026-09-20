import React from 'react';
import { Sparkles, Shield, Sliders, Zap } from 'lucide-react';
import { PARAM_DEFINITIONS } from '../../config/parameters';
import { ParamSlider } from '../ui/ParamSlider';
import { ParamToggle } from '../ui/ParamToggle';

export function ParameterSidebar({
  paramValues,
  onParamChange,
  previewFn,
  onPreviewFnChange,
  activeSection = 'basic',
  onSectionChange,
}) {
  const basicParams = PARAM_DEFINITIONS.filter((p) => p.section === 'basic');
  const reinforcementParams = PARAM_DEFINITIONS.filter((p) => p.section === 'reinforcement');
  const advancedParams = PARAM_DEFINITIONS.filter((p) => p.section === 'advanced');

  const renderParam = (param) => {
    if (param.type === 'boolean') {
      return (
        <ParamToggle
          key={param.id}
          label={param.label}
          description={param.description}
          value={paramValues[param.id]}
          onChange={(val) => onParamChange(param.id, val)}
        />
      );
    }
    return (
      <ParamSlider
        key={param.id}
        label={param.label}
        description={param.description}
        unit={param.unit}
        min={param.min}
        max={param.max}
        step={param.step}
        value={paramValues[param.id]}
        onChange={(val) => onParamChange(param.id, val)}
      />
    );
  };

  return (
    <aside className="app-sidebar">
      {/* 3 Pestañas Principales de Navegación */}
      <div className="sidebar-tabs">
        <button
          className={`sidebar-tab-btn ${activeSection === 'basic' ? 'active' : ''}`}
          onClick={() => onSectionChange?.('basic')}
          title="Configuración básica y esencial"
        >
          <Sparkles size={14} />
          <span>Básico</span>
        </button>

        <button
          className={`sidebar-tab-btn ${activeSection === 'reinforcement' ? 'active' : ''}`}
          onClick={() => onSectionChange?.('reinforcement')}
          title="Estructura de refuerzo en X"
        >
          <Shield size={14} />
          <span>Refuerzo</span>
        </button>

        <button
          className={`sidebar-tab-btn ${activeSection === 'advanced' ? 'active' : ''}`}
          onClick={() => onSectionChange?.('advanced')}
          title="Ajustes finos y estructurales avanzados"
        >
          <Sliders size={14} />
          <span>Avanzado</span>
        </button>
      </div>

      {/* Contenido de Parámetros según Sección */}
      <div className="sidebar-content">
        {/* ==========================================
            1. SECCIÓN BÁSICO
            ========================================== */}
        {activeSection === 'basic' && (
          <div className="param-group">
            <div className="param-group-title">
              <Sparkles size={14} />
              <span>Configuración Esencial</span>
            </div>

            <p className="param-section-desc">
              Ajusta el diámetro nominal de tus palos de escoba. El soporte de pata y la plantilla de perforación se dimensionarán automáticamente.
            </p>

            {basicParams.map(renderParam)}
          </div>
        )}

        {/* ==========================================
            2. SECCIÓN REFUERZO
            ========================================== */}
        {activeSection === 'reinforcement' && (
          <div className="param-group">
            <div className="param-group-title">
              <Shield size={14} />
              <span>Dimensiones de la Mesa</span>
            </div>
            <p className="param-section-desc">
              Medidas requeridas para que la cruceta central y las abrazaderas calculen la diagonal exacta en X.
            </p>

            {reinforcementParams
              .filter((p) => p.id === 'table_length' || p.id === 'table_width')
              .map(renderParam)}

            <div className="param-group-title" style={{ marginTop: 20 }}>
              <Shield size={14} />
              <span>Abrazadera y Refuerzo</span>
            </div>

            {reinforcementParams
              .filter((p) => p.id === 'brace_diameter' || p.id === 'clamp_height')
              .map(renderParam)}
          </div>
        )}

        {/* ==========================================
            3. SECCIÓN AVANZADO
            ========================================== */}
        {activeSection === 'advanced' && (
          <div className="param-group">
            <div className="param-group-title">
              <Sliders size={14} />
              <span>Estructura y Pata</span>
            </div>
            {advancedParams
              .filter((p) => p.subgroup === 'Estructura y Pata')
              .map(renderParam)}

            <div className="param-group-title" style={{ marginTop: 20 }}>
              <Sliders size={14} />
              <span>Refuerzo Detallado</span>
            </div>
            {advancedParams
              .filter((p) => p.subgroup === 'Refuerzo Detallado')
              .map(renderParam)}

            <div className="param-group-title" style={{ marginTop: 20 }}>
              <Sliders size={14} />
              <span>Plantilla Guía</span>
            </div>
            {advancedParams
              .filter((p) => p.subgroup === 'Plantilla Guía')
              .map(renderParam)}

            <div className="param-group-title" style={{ marginTop: 20 }}>
              <Zap size={14} />
              <span>Rendimiento de Previsualización</span>
            </div>
            <ParamSlider
              label="Resolución Rápida ($fn)"
              description="Valores entre 28-36 actualizan en tiempo real. La exportación final siempre usa máxima definición ($fn=80)."
              min={28}
              max={64}
              step={4}
              value={previewFn}
              onChange={onPreviewFnChange}
            />
          </div>
        )}
      </div>
    </aside>
  );
}
