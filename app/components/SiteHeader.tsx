"use client";

import { useEffect, useState } from "react";
import { AppLink as Link } from "./AppLink";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [lang, setLang] = useState<"ko" | "en">("ko");

  const isEn = lang === "en";

  const aboutLinks = [
    [isEn ? "About Institute" : "연구회 소개", "/about#institute"],
    [isEn ? "Purpose & Vision" : "설립목적 · 비전", "/about#vision"],
    [isEn ? "Chairman" : "이사장 소개", "/about#chairman"],
    [isEn ? "Organization" : "조직도", "/about#organization"],
    [isEn ? "Brand Identity" : "CI 소개", "/ci"],
    [isEn ? "Research & Values" : "연구와 핵심가치", "/research-focus"],
  ];

  const newsLinks = [
    [isEn ? "News" : "연구회 소식", "/news"],
    [isEn ? "Research Materials" : "연구정책자료", "/research"],
    [isEn ? "Promotional Materials" : "홍보물", "/promotional-materials"],
    [isEn ? "Events" : "강연·학회", "/news?category=행사일정"],
  ];

  useEffect(() => {
    const match = document.cookie.match(new RegExp('(^| )kihc-language=([^;]+)'));
    const stored = window.localStorage.getItem("kihc-language");
    const nextLang = match?.[2] === "en" || (!match && (stored === "en" || window.location.search.includes("lang=en"))) ? "en" : "ko";
    const frame = window.requestAnimationFrame(() => setLang(nextLang));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setOpenGroup(null);
      }
    };
    const closeOnDesktop = () => {
      if (window.innerWidth > 900) {
        setOpen(false);
        setOpenGroup(null);
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);
    window.addEventListener("resize", closeOnDesktop);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("resize", closeOnDesktop);
    };
  }, [open]);

  // changeLanguage is no longer needed here since LanguageSwitcher handles it
  const closeAll = () => {
    setOpen(false);
    setOpenGroup(null);
  };

  const toggleGroup = (group: string) => {
    setOpenGroup((prev) => (prev === group ? null : group));
  };

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Logo />
        <button
          className={`menu-toggle ${open ? "is-open" : ""}`}
          type="button"
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={open}
          aria-controls="site-navigation"
          onClick={() => { setOpen((v) => !v); setOpenGroup(null); }}
        >
          <span />
          <span />
        </button>
        <nav id="site-navigation" className={`main-nav ${open ? "is-open" : ""}`} aria-label={isEn ? "Main Menu" : "주요 메뉴"}>
          <div className="nav-group">
            <Link prefetch={false} href="/about" onClick={closeAll}>{isEn ? "About KIHC" : "KIHC 소개"}</Link>
            <button
              className="nav-group-toggle"
              type="button"
              aria-expanded={openGroup === "about"}
              aria-label={openGroup === "about" ? (isEn ? "Close About Submenu" : "KIHC 소개 하위 메뉴 닫기") : (isEn ? "Open About Submenu" : "KIHC 소개 하위 메뉴 열기")}
              onClick={() => toggleGroup("about")}
            >
              ▾
            </button>
            <div className={`dropdown${openGroup === "about" ? " is-open" : ""}`}>
              {aboutLinks.map(([label, href]) => (
                <Link prefetch={false} href={href} key={href} onClick={closeAll}>{label}</Link>
              ))}
            </div>
          </div>
          <div className="nav-group">
            <Link prefetch={false} href="/news" onClick={closeAll}>{isEn ? "News & Updates" : "열린소식"}</Link>
            <button
              className="nav-group-toggle"
              type="button"
              aria-expanded={openGroup === "news"}
              aria-label={openGroup === "news" ? (isEn ? "Close News Submenu" : "열린소식 하위 메뉴 닫기") : (isEn ? "Open News Submenu" : "열린소식 하위 메뉴 열기")}
              onClick={() => toggleGroup("news")}
            >
              ▾
            </button>
            <div className={`dropdown${openGroup === "news" ? " is-open" : ""}`}>
              {newsLinks.map(([label, href]) => (
                <Link prefetch={false} href={href} key={href} onClick={closeAll}>{label}</Link>
              ))}
            </div>
          </div>
          <Link prefetch={false} href="/contact" onClick={closeAll}>{isEn ? "Contact" : "문의"}</Link>
          
          <div className="header-lang-container">
            <LanguageSwitcher />
          </div>
        </nav>
      </div>
    </header>
  );
}

