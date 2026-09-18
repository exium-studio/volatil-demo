---
name: design-system
description: "Master index and core decision protocol for Exium Design System components, rules, and architecture."
---

# Exium Design System (Master Decision Protocol)

## 🔴 PROTOKOL WAJIB AI SEBELUM MEMBUAT FITUR / REFACTOR:

Ketika pengguna meminta membuat fitur baru, halaman, form, modal, atau refactor:
1. **DILARANG membuat komponen mentah / native HTML / langsung import dari Chakra UI** (misalnya `<input type="number">`, `<dialog>`, `<table>`, `<svg>`, atau styling ad-hoc).
2. **WAJIB menghafal dan memetakan kebutuhan ke 20 domain Exium Design System**:
   - Mau bikin form input angka? ➡️ Wajib `NumberInput` (`input.md`).
   - Mau bikin text/search input? ➡️ Wajib `Input` / `SearchInput` dengan `clearable` (`input.md`).
   - Mau bikin dropdown/select searchable? ➡️ Wajib `FocusSelectInput` dengan hierarki `modalKey` (`input.md`).
   - Mau bikin switch boolean? ➡️ Wajib `Switch` (`input.md`).
   - Mau bikin modal / drawer / popup? ➡️ Wajib `Modal` / `Dialog` / `Drawer` + `usePopModal` (`overlay.md`).
   - Mau bikin konfirmasi hapus / destructive action? ➡️ Wajib `ConfirmationTrigger` atau `confirmDialog()` (`feedback.md`).
   - Mau bikin milestone / pop alert / offline notification? ➡️ Wajib `FocusAlertItem` / `focusAlert()` (`focus-alert.md`).
   - Mau ilustrasi ekspresi wajah emoji? ➡️ Wajib `Emoji` (`emoji.md`).
   - Mau bikin progress bar / circular indicator? ➡️ Wajib `Progress` / `ProgressCircle` (`feedback.md`).
   - Mau bikin skeleton loading? ➡️ Wajib `Skeleton` (`isLoading` vs `isFetching` rules di `feedback.md`).
   - Mau bikin sidebar / menu navigasi? ➡️ Wajib composable `Sidebar` & `VNavs` tanpa internal scroll (`navigation.md`).
   - Mau bikin tombol action? ➡️ Wajib `Button` / `ButtonGroup` (`button.md`).
   - Mau bikin layout kolom/baris? ➡️ Wajib `HStack` / `VStack` / `Splitter` (`layout.md`).
   - Mau bikin tabel data / list data? ➡️ Wajib DataList Table pattern 1 `useMemo` implicit return (`data-display.md`).
   - Mau bikin tabs / accordion / wizard? ➡️ Wajib `Tabs`, `Accordion`, `Steps` (`disclosure.md`).
   - Mau bikin teks / label / judul? ➡️ Wajib `P`, `ClampedP`, `Heading`, `Badge`, `CountBadge` (`typography.md`).
   - Mau render icon? ➡️ Wajib `AppIcon` (Lucide primary, Tabler fallback) (`icon.md`).
   - Mau notifikasi toast? ➡️ Wajib `toast.success`, `toast.error`, `toast.info`, `toast.warning` (`toast.md`).
   - Mau peta GIS? ➡️ Wajib `MapShell`, `BaseMap`, layer order mutlak (`map.md`).
3. **WAJIB membaca (`view_file`) file skill yang relevan** di `.agents/skills/design-system/<domain>.md` untuk memastikan prop interfaces, constraints, dan anti-pattern dipatuhi secara akurat sebelum implementasi.

---

## 20 Domain Komponen Exium (Sesuai Struktur Folder `src/design-system/components/`):

