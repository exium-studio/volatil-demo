# Design System Reference Guide

Dokumen ini berisi panduan lengkap komponen, props, hooks, konstanta, dan _code style pattern_ yang berlaku di dalam `@/design-system/`.

---

## 1. Design Tokens & Styling Constants

### Imports: `@/design-system/constants/styles`

- `PADDING_MD`, `PADDING_SM`
- `SPACING_MD`, `SPACING_SM`

### Theme Store: `@/design-system/stores/use-theme-store`

```tsx
import { useThemeStore } from "@/design-system/stores/use-theme-store";

const { theme } = useThemeStore();
// Properti: theme.radii.container, theme.colors, dll.
```

---

## 2. Code Style & Rules Mutlak

- **Wajib Curly Brackets**: Semua nilai prop (tipe apapun) WAJIB dibungkus curly bracket — tidak boleh bare string props (`value={"foo"}` bukan `value="foo"`).
- **Import Alias**: Import di dalam `src/` WAJIB menggunakan alias `@/`.
- **Komentar Section**: Wajib menambahkan komentar section di komponen (`// Contexts`, `// States`, `// Derived Values`, `// Hooks (Queries & Mutations)`, dll).
- **Default Props**: DILARANG menuliskan prop yang nilainya sama dengan default komponen (misal: `VStack` default `align` adalah `stretch`, tidak perlu ditulis `align={"stretch"}`).

---

## 3. Typography Components

### Imports: `@/design-system/components/typography/ui/*`

#### Typography Size Rule (WAJIB)
- **Default Font Size**: Wajib gunakan ukuran `md` (default komponen) untuk teks biasa. JANGAN tulis `fontSize={"md"}` karena itu sudah default.
- **Dilarang Over-Styling `sm`/`xs`**: Gak perlu pakai `fontSize={"sm"}` atau `fontSize={"xs"}` untuk hal biasa. Ukuran `sm` hanya jika benar-benar diperlukan untuk hierarki tertentu, dan `xs` sangat jarang dipakai.

#### `P` (Paragraph / Text)

- **Props**: Menerima seluruh Chakra `TextProps`.
- **Penggunaan**:

```tsx
import { P } from "@/design-system/components/typography/ui/p";

<P color={"fg.subtle"} fontWeight={"medium"}>
  {"Teks Contoh"}
</P>;
```

#### `Badge`

- **Props**: `BadgeProps` (`colorPalette`, `variant`: `"subtle"` | `"outline"` | `"solid"`)
- **Aturan Ukuran Badge (WAJIB)**:
  - DILARANG menggunakan `size={"xs"}` atau `size={"sm"}` pada `Badge`.
  - Gunakan ukuran default dari `Badge` tanpa override size kecil.
- **Penggunaan**:

```tsx
import { Badge } from "@/design-system/components/typography/ui/badge";

<Badge colorPalette={"blue"} variant={"subtle"}>
  {"Bidang"}
</Badge>;
```

---

## 4. Layout Components

### Imports: `@/design-system/components/layout/ui/*`

#### `Box`, `HStack`, `VStack`, `Flex`, `Separator`, `Grid`, `Card`

```tsx
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Box } from "@/design-system/components/layout/ui/box";
import { Separator } from "@/design-system/components/layout/ui/separator";

<VStack flex={1} gap={SPACING_MD}>
  <HStack justify={"space-between"}>
    <Box>{"Kiri"}</Box>
  </HStack>
  <Separator borderColor={"bg.canvas"} />
</VStack>;
```

#### `Container` & `useContainerContext()`

```tsx
import {
  Container,
  useContainerContext,
} from "@/design-system/components/layout/ui/container";

// Parent Page
<Container.Root flex={1} overflowY={"auto"} withContext={true}>
  <ChildComponent />
</Container.Root>;

// Child Component
const ChildComponent = () => {
  const { isSmContainer } = useContainerContext();
  return <Container.Body flex={1}>...</Container.Body>;
};
```

---

## 5. Buttons & Inputs

### Imports: `@/design-system/components/button/ui/*` & `@/design-system/components/input/ui/*`

#### `Button` & `IconButton`

```tsx
import { Button, IconButton } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { IconTrash } from "@tabler/icons-react";

<Button primary size={"md"} onClick={handleAction}>
  {"Simpan"}
</Button>

<Button variant={"outline"} colorPalette={"red"} size={"xs"}>
  <AppIcon icon={IconTrash} />
  {"Hapus"}
</Button>
```

