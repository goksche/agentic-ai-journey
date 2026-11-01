# Aufgabenblatt 1.2 – Python-Refresher mit KI

Zeitbudget: ca. 11 h · Abgabe: Commit im Repo, danach Review mit mir

Lies zuerst das Skript `docs/skripte/1.2-python.md`.

| Aufgabe | Thema | Zeit |
| --- | --- | --- |
| 1 | CLI «loglens» mit Pydantic und Tests (ohne KI) | 4,5 h |
| 2 | Dieselbe Aufgabe mit dem Cursor-Agenten lösen und vergleichen | 2 h |
| 3 | Async-Übung «wikifetch»: 20 Abrufe parallel, mit Rate-Limiting | 3,5 h |
| 4 | Feynman-Notiz und Journal | 1 h |

**Reihenfolge einhalten:** Aufgabe 1 vor Aufgabe 2. Wer die KI-Lösung zuerst sieht, lernt in Aufgabe 1 nichts mehr.

> **Lehre aus Modul 1.1:** Geh vor «bitte prüfen» jede Abnahme-Checkbox selbst durch. Was du nicht abhaken kannst, ist noch nicht fertig.

---

## Vorbereitung (einmalig, 10 Minuten)

Im Repo-Wurzelverzeichnis (`E:\Projects\agentic-ai-journey`):

```bash
git pull
uv add pydantic httpx
uv add --dev pytest
```

Danach arbeitest du für dieses Modul **im Ordner `module-1.2-python`**:

```bash
cd module-1.2-python
uv run pytest            # am Anfang: 21 Tests rot (failed). Das ist richtig so.
```

---

## Aufgabe 1 – CLI «loglens» (ohne KI)

**Ziel:** Ein Kommandozeilen-Werkzeug, das ein Webserver-Log einliest, fehlerhafte Zeilen meldet statt abzustürzen und eine Auswertung als JSON schreibt.

**Lernmodus:** Schreib den Code selbst. Cursor darf erklären, Fehlermeldungen deuten und Fragen beantworten, aber keinen Code für `loglens/` schreiben. Tab-Vervollständigung für diese Aufgabe in Cursor ausschalten (*Settings → Tab*), sonst schreibt sie doch die KI.

### Was schon da ist

| Datei | Inhalt |
| --- | --- |
| `data/access.log` | 1510 Zeilen echtes Format (Combined Log Format), mit Fehlern darin |
| `loglens/models.py` | **fertig:** die Pydantic-Modelle `LogEntry`, `PathCount`, `Summary` |
| `loglens/parser.py` | Gerüst: `parse_line`, `parse_file` |
| `loglens/summary.py` | Gerüst: `summarize` |
| `loglens/cli.py` | Gerüst: `main` |
| `loglens/__main__.py` | fertig: macht `python -m loglens` möglich |
| `tests/test_abnahme.py` | 21 Abnahmetests. **Nicht ändern.** |
| `tests/test_eigene.py` | hier kommen deine eigenen Tests hin |

Lies zuerst `models.py` und die Docstrings in den drei Gerüsten. Dort steht genau, was jede Funktion tun muss.

### Vorgehen (Vorschlag)

1. `parse_line`: Schau dir fünf Zeilen in `data/access.log` an. Zerlege eine Zeile mit einem regulären Ausdruck (benannte Gruppen, `re`-Modul). Danach baust du daraus einen `LogEntry` und lässt Pydantic prüfen. Starte mit `uv run pytest -k parse_line -v`.
2. `parse_file`: Zeilennummern zählen (`enumerate(..., start=1)`), Fehler sammeln statt abbrechen.
3. `summarize`: Tipp: `collections.Counter`.
4. `main`: `argparse`, dann die drei Teile zusammenstecken. Ausprobieren:
   ```bash
   uv run python -m loglens data/access.log --top 5
   uv run python -m loglens data/access.log --from 2026-10-13T00:00+02:00 --to 2026-10-14T00:00+02:00 --out summary.json
   ```
