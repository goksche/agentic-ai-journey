"use server";

import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { allModules, loadCurriculum } from "@/lib/curriculum";
import { setModuleCompleted, setQuizScore, setTaskDone } from "@/lib/db";
import { clearFailures, isLockedOut, recordFailure, verifyPassword } from "@/lib/password";
import { QUIZ_TOTAL, getModule } from "@/lib/progress";
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

export async function saveQuiz(formData: FormData) {
  await requireSession();
  const moduleId = String(formData.get("moduleId") ?? "");
  const raw = String(formData.get("score") ?? "").trim();
  if (!getModule(moduleId).module) return;
  const score = raw === "" ? null : Number(raw);
  if (score !== null && (!Number.isInteger(score) || score < 0 || score > QUIZ_TOTAL)) return;
  setQuizScore(moduleId, score);
  revalidatePath("/");
  revalidatePath(`/modul/${moduleId}`);
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

export type LoginState = { error: string | null };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0].trim() || h.get("x-real-ip") || "local";
  if (isLockedOut(ip)) {
    return { error: "Zu viele Fehlversuche. Versuch es in 15 Minuten erneut." };
  }
  const password = String(formData.get("password") ?? "");
  let ok = false;
  try {
    ok = verifyPassword(password);
  } catch (e) {
    console.error(e);
    return { error: "Der Server ist nicht vollständig eingerichtet: CAMPUS_PASSWORD_HASH prüfen." };
  }
  if (!ok) {
    recordFailure(ip);
    await new Promise((r) => setTimeout(r, 800));
    return { error: "Das Passwort stimmt nicht." };
  }
  clearFailures(ip);
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
