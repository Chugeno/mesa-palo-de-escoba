import React, { useState } from 'react';
import { Globe, Wrench, Sliders, Info, Zap } from 'lucide-react';
import { PARAM_DEFINITIONS, PIECES } from '../../config/parameters';
import { ParamSlider } from '../ui/ParamSlider';
import { ParamToggle } from '../ui/ParamToggle';

export function ParameterSidebar({
  paramValues,
  onParamChange,
  previewFn,
  onPreviewFnChange,
}) {
  const [activeTab, setActiveTab] = useState('global');
  const [selectedPieceGroup, setSelectedPieceGroup] = useState('patas');

  const globalParams = PARAM_DEFINITIONS.filter((p) => p.isGlobal);
  const pieceParams = PARAM_DEFINITIONS.filter(
    (p) => !p.isGlobal && p.group === selectedPieceGroup
  );

  return (
    <aside className="app-sidebar">
      {/* Pestañas de navegación */}
      <div className="sidebar-tabs">
        <button
          className={`sidebar-tab-btn ${activeTab === 'global' ? 'active' : ''}`}
          onClick={() => setActiveTab('global')}
        >
          <Globe size={14} />
          <span>Globales</span>
        </button>

        <button
          className={`sidebar-tab-btn ${activeTab === 'piece' ? 'active' : ''}`}
          onClick={() => setActiveTab('piece')}
        >
          <Wrench size={14} />
          <span>Por Pieza</span>
        </button>
      </div>

      {/* Selector secundario si está en la pestaña "Por Pieza" */}
      {activeTab === 'piece' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 4,
            padding: '8px 12px',
            borderBottom: '1px solid var(--border-color)',
            background: 'var(--bg-card)',
          }}
        >
          {Object.values(PIECES).map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPieceGroup(p.id)}
              className={`sidebar-tab-btn ${
                selectedPieceGroup === p.id ? 'active' : ''
              }`}
              style={{ fontSize: 11, padding: '4px 6px' }}
              title={p.name}
            >
              {p.id.charAt(0).toUpperCase() + p.id.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* Contenido de Parámetros */}
      <div className="sidebar-content">
        {/* TAB 1: GLOBALES */}
        {activeTab === 'global' && (
          <>
            <div className="param-group">
              <div className="param-group-title">
                <Globe size={14} />
                <span>Dimensiones Maestras</span>
              </div>

              {globalParams.map((param) => {
                if (param.type === 'boolean') {
                  return (
                    <ParamToggle
                      key={param.id}
                      label={param.label}
                      description={param.description}
                      value={paramValues[param.id]}
                      isGlobal={true}
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
                    isGlobal={true}
                    onChange={(val) => onParamChange(param.id, val)}
                  />
                );
              })}
            </div>
          </>
        )}

        {/* TAB 2: POR PIEZA */}
        {activeTab === 'piece' && (
          <div className="param-group">
            <div className="param-group-title">
              <Sliders size={14} />
              <span>{PIECES[selectedPieceGroup]?.name}</span>
            </div>

            <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4 }}>
              {PIECES[selectedPieceGroup]?.description}
            </p>

            {pieceParams.length === 0 ? (
              <div
                style={{
                  padding: 16,
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  fontSize: 13,
                }}
              >
                Esta pieza se configura principalmente mediante los parámetros globales.
              </div>
            ) : (
              pieceParams.map((param) => {
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
              })
            )}
          </div>
        )}

        {/* Configuración de Velocidad / Resolución */}
        <div
          style={{
            marginTop: 'auto',
            paddingTop: 16,
            borderTop: '1px solid var(--border-color)',
          }}
        >
          <div className="param-group-title" style={{ marginBottom: 8 }}>
            <Zap size={14} />
            <span>Rendimiento de Previsualización</span>
          </div>

          <ParamSlider
            label="Resolución Rápida ($fn)"
            description="Valores más bajos (20-30) actualizan más rápido en tiempo real. La exportación final siempre usa alta definición ($fn=80)."
            min={16}
            max={60}
            step={2}
            value={previewFn}
            onChange={onPreviewFnChange}
          />
        </div>
      </div>
    </aside>
  );
}
