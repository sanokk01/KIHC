"use client";

import { FormEvent, useState } from "react";
import { submitContactInquiry } from "../lib/contact";

export function ContactForm() {
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
      setMessage(result.message);
    } catch {
      setMessage("문의 접수 상태를 확인하지 못했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="form-row two-cols">
        <label><span>성명 <b>*</b></span><input name="name" required placeholder="성명을 입력하세요" /></label>
        <label><span>이메일 <b>*</b></span><input name="email" type="email" required placeholder="example@email.com" /></label>
      </div>
      <label><span>소속</span><input name="organization" placeholder="소속을 입력하세요" /></label>
      <label><span>문의사항 <b>*</b></span><textarea name="message" required rows={8} placeholder="문의 내용을 입력하세요" /></label>
      <div className="form-submit"><button className="button button-primary" type="submit" disabled={submitting}>{submitting ? "확인 중..." : "문의하기"}</button>{message ? <p role="status" aria-live="polite">{message}</p> : null}</div>
    </form>
  );
}
