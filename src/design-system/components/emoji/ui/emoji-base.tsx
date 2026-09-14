// src/design-system/components/emoji/ui/emoji-base.tsx

import { Box } from "@/design-system/components/layout/ui/box";
import type { EmojiProps, EmojiSize } from "@/design-system/components/emoji/types/emoji.type";
import type { FC, SVGProps } from "react";

const SIZES_MAP: Record<string, number> = {
  sm: 32,
  md: 48,
  lg: 64,
  xl: 96,
};

export type EmojiSvgProps = SVGProps<SVGSVGElement> & {
  colorPalette?: string;
};

export type EmojiBaseProps = EmojiProps & {
  SvgComponent: FC<EmojiSvgProps>;
};

export const EmojiBase = (props: EmojiBaseProps) => {
  const {
    SvgComponent,
    size = "md",
    colorPalette = "neutral",
    ...restProps
  } = props;

  const dimension =
    typeof size === "number" ? size : SIZES_MAP[size] || SIZES_MAP.md;

  return (
    <Box
      display={"inline-flex"}
      alignItems={"center"}
      justifyContent={"center"}
      flexShrink={0}
      w={`${dimension}px`}
      h={`${dimension}px`}
      {...restProps}
    >
      <SvgComponent
        width={"100%"}
        height={"100%"}
        colorPalette={colorPalette}
        style={{ display: "block", overflow: "visible" }}
      />
    </Box>
  );
};
