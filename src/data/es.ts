import type { Overlay } from "@/types/content";
import { ES_PROJECTS } from "./es-projects";

/* Spanish overlay for the whole site. Only translated strings appear here;
   everything else (media, colours, numbers, order, links) is shared with the
   English document. Lists are index-addressed, projects and case sections are
   keyed by id (see src/content/i18n.ts). */

export const ES_OVERLAY: Overlay = {
  hero: {
    lines: ["Tecnología", "que mueve", "negocios."],
    accent: "mueve",
    sub: "Software a la medida, inteligencia artificial y experiencias digitales para empresas que quieren crecer.",
    scrollLabel: "Desliza",
  },
  manifesto: {
    statements: [
      "Tu negocio no necesita más tecnología.",
      "Necesita la tecnología correcta.",
      "La diseñamos, la construimos y la hacemos crecer contigo.",
      "Datos, inteligencia y experiencia en una sola solución.",
    ],
  },
  stack: { labels: ["Experiencia", "Inteligencia", "Datos y sistemas"] },
  aboutBlock: {
    kicker: "Quiénes somos",
    statement:
      "Somos el socio tecnológico de marcas y empresas en México y Estados Unidos. Nacimos creando videojuegos, y de ahí viene nuestra regla: la tecnología sólo sirve si la gente quiere usarla.",
  },
  stats: {
    items: [
      { label: "Proyectos lanzados" },
      { label: "Industrias atendidas" },
      { label: "Años construyendo marcas" },
      { label: "Usuarios finales alcanzados" },
    ],
  },
  solutions: {
    label: "Soluciones",
    items: [
      {
        title: "Software a la medida.",
        body: "Plataformas y sistemas construidos alrededor de cómo funciona tu negocio.",
        chips: ["Plataformas web", "Sistemas internos", "Integraciones", "Modernización"],
      },
      {
        title: "Inteligencia artificial.",
        body: "IA conectada a tus procesos, con personas aprobando lo importante.",
        chips: ["Agentes de IA", "Asistentes", "Búsqueda inteligente", "Visibilidad en IA"],
      },
      {
        title: "Datos y automatización.",
        body: "Tu información en un solo lugar y procesos que dejan de ser manuales.",
        chips: ["Tableros", "Reportes", "Automatización", "Back office"],
      },
      {
        title: "Apps y producto digital.",
        body: "Productos que la gente entiende, usa y recomienda.",
        chips: ["iOS y Android", "Sitios web", "E-commerce", "UX y UI"],
      },
      {
        title: "Experiencias de marca.",
        body: "Nuestro origen: juegos y activaciones que hacen volver a tus clientes.",
        chips: ["Gamificación", "Lealtad", "Activaciones", "Realidad aumentada"],
      },
      {
        title: "Consultoría.",
        body: "Definimos qué construir, en qué orden y con qué retorno.",
        chips: ["Diagnóstico", "Hoja de ruta", "Arquitectura"],
      },
    ],
  },
  projects: ES_PROJECTS,
  work: {
    title: "Trabajo real.",
    accent: "real.",
    kicker: "Seis proyectos en manos de la gente",
  },
  clients: { title: "Marcas que han confiado en JeeTP" },
  products: {
    title: "Productos propios.",
    accent: "propios.",
    intro: "Probamos en casa lo que después llevamos a nuestros clientes.",
    items: [
      {
        title: "Que la IA recomiende tu marca.",
        body: "Mide cómo aparece tu marca en las respuestas de los asistentes de IA y qué hacer para mejorar.",
        linkLabel: "Conocer Synthex ↗",
      },
      {
        title: "Tu tienda en línea, más inteligente.",
        body: "Búsqueda que entiende a tus clientes y recomendaciones que venden.",
        linkLabel: "Conocer Synthex Commerce ↗",
      },
      {
        title: "Tu próxima empresa, tomando forma.",
        body: "Un equipo ejecutivo de IA que investiga tu mercado, arma el plan y mueve tu negocio hacia adelante. Tú decides cada paso.",
        linkLabel: "Conocer Pliks ↗",
      },
    ],
  },
  process: {
    title: "Cómo trabajamos.",
    accent: "trabajamos.",
    steps: [
      {
        title: "Diagnóstico",
        body: "Entendemos tu operación y dónde la tecnología mueve el resultado.",
      },
      { title: "Diseño", body: "Ves pantallas reales desde las primeras semanas." },
      { title: "Construcción", body: "Entregas semanales con software funcionando." },
      { title: "Evolución", body: "Medimos, operamos y mejoramos contigo." },
    ],
  },
  faq: {
    title: "Preguntas que nos hacen primero.",
    accent: "nos hacen primero.",
    items: [
      {
        q: "¿Qué tipo de proyectos toman?",
        a: "Cualquier cosa que termine en software funcionando. Plataformas web, apps móviles, herramientas internas, integraciones, e-commerce y, de vez en cuando, un juego o una activación de marca. Si se puede construir, entra en el alcance.",
      },
      {
        q: "¿Trabajan con plantillas?",
        a: "No. Definimos cada proyecto alrededor del problema que tenemos enfrente, por eso dos clientes de la misma industria rara vez terminan con el mismo sistema.\nSi una herramienta ya hecha te sirve mejor, te lo diremos en lugar de cobrarte la diferencia.",
      },
      {
        q: "¿Qué tan pequeño o grande puede ser un proyecto?",
        a: "Desde un desarrollo de un mes hasta una plataforma que operamos por años. Ajustamos el equipo al proyecto y no al revés, así que un trabajo pequeño no se queda con las sobras de un equipo chico.",
      },
      {
        q: "¿Trabajan con agencias?",
        a: "Seguido. Somos el equipo de desarrollo que muchas agencias necesitan sin tener que contratarlo, ya sea detrás de cámaras o de frente al cliente.",
      },
      {
        q: "¿Cómo empieza un proyecto?",
        a: "Una llamada corta sobre lo que necesitas que pase. Regresamos con alcance, plazos y costo, y cuando estés de acuerdo empezamos a construir.",
      },
    ],
  },
  closing: {
    kicker: "¿Tienes un reto?",
    word: "Hablemos.",
    emailLabel: "Escríbenos",
    emailCopied: "Correo copiado",
    whatsappLabel: "WhatsApp",
    locationLabel: "Dónde estamos",
    remoteLabel: "Trabajamos",
    remoteValue: "Remoto, en español e inglés",
  },
  contact: {
    location: "Texas · Ciudad de México",
    address: "Texas, Estados Unidos",
  },
  about: {
    hero: {
      eyebrow: "Nosotros",
      title: "Un equipo de desarrollo que parte de tu problema",
      accent: "tu problema",
    },
    intro: {
      heading: "Quiénes somos",
      body: "JeeTP Studios construye software a la medida. Plataformas web, apps móviles, herramientas internas, integraciones y el trabajo interactivo que algunos clientes necesitan además. Somos desarrolladores, diseñadores y estrategas que actúan como el equipo técnico de empresas que no tienen uno, o que necesitan uno más grande por un tiempo.\nNo hay capas de cuentas entre tú y las personas que escriben el código. El costo se mantiene bajo, los plazos son honestos y podemos dimensionar un equipo para un solo proyecto en lugar de una iguala.",
    },
    overview: {
      heading: "Lo que hemos construido",
      body: "Plataformas de lealtad, productos deportivos, sitios web de empresas de elevadores, tableros internos, activaciones comerciales. Industrias distintas, el mismo trabajo: descubrir lo que el negocio realmente necesita y construir eso.\nTodo proyecto empieza con una conversación sobre el problema. A partir de ahí definimos alcance, plazos y costo, y luego lo construimos.",
    },
    beliefs: {
      heading: "En qué creemos",
      body: "El software debe adaptarse al negocio, no al revés. La mayoría de los sistemas malos que nos llaman a reemplazar se construyeron sobre una plantilla que alguien tenía a la mano.\nCuando un proyecto necesita algo que nunca hemos hecho, lo aprendemos y lo construimos.",
    },
  },
  servicesPage: {
    hero: {
      eyebrow: "Lo que hacemos",
      title: "Software hecho a la medida de tu problema, no una plantilla",
      accent: "tu problema",
    },
    groups: [
      {
        title: "Software a la medida",
        links: [
          "Plataformas web",
          "Herramientas internas",
          "Integraciones a la medida",
          "Desarrollo de APIs",
          "Reconstrucción de sistemas heredados",
          "Arquitectura técnica",
        ],
      },
      {
        title: "Apps móviles y web",
        links: [
          "Apps iOS y Android",
          "Aplicaciones web progresivas",
          "Desarrollos multiplataforma",
          "Publicación en tiendas de apps",
          "Sitios web y páginas de aterrizaje",
          "E-commerce",
        ],
      },
      {
        title: "Datos y automatización",
        links: [
          "Tableros para clientes",
          "Reportes internos",
          "Automatización de procesos",
          "Integraciones con terceros",
          "Back offices a la medida",
        ],
      },
      {
        title: "Trabajo interactivo y juegos",
        links: [
          "Advergaming",
          "Gamificación",
          "Juegos de lealtad",
          "Experiencias de realidad aumentada",
          "Activaciones digitales",
          "Instalaciones interactivas",
        ],
      },
      {
        title: "Estrategia y soporte",
        links: [
          "Estrategia de producto",
          "Consultoría técnica",
          "Mantenimiento y soporte",
          "Ampliación de equipo",
        ],
      },
    ],
    who: {
      heading: "Con quién trabajamos",
      body: "Startups, agencias, corporativos. Presupuestos distintos, el mismo estándar en lo que entregamos.",
      cards: [
        { title: "Startups" },
        { title: "Agencias" },
        { title: "Empresas" },
        { title: "Retail y comercio" },
        { title: "Deportes y entretenimiento" },
      ],
    },
  },
  cases: {
    label: "Trabajo",
    title: "Cada proyecto, de principio a fin",
    accent: "de principio a fin",
  },
  contactPage: {
    hero: {
      eyebrow: "Contacto",
      title: "Cuéntanos qué quieres construir",
      accent: "construir",
      sub: "Un proyecto nuevo, una segunda opinión sobre uno que ya empezaste, o sólo una pregunta sobre cómo trabajamos.",
    },
    regions: [
      { name: "Estados Unidos" },
      { name: "México" },
      { name: "Remoto, en todo el mundo" },
    ],
    interestedTitle: "Empieza un proyecto con nosotros",
    getInTouch:
      "Mientras más nos cuentes desde el inicio, más útil será nuestra primera respuesta.",
  },
  ui: {
    nav: {
      home: "Inicio",
      about: "Nosotros",
      services: "Servicios",
      cases: "Trabajo",
      contact: "Contacto",
    },
    buttons: {
      contact: "Hablemos",
      work: "Ver el trabajo",
      allWork: "Todo el trabajo",
    },
    language: { label: "Idioma", switchTo: "Cambiar idioma" },
    menu: { open: "Abrir menú", close: "Cerrar menú" },
    faqBox: {
      title: "¿Aún tienes una pregunta?",
      body: "Envíanosla. Respondemos en un día hábil y te diremos con franqueza si no somos el equipo indicado.",
      button: "Hablemos",
    },
    caseStudy: {
      back: "Volver al trabajo",
      specCategory: "Tipo",
      specDuration: "Duración",
      specMeta: "Año y lugar",
      upNext: "Siguiente caso",
      problemsTitle: "Lo que estaba en el camino",
      openImage: "Abrir imagen",
      playVideo: "Reproducir video",
      close: "Cerrar",
      video: "Video",
    },
    casesIndex: {
      filterLabel: "Filtrar por disciplina",
      emptyTitle: "Todavía no hay nada en esa disciplina.",
      emptyBody:
        "Está en el plan. Mientras tanto, el archivo completo está a un clic.",
    },
    contactForm: {
      sendWhatsapp: "Enviar por WhatsApp",
      service: "Qué necesitas",
      serviceNone: "Elige una opción",
      name: "Tu nombre",
      phone: "Teléfono",
      email: "Correo",
      company: "Empresa",
      message: "Sobre el proyecto",
      messageHint: "Qué quieres construir y, más o menos, para cuándo.",
      optional: "Opcional",
      send: "Enviar por correo",
      addressLabel: "Dirección",
      emailLabel: "Correo",
      phoneLabel: "Teléfono y WhatsApp",
      regionsLabel: "Dónde estás",
      errorName: "Necesitamos un nombre para responderte.",
      errorEmailMissing: "Agrega un correo para poder responderte.",
      errorEmailInvalid: "Ese correo no parece estar completo.",
      errorMessage: "Con una o dos frases sobre el proyecto basta.",
      doneTitle: "Tu mensaje va en camino.",
      doneWhatsapp:
        "Abrimos WhatsApp con todo listo. Envíalo ahí y te responderemos en un día hábil.",
      doneEmail:
        "Abrimos tu aplicación de correo con todo listo. Envíalo y te responderemos en un día hábil.",
      writeAnother: "Escribir otro",
      mailSubject: "Nueva solicitud de proyecto",
      mailSubjectFrom: "Nueva solicitud de proyecto de {company}",
      notSpecified: "Sin especificar",
      bodyService: "Servicio",
      bodyName: "Nombre",
      bodyCompany: "Empresa",
      bodyEmail: "Correo",
      bodyPhone: "Teléfono",
      bodyProject: "Proyecto",
    },
    loading: "Cargando",
    error: { title: "Algo salió mal", back: "Volver al inicio" },
  },
};
