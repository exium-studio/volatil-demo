// src/features/internal/home/components/internal.home.service-rate.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { SimpleGrid } from "@/design-system/components/layout/ui/grid";
import { P } from "@/design-system/components/typography/ui/p";
import { Span } from "@/design-system/components/typography/ui/span";
import { FormatNumber } from "@/design-system/components/utilities/ui/fornat-number";
import {
  PADDING_MD,
  PADDING_SM,
  SPACING_MD,
} from "@/design-system/constants/styles";
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
      <Container.Body gap={4} py={PADDING_MD}>
        <InternalHomeServiceRateHeader />

        <SimpleGrid columns={2} gap={PADDING_SM} px={PADDING_SM} mt={"auto"}>
          {dummyInternalServiceRates.map((rate) => (
            <InternalHomeServiceRateCard key={rate.id} rate={rate} />
          ))}
        </SimpleGrid>
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

  // Stores
  const { theme } = useThemeStore();

  return (
    <VStack
      align={"start"}
      gap={3}
      p={PADDING_MD}
      bg={"bg.canvas"}
      rounded={theme.radii.container}
      border={"1px solid"}
      borderColor={"border.subtle"}
      {...restProps}
    >
      <HStack gap={2} align={"center"}>
        <AppIcon
          icon={rate.icon}
          color={`${rate.colorPalette ?? "blue"}.fg`}
          fontSize={"md"}
        />
        <P fontSize={"sm"} fontWeight={"semibold"}>
          {rate.title}
        </P>
      </HStack>

      <VStack align={"start"} mt={"auto"}>
        <P fontSize={"xl"} fontWeight={"bold"}>
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
