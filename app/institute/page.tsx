/* eslint-disable @next/next/no-img-element -- future uploaded media may be served by the app's media route. */
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { AppLink as Link } from "../components/AppLink";
import { Footer } from "../components/Footer";
import { PageHero } from "../components/PageHero";
import { SiteHeader } from "../components/SiteHeader";
import { getAdminSingleton } from "../lib/admin-data";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: "연구소 통합 안내 | KIHC 한국인재역량연구회" };

export default async function InstitutePage() {
  const cookieStore = await cookies();
  const isEn = cookieStore.get("kihc-language")?.value === "en";
  const institute = await getAdminSingleton("institute");

  const dict = {
    eyebrow: "KIHC INSTITUTE",
    title: isEn ? "KIHC Advanced Institute" : "연구소 통합 안내",
    description: isEn
      ? "Discover the history, experts, and core achievements of KIHC."
      : "KIHC의 연혁, 전문가 그룹, 그리고 핵심 연구 성과를 통합적으로 확인하실 수 있습니다.",
    nav: {
      impact: isEn ? "By the Numbers" : "숫자로 보는 KIHC",
      history: isEn ? "History" : "연혁",
      experts: isEn ? "Experts" : "연구진 및 전문가",
      reports: isEn ? "Annual Reports" : "연차보고서",
    },
    impactTitle: isEn ? "Impact & Reach" : "숫자로 보는 연구 임팩트",
    historyTitle: isEn ? "Milestones" : "성장의 기록",
    expertsTitle: isEn ? "Meet Our Experts" : "전문가 그룹",
    reportsTitle: isEn ? "Annual Reports & Publications" : "연차보고서 및 주요 간행물",
    ctaEyebrow: "RESEARCH PARTNERSHIP",
    ctaTitle: isEn ? "Customized Talent Capability Diagnosis and Research Services for Government and Corporate" : "정부·기업 맞춤형 인재역량 진단 및 연구 용역",
    ctaDesc: isEn ? "We provide optimal service solutions based on KIHC's accumulated data and proven research framework." : "KIHC의 축적된 데이터와 검증된 연구 프레임워크를 바탕으로 최적의 용역 솔루션을 제공합니다.",
    ctaBtn: isEn ? "Inquire about Research Services & Partnerships ↗" : "연구 용역 및 제휴 문의 ↗"
  };

  const impactLines = (institute.impactStats ?? "").split("\n").filter(Boolean);
  const historyLines = (institute.historyTimeline ?? "").split("\n").filter(Boolean);
  const expertLines = (institute.expertRoster ?? "").split("\n").filter(Boolean);
  const reportLines = (institute.annualReports ?? "").split("\n").filter(Boolean);

  return (
    <>
      <SiteHeader />
      <main className="institute-main about-main">
        <PageHero
          eyebrow={dict.eyebrow}
          title={dict.title}
          description={dict.description}
        />

        {/* 앵커 네비게이션 */}
        <nav className="anchor-nav" aria-label="연구소 페이지 바로가기">
          <div className="container">
            <a href="#impact">{dict.nav.impact}</a>
            <a href="#history">{dict.nav.history}</a>
            <a href="#experts">{dict.nav.experts}</a>
            <a href="#reports">{dict.nav.reports}</a>
          </div>
        </nav>

        {/* 1. 숫자로 보는 연구소 (Impact) */}
        <section className="about-section" id="impact">
          <div className="container">
            <div className="section-heading compact">
              <div>
                <p className="eyebrow">By the Numbers</p>
                <h2>{dict.impactTitle}</h2>
              </div>
            </div>
            <div className="impact-grid">
              {impactLines.map((line, idx) => {
                const parts = line.split(":");
                const num = parts[0]?.trim();
                const label = parts[1]?.trim();
                return (
                  <div key={idx} className="impact-card">
                    <h3>{num}</h3>
                    <p>{label}</p>
                  </div>
                );
              })}
              {impactLines.length === 0 && <p className="admin-empty">등록된 지표가 없습니다.</p>}
            </div>
          </div>
        </section>

        {/* 2. 기관 연혁 (History) */}
        <section className="about-section muted-bg" id="history">
          <div className="container">
            <div className="section-heading compact">
              <div>
                <p className="eyebrow">History & Timeline</p>
                <h2>{dict.historyTitle}</h2>
              </div>
            </div>
            <div className="timeline-container">
              {historyLines.map((line, idx) => {
                const parts = line.split(":");
                const year = parts[0]?.trim();
                const event = parts[1]?.trim();
                return (
                  <div key={idx} className="timeline-item">
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <time>{year}</time>
                      <p>{event}</p>
                    </div>
                  </div>
                );
              })}
              {historyLines.length === 0 && <p className="admin-empty">등록된 연혁이 없습니다.</p>}
            </div>
          </div>
        </section>

        {/* 3. 핵심 전문가 및 펠로우십 (Experts) */}
        <section className="about-section" id="experts">
          <div className="container">
            <div className="section-heading compact">
              <div>
                <p className="eyebrow">Experts & Fellows</p>
                <h2>{dict.expertsTitle}</h2>
              </div>
            </div>
            <div className="experts-grid">
              {expertLines.map((line, idx) => {
                const parts = line.split(":");
                const name = parts[0]?.trim();
                const role = parts[1]?.trim();
                return (
                  <div key={idx} className="expert-card">
                    <div className="expert-avatar">
                      <span>{name ? name[0] : "K"}</span>
                    </div>
                    <div className="expert-info">
                      <h4>{name}</h4>
                      <p>{role}</p>
                    </div>
                  </div>
                );
              })}
              {expertLines.length === 0 && <p className="admin-empty">등록된 전문가가 없습니다.</p>}
            </div>
          </div>
        </section>

        {/* 4. 연차보고서 다운로드 (Annual Reports) */}
        <section className="about-section muted-bg" id="reports">
          <div className="container">
            <div className="section-heading compact">
              <div>
                <p className="eyebrow">Annual Reports</p>
                <h2>{dict.reportsTitle}</h2>
              </div>
            </div>
            <div className="reports-grid">
              {reportLines.map((line, idx) => {
                const parts = line.split(":");
                const title = parts[0]?.trim();
                const link = parts[1]?.trim() || "#";
                return (
                  <a key={idx} href={link} className="report-card" target="_blank" rel="noreferrer">
                    <div className="report-icon">PDF</div>
                    <div className="report-details">
                      <strong>{title}</strong>
                      <span>{isEn ? "Download / View" : "다운로드 및 열람"} ↗</span>
                    </div>
                  </a>
                );
              })}
              {reportLines.length === 0 && <p className="admin-empty">등록된 연차보고서가 없습니다.</p>}
            </div>
          </div>
        </section>

        {/* 5. 핵심 역량 및 수주 문의 CTA */}
        <section className="about-cta-section">
          <div className="container cta-box">
            <div className="cta-content">
              <p className="eyebrow light">{dict.ctaEyebrow}</p>
              <h2>{dict.ctaTitle}</h2>
              <p>{dict.ctaDesc}</p>
            </div>
            <div className="cta-action">
              <Link prefetch={false} className="button button-light" href="/contact">
                {dict.ctaBtn}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
