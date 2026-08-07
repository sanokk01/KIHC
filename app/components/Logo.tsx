import Link from "next/link";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link prefetch={false} className={`logo ${compact ? "logo-compact" : ""}`} href="/" aria-label="KIHC 홈">
      <span className="logo-mark" aria-hidden="true">K</span>
      <span className="logo-type">
        <strong>KIHC</strong>
        {!compact ? <small>한국인재역량연구회</small> : null}
      </span>
    </Link>
  );
}
