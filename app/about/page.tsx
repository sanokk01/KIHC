/* eslint-disable @next/next/no-img-element -- future uploaded media may be served by the app's media route. */
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { AppLink as Link } from "../components/AppLink";
import { Footer } from "../components/Footer";
import { PageHero } from "../components/PageHero";
import { SiteHeader } from "../components/SiteHeader";
import { contentRepository } from "../lib/content";

export const metadata: Metadata = { title: "KIHC 소개 | 한국인재역량연구회" };

export default async function AboutPage() {
  const cookieStore = await cookies();
  const isEn = cookieStore.get("kihc-language")?.value === "en";
  const about = await contentRepository.getAbout();

  const dict = {
    eyebrow: "THINK-TANK OVERVIEW",
    title: isEn ? "KIHC Korea Institute of Human Capability" : "KIHC 한국인재역량연구회",
    description: isEn
      ? "Diagnosing human capability and growth conditions to deliver trusted policies and solutions for government, corporate, and academia."
      : "인간 고유의 사고와 내면 성장의 조건을 진단하고, 정부·기업·학계가 신뢰할 수 있는 정책과 솔루션을 제안하는 인재역량 전문 연구기관입니다.",
    nav: {
      institute: isEn ? "About Institute" : "연구회 소개",
      vision: isEn ? "Purpose & Vision" : "설립목적 · 비전",
      chairman: isEn ? "Chairman's Message" : "이사장 인사말",
      organization: isEn ? "Organization" : "조직 체계",
      capabilities: isEn ? "Capabilities & Contact" : "핵심 역량 및 문의",
    },
    whoWeAre: isEn ? "An Intellectual Research Community Exploring Human Potential" : "사람의 가능성을 탐구하는 지적 연구 공동체",
    m1Title: isEn ? "B2B & Government Policy Research" : "B2B · 정부 정책연구 수주",
    m1Desc: isEn ? "Designing national human resource development and corporate capability models." : "국가 인적자원 개발 및 기업 맞춤형 인재 진단 모델을 설계합니다.",
    m2Title: isEn ? "Scientific Capability Metrics" : "역량 평가 지표 과학화",
    m2Desc: isEn ? "Measuring metacognition and resilience based on objective data." : "메타인지와 회복탄력성을 객관적인 데이터 기반으로 측정합니다.",
    m3Title: isEn ? "Field-Oriented Solutions" : "현장 중심 교육 솔루션",
    m3Desc: isEn ? "Applying research results directly to education and organizational diagnosis." : "연구 결과를 실제 교육 및 조직 진단 현장에 즉시 적용할 수 있도록 지원합니다.",
    visionTitle: isEn ? "Purpose & Vision" : "설립목적 · 비전",
    visionPurposeLabel: isEn ? "PURPOSE" : "설립목적",
    visionVisionLabel: isEn ? "VISION" : "비전",
    visionP1: isEn ? "Systematic and academic basic research on human inner capabilities" : "인간 내면 역량에 대한 체계적·학술적 기초 연구",
    visionP2: isEn ? "Providing customized diagnostic tools for industry and education" : "산업체 및 교육 현장의 맞춤형 진단 도구 제공",
    visionP3: isEn ? "Proposing policy alternatives for sustainable community growth" : "지속 가능한 공동체 성장을 위한 정책 대안 제시",
    visionV1: isEn ? "Leap to a global-level human capability think-tank" : "글로벌 수준의 인재역량 씽크탱크 도약",
    visionV2: isEn ? "A knowledge network where researchers and practitioners coexist" : "연구자와 현장 실무자가 상생하는 지식 네트워크",
    visionV3: isEn ? "Creating reliable academic value centered on data and people" : "데이터와 사람 중심의 신뢰할 수 있는 학술 가치 창출",
    chairmanAlt: isEn ? "KIHC Chairman" : "한국인재역량연구회 이사장",
    chairmanMsgTitle: isEn ? "We begin our research with deep respect for people and scientific insight." : "사람에 대한 깊은 존중과\n과학적 통찰에서 연구를 시작합니다.",
    orgTitle: isEn ? "Organization" : "조직 체계",
    orgDesc: isEn ? "KIHC's specialized and flexible research and operational organizational structure." : "전문성과 유연성을 갖춘 KIHC의 연구 및 운영 조직 구조입니다.",
    orgBoard: isEn ? "Board of Directors" : "이사회",
    orgAudit: isEn ? "Auditor" : "감사",
    orgHead: isEn ? "Chairman / Director" : "이사장 / 연구원장",
    orgOpComm: isEn ? "Steering Committee" : "운영위원회",
    orgAdComm: isEn ? "Advisory Committee" : "연구자문위원회",
    orgDiv1: isEn ? "Research Planning Division" : "연구기획본부",
    orgDiv1_1: isEn ? "Planning and winning government/public policy projects" : "정부·공공기관 정책과제 기획 및 수주",
    orgDiv1_2: isEn ? "Establishing mid-to-long-term research roadmaps" : "중장기 연구 로드맵 수립 및 과제 관리",
    orgDiv1_3: isEn ? "B2B industry-academia R&D consulting management" : "B2B 산학협력 R&D 컨설팅 총괄",
    orgDiv2: isEn ? "Human Capability Research Lab" : "인재역량연구센터",
    orgDiv2_1: isEn ? "Academic research on metacognition and resilience mechanisms" : "메타인지 · 회복탄력성 메커니즘 학술 연구",
    orgDiv2_2: isEn ? "Value judgment competency and decision modeling" : "가치판단 역량 및 의사결정 모델링",
    orgDiv2_3: isEn ? "Publishing research reports and regular academic seminars" : "연구 보고서 발간 및 정기 학술 세미나",
    orgDiv3: isEn ? "Assessment & Metric Lab" : "역량진단평가실",
    orgDiv3_1: isEn ? "Developing objective data-based capability diagnostic tools" : "객관적 데이터 기반 역량 진단 도구 개발",
    orgDiv3_2: isEn ? "Designing customized diagnostic standardization indices" : "기업/기관 맞춤형 진단 표준화 지표 설계",
    orgDiv3_3: isEn ? "Big data-based capability performance analysis and solutions" : "빅데이터 기반 역량 성과분석 및 솔루션",
    orgDiv4: isEn ? "Partnership & Expansion Team" : "대외협력·사업팀",
    orgDiv4_1: isEn ? "Research service project contracts and partnerships" : "연구 용역 프로젝트 계약 및 파트너십",
    orgDiv4_2: isEn ? "Distribution of educational solutions and expert lecture consulting" : "교육 솔루션 보급 및 전문 강연 자문",
    orgDiv4_3: isEn ? "Spreading research achievements and external branding" : "연구 성과 확산 및 대외 브랜딩",
    ctaEyebrow: "RESEARCH PARTNERSHIP",
    ctaTitle: isEn ? "Customized Talent Capability Diagnosis and Research Services for Government and Corporate" : "정부·기업 맞춤형 인재역량 진단 및 연구 용역",
    ctaDesc: isEn ? "We provide optimal service solutions based on KIHC's accumulated data and proven research framework." : "KIHC의 축적된 데이터와 검증된 연구 프레임워크를 바탕으로 최적의 용역 솔루션을 제공합니다.",
    ctaBtn: isEn ? "Inquire about Research Services & Partnerships ↗" : "연구 용역 및 제휴 문의 ↗"
  };

  return (
    <>
      <SiteHeader />
      <main className="about-main">
        <PageHero
          eyebrow={dict.eyebrow}
          title={dict.title}
          description={dict.description}
        />

        {/* 앵커 네비게이션 */}
        <nav className="anchor-nav" aria-label="소개 페이지 바로가기">
          <div className="container">
            <a href="#institute">{dict.nav.institute}</a>
            <a href="#vision">{dict.nav.vision}</a>
            <a href="#chairman">{dict.nav.chairman}</a>
            <a href="#organization">{dict.nav.organization}</a>
            <a href="#capabilities">{dict.nav.capabilities}</a>
          </div>
        </nav>

        {/* 1. 연구회 소개 */}
        <section className="about-section" id="institute">
          <div className="container split-section">
            <div className="split-intro">
              <p className="eyebrow">Who We Are</p>
              <h2>{dict.whoWeAre}</h2>
              <span className="gold-divider" />
            </div>
            <div className="large-copy">
              {about.organizationIntroduction.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <div className="mission-cards-grid">
                <div className="mission-card">
                  <span className="mission-num">01</span>
                  <h3>{dict.m1Title}</h3>
                  <p>{dict.m1Desc}</p>
                </div>
                <div className="mission-card">
                  <span className="mission-num">02</span>
                  <h3>{dict.m2Title}</h3>
                  <p>{dict.m2Desc}</p>
                </div>
                <div className="mission-card">
                  <span className="mission-num">03</span>
                  <h3>{dict.m3Title}</h3>
                  <p>{dict.m3Desc}</p>
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
                <h2>{dict.visionTitle}</h2>
              </div>
            </div>
            <div className="vision-grid-v2">
              <article className="vision-card-v2 primary-card">
                <span className="vision-badge">PURPOSE</span>
                <p className="vision-label">{dict.visionPurposeLabel}</p>
                <h3>{about.purpose}</h3>
                <ul className="vision-points">
                  <li>{dict.visionP1}</li>
                  <li>{dict.visionP2}</li>
                  <li>{dict.visionP3}</li>
                </ul>
              </article>
              <article className="vision-card-v2 gold-card">
                <span className="vision-badge">VISION</span>
                <p className="vision-label">{dict.visionVisionLabel}</p>
                <h3>{about.vision}</h3>
                <ul className="vision-points">
                  <li>{dict.visionV1}</li>
                  <li>{dict.visionV2}</li>
                  <li>{dict.visionV3}</li>
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
                <img src={about.chairmanImageUrl} alt={dict.chairmanAlt} />
              </div>
            ) : (
              <div className="portrait-placeholder" aria-label="이사장 사진">
                <div className="portrait-badge">KIHC CHAIRMAN</div>
                <span>{dict.chairmanAlt}</span>
              </div>
            )}
            <div className="about-copy">
              <p className="eyebrow">Chairman&apos;s Message</p>
              <h2 style={{ whiteSpace: 'pre-line' }}>{dict.chairmanMsgTitle}</h2>
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
                <h2>{dict.orgTitle}</h2>
              </div>
              <p>{dict.orgDesc}</p>
            </div>
            {about.organizationImageUrl ? (
              <div className="organization-image">
                <img src={about.organizationImageUrl} alt={dict.orgTitle} />
              </div>
            ) : (
              <div className="org-chart-luxurious">
                {/* 1. 상부 의결 기구 */}
                <div className="org-tier-top">
                  <div className="org-card-pill board">
                    <span className="pill-tag">GOVERNANCE</span>
                    <strong>{dict.orgBoard}</strong>
                    <small>Board of Directors</small>
                  </div>
                  <div className="org-card-pill auditor">
                    <span className="pill-tag">AUDIT</span>
                    <strong>{dict.orgAudit}</strong>
                    <small>Auditor</small>
                  </div>
                </div>

                <div className="org-connector-line" />

                {/* 2. 최고 경영 및 자문 기구 */}
                <div className="org-tier-center">
                  <div className="org-card-head executive">
                    <span className="gold-accent-badge">EXECUTIVE LEADERSHIP</span>
                    <h3>{dict.orgHead}</h3>
                    <p>Korea Institute of Human Capability</p>
                  </div>
                  <div className="org-advisory-wing">
                    <div className="advisory-pill">
                      <span>ADVISORY</span>
                      <strong>{dict.orgOpComm}</strong>
                    </div>
                    <div className="advisory-pill">
                      <span>ACADEMIC</span>
                      <strong>{dict.orgAdComm}</strong>
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
                    <h4>{dict.orgDiv1}</h4>
                    <span className="divison-sub">Research Planning Division</span>
                    <ul className="divison-tasks">
                      <li>{dict.orgDiv1_1}</li>
                      <li>{dict.orgDiv1_2}</li>
                      <li>{dict.orgDiv1_3}</li>
                    </ul>
                  </div>

                  <div className="divison-card highlight">
                    <div className="divison-header">
                      <span className="divison-num">02</span>
                      <span className="divison-code">CAPABILITY CENTER</span>
                    </div>
                    <h4>{dict.orgDiv2}</h4>
                    <span className="divison-sub">Human Capability Research Lab</span>
                    <ul className="divison-tasks">
                      <li>{dict.orgDiv2_1}</li>
                      <li>{dict.orgDiv2_2}</li>
                      <li>{dict.orgDiv2_3}</li>
                    </ul>
                  </div>

                  <div className="divison-card">
                    <div className="divison-header">
                      <span className="divison-num">03</span>
                      <span className="divison-code">METRICS & METROLOGY</span>
                    </div>
                    <h4>{dict.orgDiv3}</h4>
                    <span className="divison-sub">Assessment & Metric Lab</span>
                    <ul className="divison-tasks">
                      <li>{dict.orgDiv3_1}</li>
                      <li>{dict.orgDiv3_2}</li>
                      <li>{dict.orgDiv3_3}</li>
                    </ul>
                  </div>

                  <div className="divison-card">
                    <div className="divison-header">
                      <span className="divison-num">04</span>
                      <span className="divison-code">GLOBAL PARTNERSHIP</span>
                    </div>
                    <h4>{dict.orgDiv4}</h4>
                    <span className="divison-sub">Partnership & Expansion Team</span>
                    <ul className="divison-tasks">
                      <li>{dict.orgDiv4_1}</li>
                      <li>{dict.orgDiv4_2}</li>
                      <li>{dict.orgDiv4_3}</li>
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


