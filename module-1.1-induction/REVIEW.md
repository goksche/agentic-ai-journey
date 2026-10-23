# Review Modul 1.1 – Zwischenstand

Stand: 22. Oktober 2026, geprüft: Commits bis `5e4b32b`. Das ist ein Zwischenreview. Das Abschlussreview folgt, wenn du «Modul 1.1 abgeben» schreibst.

| Aufgabe | Stand | Urteil |
| --- | --- | --- |
| 1 – Umgebung | erledigt | angenommen |
| 2 – Quellen | Anthropic fertig, Weng offen | nachbessern |
| 3 – Einordnung | vollständig | 3 Einordnungen korrigieren, sonst gut |
| 4 – Positionspapier | überarbeitet (`812f3c1`) | **angenommen** am 22.10., zwei Formsachen offen |
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

## Nachtrag 22. Oktober, 20:25 – Aufgabe 4 (Commit `59513b2`)

**Neu: Builder.ai und Global Predictions.** Gute Recherche, das sind echte, dokumentierte Fälle. Zwei Präzisierungen machen den Abschnitt belastbar:

1. **Das ist AI-Washing, nicht ganz Agent-Washing.** Beide Firmen haben KI behauptet, wo kaum oder keine war. Der häufigere Fall, vor dem dein Papier warnen soll, ist subtiler: Es *ist* ein Sprachmodell drin, aber das Produkt ist nur ein Chatbot oder ein fester Workflow und heisst trotzdem «Agent». Behalte deine zwei Fälle als Extremform und ergänze **einen Satz zum typischen Fall**.
2. **Fakten genau formulieren.** «Beides Fälle, wo keine KI eingesetzt wird» stimmt so nicht ganz:
   - **Global Predictions:** Die US-Börsenaufsicht SEC hat am 18. März 2024 festgestellt, dass die Firma sich als «first regulated AI financial advisor» bezeichnete und mit «KI-gestützten Prognosen» warb, die es gar nicht gab. Busse: 175 000 USD. Hier stimmt «keine KI».
   - **Builder.ai:** Vermarktet wurde die KI-Assistentin «Natasha». Berichte seit 2019 werfen der Firma vor, dass ein Grossteil der Entwicklungsarbeit manuell von Programmierern erledigt wurde. Die Insolvenz im Mai 2025 hatte vor allem mit überhöhten Umsatzzahlen zu tun. Korrekt ist: «KI-Fähigkeiten stark übertrieben», nicht «keine KI».

**Platzierung:** Die beiden Fälle gehören in den Abschnitt «Was kein Agent ist, auch wenn es so heisst», nicht als eigener Abschnitt ans Ende. Ein Satz pro Fall genügt. Stark wäre noch: Welche deiner drei Prüffragen hätte den Fall entlarvt?

**Weiterhin offen:**

- [ ] Stromnetz: Stufe 3 → Stufe 4 begründen oder Beispiel ersetzen
- [ ] Pro Beispiel ein Satz, was der Agent selbst entscheidet
- [ ] Felder als Liste (`- **Stufe:** 4`), sonst laufen sie zu einem Absatz zusammen
- [ ] Tippfehler: «Zubindung» → «Anbindung», «Halluzienierte», «entwscheidet», «folgeschritte»

Danach ist Aufgabe 4 aus meiner Sicht abnahmereif.

