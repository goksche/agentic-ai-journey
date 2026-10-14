# Studien- und Lernplan Agentic AI

Stand: 14. Oktober 2026 · Studiengangleitung: Claude · Studierender: G

## Ausgangslage und Zielbild

Ziel: In neun Monaten (November 2026 bis Juli 2027) den Stand eines vollständigen Agentic-AI-Programms erreichen und ihn in drei neutralen, bewusst anspruchsvollen Projekten umsetzen – einem Recherche-Agenten mit Quellennachweis, einem autonomen Software-Team, das echte GitHub-Issues löst, und einer Produktstrategie-Simulation als Capstone.

**Dein Startprofil**

- Projektleitung und Beratung – du denkst in Prozessen, Rollen und Anforderungen; das hilft beim Entwurf von Agentensystemen, wird hier aber nicht zum Projektthema.
- Praktische Softwareentwicklung (TypeScript, Python, Docker) – der Python-Refresher wird deshalb auf zwei Wochen verdichtet.
- Die Projekte sind absichtlich ausserhalb deiner bisherigen Themen gewählt: Sie fordern Reasoning über lange Dokumente, autonome Codeänderungen unter Testdruck und messbare Strategiearbeit – Felder, in denen Agenten heute am ehesten scheitern und du am meisten lernst.

**Annahmen für diesen Plan** (bitte anpassen, wenn sie nicht stimmen)

| Annahme | Wert |
| --- | --- |
| Lernzeit pro Woche | 10 h (2 Abende à 2 h + 1 Block à 6 h am Wochenende) |
| Start | 2. November 2026 |
| Dauer | 36 Wochen in 3 Semestern à 12 Wochen |
| Sprache der Lernmaterialien | Englisch; Notizen und Doku auf Deutsch |
| Budget für Cloud/APIs | ca. 80–120 CHF pro Monat (LLM-APIs, eine Cloud-VM, Azure-Credits); Semester 2 ist am teuersten |
| Rechner | Laptop mit Docker; lokale Modelle über Ollama optional |

**Kompetenzziele am Ende der Ausbildung**

1. Agentensysteme entwerfen: Rollen, Tools, Speicher, Orchestrierung und Fehlerbehandlung begründet wählen.
2. Agenten bauen: Single-Agent (LangChain/LangGraph), Multi-Agent (CrewAI, AutoGen), Low-Code (n8n), MCP-Server eigenständig implementieren.
3. Agenten betreiben: Observability, Evaluation, Kosten, Sicherheit und Deployment (Docker, Azure) beherrschen.
4. Agenten verantworten und verkaufen: Business Case, ROI, Metriken, UX-Transparenz und Governance gegenüber Entscheidern vertreten.
5. Portfolio: drei öffentlich dokumentierte Projekte auf GitHub mit messbaren Ergebnissen (Benchmark-Scores, Eval-Berichte).

## Studienaufbau und Zeitplan

Drei Semester à 12 Wochen, jedes mit einem Praxisprojekt als Semesterabschluss. Die 13 Pflichtmodule des Syllabus sind auf die Semester verteilt; die Electives (Azure Foundry, Copilot Studio/AutoGen, Academic Masterclass) sind als Vertiefungen integriert.

| Semester | Zeitraum | Schwerpunkt | Module | Abschlussprojekt |
| --- | --- | --- | --- | --- |
| 1 – Grundlagen | 2. Nov 2026 – 24. Jan 2027 | LLM-Mechanik, Prompting, erster Agent | Induction, Python-Refresher, Foundations, GenAI-Stack & Prompting, LLM Internals & Planning | Recherche-Agent mit Quellennachweis («Scholar») |
| 2 – Multi-Agenten | 25. Jan – 18. Apr 2027 | Orchestrierung, Protokolle, Low-Code | Multi-Agent I (CrewAI/LangGraph), Multi-Agent II (AutoGen/n8n), MCP & Tooling | Autonomes Software-Team («Forge»), gemessen an SWE-bench Lite |
| 3 – Produktreife | 19. Apr – 11. Jul 2027 | Metriken, UX, Deployment, Azure, Capstone | Metrics/GTM/ROI, Agentic UX, Dev Tools & Readiness, Azure Agents, Capstone | Capstone: Produktstrategie-Simulation mit vier Agenten |

**Wochenbudget (10 h)**

| Block | Dauer | Inhalt |
| --- | --- | --- |
| Theorie | 3 h | Kursvideos, Paper, Doku lesen; Notizen als Markdown im Repo |
| Übungen | 3 h | Geführte Aufgaben des Moduls (Notebooks, kleine Skripte) |
| Projekt | 3 h | Fortschritt am Semesterprojekt, Commit auf GitHub |
| Reflexion | 1 h | Lernjournal, Wochenziel prüfen, nächste Woche planen |

