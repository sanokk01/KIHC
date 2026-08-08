import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppLink as Link } from "../../components/AppLink";
import { Footer } from "../../components/Footer";
import { RestrictedDetailGate } from "../../components/RestrictedDetailGate";
import { SiteHeader } from "../../components/SiteHeader";
import { contentRepository } from "../../lib/content";
import { getPartnerAccess } from "../../lib/partner-access";

export const metadata: Metadata = { title: "강연·학회 상세" };

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [item, access] = await Promise.all([contentRepository.getEventBySlug(slug), getPartnerAccess()]);
  if (!item) notFound();
  return <><SiteHeader /><main className="partner-detail-main"><article className="container partner-detail-shell"><div className="archive-thumbnail detail-thumbnail event-detail-thumbnail"><span>{item.eventType}</span><strong>{item.thumbnailLabel}</strong><i>EVENT PREVIEW</i></div><div className="partner-detail-intro"><p className="eyebrow">Lectures & Academic Events</p><h1>{item.title}</h1><time>{item.heldAt} · {item.eventType}</time><p>외부 사용자에게는 행사 섬네일과 기본 정보만 공개됩니다.</p></div>{access.authorized ? <section className="partner-protected-content"><h2>행사 상세 정보</h2><ul>{item.protectedDetails.map((detail) => <li key={detail}>{detail}</li>)}</ul></section> : <RestrictedDetailGate itemName={item.title} description="행사 프로그램, 발표 내용과 기록 자료는 협력 기업 전용으로 제공합니다." />}<div className="partner-detail-actions"><Link prefetch={false} className="button button-outline" href="/events">강연·학회 목록으로</Link></div></article></main><Footer /></>;
}
