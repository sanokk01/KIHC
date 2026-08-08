/* eslint-disable @next/next/no-img-element -- future uploaded media may be served by the app's media route. */
import { AppLink as Link } from "./components/AppLink";
import { Footer } from "./components/Footer";
import { HomeEventCalendar } from "./components/HomeEventCalendar";
import { NoticePopup } from "./components/NoticePopup";
import { SiteHeader } from "./components/SiteHeader";
import { contentRepository } from "./lib/content";

const focusAreas = [
  {
    number: "01",
    title: "자아확립",
    description: "자기 이해를 토대로 삶과 배움의 방향을 세우는 힘을 연구합니다.",
    keywords: ["자기이해", "방향설정"],
    className: "focus-identity",
  },
  {
    number: "02",
    title: "메타인지 · 회복탄력성",
    description: "생각을 점검하고 변화에 유연하게 대응하는 역량을 살핍니다.",
    keywords: ["자기조절", "변화대응"],
    className: "focus-resilience",
  },
  {
    number: "03",
    title: "가치판단 · 창의적 사고",
    description: "더 나은 선택과 새로운 해법을 만드는 사고의 토대를 탐구합니다.",
    keywords: ["의사결정", "문제해결"],
    className: "focus-creativity",
  },
];

export default async function Home() {
  const [allResearch, allNews, events, popup] = await Promise.all([
    contentRepository.listResearch(),
    contentRepository.listNews(),
    contentRepository.listEvents(),
    contentRepository.getActivePopup(),
  ]);
  const research = allResearch.slice(0, 3);
  const featuredResearch = allResearch.slice(0, 2);
  const news = allNews.slice(0, 5);

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
              <p className="eyebrow light">KOREA INSTITUTE OF HUMAN CAPABILITY</p>
              <p className="hero-korean-name">KIHC · 한국인재역량연구회</p>
              <h1>
                사람의 가능성을 이해하고,
                <br />더 나은 성장을 연구합니다.
              </h1>
              <p className="hero-copy">
                변화하는 시대, 인간 고유의 사고와 내면 역량을 다시 바라보며
                지속 가능한 성장의 조건을 탐구합니다.
              </p>
              <Link prefetch={false} className="button button-light" href="/about">
                KIHC 소개 <span aria-hidden="true">→</span>
              </Link>
            </div>

            <aside className="hero-research-panel" aria-label="최근 연구자료">
              <div className="hero-panel-heading">
                <div>
                  <span>Research Update</span>
                  <h2>최근 연구자료</h2>
                </div>
                <strong>{String(allResearch.length).padStart(2, "0")}</strong>
              </div>
              <div className="hero-panel-list">
                {allResearch.slice(0, 4).map((item, index) => (
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

        <section className="section focus-section">
          <div className="container">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Research Focus</p>
                <h2>연구분야</h2>
              </div>
              <p>한 사람의 성장에서 출발해 건강한 공동체로 이어지는 핵심 역량을 연구합니다.</p>
            </div>
            <div className="focus-grid">
              {focusAreas.map((area) => (
                <article className={`focus-card ${area.className}`} key={area.title}>
                  <div className="focus-visual" aria-hidden="true"><span /></div>
                  <span className="focus-number">{area.number}</span>
                  <div className="focus-copy">
                    <h3>{area.title}</h3>
                    <p>{area.description}</p>
                    <div className="focus-tags" aria-label={`${area.title} 핵심어`}>
                      {area.keywords.map((keyword) => <span key={keyword}>{keyword}</span>)}
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="focus-more"><Link prefetch={false} className="text-link" href="/research-focus">연구와 핵심가치 자세히 보기 <span aria-hidden="true">→</span></Link></div>
          </div>
        </section>

        <section className="section research-section">
          <div className="container">
            <div className="section-heading compact">
              <div>
                <p className="eyebrow">Research & Policy</p>
                <h2>연구 정책자료</h2>
                <p className="section-subcopy">KIHC의 주요 연구자료를 소개합니다.</p>
              </div>
              <Link prefetch={false} className="text-link" href="/research">
                전체 자료 보기 <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="research-grid home-research-scroll">
              {research.map((item, index) => (
                <Link prefetch={false} className="research-card" href={`/research/${item.slug}`} key={item.id}>
                  <div className={`research-cover cover-${index + 1}`}>
                    {item.imageUrl ? <img className="content-cover-image" src={item.imageUrl} alt="" /> : null}
                    <span>KIHC RESEARCH REPORT</span>
                    <strong>{String(index + 1).padStart(2, "0")}</strong>
                  </div>
                  <div className="research-card-body">
                    <p>{item.publishedAt}</p>
                    <h3>{item.title}</h3>
                    <span className="card-arrow" aria-hidden="true">↗</span>
                  </div>
                </Link>
              ))}
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

        <section className="section news-section">
          <div className="container news-layout">
            <div className="news-intro">
              <p className="eyebrow">KIHC News</p>
              <h2>연구회 소식</h2>
              <p>KIHC의 새로운 소식과 주요 안내를 빠르게 확인하세요.</p>
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
        </section>

        <HomeEventCalendar events={events} />

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
