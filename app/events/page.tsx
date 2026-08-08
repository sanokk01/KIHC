/* eslint-disable @next/next/no-img-element -- future event thumbnails may be served by the media route. */
import type { Metadata } from "next";
import { AppLink as Link } from "../components/AppLink";
import { Footer } from "../components/Footer";
import { PageHero } from "../components/PageHero";
import { SiteHeader } from "../components/SiteHeader";
import { contentRepository } from "../lib/content";

export const metadata: Metadata = { title: "강연·학회" };

export default async function EventsPage() {
  const events = await contentRepository.listEvents();
  return <><SiteHeader /><main><PageHero eyebrow="Lectures & Academic Events" title="강연·학회" description="KIHC가 개최한 강연, 세미나와 연구 교류 행사의 미리보기를 제공합니다." /><section className="section archive-section event-archive-section"><div className="container"><div className="listing-heading"><p>전체 <strong>{events.length}</strong>건</p><span>행사 상세 기록은 협력 기업 전용입니다.</span></div><div className="event-list">{events.map((item, index) => <Link prefetch={false} href={`/events/${item.slug}`} key={item.id}><div className={`event-thumbnail event-${index + 1}`}>{item.imageUrl ? <img src={item.imageUrl} alt="" /> : <><span>{item.eventType}</span><strong>{item.thumbnailLabel}</strong></>}</div><div><p>{item.eventType}</p><h2>{item.title}</h2><time>{item.heldAt}</time></div><i aria-hidden="true">→</i></Link>)}</div></div></section></main><Footer /></>;
}
