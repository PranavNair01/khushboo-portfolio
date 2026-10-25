"use client";

import { useActionState } from "react";
import { sendMessage, type ContactState } from "./actions";
import s from "./page.module.css";

const fields = [
  { name: "name", label: "Your name", type: "text", autoComplete: "name" },
  { name: "email", label: "Your email", type: "email", autoComplete: "email" },
] as const;

export function ContactForm() {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendMessage, { status: "idle" });

  if (state.status === "sent") {
    return (
      <div className={s.sent} role="status">
        <p className="display">
          Thank you. <em>Message received.</em>
        </p>
        <p>I&rsquo;ll get back to you soon.</p>
      </div>
    );
  }

  return (
    <form action={action} className={s.form} noValidate>
      {fields.map((f) => (
        <label key={f.name} className={s.field}>
          <span className="label">{f.label}</span>
          <input
            name={f.name}
            type={f.type}
            autoComplete={f.autoComplete}
            defaultValue={state.values?.[f.name]}
            aria-invalid={!!state.fieldErrors?.[f.name]}
            required
          />
          {state.fieldErrors?.[f.name] && <span className={s.error}>{state.fieldErrors[f.name]}</span>}
        </label>
      ))}
      <label className={s.field}>
        <span className="label">Message</span>
        <textarea
          name="message"
          rows={5}
          defaultValue={state.values?.message}
          aria-invalid={!!state.fieldErrors?.message}
          required
        />
        {state.fieldErrors?.message && <span className={s.error}>{state.fieldErrors.message}</span>}
      </label>
      {/* Honeypot: hidden from people, irresistible to bots. */}
      <input name="company" tabIndex={-1} autoComplete="off" className="visually-hidden" aria-hidden />

      {state.message && (
        <p className={s.error} role="alert">
          {state.message}
        </p>
      )}
      <button type="submit" className={s.submit} disabled={pending}>
        {pending ? "Sending…" : "Send message"} <span aria-hidden>→</span>
      </button>
    </form>
  );
}
