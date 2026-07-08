# React Native reference checklist

## Navigation
- Define a typed param list; screens read typed `route.params`.
- Don't store non-serializable values in navigation state.

## Lists & rendering
- `FlatList`/`SectionList` for anything scrollable and unbounded; provide `keyExtractor`.
- Memoize row components (`React.memo`) and callbacks to avoid re-render storms.

## Platform
- Branch with `Platform.OS` / `Platform.select`; never assume one OS.
- Account for notches/safe areas (`SafeAreaView` or safe-area insets) and Android back button.

## Performance
- Keep heavy work off the JS thread; debounce expensive handlers.
- Avoid inline object/style allocation in hot render paths; use `StyleSheet.create`.

## Accessibility
- `accessibilityLabel` / `accessibilityRole` on interactive elements.
- Minimum touch target 44x44pt.

## Expo specifics
- Install SDK deps with `npx expo install <pkg>` so versions match the SDK; use `npx expo-doctor` to catch mismatches.
- Expo Router: routes are files under `app/`; use typed route params and `<Link>`/`router.push`. Layout via `_layout.tsx`.
- Config plugins in `app.config.(js|ts)` for native permissions/capabilities; run `npx expo prebuild` when going bare or debugging native.
- Public env: only `EXPO_PUBLIC_*` is exposed to the app bundle — never put secrets there. Server secrets stay server-side / EAS secrets.
- OTA: `eas update` ships JS/asset changes; anything touching native code needs `eas build`.
- Test on a dev client (not Expo Go) when the app uses custom native modules or config plugins.
