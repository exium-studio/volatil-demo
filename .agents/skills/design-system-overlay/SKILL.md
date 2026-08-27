---
name: design-system-overlay
description: "Guidelines, state conventions, and modalKey hierarchical routing patterns for Modal, Dialog, Drawer, and FocusSelect overlays using usePopModal."
---

# Design System Overlay (Modal / Dialog / Drawer / FocusSelect)

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

## 3. Component Structure Guidelines

### Overlay Root & Trigger

- Accept an optional `modalKey` prop with a **default that includes the unique item ID**:

```tsx
export type EditModalTriggerProps = {
  modalKey?: string;
  item: DataItem;
  children?: ReactNode;
};

export const EditModalTrigger = (props: EditModalTriggerProps) => {
  const {
    modalKey: customModalKey = `item-edit-${props.item.id}`,
    item,
    children,
  } = props;

  const { modalKey, isOpen, open, close } = usePopModal({
    modalKey: customModalKey,
  });

  return (
    <Modal.Root
      modalKey={modalKey}
      opened={isOpen}
      open={open}
      close={close}
      size={"md"}
    >
      <Modal.Trigger>{children}</Modal.Trigger>
      <EditModalContent modalKey={modalKey} item={item} close={close} />
    </Modal.Root>
  );
};
```

### Passing Unique `modalKey` Down to Content & Child Selects

```tsx
type EditModalContentProps = {
  modalKey: string;
  item: DataItem;
  close: () => void;
};

const EditModalContent = (props: EditModalContentProps) => {
  const { modalKey, item, close } = props;

  return (
    <Modal.Content>
      <Modal.Header>
        <Modal.CloseButton />
        <Modal.Title>{"Ubah Data"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Fieldset>
          <Field label={"Basis Spasial"}>
            <SpatialBasisSelect
              modalKey={`${modalKey}.spatial-basis`}
              value={spatialBasis}
              onValueChange={setSpatialBasis}
              w={"full"}
            />
          </Field>
        </Fieldset>
      </Modal.Body>
    </Modal.Content>
  );
};
```

---

## 4. Checklist for Code Reviews & Edits

- [ ] Is every modalKey unique per screen/row (incorporating `item.id` for table rows)?
- [ ] Are all select/dropdown filters inside overlays configured with `modalKey={`${parentModalKey}.${selectSubKey}`} `?
- [ ] Are all forms wrapped in `<Fieldset>` with `<Field label={"..."}>`?
- [ ] Are state values initialized without `useEffect` setters?
- [ ] Is `pnpm verify` run with 0 errors?
