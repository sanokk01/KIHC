/* eslint-disable @next/next/no-img-element -- future material thumbnails may be served by the media route. */
import type { Metadata } from "next";
import { AppLink as Link } from "../components/AppLink";
import { Footer } from "../components/Footer";
import { PageHero } from "../components/PageHero";
import { SiteHeader } from "../components/SiteHeader";
import { contentRepository } from "../lib/content";

export const metadata: Metadata = { title: "홍보물" };

export default async function PromotionalMaterialsPage() {
  const materials = await contentRepository.listPromotionalMaterials();
  return <><SiteHeader /><main><PageHero eyebrow="Promotional Materials" title="홍보물" description="KIHC의 기관 소개와 연구 활동을 담은 홍보물 미리보기를 확인할 수 있습니다." /><section className="section archive-section"><div className="container"><div className="listing-heading"><p>전체 <strong>{materials.length}</strong>건</p><span>상세 정보와 원본 자료는 협력 기업 전용입니다.</span></div><div className="archive-grid">{materials.map((item, index) => <Link prefetch={false} className="archive-card" href={`/promotional-materials/${item.slug}`} key={item.id}><div className={`archive-thumbnail promotion-${index + 1}`}>{item.imageUrl ? <img src={item.imageUrl} alt="" /> : <><span>KIHC</span><strong>{item.thumbnailLabel}</strong><i>{String(index + 1).padStart(2, "0")}</i></>}</div><div className="archive-card-copy"><p>{item.category} · {item.publishedAt}</p><h2>{item.title}</h2><span>미리보기 및 열람 안내 →</span></div></Link>)}</div></div></section></main><Footer /></>;
}
