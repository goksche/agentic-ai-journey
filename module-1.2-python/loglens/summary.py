"""Auswertung."""

from collections.abc import Iterable
from datetime import datetime

from loglens.models import LogEntry, Summary


def summarize(
    entries: Iterable[LogEntry],
    start: datetime | None = None,
    end: datetime | None = None,
    top: int = 10,
) -> Summary:
    """Erstellt eine Summary.

    - start ist inklusiv, end ist exklusiv: start <= timestamp < end. Fehlt einer, gilt keine Grenze.
    - top bestimmt, wie viele Einträge top_paths höchstens hat.
    """
    raise NotImplementedError("Aufgabe 1: summarize implementieren")
