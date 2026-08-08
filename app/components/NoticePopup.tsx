"use client";

/* eslint-disable @next/next/no-img-element -- future uploaded media may be served by the app's media route. */

import { useEffect, useState } from "react";
import type { PopupNotice } from "../lib/content";
import { AppLink as Link } from "./AppLink";

export function NoticePopup({ popup }: { popup: PopupNotice }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hiddenDate = window.localStorage.getItem(`kihc-popup-${popup.id}`);
    const today = new Date().toISOString().slice(0, 10);
    const frame = window.requestAnimationFrame(() => setVisible(hiddenDate !== today));
    return () => window.cancelAnimationFrame(frame);
  }, [popup.id]);

  const hideToday = () => {
    window.localStorage.setItem(`kihc-popup-${popup.id}`, new Date().toISOString().slice(0, 10));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="notice-backdrop" role="dialog" aria-modal="true" aria-labelledby="notice-title">
      <div className="notice-popup">
        {popup.imageUrl ? <div className="notice-image"><img src={popup.imageUrl} alt="" /></div> : <div className="notice-visual" aria-hidden="true"><span>KIHC NOTICE</span></div>}
        <div className="notice-content">
          <p className="eyebrow">Notice</p>
          <h2 id="notice-title">{popup.title}</h2>
          <p>{popup.content}</p>
          {popup.link ? <Link prefetch={false} className="text-link" href={popup.link}>자세히 보기 →</Link> : null}
        </div>
        <div className="notice-actions">
          <button type="button" onClick={hideToday}>오늘 하루 보지 않음</button>
          <button type="button" onClick={() => setVisible(false)}>닫기</button>
        </div>
      </div>
    </div>
  );
}
