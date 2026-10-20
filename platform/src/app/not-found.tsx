import Link from "next/link";

export default function NotFound() {
  return (
    <main className="wrap" style={{ padding: "64px 16px" }}>
      <h1>Diese Seite gibt es nicht</h1>
      <p className="muted">Das Dokument oder Modul wurde nicht gefunden. Vielleicht ist es noch nicht freigegeben.</p>
      <Link className="btn" href="/">
        Zur Übersicht
      </Link>
    </main>
  );
}
