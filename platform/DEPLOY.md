# Agentic AI Campus auf einem eigenen Server

Diese Anleitung bringt die Lernplattform auf einen gemieteten Linux-Server (VPS). Danach ist sie unter deiner eigenen Adresse mit HTTPS erreichbar, und nur du kannst dich anmelden. Zeitbedarf: ca. 45 Minuten.

## Was du am Ende hast

```
Browser ──HTTPS──► Caddy (Port 443, Zertifikat automatisch) ──► Campus-App (Next.js) ──► SQLite (Fortschritt)
                                                                     ▲
                                              Lerninhalte aus diesem Repo (alle 15 Min. aktualisiert)
```

Kosten: ca. 4–6 CHF pro Monat für den Server, dazu eine Domain, falls du noch keine hast.

---

## 1. Server mieten

Empfehlung: **Hetzner Cloud** (hetzner.com/cloud), Typ **CX22** (2 vCPU, 4 GB RAM) oder **CAX11** (ARM, günstiger). Beide funktionieren.

1. Projekt anlegen, *Add Server* klicken.
2. Standort: z. B. Nürnberg oder Falkenstein.
3. Image: **Ubuntu 24.04**.
4. SSH-Key hinterlegen. Hast du noch keinen, erzeugst du ihn in PowerShell mit `ssh-keygen -t ed25519` und kopierst den Inhalt von `C:\Users\goksc\.ssh\id_ed25519.pub` ins Feld.
5. Server erstellen und die **IPv4-Adresse** notieren.

Schweizer Alternativen: Infomaniak oder Exoscale. Die Anleitung funktioniert dort gleich, solange das Image Ubuntu 24.04 ist.

## 2. Adresse (Domain) einrichten

Beim Anbieter deiner Domain legst du einen **A-Record** an, z. B.:

| Typ | Name | Wert |
| --- | --- | --- |
| A | `campus` | IPv4-Adresse des Servers |

Die Plattform läuft dann unter `campus.deinedomain.ch`. Prüfen kannst du das nach ein paar Minuten mit `nslookup campus.deinedomain.ch`, es muss die Server-IP erscheinen.

Ohne eigene Domain: Bei [duckdns.org](https://www.duckdns.org) gibt es kostenlos eine Subdomain wie `g-campus.duckdns.org`, die du auf die Server-IP zeigen lässt.

## 3. Server vorbereiten

In PowerShell verbinden:

```powershell
ssh root@<SERVER-IP>
```

Auf dem Server:

```bash
apt update && apt upgrade -y
apt install -y git ufw

# Firewall: nur SSH, HTTP und HTTPS
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443
ufw --force enable

# Docker (offizielles Installationsskript)
curl -fsSL https://get.docker.com | sh
docker --version
```

## 4. Repo holen und konfigurieren

```bash
git clone https://github.com/goksche/agentic-ai-journey.git /opt/agentic-ai-journey
cd /opt/agentic-ai-journey/platform
cp .env.example .env
```

**Passwort-Hash erzeugen** (dein Login-Passwort, mindestens 12 Zeichen):

```bash
docker run --rm -it -v "$PWD/scripts:/s:ro" node:22-bookworm-slim node /s/hash-password.mjs
```

Das Skript fragt das Passwort ab und gibt eine Zeile wie `scrypt:3f1a…:9c2e…` aus.

**Sitzungsschlüssel erzeugen:**

```bash
openssl rand -hex 32
```

Jetzt `.env` bearbeiten (`nano .env`, speichern mit Ctrl+O, Enter, Ctrl+X):

```
CAMPUS_PASSWORD_HASH=scrypt:...          ← Ausgabe des Hash-Skripts
CAMPUS_SESSION_SECRET=...                ← Ausgabe von openssl
CAMPUS_DOMAIN=campus.deinedomain.ch      ← deine Adresse aus Schritt 2
```

Die Zeilen `CONTENT_DIR` und `DATA_DIR` lässt du, wie sie sind.

## 5. Starten

```bash
docker compose up -d --build
```

Der erste Build dauert 2–4 Minuten. Danach:

```bash
docker compose ps          # beide Dienste «running», app «healthy»
docker compose logs caddy  # Zertifikat: «certificate obtained successfully»
```

Öffne `https://campus.deinedomain.ch` und melde dich an.

## 6. Automatische Updates

Wenn Claude neue Lernunterlagen ins Repo pusht, soll die Plattform sie selbst übernehmen. Ein Cronjob prüft alle 15 Minuten und baut nur neu, wenn sich etwas geändert hat:

```bash
crontab -e
```

Diese Zeile ans Ende setzen:

```
*/15 * * * * /opt/agentic-ai-journey/platform/deploy.sh >> /var/log/campus-deploy.log 2>&1
```

Manuell aktualisieren geht jederzeit mit `/opt/agentic-ai-journey/platform/deploy.sh --force`.

## 7. Datensicherung

Dein Fortschritt liegt in einer einzigen SQLite-Datei im Docker-Volume `agentic-campus_campus-data`. Sicherung auf den Server:

```bash
mkdir -p /root/backups
docker run --rm -v agentic-campus_campus-data:/data -v /root/backups:/backup busybox \
  sh -c 'cp /data/campus.db /backup/campus-$(date +%F).db'
```

Als täglichen Cronjob (03:15 Uhr), zusätzlich zu Schritt 6:

```
15 3 * * * docker run --rm -v agentic-campus_campus-data:/data -v /root/backups:/backup busybox sh -c 'cp /data/campus.db /backup/campus-$(date +\%F).db'
```

Auf deinen Rechner holen (PowerShell): `scp root@<SERVER-IP>:/root/backups/*.db E:\Projects\backups\`

## Häufige Probleme

| Symptom | Ursache und Lösung |
| --- | --- |
| Browser meldet Zertifikatsfehler | DNS zeigt noch nicht auf den Server, oder Port 80/443 ist zu. `nslookup` prüfen, `ufw status` prüfen, dann `docker compose restart caddy`. |
| «Der Server ist nicht vollständig eingerichtet» beim Login | `CAMPUS_PASSWORD_HASH` fehlt in `.env` oder ist unvollständig kopiert. Danach `docker compose up -d`. |
| Login klappt, aber man landet wieder auf der Anmeldung | `CAMPUS_SESSION_SECRET` fehlt oder ist kürzer als 32 Zeichen. |
| «Zu viele Fehlversuche» | Schutz gegen Durchprobieren: 15 Minuten warten oder `docker compose restart app`. |
| Neues Modul erscheint nicht | `cat /var/log/campus-deploy.log` ansehen, notfalls `./deploy.sh --force`. |
| Passwort vergessen | Neuen Hash erzeugen (Schritt 4), in `.env` ersetzen, `docker compose up -d`. |

## Sicherheit in Kürze

- Nur Caddy ist von aussen erreichbar; die App selbst hat keinen offenen Port.
- Login mit einem einzigen Passwort, gespeichert nur als scrypt-Hash; Sitzung 30 Tage per signiertem, `httpOnly`-Cookie.
- Max. 8 Fehlversuche pro 15 Minuten und IP.
- Suchmaschinen werden ausgesperrt (`noindex`).
- Halte den Server aktuell: `apt update && apt upgrade -y` einmal im Monat.
