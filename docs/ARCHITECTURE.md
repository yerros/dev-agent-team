# Architecture — dev-agent-team

## Two-part split
- **Plugin (read-only, shipped):** agents, skills, hooks, scripts. Installed via Claude Code's
  plugin system; discovered by convention.
- **Project-side (mutable, per repo):** `knowledge/*.jsonl`, `CLAUDE.md`, and a copy of the scripts
  under `.claude/scripts/`. Seeded by the `init` skill so memory can grow in version control.

The knowledge base lives in the project (not the plugin) so it can be committed and evolve per repo.

## Components & responsibilities
| Component | Responsibility |
|-----------|----------------|
| `orchestrator` | Decompose a task, scan changed files, route each unit to a specialist, drive verification. |
| `frontend` | React (web) UI work. |
| `mobile` | React Native + Expo work (managed & bare). |
| `backend` | Node + TypeScript server/API work. |
| `tester` | Write & run tests against a unit's Definition of Done. |
| `security` | Audit auth, input validation, secret/PII leakage, injection. |
| `reviewer` | Independent binary PASS/FAIL against the DoD with file:line evidence. |
| skills | On-demand knowledge: `frontend-ui`, `mobile-ui`, `backend-api`, plus process skills `brainstorming`, `tdd`, `self-reflect`, and setup skill `init`. |
| scripts | `prime` (read KB), `scope` (detect package), `capture` (log signal), `promote` (enforce a rule), `init` (seed project). |
| hooks | `SessionStart→prime`, `UserPromptSubmit→scope`, `Stop→capture`. |

## The loop
```
SessionStart ─ prime.mjs ─▶ inject MUST FOLLOW / GOTCHAS / PATTERNS / DECISIONS
                                     │
UserPromptSubmit ─ scope.mjs ─▶ "changed scope → suggested specialist(s)"
                                     │
orchestrator: brainstorm(optional) → decompose → SCAN paths → route → specialist implements (tdd)
                                     │
verify (fresh contexts): tester + security + reviewer  ──FAIL──▶ back to specialist (max 3)
                                     │ PASS
Stop ─ capture.mjs ─▶ knowledge/_inbox.jsonl signal
                                     │
self-reflect skill ─▶ distill patterns/gotchas/decisions ─▶ promote.mjs ─▶ CLAUDE.md rule
```

## Routing mechanism
Two synchronized sources of truth, both by file path (not wording):
1. `agents/orchestrator.md` — the human-readable routing table the orchestrator follows after scanning.
2. `scripts/scope.mjs` — the glob rules that produce the per-prompt hint.
Keep them in sync. Routing is heuristic (an LLM following the table), not a hard engine — see ADR-004.

## Data: knowledge base
Flat JSONL under `knowledge/` — `patterns.jsonl`, `gotchas.jsonl`, `decisions.jsonl`, and the
hook-written `_inbox.jsonl`. `prime.mjs` filters by keyword/scope for selective retrieval so the base
can grow large without flooding the context window.
