# Frontend examples

## Good: typed, accessible button
```tsx
type ButtonProps = { variant: "primary" | "ghost"; onClick: () => void; children: React.ReactNode };
export function Button({ variant, onClick, children }: ButtonProps) {
  return <button className={`btn btn-${variant}`} onClick={onClick}>{children}</button>;
}
```

## Bad: untyped, inaccessible click target
```tsx
export function Button(props) {                 // untyped
  return <div onClick={props.onClick}>{props.children}</div>; // div, not keyboard-accessible
}
```
