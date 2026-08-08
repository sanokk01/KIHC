"use client";

/* eslint-disable @next/next/no-img-element -- future upload previews may use same-origin media URLs. */

import { useMemo, useState } from "react";
import type { AdminContentRecord, AdminSection } from "../lib/admin-types";
import { databaseConnected, databasePendingMessage } from "../lib/storage-status";

export type { AdminContentRecord, AdminSection } from "../lib/admin-types";

const emptyBySection: Record<AdminSection, AdminContentRecord> = {
  news: { id: "", slug: "", title: "", publishedAt: "", status: "draft", imageUrl: "", excerpt: "", content: "" },
  research: { id: "", slug: "", title: "", publishedAt: "", status: "draft", imageUrl: "", author: "", summary: "", tableOfContents: "", keywords: "", researchType: "자료집", category1: "", category2: "" },
  popup: { id: "", title: "", active: false, imageUrl: "", imageDisplay: "full", link: "", startsAt: "", endsAt: "", content: "" },
  about: { id: "about", title: "KIHC 소개", chairmanMessage: "", chairmanImageUrl: "", organizationIntroduction: "", organizationImageUrl: "", purpose: "", vision: "" },
  settings: { id: "settings", title: "사이트 설정", siteName: "", footerInformation: "", email: "" },
};

async function responseJson<T>(response: Response): Promise<T> {
  const body = await response.json() as T & { error?: string };
  if (!response.ok) throw new Error(body.error || "요청 처리에 실패했습니다.");
  return body;
}

async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch("/api/admin/upload", { method: "POST", body: formData });
  const result = await responseJson<{ url: string }>(response);
  return result.url;
}

function ImageUploadField({ label, value, onChange, allowUrl = false }: { label: string; value?: string; onChange: (url: string) => void; allowUrl?: boolean }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const choose = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    setError("");
    try { onChange(await uploadImage(file)); }
    catch (uploadError) { setError(uploadError instanceof Error ? uploadError.message : "업로드에 실패했습니다."); }
    finally { setUploading(false); }
  };
  return <label className="wide admin-upload-field"><span>{label}</span>{allowUrl ? <input type="url" value={value ?? ""} onChange={(event) => onChange(event.target.value)} placeholder="/popup.jpg 또는 https://example.com/popup.jpg" aria-label={`${label} 주소`} /> : null}<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => choose(event.target.files?.[0])} disabled={uploading || !databaseConnected} />{uploading && <small>이미지 업로드 중...</small>}{value && <div className="admin-upload-result"><img src={value} alt="업로드 미리보기" /><button type="button" onClick={() => onChange("")}>이미지 제거</button></div>}{error && <small className="error">{error}</small>}<small>{databaseConnected ? "JPG, PNG, WEBP, GIF · 최대 6MB" : (allowUrl ? "DB 연결 전에는 public 이미지 경로나 외부 이미지 주소로 미리보기만 할 수 있습니다." : "외부 파일 저장소 연결 후 사용할 수 있습니다.")}</small></label>;
}

