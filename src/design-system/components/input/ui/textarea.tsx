// src/design-system/components/input/ui/textarea.tsx

import type { TextareaProps } from "@/design-system/components/input/types/textarea.type";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import { Textarea as ChakraTextarea } from "@chakra-ui/react";
import * as React from "react";

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(props, ref) {
    // Stores
    const { theme } = useThemeStore();

    return (
      <ChakraTextarea
        ref={ref}
        rounded={theme.radii.component}
        fontSize={"md"}
        {...props}
      />
    );
  }
);
