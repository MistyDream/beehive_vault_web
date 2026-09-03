#!/usr/bin/env bash

set -euo pipefail

readonly process_compose_port="9090"

if ! command -v process-compose >/dev/null 2>&1; then
    echo "Process Compose is required. Install it with:" >&2
    echo "  brew install f1bonacc1/tap/process-compose" >&2
    exit 1
fi

exec process-compose --port "$process_compose_port" attach
