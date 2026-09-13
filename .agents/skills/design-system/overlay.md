---
name: exium-overlay
description: "Guidelines, state conventions, and modalKey hierarchical routing patterns for Modal, Dialog, Drawer, Popover, Menu, Tooltip, ActionBar, and FocusSelect overlays using usePopModal."
---

# Exium Overlay Components (Modal / Dialog / Drawer / Popover / Menu / Tooltip / ActionBar)

Located in `@/design-system/components/overlay/ui/`.

## Core Architectural Principle

All overlays in this application are controlled by URL search parameters via `usePopModal` using the search param `activeModalKey`.
This guarantees URL synchronicity, browser back button support, and deep-linking capabilities.

---

## 1. Uniqueness of `modalKey` in Screens & Table Rows

### 🔴 Critical Rule: Every Overlay in the Same Screen/Table MUST Have a Unique `modalKey`

1. **Never use static identical `modalKey` across table items/rows.**
   - If multiple rows share `modalKey="edit-item"`, opening an edit modal on one row will match ALL rows, triggering multiple simultaneous modal mounts or state collisions.
2. **Always append the entity's unique ID to the parent/trigger `modalKey`**:
   - `modalKey={`layer-edit-${item.id}`}`
   - `modalKey={`user-status-${user.id}`}`
   - `modalKey={`order-detail-${order.id}`}`

---

## 2. The `modalKey` Hierarchical Pattern (Nested Overlays)

`usePopModal` determines if a modal is open with the following logic:

```ts
isOpen =
  activeModalKey === modalKey || activeModalKey.startsWith(modalKey + ".");
```

### 🔴 Critical Rule: Nested Overlays MUST Inherit & Extend Parent `modalKey`

When a Modal/Dialog/Drawer contains child overlays (e.g. `FocusSelect`, `SpatialBasisSelect`, `StatusSelect`, `ConfirmationTrigger`, or nested modals):

1. **The child `modalKey` MUST be prefixed with the parent's unique `modalKey` using dot notation (`${parentModalKey}.${childKey}`)**.
2. **NEVER use an isolated/standalone `modalKey` for a child inside a modal!**
   - If child uses `'spatial-basis'`, when child opens, `activeModalKey` becomes `'spatial-basis'`.
   - The parent modal checks `activeModalKey.startsWith('parentModal.')`, which evaluates to `false`.
   - Result: **The parent unmounts/closes immediately, destroying both parent and child overlays simultaneously.**

### ✅ Pattern Examples

#### Unique Top-Level / Row-Level Modal:
```tsx
const modalKey = `layer-edit-${item.id}`;
```

#### Nested Overlay / Select Inside Modal (extends parent's unique `modalKey`):
```tsx
// Inside parent modal where modalKey is "layer-edit-123"
<SpatialBasisSelect
  modalKey={`${modalKey}.spatial-basis`}
  value={spatialBasis}
  onValueChange={setSpatialBasis}
/>
```

#### Multi-level Nested Modal (e.g., Confirmation inside Edit Modal):
```tsx
<ConfirmationTrigger
  modalKey={`${modalKey}.confirm-delete`}
  title={"Konfirmasi Hapus"}
  onConfirm={handleDelete}
/>
```

---

## 3. The Trigger Component Pattern (Mandatory for All Overlays)

### 🔴 Critical Rule: Every Modal/Dialog/Drawer MUST Be Built as a `*Trigger` Component

Trigger components act as modular containers that encapsulate overlay logic (`usePopModal`, `useMountTimeout`, and modal content), while delegating the trigger visual elements (`children`) to the parent caller:

1. **Naming Convention**: Suffix the component with `Trigger` (e.g. `TransactionDetailTrigger`, `MitraCartExpiredBatchesTrigger`, `EntityEditTrigger`).
2. **Prop Interface**: Always accept `modalKey?: string`, optional entity data, and `children?: ReactNode`.
3. **Trigger Delegation**: The trigger element (e.g. `<Button>`, `<IconButton>`, or custom row) is passed from the parent caller via `{children}` and rendered inside `<Modal.Trigger>{children}</Modal.Trigger>`.
4. **Mount Animation & Lazy Mounting**:
   - Wrap the inner modal content component inside `{isMounted && <...ModalContent />}` using `useMountTimeout` so content is unmounted when closed and exits with clean animation.

### ✅ SSOT Trigger Pattern Blueprint:

```tsx
export type EntityDetailTriggerProps = {
  modalKey?: string;
  entity?: EntityItem | null;
  children?: ReactNode;
};

export const EntityDetailTrigger = (props: EntityDetailTriggerProps) => {
  const {
    modalKey: customModalKey = `entity-detail-${props.entity?.id ?? "default"}`,
    entity,
    children,
  } = props;

  // Stores & Hooks
  const { modalKey, isOpen, open, close } = usePopModal({
    modalKey: customModalKey,
  });

  const isMounted = useMountTimeout({
    isOpen,
    mountDelay: 0,
    unmountDelay: 250,
  });

  return (
    <Modal.Root
      modalKey={modalKey}
      opened={isOpen}
      open={open}
      close={close}
      size={"lg"}
    >
      <Modal.Trigger>{children}</Modal.Trigger>

      {entity && isMounted && (
        <EntityDetailModalContent
          modalKey={modalKey}
          entity={entity}
          close={close}
        />
      )}
    </Modal.Root>
  );
};
```

---

## 4. Overlay Sub-Components Overview

1. **Dialog (`dialog.tsx`) & Modal (`modal.tsx`)**: Focused modal cards for form entry and confirmation.
2. **Drawer (`drawer.tsx`)**: Slide-over sheet panel for filters and detail inspections.
3. **Popover (`popover.tsx`)**: Contextual floating cards (user profiles, pickers).
4. **Menu (`menu.tsx`)**: Dropdown context menus and action dropdowns.
5. **Tooltip (`tooltip.tsx`)**: Hover and focus descriptions.
6. **ActionBar (`action-bar.tsx`)**: Floating dock for table selection actions.
