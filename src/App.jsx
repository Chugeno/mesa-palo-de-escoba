import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/ui/Header';
import { ParameterSidebar } from './components/controls/ParameterSidebar';
import { MultiViewport } from './components/viewer/MultiViewport';
import {
  PIECES,
  getDefaultParamValues,
  generateDFlags,
} from './config/parameters';
import { compileScadToStl } from './engine/scadCompiler';
import { downloadStlFile, exportSingleToStl, exportAllToZip } from './utils/exporter';

// Importar directamente los archivos .scad originales (con soporte HMR en Vite)
import patasRaw from '../Patas.scad?raw';
import abrazaderaRaw from '../Abrazadera_Pata.scad?raw';
import crucetaRaw from '../Cruceta_Centro.scad?raw';
import guiaRaw from '../Guia_Esquina.scad?raw';

const SCAD_SOURCES = {
  patas: patasRaw,
  abrazadera: abrazaderaRaw,
  cruceta: crucetaRaw,
  guia: guiaRaw,
};

export function App() {
  const [paramValues, setParamValues] = useState(getDefaultParamValues);
  const [previewFn, setPreviewFn] = useState(36);

  const [renderedStls, setRenderedStls] = useState({
    patas: null,
    abrazadera: null,
    cruceta: null,
    guia: null,
  });

  const [loadingStates, setLoadingStates] = useState({
    patas: false,
    abrazadera: false,
    cruceta: false,
    guia: false,
  });

  const [errors, setErrors] = useState({
    patas: null,
    abrazadera: null,
    cruceta: null,
    guia: null,
  });

  const [isExportingZip, setIsExportingZip] = useState(false);
  const debounceTimerRef = useRef(null);

  // Compilar una pieza específica usando flags -D
  const compilePiece = useCallback(
    async (pieceId, values, fnVal) => {
      const rawCode = SCAD_SOURCES[pieceId];
      if (!rawCode) return;

      setLoadingStates((prev) => ({ ...prev, [pieceId]: true }));
      setErrors((prev) => ({ ...prev, [pieceId]: null }));

      const dFlags = generateDFlags(values, fnVal);

      try {
        const { stlData } = await compileScadToStl(pieceId, rawCode, dFlags);
        setRenderedStls((prev) => ({ ...prev, [pieceId]: stlData }));
      } catch (err) {
        console.error(`Error al compilar ${pieceId}:`, err);
        setErrors((prev) => ({ ...prev, [pieceId]: err.message }));
      } finally {
        setLoadingStates((prev) => ({ ...prev, [pieceId]: false }));
      }
    },
    []
  );

  // Compilar secuencialmente todas las piezas
  const compileAllPieces = useCallback(
    async (values, fnVal) => {
      const pieceIds = Object.keys(PIECES);
      for (const pieceId of pieceIds) {
        await compilePiece(pieceId, values, fnVal);
      }
    },
    [compilePiece]
  );

  // Efecto de recompilación con Debounce al cambiar parámetros
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      compileAllPieces(paramValues, previewFn);
    }, 200);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [paramValues, previewFn, compileAllPieces]);

  // Manejador de cambio de parámetro
  const handleParamChange = (paramId, value) => {
    setParamValues((prev) => ({
      ...prev,
      [paramId]: value,
    }));
  };

  // Restablecer parámetros a valores por defecto
  const handleResetDefaults = () => {
    setParamValues(getDefaultParamValues());
  };

  // Descarga individual en alta definición ($fn = 80)
  const handleDownloadSingle = async (pieceId) => {
    const rawCode = SCAD_SOURCES[pieceId];
    if (rawCode) {
      try {
        await exportSingleToStl({
          pieceId,
          scadCode: rawCode,
          paramValues,
          highQualityFn: 80,
        });
        return;
      } catch (err) {
        console.error('Error al exportar STL en alta calidad, usando buffer:', err);
      }
    }

    // Fallback si no estuviera disponible el source
    const stlData = renderedStls[pieceId];
    const piece = PIECES[pieceId];
    if (stlData && piece) {
      downloadStlFile(stlData, piece.exportName);
    }
  };

  // Exportar todo en ZIP
  const handleExportAll = async () => {
    setIsExportingZip(true);
    try {
      await exportAllToZip({
        scadSources: SCAD_SOURCES,
        paramValues,
        highQualityFn: 80,
      });
    } catch (err) {
      alert('Error al exportar archivos STL: ' + err.message);
    } finally {
      setIsExportingZip(false);
    }
  };

  return (
    <div className="app-container">
      <Header
        onExportAll={handleExportAll}
        isExporting={isExportingZip}
        onResetDefaults={handleResetDefaults}
      />

      <div className="app-main">
        <ParameterSidebar
          paramValues={paramValues}
          onParamChange={handleParamChange}
          previewFn={previewFn}
          onPreviewFnChange={setPreviewFn}
        />

        <main className="app-viewport-area">
          <MultiViewport
            renderedStls={renderedStls}
            loadingStates={loadingStates}
            errors={errors}
            onDownloadSingle={handleDownloadSingle}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
