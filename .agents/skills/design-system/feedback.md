---
name: design-system-feedback
description: "Guidelines and API reference for Exium Feedback components: Progress, Skeleton, ConfirmationTrigger, confirmDialog, Alert, Loaders, and Empty States."
---

# Exium Feedback Components

Located in `@/design-system/components/feedback/`.

---

## 1. Progress (`progress.tsx`)

### Components:
- `Progress.Root`: Root container for linear progress.
- `Progress.Track` & `Progress.Range`: Track and filled indicator bar.
- `Progress.Label` & `Progress.ValueText`: Header label and formatted percentage.
- `ProgressCircle.Root`, `ProgressCircle.Track`, `ProgressCircle.Range`, `ProgressCircle.ValueText`: Circular SVG progress rings.

### Key Props:
- `value: number` (0 to 100) or `value={null}` for indeterminate animation.
- `colorPalette?: string` (e.g. `"blue"`, `"green"`, `"red"`).
- `size?: "xs" | "sm" | "md" | "lg"`.
- `animated?: boolean` / `striped?: boolean`.

### Example:
```tsx
import { Progress, ProgressCircle } from "@/design-system/components/feedback/ui/progress";

// Linear Progress
<Progress.Root value={uploadPercent} colorPalette={"blue"} size={"sm"}>
  <Progress.Track>
    <Progress.Range />
  </Progress.Track>
</Progress.Root>

// Circular Progress
<ProgressCircle.Root value={75} colorPalette={"green"} size={"md"}>
  <ProgressCircle.Track />
  <ProgressCircle.Range />
  <ProgressCircle.ValueText />
</ProgressCircle.Root>
```

---

## 2. Skeleton (`skeleton.tsx`)

Used for content loading states.

### 🔴 Critical Rules:
- **`isLoading`**: Render `Skeleton` full width and fixed height (e.g. `h={"250px"}`).
- **`isFetching`**: Keep table/data visible + subtle loading indicator. Never replace the table with skeleton on refetch.

### Components:
- `Skeleton`: Standard box skeleton with shimmer.
- `SkeletonCircle`: Circular skeleton for avatars.
- `SkeletonText`: Multi-line text skeleton (`noOfLines={3}`, `gap={2}`).

### Example:
```tsx
import { Skeleton, SkeletonCircle, SkeletonText } from "@/design-system/components/feedback/ui/skeleton";

<VStack gap={"md"} align={"stretch"} w={"full"}>
  <HStack gap={"md"}>
    <SkeletonCircle size={"40px"} />
    <SkeletonText noOfLines={2} gap={2} flex={1} />
  </HStack>
  <Skeleton h={"200px"} rounded={"md"} />
</VStack>
```

---

## 3. Confirmation Trigger & Utility

### A. `ConfirmationTrigger` (`confirmation-trigger.tsx`)
Compound trigger component that opens a standard confirmation modal.

#### Key Props (`ConfirmationTriggerProps`):
- `modalKey: string` (Required, unique key)
- `title?: string` (Default: `t["action.confirm"]()`)
- `description?: string` / `desc?: string`
- `confirmLabel?: string` (Default: `t["action.confirm"]()`)
- `cancelLabel?: string` (Default: `t["action.cancel"]()`)
- `colorPalette?: string` (e.g. `"red"` for destructive actions)
- `icon?: ComponentType | ReactNode`
- `confirmButtonProps?: Partial<ButtonProps>`
- `onConfirm?: () => void`
- `onCancel?: () => void`

#### Example:
```tsx
import { ConfirmationTrigger } from "@/design-system/components/feedback/ui/confirmation-trigger";
import { Button } from "@/design-system/components/button/ui/button";

<ConfirmationTrigger
  modalKey={"delete-user-confirmation"}
  colorPalette={"red"}
  title={"Hapus Pengguna?"}
  description={"Akun pengguna ini akan dinonaktifkan secara permanen."}
  confirmLabel={"Hapus"}
  onConfirm={() => deleteUserMutation.mutate(userId)}
>
  <Button variant={"subtle"} colorPalette={"red"}>
    {"Hapus Akun"}
  </Button>
</ConfirmationTrigger>
```

### B. `confirmDialog()` (`confirm-dialog.tsx`)
Imperative confirmation utility for table batch actions or custom event handlers.

```tsx
import { confirmDialog } from "@/design-system/components/feedback/utils/confirm-dialog";

confirmDialog("bulk-delete-confirmation", {
  title: "Hapus 5 Item Terpilih?",
  description: "Semua item yang dicentang akan dihapus dari antrean.",
  colorPalette: "red",
  confirmLabel: "Hapus Semua",
  onConfirm: () => {
    executeBulkDelete();
  },
});
```

---

## 4. Alert (`alert.tsx`)

Inline banner for warning, error, info, or success notices.

### Example:
```tsx
import { Alert } from "@/design-system/components/feedback/ui/alert";

<Alert
  status={"warning"}
  title={"Batas Kuota"}
  description={"Sisa kuota pengunduhan data Anda tinggal 2 bidang."}
/>
```

---

## 5. Loaders & Indicators

- `Loader` (`loader.tsx`): Centered spinner with optional text.
- `TopBarLoader` (`top-bar-loader.tsx`): Slim progress bar at the top of the viewport.
- `Indicator` (`indicator.tsx`): Badge dot status indicator.

---

## 6. Empty & Feedback States

Located in `@/design-system/components/feedback/ui/`:
- `StateNoData` (`state.no-data.tsx`): Empty dataset state with custom icon, title, description, and action button.
- `StateNoResult` (`state.no-result.tsx`): Search/filter with no matches.
- `StateRetry` (`state.retry.tsx`): Failed request with a retry button.
- `StateAccessDenied` (`state.access-denied.tsx`): 403 unauthorized state.
- `StateWelcome` (`state.welcome.tsx`): Onboarding welcome card.
- `FeedbackState` (`feedback-state.tsx`): Composable generic state illustration.
