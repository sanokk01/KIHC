import type { AnchorHTMLAttributes, ReactNode } from "react";

type AppLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  prefetch?: boolean;
  children: ReactNode;
};

export function AppLink({ prefetch, children, ...props }: AppLinkProps) {
  void prefetch;
  return <a {...props}>{children}</a>;
}