5. Mindestens **5 eigene Tests** in `tests/test_eigene.py`. Gute Kandidaten: Randfälle, die die Abnahmetests nicht abdecken (z. B. `POST` mit Referrer, `--top 0`, Zeitfenster ohne Treffer, Datei nur mit kaputten Zeilen, `--to` vor `--from`).

### Regeln für die Ausgabe

- `summary.json` hat genau zwei Schlüssel: `summary` und `parse_errors` (Liste mit `line_no` und `reason`).
- Exit-Code `0` bei Erfolg, `2` wenn die Datei fehlt oder ein Zeitpunkt ohne Zeitzone angegeben wird. Dann eine verständliche Meldung auf `stderr`, kein Traceback.
- Ohne `--out` wird das JSON auf den Bildschirm geschrieben.
- Für Meldungen `logging` statt `print` (Ausnahme: die JSON-Ausgabe selbst).

**Abnahme:**

- [ ] `uv run pytest -v` zeigt alle 21 Abnahmetests grün.
- [ ] `tests/test_eigene.py` enthält mindestens 5 eigene, sinnvolle Tests, alle grün. Mindestens einer nutzt `parametrize`, mindestens einer `tmp_path`.
- [ ] `uv run python -m loglens data/access.log --top 5` gibt gültiges JSON aus.
- [ ] `uv run python -m loglens gibt-es-nicht.log` zeigt eine Meldung ohne Traceback.
- [ ] Kein `except Exception: pass` und kein nacktes `except:` im Code.
- [ ] Du kannst jede Zeile deines Codes erklären. Im Review frage ich nach.

---

## Aufgabe 2 – Dieselbe Aufgabe mit dem Cursor-Agenten

**Ziel:** Du erlebst, was ein Coding-Agent gut und schlecht macht, und prüfst seinen Code so kritisch, wie du später die Ergebnisse deiner eigenen Agenten prüfen musst (Skript, Abschnitt 8).

### Vorgehen

1. Erst wenn Aufgabe 1 fertig und committet ist.
2. Kopiere die drei Gerüste und `models.py`/`__init__.py`/`__main__.py` nach `ki-version/loglens/` (also den Ordner `loglens` in seinem Anfangszustand, z. B. `git show` oder von GitHub). Deine eigene Lösung bleibt unberührt.
3. Neuer Chat im Cursor-Agentenmodus. Schreib einen Auftrag, der mit **«KI-Modus:»** beginnt (sonst greift die Lernmodus-Regel). Gib dem Agenten mit: den Ordner `ki-version/loglens`, die Datei `tests/test_abnahme.py` als Vorgabe und die Regeln aus Aufgabe 1. Verlange, dass er die Tests selbst ausführt, bevor er «fertig» meldet. Befehl dafür:
   ```bash
   cd ki-version
   uv run pytest -c pytest.ini ../tests/test_abnahme.py -v
   ```
4. Speichere deinen Auftrag wörtlich in `vergleich.md` (Vorlage ist da).
5. Lass den Agenten nicht an `tests/` oder an deiner Lösung arbeiten. Wenn er es versucht: abbrechen und notieren.
6. Vergleiche beide Lösungen anhand der Tabelle in `vergleich.md`.

**Abnahme:**

- [ ] `ki-version/loglens/` existiert, und der Testbefehl oben läuft.
- [ ] `vergleich.md` ist vollständig ausgefüllt: Auftrag, Zeit, Tabelle, mindestens **drei konkrete Beobachtungen mit Codezeile oder Dateiname**.
- [ ] Mindestens eine Stelle, an der die KI-Lösung schlechter, falsch oder unnötig kompliziert ist, oder eine begründete Aussage, warum du keine gefunden hast und wie du gesucht hast.
- [ ] Ein Fazit: Was übernimmst du in Zukunft vom Agenten, was nicht?

---

## Aufgabe 3 – Async-Übung «wikifetch»

**Ziel:** 20 Wikipedia-Zusammenfassungen holen, einmal nacheinander, einmal parallel mit höchstens 5 gleichzeitigen Anfragen. Fehler und fehlende Artikel werden sauber gemeldet, nichts stürzt ab.

