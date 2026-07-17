// src/design-system/components/feedback/ui/state.retry.tsx

"use client";

import { Button } from "@/design-system/components/button/ui/button";
import type { RetryStateProps } from "@/design-system/components/feedback/types/feedback-state.type";
import FeedbackState from "@/design-system/components/feedback/ui/feedback-state";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import { t } from "@/shared/libs/i18n";
import { AlertTriangleIcon } from "lucide-react";

export const RetryState = (props: RetryStateProps) => {
  // Props
  const {
    icon = AlertTriangleIcon,
    title = t["common.something_went_wrong"](),
    description = t["common.please_try_again"](),
    onRetry,
    children,
    ...restProps
  } = props;

  // Stores
  const { theme } = useThemeStore();

  return (
    <FeedbackState
      icon={icon}
      title={title}
      description={description}
      {...restProps}
    >
      <VStack gap={1}>
        <Button
          className={"clicky"}
          variant={"ghost"}
          colorPalette={theme.colorPalette}
          mx={"auto"}
          size={"sm"}
          onClick={onRetry}
        >
          {t["action.retry"]()}
        </Button>

        {children}
      </VStack>
    </FeedbackState>
  );
};
