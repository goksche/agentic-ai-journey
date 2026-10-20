# Übergabe an den Cursor-Agenten: Agentic AI Campus in Betrieb nehmen

Diese Datei ist ein Arbeitsauftrag für den Cursor-Agenten. Er kennt den Zielserver aus anderen Projekten, die Studiengangleitung (Claude) nicht. Die allgemeine Anleitung für einen frischen Server steht in [DEPLOY.md](DEPLOY.md). Hier geht es darum, die Plattform **auf dem bestehenden Server** sauber einzufügen, ohne andere Dienste zu stören.

Für `platform/` gilt der Lernmodus nicht: Der Agent darf hier vollständig implementieren.

## Ziel

- Die Plattform läuft dauerhaft auf dem bestehenden Server unter einer (Sub-)Domain, die G festlegt, z. B. `campus.<domain>`.
- Der Zugang läuft über HTTPS mit gültigem Zertifikat.
- Neue Inhalte aus `main` erscheinen automatisch, spätestens nach 15 Minuten.
- Der Fortschritt (SQLite) bleibt bei Updates erhalten und wird täglich gesichert.
- Andere Projekte auf dem Server laufen unverändert weiter.

## Was die Plattform braucht

| Punkt | Wert |
| --- | --- |
| Laufzeit | Docker-Image aus `platform/Dockerfile`, Build-Kontext ist die **Repo-Wurzel** |
| Interner Port | 3000 (HTTP) |
| Persistenz | Verzeichnis `/data` im Container (SQLite-Datei `campus.db`) |
| Inhalte | werden beim Build aus dem Repo ins Image kopiert (`/app/content`) |
| Healthcheck | `GET /healthz` liefert `ok` |
| Pflicht-Umgebungsvariablen | `CAMPUS_PASSWORD_HASH`, `CAMPUS_SESSION_SECRET` (siehe `.env.example`) |
| Architektur | amd64 und arm64 werden unterstützt |
| Ressourcen | ca. 150 MB RAM im Betrieb; der Build braucht kurzzeitig ca. 1,5 GB |

## Schritte

### 1. Bestandsaufnahme (zuerst nur lesen, nichts ändern)

Auf dem Server prüfen und G das Ergebnis kurz zusammenfassen:

- Betriebssystem, CPU-Architektur (`uname -m`), freier RAM und Speicherplatz
- Docker und Docker Compose vorhanden? Versionen?
- Was belegt Port 80 und 443 (`ss -ltnp`)? Läuft ein Reverse Proxy (nginx, Traefik, Caddy, Nginx Proxy Manager)? In Docker oder direkt auf dem System?
- Wie bekommen bestehende Dienste ihre Zertifikate?
- Ist der Server direkt aus dem Internet erreichbar, oder läuft er hinter NAT, Tunnel oder VPN?

### 2. Variante wählen

| Lage auf dem Server | Vorgehen |
| --- | --- |
| **A** – Port 80/443 frei, Server öffentlich erreichbar | `platform/docker-compose.yml` unverändert verwenden (inkl. Caddy), wie in DEPLOY.md |
| **B** – Es läuft bereits ein Reverse Proxy | **Caddy nicht starten.** Eine Override-Datei `platform/docker-compose.override.yml` anlegen, die den Dienst `caddy` deaktiviert (`profiles: ["disabled"]`) und `app` an das Netzwerk des bestehenden Proxys hängt oder nur an `127.0.0.1:<freier Port>` veröffentlicht. Dann im bestehenden Proxy einen Host-Eintrag für die Campus-Domain auf `app:3000` bzw. `127.0.0.1:<Port>` anlegen, mit Zertifikat auf dem gleichen Weg wie bei den anderen Diensten. |
| **C** – Server nicht öffentlich erreichbar (NAT, Heimnetz) | Mit G klären: Cloudflare Tunnel (öffentlich unter der Domain) oder Tailscale (nur privat). Caddy weglassen wie bei B. |

