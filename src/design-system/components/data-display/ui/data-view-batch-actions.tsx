// src\design-system\components\data-display\ui\data-view-batch-actions.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { CloseButton } from "@/design-system/components/button/ui/close-button";
import type { FormattedListItem } from "@/design-system/components/data-display/types/data-view-table.type";
import type {
  ActionIconType,
  DataViewBatchActionBarProps,
  DataViewBatchActionsGenerator,
  DataViewBatchActionsTriggerProps,
  DataViewDeclarativeBatchAction,
} from "@/design-system/components/data-display/types/data-view.type";
import { CheckIndicator } from "@/design-system/components/feedback/ui/indicator";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Checkbox } from "@/design-system/components/input/ui/checkbox";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { HScrollContainer } from "@/design-system/components/layout/ui/scroll-container";
import { updateClickOrigin } from "@/design-system/components/overlay/stores/dialog-animation-store";
import { ActionBar } from "@/design-system/components/overlay/ui/action-bar";
import { Menu } from "@/design-system/components/overlay/ui/menu";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { P, TNum } from "@/design-system/components/typography/ui/p";
import { Portal } from "@/design-system/components/utilities/ui/portal";
import { useIsSmallViewport } from "@/design-system/hooks/use-is-small-viewport";
import { t } from "@/shared/libs/i18n";
import { isEmptyArray } from "@/shared/utils/data/array";
import { useNavigate } from "@tanstack/react-router";
import {
  cloneElement,
  isValidElement,
  type ComponentType,
  type ReactElement,
  type ReactNode,
} from "react";
import { ListIcon } from "lucide-react";

// Helpers

function isDeclarativeBatchAction<T = Record<string, unknown>>(
  action: DataViewBatchActionsGenerator<T>,
): action is DataViewDeclarativeBatchAction<T> {
  return typeof action === "object" && action !== null && "label" in action;
}

function resolveBatchLabel<T>(
  labelProp:
    | string
    | ((params: {
        selectedItemIds: string[];
        selectedItems: FormattedListItem<T>[];
      }) => string),
  params: {
    selectedItemIds: string[];
    selectedItems: FormattedListItem<T>[];
  },
): string {
  if (typeof labelProp === "function") {
    return labelProp(params);
  }
  return labelProp;
}

function resolveBatchIcon<T>(
  iconProp:
    | ActionIconType
    | ((params: {
        selectedItemIds: string[];
        selectedItems: FormattedListItem<T>[];
      }) => ActionIconType)
    | undefined,
  params: {
    selectedItemIds: string[];
    selectedItems: FormattedListItem<T>[];
  },
): ActionIconType | undefined {
  if (typeof iconProp === "function") {
    return (
      iconProp as (params: {
        selectedItemIds: string[];
        selectedItems: FormattedListItem<T>[];
      }) => ActionIconType
    )(params);
  }
  return iconProp;
}

function resolveBatchColorPalette<T>(
  paletteProp:
    | string
    | ((params: {
        selectedItemIds: string[];
        selectedItems: FormattedListItem<T>[];
      }) => string | undefined)
    | undefined,
  params: {
    selectedItemIds: string[];
    selectedItems: FormattedListItem<T>[];
  },
): string | undefined {
  if (typeof paletteProp === "function") {
    return paletteProp(params);
  }
  return paletteProp;
}

function renderBatchIcon(icon: ActionIconType | undefined) {
  if (!icon) return null;
  if (isValidElement(icon)) return icon;
  return <AppIcon icon={icon as ComponentType} />;
}

function resolveBatchTriggerElement<T>(
  modalProp: DataViewDeclarativeBatchAction<T>["modal"],
  params: {
    selectedItemIds: string[];
    selectedItems: FormattedListItem<T>[];
    clearSelectedItems: () => void;
  },
): ReactElement<{ children?: ReactNode }> | null {
  if (!modalProp) return null;

  const config =
    typeof modalProp === "function" ? modalProp(params) : modalProp;

  if (!config?.triggerComponent) return null;

  const element =
    typeof config.triggerComponent === "function"
      ? config.triggerComponent(params)
      : config.triggerComponent;

  if (isValidElement<{ children?: ReactNode }>(element)) {
    return element;
  }

  return null;
}

