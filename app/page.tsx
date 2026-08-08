/* eslint-disable @next/next/no-img-element -- future uploaded media may be served by the app's media route. */
import { AppLink as Link } from "./components/AppLink";
import { Footer } from "./components/Footer";
import { HomeEventCalendar } from "./components/HomeEventCalendar";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import { NoticePopup } from "./components/NoticePopup";
import { SiteHeader } from "./components/SiteHeader";
import { contentRepository } from "./lib/content";

const aiResearchFramework = [
  {
    number: "01",
    badge: "AI DIFFERENTIATION",
    title: "AI 차별화 역량 정의",
    summary: "인공지능이 대체할 수 없는 인간 고유의 사고 및 행동 특성 집중 연구",
    details: [
      "비판적 사고력",
      "창의적 문제해결력",
      "공감과 소통 능력",
      "윤리적 판단과 책임 의식",
      "복합적 맥락 이해력",
    ],
    icon: "🧠",
  },
  {
    number: "02",
    badge: "SCIENTIFIC MODEL",
    title: "과학적 역량 모델 구축",
    summary: "심리학·인지과학·행동과학 기반의 객관적 역량 진단 체계 및 성장 모델 개발",
    details: [
      "심리학 기반 역량 분석",
      "인지과학 기반 역량 측정",
      "행동과학 기반 행동 분석",
      "객관적 역량 진단 체계",
      "개인별 성장 모델 개발",
    ],
    icon: "📈",
  },
  {
    number: "03",
    badge: "PRACTICAL PROGRAM",
    title: "연구 기반 프로그램 보급",
    summary: "기업, 공공기관, 학교, 청년 현장에 즉시 적용 가능한 실전 교육 보급",
    details: [
      "기업 맞춤형 교육 프로그램",
      "공공기관 역량 강화 프로그램",
      "학교 교육과정 및 교사 연수",
      "청년 대상 실전 역량 교육",
      "연구 기반 실전 교육 보급",
    ],
    icon: "📚",
  },
  {
    number: "04",
    badge: "NATIONAL POLICY",
    title: "국가 인재정책 제안",
    summary: "AI 시대 패러다임 전환에 맞춘 국가 제도 개선 및 교육 정책 수립",
    details: [
      "AI 시대 인재상 정립",
      "교육 정책 패러다임 전환 제안",
      "제도 개선 및 정책 연구",
      "국가 인재 경쟁력 강화",
      "미래 사회 대비 인재 육성",
    ],
    icon: "🏛️",
  },
  {
    number: "05",
    badge: "GLOBAL NETWORK",
    title: "글로벌 연구 네트워크",
    summary: "정부·대학·기업 및 해외 선도 연구기관을 잇는 인재역량 생태계 조성",
    details: [
      "정부 기관 협력",
      "국내 대학 및 연구기관 협력",
      "기업 파트너십 강화",
      "해외 선도 연구기관 협력",
      "글로벌 인재역량 생태계 조성",
    ],
    icon: "🌐",
  },
];

