"use client";

import { useActionState } from "react";
import { loginAdminAction, logoutAdminAction, type AdminAuthState } from "../lib/admin-auth-actions";
import { AppLink as Link } from "./AppLink";

const initialState: AdminAuthState = { error: "" };

export function AdminLoginForm({
  authenticated = false,
  databaseError = "",
  returnTo = "/adminpage1",
}: {
  authenticated?: boolean;
  databaseError?: string;
  returnTo?: string;
}) {
  const [state, formAction, pending] = useActionState(loginAdminAction, initialState);

  if (authenticated) {
    return (
      <div className="admin-login-form">
        <Link prefetch={false} className="admin-login-button" href={returnTo}>관리자 화면으로 이동</Link>
        <form action={logoutAdminAction}><button className="admin-login-secondary" type="submit">현재 계정에서 로그아웃</button></form>
      </div>
    );
  }

  return (
    <form className="admin-login-form" action={formAction}>
      <input type="hidden" name="returnTo" value={returnTo} />
      <label>
        <span>관리자 아이디</span>
        <input name="loginId" type="text" autoComplete="username" minLength={4} maxLength={50} required disabled={pending || Boolean(databaseError)} />
      </label>
      <label>
        <span>비밀번호</span>
        <input name="password" type="password" autoComplete="current-password" required disabled={pending || Boolean(databaseError)} />
      </label>
      {(databaseError || state.error) && <p className="admin-auth-error" role="alert">{databaseError || state.error}</p>}
      <button type="submit" className="admin-login-button" disabled={pending || Boolean(databaseError)}>
        {pending ? "로그인 중..." : "로그인"}
      </button>
      <p>등록된 단일 관리자 계정으로만 접속할 수 있습니다.</p>
    </form>
  );
}
