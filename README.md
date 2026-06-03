# JeeTP Studios — Sitio (React + Vite + TypeScript)

Migración completa del sitio (antes un único `index.html`) a una arquitectura
React modular y escalable, con CMS basado en un JSON editable y un panel de
administración con edición por componente y secciones de case study mediante
drag-and-drop.

> El sitio original quedó respaldado en `legacy/index.legacy.html`.

## Scripts

```bash
npm install        # instalar dependencias
npm run dev        # desarrollo (http://localhost:5173)
npm run build      # build de producción a /dist
npm run preview    # previsualizar el build
npm run gen:content # regenerar public/content.json desde los defaults
```

## Cómo funciona el contenido (CMS por JSON en S3)

El contenido del sitio vive en un único archivo `content.json`. Capas, de menor
a mayor prioridad:

1. **Defaults** — `src/data/defaults.ts` (siempre disponible como respaldo).
2. **JSON remoto** — se descarga en runtime desde tu bucket. Configúralo con la
   variable de entorno `VITE_CONTENT_URL` (ver `.env.example`). Si no se define,
   se usa `/content.json` (incluido en `public/`).
3. **Override local** — cambios hechos en el admin y guardados en el navegador
   (localStorage), aún sin publicar.

Las capas se fusionan en profundidad; los arrays se reemplazan completos.

### Flujo de edición → publicación

1. Entra a `/admin` (o el ícono ⚙ del header).
2. Edita el contenido. **Guardar** persiste tus cambios localmente (solo en tu
   navegador) para seguir trabajando.
3. **Exportar JSON** descarga `content.json`.
4. Sube ese `content.json` a tu bucket de S3 (la URL de `VITE_CONTENT_URL`).
   Eso publica los cambios para todos **sin rebuild**.
5. **Importar JSON** permite cargar un `content.json` previo para seguir editándolo.
6. **Recargar remoto** descarta los cambios locales y vuelve a leer el bucket.

> Configura el bucket con CORS de lectura pública y, si usas rutas profundas,
> el hosting estático debe servir `index.html` como fallback (SPA).

## Estructura

```
src/
  types/content.ts        Tipos del modelo de contenido (shape del JSON)
  data/defaults.ts        Contenido por defecto
  content/                Provider: fetch remoto + overrides + import/export
  lib/style.ts            Helpers (gradientes, párrafos)
  hooks/useReveal.ts      Animación de reveal on-scroll
  styles/                 CSS portado (tokens, layout, home, pages, casestudy, admin)
  components/
    layout/               Header, Menu, Footer, Logo, SiteBackground, contexto
    common/               ScrollCue, RowScroller, Faq, Hireus, Clients, News
  pages/                  Home, About, Services, Cases, CaseStudy, Contact
  sections/               Sistema modular de secciones de case study
    CaseSections.tsx      Render de cada tipo de sección
    sectionMeta.ts        Etiquetas y fábricas de secciones nuevas
  admin/                  Panel de administración
    AdminPanel.tsx        Shell + acciones (guardar/exportar/importar/reset)
    tabs.tsx, CasesTab.tsx
    fields.tsx            Campos reutilizables (texto, color, gradiente, imagen…)
    SectionEditor.tsx     Editor por tipo de sección
    SortableList.tsx      Drag-and-drop nativo (sin dependencias)
```

## Secciones modulares de case study

Cada proyecto tiene un array `sections` editable y reordenable. Tipos disponibles:

- **overview** — título + texto + imagen opcional
- **process** — pasos numerados automáticamente
- **challenge** — reto/problema (bullets) + solución (bullets) + imágenes
- **methodology** — bloques de etapa (encabezado + texto)
- **gallery** — galería de imágenes (grid / mosaico / ancho)
- **conclusion** — conclusión + imagen opcional
- **cta** — llamado a la acción

En `/admin → Case Studies`, cada proyecto permite:

- Editar **cada componente** de su landing por separado.
- **Arrastrar (⠿)** para reordenar secciones.
- **Switch** para mostrar/ocultar cada sección.
- **Agregar/eliminar** secciones por tipo.

Inspirado en case studies con más secciones (p. ej. uxbert.com/case-studies/sagp).
