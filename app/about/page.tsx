import type { Metadata } from "next";
import { Footer } from "../components/Footer";
import { PageHero } from "../components/PageHero";
import { SiteHeader } from "../components/SiteHeader";
import { contentRepository } from "../lib/content";

export const metadata: Metadata = { title: "KIHC 소개" };

export default function AboutPage() {
  const about = contentRepository.getAbout();
  return (
    <>
      <SiteHeader />
      <main>
        <PageHero eyebrow="About KIHC" title="KIHC 소개" description="사람의 가능성을 이해하고 더 나은 성장을 연구하는 작은 연구 공동체입니다." />
        <nav className="anchor-nav" aria-label="소개 페이지 바로가기">
          <div className="container">
            <a href="#chairman">이사장 소개</a>
            <a href="#institute">연구회 소개</a>
            <a href="#vision">설립목적 · 비전</a>
            <a href="#organization">조직도</a>
          </div>
        </nav>

        <section className="about-section" id="chairman">
          <div className="container about-chairman">
            <div className="portrait-placeholder" aria-label="이사장 사진 준비 중">
              <span>CHAIRMAN</span>
            </div>
            <div className="about-copy">
              <p className="eyebrow">Chairman&apos;s Message</p>
              <h2>사람에 대한 깊은 이해에서<br />연구를 시작합니다.</h2>
              {about.chairmanMessage.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <strong>한국인재역량연구회 이사장</strong>
            </div>
          </div>
        </section>

        <section className="about-section muted" id="institute">
          <div className="container split-section">
            <div>
              <p className="eyebrow">Who We Are</p>
              <h2>연구회 소개</h2>
            </div>
            <div className="large-copy">
              {about.organizationIntroduction.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </div>
        </section>

        <section className="about-section" id="vision">
          <div className="container">
            <div className="section-heading compact">
              <div><p className="eyebrow">Purpose & Vision</p><h2>설립목적 · 비전</h2></div>
            </div>
            <div className="vision-grid">
              <article><span>01</span><p>설립목적</p><h3>{about.purpose}</h3></article>
              <article><span>02</span><p>비전</p><h3>{about.vision}</h3></article>
            </div>
          </div>
        </section>

        <section className="about-section organization-section" id="organization">
          <div className="container">
            <p className="eyebrow">Organization</p>
            <h2>조직도</h2>
            <div className="organization-placeholder">
              <div className="org-node primary">이사장</div>
              <div className="org-line" aria-hidden="true" />
              <div className="org-node">운영위원회</div>
              <div className="org-branches">
                <div className="org-node">연구기획</div>
                <div className="org-node">역량연구</div>
                <div className="org-node">대외협력</div>
              </div>
              <p>향후 관리자 화면에서 조직도 이미지로 교체할 수 있는 영역입니다.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
