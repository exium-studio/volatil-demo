// src/features/internal/home/components/internal.home.leaderboard.tsx

import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { InfoTip } from "@/design-system/components/input/ui/toggle-tip";
import { Center } from "@/design-system/components/layout/ui/center";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { HeaderContainer } from "@/design-system/components/shell/ui/header-container";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { ClampedP, P } from "@/design-system/components/typography/ui/p";
import { Span } from "@/design-system/components/typography/ui/span";
import { FormatNumber } from "@/design-system/components/utilities/ui/fornat-number";
import { useInternalLeaderboardQuery } from "@/features/internal/home/hooks/use-internal-home.query";
import type {
  InternalHomeLeaderboardProps,
  LeaderboardCardProps,
  TopIgtLayerItem,
  TopMitraAcquisitionItem,
} from "@/features/internal/home/types/internal.home.leaderboard.type";
import { IGT_BASIS_MAP } from "@/features/shared/constants/volatil.ssot-map";
import { CrownIcon } from "lucide-react";

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

const LeaderboardRankBadge = (props: { rank: number }) => {
  // Props
  const { rank } = props;

  // Stores
  const { theme } = useThemeStore();

  const palette = theme.colorPalette;

  // Rank 1 solid, rank 2 muted, rank 3 subtle
  const getGradientCrownStyle = () => {
    switch (rank) {
      case 1:
        return {
          background: `linear-gradient(135deg, {colors.${palette}.solid}, {colors.${palette}.focusRing})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          filter: "drop-shadow(0 1px 3px rgba(0, 0, 0, 0.18))",
        };
      case 2:
        return {
          background: `linear-gradient(135deg, {colors.${palette}.muted}, {colors.${palette}.emphasized})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.12))",
        };
      case 3:
        return {
          background: `linear-gradient(135deg, {colors.${palette}.subtle}, {colors.${palette}.muted})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        };
      default:
        return undefined;
    }
  };

  const getRankNumberColor = () => {
    switch (rank) {
      case 1:
        return `${palette}.solid`;
      case 2:
        return `${palette}.muted`;
      case 3:
        return `${palette}.subtle`;
      default:
        return "fg.subtle";
    }
  };

  return (
    <VStack
      align={"center"}
      justify={"center"}
      w={"44px"}
      flexShrink={0}
      gap={0}
      py={"xxs"}
    >
      {rank <= 3 ? (
        <Center css={getGradientCrownStyle()} mb={"-2px"}>
          <AppIcon icon={CrownIcon} size={"sm"} />
        </Center>
      ) : (
        <Center h={"16px"} mb={"-2px"} />
      )}

      <P
        fontSize={"2xl"}
        fontWeight={"black"}
        lineHeight={1}
        color={getRankNumberColor()}
        textAlign={"center"}
      >
        {rank}
      </P>
    </VStack>
  );
};

const TopMitraLeaderboardCard = (props: LeaderboardCardProps) => {
  // Props
  const { flex } = props;

  // Stores
  const { theme } = useThemeStore();

  // Queries
  const { topMitraList } = useInternalLeaderboardQuery();

  return (
    <Container.Root flex={flex} withContext={true}>
      <Container.Body>
        <HeaderContainer justify={"space-between"} gap={"sm"} pr={"xs"}>
          <HStack wrap={"wrap"} gap={"sm"} py={"sm"}>
            <HStack wrap={"wrap"} align={"center"} gap={"sm"}>
              <Heading>{"Peringkat Mitra Teraktif"}</Heading>

              <InfoTip
                variant={"icon"}
                appIconProps={{ size: "xs", color: "fg.subtle" }}
              >
                {"Mitra dengan volume dan nilai akuisisi data IGT tertinggi"}
              </InfoTip>
            </HStack>
          </HStack>
        </HeaderContainer>

        <Separator borderColor={"bg.canvas"} />

        <VStack align={"stretch"} gap={0} w={"full"}>
          {topMitraList.map((mitra: TopMitraAcquisitionItem, index: number) => (
            <HStack
              key={mitra.mitraId}
              align={"center"}
              px={"md"}
              py={"sm"}
              gap={"md"}
              borderBottom={
                index < topMitraList.length - 1 ? "1px solid" : "none"
              }
              borderColor={"bg.canvas"}
              transition={"background-color 0.15s ease"}
              _hover={{
                bg: "bg.subtle",
              }}
              rounded={theme.radii.component}
            >
              {/* Ranking di paling kiri */}
              <LeaderboardRankBadge rank={mitra.rank} />

              {/* Konten di kanan (wrap responsive antara info mitra & nominal/order) */}
              <HStack
                wrap={"wrap"}
                justify={"space-between"}
                align={"center"}
                flex={1}
                minW={0}
                gap={"sm"}
              >
                <VStack align={"start"} gap={"2xs"} flex={"1 1 200px"} minW={0}>
                  <ClampedP fontWeight={"semibold"} fontSize={"md"} w={"full"}>
                    {mitra.mitraName}
                  </ClampedP>

                  <P fontSize={"sm"} color={"fg.subtle"} truncate={true}>
                    {mitra.agencyOrCompany}
                  </P>
                </VStack>

                <VStack
                  align={"start"}
                  textAlign={"start"}
                  gap={"2xs"}
                  flex={"1 1 160px"}
                  alignSelf={"stretch"}
                  justify={"center"}
                >
                  <P fontWeight={"bold"} fontSize={"md"}>
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

const TopIgtLayersLeaderboardCard = (props: LeaderboardCardProps) => {
  // Props
  const { flex } = props;

  // Stores
  const { theme } = useThemeStore();

  // Queries
  const { topIgtLayers } = useInternalLeaderboardQuery();

  return (
    <Container.Root flex={flex} withContext={true}>
      <Container.Body>
        <HeaderContainer justify={"space-between"} gap={"sm"} pr={"xs"}>
          <HStack wrap={"wrap"} gap={"sm"} py={"sm"}>
            <HStack wrap={"wrap"} align={"center"} gap={"sm"}>
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
        </HeaderContainer>

        <Separator borderColor={"bg.canvas"} />

        <VStack align={"stretch"} gap={0} w={"full"}>
          {topIgtLayers.map((layer: TopIgtLayerItem, index: number) => {
            const basisConfig = IGT_BASIS_MAP[layer.spatialBasis];
            return (
              <HStack
                key={layer.layerId}
                align={"center"}
                px={"md"}
                py={"sm"}
                gap={"md"}
                borderBottom={
                  index < topIgtLayers.length - 1 ? "1px solid" : "none"
                }
                borderColor={"bg.canvas"}
                transition={"background-color 0.15s ease"}
                _hover={{
                  bg: "bg.subtle",
                }}
                rounded={theme.radii.component}
              >
                {/* Ranking di paling kiri */}
                <LeaderboardRankBadge rank={layer.rank} />

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
                    gap={"2xs"}
                    flex={"1 1 200px"}
                    minW={0}
                  >
                    <ClampedP
                      fontWeight={"semibold"}
                      fontSize={"md"}
                      w={"full"}
                    >
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
                    gap={"2xs"}
                    flex={"1 1 160px"}
                    alignSelf={"stretch"}
                    justify={"center"}
                  >
                    <P fontWeight={"bold"} fontSize={"md"}>
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
