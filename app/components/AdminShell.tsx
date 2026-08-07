import Link from "next/link";
import { Logo } from "./Logo";

const navigation = [
  { label: "Dashboard", href: "/admin", icon: "D" },
  { label: "연구회 소식", href: "/admin/news", icon: "N" },
  { label: "연구정책자료", href: "/admin/research", icon: "R" },
  { label: "팝업 관리", href: "/admin/popup", icon: "P" },
  { label: "KIHC 소개 관리", href: "/admin/about", icon: "A" },
  { label: "사이트 설정", href: "/admin/settings", icon: "S" },
];

export function AdminShell({ children, active = "Dashboard" }: { children: React.ReactNode; active?: string }) {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Logo compact />
        <p className="admin-label">CONTENT MANAGEMENT</p>
        <nav aria-label="관리자 메뉴">
          {navigation.map((item) => <Link prefetch={false} className={active === item.label ? "active" : ""} href={item.href} key={item.href}><span>{item.icon}</span>{item.label}</Link>)}
        </nav>
        <Link prefetch={false} className="admin-logout" href="/admin/login">로그아웃</Link>
      </aside>
      <div className="admin-workspace">
        <header className="admin-topbar"><span>KIHC Content Management</span><div className="admin-user"><span>관리자</span><b>AD</b></div></header>
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
