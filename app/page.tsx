import { cookies } from "next/headers";
import { AppLink as Link } from "./components/AppLink";
import { Footer } from "./components/Footer";
import { HomeEventCalendar } from "./components/HomeEventCalendar";
import { NoticePopup } from "./components/NoticePopup";
import { SiteHeader } from "./components/SiteHeader";
import { HomeFeaturedSlider } from "./components/HomeFeaturedSlider";
import { contentRepository } from "./lib/content";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const cookieStore = await cookies();
  const isEn = cookieStore.get("kihc-language")?.value === "en";

  const researchFramework = [
    {
      number: "01",
      badge: "DIFFERENTIATION",
      title: isEn ? "AI Differentiation Capability Research" : "AI 차별화 역량 연구",
      summary: isEn ? "Intensive research on human-unique critical thinking, creative problem-solving, and ethical judgment capabilities that AI cannot replace." : "인공지능이 대체할 수 없는 인간 고유의 비판적 사고력과 창의적 문제해결, 윤리적 판단 역량을 집중 연구합니다.",
      keywords: isEn ? ["Critical Thinking", "Creative Problem-solving", "Empathy & Communication", "Ethical Judgment"] : ["비판적 사고", "창의적 문제해결", "공감·소통", "윤리적 판단"],
    },
    {
      number: "02",
      badge: "SCIENTIFIC MODEL",
      title: isEn ? "Scientific Capability Model Construction" : "과학적 역량 모델 구축",
      summary: isEn ? "Developing an objective capability diagnosis system and personalized growth model converging psychology, cognitive science, and behavioral science." : "심리학·인지과학·행동과학을 융합한 객관적 역량 진단 체계 및 개인별 맞춤형 성장 모델을 개발합니다.",
      keywords: isEn ? ["Psychological Diagnosis", "Cognitive Science", "Behavioral Analysis", "Growth Model"] : ["심리학 진단", "인지과학 역량", "행동과학 분석", "성장 모델"],
    },
    {
      number: "03",
      badge: "PRACTICAL PROGRAM",
      title: isEn ? "Research-Based Program Distribution" : "연구 기반 프로그램 보급",
      summary: isEn ? "Distributing practical capability enhancement and field-oriented education systems that can be immediately applied to corporate, public institution, and school fields." : "기업, 공공기관, 학교 현장에 즉시 적용 가능한 실전 역량 강화 및 현장 중심 교육 체계를 보급합니다.",
      keywords: isEn ? ["Corporate Capability", "Public Programs", "Teacher Training", "Youth Education"] : ["기업 역량강화", "공공기관 프로그램", "교사 연수", "청년 교육"],
    },
    {
      number: "04",
      badge: "NATIONAL POLICY",
      title: isEn ? "National Talent Policy Proposal" : "국가 인재정책 제안",
      summary: isEn ? "Conducting policy R&D to establish national talent models and improve education systems tailored to the AI era paradigm shift." : "AI 시대 패러다임 전환에 맞춘 국가 인재상 정립 및 교육 제도 개선을 위한 정책 R&D를 수행합니다.",
      keywords: isEn ? ["Talent Model", "Education Paradigm", "System Improvement", "National Competitiveness"] : ["인재상 정립", "교육 패러다임", "제도 개선", "국가 경쟁력"],
    },
    {
      number: "05",
      badge: "GLOBAL NETWORK",
      title: isEn ? "Global Research Network" : "글로벌 연구 네트워크",
      summary: isEn ? "Fostering a sustainable human capability academic ecosystem connecting governments, universities, corporations, and leading overseas research institutes." : "정부·대학·기업 및 해외 선도 연구기관을 잇는 지속 가능한 인재역량 학술 생태계를 조성합니다.",
      keywords: isEn ? ["Government Cooperation", "Global Universities", "Corporate Partnership", "Academic Ecosystem"] : ["정부기관 협력", "국내외 대학", "기업 파트너십", "학술 생태계"],
    },
  ];

  const dict = {
    heroSub: isEn ? "KIHC · Korea Institute of Human Capability" : "KIHC · 한국인재역량연구회",
    heroTitle: isEn ? "Exploring human potential\nfor sustainable growth." : "사람의 가능성을 탐구하고,\n지속 가능한 성장을 연구합니다.",
    heroCopy: isEn ? "KIHC researches conditions for human capabilities and inner growth, proposing reliable solutions." : "KIHC는 인간 고유의 역량과 내면 성장의 조건을 진단하고, 신뢰할 수 있는 솔루션을 제안합니다.",
    heroBtn1: isEn ? "About KIHC Institute" : "KIHC 연구소 소개",
    heroBtn2: isEn ? "Research Services & Partnerships" : "연구 용역 · 제휴 문의",
    recentResearch: isEn ? "Recent Research" : "최근 연구자료",
    recentResearchMore: isEn ? "View all research materials" : "연구자료 전체보기",
    focusTitle: isEn ? "Research Focus" : "연구분야",
    focusDesc: isEn ? "Diagnosing conditions for human unique thinking and growth, proposing reliable academic research and policy solutions." : "인간 고유의 사고와 성장의 조건을 진단하고, 신뢰할 수 있는 학술 연구와 정책 솔루션을 제안합니다.",
    focusMore: isEn ? "View Details on Research & Core Values" : "연구와 핵심가치 자세히 보기",
    featuredTitle: isEn ? "Featured Publications" : "주요 게시물",
    featuredDesc: isEn ? "" : "",
    featuredMore: isEn ? "Read more >" : "더보기 >",
    newsTitle: isEn ? "KIHC News" : "연구회 소식",
    newsDesc: isEn ? "Quickly check the latest news and major announcements from KIHC." : "KIHC의 새로운 소식과 주요 안내를 빠르게 확인하세요.",
    newsMore: isEn ? "More News" : "소식 더보기",
    quick1: isEn ? "About KIHC" : "KIHC 소개",
    quick2: isEn ? "KIHC News" : "연구회 소식",
    quick3: isEn ? "Research Policy Materials" : "연구정책자료",
    quick4: isEn ? "Contact Us" : "문의"
  };

  const [allResearch, allNews, popup, settings] = await Promise.all([
    contentRepository.listResearch(),
    contentRepository.listNews(),
    contentRepository.getActivePopup(),
    contentRepository.getSettings(),
  ]);
  // 최신순 정렬 (publishedAt 내림차순)
  const sortedResearch = [...allResearch].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const sortedNews = [...allNews].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const featuredResearch = [...allResearch].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 6);
  const news = sortedNews.slice(0, 5);

  return (
    <>
      <SiteHeader />
      <main className="home-main">
        <section className="home-hero">
          <div className="hero-visual-placeholder" aria-hidden="true">
            <span className="hero-visual-grid" />
            <span className="hero-visual-core" />
          </div>
          <div className="container hero-layout">
            <div className="hero-content">
              <p className="eyebrow light">HUMAN CAPABILITY RESEARCH & POLICY THINK-TANK</p>
              <p className="hero-korean-name">{dict.heroSub}</p>
              <h1 style={{ whiteSpace: "pre-line" }}>
                {dict.heroTitle}
              </h1>
              <p className="hero-copy">
                {dict.heroCopy}
              </p>
              <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                <Link prefetch={false} className="button button-light" href="/about">
                  {dict.heroBtn1} <span aria-hidden="true">→</span>
                </Link>
                <Link prefetch={false} className="button button-primary" href="/contact">
                  {dict.heroBtn2} <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </div>

            <aside className="hero-research-panel" aria-label={dict.recentResearch}>
              <div className="hero-panel-heading">
                <div>
                  <span>Research Update</span>
                  <h2>{dict.recentResearch}</h2>
                </div>
                <strong>{String(sortedResearch.length).padStart(2, "0")}</strong>
              </div>
              <div className="hero-panel-list">
                {sortedResearch.length > 0 ? (
                  sortedResearch.slice(0, 4).map((item, index) => (
                    <Link className="research-card" href={`/research/${item.slug}`} key={item.id}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <strong>{item.title}</strong>
                      <time>{item.publishedAt}</time>
                    </Link>
                  ))
                ) : (
                  <div className="hero-panel-empty">
                    <span>Research Archive</span>
                    <strong>{isEn ? "New research is being prepared." : "새로운 연구자료를 준비하고 있습니다."}</strong>
                    <p>{isEn ? "Updates will be available here soon." : "등록되는 연구자료는 이곳에서 바로 확인하실 수 있습니다."}</p>
                  </div>
                )}
              </div>
              <Link className="hero-panel-more" href="/research">
                {dict.recentResearchMore} <span aria-hidden="true">→</span>
              </Link>
            </aside>
          </div>
          <div className="container hero-footnote" aria-hidden="true">
            <span>Research for Human Growth</span>
            <span>KIHC 2026</span>
          </div>
        </section>

        {/* 5대 핵심 연구분야 섹션 */}
        <section className="section focus-section">
          <div className="container">
            <div className="section-heading">
              <div>
                <p className="eyebrow">HUMAN CAPABILITY RESEARCH FOCUS</p>
                <h2>{dict.focusTitle}</h2>
              </div>
              <p>{dict.focusDesc}</p>
            </div>

            <div className="research-framework-grid">
              {researchFramework.map((item) => (
                <article className="research-framework-card" key={item.number}>
                  <div className="card-top-line">
                    <span className="card-num">{item.number}</span>
                    <span className="card-tag">{item.badge}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p className="card-summary">{item.summary}</p>
                  <div className="card-keywords">
                    {item.keywords.map((kw) => (
                      <span key={kw}>#{kw}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
            <div className="focus-more">
              <Link className="text-link" href="/research-focus">
                {dict.focusMore} <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="section featured-section">
          <div className="container">
            <HomeFeaturedSlider featuredResearch={featuredResearch} isEn={isEn} searchKeywords={settings.searchKeywords} />
          </div>
        </section>

        <section className="section news-events-section">
          <div className="container news-events-layout">
            {/* 왼쪽: 연구회 소식 */}
            <div className="news-events-col">
              <div className="news-events-col-head">
                <div>
                  <p className="eyebrow">KIHC News</p>
                  <h2>{dict.newsTitle}</h2>
                  <p className="news-events-desc">{dict.newsDesc}</p>
                </div>
                <Link className="button button-outline" href="/news">{dict.newsMore}</Link>
              </div>
              <div className="news-list">
                {news.map((item, index) => (
                  <Link href={`/news/${item.slug}`} key={item.id}>
                    <span className="news-no">{String(index + 1).padStart(2, "0")}</span>
                    <time>{item.publishedAt}</time>
                    <strong>{item.title}</strong>
                    <span className="news-arrow" aria-hidden="true">↗</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* 오른쪽: 행사일정 */}
            <HomeEventCalendar events={allNews.filter(n => n.category1 === "행사일정")} inline />
          </div>
        </section>

        <nav className="quick-section" aria-label={isEn ? "Quick Links" : "주요 바로가기"}>
          <div className="container quick-grid">
            <Link prefetch={false} href="/about"><span>01</span><strong>{dict.quick1}</strong><i aria-hidden="true">→</i></Link>
            <Link prefetch={false} href="/news"><span>02</span><strong>{dict.quick2}</strong><i aria-hidden="true">→</i></Link>
            <Link prefetch={false} href="/research"><span>03</span><strong>{dict.quick3}</strong><i aria-hidden="true">→</i></Link>
            <Link prefetch={false} href="/contact"><span>04</span><strong>{dict.quick4}</strong><i aria-hidden="true">→</i></Link>
          </div>
        </nav>
      </main>
      <Footer />
      {popup ? <NoticePopup popup={popup} /> : null}
    </>
  );
}
