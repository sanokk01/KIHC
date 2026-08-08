"use client";

import { useState } from "react";
import { AppLink as Link } from "./AppLink";
import { Logo } from "./Logo";

const aboutLinks = [
  ["이사장 소개", "/about#chairman"],
  ["연구회 소개", "/about#institute"],
  ["CI 소개", "/ci"],
  ["설립목적 · 비전", "/about#vision"],
  ["조직도", "/about#organization"],
  ["연구와 핵심가치", "/research-focus"],
];

const newsLinks = [
  ["연구회 소식", "/news"],
  ["연구정책자료", "/research"],
  ["홍보물", "/promotional-materials"],
  ["강연·학회", "/events"],
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);

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
        <nav className={`main-nav ${open ? "is-open" : ""}`} aria-label="주요 메뉴">
          <div className="nav-group">
            <Link prefetch={false} href="/about" onClick={closeAll}>KIHC 소개</Link>
            <button
              className="nav-group-toggle"
              type="button"
              aria-expanded={openGroup === "about"}
              aria-label="KIHC 소개 하위 메뉴 열기"
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
            <Link prefetch={false} href="/news" onClick={closeAll}>열린소식</Link>
            <button
              className="nav-group-toggle"
              type="button"
              aria-expanded={openGroup === "news"}
              aria-label="열린소식 하위 메뉴 열기"
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
          <Link prefetch={false} href="/contact" onClick={closeAll}>문의</Link>
        </nav>
      </div>
    </header>
  );
}
