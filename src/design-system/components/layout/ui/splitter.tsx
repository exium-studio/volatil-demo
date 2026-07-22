// src/design-system/components/layout/ui/splitter.tsx

import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import type {
  SplitterPanelProps,
  SplitterResizeTriggerIndicatorProps,
  SplitterResizeTriggerProps,
  SplitterRootProps,
} from "@/design-system/components/layout/types/splitter.type";
import { Splitter as ChakraSplitter } from "@chakra-ui/react";
import { GripVertical } from "lucide-react";
import { forwardRef } from "react";

const SplitterRoot = forwardRef<HTMLDivElement, SplitterRootProps>(
  (props, ref) => {
    return <ChakraSplitter.Root ref={ref} keyboardResizeBy={1} {...props} />;
  },
);

const SplitterPanel = forwardRef<HTMLDivElement, SplitterPanelProps>(
  (props, ref) => {
    return (
      <ChakraSplitter.Panel
        ref={ref}
        display={"flex"}
        flexDir={"column"}
        {...props}
      />
    );
  },
);

const SplitterResizeTrigger = forwardRef<
  HTMLButtonElement,
  SplitterResizeTriggerProps
>((props, ref) => {
  return (
    <ChakraSplitter.Context>
      {(context) => (
        <ChakraSplitter.ResizeTrigger
          ref={ref}
          className={"group"}
          transition={"200ms"}
          w={"8px"}
          _hover={{
            bg: "border",
          }}
          onDoubleClick={() => {
            context.resetSizes();
          }}
          {...props}
        >
          <Splitter.ResizeTriggerIndicator
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            bg={"bg.body"}
            w={"16px"}
            h={"80px"}
            opacity={0}
            transform={"translateX(-4px)"}
            transition={"200ms"}
            _groupHover={{
              opacity: 1,
            }}
          >
            <AppIcon icon={GripVertical} size={"sm"} color={"fg.subtle"} />
          </Splitter.ResizeTriggerIndicator>

          <Splitter.ResizeTriggerSeparator bg={"border"} />
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
