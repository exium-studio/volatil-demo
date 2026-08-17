// src/features/mitra/help-center/components/help-center.summary.tsx

import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { P } from "@/design-system/components/typography/ui/p";
import { PADDING, SPACING } from "@/design-system/constants/styles";
import type { HelpCenterStatistics } from "@/features/mitra/help-center/types/help-center.type";
import { CheckCircle2Icon, ClockIcon, FileTextIcon } from "lucide-react";
import { memo } from "react";

export type HelpCenterSummaryProps = {
  statistics: HelpCenterStatistics;
};

export const HelpCenterSummary = memo((props: HelpCenterSummaryProps) => {
  // Props
  const { statistics } = props;

  // Derived Summary Items
  const summaryItems = [
    {
      id: "active",
      label: "Laporan Aktif",
      count: statistics.activeTickets,
      unit: "Laporan",
      icon: ClockIcon,
      colorPalette: "blue",
    },
    {
      id: "resolved",
      label: "Laporan Selesai",
      count: statistics.resolvedTickets,
      unit: "Laporan",
      icon: CheckCircle2Icon,
      colorPalette: "green",
    },
    {
      id: "total",
      label: "Total Laporan",
      count: statistics.totalTickets,
      unit: "Laporan",
      icon: FileTextIcon,
      colorPalette: "gray",
    },
  ];

  return (
    <HStack wrap={"wrap"} gap={SPACING.xs} w={"full"} p={PADDING.md}>
      {summaryItems.map((item) => {
        return (
          <Box key={item.id} flex={"1 1 200px"} bg={"bg.body"}>
            <HStack align={"center"} gap={SPACING.sm} w={"full"}>
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
                <P fontWeight={"bold"}>{String(item.count)}</P>
                <P color={"fg.muted"}>{item.unit}</P>
              </HStack>
            </HStack>
          </Box>
        );
      })}
    </HStack>
  );
});
