# Agentic AI Campus

Persönliche Lernplattform für das Selbststudium. Sie liest den Studienaufbau aus `../curriculum.yaml` und die Lernunterlagen direkt aus diesem Repo und speichert deinen Fortschritt in SQLite.

| Funktion | Wo |
| --- | --- |
| «Hier weitermachen» mit nächster Aufgabe und Zeitangabe | Übersicht |
| 36-Wochen-Leiste und Fortschritt pro Modul | Übersicht |
| Aufgaben abhaken, Quiz-Ergebnis eintragen, Modul abschliessen | Modulseite |
| Lernskripte, Aufgabenblätter und Quiz lesen | Dokumentansicht |

Ein Modul erscheint als freigegeben, sobald sein Aufgabenblatt (Feld `aufgaben` in `curriculum.yaml`) im Repo liegt.

## Auf dem Server betreiben

Siehe [DEPLOY.md](DEPLOY.md).

## Lokal starten (optional)

Voraussetzung: Node.js 22.

```powershell
cd platform
npm install
copy .env.example .env
# CAMPUS_LOGIN_EMAIL: deine Adresse
# CAMPUS_SESSION_SECRET: beliebige Zeichenfolge mit mindestens 32 Zeichen
# SMTP_* leer lassen: Der Login-Code erscheint dann in der Konsole
npm run dev
```

Dann http://localhost:3000 öffnen, «Code per E-Mail senden» klicken und den Code aus der Konsole eingeben.

## Technik

Next.js 15 (App Router, Server Actions), better-sqlite3, jose für die Sitzung, nodemailer für den Login-Code, react-markdown für die Dokumente. Schriften: Atkinson Hyperlegible und Source Serif 4, lokal eingebunden.
