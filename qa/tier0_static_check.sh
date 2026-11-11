#!/usr/bin/env sh
# Compatibility wrapper; the Node validator is the cross-platform source of truth.
set -eu
cd "$(dirname "$0")/.."
node qa/tier0_static_check.mjs "$@"
