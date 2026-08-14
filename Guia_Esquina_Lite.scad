// =================================================================
// GUÍA / PLANTILLA DE ESQUINA ULTRA-LIGERA (SKELETON / DUAL RAIL)
// Diseño con matemáticas directas y simples: Escuadra a 90°,
// puente diagonal de rieles paralelos y marco Poka-Yoke cerrado.
// =================================================================

/* [Dimensiones de la Mesa y Posición] */
// @studio {"label":"Distancia al borde X de la mesa","description":"Distancia en mm desde el canto X hasta la base","unit":"mm","group":"Mesa"}
edge_offset_x = 40; // [10:1:100]

// @studio {"label":"Distancia al borde Y de la mesa","description":"Distancia en mm desde el canto Y hasta la base","unit":"mm","group":"Mesa"}
edge_offset_y = 40; // [10:1:100]

// @studio {"label":"Altura del tope de borde (Labio)","description":"Profundidad de las aletas de escuadra","unit":"mm","group":"Mesa"}
table_lip_height = 18; // [10:1:35]

// @studio {"label":"Largo del labio en los bordes","description":"Longitud de las aletas de apoyo en cada canto","unit":"mm","group":"Mesa"}
table_lip_length = 40; // [25:1:80]

// @studio {"label":"Grosor del labio de tope","description":"Espesor de pared de las aletas laterales","unit":"mm","group":"Mesa"}
table_lip_thickness = 3.5; // [2.5:0.5:8]

/* [Parámetros de la Brida (Coincidentes con Patas.scad)] */
// @studio {"label":"Diámetro nominal del palo","description":"Diámetro medido del palo de madera en mm","unit":"mm","group":"Soporte"}
pole_diameter = 22.0; // [15:0.5:50]

// @studio {"label":"Holgura del palo","description":"Holgura diametral configurada en Patas.scad","unit":"mm","group":"Soporte"}
pole_clearance = 0.4; // [0.1:0.05:1.0]

// @studio {"label":"Margen base respecto al palo","description":"Mismo valor configurado en Patas.scad","unit":"mm","group":"Soporte"}
base_margin = 52.5; // [30:0.5:80]

// @studio {"label":"Radio de esquinas estándar","description":"Mismo valor configurado en Patas.scad","unit":"mm","group":"Soporte"}
corner_radius = 8; // [3:1:20]

// @studio {"label":"Tamaño de la llave diagonal","description":"Mismo valor configurado en Patas.scad","unit":"mm","group":"Soporte"}
key_chamfer = 18; // [8:1:35]

// @studio {"label":"Redondeo puntas de la diagonal","description":"Mismo valor configurado en Patas.scad","unit":"mm","group":"Soporte"}
chamfer_radius = 4; // [1:0.5:10]

/* [Estructura Esqueleto de Rieles Paralelos] */
// @studio {"label":"Espesor de la plantilla","description":"Grosor del cuerpo plano esquelético","unit":"mm","group":"Estructura"}
jig_thickness = 4.5; // [3:0.5:8]

// @studio {"label":"Ancho total del puente diagonal","description":"Ancho del bloque que contiene los dos rieles paralelos","unit":"mm","group":"Estructura"}
beam_width = 30; // [20:1:45]

// @studio {"label":"Ancho del canal hueco central","description":"Espacio vacío entre los dos rieles paralelos","unit":"mm","group":"Estructura"}
slot_width = 16; // [6:1:24]

// @studio {"label":"Grosor del marco del cajeado","description":"Espesor del anillo perimetral cerrado que abraza la brida","unit":"mm","group":"Estructura"}
rim_thickness = 4.5; // [3:0.5:10]

// @studio {"label":"Holgura de encastre de la brida","description":"Holgura perimetral para encastrar la brida","unit":"mm","group":"Estructura"}
fit_clearance = 0.35; // [0.1:0.05:1.0]

// @studio {"label":"Orientación de la pata","description":"225° apunta la inclinación directo hacia la esquina","unit":"deg","group":"Estructura"}
bracket_angle = 225; // [0:15:360]

/* [Detalles y Calidad] */
$fn = 80;

// --- CÁLCULOS GEOMÉTRICOS SIMPLIFICADOS ---
base_size = pole_diameter + base_margin;
half_base = base_size / 2;

// Distancia radial desde el centro de la base hasta la esquina más lejana
extent_to_corner = sqrt(2) * (half_base - corner_radius) + corner_radius;

