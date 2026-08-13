import React from 'react';
import { Download, CheckCircle2, Clock, Loader2, Package, Sparkles } from 'lucide-react';
import { PIECES } from '../../config/parameters';

export function ExportProgressModal({ progress, onClose }) {
  if (!progress) return null;

  const piecesList = Object.values(PIECES);
  const { current, total, pieceName, isZipping } = progress;
  const percent = isZipping ? 98 : Math.round(((current - 0.5) / total) * 100);

  return (
    <div className="export-modal-overlay">
      <div className="export-modal-card">
        <div className="export-modal-header">
          <div className="export-modal-icon">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="export-modal-title">Exportando Todo en Alta Calidad</h3>
            <p className="export-modal-subtitle">
              Calculando curvas y círculos perfectos ($fn = 80)
            </p>
          </div>
        </div>

        {/* Barra de progreso real */}
        <div className="export-progress-section">
          <div className="export-progress-labels">
            <span className="export-status-text">
              {isZipping
                ? 'Empaquetando archivo comprimido ZIP...'
                : `Procesando: ${pieceName} (${current} de ${total})`}
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

        {/* Lista de piezas con sus estados reales */}
        <div className="export-pieces-list">
          {piecesList.map((piece, index) => {
            const stepNum = index + 1;
            const isCompleted = stepNum < current || isZipping;
            const isCurrent = stepNum === current && !isZipping;
            const isPending = stepNum > current;

            return (
              <div
                key={piece.id}
                className={`export-piece-item ${
                  isCompleted
                    ? 'completed'
                    : isCurrent
                    ? 'active'
                    : 'pending'
                }`}
              >
                <div className="export-piece-status-icon">
                  {isCompleted ? (
                    <CheckCircle2 size={16} className="text-success" />
                  ) : isCurrent ? (
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
                  {isCompleted ? 'Listo' : isCurrent ? 'Compilando...' : 'En cola'}
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
