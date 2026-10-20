# Aufgabenblatt 1.1 – Program Induction

Zeitbudget: ca. 10 h · Abgabe: Commit im Repo, danach Review mit mir

Lies zuerst das Skript `docs/skripte/1.1-was-ist-ein-agent.md`.

| Aufgabe | Thema | Zeit |
| --- | --- | --- |
| 1 | Umgebung und API-Zugänge | 2 h |
| 2 | Quellen lesen | 2,5 h |
| 3 | Einordnungsübung: 10 Systeme auf der Stufenleiter | 1,5 h |
| 4 | Positionspapier «Was ist ein Agent, was nicht?» | 3 h |
| 5 | Feynman-Notiz und Journal | 1 h |

---

## Aufgabe 1 – Umgebung und API-Zugänge

**Ziel:** `uv run check_setup.py` meldet für beide Anbieter «OK».

Schritte:

1. Cursor installieren (cursor.com), das Repo öffnen und die Erweiterungen «Python» und «Jupyter» installieren. Prüfen, ob die Regel `.cursor/rules/lernmodus.mdc` unter *Settings → Rules* erscheint.
2. `uv` installieren (Befehl im Skript, Abschnitt 8) und prüfen: `uv --version`.
3. Im Repo-Wurzelverzeichnis das Python-Projekt anlegen:
   ```bash
   uv init --python 3.12 --no-readme
   uv add anthropic openai python-dotenv
   ```
   `uv init` legt eine `main.py` an, die du löschen kannst.
4. Konten bei der Anthropic Console und der OpenAI Platform anlegen, Guthaben laden, **monatliches Ausgabelimit setzen**, je einen API-Key erzeugen.
5. `cp .env.example .env` und die Keys eintragen.
6. Prüfskript ausführen:
   ```bash
   uv run module-1.1-induction/check_setup.py
   ```
   Das Skript listet die verfügbaren Modelle beider Anbieter. Das kostet keine Token. Wähle aus der Liste je ein kleines, günstiges Modell, trage es als `ANTHROPIC_MODEL` und `OPENAI_MODEL` in `.env` ein und führe das Skript erneut aus. Jetzt macht es pro Anbieter einen Mini-Aufruf (Kosten: Bruchteile eines Rappens).
7. Optional: Ollama installieren, ein kleines Modell laden (`ollama pull <modell>`) und `ollama run <modell> "Hallo"` testen.

**Abnahme:**

- [ ] `uv run module-1.1-induction/check_setup.py` zeigt zweimal `OK` und je eine Modellantwort.
- [ ] `pyproject.toml` und `uv.lock` sind committet, `.env` **nicht** (`git status` prüfen).
- [ ] Ausgabelimits sind in beiden Konten gesetzt.

---

## Aufgabe 2 – Quellen lesen

**Ziel:** Du kennst die zwei Grundlagentexte und kannst ihre Kernaussagen auf Deutsch wiedergeben.

