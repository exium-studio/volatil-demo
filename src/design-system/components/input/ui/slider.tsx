// src/design-system/components/input/ui/slider.tsx

import type { SliderProps } from "@/design-system/components/input/types/slider.type";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import { Slider as ChakraSlider } from "@chakra-ui/react";
import * as React from "react";

export const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  function Slider(props, ref) {
    // Props
    const { label, showValue = false, marks, ...restProps } = props;

    // Stores
    const { theme } = useThemeStore();

    const hasMarks = marks && marks.length > 0;

    return (
      <ChakraSlider.Root
        ref={ref}
        colorPalette={theme.colorPalette}
        {...restProps}
      >
        {(label || showValue) && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 4,
            }}
          >
            {label && <ChakraSlider.Label>{label}</ChakraSlider.Label>}

            {showValue && <ChakraSlider.ValueText />}
          </div>
        )}

        <ChakraSlider.Control cursor={"pointer"}>
          <ChakraSlider.Track>
            <ChakraSlider.Range />
          </ChakraSlider.Track>

          <ChakraSlider.Thumb index={0} />
        </ChakraSlider.Control>

        {hasMarks && (
          <ChakraSlider.MarkerGroup>
            {marks.map((mark) => {
              const val = typeof mark === "number" ? mark : mark.value;
              const labelNode =
                typeof mark === "number" ? String(mark) : mark.label;
              return (
                <ChakraSlider.Marker key={val} value={val}>
                  {labelNode}
                </ChakraSlider.Marker>
              );
            })}
          </ChakraSlider.MarkerGroup>
        )}
      </ChakraSlider.Root>
    );
  },
);
