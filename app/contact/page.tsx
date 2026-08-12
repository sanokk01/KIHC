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
    desc: isEn ? "Connect with KIHC for research, consulting, seminars, and academic collaboration." : "연구·자문·강연·학술 협력까지, KIHC와 함께할 프로젝트를 제안해 주세요.",
    heading: isEn ? "Ideas become stronger\nthrough the right conversation." : "좋은 질문이\n의미 있는 협력이 됩니다.",
    subText: isEn ? "Tell us about your goals and context. We will review the best way KIHC can contribute." : "필요한 목표와 현재 상황을 알려주시면 KIHC가 함께할 수 있는 방향을 검토하겠습니다.",
    scopeTitle: isEn ? "Ways we can work together" : "이런 협력을 제안해 주세요",
    scopes: isEn
      ? [
          ["01", "Research & Assessment", "Joint research, competency models, and assessment design"],
          ["02", "Advisory & Consulting", "Human-capability strategy and organizational application"],
          ["03", "Seminars & Lectures", "Academic events, invited talks, and educational programs"],
        ]
      : [
          ["01", "연구·진단 설계", "공동 연구, 역량 모델 및 진단 도구 개발"],
          ["02", "자문·컨설팅", "인재역량 전략과 교육·조직 현장 적용"],
          ["03", "강연·세미나", "학술행사, 초청 강연 및 교육 프로그램"],
        ],
    directTitle: isEn ? "Prefer a direct conversation?" : "빠르게 상의하고 싶으신가요?",
    directDesc: isEn ? "Contact the KIHC representative directly by email or phone." : "대표 이메일 또는 전화로 바로 문의하실 수 있습니다.",
    emailLabel: isEn ? "Email" : "이메일",
    phoneLabel: isEn ? "Phone" : "전화",
    processTitle: isEn ? "What happens next" : "문의 진행 방식",
    process: isEn ? ["Send your inquiry", "We review the context", "We discuss the next step"] : ["문의 내용 작성", "협력 가능성 검토", "진행 방향 협의"],
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
              <h2 className="contact-heading">{dict.heading}</h2>
              <p className="contact-lead">{dict.subText}</p>

              <section className="contact-scopes" aria-labelledby="contact-scope-title">
                <h3 id="contact-scope-title">{dict.scopeTitle}</h3>
                <div className="contact-scope-list">
                  {dict.scopes.map(([number, title, description]) => (
                    <article key={number}>
                      <span>{number}</span>
                      <div>
                        <strong>{title}</strong>
                        <p>{description}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="contact-direct-card" aria-labelledby="contact-direct-title">
                <p className="eyebrow">Direct Contact</p>
                <h3 id="contact-direct-title">{dict.directTitle}</h3>
                <p>{dict.directDesc}</p>
                <div className="contact-methods">
                  <a href="mailto:annjae52@gmail.com">
                    <span>{dict.emailLabel}</span>
                    <strong>annjae52@gmail.com</strong>
                  </a>
                  <a href="tel:+821068396168">
                    <span>{dict.phoneLabel}</span>
                    <strong>+82 10-6839-6168</strong>
                  </a>
                </div>
              </section>

              <section className="contact-process" aria-labelledby="contact-process-title">
                <h3 id="contact-process-title">{dict.processTitle}</h3>
                <ol>
                  {dict.process.map((step, index) => (
                    <li key={step}><span>{index + 1}</span><strong>{step}</strong></li>
                  ))}
                </ol>
              </section>
            </aside>
            <ContactForm isEn={isEn} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
