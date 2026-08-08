"use client";

import { useEffect, useState } from "react";
import { AppLink as Link } from "./AppLink";

export function RestrictedContentInquiry({ itemName, label = "상세자료 열람 문의" }: { itemName: string; label?: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return (
    <>
      <button className="button button-primary" type="button" onClick={() => setOpen(true)}>{label}</button>
      {open ? <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="restricted-title"><div className="modal-panel"><button className="modal-close" type="button" onClick={() => setOpen(false)} aria-label="닫기">×</button><p className="eyebrow">Partner Access</p><h2 id="restricted-title">협력 기업 전용 자료 안내</h2><p><strong>{itemName}</strong>의 상세 정보는 KIHC와 협력 관계가 확인된 기업에만 제공됩니다.<br />열람 권한 확인이 필요한 경우 문의를 남겨 주세요.</p><div className="modal-actions"><Link prefetch={false} className="button button-primary" href="/contact">문의 페이지로 이동</Link><button className="button button-outline" type="button" onClick={() => setOpen(false)}>닫기</button></div></div></div> : null}
    </>
  );
}
