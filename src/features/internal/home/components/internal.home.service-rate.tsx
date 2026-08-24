// src/features/internal/home/components/internal.home.service-rate.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { StatGrid } from "@/design-system/components/data-display/ui/stat-grid";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { InfoTip } from "@/design-system/components/input/ui/toggle-tip";
import { Container, useContainerContext } from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { SPACING } from "@/design-system/constants/styles";
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
      <Container.Body gap={4} pt={SPACING.md}>
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
      px={SPACING.md}
    >
      <HStack gap={SPACING.xs} align={"center"}>
        <Heading>
          {"Tarif Jasa Akses IGT-PR"}
        </Heading>

        <InfoTip
          variant={"icon"}
          appIconProps={{
            size: "xs",
            color: "fg.subtle",
          }}
        >
          {"Pengaturan tarif bidang dan kawasan"}
        </InfoTip>
      </HStack>

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

            <Circle bg={`${rate.colorPalette}.subtle`} p={SPACING.xs}>
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