1. [Branding (`branding.md`)](./branding.md) — `Logo`, `IgtLogo`, `BrandWatermark`.
2. [Button (`button.md`)](./button.md) — `Button`, `ButtonGroup`, `BackButton`, `CloseButton`, `IconButton`.
3. [Charts (`charts.md`)](./charts.md) — `ChartTooltip` dan theme chart integrations.
4. [Data Display (`data-display.md`)](./data-display.md) — DataList Table pattern (1 `useMemo` implicit return), `DataViewTable`, `DataViewBatchActions`, `DataViewItemActions`.
5. [Disclosure (`disclosure.md`)](./disclosure.md) — `Tabs`, `Accordion`, `Steps`, `Collapsible`, `Carousel`, `Breadcrumb`.
6. [Emoji (`emoji.md`)](./emoji.md) — Custom SVG expressive face illustrations (19 variants: `happy`, `thumbUp`, `cool`, `thinking`, etc.).
7. [Error Boundary (`error-boundary.md`)](./error-boundary.md) — `NotFoundPage`.
8. [Feedback (`feedback.md`)](./feedback.md) — `Progress`, `Skeleton` (`isLoading` vs `isFetching`), `ConfirmationTrigger`, `confirmDialog()`, `Alert`, `Loader`, `TopBarLoader`, `Indicator`, `FeedbackState` / empty states.
9. [Focus Alert (`focus-alert.md`)](./focus-alert.md) — Center-popped modal alerts with overshoot animation (`FocusAlertItem`, `FocusAlertTrigger`, `focusAlert()`, `FocusAlerter`).
10. [Icon (`icon.md`)](./icon.md) — `AppIcon` (Lucide primary, Tabler fallback), `Icon`.
11. [Input (`input.md`)](./input.md) — `Input`, `NumberInput`, `PasswordInput`, `SearchInput`, `FocusSearch`, `FocusSelect`, `Select`, `Switch`, `Checkbox`, `RadioInput`, `RadioCardInput`, `RadioIndicator`, `Textarea`, `Slider`, `PinInput`, `Field`, `Fieldset`, `FileInput`, `DateInput`, `DatePicker`, `ChakraDatePicker`, `SegmentGroup`, `SegmentGroupInput`, `ToggleTip`.
12. [Layout (`layout.md`)](./layout.md) — `Box`, `Circle`, `Center`, `HStack`, `VStack`, `Grid`, `Group`, `Stack`, `Float`, `Splitter`, `ClickableContainer`, `MaskedContainer`, `ScrollContainer`, `ActionHeaderScrollContainer`, `AppPageContainer`, `ConstrainedContainer`, `Separator`, `AspectRatio`.
13. [Map (`map.md`)](./map.md) — MapLibre GL, GeoServer WFS/WMS, `MapShell`, `BaseMap`, layer order (`basemap` → `wms` → `wfs` → `draw`), event hooks (`useMapLayers`, `useMapDraw`, `useMapResizeObserver`).
14. [Media (`media.md`)](./media.md) — `Avatar`, `Image`.
15. [Navigation (`navigation.md`)](./navigation.md) — Composable `Sidebar`, `VNavs` (tanpa internal scroll), `HNavs`, `Link`, `Nav`, `NavButton`.
16. [Overlay (`overlay.md`)](./overlay.md) — URL search param `modalKey` hierarchy (`usePopModal`), `Modal`, `Dialog`, `Drawer`, `Popover`, `Menu`, `Tooltip`, `ActionBar`.
17. [Shell (`shell.md`)](./shell.md) — `GisAppShell`, `CommonAppShell`, `AppNavTitle`, `HeaderContainer`.
18. [Toast (`toast.md`)](./toast.md) — Programmatic `toast.success`, `toast.error`, `toast.info`, `toast.warning`, `Toaster`, `ToastHistory`, `NotificationCenter`.
19. [Typography (`typography.md`)](./typography.md) — `P`, `ClampedP`, `TNum`, `Heading`, `Badge`, `CountBadge`, `Span`, `Kbd`, `Url`, `List`, `RichTextEditor`.
20. [Utilities (`utilities.md`)](./utilities.md) — `OfflineAlert`, `ModalPurger`, `FormatNumber`, `ClickDelegateContainer`, `DownloadTrigger`, `Portal`, `ChakraLocaleProvider`, `DebugMenu`.

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
