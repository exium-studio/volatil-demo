---
name: exium-button
description: "Guidelines and API reference for Exium Button, ButtonGroup, BackButton, CloseButton, and DownloadTrigger."
---

# Exium Button Components

Located in `@/design-system/components/button/ui/`.

---

## 1. Button (`button.tsx`)

The foundational button component with built-in loading spinner, leading/trailing icons, and variant styles.

### Variants:
- `"solid"` (default): High-emphasis background.
- `"subtle"`: Soft background using color palette.
- `"outline"`: Bordered button.
- `"ghost"`: Background only visible on hover.
- `"surface"`: Raised subtle appearance.
- `"blend"`: Floating blend mode.

### Sizes:
- `"2xs" | "xs" | "sm" | "md" | "lg" | "xl"`

### Key Props:
- `loading?: boolean`: Renders a spinner and disables user interaction.
- `loadingText?: string`: Text displayed while loading.
- `leftIcon?: LucideIcon`, `rightIcon?: LucideIcon`: Direct icon component passing.
- `colorPalette?: string`: Color palette (e.g., `"blue"`, `"red"`, `"green"`).

### Usage Example:
```tsx
import { Button } from "@/design-system/components/button/ui/button";
import { PlusIcon } from "lucide-react";

<Button
  variant={"solid"}
  colorPalette={"blue"}
  size={"sm"}
  leftIcon={PlusIcon}
  loading={isSubmitting}
>
  Add Record
</Button>
```

---

## 2. ButtonGroup (`button-group.tsx`)

Groups related buttons visually into a connected or spaced row.

### Usage Example:
```tsx
import { ButtonGroup } from "@/design-system/components/button/ui/button-group";
import { Button } from "@/design-system/components/button/ui/button";

<ButtonGroup attached size={"sm"} variant={"outline"}>
  <Button>First</Button>
  <Button>Second</Button>
</ButtonGroup>
```

---

## 3. BackButton (`back-button.tsx`)

A standardized navigational back button with customizable fallback route and tooltip.
