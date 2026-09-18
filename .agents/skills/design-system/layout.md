---
name: exium-layout
description: "Guidelines, philosophy, and exact API reference for Exium Layout components: Box, Circle, Center, AbsoluteCenter, HStack, VStack, Spacer, Grid, GridItem, SimpleGrid, Group, Float, Splitter, Separator, AspectRatio, VScrollContainer, HScrollContainer, ScrollButton, ActionHeaderScrollContainer, Container (Root, Header, Body), AppPageContainer, PageContainer, AppContentContainer, ConstrainedContainer, ClickableContainer, VMaskedContainer, HMaskedContainer, and Card."
---

# Exium Layout Components & Philosophy

Located in `@/design-system/components/layout/ui/`.

---

## ⚠️ Filosofi & Aturan Kritis Exium Layout

> [!IMPORTANT]
> **Exium TIDAK mengikuti default Chakra UI v3 untuk layout stacks!**
>
> 1. **`HStack` dan `VStack` Default**:
>    - `align={"stretch"}` (Bukan `center` seperti bawaan Chakra)
>    - `gap={0}` (Bukan default spacing Chakra)
>    - Jika butuh alignment atau spacing lain, tentukan secara eksplisit: `align={"center"}`, `gap={"md"}` / `gap={2}` dsb.
> 2. **`Separator` Default**:
>    - `borderColor={"an2"}` sudah built-in.
> 3. **`ConstrainedContainer`**:
>    - Secara default sinkron dengan `layout.maxW` dari `useLayoutStore` (`useStoreMaxW={true}`, fallback `"720px"`), `mx={"auto"}`, `w={"full"}`.
> 4. **JSX Props Syntax**:
>    - Wajib menggunakan kurung kurawal untuk semua prop values: `gap={0}`, `align={"stretch"}`, `w={"full"}` (tidak boleh bare string).

---

## 1. Stacks & Flex (`stack.tsx` / `flex-box.tsx`)

Komponen flexbox stack utama dengan custom defaults: `align="stretch"` dan `gap={0}`.

- `VStack`: Vertical flex column (`flexDirection="column"`, `alignItems="stretch"`, `gap=0`).
- `HStack`: Horizontal flex row (`flexDirection="row"`, `alignItems="stretch"`, `gap=0`).
- `Spacer`: Flex grow spacer (`flex="1"` / `justifyContent="space-between"` helper).

```tsx
import {
  HStack,
  VStack,
  Spacer,
} from "@/design-system/components/layout/ui/flex-box";
// Atau import dari "@/design-system/components/layout/ui/stack"

<VStack w={"full"} gap={"md"}>
  <HStack justify={"space-between"} align={"center"} px={"md"}>
    <Heading size={"sm"}>{"Daftar Permohonan"}</Heading>
    <Spacer />
    <Button primary size={"sm"}>
      {"Tambah Data"}
    </Button>
  </HStack>
</VStack>;
```

---

## 2. Box & Center Primitives (`box.tsx`, `center.tsx`)

- `Box`: Fundamental primitive container (`forwardRef` HTML `div`).
- `Circle`: Centered circular element (`rounded="full"`, flex center).
- `Center`: Centered flexbox container (`display="flex"`, `alignItems="center"`, `justifyContent="center"`).
- `AbsoluteCenter`: Absolutely positioned center helper (`position="absolute"`, `translate="-50% -50%"`).

```tsx
import { Box, Circle } from "@/design-system/components/layout/ui/box";
import {
  Center,
  AbsoluteCenter,
} from "@/design-system/components/layout/ui/center";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { CheckIcon } from "lucide-react";

<Circle size={"40px"} bg={"brand.subtle"} color={"brand.fg"}>
  <AppIcon icon={CheckIcon} size={"md"} />
</Circle>;
```

---

## 3. Grid & SimpleGrid (`grid.tsx`)

CSS Grid layout primitives.

- `Grid`: Raw grid container.
- `GridItem`: Grid cell wrapper (`colSpan`, `rowSpan`).
- `SimpleGrid`: Responsive auto-column grid.

```tsx
import {
  SimpleGrid,
  Grid,
  GridItem,
} from "@/design-system/components/layout/ui/grid";

<SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={"md"} w={"full"}>
  <Card.Root>{/* Item 1 */}</Card.Root>
  <Card.Root>{/* Item 2 */}</Card.Root>
  <Card.Root>{/* Item 3 */}</Card.Root>
</SimpleGrid>;
```

