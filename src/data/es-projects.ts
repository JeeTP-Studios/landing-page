import type { Overlay } from "@/types/content";

/* Spanish overlay of the case studies, keyed by project id and, inside each
   project, by section id (see src/content/i18n.ts). Names stay as they are. */

const cta = (text: string) => ({
  text,
  buttonLabel: "Trabaja con nosotros",
});
const steps = (...t: string[]) => t.map((x) => ["", x]);
const SOLUTION = "Solución";
const CHALLENGE = "Reto / Planteamiento del problema";
const PROCESS = "Proceso del proyecto";
const OVERVIEW = "Resumen";
const METHOD = "Metodología";
const CONCLUSION = "Conclusión";

export const ES_PROJECTS: Overlay = {
  "club-premier": {
    tagline: "Fantasy oficial de Kings League Américas",
    category: "Plataforma móvil",
    duration: "12 meses",
    location: "Latinoamérica y España",
    tags: ["App", "Juegos", "Fantasy", "Fútbol"],
    desc: "Desarrollo de la plataforma Fantasy de Kings League Américas, con el objetivo de modernizar la experiencia de juego y construir lealtad en los usuarios.",
    sections: {
      "overview-1": {
        label: OVERVIEW,
        title: "Todo sobre KLA Fantasy",
        body: "Una plataforma fantasy moderna para la Kings League Américas: los usuarios arman sus equipos ideales con cartas de jugadores, compiten todos los días y ganan boletos que pueden canjear por premios como camisetas firmadas, experiencias exclusivas, viajes y mercancía oficial, todo dentro de una plataforma intuitiva y dinámica, pensada para que todos tengan oportunidad de ganar.",
      },
      "gallery-5": { title: "Interfaz y juego" },
      "challenge-2": {
        title: CHALLENGE,
        intro:
          "Kings League Américas necesitaba una experiencia fantasy que elevara la participación de los fans y construyera lealtad en los usuarios durante toda la temporada.",
        approachTitle: SOLUTION,
        approach: [
          "Mecánicas de juego claras y rápidas.",
          "Integración completa con los datos de la liga y la tabla en vivo.",
          "Diseño pensado primero para móvil.",
        ],
      },
      "process-3": {
        title: PROCESS,
        steps: steps(
          "Definir objetivos",
          "Diseño de mecánicas",
          "Desarrollo",
          "QA y lanzamiento"
        ),
      },
      "methodology-4": {
        title: METHOD,
        items: [
          {
            heading: "Impacto",
            body: "Mayor participación y permanencia de los fans durante toda la temporada.",
          },
        ],
      },
      "conclusion-6": {
        title: CONCLUSION,
        body: "Entregamos una experiencia de juego que dio vida a la liga y conectó a los fans con la marca.",
      },
      "cta-7": cta("¿Quieres algo así para tu marca?"),
    },
  },

  "retail-experience": {
    tagline: "Lealtad para Club Premier y Santander",
    category: "Experiencia interactiva",
    duration: "3 meses",
    location: "México",
    tags: ["Web", "Juegos"],
    desc: "Una experiencia interactiva para los socios de Aeroméxico Rewards (antes Club Premier), creada con el programa Toma Todo de Santander para premiar la lealtad.",
    sections: {
      "overview-f": {
        label: OVERVIEW,
        title: "Todo sobre Mundo Premier",
        body: "Desarrollamos dos dinámicas para los socios de Aeroméxico Rewards (antes Club Premier), enfocadas en construir lealtad y en permitirles canjear puntos por premios como viajes con todos los gastos pagados. Mundo Premier se realizó en colaboración con Santander como parte del programa Toma Todo.",
      },
      "gallery-mpyho3qe-2": { title: "Galería" },
      "challenge-g": {
        title: CHALLENGE,
        intro:
          "Club Premier buscaba un proveedor estratégico y confiable, capaz de desarrollar experiencias interactivas para sus campañas publicitarias en un plazo de desarrollo corto y sin errores en producción, ya que cualquier error podía derivar en problemas legales por la naturaleza de las campañas.",
        problems: [
          "Diseño y desarrollo rápidos",
          "Pruebas de extremo a extremo confiables",
          "Soporte 24/7",
          "Reportes",
          "Cumplimiento de la normativa legal sobre juegos y sorteos para fines de auditoría",
          "Seguridad y confianza",
        ],
        approachTitle: SOLUTION,
        approach: [
          "Desde el primer día ofrecimos una solución integral en la que el calendario de desarrollo se ajustó a la fecha de lanzamiento que el cliente quería. En este caso, dos meses para el lanzamiento público, sin margen de error durante el lanzamiento.",
          "Con comunicación constante con el cliente durante todo el desarrollo, pruebas extensas en un entorno de preparación y pruebas de estrés para soportar un alto volumen de tráfico, logramos nuestro objetivo.",
        ],
      },
      "process-h": {
        title: PROCESS,
        steps: steps(
          "Levantamiento de requerimientos",
          "Lluvia de ideas",
          "Diseño de juego",
          "Desarrollo",
          "Pruebas de aceptación de usuario",
          "Lanzamiento",
          "Análisis y reportes"
        ),
      },
      "methodology-i": {
        title: "Impacto",
        items: [
          {
            heading: "Desarrollo",
            body: "Desarrollo de la versión final y probada en un periodo de dos meses",
          },
          {
            heading: "Más de 60,000 usuarios",
            body: "Una experiencia disfrutada por más de 60,000 usuarios (socios de Club Premier, ahora Aeroméxico Rewards)",
          },
          {
            heading: "Sin errores",
            body: "No hubo errores en producción que pudieran afectar el puntaje de los usuarios. Esto fue muy importante, ya que había grandes premios en juego, como viajes y camionetas.",
          },
          {
            heading: "Reporte exitoso",
            body: "Se entregaron reportes semanales para verificar la autenticidad de las partidas de cada usuario, incluida la revisión de puntajes altos en relación con la duración de la partida y el número de partidas canjeadas.",
          },
        ],
      },
      "conclusion-k": {
        title: CONCLUSION,
        body: "Una experiencia que convirtió los puntos de lealtad en la oportunidad de ganar grandes premios y fortaleció aún más la lealtad de los socios.",
      },
      "cta-l": cta("¿Te gustaría algo así para tu marca?"),
    },
  },

  "proyecto-mpxmt44l": {
    tagline: "Modernización digital para una marca industrial",
    category: "Sitio web",
    duration: "1 mes",
    location: "México",
    tags: ["Web"],
    desc: "Rediseño del sitio web de la empresa de elevadores Hosting Wells para modernizarlo y mejorar la experiencia de usuario.",
    sections: {
      "overview-mpxmt44l-1": {
        label: OVERVIEW,
        title: "Todo sobre Hosting Wells",
        body: "Hosting Wells es una empresa especializada en la instalación de elevadores con tecnología alemana. Desarrollamos a la medida su sitio web oficial: una plataforma moderna, profesional y adaptable que comunica con claridad sus ventajas competitivas, servicios, garantías y experiencia en el sector.",
      },
      "gallery-hostingwells-1": { title: "El sitio" },
      "challenge-mpxmt44l-2": {
        title: CHALLENGE,
        intro:
          "Hosting Wells necesitaba una presencia web a la altura de la calidad de su ingeniería: sus ventajas, garantías y trayectoria no se reflejaban en línea.",
        problems: [
          "La presencia anterior no reflejaba la calidad y la experiencia de la empresa",
          "Los servicios y las garantías no se comunicaban con claridad",
          "El sitio no se adaptaba a distintas pantallas ni era fácil de actualizar",
        ],
        approachTitle: SOLUTION,
        approach: [
          "Una plataforma moderna, profesional y totalmente adaptable",
          "Una estructura clara para servicios, garantías y experiencia en la industria",
          "Un enfoque en eficiencia, calidad y atención especializada",
        ],
      },
      "process-mpxmt44l-3": {
        title: PROCESS,
        steps: steps("Investigación", "Diseño", "Desarrollo", "Lanzamiento"),
      },
      "methodology-mpxmt44l-4": {
        title: METHOD,
        items: [
          {
            heading: "Posicionamiento",
            body: "El nuevo sitio presenta a Hosting Wells como un socio especializado y confiable: la tecnología alemana, las garantías claras y la atención especializada al frente.",
          },
        ],
      },
      "conclusion-mpxmt44l-5": {
        title: CONCLUSION,
        body: "Un sitio limpio y profesional que por fin comunica las ventajas competitivas de Hosting Wells. Un segundo rediseño, más ambicioso (v2), ya está en desarrollo.",
      },
      "cta-mpxmt44l-6": cta("¿Quieres algo así para tu marca?"),
    },
  },

  "proyecto-mpxnmppg": {
    tagline: "Activación de marca con recompensas",
    category: "Experiencia digital",
    duration: "1 mes",
    location: "México",
    tags: ["App", "Juegos"],
    desc: "Una feria de minijuegos en línea que posicionó a la marca Pepito con nuevas audiencias: juegas, ganas boletos y canjeas recompensas de la marca.",
    sections: {
      "overview-mpxnmpph-d": {
        label: OVERVIEW,
        title: "Todo sobre Club Pepito",
        body: "Club Pepito fue un proyecto interactivo diseñado para posicionar a la marca Pepito entre nuevas audiencias mediante una feria de minijuegos en línea. Los usuarios ganaban boletos al jugar y podían canjearlos por productos físicos de la marca y otras recompensas.",
      },
      "gallery-clubpepito-1": { title: "Minijuegos" },
      "challenge-mpxnmpph-e": {
        title: CHALLENGE,
        intro:
          "Pepito necesitaba posicionar la marca con nuevas audiencias y convertir la exposición pasiva en participación activa.",
        problems: [
          "La publicidad tradicional no generaba participación en las nuevas audiencias",
          "La marca necesitaba una razón para que los usuarios regresaran",
        ],
        approachTitle: SOLUTION,
        approach: [
          "Una feria de minijuegos en línea (Corre Pepito, Aguas con la Lava y más)",
          "Un sistema de boletos: juegas, ganas boletos y los canjeas por productos físicos de la marca",
          "Un tráiler y una campaña en redes sociales para llevar tráfico a la feria",
        ],
      },
      "process-mpxnmpph-f": {
        title: PROCESS,
        steps: steps("Investigación", "Diseño", "Desarrollo", "Lanzamiento"),
      },
      "methodology-mpxnmpph-g": {
        title: METHOD,
        items: [
          {
            heading: "Ciclo de lealtad",
            body: "Jugar, ganar boletos, canjear recompensas: la feria convirtió la exposición de marca en un ciclo repetible que hizo que los usuarios volvieran.",
          },
        ],
      },
      "conclusion-mpxnmpph-h": {
        title: CONCLUSION,
        body: "Club Pepito convirtió el posicionamiento de marca en juego: los usuarios participaron en los minijuegos y canjearon boletos por recompensas físicas de la marca, lo que generó visitas repetidas.",
      },
      "cta-mpxnmpph-i": cta("¿Quieres algo así para tu marca?"),
    },
  },

  "proyecto-mpxngzng": {
    tagline: "Expandiendo el universo de una marca",
    category: "Juego móvil",
    duration: "1 mes",
    location: "México",
    tags: ["App", "Juegos"],
    desc: "Un juego móvil que expande el universo de caricaturas de Pepito y permite descubrir las historias de los personajes mediante el juego interactivo.",
    sections: {
      "overview-mpxngzng-7": {
        label: OVERVIEW,
        title: "Todo sobre Jokeland",
        body: "Jokeland es un juego móvil creado para conectar con nuevas audiencias y expandir el universo de caricaturas de Pepito. Los usuarios conocen la historia de los personajes de forma interactiva, y el juego funciona como secuela directa de la serie animada desarrollada para redes sociales.",
      },
      "gallery-jokeland-1": { title: "Arte y pantallas" },
      "challenge-mpxngzng-8": {
        title: CHALLENGE,
        intro:
          "La marca Pepito quería llegar a nuevas audiencias y extender su universo de caricaturas más allá de la serie animada en redes sociales.",
        problems: [
          "La audiencia se limitaba a los seguidores de la serie en redes sociales",
          "Los fans no tenían forma de profundizar en las historias de los personajes",
        ],
        approachTitle: SOLUTION,
        approach: [
          "Un juego móvil que funciona como secuela directa de la serie animada",
          "Narrativa interactiva para que los jugadores conozcan la historia de cada personaje",
          "Mecánicas casuales pensadas para audiencias amplias",
        ],
      },
      "process-mpxngzng-9": {
        title: PROCESS,
        steps: steps("Investigación", "Diseño", "Desarrollo", "Lanzamiento"),
      },
      "methodology-mpxngzng-a": {
        title: METHOD,
        items: [
          {
            heading: "Participación",
            body: "Los jugadores descubren las historias de los personajes mientras juegan, se identifican con ellos y mantienen vivo el universo entre episodios de la serie.",
          },
        ],
      },
      "conclusion-mpxngzng-b": {
        title: CONCLUSION,
        body: "Jokeland extendió el universo de Pepito a un formato interactivo y conectó a la marca con nuevas audiencias como secuela directa de la serie animada.",
      },
      "cta-mpxngzng-c": cta("¿Quieres algo así para tu marca?"),
    },
  },

  "kings-league": {
    tagline: "Identidad para un torneo nacional",
    category: "Marca",
    duration: "1 mes",
    location: "México",
    tags: ["Diseño", "Marca"],
    desc: "Diseño de la mascota oficial de la Copa Récord México para uso comercial y escalable en proyectos deportivos.",
    sections: {
      "overview-8": {
        label: OVERVIEW,
        title: "Todo sobre Copa Record",
        body: "La Copa Récord es un torneo nacional de fútbol de Récord México que promueve el deporte y corona al mejor equipo del país. Diseñamos su mascota oficial, creada para representar la energía, la pasión y el espíritu competitivo del evento, y conectar tanto con jugadores como con aficionados.",
      },
      "gallery-c": { title: "Mascota y prototipo" },
      "challenge-9": {
        title: CHALLENGE,
        intro:
          "Récord necesitaba una pieza de identidad que conectara con jugadores y aficionados de todo el país, funcionara en materiales comerciales y creciera hacia futuros proyectos deportivos.",
        approachTitle: SOLUTION,
        approach: [
          "Una mascota que encarna la energía, la pasión y el espíritu competitivo del torneo",
          "Un diseño versátil, listo para uso comercial y escalable en proyectos deportivos",
          "Un prototipo de mapa interactivo para planear canchas, publicidad y áreas clave del evento",
        ],
      },
      "process-a": {
        title: PROCESS,
        steps: steps(
          "Brief e investigación",
          "Conceptos y bocetos",
          "Refinamiento",
          "Arte final y entrega"
        ),
      },
      "methodology-b": {
        title: METHOD,
        items: [
          {
            heading: "Impacto",
            body: "La mascota se convirtió en la cara del torneo en todos sus materiales, y el prototipo de mapa interactivo, presentado al Club Deportivo Pachuca, ayudó a planear canchas, estimar publicidad y proponer ideas para áreas clave como la zona de comida.",
          },
        ],
      },
      "conclusion-d": {
        title: CONCLUSION,
        body: "Una mascota lista para uso comercial y escalable a más proyectos deportivos, además de un mapa interactivo que facilitó la planeación integral del evento.",
      },
      "cta-e": cta("¿Quieres algo así para tu marca?"),
    },
  },
};
