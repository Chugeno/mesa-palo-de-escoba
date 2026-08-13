// =================================================================
// SOPORTE / BRIDA PARA PATAS DE MESA CON PALO DE ESCOBA
// Base cuadrada con chaveta / llave diagonal (Poka-Yoke)
// =================================================================

/* [Parámetros del Palo] */
// @studio {"label":"Diámetro nominal del palo","description":"Diámetro medido del palo de madera con calibre en mm","unit":"mm","group":"Palo"}
pole_diameter = 22.0; // [15:0.5:50]

// @studio {"label":"Holgura del palo (Tolerancia)","description":"Espacio diametral adicional (+0.4mm recomendado para deslizamiento FDM)","unit":"mm","group":"Palo"}
pole_clearance = 0.4; // [0.1:0.05:1.0]

// @studio {"label":"Profundidad de inserción","description":"Altura del tubo receptor del palo","unit":"mm","group":"Palo"}
socket_height = 45; // [25:1:80]

// @studio {"label":"Inclinación de la pata","description":"Ángulo de apertura hacia afuera en grados","unit":"deg","group":"Palo"}
leg_angle = 10; // [0:1:20]

/* [Base de Fijación a la Mesa] */
// @studio {"label":"Margen base respecto al palo","description":"Diferencia fija para calcular el ancho de la placa cuadrada","unit":"mm","group":"Base"}
base_margin = 52.5; // [30:0.5:80]

// @studio {"label":"Grosor de la base","description":"Espesor de la placa base","unit":"mm","group":"Base"}
base_thickness = 5; // [3:1:10]

// @studio {"label":"Radio de esquinas estándar","description":"Redondeo de las 3 esquinas estándar","unit":"mm","group":"Base"}
corner_radius = 8; // [3:1:20]

// @studio {"label":"Tamaño de la llave diagonal","description":"Longitud del corte en chaflán para la esquina de posicionamiento único (Poka-Yoke)","unit":"mm","group":"Base"}
key_chamfer = 18; // [8:1:35]

// @studio {"label":"Redondeo puntas de la diagonal","description":"Radio de transición suave en los extremos de la diagonal de la llave","unit":"mm","group":"Base"}
chamfer_radius = 4; // [1:0.5:10]

// @studio {"label":"Grosor de pared","description":"Espesor del tubo y refuerzos","unit":"mm","group":"Estructura"}
wall_thickness = 4; // [2.5:0.5:8]

/* [Tornillos de Montaje] */
// @studio {"label":"Diámetro de tornillo mesa","description":"Diámetro del cuerpo del tornillo de madera","unit":"mm","group":"Tornillos"}
screw_diameter = 4.5; // [3:0.5:7]

// @studio {"label":"Avellanado","description":"Inclinación para la cabeza cónica del tornillo","group":"Tornillos"}
countersink = true;

// @studio {"label":"Tornillo lateral de opresión","description":"Agujero lateral para fijar el palo al tubo","group":"Tornillos"}
side_screw = true;

// @studio {"label":"Diámetro tornillo lateral","description":"Diámetro del tornillo lateral","unit":"mm","group":"Tornillos"}
side_screw_diameter = 4; // [2.5:0.5:6]

// @studio {"label":"Avellanado del tornillo lateral","description":"Inclinación cónica (90°) para ocultar la cabeza del tornillo lateral","group":"Tornillos"}
side_countersink = true;

// @studio {"label":"Segundo tornillo cruzado","description":"Agrega un segundo tornillo transversal a distinta altura para aumentar la rigidez","group":"Tornillos"}
second_side_screw = true;

// @studio {"label":"Altura segundo tornillo","description":"Altura del segundo tornillo medida desde la base del tubo","unit":"mm","group":"Tornillos"}
second_screw_height = 32; // [10:1:70]

// @studio {"label":"Orientación segundo tornillo","description":"Giro del segundo tornillo alrededor del palo; 90° lo cruza respecto del primero","unit":"deg","group":"Tornillos"}
second_screw_angle = 90; // [0:15:180]

/* [Detalles y Calidad] */
$fn = 80;

// Constantes fijas de diseño
num_screws = 4; // 4 tornillos de montaje en cruz

// Variables calculadas
actual_pole_d = pole_diameter + pole_clearance;
r_pole = actual_pole_d / 2;
r_outer = r_pole + wall_thickness;
base_size = pole_diameter + base_margin;
half_base = base_size / 2;

// Profundidades seguras de avellanado
head_depth_base = min(base_thickness * 0.5, screw_diameter * 0.6);
head_depth_side = min(wall_thickness * 0.65, 3.0);

// Perfil 2D de la base: Cuadrado con 3 esquinas redondeadas y 1 diagonal con puntas redondeadas
module base_plate_2d(size, r, c, r_ch) {
    half = size / 2;
    k_offset = (sqrt(2) - 1) * r_ch; // Compensación trigonométrica para tangencia exacta
    
