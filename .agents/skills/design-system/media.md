---
name: exium-media
description: "Guidelines and API reference for Exium Media components: Avatar and Image."
---

# Exium Media Components

Located in `@/design-system/components/media/ui/`.

---

## 1. Avatar (`avatar.tsx`)

User avatar element with fallback initials and image status handling.

### Usage Example:
```tsx
import { Avatar } from "@/design-system/components/media/ui/avatar";

<Avatar name={"Sulenq"} src={"/avatars/user.jpg"} size={"md"} />
```

---

## 2. Image (`image.tsx`)

Enhanced image component with lazy loading, skeleton blur placeholders, and fallback states.
