export type PublicationStatus = "published" | "draft";

export interface NewsPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  imageUrl?: string;
  status: PublicationStatus;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResearchMaterial {
  id: string;
  slug: string;
  title: string;
  author: string;
  publishedAt: string;
  tableOfContents: string[];
  summary: string;
  keywords: string[];
  imageUrl?: string;
  status: PublicationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PopupNotice {
  id: string;
  title: string;
  content: string;
  link?: string;
  imageUrl?: string;
  active: boolean;
  startsAt?: string;
  endsAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AboutContent {
  chairmanMessage: string[];
  chairmanImageUrl?: string;
  organizationIntroduction: string[];
  organizationImageUrl?: string;
  purpose: string;
  vision: string;
}

export interface SiteSettings {
  siteName: string;
  footerInformation: string;
  email: string;
}

export interface ContentRepository {
  listNews(): Promise<NewsPost[]>;
  getNewsBySlug(slug: string): Promise<NewsPost | undefined>;
  listResearch(): Promise<ResearchMaterial[]>;
  getResearchBySlug(slug: string): Promise<ResearchMaterial | undefined>;
  getActivePopup(): Promise<PopupNotice | undefined>;
  getAbout(): Promise<AboutContent>;
  getSettings(): Promise<SiteSettings>;
}

export const defaultNewsPosts: NewsPost[] = [
  {
    id: "news-5",
    slug: "2026-research-direction",
    title: "2026년 한국인재역량연구회 연구 방향 안내",
    excerpt: "KIHC가 올해 집중해 살펴볼 연구 의제를 안내합니다.",
    content: [
      "한국인재역량연구회는 2026년에도 사람의 내면 역량과 지속 가능한 성장의 조건을 중심으로 연구를 이어갑니다.",
      "구체적인 연구 일정과 공개 자료는 준비되는 대로 홈페이지를 통해 안내하겠습니다.",
    ],
    status: "published",
    publishedAt: "2026. 07. 28",
    createdAt: "2026-07-28T09:00:00+09:00",
    updatedAt: "2026-07-28T09:00:00+09:00",
  },
  {
    id: "news-4",
    slug: "summer-seminar",
    title: "인재역량 연구를 위한 여름 세미나 개최",
    excerpt: "연구회원이 함께하는 여름 세미나 소식입니다.",
    content: ["인재역량의 개념과 현장 적용을 함께 논의하는 세미나를 진행했습니다."],
    status: "published",
    publishedAt: "2026. 07. 12",
    createdAt: "2026-07-12T09:00:00+09:00",
    updatedAt: "2026-07-12T09:00:00+09:00",
  },
  {
    id: "news-3",
    slug: "policy-report-series",
    title: "KIHC 연구정책자료 발간 시리즈 안내",
    excerpt: "새로운 연구정책자료 시리즈를 소개합니다.",
    content: ["주요 연구 결과를 이해하기 쉬운 형태로 정리한 자료를 순차적으로 소개합니다."],
    status: "published",
    publishedAt: "2026. 06. 24",
    createdAt: "2026-06-24T09:00:00+09:00",
    updatedAt: "2026-06-24T09:00:00+09:00",
  },
  {
    id: "news-2",
    slug: "research-network",
    title: "인재역량 연구 네트워크 간담회",
    excerpt: "연구 협력의 방향을 나누었습니다.",
    content: ["다양한 연구 현장의 목소리를 듣고 협력 가능성을 논의했습니다."],
    status: "published",
    publishedAt: "2026. 05. 30",
    createdAt: "2026-05-30T09:00:00+09:00",
    updatedAt: "2026-05-30T09:00:00+09:00",
  },
  {
    id: "news-1",
    slug: "website-renewal",
    title: "한국인재역량연구회 홈페이지 개편 안내",
    excerpt: "KIHC 홈페이지가 새로운 모습으로 준비되고 있습니다.",
    content: ["연구회의 방향과 자료를 더 편리하게 살펴볼 수 있도록 홈페이지를 개편하고 있습니다."],
    status: "published",
    publishedAt: "2026. 05. 08",
    createdAt: "2026-05-08T09:00:00+09:00",
    updatedAt: "2026-05-08T09:00:00+09:00",
  },
];

export const defaultResearchMaterials: ResearchMaterial[] = [
  {
    id: "research-3",
    slug: "metacognition-and-growth",
    title: "성장을 이끄는 메타인지의 역할과 교육적 시사점",
    author: "한국인재역량연구회 연구팀",
    publishedAt: "2026. 07. 18",
    tableOfContents: ["메타인지의 개념", "성장 과정에서의 역할", "교육 현장을 위한 제안"],
    summary: "스스로의 생각을 점검하고 조절하는 메타인지가 개인의 성장과 학습에 미치는 영향을 살펴봅니다.",
    keywords: ["메타인지", "자기조절", "성장"],
    status: "published",
    createdAt: "2026-07-18T09:00:00+09:00",
    updatedAt: "2026-07-18T09:00:00+09:00",
  },
  {
    id: "research-2",
    slug: "resilience-framework",
    title: "변화의 시대, 회복탄력성을 바라보는 새로운 관점",
    author: "KIHC 역량연구분과",
    publishedAt: "2026. 06. 10",
    tableOfContents: ["변화와 적응", "회복탄력성의 구성 요소", "연구 과제"],
    summary: "회복탄력성을 단순한 인내가 아닌 변화에 대응하고 다시 방향을 세우는 역량으로 해석합니다.",
    keywords: ["회복탄력성", "변화", "적응"],
    status: "published",
    createdAt: "2026-06-10T09:00:00+09:00",
    updatedAt: "2026-06-10T09:00:00+09:00",
  },
  {
    id: "research-1",
    slug: "value-judgement",
    title: "가치판단 역량의 개념과 사회적 의미",
    author: "한국인재역량연구회",
    publishedAt: "2026. 05. 16",
    tableOfContents: ["가치판단이란", "의사결정과 공동체", "후속 연구 방향"],
    summary: "복잡한 상황에서 기준을 세우고 책임 있게 선택하는 가치판단 역량의 의미를 정리합니다.",
    keywords: ["가치판단", "의사결정", "공동체"],
    status: "published",
    createdAt: "2026-05-16T09:00:00+09:00",
    updatedAt: "2026-05-16T09:00:00+09:00",
  },
];

export const defaultPopup: PopupNotice = {
  id: "popup-site-renewal",
  title: "KIHC 홈페이지를 새롭게 준비하고 있습니다",
  content: "연구회의 방향과 주요 자료를 더 편리하게 만나실 수 있도록 홈페이지를 개편 중입니다.",
  link: "/news/website-renewal",
  active: true,
  createdAt: "2026-08-01T09:00:00+09:00",
  updatedAt: "2026-08-01T09:00:00+09:00",
};

export const defaultAbout: AboutContent = {
  chairmanMessage: [
    "한국인재역량연구회는 사람이 자신의 가능성을 발견하고, 변화 속에서도 주체적으로 성장하는 데 필요한 역량을 연구합니다.",
    "작지만 깊이 있는 연구와 열린 교류를 통해 개인과 공동체에 도움이 되는 지식을 차곡차곡 쌓아가겠습니다.",
  ],
  organizationIntroduction: [
    "KIHC는 인간의 내면 역량과 성장 조건을 탐구하는 연구 공동체입니다.",
    "연구자와 현장의 경험을 연결하고, 신뢰할 수 있는 연구 결과를 사회와 나누는 일을 지향합니다.",
  ],
  purpose: "사람의 가능성을 발견하고 키우는 핵심 역량을 체계적으로 연구합니다.",
  vision: "사람을 이해하는 연구가 더 나은 배움과 사회로 이어지는 지식 공동체",
};

export const defaultSettings: SiteSettings = {
  siteName: "KIHC 한국인재역량연구회",
  footerInformation: "기관 정보는 운영 준비 후 등록됩니다.",
  email: "대표 이메일 준비 중",
};

export const contentRepository: ContentRepository = {
  listNews: async () => defaultNewsPosts.filter((post) => post.status === "published"),
  getNewsBySlug: async (slug) => defaultNewsPosts.find((post) => post.slug === slug),
  listResearch: async () => defaultResearchMaterials.filter((item) => item.status === "published"),
  getResearchBySlug: async (slug) => defaultResearchMaterials.find((item) => item.slug === slug),
  getActivePopup: async () => defaultPopup.active ? defaultPopup : undefined,
  getAbout: async () => defaultAbout,
  getSettings: async () => defaultSettings,
};
