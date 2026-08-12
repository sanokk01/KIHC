import type { AdminUser } from "../lib/admin-auth";
import { logoutAdminAction } from "../lib/admin-auth-actions";
import { AppLink as Link } from "./AppLink";
import { Logo } from "./Logo";

const navigation = [
  { label: "Dashboard", href: "/adminpage1", icon: "D" },
  { label: "연구회 소식", href: "/adminpage1/news", icon: "N" },
  { label: "연구정책자료", href: "/adminpage1/research", icon: "R" },
  { label: "홍보물 관리", href: "/adminpage1/promotions", icon: "M" },
  { label: "팝업 관리", href: "/adminpage1/popup", icon: "P" },
  { label: "KIHC 소개 관리", href: "/adminpage1/about", icon: "A" },
  { label: "사이트 설정", href: "/adminpage1/settings", icon: "S" },
];

export function AdminShell({ children, user, active = "Dashboard" }: { children: React.ReactNode; user: AdminUser; active?: string }) {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Logo compact />
        <p className="admin-label">CONTENT MANAGEMENT</p>
        <nav aria-label="관리자 메뉴">
          {navigation.map((item) => <Link prefetch={false} className={active === item.label ? "active" : ""} href={item.href} key={item.href}><span>{item.icon}</span>{item.label}</Link>)}
        </nav>
        <div className="admin-sidebar-actions">
          <Link prefetch={false} href="/">공개 사이트로 이동</Link>
          <form action={logoutAdminAction}><button type="submit">로그아웃</button></form>
        </div>
      </aside>
      <div className="admin-workspace">
        <header className="admin-topbar"><span>KIHC Content Management</span><div className="admin-user"><span>{user.displayName}</span><b>AD</b></div></header>
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