    hull() {
        // Esquina 1 (+X, +Y): Dos círculos tangentes que redondean ambos extremos de la diagonal
        translate([half - c - k_offset, half - r_ch]) circle(r = r_ch);
        translate([half - r_ch, half - c - k_offset]) circle(r = r_ch);
        
        // Esquinas 2, 3 y 4: Redondeos estándar
        translate([-half + r,  half - r]) circle(r = r); // Esquina -X, +Y
        translate([-half + r, -half + r]) circle(r = r); // Esquina -X, -Y
        translate([ half - r, -half + r]) circle(r = r); // Esquina +X, -Y
    }
}

module leg_socket() {
    difference() {
        union() {
            // 1. Placa base cuadrada con llave diagonal y puntas redondeadas
            linear_extrude(height = base_thickness)
            base_plate_2d(base_size, corner_radius, key_chamfer, chamfer_radius);

            // 2. Tubo receptor inclinado y cuello de transición
            hull() {
                cylinder(h = base_thickness + 2, r = r_outer + 2);
                
                translate([0, 0, base_thickness])
                rotate([0, leg_angle, 0])
                cylinder(h = socket_height, r = r_outer);
            }

            // 3. Nervios de refuerzo (Ménsulas / Gussets hacia las esquinas)
            for (i = [0 : num_screws - 1]) {
                a = (i + 0.5) * (360 / num_screws); // Alternados a 45°, 135°, 225°, 315°
                hull() {
                    // Anclaje en el tubo inclinado (inmerso)
                    translate([0, 0, base_thickness])
                    rotate([0, leg_angle, 0])
                    rotate([0, 0, a])
                    translate([r_pole + 0.5, -wall_thickness/2, 0])
                        cube([wall_thickness + 1, wall_thickness, socket_height * 0.55]);

                    // Anclaje en la placa base (inmerso)
                    rotate([0, 0, a])
                    translate([half_base - 8, -wall_thickness/2, -0.5])
                        cube([3, wall_thickness, base_thickness + 1]);
                }
            }
        }

        // --- SUBTRACCIONES / PERFORACIONES ---

        // A. Hueco interior para el palo
        translate([0, 0, base_thickness])
        rotate([0, leg_angle, 0])
        cylinder(h = socket_height + 10, r = r_pole);

        // B. Chaflán de entrada superior para facilitar meter el palo
        translate([0, 0, base_thickness])
        rotate([0, leg_angle, 0])
        translate([0, 0, socket_height - 3])
        cylinder(h = 4, r1 = r_pole, r2 = r_pole + 1.5);

        // C. 4 Orificios para tornillos de mesa centrados en los 4 lados planos
        screw_pos = half_base - (screw_diameter * 1.8);
        for (i = [0 : num_screws - 1]) {
            angle = i * (360 / num_screws);
            rotate([0, 0, angle])
            translate([screw_pos, 0, -1]) {
                // Pasante
                cylinder(h = base_thickness + 4, d = screw_diameter);
                
                // Avellanado seguro
                if (countersink) {
                    translate([0, 0, 1 + base_thickness - head_depth_base])
                    cylinder(h = head_depth_base + 0.5, d1 = screw_diameter, d2 = screw_diameter + (head_depth_base * 2));
                }
            }
        }

        // D. Orificio para tornillo prisionero lateral (opresor del palo)
        if (side_screw) {
            translate([0, 0, base_thickness])
            rotate([0, leg_angle, 0])
            translate([0, 0, socket_height / 2])
            rotate([0, 90, 0]) {
                // Paso pasante del vástago del tornillo
                cylinder(h = r_outer + 10, d = side_screw_diameter);

                // Avellanado cónico adaptativo para la cabeza del tornillo
                if (side_countersink) {
                    translate([0, 0, r_outer - head_depth_side])
                    cylinder(h = head_depth_side + 2, d1 = side_screw_diameter, d2 = side_screw_diameter + (head_depth_side * 2));
                }
            }
        }

        // D2. Segundo tornillo transversal, a otra altura y girado 90°
        if (second_side_screw) {
            translate([0, 0, base_thickness])
            rotate([0, leg_angle, 0])
            translate([0, 0, second_screw_height])
            rotate([0, 0, second_screw_angle])
            rotate([0, 90, 0]) {
                // Paso pasante del segundo tornillo
                cylinder(h = r_outer + 10, d = side_screw_diameter);

                // Avellanado cónico adaptativo para la cabeza del tornillo
                if (side_countersink) {
                    translate([0, 0, r_outer - head_depth_side])
                    cylinder(h = head_depth_side + 2, d1 = side_screw_diameter, d2 = side_screw_diameter + (head_depth_side * 2));
                }
            }
        }
    }
}

leg_socket();