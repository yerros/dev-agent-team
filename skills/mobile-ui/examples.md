# React Native examples

## Good: typed, native-primitive, accessible row
```tsx
import { Pressable, Text, StyleSheet } from "react-native";
type RowProps = { label: string; onPress: () => void };
export const Row = React.memo(function Row({ label, onPress }: RowProps) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} style={styles.row}>
      <Text>{label}</Text>
    </Pressable>
  );
});
const styles = StyleSheet.create({ row: { minHeight: 44, justifyContent: "center" } });
```

## Bad: web primitives + raw string in View (will crash) + inline styles
```tsx
export function Row({ label, onClick }) {          // untyped, web onClick
  return <View onClick={onClick} style={{minHeight:44}}>{label}</View>; // raw string in View -> crash
}
```
