---
name: exium-typography
description: "Guidelines and API reference for Exium Typography components: P, ClampedP, TNum, Heading, Badge, CountBadge, Span, Kbd, Url, List, and RichTextEditor."
---

# Exium Typography Components

Located in `@/design-system/components/typography/ui/`.

---

## 1. Paragraph & Text Clamping (`p.tsx`)

- `P`: Standar elemen paragraf/teks.
- `ClampedP`: Teks yang otomatis terpotong (*line clamp*) dengan tooltip bila terpotong.
  - 🔴 **Aturan Mutlak**: DILARANG menggunakan CSS `truncate` biasa; selalu gunakan `<ClampedP lineClamp={2}>`.
- `TNum`: Typography tabular numbers (`fontVariantNumeric="tabular-nums"`) untuk angka statistik/harga agar digit sejajar secara vertikal.

### Example:
```tsx
import { P, ClampedP, TNum } from "@/design-system/components/typography/ui/p";

<P fontSize={"sm"} color={"fg.muted"}>
  {"Keterangan status permohonan data"}
</P>

<ClampedP lineClamp={2} maxW={"300px"}>
  {"Deskripsi layer yang sangat panjang ini akan dipotong rapi jika melebihi 2 baris."}
</ClampedP>

<P>
  {"Total Luas: "}<TNum>{1250.5}</TNum>{" ha"}
</P>
```

---

## 2. Heading (`heading.tsx`)

Komponen judul teks terstandarisasi.
- `size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl"`
- `fontWeight?: "normal" | "medium" | "semibold" | "bold"`

```tsx
import { Heading } from "@/design-system/components/typography/ui/heading";

<Heading size={"lg"} fontWeight={"semibold"}>
  {"Daftar Permohonan Data IGT"}
</Heading>
```

---

## 3. Badge & CountBadge (`badge.tsx`, `count-badge.tsx`)

- `Badge`: Label status (varian: `"solid"`, `"subtle"`, `"outline"`, `"surface"`).
- `CountBadge`: Badge hitungan angka notifikasi dengan batas maksimal (`max={99}`).

```tsx
import { Badge } from "@/design-system/components/typography/ui/badge";
import { CountBadge } from "@/design-system/components/typography/ui/count-badge";

<Badge variant={"subtle"} colorPalette={"green"}>
  {"Disetujui"}
</Badge>

<CountBadge count={unreadCount} max={99} colorPalette={"red"} />
```

---

## 4. Url, Span, Kbd, List (`url.tsx`, `span.tsx`, `kbd.tsx`, `list.tsx`)

- `Url`: Link teks interaktif dengan hover underline animasi.
- `Span`: Inline text wrapper.
- `Kbd`: Indikator tombol keyboard shortcut (misal `Ctrl + K`).
- `List.Root`, `List.Item`, `List.Indicator`: Standar unordered/ordered list bulleting.

```tsx
import { Url } from "@/design-system/components/typography/ui/url";
import { Kbd } from "@/design-system/components/typography/ui/kbd";

<Url href={"/docs/igt"} isExternal>
  {"Panduan Spesifikasi IGT"}
</Url>

<Kbd>{"⌘"}</Kbd> <Kbd>{"K"}</Kbd>
```

---

## 5. RichTextEditor (`rich-text-editor.tsx`)

Editor WYSIWYG TipTap dengan toolbar terintegrasi.
- Toolbar presets: `"minimal"`, `"standard"`, `"full"`

```tsx
import { RichTextEditor } from "@/design-system/components/typography/ui/rich-text-editor";

<RichTextEditor
  preset={"standard"}
  value={htmlContent}
  onChange={setHtmlContent}
  placeholder={"Tulis catatan telaah teknis..."}
/>
```
