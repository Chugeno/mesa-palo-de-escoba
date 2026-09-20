/**
 * CONFIGURACIÓN DE PARÁMETROS Y MAPEO DE PIEZAS
 */

export const PIECES = {
  patas: {
    id: 'patas',
    name: '1. Soporte de Pata',
    fileName: 'Patas.scad',
    exportName: 'Soporte_Pata.stl',
    description: 'Brida de esquina para fijar el palo de escoba inclinado a la mesa con llave diagonal poka-yoke.',
    category: 'basic',
  },
  guia: {
    id: 'guia',
    name: '2. Guía / Plantilla Esquina Lite',
    fileName: 'Guia_Esquina_Lite.scad',
    exportName: 'Guia_Esquina_Lite.stl',
    description: 'Plantilla de montaje esquelética con rieles paralelos para taladrar la brida a la distancia exacta de los bordes.',
    category: 'basic',
  },
  abrazadera: {
    id: 'abrazadera',
    name: '3. Abrazadera de Pata',
    fileName: 'Abrazadera_Pata.scad',
    exportName: 'Abrazadera_Pata.stl',
    description: 'Manguito deslizante con socket horizontal para el palo de refuerzo en X.',
    category: 'reinforcement',
  },
  cruceta: {
    id: 'cruceta',
    name: '4. Cruceta Central en X',
    fileName: 'Cruceta_Centro.scad',
    exportName: 'Cruceta_Centro.stl',
    description: 'Pieza flotante que conecta dos palos en diagonal en el cruce central.',
    category: 'reinforcement',
  },
};

/**
 * DEFINICIÓN DE PARÁMETROS
 */
