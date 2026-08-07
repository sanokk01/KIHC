export type AdminSection = "news" | "research" | "popup" | "about" | "settings";

export interface AdminContentRecord {
  id: string;
  slug?: string;
  title: string;
  publishedAt?: string;
  status?: "published" | "draft";
  imageUrl?: string;
  excerpt?: string;
  content?: string;
  author?: string;
  summary?: string;
  tableOfContents?: string;
  keywords?: string;
  link?: string;
  active?: boolean;
  startsAt?: string;
  endsAt?: string;
  chairmanMessage?: string;
  chairmanImageUrl?: string;
  organizationIntroduction?: string;
  organizationImageUrl?: string;
  purpose?: string;
  vision?: string;
  siteName?: string;
  footerInformation?: string;
  email?: string;
}
