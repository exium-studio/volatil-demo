import type { RadioIndicatorProps } from "@/design-system/components/input/types/radio-indicator.type";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { Circle } from "@chakra-ui/react";
import { forwardRef } from "react";

export const RadioIndicator = forwardRef<HTMLDivElement, RadioIndicatorProps>(
  function RadioIndicator(props, ref) {
    // Props
    const { checked = false, size = "18px", ...restProps } = props;

    // Stores
    const { theme } = useThemeStore();

    return (
      <Circle
        ref={ref}
        size={size}
        borderWidth={checked ? "5px" : "1.5px"}
        borderColor={
          checked ? `${theme.colorPalette}.solid` : "border.emphasized"
        }
        bg={"bg.body"}
        transition={"all 0.15s ease-in-out"}
        flexShrink={0}
        {...restProps}
      />
    );
  },
);
