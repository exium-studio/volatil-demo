// src/features/internal/home/components/internal.home.publish-status-summary.tsx

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
import type { InternalHomePublishStatusSummaryProps } from "@/features/internal/home/types/internal.home.publish-status-summary.type";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

export const InternalHomePublishStatusSummary = (
  props: InternalHomePublishStatusSummaryProps,
) => {
  const { igtPublicationStatus } = useInternalHomeData();

  const totalPublikasi =
    igtPublicationStatus.active + igtPublicationStatus.inactive;
  const activePercent =
    totalPublikasi > 0
      ? Math.round((igtPublicationStatus.active / totalPublikasi) * 100)
      : 0;
  const statusData = [
    {
      name: "Aktif",
      value: igtPublicationStatus.active,
      color: "var(--chakra-colors-green-solid, #38a169)",
      fill: "var(--chakra-colors-green-solid, #38a169)",
    },
    {
      name: "Non-aktif",
      value: igtPublicationStatus.inactive,
      color: "var(--chakra-colors-border-emphasized, #a0aec0)",
      fill: "var(--chakra-colors-border-emphasized, #a0aec0)",
    },
  ];

  return (
    <Container.Root flex={"1 1 240px"} withContext={true} {...props}>
      <Container.Body gap={"md"} py={"md"}>
        <HStack justify={"space-between"} align={"center"} px={"md"}>
          <HStack gap={"xs"} align={"center"}>
            <Heading>{"Status Publikasi"}</Heading>
            <InfoTip
              variant={"icon"}
              appIconProps={{ size: "xs", color: "fg.subtle" }}
            >
              {"Proporsi layer IGT yang aktif dipublikasikan ke katalog Mitra"}
            </InfoTip>
          </HStack>
        </HStack>

        <VStack align={"center"} gap={"xs"} px={"md"}>
          <Box position={"relative"} w={"150px"} h={"150px"}>
            <ResponsiveContainer width={"100%"} height={"100%"}>
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie
                  data={statusData}
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
                  {statusData.map((entry) => (
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
                {`${activePercent}%`}
              </P>
              <P fontSize={"2xs"} color={"fg.subtle"} textAlign={"center"}>
                {"Layer Aktif"}
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
              <Box w={"8px"} h={"8px"} rounded={"full"} bg={"green.solid"} />
              <P fontSize={"xs"} color={"fg.subtle"}>
                {"Aktif:"}
              </P>
              <P fontSize={"xs"} fontWeight={"semibold"}>
                <FormatNumber value={igtPublicationStatus.active} />
              </P>
            </HStack>

            <HStack gap={"xs"} align={"center"}>
              <Box w={"8px"} h={"8px"} rounded={"full"} bg={"fg.subtle"} />
              <P fontSize={"xs"} color={"fg.subtle"}>
                {"Non-aktif:"}
              </P>
              <P fontSize={"xs"} fontWeight={"semibold"}>
                <FormatNumber value={igtPublicationStatus.inactive} />
              </P>
            </HStack>
          </HStack>
        </VStack>
      </Container.Body>
    </Container.Root>
  );
};
