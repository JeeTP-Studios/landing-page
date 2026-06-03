import { useContent } from "@/content/ContentContext";
import type { HomeSectionKey } from "@/types/content";
import {
  Accordion,
  ColorField,
  GradientField,
  ImageField,
  ListField,
  OpacityField,
  SelectField,
  SwitchField,
  TextField,
} from "./fields";
import ObjectListEditor from "./ObjectListEditor";
import SortableList from "./SortableList";

/* ============ GLOBAL ============ */
export function GlobalTab() {
  return (
    <>
      <h2>Global</h2>
      <div className="desc">
        Marca, logo, fondo global y datos de contacto. Aplican en todo el sitio.
      </div>
      <Accordion summary="Marca y logo" open>
        <TextField label="Nombre" path="brand.name" />
        <TextField label="Tagline" path="brand.tagline" />
        <SelectField
          label="Tipo de logo"
          path="brand.logoType"
          options={[
            ["text", "Texto"],
            ["image", "Imagen"],
          ]}
        />
        <ImageField
          label="Imagen del logo (PNG)"
          path="brand.logoImg"
          hint="Si eliges 'Imagen', se usa en header y footer."
        />
      </Accordion>
      <Accordion summary="Fondo global (solo home)">
        <SelectField
          label="Tipo de fondo"
          path="bg.type"
          options={[
            ["none", "Ninguno"],
            ["image", "Imagen"],
            ["video", "Video"],
          ]}
        />
        <ImageField
          label="Imagen / poster"
          path="bg.url"
          hint="Imagen o URL. Para video pega la URL del .mp4."
        />
      </Accordion>
      <Accordion summary="Datos de contacto">
        <TextField label="Email" path="contact.email" />
        <TextField label="WhatsApp" path="contact.whatsapp" />
        <TextField label="Telefono" path="contact.phone" />
        <TextField label="Ubicacion (footer)" path="contact.location" />
        <TextField label="Direccion (pagina contacto)" path="contact.address" />
        <TextField
          label="Lugar para el mapa"
          path="contact.mapQuery"
          hint="Ej: Ciudad de Mexico o una direccion."
        />
      </Accordion>
    </>
  );
}

/* ============ HOME ============ */
const ORDER_NAMES: Record<HomeSectionKey, string> = {
  highlighted: "Proyectos destacados",
  services: "Tarjetas de servicios",
  clients: "Clientes",
  faq: "FAQ",
};

export function HomeTab() {
  const { content, update } = useContent();
  return (
    <>
      <h2>Home</h2>
      <div className="desc">Hero y secciones de la pagina de inicio.</div>

      <Accordion summary="Hero" open>
        <TextField label="Eyebrow" path="hero.eyebrow" />
        <TextField label="Titulo" path="hero.title" area />
        <GradientField prefix="hero" />
        <OpacityField prefix="hero" />
        <TextField
          label="Learn more lleva a"
          path="hero.href"
          hint="Ej: /case-studies o https://..."
        />
      </Accordion>

      <Accordion summary="Proyectos destacados">
        <SwitchField label="Mostrar seccion" path="highlighted.enabled" />
        <TextField label="Label" path="highlighted.label" />
        <TextField label="Titulo" path="highlighted.title" />
        <GradientField prefix="highlighted" />
        <OpacityField prefix="highlighted" />
        <div className="hint">
          Las tarjetas usan los proyectos del menu Case Studies.
        </div>
      </Accordion>

      <Accordion summary="Tarjetas de servicios">
        <SwitchField label="Mostrar seccion" path="services.enabled" />
        <TextField label="Label" path="services.label" />
        <TextField label="Titulo" path="services.title" />
        <GradientField prefix="services" />
        <OpacityField prefix="services" />
        <ObjectListEditor
          path="services.items"
          factory={() => ({
            h: "Nuevo servicio",
            a: "Linea 1",
            b: "Linea 2",
            color: "#7c5cff",
          })}
          labeler={(it) => (it as { h: string }).h}
          addLabel="+ Agregar tarjeta"
          renderItem={(i) => (
            <>
              <TextField label="Titulo" path={`services.items.${i}.h`} />
              <div className="row">
                <TextField label="Linea 1" path={`services.items.${i}.a`} />
                <TextField label="Linea 2" path={`services.items.${i}.b`} />
              </div>
              <ColorField label="Color" path={`services.items.${i}.color`} />
            </>
          )}
        />
      </Accordion>

      <div className="hint" style={{ margin: "0 0 12px" }}>
        El contenido de Clientes se edita en la sección <b>Clientes</b> del menú.
      </div>

      <Accordion summary="FAQ">
        <SwitchField label="Mostrar seccion" path="faq.enabled" />
        <TextField label="Label" path="faq.label" />
        <TextField label="Titulo" path="faq.title" />
        <GradientField prefix="faq" />
        <OpacityField prefix="faq" />
        <ObjectListEditor
          path="faq.items"
          factory={() => ({ q: "Nueva pregunta", a: "Respuesta" })}
          labeler={(_, i) => `Pregunta ${i + 1}`}
          addLabel="+ Agregar pregunta"
          renderItem={(i) => (
            <>
              <TextField label="Pregunta" path={`faq.items.${i}.q`} />
              <TextField label="Respuesta" path={`faq.items.${i}.a`} area />
            </>
          )}
        />
      </Accordion>

      <Accordion summary="Orden de secciones">
        <div className="desc">Arrastra para reordenar. El switch muestra/oculta.</div>
        <SortableList
          ids={content.order}
          onReorder={(ids) =>
            update((d) => {
              d.order = ids as HomeSectionKey[];
            })
          }
          renderItem={(id) => {
            const k = id as HomeSectionKey;
            const enabled = content[k].enabled;
            return (
              <>
                <span className="grip">⠿</span>
                <span className="nm">{ORDER_NAMES[k]}</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) =>
                      update((d) => {
                        d[k].enabled = e.target.checked;
                      })
                    }
                  />
                  <span className="sl" />
                </label>
              </>
            );
          }}
        />
      </Accordion>
    </>
  );
}

