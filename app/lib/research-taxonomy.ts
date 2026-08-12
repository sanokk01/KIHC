export type ResearchTaxonomyOption = {
  value: string;
  labelEn: string;
};

export type ResearchTaxonomyCategory = ResearchTaxonomyOption & {
  children: ResearchTaxonomyOption[];
};

export const RESEARCH_TAXONOMY: ResearchTaxonomyCategory[] = [
  {
    value: "인간 고유역량",
    labelEn: "Human Capabilities",
    children: [
      { value: "메타인지·자기조절", labelEn: "Metacognition & Self-regulation" },
      { value: "회복탄력성·적응", labelEn: "Resilience & Adaptation" },
      { value: "가치판단·윤리", labelEn: "Value Judgment & Ethics" },
      { value: "비판적 사고·문제해결", labelEn: "Critical Thinking & Problem-solving" },
      { value: "창의성·공감·소통", labelEn: "Creativity, Empathy & Communication" },
    ],
  },
  {
    value: "역량 진단·측정",
    labelEn: "Capability Assessment",
    children: [
      { value: "역량모델·지표", labelEn: "Capability Models & Indicators" },
      { value: "진단도구·척도", labelEn: "Assessment Tools & Scales" },
      { value: "데이터·성과분석", labelEn: "Data & Performance Analysis" },
      { value: "AI 기반 역량진단", labelEn: "AI-based Assessment" },
    ],
  },
  {
    value: "교육·성장 솔루션",
    labelEn: "Education & Growth Solutions",
    children: [
      { value: "학교·청소년 교육", labelEn: "School & Youth Education" },
      { value: "교원·교육자 연수", labelEn: "Teacher Development" },
      { value: "기업·조직개발", labelEn: "Corporate & Organization Development" },
      { value: "공공기관 역량강화", labelEn: "Public-sector Capability" },
      { value: "평생학습·진로", labelEn: "Lifelong Learning & Career" },
    ],
  },
  {
    value: "인재정책·미래전략",
    labelEn: "Talent Policy & Future Strategy",
    children: [
      { value: "국가 인재상", labelEn: "National Talent Model" },
      { value: "교육정책·제도", labelEn: "Education Policy & Systems" },
      { value: "AI 전환·미래사회", labelEn: "AI Transition & Future Society" },
      { value: "지역·공동체 성장", labelEn: "Regional & Community Growth" },
      { value: "노동·조직 변화", labelEn: "Work & Organizational Change" },
    ],
  },
  {
    value: "연구협력·현장확산",
    labelEn: "Research Partnership & Impact",
    children: [
      { value: "산학연·기관 협력", labelEn: "Institutional Partnership" },
      { value: "국제·글로벌 네트워크", labelEn: "Global Research Network" },
      { value: "연구방법·현장사례", labelEn: "Research Methods & Field Cases" },
      { value: "세미나·포럼 성과", labelEn: "Seminar & Forum Outcomes" },
      { value: "연구성과 확산", labelEn: "Research Dissemination" },
    ],
  },
];

export const DEFAULT_RESEARCH_CLASSIFICATION = {
  category1: RESEARCH_TAXONOMY[0].value,
  category2: RESEARCH_TAXONOMY[0].children[0].value,
};

export const DEFAULT_RESEARCH_KEYWORDS = ["메타인지", "회복탄력성", "가치판단", "역량진단", "인재정책"];

export function getResearchSubcategories(category: string) {
  return RESEARCH_TAXONOMY.find((item) => item.value === category)?.children ?? [];
}

export function isResearchClassification(category: string, subcategory: string) {
  return getResearchSubcategories(category).some((item) => item.value === subcategory);
}

export function inferResearchClassification(input: {
  title?: string;
  summary?: string;
  keywords?: string[] | string;
}) {
  const keywordText = Array.isArray(input.keywords) ? input.keywords.join(" ") : (input.keywords ?? "");
  const text = `${input.title ?? ""} ${input.summary ?? ""} ${keywordText}`.toLocaleLowerCase("ko-KR");
  const rules: Array<[RegExp, string, string]> = [
    [/메타인지|자기조절/, "인간 고유역량", "메타인지·자기조절"],
    [/회복탄력|적응/, "인간 고유역량", "회복탄력성·적응"],
    [/가치판단|윤리|의사결정/, "인간 고유역량", "가치판단·윤리"],
    [/비판적|문제해결/, "인간 고유역량", "비판적 사고·문제해결"],
    [/창의|공감|소통/, "인간 고유역량", "창의성·공감·소통"],
    [/역량.?모델|평가.?지표|표준화/, "역량 진단·측정", "역량모델·지표"],
    [/진단.?도구|검사|척도|측정/, "역량 진단·측정", "진단도구·척도"],
    [/데이터|성과.?분석|빅데이터/, "역량 진단·측정", "데이터·성과분석"],
    [/ai.*진단|인공지능.*진단/, "역량 진단·측정", "AI 기반 역량진단"],
    [/학교|학생|청소년/, "교육·성장 솔루션", "학교·청소년 교육"],
    [/교원|교사|교육자|연수/, "교육·성장 솔루션", "교원·교육자 연수"],
    [/기업|조직개발|리더십/, "교육·성장 솔루션", "기업·조직개발"],
    [/공공기관|공무원/, "교육·성장 솔루션", "공공기관 역량강화"],
    [/평생학습|진로|경력/, "교육·성장 솔루션", "평생학습·진로"],
    [/국가.?인재|인재상/, "인재정책·미래전략", "국가 인재상"],
    [/교육정책|교육.?제도/, "인재정책·미래전략", "교육정책·제도"],
    [/ai|인공지능|미래사회|디지털.?전환/, "인재정책·미래전략", "AI 전환·미래사회"],
    [/지역|공동체/, "인재정책·미래전략", "지역·공동체 성장"],
    [/노동|일자리|조직.?변화/, "인재정책·미래전략", "노동·조직 변화"],
    [/산학|기관.?협력|파트너십/, "연구협력·현장확산", "산학연·기관 협력"],
    [/국제|글로벌|해외|네트워크/, "연구협력·현장확산", "국제·글로벌 네트워크"],
    [/연구방법|사례연구|현장.?사례/, "연구협력·현장확산", "연구방법·현장사례"],
    [/세미나|포럼|학술대회/, "연구협력·현장확산", "세미나·포럼 성과"],
    [/성과.?확산|아카이브|발간/, "연구협력·현장확산", "연구성과 확산"],
  ];

  const match = rules.find(([pattern]) => pattern.test(text));
  return match ? { category1: match[1], category2: match[2] } : { category1: "", category2: "" };
}

export function normalizeResearchClassification(
  category1: string | undefined,
  category2: string | undefined,
  source: { title?: string; summary?: string; keywords?: string[] | string },
) {
  if (isResearchClassification(category1 ?? "", category2 ?? "")) {
    return { category1: category1 as string, category2: category2 as string };
  }
  return inferResearchClassification(source);
}
