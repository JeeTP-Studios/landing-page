import type { SiteContent } from "@/types/content";
import { PROJECTS } from "./projects";
import { ES_OVERLAY } from "./es";

/** English is the canonical document: structure, media, colours and order live
 *  here. Spanish is the sparse overlay in `i18n.es`. */
export const DEFAULTS: SiteContent = {
  brand: {
    name: "JeeTP Studios",
    logoImg: "/resources/logos/logo-white.png",
  },
  hero: {
    lines: ["Technology", "that moves", "business."],
    accent: "moves",
    sub: "Custom software, artificial intelligence and digital experiences for companies that want to grow.",
    scrollLabel: "Scroll",
  },
  manifesto: {
    enabled: true,
    statements: [
      "Your business doesn't need more technology.",
      "It needs the right technology.",
      "We design it, build it and grow it with you.",
      "Data, intelligence and experience in one solution.",
    ],
  },
  stack: {
    labels: ["Experience", "Intelligence", "Data & systems"],
  },
  aboutBlock: {
    enabled: true,
    kicker: "Who we are",
    statement:
      "We are the technology partner for brands and companies in Mexico and the United States. We started out making video games, and that gave us our rule: technology only works if people want to use it.",
  },
  stats: {
    enabled: true,
    items: [
      { value: 12, suffix: "+", label: "Projects shipped" },
      { value: 8, suffix: "", label: "Industries served" },
      { value: 4, suffix: "", label: "Years building brands" },
      { value: 120, suffix: "K+", label: "End users reached" },
    ],
  },
  solutions: {
    enabled: true,
    label: "Solutions",
    items: [
      {
        title: "Custom software.",
        body: "Platforms and systems built around how your business works.",
        chips: ["Web platforms", "Internal systems", "Integrations", "Modernization"],
      },
      {
        title: "Artificial intelligence.",
        body: "AI connected to your processes, with people approving what matters.",
        chips: ["AI agents", "Assistants", "Smart search", "AI visibility"],
      },
      {
        title: "Data and automation.",
        body: "Your information in one place and processes that stop being manual.",
        chips: ["Dashboards", "Reports", "Automation", "Back office"],
      },
      {
        title: "Apps and digital products.",
        body: "Products people understand, use and recommend.",
        chips: ["iOS and Android", "Websites", "E-commerce", "UX and UI"],
      },
      {
        title: "Brand experiences.",
        body: "Where we began: games and activations that bring your customers back.",
        chips: ["Gamification", "Loyalty", "Activations", "Augmented reality"],
      },
      {
        title: "Consulting.",
        body: "We define what to build, in what order and with what return.",
        chips: ["Diagnosis", "Roadmap", "Architecture"],
      },
    ],
  },
  projects: PROJECTS,
  work: {
    enabled: true,
    title: "Real work.",
    accent: "work.",
    kicker: "Six projects in people's hands",
  },
  clients: {
    enabled: true,
    title: "Brands that have trusted JeeTP",
    logos: [
      { name: "Club Premier", img: "/resources/our-clients/clubpremier.png" },
      { name: "Kings League", img: "/resources/our-clients/kla.webp" },
      { name: "Santander", img: "/resources/our-clients/santander.svg" },
      { name: "Visa", img: "/resources/our-clients/visa.png" },
      { name: "Hosting Wells", img: "/resources/our-clients/hostingwells.png" },
      { name: "Etomin", img: "/resources/our-clients/etomin.svg" },
    ],
  },
  products: {
    enabled: true,
    title: "Our own products.",
    accent: "products.",
    intro: "We test at home what we later bring to our clients.",
    items: [
      {
        name: "Synthex",
        logo: "/resources/logos/synthex-mark.svg",
        title: "Make AI recommend your brand.",
        body: "Measure how your brand appears in the answers of AI assistants and what to do to improve.",
        url: "https://synthex.com.mx",
        linkLabel: "Discover Synthex ↗",
      },
      {
        name: "Synthex Commerce",
        logo: "/resources/logos/synthex-mark.svg",
        title: "Your online store, smarter.",
        body: "Search that understands your customers and recommendations that sell.",
        url: "https://commerce.synthex.com.mx",
        linkLabel: "Discover Synthex Commerce ↗",
      },
      {
        name: "Pliks",
        logo: "/resources/logos/pliks-logo.png",
        title: "Your next company, taking shape.",
        body: "An AI executive team that researches your market, builds the plan and moves your business forward. You decide every step.",
        url: "https://trypliks.com",
        linkLabel: "Discover Pliks ↗",
      },
    ],
  },
  process: {
    enabled: true,
    title: "How we work.",
    accent: "work.",
    steps: [
      {
        num: "01",
        title: "Discover",
        body: "We understand your operation and where technology moves the result.",
      },
      {
        num: "02",
        title: "Design",
        body: "You see real screens from the first weeks.",
      },
      {
        num: "03",
        title: "Build",
        body: "Weekly deliveries with working software.",
      },
      {
        num: "04",
        title: "Evolve",
        body: "We measure, operate and improve with you.",
      },
    ],
  },
  faq: {
    enabled: true,
    title: "Questions we get asked first.",
    accent: "asked first.",
    items: [
      {
        q: "What kinds of projects do you take on?",
        a: "Anything that ends in working software. Web platforms, mobile apps, internal tools, integrations, e-commerce, and the occasional game or brand activation. If it can be built, it is in scope.",
      },
      {
        q: "Do you work from templates?",
        a: "No. We scope every project around the problem in front of us, which is why two clients in the same industry rarely end up with the same system.\nIf an off-the-shelf tool would genuinely serve you better, we will say so instead of billing you the difference.",
      },
      {
        q: "How small or large a project do you take?",
        a: "From a one-month build to a platform we have run for years. We scale the team to the project rather than the other way round, so a small job does not get a small team's leftovers.",
      },
      {
        q: "Do you work with agencies?",
        a: "Often. We are the development team a lot of agencies need without hiring one, either behind the scenes or in front of the client.",
      },
      {
        q: "How does a project start?",
        a: "One short call about what you need to happen. We come back with scope, timeline and cost, and once you agree we start building.",
      },
    ],
  },
  closing: {
    kicker: "Got a challenge?",
    word: "Let's talk.",
    emailLabel: "Write to us",
    emailCopied: "Email copied",
    whatsappLabel: "WhatsApp",
    locationLabel: "Where we are",
    remoteLabel: "How we work",
    remoteValue: "Remote, in English and Spanish",
  },
  contact: {
    email: "contact@jeetpstudio.com",
    whatsapp: "+52 55 3647 9693",
    phone: "+52 55 3647 9693",
    location: "Texas · Mexico City",
    address: "Texas, United States",
    mapQuery: "Lakeview Dr, Conroe, TX 77304",
  },
  about: {
    hero: {
      eyebrow: "About",
      title: "A development team that starts from your problem",
      accent: "your problem",
    },
    gallery: [
      "/resources/team/team-1.png",
      "/resources/team/team-2.png",
      "/resources/team/team-3.png",
    ],
    intro: {
      heading: "Who we are",
      body: "JeeTP Studios builds custom software. Web platforms, mobile apps, internal tools, integrations, and the interactive work some clients need on top. We are developers, designers and strategists acting as the technical team for companies that do not have one, or that need a bigger one for a while.\nThere are no account layers between you and the people writing the code. Cost stays down, timelines stay honest, and we can size a team to a single project instead of a retainer.",
    },
    overview: {
      heading: "What we have built",
      body: "Loyalty platforms, sports products, elevator company websites, internal dashboards, commercial activations. Different industries, same job: work out what the business actually needs and build that.\nEvery project starts with one conversation about the problem. From there we set scope, timeline and cost, and then we build it.",
    },
    beliefs: {
      heading: "What we believe",
      body: "Software should fit the business, not the other way round. Most of the bad systems we get called in to replace were built to a template someone had lying around.\nWhen a project needs something we have never done, we learn it and build it.",
    },
  },
  servicesPage: {
    hero: {
      eyebrow: "What we do",
      title: "Software built around your problem, not a template",
      accent: "your problem",
    },
    groups: [
      {
        num: "01",
        title: "Custom software",
        links: [
          "Web platforms",
          "Internal tools",
          "Custom integrations",
          "API development",
          "Legacy rebuilds",
          "Technical architecture",
        ],
      },
      {
        num: "02",
        title: "Mobile and web apps",
        links: [
          "iOS and Android apps",
          "Progressive web apps",
          "Cross-platform builds",
          "App store releases",
          "Websites and landing pages",
          "E-commerce",
        ],
      },
      {
        num: "03",
        title: "Data and automation",
        links: [
          "Client dashboards",
          "Internal reporting",
          "Process automation",
          "Third-party integrations",
          "Custom back offices",
        ],
      },
      {
        num: "04",
        title: "Interactive work and games",
        links: [
          "Advergaming",
          "Gamification",
          "Loyalty games",
          "AR experiences",
          "Digital activations",
          "Interactive installations",
        ],
      },
      {
        num: "05",
        title: "Strategy and support",
        links: [
          "Product strategy",
          "Technical consulting",
          "Maintenance and support",
          "Team augmentation",
        ],
      },
    ],
    who: {
      enabled: true,
      heading: "Who we work with",
      body: "Startups, agencies, corporations. Different budgets, same standard for what ships.",
      cards: [
        { title: "Startups", img: "/resources/jokeland/Jokeland_Screen1.jpg" },
        { title: "Agencies", img: "/resources/hosting-wells/HostingWellsV2_2.jpg" },
        { title: "Enterprise", img: "/resources/club-premier/MundoPremier_SS3.jpg" },
        { title: "Retail and commerce", img: "/resources/club-premier/TransfiereYViaja_1.jpg" },
        { title: "Sports and entertainment", img: "/resources/kings-league/KLAFantasy_SS1.jpg" },
      ],
    },
  },
  cases: {
    label: "Work",
    title: "Every project, start to finish",
    accent: "start to finish",
  },
  contactPage: {
    hero: {
      eyebrow: "Contact",
      title: "Tell us what you are trying to build",
      accent: "build",
      sub: "A new project, a second opinion on one you already started, or just a question about how we work.",
    },
    regions: [
      { name: "United States", flag: "🇺🇸" },
      { name: "Mexico", flag: "🇲🇽" },
      { name: "Remote worldwide", flag: "🌎" },
    ],
    interestedTitle: "Start a project with us",
    getInTouch: "The more you tell us up front, the more useful our first reply will be.",
  },
  ui: {
    nav: {
      home: "Home",
      about: "About",
      services: "Services",
      cases: "Work",
      contact: "Contact",
    },
    buttons: {
      contact: "Let's talk",
      work: "See the work",
      allWork: "All work",
    },
    language: { label: "Language", switchTo: "Switch language" },
    menu: { open: "Open menu", close: "Close menu" },
    footer: {
      social: [
        { label: "LinkedIn", url: "https://www.linkedin.com/company/jeetpstudios/" },
        { label: "Instagram", url: "https://www.instagram.com/jeetpstudios/" },
        { label: "X", url: "https://x.com/JeeTPStudios" },
      ],
      copyright: "© {year} {name}",
    },
    faqBox: {
      title: "Still have a question?",
      body: "Send it over. We answer within one business day, and we will tell you straight if we are not the right team for it.",
      button: "Let's talk",
    },
    caseStudy: {
      back: "Back to work",
      specCategory: "Type",
      specDuration: "Duration",
      specMeta: "Year and place",
      upNext: "Next case study",
      problemsTitle: "What was in the way",
      openImage: "Open image",
      playVideo: "Play video",
      close: "Close",
      video: "Video",
    },
    casesIndex: {
      filterLabel: "Filter by discipline",
      emptyTitle: "Nothing filed under that discipline yet.",
      emptyBody:
        "It is on the roadmap. In the meantime, the full archive is a click away.",
    },
    contactForm: {
      sendWhatsapp: "Send on WhatsApp",
      service: "What do you need",
      serviceNone: "Choose one",
      name: "Your name",
      phone: "Phone",
      email: "Email",
      company: "Company",
      message: "About the project",
      messageHint: "What you want to build, and roughly when.",
      optional: "Optional",
      send: "Send by email",
      addressLabel: "Address",
      emailLabel: "Email",
      phoneLabel: "Phone and WhatsApp",
      regionsLabel: "Where you are",
      errorName: "We need a name to reply to.",
      errorEmailMissing: "Add an email so we can get back to you.",
      errorEmailInvalid: "That email address does not look complete.",
      errorMessage: "A sentence or two about the project is enough.",
      doneTitle: "Your message is on its way.",
      doneWhatsapp:
        "We opened WhatsApp with everything filled in. Hit send there and we will reply within one business day.",
      doneEmail:
        "We opened your mail client with everything filled in. Send it and we will reply within one business day.",
      writeAnother: "Write another",
      mailSubject: "New project enquiry",
      mailSubjectFrom: "New project enquiry from {company}",
      notSpecified: "Not specified",
      bodyService: "Service",
      bodyName: "Name",
      bodyCompany: "Company",
      bodyEmail: "Email",
      bodyPhone: "Phone",
      bodyProject: "Project",
    },
    loading: "Loading",
    error: { title: "Something went wrong", back: "Back to home" },
  },
  order: [
    "manifesto",
    "about",
    "solutions",
    "work",
    "clients",
    "products",
    "process",
    "faq",
  ],
  i18n: { es: ES_OVERLAY },
};
