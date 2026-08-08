/* eslint-disable @next/next/no-img-element -- official CI assets are served from the public directory. */
import type { Metadata } from "next";
import { Footer } from "../components/Footer";
import { PageHero } from "../components/PageHero";
import { RestrictedDetailGate } from "../components/RestrictedDetailGate";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = { title: "CI 소개" };

export default function CiPage() {
  return <><SiteHeader /><main><PageHero eyebrow="Corporate Identity" title="CI 소개" description="KIHC 한국인재역량연구회의 정체성을 표현하는 공식 시각 자산을 소개합니다." /><section className="section ci-section"><div className="container"><div className="section-heading"><div><p className="eyebrow">KIHC Identity</p><h2>공식 CI 미리보기</h2></div><p>외부 사용자는 공식 로고의 미리보기만 확인할 수 있습니다. 원본 파일과 상세 사용 규정은 협력 기업 확인 후 제공합니다.</p></div><div className="ci-preview-grid"><article><div className="ci-preview light"><img src="/kihc-logo-horizontal.png" alt="KIHC 가로형 공식 로고 미리보기" /></div><h3>가로형 로고</h3><p>홈페이지와 일반 문서에 사용하는 기본 조합의 미리보기입니다.</p></article><article><div className="ci-preview dark"><img src="/kihc-logo-horizontal.png" alt="어두운 배경의 KIHC 공식 로고 미리보기" /></div><h3>어두운 배경 적용</h3><p>어두운 배경에서의 로고 표시 예시입니다.</p></article></div><RestrictedDetailGate itemName="KIHC CI 원본 및 사용 지침" description="CI 원본 파일, 색상값, 최소 사용 크기와 금지 규정은 협력 기업 전용으로 제공합니다." /></div></section></main><Footer /></>;
}
