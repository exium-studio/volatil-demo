---
name: design-system
description: "Master index and core decision protocol for Exium Design System components, rules, and architecture."
---

# Exium Design System (Master Decision Protocol)

## 🔴 PROTOKOL WAJIB AI SEBELUM MEMBUAT FITUR / REFACTOR:

Ketika pengguna meminta membuat fitur baru, halaman, form, modal, atau refactor:
1. **DILARANG membuat komponen mentah / native HTML / langsung import dari Chakra UI** (misalnya `<input type="number">`, `<dialog>`, `<table>`, atau styling ad-hoc).
2. **WAJIB menghafal dan memetakan kebutuhan ke 19 domain Exium Design System**:
   - Mau bikin form input angka? ➡️ Wajib `NumberInput` / `SteppedNumberInput` (`input.md`).
   - Mau bikin text/search input? ➡️ Wajib `Input` dengan `clearable` (`input.md`).
   - Mau bikin dropdown/select searchable? ➡️ Wajib `FocusSelectInput` dengan hierarki `modalKey` (`overlay.md` / `input.md`).
   - Mau bikin switch boolean? ➡️ Wajib `Switch` (`input.md`).
   - Mau bikin modal / drawer / popup? ➡️ Wajib `*Trigger` component + `usePopModal` (`overlay.md`).
   - Mau bikin konfirmasi hapus / destructive action? ➡️ Wajib `ConfirmationTrigger` (`feedback.md`).
   - Mau bikin progress / percentage bar? ➡️ Wajib `Progress` (`feedback.md`).
   - Mau bikin skeleton loading? ➡️ Wajib `Skeleton` (`isLoading` vs `isFetching` rules di `feedback.md`).
   - Mau bikin sidebar / menu navigasi? ➡️ Wajib composable `Sidebar` & `VNavs` tanpa internal scroll (`navigation.md`).
   - Mau bikin tombol action? ➡️ Wajib `Button` / `ButtonGroup` (`button.md`).
   - Mau bikin layout kolom/baris? ➡️ Wajib `HStack` / `VStack` / `Splitter` (`layout.md`).
   - Mau bikin tabel data / list data? ➡️ Wajib DataList Table pattern 1 `useMemo` implicit return (`data-display.md`).
   - Mau bikin tabs / accordion / wizard? ➡️ Wajib `Tabs`, `Accordion`, `Steps` (`disclosure.md`).
   - Mau bikin teks / label / judul? ➡️ Wajib `P`, `ClampedP`, `Heading`, `Badge` (`typography.md`).
   - Mau render icon? ➡️ Wajib `AppIcon` (Lucide primary, Tabler fallback) (`icon.md`).
   - Mau notifikasi toast? ➡️ Wajib `toast.success`, `toast.error`, `toast.info` (`toast.md`).
   - Mau peta GIS? ➡️ Wajib `MapShell`, `BaseMap`, layer order mutlak (`map.md`).
3. **WAJIB membaca (`view_file`) file skill yang relevan** di `.agents/skills/design-system/<domain>.md` untuk memastikan prop interfaces, constraints, dan anti-pattern dipatuhi secara akurat sebelum implementasi.

---

## 19 Domain Komponen Exium (Sesuai Struktur Folder `src/design-system/components/`):

1. [Branding (`branding.md`)](./branding.md) — `Logo`, `IgtLogo`, `BrandWatermark`.
2. [Button (`button.md`)](./button.md) — `Button`, `ButtonGroup`, `BackButton`, `CloseButton`, `DownloadTrigger`.
3. [Charts (`charts.md`)](./charts.md) — `ChartTooltip` dan theme chart integrations.
4. [Data Display (`data-display.md`)](./data-display.md) — DataList Table pattern (1 `useMemo` implicit return), `DataViewTable`, BatchActions, ItemActions.
5. [Disclosure (`disclosure.md`)](./disclosure.md) — `Tabs`, `Accordion`, `Steps`, `Collapsible`, `Carousel`, `Breadcrumb`.
6. [Error Boundary (`error-boundary.md`)](./error-boundary.md) — `NotFoundPage`.
7. [Feedback (`feedback.md`)](./feedback.md) — `Progress`, `Skeleton` (`isLoading` vs `isFetching`), `ConfirmationTrigger`, `FaceEmoji`.
8. [Focus Alert (`focus-alert.md`)](./focus-alert.md) — `FocusAlert`, `FocusAlerter`.
9. [Icon (`icon.md`)](./icon.md) — `AppIcon` (Lucide primary, Tabler fallback).
10. [Input (`input.md`)](./input.md) — `NumberInput`, `Input`, `Switch`, `Checkbox`, `RadioCardInput`, `Textarea`, `FocusSelect`.
11. [Layout (`layout.md`)](./layout.md) — `HStack`, `VStack`, `Splitter`, `AppPageContainer`, `ConstrainedContainer`.
12. [Map (`map.md`)](./map.md) — MapLibre, GeoServer WFS/WMS, `MapShell`, `BaseMap`, layer order (`basemap` → `wms` → `wfs` → `draw`), event hooks.
13. [Media (`media.md`)](./media.md) — `Avatar`, `Image`.
14. [Navigation (`navigation.md`)](./navigation.md) — Composable `Sidebar`, `VNavs` (tanpa internal scroll), `HNavs`.
15. [Overlay (`overlay.md`)](./overlay.md) — URL search param `modalKey` hierarchy (`usePopModal`), `Dialog`, `Drawer`, `Modal`, `Popover`, `Menu`, `Tooltip`.
16. [Shell (`shell.md`)](./shell.md) — `GisAppShell`, `CommonAppShell`, `AppNavTitle`.
17. [Toast (`toast.md`)](./toast.md) — Programmatic `toast.success`, `toast.error`, `toast.info`.
18. [Typography (`typography.md`)](./typography.md) — `P`, `ClampedP`, `Heading`, `Badge`, `CountBadge`, `RichTextEditor`.
19. [Utilities (`utilities.md`)](./utilities.md) — `ModalPurger`, `OfflineAlert`, `ClickDelegateContainer`, `Portal`.

---

## Core Golden Rules Mutlak

1. **Imports**:
   - Only `@/` aliases for imports within `src/`. No relative paths.
   - Design system (`src/design-system/`) MUST NOT import from `features/`.
   - Feature code must import design system components from `@/design-system/...`, NOT directly from `@chakra-ui/react`.
2. **Components Style**:
   - Prop values MUST use curly brackets: `value={"foo"}` instead of `value="foo"`.
   - Add section comments inside components: `// Stores`, `// Hooks`, `// States`, `// Handlers`, `// Derived Values`.
   - Destructure props inside the component body, never in function parameters.
   - Jangan tulis prop yang nilainya sama dengan default komponen.
3. **Anti-patterns**:
   - `setState` inside `useEffect` is forbidden.
   - Accessing `ref.current` during render is forbidden.
   - Never use `<Input type="number" />`; always use `<NumberInput />`.
   - Dilarang pakai `truncate`; selalu gunakan `<ClampedP>`.
   - Dilarang cek array kosong dengan `.length === 0`; selalu gunakan `isEmptyArray(arr)`.
   - Form wajib RHF + Zod; dilarang membuat form dengan kumpulan `useState` terpisah.
4. **Verification**:
   - Always run `pnpm verify` before concluding work (zero errors required).
