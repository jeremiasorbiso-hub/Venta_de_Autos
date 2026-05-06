-- ============================================================
-- AutoGestión — Datos de ejemplo para desarrollo
-- ============================================================

-- Vendedor de prueba
INSERT INTO vendedores (id, nombre, apellido, telefono, email, panel_token)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Carlos', 'Rodríguez', '+5493413112233', 'carlos@ejemplo.com', 'token-carlos-demo-001'),
  ('00000000-0000-0000-0000-000000000002', 'María', 'González', '+5493413445566', 'maria@ejemplo.com', 'token-maria-demo-002');

-- Autos de ejemplo
INSERT INTO autos (id, vendedor_id, marca, modelo, version, anio, kilometraje, combustible, transmision, color, precio_usd, estado, descripcion, caracteristicas, slug, destacado)
VALUES
  (
    '10000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'Volkswagen', 'Tiguan', 'Allspace 2.0 TSI Highline', 2022, 42000,
    'nafta', 'automatica', 'Blanco',
    28500, 'disponible',
    'Tiguan Allspace impecable, único dueño, service al día en concesionaria oficial. 7 asientos, techo panorámico, todas las asistencias de conducción.',
    ARRAY['Techo panorámico','7 asientos','Control de crucero adaptativo','Cámara de reversa 360°','Apple CarPlay / Android Auto','Sensores de estacionamiento delanteros y traseros','Asientos de cuero'],
    'volkswagen-tiguan-allspace-2022',
    TRUE
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'Toyota', 'Corolla', 'XEI CVT', 2023, 18000,
    'nafta', 'cvt', 'Plata Metalizado',
    19000, 'en_gestion',
    'Corolla seminuevo con garantía de fábrica vigente. Primer dueño, nunca chocado, todos los service en concesionaria.',
    ARRAY['Toyota Safety Sense','Freno autónomo de emergencia','Alerta de cambio de carril','Pantalla táctil 8"','Apple CarPlay / Android Auto','Climatizador automático bizona'],
    'toyota-corolla-xei-2023',
    TRUE
  ),
  (
    '10000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000002',
    'Ford', 'Ranger', 'XLT 4x4 AT', 2021, 67000,
    'diesel', 'automatica', 'Gris Oscuro',
    32000, 'reservado',
    'Ranger tope de gama, 4x4 real con reductora. Uso rural ocasional, impecable estado. Equipada con todos los opcionales.',
    ARRAY['4x4 con reductora','Diferencial trasero electrónico','Faros full LED','Caja de herramientas','Barra antivuelco','Control de descenso asistido'],
    'ford-ranger-xlt-4x4-2021',
    FALSE
  ),
  (
    '10000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000002',
    'Honda', 'HR-V', 'EXL CVT', 2022, 35000,
    'nafta', 'cvt', 'Negro Cristal',
    18500, 'disponible',
    'HR-V tope de gama con todos los extras. Interior de cuero marrón, único color disponible en Argentina.',
    ARRAY['Asientos de cuero marrón','Honda Sensing','Techo solar','Pantalla táctil Honda Connect','Volante multifunción de cuero'],
    'honda-hrv-exl-cvt-2022',
    FALSE
  ),
  (
    '10000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000001',
    'Renault', 'Duster', 'Intens 4x4 MT', 2023, 12000,
    'nafta', 'manual', 'Naranja Atacama',
    14000, 'disponible',
    'Duster 4x4 seminuevo con garantía de fábrica. Color exclusivo, equipado con todos los opcionales disponibles.',
    ARRAY['Tracción 4x4 con bloqueo','Cámara trasera','Pantalla 7"','Asientos calefaccionados','Sensor lluvia y crepuscular'],
    'renault-duster-intens-4x4-2023',
    FALSE
  );

-- Imágenes placeholder (en producción usar URLs reales de Supabase Storage)
INSERT INTO auto_imagenes (auto_id, url, alt, orden, es_principal)
VALUES
  ('10000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1619976215249-a2f2ad73ab86?w=800', 'Volkswagen Tiguan Allspace 2022', 0, TRUE),
  ('10000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800', 'Toyota Corolla 2023', 0, TRUE),
  ('10000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1566473965997-3de9c817e938?w=800', 'Ford Ranger 2021', 0, TRUE),
  ('10000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800', 'Honda HR-V 2022', 0, TRUE),
  ('10000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800', 'Renault Duster 2023', 0, TRUE);

-- Blog posts de ejemplo
INSERT INTO blog_posts (titulo, slug, resumen, contenido, tag, tiempo_lectura, publicado, destacado)
VALUES
  (
    '¿Por qué bajaron los precios de los usados este mes y qué conviene hacer?',
    'por-que-bajaron-precios-usados',
    'El tipo de cambio blue impacta directo en el precio de los 0km importados, y eso arrastra hacia abajo a los usados. Te explicamos el mecanismo y qué esperar.',
    'El mercado automotor argentino es altamente sensible al tipo de cambio...',
    'Análisis', 8, TRUE, TRUE
  ),
  (
    'Los 5 autos que menos combustible gastan en Argentina',
    'autos-menor-consumo-argentina',
    'Con el precio de los combustibles en máximos históricos, el consumo pasa a ser un factor clave al momento de elegir un auto.',
    'En un contexto de combustibles caros...',
    'Ranking', 5, TRUE, FALSE
  ),
  (
    'Cómo saber si el precio que te ofrecen es justo (o no)',
    'como-saber-si-precio-es-justo',
    'Guía práctica para no vender barato ni comprar caro. Las tres fuentes de datos que debés consultar antes de cerrar cualquier operación.',
    'Antes de firmar cualquier boleto de compraventa...',
    'Guía', 4, TRUE, FALSE
  );

-- Precios de mercado de referencia
INSERT INTO precios_mercado (marca, modelo, anio_desde, anio_hasta, km_desde, km_hasta, precio_min_usd, precio_max_usd, fuente)
VALUES
  ('Toyota', 'Corolla', 2021, 2022, 0, 30000, 15000, 19000, 'mercadolibre'),
  ('Toyota', 'Corolla', 2021, 2022, 30001, 60000, 13000, 16500, 'mercadolibre'),
  ('Toyota', 'Corolla', 2023, 2024, 0, 20000, 18000, 22000, 'mercadolibre'),
  ('Volkswagen', 'Tiguan', 2020, 2022, 0, 50000, 22000, 30000, 'mercadolibre'),
  ('Volkswagen', 'Tiguan', 2020, 2022, 50001, 90000, 18000, 24000, 'mercadolibre');