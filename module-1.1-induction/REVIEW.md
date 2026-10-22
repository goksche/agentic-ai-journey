# Review Modul 1.1 – Zwischenstand

Stand: 22. Oktober 2026, geprüft: Commits bis `5e4b32b`. Das ist ein Zwischenreview. Das Abschlussreview folgt, wenn du «Modul 1.1 abgeben» schreibst.

| Aufgabe | Stand | Urteil |
| --- | --- | --- |
| 1 – Umgebung | erledigt | angenommen |
| 2 – Quellen | Anthropic fertig, Weng offen | nachbessern |
| 3 – Einordnung | vollständig | 3 Einordnungen korrigieren, sonst gut |
| 4 – Positionspapier | Entwurf, 188 Wörter | ausbauen, ein Formatfehler |
| 5 – Feynman, Journal | nicht begonnen | offen |
| Quiz | für mich nicht sichtbar | Ergebnis bitte im Chat nennen |

Was insgesamt auffällt: Du denkst über die Vorgaben hinaus (Betriebsblindheit bei Freigaben, «braucht es dafür überhaupt KI?»). Genau diese kritische Haltung macht später gute Agentensysteme aus. Schwächer ist bisher die **saubere Anwendung der drei Einordnungsfragen**. Darauf liegt der Fokus der Korrekturen.

---

## Aufgabe 1 – Umgebung

`check_setup.py` meldet «alles bereit», `pyproject.toml` und `uv.lock` sind committet, `.env` nicht. **Angenommen.** Hak die Aufgabe auf der Plattform ab, sobald die Ausgabelimits in beiden API-Konten gesetzt sind.

## Aufgabe 2 – Quellen (`notizen.md`)

**Anthropic: gut.** Drei Kernaussagen in eigenen Worten, inhaltlich korrekt. Eine Ergänzung: Die zentrale Unterscheidung des Artikels fehlt als eigene Aussage, nämlich *Workflow = vorgegebener Codepfad, Agent = Modell steuert selbst*. Deine Aussage 1 setzt sie voraus, nennt sie aber nicht. Ich würde sie als Kernaussage 1 formulieren und die anderen zusammenziehen.

**Dein Widerspruch ist stark.** Menschen, die ständig Freigaben erteilen, winken irgendwann nur noch durch. In der Forschung heisst das *Automation Bias* bzw. *Automation Complacency*. Führ den Gedanken einen Schritt weiter: Was folgt daraus für das Design? Mögliche Antworten:
- Stichproben, bei denen der Agent bewusst einen Fehler einbaut, um die Aufmerksamkeit zu prüfen
- die Quote der Ablehnungen messen: nahe 0 % ist ein Warnsignal
- Freigaben nur dort, wo ein Fehler teuer und nicht rückgängig zu machen ist

Das Thema kommt in Modul 3.2 (Agentic UX) wieder.

*Format:* Die Fettschrift ist kaputt (`**Aussage:*…*`). Richtig ist `**Aussage:** Text`.

**Weng: offen.** Die Kernaussagen fehlen noch. Deine Rohnotizen zeigen, dass du den Teil Planung gelesen hast, sind aber weitgehend eine Übersetzung des Originals, und «Selbstreflexion» bricht ab. Lies noch die Teile *Memory* und *Tool Use*, dann formuliere drei Kernaussagen in eigenen Worten. Ein guter Test: Kannst du jede Aussage in einem Satz sagen, ohne auf den Text zu schauen?

## Aufgabe 3 – Einordnung (`einordnung.md`)

Acht von elf Einordnungen passen. Drei korrigieren, zwei Begründungen schärfen:

| # | Deine Stufe | Meine Einschätzung | Warum |
| --- | --- | --- | --- |
| 7 Wecker | 0 | **2** | Der Assistent *handelt*: Er ruft ein Tool auf, den Wecker. Stufe 0 heisst nur Text erzeugen. Weil der Mensch jeden Schritt auslöst und nur ein Schritt folgt, ist es Stufe 2, kein Agent (siehe Quizfrage 14). |
| 10 Stockfish | 2 | **ausserhalb der Leiter** | Unsere Stufenleiter gilt für Systeme mit einem Sprachmodell. Stockfish hat keines. Siehe unten. |
| 11 Cursor-Agent | 5 | **4** | Du begründest es selbst: «Die Berechtigung wird während der Arbeit erfragt». Freigaben durch einen anwesenden Menschen sind genau die Leitplanken von Stufe 4. Stufe 5 hiesse: läuft lange ohne laufende Aufsicht. |
| 9 Reiseplaner | 4 ✓ | 4 | Stufe stimmt, die Begründung nicht: Entscheidend ist nicht, *dass* er bucht, sondern dass er **erst nach deiner Bestätigung** bucht. Das ist die Leitplanke. |
| 8 Nacht-Agent | 4 | **4 oder 5** | Im Skript steht genau dieses Beispiel bei Stufe 5, weil er nachts ohne Aufsicht läuft. Dein Argument, dass der Pull Request erst nach menschlicher Prüfung gemergt wird, ist berechtigt. Damit ist das der beste Kandidat für «hängt davon ab». |

