import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/ui/Header';
import { ParameterSidebar } from './components/controls/ParameterSidebar';
import { MultiViewport } from './components/viewer/MultiViewport';
import { ExportProgressModal } from './components/ui/ExportProgressModal';
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
  const [zipProgress, setZipProgress] = useState(null);
  const [exportingSingleId, setExportingSingleId] = useState(null);
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

  // Compilar todas las piezas en paralelo aprovechando el Worker Pool multi-hilo
  const compileAllPieces = useCallback(
    async (values, fnVal) => {
      const pieceIds = Object.keys(PIECES);
      await Promise.all(pieceIds.map((pieceId) => compilePiece(pieceId, values, fnVal)));
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
    }, 300);

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
    setExportingSingleId(pieceId);
    const rawCode = SCAD_SOURCES[pieceId];
    try {
      if (rawCode) {
        await exportSingleToStl({
          pieceId,
          scadCode: rawCode,
          paramValues,
          highQualityFn: 80,
        });
      } else {
        const stlData = renderedStls[pieceId];
        const piece = PIECES[pieceId];
        if (stlData && piece) {
          downloadStlFile(stlData, piece.exportName);
        }
      }
    } catch (err) {
      console.error('Error al exportar STL individual:', err);
      alert('Error al generar STL: ' + err.message);
    } finally {
      setExportingSingleId(null);
    }
  };

  // Exportar todo en ZIP con barra de progreso real
  const handleExportAll = async () => {
    setIsExportingZip(true);
    setZipProgress({ current: 1, total: 4, pieceName: 'Iniciando compilación...', isZipping: false });
    try {
      await exportAllToZip({
        scadSources: SCAD_SOURCES,
        paramValues,
        highQualityFn: 80,
        onProgress: (progress) => {
          setZipProgress(progress);
        },
      });
    } catch (err) {
      alert('Error al exportar archivos STL: ' + err.message);
    } finally {
      setTimeout(() => {
        setIsExportingZip(false);
        setZipProgress(null);
      }, 700);
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
            exportingSingleId={exportingSingleId}
          />
        </main>
      </div>

      {/* Modal de progreso de exportación ZIP */}
      <ExportProgressModal progress={zipProgress} />
    </div>
  );
}

export default App;
