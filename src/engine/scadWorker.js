import { createOpenSCAD } from 'openscad-wasm';

let instancePromise = null;

async function getInstance() {
  if (!instancePromise) {
    instancePromise = createOpenSCAD();
  }
  return instancePromise;
}

self.onmessage = async (e) => {
  const { id, pieceId, scadCode } = e.data;

  try {
    const instance = await getInstance();
    const rawInstance = instance.getInstance ? instance.getInstance() : null;

    let stlString;
    if (rawInstance && rawInstance.FS && rawInstance.callMain) {
      // Direct FS execution with manifold flag if available
      const inPath = `/input_${pieceId}_${id}.scad`;
      const outPath = `/output_${pieceId}_${id}.stl`;
      
      rawInstance.FS.writeFile(inPath, scadCode);
      try {
        rawInstance.callMain([inPath, '--backend=manifold', '-o', outPath]);
      } catch (err) {
        // Fallback without manifold if error
        rawInstance.callMain([inPath, '-o', outPath]);
      }
      
      stlString = rawInstance.FS.readFile(outPath, { encoding: 'utf8' });
      
      try {
        rawInstance.FS.unlink(inPath);
        rawInstance.FS.unlink(outPath);
      } catch (cleanupErr) {
        // ignore cleanup error
      }
    } else {
      // Default wrapper execution
      stlString = await instance.renderToStl(scadCode);
    }

    self.postMessage({
      type: 'SUCCESS',
      id,
      pieceId,
      stlData: stlString,
    });
  } catch (error) {
    console.error(`[OpenSCAD Worker Error - ${pieceId}]:`, error);
    self.postMessage({
      type: 'ERROR',
      id,
      pieceId,
      error: error.message || String(error),
    });
  }
};
