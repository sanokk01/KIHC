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
    noteBody: isEn ? "Currently in the screen configuration stage. The entered content will not be sent or saved." : "현재는 화면 구성 단계로, 작성 내용은 전송되거나 저장되지 않습니다.",
    mapTitle: isEn ? "Location" : "오시는 길",
    addressTitle: isEn ? "Address" : "주소",
    addressDesc: isEn ? "Seoul, Republic of Korea" : "서울특별시 중구 세종대로 00",
    deptTitle: isEn ? "Departments" : "부서별 연락처",
    dept1: isEn ? "Research Collaboration" : "연구협력팀",
    dept2: isEn ? "PR / Media" : "대외홍보팀",
    dept3: isEn ? "General Affairs" : "경영기획팀"
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
              <div style={{ marginTop: "48px" }}>
                <h3 style={{ fontSize: "18px", color: "var(--navy-950)", marginBottom: "16px", fontWeight: 750 }}>{dict.mapTitle}</h3>
                <div style={{ width: "100%", height: "200px", background: "#e2e8f0", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", marginBottom: "16px" }}>
                  [ Map Placeholder ]
                </div>
                <p style={{ margin: "0 0 8px", fontSize: "14px", fontWeight: 700, color: "var(--navy-900)" }}>{dict.addressTitle}</p>
                <p style={{ margin: "0 0 32px", fontSize: "14px", color: "var(--muted)" }}>{dict.addressDesc}</p>
                
                <h3 style={{ fontSize: "18px", color: "var(--navy-950)", marginBottom: "16px", fontWeight: 750 }}>{dict.deptTitle}</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                  <li style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", borderBottom: "1px dashed var(--line)", paddingBottom: "8px" }}>
                    <span style={{ color: "var(--navy-900)", fontWeight: 600 }}>{dict.dept1}</span>
                    <span style={{ color: "var(--muted)" }}>research@kihc.org</span>
                  </li>
                  <li style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", borderBottom: "1px dashed var(--line)", paddingBottom: "8px" }}>
                    <span style={{ color: "var(--navy-900)", fontWeight: 600 }}>{dict.dept2}</span>
                    <span style={{ color: "var(--muted)" }}>pr@kihc.org</span>
                  </li>
                  <li style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                    <span style={{ color: "var(--navy-900)", fontWeight: 600 }}>{dict.dept3}</span>
                    <span style={{ color: "var(--muted)" }}>admin@kihc.org</span>
                  </li>
                </ul>
              </div>
            </aside>
            <ContactForm isEn={isEn} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
