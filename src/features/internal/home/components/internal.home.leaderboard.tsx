// src/features/internal/home/components/internal.home.leaderboard.tsx

import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { NoDataState } from "@/design-system/components/feedback/ui/state.no-data";
import { RetryState } from "@/design-system/components/feedback/ui/state.retry";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { InfoTip } from "@/design-system/components/input/ui/toggle-tip";
import { Box } from "@/design-system/components/layout/ui/box";
import { Center } from "@/design-system/components/layout/ui/center";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { HeaderContainer } from "@/design-system/components/shell/ui/header-container";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { ClampedP, P } from "@/design-system/components/typography/ui/p";
import { Span } from "@/design-system/components/typography/ui/span";
import { FormatNumber } from "@/design-system/components/utilities/ui/fornat-number";
import { useInternalLeaderboardQuery } from "@/features/internal/home/hooks/use-internal-home.query";
import type {
  InternalHomeLeaderboardProps,
  LeaderboardCardProps,
  LeaderboardRankBadgeProps,
  TopIgtLayerItem,
  TopMitraAcquisitionItem,
} from "@/features/internal/home/types/internal.home.leaderboard.type";
import { IGT_BASIS_MAP } from "@/features/shared/constants/volatil.ssot-map";
import { isEmptyArray } from "@/shared/utils/data/array";
import { HandshakeIcon, LayersIcon } from "lucide-react";

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

const LeaderboardRankBadge = (props: LeaderboardRankBadgeProps) => {
  // Props
  const { rank } = props;

  return (
    <Center w={"36px"} flexShrink={0}>
      <P
        fontSize={"2xl"}
        fontWeight={rank === 1 ? "bold" : "medium"}
        lineHeight={1}
        textAlign={"center"}
      >
        {rank}
      </P>
    </Center>
  );
};

const TopMitraLeaderboardCard = (props: LeaderboardCardProps) => {
  // Props
  const { flex } = props;

  // Queries
  const { topMitraList, isLoading, isError, error, refetch } =
    useInternalLeaderboardQuery();

  if (isLoading) {
    return (
      <Container.Root flex={flex} withContext={true}>
        <Skeleton minH={"320px"} w={"full"} />
      </Container.Root>
    );
  }

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

        {isError ? (
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            w={"full"}
            py={"xl"}
            flex={1}
          >
            <RetryState
              title={"Gagal Memuat Peringkat Mitra"}
              description={
                error?.message ||
                "Terjadi kesalahan saat memuat data peringkat mitra. Silakan coba lagi."
              }
              onRetry={() => {
                void refetch();
              }}
            />
          </Box>
        ) : isEmptyArray(topMitraList) ? (
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            w={"full"}
            py={"xl"}
            flex={1}
          >
            <NoDataState
              icon={HandshakeIcon}
              title={"Belum Ada Data Peringkat Mitra"}
              description={
                "Belum ada data aktivitas transaksi dari mitra untuk ditampilkan pada peringkat."
              }
            />
          </Box>
        ) : (
          <VStack align={"stretch"} gap={0} w={"full"}>
            {topMitraList.map(
              (mitra: TopMitraAcquisitionItem, index: number) => (
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
              ),
            )}
          </VStack>
        )}
      </Container.Body>
    </Container.Root>
  );
};

const TopIgtLayersLeaderboardCard = (props: LeaderboardCardProps) => {
  // Props
  const { flex } = props;

  // Queries
  const { topIgtLayers, isLoading, isError, error, refetch } =
    useInternalLeaderboardQuery();

  if (isLoading) {
    return (
      <Container.Root flex={flex} withContext={true}>
        <Skeleton minH={"320px"} w={"full"} />
      </Container.Root>
    );
  }

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

        {isError ? (
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            w={"full"}
            py={"xl"}
            flex={1}
          >
            <RetryState
              title={"Gagal Memuat Layer IGT Paling Diminati"}
              description={
                error?.message ||
                "Terjadi kesalahan saat memuat data layer IGT paling diminati. Silakan coba lagi."
              }
              onRetry={() => {
                void refetch();
              }}
            />
          </Box>
        ) : isEmptyArray(topIgtLayers) ? (
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            w={"full"}
            py={"xl"}
            flex={1}
          >
            <NoDataState
              icon={LayersIcon}
              title={"Belum Ada Data Layer IGT"}
              description={
                "Belum ada data layer IGT yang diakuisisi untuk ditampilkan pada daftar minat."
              }
            />
          </Box>
        ) : (
          <VStack align={"stretch"} gap={0} w={"full"}>
            {topIgtLayers.map((layer: TopIgtLayerItem, index: number) => {
              const effectiveBasis =
                layer.igtBasis ?? layer.spatialBasis ?? "kawasan";
              const basisConfig = IGT_BASIS_MAP[effectiveBasis];
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
                    <VStack align={"start"} gap={"xs"} flex={"1 1 200px"}>
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
                          {basisConfig?.label ?? effectiveBasis}
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
        )}
      </Container.Body>
    </Container.Root>
  );
};
