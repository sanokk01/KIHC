"use client";

import { useRef, useState } from "react";
import { AppLink as Link } from "./AppLink";
import type { ResearchMaterial } from "../lib/content";

export function HomeFeaturedSlider({
  featuredResearch,
  isEn,
}: {
  featuredResearch: ResearchMaterial[];
  isEn: boolean;
}) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = featuredResearch.length || 1;

  const handleScroll = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    
    // Calculate which card is currently in view
    // Adding half of clientWidth to scrollLeft helps determine which item is most visible
    const cardWidth = 360; // approximate width of card + gap
    const page = Math.round(scrollLeft / cardWidth) + 1;
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  };

  const scrollNext = () => {
    if (!sliderRef.current) return;
    sliderRef.current.scrollBy({ left: 360, behavior: "smooth" });
  };

  const scrollPrev = () => {
    if (!sliderRef.current) return;
    sliderRef.current.scrollBy({ left: -360, behavior: "smooth" });
  };

  return (
    <>
      <div className="featured-heading-h">
        <h2>{isEn ? "Featured Publications" : "주요 게시물"}</h2>
        <div className="slider-controls">
          <button type="button" onClick={scrollPrev} className="slider-arrow" aria-label="Previous">&lt;</button>
          <span>{currentPage}/{totalPages}</span>
          <button type="button" onClick={scrollNext} className="slider-arrow" aria-label="Next">&gt;</button>
          <Link prefetch={false} href="/research" className="plus-icon" aria-label="View all">+</Link>
        </div>
      </div>

      <div className="featured-slider" ref={sliderRef} onScroll={handleScroll}>
        {featuredResearch.map((item, index) => (
          <article className="featured-card-h" key={item.id}>
            <div className={`featured-cover-h cover-${(index % 2) + 1}`}>
              <span className="cover-badge">
                {isEn ? (item.researchType === "브리프" ? "BRIEF" : "REPORT") : (item.researchType || "자료집")}
              </span>
              {item.imageUrl ? (
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
                {isEn ? "Read more >" : "더보기 >"}
              </Link>
            </div>
          </article>
        ))}
      </div>

      <div className="featured-search-box">
        <form action="/research" method="GET" className="featured-search-form">
          <select name="cat1" className="search-select">
            <option value="">{isEn ? "All Categories" : "대분류 전체"}</option>
            <option value="정책연구">정책연구</option>
            <option value="세미나">세미나자료</option>
            <option value="단행본">단행본</option>
          </select>
          <select name="cat2" className="search-select">
            <option value="">{isEn ? "All Subcategories" : "중분류 전체"}</option>
            <option value="미래전략">미래전략</option>
            <option value="역량평가">역량평가</option>
            <option value="탄소중립">탄소중립</option>
          </select>
          <input
            type="text"
            name="query"
            placeholder={isEn ? "Enter search term." : "검색어를 입력해주세요."}
            className="search-input"
          />
          <button type="submit" className="search-submit" aria-label="Search">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </form>
        <div className="search-keywords">
          <strong>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
            </svg>{" "}
            {isEn ? "Keywords" : "키워드"}
          </strong>
          <Link prefetch={false} href="/research?query=정책연구">#정책연구</Link>
          <Link prefetch={false} href="/research?query=미래전략">#미래전략</Link>
          <Link prefetch={false} href="/research?query=탄소중립">#탄소중립</Link>
          <Link prefetch={false} href="/research?query=컨퍼런스">#컨퍼런스</Link>
          <Link prefetch={false} href="/research?query=포럼">#포럼</Link>
        </div>
      </div>
    </>
  );
}