function AdminEditor({ section, value, onChange, onCancel, onSave, saving }: {
  section: AdminSection;
  value: AdminContentRecord;
  onChange: (next: AdminContentRecord) => void;
  onCancel: () => void;
  onSave: () => void;
  saving: boolean;
}) {
  const field = (name: keyof AdminContentRecord, next: string | boolean) => onChange({ ...value, [name]: next });
  return (
    <div className="admin-editor-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onCancel()}>
      <section className="admin-editor" role="dialog" aria-modal="true" aria-labelledby="admin-editor-title">
        <div className="admin-editor-heading"><div><p>CONTENT EDITOR</p><h2 id="admin-editor-title">{value.id ? "콘텐츠 수정" : "새 콘텐츠 등록"}</h2></div><button type="button" onClick={onCancel} aria-label="편집기 닫기">×</button></div>
        <div className="admin-editor-fields">
          <label className="wide"><span>제목</span><input value={value.title} onChange={(event) => field("title", event.target.value)} required /></label>
          {section !== "popup" && <label><span>주소 식별자</span><input value={value.slug ?? ""} onChange={(event) => field("slug", event.target.value)} placeholder="영문-숫자-하이픈" /></label>}
          {section !== "popup" && <label><span>게시일</span><input value={value.publishedAt ?? ""} onChange={(event) => field("publishedAt", event.target.value)} placeholder="2026. 08. 08" /></label>}
          {section !== "popup" && <label><span>공개 상태</span><select value={value.status ?? "draft"} onChange={(event) => field("status", event.target.value)}><option value="published">공개</option><option value="draft">초안</option></select></label>}
          <ImageUploadField label={section === "popup" ? "팝업 이미지" : "대표 이미지"} value={value.imageUrl} onChange={(url) => field("imageUrl", url)} allowUrl={section === "popup"} />
          {section === "news" && <><label className="wide"><span>요약</span><textarea rows={3} value={value.excerpt ?? ""} onChange={(event) => field("excerpt", event.target.value)} /></label><label className="wide"><span>본문</span><textarea rows={8} value={value.content ?? ""} onChange={(event) => field("content", event.target.value)} /></label></>}
          {section === "research" && <><label><span>문서 유형 (뱃지)</span><select value={value.researchType ?? "자료집"} onChange={(event) => field("researchType", event.target.value)}><option value="자료집">자료집</option><option value="브리프">브리프</option><option value="논문">논문</option><option value="단행본">단행본</option><option value="기타">기타</option></select></label><label><span>저자</span><input value={value.author ?? ""} onChange={(event) => field("author", event.target.value)} /></label><label><span>대분류 (Category 1)</span><input value={value.category1 ?? ""} onChange={(event) => field("category1", event.target.value)} placeholder="예: 정책연구" /></label><label><span>중분류 (Category 2)</span><input value={value.category2 ?? ""} onChange={(event) => field("category2", event.target.value)} placeholder="예: 미래전략" /></label><label className="wide"><span>키워드</span><input value={value.keywords ?? ""} onChange={(event) => field("keywords", event.target.value)} placeholder="쉼표로 구분" /></label><label className="wide"><span>목차</span><textarea rows={4} value={value.tableOfContents ?? ""} onChange={(event) => field("tableOfContents", event.target.value)} placeholder="줄바꿈으로 구분" /></label><label className="wide"><span>요약</span><textarea rows={6} value={value.summary ?? ""} onChange={(event) => field("summary", event.target.value)} /></label></>}
          {section === "popup" && <><label><span>이미지 표시 방식</span><select value={value.imageDisplay ?? "full"} onChange={(event) => field("imageDisplay", event.target.value)}><option value="full">이미지 전체 표시</option><option value="banner">상단 이미지 + 공지 내용</option></select><small>전체 표시는 원본 비율을 유지하며 이미지를 자르지 않습니다.</small></label><label className="admin-check"><input type="checkbox" checked={Boolean(value.active)} onChange={(event) => field("active", event.target.checked)} /><span>홈에서 팝업 활성화</span></label><label><span>연결 주소</span><input value={value.link ?? ""} onChange={(event) => field("link", event.target.value)} placeholder="/news/example 또는 https://..." /></label><label><span>노출 시작</span><input type="datetime-local" value={value.startsAt ?? ""} onChange={(event) => field("startsAt", event.target.value)} /></label><label><span>노출 종료</span><input type="datetime-local" value={value.endsAt ?? ""} onChange={(event) => field("endsAt", event.target.value)} /></label><label className="wide"><span>내용</span><textarea rows={7} value={value.content ?? ""} onChange={(event) => field("content", event.target.value)} /></label></>}
        </div>
        <div className="admin-editor-actions"><button type="button" className="secondary" onClick={onCancel}>취소</button><button type="button" onClick={onSave} disabled={!databaseConnected || !value.title.trim() || saving}>{saving ? "저장 중..." : (databaseConnected ? "DB에 저장" : "DB 연결 후 저장 가능")}</button></div>
      </section>
    </div>
  );
}

