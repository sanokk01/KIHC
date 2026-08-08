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
            <a href="#history">연구소 연혁</a>
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

        {/* 4. 연구소 연혁 */}
        <section className="about-section muted-bg" id="history">
          <div className="container">
            <div className="section-heading compact">
              <div>
                <p className="eyebrow">History</p>
                <h2>연구회 연혁</h2>
              </div>
              <p>인재역량 연구의 깊이를 더해온 KIHC의 발자취입니다.</p>
            </div>
            <div className="timeline-container">
              <div className="timeline-item">
                <div className="timeline-year">2026</div>
                <div className="timeline-content">
                  <h4>디지털 연구 플랫폼 개편 및 실시간 데이터베이스 연동</h4>
                  <p>KIHC 디지털 연구 시스템 구축, 2026 주요 연구 정책자료 시리즈 발간 시작.</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-year">2025</div>
                <div className="timeline-content">
                  <h4>인재역량 진단 프레임워크 연구용역 수행</h4>
                  <p>메타인지 및 회복탄력성 지표 개발 용역 프로젝트 성공적 수행, 정기 세미나 개최.</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-year">2024</div>
                <div className="timeline-content">
                  <h4>한국인재역량연구회(KIHC) 설립</h4>
                  <p>인간 고유 역량 연구를 목표로 학계 및 산업계 연구진 공동 설립.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. 조직 체계 */}
        <section className="about-section organization-section" id="organization">
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
              <div className="organization-tree-v2">
                <div className="tree-level top-level">
                  <div className="tree-node board">이사회</div>
                </div>
                <div className="tree-line vertical" />
                <div className="tree-level text-center">
                  <div className="tree-node chairman-node">이사장</div>
                </div>
                <div className="tree-line vertical" />
                <div className="tree-level sub-top">
                  <div className="tree-node sub">운영위원회</div>
                  <div className="tree-node sub">감사</div>
                </div>
                <div className="tree-line vertical" />
                <div className="tree-branches-v2">
                  <div className="tree-branch-card">
                    <span className="branch-tag">R&D</span>
                    <h4>연구기획본부</h4>
                    <p>정책 연구 수주, 연구과제 기획 및 과제 관리</p>
                  </div>
                  <div className="tree-branch-card">
                    <span className="branch-tag">RESEARCH</span>
                    <h4>인재역량연구센터</h4>
                    <p>메타인지, 회복탄력성, 가치판단 학술 연구</p>
                  </div>
                  <div className="tree-branch-card">
                    <span className="branch-tag">EVALUATION</span>
                    <h4>진단지표개발실</h4>
                    <p>역량 진단 모델 개발 및 데이터 분석 표준화</p>
                  </div>
                  <div className="tree-branch-card">
                    <span className="branch-tag">PARTNERSHIP</span>
                    <h4>대외협력사업팀</h4>
                    <p>B2B 연구용역 수주, 정부·기업 제휴 및 홍보</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 6. 핵심 역량 및 수주 문의 CTA */}
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

