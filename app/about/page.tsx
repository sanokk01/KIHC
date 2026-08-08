/* eslint-disable @next/next/no-img-element -- future uploaded media may be served by the app's media route. */
import type { Metadata } from "next";
import { AppLink as Link } from "../components/AppLink";
import { Footer } from "../components/Footer";
import { PageHero } from "../components/PageHero";
import { SiteHeader } from "../components/SiteHeader";
import { contentRepository } from "../lib/content";

export const metadata: Metadata = { title: "KIHC 소개 | 한국인재역량연구회" };

export default async function AboutPage() {
  const about = await contentRepository.getAbout();

  return (
    <>
      <SiteHeader />
      <main className="about-main">
        <PageHero
          eyebrow="THINK-TANK OVERVIEW"
          title="KIHC 한국인재역량연구회"
          description="인간 고유의 사고와 내면 성장의 조건을 진단하고, 정부·기업·학계가 신뢰할 수 있는 정책과 솔루션을 제안하는 인재역량 전문 연구기관입니다."
        />

        {/* 앵커 네비게이션 */}
        <nav className="anchor-nav" aria-label="소개 페이지 바로가기">
          <div className="container">
            <a href="#institute">연구회 소개</a>
            <a href="#vision">설립목적 · 비전</a>
            <a href="#chairman">이사장 인사말</a>
            <a href="#organization">조직 체계</a>
            <a href="#capabilities">핵심 역량 및 문의</a>
          </div>
        </nav>

        {/* 1. 연구회 소개 */}
        <section className="about-section" id="institute">
          <div className="container split-section">
            <div className="split-intro">
              <p className="eyebrow">Who We Are</p>
              <h2>사람의 가능성을 탐구하는<br />지적 연구 공동체</h2>
              <span className="gold-divider" />
            </div>
            <div className="large-copy">
              {about.organizationIntroduction.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <div className="mission-cards-grid">
                <div className="mission-card">
                  <span className="mission-num">01</span>
                  <h3>B2B · 정부 정책연구 수주</h3>
                  <p>국가 인적자원 개발 및 기업 맞춤형 인재 진단 모델을 설계합니다.</p>
                </div>
                <div className="mission-card">
                  <span className="mission-num">02</span>
                  <h3>역량 평가 지표 과학화</h3>
                  <p>메타인지와 회복탄력성을 객관적인 데이터 기반으로 측정합니다.</p>
                </div>
                <div className="mission-card">
                  <span className="mission-num">03</span>
                  <h3>현장 중심 교육 솔루션</h3>
                  <p>연구 결과를 실제 교육 및 조직 진단 현장에 즉시 적용할 수 있도록 지원합니다.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. 설립목적 · 비전 */}
        <section className="about-section muted-bg" id="vision">
          <div className="container">
            <div className="section-heading compact">
              <div>
                <p className="eyebrow">Purpose & Vision</p>
                <h2>설립목적 · 비전</h2>
              </div>
            </div>
            <div className="vision-grid-v2">
              <article className="vision-card-v2 primary-card">
                <span className="vision-badge">PURPOSE</span>
                <p className="vision-label">설립목적</p>
                <h3>{about.purpose}</h3>
                <ul className="vision-points">
                  <li>인간 내면 역량에 대한 체계적·학술적 기초 연구</li>
                  <li>산업체 및 교육 현장의 맞춤형 진단 도구 제공</li>
                  <li>지속 가능한 공동체 성장을 위한 정책 대안 제시</li>
                </ul>
              </article>
              <article className="vision-card-v2 gold-card">
                <span className="vision-badge">VISION</span>
                <p className="vision-label">비전</p>
                <h3>{about.vision}</h3>
                <ul className="vision-points">
                  <li>글로벌 수준의 인재역량 씽크탱크 도약</li>
                  <li>연구자와 현장 실무자가 상생하는 지식 네트워크</li>
                  <li>데이터와 사람 중심의 신뢰할 수 있는 학술 가치 창출</li>
                </ul>
              </article>
            </div>
          </div>
        </section>

        {/* 3. 이사장 인사말 */}
        <section className="about-section" id="chairman">
          <div className="container about-chairman">
            {about.chairmanImageUrl ? (
              <div className="portrait-image">
                <img src={about.chairmanImageUrl} alt="한국인재역량연구회 이사장" />
              </div>
            ) : (
              <div className="portrait-placeholder" aria-label="이사장 사진">
                <div className="portrait-badge">KIHC CHAIRMAN</div>
                <span>인재역량연구회 이사장</span>
              </div>
            )}
            <div className="about-copy">
              <p className="eyebrow">Chairman&apos;s Message</p>
              <h2>사람에 대한 깊은 존중과<br />과학적 통찰에서 연구를 시작합니다.</h2>
              <div className="message-paragraphs">
                {about.chairmanMessage.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <div className="chairman-signature">
                <div className="sig-info">
                  <strong>한국인재역량연구회 이사장</strong>
                  <span>Korea Institute of Human Capability</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. 조직 체계 */}
        <section className="about-section organization-section muted-bg" id="organization">
          <div className="container">
            <div className="section-heading compact">
              <div>
                <p className="eyebrow">Organization</p>
                <h2>조직 체계</h2>
              </div>
              <p>전문성과 유연성을 갖춘 KIHC의 연구 및 운영 조직 구조입니다.</p>
            </div>
            {about.organizationImageUrl ? (
              <div className="organization-image">
                <img src={about.organizationImageUrl} alt="한국인재역량연구회 조직도" />
              </div>
            ) : (
              <div className="org-chart-luxurious">
                {/* 1. 상부 의결 기구 */}
                <div className="org-tier-top">
                  <div className="org-card-pill board">
                    <span className="pill-tag">GOVERNANCE</span>
                    <strong>이사회</strong>
                    <small>Board of Directors</small>
                  </div>
                  <div className="org-card-pill auditor">
                    <span className="pill-tag">AUDIT</span>
                    <strong>감사</strong>
                    <small>Auditor</small>
                  </div>
                </div>

                <div className="org-connector-line" />

                {/* 2. 최고 경영 및 자문 기구 */}
                <div className="org-tier-center">
                  <div className="org-card-head executive">
                    <span className="gold-accent-badge">EXECUTIVE LEADERSHIP</span>
                    <h3>이사장 / 연구원장</h3>
                    <p>Korea Institute of Human Capability</p>
                  </div>
                  <div className="org-advisory-wing">
                    <div className="advisory-pill">
                      <span>ADVISORY</span>
                      <strong>운영위원회</strong>
                    </div>
                    <div className="advisory-pill">
                      <span>ACADEMIC</span>
                      <strong>연구자문위원회</strong>
                    </div>
                  </div>
                </div>

                <div className="org-connector-fork" />

                {/* 3. 4대 전문 실행 본부 */}
                <div className="org-grid-divisons">
                  <div className="divison-card">
                    <div className="divison-header">
                      <span className="divison-num">01</span>
                      <span className="divison-code">RESEARCH & POLICY</span>
                    </div>
                    <h4>연구기획본부</h4>
                    <span className="divison-sub">Research Planning Division</span>
                    <ul className="divison-tasks">
                      <li>정부·공공기관 정책과제 기획 및 수주</li>
                      <li>중장기 연구 로드맵 수립 및 과제 관리</li>
                      <li>B2B 산학협력 R&D 컨설팅 총괄</li>
                    </ul>
                  </div>

                  <div className="divison-card highlight">
                    <div className="divison-header">
                      <span className="divison-num">02</span>
                      <span className="divison-code">CAPABILITY CENTER</span>
                    </div>
                    <h4>인재역량연구센터</h4>
                    <span className="divison-sub">Human Capability Research Lab</span>
                    <ul className="divison-tasks">
                      <li>메타인지 · 회복탄력성 메커니즘 학술 연구</li>
                      <li>가치판단 역량 및 의사결정 모델링</li>
                      <li>연구 보고서 발간 및 정기 학술 세미나</li>
                    </ul>
                  </div>

                  <div className="divison-card">
                    <div className="divison-header">
                      <span className="divison-num">03</span>
                      <span className="divison-code">METRICS & METROLOGY</span>
                    </div>
                    <h4>역량진단평가실</h4>
                    <span className="divison-sub">Assessment & Metric Lab</span>
                    <ul className="divison-tasks">
                      <li>객관적 데이터 기반 역량 진단 도구 개발</li>
                      <li>기업/기관 맞춤형 진단 표준화 지표 설계</li>
                      <li>빅데이터 기반 역량 성과분석 및 솔루션</li>
                    </ul>
                  </div>

                  <div className="divison-card">
                    <div className="divison-header">
                      <span className="divison-num">04</span>
                      <span className="divison-code">GLOBAL PARTNERSHIP</span>
                    </div>
                    <h4>대외협력·사업팀</h4>
                    <span className="divison-sub">Partnership & Expansion Team</span>
                    <ul className="divison-tasks">
                      <li>연구 용역 프로젝트 계약 및 파트너십</li>
                      <li>교육 솔루션 보급 및 전문 강연 자문</li>
                      <li>연구 성과 확산 및 대외 브랜딩</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 5. 핵심 역량 및 수주 문의 CTA */}
        <section className="about-cta-section" id="capabilities">
          <div className="container cta-box">
            <div className="cta-content">
              <p className="eyebrow light">RESEARCH PARTNERSHIP</p>
              <h2>정부·기업 맞춤형 인재역량 진단 및 연구 용역</h2>
              <p>KIHC의 축적된 데이터와 검증된 연구 프레임워크를 바탕으로 최적의 용역 솔루션을 제공합니다.</p>
            </div>
            <div className="cta-action">
              <Link prefetch={false} className="button button-light" href="/contact">
                연구 용역 및 제휴 문의 ↗
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}


