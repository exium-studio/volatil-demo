// src/features/internal/home/components/internal.home.spatial-basis-summary.tsx

import {
  ChartTooltip,
  ChartTooltipContent,
} from "@/design-system/components/charts/ui/chart-tooltip";
import { InfoTip } from "@/design-system/components/input/ui/toggle-tip";
import { Box } from "@/design-system/components/layout/ui/box";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { P } from "@/design-system/components/typography/ui/p";
import { FormatNumber } from "@/design-system/components/utilities/ui/fornat-number";
import { useInternalHomeData } from "@/features/internal/home/hooks/use-internal-home.query";
import type { InternalHomeSpatialBasisSummaryProps } from "@/features/internal/home/types/internal.home.spatial-basis-summary.type";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

export const InternalHomeSpatialBasisSummary = (
  props: InternalHomeSpatialBasisSummaryProps,
) => {
  const { igtBasis } = useInternalHomeData();

  const totalLayer = igtBasis.field + igtBasis.area;
  const basisData = [
    {
      name: "Bidang",
      value: igtBasis.field,
      color: "var(--chakra-colors-blue-solid, #3182ce)",
      fill: "var(--chakra-colors-blue-solid, #3182ce)",
    },
    {
      name: "Kawasan",
      value: igtBasis.area,
      color: "var(--chakra-colors-orange-solid, #dd6b20)",
      fill: "var(--chakra-colors-orange-solid, #dd6b20)",
    },
  ];

  return (
    <Container.Root flex={"1 1 240px"} withContext={true} {...props}>
      <Container.Body gap={"md"} py={"md"}>
        <HStack justify={"space-between"} align={"center"} px={"md"}>
          <HStack gap={"xs"} align={"center"}>
            <Heading>{"Basis Spasial"}</Heading>
            <InfoTip
              variant={"icon"}
              appIconProps={{ size: "xs", color: "fg.subtle" }}
            >
              {"Proporsi layer IGT berbasis Bidang vs Kawasan"}
            </InfoTip>
          </HStack>
        </HStack>

        <VStack align={"center"} gap={"xs"} px={"md"}>
          <Box position={"relative"} w={"150px"} h={"150px"}>
            <ResponsiveContainer width={"100%"} height={"100%"}>
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie
                  data={basisData}
                  dataKey={"value"}
                  nameKey={"name"}
                  cx={"50%"}
                  cy={"50%"}
                  innerRadius={46}
                  outerRadius={66}
                  paddingAngle={3}
                  stroke={"none"}
                  isAnimationActive={false}
                >
                  {basisData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Center Label */}
            <VStack
              position={"absolute"}
              inset={0}
              align={"center"}
              justify={"center"}
              gap={0}
              pointerEvents={"none"}
            >
              <P fontSize={"lg"} fontWeight={"bold"} lineHeight={1}>
                <FormatNumber value={totalLayer} />
              </P>
              <P fontSize={"2xs"} color={"fg.subtle"} textAlign={"center"}>
                {"Total Layer"}
              </P>
            </VStack>
          </Box>

          {/* Legend */}
          <HStack
            gapX={"md"}
            gapY={"sm"}
            justify={"center"}
            wrap={"wrap"}
            mt={"xs"}
          >
            <HStack gap={"xs"} align={"center"}>
              <Box w={"8px"} h={"8px"} rounded={"full"} bg={"blue.solid"} />
              <P fontSize={"xs"} color={"fg.subtle"}>
                {"Bidang:"}
              </P>
              <P fontSize={"xs"} fontWeight={"semibold"}>
                <FormatNumber value={igtBasis.field} />
              </P>
            </HStack>

            <HStack gap={"xs"} align={"center"}>
              <Box w={"8px"} h={"8px"} rounded={"full"} bg={"orange.solid"} />
              <P fontSize={"xs"} color={"fg.subtle"}>
                {"Kawasan:"}
              </P>
              <P fontSize={"xs"} fontWeight={"semibold"}>
                <FormatNumber value={igtBasis.area} />
              </P>
            </HStack>
          </HStack>
        </VStack>
      </Container.Body>
    </Container.Root>
  );
};