**Puffer**: Jedes Semester enthält eine Pufferwoche (Woche 12) für Nacharbeit, Abschlussprojekt und Review. Fällt eine Woche aus (Ferien, beruflicher Druck), rückt der Plan um eine Woche; die Semestergrenze bleibt als Meilenstein.

## Semester 1 – Grundlagen (Woche 1–12)

Am Ende von Semester 1 läuft ein Single-Agent mit Tool-Calling, Speicher und Planungslogik, der eine Forschungsfrage eigenständig recherchiert und jede Aussage mit einer überprüfbaren Quelle belegt.

### Modul 1.1 – Program Induction (Woche 1)

**Lernziele**: Den Unterschied zwischen generativer KI, KI-Assistenten und Agenten präzise erklären; die eigene Lernumgebung aufsetzen.

**Inhalt**: Definition «Agent» (Wahrnehmung, Planung, Handlung, Speicher), Agency-Stufen (Chatbot → Copilot → Workflow-Agent → autonomer Agent), bekannte Fehlschläge autonomer Agenten und warum sie passieren.

**Aufgaben**

- [ ] GitHub-Repo `agentic-ai-journey` anlegen, mit Ordner pro Modul und README als Lernjournal
- [ ] Entwicklungsumgebung: Python 3.12, uv, VS Code mit Copilot, Docker; API-Keys für OpenAI und Anthropic; optional Ollama lokal
- [ ] Einseitiges Positionspapier: «Was ist ein Agent, was nicht?» mit drei Beispielen aus unterschiedlichen Branchen

### Modul 1.2 – Python-Refresher mit KI (Woche 2–3, verdichtet)

**Lernziele**: Python idiomatisch und asynchron schreiben; KI-generierten Code kritisch prüfen.

**Inhalt**: Typing und Pydantic-Modelle, async/await, Context Manager, Dataclasses, pytest, Logging, Packaging; Arbeiten mit Copilot/Cursor (Prompt-Refinement, Review von generiertem Code).

**Aufgaben**

- [ ] CLI `loglens`: Webserver-Logs (Apache/Nginx-Format) einlesen, validieren (Pydantic), nach Status, Pfad und Zeitfenster aggregieren, als JSON exportieren – mit Tests
- [ ] Dieselbe Aufgabe einmal selbst, einmal vollständig mit Copilot lösen; Unterschiede in einem Review-Dokument festhalten
- [ ] Async-Übung: 20 parallele Abrufe gegen eine öffentliche API (z. B. Wikipedia) mit httpx, asyncio und Rate-Limiting

### Modul 1.3 – Foundations of AI & Agentic AI (Woche 4–5)

**Lernziele**: Transformer, Embeddings und Attention konzeptionell erklären; Reasoning-Muster (CoT, ReAct, Reflexion, Tree of Thoughts) unterscheiden und anwenden.

**Inhalt**: ML/DL-Grundlagen im Schnelldurchlauf, Transformer-Architektur, Tokenisierung, Kontextfenster, Temperatur/Sampling, Halluzinationen; Paper: «Attention Is All You Need», «ReAct», «Reflexion».

**Aufgaben**

- [ ] Drei Paper lesen und je eine halbe Seite zusammenfassen: Kernidee, Grenzen, Relevanz für Agenten
- [ ] Notebook: Embeddings für 200 arXiv-Abstracts berechnen, Ähnlichkeitssuche und Clustering visualisieren, Cluster benennen lassen
- [ ] ReAct von Hand: ein Reasoning-Loop in reinem Python (Thought → Action → Observation) ohne Framework, mit einem Taschenrechner- und einem Wikipedia-Such-Tool; Abbruch nach n Schritten

### Modul 1.4 – GenAI Tech Stack und Prompt Engineering (Woche 6–7)

**Lernziele**: Den GenAI-Stack (Compute, Modelle, Orchestrierung, Speicher, Monitoring) einordnen und Prompts systematisch entwerfen und evaluieren.

**Inhalt**: Modellwahl (Frontier-API vs. Open-Weights lokal), Inferenzkosten, Quantisierung, Vektor-Datenbanken (Chroma, Qdrant, pgvector), LLMOps-Lifecycle; Prompt-Techniken: Zero-/Few-Shot, CoT, ReAct, strukturierte Ausgabe (JSON Schema), System-Prompt-Design, Prompt-Injection.

**Aufgaben**

