import type { CaseSection, Project, SiteContent } from "@/types/content";

let _sid = 0;
const sid = (t: string) => `${t}-${(++_sid).toString(36)}`;

/** Construye el set de secciones por defecto de un case study.
 *  Replica el contenido legacy y agrega las secciones nuevas (challenge,
 *  methodology, gallery) para landings más completas estilo case study. */
function defaultSections(opts: {
  name: string;
  overview: string;
  goal: string;
  solution: string[];
  impact: string;
  conclusion: string;
  steps: [string, string][];
}): CaseSection[] {
  return [
    {
      id: sid("overview"),
      type: "overview",
      enabled: true,
      label: "Overview",
      title: `All about ${opts.name}`,
      body: opts.overview,
      image: "",
    },
    {
      id: sid("challenge"),
      type: "challenge",
      enabled: true,
      title: "Challenge / Problem statement",
      intro: opts.goal,
      problems: [],
      approachTitle: "Solution",
      approach: opts.solution,
      images: [],
    },
    {
      id: sid("process"),
      type: "process",
      enabled: true,
      title: "Project process",
      steps: opts.steps,
    },
    {
      id: sid("methodology"),
      type: "methodology",
      enabled: true,
      title: "Metodología",
      items: [
        {
          heading: "Impacto",
          body: opts.impact,
        },
      ],
    },
    {
      id: sid("gallery"),
      type: "gallery",
      enabled: false,
      title: "UI Design",
      layout: "grid",
      items: [],
    },
    {
      id: sid("conclusion"),
      type: "conclusion",
      enabled: true,
      title: "Conclusion",
      body: opts.conclusion,
      image: "",
    },
    {
      id: sid("cta"),
      type: "cta",
      enabled: true,
      text: "Quieres algo asi para tu marca?",
      buttonLabel: "Trabaja con nosotros",
    },
  ];
}

const projects: Project[] = [
  {
    id: "club-premier",
    name: "Club Premier",
    ghost: "CLUB",
    mono: "CP",
    img: "",
    tags: ["Gaming", "Lealtad"],
    desc: "Dos juegos interactivos para campanas con socios: canjea puntos por viajes y eleva el engagement del programa de lealtad.",
    gradA: "#2ea3d8",
    gradB: "#06182e",
    angle: 140,
    opacity: 1,
    accent: "#2ea3d8",
    category: "Website & App",
    duration: "2 meses",
    year: "2025",
    location: "Mexico",
    heroMode: "auto",
    heroImage: "",
    sections: defaultSections({
      name: "Club Premier",
      overview:
        "Un programa de lealtad que convierte puntos en experiencias: juegos de campana para canjear y enganchar a los socios.",
      goal: "Club Premier nos busco para crear experiencias de juego que elevaran el canje de puntos y el engagement de su programa con socios.",
      solution: [
        "Mecanica de juego clara y rapida.",
        "Integracion con el catalogo de canje.",
        "Diseno mobile-first.",
      ],
      impact:
        "Aumento del engagement y del canje de puntos durante las campanas con socios.",
      conclusion:
        "Entregamos experiencias de juego que dieron vida al programa de lealtad y conectaron a los socios con la marca.",
      steps: [
        ["01", "Definir objetivos"],
        ["02", "Diseno de mecanica"],
        ["03", "Desarrollo"],
        ["04", "QA & lanzamiento"],
      ],
    }),
  },
  {
    id: "kings-league",
    name: "Kings League",
    ghost: "KINGS",
    mono: "KL",
    img: "",
    tags: ["Plataforma", "Sports", "Fantasy"],
    desc: "Plataforma de fantasy sports que conecta a los fans con la liga: drafts, puntajes en vivo y competencia entre usuarios.",
    gradA: "#ff3b3b",
    gradB: "#2a0508",
    angle: 140,
    opacity: 1,
    accent: "#ff3b3b",
    category: "Plataforma",
    duration: "4 meses",
    year: "2025",
    location: "Americas",
    heroMode: "auto",
    heroImage: "",
    sections: defaultSections({
      name: "Kings League",
      overview:
        "Plataforma de fantasy sports para conectar a los fans con la liga con drafts y competencia en vivo.",
      goal: "Construir una plataforma de fantasy que mantenga a los fans activos durante toda la temporada.",
      solution: [
        "Drafts y armado de equipos.",
        "Puntajes en vivo.",
        "Competencia entre usuarios y ligas privadas.",
      ],
      impact: "Mayor tiempo de permanencia y comunidad activa de fans.",
      conclusion:
        "Una plataforma que convirtio a los espectadores en participantes activos de la liga.",
      steps: [
        ["01", "Research"],
        ["02", "Wireframing"],
        ["03", "Desarrollo"],
        ["04", "Testing"],
      ],
    }),
  },
  {
    id: "retail-experience",
    name: "Retail Experience",
    ghost: "RETAIL",
    mono: "RX",
    img: "",
    tags: ["Web", "Activacion"],
    desc: "Experiencia web interactiva para activaciones en punto de venta, con premio inmediato y captura de leads.",
    gradA: "#c44bff",
    gradB: "#1a0633",
    angle: 140,
    opacity: 1,
    accent: "#c44bff",
    category: "Website",
    duration: "1 mes",
    year: "2025",
    location: "Mexico",
    heroMode: "auto",
    heroImage: "",
    sections: defaultSections({
      name: "Retail Experience",
      overview:
        "Experiencia web para activaciones en punto de venta con premio inmediato y captura de leads.",
      goal: "Crear una activacion digital que generara leads y engagement en el punto de venta.",
      solution: [
        "Mecanica de premio inmediato.",
        "Captura de datos integrada.",
        "Diseno responsivo para uso en sitio.",
      ],
      impact: "Captura efectiva de leads y mayor interaccion en activaciones.",
      conclusion:
        "Una experiencia que convirtio el punto de venta en un canal digital de captacion.",
      steps: [
        ["01", "Brief"],
        ["02", "Diseno"],
        ["03", "Desarrollo"],
        ["04", "Lanzamiento"],
      ],
    }),
  },
];

