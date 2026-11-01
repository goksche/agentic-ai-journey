"""wikifetch – 20 Wikipedia-Zusammenfassungen holen, nacheinander und parallel (Aufgabe 3).

Start im Ordner module-1.2-python:  uv run python wikifetch/wikifetch.py
"""

import asyncio
import json
import logging
import time
from pathlib import Path

import httpx

HERE = Path(__file__).resolve().parent
TITLES_FILE = HERE / "titles.txt"
RESULTS_FILE = HERE / "results.json"

API = "https://de.wikipedia.org/api/rest_v1/page/summary/{title}"
USER_AGENT = "TODO"  # Programmname/Version (Zweck; Kontakt), siehe Skript Abschnitt 7
MAX_PARALLEL = 5
TIMEOUT_S = 10.0

log = logging.getLogger("wikifetch")


def load_titles(path: Path = TITLES_FILE) -> list[str]:
    """Liest die Titel, eine pro Zeile, ohne leere Zeilen."""
    raise NotImplementedError


async def fetch_summary(client: httpx.AsyncClient, title: str) -> dict:
    """Holt die Zusammenfassung zu einem Titel.

    Gibt immer ein dict zurück, nie eine Ausnahme:
        {"title": <angefragter Titel>,
         "status": "ok" | "not_found" | "error",
         "http_status": <int oder None>,
         "description": <str oder None>,
         "extract": <str oder None>,
         "error": <str oder None>}

    Bei 429, 5xx oder Timeout: einmal kurz warten und neu versuchen. Bei 404 nicht.
    Tipp: Leerzeichen im Titel durch "_" ersetzen.
    """
    raise NotImplementedError


async def fetch_sequential(client: httpx.AsyncClient, titles: list[str]) -> list[dict]:
    """Holt alle Titel nacheinander."""
    raise NotImplementedError


async def fetch_parallel(client: httpx.AsyncClient, titles: list[str]) -> list[dict]:
    """Holt alle Titel gleichzeitig, aber höchstens MAX_PARALLEL auf einmal (asyncio.Semaphore)."""
    raise NotImplementedError


async def main() -> None:
    logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
    titles = load_titles()
    # TODO: einen AsyncClient mit User-Agent und Timeout öffnen,
    #       beide Varianten mit time.perf_counter() messen,
    #       Ergebnisse und Zeiten (sekunden_nacheinander, sekunden_parallel, faktor) nach RESULTS_FILE schreiben.
    raise NotImplementedError


if __name__ == "__main__":
    asyncio.run(main())


# Antwort: Warum ist die parallele Variante ungefähr um diesen Faktor schneller und nicht 20-mal?
#