// Components

export const DataViewBatchActionsTrigger = <
  T extends Record<string, unknown> = Record<string, unknown>,
>(
  props: DataViewBatchActionsTriggerProps<T>,
) => {
  // Props
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
        onCheckedChange={(e) => {
          selectAllItems(!!e.checked);
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
          <P>{"Select all"}</P>

          <CheckIndicator checked={isAllItemsSelected} />
        </Menu.Item>

        <Separator px={2} my={1} />

        {batchActions?.map((action, index) => {
          if (isDeclarativeBatchAction(action)) {
            const key = action.key ?? `batch-menu-${index}`;
            const isHidden = action.hidden?.({
              selectedItemIds,
              selectedItems,
            });
            if (isHidden) return null;

            const isDisabled = Boolean(
              action.disabled?.({ selectedItemIds, selectedItems }),
            );
            const resolvedLabel = resolveBatchLabel(action.label, {
              selectedItemIds,
              selectedItems,
            });
            const resolvedIcon = resolveBatchIcon(action.icon, {
              selectedItemIds,
              selectedItems,
            });
            const resolvedPalette = resolveBatchColorPalette(
              action.colorPalette,
              { selectedItemIds, selectedItems },
            );
            const iconNode = renderBatchIcon(resolvedIcon);
            const triggerElement = resolveBatchTriggerElement(action.modal, {
              selectedItemIds,
              selectedItems,
              clearSelectedItems,
            });

            const menuItemNode = (
              <Menu.Item
                value={key}
                disabled={isDisabled}
                color={resolvedPalette ? `${resolvedPalette}.fg` : undefined}
                onClick={
                  triggerElement
                    ? undefined
                    : () => {
                        void action.onClick?.({
                          selectedItemIds,
                          selectedItems,
                          clearSelectedItems,
                        });
                      }
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

          const node = action({
            selectedItemIds,
            selectedItems,
            clearSelectedItems,
          });

          if (!node) return null;

          return <span key={index}>{node}</span>;
        })}
      </Menu.Content>
    </Menu.Root>
  );
};

export const DataViewBatchActionBar = <
  T extends Record<string, unknown> = Record<string, unknown>,
>(
  props: DataViewBatchActionBarProps<T>,
) => {
  // Props
  const {
    batchActions,
    selectedItemIds,
    selectedItems,
    clearSelectedItems,
    ...restProps
  } = props;

  // Hooks
  const navigate = useNavigate();
  const isSmallViewport = useIsSmallViewport();

  // Derived Values
  const isChecked = !isEmptyArray(selectedItems);

  return (
    <ActionBar.Root open={isChecked} {...restProps}>
      <Portal>
        <ActionBar.Positioner zIndex={4}>
          <ActionBar.Content maxW={"95vw"}>
            <P px={4} whiteSpace={"nowrap"}>
              <TNum>{selectedItems.length}</TNum> {t["common.selected"]()}
            </P>

            {isSmallViewport && (
              <Menu.Root
                lazyMount
                positioning={{
                  offset: { crossAxis: 4 },
                  hideWhenDetached: true,
                }}
                closeOnSelect={false}
              >
                <Menu.Trigger asChild>
                  <Button>
                    <AppIcon icon={ListIcon} />
                    {t["action.actions"]?.()}
                  </Button>
                </Menu.Trigger>

                <Menu.Content minW={"180px"} zIndex={"dropdown"}>
                  <VStack gap={1}>
                    {batchActions?.map((action, index) => {
                      if (isDeclarativeBatchAction(action)) {
                        const key = action.key ?? `batch-action-${index}`;
                        const isHidden = action.hidden?.({
                          selectedItemIds,
                          selectedItems,
                        });
                        if (isHidden) return null;

                        const isDisabled = Boolean(
                          action.disabled?.({
                            selectedItemIds,
                            selectedItems,
                          }),
                        );
                        const resolvedLabel = resolveBatchLabel(action.label, {
                          selectedItemIds,
                          selectedItems,
                        });
                        const resolvedIcon = resolveBatchIcon(action.icon, {
                          selectedItemIds,
                          selectedItems,
                        });
                        const resolvedPalette = resolveBatchColorPalette(
                          action.colorPalette,
                          { selectedItemIds, selectedItems },
                        );
                        const iconNode = renderBatchIcon(resolvedIcon);
                        const triggerElement = resolveBatchTriggerElement(
                          action.modal,
                          {
                            selectedItemIds,
                            selectedItems,
                            clearSelectedItems,
                          },
                        );

                        const menuItemNode = (
                          <Menu.Item
                            value={key}
                            disabled={isDisabled}
                            color={
                              resolvedPalette
                                ? `${resolvedPalette}.fg`
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
                                    const triggerProps =
                                      triggerElement.props as {
                                        modalKey?: string;
                                      };
                                    const targetKey =
                                      triggerProps?.modalKey ??
                                      (action.key
                                        ? `batch-${action.key}`
                                        : undefined);
                                    if (targetKey) {
                                      navigate({
                                        to: ".",
                                        resetScroll: false,
                                        search: (
                                          old: Record<string, unknown>,
                                        ) => ({
                                          ...old,
                                          activeModalKey: targetKey,
                                        }),
                                      });
                                    }
                                  }
                                : () => {
                                    void action.onClick?.({
                                      selectedItemIds,
                                      selectedItems,
                                      clearSelectedItems,
                                    });
                                  }
                            }
                          >
                            {iconNode}
                            {resolvedLabel}
                          </Menu.Item>
                        );

                        if (triggerElement) {
                          return cloneElement(
                            triggerElement,
                            { key },
                            menuItemNode,
                          );
                        }

                        return <span key={key}>{menuItemNode}</span>;
                      }

                      // Functional generator fallback
                      const node = action({
                        selectedItemIds,
                        selectedItems,
                        clearSelectedItems,
                      });

                      if (!node) return null;

                      return <span key={index}>{node}</span>;
                    })}
                  </VStack>
                </Menu.Content>
              </Menu.Root>
            )}

            {!isSmallViewport && (
              <HScrollContainer
                gap={2}
                align={"center"}
                maxW={"calc(95vw - 160px)"}
                showRightBorderOnScroll={false}
              >
                {batchActions?.map((action, index) => {
                  if (isDeclarativeBatchAction(action)) {
                    const key = action.key ?? `batch-action-${index}`;
                    const isHidden = action.hidden?.({
                      selectedItemIds,
                      selectedItems,
                    });
                    if (isHidden) return null;

                    const isDisabled = Boolean(
                      action.disabled?.({ selectedItemIds, selectedItems }),
                    );
                    const isLoading = Boolean(
                      action.loading?.({ selectedItemIds, selectedItems }),
                    );
                    const resolvedLabel = resolveBatchLabel(action.label, {
                      selectedItemIds,
                      selectedItems,
                    });
                    const resolvedIcon = resolveBatchIcon(action.icon, {
                      selectedItemIds,
                      selectedItems,
                    });
                    const resolvedPalette = resolveBatchColorPalette(
                      action.colorPalette,
                      { selectedItemIds, selectedItems },
                    );
                    const iconNode = renderBatchIcon(resolvedIcon);
                    const triggerElement = resolveBatchTriggerElement(
                      action.modal,
                      {
                        selectedItemIds,
                        selectedItems,
                        clearSelectedItems,
                      },
                    );

                    const rawButton = (
                      <Button
                        colorPalette={resolvedPalette}
                        disabled={isDisabled}
                        loading={isLoading}
                        whiteSpace={"nowrap"}
                        onClick={
                          triggerElement
                            ? undefined
                            : () => {
                                void action.onClick?.({
                                  selectedItemIds,
                                  selectedItems,
                                  clearSelectedItems,
                                });
                              }
                        }
                      >
                        {iconNode}
                        {resolvedLabel}
                      </Button>
                    );

                    if (triggerElement) {
                      return cloneElement(
                        triggerElement,
                        { key: `trigger-${key}` },
                        rawButton,
                      );
                    }

                    return <span key={key}>{rawButton}</span>;
                  }

                  // Functional generator fallback
                  const node = action({
                    selectedItemIds,
                    selectedItems,
                    clearSelectedItems,
                  });

                  if (!node) return null;

                  return <span key={index}>{node}</span>;
                })}
              </HScrollContainer>
            )}

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
