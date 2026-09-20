import React from 'react';
import { Sparkles, Shield, Sliders, Zap, Wrench } from 'lucide-react';
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
  const paramById = Object.fromEntries(PARAM_DEFINITIONS.map((p) => [p.id, p]));

  const renderParam = (param) => {
    if (!param) return null;
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

  // Listas de parámetros para la sección Avanzado (todas las opciones ordenadas por pieza)
  const pataParamIds = [
    'pole_diameter',
    'pole_clearance',
    'socket_height',
    'base_size',
    'leg_angle',
    'wall_thickness',
    'screw_diameter',
    'side_screw',
    'second_side_screw',
  ];

  const refuerzoParamIds = [
    'table_length',
    'table_width',
    'brace_diameter',
    'clamp_height',
    'socket_length',
    'brace_clearance',
    'vertical_clearance',
  ];

  const guiaParamIds = [
    'edge_offset_x',
    'edge_offset_y',
    'table_lip_height',
    'fit_clearance',
  ];

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

            {renderParam(paramById.pole_diameter)}
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

            {renderParam(paramById.table_length)}
            {renderParam(paramById.table_width)}

            <div className="param-group-title" style={{ marginTop: 20 }}>
              <Shield size={14} />
              <span>Abrazadera y Refuerzo</span>
            </div>

            {renderParam(paramById.brace_diameter)}
            {renderParam(paramById.clamp_height)}
          </div>
        )}

        {/* ==========================================
            3. SECCIÓN AVANZADO (TODAS LAS OPCIONES ORDENADAS POR PIEZA)
            ========================================== */}
        {activeSection === 'advanced' && (
          <div className="param-group">
            {/* Pieza 1: Soporte de Pata */}
            <div className="param-group-title">
              <Wrench size={14} />
              <span>1. Soporte de Pata</span>
            </div>
            {pataParamIds.map((id) => renderParam(paramById[id]))}

            {/* Pieza 2 y 3: Refuerzo en X */}
            <div className="param-group-title" style={{ marginTop: 20 }}>
              <Shield size={14} />
              <span>2 y 3. Refuerzo en X (Abrazadera y Cruceta)</span>
            </div>
            {refuerzoParamIds.map((id) => renderParam(paramById[id]))}

            {/* Pieza 4: Guía / Plantilla */}
            <div className="param-group-title" style={{ marginTop: 20 }}>
              <Sliders size={14} />
              <span>4. Guía / Plantilla de Esquina</span>
            </div>
            {guiaParamIds.map((id) => renderParam(paramById[id]))}

            {/* Rendimiento */}
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
