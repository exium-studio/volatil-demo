// src/features/internal/home/components/internal.home.mitra-registration.tsx

import { InfoTip } from "@/design-system/components/input/ui/toggle-tip";
import { Box } from "@/design-system/components/layout/ui/box";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { P } from "@/design-system/components/typography/ui/p";
import { Span } from "@/design-system/components/typography/ui/span";
import { FormatNumber } from "@/design-system/components/utilities/ui/fornat-number";
import { useInternalHomeData } from "@/features/internal/home/hooks/use-internal-home.query";
import type { InternalHomeMitraRegistrationProps } from "@/features/internal/home/types/internal.home.mitra-registration.type";
import { Chart, useChart } from "@chakra-ui/charts";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";

export const InternalHomeMitraRegistration = (
  props: InternalHomeMitraRegistrationProps,
) => {
  const { mitraRegistration } = useInternalHomeData();

  const chartData = [
    {
      category: "Status",
      active: mitraRegistration.active,
      pending: mitraRegistration.pendingVerification,
    },
  ];

  const chart = useChart({
    data: chartData,
    series: [
      { name: "active", label: "Mitra Aktif", color: "teal.solid" },
      { name: "pending", label: "Pending Verifikasi", color: "orange.solid" },
    ],
  });

  return (
    <Container.Root flex={"1 1 280px"} withContext={true} {...props}>
      <Container.Body justify={"space-between"} gap={"md"} py={"md"}>
        <HStack justify={"space-between"} align={"center"} px={"md"}>
          <HStack gap={"xs"} align={"center"}>
            <Heading>{"Registrasi Mitra"}</Heading>
            <InfoTip
              variant={"icon"}
              appIconProps={{ size: "xs", color: "fg.subtle" }}
            >
              {
                "Jumlah mitra aktif dan permohonan pendaftaran yang menunggu verifikasi"
              }
            </InfoTip>
          </HStack>
        </HStack>

        <VStack align={"stretch"} gap={"xs"} px={"md"}>
          <Chart.Root maxH={"150px"} chart={chart}>
            <BarChart
              data={chart.data}
              responsive
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                stroke={chart.color("border.muted")}
                vertical={false}
              />
              <XAxis
                dataKey={chart.key("category")}
                axisLine={false}
                stroke={chart.color("border")}
                tickLine={false}
                tickMargin={10}
                hide
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                stroke={chart.color("border")}
                tickMargin={10}
                allowDecimals={false}
              />
              <Tooltip
                cursor={{ fill: chart.color("bg.muted") }}
                animationDuration={0}
                content={<Chart.Tooltip />}
              />
              {chart.series.map((item) => (
                <Bar
                  isAnimationActive={false}
                  key={item.name}
                  dataKey={chart.key(item.name)}
                  name={String(item.label ?? item.name)}
                  fill={chart.color(item.color)}
                  radius={[4, 4, 0, 0]}
                  barSize={32}
                />
              ))}
            </BarChart>
          </Chart.Root>

          {/* Legend */}
          <HStack
            gapX={"md"}
            gapY={"sm"}
            justify={"center"}
            wrap={"wrap"}
            mt={"xs"}
          >
            <HStack gap={"xs"} align={"center"}>
              <Box w={"8px"} h={"8px"} rounded={"full"} bg={"teal.solid"} />
              <P fontSize={"xs"} color={"fg.subtle"}>
                {"Aktif:"}
              </P>
              <P fontSize={"xs"} fontWeight={"semibold"}>
                <FormatNumber value={mitraRegistration.active} />
                <Span ml={1} color={"fg.subtle"} fontWeight={"normal"}>
                  {"Mitra"}
                </Span>
              </P>
            </HStack>

            <HStack gap={"xs"} align={"center"}>
              <Box w={"8px"} h={"8px"} rounded={"full"} bg={"orange.solid"} />
              <P fontSize={"xs"} color={"fg.subtle"}>
                {"Pending:"}
              </P>
              <P fontSize={"xs"} fontWeight={"semibold"}>
                <FormatNumber value={mitraRegistration.pendingVerification} />
                <Span ml={1} color={"fg.subtle"} fontWeight={"normal"}>
                  {"Mitra"}
                </Span>
              </P>
            </HStack>
          </HStack>
        </VStack>
      </Container.Body>
    </Container.Root>
  );
};
