# Mesa Palo de Escoba - Configurador 3D Paramétrico

Visor y configurador web interactivo para las 4 piezas paramétricas en OpenSCAD de la mesa con patas de palo de escoba.

![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Three.js](https://img.shields.io/badge/Three.js-3D-black?logo=three.js)
![OpenSCAD](https://img.shields.io/badge/OpenSCAD-WebAssembly-F6A418)

---

## 🚀 Características

1. **Sincronización Global de Parámetros**:
   - Modifica el diámetro del palo (`pole_diameter`), inclinación (`leg_angle`), grosor estructural o tornillos y las 4 piezas se recalculan automáticamente en cadena.
2. **Visor 3D Cuádruple en Tiempo Real**:
   - 4 viewports Three.js interactivos independientes con control orbital, zoom, iluminación dinámica, modo wireframe y cálculo automático de dimensiones/polígonos.
3. **Exportación STL con 1 Click**:
   - Descarga individual por pieza o descarga masiva de las 4 piezas empaquetadas en un archivo `.ZIP` de alta resolución ($fn=80) listas para laminar e imprimir en 3D.
4. **Diseño Modular y Desacoplado**:
   - Sistema de tokens de diseño (`src/styles/tokens.css`) con soporte nativo para **Modo Oscuro / Modo Claro**.
   - Componentes UI primitivos reutilizables (`Button`, `ParamSlider`, `ParamToggle`, etc.).
5. **Single Source of Truth para los archivos `.scad`**:
   - Los archivos `.scad` en la raíz son la fuente original de la aplicación. Cualquier edición en los scripts OpenSCAD se refleja inmediatamente en el visor con Hot Module Replacement (HMR).

---

## 📂 Archivos del Proyecto

* **`Patas.scad`**: Soporte / brida para unir las patas de palo de escoba a las 4 esquinas de la mesa con llave diagonal de posicionamiento único (Poka-Yoke).
* **`Abrazadera_Pata.scad`**: Manguito deslizante para las patas que conecta los palos de refuerzo en diagonal (X) manteniéndolos horizontales.
* **`Cruceta_Centro.scad`**: Pieza central flotante que une los dos palos de refuerzo diagonal en el cruce sin necesidad de cortarlos.
* **`Guia_Esquina.scad`**: Plantilla de esquina para perforar y montar las bridas a la distancia exacta de los bordes.

---

## 🛠️ Instalación y Uso Local

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev

# 3. Compilar para producción
npm run build
```

---

## 🌐 Despliegue en Vercel

1. Sube este repositorio a GitHub (`https://github.com/Chugeno/mesa-palo-de-escoba.git`).
2. En [Vercel](https://vercel.com), haz click en **"Add New Project"** e importa este repositorio.
3. Vercel detectará **Vite** automáticamente con el comando `npm run build` y la carpeta `dist`.
4. Haz click en **Deploy** y tu configurador quedará publicado online con costo cero.
