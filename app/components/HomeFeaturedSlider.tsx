"use client";

import { useState } from "react";
import { AppLink as Link } from "./AppLink";
import { ResearchTaxonomySelects } from "./ResearchTaxonomySelects";
import type { ResearchMaterial } from "../lib/content";
import { DEFAULT_RESEARCH_KEYWORDS } from "../lib/research-taxonomy";

export function HomeFeaturedSlider({
  featuredResearch,
  isEn,
  searchKeywords,
}: {
  featuredResearch: ResearchMaterial[];
  isEn: boolean;
  searchKeywords?: string;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<"next" | "prev">("next");
  const totalItems = featuredResearch.length;
  const configuredKeywords = searchKeywords === "정책연구,미래전략,탄소중립,컨퍼런스,포럼" ? "" : (searchKeywords || "");
  const keywordList = configuredKeywords
    .split(",")
    .map((item) => item.trim().replace(/^#/, ""))
    .filter(Boolean)
    .slice(0, 5);
  const keywords = keywordList.length > 0 ? keywordList : DEFAULT_RESEARCH_KEYWORDS;

  const scrollNext = () => {
    if (totalItems > 1) {
      setSlideDirection("next");
      setCurrentIndex((prev) => (prev + 1) % totalItems);
    }
  };

  const scrollPrev = () => {
    if (totalItems > 1) {
      setSlideDirection("prev");
      setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
    }
  };

  const visibleCount = Math.min(3, totalItems);
  const itemsToShow = Array.from(
    { length: visibleCount },
    (_, offset) => featuredResearch[(currentIndex + offset) % totalItems],
  ).filter((item): item is ResearchMaterial => Boolean(item));

  return (
    <>
      <div className="featured-heading-h">
        <h2>{isEn ? "Featured Publications" : "주요 게시물"}</h2>
        <div className="slider-controls">
          {totalItems > 0 ? (
            <>
              <button type="button" onClick={scrollPrev} className="slider-arrow" aria-label={isEn ? "Previous publication" : "이전 연구자료"} disabled={totalItems < 2}>‹</button>
              <span>{currentIndex + 1}/{totalItems}</span>
              <button type="button" onClick={scrollNext} className="slider-arrow" aria-label={isEn ? "Next publication" : "다음 연구자료"} disabled={totalItems < 2}>›</button>
            </>
          ) : <span>0/0</span>}
          <Link prefetch={false} href="/research" className="plus-icon" aria-label={isEn ? "View all publications" : "연구자료 전체보기"}>+</Link>
        </div>
      </div>

      {itemsToShow.length > 0 ? (
        <div
          className={`featured-slider has-${itemsToShow.length} is-${slideDirection}`}
          key={`${currentIndex}-${slideDirection}`}
          aria-live="polite"
        >
          {itemsToShow.map((item, idx) => (
            <article className="featured-card-h" key={`${item.id}-${idx}`}>
              <div className={`featured-cover-h cover-${(currentIndex + idx) % 2 + 1}`}>
                <span className="cover-badge">{item.researchType}</span>
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- uploaded media can use a runtime URL.
                  <img className="content-cover-image" src={item.imageUrl} alt="" />
                ) : (
                  <div className="cover-inner-text">
                    <small>KIHC</small>
                    <br />
                    <strong>{item.title}</strong>
                  </div>
                )}
              </div>
              <div className="featured-copy-h">
                <h3>{item.title}</h3>
                <p>{item.summary || item.title}</p>
                <Link prefetch={false} href={`/research/${item.slug}`}>
                  {isEn ? "Read more" : "더보기"} <span aria-hidden="true">›</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="featured-empty-state">
          <strong>{isEn ? "New KIHC publications are being prepared." : "새로운 KIHC 연구자료를 준비하고 있습니다."}</strong>
          <p>{isEn ? "Published research will be introduced here." : "공개된 연구자료가 등록되면 주요 자료와 표지 이미지가 이곳에 표시됩니다."}</p>
        </div>
      )}

      <div className="featured-search-box">
        <form className="featured-search-form" method="GET" action="/research">
          <ResearchTaxonomySelects isEn={isEn} variant="featured" />
          <input
            className="search-input"
            type="search"
            name="query"
            placeholder={isEn ? "Search KIHC publications" : "연구자료 검색어를 입력하세요"}
            aria-label={isEn ? "Publication search term" : "연구자료 검색어"}
          />
          <button className="search-submit" type="submit" aria-label={isEn ? "Search" : "검색"}>
            <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
              <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="m16.5 16.5 4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </form>
        <div className="search-keywords">
          <strong><span aria-hidden="true">▣</span>{isEn ? "Keywords" : "추천 키워드"}</strong>
          {keywords.map((keyword) => (
            <Link prefetch={false} href={`/research?query=${encodeURIComponent(keyword)}`} key={keyword}>#{keyword}</Link>
          ))}
        </div>
      </div>
    </>
  );
}
