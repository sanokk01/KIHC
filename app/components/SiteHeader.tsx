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

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Logo />
        <button
          className={`menu-toggle ${open ? "is-open" : ""}`}
          type="button"
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
        </button>
        <nav className={`main-nav ${open ? "is-open" : ""}`} aria-label="주요 메뉴">
          <div className="nav-group">
            <Link prefetch={false} href="/about" onClick={() => setOpen(false)}>KIHC 소개</Link>
            <div className="dropdown">
              {aboutLinks.map(([label, href]) => (
                <Link prefetch={false} href={href} key={href} onClick={() => setOpen(false)}>{label}</Link>
              ))}
            </div>
          </div>
          <div className="nav-group">
            <Link prefetch={false} href="/news" onClick={() => setOpen(false)}>열린소식</Link>
            <div className="dropdown">
              {newsLinks.map(([label, href]) => (
                <Link prefetch={false} href={href} key={href} onClick={() => setOpen(false)}>{label}</Link>
              ))}
            </div>
          </div>
          <Link prefetch={false} href="/contact" onClick={() => setOpen(false)}>문의</Link>
        </nav>
      </div>
    </header>
  );
}
