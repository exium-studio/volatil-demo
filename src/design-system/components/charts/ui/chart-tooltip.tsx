// src/design-system/components/charts/ui/chart-tooltip.tsx

import type {
  ChartTooltipContentProps,
  ChartTooltipProps,
} from "@/design-system/components/charts/types/chart-tooltip.type.type";
import { Circle } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { P } from "@/design-system/components/typography/ui/p";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { formatNumber } from "@/shared/utils/formatter/number.formatter";
import { Tooltip } from "recharts";

export const ChartTooltip = (props: ChartTooltipProps) => {
  const { wrapperStyle, ...rest } = props;

  return (
    <Tooltip
      isAnimationActive={false}
      wrapperStyle={{ zIndex: 10, ...wrapperStyle }}
      {...rest}
    />
  );
};

export const ChartTooltipContent = (props: ChartTooltipContentProps) => {
  // Props
  const { active, payload, label } = props;

  // Stores
  const { theme } = useThemeStore();

  // const dataKey = payload?.[0]?.dataKey;
  // const value = payload?.[0]?.value;
  // const color = payload?.[0]?.color;
  // const name = payload?.[0]?.name;
  // const unit = payload?.[0]?.unit;
  // const fullPayload = payload?.[0]?.payload;

  if (!active || !payload?.length) return null;

  return (
    <VStack
      align={"start"}
      gap={"2xs"}
      p={"sm"}
      rounded={theme.radii.component}
      bg={"bg.body"}
      shadow={"sm"}
      zIndex={2}
    >
      {label && (
        <P fontSize={"xs"} color={"fg.muted"}>
          {label}
        </P>
      )}

      {payload.map((entry) => {
        const payloadItem = entry.payload as
          | Record<string, unknown>
          | undefined;
        const color =
          entry.color ??
          (payloadItem?.color as string | undefined) ??
          (payloadItem?.fill as string | undefined) ??
          "fg";

        return (
          <HStack key={String(entry.name)} align={"center"} gap={2}>
            <Circle w={2} h={2} mt={"2px"} bg={String(color)} flexShrink={0} />

            <P>
              {String(entry.name)}:{" "}
              {entry.value ? formatNumber(Number(entry.value)) : "-"}
            </P>
          </HStack>
        );
      })}
    </VStack>
  );
};
