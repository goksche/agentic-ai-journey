import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (
    <main className="login">
      <div className="login-card">
        <div className="sign">
          <p className="sign-where">Agentic AI Campus</p>
          <p className="sign-what">Weiter studieren</p>
        </div>
        <LoginForm next={next ?? "/"} />
      </div>
    </main>
  );
}
