---
name: exium-disclosure
description: "Guidelines and API reference for Exium Accordion, Tabs, Steps, Collapsible, Carousel, and Breadcrumb."
---

# Exium Disclosure Components

Located in `@/design-system/components/disclosure/ui/`.

---

## 1. Tabs (`tabs.tsx`)

Multi-panel tab navigation interface.

### Structure:
```tsx
import { Tabs } from "@/design-system/components/disclosure/ui/tabs";

<Tabs.Root defaultValue={"overview"} variant={"outline"} colorPalette={"blue"}>
  <Tabs.List>
    <Tabs.Trigger value={"overview"}>{"Ringkasan"}</Tabs.Trigger>
    <Tabs.Trigger value={"history"}>{"Riwayat Pesanan"}</Tabs.Trigger>
    <Tabs.Trigger value={"settings"}>{"Pengaturan"}</Tabs.Trigger>
  </Tabs.List>

  <Tabs.Content value={"overview"}>
    {/* Overview Content */}
  </Tabs.Content>
  <Tabs.Content value={"history"}>
    {/* History Content */}
  </Tabs.Content>
  <Tabs.Content value={"settings"}>
    {/* Settings Content */}
  </Tabs.Content>
</Tabs.Root>
```

---

## 2. Accordion (`accordion.tsx`)

Expandable stacked disclosure panels.

```tsx
import { Accordion } from "@/design-system/components/disclosure/ui/accordion";
import { Span } from "@/design-system/components/typography/ui/span";

<Accordion.Root collapsible defaultValue={["general"]}>
  <Accordion.Item value={"general"}>
    <Accordion.ItemTrigger>
      <Span flex={1}>{"Ketentuan Pembayaran PNBP"}</Span>
      <Accordion.ItemIndicator />
    </Accordion.ItemTrigger>
    <Accordion.ItemContent>
      <Accordion.ItemBody>
        {"Pembayaran PNBP wajib diselesaikan dalam 1x24 jam sebelum kode billing kedaluwarsa."}
      </Accordion.ItemBody>
    </Accordion.ItemContent>
  </Accordion.Item>
</Accordion.Root>
```

---

## 3. Steps (`steps.tsx`)

Multi-step wizard progress indicator (misal alur permohonan data IGT).

```tsx
import { Steps } from "@/design-system/components/disclosure/ui/steps";

<Steps.Root step={activeStep} count={3} colorPalette={"blue"}>
  <Steps.List>
    <Steps.Item index={0} title={"Pilih Layer IGT"} />
    <Steps.Item index={1} title={"Unggah AOI"} />
    <Steps.Item index={2} title={"Konfirmasi & Pembayaran"} />
  </Steps.List>
  <Steps.Content index={0}>{/* Step 1 */}</Steps.Content>
  <Steps.Content index={1}>{/* Step 2 */}</Steps.Content>
  <Steps.Content index={2}>{/* Step 3 */}</Steps.Content>
</Steps.Root>
```

---

## 4. Collapsible (`collapsible.tsx`)

Simple animated expand/collapse toggle for single panels or collapsible sidebar menus.

```tsx
import { Collapsible } from "@/design-system/components/disclosure/ui/collapsible";
import { Button } from "@/design-system/components/button/ui/button";

<Collapsible.Root opened={isOpen} onOpenChange={(e) => setIsOpen(e.open)}>
  <Collapsible.Trigger asChild>
    <Button variant={"ghost"}>{"Tampilkan Detail Teknis"}</Button>
  </Collapsible.Trigger>
  <Collapsible.Content>
    <div>{"Detail koordinat dan metadata layer..."}</div>
  </Collapsible.Content>
</Collapsible.Root>
```

---

## 5. Breadcrumb (`breadcrumb.tsx`)

Navigational hierarchy breadcrumbs.

```tsx
import { Breadcrumb } from "@/design-system/components/disclosure/ui/breadcrumb";

<Breadcrumb.Root>
  <Breadcrumb.List>
    <Breadcrumb.Item>
      <Breadcrumb.Link href={"/mitra/home"}>{"Beranda"}</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator />
    <Breadcrumb.Item>
      <Breadcrumb.Link href={"/mitra/data-request"}>{"Permohonan Data"}</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator />
    <Breadcrumb.Item>
      <Breadcrumb.CurrentPage>{"Detail AOI"}</Breadcrumb.CurrentPage>
    </Breadcrumb.Item>
  </Breadcrumb.List>
</Breadcrumb.Root>
```

---

## 6. Carousel (`carousel.tsx`)

Horizontal sliding gallery / media carousel.