Quellen: [Harvard Law School Forum: Decoding the SEC’s First «AI-Washing» Enforcement Actions](https://corpgov.law.harvard.edu/2024/04/18/decoding-the-secs-first-ai-washing-enforcement-actions) · [Beam AI: Builder.ai – From Unicorn to Insolvency](https://beam.ai/agentic-insights/builder-ai-from-unicorn-to-insolvency-history-collapse-and-the-low-code-landscape)

## Nachtrag 22. Oktober, 23:50 – Aufgabe 4 (Commit `4c96103`)

**Stromnetz, Stufe 3: jetzt schlüssig begründet.** Das System führt Daten zusammen und empfiehlt, die Handlung bleibt beim Menschen. Damit ist es zu Recht ein Workflow und kein Agent. Ich akzeptiere das, mit einer Bedingung: Sag es im Papier ausdrücklich, z. B. «Hier genügt bewusst ein Workflow, weil ein Fehlentscheid im Netz teuer ist und der Mensch entscheiden soll.» Dann ist das Beispiel sogar ein Pluspunkt: Es zeigt der Entscheiderin, dass nicht alles ein Agent sein muss (Skript, Abschnitt 7).

Zwei kleine Anpassungen dazu:
- **Fehlerart:** «Halluzinierte Fakten» passt, «Handlung» nicht mehr, denn das System handelt ja gerade nicht.
- **Dein eigener Gedanke aus Aufgabe 2 passt hier perfekt:** Wenn der Mensch nur noch die Empfehlung abnickt, ist die Kontrolle wirkungslos (Automation Bias). Ein Halbsatz dazu macht das Risiko vollständig.

**Unverändert offen** (siehe Nachträge 2 und 3):

- [ ] Pro Agenten-Beispiel (Bau, Medien) ein Satz, was der Agent selbst entscheidet
- [ ] Felder als Liste (`- **Stufe:** 4`), sonst laufen sie auf der Plattform zu einem Absatz zusammen
- [ ] Builder.ai und Global Predictions in den Abschnitt «Was kein Agent ist» verschieben, je ein Satz; «keine KI» nur bei Global Predictions, bei Builder.ai «stark übertrieben»
- [ ] Tippfehler: «Zubindung», «Halluzienierte» (2×), «entwscheidet», «folgeschritte»

## Nachtrag 22. Oktober, 23:55 – Aufgabe 4 (Commits `cf7ddff`, `12f9c47`)

**Erledigt:**
- ✓ Bau und Medien: Der Satz, was der Agent selbst entscheidet, ist da. Genau das macht die Stufe 4 nachvollziehbar.
- ✓ Abgrenzung: «Chatbots auf LLM-Basis» ist der typische Fall von Agent-Washing. Zusammen mit den Workflows sind das zwei Beispiele, das reicht.
- ✓ Fehlerart beim Stromnetz korrigiert.

**Neu entstanden: ein Widerspruch beim Stromnetz.** Jetzt steht dort «Hier entscheidet **der Agent**, welche Daten zusammengeführt werden» bei Stufe 3. Entscheidet das Modell selbst, welche Daten es holt, ist das Stufe 4: ein Agent, dessen Leitplanke ist, dass der Mensch die Handlung freigibt. Entscheide dich:
- **Stufe 3:** «Das System führt nach festem Ablauf immer dieselben Meldungen und Messdaten zusammen und gibt eine Empfehlung ab.» Dann nicht «Agent» schreiben.
- **Stufe 4:** Text so lassen, Stufe auf 4 ändern und ergänzen: «Die Handlung im Netz bleibt beim Menschen.»

Beides ist richtig, solange Text und Stufe zusammenpassen.

**Noch offen, alles klein:**

- [ ] Überschrift «Zwei konkrete Systeme …» und der Satz «Beides Fälle wo keine KI eingesetzt wird» stehen jetzt ohne Inhalt da. Entweder löschen, oder Builder.ai und Global Predictions als Extremfälle in die Abgrenzung zurückholen.
- [ ] Felder als Liste (`- **Stufe:** 4`): Auf der Plattform laufen Stufe, Nutzen, Fehlerart und Risiko noch in einen Absatz zusammen.
- [ ] Tippfehler: «Zubindung», «Halluzienierte» (2×), «entwscheidet», «folgeschritte».

Danach nehme ich Aufgabe 4 ab.

## Nachtrag 22. Oktober, 23:59 – Aufgabe 4 angenommen (Commit `812f3c1`)

**Inhaltlich abgenommen.** Definition, Abgrenzung, drei Beispiele mit begründeter Stufe, Fehlerart und Risiko sowie drei Prüffragen sind vollständig und stimmig. Das Stromnetz-Beispiel ist auf Stufe 4 jetzt konsistent: Der Agent wählt die Daten selbst, die Handlung bleibt beim Menschen.

Was du über die Überarbeitungen gelernt hast, ist der eigentliche Kern des Moduls: Eine Stufe ergibt sich aus der Frage, **wer den nächsten Schritt bestimmt**. Genau das hast du beim Stromnetz zweimal durchdacht.

**Zwei Formsachen, ohne erneutes Review:**

1. **Leerzeichen nach dem Bindestrich:** `-**Stufe:**` wird nicht als Liste erkannt. Richtig ist `- **Stufe:** 4`, mit Leerzeichen. Sonst laufen die Zeilen auf der Plattform weiter zusammen.
2. **Tippfehler:** «Zubindung» → «Anbindung», «Halluzienierte» → «Halluzinierte» (2×), «entwscheidet» → «entscheidet», «folgeschritte» → «Folgeschritte», «LLM basis» → «LLM-Basis».

Danach Aufgabe 4 auf der Plattform abhaken.

## Nachtrag 23. Oktober – Feynman-Notiz, Zwischenstand (Commit `17bb778`)

**Was schon gut ist:** Der Abschnitt «Was ist ein KI-Agent?» trifft den Kern: analysieren, zerlegen, planen, umsetzen, prüfen, und dabei selbst über den nächsten Schritt entscheiden. Das ist die Schleife aus dem Skript, in eigenen Worten.

**Der Feynman-Test ist noch nicht bestanden**, aus drei Gründen:

1. **Fachbegriffe ohne Erklärung.** «LLM», «Tools», «Workflow», «Leitplanken» und «Stufen» würde eine kluge Person ohne KI-Hintergrund nicht verstehen. Feynman heisst: jeden Begriff entweder weglassen oder in Alltagssprache übersetzen, z. B. «ein Sprachmodell wie ChatGPT, das Texte schreiben, aber selbst nichts tun kann».
2. **Drei inhaltliche Ungenauigkeiten im Einleitungsabsatz:**
   - *«Es gibt 5 Stufen von Agenten»:* Die Stufenleiter ordnet **KI-Systeme** ein, nicht Agenten. Stufen 0 bis 3 sind gerade keine Agenten. Ausserdem ist sie unser Denkmodell aus dem Kurs, kein allgemeiner Standard.
   - *«Agenten sind autonome Systeme»:* Zu absolut. Die meisten sinnvollen Agenten arbeiten auf Stufe 4, also mit Freigaben durch Menschen. «Selbständig innerhalb von Grenzen» trifft es besser.
   - *«Workflows können die Zusammenarbeit von mehreren Agenten sein»:* Technisch möglich, aber für Laien verwirrend, weil es die Unterscheidung verwischt, die du zwei Sätze vorher aufbaust. Weglassen, oder genau das unter «Wo ich ins Stocken geraten bin» notieren.
3. **Struktur:** Der Einleitungsabsatz steht ausserhalb der Vorlage und wiederholt den ersten Abschnitt. Drei Abschnitte sind noch leer, darunter «Wo ich ins Stocken geraten bin», der wertvollste Teil der Übung.

**Hinweise für die leeren Abschnitte, ohne Lösung:**

- *Vergleich aus dem Alltag:* Denk an eine Situation, in der jemand ein **Ziel** bekommt statt einer Schrittliste und unterwegs selbst entscheiden muss. Und an das Gegenstück, in dem jemand nur eine feste Anleitung abarbeitet. Der Unterschied zwischen beiden ist dein Vergleich.
- *Was ein Agent nicht ist:* Du hast im Positionspapier schon zwei gute Antworten. Erklär sie hier so, dass deine Grossmutter sie versteht.
- *Ins Stocken geraten:* Ehrlich notieren, wo du nachdenken musstest. Kandidaten aus deinen bisherigen Abgaben: Stufe 3 oder 4, und ob ein System, das nur empfiehlt, ein Agent ist.

**Tippfehler:** «gewährkleistet», «Anbinung», «ermessen» → «Ermessen», «auftrag» → «Auftrag», «Vordefinierte» → «vordefinierte».
