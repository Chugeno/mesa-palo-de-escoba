import React from 'react';
import { Download, CheckCircle2, Clock, Loader2, Package, Sparkles } from 'lucide-react';
import { PIECES } from '../../config/parameters';

export function ExportProgressModal({ progress, onClose }) {
  if (!progress) return null;

  const piecesList = Object.values(PIECES);
  const {
    completedCount = 0,
    total = piecesList.length,
    completedIds = [],
    runningIds = [],
    isZipping = false,
  } = progress;

  const percent = isZipping ? 98 : Math.round((completedCount / total) * 100);

  return (
    <div className="export-modal-overlay">
      <div className="export-modal-card">
        <div className="export-modal-header">
          <div className="export-modal-icon">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="export-modal-title">Exportación Multi-Hilo en Paralelo</h3>
            <p className="export-modal-subtitle">
              Compilando 4 piezas simultáneamente en alta resolución ($fn = 80)
            </p>
          </div>
        </div>

        {/* Barra de progreso real */}
        <div className="export-progress-section">
          <div className="export-progress-labels">
            <span className="export-status-text">
              {isZipping
                ? 'Empaquetando archivo comprimido ZIP...'
                : runningIds.length > 0
                ? `Procesando ${runningIds.length} pieza(s) en paralelo (${completedCount} de ${total} listas)`
                : 'Finalizando generación...'}
            </span>
            <span className="export-percent-badge">{percent}%</span>
          </div>

          <div className="export-progress-track">
            <div
              className="export-progress-fill"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* Lista de piezas con sus estados reales simultáneos */}
        <div className="export-pieces-list">
          {piecesList.map((piece) => {
            const isCompleted = completedIds.includes(piece.id) || isZipping;
            const isRunning = runningIds.includes(piece.id) && !isZipping;

            return (
              <div
                key={piece.id}
                className={`export-piece-item ${
                  isCompleted
                    ? 'completed'
                    : isRunning
                    ? 'active'
                    : 'pending'
                }`}
              >
                <div className="export-piece-status-icon">
                  {isCompleted ? (
                    <CheckCircle2 size={16} className="text-success" />
                  ) : isRunning ? (
                    <Loader2 size={16} className="text-primary spin-icon" />
                  ) : (
                    <Clock size={16} className="text-muted" />
                  )}
                </div>

                <div className="export-piece-info">
                  <span className="export-piece-name">{piece.name}</span>
                  <span className="export-piece-file">{piece.exportName}</span>
                </div>

                <div className="export-piece-badge">
                  {isCompleted ? 'Listo' : isRunning ? 'Procesando en CPU...' : 'En cola'}
                </div>
              </div>
            );
          })}
        </div>

        <div className="export-modal-footer">
          <Package size={14} />
          <span>El archivo ZIP se descargará automáticamente al finalizar.</span>
        </div>
      </div>
    </div>
  );
}
