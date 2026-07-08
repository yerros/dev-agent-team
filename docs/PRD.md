# PRD — dev-agent-team

## Problem
A solo developer working across a React web app, a React Native + Expo mobile app, and a Node
backend loses time because a single general agent forgets project conventions between sessions,
applies web assumptions to mobile (and vice-versa), and re-makes the same mistakes. Heavy
multi-agent frameworks solve parts of this but demand databases, external services, and a rigid
SDLC that's overkill for one person.

## Vision / north star
A small, editable team of **stack-specific specialists** coordinated by an **orchestrator that
routes work by file path**, kept honest by **independent verification**, and made smarter over time
by a **flat-file project memory** — all built from native Claude Code primitives with no external
dependencies.

## Target user
Primary: a solo/indie developer (the maintainer) on a TypeScript stack — React (web),
React Native + Expo (mobile), Node (backend), often in a monorepo. Secondary: small teams who want
the same setup checked into their repo.

## Goals
1. Route each task to the right specialist automatically, based on the files it touches.
2. Keep specialists aligned with project conventions via a knowledge base that is primed before work.
3. Catch defects before "done" via independent tester, security, and reviewer agents.
4. Improve over time by capturing learnings and promoting the important ones into enforced rules.
5. Install in minutes (`/plugin install` + `/init`) and be fully readable/editable by one person.

## Non-goals
- Not a heavyweight orchestration framework (no BEADS, no forced GitHub Issue→PR pipeline).
- No mandatory cloud services, vector databases, or paid APIs.
- No autonomous self-modification (learning stays human-in-the-loop).
- Not trying to be stack-agnostic — it is intentionally opinionated toward React/RN+Expo/Node.

## Key use cases
- "Add a profile screen and its API endpoint" → orchestrator splits into mobile + backend units,
  delegates, verifies each, and closes.
- Working inside `apps/mobile/` → the scope hook detects it and steers work to the `mobile` (Expo) agent.
- After a review surfaces a recurring mistake → `self-reflect` records it; the maintainer promotes it
  into `CLAUDE.md` so it's enforced next time.

## Success criteria
- Correct specialist chosen from file paths without manual hints in the common case.
- Knowledge base grows across sessions and visibly reduces repeated mistakes.
- A new specialist or skill can be added by editing a handful of files in one sitting.
- The whole plugin remains readable end-to-end by one developer.

## Principles
Lightweight over powerful · Native over bespoke infra · Path-driven routing · Verify, don't trust ·
Human-in-the-loop learning · Opinionated but editable.
