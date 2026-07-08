# Decisions (ADR log)

Append-only. Each entry captures a choice and its rationale so future changes don't silently undo it.

## ADR-001 — MIT license
Personal/indie tool meant to be freely copied and embedded. Permissive over copyleft.

## ADR-002 — Flat JSONL knowledge base, not a database
Zero-dependency, git-friendly, human-readable, diff-able. Selective retrieval via keyword/scope in
`prime.mjs` keeps context small. A DB (or BEADS) would add infra the target solo user doesn't need.

## ADR-003 — `init` seeds project-side; plugin stays read-only
The knowledge base and `CLAUDE.md` must live in the user's repo to grow and be committed. Plugins are
read-only caches, so an `init` skill copies seeds + scripts into the project (never overwriting).

## ADR-004 — Path-based routing is a heuristic, not an engine
Claude Code has no native "folder → agent" rule. The orchestrator scans paths and follows a routing
table; `scope.mjs` injects a per-prompt hint. This is deterministic-ish but ultimately an LLM
following instructions. Accepted trade-off: near-automatic routing without custom infrastructure.
Two sources of truth (orchestrator table + scope globs) must be kept in sync.

## ADR-005 — Self-improvement is human-in-the-loop
`capture` logs signals and `self-reflect` proposes knowledge entries, but promotion into enforced
rules (`promote.mjs` → `CLAUDE.md`) requires human confirmation. No autonomous prompt/skill rewriting —
safer and keeps the maintainer in control.

## ADR-006 — Mobile is Expo-first, bare RN as fallback
Target projects use Expo (managed). The `mobile` agent detects the setup and prefers Expo tooling
(Expo Router, `expo install`, EAS, config plugins), falling back to bare RN only when appropriate.

## ADR-007 — Borrow process skills instead of depending on Superpowers
`brainstorming` and `tdd` are small in-house skills so the plugin stays self-contained. Superpowers
remains a compatible companion for deeper process discipline, but is not a dependency.

## ADR-008 — Routing by project-type detection, not path globs
Real repos vary: a standalone Expo app has everything at the root, so monorepo path globs
(`apps/mobile/**`) never match. `scope.mjs` now classifies the repo by reading `package.json`/
`app.json` (expo/react-native → mobile, react/next → frontend, express/fastify/etc → backend) and
handles monorepos by classifying each package under `apps/`/`packages/`/`services/`. Path globs
remain only as an ambiguity fallback in the orchestrator. Detection runs without `/init` so it works
the moment the plugin is enabled.
