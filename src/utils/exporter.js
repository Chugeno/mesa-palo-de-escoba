import JSZip from 'jszip';
import { PIECES, generateDFlags } from '../config/parameters';
import { compileScadToStl } from '../engine/scadCompiler';

/**
 * Descarga un archivo STL individual directamente en el navegador
 */
export function downloadStlFile(stlString, fileName) {
  const blob = new Blob([stlString], { type: 'model/stl' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Compila y descarga una pieza individual en alta definición ($fn = 80)
 */
export async function exportSingleToStl({
  pieceId,
  scadCode,
  paramValues,
  highQualityFn = 80,
}) {
  const piece = PIECES[pieceId];
  if (!piece || !scadCode) return;

  const dFlags = generateDFlags(paramValues, highQualityFn);
  const { stlData } = await compileScadToStl(pieceId, scadCode, dFlags);
  downloadStlFile(stlData, piece.exportName);
}

/**
 * Compila y empaqueta las 4 piezas en un archivo ZIP de alta calidad ($fn = 80)
 */
export async function exportAllToZip({
  scadSources,
  paramValues,
  highQualityFn = 80,
  onProgress,
}) {
  const zip = new JSZip();
  const pieces = Object.values(PIECES);
  const dFlags = generateDFlags(paramValues, highQualityFn);

  for (let i = 0; i < pieces.length; i++) {
    const piece = pieces[i];
    if (onProgress) {
      onProgress({
        current: i + 1,
        total: pieces.length,
        pieceName: piece.name,
      });
    }

    const rawCode = scadSources[piece.id];
    if (!rawCode) continue;

    try {
      const { stlData } = await compileScadToStl(piece.id, rawCode, dFlags);
      zip.file(piece.exportName, stlData);
    } catch (err) {
      console.error(`Error al exportar ${piece.name}:`, err);
      throw new Error(`Error al compilar ${piece.name}: ${err.message}`);
    }
  }

  // Notificar que se está generando el ZIP
  if (onProgress) {
    onProgress({
      current: pieces.length,
      total: pieces.length,
      pieceName: 'Comprimiendo archivo ZIP...',
      isZipping: true,
    });
  }

  // Generar archivo ZIP
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const poleD = paramValues.pole_diameter || 22.5;
  const zipFileName = `Mesa_Escoba_STLs_D${poleD}mm.zip`;

  // Disparar descarga
  const url = URL.createObjectURL(zipBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = zipFileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
