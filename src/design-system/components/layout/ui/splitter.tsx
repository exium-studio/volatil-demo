// src/design-system/components/layout/ui/splitter.tsx

import type {
  SplitterPanelProps,
  SplitterResizeTriggerIndicatorProps,
  SplitterResizeTriggerProps,
  SplitterRootProps,
} from "@/design-system/components/layout/types/splitter.type";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import { Splitter as ChakraSplitter } from "@chakra-ui/react";
import { forwardRef } from "react";

const SplitterRoot = forwardRef<HTMLDivElement, SplitterRootProps>(
  (props, ref) => {
    return <ChakraSplitter.Root ref={ref} {...props} />;
  },
);

const SplitterPanel = forwardRef<HTMLDivElement, SplitterPanelProps>(
  (props, ref) => {
    return <ChakraSplitter.Panel ref={ref} {...props} />;
  },
);

const SplitterResizeTrigger = forwardRef<
  HTMLButtonElement,
  SplitterResizeTriggerProps
>((props, ref) => {
  // Stores
  const { theme } = useThemeStore();

  return (
    <ChakraSplitter.Context>
      {(context) => (
        <ChakraSplitter.ResizeTrigger
          ref={ref}
          onDoubleClick={() => {
            context.resetSizes();
          }}
          {...props}
        >
          <Splitter.ResizeTriggerIndicator
            bg={"bg.body"}
            _hover={{
              bg: "bg.subtle",
            }}
            _active={{
              bg: `${theme.colorPalette}.fg`,
            }}
          />
          <Splitter.ResizeTriggerSeparator />
        </ChakraSplitter.ResizeTrigger>
      )}
    </ChakraSplitter.Context>
  );
});

const SplitterResizeTriggerIndicator = (
  props: SplitterResizeTriggerIndicatorProps,
) => {
  return <ChakraSplitter.ResizeTriggerIndicator {...props} />;
};

const SplitterResizeTriggerSeparator = (
  props: SplitterResizeTriggerIndicatorProps,
) => {
  return <ChakraSplitter.ResizeTriggerSeparator {...props} />;
};

export const Splitter = {
  Root: SplitterRoot,
  Panel: SplitterPanel,
  ResizeTrigger: SplitterResizeTrigger,
  ResizeTriggerIndicator: SplitterResizeTriggerIndicator,
  ResizeTriggerSeparator: SplitterResizeTriggerSeparator,
};
