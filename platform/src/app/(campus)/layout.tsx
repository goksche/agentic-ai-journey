import Link from "next/link";
import { logout } from "../actions";

export const dynamic = "force-dynamic";

export default function CampusLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="topbar">
        <div className="wrap">
          <Link href="/" className="brand">
            <span className="brand-mark" aria-hidden />
            Agentic AI Campus
          </Link>
          <nav className="topnav" aria-label="Hauptnavigation">
            <Link href="/">Übersicht</Link>
            <Link href="/doc/PLAN.md">Studienplan</Link>
          </nav>
          <form action={logout}>
            <button type="submit" className="linkbutton">
              Abmelden
            </button>
          </form>
        </div>
      </header>
      <main>
        <div className="wrap">{children}</div>
      </main>
    </>
  );
}
