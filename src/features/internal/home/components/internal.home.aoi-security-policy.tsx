// src/features/internal/home/components/internal.home.aoi-security-policy.tsx

import { Button, IconButton } from "@/design-system/components/button/ui/button";
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
import { NavLink } from "@/design-system/components/navigation/ui/link";
import { HeaderContainer } from "@/design-system/components/shell/ui/header-container";
import { Heading } from "@/design-system/components/typography/ui/heading";
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
  Maximize2Icon,
  PencilIcon,
  ShieldAlertIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { useMemo } from "react";

export const InternalHomeAoiSecurityPolicy = (
  props: InternalHomeAoiSecurityWidgetProps,
) => {
  return (
    <Container.Root withContext={true} {...props}>
      <InternalHomeAoiSecurityPolicyContent />
    </Container.Root>
  );
};

const InternalHomeAoiSecurityPolicyContent = () => {
  // Contexts
  const { isSmContainer } = useContainerContext();

  // Queries
  const { items: rawPolicies, isLoading: isPoliciesLoading } =
    useInternalSystemPoliciesQuery();
  const { data: overview, isLoading: isOverviewLoading } =
    useSecurityOverviewQuery();
  const { data: usersData, isLoading: isUsersLoading } = useSecurityUsersQuery({
    page: 1,
    limit: 1,
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

  const topRiskUser = useMemo(() => {
    return usersData?.items?.[0] ?? null;
  }, [usersData]);

  if (isPoliciesLoading || isOverviewLoading || isUsersLoading) {
    return <Skeleton minH={isSmContainer ? "240px" : "180px"} w={"full"} />;
  }

  const numericValue = Number(aoiPolicy.value) || 50000;
  const formattedHa = new Intl.NumberFormat("id-ID").format(numericValue);
  const kmSq = (numericValue / 100).toFixed(0);

  const highRiskCount = overview?.highRiskUserCount ?? 0;
  const rateLimitCount = overview?.rateLimitedCount24h ?? 0;

  const cols = isSmContainer ? 1 : 4;

  return (
    <Container.Body>
      <HeaderContainer justify={"space-between"}>
        <HStack align={"center"} gap={"xs"}>
          <Heading size={"md"}>
            {"Proteksi Geospasial & Pemantauan Keamanan"}
          </Heading>

          <InfoTip
            variant={"icon"}
            appIconProps={{
              size: "xs",
              color: "fg.subtle",
            }}
          >
            {
              "Pengawasan ringkas keamanan layanan peta, anomali akses WFS/WMS, batas AOI, serta peringkat risiko mitra."
            }
          </InfoTip>
        </HStack>

        <Button asChild={true} variant={"ghost"} size={"xs"}>
          <NavLink to={"/internal/security-monitoring"}>
            {"Buka Pemantauan Keamanan"}
            <AppIcon icon={ArrowRightIcon} size={"xs"} />
          </NavLink>
        </Button>
      </HeaderContainer>

      <Separator borderColor={"bg.canvas"} />

      <StatGrid.Root columns={cols}>
        {/* Item 1: Batas AOI Geospasial */}
        <StatGrid.Item index={0} columns={cols}>
          <StatGrid.Header>
            <HStack gap={"2xs"} align={"center"}>
              <Circle bg={"blue.subtle"} p={"2xs"}>
                <AppIcon icon={Maximize2Icon} size={"xs"} color={"blue.fg"} />
              </Circle>

              <StatGrid.Label>{"Batas Maksimum AOI"}</StatGrid.Label>

              <InfoTip
                variant={"icon"}
                appIconProps={{
                  size: "xs",
                  color: "fg.subtle",
                }}
              >
                {aoiPolicy.description}
              </InfoTip>
            </HStack>

            <InternalSystemPolicyModalTrigger policy={aoiPolicy}>
              <IconButton
                variant={"ghost"}
                aria-label={"Ubah Batas AOI Geospasial"}
              >
                <AppIcon icon={PencilIcon} />
              </IconButton>
            </InternalSystemPolicyModalTrigger>
          </StatGrid.Header>

          <StatGrid.Value value={`${formattedHa} ha`} />

          <StatGrid.Description>
            {`Setara ±${kmSq} km² cakupan per permintaan`}
          </StatGrid.Description>
        </StatGrid.Item>

        {/* Item 2: Mitra Risiko Tinggi */}
        <StatGrid.Item index={1} columns={cols}>
          <StatGrid.Header>
            <HStack gap={"2xs"} align={"center"}>
              <Circle
                bg={highRiskCount > 0 ? "red.subtle" : "green.subtle"}
                p={"2xs"}
              >
                <AppIcon
                  icon={highRiskCount > 0 ? ShieldAlertIcon : ShieldCheckIcon}
                  size={"xs"}
                  color={highRiskCount > 0 ? "red.fg" : "green.fg"}
                />
              </Circle>

              <StatGrid.Label>{"Mitra Risiko Tinggi"}</StatGrid.Label>
            </HStack>
          </StatGrid.Header>

          <StatGrid.Value
            value={highRiskCount}
            color={highRiskCount > 0 ? "red.fg" : "fg"}
          />

          <StatGrid.Description>
            {"Skor risiko >= 70 (Throttled/Suspended)"}
          </StatGrid.Description>
        </StatGrid.Item>

        {/* Item 3: Pelanggaran Rate Limit 24 Jam */}
        <StatGrid.Item index={2} columns={cols}>
          <StatGrid.Header>
            <HStack gap={"2xs"} align={"center"}>
              <Circle bg={"orange.subtle"} p={"2xs"}>
                <AppIcon
                  icon={AlertTriangleIcon}
                  size={"xs"}
                  color={"orange.fg"}
                />
              </Circle>

              <StatGrid.Label>{"Pelanggaran Rate Limit"}</StatGrid.Label>
            </HStack>
          </StatGrid.Header>

          <StatGrid.Value value={rateLimitCount} color={"orange.fg"} />

          <StatGrid.Description>
            {"Total request ditahan dalam 24 jam terakhir"}
          </StatGrid.Description>
        </StatGrid.Item>

        {/* Item 4: Peringkat #1 Risiko Teratas */}
        <StatGrid.Item index={3} columns={cols}>
          <StatGrid.Header>
            <HStack gap={"2xs"} align={"center"}>
              <Circle bg={"purple.subtle"} p={"2xs"}>
                <AppIcon
                  icon={ShieldAlertIcon}
                  size={"xs"}
                  color={"purple.fg"}
                />
              </Circle>

              <StatGrid.Label>{"Risiko Teratas (#1)"}</StatGrid.Label>
            </HStack>
          </StatGrid.Header>

          <StatGrid.Value
            value={
              topRiskUser
                ? `Skor ${topRiskUser.currentScore}`
                : "Aman (0)"
            }
            color={
              topRiskUser && topRiskUser.currentScore >= 70
                ? "red.fg"
                : topRiskUser && topRiskUser.currentScore >= 40
                  ? "orange.fg"
                  : "green.fg"
            }
          />

          <StatGrid.Description>
            {topRiskUser
              ? `${topRiskUser.user?.name || topRiskUser.userId} · ${topRiskUser.standingStatus}`
              : "Belum ada mitra terdeteksi anomali"}
          </StatGrid.Description>
        </StatGrid.Item>
      </StatGrid.Root>
    </Container.Body>
  );
};
