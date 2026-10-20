"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { allModules, loadCurriculum } from "@/lib/curriculum";
import { insertQuizAttempt, recordBestQuizScore, setModuleCompleted, setTaskDone } from "@/lib/db";
import { loginEmail, maskEmail, sendLoginCode } from "@/lib/mail";
import { CODE_TTL_MINUTES, discardLoginCode, issueLoginCode, verifyLoginCode } from "@/lib/otp";
import { getModule } from "@/lib/progress";
import { grade, loadQuiz } from "@/lib/quiz";
import { SESSION_COOKIE, SESSION_DAYS, createSessionToken, isValidSession } from "@/lib/session";

async function requireSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!(await isValidSession(token))) redirect("/login");
}

function knownTask(taskId: string): boolean {
  return allModules(loadCurriculum()).some((m) => m.tasks.some((t) => t.id === taskId));
}

export async function toggleTask(formData: FormData) {
  await requireSession();
  const taskId = String(formData.get("taskId") ?? "");
  const moduleId = String(formData.get("moduleId") ?? "");
  const done = formData.get("done") === "1";
  if (!knownTask(taskId)) return;
  setTaskDone(taskId, done);
  revalidatePath("/");
  revalidatePath(`/modul/${moduleId}`);
}

export async function submitQuiz(formData: FormData) {
  await requireSession();
  const moduleId = String(formData.get("moduleId") ?? "");
  const mode = formData.get("mode") === "practice" ? "practice" : "exam";
  const { module } = getModule(moduleId);
  if (!module || !module.released) return;
  const quiz = loadQuiz(module.quiz);
  if (!quiz) return;

  const onlyIds = mode === "practice" ? String(formData.get("onlyIds") ?? "").split(",").filter(Boolean) : undefined;
  const chosen: Record<string, number | null> = {};
  for (const q of quiz.questions) {
    const raw = formData.get(`q_${q.id}`);
    const n = raw === null ? NaN : Number(raw);
    chosen[q.id] = Number.isInteger(n) && n >= 0 && n < q.options.length ? n : null;
  }
  const answers = grade(quiz, chosen, onlyIds);
  if (answers.length === 0) return;
  const score = answers.filter((a) => a.correct).length;

  const attemptId = insertQuizAttempt({ module_id: moduleId, mode, score, total: answers.length, answers });
  if (mode === "exam") recordBestQuizScore(moduleId, score);
  revalidatePath("/");
  revalidatePath(`/modul/${moduleId}`);
  redirect(`/quiz/${moduleId}/ergebnis/${attemptId}`);
}

export async function completeModule(formData: FormData) {
  await requireSession();
  const moduleId = String(formData.get("moduleId") ?? "");
  const complete = formData.get("complete") === "1";
  const { module } = getModule(moduleId);
  if (!module) return;
  if (complete && !module.canComplete) return;
  setModuleCompleted(moduleId, complete);
  revalidatePath("/");
  revalidatePath(`/modul/${moduleId}`);
}

export type LoginState = { step: "request" | "verify"; error: string | null; info: string | null };

async function sendCode(): Promise<LoginState> {
  let issued;
  try {
    issued = issueLoginCode();
  } catch (e) {
    console.error(e);
    return { step: "request", error: "Der Server ist nicht vollständig eingerichtet: CAMPUS_SESSION_SECRET prüfen.", info: null };
  }
  if (!issued.ok) {
    const error =
      issued.reason === "too_soon"
        ? "Es wurde gerade ein Code verschickt. Warte eine Minute, bevor du einen neuen anforderst."
        : "Zu viele Codes in der letzten Stunde. Versuch es später erneut.";
    return { step: "verify", error, info: null };
  }
  try {
    await sendLoginCode(issued.code);
  } catch (e) {
    console.error(e);
    discardLoginCode(issued.id);
    return { step: "request", error: "Die E-Mail konnte nicht verschickt werden. SMTP-Einstellungen prüfen.", info: null };
  }
  return { step: "verify", error: null, info: `Code an ${maskEmail(loginEmail())} geschickt. Er ist ${CODE_TTL_MINUTES} Minuten gültig.` };
}

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (formData.get("intent") !== "verify" || formData.get("resend") === "1") return sendCode();

  const code = String(formData.get("code") ?? "").replace(/\s/g, "");
  if (!/^\d{6}$/.test(code)) {
    return { step: "verify", error: "Der Code besteht aus 6 Ziffern.", info: null };
  }
  const result = verifyLoginCode(code);
  if (result !== "ok") {
    await new Promise((r) => setTimeout(r, 800));
    const error = {
      invalid: "Der Code stimmt nicht.",
      expired: "Der Code ist abgelaufen oder wurde schon verwendet. Fordere einen neuen an.",
      locked: "Zu viele Fehlversuche mit diesem Code. Fordere einen neuen an.",
    }[result];
    return { step: "verify", error, info: null };
  }
  (await cookies()).set(SESSION_COOKIE, await createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production" && process.env.CAMPUS_INSECURE_COOKIE !== "1",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
  const next = String(formData.get("next") ?? "/");
  redirect(next.startsWith("/") && !next.startsWith("//") ? next : "/");
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/login");
}
