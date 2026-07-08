---
name: self-reflect
description: Distill learnings from the current session into the knowledge base. Use at the end of a task, when the user says "reflect", "capture learnings", or after review feedback, to turn what happened into reusable patterns, gotchas, and decisions.
---

# Self-Reflect

Turn this session into durable knowledge the team primes from next time. Human-in-the-loop: you PROPOSE entries; the user promotes the important ones.

## Steps
1. Read `knowledge/_inbox.jsonl` (signals captured automatically by the Stop hook: git diff stats, timestamps) if it exists.
2. Review what happened this session. Look specifically for:
   - **Patterns** that worked and should be repeated.
   - **Gotchas** — anything that broke, surprised you, or wasted time.
   - **Decisions** — architectural choices and the *why*.
   - **Repetition / disagreement** — the user correcting the same thing twice, or overriding a recommendation. These are candidates for a new rule, skill, or agent tweak.
3. Append one JSON object per learning to the right file, using this schema:
   ```json
   {"type":"pattern|gotcha|decision|must","scope":["glob or path"],"keywords":["..."],"text":"one clear sentence","source":"session|review|user","date":"YYYY-MM-DD"}
   ```
   - `pattern` -> `knowledge/patterns.jsonl`
   - `gotcha`  -> `knowledge/gotchas.jsonl`
   - `decision`-> `knowledge/decisions.jsonl`
   - `must` (a hard rule) -> `knowledge/patterns.jsonl` with `"type":"must"`
4. If a learning is important enough to be enforced every session, tell the user it should be promoted into `CLAUDE.md` or a SKILL.md, and show the exact line to add. Do NOT edit `CLAUDE.md` yourself without confirmation.
5. For any learning important enough to enforce every session, once the user confirms, promote it with `node .claude/scripts/promote.mjs "<rule text>"` — this appends it to CLAUDE.md under "Enforced rules (promoted)".
6. Print a short summary: what you added and what you promoted.

## Guardrails
- Keep entries atomic (one fact each) and concrete.
- Don't duplicate an existing entry — grep the target file first.
- Never store secrets, tokens, or PII.
