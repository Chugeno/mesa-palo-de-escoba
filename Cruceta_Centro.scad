// =================================================================
// CRUCETA CENTRAL PARA PALOS DE ESCOBA CRUZADOS EN X
// Pieza flotante que conecta dos palos en diagonal sin cortarse,
// calculando el ángulo exacto según las proporciones de la mesa.
// =================================================================

/* [Dimensiones de la Mesa (para calcular la proporción de la X)] */
// @studio {"label":"Largo de la mesa","description":"Proporción o medida de largo de la mesa","unit":"unidades","group":"Mesa"}
table_length = 1000;

// @studio {"label":"Ancho de la mesa","description":"Proporción o medida de ancho de la mesa","unit":"unidades","group":"Mesa"}
table_width = 600;

/* [Parámetros de los Palos de Refuerzo] */
// @studio {"label":"Diámetro nominal del palo","description":"Diámetro medido del palo con calibre en mm","unit":"mm","group":"Palos X"}
pole_diameter = 22.0; // [15:0.5:50]

// @studio {"label":"Holgura del palo (Tolerancia)","description":"Espacio diametral adicional (+0.4mm recomendado)","unit":"mm","group":"Palos X"}
pole_clearance = 0.4; // [0.1:0.05:1.0]

// @studio {"label":"Largo de inserción (cada lado)","description":"Profundidad de cada manga/tubo de la cruceta desde el centro","unit":"mm","group":"Palos X"}
socket_length = 40; // [20:1:80]

// @studio {"label":"Espesor de pared","description":"Grosor de la pared de los tubos receptores","unit":"mm","group":"Estructura"}
wall_thickness = 3.5; // [2.5:0.5:8]

// @studio {"label":"Separación vertical entre palos","description":"Distancia libre en Z para evitar que los palos se toquen en el cruce","unit":"mm","group":"Estructura"}
vertical_clearance = 2; // [0:0.5:10]

/* [Tornillos Opresores] */
// @studio {"label":"Diámetro de tornillo opresor","description":"Diámetro del tornillo para fijar los palos a la cruceta","unit":"mm","group":"Tornillos"}
screw_diameter = 4; // [2.5:0.5:6]

// @studio {"label":"Avellanado de opresor","description":"Activa o desactiva la cabeza cónica para el tornillo lateral","group":"Tornillos"}
countersink = true;

/* [Detalles y Calidad] */
$fn = 80;

// --- CÁLCULOS GEOMÉTRICOS ---
// Ángulo de la diagonal (X) respecto al eje longitudinal (X) calculado directamente por proporción
theta = atan2(table_width, table_length);

// Variables físicas de la cruceta con holgura
actual_pole_d = pole_diameter + pole_clearance;
r_pole = actual_pole_d / 2;
r_outer = r_pole + wall_thickness;
z_offset = actual_pole_d + wall_thickness + vertical_clearance;

// Largo del puente central de transición (tangente a los tubos)
bridge_length = min(socket_length * 0.8, r_outer * 2.2);

// Altura total de la pieza
total_height = z_offset + r_outer * 2;

module sleeve_axis(clearance_bore = false) {
    rotate([0, 90, 0]) {
        if (clearance_bore) {
            cylinder(h = socket_length * 2 + 10, r = r_pole, center = true);
        } else {
            cylinder(h = socket_length * 2, r = r_outer, center = true);
        }
    }
}

module screw_hole() {
    rotate([90, 0, 0]) {
        // Agujero pasante para el tornillo
        cylinder(h = r_outer * 2 + 2, d = screw_diameter, center = true);
        
        if (countersink) {
            // Avellanado en ambas caras externas
            translate([0, 0, r_outer - 1.5])
            cylinder(h = 3, d1 = screw_diameter, d2 = screw_diameter * 2.2, center = true);
            
            translate([0, 0, -(r_outer - 1.5)])
            rotate([180, 0, 0])
            cylinder(h = 3, d1 = screw_diameter, d2 = screw_diameter * 2.2, center = true);
        }
    }
}

module central_cross() {
    difference() {
        union() {
            // 1. Tubo inferior (Orientado a +theta)
            rotate([0, 0, theta])
            sleeve_axis(clearance_bore = false);

            // 2. Tubo superior (Orientado a -theta, elevado en Z = z_offset)
            translate([0, 0, z_offset])
            rotate([0, 0, -theta])
            sleeve_axis(clearance_bore = false);

            // 3. Puente central de unión perfectamente enrasado y tangente a ambos tubos
            hull() {
                // Segmento central del tubo inferior
                rotate([0, 0, theta])
                rotate([0, 90, 0])
                cylinder(h = bridge_length, r = r_outer, center = true);

                // Segmento central del tubo superior
                translate([0, 0, z_offset])
                rotate([0, 0, -theta])
                rotate([0, 90, 0])
                cylinder(h = bridge_length, r = r_outer, center = true);
            }
        }

        // --- SUBTRACCIONES / PERFORACIONES ---

        // A. Hueco interior inferior para el primer palo
        rotate([0, 0, theta])
        sleeve_axis(clearance_bore = true);

        // B. Hueco interior superior para el segundo palo
        translate([0, 0, z_offset])
        rotate([0, 0, -theta])
        sleeve_axis(clearance_bore = true);

        // C. Tornillos opresores para bloquear los 4 extremos de los palos
        screw_dist = socket_length * 0.65;

        // Tornillos del tubo inferior (Z = 0)
        rotate([0, 0, theta]) {
            translate([screw_dist, 0, 0]) screw_hole();
            translate([-screw_dist, 0, 0]) screw_hole();
        }

        // Tornillos del tubo superior (Z = z_offset)
        translate([0, 0, z_offset]) {
            rotate([0, 0, -theta]) {
                translate([screw_dist, 0, 0]) screw_hole();
                translate([-screw_dist, 0, 0]) screw_hole();
            }
        }
    }
}

central_cross();
