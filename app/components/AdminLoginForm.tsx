"use client";

import { AppLink as Link } from "./AppLink";

export function AdminLoginForm({ authenticated = false }: { authenticated?: boolean }) {
  return (
    <div className="admin-login-form">
      <Link prefetch={false} className="admin-login-button" href={authenticated ? "/adminpage1" : "/signin-with-chatgpt?return_to=%2Fadminpage1"}>{authenticated ? "관리자 화면으로 이동" : "ChatGPT 계정으로 로그인"}</Link>
      <p>사이트에 접근 권한을 받은 팀원은 각자의 ChatGPT 계정으로 공동 관리할 수 있습니다.</p>
    </div>
  );
}
