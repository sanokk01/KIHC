"use client";

import { AppLink as Link } from "./AppLink";

export function AdminLoginForm({ authenticated = false }: { authenticated?: boolean }) {
  return (
    <div className="admin-login-form">
      {authenticated
        ? <Link prefetch={false} className="admin-login-button" href="/adminpage1">로컬 관리자 화면으로 이동</Link>
        : <button type="button" className="admin-login-button" disabled>운영 관리자 인증 연결 대기</button>}
      <p>localhost에서는 개발용 관리자로 접속합니다. 실제 도메인 배포 전 팀 인증 방식을 연결하세요.</p>
    </div>
  );
}
