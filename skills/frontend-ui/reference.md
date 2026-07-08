# Frontend reference checklist

## Components
- One responsibility per component. Extract when a component exceeds ~150 lines.
- Props typed and documented; provide sensible defaults.
- No side effects in render; use `useEffect` with correct dependency arrays.

## Hooks
- Custom hooks start with `use`, return stable references (`useCallback`/`useMemo` where it matters).
- Encapsulate data fetching, subscriptions, and derived state.

## State
- Co-locate state with the component that needs it.
- Avoid duplicating server state in local state; treat the server as the source of truth.

## Accessibility (WCAG 2.1 AA)
- Every input has an associated `<label>`.
- Interactive elements are real buttons/links, reachable by keyboard.
- Color is never the only signal; contrast >= 4.5:1 for text.
- Focus is visible and order is logical.
