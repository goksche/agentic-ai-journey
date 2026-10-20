# agentic-ai-journey

Selbststudium Agentic AI – 36 Wochen, 3 Semester, 3 Projekte. Der vollständige Studien- und Lernplan steht in [PLAN.md](PLAN.md).

Studiert wird über die Lernplattform **Agentic AI Campus** in [`platform/`](platform/). Sie zeigt den nächsten Schritt, den Fortschritt und alle Unterlagen. Betrieb auf dem eigenen Server: [platform/DEPLOY.md](platform/DEPLOY.md). Der Studienaufbau für die Plattform steht in [`curriculum.yaml`](curriculum.yaml).

## Struktur

| Ordner | Inhalt |
| --- | --- |
| `docs/` | Lernskripte, Cheat-Sheets, Quiz (von der Studiengangleitung geliefert) |
| `module-X.Y-<name>/` | Übungen und Notizen pro Modul; Feynman-Notiz als `FEYNMAN.md` |
| `projects/scholar/` | Semesterprojekt 1 – Recherche-Agent mit Quellennachweis |
| `projects/forge/` | Semesterprojekt 2 – autonomes Software-Team (SWE-bench Lite) |
| `projects/capstone/` | Produktstrategie-Simulation |
| `platform/` | Lernplattform (Next.js), Deployment-Anleitung |
| `journal/` | Wochenjournal `YYYY-WW.md`: Ziel, Erledigtes, Reflexion |

## Fortschritt

| Modul | Status | Quiz | Abgeschlossen am |
| --- | --- | --- | --- |
| 1.1 Program Induction | in Arbeit | – | |
| 1.2 Python-Refresher | offen | – | |
| 1.3 Foundations | offen | – | |
| 1.4 GenAI-Stack & Prompting | offen | – | |
| 1.5 LLM Internals & Planning | offen | – | |
| Projekt 1 – Scholar | offen | | |

## Setup

```bash
uv venv && source .venv/bin/activate
cp .env.example .env   # API-Keys eintragen
```
