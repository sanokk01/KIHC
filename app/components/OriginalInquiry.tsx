"use client";

import Link from "next/link";
import { useState } from "react";

export function OriginalInquiry() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="button button-primary" type="button" onClick={() => setOpen(true)}>원문 열람 문의</button>
      {open ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="inquiry-title">
          <div className="modal-panel">
            <button className="modal-close" type="button" onClick={() => setOpen(false)} aria-label="닫기">×</button>
            <p className="eyebrow">Original Text</p>
            <h2 id="inquiry-title">원문 열람 안내</h2>
            <p>해당 연구자료의 원문은 공개 자료가 아닙니다.<br />원문 열람이 필요한 경우 KIHC로 문의해 주세요.</p>
            <div className="modal-actions"><Link className="button button-primary" href="/contact">문의 페이지로 이동</Link><button className="button button-outline" type="button" onClick={() => setOpen(false)}>닫기</button></div>
          </div>
        </div>
      ) : null}
    </>
  );
}