**Lernmodus:** wieder ohne KI-Code (wie Aufgabe 1).

### Die Schnittstelle

```
GET https://de.wikipedia.org/api/rest_v1/page/summary/{titel}
```

Liefert JSON mit u. a. `title`, `description` und `extract` (die ersten Sätze des Artikels). Probier eine Adresse im Browser aus, bevor du programmierst. Dokumentation: [Wikimedia REST API](https://de.wikipedia.org/api/rest_v1/) (Abschnitt «Page content», `/page/summary/{title}`).

### Was schon da ist

- `wikifetch/titles.txt`: 20 Titel, einer pro Zeile. **Einer davon existiert absichtlich nicht.**
- `wikifetch/wikifetch.py`: Gerüst mit den Funktionen und ihren Docstrings.

Starten:

```bash
uv run python wikifetch/wikifetch.py
```

### Anforderungen

1. **User-Agent:** Jede Anfrage trägt einen aussagekräftigen `User-Agent` mit Programmname, Zweck und Kontakt (z. B. deine GitHub-Seite). Skript, Abschnitt 7.
2. **Ein Client** (`httpx.AsyncClient`) für alle Anfragen, Timeout 10 Sekunden.
3. **Höchstens 5 gleichzeitig:** `asyncio.Semaphore(5)`.
4. **Ein Wiederholungsversuch** bei Status 429 oder 5xx und bei Timeouts, nach einer kurzen Pause (`await asyncio.sleep(...)`). Nicht bei 404.
5. **Kein Absturz:** Der fehlende Artikel und jeder andere Fehler landen als Ergebnis mit Status in der Ausgabe.
6. **Zeitmessung:** dieselben 20 Titel einmal nacheinander, einmal parallel. Messen mit `time.perf_counter()`.
7. **Ausgabe:** `wikifetch/results.json` mit einer Liste von Ergebnissen (Felder siehe Gerüst) und den beiden gemessenen Zeiten.

**Achtung, Stolperstein:** Ein Titel kann auf einen anderen Artikel umleiten (Weiterleitung, HTTP-Status 3xx). Finde heraus, was `httpx` standardmässig mit Weiterleitungen macht, prüfe, ob das bei deinen 20 Titeln vorkommt, und notiere das Ergebnis in deiner Feynman-Notiz.

Falls die Schnittstelle gar nicht antwortet oder sich geändert hat: melde dich, dann passe ich die Aufgabe an.

**Abnahme:**

- [ ] `wikifetch/results.json` enthält 20 Ergebnisse: 19 mit Status `ok` und Text, 1 mit Status `not_found`.
- [ ] Die parallele Variante ist messbar schneller. Faktor in `results.json`.
- [ ] Unter dem Gerüst-Kommentar `# Antwort:` am Ende von `wikifetch.py` erklärst du in 2–4 Sätzen, **warum** der Faktor ungefähr so gross ist und nicht 20.
- [ ] Im Code ist nachvollziehbar, wo das Semaphore, der User-Agent und der Wiederholungsversuch stehen.
- [ ] Du kannst erklären, was passieren würde, wenn du `return_exceptions=True` weglässt und ein Aufruf eine Ausnahme wirft.

---

## Aufgabe 4 – Feynman-Notiz und Journal

1. `module-1.2-python/FEYNMAN.md` ausfüllen (Vorlage ist da). Thema: **async/await und warum ein Agent Pydantic braucht**, so erklärt, dass es eine Kollegin ohne Programmiererfahrung versteht.
2. `journal/2026-45.md` ausfüllen.

**Abnahme:**

- [ ] Beide Dateien sind ausgefüllt, ohne Fachwörter, die nicht erklärt werden.
- [ ] Die Stelle «Wo ich ins Stocken geraten bin» ist ehrlich und konkret.

---

## Modulabschluss

Modul 1.2 ist bestanden, wenn alle Abnahmen erfüllt sind, das Review mit mir durch ist und das Quiz auf der Lernplattform mit mindestens 12 von 15 Punkten bestanden ist.