/* ============ ABOUT ============ */
export function AboutTab() {
  return (
    <>
      <h2>About Us</h2>
      <div className="desc">Pagina Nosotros.</div>
      <Accordion summary="Hero" open>
        <TextField label="Eyebrow" path="about.hero.eyebrow" />
        <TextField label="Titulo" path="about.hero.title" area />
        <GradientField prefix="about.hero" />
        <OpacityField prefix="about.hero" />
      </Accordion>
      <Accordion summary="Quienes somos">
        <TextField label="Encabezado" path="about.intro.heading" />
        <TextField
          label="Texto (doble salto = nuevo parrafo)"
          path="about.intro.body"
          area
        />
        <div className="hint" style={{ marginTop: 8 }}>
          El carrusel de logos de clientes que aparece debajo se edita en la
          sección <b>Clientes</b> del menú.
        </div>
      </Accordion>
      <Accordion summary="Overview">
        <TextField label="Encabezado" path="about.overview.heading" />
        <TextField label="Texto" path="about.overview.body" area />
      </Accordion>
      <Accordion summary="En que creemos">
        <TextField label="Encabezado" path="about.beliefs.heading" />
        <TextField label="Texto" path="about.beliefs.body" area />
      </Accordion>
      <Accordion summary="En los medios">
        <SwitchField label="Mostrar seccion" path="about.news.enabled" />
        <TextField label="Titulo" path="about.news.title" />
        <ObjectListEditor
          path="about.news.logos"
          factory={() => ({ name: "Nuevo", img: "" })}
          labeler={(l) => (l as { name: string }).name || "Medio"}
          renderItem={(i) => (
            <>
              <TextField label="Nombre" path={`about.news.logos.${i}.name`} />
              <ImageField label="Imagen" path={`about.news.logos.${i}.img`} />
            </>
          )}
        />
      </Accordion>
    </>
  );
}

/* ============ SERVICES ============ */
export function ServicesTab() {
  return (
    <>
      <h2>Services</h2>
      <div className="desc">Pagina de servicios.</div>
      <Accordion summary="Hero" open>
        <TextField label="Eyebrow" path="servicesPage.hero.eyebrow" />
        <TextField label="Titulo" path="servicesPage.hero.title" area />
        <GradientField prefix="servicesPage.hero" />
        <OpacityField prefix="servicesPage.hero" />
      </Accordion>
      <Accordion summary="Grupos de servicios">
        <ObjectListEditor
          path="servicesPage.groups"
          factory={() => ({ num: "00", title: "Nuevo grupo", links: ["Servicio"] })}
          labeler={(g) => {
            const x = g as { num: string; title: string };
            return `${x.num} · ${x.title || ""}`;
          }}
          renumber
          renderItem={(i) => (
            <>
              <TextField label="Titulo" path={`servicesPage.groups.${i}.title`} />
              <ListField
                label="Servicios (uno por renglon)"
                path={`servicesPage.groups.${i}.links`}
                mode="lines"
              />
            </>
          )}
        />
      </Accordion>
      <Accordion summary="A quien ayudamos">
        <SwitchField label="Mostrar seccion" path="servicesPage.who.enabled" />
        <TextField label="Encabezado" path="servicesPage.who.heading" />
        <TextField label="Texto" path="servicesPage.who.body" area />
        <ObjectListEditor
          path="servicesPage.who.cards"
          factory={() => ({ title: "Nuevo", img: "" })}
          labeler={(w) => (w as { title: string }).title || "Card"}
          renderItem={(i) => (
            <>
              <TextField label="Titulo" path={`servicesPage.who.cards.${i}.title`} />
              <ImageField
                label="Imagen (opcional)"
                path={`servicesPage.who.cards.${i}.img`}
              />
            </>
          )}
        />
      </Accordion>
      <Accordion summary="Clientes y medios">
        <TextField label="Titulo de clientes" path="servicesPage.clientsTitle" />
        <div className="hint" style={{ marginBottom: 14 }}>
          La lista de clientes se edita en Home; los medios en About Us.
        </div>
        <SwitchField
          label="Mostrar 'En los medios'"
          path="servicesPage.news.enabled"
        />
      </Accordion>
    </>
  );
}

