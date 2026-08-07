/* eslint-disable @next/next/no-img-element -- R2 media is served by the app's immutable media route. */
import type { Metadata } from "next";
import { AppLink as Link } from "../../components/AppLink";
import { Footer } from "../../components/Footer";
import { SiteHeader } from "../../components/SiteHeader";
import { contentRepository } from "../../lib/content";
import { notFound } from "next/navigation";

export const metadata: Metadata = { title: "연구회 소식" };

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await contentRepository.getNewsBySlug(slug);
  if (!post) notFound();
  return (
    <>
      <SiteHeader />
      <main className="article-main">
        <article className="container article-shell">
          <p className="eyebrow">KIHC News</p>
          <h1>{post.title}</h1>
          <time>{post.publishedAt}</time>
          <div className="article-divider" />
          {post.imageUrl ? <img className="article-image" src={post.imageUrl} alt={`${post.title} 대표 이미지`} /> : null}
          <div className="article-body">{post.content.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
          <Link prefetch={false} className="button button-outline" href="/news">목록으로 돌아가기</Link>
        </article>
      </main>
      <Footer />
    </>
  );
}
