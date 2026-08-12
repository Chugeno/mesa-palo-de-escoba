// =================================================================
// GUÍA / PLANTILLA DE ESQUINA PARA MONTAJE DE PATAS DE MESA
// Posiciona la brida a 40 mm exactos de ambos bordes de la mesa
// y con la pata inclinada apuntando directo a la esquina.
// =================================================================

/* [Dimensiones de la Mesa y Posición] */
// @studio {"label":"Distancia al borde X de la mesa","description":"Distancia en mm desde el canto X de la mesa hasta el punto más cercano de la base","unit":"mm","group":"Mesa"}
edge_offset_x = 40; // [10:1:100]

// @studio {"label":"Distancia al borde Y de la mesa","description":"Distancia en mm desde el canto Y de la mesa hasta el punto más cercano de la base","unit":"mm","group":"Mesa"}
edge_offset_y = 40; // [10:1:100]

// @studio {"label":"Altura del tope de borde (Labio)","description":"Profundidad de las aletas que abrazan los cantos de la mesa hacia abajo","unit":"mm","group":"Mesa"}
table_lip_height = 20; // [10:1:45]

// @studio {"label":"Grosor del labio de tope","description":"Espesor de las paredes laterales de apoyo","unit":"mm","group":"Mesa"}
table_lip_thickness = 5; // [3:1:10]

/* [Parámetros de la Brida (Coincidentes con Patas.scad)] */
// @studio {"label":"Diámetro del palo","description":"Mismo valor configurado en Patas.scad","unit":"mm","group":"Soporte"}
pole_diameter = 22.5; // [15:0.5:50]

// @studio {"label":"Margen base respecto al palo","description":"Mismo valor configurado en Patas.scad","unit":"mm","group":"Soporte"}
base_margin = 52.5; // [30:0.5:80]

// @studio {"label":"Radio de esquinas estándar","description":"Mismo valor configurado en Patas.scad","unit":"mm","group":"Soporte"}
corner_radius = 8; // [3:1:20]

// @studio {"label":"Tamaño de la llave diagonal","description":"Mismo valor configurado en Patas.scad","unit":"mm","group":"Soporte"}
key_chamfer = 18; // [8:1:35]

// @studio {"label":"Redondeo puntas de la diagonal","description":"Mismo valor configurado en Patas.scad","unit":"mm","group":"Soporte"}
chamfer_radius = 4; // [1:0.5:10]

/* [Ajuste y Estructura de la Guía] */
// @studio {"label":"Holgura de encastre (Tolerancia)","description":"Holgura perimetral para encastrar la brida sin juego ni holgura excesiva","unit":"mm","group":"Guia"}
fit_clearance = 0.35; // [0.1:0.05:1.0]

// @studio {"label":"Espesor de la placa de la guía","description":"Grosor de la base plana de la plantilla","unit":"mm","group":"Guia"}
jig_thickness = 6; // [4:1:12]

// @studio {"label":"Margen estructural alrededor del cajeado","description":"Espesor del marco que rodea el encastre","unit":"mm","group":"Guia"}
frame_margin = 12; // [8:1:25]

// @studio {"label":"Orientación de la pata","description":"225° apunta la inclinación de la pata directo hacia la esquina de la mesa","unit":"deg","group":"Guia"}
bracket_angle = 225; // [0:15:360]

/* [Detalles y Calidad] */
$fn = 80;

// Variables calculadas
base_size = pole_diameter + base_margin;
half_base = base_size / 2;

// Distancia desde el centro de la pieza girada 45° hasta su punto exterior más cercano a los bordes
extent_to_corner = sqrt(2) * (half_base - corner_radius) + corner_radius;

// Coordenadas del centro de la brida para cumplir exactamente el offset deseado
center_x = edge_offset_x + extent_to_corner;
center_y = edge_offset_y + extent_to_corner;

