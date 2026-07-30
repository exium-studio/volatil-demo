// src/design-system/components/charts/ui/chart-tooltip.tsx

import type {
  ChartTooltipContentProps,
  ChartTooltipProps,
} from "@/design-system/components/charts/types/chart-tooltip.type.type";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { P } from "@/design-system/components/typography/ui/p";
import { Tooltip } from "recharts";

export const ChartTooltip = (props: ChartTooltipProps) => {
  return <Tooltip isAnimationActive={false} {...props} />;
};

export const ChartTooltipContent = (props: ChartTooltipContentProps) => {
  // Props
  const { active, payload, label } = props;

  // const dataKey = payload?.[0]?.dataKey;
  // const value = payload?.[0]?.value;
  // const color = payload?.[0]?.color;
  // const name = payload?.[0]?.name;
  // const unit = payload?.[0]?.unit;
  // const fullPayload = payload?.[0]?.payload;

  if (!active || !payload?.length) return null;

  return (
    <VStack align={"start"} gap={1}>
      <P fontSize={"xs"} color={"fg.muted"}>
        {label}
      </P>

      {payload.map((entry) => (
        <HStack key={String(entry.name)} gap={2}>
          <Box
            w={2}
            h={2}
            rounded={"full"}
            bg={String(entry.color)}
            flexShrink={0}
          />

          <P>
            {String(entry.name)}: {String(entry.value)}
          </P>
        </HStack>
      ))}
    </VStack>
  );
};
