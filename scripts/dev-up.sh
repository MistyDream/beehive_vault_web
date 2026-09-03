#!/usr/bin/env bash

set -euo pipefail

readonly repository_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
readonly process_compose_port="9090"

if ! command -v process-compose >/dev/null 2>&1; then
    echo "Process Compose is required. Install it with:" >&2
    echo "  brew install f1bonacc1/tap/process-compose" >&2
    exit 1
fi

if [[ ! -f "${repository_root}/.env" ]]; then
    echo "Missing ${repository_root}/.env. Copy .env.example before starting." >&2
    exit 1
fi

if [[ ! -f "${repository_root}/../beehive_vault_api/.env" ]]; then
    echo "Missing ${repository_root}/../beehive_vault_api/.env. Copy the API .env.example before starting." >&2
    exit 1
fi

cd "$repository_root"

exec process-compose \
    --port "$process_compose_port" \
    --ordered-shutdown \
    --disable-dotenv \
    --config dev/process-compose.yaml \
    up \
    --detached
