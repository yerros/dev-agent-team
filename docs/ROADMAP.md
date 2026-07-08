# Roadmap

Ideas kept aligned with the north star (see `PRD.md`). Anything here must stay lightweight and native.

## In scope (candidates)
- **Marketplace repo** — a `dev-agent-team-marketplace` so install is `/plugin marketplace add <repo>`;
  makes periodic updates easy to distribute.
- **Optional PostToolUse guardrail** — run `typecheck`/`lint` after edits (opt-in; can be noisy).
- **More specialists** — e.g. `database` (schema/migrations) or `devops` (CI/build), added via the
  CONTRIBUTING recipe, only if the maintainer actually needs them.
- **Knowledge hygiene** — a small `dedupe`/`review` script to merge near-duplicate entries and prune
  stale ones; recency ranking in `prime.mjs`.
- **`/self-reflect` polish** — auto-open a review list of proposed entries for one-key promotion.

## Explicitly out of scope
- BEADS / external issue trackers, databases, vector stores, paid APIs.
- Mandatory GitHub Issue→PR pipelines or enforced multi-gate SDLC.
- Autonomous self-modification.

## Done
- v0.1.0 — orchestrator + frontend/mobile/backend/reviewer, knowledge base, prime/capture hooks, init.
- v0.2.0 — tester + security agents, scope hook (path routing), promote script, brainstorming + tdd
  skills, Expo support in the mobile agent/skill.
