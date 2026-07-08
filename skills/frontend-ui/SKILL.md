---
name: frontend-ui
description: Conventions and patterns for building React + TypeScript UI — components, hooks, state, forms, styling, and accessibility. Use when writing or reviewing client-side code.
---

# Frontend UI (React + TypeScript)

## Core conventions
- Function components + hooks only. No class components.
- Fully typed props; avoid `any`. Prefer discriminated unions for variant props.
- Keep components small and presentational; lift data-fetching into hooks or a data layer.
- State: local `useState`/`useReducer` first; reach for a store only for genuinely shared state.
- Accessibility is non-negotiable: semantic elements, labels for inputs, keyboard operability, visible focus.

## Reference material (load on demand)
- `reference.md` — component/hook/state checklist and accessibility rules.
- `examples.md` — good vs bad snippets.

## Definition of Done for UI work
- Types compile (`tsc`), lint passes, tests (if any) green.
- Component is keyboard-accessible and has no obvious a11y violations.
- No hardcoded values that belong in tokens/config.
