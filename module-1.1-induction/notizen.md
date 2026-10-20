# Notizen 1.1 – Quellen

Abgabe zu Aufgabe 2. Pro Quelle drei Kernaussagen in eigenen Worten (Deutsch) und eine Aussage, der du widersprichst oder die du anzweifelst, mit Begründung.

## Anthropic: «Building effective agents»

Quelle: https://www.anthropic.com/engineering/building-effective-agents

### Kernaussagen

1. So einfach wie möglich starten, nicht in jedem Fall ist ein autonomer Agent nötig. Ein guter Prompt, passender Kontext oder ein fester Workflow kann bereits reichen.
2. Autonomie braucht Rückmeldung und Kontrolle, ein Agent braucht Rückmeldungen aus der Umgebung, überprüfbare Zwischenergebnisse, klare Grenzen, Abbruchbedingungen und menschliche Kontrolle bei kritischen Schritten
3. Werkzeuge und Evaluation sind genau so wichtig wie das Modell, Werkzeuge müssen einfach und fehlerarm bedienbar sein. Ergebnisse müssen systematisch geprüft werden. Gute Tests, klare Schnittstellen und iterative Verbesserung sind zentrale Voraussetzungen für zuverlässigen Betrieb.

### Das sehe ich anders oder zweifle daran

- **Aussage:*Menschliche Kontrolle bei kritischen Schritten* 
- **Warum:*Die Aussage ist grundsätzlich in Ordnung, aber mit der Zeit wird der Mensch betriebsblind, was bei Prüfungen nicht von Vorteil ist. Die Ergebnisse der Prüfungen sollten dokumentiert und bewertet werden* 

## Lilian Weng: «LLM Powered Autonomous Agents»

Quelle: https://lilianweng.github.io/posts/2023-06-23-agent/

### Kernaussagen

1. 
2. 
3. 

### Das sehe ich anders oder zweifle daran

- **Aussage:** 
- **Warum:** 

## Zitate und Rohnotizen

In einem LLM-gestützten autonomen Agentensystem fungiert LLM als Gehirn des Agenten, ergänzt durch mehrere Schlüsselkomponenten:

Planung
Teilziele und Zerlegung: Der Agent zerlegt große Aufgaben in kleinere, überschaubare Teilziele und ermöglicht so die effiziente Bearbeitung komplexer Aufgaben.
Reflexion und Verfeinerung: Der Agent kann Selbstkritik üben und über vergangene Handlungen reflektieren, aus Fehlern lernen und diese für zukünftige Schritte verfeinern, wodurch die Qualität der Endergebnisse verbessert wird.
Erinnerung
Kurzzeitgedächtnis: Ich würde das gesamte kontextbezogene Lernen (siehe Prompt Engineering ) als Nutzung des Kurzzeitgedächtnisses des Modells zum Lernen betrachten.
Langzeitgedächtnis: Dadurch ist der Agent in der Lage, (unendlich viele) Informationen über längere Zeiträume zu speichern und abzurufen, oft durch die Nutzung eines externen Vektorspeichers und schnellen Abrufs.
Werkzeugverwendung
Der Agent lernt, externe APIs aufzurufen, um zusätzliche Informationen zu erhalten, die in den Modellgewichten fehlen (und nach dem Vortraining oft schwer zu ändern sind), darunter aktuelle Informationen, Codeausführungsfähigkeit, Zugriff auf proprietäre Informationsquellen und mehr.
https://lilianweng.github.io/posts/2023-06-23-agent/agent-overview.png

Planung:
CoT (Gedankenkette von Wei et al. 2022) hat sich als Standardverfahren zur Verbesserung der Modellleistung bei komplexen aufgaben etabliert. Mit der Anweisung zum Schrittweise Denken, wird die komplexe Aufgabe in mehrere kleine Schritte zerlegt. 

Tree of Throughts von Yao et al. 2023 erweitert CoT mit der Untersuchung der Schlussfolgerungsmöglichkeiten bei jedem Schritt. Das Problem wird in mehrere Denkschritte zerlegt, dabei werden pro SChritt mehrere Gedanken generiert. Dadurch entsteht eine Baumstruktur. Somit können im Suchrpozess Breitensuchen (BFS) und Tiefensuchen (DFS) erfolgen.

LLM+P (Liu et al. 2023) ist ein weiterer, deutlich unterschiedlicher Ansatz, dieser nutzt einen externen klassischen Planer für die Langzeitplanung. Dieser Ansatz verwendet die Planning Domain Definition Language (PDDL) als Schnittstelle zur Beschreibung des Planungsproblems. Dabei übersetzt LLM (1) das Problem in „Problem-PDDL“, (2) fordert einen klassischen Planer auf, basierend auf einem bestehenden „Domänen-PDDL“ einen PDDL-Plan zu generieren, und (3) übersetzt den PDDL-Plan schließlich zurück in natürliche Sprache. Im Wesentlichen wird der Planungsschritt an ein externes Tool ausgelagert, vorausgesetzt, es stehen domänenspezifisches PDDL und ein geeigneter Planer zur Verfügung. Dies ist in bestimmten Robotersystemen üblich, jedoch nicht in vielen anderen.

Selbrefkletion 
