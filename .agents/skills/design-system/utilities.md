---
name: exium-utilities
description: "Guidelines and API reference for Exium Utility components: OfflineAlert, ModalPurger, FormatNumber, ClickDelegateContainer, DownloadTrigger, Portal, and ChakraLocaleProvider."
---

# Exium Utility Components

Located in `@/design-system/components/utilities/ui/`.

---

## 1. OfflineAlert (`offline-alert.tsx`)

A global network event listener that displays a center-popped `FocusAlertItem` when the browser loses internet connectivity, and triggers a success toast upon reconnect.

```tsx
import { OfflineAlert } from "@/design-system/components/utilities/ui/offline-alert";

// Mounted at root layout level in src/routes/__root.tsx
<OfflineAlert />
```

---

## 2. FormatNumber (`fornat-number.tsx`)

Utility component for internationalized currency, decimal, percentage, and unit number formatting.

```tsx
import { FormatNumber } from "@/design-system/components/utilities/ui/fornat-number";

// Currency IDR
<FormatNumber
  value={totalPrice}
  style={"currency"}
  currency={"IDR"}
  maximumFractionDigits={0}
/>

// Percentage
<FormatNumber
  value={0.854}
  style={"percent"}
  maximumFractionDigits={1}
/>
```

---

## 3. ModalPurger (`modal-purger.tsx`)

Purges orphaned modal URL search parameters (`activeModalKey`) on unhandled route navigations to ensure back button consistency.

---

## 4. ClickDelegateContainer (`click-delegate-container.tsx`)

Delegates click events from an outer card/container to an inner interactive target link/button while preserving clean accessibility.

```tsx
import { ClickDelegateContainer } from "@/design-system/components/utilities/ui/click-delegate-container";

<ClickDelegateContainer>
  <VStack>
    <Heading>{"Card Title"}</Heading>
    <a href={"/details"}>{"View More"}</a>
  </VStack>
</ClickDelegateContainer>
```

---

## 5. Portal (`portal.tsx`)

Renders children outside the DOM hierarchy (in `document.body` or specified `containerRef`).

```tsx
import { Portal } from "@/design-system/components/utilities/ui/portal";

<Portal container={portalRef} disabled={!portalled}>
  <div>{"Floating Content"}</div>
</Portal>
```

---

## 6. ChakraLocaleProvider (`chakra-locale-provider.tsx`)

Binds active Paraglide JS locale (`id` / `en`) with Chakra UI directional and calendar context.
