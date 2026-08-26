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
import { confirmDialog } from "@/design-system/components/feedback/utils/confirm-dialog";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Menu } from "@/design-system/components/overlay/ui/menu";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { isValidElement, type ComponentType } from "react";

const isDeclarativeAction = <T = Record<string, unknown>,>(
  action: DataListItemActionsGenerator<T>,
): action is DataListDeclarativeItemAction<T> => {
  return typeof action === "object" && action !== null && "label" in action;
};

export const executeItemAction = <T = Record<string, unknown>,>(
  action: DataListDeclarativeItemAction<T>,
  item: FormattedListItem<T>,
) => {
  const confirmationConfig =
    typeof action.confirmation === "function"
      ? action.confirmation(item.data)
      : action.confirmation;

  if (confirmationConfig) {
    confirmDialog({
      ...confirmationConfig,
      onConfirm: async () => {
        await confirmationConfig.onConfirm?.();
        await action.onClick?.(item.data, item);
      },
    });
    return;
  }

  void action.onClick?.(item.data, item);
};

const resolveIcon = <T,>(
  iconProp: ActionIconType | ((item: T) => ActionIconType) | undefined,
  item: T,
): ActionIconType | undefined => {
  if (typeof iconProp === "function") {
    return (iconProp as (item: T) => ActionIconType)(item);
  }
  return iconProp;
};

const resolveLabel = <T,>(
  labelProp: string | ((item: T) => string),
  item: T,
): string => {
  if (typeof labelProp === "function") {
    return labelProp(item);
  }
  return labelProp;
};

const resolveColorPalette = <T,>(
  paletteProp: string | ((item: T) => string | undefined) | undefined,
  item: T,
): string | undefined => {
  if (typeof paletteProp === "function") {
    return paletteProp(item);
  }
  return paletteProp;
};

const renderIcon = (icon: ActionIconType | undefined) => {
  if (!icon) return null;
  if (isValidElement(icon)) return icon;
  return <AppIcon icon={icon as ComponentType} />;
};

/**
 * Renders the inline action buttons in the last spread column of each row.
 * - Uses standard/default component sizing without overriding small/xs sizes.
 * - If action has `icon`: renders IconButton with Tooltip (using label).
 * - If action has NO `icon`: renders regular Button with label.
 */
export const DataListRowSpreadActions = <
  T extends Record<string, unknown> = Record<string, unknown>,
>(props: {
  item: FormattedListItem<T>;
  itemActions?: DataListItemActionsGenerator<T>[];
}) => {
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

        if (resolvedIcon) {
          return (
            <Tooltip key={key} content={resolvedLabel}>
              <IconButton
                variant={action.variant ?? "ghost"}
                colorPalette={resolvedColorPalette}
                disabled={isDisabled}
                aria-label={resolvedLabel}
                onClick={() => executeItemAction(action, item)}
              >
                {iconNode}
              </IconButton>
            </Tooltip>
          );
        }

        return (
          <Button
            key={key}
            variant={action.variant ?? "outline"}
            colorPalette={resolvedColorPalette}
            disabled={isDisabled}
            onClick={() => executeItemAction(action, item)}
          >
            {resolvedLabel}
          </Button>
        );
      })}
    </HStack>
  );
};

/**
 * Dropdown trigger that lists actions for the sticky menu.
 */
export const DataListItemActionsTrigger = <
  T extends Record<string, unknown> = Record<string, unknown>,
>(
  props: DataListItemActionsTriggerProps<T>,
) => {
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

              return (
                <Menu.Item
                  key={key}
                  value={key}
                  disabled={isDisabled}
                  color={
                    resolvedColorPalette
                      ? `${resolvedColorPalette}.fg`
                      : undefined
                  }
                  onClick={() => executeItemAction(action, item)}
                >
                  {iconNode}
                  {resolvedLabel}
                </Menu.Item>
              );
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
};
