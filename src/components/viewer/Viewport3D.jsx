import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { Download, Maximize2, Minimize2, RotateCcw, Eye } from 'lucide-react';
import { Button } from '../ui/Button';

export function Viewport3D({
  piece,
  stlData,
  isLoading,
  isExportingHD,
  error,
  isMaximized,
  onToggleMaximize,
  onDownloadSingle,
}) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const meshRef = useRef(null);
  const gridRef = useRef(null);
  const animFrameIdRef = useRef(null);

  const [wireframe, setWireframe] = useState(false);
  const [stats, setStats] = useState({ facets: 0, dimensions: '' });

  // Inicializar Escena Three.js
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Escena
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Cámara
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      2000
    );
    camera.position.set(120, 120, 120);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // Controles Orbitales
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 1000;
    controls.minDistance = 5;
    controlsRef.current = controls;

    // Iluminación de estudio
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x475569, 1.5);
    hemiLight.position.set(0, 150, 0);
    scene.add(hemiLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight1.position.set(100, 150, 100);
    dirLight1.castShadow = true;
    dirLight1.shadow.mapSize.width = 1024;
    dirLight1.shadow.mapSize.height = 1024;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x93c5fd, 0.9);
    dirLight2.position.set(-100, 50, -100);
    scene.add(dirLight2);

    // Luz de relleno interior suave para iluminar huecos y cavidades
    const fillLight = new THREE.PointLight(0xffffff, 1.2, 500);
    fillLight.position.set(0, 120, 0);
    scene.add(fillLight);

    // Grid del suelo
    const grid = new THREE.GridHelper(250, 50, 0x3b82f6, 0x374151);
    grid.position.y = 0;
    scene.add(grid);
    gridRef.current = grid;

    // Loop de renderizado
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !renderer || !camera) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (width === 0 || height === 0) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animFrameIdRef.current);
      resizeObserver.disconnect();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Cargar / Actualizar Malla STL
  useEffect(() => {
    if (!stlData || !sceneRef.current) return;

    try {
      const loader = new STLLoader();
      const geometry = loader.parse(stlData);
      geometry.computeVertexNormals();

      // OpenSCAD genera geometrías en Z-Up. Rotamos -90° en X para alinear con Three.js Y-Up.
      geometry.rotateX(-Math.PI / 2);

      // Calcular caja envolvente y dimensiones
      geometry.computeBoundingBox();
      const bbox = geometry.boundingBox;
      const size = new THREE.Vector3();
      bbox.getSize(size);

      // Centrar en X y Z, y asentar la base sobre el suelo (Y=0)
      geometry.center();
      geometry.translate(0, size.y / 2, 0);

      // Eliminar malla previa
      if (meshRef.current) {
        sceneRef.current.remove(meshRef.current);
        if (meshRef.current.geometry) meshRef.current.geometry.dispose();
        if (meshRef.current.material) meshRef.current.material.dispose();
      }

      // Material elegante con sombreado PBR
      const material = new THREE.MeshStandardMaterial({
        color: 0x3b82f6,
        roughness: 0.35,
        metalness: 0.15,
        wireframe: wireframe,
        side: THREE.DoubleSide,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      sceneRef.current.add(mesh);
      meshRef.current = mesh;

      // Actualizar estadísticas
      const facetCount = geometry.attributes.position.count / 3;
      setStats({
        facets: Math.round(facetCount),
        dimensions: `${size.x.toFixed(1)} × ${size.z.toFixed(1)} × ${size.y.toFixed(1)} mm`,
      });

      // Ajustar cámara para encuadrar la pieza y ver el interior del tubo desde arriba
      if (controlsRef.current) {
        const maxDim = Math.max(size.x, size.y, size.z);
        const distance = maxDim * 2.1;
        const camera = controlsRef.current.object;
        camera.position.set(distance * 0.7, distance * 1.1, distance * 0.7);
        controlsRef.current.target.set(0, size.y / 2, 0);
        controlsRef.current.update();
      }
    } catch (e) {
      console.error('Error al procesar STL en Three.js:', e);
    }
  }, [stlData]);

  // Actualizar modo wireframe
  useEffect(() => {
    if (meshRef.current && meshRef.current.material) {
      meshRef.current.material.wireframe = wireframe;
    }
  }, [wireframe]);

  const handleResetCamera = () => {
    if (controlsRef.current && meshRef.current) {
      meshRef.current.geometry.computeBoundingBox();
      const size = new THREE.Vector3();
      meshRef.current.geometry.boundingBox.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z);
      const distance = maxDim * 2.0;
      const camera = controlsRef.current.object;
      camera.position.set(distance * 0.9, distance * 0.9, distance * 0.9);
      controlsRef.current.target.set(0, size.y / 2, 0);
      controlsRef.current.update();
    }
  };

  return (
    <div className="viewport-card">
      {/* Cabecera del Viewport */}
      <div className="viewport-card-header">
        <div className="viewport-title-badge">
          <span>{piece.name}</span>
        </div>

        <div className="viewport-actions">
          <Button
            variant="secondary"
            isIcon
            size="sm"
            onClick={() => setWireframe((v) => !v)}
            title={wireframe ? 'Ver sólido' : 'Ver malla (Wireframe)'}
          >
            <Eye size={14} />
          </Button>

          <Button
            variant="secondary"
            isIcon
            size="sm"
            onClick={handleResetCamera}
            title="Centrar cámara"
          >
            <RotateCcw size={14} />
          </Button>

          <Button
            variant="secondary"
            isIcon
            size="sm"
            onClick={() => onToggleMaximize(piece.id)}
            title={isMaximized ? 'Restaurar cuadrícula' : 'Maximizar vista'}
          >
            {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </Button>
        </div>
      </div>

      {/* Canvas 3D */}
      <div ref={containerRef} className="viewport-canvas-container" />

      {/* Overlay de carga */}
      {isLoading && (
        <div className="viewport-loader">
          <div className="spinner" />
          <span>Compilando {piece.name}...</span>
        </div>
      )}

      {/* Mensaje de error si falla */}
      {error && !isLoading && (
        <div className="viewport-loader" style={{ color: 'var(--color-danger)' }}>
          <span>Error de compilación</span>
          <span style={{ fontSize: 11, maxWidth: '80%', textAlign: 'center' }}>{error}</span>
        </div>
      )}

      {/* Footer con dimensiones y botón de descarga individual */}
      <div className="viewport-footer">
        <div className="viewport-stats">
          {stats.dimensions ? `${stats.dimensions} | ${stats.facets} polígonos` : 'Calculando...'}
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => onDownloadSingle(piece.id)}
          disabled={!stlData || isLoading || isExportingHD}
          title="Descargar solo este archivo STL en alta definición ($fn=80)"
        >
          {isExportingHD ? (
            <>
              <div className="spinner" style={{ width: 12, height: 12, borderWidth: 2 }} />
              <span>Generando HD...</span>
            </>
          ) : (
            <>
              <Download size={13} />
              <span>STL</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
