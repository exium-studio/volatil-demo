// src/features/home/components/home.cart-summary.tsx

import { SegmentGroupInput } from "@/design-system/components/input/ui/segment-group-input";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { P } from "@/design-system/components/typography/ui/p";
import {
  PADDING_LG,
  PADDING_MD,
  SPACING_MD,
} from "@/design-system/constants/styles";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import { Chart, useChart } from "@chakra-ui/charts";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

export const HomeFinancialFlow = () => {
  return (
    <Container.Root flex={"1 1 500px"} withContext={true}>
      <Container.Body gap={4} pt={PADDING_MD}>
        <Header />

        <VStack mt={"auto"}>
          <ChartContent />
        </VStack>
      </Container.Body>
    </Container.Root>
  );
};

const Header = () => {
  return (
    <HStack
      wrap={"wrap"}
      align={"center"}
      justify={"space-between"}
      gap={SPACING_MD}
      px={PADDING_MD}
    >
      <VStack gap={1}>
        <P>Statistik Alur Keuangan</P>
        <P fontSize={"sm"} color={"fg.subtle"}>
          Statistik alur keuangan pembelian data Anda
        </P>
      </VStack>

      <SegmentGroupInput
        defaultValue={"all"}
        options={[
          { value: "1h", label: "1H" },
          { value: "1w", label: "1M" },
          { value: "1b", label: "1B" },
          { value: "1t", label: "1T" },
          { value: "all", label: "Semua", flex: 1 },
        ]}
      />
    </HStack>
  );
};

const ChartContent = () => {
  // Stores
  const { theme } = useThemeStore();

  const chart = useChart({
    data: [
      { sale: 10, month: "January" },
      { sale: 95, month: "February" },
      { sale: 87, month: "March" },
      { sale: 88, month: "May" },
      { sale: 65, month: "June" },
      { sale: 90, month: "August" },
    ],
    series: [{ name: "sale", color: `${theme.colorPalette}.solid` }],
  });

  return (
    <Chart.Root maxH={"240px"} chart={chart} pr={PADDING_LG}>
      <LineChart data={chart.data} responsive>
        <CartesianGrid stroke={chart.color("border")} vertical={false} />
        <XAxis
          axisLine={false}
          dataKey={chart.key("month")}
          tickFormatter={(value) => value.slice(0, 3)}
          stroke={chart.color("border")}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tickMargin={10}
          stroke={chart.color("border")}
        />
        {chart.series.map((item) => (
          <Line
            type={"linear"}
            key={item.name}
            isAnimationActive={false}
            dataKey={chart.key(item.name)}
            stroke={chart.color(item.color)}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </LineChart>
    </Chart.Root>
  );
};