- [ ] Prompt-Bibliothek mit 10 Vorlagen für wissenschaftliches Arbeiten (Abstract zusammenfassen, Methodik extrahieren, Widersprüche zwischen zwei Papern finden, Zitat prüfen), versioniert im Repo
- [ ] Evaluations-Harness: 30 Testfälle, automatische Bewertung mit LLM-as-Judge, Vergleich von drei Modellen nach Qualität, Latenz, Kosten
- [ ] Red-Team-Übung: fünf Prompt-Injection-Angriffe über manipulierte Dokumente gegen die eigene Vorlage und Gegenmassnahmen dokumentieren

### Modul 1.5 – LLM Internals & Planning Systems (Woche 8–11)

**Lernziele**: Function Calling, Tool-Integration und Speicherstrategien implementieren; einen Agenten mit LangChain/LangGraph aufbauen, der mehrstufige Aufgaben plant und ausführt.

**Inhalt**: Function/Tool Calling nativ (OpenAI, Anthropic) und über LangChain; Speicherarten (Kurzzeit, Zusammenfassung, Vektor, Entity); LangGraph-Grundlagen (State, Nodes, Edges, Checkpoints, Human-in-the-Loop); Planungsmuster (Plan-and-Execute, Task-Decomposition); RAG-Pipeline.

**Aufgaben**

- [ ] Tool-Calling ohne Framework: drei Tools (arXiv-Suche, PDF-Volltext laden, Notiz speichern) an die rohe API anbinden
- [ ] RAG über 50 Paper eines Fachgebiets deiner Wahl: Chunking-Strategien vergleichen, Retrieval evaluieren (Precision@5 gegen 30 handannotierte Fragen)
- [ ] LangGraph-Agent mit Checkpointing und einem Human-in-the-Loop-Schritt (Freigabe des Rechercheplans vor der Ausführung)

### Semesterprojekt 1 (Woche 11–12): «Scholar» – Recherche-Agent mit Quellennachweis

Ein Agent, der zu einer Forschungsfrage (z. B. «Welche Evidenz gibt es für den Einfluss von Schlaf auf das Langzeitgedächtnis?») eigenständig einen Rechercheplan erstellt, arXiv und Web durchsucht, PDFs liest, eine Wissensbasis aufbaut und einen Bericht mit nummerierten, auf Seite und Absatz genauen Quellenangaben erzeugt. Er markiert Widersprüche zwischen Quellen, gibt Konfidenzen an und fragt bei unklarer Fragestellung zurück.

**Warum das schwer ist**: Lange Dokumente sprengen das Kontextfenster, Zitate werden gern erfunden, und Widersprüche zu erkennen verlangt echtes Reasoning über mehrere Quellen.

**Abgabe**: Repo mit README (Architekturskizze, Entscheidungen), 5 Forschungsfragen mit Berichten, ein Zitat-Audit (jedes Zitat manuell gegen die Quelle geprüft; Zielquote ≥ 95 % korrekt), Kostenübersicht pro Bericht, 15-minütige Demo-Aufzeichnung.

**Bewertungskriterien**: Zitattreue, Umgang mit Widersprüchen und Unklarheit, Speicherverhalten über eine Sitzung hinweg, Code-Qualität, Dokumentation.

## Semester 2 – Multi-Agenten-Systeme und Protokolle (Woche 13–24)

Am Ende von Semester 2 kannst du ein Multi-Agent-System in drei Frameworks (LangGraph, CrewAI, AutoGen) und in n8n bauen, über eigene MCP-Server an Werkzeuge und Daten anbinden und die Wahl des Frameworks begründen – belegt durch ein Software-Team aus Agenten, das an einem öffentlichen Benchmark gemessen wird.

### Modul 2.1 – Multi-Agent Ecosystems I: CrewAI und LangGraph (Woche 13–16)

**Lernziele**: Rollenbasierte Architekturen entwerfen; Kommunikationsmuster (Hierarchie, Pipeline, Debatte, Blackboard) umsetzen; Zustand und Übergaben zwischen Agenten verwalten; Agentic RAG bauen.

**Inhalt**: CrewAI (Agents, Tasks, Crews, Process sequential/hierarchical, Flows), LangGraph für Multi-Agent (Supervisor-Pattern, Subgraphs, parallele Nodes, Streaming), Agentic RAG (Query-Rewriting, Routing, Self-Correction), Konfliktlösung und Abbruchkriterien.

**Aufgaben**

- [ ] CrewAI-Crew «Due Diligence»: Finanz-, Markt- und Risikoanalyst sowie Redaktor erstellen aus dem öffentlichen Geschäftsbericht eines börsenkotierten Unternehmens ein Investment-Memo mit belegten Zahlen
- [ ] Dasselbe System in LangGraph mit Supervisor-Pattern; Vergleichsdokument: Kontrolle, Debuggbarkeit, Kosten, Latenz
- [ ] Agentic RAG über die Python- und Django-Dokumentation mit Routing zwischen Vektorindex, SQL-Datenbank (Issue-Tracker-Export) und Web-Suche
- [ ] Debatte-Muster: zwei Agenten vertreten Gegenpositionen zu einer Analysefrage, ein Richter-Agent entscheidet; messen, ob die Antwortqualität gegenüber einem Einzelagenten steigt (20 Fragen, Blindbewertung)

