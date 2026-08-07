import type { Metadata } from "next";
import Link from "next/link";
import { AdminLoginForm } from "../../components/AdminLoginForm";
import { Logo } from "../../components/Logo";

export const metadata: Metadata = { title: "관리자 로그인" };

export default function AdminLoginPage() {
  return (
    <main className="admin-login-page">
      <Link prefetch={false} className="back-site" href="/">← 사이트로 돌아가기</Link>
      <section className="admin-login-panel">
        <Logo />
        <div className="admin-login-heading"><p>KIHC ADMIN</p><h1>관리자 로그인</h1><span>콘텐츠 관리 화면에 접속합니다.</span></div>
        <AdminLoginForm />
      </section>
    </main>
  );
}
