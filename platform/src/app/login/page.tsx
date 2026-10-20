import { loginEmail, maskEmail } from "@/lib/mail";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  let email = "die hinterlegte Adresse";
  try {
    email = maskEmail(loginEmail());
  } catch (e) {
    console.error(e);
  }
  return (
    <main className="login">
      <div className="login-card">
        <div className="sign">
          <p className="sign-where">Agentic AI Campus</p>
          <p className="sign-what">Weiter studieren</p>
        </div>
        <LoginForm next={next ?? "/"} email={email} />
      </div>
    </main>
  );
}
