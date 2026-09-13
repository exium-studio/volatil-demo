---
name: exium-branding
description: "Guidelines and API reference for Exium Branding components: Logo, IgtLogo, and BrandWatermark."
---

# Exium Branding Components

Located in `@/design-system/components/branding/ui/`.

---

## 1. Logo (`logo.tsx`)

Main application logo with support for size variants (`boxSize`), responsive scaling, and theme colors.

### Usage Example:
```tsx
import { Logo } from "@/design-system/components/branding/ui/logo";

<Logo boxSize={20} />
```

---

## 2. IgtLogo (`igt-logo.tsx`)

Official IGTPR agency branding seal logo.

---

## 3. BrandWatermark (`brand-watermark.tsx`)

Subtle background watermark for empty states, loading screens, and print views.
