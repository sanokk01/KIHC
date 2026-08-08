import { cookies } from "next/headers";
import { AppLink as Link } from "./AppLink";
import { Logo } from "./Logo";

export async function Footer() {
  const cookieStore = await cookies();
  const isEn = cookieStore.get("kihc-language")?.value === "en";

  const dict = {
    desc: isEn ? "KIHC researches the essential thinking capabilities humans need in the AI era and proposes trusted policy solutions for sustainable growth." : "KIHC는 AI 시대에 필요한 인간 고유의 사고 역량을 연구하고, 지속 가능한 성장을 위한 신뢰할 수 있는 정책 솔루션을 제안합니다.",
    addressTitle: isEn ? "Contact & Address" : "연락처 및 주소",
    address: isEn ? "Seoul, Republic of Korea (Detailed address will be updated)" : "서울특별시 (상세 주소 추후 업데이트 예정)",
    email: "info@kihc.org (TBD)",
    linksTitle: isEn ? "Quick Links" : "주요 링크",
    link1: isEn ? "Privacy Policy" : "개인정보처리방침",
    link2: isEn ? "Terms of Use" : "이용약관",
    link3: isEn ? "Research Publications" : "연구 정책 자료",
    link4: isEn ? "Contact Us" : "제휴 문의"
  };

  return (
    <footer className="site-footer">
      <div className="container footer-top">
        <div className="footer-brand">
          <Logo />
          <p className="footer-desc">{dict.desc}</p>
        </div>
        <div className="footer-address">
          <strong>{dict.addressTitle}</strong>
          <p>{dict.address}</p>
          <p>{dict.email}</p>
        </div>
        <div className="footer-links-col">
          <strong>{dict.linksTitle}</strong>
          <Link prefetch={false} href="/contact">{dict.link1}</Link>
          <Link prefetch={false} href="/contact">{dict.link2}</Link>
          <Link prefetch={false} href="/research">{dict.link3}</Link>
          <Link prefetch={false} href="/contact">{dict.link4}</Link>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} KIHC (Korea Institute of Human Capability). All rights reserved.</p>
      </div>
    </footer>
  );
}
