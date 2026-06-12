# Prompt — Ajustes JeeTP Studios (Home, Case Studies, Admin)

> Objetivo general: el sitio se siente todavía muy "plano/lineal" pese a las microinteracciones actuales. Queremos que se sienta **vivo, interactivo y muy pro**, como una experiencia completa (somos fábrica de software / experiencias interactivas), pero **sencillo de navegar** (eso ya está logrado, no romperlo). La meta es que el usuario salga diciendo "guau, qué página".
>
> Idioma del sitio: **todo en inglés** (el `content.json` ya está en inglés). Los textos mock nuevos y los labels del admin también deben ir en inglés.
>
> No rehacer todo desde cero: mejorar la experiencia, las secciones y el dinamismo. Apóyate en el `content.json` actual para entender la información existente.

---

## 1. PRIORIDAD #1 — Transición Hero → Proyectos (movimiento horizontal)

- Hoy la transición entre proyectos del Home es **vertical** (al scrollear, los proyectos se muestran de abajo hacia arriba).
- Cambiarla a un movimiento **horizontal de derecha → izquierda**: al scrollear hacia abajo, los proyectos se desplazan lateralmente (der→izq), no verticalmente.
- La animación actual (último cambio) **se siente trabada, lenta y sin nada especial**. Rehacerla para que sea **smooth y mucho más pro**.
- El texto debería **entrar de derecha a izquierda extendiéndose / deformándose un poco** (stretch / skew / scale) — un efecto con más carácter, no un simple desplazamiento.
- **Alcance del movimiento horizontal:** aplica **solo** dentro de la sección de proyectos destacados del Home, **hasta llegar al último proyecto**. Al terminar los proyectos, la navegación vuelve a ser **vertical normal hacia abajo**. NO es que todo el sitio sea horizontal — solo ese tramo.
- **Mobile:** misma experiencia (mismo movimiento horizontal en esa sección).

## 2. Vistas de proyecto en el Home — layout y tipografía

- Los **títulos** de proyecto a veces son largos y **se rompen mal** (mala terminación de línea). Ajustar para que nunca se rompan feo.
- La **descripción** (a la derecha) también se rompe → ajustar contención/ancho.
- **Mobile:** la **imagen principal del proyecto se ve muy chica**. En desktop está bien. Escalarla más grande y llamativa en móvil.
- Considerar mobile en TODOS estos ajustes — buena parte del tráfico será móvil. Experiencia dinámica y bien alineada.

## 3. Más dinamismo en las secciones de proyectos del Home

- Se ven muy simples/lisas (solo imagen + texto). Falta vida.
- Si el proyecto tiene **video de fondo**, que se note — pero **muy sutil / super transparente**, para no distraer.
- Agregar **breathing a la imagen** y algo de animación a los textos.
- Que no se sienta estático. (Ojo: que sea sutil; idealmente algo que se note "la primera vez" sin volverse molesto.)

## 4. Reveal de textos en todo el sitio (más sutil y más rápido)

- En general, en **todo el sitio**: que los textos NO estén fijos al cargar, sino que **se revelen al hacer scroll** (de afuera hacia adentro / de abajo hacia arriba, un poco más de recorrido).
- Estilo: animaciones **centradas y elegantes**, no un "animation-in" obvio sobre el texto.
- **Más rápido** que ahora, para que la carga/lectura no se sienta lenta.

## 5. Nuevo componente en el Home — preview de servicios

- Crear (o reusar) un componente tipo **lista de servicios que se van enlistando / desplegando hacia la derecha** (ya existe algo así en la página de Servicios).
- Versión **preview / más ligera** para el Home.
- Ya existe el texto/banner de servicios editable en el admin → usarlo.
- **Lado izquierdo:** una **imagen / icono que vaya cambiando** en sync con el ítem activo de la lista (al cambiar el servicio resaltado, cambia la imagen). Esto aporta dinamismo.
- Los componentes actuales se sienten **demasiado grandes/gigantescos**; balancear el tamaño para que no jueguen en contra.

## 6. Hero — tamaño del texto y chips

- El **texto principal del Hero (typewriter)** se ve **muy gigante** y "tosco". **Reducir su tamaño**.
- Agregar **más chips**, pero **no todos horizontales arriba**: jugar con que estén **sobrepuestos / en diagonal**, rompiendo la línea cuadrada tan "de IA" (todo boxes cuadrados, nada en overlap). Mantener todo bien alineado.
- El **contenido de los chips debe ser configurable desde el admin**.

