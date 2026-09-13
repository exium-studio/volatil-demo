---
name: design-system-feedback
description: "Guidelines and usage rules for Progress, Skeleton, Alert, FaceEmoji, and ConfirmationTrigger."
---

# Design System Feedback Components

Located in `@/design-system/components/feedback/ui/`.

---

## 1. Progress (`progress.tsx`)

### Components:
- `Progress.Root`: Root wrapper for bar progress.
- `Progress.Track` & `Progress.Range`: Track and filled indicator.
- `Progress.Label` & `Progress.ValueText`: Optional labels and numerical percentages.
- `ProgressCircle.Root`, `ProgressCircle.Track`, `ProgressCircle.Range`: Circular progress indicators.

### Key Props:
- `value: number` (0 to 100)
- `colorPalette?: string`
- `size?: "xs" | "sm" | "md" | "lg"`
- `animated?: boolean` / `striped?: boolean`

### Usage Example:
```tsx
import { Progress } from "@/design-system/components/feedback/ui/progress";

<Progress.Root value={progressValue} colorPalette={"blue"} size={"md"}>
  <Progress.Track>
    <Progress.Range />
  </Progress.Track>
</Progress.Root>
```

---

## 2. Skeleton (`skeleton.tsx`)

Placeholder loading animations for layouts, tables, and cards.

### 🔴 Critical Rules:
- When fetching initial table data (`isLoading`), render `Skeleton` full width and fixed height.
- Do NOT replace the whole table with skeletons on background refetch (`isFetching`).

### Components:
- `Skeleton`: Standard box skeleton.
- `SkeletonCircle`: Circular skeleton for avatars.
- `SkeletonText`: Multi-line text skeleton with configurable line counts (`noOfLines`).

---

## 3. ConfirmationTrigger (`confirmation-trigger.tsx`)

Modal confirmation prompt for destructive actions (delete, deactivate, reset).
Always provide a unique `modalKey`.
