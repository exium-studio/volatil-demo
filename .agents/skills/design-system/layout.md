---
name: exium-layout
description: "Guidelines and conventions for Exium Layout components: Box, Flex, HStack, VStack, Center, SimpleGrid, Splitter, and Containers."
---

# Exium Layout Components

Located in `@/design-system/components/layout/ui/`.

---

## 1. FlexBox & Stacks (`flex-box.tsx`)

- `HStack`: Horizontal flex container with centered vertical alignment (`alignItems="center"`).
- `VStack`: Vertical flex container with column direction (`flexDirection="column"`).

### 🔴 Style Rule:
Always use curly bracket syntax for props:
```tsx
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";

<VStack align={"stretch"} gap={4} w={"full"}>
  <HStack justify={"space-between"} gap={2}>
    {/* Items */}
  </HStack>
</VStack>
```

---

## 2. Splitter (`splitter.tsx`)

Multi-panel resizable splitter layout (used heavily in GIS and dashboard layouts).

### Structure:
```tsx
import { Splitter } from "@/design-system/components/layout/ui/splitter";

<Splitter.Root
  size={sizes}
  onResize={(details) => setSizes(details.size)}
  orientation={"horizontal"}
>
  <Splitter.Panel id={"left"}>
    {/* Left content */}
  </Splitter.Panel>
  <Splitter.ResizeTrigger id={"left:right"} />
  <Splitter.Panel id={"right"}>
    {/* Right content */}
  </Splitter.Panel>
</Splitter.Root>
```

---

## 3. Containers (`page-container.tsx`, `constrained-container.tsx`)

- `AppPageContainer`: Full-height viewport shell container.
- `ConstrainedContainer`: Max-width constrained content area for forms and articles.
