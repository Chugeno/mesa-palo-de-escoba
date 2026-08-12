import React, { useState } from 'react';
import { Viewport3D } from './Viewport3D';
import { PIECES } from '../../config/parameters';

export function MultiViewport({
  renderedStls,
  loadingStates,
  errors,
  onDownloadSingle,
}) {
  const [maximizedPieceId, setMaximizedPieceId] = useState(null);

  const toggleMaximize = (pieceId) => {
    setMaximizedPieceId((prev) => (prev === pieceId ? null : pieceId));
  };

  const piecesList = Object.values(PIECES);
  const displayedPieces = maximizedPieceId
    ? piecesList.filter((p) => p.id === maximizedPieceId)
    : piecesList;

  return (
    <div
      className={`viewport-grid ${maximizedPieceId ? 'single-view' : ''}`}
    >
      {displayedPieces.map((piece) => (
        <Viewport3D
          key={piece.id}
          piece={piece}
          stlData={renderedStls[piece.id]}
          isLoading={loadingStates[piece.id]}
          error={errors[piece.id]}
          isMaximized={maximizedPieceId === piece.id}
          onToggleMaximize={toggleMaximize}
          onDownloadSingle={onDownloadSingle}
        />
      ))}
    </div>
  );
}
