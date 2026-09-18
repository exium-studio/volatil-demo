---
name: design-system-data-display
description: "Guidelines and conventions for DataList Table patterns, DataViewTable, BatchActions, ItemActions, and Pagination."
---

# Design System Data Display Components

Located in `@/design-system/components/data-display/ui/`.

---

## 1. DataList Table Pattern (Architecture & Rules)

### 🔴 Critical Rules Mutlak:
1. **Single `useMemo` dengan implicit return**:
   ```tsx
   const dataList = useMemo(() => ({
     headers: [...],
     items: [...],
     batchActions: [...],
     itemActions: [...],
   }), [data, selectedIds, preferredTimezone]);
   ```
2. **Dilarang memisahkan `batchActions` atau `itemActions` ke `useMemo` terpisah.**
3. **Dummy data**: Hanya gunakan hardcoded primitive values saja — jangan ada `reduce`/`map`/kalkulasi dinamis pada dummy data.
4. **Loading States**:
   - `isLoading` (initial load): Render `Skeleton` full width dengan tinggi tetap (misal `h={"280px"}`).
   - `isFetching` (background refetch): Tabel tetap tampil penuh + render subtle loading indicator di header atau tombol refresh. Jangan replace tabel dengan skeleton saat refetch!

---

## 2. Complete DataList Blueprint Example

```tsx
import { DataViewTable } from "@/design-system/components/data-display/ui/data-view-table";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { StateNoData } from "@/design-system/components/feedback/ui/state.no-data";
import { isEmptyArray } from "@/shared/utils/data/array";
import { useMemo, useState } from "react";

export const UserManagementDataView = () => {
  // Queries
  const { data: users, isLoading, isFetching } = useUsersQuery();

  // States
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Derived Values (Single useMemo pattern)
  const dataList = useMemo(() => {
    const headers = [
      { key: "name", label: "Nama Lengkap", sortable: true },
      { key: "email", label: "Email" },
      { key: "role", label: "Peran" },
      { key: "status", label: "Status" },
    ];

    const items = (users ?? []).map((u) => ({
      id: u.id,
      name: u.fullName,
      email: u.email,
      role: u.roleName,
      status: u.isActive ? "Aktif" : "Nonaktif",
    }));

    const batchActions = [
      {
        key: "bulk-delete",
        label: "Hapus Terpilih",
        colorPalette: "red",
        onClick: (ids: string[]) => handleBulkDelete(ids),
      },
    ];

    const itemActions = [
      {
        key: "edit",
        label: "Edit Pengguna",
        onClick: (item: any) => handleOpenEdit(item.id),
      },
    ];

    return { headers, items, batchActions, itemActions };
  }, [users]);

  // Loading Initial
  if (isLoading) {
    return <Skeleton h={"320px"} rounded={"md"} w={"full"} />;
  }

  // Empty State
  if (isEmptyArray(dataList.items)) {
    return (
      <StateNoData
        title={"Tidak Ada Pengguna"}
        description={"Belum ada data pengguna yang terdaftar pada sistem."}
      />
    );
  }

  return (
    <DataViewTable
      headers={dataList.headers}
      items={dataList.items}
      selectedIds={selectedIds}
      onSelectChange={setSelectedIds}
      batchActions={dataList.batchActions}
      itemActions={dataList.itemActions}
      isFetching={isFetching}
    />
  );
};
```
