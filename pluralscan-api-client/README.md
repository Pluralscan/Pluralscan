# Pluralscan - TS Api Client

## Build

```
npm run build
```

Output directory: pluralscan-webapp/frontend/libs/dist

## Hints

### Avoid Enums

#### Avoid

```typescript
enum ScanState {
    Completed // 0
    Running // 1
}
```

Why: numeric enums are not type-safe

```typescript
enum ScanState {
    Completed = "Completed",
    Running = "Running",
}
```

#### Prefered

```typescript
type ScanState = "Scheduled" | "Paused" | "Running" | "Completed" | "Error"
```

```typescript
const ScanState = {
  Scheduled: "Scheduled",
  Paused: "Paused",
  Running: "Running"
} as const;
```