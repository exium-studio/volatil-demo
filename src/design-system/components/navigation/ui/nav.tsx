// src/design-system/components/navigation/ui/nav.tsx

import { Button } from "@/design-system/components/button/ui/button";
import type { NavButtonProps } from "@/design-system/components/layout/types/nav.type";
import { forwardRef } from "react";

export const NavButton = forwardRef<HTMLButtonElement, NavButtonProps>(
  function NavButton(props, ref) {
    // Props
    const { children, ...restProps } = props;

    return (
      <Button
        ref={ref}
        justifyContent={"start"}
        textAlign={"start"}
        gap={3}
        px={2}
        {...restProps}
      >
        {children}
      </Button>
    );
  },
);
