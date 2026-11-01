"""Abnahmetests für Aufgabe 1. Nicht ändern: Sie gelten auch für die KI-Version in Aufgabe 2.

Starten im Ordner module-1.2-python:  uv run pytest -v
"""

import json
from datetime import datetime, timedelta, timezone
from pathlib import Path

import pytest

from loglens.cli import main
from loglens.models import LogEntry, Summary
from loglens.parser import ParseError, parse_file, parse_line
from loglens.summary import summarize

DATA = Path(__file__).resolve().parent.parent / "data" / "access.log"
CEST = timezone(timedelta(hours=2))

VALID = (
    '85.12.3.4 - - [12/Oct/2026:10:00:00 +0200] "GET /produkte?seite=2 HTTP/1.1" 200 512 '
    '"https://www.google.ch/" "Mozilla/5.0 (X11; Linux x86_64)"'
)


def entry(path="/", status=200, minute=0, ip="85.1.1.1") -> LogEntry:
    return LogEntry(
        ip=ip,
        timestamp=datetime(2026, 10, 12, 10, minute, tzinfo=CEST),
        method="GET",
        path=path,
        protocol="HTTP/1.1",
        status=status,
        size=100,
        referrer=None,
        user_agent="test",
    )


# --- parse_line ---------------------------------------------------------------


def test_parse_valid_line():
    e = parse_line(VALID)
    assert str(e.ip) == "85.12.3.4"
    assert e.timestamp == datetime(2026, 10, 12, 10, 0, 0, tzinfo=CEST)
    assert e.timestamp.utcoffset() == timedelta(hours=2)
    assert e.method == "GET"
    assert e.path == "/produkte?seite=2"
    assert e.protocol == "HTTP/1.1"
    assert e.status == 200
    assert e.size == 512
    assert e.referrer == "https://www.google.ch/"
    assert e.user_agent == "Mozilla/5.0 (X11; Linux x86_64)"


def test_dash_means_zero_size_and_no_referrer():
    e = parse_line('85.12.3.4 - - [12/Oct/2026:10:00:00 +0200] "GET / HTTP/1.1" 304 - "-" "curl/8.5.0"')
    assert e.size == 0
    assert e.referrer is None


def test_ipv6_address():
    e = parse_line('2001:db8::1 - - [12/Oct/2026:10:00:00 +0200] "HEAD / HTTP/1.1" 200 0 "-" "curl/8.5.0"')
    assert str(e.ip) == "2001:db8::1"


@pytest.mark.parametrize(
    "line",
    [
        "kaputte zeile ohne format",
        '85.1.2.3 - - [12/Oct/2026:10:00:00 +0200] "GET / HTTP/1.1" abc 512 "-" "curl"',  # Status kein int
        '85.1.2.3 - - [99/Oct/2026:10:00:00 +0200] "GET / HTTP/1.1" 200 512 "-" "curl"',  # Datum ungültig
        '999.1.2.3 - - [12/Oct/2026:10:00:00 +0200] "GET / HTTP/1.1" 200 512 "-" "curl"',  # IP ungültig
        '85.1.2.3 - - [12/Oct/2026:10:00:00 +0200] "FETCH / HTTP/1.1" 200 512 "-" "curl"',  # Methode unbekannt
        '85.1.2.3 - - [12/Oct/2026:10:00:00 +0200] "GET / HTTP/1.1" 700 512 "-" "curl"',  # Status zu gross
        '85.1.2.3 - - [12/Oct/2026:10:00:00 +0200] "GET / HTTP/1.1" 200 -5 "-" "curl"',  # Grösse negativ
        '85.1.2.3 - - [12/Oct/2026:10:00:00 +0200] "GET / HTTP/1.1" 200 512',  # Referrer und User-Agent fehlen
    ],
)
def test_invalid_lines_raise_parse_error(line):
    with pytest.raises(ParseError):
        parse_line(line)


# --- parse_file ---------------------------------------------------------------


def test_parse_file_counts():
    result = parse_file(DATA)
    assert len(result.entries) == 1500
    assert len(result.errors) == 9  # die leere Zeile zählt nicht
    assert all(err.line_no >= 1 and err.reason for err in result.errors)


def test_parse_file_reports_correct_line_numbers(tmp_path):
    f = tmp_path / "mini.log"
    f.write_text(VALID + "\n\nmüll\n" + VALID + "\n", encoding="utf-8")
    result = parse_file(f)
    assert len(result.entries) == 2
    assert [e.line_no for e in result.errors] == [3]


# --- summarize ----------------------------------------------------------------


def test_summary_counts():
    entries = [
        entry("/a", 200, ip="85.1.1.1"),
        entry("/a", 404, ip="85.1.1.2"),
        entry("/b", 500, ip="85.1.1.1"),
        entry("/b", 301),
        entry("/c", 200),
    ]
    s = summarize(entries)
    assert isinstance(s, Summary)
    assert s.total_requests == 5
    assert s.unique_ips == 2
    assert s.by_status == {200: 2, 404: 1, 500: 1, 301: 1}
    assert s.by_status_class == {"2xx": 2, "3xx": 1, "4xx": 1, "5xx": 1}
    assert s.error_rate == 0.4
    assert [(p.path, p.count) for p in s.top_paths] == [("/a", 2), ("/b", 2), ("/c", 1)]


def test_summary_top_limits_list():
    entries = [entry(f"/p{i}") for i in range(20)]
    assert len(summarize(entries, top=3).top_paths) == 3


def test_summary_time_window_start_inclusive_end_exclusive():
    entries = [entry(minute=m) for m in (0, 10, 20, 30)]
    s = summarize(
        entries,
        start=datetime(2026, 10, 12, 10, 10, tzinfo=CEST),
        end=datetime(2026, 10, 12, 10, 30, tzinfo=CEST),
    )
    assert s.total_requests == 2
    assert s.first_seen == datetime(2026, 10, 12, 10, 10, tzinfo=CEST)
    assert s.last_seen == datetime(2026, 10, 12, 10, 20, tzinfo=CEST)


def test_summary_empty():
    s = summarize([])
    assert s.total_requests == 0
    assert s.error_rate == 0.0
    assert s.first_seen is None
    assert s.by_status_class == {"2xx": 0, "3xx": 0, "4xx": 0, "5xx": 0}


# --- CLI ----------------------------------------------------------------------


def test_cli_writes_json(tmp_path):
    out = tmp_path / "summary.json"
    code = main([str(DATA), "--top", "5", "--out", str(out)])
    assert code == 0
    data = json.loads(out.read_text(encoding="utf-8"))
    assert data["summary"]["total_requests"] == 1500
    assert len(data["summary"]["top_paths"]) == 5
    assert len(data["parse_errors"]) == 9


def test_cli_time_window(tmp_path):
    out = tmp_path / "s.json"
    code = main([str(DATA), "--from", "2026-10-13T00:00+02:00", "--to", "2026-10-14T00:00+02:00", "--out", str(out)])
    assert code == 0
    total = json.loads(out.read_text(encoding="utf-8"))["summary"]["total_requests"]
    assert 0 < total < 1500


def test_cli_missing_file_returns_2(tmp_path):
    assert main([str(tmp_path / "gibt-es-nicht.log")]) == 2


def test_cli_rejects_time_without_timezone():
    assert main([str(DATA), "--from", "2026-10-13T00:00"]) == 2
