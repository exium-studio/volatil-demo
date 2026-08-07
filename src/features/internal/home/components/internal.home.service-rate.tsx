// src/features/internal/home/components/internal.home.service-rate.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import {
  Container,
  useContainerContext,
} from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { SimpleGrid } from "@/design-system/components/layout/ui/grid";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { P } from "@/design-system/components/typography/ui/p";
import { Span } from "@/design-system/components/typography/ui/span";
import { FormatNumber } from "@/design-system/components/utilities/ui/fornat-number";
import { PADDING_MD, SPACING_MD } from "@/design-system/constants/styles";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import type {
  InternalHomeServiceRateCardProps,
  InternalHomeServiceRateProps,
} from "@/features/internal/home/types/internal.home.service-rate.type";
import { dummyInternalServiceRates } from "@/shared/constants/dummy-data/dummy-internal-home-data";
import { PencilIcon } from "lucide-react";

export const InternalHomeServiceRate = (
  props: InternalHomeServiceRateProps,
) => {
  return (
    <Container.Root flex={"1 1 350px"} withContext={true} {...props}>
      <Container.Body gap={4} pt={PADDING_MD}>
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
      gap={SPACING_MD}
      px={PADDING_MD}
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
        <AppIcon icon={PencilIcon} />
        {"Perbarui"}
      </Button>
    </HStack>
  );
};

const InternalHomeServiceRateCard = (
  props: InternalHomeServiceRateCardProps,
) => {
  // Props
  const { rate, ...restProps } = props;

  return (
    <VStack
      align={"start"}
      overflow={"clip"}
      position={"relative"}
      gap={2}
      h={"full"}
      p={PADDING_MD}
      {...restProps}
    >
      <HStack
        fontSize={"lg"}
        fontWeight={"semibold"}
        align={"center"}
        justify={"space-between"}
        gap={4}
        w={"full"}
      >
        <P color={"fg.muted"}>{rate.title}</P>

        <AppIcon
          icon={rate.icon}
          color={`${rate.colorPalette ?? "blue"}.fg`}
          fontSize={"md"}
        />
      </HStack>

      <VStack align={"start"} gap={0} mt={"auto"}>
        <P fontSize={"2xl"} fontWeight={"medium"}>
          <FormatNumber
            value={rate.price}
            style={"currency"}
            currency={"IDR"}
            maximumFractionDigits={0}
          />
          <Span
            fontSize={"xs"}
            color={"fg.subtle"}
            fontWeight={"normal"}
            ml={1}
          >
            / {rate.unit}
          </Span>
        </P>

        <P fontSize={"xs"} color={"fg.subtle"}>
          {"Minimal pembelian "}
          <FormatNumber value={rate.minPurchase} /> {rate.minUnit}
        </P>
      </VStack>
    </VStack>
  );
};

const InternalHomeServiceRateStats = () => {
  // Stores
  const { theme } = useThemeStore();

  // Contexts
  const { isSmContainer } = useContainerContext();

  const cols = isSmContainer ? 1 : 2;

  return (
    <SimpleGrid
      flex={1}
      columns={cols}
      overflow={"clip"}
      roundedBottom={theme.radii.container}
    >
      {dummyInternalServiceRates.map((rate, index) => {
        const isLastInRow = (index + 1) % cols === 0;
        const isNotFirstRow = index >= cols;

        return (
          <InternalHomeServiceRateCard
            key={rate.id}
            rate={rate}
            borderRight={isLastInRow ? undefined : "2px solid"}
            borderTop={isNotFirstRow ? "2px solid" : undefined}
            borderColor={"bg.canvas"}
          />
        );
      })}
    </SimpleGrid>
  );
};
