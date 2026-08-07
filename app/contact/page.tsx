import type { Metadata } from "next";
import { ContactForm } from "../components/ContactForm";
import { Footer } from "../components/Footer";
import { PageHero } from "../components/PageHero";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = { title: "문의" };

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageHero eyebrow="Contact" title="문의하기" description="연구협력 · 논문 작업 등 KIHC와 함께 나누고 싶은 이야기를 남겨주세요." />
        <section className="section contact-section">
          <div className="container contact-layout">
            <aside><p className="eyebrow">Get in Touch</p><h2>연구와 협력을 위한<br />대화를 기다립니다.</h2><p>문의 내용과 연락처를 남겨주시면 접수 기능이 준비된 이후 안내드릴 예정입니다.</p><div className="contact-note"><strong>안내</strong><span>현재는 화면 구성 단계로, 작성 내용은 전송되거나 저장되지 않습니다.</span></div></aside>
            <ContactForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
