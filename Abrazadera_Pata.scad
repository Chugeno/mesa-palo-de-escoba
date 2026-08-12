// =================================================================
// ABRAZADERA / COLLARÍN DE PATA PARA PALOS DE REFUERZO EN X
// Manguito deslizante cilíndrico sólido que se fija a la pata
// mediante dos tornillos de madera cruzados a 90° (sin aletas de apriete),
// con un socket para el palo de la X que queda perfectamente horizontal.
// =================================================================

/* [Parámetros de la Pata (Macho)] */
// @studio {"label":"Diámetro nominal de la pata","description":"Diámetro medido del palo de la pata con calibre en mm","unit":"mm","group":"Pata"}
pole_diameter = 22.0; // [15:0.5:50]

// @studio {"label":"Holgura de la pata (Tolerancia)","description":"Espacio diametral adicional para deslizar suave por la pata","unit":"mm","group":"Pata"}
pole_clearance = 0.4; // [0.1:0.05:1.0]

// @studio {"label":"Inclinación de la pata","description":"Ángulo de la pata respecto a la vertical (para auto-nivelar el refuerzo)","unit":"deg","group":"Pata"}
leg_angle = 10; // [0:1:20]

/* [Parámetros del Palo de la X (Refuerzo)] */
// @studio {"label":"Diámetro nominal del palo de la X","description":"Diámetro medido del palo de refuerzo en mm","unit":"mm","group":"Refuerzo X"}
brace_diameter = 22.0; // [15:0.5:50]

// @studio {"label":"Holgura del refuerzo (Tolerancia)","description":"Espacio diametral adicional para el palo de la X","unit":"mm","group":"Refuerzo X"}
brace_clearance = 0.4; // [0.1:0.05:1.0]

// @studio {"label":"Profundidad de inserción","description":"Largo del tubo receptor para el palo de la X","unit":"mm","group":"Refuerzo X"}
socket_length = 35; // [20:1:60]

/* [Estructura] */
// @studio {"label":"Grosor de pared","description":"Espesor de pared de la abrazadera y del socket","unit":"mm","group":"Estructura"}
wall_thickness = 3.5; // [2.5:0.5:8]

// @studio {"label":"Altura del manguito","description":"Altura del cilindro que desliza por la pata","unit":"mm","group":"Estructura"}
clamp_height = 45; // [30:1:70]

/* [Tornillos] */
// @studio {"label":"Tornillos de fijación a la pata","description":"Diámetro del tornillo para fijar el manguito a la madera de la pata","unit":"mm","group":"Tornillos"}
leg_screw_diameter = 4.5; // [3:0.5:6]

// @studio {"label":"Tornillo opresor del refuerzo","description":"Diámetro del tornillo para trabar el palo de la X","unit":"mm","group":"Tornillos"}
locking_screw_diameter = 4; // [2.5:0.5:6]

// @studio {"label":"Avellanado de tornillos","description":"Cabeza cónica para los tornillos","group":"Tornillos"}
countersink = true;

/* [Detalles y Calidad] */
$fn = 80;

// Variables calculadas con holgura
actual_pole_d = pole_diameter + pole_clearance;
actual_brace_d = brace_diameter + brace_clearance;

r_pole = actual_pole_d / 2;
r_brace = actual_brace_d / 2;

r_outer_clamp = r_pole + wall_thickness;
r_outer_socket = r_brace + wall_thickness;

// Compensación angular de inclinación para que el socket quede paralelo a la mesa (horizontal)
socket_angle = leg_angle;

// Profundidades seguras de avellanado
head_depth_leg = min(wall_thickness * 0.65, 3.0);
head_depth_brace = min(wall_thickness * 0.65, 3.0);

module wood_screw_hole(d_screw, depth_c) {
    // Agujero pasante
    cylinder(h = r_outer_clamp * 2 + 10, d = d_screw, center = true);
    
    // Avellanado cónico en la superficie de entrada del tornillo
    if (countersink) {
        translate([0, 0, r_outer_clamp - depth_c])
        cylinder(h = depth_c + 2, d1 = d_screw, d2 = d_screw + (depth_c * 2));
    }
}

module leg_clamp() {
    difference() {
        union() {
            // 1. Cuerpo del manguito (Cilindro sólido deslizante)
            cylinder(h = clamp_height, r = r_outer_clamp, center = true);

            // 2. Socket para el palo de la X (Angulado en X negativo para quedar horizontal)
            rotate([0, -socket_angle, 0])
            translate([-(socket_length / 2 + r_pole), 0, 0])
            rotate([0, 90, 0])
            cylinder(h = socket_length, r = r_outer_socket, center = true);
            
            // Refuerzo de acople entre manguito y socket
            hull() {
                cylinder(h = clamp_height * 0.8, r = r_outer_clamp, center = true);
                
                rotate([0, -socket_angle, 0])
                translate([-r_pole - 5, 0, 0])
                rotate([0, 90, 0])
                cylinder(h = 5, r = r_outer_socket, center = true);
            }
        }

        // --- SUBTRACCIONES / PERFORACIONES ---

        // A. Agujero pasante principal para la pata de la mesa (con holgura)
        cylinder(h = clamp_height + 10, r = r_pole, center = true);

        // B. Tornillo de fijación inferior 1 (Entra desde el lado opuesto en +X, a 0° de rotación)
        translate([0, 0, -clamp_height * 0.25])
        rotate([0, 90, 0])
        wood_screw_hole(leg_screw_diameter, head_depth_leg);

        // C. Tornillo de fijación superior 2 (Cruzado a 90° en Y positivo)
        translate([0, 0, clamp_height * 0.25])
        rotate([-90, 0, 0])
        wood_screw_hole(leg_screw_diameter, head_depth_leg);

        // D. Hueco interior del socket de la X (con holgura)
        rotate([0, -socket_angle, 0])
        translate([-(socket_length / 2 + r_pole), 0, 0])
        rotate([0, 90, 0])
        cylinder(h = socket_length + 10, r = r_brace, center = true);

        // E. Tornillo opresor para trabar el palo de la X
        rotate([0, -socket_angle, 0])
        translate([-r_pole - socket_length * 0.5, 0, 0])
        rotate([90, 0, 0])
        wood_screw_hole(locking_screw_diameter, head_depth_brace);
    }
}

leg_clamp();
