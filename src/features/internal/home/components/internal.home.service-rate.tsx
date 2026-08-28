import { IconButton } from "@/design-system/components/button/ui/button";
import { StatGrid } from "@/design-system/components/data-display/ui/stat-grid";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { InfoTip } from "@/design-system/components/input/ui/toggle-tip";
import {
  Container,
  useContainerContext,
} from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { InternalHomeServiceRateModalTrigger } from "@/features/internal/home/components/internal.home.service-rate-modal";
import { useInternalHomeData } from "@/features/internal/home/hooks/use-internal-home.query";
import type { InternalHomeServiceRateProps } from "@/features/internal/home/types/internal.home.service-rate.type";
import { FormatNumber } from "@/design-system/components/utilities/ui/fornat-number";
import { EditIcon } from "lucide-react";
import { Circle } from "@/design-system/components/layout/ui/box";

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

  // Queries / Data
  const { serviceRates } = useInternalHomeData();

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
                <AppIcon icon={EditIcon} />
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
