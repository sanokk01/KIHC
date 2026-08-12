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
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && setVisible(false);
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
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
      <div className={`notice-popup-modal ${fullImage ? "notice-popup-full" : ""}`}>
        <div className="notice-modal-header">
          <div className="modal-header-brand">
            <span className="brand-dot" />
            <strong>KIHC 공지사항</strong>
          </div>
          <button type="button" className="modal-close-icon" onClick={() => setVisible(false)} aria-label="닫기">
            ✕
          </button>
        </div>

        <div className="notice-modal-body">
          {fullImage ? (
            <div className="notice-poster-box">
              {popupLink ? <Link prefetch={false} href={popupLink}>{poster}</Link> : poster}
              <h2 className="sr-only" id="notice-title">{popup.title}</h2>
              <p className="sr-only" id="notice-description">{popup.content}</p>
            </div>
          ) : (
            <div className="notice-standard-box">
              {popup.imageUrl ? (
                <div className="notice-thumb-box">
                  <img src={popup.imageUrl} alt="" />
                </div>
              ) : null}
              <div className="notice-text-content">
                <span className="notice-tag">ANNOUNCEMENT</span>
                <h2 id="notice-title">{popup.title}</h2>
                <p id="notice-description">{popup.content}</p>
                {popupLink ? (
                  <Link prefetch={false} className="notice-action-btn" href={popupLink}>
                    상세 내용 확인하기 →
                  </Link>
                ) : null}
              </div>
            </div>
          )}
        </div>

        <div className="notice-modal-footer">
          <button type="button" className="btn-hide-today" onClick={hideToday}>
            오늘 하루 보지 않기
          </button>
          <button type="button" className="btn-close-modal" onClick={() => setVisible(false)}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