/* ============ CASE STUDIES (página de listado) ============ */
export function CasesPageTab() {
  return (
    <>
      <h2>Case Studies · Página</h2>
      <div className="desc">
        Ajustes de la página de listado de casos. El alta y edición de proyectos
        está en la sección Case Studies del menú.
      </div>
      <Accordion summary="Encabezado de la página" open>
        <TextField label="Label" path="cases.label" />
        <TextField label="Titulo" path="cases.title" />
      </Accordion>
    </>
  );
}

/* ============ CLIENTES ============ */
export function ClientsTab() {
  return (
    <>
      <h2>Clientes</h2>
      <div className="desc">
        Un solo lugar para gestionar tus clientes: el grid del home y el carrusel
        de logos de la página Nosotros.
      </div>

      <Accordion summary="Lista de clientes (carrusel de logos)" open>
        <div className="hint" style={{ marginBottom: 14 }}>
          Esta lista única se muestra como carrusel de logos en el home, en la
          página de Servicios y en Nosotros.
        </div>
        <div className="fld">
          <label>Velocidad del carrusel</label>
          <div className="rangewrap">
            <CarouselSpeedInput />
          </div>
          <div className="hint">
            Segundos por vuelta completa. Menor = más rápido. (Pausa al pasar el
            cursor.) Todos los logos se muestran a un tamaño uniforme.
          </div>
        </div>
        <div className="ad-grouplabel">Clientes</div>
        <ObjectListEditor
          path="clients.logos"
          factory={() => ({ name: "Nuevo cliente", img: "" })}
          labeler={(l) => (l as { name: string }).name || "Cliente"}
          addLabel="+ Agregar cliente"
          renderItem={(i) => (
            <>
              <TextField label="Nombre" path={`clients.logos.${i}.name`} />
              <ImageField
                label="Logo"
                path={`clients.logos.${i}.img`}
                hint="PNG/SVG transparente recomendado. Si no hay logo, se muestra el nombre."
              />
            </>
          )}
        />
      </Accordion>

      <Accordion summary="Bloque de clientes en el sitio (estilo)">
        <SwitchField label="Mostrar seccion en el home" path="clients.enabled" />
        <div className="hint" style={{ marginBottom: 14 }}>
          El orden y la visibilidad dentro del home se ajustan en Páginas →
          Inicio → Orden de secciones.
        </div>
        <TextField label="Titulo de la seccion" path="clients.title" />
        <GradientField prefix="clients" />
        <OpacityField prefix="clients" />
      </Accordion>
    </>
  );
}

/** Slider numérico para la velocidad del carrusel. */
function CarouselSpeedInput() {
  const { content, update } = useContent();
  const v = content.carousel.speedSec;
  return (
    <>
      <input
        type="range"
        min={6}
        max={80}
        step={1}
        value={v}
        onChange={(e) =>
          update((d) => {
            d.carousel.speedSec = Number(e.target.value);
          })
        }
      />
      <span className="val">{v}s</span>
    </>
  );
}

