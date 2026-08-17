// src/features/mitra/support-ticket/components/support-ticket.summary-item.tsx

import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { P } from "@/design-system/components/typography/ui/p";
import { PADDING, SPACING } from "@/design-system/constants/styles";
import { useThemeStore } from "@/design-system/stores/theme-store";
import type { TicketSummaryMetrics } from "@/features/mitra/support-ticket/types/support-ticket.type";
import { CheckCircle2Icon, ClockIcon, FileTextIcon } from "lucide-react";
import { memo } from "react";

export type SupportTicketSummaryProps = {
  metrics: TicketSummaryMetrics;
};

export const SupportTicketSummary = memo((props: SupportTicketSummaryProps) => {
  // Props
  const { metrics } = props;

  // Stores
  const { theme } = useThemeStore();

  // Derived Summary Items
  const summaryItems = [
    {
      id: "active",
      label: "Laporan Aktif",
      count: metrics.activeCount,
      unit: "Laporan",
      icon: ClockIcon,
      colorPalette: "blue",
    },
    {
      id: "resolved",
      label: "Laporan Selesai",
      count: metrics.resolvedCount,
      unit: "Laporan",
      icon: CheckCircle2Icon,
      colorPalette: "green",
    },
    {
      id: "total",
      label: "Total Laporan",
      count: metrics.totalCount,
      unit: "Laporan",
      icon: FileTextIcon,
      colorPalette: "gray",
    },
  ];

  return (
    <HStack wrap={"wrap"} gap={SPACING.xs} w={"full"} p={PADDING.md}>
      {summaryItems.map((item) => {
        return (
          <Box
            key={item.id}
            flex={1}
            minW={"180px"}
            bg={"bg.body"}
            rounded={theme.radii.component}
          >
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