export const DEFAULTS: SiteContent = {
  brand: {
    name: "JEETP STUDIOS",
    tagline: "FABRICA DE SOFTWARE",
    logoType: "text",
    logoImg: "",
  },
  bg: { type: "none", url: "" },
  hero: {
    eyebrow: "El presente",
    title:
      "Somos una fabrica digital que ayuda a las marcas a crecer sin limites",
    titles: [
      "We are a software factory that helps brands grow without limits",
      "We design experiences people remember",
      "We build product, brand and technology — tailor-made",
    ],
    chips: [
      "Software factory",
      "UX / UI",
      "Interactive experiences",
      "Web & App",
      "Branding",
    ],
    gradA: "#7c5cff",
    gradB: "#06182e",
    angle: 140,
    opacity: 1,
    href: "#",
  },
  projects,
  highlighted: {
    enabled: true,
    label: "Casos de estudio",
    title: "Proyectos destacados",
    gradA: "#0e0636",
    gradB: "#0b042a",
    angle: 160,
    opacity: 1,
  },
  services: {
    enabled: true,
    label: "Servicios",
    title: "Todo lo que tu marca necesita construir",
    gradA: "#0b042a",
    gradB: "#0b042a",
    angle: 160,
    opacity: 1,
    items: [
      {
        h: "Experiencias interactivas",
        a: "Activaciones e inmersiones",
        b: "Web · Mobile · AR",
        color: "#ff2e76",
      },
      {
        h: "Videojuegos",
        a: "Juegos de campana y lealtad",
        b: "Gamificacion · Engagement",
        color: "#2563d8",
      },
      {
        h: "Apps & Web",
        a: "Productos a medida",
        b: "iOS · Android · Web",
        color: "#7c4dff",
      },
      {
        h: "Plataformas",
        a: "Software a la medida",
        b: "Dashboards · Automatizacion",
        color: "#1fc7c7",
      },
      {
        h: "Estrategia digital",
        a: "Marketing con tecnologia",
        b: "Activaciones comerciales",
        color: "#ff7a2e",
      },
    ],
  },
  clients: {
    enabled: true,
    title: "Nuestros clientes",
    gradA: "#0e0636",
    gradB: "#0b042a",
    angle: 160,
    opacity: 1,
    logos: [
      { name: "Club Premier", img: "" },
      { name: "Kings League", img: "" },
      { name: "Aeromexico", img: "" },
      { name: "Retail", img: "" },
      { name: "Fintech", img: "" },
      { name: "Sports", img: "" },
      { name: "Privados", img: "" },
      { name: "Startups", img: "" },
      { name: "Agencias", img: "" },
      { name: "E-commerce", img: "" },
      { name: "Eventos", img: "" },
      { name: "+ tu marca", img: "" },
    ],
  },
  faq: {
    enabled: true,
    label: "FAQs",
    title: "Preguntas frecuentes",
    gradA: "#0b042a",
    gradB: "#0b042a",
    angle: 160,
    opacity: 1,
    items: [
      {
        q: "Por que son una fabrica y no una agencia?",
        a: "Operamos sin las capas de intermediarios ni el overhead de una agencia. Costos mas bajos, tiempos reales y flexibilidad para escalar segun el proyecto.",
      },
      {
        q: "Que tipo de proyectos desarrollan?",
        a: "Experiencias interactivas, videojuegos, apps, plataformas a medida, sitios web y soluciones tecnologicas para estrategias comerciales.",
      },
      {
        q: "Trabajan con agencias?",
        a: "Si. Somos el brazo tecnico que muchas agencias necesitan sin tener que contratarlo, trabajando detras del telon o de frente.",
      },
      {
        q: "Y si necesito algo que nunca han hecho?",
        a: "Lo aprendemos y lo construimos. Nunca decimos que no: encontramos el como.",
      },
      {
        q: "Como empezamos un proyecto?",
        a: "Con una llamada corta para entender que quieres lograr. Definimos alcance, tiempos y costos, y arrancamos.",
      },
    ],
  },
  contact: {
    email: "hola@jeetpstudio.com",
    whatsapp: "+52 55 3647 9693",
    phone: "+52 55 3647 9693",
    location: "CDMX, Mexico",
    address: "Ciudad de Mexico, Mexico",
    mapQuery: "Ciudad de Mexico",
  },
  about: {
    hero: {
      eyebrow: "Nosotros",
      title:
        "Una fabrica de software que construye a la medida desde el dia uno",
      gradA: "#0e0636",
      gradB: "#06182e",
      angle: 150,
      opacity: 1,
    },
    intro: {
      heading: "Quienes somos",
      body: "En JeeTP Studios disenamos y construimos productos digitales a la medida: experiencias interactivas, videojuegos, apps y plataformas. Somos un equipo de desarrolladores, disenadores y estrategas que trabaja como el brazo tecnico de marcas y agencias.\n\nOperamos como fabrica, no como agencia: sin capas de intermediarios ni overhead innecesario. Eso significa costos mas bajos, tiempos reales y la flexibilidad de escalar segun cada proyecto.",
    },
    overview: {
      heading: "Overview",
      body: "Hemos desarrollado experiencias para programas de lealtad, ligas deportivas y activaciones comerciales, conectando tecnologia con objetivos de negocio.\n\nCada proyecto arranca con una conversacion corta para entender que se quiere lograr; de ahi definimos alcance, tiempos y costos, y construimos.",
    },
    beliefs: {
      heading: "En que creemos",
      body: "Creemos en construir productos que funcionan para las personas, no al reves. De la investigacion al diseno y al testing, no paramos hasta que el resultado cumple.\n\nY si aparece algo que nunca hemos hecho, lo aprendemos y lo construimos. Nunca decimos que no: encontramos el como.",
    },
    news: {
      enabled: true,
      title: "En los medios",
      logos: [
        { name: "MEDIO 1", img: "" },
        { name: "MEDIO 2", img: "" },
        { name: "MEDIO 3", img: "" },
        { name: "MEDIO 4", img: "" },
        { name: "MEDIO 5", img: "" },
      ],
    },
  },
  servicesPage: {
    hero: {
      eyebrow: "Lo que ofrecemos",
      title:
        "Creamos grandes experiencias digitales para todas las industrias",
      gradA: "#1a0633",
      gradB: "#06182e",
      angle: 150,
      opacity: 1,
    },
    groups: [
      {
        num: "01",
        title: "Experiencias interactivas",
        links: [
          "Activaciones digitales",
          "Experiencias AR",
          "Gamificacion",
          "Instalaciones interactivas",
          "Web inmersiva",
          "Prototipado de experiencias",
        ],
      },
      {
        num: "02",
        title: "Videojuegos",
        links: [
          "Juegos de campana",
          "Juegos de lealtad",
          "Minijuegos web",
          "Game design",
          "Mecanicas de engagement",
        ],
      },
      {
        num: "03",
        title: "Apps & Web",
        links: [
          "Apps iOS / Android",
          "Sitios y landing pages",
          "E-commerce",
          "PWAs",
          "Integraciones",
        ],
      },
      {
        num: "04",
        title: "Plataformas a medida",
        links: [
          "Dashboards",
          "Automatizacion",
          "APIs e integraciones",
          "Paneles internos",
          "Software a medida",
        ],
      },
      {
        num: "05",
        title: "Estrategia digital",
        links: [
          "Estrategia de producto",
          "Marketing con tecnologia",
          "Activaciones comerciales",
          "Consultoria tecnica",
        ],
      },
    ],
    who: {
      enabled: true,
      heading: "A quien ayudamos",
      body: "Trabajamos con todos: desde startups hasta corporativos y agencias, entregando productos digitales con experiencias que hacen que los usuarios regresen.",
      cards: [
        { title: "Startups", img: "" },
        { title: "Agencias", img: "" },
        { title: "Marcas & Retail", img: "" },
        { title: "Deportes", img: "" },
        { title: "Eventos", img: "" },
      ],
    },
    clientsTitle: "Nuestros clientes",
    news: { enabled: true },
  },
  cases: { label: "Casos de estudio · proyectos reales", title: "Case Studies" },
  contactPage: {
    hero: {
      eyebrow: "Contacto",
      title: "Nos encantaria saber de ti",
      sub: "Ya sea que quieras trabajar con nosotros en un nuevo proyecto, conocer mas de lo que hacemos, o simplemente preguntarnos algo.",
      gradA: "#1a0633",
      gradB: "#06182e",
      angle: 150,
      opacity: 1,
    },
    regions: [
      { name: "Mexico", flag: "🇲🇽" },
      { name: "Remoto · LATAM", flag: "🌎" },
    ],
    interestedTitle: "Te interesan nuestros servicios?",
    getInTouch: "Cuentanos un poco sobre tu proyecto:",
  },
  ui: {
    nav: {
      home: "Inicio",
      about: "Nosotros",
      services: "Servicios",
      cases: "Case Studies",
      contact: "Contacto",
    },
    buttons: {
      allCases: "Todos los casos",
      viewServices: "Ver servicios",
      viewCases: "Ver casos",
      floatLearn: "VER CASO",
      aboutCases: "Mira nuestros casos →",
    },
    footer: {
      navTitle: "Navegacion",
      servicesTitle: "Servicios",
      socialTitle: "Seguinos",
      social: [
        { label: "LinkedIn", url: "#" },
        { label: "Instagram", url: "#" },
        { label: "X", url: "#" },
        { label: "YouTube", url: "#" },
      ],
      ctaText: "Transforma y haz crecer tu negocio",
      ctaButton: "Trabaja con nosotros",
      copyright: "© 2026 {name}. Todos los derechos reservados.",
      madeIn: "Hecho en la fabrica · CDMX",
    },
    servicesPageTitle: "Nuestros servicios",
    faqBox: {
      title: "Tienes mas preguntas?",
      body: "Si tienes mas dudas, escribenos cuando quieras.",
      button: "Ir a contacto →",
    },
    caseStudy: {
      back: "← Volver a casos",
      specCategory: "UX / UI",
      specDuration: "Duracion",
      specMeta: "Ano · Lugar",
      upNext: "Up next",
    },
    contactForm: {
      getInTouch: "Get in touch",
      service: "Servicio de interes",
      name: "Tu nombre",
      phone: "Telefono",
      email: "Correo electronico",
      company: "Empresa",
      message: "Un resumen de tu proyecto",
      send: "Enviar mensaje",
    },
  },
  carousel: { speedSec: 30 },
  order: ["highlighted", "services", "clients", "faq"],
};
