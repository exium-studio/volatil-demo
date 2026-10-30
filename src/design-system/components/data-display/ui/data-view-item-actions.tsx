// src/design-system/components/data-display/ui/data-view-item-actions.tsx

import {
  Button,
  IconButton,
} from "@/design-system/components/button/ui/button";
import type {
  ActionIconType,
  DataViewDeclarativeItemAction,
  DataViewItemActionsGenerator,
  DataViewItemActionsTriggerProps,
  RenderActionButtonParams,
} from "@/design-system/components/data-display/types/data-view.type";
import type { FormattedListItem } from "@/design-system/components/data-display/types/data-view-table.type";
import { DataViewTableContext } from "@/design-system/components/data-display/contexts/data-view-table.context";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { updateClickOrigin } from "@/design-system/components/overlay/stores/dialog-animation-store";
import { Menu } from "@/design-system/components/overlay/ui/menu";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { Loader } from "@/design-system/components/feedback/ui/loader";
import { t } from "@/shared/libs/i18n";
import { isEmptyArray } from "@/shared/utils/data/array";
import { useNavigate } from "@tanstack/react-router";
import {
  cloneElement,
  isValidElement,
  useContext,
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

function resolveLoading<T>(
  loadingProp:
    | boolean
    | ((item: T, formattedItem: FormattedListItem<T>) => boolean)
    | undefined,
  item: T,
  formattedItem: FormattedListItem<T>,
): boolean {
  if (typeof loadingProp === "function") {
    return Boolean(loadingProp(item, formattedItem));
  }
  return Boolean(loadingProp);
}

function resolveBoolean<T>(
  boolProp:
    | boolean
    | ((item: T, formattedItem: FormattedListItem<T>) => boolean)
    | undefined,
  item: T,
  formattedItem: FormattedListItem<T>,
): boolean {
  if (typeof boolProp === "function") {
    return Boolean(boolProp(item, formattedItem));
  }
  return Boolean(boolProp);
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

function resolveDisabledMessage<T>(
  disabledMessageProp:
    | string
    | ((item: T, formattedItem: FormattedListItem<T>) => string | undefined)
    | undefined
    | null,
  item: T,
  formattedItem: FormattedListItem<T>,
): string | undefined {
  if (!disabledMessageProp) return undefined;
  if (typeof disabledMessageProp === "function") {
    return disabledMessageProp(item, formattedItem) ?? undefined;
  }
  return disabledMessageProp;
}

function resolveTooltip<T>(
  tooltipProp:
    | string
    | ((item: T) => string | undefined | null)
    | undefined
    | null,
  item: T,
  fallbackLabel: string,
): string | undefined {
  if (tooltipProp === null) return undefined;
  if (typeof tooltipProp === "function") {
    const res = tooltipProp(item);
    return res ?? fallbackLabel;
  }
  return tooltipProp ?? fallbackLabel;
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

function resolveHref<T>(
  hrefProp: DataViewDeclarativeItemAction<T>["href"],
  item: T,
  formattedItem: FormattedListItem<T>,
): string | undefined {
  if (typeof hrefProp === "function") {
    const res = hrefProp(item, formattedItem);
    return res ?? undefined;
  }
  return hrefProp ?? undefined;
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

const renderActionButton = <T,>(
  params: RenderActionButtonParams<T>,
): ReactElement => {
  const {
    action,
    item,
    resolvedLabel,
    resolvedIcon,
    resolvedColorPalette,
    resolvedHref,
    iconNode,
    isDisabled,
    isLoading,
    triggerElement,
  } = params;

  // 1. Link with Icon
  if (resolvedHref && resolvedIcon) {
    return (
      <IconButton
        asChild
        variant={action.variant ?? "ghost"}
        colorPalette={resolvedColorPalette}
        disabled={isDisabled}
        loading={isLoading}
        aria-label={resolvedLabel}
      >
        <a
          href={resolvedHref}
          target={action.target ?? "_blank"}
          rel={action.rel ?? "noopener noreferrer"}
          onClick={(e) => {
            if (isDisabled) {
              e.preventDefault();
              return;
            }
            void action.onClick?.(item.data, item);
          }}
        >
          {iconNode}
        </a>
      </IconButton>
    );
  }

  // 2. Link with Text Button
  if (resolvedHref) {
    return (
      <Button
        asChild
        variant={action.variant ?? "outline"}
        colorPalette={resolvedColorPalette}
        disabled={isDisabled}
        loading={isLoading}
      >
        <a
          href={resolvedHref}
          target={action.target ?? "_blank"}
          rel={action.rel ?? "noopener noreferrer"}
          onClick={(e) => {
            if (isDisabled) {
              e.preventDefault();
              return;
            }
            void action.onClick?.(item.data, item);
          }}
        >
          {resolvedLabel}
        </a>
      </Button>
    );
  }

  // 3. Regular Icon Button
  if (resolvedIcon) {
    return (
      <IconButton
        variant={action.variant ?? "ghost"}
        colorPalette={resolvedColorPalette}
        disabled={isDisabled}
        loading={isLoading}
        aria-label={resolvedLabel}
        onClick={
          triggerElement ? undefined : () => executeItemAction(action, item)
        }
      >
        {iconNode}
      </IconButton>
    );
  }

  // 4. Regular Text Button
  return (
    <Button
      variant={action.variant ?? "outline"}
      colorPalette={resolvedColorPalette}
      disabled={isDisabled}
      loading={isLoading}
      onClick={
        triggerElement ? undefined : () => executeItemAction(action, item)
      }
    >
      {resolvedLabel}
    </Button>
  );
};

export const DataViewSpreadActions = <
  T extends Record<string, unknown> = Record<string, unknown>,
>(props: {
  item: FormattedListItem<T>;
  itemActions?: DataViewItemActionsGenerator<T>[];
}) => {
  const { item, itemActions = [] } = props;

  const declarativeActions = itemActions.filter(isDeclarativeAction);
  const visibleRowActions = declarativeActions.filter((action) => {
    if (action.sticky) return false;
    if (action.showInRow === false) return false;
    if (resolveBoolean(action.hidden, item.data, item)) return false;
    return true;
  });

  if (isEmptyArray(visibleRowActions)) return null;

  return (
    <HStack
      gap={"2xs"}
      align={"center"}
      justify={"start"}
      wrap={"nowrap"}
      flexShrink={0}
      w={"full"}
      onClick={(e) => e.stopPropagation()}
    >
      {visibleRowActions.map((action, index) => {
        const key = action.key ?? `spread-action-${index}`;
        const isLoading = resolveLoading(action.loading, item.data, item);
        const isDisabled =
          isLoading || resolveBoolean(action.disabled, item.data, item);
        const disabledMessage = resolveDisabledMessage(
          action.disabledMessage,
          item.data,
          item,
        );
        const resolvedLabel = resolveLabel(action.label, item.data);
        const resolvedIcon = resolveIcon(action.icon, item.data);
        const resolvedColorPalette = resolveColorPalette(
          action.colorPalette,
          item.data,
        );
        const resolvedHref = resolveHref(action.href, item.data, item);
        const iconNode = renderIcon(resolvedIcon);
        const triggerElement = resolveTriggerElement(action.modal, item);

        const baseTooltip = resolveTooltip(
          action.tooltip,
          item.data,
          resolvedLabel,
        );
        const resolvedTooltip =
          isDisabled && disabledMessage ? disabledMessage : baseTooltip;

        const rawButton = renderActionButton({
          action,
          item,
          resolvedLabel,
          resolvedIcon,
          resolvedColorPalette,
          resolvedHref,
          iconNode,
          isDisabled,
          isLoading,
          triggerElement,
        });

        const buttonWithTooltip = resolvedTooltip ? (
          <Tooltip content={resolvedTooltip}>{rawButton}</Tooltip>
        ) : (
          rawButton
        );

        if (triggerElement) {
          return cloneElement(
            triggerElement,
            { key: `trigger-${key}` },
            buttonWithTooltip,
          );
        }

        return <span key={key}>{buttonWithTooltip}</span>;
      })}
    </HStack>
  );
};

export const DataViewStickyActions = <
  T extends Record<string, unknown> = Record<string, unknown>,
>(props: {
  item: FormattedListItem<T>;
  itemActions?: DataViewItemActionsGenerator<T>[];
}) => {
  const { item, itemActions = [] } = props;

  const declarativeActions = itemActions.filter(isDeclarativeAction);
  const stickyActions = declarativeActions.filter((action) => {
    if (!action.sticky) return false;
    if (resolveBoolean(action.hidden, item.data, item)) return false;
    return true;
  });

  if (isEmptyArray(stickyActions)) return null;

  return (
    <HStack
      gap={"2xs"}
      align={"center"}
      justify={"end"}
      wrap={"nowrap"}
      flexShrink={0}
      onClick={(e) => e.stopPropagation()}
    >
      {stickyActions.map((action, index) => {
        const key = action.key ?? `sticky-action-${index}`;
        const isLoading = resolveLoading(action.loading, item.data, item);
        const isDisabled =
          isLoading || resolveBoolean(action.disabled, item.data, item);
        const disabledMessage = resolveDisabledMessage(
          action.disabledMessage,
          item.data,
          item,
        );
        const resolvedLabel = resolveLabel(action.label, item.data);
        const baseTooltip = resolveTooltip(
          action.tooltip,
          item.data,
          resolvedLabel,
        );
        const resolvedTooltip =
          isDisabled && disabledMessage ? disabledMessage : baseTooltip;
        const resolvedIcon = resolveIcon(action.icon, item.data);
        const resolvedColorPalette = resolveColorPalette(
          action.colorPalette,
          item.data,
        );
        const resolvedHref = resolveHref(action.href, item.data, item);
        const iconNode = renderIcon(resolvedIcon);
        const triggerElement = resolveTriggerElement(action.modal, item);

        const rawButton = renderActionButton({
          action,
          item,
          resolvedLabel,
          resolvedIcon,
          resolvedColorPalette,
          resolvedHref,
          iconNode,
          isDisabled,
          isLoading,
          triggerElement,
        });

        const buttonWithTooltip = resolvedTooltip ? (
          <Tooltip content={resolvedTooltip}>{rawButton}</Tooltip>
        ) : (
          rawButton
        );

        if (triggerElement) {
          return cloneElement(
            triggerElement,
            { key: `trigger-${key}` },
            buttonWithTooltip,
          );
        }

        return <span key={key}>{buttonWithTooltip}</span>;
      })}
    </HStack>
  );
};

export const DataListItemActionsTrigger = <
  T extends Record<string, unknown> = Record<string, unknown>,
>(
  props: DataViewItemActionsTriggerProps<T>,
) => {
  // Props
  const {
    children,
    item,
    itemActions = [],
    contextedTrigger = false,
    ...restProps
  } = props;

  // Hooks
  const navigate = useNavigate();

  // Contexts
  const tableContext = useContext(DataViewTableContext);

  // Derived Values
  const visibleActions = itemActions.filter((action) => {
    if (isDeclarativeAction(action)) {
      if (action.showInMenu === false) return false;
      if (resolveBoolean(action.hidden, item.data, item)) return false;
      return true;
    }
    return true;
  });

  const isMenuOpen = tableContext?.setActiveItemMenuId
    ? tableContext.activeItemMenuId === item.id
    : undefined;

  const handleOpenChange = (details: { open: boolean }) => {
    if (tableContext?.setActiveItemMenuId) {
      tableContext.setActiveItemMenuId(details.open ? item.id : null);
    }
    restProps.onOpenChange?.(details);
  };

  return (
    <Menu.Root
      lazyMount
      positioning={{
        offset: { crossAxis: 4 },
        hideWhenDetached: true,
      }}
      closeOnSelect={false}
      open={isMenuOpen}
      onOpenChange={handleOpenChange}
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
          {isEmptyArray(visibleActions) && (
            <Menu.Item
              value={"no-action"}
              disabled={true}
              color={"fg.muted"}
              cursor={"default"}
            >
              {t["action.no_actions"]?.() ?? "Tidak ada aksi"}
            </Menu.Item>
          )}

          {!isEmptyArray(visibleActions) &&
            visibleActions.map((action, index) => {
              if (isDeclarativeAction(action)) {
                const key = action.key ?? `menu-action-${index}`;
                const isLoading = resolveLoading(
                  action.loading,
                  item.data,
                  item,
                );
                const isDisabled =
                  isLoading || resolveBoolean(action.disabled, item.data, item);
                const disabledMessage = resolveDisabledMessage(
                  action.disabledMessage,
                  item.data,
                  item,
                );
                const resolvedLabel = resolveLabel(action.label, item.data);
                const baseTooltip = action.tooltip
                  ? resolveTooltip(action.tooltip, item.data, resolvedLabel)
                  : resolvedLabel;
                const menuTooltipContent =
                  isDisabled && disabledMessage ? disabledMessage : baseTooltip;
                const resolvedIcon = resolveIcon(action.icon, item.data);
                const resolvedColorPalette = resolveColorPalette(
                  action.colorPalette,
                  item.data,
                );
                const resolvedHref = resolveHref(action.href, item.data, item);
                const iconNode = renderIcon(resolvedIcon);
                const triggerElement = resolveTriggerElement(
                  action.modal,
                  item,
                );
                const shouldMountModalInMenu =
                  Boolean(triggerElement) && action.showInRow === false;

                const menuItemContent = (
                  <>
                    {isLoading ? <Loader /> : iconNode}

                    {resolvedLabel}
                  </>
                );

                let rawMenuItemNode: ReactElement;

                if (resolvedHref) {
                  rawMenuItemNode = (
                    <Menu.Item
                      asChild
                      value={key}
                      disabled={isDisabled}
                      color={
                        resolvedColorPalette
                          ? `${resolvedColorPalette}.fg`
                          : undefined
                      }
                    >
                      <a
                        href={resolvedHref}
                        target={action.target ?? "_blank"}
                        rel={action.rel ?? "noopener noreferrer"}
                        onClick={(e) => {
                          if (isDisabled) {
                            e.preventDefault();
                            return;
                          }
                          void action.onClick?.(item.data, item);
                        }}
                      >
                        {menuItemContent}
                      </a>
                    </Menu.Item>
                  );
                } else {
                  rawMenuItemNode = (
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
                          ? () => {
                              if (isDisabled) return;
                              const triggerProps = triggerElement.props as {
                                modalKey?: string;
                              };
                              const targetKey =
                                triggerProps?.modalKey ??
                                (action.key
                                  ? `${action.key}-${item.id}`
                                  : undefined);
                              if (targetKey) {
                                navigate({
                                  to: ".",
                                  resetScroll: false,
                                  search: (old: Record<string, unknown>) => ({
                                    ...old,
                                    activeModalKey: targetKey,
                                  }),
                                });
                              }
                            }
                          : () => executeItemAction(action, item)
                      }
                    >
                      {menuItemContent}
                    </Menu.Item>
                  );
                }

                let menuItemNode = rawMenuItemNode;
                if (menuTooltipContent) {
                  menuItemNode = (
                    <Tooltip
                      content={menuTooltipContent}
                      positioning={{ placement: "right" }}
                    >
                      <Box
                        w={"full"}
                        cursor={isDisabled ? "not-allowed" : undefined}
                        pointerEvents={"auto"}
                      >
                        {rawMenuItemNode}
                      </Box>
                    </Tooltip>
                  );
                }

                if (shouldMountModalInMenu && triggerElement) {
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
};