export default async function Home() {
  const [allResearch, allNews, events, popup] = await Promise.all([
    contentRepository.listResearch(),
    contentRepository.listNews(),
    contentRepository.listEvents(),
    contentRepository.getActivePopup(),
  ]);
  // 최신순 정렬 (publishedAt 내림차순)
  const sortedResearch = [...allResearch].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const sortedNews = [...allNews].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  // TODO: featuredResearch는 DB 연결 후 조회수(viewCount) 기준으로 변경 예정
  const featuredResearch = sortedResearch.slice(0, 2);
  const news = sortedNews.slice(0, 5);

  return (
    <>
      <SiteHeader />
      <main className="home-main">
        <section className="home-hero">
          <div className="container home-hero-lang-box">
            <LanguageSwitcher className="main-hero-lang" />
          </div>
          <div className="hero-visual-placeholder" aria-hidden="true">
            <span className="hero-visual-grid" />
            <span className="hero-visual-core" />
          </div>
          <div className="container hero-layout">
            <div className="hero-content">
              <p className="eyebrow light">HUMAN CAPABILITY RESEARCH & POLICY THINK-TANK</p>
              <p className="hero-korean-name">KIHC · 한국인재역량연구회 · 인재역량 진단 및 정책연구 전문기관</p>
              <h1>
                사람의 가능성을 탐구하고,
                <br />지속 가능한 성장의 해법을 연구합니다.
              </h1>
              <p className="hero-copy">
                정부·기업·학계와 협력하여 인간 고유의 사고 역량과 내면 성장의 조건을 다각도로 진단하고, 신뢰할 수 있는 정책 및 교육 솔루션을 제안합니다.
              </p>
              <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                <Link prefetch={false} className="button button-light" href="/about">
                  KIHC 연구소 소개 <span aria-hidden="true">→</span>
                </Link>
                <Link prefetch={false} className="button button-primary" href="/contact">
                  연구 용역 · 제휴 문의 <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </div>

            <aside className="hero-research-panel" aria-label="최근 연구자료">
              <div className="hero-panel-heading">
                <div>
                  <span>Research Update</span>
                  <h2>최근 연구자료</h2>
                </div>
                <strong>{String(sortedResearch.length).padStart(2, "0")}</strong>
              </div>
              <div className="hero-panel-list">
                {sortedResearch.slice(0, 4).map((item, index) => (
                  <Link prefetch={false} href={`/research/${item.slug}`} key={item.id}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{item.title}</strong>
                    <time>{item.publishedAt}</time>
                  </Link>
                ))}
              </div>
              <Link prefetch={false} className="hero-panel-more" href="/research">
                연구자료 전체보기 <span aria-hidden="true">→</span>
              </Link>
            </aside>
          </div>
          <div className="container hero-footnote" aria-hidden="true">
            <span>Research for Human Growth</span>
            <span>KIHC 2026</span>
          </div>
        </section>

        {/* AI 시대 5대 핵심 연구분야 섹션 */}
        <section className="section focus-section">
          <div className="container">
            <div className="section-heading">
              <div>
                <p className="eyebrow">AI-ERA HUMAN CAPABILITY FRAMEWORK</p>
                <h2>AI 시대 인재역량 핵심 연구분야</h2>
              </div>
              <p>인공지능이 대체할 수 없는 사람만의 가치로 미래를 설계하고, 과학적 진단과 국가 인재정책 대안을 제시합니다.</p>
            </div>

            {/* 메인 센터 인포그래픽 배너 */}
            <div className="ai-core-center-banner">
              <div className="banner-icon-badge">🤖 ➔ 👤</div>
              <div className="banner-text">
                <h3>AI 시대 인재역량 연구원</h3>
                <p>AI 시대, 사람만의 가치로 미래를 설계합니다</p>
              </div>
            </div>

            <div className="ai-framework-grid">
              {aiResearchFramework.map((item) => (
                <article className="ai-framework-card" key={item.number}>
                  <div className="framework-card-header">
                    <span className="framework-num">{item.number}</span>
                    <span className="framework-badge">{item.badge}</span>
                    <span className="framework-icon">{item.icon}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p className="framework-summary">{item.summary}</p>
                  <div className="framework-details-list">
                    <strong>주요 연구 및 수행 과제:</strong>
                    <ul>
                      {item.details.map((detail) => (
                        <li key={detail}>
                          <span className="check-bullet">✓</span> {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
            <div className="focus-more">
              <Link prefetch={false} className="text-link" href="/research-focus">
                연구와 핵심가치 자세히 보기 <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="section featured-section">
          <div className="container">
            <div className="featured-heading">
              <div>
                <p className="eyebrow light">Featured Research</p>
                <h2>주요 연구자료</h2>
              </div>
              <p>사람의 성장과 사회의 변화를 함께 바라보는 KIHC의 최근 연구입니다.</p>
            </div>
            <div className="featured-grid">
              {featuredResearch.map((item, index) => (
                <article className="featured-card" key={item.id}>
                  <div className={`featured-cover cover-${index + 1}`}>
                    {item.imageUrl ? <img className="content-cover-image" src={item.imageUrl} alt="" /> : null}
                    <span>KIHC</span>
                    <strong>{String(index + 1).padStart(2, "0")}</strong>
                  </div>
                  <div className="featured-copy">
                    <time>{item.publishedAt}</time>
                    <h3>{item.title}</h3>
                    <p>{item.summary}</p>
                    <Link prefetch={false} href={`/research/${item.slug}`}>자세히 보기 <span aria-hidden="true">→</span></Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section news-events-section">
          <div className="container news-events-layout">
            {/* 왼쪽: 연구회 소식 */}
            <div className="news-events-col">
              <div className="news-events-col-head">
                <div>
                  <p className="eyebrow">KIHC News</p>
                  <h2>연구회 소식</h2>
                  <p className="news-events-desc">KIHC의 새로운 소식과 주요 안내를 빠르게 확인하세요.</p>
                </div>
                <Link prefetch={false} className="button button-outline" href="/news">소식 더보기</Link>
              </div>
              <div className="news-list">
                {news.map((item, index) => (
                  <Link prefetch={false} href={`/news/${item.slug}`} key={item.id}>
                    <span className="news-no">{String(index + 1).padStart(2, "0")}</span>
                    <time>{item.publishedAt}</time>
                    <strong>{item.title}</strong>
                    <span className="news-arrow" aria-hidden="true">↗</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* 오른쪽: 행사일정 */}
            <HomeEventCalendar events={events} inline />
          </div>
        </section>

        <nav className="quick-section" aria-label="주요 바로가기">
          <div className="container quick-grid">
            <Link prefetch={false} href="/about"><span>01</span><strong>KIHC 소개</strong><i aria-hidden="true">→</i></Link>
            <Link prefetch={false} href="/news"><span>02</span><strong>연구회 소식</strong><i aria-hidden="true">→</i></Link>
            <Link prefetch={false} href="/research"><span>03</span><strong>연구정책자료</strong><i aria-hidden="true">→</i></Link>
            <Link prefetch={false} href="/contact"><span>04</span><strong>문의</strong><i aria-hidden="true">→</i></Link>
          </div>
        </nav>
      </main>
      <Footer />
      {popup ? <NoticePopup popup={popup} /> : null}
    </>
  );
}
