// src/design-system/components/button/ui/close-button.tsx

"use client";

import type { IconButtonProps } from "@/design-system/components/button/types/button.type";
import { IconButton } from "@/design-system/components/button/ui/button";
import { AppTablerIcon } from "@/design-system/components/icon/ui/app-icon";
import { IconX } from "@tabler/icons-react";
import { forwardRef } from "react";

export const CloseButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function CloseButton(props, ref) {
    return (
      <IconButton ref={ref} {...props}>
        <AppTablerIcon icon={IconX} />
      </IconButton>
    );
  },
);
