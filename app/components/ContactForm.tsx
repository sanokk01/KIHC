"use client";

import { FormEvent, useState } from "react";

const CONTACT_EMAIL = "annjae52@gmail.com";

export function ContactForm({ isEn = false }: { isEn?: boolean }) {
  const [message, setMessage] = useState("");
  const dict = {
    formEyebrow: isEn ? "Tell us about your project" : "문의 내용 보내기",
    formTitle: isEn ? "Start a conversation with KIHC" : "KIHC와 협업을 시작해 보세요",
    formDesc: isEn ? "Complete the form and your email app will open with the details filled in." : "내용을 작성하면 대표 이메일로 보낼 수 있도록 메일 앱이 열립니다.",
    typeLabel: isEn ? "Inquiry Type" : "문의 유형",
    typeGeneral: isEn ? "General Inquiry" : "일반 문의",
    typeResearch: isEn ? "Research Partnership / Consulting" : "연구 제휴 및 용역",
    typeSeminar: isEn ? "Seminar / Invitation" : "강연 및 세미나 초청",
    typePress: isEn ? "Press / Media" : "언론 홍보",
    nameLabel: isEn ? "Name" : "성명",
    namePlaceholder: isEn ? "Enter your name" : "성명을 입력하세요",
    emailLabel: isEn ? "Email" : "이메일",
    emailPlaceholder: isEn ? "example@email.com" : "example@email.com",
    orgLabel: isEn ? "Organization" : "소속",
    orgPlaceholder: isEn ? "Enter your organization" : "소속을 입력하세요",
    posLabel: isEn ? "Position / Title" : "직급",
    posPlaceholder: isEn ? "Enter your position" : "직급을 입력하세요",
    msgLabel: isEn ? "Message" : "문의사항",
    msgPlaceholder: isEn ? "Enter your message" : "문의 내용을 입력하세요",
    submitBtn: isEn ? "Continue in email" : "이메일 문의 작성",
    privacyLabel: isEn ? "I agree to the collection and use of personal information." : "개인정보 수집 및 이용에 동의합니다.",
    readyMsg: isEn ? "Your email app is opening. Please review the message and send it." : "메일 앱이 열리면 내용을 확인한 뒤 전송해 주세요.",
    privacyHelp: isEn ? "The website does not store your form data." : "작성 내용은 웹사이트에 저장되지 않습니다.",
  };

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const data = new FormData(form);
    const inquiryType = String(data.get("inquiryType") ?? "general");
    const inquiryLabels: Record<string, string> = {
      general: dict.typeGeneral,
      research: dict.typeResearch,
      seminar: dict.typeSeminar,
      press: dict.typePress,
    };
    const subject = `[KIHC ${isEn ? "Inquiry" : "문의"}] ${inquiryLabels[inquiryType] ?? dict.typeGeneral}`;
    const body = [
      `${dict.typeLabel}: ${inquiryLabels[inquiryType] ?? dict.typeGeneral}`,
      `${dict.nameLabel}: ${String(data.get("name") ?? "").trim()}`,
      `${dict.emailLabel}: ${String(data.get("email") ?? "").trim()}`,
      `${dict.orgLabel}: ${String(data.get("organization") ?? "").trim() || "-"}`,
      `${dict.posLabel}: ${String(data.get("position") ?? "").trim() || "-"}`,
      "",
      `${dict.msgLabel}:`,
      String(data.get("message") ?? "").trim(),
    ].join("\n");

    setMessage(dict.readyMsg);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="contact-form-heading">
        <span>{dict.formEyebrow}</span>
        <h2>{dict.formTitle}</h2>
        <p>{dict.formDesc}</p>
      </div>
      <label>
        <span>{dict.typeLabel} <b>*</b></span>
        <select name="inquiryType" required defaultValue="">
          <option value="" disabled>{isEn ? "Select Inquiry Type" : "문의 유형을 선택하세요"}</option>
          <option value="general">{dict.typeGeneral}</option>
          <option value="research">{dict.typeResearch}</option>
          <option value="seminar">{dict.typeSeminar}</option>
          <option value="press">{dict.typePress}</option>
        </select>
      </label>
      <div className="form-row two-cols">
        <label><span>{dict.nameLabel} <b>*</b></span><input name="name" required placeholder={dict.namePlaceholder} /></label>
        <label><span>{dict.emailLabel} <b>*</b></span><input name="email" type="email" required placeholder={dict.emailPlaceholder} /></label>
      </div>
      <div className="form-row two-cols">
        <label><span>{dict.orgLabel}</span><input name="organization" placeholder={dict.orgPlaceholder} /></label>
        <label><span>{dict.posLabel}</span><input name="position" placeholder={dict.posPlaceholder} /></label>
      </div>
      <label><span>{dict.msgLabel} <b>*</b></span><textarea name="message" required rows={6} placeholder={dict.msgPlaceholder} /></label>
      <label className="checkbox-label">
        <input type="checkbox" required name="privacy" />
        <span>{dict.privacyLabel}<small>{dict.privacyHelp}</small></span>
      </label>
      <div className="form-submit">
        <button className="button button-primary" type="submit">{dict.submitBtn}</button>
        {message ? <p role="status" aria-live="polite">{message}</p> : null}
      </div>
    </form>
  );
}
