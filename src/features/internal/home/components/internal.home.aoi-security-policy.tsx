// src/features/internal/home/components/internal.home.aoi-security-policy.tsx

import { Button, IconButton } from "@/design-system/components/button/ui/button";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { InfoTip } from "@/design-system/components/input/ui/toggle-tip";
import { Box } from "@/design-system/components/layout/ui/box";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { NavLink } from "@/design-system/components/navigation/ui/link";
import { HeaderContainer } from "@/design-system/components/shell/ui/header-container";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { ClampedP, P } from "@/design-system/components/typography/ui/p";
import type { InternalHomeAoiSecurityWidgetProps } from "@/features/internal/home/types/internal.home.security-widget.type";
import {
  useSecurityOverviewQuery,
  useSecurityUsersQuery,
} from "@/features/internal/security-monitoring/hooks/use-security-monitoring.query";
import { InternalSystemPolicyModalTrigger } from "@/features/internal/system-policies/components/internal.system-policies.modal";
import { useInternalSystemPoliciesQuery } from "@/features/internal/system-policies/hooks/use-internal-system-policies";
import type { SystemPolicyItem } from "@/features/mitra/data-request/types/mitra.data-request.pricing-policy.type";
import {
  AlertTriangleIcon,
  ArrowRightIcon,
  MapPinIcon,
  PencilIcon,
  ShieldAlertIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { useMemo } from "react";

export const InternalHomeAoiSecurityPolicy = (
  props: InternalHomeAoiSecurityWidgetProps,
) => {
  // Queries
  const { items: rawPolicies, isLoading: isPoliciesLoading } =
    useInternalSystemPoliciesQuery();
  const { data: overview, isLoading: isOverviewLoading } =
    useSecurityOverviewQuery();
  const { data: usersData, isLoading: isUsersLoading } = useSecurityUsersQuery({
    page: 1,
    limit: 3,
  });

  // Derived Values
  const aoiPolicy = useMemo<SystemPolicyItem>(() => {
    const found = rawPolicies.find(
      (p) => p.key === "security_max_aoi_hectares",
    );
    if (found) return found;

    return {
      key: "security_max_aoi_hectares",
      value: "50000",
      valueType: "number",
      label: "Batas Maksimum Luas AOI",
      description:
        "Batas luas area of interest (AOI) maksimum yang diizinkan untuk query spasial dan pemesanan data spasial mitra.",
      unit: "ha",
    };
  }, [rawPolicies]);

  const topRiskUsers = useMemo(() => {
    return (usersData?.items ?? []).slice(0, 3);
  }, [usersData]);

  if (isPoliciesLoading || isOverviewLoading || isUsersLoading) {
    return (
      <Container.Root flex={"1 1 340px"} withContext={true} {...props}>
        <Skeleton minH={"240px"} w={"full"} />
      </Container.Root>
    );
  }

  const numericValue = Number(aoiPolicy.value) || 50000;
  const formattedHa = new Intl.NumberFormat("id-ID").format(numericValue);
  const kmSq = (numericValue / 100).toFixed(0);

  const highRiskCount = overview?.highRiskUserCount ?? 0;
  const rateLimitCount = overview?.rateLimitedCount24h ?? 0;

  return (
    <Container.Root flex={"1 1 340px"} withContext={true} {...props}>
      <Container.Body gap={"md"} py={"md"}>
        {/* Header */}
        <HeaderContainer justify={"space-between"} px={"md"}>
          <HStack gap={"xs"} align={"center"}>
            <Heading>{"Proteksi & Batas AOI"}</Heading>
            <InfoTip
              variant={"icon"}
              appIconProps={{ size: "xs", color: "fg.subtle" }}
            >
              {
                "Monitoring profil risiko akses map service geospasial dan konfigurasi batas luas AOI query spasial."
              }
            </InfoTip>
          </HStack>

          <Button asChild={true} variant={"ghost"} size={"xs"}>
            <NavLink to={"/internal/security-monitoring"}>
              {"Lihat Detail"}
              <AppIcon icon={ArrowRightIcon} size={"xs"} />
            </NavLink>
          </Button>
        </HeaderContainer>

        <Separator borderColor={"bg.canvas"} />

        {/* Top Metric: AOI Max Limit & Key Security Indicators */}
        <HStack
          align={"stretch"}
          justify={"space-between"}
          gap={"md"}
          px={"md"}
          wrap={"wrap"}
        >
          {/* Left: AOI Limit Tile */}
          <HStack
            flex={"1 1 180px"}
            p={"sm"}
            rounded={"md"}
            bg={"bg.subtle"}
            justify={"space-between"}
            align={"center"}
          >
            <HStack gap={"xs"} align={"center"}>
              <AppIcon icon={MapPinIcon} size={"sm"} color={"blue.fg"} />
              <VStack align={"start"} gap={0}>
                <HStack gap={"2xs"} align={"center"}>
                  <P fontSize={"2xs"} color={"fg.muted"}>
                    {"Batas AOI Permintaan"}
                  </P>
                  <InfoTip
                    variant={"icon"}
                    appIconProps={{ size: "xs", color: "fg.subtle" }}
                  >
                    {aoiPolicy.description}
                  </InfoTip>
                </HStack>
                <HStack gap={"2xs"} align={"baseline"}>
                  <Heading size={"lg"} color={"blue.fg"}>
                    {formattedHa}
                  </Heading>
                  <P fontSize={"2xs"} fontWeight={"medium"} color={"fg.muted"}>
                    {"ha"}
                  </P>
                </HStack>
                <P fontSize={"2xs"} color={"fg.subtle"}>
                  {`±${kmSq} km²`}
                </P>
              </VStack>
            </HStack>

            <InternalSystemPolicyModalTrigger policy={aoiPolicy}>
              <IconButton
                variant={"ghost"}
                size={"xs"}
                aria-label={"Ubah Batas AOI"}
              >
                <AppIcon icon={PencilIcon} size={"xs"} />
              </IconButton>
            </InternalSystemPolicyModalTrigger>
          </HStack>

          {/* Right: Security Health Quick Summary */}
          <HStack flex={"1 1 130px"} gap={"xs"} align={"center"}>
            {/* High Risk Counter */}
            <VStack
              flex={1}
              p={"xs"}
              rounded={"md"}
              bg={highRiskCount > 0 ? "red.subtle" : "green.subtle"}
              align={"start"}
              gap={0}
            >
              <HStack gap={"2xs"} align={"center"}>
                <AppIcon
                  icon={highRiskCount > 0 ? ShieldAlertIcon : ShieldCheckIcon}
                  size={"xs"}
                  color={highRiskCount > 0 ? "red.fg" : "green.fg"}
                />
                <P fontSize={"2xs"} color={"fg.muted"}>
                  {"Risiko Tinggi"}
                </P>
              </HStack>
              <Heading
                size={"md"}
                color={highRiskCount > 0 ? "red.fg" : "green.fg"}
              >
                {highRiskCount}
              </Heading>
            </VStack>

            {/* Rate-limit Violations 24h */}
            <VStack
              flex={1}
              p={"xs"}
              rounded={"md"}
              bg={"orange.subtle"}
              align={"start"}
              gap={0}
            >
              <HStack gap={"2xs"} align={"center"}>
                <AppIcon
                  icon={AlertTriangleIcon}
                  size={"xs"}
                  color={"orange.fg"}
                />
                <P fontSize={"2xs"} color={"fg.muted"}>
                  {"Throttled 24j"}
                </P>
              </HStack>
              <Heading size={"md"} color={"orange.fg"}>
                {rateLimitCount}
              </Heading>
            </VStack>
          </HStack>
        </HStack>

        {/* Bottom Section: Top Riskiest Users Mini-List */}
        <VStack align={"stretch"} gap={"xs"} px={"md"}>
          <P fontSize={"2xs"} fontWeight={"semibold"} color={"fg.subtle"}>
            {"Peringkat Risiko Mitra Tertinggi"}
          </P>

          {topRiskUsers.length === 0 ? (
            <Box py={"xs"}>
              <P fontSize={"xs"} color={"fg.subtle"}>
                {"Belum ada rekam jejak aktivitas berisiko."}
              </P>
            </Box>
          ) : (
            <VStack align={"stretch"} gap={"2xs"}>
              {topRiskUsers.map((item, index) => {
                const score = item.currentScore;
                const badgePalette =
                  score >= 70 ? "red" : score >= 40 ? "orange" : "green";

                return (
                  <HStack
                    key={item.id}
                    justify={"space-between"}
                    align={"center"}
                    p={"xs"}
                    rounded={"md"}
                    border={"1px solid"}
                    borderColor={"bg.canvas"}
                    _hover={{ bg: "bg.subtle" }}
                  >
                    <HStack gap={"xs"} align={"center"} minW={0} flex={1}>
                      <P
                        fontSize={"xs"}
                        fontWeight={"bold"}
                        color={"fg.subtle"}
                        w={"16px"}
                      >
                        {`#${index + 1}`}
                      </P>
                      <VStack align={"start"} gap={0} minW={0} flex={1}>
                        <ClampedP
                          fontSize={"xs"}
                          fontWeight={"medium"}
                          maxLines={1}
                        >
                          {item.user?.name || "Mitra / Pengguna"}
                        </ClampedP>
                        <ClampedP fontSize={"2xs"} color={"fg.subtle"} maxLines={1}>
                          {item.user?.email || item.userId}
                        </ClampedP>
                      </VStack>
                    </HStack>

                    <HStack gap={"xs"} align={"center"} flexShrink={0}>
                      <Badge
                        colorPalette={badgePalette}
                        variant={"subtle"}
                        size={"xs"}
                      >
                        {`Skor ${score}`}
                      </Badge>
                      <Badge
                        colorPalette={
                          item.standingStatus === "SUSPENDED"
                            ? "red"
                            : item.standingStatus === "THROTTLED"
                              ? "orange"
                              : item.standingStatus === "MONITORED"
                                ? "yellow"
                                : "blue"
                        }
                        variant={"solid"}
                        size={"xs"}
                      >
                        {item.standingStatus}
                      </Badge>
                    </HStack>
                  </HStack>
                );
              })}
            </VStack>
          )}
        </VStack>
      </Container.Body>
    </Container.Root>
  );
};
