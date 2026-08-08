"use client";

/* eslint-disable @next/next/no-img-element -- future uploaded media may be served by the app's media route. */

import { useEffect, useState } from "react";
import type { PopupNotice } from "../lib/content";
import { AppLink as Link } from "./AppLink";

function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function safePopupLink(value?: string) {
  if (!value) return undefined;
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

export function NoticePopup({ popup }: { popup: PopupNotice }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hiddenDate = window.localStorage.getItem(`kihc-popup-${popup.id}`);
    const today = localDateKey();
    const frame = window.requestAnimationFrame(() => setVisible(hiddenDate !== today));
    return () => window.cancelAnimationFrame(frame);
  }, [popup.id]);

  useEffect(() => {
    if (!visible) return;
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && setVisible(false);
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [visible]);

  const hideToday = () => {
    window.localStorage.setItem(`kihc-popup-${popup.id}`, localDateKey());
    setVisible(false);
  };

  if (!visible) return null;

  const popupLink = safePopupLink(popup.link);
  const fullImage = Boolean(popup.imageUrl && popup.imageDisplay === "full");
  const poster = popup.imageUrl ? <img className="notice-poster-image" src={popup.imageUrl} alt={popup.title} /> : null;

  return (
    <div className="notice-backdrop" role="dialog" aria-modal="true" aria-labelledby="notice-title" aria-describedby="notice-description">
      <div className={`notice-popup notice-popup-vintage ${fullImage ? "notice-popup-full-image" : ""}`}>
        <div className="notice-titlebar"><strong>공지사항</strong><span>KIHC NOTICE</span></div>
        {fullImage ? <div className="notice-poster">{popupLink ? <Link prefetch={false} href={popupLink} aria-label={`${popup.title} 자세히 보기`}>{poster}</Link> : poster}<h2 className="sr-only" id="notice-title">{popup.title}</h2><p className="sr-only" id="notice-description">{popup.content}</p></div> : <>{popup.imageUrl ? <div className="notice-image"><img src={popup.imageUrl} alt="" /></div> : <div className="notice-visual" aria-hidden="true"><span>KIHC</span><strong>알려드립니다</strong></div>}<div className="notice-content"><p className="notice-date">KIHC 홈페이지 공지</p><h2 id="notice-title">{popup.title}</h2><p id="notice-description">{popup.content}</p>{popupLink ? <Link prefetch={false} className="notice-detail-link" href={popupLink}>자세히 보기 &gt;</Link> : null}</div></>}
        <div className="notice-actions">
          <button type="button" onClick={hideToday}>오늘 하루 보지 않음</button>
          <button type="button" onClick={() => setVisible(false)}>닫기</button>
        </div>
      </div>
    </div>
  );
}
