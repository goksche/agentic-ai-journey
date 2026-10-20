const BLOB = process.env.GITHUB_BLOB_URL ?? "https://github.com/goksche/agentic-ai-journey/blob/main";

export const githubBlobUrl = (rel: string) => `${BLOB}/${rel}`;
/** Öffnet den Web-Editor von GitHub; Speichern erzeugt direkt einen Commit. */
export const githubEditUrl = (rel: string) => `${BLOB.replace("/blob/", "/edit/")}/${rel}`;

/** Dateien, die der Studierende selbst bearbeitet (keine Unterlagen der Studiengangleitung). */
export function isStudentFile(rel: string): boolean {
  if (/(^|\/)AUFGABEN\.md$/.test(rel)) return false;
  return /^(module-[^/]+|projects\/[^/]+|journal)\//.test(rel) || rel === "pyproject.toml";
}