/* ============ TEXTOS UI ============ */
export function TextsTab() {
  return (
    <>
      <h2>Textos del sitio</h2>
      <div className="desc">
        Etiquetas, botones y textos repetidos en todo el sitio (navegación, pie
        de página, formularios y labels de los case studies).
      </div>

      <Accordion summary="Menú de navegación" open>
        <div className="row">
          <TextField label="Inicio" path="ui.nav.home" />
          <TextField label="Nosotros" path="ui.nav.about" />
        </div>
        <div className="row">
          <TextField label="Servicios" path="ui.nav.services" />
          <TextField label="Case Studies" path="ui.nav.cases" />
        </div>
        <TextField label="Contacto" path="ui.nav.contact" />
      </Accordion>

      <Accordion summary="Botones repetidos">
        <TextField
          label="'Todos los casos' (home destacados)"
          path="ui.buttons.allCases"
        />
        <TextField
          label="'Ver servicios' (home servicios)"
          path="ui.buttons.viewServices"
        />
        <TextField
          label="'Ver casos' (bloque de clientes)"
          path="ui.buttons.viewCases"
        />
        <TextField
          label="Hover del hero ('VER CASO')"
          path="ui.buttons.floatLearn"
        />
        <TextField
          label="'Mira nuestros casos' (página Nosotros)"
          path="ui.buttons.aboutCases"
        />
      </Accordion>

      <Accordion summary="Pie de página">
        <div className="row">
          <TextField label="Título 'Navegación'" path="ui.footer.navTitle" />
          <TextField label="Título 'Servicios'" path="ui.footer.servicesTitle" />
        </div>
        <TextField label="Título de redes" path="ui.footer.socialTitle" />
        <div className="ad-grouplabel">Redes sociales (label + URL)</div>
        <ObjectListEditor
          path="ui.footer.social"
          factory={() => ({ label: "Red", url: "#" })}
          labeler={(s) => (s as { label: string }).label || "Red"}
          renderItem={(i) => (
            <div className="row">
              <TextField label="Nombre" path={`ui.footer.social.${i}.label`} />
              <TextField label="URL" path={`ui.footer.social.${i}.url`} />
            </div>
          )}
        />
        <div className="ad-grouplabel">Banda CTA y legal</div>
        <TextField label="Texto CTA" path="ui.footer.ctaText" />
        <TextField label="Botón CTA" path="ui.footer.ctaButton" />
        <TextField
          label="Copyright"
          path="ui.footer.copyright"
          hint="Usa {name} para el nombre de marca y {year} para el año."
        />
        <TextField label="Nota final (derecha)" path="ui.footer.madeIn" />
      </Accordion>

      <Accordion summary="Otros bloques">
        <TextField
          label="Título lateral (página Servicios)"
          path="ui.servicesPageTitle"
        />
        <div className="ad-grouplabel">Caja 'más preguntas' (FAQ)</div>
        <TextField label="Título" path="ui.faqBox.title" />
        <TextField label="Texto" path="ui.faqBox.body" area />
        <TextField label="Botón" path="ui.faqBox.button" />
      </Accordion>

      <Accordion summary="Labels de Case Study">
        <TextField label="Botón volver" path="ui.caseStudy.back" />
        <div className="row">
          <TextField label="Spec categoría" path="ui.caseStudy.specCategory" />
          <TextField label="Spec duración" path="ui.caseStudy.specDuration" />
        </div>
        <div className="row">
          <TextField label="Spec año · lugar" path="ui.caseStudy.specMeta" />
          <TextField label="'Up next'" path="ui.caseStudy.upNext" />
        </div>
      </Accordion>

      <Accordion summary="Formulario de contacto">
        <TextField label="Título 'Get in touch'" path="ui.contactForm.getInTouch" />
        <TextField label="Placeholder servicio" path="ui.contactForm.service" />
        <div className="row">
          <TextField label="Placeholder nombre" path="ui.contactForm.name" />
          <TextField label="Placeholder teléfono" path="ui.contactForm.phone" />
        </div>
        <div className="row">
          <TextField label="Placeholder email" path="ui.contactForm.email" />
          <TextField label="Placeholder empresa" path="ui.contactForm.company" />
        </div>
        <TextField label="Placeholder mensaje" path="ui.contactForm.message" />
        <TextField label="Botón enviar" path="ui.contactForm.send" />
      </Accordion>
    </>
  );
}

/* ============ CONTACT ============ */
export function ContactTab() {
  return (
    <>
      <h2>Contacto</h2>
      <div className="desc">
        Pagina de contacto. Email, telefono, direccion y mapa se editan en Global.
      </div>
      <Accordion summary="Hero" open>
        <TextField label="Eyebrow" path="contactPage.hero.eyebrow" />
        <TextField label="Titulo" path="contactPage.hero.title" />
        <TextField label="Subtitulo" path="contactPage.hero.sub" area />
        <GradientField prefix="contactPage.hero" />
        <OpacityField prefix="contactPage.hero" />
      </Accordion>
      <Accordion summary="Regiones (toggle)">
        <ObjectListEditor
          path="contactPage.regions"
          factory={() => ({ name: "Nueva region", flag: "" })}
          labeler={(r) => (r as { name: string }).name || "Region"}
          renderItem={(i) => (
            <div className="row">
              <TextField label="Nombre" path={`contactPage.regions.${i}.name`} />
              <TextField
                label="Bandera / emoji"
                path={`contactPage.regions.${i}.flag`}
              />
            </div>
          )}
        />
      </Accordion>
      <Accordion summary="Textos del formulario">
        <TextField label="Titulo (izquierda)" path="contactPage.interestedTitle" />
        <TextField label="Subtexto 'Get in touch'" path="contactPage.getInTouch" />
      </Accordion>
    </>
  );
}
