import "server-only";
import nodemailer from "nodemailer";
import { CODE_TTL_MINUTES } from "./otp";

export function loginEmail(): string {
  const e = process.env.CAMPUS_LOGIN_EMAIL?.trim();
  if (!e || !e.includes("@")) throw new Error("CAMPUS_LOGIN_EMAIL fehlt oder ist keine E-Mail-Adresse.");
  return e;
}

export function maskEmail(email: string): string {
  const [user, domain] = email.split("@");
  return `${user.slice(0, 1)}•••••@${domain}`;
}

export async function sendLoginCode(code: string): Promise<void> {
  const to = loginEmail();
  const host = process.env.SMTP_HOST;

  // Lokal ohne Mailserver: Code in der Konsole ausgeben statt verschicken.
  if (!host && process.env.NODE_ENV !== "production") {
    console.log(`[campus] Login-Code für ${to}: ${code}`);
    return;
  }
  if (!host || !process.env.SMTP_USERNAME || !process.env.SMTP_PASSWORD || !process.env.SMTP_FROM) {
    throw new Error("SMTP_HOST, SMTP_USERNAME, SMTP_PASSWORD oder SMTP_FROM fehlt.");
  }

  const port = Number(process.env.SMTP_PORT ?? 587);
  const transport = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    requireTLS: port !== 465,
    auth: { user: process.env.SMTP_USERNAME, pass: process.env.SMTP_PASSWORD },
  });

  await transport.sendMail({
    from: `Agentic AI Campus <${process.env.SMTP_FROM}>`,
    to,
    subject: "Dein Login-Code für den Agentic AI Campus",
    text: [
      `Dein Login-Code: ${code}`,
      "",
      `Er ist ${CODE_TTL_MINUTES} Minuten gültig und kann nur einmal verwendet werden.`,
      "Falls du keinen Code angefordert hast, kannst du diese E-Mail ignorieren.",
    ].join("\n"),
  });
}
