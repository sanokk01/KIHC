import { RestrictedContentInquiry } from "./RestrictedContentInquiry";

export function RestrictedDetailGate({ itemName, description = "상세 정보와 원본 자료는 협력 기업 전용으로 제공됩니다." }: { itemName: string; description?: string }) {
  return <section className="restricted-detail-gate" aria-labelledby="restricted-detail-title"><div className="restricted-preview" aria-hidden="true"><span /><span /><span /><span /></div><div className="restricted-gate-copy"><p className="eyebrow">Restricted Content</p><h2 id="restricted-detail-title">협력 기업 전용 상세자료</h2><p>{description}<br />현재는 외부 기업 인증이 연결되지 않아 문의를 통해 열람 권한을 확인합니다.</p><RestrictedContentInquiry itemName={itemName} /></div></section>;
}
