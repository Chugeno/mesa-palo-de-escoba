import React from 'react';
import { Box, Download, RefreshCw, Layers } from 'lucide-react';
import { Button } from './Button';
import { ThemeToggle } from './ThemeToggle';

export function Header({ onExportAll, isExporting, onResetDefaults }) {
  return (
    <header className="app-header">
      <div className="header-brand">
        <div className="header-logo-icon">
          <Box size={20} />
        </div>
        <div>
          <h1 className="header-title">Mesa Escoba 3D</h1>
          <p className="header-subtitle">Configurador Paramétrico Multi-Pieza</p>
        </div>
      </div>

      <div className="header-actions">
        <Button
          variant="outline"
          size="sm"
          onClick={onResetDefaults}
          title="Restaurar valores iniciales"
        >
          <RefreshCw size={14} />
          <span>Restablecer</span>
        </Button>

        <ThemeToggle />

        <Button
          variant="primary"
          size="md"
          onClick={onExportAll}
          disabled={isExporting}
        >
          {isExporting ? (
            <>
              <div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
              <span>Generando ZIP...</span>
            </>
          ) : (
            <>
              <Download size={16} />
              <span>Exportar Todo (.ZIP)</span>
            </>
          )}
        </Button>
      </div>
    </header>
  );
}
