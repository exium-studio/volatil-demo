// src/design-system/components/data-display/hooks/use-data-list-selection.ts

import type { FormattedListItem } from "@/design-system/components/data-display/types/data-list-table.type";
import { useState } from "react";

export function useDataListSelection(formattedListItems: FormattedListItem[]) {
  const [isAllItemsSelected, setAllItemsSelected] = useState(false);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<FormattedListItem[]>([]);

  function selectAllItems(isChecked: boolean) {
    setAllItemsSelected(!isAllItemsSelected);
    if (!isChecked) {
      setSelectedItemIds(formattedListItems.map((item) => item.id));
      setSelectedItems(formattedListItems);
    } else {
      setSelectedItemIds([]);
      setSelectedItems([]);
    }
  }

  function clearSelectedItems() {
    setAllItemsSelected(false);
    setSelectedItemIds([]);
    setSelectedItems([]);
  }

  function toggleItemSelection(item: FormattedListItem) {
    setSelectedItemIds((prev) => {
      const isSelected = prev.includes(item.id);

      if (isSelected) {
        setAllItemsSelected(false);
        return prev.filter((id) => id !== item.id);
      }

      const next = [...prev, item.id];
      if (formattedListItems.length === next.length) setAllItemsSelected(true);
      return next;
    });

    setSelectedItems((prev) => {
      const isSelected = prev.some((selected) => selected.id === item.id);

      if (isSelected) {
        return prev.filter((selected) => selected.id !== item.id);
      }

      return [...prev, item];
    });
  }

  return {
    isAllItemsSelected,
    selectedItemIds,
    selectedItems,
    selectAllItems,
    clearSelectedItems,
    toggleItemSelection,
  };
}
