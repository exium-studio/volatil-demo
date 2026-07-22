// src/design-system/components/toast/ui/toast.item.tsx

import {
  Button,
  IconButton,
} from "@/design-system/components/button/ui/button";
import { ButtonGroup } from "@/design-system/components/button/ui/button-group";
import { CloseButton } from "@/design-system/components/button/ui/close-button";
import { Collapsible } from "@/design-system/components/disclosure/ui/collapsible";
import { Loader } from "@/design-system/components/feedback/ui/loader";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { getToastConfig } from "@/design-system/components/toast/core/toast.config";
import {
  toast,
  toastTimerControls,
} from "@/design-system/components/toast/core/toast.manager";
import type {
  ToastItemProps,
  ToastVariantMap,
} from "@/design-system/components/toast/types/toast.types";
import { ToastIcon } from "@/design-system/components/toast/ui/toast.icon";
import { ToastProgressBar } from "@/design-system/components/toast/ui/toast.progress-bar";
import { P } from "@/design-system/components/typography/ui/p";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import { useFirstMountEffect } from "@/shared/hooks/use-first-mount-effect";
import { isEmptyArray } from "@/shared/utils/data/array";
import { tintDark } from "@/shared/utils/style/color";
import {
  AlertCircleIcon,
  CheckCircle2Icon,
  ChevronDownIcon,
  InfoIcon,
  XCircleIcon,
} from "lucide-react";
import { useState } from "react";

export const TOAST_VARIANT_MAP: ToastVariantMap = {
  success: {
    icon: <AppIcon icon={CheckCircle2Icon} />,
    bg: "bg.success",
    color: "fg.success",
  },
  error: {
    icon: <AppIcon icon={XCircleIcon} />,
    bg: "bg.error",
    color: "fg.error",
  },
  warning: {
    icon: <AppIcon icon={AlertCircleIcon} />,
    bg: "bg.warning",
    color: "fg.warning",
  },
  info: {
    icon: <AppIcon icon={InfoIcon} />,
    bg: "bg.subtle",
    color: "fg",
  },
  loading: {
    icon: <Loader />,
    bg: "bg.subtle",
    color: "fg",
  },
  custom: {
    icon: null,
    bg: "transparent",
    color: "transparent",
  },
};

