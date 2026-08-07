/* eslint-disable @next/next/no-img-element -- R2 media is served by the app's immutable media route. */
import { AppLink as Link } from "./components/AppLink";
import { Footer } from "./components/Footer";
import { NoticePopup } from "./components/NoticePopup";
import { SiteHeader } from "./components/SiteHeader";
import { contentRepository } from "./lib/content";

const focusAreas = [
  {
    number: "01",
    title: "자아확립",
    description: "자기 이해를 토대로 삶과 배움의 방향을 세우는 힘을 연구합니다.",
    className: "focus-identity",
  },
  {
    number: "02",
    title: "메타인지 · 회복탄력성",
    description: "생각을 점검하고 변화에 유연하게 대응하는 역량을 살핍니다.",
    className: "focus-resilience",
  },
  {
    number: "03",
    title: "가치판단 · 창의적 사고",
    description: "더 나은 선택과 새로운 해법을 만드는 사고의 토대를 탐구합니다.",
    className: "focus-creativity",
  },
];

export default async function Home() {
  const [allResearch, allNews, popup] = await Promise.all([contentRepository.listResearch(), contentRepository.listNews(), contentRepository.getActivePopup()]);
  const research = allResearch.slice(0, 3);
  const news = allNews.slice(0, 5);

  return (
    <>
      <SiteHeader />
      <main>
        <section className="home-hero">
          <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
          <div className="hero-orbit hero-orbit-two" aria-hidden="true" />
          <div className="container hero-content">
            <p className="eyebrow light">KOREA INSTITUTE OF HUMAN CAPABILITY</p>
            <h1>
              사람의 가능성을 이해하고,
              <br />더 나은 성장을 연구합니다.
            </h1>
            <p className="hero-copy">
              한국인재역량연구회는 인간의 내면 역량과 지속 가능한 성장의 조건을
              차분하게 탐구합니다.
            </p>
            <Link prefetch={false} className="button button-light" href="/about">
              KIHC 소개 <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="hero-index" aria-hidden="true">
            <span>KIHC</span>
            <strong>Research for Human Growth</strong>
          </div>
        </section>

        <section className="section focus-section">
          <div className="container">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Research Focus</p>
                <h2>연구분야</h2>
              </div>
              <p>
                한 사람의 성장에서 출발해 건강한 공동체로 이어지는 핵심 역량을
                연구합니다.
              </p>
            </div>
            <div className="focus-grid">
              {focusAreas.map((area) => (
                <article className={`focus-card ${area.className}`} key={area.title}>
                  <span className="focus-number">{area.number}</span>
                  <div>
                    <h3>{area.title}</h3>
                    <p>{area.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section research-section">
          <div className="container">
            <div className="section-heading compact">
              <div>
                <p className="eyebrow">Research & Policy</p>
                <h2>최신 연구정책자료</h2>
              </div>
              <Link prefetch={false} className="text-link" href="/research">
                전체 자료 보기 <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="research-grid">
              {research.map((item, index) => (
                <Link prefetch={false} className="research-card" href={`/research/${item.slug}`} key={item.id}>
                  <div className={`research-cover cover-${index + 1}`}>
                    {item.imageUrl ? <img className="content-cover-image" src={item.imageUrl} alt="" /> : null}
                    <span>KIHC RESEARCH</span>
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

        <section className="section news-section">
          <div className="container news-layout">
            <div className="news-intro">
              <p className="eyebrow">KIHC News</p>
              <h2>연구회 소식</h2>
              <p>KIHC의 새로운 소식과 주요 안내를 전합니다.</p>
              <Link prefetch={false} className="button button-outline" href="/news">
                소식 더보기
              </Link>
            </div>
            <div className="news-list">
              {news.map((item, index) => (
                <Link prefetch={false} href={`/news/${item.slug}`} key={item.id}>
                  <span className="news-no">{String(index + 1).padStart(2, "0")}</span>
                  <strong>{item.title}</strong>
                  <time>{item.publishedAt}</time>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      {popup ? <NoticePopup popup={popup} /> : null}
    </>
  );
}