### Modul 2.2 – Multi-Agent Ecosystems II: AutoGen und n8n (Woche 17–20)

**Lernziele**: Enterprise-Orchestrierung mit Microsoft AutoGen (AgentChat, Core, Teams) und Low-Code-Automation mit n8n; Datenbank- und Vektorintegration; Skalierungs- und Performance-Entscheidungen.

**Inhalt**: AutoGen-Konversationsmuster (Two-Agent, Group Chat, Nested), Code-Execution-Sandbox, Tool-Registrierung; n8n (Trigger, AI-Agent-Node, Memory, Sub-Workflows, Error-Handling, Credentials), Integration Postgres/pgvector, Message-Queues; Vergleich Code-first vs. Low-Code.

**Aufgaben**

- [ ] AutoGen Group Chat «Incident-Postmortem»: Agenten für Logs, Metriken, Code-Diff und Redaktion erarbeiten aus einem simulierten Ausfall (bereitgestellte Logs und Commits) eine Ursachenanalyse mit Massnahmen
- [ ] n8n per Docker aufsetzen; Workflow: neues GitHub-Issue → Klassifikation (Bug/Feature/Frage) → Agent formuliert Rückfrage oder Reproduktionsschritte → Label und Kommentar auf GitHub
- [ ] Lasttest: 50 parallele Issues gegen den n8n-Workflow, Engpässe (LLM-Rate-Limits, DB, Queue) messen und beheben
- [ ] Entscheidungsmatrix: Wann CrewAI, LangGraph, AutoGen, n8n, klassische Workflow-Engine – mit Kriterien Kontrolle, Governance, Teamskills, Betrieb, Kosten

### Modul 2.3 – Model Context Protocol und Tooling (Woche 21–23)

**Lernziele**: MCP-Server und -Clients implementieren; Tool-Schemas entwerfen; Kontext-Persistenz, System-Prompt-Architektur und sicheres Tool-Hosting beherrschen; Risiken autonomer Werkzeugnutzung managen.

**Inhalt**: MCP-Primitive (Tools, Resources, Prompts, Sampling), Transporte (stdio, HTTP/SSE), Authentifizierung (OAuth), Schema-Design mit JSON Schema, Idempotenz und Berechtigungsstufen, Audit-Logging, Prompt-Injection über Tool-Ausgaben, Sandboxing von Code-Ausführung, Supply-Chain-Risiken bei Drittanbieter-Servern.

**Aufgaben**

- [ ] MCP-Server «repo-tools» in Python (FastMCP): Dateisystem mit Pfad-Whitelist, git (branch, diff, commit), Test-Runner in einem Docker-Sandbox-Container mit Zeit- und Ressourcenlimit
- [ ] MCP-Server «web-research»: Suche, Seitenabruf mit Cache, Extraktion von Doku-Seiten – wiederverwendbar für Scholar und das Software-Team
- [ ] Sicherheitsreview beider Server nach Checkliste (Least Privilege, Input-Validierung, Pfad-Traversal, Rate Limits, Logging); Findings beheben; ein Angriff über eine manipulierte README demonstrieren und abwehren
- [ ] System-Prompt-Architektur für das Software-Team: Rollen, Grenzen, Eskalationsregeln, Tool-Nutzungsregeln als versioniertes Dokument

### Semesterprojekt 2 (Woche 23–24): «Forge» – autonomes Software-Team

Vier Agenten (Planer, Entwickler, Reviewer, Tester) lösen echte Issues aus Open-Source-Repositories: Issue verstehen, Codebasis erkunden, Änderung planen, implementieren, Tests schreiben und ausführen, Review-Schleife bis die Tests grün sind, Pull-Request-Beschreibung erzeugen. Gemessen wird am öffentlichen Benchmark SWE-bench Lite (Teilmenge von 30 Aufgaben).

**Warum das schwer ist**: Der Agent muss sich in fremdem Code orientieren, zwischen Symptom und Ursache unterscheiden, mit fehlschlagenden Tests umgehen und wissen, wann er aufgibt – genau dort scheitern die meisten Agentensysteme.

**Abgabe**: Architekturdokument (C4-Level 2), Repo, beide MCP-Server mit Tests, Benchmark-Bericht (Lösungsquote, Kosten und Dauer pro Aufgabe, Fehlertypen), 20-minütige Präsentation für ein technisches Publikum.

