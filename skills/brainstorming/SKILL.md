---
name: brainstorming
description: Refine a rough idea into an agreed spec BEFORE any code is written. Use at the start of any feature or non-trivial change — phrases like "let's build", "I want to add", "can you implement", or when the request is vague. Ask questions, surface alternatives, and present the design in small chunks for sign-off.
---

# Brainstorming (spec before code)

Do NOT jump to code. Turn a fuzzy request into a small, agreed spec first.

## Steps
1. **Understand the real goal.** Ask what problem this solves and for whom. One or two questions at a time, not a wall of them.
2. **Surface constraints & unknowns.** Stack, existing patterns (prime the knowledge base), data, edge cases, non-goals (YAGNI).
3. **Offer alternatives.** Present 2–3 approaches with trade-offs; recommend one and say why.
4. **Draft the spec in chunks.** Show it in pieces short enough to read: goal, scope, out-of-scope, key decisions, and a Definition of Done (enumerable items).
5. **Get explicit sign-off** on each chunk before moving on. Save the agreed spec (e.g. to `docs/` or the task) so `orchestrator` can decompose from it.

## Guardrails
- Prefer the simplest design that meets the goal. Reduce complexity.
- No implementation until the DoD is agreed.
- If the user says "just do it", still state your assumptions and the DoD in one short block, then proceed.
