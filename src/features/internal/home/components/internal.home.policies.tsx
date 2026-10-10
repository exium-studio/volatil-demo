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
import type { InternalHomePoliciesProps } from "@/features/internal/home/types/internal.home.policies.type";
import { InternalSystemPolicyModalTrigger } from "@/features/internal/system-policies/components/internal.system-policies.modal";
import { useInternalSystemPoliciesQuery } from "@/features/internal/system-policies/hooks/use-internal-system-policies";
import type { SystemPolicyItem } from "@/features/mitra/data-request/types/mitra.data-request.pricing-policy.type";
import { getSystemPolicyConfig } from "@/features/shared/constants/volatil.ssot-map";
import { PencilIcon } from "lucide-react";

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
          const config = getSystemPolicyConfig(policy.key);
          const IconComp = config.icon;
          const colorPalette = config.colorPalette;
          const label = config.label;
          const description = config.description || policy.description;

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
                <HStack gap={"xs"} align={"center"}>
                  <Circle bg={`${colorPalette}.subtle`} p={"2xs"}>
                    <AppIcon
                      icon={IconComp}
                      size={"xs"}
                      color={`${colorPalette}.fg`}
                    />
                  </Circle>

                  <StatGrid.Label>{label}</StatGrid.Label>

                  {description && (
                    <InfoTip
                      variant={"icon"}
                      appIconProps={{
                        size: "xs",
                        color: "fg.subtle",
                      }}
                    >
                      {description}
                    </InfoTip>
                  )}
                </HStack>

                <InternalSystemPolicyModalTrigger policy={policy}>
                  <IconButton
                    variant={"ghost"}
                    aria-label={`Ubah kebijakan ${label}`}
                  >
                    <AppIcon icon={PencilIcon} />
                  </IconButton>
                </InternalSystemPolicyModalTrigger>
              </StatGrid.Header>

              <StatGrid.Value value={formattedValue} />
            </StatGrid.Item>
          );
        })}
      </StatGrid.Root>
    </Container.Body>
  );
};

