export type GalleryImage = {
  src: string;
  alt: string;
  caption: string;
  type: "image" | "plan";
};
export type Project = {
  slug: string;
  title: string;
  typology: string;
  year: string;
  nature: string;
  description: string;
  image: string;
  detailImage: string;
  planImage: string;
  challenge: string;
  concept: string;
  decisions: { title: string; text: string }[];
  gallery: GalleryImage[];
  featured: boolean;
  location?: string | null;
  area?: string | null;
  author?: string | null;
  participation?: string | null;
  status?: string | null;
  study?: {
    diagram: "courtyard" | "planes" | "pavilion";
    gestures: { title: string; text: string }[];
    materials: { name: string; color: string; use: string; texture: "mineral" | "wood" | "plain" }[];
  };
};
export type Architect = {
  name: string;
  role: string;
  location: string;
  education: string;
  portrait: { src: string; width: number; height: number; alt: string } | null;
  email: string | null;
  whatsapp: string | null;
  instagram: string | null;
  bio: string;
  interests: string[];
  services: string[];
};
export const architect: Architect = {
  name: "Ana Flávia",
  role: "Arquiteta e urbanista",
  location: "Porto Seguro, Bahia, Brasil",
  education: "Arquitetura e Urbanismo",
  portrait: {
    src: "/images/perfil.png",
    width: 941,
    height: 1672,
    alt: "Ana Flávia à mesa, com desenhos arquitetônicos à sua frente",
  },
  email: null,
  whatsapp: null,
  instagram: null,
  bio: "Uma arquitetura que parte da escuta e aproxima espaço, luz e vida cotidiana. Este portfólio apresenta estudos demonstrativos: um ponto de partida para compartilhar uma trajetória real.",
  interests: ["Luz natural", "Materialidade", "Paisagem", "Habitar"],
  services: [],
};
export const projects: Project[] = ([
  {
    slug: "casa-patio",
    title: "Casa Pátio",
    typology: "Residencial",
    year: "Estudo demonstrativo",
    nature: "Projeto demonstrativo · não construído",
    description:
      "Um exercício de habitar ao redor de um vazio: o pátio organiza luz, circulação e encontros.",
    image: "/images/casa-patio.jpg",
    detailImage: "/images/casa-patio-detalhe.jpg",
    planImage: "/images/casa-patio-planta.svg",
    challenge:
      "Investigar como preservar intimidade e criar conexões com o exterior em um volume compacto.",
    concept:
      "Um pátio central como coração da casa, articulando os espaços e revelando a passagem do dia.",
    decisions: [
      {
        title: "Vazio como centro",
        text: "O pátio aproxima os ambientes da luz e cria uma pausa na sequência dos espaços.",
      },
      {
        title: "Limiares habitáveis",
        text: "Beirais e passagens cobertas desenham uma transição gradual entre dentro e fora.",
      },
      {
        title: "Matéria e tempo",
        text: "Tons minerais e superfícies terrosas compõem uma paleta calma para este estudo.",
      },
    ],
    gallery: [],
    featured: true,
    study: {
      diagram: "courtyard",
      gestures: [
        { title: "Desenhar o perímetro", text: "Um limite contínuo resguarda a intimidade dos ambientes." },
        { title: "Abrir o centro", text: "O vazio traz luz e vegetação para o interior do conjunto." },
        { title: "Conectar as bordas", text: "Os percursos se orientam pelo pátio e aproximam os espaços de estar." },
      ],
      materials: [
        { name: "Superfície mineral", color: "#d8d2c5", use: "Planos claros para receber e distribuir a luz.", texture: "mineral" },
        { name: "Tons de argila", color: "#ab795f", use: "Paredes e detalhes que aquecem a composição.", texture: "mineral" },
        { name: "Vegetação", color: "#78836a", use: "O pátio como presença viva no cotidiano.", texture: "plain" },
      ],
    },
  },
  {
    slug: "entre-planos",
    title: "Entre Planos",
    typology: "Interiores",
    year: "Estudo demonstrativo",
    nature: "Projeto demonstrativo · não construído",
    description:
      "Planos, texturas e luz filtrada definem um interior flexível, aberto a diferentes formas de estar.",
    image: "/images/entre-planos.jpg",
    detailImage: "/images/entre-planos-detalhe.jpg",
    planImage: "/images/entre-planos-planta.svg",
    challenge:
      "Explorar a organização de um interior contínuo sem depender de compartimentos fechados.",
    concept:
      "Planos independentes criam zonas de uso e perspectivas, mantendo continuidade visual.",
    decisions: [
      {
        title: "Continuidade",
        text: "Um piso contínuo conecta os espaços e permite ler o conjunto.",
      },
      {
        title: "Filtros de luz",
        text: "Painéis verticais marcam o ritmo do ambiente e sugerem diferentes graus de privacidade.",
      },
      {
        title: "Escala cotidiana",
        text: "Volumes baixos e nichos desenham lugares de permanência.",
      },
    ],
    gallery: [],
    featured: true,
    study: {
      diagram: "planes",
      gestures: [
        { title: "Manter a continuidade", text: "O espaço se lê como um conjunto, com percursos livres." },
        { title: "Introduzir filtros", text: "Planos independentes definem limites sem fechar os ambientes." },
        { title: "Criar permanências", text: "Mobiliário e superfícies delimitam os usos na escala cotidiana." },
      ],
      materials: [
        { name: "Madeira clara", color: "#c7ad88", use: "Painéis e mobiliário como elementos de organização.", texture: "wood" },
        { name: "Base mineral", color: "#d7d2c9", use: "Um plano contínuo que conecta os ambientes.", texture: "mineral" },
        { name: "Tecido natural", color: "#e9e3d7", use: "Textura suave nos lugares de permanência.", texture: "plain" },
      ],
    },
  },
  {
    slug: "pavilhao-aberto",
    title: "Pavilhão Aberto",
    typology: "Espaço coletivo",
    year: "Estudo demonstrativo",
    nature: "Projeto demonstrativo · não construído",
    description:
      "Uma cobertura leve e uma sequência de apoios abrem espaço para encontros e usos livres.",
    image: "/images/pavilhao-barcelona-referencia.jpg",
    detailImage: "/images/pavilhao-barcelona-detalhe.jpg",
    planImage: "/images/pavilhao-aberto-planta.svg",
    challenge:
      "Investigar um abrigo coletivo permeável, capaz de acolher usos sem fixar um programa único.",
    concept:
      "O teto organiza um campo de sombra; a estrutura enquadra a paisagem sem encerrá-la.",
    decisions: [
      {
        title: "Estrutura legível",
        text: "A repetição dos apoios organiza o espaço e torna clara a lógica do conjunto.",
      },
      {
        title: "Bordas abertas",
        text: "A ausência de fechamentos contínuos favorece percursos em todas as direções.",
      },
      {
        title: "Chão de encontro",
        text: "Uma plataforma simples cria uma base comum para usos coletivos.",
      },
    ],
    gallery: [],
    featured: false,
    study: {
      diagram: "pavilion",
      gestures: [
        { title: "Assentar uma base", text: "Um chão comum acolhe usos coletivos sem fixar um programa." },
        { title: "Marcar os apoios", text: "A estrutura organiza o ritmo do espaço e os percursos." },
        { title: "Desenhar a sombra", text: "A cobertura abriga; as bordas abertas mantêm a relação com a paisagem." },
      ],
      materials: [
        { name: "Pedra", color: "#b6ad9d", use: "Uma base mineral para os lugares de encontro.", texture: "mineral" },
        { name: "Estrutura metálica", color: "#68665e", use: "Apoios esbeltos tornam legível o sistema construtivo proposto.", texture: "plain" },
        { name: "Vidro", color: "#cbd8d1", use: "Planos pontuais de proteção com continuidade visual.", texture: "plain" },
      ],
    },
  },
] satisfies Project[]).map((project) => ({
  ...project,
  gallery: [
    {
      src: project.image,
      alt:
        project.slug === "pavilhao-aberto"
          ? "Fotografia de referência do Pavilhão de Barcelona: cobertura baixa, apoios metálicos e espelho d’água; não representa o estudo Pavilhão Aberto"
          : `Fotografia de referência arquitetônica para o estudo ${project.title}; sem autoria atribuída à arquiteta`,
      caption:
        project.slug === "pavilhao-aberto"
          ? "Referência externa: Pavilhão de Barcelona, projeto original de Ludwig Mies van der Rohe e Lilly Reich. Foto: Vincenzo Biancamano / Unsplash. Não representa o estudo Pavilhão Aberto nem autoria da arquiteta."
          : "Fotografia de referência · Unsplash. Sem vínculo com o estudo ou autoria da arquiteta.",
      type: "image" as const,
    },
    {
      src: project.detailImage,
      alt:
        project.slug === "pavilhao-aberto"
          ? "Fotografia de referência do Pavilhão de Barcelona: cobertura, plano de pedra e escultura; sem vínculo com o estudo Pavilhão Aberto"
          : `Fotografia de referência de interior, luz e materialidade para ${project.title}; não representa o estudo`,
      caption:
        project.slug === "pavilhao-aberto"
          ? "Referência externa de materialidade: Pavilhão de Barcelona. Foto: Sam Serrer / Unsplash. Não representa este estudo nem autoria da arquiteta."
          : "Referência fotográfica de interior e materialidade · Unsplash. Sem vínculo com este estudo ou autoria da arquiteta.",
      type: "image" as const,
    },
    {
      src: project.planImage,
      alt: `Planta esquemática de ${project.title}`,
      caption:
        "Planta conceitual demonstrativa, sem escala e sem validade técnica.",
      type: "plan" as const,
    },
  ],
}));
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
