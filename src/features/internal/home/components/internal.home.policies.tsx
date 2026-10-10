// src/features/internal/home/components/internal.home.policies.tsx

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
import { InternalSystemPolicyModalTrigger } from "@/features/internal/system-policies/components/internal.system-policies.modal";
import { useInternalSystemPoliciesQuery } from "@/features/internal/system-policies/hooks/use-internal-system-policies";
import type { InternalHomePoliciesProps } from "@/features/internal/home/types/internal.home.policies.type";
import type { SystemPolicyItem } from "@/features/mitra/data-request/types/mitra.data-request.pricing-policy.type";
import {
  ClockIcon,
  HourglassIcon,
  PencilIcon,
  RefreshCwIcon,
  ShieldAlertIcon,
} from "lucide-react";

export const InternalHomePolicies = (props: InternalHomePoliciesProps) => {
  return (
    <Container.Root flex={"1 1 350px"} withContext={true} {...props}>
      <InternalHomePoliciesContent />
    </Container.Root>
  );
};

const InternalHomePoliciesContent = () => {
  // Contexts
  const { isSmContainer } = useContainerContext();

  // Queries
  const { items: policies, isLoading } = useInternalSystemPoliciesQuery();

  if (isLoading) {
    return <Skeleton minH={isSmContainer ? "240px" : "180px"} w={"full"} />;
  }

  const cols = isSmContainer ? 1 : 2;

  const getPolicyIcon = (key: string) => {
    if (key.includes("timeout")) return HourglassIcon;
    if (key.includes("duration") || key.includes("access")) return ClockIcon;
    if (key.includes("extension_count") || key.includes("max_extension"))
      return RefreshCwIcon;
    if (key.includes("extension_window") || key.includes("window"))
      return ShieldAlertIcon;
    return ClockIcon;
  };

  const getPolicyColor = (key: string) => {
    if (key.includes("timeout")) return "amber";
    if (key.includes("duration") || key.includes("access")) return "green";
    if (key.includes("extension_count") || key.includes("max_extension"))
      return "cyan";
    if (key.includes("extension_window") || key.includes("window"))
      return "red";
    return "blue";
  };

  return (
    <Container.Body>
      <HeaderContainer>
        <HStack align={"center"} gap={"xs"}>
          <Heading size={"md"}>
            {"Kebijakan Siklus & Perpanjangan Pesanan"}
          </Heading>

          <InfoTip
            variant={"icon"}
            appIconProps={{
              size: "xs",
              color: "fg.subtle",
            }}
          >
            {
              "Menyimpan konfigurasi batas waktu pembayaran SIMPONI & aturan perpanjangan pesanan mitra."
            }
          </InfoTip>
        </HStack>
      </HeaderContainer>

      <Separator borderColor={"bg.canvas"} />

      <StatGrid.Root columns={cols}>
        {policies.map((policy: SystemPolicyItem, index: number) => {
          const IconComp = getPolicyIcon(policy.key);
          const colorPalette = getPolicyColor(policy.key);
          const isCurrency = policy.unit === "IDR" || policy.unit === "Rupiah";
          const formattedValue =
            policy.valueType === "number" && !Number.isNaN(Number(policy.value))
              ? isCurrency
                ? new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                  }).format(Number(policy.value))
                : `${new Intl.NumberFormat("id-ID").format(Number(policy.value))} ${policy.unit ?? ""}`
              : `${policy.value} ${policy.unit ?? ""}`;

          return (
            <StatGrid.Item key={policy.key} index={index} columns={cols}>
              <StatGrid.Header>
                <HStack gap={"2xs"} align={"center"}>
                  <Circle bg={`${colorPalette}.subtle`} p={"2xs"}>
                    <AppIcon
                      icon={IconComp}
                      size={"xs"}
                      color={`${colorPalette}.fg`}
                    />
                  </Circle>

                  <StatGrid.Label>{policy.label ?? policy.key}</StatGrid.Label>
                </HStack>

                <InternalSystemPolicyModalTrigger policy={policy}>
                  <IconButton
                    variant={"ghost"}
                    aria-label={`Ubah kebijakan ${policy.label ?? policy.key}`}
                  >
                    <AppIcon icon={PencilIcon} />
                  </IconButton>
                </InternalSystemPolicyModalTrigger>
              </StatGrid.Header>

              <StatGrid.Value value={formattedValue} />

              {policy.description && (
                <StatGrid.Description>
                  {policy.description}
                </StatGrid.Description>
              )}
            </StatGrid.Item>
          );
        })}
      </StatGrid.Root>
    </Container.Body>
  );
};
