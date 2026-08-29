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
          <Field label={"Basis IGT"}>
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

## 4. The Trigger Component Pattern (Mandatory for All Overlays)

### 🔴 Critical Rule: Every Modal/Dialog/Drawer MUST Be Built as a `*Trigger` Component

Trigger components act as modular containers that encapsulate overlay logic (`usePopModal`, `useMountTimeout`, and modal content), while delegating the trigger visual elements (`children`) to the parent caller:

1. **Naming Convention**: Suffix the component with `Trigger` (e.g. `TransactionDetailTrigger`, `MitraCartExpiredBatchesTrigger`, `EntityEditTrigger`).
2. **Prop Interface**: Always accept `modalKey?: string`, optional entity data, and `children?: ReactNode` (or `children: ReactNode` when caller provides the visual button/action).
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

## 5. `itemActions` Modal Triggers in `DataViewTable`

When configuring modal triggers inside `itemActions` of `DataViewTable`:

1. **Always pass explicit unique `modalKey` to the trigger component**:
   ```tsx
   modal: {
     triggerComponent: (item: EntityItem) => (
       <EntityEditTrigger
         modalKey={`entity-edit-${item.id}`}
         item={item}
       />
     ),
   }
   ```
2. **Prevent double trigger rendering between Row button and Ellipsis Menu**:
   - `DataViewTable` renders action buttons in both the **spread row column** (`DataViewSpreadActions`) and the **sticky ellipsis dropdown menu** (`DataListItemActionsTrigger`).
   - If an action has a modal trigger and is displayed in the row, set `showInRow: true` and `showInMenu: false` (or vice versa) to prevent two modal trigger wrapper instances listening to the same `modalKey` simultaneously in the DOM tree.

---

## 6. Checklist for Code Reviews & Edits

- [ ] Is every modal/overlay built using the **Trigger Pattern** (`*Trigger` suffix with `modalKey` and optional `children` prop)?
- [ ] Is every modalKey unique per screen/row (incorporating `item.id` for table rows)?
- [ ] In `DataViewTable` itemActions with modals, is explicit `modalKey={`...-${item.id}`}` provided and `showInMenu: false` set when `showInRow: true`?
- [ ] Are all select/dropdown filters inside overlays configured with `modalKey={`${parentModalKey}.${selectSubKey}`}`?
- [ ] Are all forms wrapped in `<Fieldset>` with `<Field label={"..."}>`?
- [ ] Are state values initialized without `useEffect` setters?
- [ ] Is `pnpm verify` run with 0 errors?
