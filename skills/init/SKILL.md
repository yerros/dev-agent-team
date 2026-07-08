---
name: init
description: Initialize the dev-agent-team knowledge base in the current repository. Use when setting up the plugin in a project — phrases like "init dev-agent-team", "set up the agent team", "seed the knowledge base", or the first time you run the team in a repo. Creates knowledge/*.jsonl, a starter CLAUDE.md, project-local scripts, and (optionally) nested CLAUDE.md files per package.
---

# Initialize dev-agent-team in this repo

Set up the mutable, project-side pieces the agents rely on. The agents, skills, and hooks come from the plugin; this seeds what must live in the repo so it can grow.

## Steps
1. Run the initializer from the repo root:
   ```bash
   node "${CLAUDE_PLUGIN_ROOT}/scripts/init.mjs"
   ```
   This creates (without overwriting anything that already exists):
   - `knowledge/patterns.jsonl`, `knowledge/gotchas.jsonl`, `knowledge/decisions.jsonl` — seeded for React + React Native + Node/TS.
   - `CLAUDE.md` — team rules + the path→specialist routing convention (only if missing).
   - `.claude/scripts/` — copies of prime/scope/capture/promote so agents can call `node .claude/scripts/prime.mjs` directly.
2. Detect the repo layout. If it's a monorepo, offer to add nested `CLAUDE.md` files (e.g. `apps/web/CLAUDE.md`, `apps/mobile/CLAUDE.md`, `services/api/CLAUDE.md`) that name which specialist owns each package. Ask before writing.
3. If the real folder layout differs from the defaults, tell the user to edit the routing table in the `orchestrator` agent and the globs in `scripts/scope.mjs`.
4. Confirm what was created and remind the user to commit `knowledge/` and `CLAUDE.md` to git.

## Notes
- Safe to re-run: existing files are never overwritten.
- The knowledge base is the memory that makes the team improve over time — keep it in version control.
