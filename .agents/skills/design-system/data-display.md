---
name: design-system-data-display
description: "Guidelines and conventions for DataList Table patterns, DataViewTable, BatchActions, ItemActions, and Pagination."
---

# Design System Data Display Components

Located in `@/design-system/components/data-display/ui/`.

---

## 1. DataList Table Pattern

### 🔴 Critical Rules:
1. **Single `useMemo` with implicit return**:
   ```tsx
   const dataList = useMemo(() => ({
     headers,
     items,
     batchActions,
     itemActions,
   }), [deps]);
   ```
2. **Dilarang memisahkan `batchActions` atau `itemActions` ke `useMemo` terpisah.**
3. **Dummy data**: Hanya gunakan hardcoded primitive values saja — jangan ada `reduce`/`map`/kalkulasi dinamis pada dummy data.
4. **Loading States**:
   - `isLoading`: Render `Skeleton` full width fixed height.
   - `isFetching`: Tabel tetap tampil + subtle loading indicator (jangan replace tabel dengan skeleton).

---

## 2. DataViewTable (`data-view-table.tsx`)

Core table component supporting selection checkboxes, sorting, and row action triggers.

### Usage Example:
```tsx
import { DataViewTable } from "@/design-system/components/data-display/ui/data-view-table";

<DataViewTable
  headers={dataList.headers}
  items={dataList.items}
  selectedIds={selectedIds}
  onSelectChange={setSelectedIds}
  itemActions={dataList.itemActions}
/>
```
