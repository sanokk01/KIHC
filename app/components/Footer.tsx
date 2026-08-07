import Link from "next/link";
import { contentRepository } from "../lib/content";
import { Logo } from "./Logo";

export function Footer() {
  const settings = contentRepository.getSettings();
  return (
    <footer className="site-footer">
      <div className="container footer-top">
        <Logo />
        <div className="footer-info">
          <p>{settings.footerInformation}</p>
          <p>{settings.email}</p>
        </div>
        <div className="footer-links">
          <Link prefetch={false} href="/contact">개인정보처리방침</Link>
          <Link prefetch={false} href="/contact">자료 이용·저작권 안내</Link>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 KIHC. All rights reserved.</span>
        <Link prefetch={false} href="/admin/login">관리자</Link>
      </div>
    </footer>
  );
}
