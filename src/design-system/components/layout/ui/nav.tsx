// src/design-system/components/layout/ui/nav.tsx

"use client";

import type { ButtonProps } from "@/design-system/components/button/types/button.type";
import { Button } from "@/design-system/components/button/ui/button";

type NavButtonProps = ButtonProps;

export const NavButton = (props: NavButtonProps) => {
  // Props
  const { children, ...restProps } = props;

  return (
    <Button
      justifyContent={"start"}
      gap={3}
      variant={"ghost"}
      px={2}
      {...restProps}
    >
      {children}
    </Button>
  );
};
