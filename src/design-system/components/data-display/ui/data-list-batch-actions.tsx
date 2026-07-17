// src/design-system/components/data-display/ui/data-list-batch-actions.tsx

import { CloseButton } from "@/design-system/components/button/ui/close-button";
import type {
  DataListBatchActionBarProps,
  DataListBatchActionsTriggerProps,
} from "@/design-system/components/data-display/types/data-list.type";
import { CheckIndicator } from "@/design-system/components/feedback/ui/indicator";
import { Checkbox } from "@/design-system/components/input/ui/checkbox";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { ActionBar } from "@/design-system/components/overlay/ui/action-bar";
import { Menu } from "@/design-system/components/overlay/ui/menu";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { P, TNum } from "@/design-system/components/typography/ui/p";
import { Portal } from "@/design-system/components/utilities/ui/portal";
import { isEmptyArray } from "@/shared/utils/data/array";
import { Fragment } from "react";
import { Button } from "@/design-system/components/button/ui/button";

export const DataListBatchActionsTrigger = (
  props: DataListBatchActionsTriggerProps,
) => {
  const {
    children,
    batchActions,
    selectedItemIds,
    selectedItems,
    clearSelectedItems,
    isAllItemsSelected,
    selectAllItems,
    triggerActionBarMode = true,
    ...restProps
  } = props;

  if (triggerActionBarMode) {
    return (
      <Checkbox
        checked={isAllItemsSelected}
        onCheckedChange={() => {
          selectAllItems(isAllItemsSelected);
        }}
        size={"sm"}
        variant={"subtle"}
      />
    );
  }

  return (
    <Menu.Root
      lazyMount
      positioning={{ offset: { mainAxis: 6 } }}
      {...restProps}
    >
      <Menu.Trigger aria-label={"batch-actions"}>{children}</Menu.Trigger>

      <Menu.Content minW={"140px"}>
        <VStack px={2} py={1}>
          <P fontSize={"xs"} opacity={0.5} fontWeight={500}>
            {selectedItems.length} selected
          </P>
        </VStack>

        <Menu.Item
          value={"select-all"}
          justifyContent={"space-between"}
          closeOnSelect={false}
          onClick={() => selectAllItems(isAllItemsSelected)}
        >
          <P>Select all</P>

          <CheckIndicator checked={isAllItemsSelected} />
        </Menu.Item>

        <Separator px={2} my={1} />

        {batchActions?.map((item, index) => {
          const node = item({
            selectedItemIds,
            selectedItems,
            clearSelectedItems,
          });

          if (!node) return null;

          return <Fragment key={index}>{node}</Fragment>;
        })}
      </Menu.Content>
    </Menu.Root>
  );
};

export const DataListBatchActionBar = (props: DataListBatchActionBarProps) => {
  // Props
  const {
    batchActions,
    selectedItemIds,
    selectedItems,
    clearSelectedItems,
    ...restProps
  } = props;

  // Derived Values
  const isChecked = !isEmptyArray(selectedItems);

  return (
    <ActionBar.Root open={isChecked} {...restProps}>
      <Portal>
        <ActionBar.Positioner zIndex={4}>
          <ActionBar.Content>
            <Button color={"fg.muted"} unstyled px={4}>
              <TNum>{selectedItems.length}</TNum> selected
            </Button>

            <ActionBar.Separator />

            {batchActions?.map((item, index) => {
              const node = item({
                selectedItemIds,
                selectedItems,
                clearSelectedItems,
              });

              if (!node) return null;

              return <Fragment key={index}>{node}</Fragment>;
            })}

            <ActionBar.Separator />

            <ActionBar.CloseTrigger>
              <Tooltip content={"Cancel"}>
                <CloseButton onClick={clearSelectedItems} />
              </Tooltip>
            </ActionBar.CloseTrigger>
          </ActionBar.Content>
        </ActionBar.Positioner>
      </Portal>
    </ActionBar.Root>
  );
};
