import Link from "next/link";
import { notFound } from "next/navigation";
import InlineText from "@/components/InlineText";
import { getQuizAttempt } from "@/lib/db";
import { getModule } from "@/lib/progress";
import { loadQuiz } from "@/lib/quiz";

export default async function QuizResultPage({ params }: { params: Promise<{ id: string; attempt: string }> }) {
  const { id, attempt: attemptParam } = await params;
  const { module: m } = getModule(decodeURIComponent(id));
  const attempt = getQuizAttempt(Number(attemptParam));
  if (!m || !attempt || attempt.module_id !== m.id) notFound();
  const quiz = loadQuiz(m.quiz);
  if (!quiz) notFound();

  const byId = new Map(quiz.questions.map((q) => [q.id, q]));
  const wrong = attempt.answers.filter((a) => !a.correct).length;
  const exam = attempt.mode === "exam";
  const passed = exam && attempt.score >= quiz.pass;

  let headline: string;
  if (!exam) headline = wrong === 0 ? "Alle Übungsfragen richtig" : `${attempt.score} von ${attempt.total} Übungsfragen richtig`;
  else if (passed) headline = `Bestanden: ${attempt.score} von ${attempt.total}`;
  else headline = `${attempt.score} von ${attempt.total}: noch nicht bestanden`;

  return (
    <>
      <p className="crumbs">
        <Link href="/">Übersicht</Link> / <Link href={`/modul/${m.id}`}>Modul {m.id}</Link>
      </p>
      <div className={`result-banner ${passed ? "passed" : ""}`}>
        <h1>{headline}</h1>
        <p>
          {!exam
            ? "Übungsrunden zählen nicht für das Bestehen. Wenn alles sitzt, mach einen neuen Prüfungsdurchlauf."
            : passed
              ? "Das Quiz-Kriterium für dieses Modul ist erfüllt. Lies die Erklärungen zu den Fehlern trotzdem durch."
              : `Nötig sind ${quiz.pass}. Lies die Erklärungen, wiederhole die falschen Fragen und versuch es danach erneut.`}
        </p>
      </div>

      <div className="sign-actions">
        {wrong > 0 && (
          <Link className="btn btn-primary" href={`/quiz/${m.id}?wiederholen=${attempt.id}`}>
            {wrong === 1 ? "Falsche Frage wiederholen" : `${wrong} falsche Fragen wiederholen`}
          </Link>
        )}
        <Link className={`btn ${wrong === 0 ? "btn-primary" : ""}`} href={`/quiz/${m.id}`}>
          Neuer Prüfungsdurchlauf
        </Link>
        <Link className="btn" href={`/modul/${m.id}`}>
          Zurück zum Modul
        </Link>
      </div>

      <ol className="questions">
        {attempt.answers.map((a) => {
          const q = byId.get(a.questionId);
          if (!q) return null;
          return (
            <li key={a.questionId} className={`question graded ${a.correct ? "is-correct" : "is-wrong"}`}>
              <p className="q-prompt">
                <InlineText text={q.prompt} />
              </p>
              <p className="q-verdict">{a.correct ? "Richtig" : "Falsch"}</p>
              {!a.correct && (
                <p className="q-line">
                  <span className="muted">Deine Antwort: </span>
                  {a.chosen === null ? "keine" : <InlineText text={q.options[a.chosen]} />}
                </p>
              )}
              <p className="q-line">
                <span className="muted">Richtig: </span>
                <InlineText text={q.options[q.answer]} />
              </p>
              <p className="q-explain">
                <InlineText text={q.explanation} />
              </p>
            </li>
          );
        })}
      </ol>
    </>
  );
}
