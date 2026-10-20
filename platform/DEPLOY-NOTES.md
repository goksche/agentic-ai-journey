# Deploy-Notizen

Stand der Installation auf dem Server, zusammen mit Abweichungen von [CURSOR-DEPLOY.md](CURSOR-DEPLOY.md).

## Überblick

| Punkt | Wert |
| --- | --- |
| URL | https://ls26bar.ch (`www.ls26bar.ch` leitet dorthin weiter) |
| Variante | **B**: Auf dem Server läuft bereits nginx (Container `ibu_sw`) für andere Dienste auf Port 80/443 |
| Repo | `/opt/agentic-ai-journey`, Branch `main` |
| `.env` | `/opt/agentic-ai-journey/platform/.env` (chmod 600) |
| Override | `/opt/agentic-ai-journey/platform/docker-compose.override.yml` (nicht im Repo) |
| Daten | Docker-Volume `agentic-campus_campus-data` → `/data/campus.db` |
| Backups | täglich 03:15 nach `/opt/backups/campus/campus-JJJJ-MM-TT.db` |
| Updates | Cron alle 15 Min. `platform/deploy.sh`; manuell `/opt/agentic-ai-journey/platform/deploy.sh --force` |

## Anbindung an den bestehenden Proxy

- Die Override-Datei deaktiviert Caddy (`profiles: ["disabled"]`), hängt `app` mit dem Alias `agentic-campus-app` an das externe Netz `ibu_sw_ibu_network` und veröffentlicht den Port nur lokal (`127.0.0.1:3100`).
- Im bestehenden nginx kamen zwei neue Server-Blöcke für `ls26bar.ch` hinzu (HTTP→HTTPS, Proxy auf `agentic-campus-app:3000`). Der Upstream wird per Docker-DNS zur Laufzeit aufgelöst, damit nginx auch startet, wenn der Campus gerade nicht läuft. Header: HSTS, `X-Robots-Tag: noindex, nofollow`, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy: no-referrer`.
- Zertifikat: Let's Encrypt per Certbot-Webroot, gleich wie bei den übrigen Diensten. Verlängerung wöchentlich per Cron.

## Abweichungen und Korrekturen

- **Dockerfile:** `better-sqlite3` brachte für Node 22 keine fertige Binary mit und musste kompiliert werden. Die `deps`-Stufe installiert deshalb `python3 make g++` (Commit `ae53af2`).
- **Login per E-Mail-Code statt Passwort** (Wunsch von G, Commit `c978e17`): 6-stelliger Code an `CAMPUS_LOGIN_EMAIL`, 10 Minuten gültig, nur als HMAC gespeichert. Versand über ein bestehendes SMTP-Konto des Servers. Notfall ohne Mail: `docker compose exec app node scripts/notfall-code.mjs`, dann auf der Login-Seite «Ich habe schon einen Code».
- **Docker-Ausfälle beim ersten Build:** Ursache war ein serverseitiges Skript, das nichts mit dem Campus zu tun hat; auf dem Server behoben.
