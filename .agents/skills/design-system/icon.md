---
name: exium-icon
description: "Guidelines and API reference for Exium Icon components: AppIcon and Lucide/Tabler icon integrations."
---

# Exium Icon Components

Located in `@/design-system/components/icon/ui/`.

---

## 1. AppIcon (`app-icon.tsx`)

Universal wrapper for icon rendering across the entire application.

### 🔴 Icon Priority Rule:
- Primary: **Lucide icons** (`import { ... } from "lucide-react"`)
- Fallback: **Tabler icons** (`import { ... } from "@tabler/icons-react"`)

### Sizes:
- `"2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl"`

### Usage Example:
```tsx
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { CheckCircleIcon } from "lucide-react";

<AppIcon icon={CheckCircleIcon} size={"md"} color={"green.solid"} />
```
