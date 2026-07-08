# dev-agent-team

A self-improving multi-agent dev team for Claude Code. An **orchestrator** breaks a task
into work units, scans changed files, and routes each to the right specialist —
**frontend** (React), **mobile** (React Native + Expo), or **backend** (Node) — then verifies with
independent **tester**, **security**, and **reviewer** agents. A JSONL **knowledge base**
drives a *prime → work → reflect* learning loop so the team gets smarter over time.

## Install
```
/plugin install dev-agent-team        # from your marketplace
/init                                  # seed knowledge/ + CLAUDE.md into THIS repo
```
`/init` is required once per repo — it creates the knowledge base and routing conventions
that must live in your project (safe to re-run; never overwrites).

## What's inside
| Component | Items |
|-----------|-------|
| Agents    | orchestrator, frontend, mobile, backend, tester, security, reviewer |
| Skills    | init, brainstorming, tdd, self-reflect, frontend-ui, mobile-ui, backend-api |
| Hooks     | SessionStart → prime, UserPromptSubmit → scope, Stop → capture |
| Scripts   | prime, scope, capture, promote |

## How it works
1. **Prime** — on session start, relevant facts (MUST FOLLOW / GOTCHAS / PATTERNS / DECISIONS)
   from `knowledge/*.jsonl` are injected. Filter by topic: `node .claude/scripts/prime.mjs --keywords "auth mobile"`.
2. **Route** — every prompt, the `scope` hook detects which package the changed files belong to
   and suggests the specialist; the `orchestrator` scans + delegates, splitting cross-package units.
3. **Verify** — `tester` writes/runs tests, `security` audits sensitive changes, `reviewer` gives a
   binary PASS/FAIL against the Definition of Done with file:line evidence. FAIL loops back (max 3).
4. **Reflect** — on session end the `capture` hook logs a signal; run the `self-reflect` skill to
   distill patterns/gotchas/decisions into the knowledge base, and `promote` the important rules
   into `CLAUDE.md` with `node .claude/scripts/promote.mjs "<rule>"`.

## Usage
- Drive the team: `claude --agent orchestrator` (or `@orchestrator`), then describe the task.
- Call a specialist directly: `@frontend` / `@mobile` / `@backend`.
- Verify: `@tester`, `@security`, `@reviewer`.
- Reflect: run the `self-reflect` skill.

## Monorepo routing
Routing is by file path, not by wording. Defaults: `apps/web/**`→frontend, `apps/mobile/**`→mobile,
`services/**`→backend. If your layout differs, edit the routing table in `agents/orchestrator.md`
and the globs in `scripts/scope.mjs`, and add nested `CLAUDE.md` per package (via `/init`).

## Requirements
Claude Code, Node.js 18+, git. No external services.

License: MIT — author: yerros
