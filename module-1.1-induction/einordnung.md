# Einordnung 1.1 – Agency-Stufenleiter

Abgabe zu Aufgabe 3. Stufen 0–5 siehe Lernskript, Abschnitt 5. Begründe jede Stufe mit den drei Einordnungsfragen: Kann es handeln? Wer legt die Reihenfolge fest? Wie lange läuft es ohne Menschen?

| # | System | Stufe | Begründung |
| --- | --- | --- | --- |
| 1 | Übersetzungsdienst, der einen Absatz ins Französische übersetzt | 0 | Einmalige Abfrage mit Antwort |
| 2 | Kundenservice-Chat, der nur aus einer FAQ antwortet | 1 | Chatbot ohne tools |
| 3 | E-Mail-Filter, der Mails per LLM klassifiziert und verschiebt | 3 | Workflow mit vordefinierten Schritten |
| 4 | Code-Assistent, der in der IDE die nächste Zeile vorschlägt | 2 | Das Modell schlägt Menschen etwas vor |
| 5 | Rechercheassistent, der selbst Suchen wählt, Seiten liest und berichtet | 4 | Der Agent entscheidet selber welche Suche er wählt, dies sollte anhand freigaben definiert sein |
| 6 | Rechnungs-Pipeline mit Rückfrage bei Abweichung über 5 % | 3 | Klassischer Flow |
| 7 | Sprachassistent, der den Wecker stellt | 0 | Einmaliger Befehl |
| 8 | Nachts selbständig Fehler suchen, fixen, testen, Pull Request eröffnen | 4 | Hier hat der Agent einen Auftrag und klare Leitplanken, je nach Fehler muss er entsprechende Tools aufsuchen und das Problem fixen |
| 9 | Reiseplaner mit Varianten, Hotelsuche und Buchung nach Bestätigung | 4 | Der Agent bucht je nach Anbieter die Reise selbst |
| 10 | Schachprogramm wie Stockfish | 2 | Der Agent analysiert und schlägt die nächsten Schritte vor |
| 11 | Agent-Modus von Cursor | 5 | Dieser Agent ist autonom und sucht sich seinen Weg zur Lösung selber, die Berechtigung wird jeweils während der Arbeit erfragt |

## «Hängt davon ab»

Mindestens zwei Systeme, bei denen die Stufe von der Ausgestaltung abhängt. Beschreibe beide Varianten.

### System Nr. 3

- **Variante A: Wenn man beispielsweise Mail automatisch beantwortet haben will, dann ist man mindestens auf Stufe 4** 
- **Variante B: Hier gibt es bereits Lösungen ohne LLM, daher stufe 0 auch möglich oder?** 

### System Nr. 10

- **Variante A:Eine einfache Logik kann den Workflow oder den Agenten ersetzen** 
- **Variante B:Ein völlig autonomer Agent bestimmt im vorhinein seine Spielweise, analysiert die Spielzüge des Gegners und macht selbstständig die Spielzüge ** 

## Nr. 10: Was sagt Stockfish über unsere Definition aus?
Stockfish ist kein KI basierter Dienst und funktioniert auch ohne KI sehr gut. Das Beispiel zeigt, dass nicht jede Aufgabe mit AI gelöst werden muss. Mit einer klaren Logik in einem klar abgegrenztem Bereich (Regel, Schachbrett, usw..) kann eine vordefinierte Logik günstiger und gleichgut sein wie ein Workflow oder Agent.
