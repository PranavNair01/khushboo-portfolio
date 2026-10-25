"use server";

export type ContactState = {
  status: "idle" | "sent" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"name" | "email" | "message", string>>;
  values?: { name: string; email: string; message: string };
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Sends the contact form to Khushboo's inbox through Resend's REST API.
// Needs RESEND_API_KEY and CONTACT_TO_EMAIL (the address the Resend account was created with).
export async function sendMessage(_prev: ContactState, form: FormData): Promise<ContactState> {
  const values = {
    name: String(form.get("name") ?? "").trim(),
    email: String(form.get("email") ?? "").trim(),
    message: String(form.get("message") ?? "").trim(),
  };

  // Bots fill every field, including this one, which people never see.
  if (form.get("company")) return { status: "sent" };

  const fieldErrors: ContactState["fieldErrors"] = {};
  if (!values.name || values.name.length > 100) fieldErrors.name = "Please add your name.";
  if (!EMAIL.test(values.email)) fieldErrors.email = "That email doesn't look right.";
  if (values.message.length < 10 || values.message.length > 5000) fieldErrors.message = "A few more words, please.";
  if (Object.keys(fieldErrors).length) return { status: "error", fieldErrors, values };

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    console.error("Contact form: RESEND_API_KEY or CONTACT_TO_EMAIL is not set");
    return { status: "error", message: "The form isn't set up yet. Please email me directly.", values };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Portfolio <onboarding@resend.dev>",
      to,
      reply_to: values.email,
      subject: `New message from ${values.name} (portfolio)`,
      text: `${values.message}\n\n— ${values.name} <${values.email}>`,
    }),
  });

  if (!res.ok) {
    console.error("Contact form: Resend responded", res.status, await res.text());
    return { status: "error", message: "Something went wrong sending that. Please email me directly.", values };
  }
  return { status: "sent" };
}
