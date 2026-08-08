import { cookies } from "next/headers";
import { AppLink as Link } from "./AppLink";
import { Logo } from "./Logo";

export async function Footer() {
  const cookieStore = await cookies();
  const isEn = cookieStore.get("kihc-language")?.value === "en";

  const dict = {
    corp: isEn ? "KIHC (Korea Institute of Human Capability)" : "한국인재역량연구회",
    ceo: isEn ? "President: OOO" : "이사장: OOO",
    address: isEn ? "Seoul, Republic of Korea" : "서울특별시 중구 세종대로 00",
    tel: "T. 02-000-0000",
    fax: "F. 02-000-0000",
    email: "E. info@kihc.org",
    link1: isEn ? "Privacy Policy" : "개인정보처리방침",
    link2: isEn ? "Terms of Use" : "이용약관",
    link3: isEn ? "Contact Us" : "이메일무단수집거부"
  };

  return (
    <footer style={{ padding: "48px 0 32px", background: "#0a192f", borderTop: "1px solid #1b4570", color: "#94a3b8" }}>
      <div className="container" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        
        {/* Top: Links */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "24px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display: "flex", gap: "24px", fontSize: "14px", fontWeight: "700", color: "#e2e8f0" }}>
            <Link prefetch={false} href="/contact" style={{ color: "#3b82f6" }}>{dict.link1}</Link>
            <Link prefetch={false} href="/contact">{dict.link2}</Link>
            <Link prefetch={false} href="/contact">{dict.link3}</Link>
          </div>
        </div>

        {/* Bottom: Info & Logo */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "32px" }}>
          <div>
            <div style={{ marginBottom: "16px", filter: "brightness(0) invert(1)" }}><Logo /></div>
            <div style={{ fontSize: "13px", lineHeight: "1.7", color: "#64748b" }}>
              <span style={{ color: "#94a3b8", fontWeight: "600", marginRight: "12px" }}>{dict.corp}</span>
              <span style={{ marginRight: "12px" }}>{dict.ceo}</span>
              <span>{dict.address}</span>
              <br />
              <span style={{ marginRight: "12px" }}>{dict.tel}</span>
              <span style={{ marginRight: "12px" }}>{dict.fax}</span>
              <span>{dict.email}</span>
            </div>
          </div>
          <div style={{ fontSize: "12px", color: "#475569" }}>
            © {new Date().getFullYear()} KIHC. All rights reserved.
          </div>
        </div>

      </div>
    </footer>
  );
}
