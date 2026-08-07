import type { Metadata } from "next";
import { AppLink as Link } from "../../components/AppLink";
import { Footer } from "../../components/Footer";
import { SiteHeader } from "../../components/SiteHeader";
import { contentRepository } from "../../lib/content";

export const metadata: Metadata = { title: "연구회 소식" };

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = contentRepository.getNewsBySlug(slug) ?? contentRepository.listNews()[0];
  return (
    <>
      <SiteHeader />
      <main className="article-main">
        <article className="container article-shell">
          <p className="eyebrow">KIHC News</p>
          <h1>{post.title}</h1>
          <time>{post.publishedAt}</time>
          <div className="article-divider" />
          <div className="article-body">{post.content.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
          <Link prefetch={false} className="button button-outline" href="/news">목록으로 돌아가기</Link>
        </article>
      </main>
      <Footer />
    </>
  );
}