1. Anthropic: [«Building effective agents»](https://www.anthropic.com/engineering/building-effective-agents) (Dezember 2024, ca. 25 Minuten Lesezeit).
2. Lilian Weng: [«LLM Powered Autonomous Agents»](https://lilianweng.github.io/posts/2023-06-23-agent/) (Juni 2023, ca. 45 Minuten, technischer).

**Abnahme:**

- [ ] `module-1.1-induction/notizen.md` enthält pro Quelle **drei Kernaussagen** auf Deutsch und **eine Aussage, der du widersprichst oder die du anzweifelst**, mit Begründung.

---

## Aufgabe 3 – Einordnungsübung

**Ziel:** Du kannst Systeme sicher auf der Agency-Stufenleiter (Skript, Abschnitt 5) einordnen.

Ordne jedes der elf Systeme einer Stufe 0–5 zu und begründe in einem Satz anhand der drei Einordnungsfragen. Wo die Einordnung von der konkreten Ausgestaltung abhängt, beschreibe beide Varianten.

| # | System |
| --- | --- |
| 1 | Ein Übersetzungsdienst, der einen Absatz ins Französische übersetzt |
| 2 | Ein Kundenservice-Chat, der nur aus einer FAQ antwortet |
| 3 | Ein E-Mail-Filter, der jede eingehende Mail per LLM klassifiziert und in einen Ordner verschiebt |
| 4 | Ein Code-Assistent, der in der IDE die nächste Zeile vorschlägt |
| 5 | Ein Rechercheassistent, der zu einer Frage selbst entscheidet, welche Websuchen er macht, Seiten liest und einen Bericht schreibt |
| 6 | Eine Pipeline: Rechnung als PDF → Daten extrahieren → in Buchhaltungssystem eintragen → bei Abweichung über 5 % einen Menschen fragen |
| 7 | Ein Sprachassistent, der auf «Stell den Wecker auf 7 Uhr» den Wecker stellt |
| 8 | Ein System, das nachts selbständig Fehlermeldungen aus dem Monitoring liest, die Ursache im Code sucht, einen Fix schreibt, Tests laufen lässt und einen Pull Request eröffnet |
| 9 | Ein Reiseplaner, der dir drei Varianten vorschlägt, nach deiner Wahl Hotels sucht und erst nach deiner Bestätigung bucht |
| 10 | Ein Schachprogramm wie Stockfish |
| 11 | Der Agent-Modus von Cursor, der auf deine Anweisung hin Dateien liest, Code ändert und Terminal-Befehle ausführt |

Achtung bei Nummer 10: Was sagt das über unsere Definition aus?

**Abnahme:**

- [ ] `module-1.1-induction/einordnung.md` mit Tabelle: System · Stufe · Begründung.
- [ ] Mindestens zwei Systeme mit «hängt davon ab»-Diskussion.

---

## Aufgabe 4 – Positionspapier «Was ist ein Agent, was nicht?»

**Ziel:** Eine Seite (max. 600 Wörter), mit der du einer fachkundigen, aber nicht spezialisierten Person erklärst, was ein Agent ist, und mit der du einer Entscheiderin hilfst, Agent-Washing zu erkennen.

Aufbau:

1. **Deine Definition** in einem Satz, in deinen eigenen Worten.
2. **Abgrenzung**: Was ist kein Agent, auch wenn es so verkauft wird? Mindestens zwei Beispiele.
3. **Drei Beispiele aus drei unterschiedlichen Branchen** (nicht aus deinem beruflichen Umfeld), je mit Stufe, Nutzen und grösstem Risiko.
4. **Drei Prüffragen**, mit denen jemand ein angebotenes «KI-Agenten-Produkt» einordnen kann.

**Abnahme:**

- [ ] `module-1.1-induction/positionspapier.md`, max. 600 Wörter.
- [ ] Jedes der drei Beispiele nennt eine konkrete Fehlerart aus Skript Abschnitt 6.
- [ ] Keine Sätze, die du nicht selbst erklären könntest. Ich frage im Review nach.

---

## Aufgabe 5 – Feynman-Notiz und Journal

1. `module-1.1-induction/FEYNMAN.md` nach Vorlage ausfüllen.
2. Erstes Wochenjournal `journal/2026-45.md` (Vorlage `journal/TEMPLATE.md`).
3. Zeile 1.1 im `README.md` auf «abgabebereit» setzen.

---

## Review

Wenn alles committet ist, schreib mir «Modul 1.1 abgeben». Im Review mache ich Folgendes:

1. Code und Setup prüfen.
2. Einordnung und Positionspapier kritisch kommentieren und nachfragen.
3. Das Quiz löst du auf der Lernplattform (Modul 1.1 → «Quiz starten»), bestanden ab 12 von 15. Falsche Fragen kannst du dort gezielt wiederholen; im Review besprechen wir, was noch unklar ist.

Danach ist Modul 1.2 freigeschaltet.
