// src/features/internal/home/components/internal.home.service-rate.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { StatGrid } from "@/design-system/components/data-display/ui/stat-grid";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import {
  Container,
  useContainerContext,
} from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { P } from "@/design-system/components/typography/ui/p";
import { PADDING, SPACING } from "@/design-system/constants/styles";
import type { InternalHomeServiceRateProps } from "@/features/internal/home/types/internal.home.service-rate.type";
import { useInternalHomeData } from "@/features/internal/home/hooks/use-internal-home.query";
import { FormatNumber } from "@/design-system/components/utilities/ui/fornat-number";
import { EditIcon } from "lucide-react";
import { Circle } from "@/design-system/components/layout/ui/box";

export const InternalHomeServiceRate = (
  props: InternalHomeServiceRateProps,
) => {
  return (
    <Container.Root flex={"1 1 350px"} withContext={true} {...props}>
      <Container.Body gap={4} pt={PADDING.md}>
        <InternalHomeServiceRateHeader />

        <VStack flex={1}>
          <Separator borderColor={"bg.canvas"} />

          <InternalHomeServiceRateStats />
        </VStack>
      </Container.Body>
    </Container.Root>
  );
};

const InternalHomeServiceRateHeader = () => {
  return (
    <HStack
      wrap={"wrap"}
      align={"center"}
      justify={"space-between"}
      gap={SPACING.md}
      px={PADDING.md}
    >
      <VStack gap={1} align={"start"}>
        <P fontSize={"lg"} fontWeight={"semibold"}>
          {"Tarif Jasa Akses IGT-PR"}
        </P>
        <P fontSize={"sm"} color={"fg.subtle"}>
          {"Pengaturan tarif bidang dan kawasan"}
        </P>
      </VStack>

      <Button primary variant={"solid"}>
        <AppIcon icon={EditIcon} />
        {"Perbarui"}
      </Button>
    </HStack>
  );
};

const InternalHomeServiceRateStats = () => {
  // Contexts
  const { isSmContainer } = useContainerContext();

  // Queries / Data
  const { serviceRates } = useInternalHomeData();

  const cols = isSmContainer ? 1 : 2;

  return (
    <StatGrid.Root columns={cols}>
      {serviceRates.map((rate, index) => (
        <StatGrid.Item key={rate.id} index={index} columns={cols}>
          <StatGrid.Header>
            <StatGrid.Label>{rate.title}</StatGrid.Label>

            <Circle bg={`${rate.colorPalette}.subtle`} p={PADDING.xs}>
              <AppIcon icon={rate.icon} color={`${rate.colorPalette}.fg`} />
            </Circle>
          </StatGrid.Header>

          <StatGrid.Value
            value={rate.price}
            isCurrency
            suffix={`/ ${rate.unit}`}
          />

          <StatGrid.Description>
            {"Minimal pembelian "}
            <FormatNumber value={rate.minPurchase} /> {rate.minUnit}
          </StatGrid.Description>
        </StatGrid.Item>
      ))}
    </StatGrid.Root>
  );
};