// Longitud de los brazos de apoyo contra la mesa para máxima estabilidad angular
arm_length_x = center_x + extent_to_corner + frame_margin;
arm_length_y = center_y + extent_to_corner + frame_margin;

// Radio exterior envolvente del cuerpo de la guía
r_outer_frame = extent_to_corner + frame_margin;

// Perfil 2D del cajeado de la base con holgura
module base_pocket_2d(size, r, c, r_ch, clearance = 0) {
    half = size / 2;
    k_offset = (sqrt(2) - 1) * r_ch;
    
    offset(r = clearance)
    hull() {
        // Esquina 1 (+X, +Y): Dos círculos tangentes del corte diagonal (Llave Poka-Yoke)
        translate([half - c - k_offset, half - r_ch]) circle(r = r_ch);
        translate([half - r_ch, half - c - k_offset]) circle(r = r_ch);
        
        // Esquinas 2, 3 y 4: Redondeos estándar
        translate([-half + r,  half - r]) circle(r = r);
        translate([-half + r, -half + r]) circle(r = r);
        translate([ half - r, -half + r]) circle(r = r);
    }
}

// Cuerpo plano 2D exterior de la plantilla
module jig_body_2d() {
    hull() {
        // Vértice interior de la esquina de la mesa
        translate([4, 4]) circle(r = 4);

        // Extremo del brazo de apoyo en X
        translate([arm_length_x - 8, 4]) circle(r = 4);

        // Extremo del brazo de apoyo en Y
        translate([4, arm_length_y - 8]) circle(r = 4);

        // Cuerpo envolvente que rodea el cajeado de la brida
        translate([center_x, center_y])
        circle(r = r_outer_frame);
    }
}

module corner_jig() {
    difference() {
        union() {
            // 1. Placa base de referencia plana (apoya bajo la mesa en Z >= 0)
            linear_extrude(height = jig_thickness)
            jig_body_2d();

            // 2. Labio / Tope contra el borde X de la mesa (Y <= 0, Z < 0)
            translate([-table_lip_thickness, -table_lip_thickness, -table_lip_height])
            cube([arm_length_x + table_lip_thickness, table_lip_thickness, table_lip_height + jig_thickness]);

            // 3. Labio / Tope contra el borde Y de la mesa (X <= 0, Z < 0)
            translate([-table_lip_thickness, -table_lip_thickness, -table_lip_height])
            cube([table_lip_thickness, arm_length_y + table_lip_thickness, table_lip_height + jig_thickness]);

            // 4. Chaflán de refuerzo exterior en la esquina de los labios
            translate([-table_lip_thickness, -table_lip_thickness, -table_lip_height])
            cube([table_lip_thickness * 2, table_lip_thickness * 2, table_lip_height + jig_thickness]);
        }

        // --- SUBTRACCIONES / PERFORACIONES ---

        // A. Cajeado pasante con la forma exacta y orientación única (Poka-Yoke)
        translate([center_x, center_y, -1])
        rotate([0, 0, bracket_angle])
        linear_extrude(height = jig_thickness + 2)
        base_pocket_2d(base_size, corner_radius, key_chamfer, chamfer_radius, fit_clearance);

        // B. Ventana de alivio de peso y agarre ergonómico
        translate([center_x * 0.45, center_y * 0.45, -1])
        cylinder(h = jig_thickness + 2, r = min(center_x, center_y) * 0.22);

        // C. Texto grabado en la cara superior
        translate([center_x + (r_outer_frame * 0.1), center_y - (r_outer_frame * 0.65), jig_thickness - 0.8])
        linear_extrude(height = 1)
        text("40mm", size = 6, halign = "center", valign = "center", font = "Arial:style=Bold");

        translate([center_x - (r_outer_frame * 0.55), center_y + (r_outer_frame * 0.1), jig_thickness - 0.8])
        rotate([0, 0, -45])
        linear_extrude(height = 1)
        text("ESQUINA", size = 4.5, halign = "center", valign = "center", font = "Arial:style=Bold");
    }
}

corner_jig();
