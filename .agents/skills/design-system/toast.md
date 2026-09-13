---
name: exium-toast
description: "Guidelines and API reference for Exium Toast notification system."
---

# Exium Toast System

Located in `@/design-system/components/toast/`.

---

## 1. Usage API (`toast.ts`)

Trigger toasts programmatically anywhere across the application:

```tsx
import { toast } from "@/design-system/components/toast";

// Success Toast
toast.success({
  title: "Data Saved",
  description: "Your changes have been successfully committed.",
});

// Error Toast
toast.error({
  title: "Operation Failed",
  description: error.message,
});

// Info / Loading Toast
toast.info({
  title: "Processing Request",
});
```

---

## 2. Toaster Mounting (`ui/toaster.tsx`)

The `<Toaster />` component is mounted once in root application shell to capture and display global toast notifications.
