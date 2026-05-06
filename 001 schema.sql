-- ============================================================
-- AutoGestión — Schema completo de base de datos
-- Ejecutar en Supabase SQL Editor
-- ============================================================

-- Extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── VENDEDORES ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS vendedores (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  nombre          TEXT NOT NULL,
  apellido        TEXT NOT NULL,
  telefono        TEXT NOT NULL,
  email           TEXT NOT NULL,
  panel_token     TEXT UNIQUE NOT NULL,
  activo          BOOLEAN DEFAULT TRUE
);

-- ─── AUTOS ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS autos (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW(),
  vendedor_id           UUID REFERENCES vendedores(id) ON DELETE CASCADE,
  
  -- Datos básicos
  marca                 TEXT NOT NULL,
  modelo                TEXT NOT NULL,
  version               TEXT NOT NULL DEFAULT '',
  anio                  INTEGER NOT NULL CHECK (anio BETWEEN 1990 AND 2030),
  kilometraje           INTEGER NOT NULL CHECK (kilometraje >= 0),
  combustible           TEXT NOT NULL CHECK (combustible IN ('nafta','diesel','gnc','hibrido','electrico')),
  transmision          TEXT NOT NULL CHECK (transmision IN ('manual','automatica','cvt')),
  color                 TEXT NOT NULL DEFAULT '',
  
  -- Precios
  precio_usd            INTEGER NOT NULL CHECK (precio_usd > 0),
  precio_ars            BIGINT,
  
  -- Estado
  estado                TEXT NOT NULL DEFAULT 'disponible'
                        CHECK (estado IN ('disponible','reservado','vendido','en_gestion')),
  
  -- Contenido
  descripcion           TEXT,
  caracteristicas       TEXT[] DEFAULT '{}',
  checklist             JSONB DEFAULT '[]',
  
  -- Documentos
  informe_dominio_url   TEXT,
  informe_infracciones_url TEXT,
  ficha_pdf_url         TEXT,
  
  -- SEO
  slug                  TEXT UNIQUE NOT NULL,
  
  -- Stats
  destacado             BOOLEAN DEFAULT FALSE,
  vistas                INTEGER DEFAULT 0,
  consultas_count       INTEGER DEFAULT 0
);

-- ─── IMÁGENES DE AUTOS ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS auto_imagenes (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auto_id     UUID NOT NULL REFERENCES autos(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  alt         TEXT NOT NULL DEFAULT '',
  orden       INTEGER NOT NULL DEFAULT 0,
  es_principal BOOLEAN DEFAULT FALSE
);

-- ─── CONSULTAS ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS consultas (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  auto_id     UUID NOT NULL REFERENCES autos(id) ON DELETE CASCADE,
  nombre      TEXT NOT NULL,
  telefono    TEXT NOT NULL,
  mensaje     TEXT NOT NULL,
  leida       BOOLEAN DEFAULT FALSE
);

-- ─── VISTAS ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS vistas (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  auto_id     UUID NOT NULL REFERENCES autos(id) ON DELETE CASCADE,
  ip_hash     TEXT NOT NULL,
  user_agent  TEXT
);

-- ─── BLOG POSTS ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blog_posts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  titulo          TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  resumen         TEXT NOT NULL,
  contenido       TEXT NOT NULL,
  tag             TEXT NOT NULL DEFAULT 'Análisis',
  tiempo_lectura  INTEGER NOT NULL DEFAULT 5,
  imagen_url      TEXT,
  publicado       BOOLEAN DEFAULT FALSE,
  destacado       BOOLEAN DEFAULT FALSE
);

-- ─── PRECIOS DE MERCADO ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS precios_mercado (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  actualizado_at  TIMESTAMPTZ DEFAULT NOW(),
  marca           TEXT NOT NULL,
  modelo          TEXT,
  anio_desde      INTEGER NOT NULL,
  anio_hasta      INTEGER NOT NULL,
  km_desde        INTEGER NOT NULL DEFAULT 0,
  km_hasta        INTEGER NOT NULL,
  precio_min_usd  INTEGER NOT NULL,
  precio_max_usd  INTEGER NOT NULL,
  fuente          TEXT NOT NULL DEFAULT 'manual'
);