**Bewertungskriterien**: Begründete Framework-Wahl, Lösungsquote (Ziel: ≥ 25 % auf der Teilmenge, Vergleich mit publizierten Werten), Robustheit (Fehlerfälle, Wiederholungen, Abbruch), Sicherheit der Sandbox, Nachvollziehbarkeit jeder Agentenentscheidung.

## Semester 3 – Produktreife, Business und Azure (Woche 25–36)

Am Ende von Semester 3 kannst du ein Agentensystem produktionsreif betreiben, seinen Nutzen in Zahlen belegen, vertrauenswürdig gestalten und in einer Azure-Umgebung deployen – und hast ein Capstone als öffentliche Referenz.

### Modul 3.1 – Metrics, GTM & ROI (Woche 25–27)

**Lernziele**: Agenten-Performance messbar machen (Latenz, Erfolgsquote, Kosten pro Aufgabe, Eskalationsrate); Workflows mit Observability-Tools nachverfolgen; Business Case, Pricing und Go-to-Market für ein Agentenprodukt entwickeln.

**Inhalt**: Observability mit LangSmith, Langfuse (selbst gehostet) oder OpenTelemetry; Evaluationsarten (Offline-Evals, Online-A/B, Human Review); Metrik-Baum von Task-Success bis zum Unternehmens-KPI; Pricing-Modelle (pro Seat, pro Ergebnis, Hybrid), Lean Canvas, ROI-Rechnung mit Vorher/Nachher-Messung.

**Aufgaben**

- [ ] Langfuse per Docker aufsetzen und «Forge» vollständig tracen (jede Agentenentscheidung, jeder Tool-Aufruf, Tokens, Kosten)
- [ ] Eval-Suite erweitern: 60 SWE-bench-Lite-Aufgaben; Baseline vs. drei Verbesserungsiterationen (Planung, Retrieval, Review-Schleife) in einer Tabelle mit Lösungsquote und Kosten je Iteration
- [ ] ROI-Modell im Spreadsheet für ein fiktives Produkt «Forge als Service für Entwicklungsteams»: gelöste Issues × eingesparte Stunden × Stundensatz minus Betriebskosten; Sensitivitätsanalyse auf drei Annahmen
- [ ] Einseitiges GTM-Papier: Zielkunden, Einstiegsangebot, Pricing, Einwände und Antworten

### Modul 3.2 – Agentic UX Design & Transparency (Woche 28–29)

**Lernziele**: Vertrauenswürdige Agenten-Interaktionen gestalten: Transparenz, Erklärbarkeit, Human-in-the-Loop, Umgang mit Mehrdeutigkeit, Guardrails und Bias-Minderung.

**Inhalt**: Interaktionsmuster (Vorschlag vs. Ausführung, Vorschau, Rückgängig, Konfidenzanzeige), Erklärungen für Nicht-Experten, Eskalationsdesign, Guardrails (Input/Output, Policy-Engines wie NeMo Guardrails oder eigene Regeln), EU AI Act und Schweizer Datenschutz als Rahmen, Bias-Tests.

**Aufgaben**

- [ ] UX-Richtlinie «Autonome Codeänderungen» (5 Seiten): wann der Agent fragt, wann er handelt, wie er seine Änderung erklärt, wie er scheitert
- [ ] Prototyp eines Freigabe-Dialogs (React/TypeScript): Diff, Begründung, betroffene Tests, Konfidenz, Freigabe/Ablehnung/Nachbesserung – angebunden an den Review-Schritt von Forge
- [ ] Guardrail-Layer mit 10 Regeln (verbotene Dateien und Befehle, Secrets, Lizenzfragen, Sprachregeln) und Tests dafür

### Modul 3.3 – Dev Tools & Product Readiness (Woche 30–31)

**Lernziele**: Agentensysteme deployen und betreiben: Hosting-Modelle, Monitoring, Event-Logging, Feedback-Schleifen, Release-Prozess.

**Inhalt**: Containerisierung und Compose/Kubernetes-Grundlagen, Secrets-Management, CI/CD mit GitHub Actions inkl. Eval-Gate, Versionierung von Prompts und Modellen, Rollback, Incident-Handling, Feedback-Erfassung aus der Nutzung zurück in die Eval-Suite.

**Aufgaben**

- [ ] CI-Pipeline für Forge: Lint, Tests, Eval-Suite (Mindest-Lösungsquote als Gate), Docker-Build, Deployment auf eine Cloud-VM deiner Wahl
- [ ] Runbook für den Betrieb: Dashboards, Alarme (Fehlerquote, Latenz, Kosten pro Tag), Notfallabschaltung
- [ ] Produktionsreife-Checkliste (30 Punkte) für Agentensysteme, abgeleitet aus eigenen Erfahrungen

