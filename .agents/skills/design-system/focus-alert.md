---
name: exium-focus-alert
description: "Guidelines and API reference for Exium FocusAlert modal alert & announcement system."
---

# Exium FocusAlert System

Located in `@/design-system/components/focus-alert/`.

---

## 1. Overview

`FocusAlert` is a high-priority, center-popped modal alert system designed for critical milestones, celebratory feedbacks, destructive warnings, or offline notices. It utilizes smooth overshoot animation (`animation: "scale-up-overshoot"`, `animationDuration: "slower"`) with centered focus.

---

## 2. Components & Utilities

### 1. `FocusAlertItem` (`focus-alert.tsx`)
Declarative modal alert component bound to a `modalKey` (via URL search param `activeModalKey`).

### 2. `FocusAlertTrigger` (`focus-alert.tsx`)
Compound trigger wrapping interactive children to open the `FocusAlert`.

### 3. `focusAlert()` (`focus-alert.ts`)
Programmatic imperative trigger for event handlers, mutations, or query callbacks.

### 4. `FocusAlerter` (`focus-alerter.tsx`)
Root store subscriber component (mounted in `__root.tsx`).

### 5. `FocusAlertView` (`focus-alert.tsx`)
Sliced standalone visual graphic component (pulse ripple circle, icon/emoji, title, description) reusable within custom modals, drawers, or dialog bodies without modal wrappers.

---

## 3. Props Reference (`FocusAlertItemProps` / `FocusAlertTriggerProps`)

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `modalKey` | `string` | Context / `""` | Unique URL parameter key for routing & nesting |
| `variant` | `FocusAlertVariant` | `"neutral"` | Semantic (`"success"`, `"error"`, `"warning"`, `"info"`, `"help"`, `"neutral"`, `"celebrate"`) or Emote variant |
| `colorPalette` | `string` | From variant | Custom Chakra color palette override |
| `icon` | `ComponentType \| ReactNode` | `undefined` | **Priority 1**: Custom Lucide/Tabler icon or ReactNode |
| `emoji` | `EmojiVariant` | `undefined` | **Priority 2**: Custom expressive SVG emoji (e.g. `"happy"`, `"thumbUp"`) |
| `title` | `string` | `undefined` | Alert headline heading |
| `description` | `string` | `undefined` | Secondary descriptive text |
| `doneLabel` | `string` | `t["action.finish"]()` | Primary confirmation button label (*"Selesai"*, *"Tutup"*, etc.) |
| `cancelLabel` | `string` | `t["action.cancel"]()` | Secondary cancel button label (*"Batal"*). If provided, shows two buttons |
| `doneButtonProps` | `Partial<ButtonProps>` | `undefined` | Props for primary action button |
| `cancelButtonProps` | `Partial<ButtonProps>` | `undefined` | Props for cancel button |
| `onDone` | `() => void` | `undefined` | Callback invoked before modal close when primary button clicked |
| `onCancel` | `() => void` | `undefined` | Callback invoked before modal close when cancel button clicked |

---

## 4. Icon & Emoji Priority Protocol

When both `icon` and `emoji` are supplied:
1. **`icon`** takes highest priority.
2. If `icon` is absent and **`emoji`** is provided, the SVG `<Emoji variant={emoji} />` is rendered.
3. If neither is provided, fallback to the variant's default icon.

---

## 5. Usage Examples

### A. Declarative in Page/Component (`FocusAlertItem`):
```tsx
import { FocusAlertItem } from "@/design-system/components/focus-alert/ui/focus-alert";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { t } from "@/shared/libs/i18n";
import { WifiOffIcon } from "lucide-react";

export const OfflineAlert = () => {
  const { modalKey, close } = usePopModal({
    modalKey: "offlineAlert",
  });

  return (
    <FocusAlertItem
      modalKey={modalKey}
      variant={"warning"}
      icon={WifiOffIcon}
      title={t["offline_alert.title"]()}
      description={t["offline_alert.description"]()}
      doneLabel={t["action.close"]()}
      onDone={close}
    />
  );
};
```

### B. Two Actions (Confirm + Cancel):
```tsx
<FocusAlertItem
  modalKey={"delete-warning"}
  variant={"danger"}
  title={"Hapus Lapisan Data?"}
  description={"Lapisan data spasial ini akan dihapus secara permanen dari server."}
  doneLabel={t["action.delete"]()}
  cancelLabel={t["action.cancel"]()}
  doneButtonProps={{ colorPalette: "red" }}
  onDone={() => deleteLayerMutation.mutate(layerId)}
/>
```

### C. Imperative Trigger (`focusAlert()` in Mutations/Handlers):
```tsx
import { focusAlert } from "@/design-system/components/focus-alert/utils/focus-alert";
import { FocusAlertItem } from "@/design-system/components/focus-alert/ui/focus-alert";

const handlePaymentSuccess = () => {
  focusAlert("payment-success", () => (
    <FocusAlertItem
      variant={"celebrate"}
      emoji={"thumbUp"}
      title={"Pembayaran Berhasil!"}
      description={"Pesanan Anda sedang diproses oleh GeoServer internal."}
      doneLabel={"Lihat Riwayat"}
      onDone={() => {
        void navigate({ to: "/mitra/transaction-history" });
      }}
    />
  ));
};
```
