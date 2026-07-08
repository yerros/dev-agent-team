# CLAUDE.md — developing the dev-agent-team plugin

This repository is the **source of the `dev-agent-team` Claude Code plugin**. You (Claude Code)
are helping maintain and extend it. Read `docs/PRD.md` for the vision and `docs/ARCHITECTURE.md`
for how the pieces fit before making changes.

## North star (do not drift)
`dev-agent-team` gives a solo developer a **small, editable team of stack-specific specialists**
(React web, React Native + Expo, Node backend) coordinated by an **orchestrator that routes work
by file path**, verified by independent **tester / security / reviewer** agents, and made smarter
over time by a **flat-file knowledge base** via a *prime → work → reflect → promote* loop.

It is deliberately **lightweight and native**: Claude Code primitives only (agents, skills, hooks,
plain Node scripts), **no external services, no database, no mandatory GitHub Issue/PR flow**.
When in doubt, prefer the simplest change that keeps the plugin small and hackable.

## Explicit non-goals (reject scope creep)
- Not a heavyweight framework like metaswarm (no BEADS, no forced SDLC gates).
- No required cloud services, vector DBs, or paid APIs.
- No autonomous self-modification — learning is human-in-the-loop (see ADR-005).
- Don't add components the target user (solo dev) won't realistically use.

## Repository map
```
.claude-plugin/plugin.json   Manifest (name, version, hooks path). Keep name kebab-case.
agents/*.md                  Specialist + orchestrator personas (frontmatter + system prompt).
skills/*/SKILL.md            Skills (+ reference.md / examples.md loaded on demand).
scripts/*.mjs                prime, scope, capture, promote, init (plain Node, no deps).
hooks/hooks.json             SessionStart→prime, UserPromptSubmit→scope, Stop→capture.
README.md                    End-user facing.
docs/                        Development docs (this set). NOT shipped in the .plugin.
```

## Core invariants (must stay true)
1. Scripts have **zero runtime dependencies** (Node built-ins only) and run under Node 18+.
2. Scripts operate on the **user's project** via `process.cwd()`; the **knowledge base lives in the
   project** (`knowledge/*.jsonl`), never inside the plugin.
3. Hooks reference scripts via `${CLAUDE_PLUGIN_ROOT}/scripts/...` and **stay silent** (exit 0, no
   output) when the project is not initialized (`knowledge/` absent).
4. Routing is **by file path**, encoded in the orchestrator's table and `scripts/scope.mjs` globs —
   keep those two in sync. Routing is a heuristic, not a hard engine (ADR-004).
5. The `init` skill is the only thing that writes project-side files, and it **never overwrites**.
6. Never store secrets/PII in knowledge entries, scripts, or docs.

## Common changes (recipes)
See `docs/CONTRIBUTING.md` for full step-by-step. Quick pointers:
- **Add a specialist agent** → new `agents/<name>.md` + matching `skills/<name>-*/SKILL.md`; add a
  routing row to `agents/orchestrator.md` AND a glob to `scripts/scope.mjs`; add seed knowledge to
  `scripts/init.mjs`.
- **Add a skill** → `skills/<name>/SKILL.md` with a third-person, trigger-rich `description`.
- **Change routing** → edit the table in `agents/orchestrator.md` and the `rules` in `scripts/scope.mjs` together.
- **Add knowledge seeds** → edit the arrays in `scripts/init.mjs` (keep entries atomic + valid JSON).

## Before you finish any change (test checklist)
Run these from the repo root:
```bash
node --check scripts/*.mjs                                   # scripts parse
node -e "JSON.parse(require('fs').readFileSync('hooks/hooks.json','utf8'))"     # hooks valid
node -e "JSON.parse(require('fs').readFileSync('.claude-plugin/plugin.json','utf8'))"  # manifest valid
# init smoke test in a throwaway repo:
T=$(mktemp -d); (cd "$T" && git init -q && node "$OLDPWD/scripts/init.mjs" && \
  for f in knowledge/*.jsonl; do node -e "require('fs').readFileSync('$f','utf8').trim().split('\n').forEach(l=>JSON.parse(l))"; done && \
  node .claude/scripts/prime.mjs --keywords "mobile"); rm -rf "$T"
```
Every agent file must have `name:` and `description:`; every skill dir must contain `SKILL.md`.

## Versioning & release
- Semver in `plugin.json`. Add an entry to `CHANGELOG.md` for every user-visible change.
- Log any decision that changes direction in `docs/DECISIONS.md` (ADR).
- Package (excluding dev docs):
  ```bash
  zip -r /tmp/dev-agent-team.plugin . -x "*.DS_Store" "docs/*" "CLAUDE.md" "CHANGELOG.md" ".git/*"
  ```

## When the user asks for something that conflicts with the north star
Say so, explain the trade-off, and propose the lightweight alternative before implementing. Keeping
this plugin small is a feature.