// Coordenadas del centro de la brida
center_x = edge_offset_x + extent_to_corner;
center_y = edge_offset_y + extent_to_corner;

// Longitud diagonal desde la esquina de la mesa (0,0) hasta el centro de la brida
diag_len = sqrt(center_x * center_x + center_y * center_y);

// Puntos de inicio y fin de la ranura central (se detiene antes del marco cerrado)
dist_to_corner_wall = sqrt(edge_offset_x * edge_offset_x + edge_offset_y * edge_offset_y);
slot_start = 14;
slot_end = dist_to_corner_wall - rim_thickness - 1;

// Perfil 2D del cajeado de la brida
module base_pocket_2d(size, r, c, r_ch, clearance = 0) {
    half = size / 2;
    safe_r = min(r, half * 0.35);
    safe_c = min(c, half * 0.6);
    safe_r_ch = min(r_ch, safe_c * 0.35);
    k_offset = 0.4142 * safe_r_ch; // (sqrt(2) - 1) para tangencia suave
    
    offset(r = clearance)
    hull() {
        // Esquina 1 (+X, +Y): Dos círculos tangentes del corte diagonal (Llave Poka-Yoke)
        translate([half - safe_c - k_offset, half - safe_r_ch]) circle(r = safe_r_ch);
        translate([half - safe_r_ch, half - safe_c - k_offset]) circle(r = safe_r_ch);
        
        // Esquinas 2, 3 y 4: Redondeos estándar
        translate([-half + safe_r,  half - safe_r]) circle(r = safe_r);
        translate([-half + safe_r, -half + safe_r]) circle(r = safe_r);
        translate([ half - safe_r, -half + safe_r]) circle(r = safe_r);
    }
}

// Estructura 2D sólida: Esquina + Puente diagonal continuo + Marco de brida
module skeleton_frame_2d() {
    union() {
        // 1. Escuadra en la esquina a 90° exactos
        translate([0, 0])
        square([table_lip_length, table_lip_length]);

        // 2. Puente diagonal recto a 45° que conecta con el marco
        rotate([0, 0, 45])
        translate([0, -beam_width / 2])
        square([diag_len, beam_width]);

        // 3. Marco perimetral cerrado (360°) que abraza la brida
        translate([center_x, center_y])
        rotate([0, 0, bracket_angle])
        base_pocket_2d(base_size, corner_radius, key_chamfer, chamfer_radius, clearance = rim_thickness);
    }
}

module corner_jig_lite() {
    difference() {
        union() {
            // A. Cuerpo plano esquelético de la plantilla (Z >= 0)
            linear_extrude(height = jig_thickness)
            skeleton_frame_2d();

            // B. Labio / Tope contra el borde X de la mesa (Y <= 0, Z < 0)
            translate([-table_lip_thickness, -table_lip_thickness, -table_lip_height])
            cube([table_lip_length + table_lip_thickness, table_lip_thickness, table_lip_height + jig_thickness]);

            // C. Labio / Tope contra el borde Y de la mesa (X <= 0, Z < 0)
            translate([-table_lip_thickness, -table_lip_thickness, -table_lip_height])
            cube([table_lip_thickness, table_lip_length + table_lip_thickness, table_lip_height + jig_thickness]);
        }

        // --- SUBTRACCIONES / PERFORACIONES ---

        // 1. Cajeado pasante con la forma exacta Poka-Yoke (Marco completo de 360°)
        translate([center_x, center_y, -1])
        rotate([0, 0, bracket_angle])
        linear_extrude(height = jig_thickness + 2)
        base_pocket_2d(base_size, corner_radius, key_chamfer, chamfer_radius, clearance = fit_clearance);

        // 2. Ranura central hueca que forma los dos rieles paralelos
        if (slot_end > slot_start + slot_width) {
            rotate([0, 0, 45])
            hull() {
                translate([slot_start + slot_width / 2, 0, -1])
                cylinder(d = slot_width, h = jig_thickness + 2);

                translate([slot_end - slot_width / 2, 0, -1])
                cylinder(d = slot_width, h = jig_thickness + 2);
            }
        }

        // 3. Grabado identificatorio
        translate([table_lip_length * 0.45, 4, jig_thickness - 0.6])
        linear_extrude(height = 1)
        text("40mm", size = 3.5, halign = "center", valign = "center", font = "Arial:style=Bold");
    }
}

// Volteado para impresión (boca arriba / labios hacia arriba, imprime 100% sin soportes)
translate([0, 0, jig_thickness])
rotate([180, 0, 0])
corner_jig_lite();
