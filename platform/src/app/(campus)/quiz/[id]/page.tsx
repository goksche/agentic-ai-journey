import Link from "next/link";
import { notFound } from "next/navigation";
import { submitQuiz } from "@/app/actions";
import InlineText from "@/components/InlineText";
import { getQuizAttempt } from "@/lib/db";
import { getModule } from "@/lib/progress";
import { loadQuiz, shuffledOrder } from "@/lib/quiz";

export default async function QuizPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ wiederholen?: string }>;
}) {
  const { id } = await params;
  const { wiederholen } = await searchParams;
  const { module: m } = getModule(decodeURIComponent(id));
  if (!m || !m.released) notFound();
  const quiz = loadQuiz(m.quiz);
  if (!quiz) notFound();

  // Übungsmodus: nur die Fragen, die in einem früheren Versuch falsch waren
  let onlyIds: string[] | null = null;
  if (wiederholen) {
    const attempt = getQuizAttempt(Number(wiederholen));
    if (attempt && attempt.module_id === m.id) {
      onlyIds = attempt.answers.filter((a) => !a.correct).map((a) => a.questionId);
    }
  }
  const practice = !!onlyIds && onlyIds.length > 0;
  const questions = practice ? quiz.questions.filter((q) => onlyIds!.includes(q.id)) : quiz.questions;

  return (
    <>
      <p className="crumbs">
        <Link href="/">Übersicht</Link> / <Link href={`/modul/${m.id}`}>Modul {m.id}</Link>
      </p>
      <h1>{quiz.title}</h1>
      <p className="muted quiz-lead">
        {practice
          ? `Übungsrunde mit den ${questions.length} Fragen, die du zuletzt falsch hattest. Sie zählt nicht für das Bestehen.`
          : `${questions.length} Fragen, bestanden ab ${quiz.pass} richtigen. Die Antworten erscheinen bei jedem Versuch in neuer Reihenfolge.`}
      </p>

      <form action={submitQuiz} className="quiz">
        <input type="hidden" name="moduleId" value={m.id} />
        <input type="hidden" name="mode" value={practice ? "practice" : "exam"} />
        {practice && <input type="hidden" name="onlyIds" value={onlyIds!.join(",")} />}
        <ol className="questions">
          {questions.map((q) => (
            <li key={q.id} className="question">
              <fieldset>
                <legend>
                  <InlineText text={q.prompt} />
                </legend>
                <div className="options">
                  {shuffledOrder(q.options.length).map((oi) => (
                    <label key={oi} className="option">
                      <input type="radio" name={`q_${q.id}`} value={oi} required />
                      <span>
                        <InlineText text={q.options[oi]} />
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </li>
          ))}
        </ol>
        <div className="quiz-submit">
          <button type="submit" className="btn btn-primary">
            Antworten auswerten
          </button>
          <Link href={`/modul/${m.id}`} className="btn">
            Abbrechen
          </Link>
        </div>
      </form>
    </>
  );
}
