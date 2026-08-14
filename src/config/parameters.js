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
  },
  abrazadera: {
    id: 'abrazadera',
    name: '2. Abrazadera de Pata',
    fileName: 'Abrazadera_Pata.scad',
    exportName: 'Abrazadera_Pata.stl',
    description: 'Manguito deslizante con socket horizontal para el palo de refuerzo en X.',
  },
  cruceta: {
    id: 'cruceta',
    name: '3. Cruceta Central en X',
    fileName: 'Cruceta_Centro.scad',
    exportName: 'Cruceta_Centro.stl',
    description: 'Pieza flotante que conecta dos palos en diagonal en el cruce central.',
  },
  guia: {
    id: 'guia',
    name: '4. Guía / Plantilla Esquina Lite',
    fileName: 'Guia_Esquina_Lite.scad',
    exportName: 'Guia_Esquina_Lite.stl',
    description: 'Plantilla de montaje esquelética con rieles paralelos para taladrar la brida a la distancia exacta de los bordes.',
  },
};

/**
 * DEFINICIÓN DE PARÁMETROS
 */
export const PARAM_DEFINITIONS = [
  // ==========================================
  // PARÁMETROS GLOBALES (Afectan a todo)
  // ==========================================
  {
    id: 'pole_diameter',
    label: 'Diámetro del Palo',
    description: 'Diámetro exterior de los palos de escoba en mm (nominal)',
    unit: 'mm',
    min: 15,
    max: 40,
    step: 0.5,
    defaultValue: 22.0,
    isGlobal: true,
    affects: ['patas', 'abrazadera', 'cruceta', 'guia'],
    group: 'global',
  },
  {
    id: 'pole_clearance',
    label: 'Holgura del Palo',
    description: 'Espacio diametral adicional para el deslizamiento del palo',
    unit: 'mm',
    min: 0.1,
    max: 1.0,
    step: 0.05,
    defaultValue: 0.4,
    isGlobal: true,
    affects: ['patas', 'abrazadera', 'cruceta', 'guia'],
    group: 'global',
  },
  {
    id: 'table_length',
    label: 'Largo de la Mesa',
    description: 'Medida longitudinal para calcular la diagonal exacta en X',
    unit: 'mm',
    min: 100,
    max: 2000,
    step: 50,
    defaultValue: 1000,
    isGlobal: true,
    affects: ['cruceta'],
    group: 'global',
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
    isGlobal: true,
    affects: ['cruceta'],
    group: 'global',
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
    isGlobal: true,
    affects: ['patas', 'abrazadera', 'cruceta'],
    group: 'global',
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
    isGlobal: true,
    affects: ['patas', 'abrazadera', 'cruceta'],
    group: 'global',
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
    isGlobal: true,
    affects: ['patas', 'abrazadera'],
    group: 'global',
  },
  {
    id: 'base_margin',
    label: 'Margen de Base',
    description: 'Margen para calcular el ancho de la placa cuadrada (Patas y Guía)',
    unit: 'mm',
    min: 30,
    max: 80,
    step: 0.5,
    defaultValue: 52.5,
    isGlobal: true,
    affects: ['patas', 'guia'],
    group: 'global',
  },

  // ==========================================
  // PARÁMETROS ESPECÍFICOS - PATAS
  // ==========================================
  {
    id: 'socket_height',
    label: 'Profundidad de Inserción (Pata)',
    description: 'Altura del tubo receptor del palo en la base',
    unit: 'mm',
    min: 25,
    max: 80,
    step: 1,
    defaultValue: 45,
    isGlobal: false,
    affects: ['patas'],
    group: 'patas',
  },
  {
    id: 'side_screw',
    label: 'Tornillo lateral de opresión',
    description: 'Agujero lateral para fijar el palo al tubo con un tornillo',
    type: 'boolean',
    defaultValue: true,
    isGlobal: false,
    affects: ['patas'],
    group: 'patas',
  },
  {
    id: 'second_side_screw',
    label: 'Segundo tornillo cruzado',
    description: 'Agrega un segundo tornillo transversal para mayor rigidez',
    type: 'boolean',
    defaultValue: true,
    isGlobal: false,
    affects: ['patas'],
    group: 'patas',
  },

  // ==========================================
  // PARÁMETROS ESPECÍFICOS - ABRAZADERA
  // ==========================================
  {
    id: 'brace_diameter',
    label: 'Diámetro Palo Refuerzo (X)',
    description: 'Diámetro del palo de refuerzo diagonal',
    unit: 'mm',
    min: 15,
    max: 40,
    step: 0.5,
    defaultValue: 22.0,
    isGlobal: false,
    affects: ['abrazadera'],
    group: 'abrazadera',
  },
  {
    id: 'brace_clearance',
    label: 'Holgura del Refuerzo (X)',
    description: 'Espacio diametral adicional para el palo del refuerzo en X',
    unit: 'mm',
    min: 0.1,
    max: 1.0,
    step: 0.05,
    defaultValue: 0.4,
    isGlobal: false,
    affects: ['abrazadera'],
    group: 'abrazadera',
  },
  {
    id: 'socket_length',
    label: 'Largo Socket Refuerzo',
    description: 'Profundidad del receptor para el palo horizontal en X',
    unit: 'mm',
    min: 20,
    max: 60,
    step: 1,
    defaultValue: 35,
    isGlobal: false,
    affects: ['abrazadera'],
    group: 'abrazadera',
  },
  {
    id: 'clamp_height',
    label: 'Altura del Manguito',
    description: 'Altura del cilindro que desliza por la pata',
    unit: 'mm',
    min: 30,
    max: 70,
    step: 1,
    defaultValue: 45,
    isGlobal: false,
    affects: ['abrazadera'],
    group: 'abrazadera',
  },

  // ==========================================
  // PARÁMETROS ESPECÍFICOS - CRUCETA
  // ==========================================
  {
    id: 'vertical_clearance',
    label: 'Separación Vertical Palos',
    description: 'Luz libre en Z para evitar que los palos se toquen en el centro',
    unit: 'mm',
    min: 0,
    max: 10,
    step: 0.5,
    defaultValue: 2,
    isGlobal: false,
    affects: ['cruceta'],
    group: 'cruceta',
  },

  // ==========================================
  // PARÁMETROS ESPECÍFICOS - GUÍA ESQUINA
  // ==========================================
  {
    id: 'edge_offset_x',
    label: 'Distancia al Borde X',
    description: 'Offset desde el canto X de la mesa al inicio de la brida',
    unit: 'mm',
    min: 10,
    max: 100,
    step: 1,
    defaultValue: 40,
    isGlobal: false,
    affects: ['guia'],
    group: 'guia',
  },
  {
    id: 'edge_offset_y',
    label: 'Distancia al Borde Y',
    description: 'Offset desde el canto Y de la mesa al inicio de la brida',
    unit: 'mm',
    min: 10,
    max: 100,
    step: 1,
    defaultValue: 40,
    isGlobal: false,
    affects: ['guia'],
    group: 'guia',
  },
  {
    id: 'table_lip_height',
    label: 'Tope de Borde (Labio)',
    description: 'Profundidad de las aletas de apoyo que abrazan la mesa',
    unit: 'mm',
    min: 10,
    max: 45,
    step: 1,
    defaultValue: 20,
    isGlobal: false,
    affects: ['guia'],
    group: 'guia',
  },
  {
    id: 'fit_clearance',
    label: 'Holgura de Encastre',
    description: 'Tolerancia perimetral para encastrar la brida suavemente',
    unit: 'mm',
    min: 0.1,
    max: 1.0,
    step: 0.05,
    defaultValue: 0.35,
    isGlobal: false,
    affects: ['guia'],
    group: 'guia',
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
  if (paramValues.base_margin !== undefined) {
    flags.push('-D', `base_margin=${paramValues.base_margin}`);
  }
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
