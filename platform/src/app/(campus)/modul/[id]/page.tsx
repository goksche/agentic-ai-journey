import Link from "next/link";
import { notFound } from "next/navigation";
import { completeModule, toggleTask } from "@/app/actions";
import { quizAttempts } from "@/lib/db";
import { githubBlobUrl, githubEditUrl } from "@/lib/github";
import { fileExists } from "@/lib/curriculum";
import { formatDate, formatHours } from "@/lib/format";
import { getModule } from "@/lib/progress";

export default async function ModulePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { module: m, semester } = getModule(decodeURIComponent(id));
  if (!m || !semester) notFound();

  const nextIndex = m.tasks.findIndex((t) => !m.doneMap.has(t.id));
  const openHours = m.tasks.filter((t) => !m.doneMap.has(t.id)).reduce((n, t) => n + (t.hours ?? 0), 0);
  const reviewCandidate = m.aufgaben ? `${m.aufgaben.split("/").slice(0, -1).join("/")}/REVIEW.md` : null;
  const reviewPath = reviewCandidate && fileExists(reviewCandidate) ? reviewCandidate : null;
  const needsQuiz = m.quizTotal > 0;
  const attempts = needsQuiz ? quizAttempts(m.id) : [];
  const examAttempts = attempts.filter((a) => a.mode === "exam");
  const lastExam = examAttempts[0];

  return (
    <>
      <p className="crumbs">
        <Link href="/">Übersicht</Link> / {semester.title}
      </p>
      <h1>
        {m.project ? "" : `Modul ${m.id}: `}
        {m.title}
      </h1>
      <p className="muted" style={{ marginTop: 6 }}>
        Woche {m.weeks}
        {m.completedAt ? `, abgeschlossen am ${formatDate(m.completedAt)}` : ""}
      </p>

      {!m.released ? (
        <div className="empty" style={{ marginTop: 24 }}>
          Die Unterlagen für dieses Modul sind noch nicht freigegeben. Schreib Claude «Modul {m.id} starten».
        </div>
      ) : (
        <div className="module-layout">
          <section className="panel" aria-labelledby="tasks-title">
            <h2 id="tasks-title">
              Aufgaben{" "}
              <span className="muted" style={{ fontWeight: 400, fontSize: "var(--step-0)" }}>
                {m.tasksDone} von {m.tasksTotal} erledigt
                {openHours > 0 ? `, noch ca. ${formatHours(openHours)}` : ""}
              </span>
            </h2>
            <ul className="tasklist">
              {m.tasks.map((t, i) => {
                const done = m.doneMap.has(t.id);
                return (
                  <li key={t.id} className={`task ${done ? "done" : ""} ${i === nextIndex ? "next" : ""}`}>
                    <form action={toggleTask}>
                      <input type="hidden" name="taskId" value={t.id} />
                      <input type="hidden" name="moduleId" value={m.id} />
                      <input type="hidden" name="done" value={done ? "0" : "1"} />
                      <button
                        type="submit"
                        className="task-btn"
                        aria-pressed={done}
                        aria-label={`${done ? "Wieder öffnen" : "Als erledigt markieren"}: Aufgabe ${i + 1}, ${t.title}`}
                      >
                        <span className="box" aria-hidden />
                        <span className="task-title">
                          {i + 1}. {t.title}
                        </span>
                        <span className="task-hours">{formatHours(t.hours)}</span>
                      </button>
                    </form>
                    {t.files && t.files.length > 0 && (
                      <ul className="task-files" aria-label={`Dateien zu Aufgabe ${i + 1}`}>
                        {t.files.map((f) => (
                          <li key={f}>
                            {f.endsWith(".md") && fileExists(f) ? (
                              <Link href={`/doc/${f}`}>{f.split("/").pop()}</Link>
                            ) : (
                              <a href={githubBlobUrl(f)} target="_blank" rel="noreferrer">
                                {f.split("/").pop()}
                              </a>
                            )}
                            <a className="edit-link" href={githubEditUrl(f)} target="_blank" rel="noreferrer">
                              Bearbeiten
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
            <p className="note">
              Abhaken, sobald die Abnahmekriterien im Aufgabenblatt erfüllt und die Dateien im Repo committet sind.
            </p>
          </section>

          <aside>
            <section className="panel" aria-labelledby="docs-title">
              <h2 id="docs-title">Unterlagen</h2>
              <div className="doclinks">
                {m.skript && <Link href={`/doc/${m.skript}`}>Lernskript</Link>}
                {m.aufgaben && <Link href={`/doc/${m.aufgaben}`}>Aufgabenblatt</Link>}
                {reviewPath && (
                  <Link href={`/doc/${reviewPath}`} className="review-link">
                    Review der Studiengangleitung
                  </Link>
                )}
              </div>
            </section>

            {needsQuiz && (
              <section className="panel" aria-labelledby="quiz-title">
                <h2 id="quiz-title">Quiz</h2>
                <p className="quiz-score">
                  {m.quizScore === null ? (
                    <span className="muted">Noch nicht bearbeitet</span>
                  ) : (
                    <>
                      <strong>
                        Bestes Ergebnis: {m.quizScore} von {m.quizTotal}
                      </strong>
                      <span className={m.quizPassed ? "ok" : "muted"}>{m.quizPassed ? "bestanden" : "noch nicht bestanden"}</span>
                    </>
                  )}
                </p>
                <div className="btn-col">
                  <Link className={`btn ${m.quizPassed ? "" : "btn-primary"}`} href={`/quiz/${m.id}`}>
                    {examAttempts.length === 0 ? "Quiz starten" : "Neuer Versuch"}
                  </Link>
                  {lastExam && (
                    <Link className="btn" href={`/quiz/${m.id}/ergebnis/${lastExam.id}`}>
                      Letztes Ergebnis ansehen
                    </Link>
                  )}
                </div>
                <p className="note">
                  {m.quizTotal} Fragen, bestanden ab {m.quizPass}.
                  {examAttempts.length > 0 ? ` ${examAttempts.length} ${examAttempts.length === 1 ? "Versuch" : "Versuche"} bisher.` : ""}
                </p>
              </section>
            )}

            <section className="panel" aria-labelledby="done-title">
              <h2 id="done-title">Abschluss</h2>
              <form action={completeModule}>
                <input type="hidden" name="moduleId" value={m.id} />
                <input type="hidden" name="complete" value={m.completedAt ? "0" : "1"} />
                {m.completedAt ? (
                  <button type="submit" className="btn">
                    Wieder öffnen
                  </button>
                ) : (
                  <button type="submit" className="btn btn-primary" disabled={!m.canComplete}>
                    Modul abschliessen
                  </button>
                )}
              </form>
              <p className="note">
                {m.completedAt
                  ? `Abgeschlossen am ${formatDate(m.completedAt)}.`
                  : m.canComplete
                    ? "Alle Voraussetzungen erfüllt. Nach dem Review mit Claude abschliessen."
                    : `Möglich, sobald alle Aufgaben erledigt${needsQuiz ? " und das Quiz bestanden" : ""} sind.`}
              </p>
            </section>
          </aside>
        </div>
      )}
    </>
  );
}
