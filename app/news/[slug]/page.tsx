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
          </header>

          {post.imageUrl && (
            <div className="article-featured-image">
              <img className="article-image" src={post.imageUrl} alt={`${post.title} 대표 이미지`} />
            </div>
          )}

          <div className="article-body">
            {post.content.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>

          {/* 작성일시 · 조회수 · 첨부파일 — 본문 아래 가로 배치 */}
          <div className="article-post-meta">
            <span className="apm-item">
              <span className="apm-label">작성일시</span>
              <span className="apm-value">{post.publishedAt}{post.heldAt && ` (개최일: ${post.heldAt})`}</span>
            </span>
            <span className="apm-divider" aria-hidden="true" />
            <span className="apm-item">
              <span className="apm-label">조회수</span>
              <span className="apm-value">{post.views ?? 0}</span>
            </span>
            {post.attachmentUrl && (
              <>
                <span className="apm-divider" aria-hidden="true" />
                <a href={post.attachmentUrl} target="_blank" rel="noreferrer" className="apm-item apm-attach">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>
                  첨부파일 다운로드
                </a>
              </>
            )}
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
