import Link from "next/link";
import { currentWeek, daysUntilStart, weekRange } from "@/lib/curriculum";
import { formatHours, percent } from "@/lib/format";
import { getOverview, type ModuleView, type NextStep } from "@/lib/progress";

const STATUS_TEXT: Record<ModuleView["status"], string> = {
  locked: "noch nicht freigegeben",
  open: "bereit",
  active: "in Arbeit",
  done: "abgeschlossen",
};

export default function Dashboard() {
  const { curriculum, modules, tasksDone, tasksTotal, modulesDone, next } = getOverview();
  const week = currentWeek(curriculum);
  const untilStart = daysUntilStart(curriculum);
  const semesterStarts = new Set(curriculum.semesters.slice(1).map((s) => weekRange(s.weeks)[0]));

  return (
    <>
      <section className="intro" aria-label="Stand">
        <div>
          <h1>{week === 0 ? "Vorlauf" : `Woche ${week} von ${curriculum.weeks_total}`}</h1>
          <p className="muted">
            {week === 0
              ? `Der offizielle Start ist in ${untilStart} ${untilStart === 1 ? "Tag" : "Tagen"}. Du kannst schon loslegen.`
              : `${modulesDone} von ${modules.length} Modulen abgeschlossen`}
          </p>
        </div>
        <div className="overall">
          <div className="overall-figure">{percent(tasksDone, tasksTotal)} % des Studiums</div>
          <div className="muted">
            {tasksDone} von {tasksTotal} Aufgaben erledigt
          </div>
        </div>
      </section>

      <Signpost next={next} />

      <section className="weeks" aria-labelledby="weeks-title">
        <div className="weeks-head">
          <h2 id="weeks-title" className="muted" style={{ fontSize: "var(--step-0)" }}>
            36 Wochen im Überblick
          </h2>
        </div>
        <div className="weeks-grid" role="img" aria-label={`Studienwoche ${week} von ${curriculum.weeks_total}`}>
          {Array.from({ length: curriculum.weeks_total }, (_, i) => {
            const w = i + 1;
            const cls = ["week", w < week ? "past" : "", w === week ? "now" : "", semesterStarts.has(w) ? "semester-start" : ""];
            return <div key={w} className={cls.join(" ")} title={`Woche ${w}`} />;
          })}
        </div>
        <div className="bands" aria-hidden>
          {modules.map((m) => {
            const [from, to] = weekRange(m.weeks);
            return (
              <div
                key={m.id}
                className={`band ${m.status} ${semesterStarts.has(from) ? "semester-start" : ""}`}
                style={{ gridColumn: `${from} / ${to + 1}`, gridRow: m.project ? 2 : 1 }}
                title={`${m.id} ${m.title}`}
              />
            );
          })}
        </div>
        <div className="weeks-legend">
          {curriculum.semesters.map((s) => {
            const [from, to] = weekRange(s.weeks);
            return (
              <span key={s.id} style={{ gridColumn: `${from} / ${to + 1}` }} className={semesterStarts.has(from) ? "semester-start" : ""}>
                {s.title.replace(/ –.*/, "")}
              </span>
            );
          })}
        </div>
      </section>

      {curriculum.semesters.map((s) => {
        const sm = modules.filter((m) => m.semesterId === s.id);
        const done = sm.reduce((n, m) => n + m.tasksDone, 0);
        const total = sm.reduce((n, m) => n + m.tasksTotal, 0);
        return (
          <section key={s.id} className="semester" aria-labelledby={`sem-${s.id}`}>
            <div className="semester-head">
              <h2 id={`sem-${s.id}`}>{s.title}</h2>
              <span className="muted">
                Wochen {s.weeks}, {done} von {total} Aufgaben
              </span>
            </div>
            <p className="semester-goal">{s.goal}</p>
            <ul className="modules">
              {sm.map((m) => (
                <li key={m.id}>
                  <ModuleRow m={m} />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </>
  );
}

function ModuleRow({ m }: { m: ModuleView }) {
  const inner = (
    <>
      <span className="module-id">{m.id}</span>
      <span>
        <span className="module-title">{m.title}</span>
        <br />
        <span className="module-weeks">Woche {m.weeks}</span>
      </span>
      <span className="pips" aria-label={`${m.tasksDone} von ${m.tasksTotal} Aufgaben erledigt`}>
        {m.tasks.map((t) => (
          <span key={t.id} className={`pip ${m.doneMap.has(t.id) ? "done" : ""}`} />
        ))}
      </span>
      <span className={`status ${m.status}`}>{STATUS_TEXT[m.status]}</span>
    </>
  );
  if (!m.released) return <div className="module-row locked">{inner}</div>;
  return (
    <Link href={`/modul/${m.id}`} className={`module-row ${m.status}`}>
      {inner}
    </Link>
  );
}

function Signpost({ next }: { next: NextStep }) {
  if (next.kind === "waiting") {
    return (
      <>
        <div className="sign" role="region" aria-label="Nächster Schritt">
          <p className="sign-where">{next.module ? `Modul ${next.module.id}, ${next.module.title}` : "Studium"}</p>
          <p className="sign-what">
            {next.module ? "Wartet auf Freigabe der Lernunterlagen" : "Alle Module abgeschlossen"}
          </p>
        </div>
        <div className="sign-actions">
          <p className="muted" style={{ margin: 0 }}>
            {next.module
              ? `Schreib Claude «Modul ${next.module.id} starten». Sobald die Unterlagen im Repo sind, geht es hier weiter.`
              : "Gratulation. Zeit für den Abschlussbericht."}
          </p>
        </div>
      </>
    );
  }

  const m = next.module;
  const what =
    next.kind === "task"
      ? `Aufgabe ${next.index + 1}: ${next.task.title}`
      : next.kind === "quiz"
        ? "Quiz bestehen"
        : "Modul abschliessen";
  const time = next.kind === "task" ? formatHours(next.task.hours) : null;

  return (
    <>
      <div className="sign" role="region" aria-label="Nächster Schritt">
        <p className="sign-where">
          Hier weitermachen: Modul {m.id}, {m.title}
        </p>
        <p className="sign-what">{what}</p>
        {time && <span className="sign-time">{time}</span>}
      </div>
      <div className="sign-actions">
        <Link className="btn btn-primary" href={`/modul/${m.id}`}>
          Modul öffnen
        </Link>
        {m.skript && (
          <Link className="btn" href={`/doc/${m.skript}`}>
            Lernskript lesen
          </Link>
        )}
        {m.aufgaben && (
          <Link className="btn" href={`/doc/${m.aufgaben}`}>
            Aufgabenblatt
          </Link>
        )}
        {next.kind === "quiz" && (
          <Link className="btn" href={`/quiz/${m.id}`}>
            Quiz starten
          </Link>
        )}
      </div>
    </>
  );
}
