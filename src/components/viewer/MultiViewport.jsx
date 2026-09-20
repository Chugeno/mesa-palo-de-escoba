import React, { useState, useEffect } from 'react';
import { Viewport3D } from './Viewport3D';
import { PIECES } from '../../config/parameters';
import { Sparkles, Shield, Grid } from 'lucide-react';

export function MultiViewport({
  renderedStls,
  loadingStates,
  errors,
  onDownloadSingle,
  exportingSingleId,
  activeSection = 'basic',
  onSectionChange,
}) {
  const [maximizedPieceId, setMaximizedPieceId] = useState(null);
  const [viewportFilter, setViewportFilter] = useState(activeSection);

  // Sincronizar filtro cuando cambie la sección activa en el sidebar
  useEffect(() => {
    setViewportFilter(activeSection);
    setMaximizedPieceId(null);
  }, [activeSection]);

  const toggleMaximize = (pieceId) => {
    setMaximizedPieceId((prev) => (prev === pieceId ? null : pieceId));
  };

  const handleFilterSelect = (filterKey) => {
    setViewportFilter(filterKey);
    setMaximizedPieceId(null);
    onSectionChange?.(filterKey);
  };

  const piecesList = Object.values(PIECES);

  let filteredPieces = piecesList;
  if (viewportFilter === 'basic') {
    filteredPieces = piecesList.filter((p) => p.category === 'basic');
  } else if (viewportFilter === 'reinforcement') {
    filteredPieces = piecesList.filter((p) => p.category === 'reinforcement');
  }

  const displayedPieces = maximizedPieceId
    ? piecesList.filter((p) => p.id === maximizedPieceId)
    : filteredPieces;

  const layoutClass = maximizedPieceId
    ? 'single-view'
    : displayedPieces.length === 2
    ? 'two-view'
    : 'four-view';

  return (
    <div className="viewport-wrapper">
      {/* Barra de Filtro Rápido de Modelos */}
      <div className="viewport-filter-bar">
        <div className="viewport-filter-pill-group">
          <button
            className={`viewport-filter-pill ${viewportFilter === 'basic' ? 'active' : ''}`}
            onClick={() => handleFilterSelect('basic')}
            title="Mostrar únicamente las piezas principales de fijación y plantilla"
          >
            <Sparkles size={13} />
            <span>Básicos (2)</span>
          </button>

          <button
            className={`viewport-filter-pill ${viewportFilter === 'reinforcement' ? 'active' : ''}`}
            onClick={() => handleFilterSelect('reinforcement')}
            title="Mostrar piezas de refuerzo diagonal en X"
          >
            <Shield size={13} />
            <span>Refuerzo (2)</span>
          </button>

          <button
            className={`viewport-filter-pill ${viewportFilter === 'advanced' ? 'active' : ''}`}
            onClick={() => handleFilterSelect('advanced')}
            title="Mostrar las 4 piezas juntas"
          >
            <Grid size={13} />
            <span>Ver Todas (4)</span>
          </button>
        </div>
      </div>

      {/* Cuadrícula de Visualización 3D */}
      <div className={`viewport-grid ${layoutClass}`}>
        {displayedPieces.map((piece) => (
          <Viewport3D
            key={piece.id}
            piece={piece}
            stlData={renderedStls[piece.id]}
            isLoading={loadingStates[piece.id]}
            isExportingHD={exportingSingleId === piece.id}
            error={errors[piece.id]}
            isMaximized={maximizedPieceId === piece.id}
            onToggleMaximize={toggleMaximize}
            onDownloadSingle={onDownloadSingle}
          />
        ))}
      </div>
    </div>
  );
}
