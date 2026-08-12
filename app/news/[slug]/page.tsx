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

  // Find prev/next
  const allPosts = await contentRepository.searchNews({ query: "", field: "title", page: 1, pageSize: 1000 });
  const currentIndex = allPosts.items.findIndex(p => p.id === post.id);
  const prevPost = currentIndex < allPosts.items.length - 1 ? allPosts.items[currentIndex + 1] : null; // Older post
  const nextPost = currentIndex > 0 ? allPosts.items[currentIndex - 1] : null; // Newer post

  return (
    <>
      <SiteHeader />
      <main className="article-main">
        <article className="container article-shell">
          <header className="article-detail-header">
            {post.category1 && <p className="news-cat-badge article-category">[{post.category1}]</p>}
            <h1>{post.title}</h1>
            <div className="article-detail-meta">
              <span>작성일시 {post.publishedAt} {post.heldAt && `(개최일: ${post.heldAt})`}</span>
              <span>조회수 {post.views ?? 0}</span>
            </div>
          </header>

          <div className="article-body">
            {post.attachmentUrl && (
              <a href={post.attachmentUrl} target="_blank" rel="noreferrer" className="article-attachment">
                📎 첨부파일 다운로드
              </a>
            )}
            {post.imageUrl ? <img className="article-image" src={post.imageUrl} alt={`${post.title} 대표 이미지`} /> : null}
            {post.content.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          
          <div className="article-actions">
            <Link prefetch={false} className="btn-list" href="/news">목록</Link>
          </div>

          <nav className="article-nav" aria-label="이전글 다음글">
            <div className="article-nav-row">
              <span className="article-nav-label">∧ 이전글</span>
              {prevPost ? <Link prefetch={false} href={`/news/${prevPost.slug || prevPost.id}`}>{prevPost.title}</Link> : <span>이전 글이 없습니다.</span>}
            </div>
            <div className="article-nav-row">
              <span className="article-nav-label">∨ 다음글</span>
              {nextPost ? <Link prefetch={false} href={`/news/${nextPost.slug || nextPost.id}`}>{nextPost.title}</Link> : <span>다음 글이 없습니다.</span>}
            </div>
          </nav>
        </article>
      </main>
      <Footer />
    </>
  );
}
