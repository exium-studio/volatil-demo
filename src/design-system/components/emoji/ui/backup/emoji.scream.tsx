// src/design-system/components/emoji/ui/backup/emoji.scream.tsx

import { resolveSemanticColor } from "@/design-system/chakra/utils/chakra-system-resolver";
import type { EmojiProps } from "@/design-system/components/emoji/types/emoji.type";
import { useColorMode } from "@/design-system/hooks/use-color-mode";

export const EmojiScream = ({
  colorPalette = "gray",
  boxSize = 24,
}: EmojiProps) => {
  // Hooks
  const { colorMode } = useColorMode();

  // Colors
  const solid =
    resolveSemanticColor(`${colorPalette}.solid`, colorMode) ?? "#000000";
  const emphasized =
    resolveSemanticColor(`${colorPalette}.emphasized`, colorMode) ?? "#e6e6e6";
  const muted =
    resolveSemanticColor(`${colorPalette}.muted`, colorMode) ?? "#cccccc";

  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      xmlSpace={"preserve"}
      width={boxSize}
      height={boxSize}
      viewBox={"0 0 16.33 17.32"}
    >
      <g>
        {/* Background circle */}
        <circle cx={"8.17"} cy={"8.17"} r={"8.17"} fill={emphasized} />
        {/* Face overlay */}
        <path
          fill={muted}
          d={
            "M7.63 2.71c3.98,0 7.21,3.23 7.21,7.21 0,1.86 -0.71,3.56 -1.87,4.84 -1.35,0.98 -3.01,1.56 -4.81,1.56 -3.54,0 -6.55,-2.25 -7.69,-5.4 -0.05,-0.33 -0.07,-0.66 -0.07,-1.01 0,-3.98 3.23,-7.21 7.21,-7.21z"
          }
        />
        {/* Eyes */}
        <ellipse
          fill={solid}
          transform={
            "matrix(1.07467 -0.357662 0.357662 1.07467 8.99783 8.05745)"
          }
          rx={"0.93"}
          ry={"1.73"}
        />
        <ellipse
          fill={solid}
          transform={
            "matrix(1.07467 -0.357662 0.357662 1.07467 3.32932 8.81784)"
          }
          rx={"0.93"}
          ry={"1.73"}
        />
        {/* Mouth */}
        <ellipse
          fill={solid}
          transform={"matrix(1.32571 -0.44121 0.44121 1.32571 7.27 13.2902)"}
          rx={"0.93"}
          ry={"1.73"}
        />
        {/* Hands */}
        <path
          fill={muted}
          d={
            "M2.78 17.31c0,0 1.08,0.09 1.35,-0.9 0.27,-1 0.62,-1.29 0.32,-1.79 -0.3,-0.5 -2.73,-3.86 -3.08,-3.86 -0.34,0 -0.67,0.51 -0.12,1.74 0.55,1.23 0.71,1.29 0.61,2.02 -0.1,0.72 -0.48,2.33 0.92,2.79z"
          }
        />
        <path
          fill={muted}
          d={
            "M12.05 16.92c-0.6,-0.72 -1.64,-0.95 -1.69,-1.69 -0.05,-0.74 0.21,-3.17 1.57,-5.09 1.36,-1.92 2.22,-1.29 1.97,0.53 -0.25,1.83 -0.58,3.72 -0.37,4.39 0.21,0.67 0.67,1.39 0.02,1.9 -0.65,0.51 -1.5,-0.05 -1.5,-0.05z"
          }
        />
      </g>
    </svg>
  );
};
