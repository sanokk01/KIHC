"use client";

import { useState } from "react";
import { AppLink as Link } from "./AppLink";
import type { ResearchMaterial } from "../lib/content";

export function HomeFeaturedSlider({
  featuredResearch,
  isEn,
}: {
  featuredResearch: ResearchMaterial[];
  isEn: boolean;
  searchKeywords?: string;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalItems = featuredResearch.length;

  const scrollNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalItems);
  };

  const scrollPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
  };

  if (totalItems === 0) return null;

  // Get current and next item (looping)
  const item1 = featuredResearch[currentIndex];
  const item2 = featuredResearch[(currentIndex + 1) % totalItems];
  const itemsToShow = totalItems === 1 ? [item1] : [item1, item2];

  return (
    <>
      <div className="featured-heading-h">
        <h2>{isEn ? "Featured Publications" : "주요 게시물"}</h2>
        <div className="slider-controls">
          <button type="button" onClick={scrollPrev} className="slider-arrow" aria-label="Previous">&lt;</button>
          <span>{currentIndex + 1}/{totalItems}</span>
          <button type="button" onClick={scrollNext} className="slider-arrow" aria-label="Next">&gt;</button>
          <Link prefetch={false} href="/research" className="plus-icon" aria-label="View all">+</Link>
        </div>
      </div>

      <div className="featured-slider" style={{ overflow: "hidden", display: "flex", gap: "24px", paddingBottom: "20px" }}>
        {itemsToShow.map((item, idx) => (
          <article className="featured-card-h" key={`${item.id}-${idx}`} style={{ flex: "0 0 calc(50% - 12px)", minWidth: 0 }}>
            <div className={`featured-cover-h cover-${(currentIndex + idx) % 2 + 1}`}>
              <span className="cover-badge">
                {item.researchType || "자료집"}
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
    </>
  );
}
