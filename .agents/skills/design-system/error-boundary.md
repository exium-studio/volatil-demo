---
name: exium-error-boundary
description: "Guidelines and API reference for Exium ErrorBoundary components and NotFoundPage."
---

# Exium Error Boundary Components

Located in `@/design-system/components/error-boundary/ui/`.

---

## 1. NotFoundPage (`not-found.page.tsx`)

A standardized 404 Not Found screen with custom illustrations, navigation actions, and theme-aware styling.

### Usage Example:
```tsx
import { NotFoundPage } from "@/design-system/components/error-boundary/ui/not-found.page";

export const Route = createRootRoute({
  notFoundComponent: NotFoundPage,
});
```
