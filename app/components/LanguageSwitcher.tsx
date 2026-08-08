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
    // Force a hard reload to guarantee static Server Components completely translate instantly
    setTimeout(() => {
      window.location.reload();
    }, 50);
  };

  if (!isClient) return <div className={`lang-switcher-inline ${className}`} aria-hidden="true" />;

  return (
    <div className={`lang-switcher-inline ${className}`}>
      <span className="lang-label">{lang === "ko" ? "언어:" : "Lang:"}</span>
      <button 
        className={`lang-btn ${lang === "ko" ? "active" : ""}`} 
        onClick={() => changeLanguage("ko")}
        aria-label="한국어로 변경"
      >
        KO
      </button>
      <span className="lang-divider">|</span>
      <button 
        className={`lang-btn ${lang === "en" ? "active" : ""}`} 
        onClick={() => changeLanguage("en")}
        aria-label="Change to English"
      >
        EN
      </button>
    </div>
  );
}