**Begründungen allgemein:** Die Aufgabe verlangt die drei Einordnungsfragen: Kann es handeln? Wer legt die Reihenfolge fest? Wie lange läuft es ohne Menschen? Bei mehreren Zeilen fehlen sie, z. B. bei Nr. 6 «Klassischer Flow». Besser wäre: «Handelt (trägt ins System ein), die Reihenfolge legt der Code fest, bei über 5 % Abweichung entscheidet der Mensch: Stufe 3».

**«Hängt davon ab»:**
- *Nr. 3, Variante A* ist ein guter Ansatz, aber noch ungenau: Automatisch antworten allein macht noch keine Stufe 4. Ist «klassifizieren → Antwort schreiben → senden» fest vorgegeben, bleibt es ein Workflow, also Stufe 3. Stufe 4 wird es erst, wenn das Modell selbst entscheidet, *ob* es antwortet, weiterleitet, nachfragt oder recherchiert.
- *Nr. 3, Variante B* ist eine richtige Beobachtung: Regelbasierte Filter ohne LLM gibt es seit Jahrzehnten. Sie sind aber nicht Stufe 0, sondern fallen aus der Leiter heraus, genau wie Stockfish.

**Nr. 10 Stockfish – inhaltliche Korrektur:** «Stockfish ist kein KI-basierter Dienst» stimmt nicht. Stockfish *ist* KI: Suchalgorithmen und seit 2020 ein neuronales Netz (NNUE) für die Stellungsbewertung. Es ist nur **kein Sprachmodell**. Darin liegt der Kern der Frage: «Agent» ist ein viel älterer Begriff aus der klassischen KI, wo jedes System, das wahrnimmt, entscheidet und handelt, ein Agent ist. Ein Stockfish, der selbständig eine ganze Partie spielt, ist in diesem Sinn ein Agent. **Unsere Definition ist bewusst enger: Sie meint LLM-Agenten.** Deine Schlussfolgerung «nicht jede Aufgabe braucht ein LLM» ist trotzdem richtig und wertvoll. Formulier die Antwort entsprechend um.

## Aufgabe 4 – Positionspapier (`positionspapier.md`)

**Zuerst ein Formatfehler:** Deine Definition und die Abgrenzung stehen innerhalb von `<!-- … -->`. Das ist ein HTML-Kommentar und **auf der Plattform unsichtbar**. Entferne `<!--` und `-->` und schreib den Text als normalen Absatz.

**Definition:** «Ein LLM mit Armen und Beinen» ist ein gutes, einprägsames Bild. Inhaltlich fehlt aber das Entscheidende: Ein LLM mit Tools auf einem festen Ablauf ist nach deiner eigenen Abgrenzung ein Workflow. Ergänze, **wer entscheidet**, z. B.: «… das selbst entscheidet, welches Werkzeug es als Nächstes einsetzt, das Ergebnis prüft und so lange weitermacht, bis das Ziel erreicht ist.»

**Abgrenzung:** Gefordert sind mindestens zwei *konkrete* Beispiele für Systeme, die als Agent verkauft werden, aber keiner sind. Ideen: ein FAQ-Chatbot mit dem Etikett «KI-Agent», eine Automatisierung (Zapier, RPA), die einen einzelnen LLM-Schritt enthält.

**Drei Branchen:**
- *Vertragsprüfung* war mein Beispiel aus dem Rechtswesen. Ersetz es durch eine eigene Branche.
- *Stromnetz, Stufe 3:* Nach deiner eigenen Definition ist das ein Workflow, also kein Agent. Gesucht sind Agenten (Stufe 4 oder 5). Entweder die Rolle des Systems so beschreiben, dass es selbst über die nächsten Analyseschritte entscheidet, oder ein anderes Beispiel wählen. Der Satz bricht ausserdem ab («… kann zu»).
- *Bauprojekt:* gutes Beispiel, passende Fehlerart.
- *«F1, F2»:* Nenn die Fehlerarten mit Namen und Abschnitt aus dem Skript, z. B. «Fehlerakkumulation (6.1)».

**Prüffragen: gut.** Die ersten beiden entsprechen den Einordnungsfragen, die dritte ist ein wichtiger Zusatz. Noch schärfer: «Was passiert, wenn ein Schritt fehlschlägt, und wer merkt es?»

**Form:** Bisher sind es Stichworte. Gefragt ist ein Text für eine Entscheiderin, also ganze Sätze. Du hast bis 600 Wörter Platz, 400–500 sind ideal.

## Aufgabe 5 und Quiz

Feynman-Notiz und Journal sind noch leer. Mach die Feynman-Notiz **nach** der Überarbeitung des Positionspapiers. Dann merkst du, ob die Definition sitzt.

Dein Quiz-Ergebnis sehe ich nicht, es liegt in der Datenbank der Plattform. Nenn es mir beim nächsten Mal, oder schreib es ins Journal.

---

## Nächste Schritte

