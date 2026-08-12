/**
 * SCAD COMPILER - Gestor de compilación OpenSCAD en Web Worker
 */

let workerInstance = null;
let currentRequestId = 0;
const pendingRequests = new Map();

function getWorker() {
  if (!workerInstance) {
    workerInstance = new Worker(
      new URL('./scadWorker.js', import.meta.url),
      { type: 'module' }
    );

    workerInstance.onmessage = (event) => {
      const { type, id, pieceId, stlData, error } = event.data;
      const callback = pendingRequests.get(id);

      if (callback) {
        pendingRequests.delete(id);
        if (type === 'SUCCESS') {
          callback.resolve({ pieceId, stlData });
        } else {
          callback.reject(new Error(error || 'Error al compilar en OpenSCAD'));
        }
      }
    };

    workerInstance.onerror = (err) => {
      console.error('[OpenSCAD Worker Fatal Error]:', err);
    };
  }
  return workerInstance;
}

/**
 * Solicita la compilación de un código SCAD a STL usando flags -D
 * @param {string} pieceId Identificador de la pieza
 * @param {string} scadCode Código OpenSCAD original
 * @param {string[]} dFlags Argumentos de flags -D
 * @returns {Promise<{pieceId: string, stlData: string}>}
 */
export function compileScadToStl(pieceId, scadCode, dFlags = []) {
  return new Promise((resolve, reject) => {
    const worker = getWorker();
    const id = ++currentRequestId;

    pendingRequests.set(id, { resolve, reject });

    worker.postMessage({
      id,
      pieceId,
      scadCode,
      dFlags,
    });
  });
}
