# SPECS — component contracts

Contracts every component must honor. Changes should keep these stable; if you must break one,
record an ADR in `DECISIONS.md` and bump the version.

## plugin.json
- Required: `name` (kebab-case), `version` (semver). Keep `hooks: "./hooks/hooks.json"`.
- Update `version` on every user-visible change; keep `keywords` accurate.

## Agent file (`agents/<name>.md`)
Frontmatter fields used:
- `name` (kebab-case, unique) · `description` (third person, includes trigger conditions + when NOT
  to use, so auto-delegation is accurate) · `model` · `tools` (least privilege) · `skills` (optional)
  · `memory` (`project` for specialists that accrue context, `local` for verifiers).
Body = the agent's system prompt: a short numbered workflow. Specialists must (1) prime, (2) read the
nearest `CLAUDE.md`, (3) implement to the DoD, (4) run checks and report real results.

## Skill (`skills/<name>/SKILL.md`)
- Frontmatter: `name`, `description` (third person, trigger-rich — this is what fires the skill).
- Body: imperative instructions FOR Claude, under ~3,000 words. Put heavy detail in `reference.md`
  and `examples.md` (loaded on demand).

## Script contracts (`scripts/*.mjs`)
All: Node 18+, built-ins only, operate on `process.cwd()`, exit 0 on success.
- `prime.mjs [--keywords "a b"]` — reads `./knowledge/*.jsonl`; prints categorized facts
  (MUST FOLLOW / GOTCHAS / PATTERNS / DECISIONS). **Silent (exit 0, no output) if `knowledge/` is absent.**
- `scope.mjs` — reads `git status --porcelain`, maps changed paths to specialists via `rules`, prints
  one hint line. **Silent if uninitialized or nothing maps.** Keep `rules` in sync with the orchestrator table.
- `capture.mjs` — appends one `{type:"signal",...}` line to `knowledge/_inbox.jsonl`. **Silent if uninitialized.**
- `promote.mjs "<rule>"` — appends `- <rule>` under `## Enforced rules (promoted)` in `CLAUDE.md`; idempotent.
- `init.mjs` — seeds `knowledge/*.jsonl`, `CLAUDE.md`, and `.claude/scripts/`. **Never overwrites** existing files.

## hooks.json
```
SessionStart    → node "${CLAUDE_PLUGIN_ROOT}/scripts/prime.mjs"
UserPromptSubmit→ node "${CLAUDE_PLUGIN_ROOT}/scripts/scope.mjs"
Stop            → node "${CLAUDE_PLUGIN_ROOT}/scripts/capture.mjs"
```
Use `${CLAUDE_PLUGIN_ROOT}` for script paths — never hardcode absolute paths.

## Knowledge entry schema (JSONL, one object per line)
```json
{"type":"pattern|gotcha|decision|must","scope":["glob"],"keywords":["..."],"text":"one atomic fact","source":"seed|session|review|user","date":"YYYY-MM-DD"}
```
- `must` and `pattern` → `patterns.jsonl` · `gotcha` → `gotchas.jsonl` · `decision` → `decisions.jsonl`.
- One fact per entry. No secrets/PII. Grep before adding to avoid duplicates.
