"use client";

import { AppLink as Link } from "./AppLink";

export function AdminLoginForm() {
  return (
    <form className="admin-login-form" onSubmit={(event) => event.preventDefault()}>
      <label><span>아이디</span><input name="id" autoComplete="username" placeholder="관리자 아이디" /></label>
      <label><span>비밀번호</span><input name="password" type="password" autoComplete="current-password" placeholder="비밀번호" /></label>
      <Link prefetch={false} className="admin-login-button" href="/adminpage1">개발 화면으로 입장</Link>
      <p>현재는 인증이 연결되지 않은 개발용 화면입니다.</p>
    </form>
  );
}
