# CONTRIBUTING — how to change dev-agent-team

Read `../CLAUDE.md` (north star + invariants) and `SPECS.md` (contracts) first.

## Recipe: add a specialist agent (e.g. `database`)
1. `agents/database.md` — frontmatter (`name`, `description` with clear trigger + when-not-to-use,
   `model`, `tools`, `skills`, `memory`) + a short numbered workflow.
2. `skills/database-*/SKILL.md` — its conventions; add `reference.md`/`examples.md` if needed.
3. `agents/orchestrator.md` — add a routing-table row mapping the relevant path globs to `database`.
4. `scripts/scope.mjs` — add a matching `rules` entry (same globs). Keep in sync with step 3.
5. `scripts/init.mjs` — add seed knowledge entries for the new area.
6. Run the test checklist; bump version; update `CHANGELOG.md` and `README.md`.

## Recipe: add a skill
1. `skills/<name>/SKILL.md` — third-person, trigger-rich `description`; imperative body.
2. Attach to relevant agents via their `skills:` frontmatter if it should be specialist-scoped.
3. Test that the description clearly triggers; update `README.md` skill list.

## Recipe: change routing
Edit the table in `agents/orchestrator.md` and the `rules` globs in `scripts/scope.mjs` **together**.
Smoke-test with `scope.mjs` after staging a file under the new path.

## Recipe: add/adjust knowledge seeds
Edit the arrays in `scripts/init.mjs`. Keep entries atomic and valid JSON. Re-run the init smoke test.

## Test checklist (must pass before packaging)
```bash
node --check scripts/*.mjs
node -e "JSON.parse(require('fs').readFileSync('hooks/hooks.json','utf8'))"
node -e "JSON.parse(require('fs').readFileSync('.claude-plugin/plugin.json','utf8'))"
T=$(mktemp -d); (cd "$T" && git init -q && node "$OLDPWD/scripts/init.mjs" && \
  for f in knowledge/*.jsonl; do node -e "require('fs').readFileSync('$f','utf8').trim().split('\n').forEach(l=>JSON.parse(l))"; done); rm -rf "$T"
```

## Release
1. Bump `version` in `plugin.json` (semver).
2. Add a `CHANGELOG.md` entry.
3. Log any directional decision as an ADR in `DECISIONS.md`.
4. Package (dev docs excluded):
   ```bash
   zip -r /tmp/dev-agent-team.plugin . -x "*.DS_Store" "docs/*" "CLAUDE.md" "CHANGELOG.md" ".git/*"
   ```