Die Override-Datei ist serverspezifisch: Sie bleibt nur auf dem Server und wird **nicht committet**. Sie in die `.gitignore` von `platform/` aufnehmen.

Wichtige Header, die der bestehende Proxy setzen soll (Vorlage siehe `platform/Caddyfile`): `X-Forwarded-For`, HSTS, `X-Robots-Tag: noindex`.

### 3. Konfiguration

1. Repo auf den Server klonen (Vorschlag: `/opt/agentic-ai-journey`) oder ein bestehendes Projektverzeichnis-Schema des Servers übernehmen.
2. `platform/.env` aus `.env.example` erzeugen.
3. **Passwort:** G gibt das Passwort selbst ein. Das Skript fragt es interaktiv ab:
   ```bash
   docker run --rm -it -v "$PWD/scripts:/s:ro" node:22-bookworm-slim node /s/hash-password.mjs
   ```
   Die Ausgabe (`scrypt:…:…`) kommt als `CAMPUS_PASSWORD_HASH` in `.env`. Das Klartext-Passwort nie in Dateien, Logs oder den Chat schreiben.
4. `CAMPUS_SESSION_SECRET` mit `openssl rand -hex 32` erzeugen.
5. Bei Variante A: `CAMPUS_DOMAIN` setzen.
6. `.env` muss `chmod 600` haben und darf nie committet werden. `platform/.gitignore` deckt das ab, bitte prüfen.

### 4. Start und Prüfung

```bash
cd platform
docker compose up -d --build
docker compose ps
curl -fsS http://127.0.0.1:<Port>/healthz   # bei Variante B/C; bei A über die Domain
```

Abnahme, bevor G informiert wird:

- [ ] `https://<campus-domain>` zeigt die Anmeldeseite mit gültigem Zertifikat
- [ ] Falsches Passwort ergibt die Meldung «Das Passwort stimmt nicht.»
- [ ] Nach dem Login zeigt die Übersicht den gelben Wegweiser mit Modul 1.1
- [ ] Eine Aufgabe abhaken, `docker compose restart app`: Der Haken ist noch da (Persistenz geprüft); danach den Haken wieder entfernen
- [ ] `/doc/docs/skripte/1.1-was-ist-ein-agent.md` zeigt das Lernskript
- [ ] Andere Dienste auf dem Server sind weiterhin erreichbar

### 5. Automatische Updates und Backup

- Cronjob für `platform/deploy.sh` alle 15 Minuten (siehe DEPLOY.md, Abschnitt 6). Bei Variante B/C prüfen, dass `docker compose up -d --build` die Override-Datei mitnimmt. Das geschieht automatisch, solange sie `docker-compose.override.yml` heisst und im Ordner `platform/` liegt.
- Tägliches Backup der SQLite-Datei (DEPLOY.md, Abschnitt 7). Volume-Name: `agentic-campus_campus-data`. Falls der Server bereits ein Backup-System hat, die Datei dort einhängen.

### 6. Rückmeldung an G

Kurz zusammenfassen:

- gewählte Variante (A/B/C) und warum
- URL der Plattform
- wo Repo, `.env` und Backups auf dem Server liegen
- wie man manuell aktualisiert (`platform/deploy.sh --force`)
- Abweichungen von dieser Anleitung

## Was der Agent nicht tun soll

- Bestehende Proxy-Konfigurationen anderer Dienste ändern, ausser einen **neuen** Host-Eintrag für den Campus hinzuzufügen
- Ports 80/443 einem bestehenden Proxy wegnehmen
- Firewall-Regeln anderer Dienste ändern
- Secrets committen oder im Chat ausgeben
- Den Code der Plattform umbauen. Falls etwas nicht funktioniert, das Problem in `platform/DEPLOY-NOTES.md` dokumentieren, damit Claude es im Repo korrigieren kann.
