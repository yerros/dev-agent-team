# Changelog

All notable changes to dev-agent-team. Format: Keep a Changelog-ish; versions use semver.

## [0.2.0] — 2026-07-08
### Added
- `tester` and `security` agents; orchestrator now runs independent verification (tester + security + reviewer).
- `scope.mjs` + `UserPromptSubmit` hook: detects the changed package and suggests the specialist (path-based routing).
- `promote.mjs` + a promote step in `self-reflect`: one-command promotion of a learning into `CLAUDE.md`.
- Process skills `brainstorming` (spec-before-code) and `tdd` (RED-GREEN-REFACTOR).
- Expo support in the `mobile` agent and `mobile-ui` skill (Expo Router, EAS, config plugins, `expo install`, EXPO_PUBLIC_* rules); Expo knowledge seeds.
- Development docs: `CLAUDE.md`, `docs/{PRD,ARCHITECTURE,SPECS,CONTRIBUTING,DECISIONS,ROADMAP}.md`, this changelog.

## [0.1.0] — 2026-07-08
### Added
- Initial plugin: `orchestrator`, `frontend`, `mobile`, `backend`, `reviewer` agents.
- Skills: `frontend-ui`, `mobile-ui`, `backend-api`, `self-reflect`, `init`.
- Scripts: `prime`, `capture`, `init`; hooks `SessionStart→prime`, `Stop→capture`.
- Flat-file JSONL knowledge base with prime → work → reflect loop.