### Modul 3.4 – Develop AI Agents on Azure (Woche 32–33, inkl. Elective Azure Foundry)

**Lernziele**: Agenten in Azure bauen und betreiben: Azure AI Foundry, Agent Service, Modellkatalog, Sicherheits- und Compliance-Integration, skalierbares Hosting.

**Inhalt**: Foundry-Projekte, Modellauswahl und -deployment, Foundry SDK, Prompt Flow, RAG mit Azure AI Search, Entra ID und Managed Identity, Private Endpoints, Content Safety, Kostenkontrolle; Copilot Studio als Low-Code-Alternative (Elective-Masterclass).

**Aufgaben**

- [ ] Scholar nach Azure portieren: Agent Service + Azure AI Search + Container App; Vergleich Betriebsaufwand und Kosten gegenüber der eigenen VM
- [ ] Microsoft-Lernpfad «Develop AI agents on Azure» abschliessen; optional Zertifizierung AI-102 als Nachweis
- [ ] Copilot-Studio-Prototyp von Scholar: Grenzen des Low-Code-Ansatzes dokumentieren

### Capstone – Product Strategy Simulation (Woche 34–36)

Vier Agenten (Marktforschung, Wettbewerbsanalyse, Pricing/Strategie, Content/Launch) in CrewAI, orchestriert über n8n, mit MCP-Anbindung an Web-Recherche und Datenquellen, erarbeiten eine Produktstrategie für ein fiktives Produkt. Das Produkt wird per Los aus drei Märkten gezogen, die du vorher nicht kennst (z. B. Sprachlern-App für Kinder, Lastenrad-Sharing, Energie-Management für Mehrfamilienhäuser) – die Agenten müssen die Recherche von null leisten. Ergebnis: Lean Canvas, Pricing, Analytics-Konzept und ein deploybarer Chatbot, der die Strategie gegenüber Interessenten erklärt und Rückfragen beantwortet.

**Warum das schwer ist**: Marktdaten sind lückenhaft und widersprüchlich, Agenten neigen zu plausiblen, aber unbelegten Zahlen, und vier Agenten müssen eine konsistente Strategie statt vier Einzelberichte liefern.

**Abgabe**: Repo, Architekturdokument, Eval- und Kostenbericht, Lean Canvas mit belegten Zahlen, Live-Demo (30 Minuten) und ein Blogartikel als öffentlicher Nachweis.

**Bewertungskriterien**: Durchgängigkeit (von Recherche bis Deployment), Belegqualität jeder Zahl, Konsistenz zwischen den Agenten, Messbarkeit, Transparenz der Entscheidungen.

## Projektportfolio und Electives

Die Projekte sind bewusst domänenneutral und bauen technisch aufeinander auf: Die MCP-Server aus Semester 2 bedienen alle drei Systeme, die Observability aus Semester 3 misst sie, und das Capstone kombiniert alles.

| Projekt | Semester | Framework | Baut auf | Messbarer Nachweis |
| --- | --- | --- | --- | --- |
| Scholar – Recherche-Agent | 1 | LangGraph | – | Zitat-Audit ≥ 95 % korrekt über 5 Berichte |
| Due-Diligence-Crew und Debatte-Muster | 2 | CrewAI, LangGraph | Scholar-Tools | Blindbewertung Einzel- vs. Multi-Agent (20 Fragen) |
| Incident-Postmortem und Issue-Triage | 2 | AutoGen, n8n | – | Lasttest 50 parallele Issues |
| MCP-Server repo-tools und web-research | 2 | FastMCP, Docker-Sandbox | – | Sicherheitsreview, abgewehrter Angriff |
| Forge – autonomes Software-Team | 2 | Multi-Agent + MCP | Beide MCP-Server | SWE-bench Lite ≥ 25 % auf 30 Aufgaben |
| Observability, Evals, CI/CD | 3 | Langfuse, GitHub Actions | Forge | Drei Iterationen mit dokumentierter Verbesserung |
| Azure-Portierung | 3 | Azure AI Foundry, Agent Service | Scholar | Kostenvergleich VM vs. Azure, optional AI-102 |
| Capstone Produktstrategie | 3 | CrewAI, n8n, MCP | Alles davor | Lean Canvas mit belegten Zahlen, Blogartikel |

**Electives aus dem Syllabus – so sind sie integriert**

- *Develop Generative AI Apps in Azure (Foundry)*: in Modul 3.4 als Pflichtteil.
- *Masterclass Copilot Studio und AutoGen*: AutoGen in Modul 2.2, Copilot Studio als Prototyp-Aufgabe in Modul 3.4.
- *AI Impact Studio / Academic Masterclass*: ersetzt durch wöchentliche Lektüre aktueller Paper und Release-Notes (siehe Ressourcen) sowie Teilnahme an zwei Community-Events (Meetup, Konferenz) im Verlauf der Ausbildung.

