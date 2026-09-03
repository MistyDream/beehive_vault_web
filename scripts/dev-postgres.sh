#!/usr/bin/env bash

set -euo pipefail

readonly database_host="127.0.0.1"
readonly database_port="5432"

if pg_isready --host "$database_host" --port "$database_port" >/dev/null 2>&1; then
    echo "Using the PostgreSQL server already running on ${database_host}:${database_port}."

    while pg_isready --host "$database_host" --port "$database_port" >/dev/null 2>&1; do
        sleep 2
    done

    exit 1
fi

if ! command -v brew >/dev/null 2>&1; then
    echo "Homebrew is required to locate PostgreSQL 18." >&2
    exit 1
fi

readonly postgres_prefix="$(brew --prefix postgresql@18)"
readonly homebrew_prefix="$(brew --prefix)"
readonly postgres_data_dir="${BEEHIVE_POSTGRES_DATA_DIR:-${homebrew_prefix}/var/postgresql@18}"
readonly postgres_pid_file="${postgres_data_dir}/postmaster.pid"

if [[ -f "$postgres_pid_file" ]]; then
    readonly recorded_pid="$(sed -n '1p' "$postgres_pid_file")"

    if ! kill -0 "$recorded_pid" >/dev/null 2>&1; then
        echo "PostgreSQL cannot start because ${postgres_pid_file} contains the stale PID ${recorded_pid}." >&2
        echo "Verify that no PostgreSQL process is running, then remove this stale file." >&2
        exit 1
    fi
fi

exec "${postgres_prefix}/bin/postgres" --data-directory="$postgres_data_dir"
