// src/features/design-system-docs/components/component-playground-container.tsx

// src\features\design-system-docs\components\component-playground-container.tsx

// src\features\design-system-docs\components\component-playground-container.tsx

import { Box } from "@/design-system/components/layout/ui/box";
import type { ComponentPlaygroundContainerProps } from "@/features/design-system-docs/types/ds-docs-spec.type";

export const ComponentPlaygroundContainer = (
  props: ComponentPlaygroundContainerProps,
) => {
  // Props
  const { children, minH = "220px" } = props;

  return (
    <Box
      p={6}
      rounded={"lg"}
      border={"1px solid"}
      borderColor={"border.subtle"}
      bg={"bg.body"}
      minH={minH}
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
      w={"full"}
      transition={"background-color 0.2s ease, border-color 0.2s ease"}
    >
      {children}
    </Box>
  );
};
