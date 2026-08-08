"use client";

import { useEffect, useState } from "react";
import { AppLink as Link } from "./AppLink";
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
    [isEn ? "Events" : "강연·학회", "/events"],
  ];

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
          onClick={() => { setOpen((v) => !v); setOpenGroup(null); }}
        >
          <span />
          <span />
        </button>
        <nav className={`main-nav ${open ? "is-open" : ""}`} aria-label={isEn ? "Main Menu" : "주요 메뉴"}>
          <div className="nav-group">
            <Link prefetch={false} href="/about" onClick={closeAll}>{isEn ? "About KIHC" : "KIHC 소개"}</Link>
            <button
              className="nav-group-toggle"
              type="button"
              aria-expanded={openGroup === "about"}
              aria-label={isEn ? "Open About Submenu" : "KIHC 소개 하위 메뉴 열기"}
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
              aria-label={isEn ? "Open News Submenu" : "열린소식 하위 메뉴 열기"}
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
        </nav>
      </div>
    </header>
  );
}

