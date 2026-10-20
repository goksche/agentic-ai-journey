import "server-only";
import fs from "node:fs";
import { load as parseYaml } from "js-yaml";
import { safeResolve } from "./curriculum";

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
};

export type Quiz = { title: string; pass: number; questions: QuizQuestion[] };

export function loadQuiz(rel: string | undefined): Quiz | null {
  if (!rel || !rel.endsWith(".yaml")) return null;
  const abs = safeResolve(rel);
  if (!abs || !fs.existsSync(abs)) return null;
  const data = parseYaml(fs.readFileSync(abs, "utf8")) as Quiz;
  const questions = (data.questions ?? []).map((q) => ({ ...q, prompt: String(q.prompt), options: q.options.map(String) }));
  return { title: data.title, pass: data.pass ?? Math.ceil(questions.length * 0.8), questions };
}

export type GradedAnswer = { questionId: string; chosen: number | null; correct: boolean };

export function grade(quiz: Quiz, chosen: Record<string, number | null>, onlyIds?: string[]): GradedAnswer[] {
  const questions = onlyIds ? quiz.questions.filter((q) => onlyIds.includes(q.id)) : quiz.questions;
  return questions.map((q) => {
    const c = chosen[q.id] ?? null;
    return { questionId: q.id, chosen: c, correct: c === q.answer };
  });
}

/** Mischt die Optionsreihenfolge; der Wert jeder Option bleibt ihr ursprünglicher Index. */
export function shuffledOrder(length: number): number[] {
  const order = Array.from({ length }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}
