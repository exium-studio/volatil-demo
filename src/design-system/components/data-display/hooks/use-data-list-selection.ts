// src/design-system/components/data-display/hooks/use-data-list-selection.ts

import type {
  DataListTableOnSelectedItemChange,
  FormattedListItem,
} from "@/design-system/components/data-display/types/data-list-table.type";
import { useMemo, useState } from "react";

export function useDataListSelection(
  formattedListItems: FormattedListItem[],
  controlledSelectedItems?: FormattedListItem[],
  onSelectedItemChange?: DataListTableOnSelectedItemChange,
) {
  // Internal state — only used in uncontrolled mode
  const [internalSelectedItems, setInternalSelectedItems] = useState<
    FormattedListItem[]
  >([]);
  const [internalIsAllItemsSelected, setAllItemsSelected] = useState(false);

  // Resolved selected items — controlled takes priority
  const isControlled = controlledSelectedItems !== undefined;
  const selectedItems = isControlled
    ? controlledSelectedItems
    : internalSelectedItems;
  const isAllItemsSelected = isControlled
    ? selectedItems.length === formattedListItems.length &&
      formattedListItems.length > 0
    : internalIsAllItemsSelected;

  const selectedItemIds = useMemo(
    () => selectedItems.map((i) => i.id),
    [selectedItems],
  );

  function selectAllItems(isChecked: boolean) {
    const nextSelectedItems = isChecked ? formattedListItems : [];

    if (isControlled) {
      onSelectedItemChange?.({
        selectedItems: nextSelectedItems,
        selectedCurrentItem: nextSelectedItems[0] ?? formattedListItems[0],
      });
      return;
    }

    setAllItemsSelected(isChecked);
    setInternalSelectedItems(nextSelectedItems);

    // Fire callback in uncontrolled mode too
    onSelectedItemChange?.({
      selectedItems: nextSelectedItems,
      selectedCurrentItem: nextSelectedItems[0] ?? formattedListItems[0],
    });
  }

  function clearSelectedItems() {
    setAllItemsSelected(false);
    if (!isControlled) {
      setInternalSelectedItems([]);
    }
  }

  function toggleItemSelection(item: FormattedListItem) {
    let nextSelectedItems: FormattedListItem[] = [];

    if (!isControlled) {
      setInternalSelectedItems((prev) => {
        const isSelected = prev.some((s) => s.id === item.id);
        nextSelectedItems = isSelected
          ? prev.filter((s) => s.id !== item.id)
          : [...prev, item];
        return nextSelectedItems;
      });

      setAllItemsSelected(
        nextSelectedItems.length === formattedListItems.length,
      );
    } else {
      // Controlled — compute next without setState
      const isSelected = selectedItems.some((s) => s.id === item.id);
      nextSelectedItems = isSelected
        ? selectedItems.filter((s) => s.id !== item.id)
        : [...selectedItems, item];
    }

    onSelectedItemChange?.({
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
