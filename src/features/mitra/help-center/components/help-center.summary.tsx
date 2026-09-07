// src/features/mitra/help-center/components/help-center.summary.tsx

import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Box } from "@/design-system/components/layout/ui/box";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { HeaderContainer } from "@/design-system/components/shell/ui/header-container";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { P } from "@/design-system/components/typography/ui/p";
import { useHelpCenterStatisticsQuery } from "@/features/mitra/help-center/hooks/use-help-center.query";
import type { HelpCenterSummaryProps } from "@/features/mitra/help-center/types/help-center.type";
import { CheckCircleIcon, ClockIcon, FileTextIcon } from "lucide-react";
import { memo } from "react";

export const HelpCenterSummary = memo((props: HelpCenterSummaryProps) => {
  // Props
  const { statistics: propsStats, scope } = props;

  // Queries
  const { statistics: queryStats } = useHelpCenterStatisticsQuery(scope);
  const stats = propsStats ?? queryStats;

  // Derived Summary Items
  const summaryItems = [
    {
      id: "total",
      label: "Total Laporan",
      count: stats.totalTickets,
      unit: "Laporan",
      icon: FileTextIcon,
      colorPalette: "blue",
    },
    {
      id: "active",
      label: "Laporan Aktif",
      count: stats.activeTickets,
      unit: "Laporan",
      icon: ClockIcon,
      colorPalette: "orange",
    },
    {
      id: "resolved",
      label: "Laporan Selesai",
      count: stats.resolvedTickets,
      unit: "Laporan",
      icon: CheckCircleIcon,
      colorPalette: "green",
    },
  ];

  return (
    <Container.Root withContext={true}>
      <Container.Body p={0}>
        <HeaderContainer>
          <Heading>{"Ringkasan Laporan"}</Heading>
        </HeaderContainer>

        <Separator borderColor={"bg.canvas"} />

        <HStack wrap={"wrap"} gap={"md"} w={"full"} p={"md"}>
          {summaryItems.map((item) => {
            return (
              <Box key={item.id} flex={"1 1 240px"} bg={"bg.body"}>
                <HStack align={"center"} gap={"sm"} w={"full"}>
                  <HStack gap={2} align={"center"}>
                    <Box
                      p={1.5}
                      rounded={"full"}
                      bg={`${item.colorPalette}.subtle`}
                      color={`${item.colorPalette}.fg`}
                      display={"flex"}
                      alignItems={"center"}
                      justifyContent={"center"}
                    >
                      <AppIcon icon={item.icon} size={"xs"} />
                    </Box>

                    <P fontWeight={"medium"} color={"fg.muted"}>
                      {item.label}:
                    </P>
                  </HStack>

                  <HStack gap={1} align={"baseline"}>
                    <P fontWeight={"semibold"}>{String(item.count)}</P>
                    <P color={"fg.muted"}>{item.unit}</P>
                  </HStack>
                </HStack>
              </Box>
            );
          })}
        </HStack>
      </Container.Body>
    </Container.Root>
  );
});