## 7. Header — efecto Glass/Blur (rehacer)

- El glass/blur actual con **negro se ve muy mal**.
- Queremos un **glass estilo iOS reciente ("liquid glass")**: **blanco/transparente**, mezcla de **blur + glass**, **más transparente**. NO un degradado/overlay negro.
- Que **siempre aplique**, pero opcionalmente de forma **dinámica según el fondo** detrás (ajustar un poco el blur/transparencia según contenido). Lo dinámico es **opcional** — propón lo que te parezca mejor.

## 8. Degradados y microinteracciones (global)

- Muchos componentes usan **colores lisos** (backgrounds, rectángulos, cuadros). Usar **degradados sutiles** (no marcadísimos) para que se sientan más dinámicos y menos planos.
- Jugar **mucho más con microinteracciones**: hover, clicks, etc., en general.

---

## 9. Case Studies — grid / cards (página de proyectos)

- El **grid y el diseño de las cards gustan** — no rediseñar. Quizá **más microinteracciones generales** (sin exagerar, que no se sienta demasiado movido).
- Agregar **patrones de fondo a las cards**, configurables por proyecto:
  - Hoy las cards son degradado + imagen al centro → les falta toque.
  - Proponer **varios patrones SVG** seleccionables desde el admin.
  - **Orden de capas por proyecto:** (1) color de fondo → (2) capa de **patrón** (con **transparencia configurable**) → (3) imagen → (4) textos.
  - Todo configurable **por proyecto** desde el panel.

## 10. Vista de detalle de un proyecto (case study landing)

- El diseño no está mal, va alineado a la referencia, pero queremos que se sienta más como **portfolio de diseñador/UX tipo Behance** — más **custom a nivel visual**.
- **Más variantes de layout** para que NO todos los proyectos se vean iguales: misma información, pero **distribuciones / secciones distintas**, **configurables desde el panel**.
- Ser un poco más **disruptivo** con el orden y las formas de las secciones, para que no se sienta plana.
- Usar el `content.json` actual como base de la info real que ya existe.
- No rediseñar completo: **mejorar la experiencia y las secciones**, más llamativo y visual.

---

## 11. Carrusel de logos de clientes (componente + admin)

- **Toggle en admin (sección Clientes):** mostrar logos **a color** o en **grayscale tirando a blanco**.
  - Razón: se suben logos a color, blancos o negros → poder **pintarlos a blanco / gris muy claro** uniformemente.
- **Hover:**
  - Que **se pause el scroll** del carrusel (verificar; parece que ya lo hace).
  - Que el logo haga un **zoom ligero**, pero **del logo sin máscara que lo corte** (que el contenedor NO recorte). Solo que **crezca un poquito** — microinteracción sencilla, sin que se vea cortado si el logo es grande.
- **Toggle en admin (interacción de color invertida):**
  - Opción para que en estado normal el logo se pinte (p.ej. blanco) dentro del box, y **en hover se pinte a color** (o viceversa) — una **interacción de color invertida**, configurable por panel (activar/desactivar).

---

## 12. Idioma — todo en inglés

- Todo el contenido del sitio es y será **inglés** (el `content.json` ya está en inglés).
- **Adaptar a inglés los títulos/labels del admin panel** y de cualquier sección/campo.
- Si se crea **contenido mock** para nuevas secciones/funciones nuevas → en **inglés** (propuesta lista, aunque luego sea editable desde el panel).
- **Revisar el `content.json`** por **traducciones incorrectas / "muy mexicanas" / malas prácticas** y ajustarlas donde haga falta.

---

## Notas transversales / criterios de aceptación

- Mantener **navegación sencilla** (no agregar fricción); el "wow" viene de la interactividad y lo visual, no de complejidad.
- Todo debe quedar **bien alineado** y responsivo (desktop + mobile).
- Respetar `prefers-reduced-motion` en las animaciones.
- Las nuevas opciones (chips, patrones de cards, fondo por proyecto, toggles de clientes, variantes de detalle) deben ser **configurables desde el admin**.
- No romper lo ya logrado (CMS por `content.json`, admin con secciones, export/import).