#### `SearchInput`

```tsx
import { SearchInput } from "@/design-system/components/input/ui/search-input";

<SearchInput
  value={searchValue}
  onChange={(e) => onSearchChange(e.target.value)}
  placeholder={"Cari data..."}
/>;
```

---

## 6. DataList Table Pattern (MUTLAK)

Semua komponen DataList/Table **WAJIB** menggunakan 1 object literal `const dataList = useMemo(() => ({ headers, items, batchActions, itemActions }), [deps])` dengan **implicit return** (tanpa kurung kurawal block body `{}` & tanpa klausa `return`):

```tsx
import type {
  DataListBatchActionsGenerator,
  DataListItemActionsGenerator,
} from "@/design-system/components/data-display/types/data-list.type";
import type { FormattedListItem } from "@/design-system/components/data-display/types/data-list-table.type";
import { DataListTable } from "@/design-system/components/data-display/ui/data-list-table";

const dataList = useMemo(
  () => ({
    headers: [
      { th: "ID Bidang", sortable: true },
      { th: "Tema IGT-PR" },
      { th: "Basis IGT-PR", sortable: true },
      { th: "Deskripsi", headerCellProps: { minW: "200px" } },
    ],

    items: itemsData.map((item) => ({
      id: String(item.id),
      data: item,
      columns: [
        {
          value: item.id,
          td: <P fontSize={"sm"}>{item.id}</P>,
          align: "start" as const,
        },
        {
          value: item.basis,
          td: <Badge colorPalette={"blue"}>{item.basis}</Badge>,
          align: "center" as const,
        },
      ],
    })),

    batchActions: [
      ({ selectedItemIds, clearSelectedItems }) => (
        <Button
          key={"remove-selected"}
          variant={"outline"}
          colorPalette={"red"}
          size={"xs"}
          onClick={() => {
            onRemoveItems?.(selectedItemIds);
            clearSelectedItems();
          }}
        >
          <AppIcon icon={Trash2Icon} />
          {"Hapus Terpilih"} ({selectedItemIds.length})
        </Button>
      ),
    ] as DataListBatchActionsGenerator[],

    itemActions: [
      (item) => (
        <Menu.Item key={"action"} value={"action"}>
          {"Aksi"}
        </Menu.Item>
      ),
    ] as DataListItemActionsGenerator[],
  }),
  [itemsData, onRemoveItems],
);

return (
  <DataListTable.Root
    headers={dataList.headers}
    items={dataList.items}
    batchActions={dataList.batchActions}
    itemActions={dataList.itemActions}
    withNumbering={false}
    canBatchSelect={true}
    selectedItems={selectedItems}
    onSelectedItemChange={onSelectedItemChange}
  >
    <DataListTable.Header />
    <DataListTable.Body />
  </DataListTable.Root>
);
```

---

## 7. Feedback & Loading States

- **`isLoading` (fetch pertama, belum ada data)**: Renders `Skeleton` (full-width, fixed height block).
- **`isFetching` (refetch berikutnya / search / pagination)**: Table tetap tampil dengan overlay loader (`bg={"bg.canvas/50"}`).

```tsx
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { Loader } from "@/design-system/components/feedback/ui/loader";

{
  isLoading ? (
    <Skeleton />
  ) : (
    <Box w={"full"} position={"relative"}>
      <DataListTable.Root headers={dataList.headers} items={dataList.items} />
      {isFetching && (
        <Box
          position={"absolute"}
          inset={0}
          bg={"bg.canvas/50"}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          zIndex={10}
        >
          <Loader size={"md"} />
        </Box>
      )}
    </Box>
  );
}
```

---

## 8. Icons & Shell Components

- Icons menggunakan **Lucide Icons** sebagai pilihan utama dan **Tabler Icons** sebagai _fallback_ via `<AppIcon icon={IconComponent} />`.
- `AppNavTitle`: Judul navigasi header.

```tsx
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { AppNavTitle } from "@/design-system/components/shell/ui/app-nav-title";
import { APP_NAVS_MAP } from "@/shared/constants/app.navs";
import { IconMapPin } from "@tabler/icons-react";

<AppNavTitle navsMap={APP_NAVS_MAP} />
<AppIcon icon={IconMapPin} boxSize={5} />
```
