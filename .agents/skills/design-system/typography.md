---
name: exium-typography
description: "Guidelines and API reference for Exium Typography components: P, ClampedP, Heading, Badge, CountBadge, RichTextEditor, and Kbd."
---

# Exium Typography Components

Located in `@/design-system/components/typography/ui/`.

---

## 1. Paragraph (`p.tsx`) & ClampedP

- `P`: Base text element inheriting Chakra styling.
- `ClampedP`: Text component with line clamping truncation.

### Usage Example:
```tsx
import { P, ClampedP } from "@/design-system/components/typography/ui/p";

<P fontSize={"sm"} color={"fg.muted"}>Standard muted text</P>
<ClampedP lineClamp={2}>This text will truncate after 2 lines</ClampedP>
```

---

## 2. Heading (`heading.tsx`)

Standard headings with level sizes from `xs` through `3xl`.

---

## 3. Badge (`badge.tsx`) & CountBadge (`count-badge.tsx`)

Visual tags for statuses, categories, or counters.

### Variants:
- `"solid"`, `"subtle"`, `"outline"`, `"surface"`

### Usage Example:
```tsx
import { Badge } from "@/design-system/components/typography/ui/badge";
import { CountBadge } from "@/design-system/components/typography/ui/count-badge";

<Badge variant={"subtle"} colorPalette={"green"}>
  Approved
</Badge>

<CountBadge count={12} max={99} colorPalette={"red"} />
```

---

## 4. RichTextEditor (`rich-text-editor.tsx`)

WYSIWYG editor using TipTap with built-in toolbar presets (`minimal`, `standard`, `full`).
