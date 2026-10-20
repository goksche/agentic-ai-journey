import "server-only";
import { allModules, isReleased, loadCurriculum, type Curriculum, type Module, type Task } from "./curriculum";
import { doneTasks, moduleProgress, type ModuleProgress } from "./db";

export const QUIZ_TOTAL = 15;
export const QUIZ_PASS = 12;

export type ModuleStatus = "locked" | "open" | "active" | "done";

export type ModuleView = Module & {
  semesterId: string;
  released: boolean;
  status: ModuleStatus;
  tasksDone: number;
  tasksTotal: number;
  quizScore: number | null;
  quizPassed: boolean;
  canComplete: boolean;
  completedAt: string | null;
  doneMap: Map<string, string>;
};

export type NextStep =
  | { kind: "task"; module: ModuleView; task: Task; index: number }
  | { kind: "quiz"; module: ModuleView }
  | { kind: "complete"; module: ModuleView }
  | { kind: "waiting"; module: ModuleView | null };

export function buildModuleView(
  m: Module & { semesterId: string },
  done: Map<string, string>,
  mp: Map<string, ModuleProgress>,
): ModuleView {
  const released = isReleased(m);
  const p = mp.get(m.id);
  const tasksDone = m.tasks.filter((t) => done.has(t.id)).length;
  const quizScore = p?.quiz_score ?? null;
  const needsQuiz = !m.project && !!m.quiz;
  const quizPassed = !needsQuiz || (quizScore !== null && quizScore >= QUIZ_PASS);
  const completedAt = p?.completed_at ?? null;
  let status: ModuleStatus = "open";
  if (!released) status = "locked";
  else if (completedAt) status = "done";
  else if (tasksDone > 0 || quizScore !== null) status = "active";
  return {
    ...m,
    released,
    status,
    tasksDone,
    tasksTotal: m.tasks.length,
    quizScore,
    quizPassed,
    canComplete: released && tasksDone === m.tasks.length && quizPassed,
    completedAt,
    doneMap: done,
  };
}

export function getOverview() {
  const curriculum: Curriculum = loadCurriculum();
  const done = doneTasks();
  const mp = moduleProgress();
  const modules = allModules(curriculum).map((m) => buildModuleView(m, done, mp));

  const tasksTotal = modules.reduce((n, m) => n + m.tasksTotal, 0);
  const tasksDone = modules.reduce((n, m) => n + m.tasksDone, 0);
  const modulesDone = modules.filter((m) => m.status === "done").length;

  return { curriculum, modules, tasksTotal, tasksDone, modulesDone, next: findNextStep(modules) };
}

export function findNextStep(modules: ModuleView[]): NextStep {
  for (const m of modules) {
    if (m.status === "done") continue;
    if (!m.released) return { kind: "waiting", module: m };
    const index = m.tasks.findIndex((t) => !m.doneMap.has(t.id));
    if (index >= 0) return { kind: "task", module: m, task: m.tasks[index], index };
    if (!m.quizPassed) return { kind: "quiz", module: m };
    return { kind: "complete", module: m };
  }
  return { kind: "waiting", module: null };
}

export function getModule(id: string) {
  const { curriculum, modules } = getOverview();
  const module = modules.find((m) => m.id === id) ?? null;
  const semester = module ? curriculum.semesters.find((s) => s.id === module.semesterId) ?? null : null;
  return { curriculum, module, semester };
}