- [ ] Weng-Kernaussagen und Widerspruch ergänzen
- [ ] `einordnung.md`: Nr. 7, 10 und 11 korrigieren, Begründungen mit den drei Fragen, Nr. 8 als zweites «hängt davon ab»
- [ ] `positionspapier.md`: Kommentarzeichen entfernen, Definition schärfen, Vertragsprüfung ersetzen, Stromnetz anpassen, Fliesstext
- [ ] Feynman-Notiz und Journal
- [ ] Danach: «Modul 1.1 abgeben» schreiben

---

## Nachtrag 22. Oktober, 20:05 – Aufgabe 4 (Commit `da1e9b1`)

**Erledigt:** Die Kommentarzeichen sind weg, Definition und Abgrenzung sind jetzt sichtbar.

**Neu entstanden:** Mit den Kommentarzeichen ist auch mein Hinweis «Nicht aus deinem beruflichen Umfeld. Je: Stufe, Nutzen, …» sichtbar geworden. Diese Zeile bitte löschen, sie gehört nicht ins Papier.

**Noch offen**, inhaltlich unverändert seit dem Zwischenreview:

- [ ] **Definition:** Ergänzen, wer über den nächsten Schritt entscheidet. So wie sie jetzt steht, passt sie auch auf einen Workflow mit Tool-Aufruf und widerspricht damit deiner eigenen Abgrenzung. Tippfehler: «zubinmdung».
- [ ] **Abgrenzung:** Mindestens zwei *konkrete* Produkte oder Systeme, die als Agent verkauft werden, aber keine sind, je mit einem Satz Begründung.
- [ ] **Beispiel 3 Vertragsprüfung** durch eine eigene Branche ersetzen.
- [ ] **Beispiel 2 Stromnetz:** Stufe 3 ist nach deiner Definition kein Agent. Ausserdem bricht der Satz ab («… kann zu»).
- [ ] **Fehlerarten** mit Namen und Abschnitt statt «F1/F2», z. B. «Fehlerakkumulation (6.1)».
- [ ] **Fliesstext statt Stichworte:** Die Beispiele stehen als Überschriften mit Kommas. Für eine Entscheiderin braucht es je 3–4 ganze Sätze. Aktuell 153 Wörter, Ziel 400–500.

**Vorschlag für den Aufbau eines Beispiels:**

> **Logistik – Ausnahmen im Paketversand (Stufe 4).** Der Agent prüft jede Lieferung, die hängen bleibt, fragt beim Spediteur den Status ab, schlägt eine Lösung vor (neu zustellen, umleiten, Kunde informieren) und führt sie nach Freigabe aus. *Nutzen:* Ausnahmen werden in Minuten statt Tagen bearbeitet. *Grösstes Risiko:* Prompt Injection (6.4), weil der Agent Freitext von Kunden und Spediteuren liest, der Anweisungen enthalten kann.

Dieses Beispiel ist nur zur Orientierung. Logistik bitte nicht übernehmen, sonst bleibt nur eine eigene Branche übrig.

## Nachtrag 22. Oktober, 20:15 – Aufgabe 4 (Commit `751e268`)

Deutlich besser. Die Definition sitzt jetzt, und das neue dritte Beispiel passt.

| Punkt | Stand |
| --- | --- |
| Definition: wer entscheidet | ✓ erledigt. «Ein Agent entscheidet selbst über den nächsten Schritt» ist genau der Kern. |
| Vertragsprüfung ersetzt | ✓ erledigt. Medien/Publikation mit erfundenen Quellen als Risiko ist ein treffendes Beispiel. |
| Fehlerarten mit Namen | ✓ erledigt |
| Abgrenzung: zwei konkrete Beispiele | offen. Steht noch wie im ersten Entwurf. |
| Stromnetz, Stufe 3 | offen. Ein Workflow ist nach deiner eigenen Definition kein Agent. Entweder Stufe 4 mit Begründung (der Agent entscheidet selbst, welche Messdaten er als Nächstes abfragt) oder ein anderes Beispiel. |
| Hinweiszeile «Nicht aus deinem beruflichen Umfeld …» | offen, bitte löschen |

**Neu aufgefallen:**

- **Zeilenumbrüche:** Die Zeilen «Stufe / Nutzen / Fehlerart / Risiko» laufen auf der Plattform in einen einzigen Absatz zusammen, weil Markdown einfache Zeilenumbrüche ignoriert. Mach daraus eine Liste (`- **Stufe:** 4`) oder setz Leerzeilen dazwischen.
- **Was tut der Agent selbst?** «Nutzen» beschreibt das Ergebnis, nicht das Agentenverhalten. Ergänze pro Beispiel einen Satz, *was der Agent selbst entscheidet*. Genau das unterscheidet Stufe 4 von Stufe 3, und daran erkennt die Entscheiderin, dass es ein Agent ist.
- **Tippfehler:** «Halluzienierte» → «Halluzinierte», «entwscheidet» → «entscheidet», «folgeschritte» → «Folgeschritte».

Die Struktur mit Feldern statt Fliesstext akzeptiere ich, wenn der Satz zum Agentenverhalten dazukommt.
