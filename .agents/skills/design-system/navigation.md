---
name: design-system-navigation
description: "Guidelines and conventions for Sidebar, VNavs, HNavs, NavButton, and NavLink components."
---

# Design System Navigation Components

All navigation components reside in `@/design-system/components/navigation/ui/`.

---

## 1. Sidebar (`sidebar.tsx`)

Composable layout component for collapsible desktop & mobile sidebars.

### Structure:
```tsx
import { Sidebar } from "@/design-system/components/navigation/ui/sidebar";

<Sidebar.Root
  sidebarKey={"unique-sidebar-key"}
  defaultExpanded={false}
  expandable={true}
>
  <Sidebar.Header>
    {/* Logo and Brand Title */}
  </Sidebar.Header>

  <Sidebar.Separator />

  <Sidebar.Body>
    {/* Scrollable content such as VNavs or filters */}
  </Sidebar.Body>

  <Sidebar.Separator />

  <Sidebar.Footer>
    {/* Bottom actions, secondary navs, user profile */}
  </Sidebar.Footer>
</Sidebar.Root>
```

### Components:
- `Sidebar.Root`: Manages collapsed width (64px) vs expanded width (240px), sidebar store persistence, and toggle button.
- `Sidebar.Header`: Header bar fixed to `h="headerH"`.
- `Sidebar.Body`: Vertical scroll container (`overflowY="auto"`, `flex=1`, `minH=0`).
- `Sidebar.Separator`: Horizontal divider line with margin.
- `Sidebar.Footer`: Sticky/fixed bottom container for secondary actions.
- `Sidebar.ToggleButton`: Hoverable expansion trigger pill positioned on the sidebar border edge.

---

## 2. VNavs (`v-navs.tsx`)

Vertical hierarchical navigation tree component.

### 🔴 Critical Rules:
1. **Never introduce internal scroll containers in `VNavs`.** `VNavs` renders a `VStack` and delegates scrolling to its parent container (such as `Sidebar.Body`).
2. **Active items and ancestor expansion**: `VNavs` automatically expands parent folders leading to the `activeKey`.
3. When in collapsed rail mode (`expanded={false}`), sub-items open via popover `Menu`.

### Key Props:
- `groups: NavGroup<TNavKey>[]`
- `navs: Record<TNavKey, NavItem>`
- `activeKey?: TNavKey`
- `expanded?: boolean`
- `onNavClick?: (key: TNavKey) => void`

### Usage Example:
```tsx
import { VNavs } from "@/design-system/components/navigation/ui/v-navs";

<VNavs<AppNavKey>
  groups={navGroups}
  navs={navsMap}
  activeKey={activeKey}
  expanded={isExpanded}
  onNavClick={(key) => navigate({ to: navsMap[key].pathname })}
/>
```

---

## 3. HNavs (`h-navs.tsx`)

Horizontal navigation bar typically used in topbars or tab headers.
