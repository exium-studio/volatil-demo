---
name: exium-focus-alert
description: "Guidelines and API reference for Exium FocusAlert contextual notification callouts."
---

# Exium FocusAlert Components

Located in `@/design-system/components/focus-alert/ui/`.

---

## 1. FocusAlert (`focus-alert.tsx`)

Contextual banner/alert designed to guide user attention to critical instructions, validations, or system alerts.

### Status Variants:
- `"info"`, `"warning"`, `"error"`, `"success"`

### Usage Example:
```tsx
import { FocusAlert } from "@/design-system/components/focus-alert/ui/focus-alert";

<FocusAlert status={"warning"} title={"Perhatian"}>
  Pastikan batas bidang tanah tidak melebihi area kawasan hutan yang diizinkan.
</FocusAlert>
```