---

## 4. Container System (`container.tsx`, `page-container.tsx`, `constrained-container.tsx`)

### A. Compound `Container` (`container.tsx`)

Struktur container modular dengan support `withContext` (mengukur dimensi dengan `useRefDimension` & deteksi `isSmContainer < 720px`).

- `Container.Root`: Wrapper stack (`withContext?: boolean`).
- `Container.Header`: Header bar (`minH="headerH"`, `px="md"`).
- `Container.Body`: Card/Content container (`bg="bg.body"`, `rounded=theme.radii.container`, `flex={1}`).
- `useContainerContext()`: Mengakses `{ dimension, isValidDimension, isSmContainer }`.

```tsx
import {
  Container,
  useContainerContext,
} from "@/design-system/components/layout/ui/container";

<Container.Root withContext={true}>
  <Container.Header>
    <Heading size={"md"}>{"Judul Halaman"}</Heading>
  </Container.Header>
  <Container.Body p={"md"}>{/* Body content */}</Container.Body>
</Container.Root>;
```

### B. Page Containers (`page-container.tsx`)

- `PageContainer`: `VStack` dengan `minH={"100dvh"}`, `overflowY={"auto"}`, `pos={"relative"}`.
- `AppPageContainer`: `VStack` fixed viewport height `h={"100dvh"}`, `overflowY={"auto"}`, `pos={"relative"}`.
- `AppContentContainer`: `VStack` untuk area konten di bawah header (`h="calc(100% - headerH)"`, `p="md"`, `gap="sm"`).

```tsx
import {
  AppPageContainer,
  AppContentContainer,
} from "@/design-system/components/layout/ui/page-container";

<AppPageContainer>
  <AppHeader />
  <AppContentContainer>{/* Konten Halaman */}</AppContentContainer>
</AppPageContainer>;
```

### C. Constrained Container (`constrained-container.tsx`)

Membatasi lebar maksimal layout sesuai preferensi store / responsive max width.

- Default `useStoreMaxW={true}` -> membaca `layout.maxW` dari `useLayoutStore` (default fallback `"720px"`), `mx={"auto"}`, `w={"full"}`.

```tsx
import { ConstrainedContainer } from "@/design-system/components/layout/ui/constrained-container";

<ConstrainedContainer py={"lg"}>
  {/* Form / Centered Content */}
</ConstrainedContainer>;
```

---

## 5. Scroll Containers (`scroll-container.tsx`, `action-header-scroll-container.tsx`)

### A. `VScrollContainer` & `HScrollContainer`

Container scroll interaktif dengan observasi otomatis, indikator border dinamis saat di-scroll, navigasi scroll buttons, dan wheel direction assist.

- **Props `VScrollContainer`**:
  - `borderColor`: default `"an1"`
  - `showTopBorderOnScroll`: default `true`
  - `showBottomBorderOnScroll`: default `false`
  - `showScrollButtons`: default `false`
  - `enableScroll`: default `false` (mengatur `overscrollBehavior="contain"`)
- **Props `HScrollContainer`**:
  - `showLeftBorderOnScroll`: default `false`
  - `showRightBorderOnScroll`: default `true`
  - `showScrollButtons`: default `false`
  - `enableScroll`: default `false`
- `ScrollButton`: Tombol navigasi floating scroll (`direction="up" | "down" | "left" | "right"`).

```tsx
import {
  VScrollContainer,
  HScrollContainer,
} from "@/design-system/components/layout/ui/scroll-container";

<VScrollContainer h={"400px"} showScrollButtons={true}>
  {/* List Items */}
</VScrollContainer>;
```

### B. `ActionHeaderScrollContainer` (`action-header-scroll-container.tsx`)

Horizontal scroll container siap pakai untuk action header / toolbar filter buttons.

- Default props: `showScrollButtons={true}`, `align={"center"}`, `justify={"start"}`, `gap={"sm"}`, `w={"full"}`, `p={"md"}`, `bg={"bg.body"}`.

