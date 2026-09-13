---
name: exium-shell
description: "Guidelines and architecture for Application Shells: GisAppShell, CommonAppShell, AppNavTitle, and HeaderContainer."
---

# Exium Shell Components

Located in `@/design-system/components/shell/ui/`.

---

## 1. GisAppShell (`gis-app-shell.tsx`)

Core application shell for GIS spatial operations:
- Composes collapsible desktop sidebar or mobile bottom nav.
- Splitter view dividing the functional feature panel (`<Outlet />`) and the full-height `MapShell`.
- Automatically responds to viewport size (`useIsSmallViewport`).

---

## 2. CommonAppShell (`common-app-shell.tsx`)

Standard administrative / dashboard shell layout:
- Header topbar with branding, navigation links (`HNavs`), and user profile popover.
- Scrollable content body.

---

## 3. AppNavTitle (`app-nav-title.tsx`)

Header breadcrumb/title component resolving current route labels and parent module namespaces.
