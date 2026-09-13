---
name: exium-disclosure
description: "Guidelines and API reference for Exium Accordion, Tabs, Steps, Collapsible, Carousel, and Breadcrumb."
---

# Exium Disclosure Components

Located in `@/design-system/components/disclosure/ui/`.

---

## 1. Tabs (`tabs.tsx`)

Multi-panel disclosure interface.

### Structure:
```tsx
import { Tabs } from "@/design-system/components/disclosure/ui/tabs";

<Tabs.Root defaultValue={"overview"} variant={"outline"}>
  <Tabs.List>
    <Tabs.Trigger value={"overview"}>Overview</Tabs.Trigger>
    <Tabs.Trigger value={"settings"}>Settings</Tabs.Trigger>
  </Tabs.List>

  <Tabs.Content value={"overview"}>
    {/* Overview Content */}
  </Tabs.Content>
  <Tabs.Content value={"settings"}>
    {/* Settings Content */}
  </Tabs.Content>
</Tabs.Root>
```

---

## 2. Accordion (`accordion.tsx`)

Expandable stacked disclosure sections.

### Structure:
```tsx
import { Accordion } from "@/design-system/components/disclosure/ui/accordion";

<Accordion.Root collapsible defaultValue={["info"]}>
  <Accordion.Item value={"info"}>
    <Accordion.ItemTrigger>Information</Accordion.ItemTrigger>
    <Accordion.ItemContent>Details here</Accordion.ItemContent>
  </Accordion.Item>
</Accordion.Root>
```

---

## 3. Collapsible (`collapsible.tsx`)

Simple animated expand/collapse toggle for single panels.

---

## 4. Steps (`steps.tsx`)

Multi-step wizard indicator with numbered or bullet indicators and status feedback (active, complete, error).

---

## 5. Breadcrumb (`breadcrumb.tsx`)

Navigational hierarchy path list.
