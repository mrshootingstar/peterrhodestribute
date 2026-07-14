import { EmailMessage } from "cloudflare:email";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sanitizeHeaderValue(value) {
  return String(value).replace(/[\r\n]+/g, " ").trim();
}

function buildRawEmail({ from, to, subject, html }) {
  return [
    `From: ${sanitizeHeaderValue(from)}`,
    `To: ${sanitizeHeaderValue(to)}`,
    `Subject: ${sanitizeHeaderValue(subject)}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/html; charset="UTF-8"`,
    ``,
    html,
  ].join("\r\n");
}

export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    const authHeader = request.headers.get("Authorization") || "";
    const expected = `Bearer ${env.RELAY_SECRET}`;
    if (!env.RELAY_SECRET || authHeader !== expected) {
      return new Response("Unauthorized", { status: 401 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ success: false, error: "Invalid JSON body" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { to, subject, html, from } = body;
    const toEmails = (Array.isArray(to) ? to : [to]).filter(
      (email) => typeof email === "string" && EMAIL_RE.test(email)
    );

    if (toEmails.length === 0) {
      return new Response(JSON.stringify({ success: false, error: "No valid recipient email addresses" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (typeof subject !== "string" || typeof html !== "string") {
      return new Response(JSON.stringify({ success: false, error: "Missing subject or html" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const fromEmail = typeof from === "string" && EMAIL_RE.test(from) ? from : "noreply@peterrhodestribute.com";

    const errors = [];
    for (const recipient of toEmails) {
      const raw = buildRawEmail({ from: fromEmail, to: recipient, subject, html });
      try {
        const message = new EmailMessage(fromEmail, recipient, raw);
        await env.SEND_EMAIL.send(message);
      } catch (err) {
        errors.push(`${recipient}: ${err.message || err}`);
      }
    }

    if (errors.length > 0) {
      return new Response(JSON.stringify({ success: false, error: errors.join("; ") }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