export const PARAM_DEFINITIONS = [
  // ==========================================
  // SECCIÓN BÁSICO
  // ==========================================
  {
    id: 'pole_diameter',
    label: 'Diámetro del Palo',
    description: 'Diámetro exterior del palo de escoba en mm (nominal)',
    unit: 'mm',
    min: 15,
    max: 40,
    step: 0.5,
    defaultValue: 22.0,
    section: 'basic',
    affects: ['patas', 'abrazadera', 'cruceta', 'guia'],
  },

  // ==========================================
  // SECCIÓN REFUERZO
  // ==========================================
  {
    id: 'table_length',
    label: 'Largo de la Mesa',
    description: 'Medida longitudinal para calcular la diagonal exacta en X',
    unit: 'mm',
    min: 100,
    max: 2000,
    step: 50,
    defaultValue: 1000,
    section: 'reinforcement',
    affects: ['cruceta'],
  },
  {
    id: 'table_width',
    label: 'Ancho de la Mesa',
    description: 'Medida transversal para calcular la diagonal exacta en X',
    unit: 'mm',
    min: 100,
    max: 2000,
    step: 50,
    defaultValue: 600,
    section: 'reinforcement',
    affects: ['cruceta'],
  },
  {
    id: 'brace_diameter',
    label: 'Diámetro del Palo de Refuerzo',
    description: 'Diámetro del palo de refuerzo diagonal en mm',
    unit: 'mm',
    min: 15,
    max: 40,
    step: 0.5,
    defaultValue: 22.0,
    section: 'reinforcement',
    affects: ['abrazadera'],
  },
  {
    id: 'clamp_height',
    label: 'Altura de la Abrazadera',
    description: 'Altura del cilindro que desliza por la pata',
    unit: 'mm',
    min: 30,
    max: 70,
    step: 1,
    defaultValue: 45,
    section: 'reinforcement',
    affects: ['abrazadera'],
  },

  // ==========================================
  // SECCIÓN AVANZADO - Estructura y Pata
  // ==========================================
  {
    id: 'pole_clearance',
    label: 'Holgura del Palo',
    description: 'Espacio diametral adicional para el deslizamiento del palo',
    unit: 'mm',
    min: 0.1,
    max: 1.0,
    step: 0.05,
    defaultValue: 0.4,
    section: 'advanced',
    subgroup: 'Estructura y Pata',
    affects: ['patas', 'abrazadera', 'cruceta', 'guia'],
  },
  {
    id: 'wall_thickness',
    label: 'Grosor de Pared Estructural',
    description: 'Espesor de pared de los tubos y cuerpos',
    unit: 'mm',
    min: 2.5,
    max: 7,
    step: 0.5,
    defaultValue: 3.5,
    section: 'advanced',
    subgroup: 'Estructura y Pata',
    affects: ['patas', 'abrazadera', 'cruceta'],
  },
  {
    id: 'screw_diameter',
    label: 'Diámetro Tornillos Mesa',
    description: 'Diámetro de los tornillos para madera de la brida y abrazadera',
    unit: 'mm',
    min: 3,
    max: 6,
    step: 0.5,
    defaultValue: 4.5,
    section: 'advanced',
    subgroup: 'Estructura y Pata',
    affects: ['patas', 'abrazadera', 'cruceta'],
  },
  {
    id: 'leg_angle',
    label: 'Inclinación de la Pata',
    description: 'Ángulo de apertura de las patas hacia afuera respecto a la vertical',
    unit: '°',
    min: 0,
    max: 20,
    step: 1,
    defaultValue: 10,
    section: 'advanced',
    subgroup: 'Estructura y Pata',
    affects: ['patas', 'abrazadera'],
  },
  {
    id: 'base_size',
    label: 'Tamaño Base (Fijo)',
    description: 'Ancho y largo fijo de la placa base donde se atornilla la pata (Patas y Guía)',
    unit: 'mm',
    min: 60,
    max: 100,
    step: 1,
    defaultValue: 76,
    section: 'advanced',
    subgroup: 'Estructura y Pata',
    affects: ['patas', 'guia'],
  },
  {
    id: 'socket_height',
    label: 'Profundidad del Tubo de la Pata',
    description: 'Altura del tubo receptor del palo en la base',
    unit: 'mm',
    min: 25,
    max: 80,
    step: 1,
    defaultValue: 45,
    section: 'advanced',
    subgroup: 'Estructura y Pata',
    affects: ['patas'],
  },
  {
    id: 'side_screw',
    label: 'Tornillo lateral de fijación',
    description: 'Agujero lateral para fijar el palo al tubo con un tornillo',
    type: 'boolean',
    defaultValue: true,
    section: 'advanced',
    subgroup: 'Estructura y Pata',
    affects: ['patas'],
  },
  {
    id: 'second_side_screw',
    label: 'Segundo tornillo cruzado',
    description: 'Agrega un segundo tornillo transversal para mayor rigidez',
    type: 'boolean',
    defaultValue: true,
    section: 'advanced',
    subgroup: 'Estructura y Pata',
    affects: ['patas'],
  },

  // ==========================================
  // SECCIÓN AVANZADO - Ajustes de Refuerzo
  // ==========================================
  {
    id: 'socket_length',
    label: 'Profundidad de Inserción del Refuerzo',
    description: 'Profundidad del receptor para el palo horizontal en X',
    unit: 'mm',
    min: 20,
    max: 60,
    step: 1,
    defaultValue: 35,
    section: 'advanced',
    subgroup: 'Refuerzo Detallado',
    affects: ['abrazadera'],
  },
  {
    id: 'brace_clearance',
    label: 'Holgura del Palo de Refuerzo',
    description: 'Espacio diametral adicional para el palo del refuerzo en X',
    unit: 'mm',
    min: 0.1,
    max: 1.0,
    step: 0.05,
    defaultValue: 0.4,
    section: 'advanced',
    subgroup: 'Refuerzo Detallado',
    affects: ['abrazadera'],
  },
  {
    id: 'vertical_clearance',
    label: 'Separación Vertical entre Palos',
    description: 'Luz libre en Z para evitar que los palos se toquen en el cruce central',
    unit: 'mm',
    min: 0,
    max: 10,
    step: 0.5,
    defaultValue: 2,
    section: 'advanced',
    subgroup: 'Refuerzo Detallado',
    affects: ['cruceta'],
  },

  // ==========================================
  // SECCIÓN AVANZADO - Plantilla Guía
  // ==========================================
  {
    id: 'edge_offset_x',
    label: 'Distancia al Borde X (Plantilla)',
    description: 'Offset desde el canto X de la mesa al inicio de la brida',
    unit: 'mm',
    min: 10,
    max: 100,
    step: 1,
    defaultValue: 40,
    section: 'advanced',
    subgroup: 'Plantilla Guía',
    affects: ['guia'],
  },
  {
    id: 'edge_offset_y',
    label: 'Distancia al Borde Y (Plantilla)',
    description: 'Offset desde el canto Y de la mesa al inicio de la brida',
    unit: 'mm',
    min: 10,
    max: 100,
    step: 1,
    defaultValue: 40,
    section: 'advanced',
    subgroup: 'Plantilla Guía',
    affects: ['guia'],
  },
  {
    id: 'table_lip_height',
    label: 'Altura del Labio de la Plantilla',
    description: 'Profundidad de las aletas de apoyo que abrazan la mesa',
    unit: 'mm',
    min: 10,
    max: 45,
    step: 1,
    defaultValue: 20,
    section: 'advanced',
    subgroup: 'Plantilla Guía',
    affects: ['guia'],
  },
  {
    id: 'fit_clearance',
    label: 'Holgura de Encastre de la Plantilla',
    description: 'Tolerancia perimetral para encastrar la brida suavemente',
    unit: 'mm',
    min: 0.1,
    max: 1.0,
    step: 0.05,
    defaultValue: 0.35,
    section: 'advanced',
    subgroup: 'Plantilla Guía',
    affects: ['guia'],
  },
];

