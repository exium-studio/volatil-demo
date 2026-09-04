import { IconButton } from "@/design-system/components/button/ui/button";
import { StatGrid } from "@/design-system/components/data-display/ui/stat-grid";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { InfoTip } from "@/design-system/components/input/ui/toggle-tip";
import { Circle } from "@/design-system/components/layout/ui/box";
import {
  Container,
  useContainerContext,
} from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { FormatNumber } from "@/design-system/components/utilities/ui/fornat-number";
import { InternalHomeServiceRateModalTrigger } from "@/features/internal/home/components/internal.home.service-rate-modal";
import type {
  InternalHomeServiceRateItem,
  InternalHomeServiceRateProps,
} from "@/features/internal/home/types/internal.home.service-rate.type";
import { useInternalPricingListQuery } from "@/features/internal/pricing/hooks/use-internal-pricing";
import { IGT_BASIS_MAP } from "@/shared/constants/status.config";
import { PencilIcon } from "lucide-react";
import { useMemo } from "react";

export const InternalHomeServiceRate = (
  props: InternalHomeServiceRateProps,
) => {
  return (
    <Container.Root flex={"1 1 350px"} withContext={true} {...props}>
      <Container.Body gap={4} pt={"md"}>
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
      gap={"md"}
      px={"md"}
    >
      <HStack gap={"xs"} align={"center"}>
        <Heading>{"Tarif Jasa Akses IGT-PR"}</Heading>

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
    </HStack>
  );
};

const InternalHomeServiceRateStats = () => {
  // Contexts
  const { isSmContainer } = useContainerContext();

  // Queries / Data — directly hit dedicated pricing API
  const { items: pricingItems } = useInternalPricingListQuery();

  // Derived Values - transform pricing items directly from response
  const serviceRates = useMemo<InternalHomeServiceRateItem[]>(() => {
    if (!pricingItems || pricingItems.length === 0) {
      return [];
    }

    const bidangRate = pricingItems.find((p) => p.spatialBasis === "bidang");
    const kawasanRate = pricingItems.find((p) => p.spatialBasis === "kawasan");

    const result: InternalHomeServiceRateItem[] = [];

    if (bidangRate) {
      result.push({
        id: bidangRate.id,
        title: `IGT Berbasis ${IGT_BASIS_MAP.bidang.label}`,
        icon: IGT_BASIS_MAP.bidang.icon,
        price: bidangRate.unitPrice,
        unit: "Bidang",
        kodePnbp: bidangRate.kodePnbp ?? "PNBP-IGT-01",
        minPurchase: bidangRate.minPurchase ?? 1000,
        minUnit: "Bidang",
        colorPalette: IGT_BASIS_MAP.bidang.colorPalette,
      });
    }

    if (kawasanRate) {
      result.push({
        id: kawasanRate.id,
        title: `IGT Berbasis ${IGT_BASIS_MAP.kawasan.label}`,
        icon: IGT_BASIS_MAP.kawasan.icon,
        price: kawasanRate.unitPrice,
        unit: "Ha",
        kodePnbp: kawasanRate.kodePnbp ?? "PNBP-IGT-02",
        minPurchase: kawasanRate.minPurchase ?? 1000,
        minUnit: "Ha",
        colorPalette: IGT_BASIS_MAP.kawasan.colorPalette,
      });
    }

    return result;
  }, [pricingItems]);

  const cols = isSmContainer ? 1 : 2;

  return (
    <StatGrid.Root columns={cols}>
      {serviceRates.map((rate, index) => (
        <StatGrid.Item key={rate.id} index={index} columns={cols}>
          <StatGrid.Header>
            <HStack gap={"xs"} align={"center"}>
              <Circle bg={`${rate.colorPalette}.subtle`} p={"2xs"}>
                <AppIcon
                  icon={rate.icon}
                  size={"sm"}
                  color={`${rate.colorPalette}.fg`}
                />
              </Circle>

              <StatGrid.Label>{rate.title}</StatGrid.Label>
            </HStack>

            <InternalHomeServiceRateModalTrigger rate={rate}>
              <IconButton
                variant={"ghost"}
                aria-label={`Ubah tarif ${rate.title}`}
              >
                <AppIcon icon={PencilIcon} />
              </IconButton>
            </InternalHomeServiceRateModalTrigger>
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
