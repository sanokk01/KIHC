import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppLink as Link } from "../../components/AppLink";
import { Footer } from "../../components/Footer";
import { RestrictedDetailGate } from "../../components/RestrictedDetailGate";
import { SiteHeader } from "../../components/SiteHeader";
import { contentRepository } from "../../lib/content";
import { getPartnerAccess } from "../../lib/partner-access";

export const metadata: Metadata = { title: "홍보물 상세" };

export default async function PromotionalMaterialDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [item, access] = await Promise.all([contentRepository.getPromotionalMaterialBySlug(slug), getPartnerAccess()]);
  if (!item) notFound();
  return <><SiteHeader /><main className="partner-detail-main"><article className="container partner-detail-shell"><div className="archive-thumbnail detail-thumbnail"><span>KIHC</span><strong>{item.thumbnailLabel}</strong><i>PREVIEW</i></div><div className="partner-detail-intro"><p className="eyebrow">{item.category}</p><h1>{item.title}</h1><time>{item.publishedAt}</time><p>외부 사용자에게는 자료의 섬네일과 기본 정보만 공개됩니다.</p></div>{access.authorized ? <section className="partner-protected-content"><h2>상세 정보</h2><ul>{item.protectedDetails.map((detail) => <li key={detail}>{detail}</li>)}</ul></section> : <RestrictedDetailGate itemName={item.title} />}<div className="partner-detail-actions"><Link prefetch={false} className="button button-outline" href="/promotional-materials">홍보물 목록으로</Link></div></article></main><Footer /></>;
}