## Lernrhythmus, Methoden und Leistungsnachweise

Der Plan funktioniert nur mit festem Rhythmus: Jede Woche hat ein messbares Ziel, jedes Modul einen Nachweis, jedes Semester ein Projekt und ein Review.

**Wochenrhythmus**

1. Montag: Wochenziel aus dem Modulplan ableiten (ein Satz, prüfbar) und in das Lernjournal schreiben.
2. Zwei Abende: Theorie und geführte Übungen; Notizen als Markdown im Repo, Code committen.
3. Wochenendblock: Projektarbeit; am Ende ein kurzer Demo-Clip oder Screenshot als Fortschrittsbeleg.
4. Sonntag: Reflexion (Was habe ich gelernt? Was war schwieriger als gedacht? Was ändere ich?) und Planung der Folgewoche.

**Lernmethoden**

- *Build first*: Jedes Konzept wird innerhalb von 48 Stunden in Code umgesetzt, sonst gilt es als nicht gelernt.
- *Zweimal bauen*: Wichtige Muster (ReAct, Tool-Calling, Supervisor) einmal ohne Framework, einmal mit – so verstehst du, was das Framework abnimmt.
- *Feynman-Notiz*: Pro Modul eine Erklärung in einfacher Sprache, als würdest du sie einer fachfremden Person geben.
- *Lehren*: Pro Semester ein interner Vortrag, Blogartikel oder LinkedIn-Beitrag.
- *Lernpartner*: Ich (Claude) als Tutor – wöchentliche Review-Session mit Code-Review, Quizfragen zum Modul und Kritik an Architekturentscheidungen; frage gezielt nach Gegenargumenten.

**Leistungsnachweise**

| Nachweis | Häufigkeit | Bestanden, wenn |
| --- | --- | --- |
| Modulquiz (15 Fragen, von mir gestellt) | pro Modul | ≥ 80 % richtig, Fehler nachgearbeitet |
| Modulaufgaben | pro Modul | alle Checkboxen erledigt, Code im Repo lauffähig |
| Feynman-Notiz | pro Modul | eine Seite, ohne Fachjargon verständlich |
| Semesterprojekt | pro Semester | Abgabe vollständig, Demo gehalten, Review-Punkte eingearbeitet |
| Semester-Review | pro Semester | schriftliche Selbsteinschätzung zu den fünf Kompetenzzielen (Skala 1–5) |
| Capstone | einmal | öffentlich dokumentiert, extern präsentiert (Kunde, Meetup oder Kollegen) |

**Abschluss**: Die Ausbildung gilt als abgeschlossen, wenn alle Semesterprojekte und das Capstone abgegeben sind und die Selbsteinschätzung in allen fünf Kompetenzzielen mindestens 4 von 5 erreicht.

**Beschleunigung**: Die 36 Wochen sind eine Obergrenze, kein Soll. Ein Modul gilt als abgeschlossen, sobald Quiz, Aufgaben und Feynman-Notiz bestanden sind – nicht, wenn die geplanten Wochen vorbei sind. Wer Modul 1.2 in einer Woche schafft, startet 1.3 sofort. Nicht verkürzbar sind die drei Semesterprojekte: Sie brauchen Iterationen, und ihre Messwerte (Zitat-Audit, SWE-bench, Belegqualität) entscheiden über den Abschluss. Realistisch sind 6–7 Monate statt 9, wenn Grundlagen schnell sitzen.

## Lehrmittel

Ich bereite die Lehrmittel pro Modul vor und stelle sie jeweils zum Modulstart als Dateien für das Repo bereit – auf Deutsch, wo immer ich sie selbst schreibe.

| Lehrmittel | Was es ist | Sprache |
| --- | --- | --- |
| Lernskript | 8–15 Seiten pro Modul: Konzepte, Beispiele, Code-Snippets, Verweise auf Primärquellen | Deutsch |
| Aufgabenblatt | Jede Aufgabe mit Zielbild, Startgerüst (Code-Skeleton, Testdaten), Abnahmekriterien | Deutsch |
| Musterlösung | Nach deiner Abgabe freigeschaltet, mit Kommentaren zu Alternativen | Deutsch |
| Modulquiz | 15 Fragen mit Erklärung, ich stelle sie im wöchentlichen Review | Deutsch |
| Cheat-Sheets | Je eine Seite pro Framework (LangGraph, CrewAI, AutoGen, n8n, MCP) | Deutsch |
| Externe Quellen | Framework-Dokus, Paper, Microsoft Learn, DeepLearning.AI – bleiben Englisch; ich fasse das Wesentliche im Skript auf Deutsch zusammen | Englisch |

