"""Datenmodelle mit Pydantic.

Ziel: Jede gültige Logzeile wird zu einem LogEntry, jede Auswertung zu einer Summary.
Die Feldnamen und Typen sind vorgegeben, weil die Abnahmetests sie verwenden.
"""

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field, IPvAnyAddress

Method = Literal["GET", "POST", "PUT", "DELETE", "HEAD", "PATCH", "OPTIONS"]


class LogEntry(BaseModel):
    """Eine gültige Zeile aus dem Access-Log."""

    ip: IPvAnyAddress
    timestamp: datetime  # mit Zeitzone, z. B. 2026-10-12T00:03:50+02:00
    method: Method
    path: str
    protocol: str
    status: int = Field(ge=100, le=599)
    size: int = Field(ge=0)  # «-» im Log bedeutet 0
    referrer: str | None  # «-» im Log bedeutet None
    user_agent: str


class PathCount(BaseModel):
    path: str
    count: int


class Summary(BaseModel):
    """Auswertung über eine Menge von LogEntry-Objekten.

    TODO (Aufgabe 1): Felder sind vorgegeben, die Berechnung machst du in summary.py.
    """

    total_requests: int
    unique_ips: int
    first_seen: datetime | None
    last_seen: datetime | None
    by_status: dict[int, int]
    by_status_class: dict[str, int]  # Schlüssel genau "2xx", "3xx", "4xx", "5xx" (auch wenn 0)
    error_rate: float  # Anteil 4xx + 5xx, auf 4 Nachkommastellen gerundet; 0.0 bei 0 Anfragen
    top_paths: list[PathCount]  # absteigend nach count, bei Gleichstand alphabetisch nach path
