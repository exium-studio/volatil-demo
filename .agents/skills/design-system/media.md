---
name: exium-media
description: "Guidelines and API reference for Exium Media components: Avatar, AvatarGroup, and Image."
---

# Exium Media Components

Located in `@/design-system/components/media/ui/`.

---

## 1. Avatar (`avatar.tsx`)

User profile picture with automatic name-derived initials and fallback placeholders.

### Key Props:
- `name?: string`: Generates fallback initials (e.g. `"Budi Santoso"` -> `"BS"`).
- `src?: string`: Image source URL.
- `size?: "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl"`.
- `shape?: "full" | "square" | "rounded"`.
- `colorPalette?: string`.

### Example:
```tsx
import { Avatar, AvatarGroup } from "@/design-system/components/media/ui/avatar";

// Single Avatar
<Avatar name={"Ahmad Hidayat"} src={user.avatarUrl} size={"sm"} />

// Avatar Group
<AvatarGroup size={"sm"} max={3}>
  <Avatar name={"User One"} src={"/avatars/1.jpg"} />
  <Avatar name={"User Two"} src={"/avatars/2.jpg"} />
  <Avatar name={"User Three"} src={"/avatars/3.jpg"} />
</AvatarGroup>
```

---

## 2. Image (`image.tsx`)

Next-generation responsive image component with fallback handling and aspect ratio containment.

```tsx
import { Image } from "@/design-system/components/media/ui/image";

<Image
  src={"/assets/map-preview.png"}
  alt={"Preview Peta"}
  rounded={"md"}
  fit={"cover"}
  h={"180px"}
  w={"full"}
/>
```
