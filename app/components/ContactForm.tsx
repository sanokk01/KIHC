"use client";

import { FormEvent, useState } from "react";

export function ContactForm() {
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setMessage("문의 접수 기능은 현재 준비 중입니다.");
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="form-row two-cols">
        <label><span>성명 <b>*</b></span><input name="name" required placeholder="성명을 입력하세요" /></label>
        <label><span>이메일 <b>*</b></span><input name="email" type="email" required placeholder="example@email.com" /></label>
      </div>
      <label><span>소속</span><input name="organization" placeholder="소속을 입력하세요" /></label>
      <label><span>문의사항 <b>*</b></span><textarea name="message" required rows={8} placeholder="문의 내용을 입력하세요" /></label>
      <div className="form-submit"><button className="button button-primary" type="submit">문의하기</button>{message ? <p role="status">{message}</p> : null}</div>
    </form>
  );
}
