import { cookies } from "next/headers";
import { AppLink as Link } from "./AppLink";
import { Logo } from "./Logo";
import { getAdminSingleton } from "../lib/admin-data";

export async function Footer() {
  const cookieStore = await cookies();
  const isEn = cookieStore.get("kihc-language")?.value === "en";

  const settings = await getAdminSingleton("settings");

  const dict = {
    corp: isEn ? "Korea Institute of Human Capability (KIHC)" : (settings.siteName || "사단법인 한국인재역량연구회"),
    ceo: isEn ? "Representative: 이수진" : "대표자: 이수진",
    tel: isEn ? "Main phone: +82-10-6839-6168" : "대표 전화: +82-10-6839-6168",
    email: isEn ? "Main email: annjae52@gmail.com" : "대표 이메일: annjae52@gmail.com",
    bizNo: isEn ? "Nonprofit Registration No.: 932-82-*****" : "비영리 등록번호: 932-82-*****",
    privacyInfo: isEn ? "Privacy Officer: 이수진" : "개인정보보호책임자: 이수진",
    link1: isEn ? "Privacy Policy" : "개인정보처리방침",
    link2: isEn ? "Terms of Use" : "이용약관",
    link3: isEn ? "Anti-Spam Policy" : "이메일무단수집거부",
    registrationInquiry: isEn ? "Request full registration number" : "등록번호 필요 시 문의"
  };

  return (
    <footer className="site-footer" style={{ padding: "48px 0 32px", background: "#0a192f", borderTop: "1px solid #1b4570", color: "#94a3b8" }}>
      <div className="container" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        
        {/* Top: Links */}
        <div className="footer-link-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "24px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <div className="footer-primary-links" style={{ display: "flex", gap: "24px", fontSize: "14px", fontWeight: "700", color: "#e2e8f0" }}>
            <Link prefetch={false} href="/contact" style={{ color: "#3b82f6" }}>{dict.link1}</Link>
            <Link prefetch={false} href="/contact">{dict.link2}</Link>
            <Link prefetch={false} href="/contact">{dict.link3}</Link>
          </div>
        </div>

        {/* Bottom: Info & Logo */}
        <div className="footer-info-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "32px" }}>
          <div className="footer-institution-info">
            <div style={{ marginBottom: "20px", filter: "brightness(0) invert(1)" }}><Logo /></div>
            <div className="footer-legal-info" style={{ fontSize: "13px", lineHeight: "1.8", color: "#64748b" }}>
              <strong>{dict.corp}</strong>
              <span>{dict.ceo}</span>
              <span>{dict.bizNo}</span>
              <a href="mailto:annjae52@gmail.com">{dict.email}</a>
              <a href="tel:+821068396168">{dict.tel}</a>
              <span>{dict.privacyInfo}</span>
            </div>
          </div>
          <div className="footer-family-block" style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "16px" }}>
            <a
              className="footer-registration-inquiry"
              href="mailto:annjae52@gmail.com?subject=KIHC%20비영리%20등록번호%20문의"
            >
              {dict.registrationInquiry}
            </a>
            <div style={{ fontSize: "12px", color: "#475569" }}>
              © {new Date().getFullYear()} KIHC. All rights reserved.
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
