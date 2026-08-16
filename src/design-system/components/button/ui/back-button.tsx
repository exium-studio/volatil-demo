// src/design-system/components/button/ui/back-button.tsx

"use client";

import type { BackButtonProps } from "@/design-system/components/button/types/back-button.type";
import {
  Button,
  IconButton,
} from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { t } from "@/shared/libs/i18n";
import { ArrowLeftIcon } from "lucide-react";
import { forwardRef } from "react";

export const BackButton = forwardRef<HTMLButtonElement, BackButtonProps>(
  function BackButton(props, ref) {
    // Props
    const {
      isIconButton = true,
      icon = ArrowLeftIcon,
      children = t["action.back"](),
      variant = "ghost",
      preventNativeBack = false,
      onClick,
      ...restProps
    } = props;

    // Handlers
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      if (!preventNativeBack && !e.defaultPrevented) {
        window.history.back();
      }
    };

    if (isIconButton) {
      return (
        <Tooltip content={children}>
          <IconButton
            ref={ref}
            variant={variant}
            aria-label={"Kembali"}
            onClick={handleClick}
            {...restProps}
          >
            <AppIcon icon={icon} />
          </IconButton>
        </Tooltip>
      );
    }

    return (
      <Button ref={ref} variant={variant} onClick={handleClick} {...restProps}>
        <AppIcon icon={icon} />
        {children}
      </Button>
    );
  },
);
