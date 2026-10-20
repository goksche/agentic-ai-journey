import Link from "next/link";
import { notFound } from "next/navigation";
import { completeModule, saveQuiz, toggleTask } from "@/app/actions";
import { formatDate, formatHours } from "@/lib/format";
import { QUIZ_PASS, QUIZ_TOTAL, getModule } from "@/lib/progress";

export default async function ModulePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { module: m, semester } = getModule(decodeURIComponent(id));
  if (!m || !semester) notFound();

  const nextIndex = m.tasks.findIndex((t) => !m.doneMap.has(t.id));
  const openHours = m.tasks.filter((t) => !m.doneMap.has(t.id)).reduce((n, t) => n + (t.hours ?? 0), 0);
  const needsQuiz = !m.project && !!m.quiz;

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
                {m.quiz && <Link href={`/doc/${m.quiz}`}>Quiz</Link>}
              </div>
            </section>

            {needsQuiz && (
              <section className="panel" aria-labelledby="quiz-title">
                <h2 id="quiz-title">Quiz</h2>
                <form action={saveQuiz} className="quiz-form">
                  <input type="hidden" name="moduleId" value={m.id} />
                  <label htmlFor="score">Richtige Antworten</label>
                  <input
                    id="score"
                    name="score"
                    type="number"
                    min={0}
                    max={QUIZ_TOTAL}
                    defaultValue={m.quizScore ?? ""}
                    inputMode="numeric"
                  />
                  <span className="muted">von {QUIZ_TOTAL}</span>
                  <button type="submit" className="btn">
                    Speichern
                  </button>
                </form>
                <p className="note">
                  {m.quizScore === null
                    ? `Bestanden ab ${QUIZ_PASS} richtigen.`
                    : m.quizPassed
                      ? `Bestanden mit ${m.quizScore} von ${QUIZ_TOTAL}.`
                      : `${m.quizScore} von ${QUIZ_TOTAL}: noch nicht bestanden. Nötig sind ${QUIZ_PASS}.`}
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
