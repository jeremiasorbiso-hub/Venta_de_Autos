# Estructura del Proyecto AutoGestión

## 📂 Organización de Carpetas

```
autogestion/
├── src/
│   ├── app/                          # Rutas y layouts de Next.js 13+
│   │   ├── api/                      # API Routes
│   │   │   ├── valuador/            # Valuador endpoint
│   │   │   ├── autos/               # Autos CRUD
│   │   │   ├── contacto/            # Formulario de contacto
│   │   │   └── panel/               # Panel del vendedor
│   │   ├── panel/                    # Página del panel del vendedor
│   │   ├── inventario/               # Página de inventario
│   │   ├── blog/                     # Página de blog
│   │   ├── valuador/                 # Página del valuador
│   │   ├── globals.css               # Estilos globales
│   │   └── layout.tsx                # Root layout
│   ├── components/                   # Componentes React
│   │   ├── ui/                       # Componentes reutilizables
│   │   │   └── AutoCard.tsx         # Tarjeta de auto
│   │   ├── layout/                   # Componentes de layout
│   │   │   ├── Navbar.tsx           # Navegación
│   │   │   ├── Footer.tsx           # Pie de página
│   │   │   └── Layout.tsx           # Wrapper principal
│   │   └── sections/                 # Secciones de página
│   │       ├── Herosection.tsx      # Hero
│   │       ├── Valuadorsection.tsx  # Sección valuador
│   │       └── Inventariosection.tsx # Sección inventario
│   ├── lib/                          # Utilidades y funciones
│   │   ├── supabase.ts              # Cliente de Supabase
│   │   └── utils.ts                 # Funciones auxiliares
│   ├── hooks/                        # Custom React hooks
│   ├── types/                        # Definiciones TypeScript
│   │   └── index.ts                 # Todas las interfaces
│   ├── app.tsx                       # Componente App (si aplica)
│   └── middleware.ts                # Middleware de Next.js (si aplica)
├── public/                           # Archivos estáticos
├── scripts/                          # Scripts de utilidad
│   └── (scripts de seed, migración, etc.)
├── supabase/                         # Configuración de Supabase
│   ├── migrations/                   # Migraciones de BD
│   └── seeds/                        # Datos de prueba
├── docs/                             # Documentación
│   └── (guías, especificaciones, etc.)
├── .vscode/                          # Configuración de VS Code
├── next.config.js                    # Configuración de Next.js
├── tsconfig.json                     # Configuración de TypeScript
├── package.json                      # Dependencias y scripts
├── tailwind.config.js                # Configuración de Tailwind
├── postcss.config.js                 # Configuración de PostCSS
└── README.md                         # Este archivo
```

## 🔑 Características Principales

- **Next.js 14.2.5** - Framework React moderno
- **TypeScript** - Type-safe development
- **Supabase** - Backend y base de datos PostgreSQL
- **Tailwind CSS** - Utility-first CSS
- **React Hot Toast** - Notificaciones
- **Framer Motion** - Animaciones
- **Recharts** - Gráficos
- **Lucide React** - Iconografía

## 📦 Dependencias Instaladas

Ver `package.json` para la lista completa. Las principales incluyen:
- `next`, `react`, `react-dom`
- `@supabase/supabase-js`, `@supabase/ssr`
- `tailwindcss`, `autoprefixer`, `postcss`
- `react-hook-form`, `zod` (validación)
- `date-fns` (manejo de fechas)

## 🚀 Scripts de Desarrollo

```bash
npm run dev          # Desarrollo local
npm run build        # Build de producción
npm start            # Servidor de producción
npm run lint         # Linting
npm run type-check   # Verificar tipos TypeScript
```

## 🔗 Rutas de Alias

Configuradas en `tsconfig.json`:
```typescript
@ → ./src
```

Ejemplo de uso:
```typescript
import { cn } from '@/lib/utils'
import { Auto } from '@/types'
import { AutoCard } from '@/components/ui/AutoCard'
```

## 📝 Convenciones

### Componentes
- **Functional Components** con hooks
- **PascalCase** para nombres de archivos y componentes
- Componentes pequeños en `components/ui/`
- Secciones de página en `components/sections/`

### Archivos de Tipos
- Todas las interfaces en `src/types/index.ts`
- Exportar solo lo necesario
- Comentarios JSDoc para interfaces complejas

### Estilos
- **Tailwind CSS** para la mayoría de estilos
- Estilos globales en `src/app/globals.css`
- Archivos CSS modular si es necesario

### API Routes
- Estructura RESTful en `src/app/api/`
- Usar TypeScript para type safety
- Validación con `zod` + `@hookform/resolvers`

## 🗄️ Base de Datos

Migraciones SQL en `supabase/migrations/`
- Ejecutar: `supabase db push`
- Revertir: `supabase db reset`

Datos de prueba en `supabase/seeds/`

## 🔐 Variables de Entorno

Crear `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_WHATSAPP_NUMBER=
NEXT_PUBLIC_SITE_URL=
PANEL_JWT_SECRET=
```

## 📚 Documentación Adicional

Ver carpeta `docs/` para:
- Guía de desarrollo
- Especificaciones de API
- Guía de componentes

---

**Última actualización:** Mayo 2026