/**
 * Obtiene el objeto de valores por defecto
 */
export function getDefaultParamValues() {
  const defaults = {};
  PARAM_DEFINITIONS.forEach((p) => {
    defaults[p.id] = p.defaultValue;
  });
  return defaults;
}

/**
 * Genera el array de argumentos `-D` para OpenSCAD CLI
 * @param {Object} paramValues Valores actuales de los parámetros
 * @param {number} fnValue Valor de resolución geométrica $fn
 * @returns {string[]} Array de flags ['-D', 'var=val', ...]
 */
export function generateDFlags(paramValues, fnValue = 36) {
  const flags = ['-D', `$fn=${fnValue}`];

  if (paramValues.pole_diameter !== undefined) {
    flags.push('-D', `pole_diameter=${paramValues.pole_diameter}`);
  }
  if (paramValues.pole_clearance !== undefined) {
    flags.push('-D', `pole_clearance=${paramValues.pole_clearance}`);
  }
  if (paramValues.leg_angle !== undefined) {
    flags.push('-D', `leg_angle=${paramValues.leg_angle}`);
  }
  if (paramValues.wall_thickness !== undefined) {
    flags.push('-D', `wall_thickness=${paramValues.wall_thickness}`);
  }
  if (paramValues.screw_diameter !== undefined) {
    flags.push('-D', `screw_diameter=${paramValues.screw_diameter}`);
    flags.push('-D', `leg_screw_diameter=${paramValues.screw_diameter}`);
  }
  const baseSize = paramValues.base_size !== undefined ? paramValues.base_size : 76;
  flags.push('-D', `base_size=${baseSize}`);
  if (paramValues.socket_height !== undefined) {
    flags.push('-D', `socket_height=${paramValues.socket_height}`);
  }
  if (paramValues.side_screw !== undefined) {
    flags.push('-D', `side_screw=${paramValues.side_screw ? 'true' : 'false'}`);
  }
  if (paramValues.second_side_screw !== undefined) {
    flags.push('-D', `second_side_screw=${paramValues.second_side_screw ? 'true' : 'false'}`);
  }
  if (paramValues.brace_diameter !== undefined) {
    flags.push('-D', `brace_diameter=${paramValues.brace_diameter}`);
  }
  if (paramValues.brace_clearance !== undefined) {
    flags.push('-D', `brace_clearance=${paramValues.brace_clearance}`);
  }
  if (paramValues.socket_length !== undefined) {
    flags.push('-D', `socket_length=${paramValues.socket_length}`);
  }
  if (paramValues.clamp_height !== undefined) {
    flags.push('-D', `clamp_height=${paramValues.clamp_height}`);
  }
  if (paramValues.table_length !== undefined) {
    flags.push('-D', `table_length=${paramValues.table_length}`);
  }
  if (paramValues.table_width !== undefined) {
    flags.push('-D', `table_width=${paramValues.table_width}`);
  }
  if (paramValues.vertical_clearance !== undefined) {
    flags.push('-D', `vertical_clearance=${paramValues.vertical_clearance}`);
  }
  if (paramValues.edge_offset_x !== undefined) {
    flags.push('-D', `edge_offset_x=${paramValues.edge_offset_x}`);
  }
  if (paramValues.edge_offset_y !== undefined) {
    flags.push('-D', `edge_offset_y=${paramValues.edge_offset_y}`);
  }
  if (paramValues.table_lip_height !== undefined) {
    flags.push('-D', `table_lip_height=${paramValues.table_lip_height}`);
  }
  if (paramValues.fit_clearance !== undefined) {
    flags.push('-D', `fit_clearance=${paramValues.fit_clearance}`);
  }

  return flags;
}
