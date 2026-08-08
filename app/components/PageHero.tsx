import { LanguageSwitcher } from "./LanguageSwitcher";

export function PageHero({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <section className="page-hero">
      <div className="container page-hero-inner">
        <LanguageSwitcher className="page-hero-lang" />
        <p className="eyebrow light">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </section>
  );
}

