import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "KIHC 한국인재역량연구회",
    template: "%s | KIHC",
  },
  description: "사람의 가능성과 지속 가능한 성장을 연구하는 한국인재역량연구회 공식 홈페이지",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    title: "KIHC 한국인재역량연구회",
    description: "사람의 가능성을 이해하고, 더 나은 성장을 연구합니다.",
    images: [{ url: "/og.png", width: 1728, height: 910, alt: "KIHC 한국인재역량연구회" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "KIHC 한국인재역량연구회",
    description: "사람의 가능성을 이해하고, 더 나은 성장을 연구합니다.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
