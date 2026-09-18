---
name: exium-button
description: "Guidelines and API reference for Exium Button, IconButton, ButtonGroup, BackButton, CloseButton, ColorModeButton, and DownloadTrigger."
---

# Exium Button Components

Located in `@/design-system/components/button/ui/`.

---

## 1. Button & IconButton (`button.tsx`)

### `Button`
The primary interactive button component with automatic text clamping, tooltips for truncated labels, and theme color palette binding.

#### Key Props (`ButtonProps`):
- `primary?: boolean`: Shorthand for theme-accented solid button (`variant="solid"`, `colorPalette=theme.colorPalette`).
- `variant?: "solid" | "subtle" | "outline" | "ghost" | "surface"` (Default: `"ghost"`, or `"solid"` if `primary={true}`).
- `colorPalette?: string`: Color palette token (e.g. `"blue"`, `"green"`, `"red"`, `"neutral"`).
- `size?: "2xs" | "xs" | "sm" | "md" | "lg" | "xl"` (Default: `"md"`).
- `loading?: boolean`: Displays Chakra loading spinner and disables clicks.
- `lineClamp?: number`: Max lines for button text before showing tooltip (Default: `1`).
- `disabled?: boolean`.

#### Usage Examples:
```tsx
import { Button } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { PlusIcon } from "lucide-react";

// Primary Action Button
<Button primary onClick={handleCreate}>
  <AppIcon icon={PlusIcon} />
  {"Tambah Data"}
</Button>

// Destructive Action
<Button variant={"solid"} colorPalette={"red"} loading={isDeleting} onClick={handleDelete}>
  {"Hapus"}
</Button>

// Subtle Secondary Action
<Button variant={"subtle"} colorPalette={"blue"} onClick={handleView}>
  {"Lihat Detail"}
</Button>
```

### `IconButton`
Icon-only circular or rounded button for toolbars and compact actions.

```tsx
import { IconButton } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { SearchIcon } from "lucide-react";

<IconButton aria-label={"Cari"} size={"sm"} variant={"ghost"}>
  <AppIcon icon={SearchIcon} />
</IconButton>
```

---

## 2. ButtonGroup (`button-group.tsx`)

Wraps multiple buttons into a connected or attached row.

```tsx
import { ButtonGroup } from "@/design-system/components/button/ui/button-group";
import { Button } from "@/design-system/components/button/ui/button";

<ButtonGroup attached size={"sm"} variant={"outline"}>
  <Button>{"Hari Ini"}</Button>
  <Button>{"Minggu Ini"}</Button>
  <Button>{"Bulan Ini"}</Button>
</ButtonGroup>
```

---

## 3. BackButton (`back-button.tsx`)

Standardized back navigation button with tooltip and optional fallback route (calls `back()` navigation utility).

```tsx
import { BackButton } from "@/design-system/components/button/ui/back-button";

<BackButton fallback={"/mitra/home"} />
```

---

## 4. CloseButton (`close-button.tsx`)

Pre-styled X icon button used across headers, toasts, and popovers.

```tsx
import { CloseButton } from "@/design-system/components/button/ui/close-button";

<CloseButton onClick={handleClose} size={"xs"} />
```

---

## 5. ColorModeButton (`color-mode.tsx`)

Theme toggle button for switching between Light and Dark mode.

```tsx
import { ColorModeButton } from "@/design-system/components/button/ui/color-mode";

<ColorModeButton />
```

---

## 6. DownloadTrigger (`download-trigger.tsx`)

Utility trigger for client-side file downloads with loading state.

```tsx
import { DownloadTrigger } from "@/design-system/components/button/ui/download-trigger";

<DownloadTrigger fileUrl={"/api/export/shapefile"} fileName={"batas_wilayah.zip"}>
  <Button variant={"outline"}>{"Unduh Data SHP"}</Button>
</DownloadTrigger>
```
