"use client";

import { useEffect, useMemo, useState } from "react";

export type AdminSection = "news" | "research" | "popup" | "about" | "settings";

export interface AdminContentRecord {
  id: string;
  title: string;
  publishedAt?: string;
  status?: "published" | "draft";
  excerpt?: string;
  content?: string;
  author?: string;
  summary?: string;
  tableOfContents?: string;
  keywords?: string;
  link?: string;
  active?: boolean;
  startsAt?: string;
  endsAt?: string;
  chairmanMessage?: string;
  organizationIntroduction?: string;
  purpose?: string;
  vision?: string;
  siteName?: string;
  footerInformation?: string;
  email?: string;
}

const storagePrefix = "kihc-admin-preview-v1";

const emptyBySection: Record<AdminSection, AdminContentRecord> = {
  news: { id: "", title: "", publishedAt: "", status: "draft", excerpt: "", content: "" },
  research: { id: "", title: "", publishedAt: "", status: "draft", author: "", summary: "", tableOfContents: "", keywords: "" },
  popup: { id: "", title: "", active: false, link: "", startsAt: "", endsAt: "", content: "" },
  about: { id: "about", title: "KIHC 소개", chairmanMessage: "", organizationIntroduction: "", purpose: "", vision: "" },
  settings: { id: "settings", title: "사이트 설정", siteName: "", footerInformation: "", email: "" },
};

function readStored(section: AdminSection, fallback: AdminContentRecord[]) {
  try {
    const stored = window.localStorage.getItem(`${storagePrefix}:${section}`);
    return stored ? (JSON.parse(stored) as AdminContentRecord[]) : fallback;
  } catch {
    return fallback;
  }
}

function writeStored(section: AdminSection, records: AdminContentRecord[]) {
  window.localStorage.setItem(`${storagePrefix}:${section}`, JSON.stringify(records));
}

function AdminEditor({ section, value, onChange, onCancel, onSave }: {
  section: AdminSection;
  value: AdminContentRecord;
  onChange: (next: AdminContentRecord) => void;
  onCancel: () => void;
  onSave: () => void;
}) {
  const field = (name: keyof AdminContentRecord, next: string | boolean) => onChange({ ...value, [name]: next });
  return (
    <div className="admin-editor-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onCancel()}>
      <section className="admin-editor" role="dialog" aria-modal="true" aria-labelledby="admin-editor-title">
        <div className="admin-editor-heading">
          <div><p>CONTENT EDITOR</p><h2 id="admin-editor-title">{value.id ? "콘텐츠 수정" : "새 콘텐츠 등록"}</h2></div>
          <button type="button" onClick={onCancel} aria-label="편집기 닫기">×</button>
        </div>
        <div className="admin-editor-fields">
          <label className="wide"><span>제목</span><input value={value.title} onChange={(event) => field("title", event.target.value)} required /></label>
          {section !== "popup" && <label><span>게시일</span><input value={value.publishedAt ?? ""} onChange={(event) => field("publishedAt", event.target.value)} placeholder="2026. 08. 08" /></label>}
          {section !== "popup" && <label><span>공개 상태</span><select value={value.status ?? "draft"} onChange={(event) => field("status", event.target.value)}><option value="published">공개</option><option value="draft">초안</option></select></label>}
          {section === "news" && <><label className="wide"><span>요약</span><textarea rows={3} value={value.excerpt ?? ""} onChange={(event) => field("excerpt", event.target.value)} /></label><label className="wide"><span>본문</span><textarea rows={8} value={value.content ?? ""} onChange={(event) => field("content", event.target.value)} /></label></>}
          {section === "research" && <><label><span>저자</span><input value={value.author ?? ""} onChange={(event) => field("author", event.target.value)} /></label><label><span>키워드</span><input value={value.keywords ?? ""} onChange={(event) => field("keywords", event.target.value)} placeholder="쉼표로 구분" /></label><label className="wide"><span>목차</span><textarea rows={4} value={value.tableOfContents ?? ""} onChange={(event) => field("tableOfContents", event.target.value)} placeholder="줄바꿈으로 구분" /></label><label className="wide"><span>요약</span><textarea rows={6} value={value.summary ?? ""} onChange={(event) => field("summary", event.target.value)} /></label></>}
          {section === "popup" && <><label className="admin-check"><input type="checkbox" checked={Boolean(value.active)} onChange={(event) => field("active", event.target.checked)} /><span>홈에서 팝업 활성화</span></label><label><span>연결 주소</span><input value={value.link ?? ""} onChange={(event) => field("link", event.target.value)} placeholder="/news/example" /></label><label><span>노출 시작</span><input type="datetime-local" value={value.startsAt ?? ""} onChange={(event) => field("startsAt", event.target.value)} /></label><label><span>노출 종료</span><input type="datetime-local" value={value.endsAt ?? ""} onChange={(event) => field("endsAt", event.target.value)} /></label><label className="wide"><span>내용</span><textarea rows={7} value={value.content ?? ""} onChange={(event) => field("content", event.target.value)} /></label></>}
        </div>
        <div className="admin-editor-actions"><button type="button" className="secondary" onClick={onCancel}>취소</button><button type="button" onClick={onSave} disabled={!value.title.trim()}>저장</button></div>
      </section>
    </div>
  );
}

