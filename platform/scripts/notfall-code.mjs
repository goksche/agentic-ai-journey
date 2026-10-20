// Erzeugt einen Login-Code ohne E-Mail, z. B. wenn der Mailversand ausfällt.
// Aufruf auf dem Server (im Ordner platform/):
//   docker compose exec app node scripts/notfall-code.mjs
// Der Code ist 10 Minuten gültig und ersetzt alle offenen Codes.
import { createHmac, randomInt } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

const secret = process.env.CAMPUS_SESSION_SECRET;
if (!secret || secret.length < 32) {
  console.error("CAMPUS_SESSION_SECRET fehlt oder ist kürzer als 32 Zeichen.");
  process.exit(1);
}

const dataDir = path.resolve(process.env.DATA_DIR ?? "./data");
fs.mkdirSync(dataDir, { recursive: true });
const db = new Database(path.join(dataDir, "campus.db"));
db.exec(`
  CREATE TABLE IF NOT EXISTS login_codes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code_hash TEXT NOT NULL,
    created_at TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    attempts INTEGER NOT NULL DEFAULT 0,
    used_at TEXT
  );
`);

const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
const now = new Date();
const expires = new Date(now.getTime() + 10 * 60 * 1000);
const hash = createHmac("sha256", secret).update(code).digest("hex");

db.transaction(() => {
  db.prepare("UPDATE login_codes SET used_at = ? WHERE used_at IS NULL").run(now.toISOString());
  db.prepare("INSERT INTO login_codes (code_hash, created_at, expires_at) VALUES (?, ?, ?)").run(
    hash,
    now.toISOString(),
    expires.toISOString(),
  );
})();
db.close();

console.log(`Login-Code: ${code}  (gültig bis ${expires.toLocaleTimeString("de-CH")})`);
console.log("Auf der Login-Seite „Ich habe schon einen Code“ wählen; „Code per E-Mail senden“ würde diesen Code ersetzen.");
