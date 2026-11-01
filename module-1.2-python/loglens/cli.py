"""Kommandozeile.

Aufruf (im Ordner module-1.2-python):

    uv run python -m loglens data/access.log
    uv run python -m loglens data/access.log --from 2026-10-13T00:00+02:00 --to 2026-10-14T00:00+02:00 --top 5 --out summary.json

Verhalten:
- Gibt eine kurze, lesbare Zusammenfassung auf der Konsole aus.
- Mit --out wird eine JSON-Datei geschrieben: {"summary": <Summary>, "parse_errors": [{"line_no": .., "reason": ..}, ...]}
- --from/--to verlangen ISO-Zeitangaben MIT Zeitzone. Ohne Zeitzone: Fehlermeldung, Exit-Code 2.
- Datei nicht gefunden: Fehlermeldung, Exit-Code 2.
- Erfolg: Exit-Code 0.
"""


def main(argv: list[str] | None = None) -> int:
    raise NotImplementedError("Aufgabe 1: CLI implementieren")
