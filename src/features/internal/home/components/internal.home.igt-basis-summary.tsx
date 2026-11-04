// src/features/internal/home/components/internal.home.igt-basis-summary.tsx

import {
  ChartTooltip,
  ChartTooltipContent,
} from "@/design-system/components/charts/ui/chart-tooltip";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { InfoTip } from "@/design-system/components/input/ui/toggle-tip";
import { Box } from "@/design-system/components/layout/ui/box";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { P } from "@/design-system/components/typography/ui/p";
import { FormatNumber } from "@/design-system/components/utilities/ui/fornat-number";
import { useInternalIgtBasisQuery } from "@/features/internal/home/hooks/use-internal-home.query";
import type { InternalHomeIgtBasisSummaryProps } from "@/features/internal/home/types/internal.home.igt-basis-summary.type";
import { useNavigate } from "@tanstack/react-router";
import { Pie, PieChart, ResponsiveContainer, Sector } from "recharts";

export const InternalHomeIgtBasisSummary = (
  props: InternalHomeIgtBasisSummaryProps,
) => {
  // Hooks
  const navigate = useNavigate();
  const { igtBasis, isLoading } = useInternalIgtBasisQuery();

  // Handlers
  const handleFilterBasis = (basis: "bidang" | "kawasan") => {
    void navigate({
      to: "/internal/master-igt-layer",
      search: { basisIgt: basis },
    });
  };

  if (isLoading) {
    return (
      <Container.Root flex={"1 1 300px"} withContext={true} {...props}>
        <Skeleton minH={"240px"} w={"full"} />
      </Container.Root>
    );
  }

  // Derived Values
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
    <Container.Root flex={"1 1 300px"} withContext={true} {...props}>
      <Container.Body gap={"md"} py={"md"}>
        <HStack justify={"space-between"} align={"center"} px={"md"}>
          <HStack gap={"xs"} align={"center"}>
            <Heading>{"Basis IGT"}</Heading>
            <InfoTip
              variant={"icon"}
              appIconProps={{ size: "xs", color: "fg.subtle" }}
            >
              {"Proporsi layer IGT berbasis Bidang vs Kawasan"}
            </InfoTip>
          </HStack>
        </HStack>

        <HStack
          align={"center"}
          justify={"space-between"}
          gap={"md"}
          px={"md"}
          py={"xs"}
        >
          {/* Donut Chart */}
          <Box position={"relative"} w={"140px"} h={"140px"} flexShrink={0}>
            <ResponsiveContainer width={"100%"} height={"100%"}>
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie
                  data={basisData}
                  dataKey={"value"}
                  nameKey={"name"}
                  cx={"50%"}
                  cy={"50%"}
                  innerRadius={44}
                  outerRadius={64}
                  paddingAngle={3}
                  stroke={"none"}
                  isAnimationActive={false}
                  shape={(props) => (
                    <Sector
                      {...props}
                      fill={
                        props.fill ||
                        (props.payload as (typeof basisData)[number])?.color
                      }
                      cursor={"pointer"}
                      onClick={() =>
                        handleFilterBasis(
                          (props.payload as (typeof basisData)[number])
                            ?.name === "Bidang"
                            ? "bidang"
                            : "kawasan",
                        )
                      }
                    />
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </Box>

          {/* Right Section: Big Total Number & Legend */}
          <VStack align={"start"} gap={"sm"} flex={1} minW={0}>
            {/* Big Main Number */}
            <VStack align={"start"} gap={"xs"}>
              <P fontSize={"3xl"} fontWeight={"bold"} lineHeight={1}>
                <FormatNumber value={totalLayer} />
              </P>
              <P fontSize={"xs"} color={"fg.subtle"}>
                {"Total Layer"}
              </P>
            </VStack>

            {/* Legend List */}
            <VStack align={"start"} gap={"xs"} w={"full"}>
              <HStack
                gap={"xs"}
                align={"center"}
                cursor={"pointer"}
                onClick={() => handleFilterBasis("bidang")}
                _hover={{ opacity: 0.8 }}
              >
                <Box w={"8px"} h={"8px"} rounded={"full"} bg={"blue.solid"} />
                <P fontSize={"xs"} color={"fg.subtle"}>
                  {"Bidang:"}
                </P>
                <P fontSize={"xs"} fontWeight={"semibold"}>
                  <FormatNumber value={igtBasis.field} />
                </P>
              </HStack>

              <HStack
                gap={"xs"}
                align={"center"}
                cursor={"pointer"}
                onClick={() => handleFilterBasis("kawasan")}
                _hover={{ opacity: 0.8 }}
              >
                <Box w={"8px"} h={"8px"} rounded={"full"} bg={"orange.solid"} />
                <P fontSize={"xs"} color={"fg.subtle"}>
                  {"Kawasan:"}
                </P>
                <P fontSize={"xs"} fontWeight={"semibold"}>
                  <FormatNumber value={igtBasis.area} />
                </P>
              </HStack>
            </VStack>
          </VStack>
        </HStack>
      </Container.Body>
    </Container.Root>
  );
};
