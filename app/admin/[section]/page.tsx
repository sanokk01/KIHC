import type { Metadata } from "next";
import { AdminShell } from "../../components/AdminShell";
import { contentRepository } from "../../lib/content";

export const metadata: Metadata = { title: "콘텐츠 관리" };

const sectionInfo: Record<string, { label: string; eyebrow: string; description: string }> = {
  news: { label: "연구회 소식", eyebrow: "NEWS MANAGEMENT", description: "연구회 공지와 소식의 목록·작성 화면이 연결될 영역입니다." },
  research: { label: "연구정책자료", eyebrow: "RESEARCH MANAGEMENT", description: "연구자료의 기본 정보와 공개 상태를 관리할 영역입니다." },
  popup: { label: "팝업 관리", eyebrow: "POPUP MANAGEMENT", description: "홈에 노출할 공지 팝업과 기간을 관리할 영역입니다." },
  about: { label: "KIHC 소개 관리", eyebrow: "ABOUT MANAGEMENT", description: "이사장 소개, 연구회 소개, 비전과 조직도 이미지를 관리할 영역입니다." },
  settings: { label: "사이트 설정", eyebrow: "SITE SETTINGS", description: "사이트명과 Footer 기본 정보를 관리할 영역입니다." },
};

export default async function AdminSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const info = sectionInfo[section] ?? sectionInfo.news;
  const rows = section === "research" ? contentRepository.listResearch() : section === "news" ? contentRepository.listNews() : [];
  return (
    <AdminShell active={info.label}>
      <div className="admin-title"><div><p>{info.eyebrow}</p><h1>{info.label}</h1><span>{info.description}</span></div><button type="button">+ 새 콘텐츠</button></div>
      {rows.length ? (
        <section className="admin-card"><div className="admin-toolbar"><input placeholder="제목 검색" aria-label="제목 검색" /><button type="button">검색</button></div><div className="admin-table"><div className="admin-table-row management head"><span>번호</span><span>제목</span><span>작성일</span><span>상태</span><span>관리</span></div>{rows.map((item, index) => <div className="admin-table-row management" key={item.id}><span>{rows.length - index}</span><strong>{item.title}</strong><time>{item.publishedAt}</time><em>공개</em><span><button type="button">수정</button><button type="button">삭제</button></span></div>)}</div></section>
      ) : (
        <section className="admin-card admin-placeholder"><div className="placeholder-icon">{info.label.charAt(0)}</div><h2>{info.label} 화면 골격</h2><p>세부 입력 필드와 저장 기능은 다음 구현 단계에서 추가합니다.</p><div className="placeholder-fields"><span>목록 영역</span><span>작성·수정 영역</span><span>공개 상태</span></div></section>
      )}
    </AdminShell>
  );
}