```tsx
import { ActionHeaderScrollContainer } from "@/design-system/components/layout/ui/action-header-scroll-container";
import { Button } from "@/design-system/components/button/ui/button";

<ActionHeaderScrollContainer>
  <Button size={"sm"}>{"Semua"}</Button>
  <Button size={"sm"} variant={"outline"}>
    {"Aktif"}
  </Button>
  <Button size={"sm"} variant={"outline"}>
    {"Menunggu"}
  </Button>
  <Button size={"sm"} variant={"outline"}>
    {"Selesai"}
  </Button>
</ActionHeaderScrollContainer>;
```

---

## 6. Masked Container (`masked-container.tsx`)

Scroll container dengan alpha gradient mask di tepi atas/bawah atau kiri/kanan untuk efek smooth fading edge pada konten panjang.

- `VMaskedContainer`: Vertical fade masking (`maskingTop="8px"`, `maskingBottom="8px"`).
- `HMaskedContainer`: Horizontal fade masking (`maskingLeft="8px"`, `maskingRight="8px"`).

```tsx
import { VMaskedContainer } from "@/design-system/components/layout/ui/masked-container";

<VMaskedContainer
  maxH={"240px"}
  overflowY={"auto"}
  maskingTop={"12px"}
  maskingBottom={"12px"}
>
  {/* Long list with elegant fade out edges */}
</VMaskedContainer>;
```

---

## 7. Splitter (`splitter.tsx`)

Resizable multi-panel split view berbasis Zag / Chakra Machine. Dilengkapi dengan tooltip helper otomatis dan drag handle grip icons (`GripVertical` / `GripHorizontal`).

- `Splitter.Root`: Container splitter (`keyboardResizeBy={1}`).
- `Splitter.Panel`: Panel fleksibel (`display="flex"`, `flexDir="column"`).
- `Splitter.ResizeTrigger`: Garis handle drag (`transparentTrigger?: boolean`, double-click reset).
- `Splitter.ResizeTriggerIndicator`: Visual handle hover badge.
- `Splitter.ResizeTriggerSeparator`: Divider line.

```tsx
import { Splitter } from "@/design-system/components/layout/ui/splitter";

<Splitter.Root defaultSize={[30, 70]} orientation={"horizontal"}>
  <Splitter.Panel id={"sidebar"} minSize={20} maxSize={50}>
    {/* Panel 1 */}
  </Splitter.Panel>
  <Splitter.ResizeTrigger id={"sidebar:content"} />
  <Splitter.Panel id={"content"}>{/* Panel 2 */}</Splitter.Panel>
</Splitter.Root>;
```

---

## 8. Clickable Container (`clickable-container.tsx`)

Container wrapper interaktif untuk card atau baris klik yang otomatis meneruskan klik ke target input/ref (seperti checkbox/radio) atau bertindak sebagai label yang accessible.

- Props: `targetRef?: RefObject<HTMLElement>`, `asLabel?: boolean` (default `true`).

```tsx
import { ClickableContainer } from "@/design-system/components/layout/ui/clickable-container";

<ClickableContainer asLabel={true}>
  <Checkbox />
  <Text>{"Pilih opsi ini"}</Text>
</ClickableContainer>;
```

---

## 9. Utility Layouts (`group.tsx`, `float.tsx`, `separator.tsx`, `aspect-ratio.tsx`, `card.tsx`)

- **`Group`**: Menggabungkan beberapa button / input berdampingan tanpa gap (`attached={true}`).
- **`Float`**: Absolute floating indicator / badge (`placement="top-end"`, `offset="2"`).
- **`Separator`**: Garis pemisah dengan default `borderColor="an2"`.
- **`AspectRatio`**: Mempertahankan aspect ratio konten (misal `ratio={16 / 9}`).
- **`Card`**: Alias `ChakraCard` untuk container card data (`Card.Root`, `Card.Header`, `Card.Body`, `Card.Footer`).

```tsx
import { Group } from "@/design-system/components/layout/ui/group";
import { Float } from "@/design-system/components/layout/ui/float";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { AspectRatio } from "@/design-system/components/layout/ui/aspect-ratio";
import { Card } from "@/design-system/components/layout/ui/card";
import { Button } from "@/design-system/components/button/ui/button";

<Group attached={true}>
  <Button variant={"outline"}>{"Kiri"}</Button>
  <Button variant={"outline"}>{"Kanan"}</Button>
</Group>;

<Separator my={"md"} />;
```
