"""Prüfskript für Modul 1.1: API-Zugänge testen.

Ablauf:
1. Listet die verfügbaren Modelle beider Anbieter (kostet keine Token).
2. Wenn ANTHROPIC_MODEL bzw. OPENAI_MODEL in .env gesetzt sind,
   folgt pro Anbieter ein Mini-Aufruf.

Ausführen im Repo-Wurzelverzeichnis:
    uv run module-1.1-induction/check_setup.py
"""

from __future__ import annotations

import os
import sys

from dotenv import load_dotenv

PROMPT = "Antworte mit genau einem Satz: Was ist ein KI-Agent?"
MAX_MODELS_SHOWN = 15


def check_anthropic() -> bool:
    print("\n=== Anthropic ===")
    if not os.getenv("ANTHROPIC_API_KEY"):
        print("FEHLT  ANTHROPIC_API_KEY ist nicht gesetzt (.env prüfen).")
        return False
    try:
        import anthropic

        client = anthropic.Anthropic()
        models = [m.id for m in client.models.list(limit=MAX_MODELS_SHOWN)]
        print(f"OK     Key gültig, {len(models)} Modelle gelistet:")
        for model_id in models:
            print(f"       - {model_id}")

        model = os.getenv("ANTHROPIC_MODEL")
        if not model:
            print("HINWEIS ANTHROPIC_MODEL nicht gesetzt: Modell aus der Liste wählen und in .env eintragen.")
            return True
        reply = client.messages.create(
            model=model,
            max_tokens=100,
            messages=[{"role": "user", "content": PROMPT}],
        )
        text = "".join(block.text for block in reply.content if block.type == "text")
        print(f"OK     {model}: {text.strip()}")
        print(f"       Tokens: {reply.usage.input_tokens} rein, {reply.usage.output_tokens} raus")
        return True
    except Exception as exc:  # bewusst breit: Diagnose für Einsteiger
        print(f"FEHLER {type(exc).__name__}: {exc}")
        return False


def check_openai() -> bool:
    print("\n=== OpenAI ===")
    if not os.getenv("OPENAI_API_KEY"):
        print("FEHLT  OPENAI_API_KEY ist nicht gesetzt (.env prüfen).")
        return False
    try:
        import openai

        client = openai.OpenAI()
        models = sorted(m.id for m in client.models.list())
        print(f"OK     Key gültig, {len(models)} Modelle verfügbar (Auszug):")
        for model_id in models[:MAX_MODELS_SHOWN]:
            print(f"       - {model_id}")

        model = os.getenv("OPENAI_MODEL")
        if not model:
            print("HINWEIS OPENAI_MODEL nicht gesetzt: Modell aus der Liste wählen und in .env eintragen.")
            return True
        reply = client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": PROMPT}],
        )
        text = reply.choices[0].message.content or ""
        print(f"OK     {model}: {text.strip()}")
        if reply.usage:
            print(f"       Tokens: {reply.usage.prompt_tokens} rein, {reply.usage.completion_tokens} raus")
        return True
    except Exception as exc:
        print(f"FEHLER {type(exc).__name__}: {exc}")
        return False


def main() -> int:
    load_dotenv()
    print(f"Python {sys.version.split()[0]}")
    results = [check_anthropic(), check_openai()]
    print("\nErgebnis:", "alles bereit" if all(results) else "noch nicht vollständig, Meldungen oben prüfen")
    return 0 if all(results) else 1


if __name__ == "__main__":
    raise SystemExit(main())
