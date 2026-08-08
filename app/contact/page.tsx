import type { Metadata } from "next";
import { cookies } from "next/headers";
import { ContactForm } from "../components/ContactForm";
import { Footer } from "../components/Footer";
import { PageHero } from "../components/PageHero";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = { title: "문의 | KIHC 한국인재역량연구회" };

export default async function ContactPage() {
  const cookieStore = await cookies();
  const isEn = cookieStore.get("kihc-language")?.value === "en";

  const dict = {
    title: isEn ? "Contact Us" : "문의하기",
    desc: isEn ? "Leave us a message for research partnerships, academic collaborations, and more." : "연구협력 · 논문 작업 등 KIHC와 함께 나누고 싶은 이야기를 남겨주세요.",
    heading: isEn ? "We look forward to\nconversations for research and cooperation." : "연구와 협력을 위한\n대화를 기다립니다.",
    subText: isEn ? "If you leave your inquiry and contact information, we will guide you after the reception function is ready." : "문의 내용과 연락처를 남겨주시면 접수 기능이 준비된 이후 안내드릴 예정입니다.",
    noteTitle: isEn ? "Notice" : "안내",
    noteBody: isEn ? "Currently in the screen configuration stage. The entered content will not be sent or saved." : "현재는 화면 구성 단계로, 작성 내용은 전송되거나 저장되지 않습니다."
  };

  return (
    <>
      <SiteHeader />
      <main>
        <PageHero eyebrow="Contact" title={dict.title} description={dict.desc} />
        <section className="section contact-section">
          <div className="container contact-layout">
            <aside>
              <p className="eyebrow">Get in Touch</p>
              <h2 style={{ whiteSpace: "pre-line" }}>{dict.heading}</h2>
              <p>{dict.subText}</p>
              <div className="contact-note">
                <strong>{dict.noteTitle}</strong>
                <span>{dict.noteBody}</span>
              </div>
            </aside>
            <ContactForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
