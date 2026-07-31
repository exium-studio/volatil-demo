// src/design-system/components/data-display/hooks/use-data-list-selection.ts

import type {
  DataListTableOnItemSelect,
  FormattedListItem,
} from "@/design-system/components/data-display/types/data-list-table.type";
import { useState } from "react";

export function useDataListSelection(
  formattedListItems: FormattedListItem[],
  onItemSelect?: DataListTableOnItemSelect,
) {
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
    let nextSelectedItems: FormattedListItem[] = [];

    setSelectedItems((prev) => {
      const isSelected = prev.some((s) => s.id === item.id);
      nextSelectedItems = isSelected
        ? prev.filter((s) => s.id !== item.id)
        : [...prev, item];
      return nextSelectedItems;
    });

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

    onItemSelect?.({
      selectedItems: nextSelectedItems,
      selectedCurrentItem: item,
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
