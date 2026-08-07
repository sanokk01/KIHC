import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminContentManager, type AdminContentRecord, type AdminSection } from "../../components/AdminContentManager";
import { AdminShell } from "../../components/AdminShell";
import { contentRepository } from "../../lib/content";

export const metadata: Metadata = { title: "콘텐츠 관리" };

const sectionInfo: Record<AdminSection, { label: string; eyebrow: string; description: string }> = {
  news: { label: "연구회 소식", eyebrow: "NEWS MANAGEMENT", description: "연구회 공지와 소식을 등록하고 공개 상태를 관리합니다." },
  research: { label: "연구정책자료", eyebrow: "RESEARCH MANAGEMENT", description: "PDF 없이 연구자료의 기본 정보, 목차, 요약과 공개 상태를 관리합니다." },
  popup: { label: "팝업 관리", eyebrow: "POPUP MANAGEMENT", description: "홈에 노출할 공지 팝업의 내용, 링크와 기간을 관리합니다." },
  about: { label: "KIHC 소개 관리", eyebrow: "ABOUT MANAGEMENT", description: "이사장 인사말, 연구회 소개, 설립 목적과 비전을 관리합니다." },
  settings: { label: "사이트 설정", eyebrow: "SITE SETTINGS", description: "사이트명과 Footer 기본 정보를 관리합니다." },
};

function recordsFor(section: AdminSection): AdminContentRecord[] {
  if (section === "news") return contentRepository.listNews().map((item) => ({ id: item.id, title: item.title, publishedAt: item.publishedAt, status: item.status, excerpt: item.excerpt, content: item.content.join("\n\n") }));
  if (section === "research") return contentRepository.listResearch().map((item) => ({ id: item.id, title: item.title, publishedAt: item.publishedAt, status: item.status, author: item.author, summary: item.summary, tableOfContents: item.tableOfContents.join("\n"), keywords: item.keywords.join(", ") }));
  if (section === "popup") {
    const popup = contentRepository.getActivePopup();
    return popup ? [{ id: popup.id, title: popup.title, content: popup.content, link: popup.link, active: popup.active, startsAt: popup.startsAt, endsAt: popup.endsAt }] : [];
  }
  if (section === "about") {
    const about = contentRepository.getAbout();
    return [{ id: "about", title: "KIHC 소개", chairmanMessage: about.chairmanMessage.join("\n\n"), organizationIntroduction: about.organizationIntroduction.join("\n\n"), purpose: about.purpose, vision: about.vision }];
  }
  const settings = contentRepository.getSettings();
  return [{ id: "settings", title: "사이트 설정", siteName: settings.siteName, footerInformation: settings.footerInformation, email: settings.email }];
}

export default async function AdminSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section: rawSection } = await params;
  if (!(rawSection in sectionInfo)) notFound();
  const section = rawSection as AdminSection;
  const info = sectionInfo[section];
  return (
    <AdminShell active={info.label}>
      <div className="admin-title"><div><p>{info.eyebrow}</p><h1>{info.label}</h1><span>{info.description}</span></div></div>
      <AdminContentManager section={section} initialRecords={recordsFor(section)} />
    </AdminShell>
  );
}