function AdminSingletonEditor({ section, initialRecords }: { section: "about" | "settings"; initialRecords: AdminContentRecord[] }) {
  const [record, setRecord] = useState(initialRecords[0] ?? emptyBySection[section]);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const field = (name: keyof AdminContentRecord, next: string) => setRecord((current) => ({ ...current, [name]: next }));
  const save = async () => {
    setSaving(true); setMessage("");
    try {
      const response = await fetch(`/api/admin/singletons/${section}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(record) });
      const result = await responseJson<{ record: AdminContentRecord }>(response);
      setRecord(result.record);
      setMessage("외부 데이터베이스에 저장되어 공개 홈페이지에 반영됩니다.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "저장하지 못했습니다."); }
    finally { setSaving(false); }
  };
  return <section className="admin-card admin-form-card"><div className="admin-storage-note"><strong>외부 DB 연결 대기</strong><span>{databasePendingMessage}</span></div><div className="admin-settings-form">{section === "about" ? <><ImageUploadField label="이사장 사진" value={record.chairmanImageUrl} onChange={(url) => field("chairmanImageUrl", url)} /><label><span>이사장 인사말</span><textarea rows={7} value={record.chairmanMessage ?? ""} onChange={(event) => field("chairmanMessage", event.target.value)} /></label><label><span>연구회 소개</span><textarea rows={7} value={record.organizationIntroduction ?? ""} onChange={(event) => field("organizationIntroduction", event.target.value)} /></label><ImageUploadField label="조직도 이미지" value={record.organizationImageUrl} onChange={(url) => field("organizationImageUrl", url)} /><label><span>설립 목적</span><textarea rows={4} value={record.purpose ?? ""} onChange={(event) => field("purpose", event.target.value)} /></label><label><span>비전</span><textarea rows={4} value={record.vision ?? ""} onChange={(event) => field("vision", event.target.value)} /></label></> : <><label><span>사이트명</span><input value={record.siteName ?? ""} onChange={(event) => field("siteName", event.target.value)} /></label><label><span>대표 이메일</span><input type="email" value={record.email ?? ""} onChange={(event) => field("email", event.target.value)} /></label><label className="wide"><span>Footer 기관 정보</span><textarea rows={5} value={record.footerInformation ?? ""} onChange={(event) => field("footerInformation", event.target.value)} /></label></>}</div><div className="admin-form-actions">{message && <p role="status">{message}</p>}<button type="button" onClick={save} disabled={!databaseConnected || saving}>{saving ? "저장 중..." : (databaseConnected ? "변경사항 저장" : "DB 연결 후 저장 가능")}</button></div></section>;
}

export function AdminContentManager({ section, initialRecords }: { section: AdminSection; initialRecords: AdminContentRecord[] }) {
  const [records, setRecords] = useState(initialRecords);
  const [query, setQuery] = useState("");
  const [editor, setEditor] = useState<AdminContentRecord | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const visibleRecords = useMemo(() => records.filter((record) => record.title.toLowerCase().includes(query.trim().toLowerCase())), [query, records]);
  if (section === "about" || section === "settings") return <AdminSingletonEditor section={section} initialRecords={initialRecords} />;

  const saveEditor = async () => {
    if (!editor?.title.trim()) return;
    setSaving(true); setMessage("");
    try {
      const response = await fetch(`/api/admin/content/${section}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editor) });
      const result = await responseJson<{ record: AdminContentRecord }>(response);
      setRecords((current) => editor.id ? current.map((item) => item.id === editor.id ? result.record : item) : [result.record, ...current]);
      setEditor(null);
      setMessage("외부 데이터베이스에 저장되어 공동 관리자와 공개 홈페이지에 반영됩니다.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "저장하지 못했습니다."); }
    finally { setSaving(false); }
  };
  const removeRecord = async (id: string) => {
    setSaving(true); setMessage("");
    try {
      const response = await fetch(`/api/admin/content/${section}/${encodeURIComponent(id)}`, { method: "DELETE" });
      await responseJson<{ ok: boolean }>(response);
      setRecords((current) => current.filter((record) => record.id !== id));
      setDeleteId(null);
      setMessage("DB에서 삭제되어 공개 홈페이지에도 반영됩니다.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "삭제하지 못했습니다."); }
    finally { setSaving(false); }
  };

  return <><section className="admin-card"><div className="admin-storage-note"><strong>외부 DB 연결 대기</strong><span>{databasePendingMessage}</span></div><div className="admin-toolbar"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="제목 검색" aria-label="제목 검색" /><button type="button" onClick={() => setEditor({ ...emptyBySection[section] })}>+ 새 콘텐츠</button></div>{message && <p className="admin-result-message" role="status">{message}</p>}<div className="admin-table"><div className="admin-table-row management head"><span>번호</span><span>제목</span><span>{section === "popup" ? "노출 기간" : "작성일"}</span><span>상태</span><span>관리</span></div>{visibleRecords.map((record, index) => <div className="admin-table-row management" key={record.id}><span>{visibleRecords.length - index}</span><strong>{record.title}</strong><time>{section === "popup" ? (record.startsAt || "상시") : (record.publishedAt || "미정")}</time><em className={(record.status === "draft" || (section === "popup" && !record.active)) ? "is-draft" : ""}>{section === "popup" ? (record.active ? "활성" : "비활성") : (record.status === "published" ? "공개" : "초안")}</em><span className="admin-row-actions"><button type="button" onClick={() => setEditor({ ...record })}>수정</button>{deleteId === record.id ? <><button type="button" className="danger" onClick={() => removeRecord(record.id)} disabled={!databaseConnected || saving}>확인</button><button type="button" onClick={() => setDeleteId(null)}>취소</button></> : <button type="button" onClick={() => setDeleteId(record.id)} disabled={!databaseConnected}>삭제</button>}</span></div>)}{!visibleRecords.length && <div className="admin-empty">조건에 맞는 콘텐츠가 없습니다.</div>}</div></section>{editor && <AdminEditor section={section} value={editor} onChange={setEditor} onCancel={() => setEditor(null)} onSave={saveEditor} saving={saving} />}</>;
}
