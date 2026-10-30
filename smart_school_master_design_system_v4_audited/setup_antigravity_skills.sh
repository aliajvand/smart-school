#!/usr/bin/env bash
set -euo pipefail

# ==============================================================================
# Google Antigravity Skills Installer (Audited & Version-Pinned)
# SECURITY NOTE: Always inspect third-party skill packages before execution.
# Run with `--dry-run` first to preview commands without modifying your workspace.
# ==============================================================================

DRY_RUN=false
if [[ "${1:-}" == "--dry-run" ]]; then
  DRY_RUN=true
  echo "[DRY-RUN MODE] Commands will be printed but not executed."
fi

SKILLS_PKG="@rmyndharis/antigravity-skills@1.2.0"

run_cmd() {
  echo "+ $*"
  if [[ "$DRY_RUN" == "false" ]]; then
    "$@"
  fi
}

echo "Installing audited Google Antigravity skills..."

# 1. Web Frontend & Design System (Next.js / React / TypeScript)
run_cmd npx --yes "$SKILLS_PKG" install nextjs-app-router-patterns
run_cmd npx --yes "$SKILLS_PKG" install react-modernization
run_cmd npx --yes "$SKILLS_PKG" install typescript-pro

# 2. Mobile App (Flutter)
run_cmd npx --yes "$SKILLS_PKG" install frontend-mobile-development-component-scaffold

# 3. Backend & AI Pipelines (FastAPI / Python)
run_cmd npx --yes "$SKILLS_PKG" install fastapi-pro
run_cmd npx --yes "$SKILLS_PKG" install python-pro
run_cmd npx --yes "$SKILLS_PKG" install async-python-patterns
run_cmd npx --yes "$SKILLS_PKG" install uv-package-manager
run_cmd npx --yes "$SKILLS_PKG" install api-design-principles
run_cmd npx --yes "$SKILLS_PKG" install prompt-engineering-patterns

echo "Done."
