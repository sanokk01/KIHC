"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const router = useRouter();
  const [lang, setLang] = useState<"ko" | "en">("ko");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Read from cookie first, fallback to localStorage
    const match = document.cookie.match(new RegExp('(^| )kihc-language=([^;]+)'));
    if (match) {
      setLang(match[2] as "ko" | "en");
    } else {
      const stored = window.localStorage.getItem("kihc-language");
      if (stored === "en") setLang("en");
    }
  }, []);

  const changeLanguage = (nextLang: "ko" | "en") => {
    setLang(nextLang);
    // Save to both cookie (for server components) and localStorage (fallback)
    document.cookie = `kihc-language=${nextLang}; path=/; max-age=31536000`;
    window.localStorage.setItem("kihc-language", nextLang);
    
    // Refresh the router so Server Components re-fetch cookies and re-render
    router.refresh();
  };

  if (!isClient) return <div className={`language-dropdown-wrapper ${className}`} aria-hidden="true" />;

  return (
    <div className={`language-dropdown-wrapper ${className}`}>
      <label htmlFor="lang-select" className="lang-label">
        {lang === "ko" ? "언어:" : "Lang:"}
      </label>
      <div className="lang-select-box">
        <select
          id="lang-select"
          className="lang-select"
          value={lang}
          onChange={(e) => changeLanguage(e.target.value as "ko" | "en")}
          aria-label="언어 선택"
        >
          <option value="ko">한국어</option>
          <option value="en">English</option>
        </select>
      </div>
    </div>
  );
}
