import { cookies } from "next/headers";
import { AppLink as Link } from "./AppLink";
import { Logo } from "./Logo";
import { getAdminSingleton } from "../lib/admin-data";

export async function Footer() {
  const cookieStore = await cookies();
  const isEn = cookieStore.get("kihc-language")?.value === "en";
  const settings = await getAdminSingleton("settings");
  const savedEmail = typeof settings.email === "string" ? settings.email.trim() : "";
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(savedEmail) ? savedEmail : "annjae52@gmail.com";

  const dict = {
    corp: isEn ? "Korea Institute of Human Capability (KIHC)" : (settings.siteName || "사단법인 한국인재역량연구회"),
    description: isEn
      ? "Researching human potential and the conditions for sustainable growth."
      : "사람의 가능성과 지속 가능한 성장의 조건을 연구합니다.",
    ceoLabel: isEn ? "Representative" : "대표자",
    ceo: "이수진",
    telLabel: isEn ? "Main phone" : "대표 전화",
    tel: "+82-10-6839-6168",
    emailLabel: isEn ? "Main email" : "대표 이메일",
    bizNoLabel: isEn ? "Nonprofit Registration No." : "비영리 등록번호",
    bizNo: "932-82-*****",
    privacyLabel: isEn ? "Privacy Officer" : "개인정보보호책임자",
    privacy: "이수진",
    link1: isEn ? "Privacy Policy" : "개인정보처리방침",
    link2: isEn ? "Terms of Use" : "이용약관",
    link3: isEn ? "Anti-Spam Policy" : "이메일무단수집거부",
    registrationInquiry: isEn ? "Request the full number" : "전체 번호 문의",
  };

  return (
    <footer className="site-footer">
      <div className="container footer-shell">
        <div className="footer-main">
          <div className="footer-brand-block">
            <div className="footer-logo-wrap"><Logo /></div>
            <p>{dict.description}</p>
          </div>

          <dl className="footer-meta-grid">
            <div>
              <dt>{isEn ? "Organization" : "기관명"}</dt>
              <dd>{dict.corp}</dd>
            </div>
            <div>
              <dt>{dict.ceoLabel}</dt>
              <dd>{dict.ceo}</dd>
            </div>
            <div>
              <dt>{dict.emailLabel}</dt>
              <dd><a href={`mailto:${email}`}>{email}</a></dd>
            </div>
            <div>
              <dt>{dict.telLabel}</dt>
              <dd><a href="tel:+821068396168">{dict.tel}</a></dd>
            </div>
            <div>
              <dt>{dict.bizNoLabel}</dt>
              <dd className="footer-registration-row">
                <span>{dict.bizNo}</span>
                <a
                  className="footer-registration-inquiry"
                  href={`mailto:${email}?subject=KIHC%20비영리%20등록번호%20문의`}
                >
                  {dict.registrationInquiry}
                </a>
              </dd>
            </div>
            <div>
              <dt>{dict.privacyLabel}</dt>
              <dd>{dict.privacy}</dd>
            </div>
          </dl>
        </div>

        <div className="footer-bottom-row">
          <nav className="footer-primary-links" aria-label={isEn ? "Legal information" : "법적 고지"}>
            <Link prefetch={false} href="/contact">{dict.link1}</Link>
            <Link prefetch={false} href="/contact">{dict.link2}</Link>
            <Link prefetch={false} href="/contact">{dict.link3}</Link>
          </nav>
          <p>© {new Date().getFullYear()} KIHC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
