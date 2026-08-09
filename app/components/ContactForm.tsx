"use client";

import { FormEvent, useState } from "react";
import { submitContactInquiry } from "../lib/contact";

export function ContactForm({ isEn = false }: { isEn?: boolean }) {
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const dict = {
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
    submitBtn: isEn ? "Submit Inquiry" : "문의하기",
    submittingBtn: isEn ? "Submitting..." : "확인 중...",
    privacyLabel: isEn ? "I agree to the collection and use of personal information." : "개인정보 수집 및 이용에 동의합니다.",
    errorMsg: isEn ? "Failed to verify submission status. Please try again later." : "문의 접수 상태를 확인하지 못했습니다. 잠시 후 다시 시도해 주세요.",
    successMsg: isEn ? "Your inquiry has been submitted successfully." : "문의가 성공적으로 접수되었습니다." // Though server might override this
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const data = new FormData(form);
    setSubmitting(true);
    try {
      const result = await submitContactInquiry({
        name: String(data.get("name") ?? "").trim(),
        email: String(data.get("email") ?? "").trim(),
        organization: String(data.get("organization") ?? "").trim() || undefined,
        message: String(data.get("message") ?? "").trim(),
      });
      // Ideally server returns a translated message, or we override it here based on success.
      setMessage(isEn && result.message.includes("접수") ? dict.successMsg : result.message);
    } catch {
      setMessage(dict.errorMsg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
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
      <label className="checkbox-label" style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "12px", fontSize: "13px", color: "#64748b" }}>
        <input type="checkbox" required name="privacy" style={{ width: "16px", height: "16px" }} />
        <span>{dict.privacyLabel}</span>
      </label>
      <div className="form-submit" style={{ marginTop: "24px" }}>
        <button className="button button-primary" type="submit" disabled={submitting}>{submitting ? dict.submittingBtn : dict.submitBtn}</button>
        {message ? <p role="status" aria-live="polite" style={{ marginTop: "12px", color: "#3b82f6", fontWeight: "600" }}>{message}</p> : null}
      </div>
    </form>
  );
}
