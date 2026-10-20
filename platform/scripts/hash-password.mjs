// Erzeugt einen scrypt-Hash für CAMPUS_PASSWORD_HASH.
// Aufruf: node scripts/hash-password.mjs  (fragt das Passwort ab)
//     oder: node scripts/hash-password.mjs "mein passwort"
import { randomBytes, scryptSync } from "node:crypto";
import { createInterface } from "node:readline/promises";

let pw = process.argv[2];
if (!pw) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  pw = await rl.question("Passwort: ");
  rl.close();
}
if (!pw || pw.length < 12) {
  console.error("Bitte ein Passwort mit mindestens 12 Zeichen wählen.");
  process.exit(1);
}
const salt = randomBytes(16).toString("hex");
const hash = scryptSync(pw, salt, 64).toString("hex");
console.log(`scrypt:${salt}:${hash}`);
