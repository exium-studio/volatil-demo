import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { InfoTip } from "@/design-system/components/input/ui/toggle-tip";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { ClampedP, P } from "@/design-system/components/typography/ui/p";
import { Span } from "@/design-system/components/typography/ui/span";
import { FormatNumber } from "@/design-system/components/utilities/ui/fornat-number";
import { useInternalLeaderboardQuery } from "@/features/internal/home/hooks/use-internal-home.query";
import type {
  InternalHomeLeaderboardProps,
  TopIgtLayerItem,
  TopMitraAcquisitionItem,
} from "@/features/internal/home/types/internal.home.leaderboard.type";
import { IGT_BASIS_MAP } from "@/shared/constants/status.config";

export const InternalHomeLeaderboard = (
  props: InternalHomeLeaderboardProps,
) => {
  return (
    <HStack wrap={"wrap"} gap={"sm"} align={"stretch"} w={"full"} {...props}>
      <TopMitraLeaderboardCard flex={"1 1 450px"} />
      <TopIgtLayersLeaderboardCard flex={"1 1 450px"} />
    </HStack>
  );
};

const TopMitraLeaderboardCard = (props: { flex?: string | number }) => {
  const { flex } = props;
  const { topMitraList } = useInternalLeaderboardQuery();

  return (
    <Container.Root flex={flex} withContext={true}>
      <Container.Body gap={"md"} py={"md"}>
        <HStack justify={"space-between"} align={"center"} px={"md"}>
          <HStack gap={"xs"} align={"center"}>
            <Heading>{"Peringkat Mitra Teraktif"}</Heading>
            <InfoTip
              variant={"icon"}
              appIconProps={{ size: "xs", color: "fg.subtle" }}
            >
              {"Mitra dengan volume dan nilai akuisisi data IGT tertinggi"}
            </InfoTip>
          </HStack>
        </HStack>

        <VStack align={"stretch"} gap={"2xs"}>
          {topMitraList.map((mitra: TopMitraAcquisitionItem, index: number) => (
            <HStack
              key={mitra.mitraId}
              align={"start"}
              p={"md"}
              gap={"md"}
              borderBottom={
                index < topMitraList.length - 1 ? "1px solid" : "none"
              }
              borderColor={"border.subtle"}
            >
              {/* Ranking di paling kiri */}
              <P
                fontWeight={"bold"}
                color={mitra.rank <= 3 ? "fg" : "fg.subtle"}
                w={"20px"}
                textAlign={"center"}
                flexShrink={0}
                pt={"xxs"}
              >
                {mitra.rank}
              </P>

              {/* Konten di kanan (wrap responsive antara info mitra & nominal/order) */}
              <HStack
                wrap={"wrap"}
                justify={"space-between"}
                align={"center"}
                flex={1}
                minW={0}
                gap={"sm"}
              >
                <VStack align={"start"} gap={"xs"} flex={"1 1 200px"} minW={0}>
                  <ClampedP fontWeight={"medium"} w={"full"}>
                    {mitra.mitraName}
                  </ClampedP>

                  <P fontSize={"sm"} color={"fg.subtle"} truncate>
                    {mitra.agencyOrCompany}
                  </P>
                </VStack>

                <VStack
                  align={"start"}
                  textAlign={"start"}
                  gap={"xs"}
                  flex={"1 1 160px"}
                  alignSelf={"stretch"}
                  justify={"center"}
                >
                  <P fontWeight={"semibold"}>
                    <FormatNumber
                      value={mitra.totalSpending}
                      style={"currency"}
                      currency={"IDR"}
                      maximumFractionDigits={0}
                    />
                  </P>

                  <P fontSize={"sm"} color={"fg.subtle"}>
                    {`${mitra.totalOrders} Pesanan · ${mitra.totalVolume}`}
                  </P>
                </VStack>
              </HStack>
            </HStack>
          ))}
        </VStack>
      </Container.Body>
    </Container.Root>
  );
};

const TopIgtLayersLeaderboardCard = (props: { flex?: string | number }) => {
  const { flex } = props;
  const { topIgtLayers } = useInternalLeaderboardQuery();

  return (
    <Container.Root flex={flex} withContext={true}>
      <Container.Body gap={"md"} py={"md"}>
        <HStack justify={"space-between"} align={"center"} px={"md"}>
          <HStack gap={"xs"} align={"center"}>
            <Heading>{"Layer IGT Paling Diminati"}</Heading>
            <InfoTip
              variant={"icon"}
              appIconProps={{ size: "xs", color: "fg.subtle" }}
            >
              {
                "Layer tematik IGT-PR dengan perolehan PNBP dan frekuensi pesanan terbesar"
              }
            </InfoTip>
          </HStack>
        </HStack>

        <VStack align={"stretch"} gap={"2xs"}>
          {topIgtLayers.map((layer: TopIgtLayerItem, index: number) => {
            const basisConfig = IGT_BASIS_MAP[layer.spatialBasis];
            return (
              <HStack
                key={layer.layerId}
                align={"start"}
                p={"md"}
                gap={"md"}
                borderBottom={
                  index < topIgtLayers.length - 1 ? "1px solid" : "none"
                }
                borderColor={"border.subtle"}
              >
                {/* Ranking di paling kiri */}
                <P
                  fontWeight={"bold"}
                  color={layer.rank <= 3 ? "fg" : "fg.subtle"}
                  w={"20px"}
                  textAlign={"center"}
                  flexShrink={0}
                  pt={"xxs"}
                >
                  {layer.rank}
                </P>

                {/* Konten di kanan (wrap responsive antara info layer & pendapatan/volume) */}
                <HStack
                  wrap={"wrap"}
                  justify={"space-between"}
                  align={"center"}
                  flex={1}
                  minW={0}
                  gap={"sm"}
                >
                  <VStack
                    align={"start"}
                    gap={"xs"}
                    flex={"1 1 200px"}
                    minW={0}
                  >
                    <ClampedP fontWeight={"medium"} w={"full"}>
                      {layer.layerTitle}
                    </ClampedP>

                    <HStack gap={"xs"} align={"center"}>
                      <Badge
                        variant={"subtle"}
                        colorPalette={basisConfig?.colorPalette ?? "gray"}
                      >
                        {basisConfig?.icon && (
                          <AppIcon icon={basisConfig.icon} size={"sm"} />
                        )}
                        {basisConfig?.label ?? layer.spatialBasis}
                      </Badge>

                      <P fontSize={"xs"} color={"fg.subtle"}>
                        {`${layer.totalAcquisitions}x pesanan`}
                      </P>
                    </HStack>
                  </VStack>

                  <VStack
                    align={"start"}
                    textAlign={"start"}
                    gap={"xs"}
                    flex={"1 1 160px"}
                    alignSelf={"stretch"}
                    justify={"center"}
                  >
                    <P fontWeight={"semibold"}>
                      <FormatNumber
                        value={layer.totalPnbpRevenue}
                        style={"currency"}
                        currency={"IDR"}
                        maximumFractionDigits={0}
                      />
                    </P>

                    <P fontSize={"sm"} color={"fg.subtle"}>
                      <FormatNumber value={layer.totalVolume} />
                      <Span ml={1}>{layer.unit}</Span>
                    </P>
                  </VStack>
                </HStack>
              </HStack>
            );
          })}
        </VStack>
      </Container.Body>
    </Container.Root>
  );
};
