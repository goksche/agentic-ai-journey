"""Zeilen und Dateien einlesen.

Format einer Zeile (Combined Log Format):

    85.12.3.4 - - [12/Oct/2026:10:00:00 +0200] "GET /index.html HTTP/1.1" 200 512 "https://ref.example/" "Mozilla/5.0 ..."

Tipp: Ein regulärer Ausdruck mit benannten Gruppen zerlegt die Zeile, Pydantic prüft danach die Werte.
Für den Zeitstempel: datetime.strptime(text, "%d/%b/%Y:%H:%M:%S %z")
"""

from dataclasses import dataclass, field
from pathlib import Path

from loglens.models import LogEntry


class ParseError(ValueError):
    """Eine Zeile entspricht nicht dem Format oder enthält ungültige Werte."""


@dataclass
class LineError:
    line_no: int  # 1-basiert
    reason: str


@dataclass
class ParseResult:
    entries: list[LogEntry] = field(default_factory=list)
    errors: list[LineError] = field(default_factory=list)


def parse_line(line: str) -> LogEntry:
    """Wandelt eine Zeile in einen LogEntry um.

    Wirft ParseError, wenn die Zeile nicht passt oder ein Wert ungültig ist
    (auch wenn Pydantic einen ValidationError meldet: in ParseError umwandeln).
    """
    raise NotImplementedError("Aufgabe 1: parse_line implementieren")


def parse_file(path: Path) -> ParseResult:
    """Liest eine ganze Datei.

    - Leere Zeilen werden übersprungen und zählen nicht als Fehler.
    - Fehlerhafte Zeilen brechen nicht ab, sondern landen in ParseResult.errors.
    - Datei mit encoding="utf-8" und errors="replace" öffnen.
    """
    raise NotImplementedError("Aufgabe 1: parse_file implementieren")