**Ablauf**: Du sagst «Modul 1.1 starten», ich liefere Skript, Aufgabenblatt und Quiz. Du arbeitest, committest ins Repo, ich reviewe Code und Notiz und stelle das Quiz. Am Ende von Modul 1.1 liegt damit auch die Repo-Struktur fest (`docs/`, `module-XX/`, `projects/`, `journal/`).

## Ressourcen und Werkzeuge

Primärquellen sind die offiziellen Dokumentationen der Frameworks; Kurse dienen als Einstieg, nicht als Ersatz für das Bauen. Links und Kursnamen bitte beim Start der jeweiligen Woche auf Aktualität prüfen – das Feld bewegt sich monatlich.

| Modul | Lernquellen | Werkzeuge |
| --- | --- | --- |
| 1.1–1.3 Grundlagen | Simplilearn-Programm (Syllabus oben) als Leitfaden; DeepLearning.AI-Kurzkurse zu Prompting und Agenten; Paper «Attention Is All You Need», «ReAct», «Reflexion»; Andrej Karpathys Vorträge zu LLMs | Python 3.12, Jupyter, OpenAI- und Anthropic-SDK, optional Ollama |
| 1.4 Prompting | Anthropic- und OpenAI-Prompting-Guides; Blogbeitrag «Building effective agents» (Anthropic) | Promptfoo oder eigenes Eval-Skript, Chroma/pgvector |
| 1.5 LLM Internals, Scholar | LangChain- und LangGraph-Dokumentation, LangChain Academy (kostenlos); arXiv-API-Doku | LangGraph, LangSmith (Free Tier), PyMuPDF für PDFs |
| 2.1 CrewAI/LangGraph | CrewAI-Dokumentation und DeepLearning.AI-Kurs «Multi AI Agent Systems with crewAI» | CrewAI, LangGraph |
| 2.2 AutoGen/n8n | Microsoft AutoGen-Dokumentation; n8n-Dokumentation und Community-Templates | AutoGen, n8n (Docker), Postgres/pgvector |
| 2.3 MCP, Forge | Spezifikation und Tutorials unter modelcontextprotocol.io; FastMCP-Dokumentation; SWE-bench-Repository und Paper; SWE-agent und OpenHands als Referenzarchitekturen (Code lesen, nicht kopieren) | FastMCP, Claude Desktop als Test-Client, Docker-Sandbox, SWE-bench-Harness |
| 3.1 Metriken/ROI | Langfuse-Dokumentation; Lean-Canvas-Vorlage | Langfuse (Docker), Spreadsheet |
| 3.2 UX/Transparenz | Microsoft HAX-Toolkit, Google PAIR-Guidebook, EU AI Act (Überblick), NeMo Guardrails | React/TypeScript, Guardrails-Bibliothek |
| 3.3 Readiness | «Designing Machine Learning Systems» (Chip Huyen), GitHub-Actions-Doku | GitHub Actions, Docker Compose, Cloud-VM (z. B. Hetzner) |
| 3.4 Azure | Microsoft-Learn-Pfade «Develop AI agents on Azure» und «Develop generative AI apps in Azure AI Foundry»; AI-102-Prüfungsleitfaden | Azure AI Foundry, Azure AI Search, Container Apps |

**Laufende Lektüre (wöchentlich 30 Minuten)**: Release-Notes von LangGraph, CrewAI, AutoGen und MCP; Newsletter wie «Latent Space» oder «The Batch»; arXiv-Stichwörter «LLM agents», «tool use», «multi-agent», «SWE-bench».

**Ablage**: Alles im Repo `agentic-ai-journey` – Notizen, Code, Evals, Journal.

## Nächste Schritte

Bis zum Start am 2. November 2026 sind vier Dinge zu klären, danach beginnt Woche 1 mit der Induction.

- [ ] Annahmen bestätigen oder anpassen: Wochenbudget, Startdatum, API-Budget
- [ ] Repo `agentic-ai-journey` für Claude freigeben (claude.ai → Connectors → GitHub) oder öffentlich stellen; diesen Plan als `PLAN.md` ablegen
- [ ] Entwicklungsumgebung und API-Zugänge einrichten (Modul 1.1, Aufgabe 2)
- [ ] Ersten wöchentlichen Review-Termin mit mir als Tutor festlegen (z. B. Sonntagabend); dort: Quiz zu Modul 1.1, Besprechung des Positionspapiers

**Offene Fragen an dich**: Welches Fachgebiet soll Scholar in Semester 1 recherchieren (eines, das dich interessiert, aber nicht dein Beruf ist)? Wo soll Forge laufen – eigene Cloud-VM oder direkt Azure? Willst du die AI-102-Zertifizierung einplanen (zusätzlich ca. 20 h)?
