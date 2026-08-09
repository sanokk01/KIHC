/* eslint-disable @next/next/no-img-element -- official CI assets are served from the public directory. */
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Footer } from "../components/Footer";
import { PageHero } from "../components/PageHero";
import { RestrictedDetailGate } from "../components/RestrictedDetailGate";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = { title: "CI 소개 | KIHC 한국인재역량연구회" };

export default async function CiPage() {
  const cookieStore = await cookies();
  const isEn = cookieStore.get("kihc-language")?.value === "en";

  const dict = {
    title: isEn ? "CI Overview & Brand Guide" : "CI 소개 및 브랜드 가이드",
    description: isEn
      ? "Official visual assets representing the identity and academic credibility of KIHC."
      : "KIHC 한국인재역량연구회의 정체성과 학술적 신뢰를 상징하는 공식 시각 자산을 소개합니다.",
    conceptHeading: isEn ? "Brand Symbol & Identity" : "브랜드 심볼 및 정체성",
    conceptDesc: isEn
      ? "Harmonizing deep academic insight with sustainable human capability growth."
      : "깊이 있는 학술적 통찰과 지속 가능한 인재 역량의 성장을 조화로운 조형으로 형상화했습니다.",
    combHeading: isEn ? "Official Logo Combinations" : "공식 로고 조합 (Official Logo Combinations)",
    c1Title: isEn ? "Emblem of Rising Vision" : "상승하는 비전의 엠블럼",
    c1Desc: isEn ? "A symbolic line representing the upward trajectory where human capability expands externally." : "인간 고유의 내면 역량이 외부로 확장되어 개인과 사회의 성장을 이끄는 상승의 궤적을 심볼릭 라인으로 표현했습니다.",
    c2Title: isEn ? "Deep Royal Navy & Champagne Gold" : "딥 로열 네이비 & 샴페인 골드",
    c2Desc: isEn ? "A combination of Deep Royal Navy symbolizing trust and Champagne Gold for profound wisdom." : "전문 연구기관의 흔들리지 않는 신뢰감을 상징하는 Deep Royal Navy와 깊이 있는 지혜를 뜻하는 Champagne Gold의 결합입니다.",
    c3Title: isEn ? "Sophisticated Wordmark Typography" : "정교한 워드마크 타이포그래피",
    c3Desc: isEn ? "A custom font combination maximizing clarity and readability, blending academic rigor with modern flexibility." : "명확성과 가독성을 극대화한 커스텀 서체 조합으로, 학술적 엄밀함과 현대적인 유연성을 공존시켰습니다.",
    logo1Title: isEn ? "Primary Horizontal Signature" : "가로형 시그니처 (Primary Horizontal)",
    logo1Desc: isEn ? "Main logo used for website header and official document covers." : "홈페이지 상단, 공식 서식 및 학술 보고서 표지에 사용하는 메인 로고 조합입니다.",
    logo2Title: isEn ? "Dark Reverse Signature" : "어두운 배경용 시그니처 (Dark Reverse Signature)",
    logo2Desc: isEn ? "Reverse combination for dark templates and presentation covers." : "어두운 톤의 템플릿 및 프레젠테이션 표지에 사용하는 반전 조합입니다.",
    logo3Title: isEn ? "Emblem & Symbol Mark" : "엠블럼 심볼 마크 (Emblem & Symbol Mark)",
    logo3Desc: isEn ? "Auxiliary graphic element used when horizontal signature application is difficult." : "가로형 시그니처 적용이 어려운 정사각형 및 원형 프레임 썸네일에 적용하는 보조 그래픽 요소입니다.",
    colorPalette: isEn ? "KIHC Color Palette" : "KIHC Color Palette",
    colorDesc: isEn ? "The core colors reflecting the KIHC brand's philosophy and trust." : "KIHC 브랜드의 철학과 신뢰감을 담아낸 핵심 색상표입니다.",
    fontPalette: isEn ? "KIHC Typography System" : "KIHC Typography System",
    fontDesc: isEn ? "Brand typeface strictly selected for academic readability and authority." : "학술적 가독성과 권위를 위해 엄격하게 선별된 브랜드 서체입니다.",
    logo4Title: isEn ? "Vertical Stacked Signature" : "수직 세로형 조합 (Vertical Stacked Signature)",
    logo4Desc: isEn ? "Vertical combination applied to banners, signs, and narrow publication covers." : "배너, 간판, 좁은 너비의 간행물 표지에 적용하는 세로형 조합입니다.",
    gateItemName: isEn ? "KIHC CI Original Package (AI/SVG/PNG) & Brand Guidelines" : "KIHC CI 원본 패키지 (AI/SVG/PNG) 및 브랜드 사용 규정",
    gateDesc: isEn ? "Original vector files and typography guidelines are provided to official partners and research affiliates." : "CI 원본 벡터 파일과 서체 사용 규칙은 공식 제휴 및 연구 협력 기관에 제공됩니다."
  };

  return (
    <>
      <SiteHeader />
      <main className="ci-main">
        <PageHero
          eyebrow="Corporate Identity"
          title={dict.title}
          description={dict.description}
        />

        <section className="section ci-section">
          <div className="container">
            {/* 1. 브랜드 상징성 및 미학 */}
            <div className="section-heading">
              <div>
                <p className="eyebrow">Identity Concept</p>
                <h2>{dict.conceptHeading}</h2>
              </div>
              <p>{dict.conceptDesc}</p>
            </div>

            <div className="ci-concept-grid">
              <article className="ci-concept-card">
                <span className="concept-num">01</span>
                <h3>{dict.c1Title}</h3>
                <p>{dict.c1Desc}</p>
              </article>
              <article className="ci-concept-card">
                <span className="concept-num">02</span>
                <h3>{dict.c2Title}</h3>
                <p>{dict.c2Desc}</p>
              </article>
              <article className="ci-concept-card">
                <span className="concept-num">03</span>
                <h3>{dict.c3Title}</h3>
                <p>{dict.c3Desc}</p>
              </article>
            </div>

            {/* 2. 메인 로고 버라이어티 */}
            <div className="ci-showcase-box">
              <div className="ci-showcase-header">
                <h3>{dict.combHeading}</h3>
                <span>Digital & Print Usage Guidelines</span>
              </div>
              <div className="ci-preview-grid-v2">
                <article className="ci-card-item">
                  <div className="ci-preview-box light">
                    <img src="/kihc-logo-horizontal.png" alt="KIHC 가로형 공식 로고" />
                  </div>
                  <div className="ci-card-info">
                    <h4>{dict.logo1Title}</h4>
                    <p>{dict.logo1Desc}</p>
                  </div>
                </article>

                <article className="ci-card-item">
                  <div className="ci-preview-box dark">
                    <img src="/kihc-logo-horizontal.png" alt="어두운 배경 적용 KIHC 로고" />
                  </div>
                  <div className="ci-card-info">
                    <h4>{dict.logo2Title}</h4>
                    <p>{dict.logo2Desc}</p>
                  </div>
                </article>

                <article className="ci-card-item">
                  <div className="ci-preview-box light emblem-box">
                    <div className="emblem-symbol-preview">
                      <span>KIHC</span>
                      <small>EST. 2024</small>
                    </div>
                  </div>
                  <div className="ci-card-info">
                    <h4>{dict.logo3Title}</h4>
                    <p>{dict.logo3Desc}</p>
                  </div>
                </article>

                <article className="ci-card-item">
                  <div className="ci-preview-box warm vertical-box">
                    <div className="stacked-logo-preview">
                      <div className="stacked-symbol">KIHC</div>
                      <div className="stacked-text">한국인재역량연구회</div>
                    </div>
                  </div>
                  <div className="ci-card-info">
                    <h4>{dict.logo4Title}</h4>
                    <p>{dict.logo4Desc}</p>
                  </div>
                </article>
              </div>
            </div>

            {/* 3. 브랜드 전용 컬러 시스템 */}
            <div className="ci-color-system">
              <div className="section-heading compact">
                <div>
                  <p className="eyebrow">Color Palette</p>
                  <h2>{dict.colorPalette}</h2>
                </div>
              </div>
              <div className="color-swatch-grid">
                <div className="color-swatch navy">
                  <div className="swatch-preview" />
                  <div className="swatch-details">
                    <strong>Deep Royal Navy</strong>
                    <span>#0A192F</span>
                    <small>Primary Brand Color</small>
                  </div>
                </div>
                <div className="color-swatch gold">
                  <div className="swatch-preview" />
                  <div className="swatch-details">
                    <strong>Champagne Gold</strong>
                    <span>#C5A059</span>
                    <small>Accent Brand Color</small>
                  </div>
                </div>
                <div className="color-swatch slate">
                  <div className="swatch-preview" />
                  <div className="swatch-details">
                    <strong>Academic Slate</strong>
                    <span>#153B66</span>
                    <small>Secondary Neutral</small>
                  </div>
                </div>
                <div className="color-swatch warm">
                  <div className="swatch-preview" />
                  <div className="swatch-details">
                    <strong>Warm Paper White</strong>
                    <span>#FCFBF9</span>
                    <small>Background Base</small>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. 제한 다운로드 및 가이드 게이트 */}
            <RestrictedDetailGate
              itemName={dict.gateItemName}
              description={dict.gateDesc}
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

