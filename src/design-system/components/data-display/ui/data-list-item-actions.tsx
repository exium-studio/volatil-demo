// src/design-system/components/data-display/ui/data-list-item-actions.tsx

import type { DataListItemActionsTriggerProps } from "@/design-system/components/data-display/types/data-list.type";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { Menu } from "@/design-system/components/overlay/ui/menu";
import { Fragment } from "react";

export const DataListItemActionsTrigger = (
  props: DataListItemActionsTriggerProps,
) => {
  // Props
  const {
    children,
    item,
    itemActions,
    contextedTrigger = false,
    ...restProps
  } = props;

  return (
    <Menu.Root
      lazyMount
      positioning={{
        offset: { crossAxis: 4 },
        hideWhenDetached: true,
      }}
      {...restProps}
    >
      {contextedTrigger && (
        <Menu.ContextTrigger aria-label={"context-item-actions"}>
          {children}
        </Menu.ContextTrigger>
      )}

      {!contextedTrigger && (
        <Menu.Trigger aria-label={"item-actions"}>{children}</Menu.Trigger>
      )}

      <Menu.Content minW={"140px"}>
        <VStack gap={1}>
          {itemActions?.map((action, index) => {
            const node = action(item, index);

            if (!node) return null;

            return <Fragment key={index}>{node}</Fragment>;
          })}
        </VStack>
      </Menu.Content>
    </Menu.Root>
  );
};
