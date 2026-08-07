"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "./Logo";

const aboutLinks = [
  ["이사장 소개", "/about#chairman"],
  ["연구회 소개", "/about#institute"],
  ["설립목적 · 비전", "/about#vision"],
  ["조직도", "/about#organization"],
];

const newsLinks = [
  ["연구회 소식", "/news"],
  ["연구정책자료", "/research"],
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
          aria-label="메뉴 열기"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
        </button>
        <nav className={`main-nav ${open ? "is-open" : ""}`} aria-label="주요 메뉴">
          <div className="nav-group">
            <Link href="/about" onClick={() => setOpen(false)}>KIHC 소개</Link>
            <div className="dropdown">
              {aboutLinks.map(([label, href]) => (
                <Link href={href} key={href} onClick={() => setOpen(false)}>{label}</Link>
              ))}
            </div>
          </div>
          <div className="nav-group">
            <Link href="/news" onClick={() => setOpen(false)}>열린소식</Link>
            <div className="dropdown">
              {newsLinks.map(([label, href]) => (
                <Link href={href} key={href} onClick={() => setOpen(false)}>{label}</Link>
              ))}
            </div>
          </div>
          <Link href="/contact" onClick={() => setOpen(false)}>문의</Link>
        </nav>
      </div>
    </header>
  );
}
