// src/design-system/components/data-display/ui/data-list-item-actions.tsx

import {
  Button,
  IconButton,
} from "@/design-system/components/button/ui/button";
import type {
  ActionIconType,
  DataViewDeclarativeItemAction,
  DataViewItemActionsGenerator,
  DataViewItemActionsTriggerProps,
} from "@/design-system/components/data-display/types/data-view.type";
import type { FormattedListItem } from "@/design-system/components/data-display/types/data-view-table.type";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { updateClickOrigin } from "@/design-system/components/overlay/stores/dialog-animation-store";
import { Menu } from "@/design-system/components/overlay/ui/menu";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import {
  cloneElement,
  isValidElement,
  type ComponentType,
  type ReactElement,
  type ReactNode,
} from "react";

function isDeclarativeAction<T = Record<string, unknown>>(
  action: DataViewItemActionsGenerator<T>,
): action is DataViewDeclarativeItemAction<T> {
  return typeof action === "object" && action !== null && "label" in action;
}

export function executeItemAction<T = Record<string, unknown>>(
  action: DataViewDeclarativeItemAction<T>,
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

function resolveTriggerElement<T>(
  modalProp: DataViewDeclarativeItemAction<T>["modal"],
  item: FormattedListItem<T>,
): ReactElement<{ children?: ReactNode }> | null {
  if (!modalProp) return null;

  const config =
    typeof modalProp === "function" ? modalProp(item.data, item) : modalProp;

  if (!config?.triggerComponent) return null;

  const element =
    typeof config.triggerComponent === "function"
      ? config.triggerComponent(item.data, item)
      : config.triggerComponent;

  if (isValidElement<{ children?: ReactNode }>(element)) {
    return element;
  }

  return null;
}

export function DataViewSpreadActions<
  T extends Record<string, unknown> = Record<string, unknown>,
>(props: {
  item: FormattedListItem<T>;
  itemActions?: DataViewItemActionsGenerator<T>[];
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
        const triggerElement = resolveTriggerElement(action.modal, item);

        const rawButton = resolvedIcon ? (
          <IconButton
            variant={action.variant ?? "ghost"}
            colorPalette={resolvedColorPalette}
            disabled={isDisabled}
            aria-label={resolvedLabel}
            onClick={
              triggerElement ? undefined : () => executeItemAction(action, item)
            }
          >
            {iconNode}
          </IconButton>
        ) : (
          <Button
            variant={action.variant ?? "outline"}
            colorPalette={resolvedColorPalette}
            disabled={isDisabled}
            onClick={
              triggerElement ? undefined : () => executeItemAction(action, item)
            }
          >
            {resolvedLabel}
          </Button>
        );

        if (triggerElement) {
          const buttonWithTrigger = cloneElement(
            triggerElement,
            { key: `trigger-${key}` },
            rawButton,
          );

          if (resolvedIcon) {
            return (
              <Tooltip key={key} content={resolvedLabel}>
                {buttonWithTrigger}
              </Tooltip>
            );
          }

          return buttonWithTrigger;
        }

        if (resolvedIcon) {
          return (
            <Tooltip key={key} content={resolvedLabel}>
              {rawButton}
            </Tooltip>
          );
        }

        return <span key={key}>{rawButton}</span>;
      })}
    </HStack>
  );
}

export function DataListItemActionsTrigger<
  T extends Record<string, unknown> = Record<string, unknown>,
>(props: DataViewItemActionsTriggerProps<T>) {
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
      closeOnSelect={false}
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

      <Menu.Content minW={"160px"} zIndex={"dropdown"}>
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
              const triggerElement = resolveTriggerElement(action.modal, item);

              const menuItemNode = (
                <Menu.Item
                  value={key}
                  disabled={isDisabled}
                  color={
                    resolvedColorPalette
                      ? `${resolvedColorPalette}.fg`
                      : undefined
                  }
                  onPointerDown={(e) => {
                    const triggerProps = triggerElement?.props as
                      | { modalKey?: string }
                      | undefined;
                    if (triggerProps?.modalKey) {
                      updateClickOrigin(triggerProps.modalKey, {
                        x: e.clientX,
                        y: e.clientY,
                      });
                    }
                  }}
                  onClick={
                    triggerElement
                      ? undefined
                      : () => executeItemAction(action, item)
                  }
                >
                  {iconNode}
                  {resolvedLabel}
                </Menu.Item>
              );

              if (triggerElement) {
                return cloneElement(triggerElement, { key }, menuItemNode);
              }

              return <span key={key}>{menuItemNode}</span>;
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
