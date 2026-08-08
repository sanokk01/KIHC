"use client";

import { useEffect, useState } from "react";
import { AppLink as Link } from "./AppLink";

type Locale = "ko" | "en";

const content = {
  ko: {
    localeName: "한국어",
    eyebrow: "KIHC RESEARCH & VALUES",
    title: "사람의 가능성을 이해하는 연구",
    introduction: "KIHC는 사람이 자신을 이해하고, 변화에 적응하며, 책임 있는 선택을 만들어 가는 데 필요한 내면 역량을 살펴봅니다. 아직 확정되지 않은 연구 성과를 과장하지 않고, 다음 질문을 중심으로 연구와 교류를 이어갑니다.",
    focusEyebrow: "Research Focus",
    focusTitle: "무엇을 연구하나요?",
    focusDescription: "개인의 내면에서 시작한 역량이 배움과 관계, 공동체의 성장으로 어떻게 이어지는지 세 영역에서 탐구합니다.",
    areas: [
      { number: "01", title: "자아확립", question: "나는 누구이며 어떤 기준으로 살아갈 것인가?", description: "자기 이해, 정체성, 주체성의 형성 과정을 살펴보고 스스로 삶의 방향을 세우는 힘을 연구합니다.", keywords: ["자기이해", "정체성", "주체성"] },
      { number: "02", title: "메타인지 · 회복탄력성", question: "생각을 점검하고 변화에 다시 대응하는 힘은 어떻게 자라는가?", description: "자신의 사고와 학습을 조절하는 메타인지, 어려움 이후 다시 방향을 찾는 회복탄력성의 조건을 탐구합니다.", keywords: ["메타인지", "자기조절", "회복"] },
      { number: "03", title: "가치판단 · 창의적 사고", question: "복잡한 상황에서 책임 있게 선택하고 새로운 해법을 만드는 방법은 무엇인가?", description: "가치를 비교하고 판단하는 능력과 익숙한 관점을 넘어 대안을 만드는 창의적 사고의 사회적 의미를 살펴봅니다.", keywords: ["가치판단", "의사결정", "창의성"] },
    ],
    valueEyebrow: "Core Values",
    valueTitle: "연구를 이끄는 핵심 가치",
    values: [
      { title: "사람 중심", description: "사람을 성과의 수단이 아닌 고유한 가능성과 존엄을 지닌 주체로 바라봅니다." },
      { title: "근거와 깊이", description: "유행하는 표현보다 개념과 근거를 꼼꼼히 살피고, 쉽게 단정하지 않는 연구를 지향합니다." },
      { title: "성장과 연결", description: "개인의 성장이 배움, 관계, 조직과 공동체의 변화로 이어지는 조건을 함께 탐색합니다." },
      { title: "개방과 책임", description: "다양한 관점과 현장의 경험을 존중하되, 연구 결과를 책임 있게 해석하고 나누고자 합니다." },
    ],
    approachEyebrow: "How We Work",
    approachTitle: "연구는 이렇게 이어집니다",
    approaches: [
      { step: "01", title: "질문 발견", description: "사람과 현장에서 반복되는 성장의 질문을 구체적으로 찾습니다." },
      { step: "02", title: "개념과 근거 탐색", description: "관련 연구와 이론을 검토하고 핵심 개념의 의미를 정리합니다." },
      { step: "03", title: "현장과 연결", description: "교육과 조직, 공동체의 경험과 연구 질문이 만나는 지점을 살펴봅니다." },
      { step: "04", title: "책임 있게 공유", description: "확인된 범위와 한계를 함께 밝히며 연구자료와 논의를 나눕니다." },
    ],
    closingTitle: "연구 협력과 자료에 대해 궁금하신가요?",
    closingDescription: "KIHC의 연구자료를 살펴보거나 연구 협력에 관한 문의를 남겨 주세요.",
    researchButton: "연구정책자료 보기",
    contactButton: "문의하기",
  },
  en: {
    localeName: "English",
    eyebrow: "KIHC RESEARCH & VALUES",
    title: "Researching the capabilities that help people grow",
    introduction: "KIHC studies the inner capabilities people need to understand themselves, adapt to change, and make responsible choices. We avoid overstating work that has not yet been established and continue our research and dialogue around the questions below.",
    focusEyebrow: "Research Focus",
    focusTitle: "What do we study?",
    focusDescription: "We explore how capabilities that begin within the individual can extend into learning, relationships, and the growth of communities.",
    areas: [
      { number: "01", title: "Identity and self-direction", question: "Who am I, and what principles will guide my life?", description: "We examine self-understanding, identity, and agency to better understand how people develop the capacity to set their own direction.", keywords: ["Self-understanding", "Identity", "Agency"] },
      { number: "02", title: "Metacognition and resilience", question: "How do we monitor our thinking and respond again after change or difficulty?", description: "We study metacognition as the ability to regulate thinking and learning, and resilience as the capacity to regain direction after adversity.", keywords: ["Metacognition", "Self-regulation", "Resilience"] },
      { number: "03", title: "Value judgement and creative thinking", question: "How can we choose responsibly and develop new responses in complex situations?", description: "We consider the social meaning of value judgement and creative thinking that moves beyond familiar perspectives to form alternatives.", keywords: ["Value judgement", "Decision-making", "Creativity"] },
    ],
    valueEyebrow: "Core Values",
    valueTitle: "Values that guide our research",
    values: [
      { title: "Human-centred", description: "We see people not as instruments of performance, but as individuals with dignity and distinct potential." },
      { title: "Evidence and depth", description: "We examine concepts and evidence carefully, resisting quick conclusions and fashionable language." },
      { title: "Growth and connection", description: "We explore how individual growth can connect with learning, relationships, organisations, and communities." },
      { title: "Openness and responsibility", description: "We respect diverse perspectives and practical experience while interpreting and sharing research responsibly." },
    ],
    approachEyebrow: "How We Work",
    approachTitle: "How our research develops",
    approaches: [
      { step: "01", title: "Identify questions", description: "We locate recurring questions about human growth in everyday practice and experience." },
      { step: "02", title: "Explore concepts and evidence", description: "We review relevant studies and theories and clarify the meaning of key concepts." },
      { step: "03", title: "Connect with practice", description: "We examine where research questions meet experiences in education, organisations, and communities." },
      { step: "04", title: "Share responsibly", description: "We communicate findings together with their confirmed scope and limitations." },
    ],
    closingTitle: "Interested in our research or collaboration?",
    closingDescription: "Explore KIHC research materials or contact us about potential research collaboration.",
    researchButton: "View research materials",
    contactButton: "Contact KIHC",
  },
} as const;

