"use client";

import { useState } from "react";
import { RESEARCH_TAXONOMY, getResearchSubcategories } from "../lib/research-taxonomy";

export function ResearchTaxonomySelects({
  initialCategory = "",
  initialSubcategory = "",
  isEn = false,
  variant = "advanced",
}: {
  initialCategory?: string;
  initialSubcategory?: string;
  isEn?: boolean;
  variant?: "advanced" | "featured";
}) {
  const [category, setCategory] = useState(initialCategory);
  const [subcategory, setSubcategory] = useState(initialSubcategory);
  const subcategories = getResearchSubcategories(category);
  const selectClass = variant === "featured" ? "search-select" : undefined;

  return (
    <>
      <select
        className={selectClass}
        name="cat1"
        value={category}
        onChange={(event) => {
          setCategory(event.target.value);
          setSubcategory("");
        }}
        aria-label={isEn ? "Research category" : "연구자료 대분류"}
      >
        <option value="">{isEn ? "All categories" : "대분류 전체"}</option>
        {RESEARCH_TAXONOMY.map((item) => (
          <option value={item.value} key={item.value}>{isEn ? item.labelEn : item.value}</option>
        ))}
      </select>
      <select
        className={selectClass}
        name="cat2"
        value={subcategory}
        onChange={(event) => setSubcategory(event.target.value)}
        disabled={!category}
        aria-label={isEn ? "Research subcategory" : "연구자료 소분류"}
      >
        <option value="">{isEn ? "All subcategories" : "소분류 전체"}</option>
        {subcategories.map((item) => (
          <option value={item.value} key={item.value}>{isEn ? item.labelEn : item.value}</option>
        ))}
      </select>
    </>
  );
}
