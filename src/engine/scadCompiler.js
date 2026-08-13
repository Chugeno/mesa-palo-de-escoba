/**
 * SCAD COMPILER - Gestor de compilación OpenSCAD con Worker Pool Multi-Hilo
 * Permite compilar las 4 piezas en paralelo usando todos los núcleos de la CPU
 */

const POOL_SIZE = typeof navigator !== 'undefined'
  ? Math.min(navigator.hardwareConcurrency || 4, 4)
  : 4;

class WorkerPool {
  constructor(size = POOL_SIZE) {
    this.size = size;
    this.workers = [];
    this.idleWorkers = [];
    this.queue = [];
    this.pendingRequests = new Map();
    this.requestId = 0;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    this.initialized = true;

    for (let i = 0; i < this.size; i++) {
      const worker = new Worker(
        new URL('./scadWorker.js', import.meta.url),
        { type: 'module' }
      );

      worker.onmessage = (event) => {
        const { type, id, pieceId, stlData, error } = event.data;
        const callback = this.pendingRequests.get(id);

        if (callback) {
          this.pendingRequests.delete(id);
          if (type === 'SUCCESS') {
            callback.resolve({ pieceId, stlData });
          } else {
            callback.reject(new Error(error || 'Error al compilar en OpenSCAD'));
          }
        }

        // Devolver el worker al pool de disponibles y procesar la cola
        this.idleWorkers.push(worker);
        this.processQueue();
      };

      worker.onerror = (err) => {
        console.error(`[OpenSCAD Worker #${i} Error]:`, err);
      };

      this.workers.push(worker);
      this.idleWorkers.push(worker);
    }
  }

  processQueue() {
    while (this.idleWorkers.length > 0 && this.queue.length > 0) {
      const worker = this.idleWorkers.pop();
      const job = this.queue.shift();

      this.pendingRequests.set(job.id, {
        resolve: job.resolve,
        reject: job.reject,
      });

      worker.postMessage({
        id: job.id,
        pieceId: job.pieceId,
        scadCode: job.scadCode,
        dFlags: job.dFlags,
      });
    }
  }

  dispatch(pieceId, scadCode, dFlags) {
    this.init();

    return new Promise((resolve, reject) => {
      const id = ++this.requestId;
      this.queue.push({ id, pieceId, scadCode, dFlags, resolve, reject });
      this.processQueue();
    });
  }
}

const pool = new WorkerPool();

/**
 * Solicita la compilación de un código SCAD a STL usando el pool de workers en paralelo
 * @param {string} pieceId Identificador de la pieza
 * @param {string} scadCode Código OpenSCAD original
 * @param {string[]} dFlags Argumentos de flags -D
 * @returns {Promise<{pieceId: string, stlData: string}>}
 */
export function compileScadToStl(pieceId, scadCode, dFlags = []) {
  return pool.dispatch(pieceId, scadCode, dFlags);
}