export function ResearchFocusContent({ initialLocale = "ko", useStoredPreference = true }: { initialLocale?: Locale; useStoredPreference?: boolean }) {
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const copy = content[locale];

  useEffect(() => {
    if (!useStoredPreference) return;
    const stored = window.localStorage.getItem("kihc-language");
    const nextLocale: Locale = stored === "en" ? "en" : "ko";
    const frame = window.requestAnimationFrame(() => setLocale(nextLocale));
    return () => window.cancelAnimationFrame(frame);
  }, [useStoredPreference]);

  const chooseLocale = (nextLocale: Locale) => {
    setLocale(nextLocale);
    window.localStorage.setItem("kihc-language", nextLocale);
    window.history.replaceState(null, "", nextLocale === "en" ? "/research-focus?lang=en" : "/research-focus");
  };

  return (
    <main className="research-focus-main" lang={locale}>
      <section className="research-focus-hero">
        <div className="container">
          <div className="language-switcher" aria-label="Language">
            {(Object.keys(content) as Locale[]).map((key) => <button type="button" aria-pressed={locale === key} className={locale === key ? "active" : ""} onClick={() => chooseLocale(key)} key={key}>{content[key].localeName}</button>)}
          </div>
          <p className="eyebrow light">{copy.eyebrow}</p>
          <h1>{copy.title}</h1>
          <p>{copy.introduction}</p>
        </div>
      </section>

      <section className="section research-question-section">
        <div className="container">
          <div className="section-heading">
            <div><p className="eyebrow">{copy.focusEyebrow}</p><h2>{copy.focusTitle}</h2></div>
            <p>{copy.focusDescription}</p>
          </div>
          <div className="research-question-grid">
            {copy.areas.map((area) => <article key={area.number}><span>{area.number}</span><h3>{area.title}</h3><strong>{area.question}</strong><p>{area.description}</p><div>{area.keywords.map((keyword) => <em key={keyword}>{keyword}</em>)}</div></article>)}
          </div>
        </div>
      </section>

      <section className="section core-values-section">
        <div className="container">
          <div className="values-heading"><p className="eyebrow light">{copy.valueEyebrow}</p><h2>{copy.valueTitle}</h2></div>
          <div className="core-values-grid">
            {copy.values.map((value, index) => <article key={value.title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{value.title}</h3><p>{value.description}</p></article>)}
          </div>
        </div>
      </section>

      <section className="section research-approach-section">
        <div className="container">
          <div className="section-heading compact"><div><p className="eyebrow">{copy.approachEyebrow}</p><h2>{copy.approachTitle}</h2></div></div>
          <ol className="research-approach-list">
            {copy.approaches.map((item) => <li key={item.step}><span>{item.step}</span><h3>{item.title}</h3><p>{item.description}</p></li>)}
          </ol>
        </div>
      </section>

      <section className="research-focus-cta">
        <div className="container"><div><h2>{copy.closingTitle}</h2><p>{copy.closingDescription}</p></div><div><Link prefetch={false} className="button button-light" href="/research">{copy.researchButton}</Link><Link prefetch={false} className="button research-focus-contact" href="/contact">{copy.contactButton}</Link></div></div>
      </section>
    </main>
  );
}
