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

Originalstellen zum Nachschlagen. Sie zählen nicht als Kernaussagen, die müssen oben in eigenen Worten stehen.

"Agent" can be defined in several ways. Some customers define agents as fully autonomous systems that operate independently over extended periods, using various tools to accomplish complex tasks. Others use the term to describe more prescriptive implementations that follow predefined workflows. At Anthropic, we categorize all these variations as agentic systems, but draw an important architectural distinction between workflows and agents:

Workflows are systems where LLMs and tools are orchestrated through predefined code paths.
Agents, on the other hand, are systems where LLMs dynamically direct their own processes and tool usage, maintaining control over how they accomplish tasks.
Below, we will explore both types of agentic systems in detail. In Appendix 1 (“Agents in Practice”), we describe two domains where customers have found particular value in using these kinds of systems.
