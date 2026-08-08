"use client";

import { useEffect, useState } from "react";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const [lang, setLang] = useState<"ko" | "en">("ko");

  useEffect(() => {
    const stored = window.localStorage.getItem("kihc-language");
    if (stored === "en" || window.location.search.includes("lang=en")) {
      setLang("en");
    } else {
      setLang("ko");
    }
  }, []);

  const changeLanguage = (nextLang: "ko" | "en") => {
    setLang(nextLang);
    window.localStorage.setItem("kihc-language", nextLang);
    const url = new URL(window.location.href);
    if (nextLang === "en") {
      url.searchParams.set("lang", "en");
    } else {
      url.searchParams.delete("lang");
    }
    window.history.replaceState({}, "", url.toString());
    window.location.reload();
  };

  return (
    <div className={`hero-lang-switcher ${className}`} aria-label="Language Switcher">
      <button
        type="button"
        className={lang === "ko" ? "active" : ""}
        onClick={() => changeLanguage("ko")}
      >
        한국어
      </button>
      <button
        type="button"
        className={lang === "en" ? "active" : ""}
        onClick={() => changeLanguage("en")}
      >
        English
      </button>
    </div>
  );
}
