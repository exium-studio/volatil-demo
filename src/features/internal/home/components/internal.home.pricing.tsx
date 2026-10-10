// src/features/internal/home/components/internal.home.pricing.tsx

import { IconButton } from "@/design-system/components/button/ui/button";
import { StatGrid } from "@/design-system/components/data-display/ui/stat-grid";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { InfoTip } from "@/design-system/components/input/ui/toggle-tip";
import { Circle } from "@/design-system/components/layout/ui/box";
import {
  Container,
  useContainerContext,
} from "@/design-system/components/layout/ui/container";
import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { HeaderContainer } from "@/design-system/components/shell/ui/header-container";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { InternalHomePricingModalTrigger } from "@/features/internal/home/components/internal.home.pricing-modal";
import { useInternalHomePricingQuery } from "@/features/internal/home/hooks/use-internal-home.query";
import type {
  InternalHomePricingItem,
  InternalHomePricingProps,
} from "@/features/internal/home/types/internal.home.pricing.type";
import { LayersIcon, MapPinIcon, PencilIcon } from "lucide-react";
import { useMemo } from "react";

export const InternalHomePricing = (props: InternalHomePricingProps) => {
  return (
    <Container.Root withContext={true} {...props}>
      <InternalHomePricingContent />
    </Container.Root>
  );
};

const InternalHomePricingContent = () => {
  // Contexts
  const { isSmContainer } = useContainerContext();

  // Queries
  const { pricings, isLoading } = useInternalHomePricingQuery();

  // Derived Values
  const enrichedPricings = useMemo<InternalHomePricingItem[]>(() => {
    return pricings.map((item) => {
      const isBidang = item.igtBasis === "bidang";
      return {
        ...item,
        title: isBidang
          ? "Tarif Dasar per Bidang"
          : "Tarif Dasar per Hektar Kawasan",
        icon: isBidang ? MapPinIcon : LayersIcon,
        colorPalette: isBidang ? "blue" : "orange",
      };
    });
  }, [pricings]);

  if (isLoading) {
    return <Skeleton minH={isSmContainer ? "240px" : "180px"} w={"full"} />;
  }

  const cols = isSmContainer ? 1 : 2;

  return (
    <Container.Body>
      <HeaderContainer>
        <HStack align={"center"} gap={"xs"}>
          <Heading size={"md"}>{"Master Tarif & PNBP"}</Heading>
          <InfoTip
            variant={"icon"}
            appIconProps={{
              size: "xs",
              color: "fg.subtle",
            }}
          >
            {
              "Menyimpan tarif & minimum purchase PNBP per basis spasial (Bidang vs Kawasan) serta kode akun PNBP SIMPONI."
            }
          </InfoTip>
        </HStack>
      </HeaderContainer>

      <Separator borderColor={"bg.canvas"} />

      <StatGrid.Root columns={cols}>
        {enrichedPricings.map((pricing, index) => {
          const IconComp = pricing.icon ?? MapPinIcon;
          const colorPalette = pricing.colorPalette ?? "teal";
          const formattedPrice = new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
          }).format(pricing.price);

          const formattedMin = `${new Intl.NumberFormat("id-ID").format(pricing.minimumPurchase)} ${pricing.unit}`;

          return (
            <StatGrid.Item key={pricing.id} index={index} columns={cols}>
              <StatGrid.Header>
                <HStack gap={"2xs"} align={"center"}>
                  <Circle bg={`${colorPalette}.subtle`} p={"2xs"}>
                    <AppIcon
                      icon={IconComp}
                      size={"xs"}
                      color={`${colorPalette}.fg`}
                    />
                  </Circle>

                  <StatGrid.Label>{pricing.title}</StatGrid.Label>
                </HStack>

                <InternalHomePricingModalTrigger pricing={pricing}>
                  <IconButton
                    variant={"ghost"}
                    aria-label={`Ubah tarif ${pricing.title}`}
                  >
                    <AppIcon icon={PencilIcon} />
                  </IconButton>
                </InternalHomePricingModalTrigger>
              </StatGrid.Header>

              <StatGrid.Value value={formattedPrice} />

              <StatGrid.Description>
                {`Minimal Pembelian: ${formattedMin} · Kode PNBP: ${pricing.pnbpCode}`}
              </StatGrid.Description>
            </StatGrid.Item>
          );
        })}
      </StatGrid.Root>
    </Container.Body>
  );
};
