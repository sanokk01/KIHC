import { AppLink as Link } from "./AppLink";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link prefetch={false} className={`logo ${compact ? "logo-compact" : ""}`} href="/" aria-label="KIHC 홈">
      <span className="logo-image" aria-hidden="true" />
    </Link>
  );
}
