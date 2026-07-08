---
name: tdd
description: Enforce test-driven development (RED-GREEN-REFACTOR) while implementing a unit. Use during implementation of logic-bearing code, or when the user asks for TDD, tests-first, or reliable/regression-safe changes. Works with Vitest/Jest, React Testing Library, and React Native Testing Library.
---

# Test-Driven Development (RED → GREEN → REFACTOR)

Write the test first, watch it fail, then make it pass. This is a loop, not a phase.

## The loop (per behavior)
1. **RED.** Write one failing test that expresses the next Definition-of-Done item. Run it and CONFIRM it fails for the right reason. A test that passes immediately is suspect — delete or fix it.
2. **GREEN.** Write the minimum code to make that test pass. No extra features (YAGNI). Run the test and confirm green.
3. **REFACTOR.** Clean up names/duplication with the test still green. Re-run.
4. **Commit** the small red→green→refactor increment, then repeat for the next behavior.

## Rules
- Never write implementation before its test exists. If code was written first, add the test and verify it actually catches regressions (comment out the code, see it go red).
- One behavior per test; clear arrange/act/assert.
- Test behavior and contracts, not implementation details.
- Web → React Testing Library; mobile → React Native Testing Library; logic → plain Vitest/Jest.
- Report real run output — never claim green without running the suite.

Pair with the `tester` agent for the actual test authoring/running, and the `reviewer` for the final PASS/FAIL.
