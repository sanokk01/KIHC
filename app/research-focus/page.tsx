import type { Metadata } from "next";
import { Footer } from "../components/Footer";
import { ResearchFocusContent } from "../components/ResearchFocusContent";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "연구와 핵심가치",
  description: "KIHC 한국인재역량연구회의 연구분야와 연구를 이끄는 핵심 가치를 소개합니다.",
};

export default async function ResearchFocusPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const parameters = await searchParams;
  const language = Array.isArray(parameters?.lang) ? parameters.lang[0] : parameters?.lang;
  const initialLocale = language === "en" ? "en" : "ko";
  return <><SiteHeader /><ResearchFocusContent initialLocale={initialLocale} useStoredPreference={!language} /><Footer /></>;
}
