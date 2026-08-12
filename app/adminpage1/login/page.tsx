import type { Metadata } from "next";
import { hasStoredAdminAccount } from "../../../db/admin-auth-store";
import { AppLink as Link } from "../../components/AppLink";
import { AdminLoginForm } from "../../components/AdminLoginForm";
import { Logo } from "../../components/Logo";
import { getAdminUser, safeAdminReturnTo } from "../../lib/admin-auth";
import { getDatabaseStatus } from "../../lib/storage-status";

export const metadata: Metadata = { title: "관리자 로그인" };
export const dynamic = "force-dynamic";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ return_to?: string }>;
}) {
  const returnTo = safeAdminReturnTo((await searchParams).return_to);
  const user = await getAdminUser();
  const databaseStatus = await getDatabaseStatus();
  let databaseError = databaseStatus.connected ? "" : databaseStatus.message;

  if (databaseStatus.connected) {
    try {
      if (!(await hasStoredAdminAccount())) databaseError = "관리자 계정이 없습니다. Supabase 보완 SQL을 먼저 적용해 주세요.";
    }
    catch { databaseError = "관리자 인증 테이블을 확인할 수 없습니다. Supabase 마이그레이션을 먼저 적용해 주세요."; }
  }

  return (
    <main className="admin-login-page">
      <Link prefetch={false} className="back-site" href="/">공개 사이트로 돌아가기</Link>
      <section className="admin-login-panel">
        <Logo />
        <div className="admin-login-heading">
          <p>KIHC ADMIN</p>
          <h1>관리자 로그인</h1>
          <span>등록된 단일 관리자 계정으로 콘텐츠 관리 화면에 접속합니다.</span>
        </div>
        <AdminLoginForm
          authenticated={Boolean(user)}
          databaseError={databaseError}
          returnTo={returnTo}
        />
      </section>
    </main>
  );
}
