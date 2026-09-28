import type { ButtonGroupProps } from "@/design-system/components/button/types/button-group.type";
import { ButtonGroup as ChakraButtonGroup } from "@chakra-ui/react";

export const ButtonGroup = (props: ButtonGroupProps) => {
  return <ChakraButtonGroup {...props} />;
};
