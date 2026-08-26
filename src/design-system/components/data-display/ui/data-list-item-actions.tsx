// src/design-system/components/data-display/ui/data-list-item-actions.tsx

import {
  Button,
  IconButton,
} from "@/design-system/components/button/ui/button";
import type {
  ActionIconType,
  DataListDeclarativeItemAction,
  DataListItemActionsGenerator,
  DataListItemActionsTriggerProps,
} from "@/design-system/components/data-display/types/data-list.type";
import type { FormattedListItem } from "@/design-system/components/data-display/types/data-list-table.type";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Menu } from "@/design-system/components/overlay/ui/menu";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { isValidElement, type ComponentType } from "react";

function isDeclarativeAction<T = Record<string, unknown>>(
  action: DataListItemActionsGenerator<T>,
): action is DataListDeclarativeItemAction<T> {
  return typeof action === "object" && action !== null && "label" in action;
}

export function executeItemAction<T = Record<string, unknown>>(
  action: DataListDeclarativeItemAction<T>,
  item: FormattedListItem<T>,
) {
  void action.onClick?.(item.data, item);
}

function resolveIcon<T>(
  iconProp: ActionIconType | ((item: T) => ActionIconType) | undefined,
  item: T,
): ActionIconType | undefined {
  if (typeof iconProp === "function") {
    return (iconProp as (item: T) => ActionIconType)(item);
  }
  return iconProp;
}

function resolveLabel<T>(
  labelProp: string | ((item: T) => string),
  item: T,
): string {
  if (typeof labelProp === "function") {
    return labelProp(item);
  }
  return labelProp;
}

function resolveColorPalette<T>(
  paletteProp: string | ((item: T) => string | undefined) | undefined,
  item: T,
): string | undefined {
  if (typeof paletteProp === "function") {
    return paletteProp(item);
  }
  return paletteProp;
}

function renderIcon(icon: ActionIconType | undefined) {
  if (!icon) return null;
  if (isValidElement(icon)) return icon;
  return <AppIcon icon={icon as ComponentType} />;
}

export function DataListRowSpreadActions<
  T extends Record<string, unknown> = Record<string, unknown>,
>(props: {
  item: FormattedListItem<T>;
  itemActions?: DataListItemActionsGenerator<T>[];
}) {
  const { item, itemActions = [] } = props;

  const declarativeActions = itemActions.filter(isDeclarativeAction);
  const visibleRowActions = declarativeActions.filter((action) => {
    if (action.showInRow === false) return false;
    if (action.hidden?.(item.data, item)) return false;
    return true;
  });

  if (visibleRowActions.length === 0) return null;

  return (
    <HStack gap={1} align={"center"} onClick={(e) => e.stopPropagation()}>
      {visibleRowActions.map((action, index) => {
        const key = action.key ?? `spread-action-${index}`;
        const isDisabled = Boolean(action.disabled?.(item.data, item));
        const resolvedLabel = resolveLabel(action.label, item.data);
        const resolvedIcon = resolveIcon(action.icon, item.data);
        const resolvedColorPalette = resolveColorPalette(
          action.colorPalette,
          item.data,
        );
        const iconNode = renderIcon(resolvedIcon);

        const buttonNode = resolvedIcon ? (
          <Tooltip key={key} content={resolvedLabel}>
            <IconButton
              variant={action.variant ?? "ghost"}
              colorPalette={resolvedColorPalette}
              disabled={isDisabled}
              aria-label={resolvedLabel}
              onClick={action.modalTrigger ? undefined : () => executeItemAction(action, item)}
            >
              {iconNode}
            </IconButton>
          </Tooltip>
        ) : (
          <Button
            key={key}
            variant={action.variant ?? "outline"}
            colorPalette={resolvedColorPalette}
            disabled={isDisabled}
            onClick={action.modalTrigger ? undefined : () => executeItemAction(action, item)}
          >
            {resolvedLabel}
          </Button>
        );

        if (action.modalTrigger) {
          return (
            <span key={key}>
              {action.modalTrigger(buttonNode, item.data, item)}
            </span>
          );
        }

        return buttonNode;
      })}
    </HStack>
  );
}

export function DataListItemActionsTrigger<
  T extends Record<string, unknown> = Record<string, unknown>,
>(props: DataListItemActionsTriggerProps<T>) {
  // Props
  const {
    children,
    item,
    itemActions = [],
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

      <Menu.Content minW={"160px"}>
        <VStack gap={1}>
          {itemActions.map((action, index) => {
            if (isDeclarativeAction(action)) {
              if (action.showInMenu === false) return null;
              if (action.hidden?.(item.data, item)) return null;

              const key = action.key ?? `menu-action-${index}`;
              const isDisabled = Boolean(action.disabled?.(item.data, item));
              const resolvedLabel = resolveLabel(action.label, item.data);
              const resolvedIcon = resolveIcon(action.icon, item.data);
              const resolvedColorPalette = resolveColorPalette(
                action.colorPalette,
                item.data,
              );
              const iconNode = renderIcon(resolvedIcon);

              const menuItemNode = (
                <Menu.Item
                  key={key}
                  value={key}
                  disabled={isDisabled}
                  color={
                    resolvedColorPalette
                      ? `${resolvedColorPalette}.fg`
                      : undefined
                  }
                  onClick={action.modalTrigger ? undefined : () => executeItemAction(action, item)}
                >
                  {iconNode}
                  {resolvedLabel}
                </Menu.Item>
              );

              if (action.modalTrigger) {
                return (
                  <span key={key}>
                    {action.modalTrigger(menuItemNode, item.data, item)}
                  </span>
                );
              }

              return menuItemNode;
            }

            // Legacy functional generator fallback
            const node = action(item, index);
            if (!node) return null;

            return <span key={index}>{node}</span>;
          })}
        </VStack>
      </Menu.Content>
    </Menu.Root>
  );
}