-- ─── VALUACIONES REALIZADAS ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS valuaciones (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  marca       TEXT NOT NULL,
  modelo      TEXT NOT NULL,
  anio        INTEGER NOT NULL,
  km_bucket   TEXT NOT NULL,
  precio_min  INTEGER NOT NULL,
  precio_max  INTEGER NOT NULL,
  nombre      TEXT,
  telefono    TEXT,
  ip_hash     TEXT
);

-- ─── FUNCTIONS ────────────────────────────────────────────────────────────────

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER autos_updated_at
  BEFORE UPDATE ON autos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Incrementar contador de vistas
CREATE OR REPLACE FUNCTION incrementar_vista(auto_uuid UUID, ip TEXT, ua TEXT)
RETURNS void AS $$
BEGIN
  INSERT INTO vistas (auto_id, ip_hash, user_agent) VALUES (auto_uuid, ip, ua);
  UPDATE autos SET vistas = vistas + 1 WHERE id = auto_uuid;
END;
$$ LANGUAGE plpgsql;

-- Incrementar consultas
CREATE OR REPLACE FUNCTION incrementar_consulta(auto_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE autos SET consultas_count = consultas_count + 1 WHERE id = auto_uuid;
END;
$$ LANGUAGE plpgsql;

-- ─── ROW LEVEL SECURITY ───────────────────────────────────────────────────────
ALTER TABLE autos ENABLE ROW LEVEL SECURITY;
ALTER TABLE auto_imagenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultas ENABLE ROW LEVEL SECURITY;
ALTER TABLE vistas ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE precios_mercado ENABLE ROW LEVEL SECURITY;
ALTER TABLE valuaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendedores ENABLE ROW LEVEL SECURITY;

-- Lectura pública para autos disponibles
CREATE POLICY "autos_publicos" ON autos
  FOR SELECT USING (estado != 'vendido');

CREATE POLICY "imagenes_publicas" ON auto_imagenes
  FOR SELECT USING (true);

CREATE POLICY "blog_publico" ON blog_posts
  FOR SELECT USING (publicado = true);

CREATE POLICY "precios_publicos" ON precios_mercado
  FOR SELECT USING (true);

-- Cualquiera puede registrar consultas y vistas (INSERT público)
CREATE POLICY "consultas_insert" ON consultas
  FOR INSERT WITH CHECK (true);

CREATE POLICY "vistas_insert" ON vistas
  FOR INSERT WITH CHECK (true);

CREATE POLICY "valuaciones_insert" ON valuaciones
  FOR INSERT WITH CHECK (true);

-- ─── INDEXES ──────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_autos_slug ON autos(slug);
CREATE INDEX IF NOT EXISTS idx_autos_estado ON autos(estado);
CREATE INDEX IF NOT EXISTS idx_autos_marca ON autos(marca);
CREATE INDEX IF NOT EXISTS idx_autos_destacado ON autos(destacado);
CREATE INDEX IF NOT EXISTS idx_consultas_auto ON consultas(auto_id);
CREATE INDEX IF NOT EXISTS idx_vistas_auto ON vistas(auto_id);
CREATE INDEX IF NOT EXISTS idx_vistas_fecha ON vistas(created_at);
CREATE INDEX IF NOT EXISTS idx_blog_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_precios_marca_anio ON precios_mercado(marca, anio_desde, anio_hasta);

-- ─── STORAGE BUCKETS ──────────────────────────────────────────────────────────
-- Ejecutar en Supabase Dashboard > Storage:
-- 1. Crear bucket "auto-imagenes" (public)
-- 2. Crear bucket "documentos" (public)
-- Los siguientes son ejemplos de policies:
/*
INSERT INTO storage.buckets (id, name, public) VALUES ('auto-imagenes', 'auto-imagenes', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('documentos', 'documentos', true);
*/