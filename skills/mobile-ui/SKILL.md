---
name: mobile-ui
description: Conventions and patterns for React Native + Expo + TypeScript — Expo Router, EAS build/update, expo-* modules and config plugins, screens, navigation, native primitives, lists, platform differences, and mobile performance/accessibility. Use when writing or reviewing mobile code.
---

# Mobile UI (React Native + TypeScript)

## Core conventions
- Use RN primitives: `View`, `Text`, `Pressable`/`TouchableOpacity`, `FlatList`/`SectionList`. No `div`, `span`, or DOM/`window` APIs.
- All text lives inside `<Text>`; raw strings in a `<View>` will crash.
- Typed navigation (e.g. React Navigation param lists). Never pass untyped route params.
- Handle platform differences explicitly with `Platform.select` / `Platform.OS`; test both iOS and Android paths.
- Long lists use `FlatList` with stable `keyExtractor` — never `.map()` big arrays into memory.
- Respect safe areas and keyboard avoidance.

## Reference material (load on demand)
- `reference.md` — navigation/lists/platform/performance/accessibility checklist.
- `examples.md` — good vs bad RN snippets.

## Definition of Done for mobile work
- Types compile, lint passes, tests green.
- No web-only APIs; renders on both iOS and Android.
- Lists virtualized; no obvious dropped-frame patterns (heavy work off the JS thread / memoized rows).
- Touch targets >= 44x44pt; accessible labels on interactive elements.

## Expo (managed workflow)
- Detect the project first: `app.json` / `app.config.ts` + `expo` in `package.json` means Expo. Match its SDK version and existing conventions.
- **Routing:** prefer **Expo Router** (file-based routes in `app/`, typed routes) when the project uses it; otherwise React Navigation. Don't mix both.
- **Modules:** prefer official `expo-*` SDK modules (expo-image, expo-router, expo-notifications, expo-secure-store, etc.) over unmaintained community packages.
- **Native config:** changes that touch native code/permissions go through **config plugins** in `app.config`, then `npx expo prebuild` (bare) or a new **dev client** build — not by hand-editing `ios/`/`android/` in a managed project.
- **Secrets & env:** use `expo-constants` / EAS secrets and `EXPO_PUBLIC_*` for public env vars. Never hardcode secrets; remember `EXPO_PUBLIC_*` values ship to the client.
- **Builds & updates:** app binaries via **EAS Build**; JS-only fixes can ship via **EAS Update** (OTA), but native changes require a new build. Note when a change needs a rebuild.
- **Verify:** run `npx expo-doctor` and keep dependencies aligned with the SDK via `npx expo install` (not raw `npm install` for Expo-managed deps).
- **Expo Go vs dev client:** custom native modules/config plugins won't run in Expo Go — they need a development build.
