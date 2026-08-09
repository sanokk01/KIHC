import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminContentManager, type AdminContentRecord, type AdminSection } from "../../components/AdminContentManager";
import { AdminShell } from "../../components/AdminShell";
import { getAdminRecords, getAdminSingleton } from "../../lib/admin-data";
import { requireAdminUser } from "../../lib/admin-auth";

export const metadata: Metadata = { title: "콘텐츠 관리" };

const sectionInfo: Record<AdminSection, { label: string; eyebrow: string; description: string }> = {
  news: { label: "연구회 소식", eyebrow: "NEWS MANAGEMENT", description: "연구회 공지와 소식을 등록하고 공개 상태를 관리합니다." },
  research: { label: "연구정책자료", eyebrow: "RESEARCH MANAGEMENT", description: "PDF 없이 연구자료의 기본 정보, 목차, 요약과 공개 상태를 관리합니다." },
  events: { label: "행사 일정", eyebrow: "EVENTS MANAGEMENT", description: "세미나, 간담회 등 달력에 표시될 행사 일정을 관리합니다." },
  popup: { label: "팝업 관리", eyebrow: "POPUP MANAGEMENT", description: "홈에 노출할 공지 팝업의 내용, 링크와 기간을 관리합니다." },
  about: { label: "KIHC 소개 관리", eyebrow: "ABOUT MANAGEMENT", description: "이사장 인사말, 연구회 소개, 설립 목적과 비전을 관리합니다." },
  institute: { label: "연구소 통합 안내 (신규)", eyebrow: "INSTITUTE OVERVIEW", description: "연구소의 핵심 성과, 연혁, 전문가 명단 및 연차보고서를 누적 관리합니다." },
  settings: { label: "사이트 설정", eyebrow: "SITE SETTINGS", description: "사이트명과 추천 키워드, Footer 기본 정보를 관리합니다." },
};

async function recordsFor(section: AdminSection): Promise<AdminContentRecord[]> {
  if (section === "news" || section === "research" || section === "events" || section === "popup") return getAdminRecords(section);
  return [await getAdminSingleton(section)];
}

export default async function AdminSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section: rawSection } = await params;
  if (!(rawSection in sectionInfo)) notFound();
  const section = rawSection as AdminSection;
  await requireAdminUser(`/adminpage1/${section}`);
  const info = sectionInfo[section];
  return (
    <AdminShell active={info.label}>
      <div className="admin-title"><div><p>{info.eyebrow}</p><h1>{info.label}</h1><span>{info.description}</span></div></div>
      <AdminContentManager section={section} initialRecords={await recordsFor(section)} />
    </AdminShell>
  );
}