export function ToastItem(props: ToastItemProps & { stackExpanded?: boolean }) {
  // Props
  const { record, index, stackExpanded, ...restProps } = props;

  // Stores
  const { theme } = useThemeStore();

  // Hooks
  const { showDeletedFromHistoryIndicator, showProgressBar } = getToastConfig();

  // Derived Values
  const isFirstIndex = index === 0;
  const hasExpandableContent = Boolean(
    record.description || (record.actions && !isEmptyArray(record.actions)),
  );

  // States
  const [toastItemExpanded, setToastItemExpanded] = useState<boolean>(false);

  // Collapse item when stack is collapsed
  useFirstMountEffect(
    {
      onUpdate: () => {
        if (stackExpanded === false) setToastItemExpanded(false);
      },
    },
    [stackExpanded],
  );

  if (record.variant === "custom" && record.renderer) {
    return <>{record.renderer(record)}</>;
  }

  return (
    <VStack
      data-state={record.status}
      aria-live={record.variant === "error" ? "assertive" : "polite"}
      role={record.variant === "error" ? "alert" : "status"}
      pos={"relative"}
      overflow={"clip"}
      py={3}
      bg={stackExpanded ? "bg.body" : tintDark("bg.body", index * 2)}
      border={"1px solid"}
      borderColor={"border.subtle"}
      rounded={theme.radii.container}
      shadow={"md"}
      opacity={record.status === "visible" ? 1 : 0}
      tabIndex={0}
      cursor={!stackExpanded || hasExpandableContent ? "pointer" : "auto"}
      transform={
        record.status === "visible" ? "translateY(0)" : "translateY(-20px)"
      }
      transition={"transform 300ms, opacity 300ms"}
      onPointerEnter={() => toastTimerControls.pauseAll()}
      onPointerLeave={() => toastTimerControls.resumeAll()}
      onFocus={() => toastTimerControls.pauseAll()}
      onBlur={() => toastTimerControls.resumeAll()}
      onKeyDown={(event) => {
        if (event.key === "Escape") toast.close(record.id);
      }}
      onClick={() => {
        if (!stackExpanded || !hasExpandableContent) return;
        setToastItemExpanded((prev) => !prev);
      }}
      {...restProps}
    >
      <HStack gap={3} px={3}>
        <ToastIcon
          record={record}
          icon={TOAST_VARIANT_MAP[record.variant].icon}
          bg={TOAST_VARIANT_MAP[record.variant].bg}
          color={TOAST_VARIANT_MAP[record.variant].color}
        />

        <VStack flex={1}>
          {/* Header */}
          <HStack align={"start"} gap={2}>
            {/* Title */}
            {record.title && (
              <P
                flex={"0 1 auto"}
                minW={0}
                fontWeight={"medium"}
                color={TOAST_VARIANT_MAP[record.variant].color}
                whiteSpace={toastItemExpanded ? undefined : "nowrap"}
                overflow={toastItemExpanded ? undefined : "hidden"}
                textOverflow={toastItemExpanded ? undefined : "ellipsis"}
              >
                {record.title}
              </P>
            )}

            {/* Description */}
            {record.description && (
              <P
                flex={"0 1 auto"}
                flexShrink={99}
                minW={0}
                overflow={"hidden"}
                lineClamp={1}
                textOverflow={"ellipsis"}
                ml={1}
                mt={"1px"}
                fontSize={"sm"}
                color={"fg.subtle"}
                display={toastItemExpanded ? "none" : undefined}
                transition={"200ms"}
              >
                {record.description}
              </P>
            )}

            {/* Actions */}
            <HStack align={"center"} gap={1} ml={"auto"}>
              {record.quickAction && (
                <Button
                  variant={"subtle"}
                  size={"2xs"}
                  rounded={"full"}
                  fontSize={"sm"}
                  onClick={(event) => {
                    event.stopPropagation();
                    record?.quickAction?.onClick(record.id);
                  }}
                >
                  {record.quickAction.content}
                </Button>
              )}

              {hasExpandableContent && (
                <IconButton
                  variant={"subtle"}
                  size={"2xs"}
                  rounded={"full"}
                  onClick={(event) => {
                    if (stackExpanded) event.stopPropagation();
                    setToastItemExpanded((prev) => !prev);
                  }}
                >
                  <AppIcon
                    icon={ChevronDownIcon}
                    size={"sm"}
                    transform={
                      toastItemExpanded ? "rotate(180deg)" : "rotate(0deg)"
                    }
                    transition={"transform 200ms"}
                  />
                </IconButton>
              )}

              <CloseButton
                aria-label={"Close notification"}
                variant={"subtle"}
                size={"2xs"}
                rounded={"full"}
                boxSize={3.5}
                onClick={(event: React.MouseEvent) => {
                  event.stopPropagation();
                  toast.close(record.id);
                }}
              />
            </HStack>
          </HStack>

          {/* Content */}
          <VStack
            mt={toastItemExpanded ? 1 : 0}
            display={stackExpanded || isFirstIndex ? "flex" : "none"}
            opacity={stackExpanded || isFirstIndex ? 1 : 0}
            pointerEvents={stackExpanded || isFirstIndex ? "auto" : "none"}
            transition={"opacity 200ms"}
          >
            <Collapsible.Root opened={toastItemExpanded}>
              <Collapsible.Content>
                {/* Description */}
                {record.description && stackExpanded && (
                  <P
                    color={"fg.muted"}
                    fontSize={"sm"}
                    lineClamp={toastItemExpanded ? undefined : 1}
                  >
                    {record.description}
                  </P>
                )}

                {/* Actions */}
                {record.actions && !isEmptyArray(record.actions) && (
                  <ButtonGroup gap={2} mt={record.description ? 3 : 0}>
                    {record.actions.map((action, index) => (
                      <Button
                        key={index}
                        variant={"subtle"}
                        size={"2xs"}
                        rounded={"full"}
                        fontSize={"sm"}
                        onClick={(event) => {
                          event.stopPropagation();
                          action.onClick(record.id);
                        }}
                      >
                        {action.content}
                      </Button>
                    ))}
                  </ButtonGroup>
                )}
              </Collapsible.Content>
            </Collapsible.Root>

            {/* Removed from history flag */}
            {showDeletedFromHistoryIndicator && record.isDeletedFromHistory && (
              <P fontSize={"xs"} color={"fg.muted"} mt={1}>
                {"Removed from history"}
              </P>
            )}
          </VStack>
        </VStack>
      </HStack>

      {showProgressBar && <ToastProgressBar record={record} />}
    </VStack>
  );
}