function AdminSingletonEditor({ section, initialRecords }: { section: "about" | "settings"; initialRecords: AdminContentRecord[] }) {
  const [record, setRecord] = useState(initialRecords[0] ?? emptyBySection[section]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setRecord(readStored(section, initialRecords)[0] ?? emptyBySection[section]));
    return () => window.cancelAnimationFrame(frame);
  }, [initialRecords, section]);

  const field = (name: keyof AdminContentRecord, next: string) => setRecord((current) => ({ ...current, [name]: next }));
  const save = () => {
    writeStored(section, [record]);
    setMessage("현재 브라우저의 관리자 미리보기 저장소에 저장했습니다.");
  };

  return (
    <section className="admin-card admin-form-card">
      <div className="admin-storage-note"><strong>로컬 미리보기 저장</strong><span>서버 DB와 공개 홈페이지에는 아직 반영되지 않습니다.</span></div>
      <div className="admin-settings-form">
        {section === "about" ? <>
          <label><span>이사장 인사말</span><textarea rows={7} value={record.chairmanMessage ?? ""} onChange={(event) => field("chairmanMessage", event.target.value)} /></label>
          <label><span>연구회 소개</span><textarea rows={7} value={record.organizationIntroduction ?? ""} onChange={(event) => field("organizationIntroduction", event.target.value)} /></label>
          <label><span>설립 목적</span><textarea rows={4} value={record.purpose ?? ""} onChange={(event) => field("purpose", event.target.value)} /></label>
          <label><span>비전</span><textarea rows={4} value={record.vision ?? ""} onChange={(event) => field("vision", event.target.value)} /></label>
        </> : <>
          <label><span>사이트명</span><input value={record.siteName ?? ""} onChange={(event) => field("siteName", event.target.value)} /></label>
          <label><span>대표 이메일</span><input type="email" value={record.email ?? ""} onChange={(event) => field("email", event.target.value)} /></label>
          <label className="wide"><span>Footer 기관 정보</span><textarea rows={5} value={record.footerInformation ?? ""} onChange={(event) => field("footerInformation", event.target.value)} /></label>
        </>}
      </div>
      <div className="admin-form-actions">{message && <p role="status">{message}</p>}<button type="button" onClick={save}>변경사항 저장</button></div>
    </section>
  );
}

export function AdminContentManager({ section, initialRecords }: { section: AdminSection; initialRecords: AdminContentRecord[] }) {
  const [records, setRecords] = useState(initialRecords);
  const [query, setQuery] = useState("");
  const [editor, setEditor] = useState<AdminContentRecord | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setRecords(readStored(section, initialRecords)));
    return () => window.cancelAnimationFrame(frame);
  }, [initialRecords, section]);

  const visibleRecords = useMemo(() => records.filter((record) => record.title.toLowerCase().includes(query.trim().toLowerCase())), [query, records]);
  if (section === "about" || section === "settings") return <AdminSingletonEditor section={section} initialRecords={initialRecords} />;

  const saveEditor = () => {
    if (!editor || !editor.title.trim()) return;
    const now = Date.now().toString();
    const nextRecord = { ...editor, id: editor.id || `${section}-${now}` };
    const next = editor.id ? records.map((record) => record.id === editor.id ? nextRecord : record) : [nextRecord, ...records];
    setRecords(next);
    writeStored(section, next);
    setEditor(null);
    setMessage("저장했습니다. 이 변경은 현재 브라우저의 관리자 미리보기에만 유지됩니다.");
  };

  const removeRecord = (id: string) => {
    const next = records.filter((record) => record.id !== id);
    setRecords(next);
    writeStored(section, next);
    setDeleteId(null);
    setMessage("삭제했습니다. 공개 홈페이지 데이터에는 영향을 주지 않습니다.");
  };

  return <>
    <section className="admin-card">
      <div className="admin-storage-note"><strong>로컬 미리보기 저장</strong><span>등록·수정·삭제는 동작하지만 서버 DB와 공개 홈페이지에는 아직 반영되지 않습니다.</span></div>
      <div className="admin-toolbar"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="제목 검색" aria-label="제목 검색" /><button type="button" onClick={() => setEditor({ ...emptyBySection[section] })}>+ 새 콘텐츠</button></div>
      {message && <p className="admin-result-message" role="status">{message}</p>}
      <div className="admin-table">
        <div className="admin-table-row management head"><span>번호</span><span>제목</span><span>{section === "popup" ? "노출 기간" : "작성일"}</span><span>상태</span><span>관리</span></div>
        {visibleRecords.map((record, index) => <div className="admin-table-row management" key={record.id}><span>{visibleRecords.length - index}</span><strong>{record.title}</strong><time>{section === "popup" ? (record.startsAt || "상시") : (record.publishedAt || "미정")}</time><em className={(record.status === "draft" || (section === "popup" && !record.active)) ? "is-draft" : ""}>{section === "popup" ? (record.active ? "활성" : "비활성") : (record.status === "published" ? "공개" : "초안")}</em><span className="admin-row-actions"><button type="button" onClick={() => setEditor({ ...record })}>수정</button>{deleteId === record.id ? <><button type="button" className="danger" onClick={() => removeRecord(record.id)}>확인</button><button type="button" onClick={() => setDeleteId(null)}>취소</button></> : <button type="button" onClick={() => setDeleteId(record.id)}>삭제</button>}</span></div>)}
        {!visibleRecords.length && <div className="admin-empty">조건에 맞는 콘텐츠가 없습니다.</div>}
      </div>
    </section>
    {editor && <AdminEditor section={section} value={editor} onChange={setEditor} onCancel={() => setEditor(null)} onSave={saveEditor} />}
  </>;
}
