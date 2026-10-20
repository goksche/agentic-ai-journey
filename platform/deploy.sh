#!/usr/bin/env bash
# Holt neue Inhalte aus GitHub und baut die Plattform nur neu, wenn sich etwas geändert hat.
# Manuell:  ./platform/deploy.sh        Erzwingen:  ./platform/deploy.sh --force
set -euo pipefail
cd "$(dirname "$0")/.."

before=$(git rev-parse HEAD)
git pull --ff-only --quiet
after=$(git rev-parse HEAD)

if [[ "$before" == "$after" && "${1:-}" != "--force" ]]; then
  exit 0
fi

echo "$(date -Is) Update ${before:0:7} -> ${after:0:7}"
cd platform
docker compose up -d --build
docker image prune -f >/dev/null
