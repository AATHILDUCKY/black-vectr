import nodemailer, { Transporter } from "nodemailer";
import { env } from "./env";

let transporter: Transporter | null = null;

// Real SMTP transport when SMTP_HOST is set; otherwise a "jsonTransport" that
// resolves immediately and lets us log the message to the console in dev.
function getTransporter(): Transporter {
  if (transporter) return transporter;
  if (env.smtp.host) {
    transporter = nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.secure,
      auth: env.smtp.user ? { user: env.smtp.user, pass: env.smtp.pass } : undefined,
    });
  } else {
    transporter = nodemailer.createTransport({ jsonTransport: true });
  }
  return transporter;
}

export interface MailInput {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}

export async function sendMail(input: MailInput) {
  const t = getTransporter();
  const info = await t.sendMail({ from: env.smtp.from, ...input });

  if (!env.smtp.host) {
    // Dev mode: no SMTP configured — log instead of sending.
    console.log("📧 [dev mailer] email not sent (no SMTP_HOST). Payload:");
    console.log(`   to: ${input.to} | subject: ${input.subject}`);
    console.log(`   ${input.text.replace(/\n/g, "\n   ")}`);
  }
  return info;
}
