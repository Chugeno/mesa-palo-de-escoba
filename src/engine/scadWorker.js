import { createOpenSCAD } from 'openscad-wasm';

self.onmessage = async (e) => {
  const { id, pieceId, scadCode, dFlags = [] } = e.data;

  try {
    // Instanciar un nuevo runtime de OpenSCAD para cada compilación
    // Esto garantiza aislamiento completo y evita excepciones de salida en Emscripten
    const instance = await createOpenSCAD();
    const rawInstance = instance.getInstance ? instance.getInstance() : null;

    if (!rawInstance || !rawInstance.FS || !rawInstance.callMain) {
      throw new Error('No se pudo inicializar el sistema de archivos de OpenSCAD');
    }

    const inPath = `/input_${pieceId}.scad`;
    const outPath = `/output_${pieceId}.stl`;

    // Escribir el código OpenSCAD original en el sistema de archivos virtual
    rawInstance.FS.writeFile(inPath, scadCode);

    // Ejecutar OpenSCAD con los flags -D para sobreescritura de parámetros
    const args = [inPath, ...dFlags, '-o', outPath];
    rawInstance.callMain(args);

    // Leer el STL generado
    const stlString = rawInstance.FS.readFile(outPath, { encoding: 'utf8' });

    // Limpieza de archivos virtuales
    try {
      rawInstance.FS.unlink(inPath);
      rawInstance.FS.unlink(outPath);
    } catch (cleanupErr) {
      // Ignorar errores de limpieza
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
      error: error?.message || String(error),
    });
  }
};
