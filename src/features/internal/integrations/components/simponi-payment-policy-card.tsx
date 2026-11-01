// src/features/internal/integrations/components/simponi-payment-policy-card.tsx

import { IconButton } from "@/design-system/components/button/ui/button";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { InfoTip } from "@/design-system/components/input/ui/toggle-tip";
import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { P, TNum } from "@/design-system/components/typography/ui/p";
import { useThemeStore } from "@/design-system/stores/theme-store";
import type { SimponiPaymentPolicyCardProps } from "@/features/internal/integrations/types/integration.type";
import { InternalSystemPolicyModalTrigger } from "@/features/internal/system-policies/components/internal.system-policies.modal";
import { useInternalSystemPoliciesQuery } from "@/features/internal/system-policies/hooks/use-internal-system-policies";
import { getSystemPolicyConfig } from "@/features/shared/constants/volatil.ssot-map";
import { PencilIcon } from "lucide-react";
import { useMemo } from "react";

export const SimponiPaymentPolicyCard = (
  props: SimponiPaymentPolicyCardProps,
) => {
  // Props
  const { className } = props;

  // Stores
  const { theme } = useThemeStore();

  // Hooks
  const { items: policies, isLoading } = useInternalSystemPoliciesQuery();

  // Derived Values
  const policyItem = useMemo(() => {
    return policies.find((p) => p.key === "payment_timeout_fallback_hours");
  }, [policies]);

  if (isLoading || !policyItem) {
    return <Skeleton h={"48px"} w={"full"} rounded={theme.radii.component} />;
  }

  const config = getSystemPolicyConfig(policyItem.key);
  const label = config.label;
  const description = config.description || policyItem.description;
  const displayValue = `${policyItem.value} ${policyItem.unit || "Jam"}`;

  return (
    <HStack
      className={className}
      justify={"space-between"}
      align={"center"}
      p={4}
      rounded={theme.radii.component}
      bg={"bg.subtle"}
      w={"full"}
      gap={"md"}
    >
      {/* Label & Info */}
      <HStack align={"center"} gap={"xs"}>
        <P fontWeight={"medium"}>{label}</P>

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

      {/* Value & Trigger */}
      <HStack align={"center"} gap={"xs"} flexShrink={0} whiteSpace={"nowrap"}>
        <P fontWeight={"semibold"} whiteSpace={"nowrap"}>
          <TNum>{displayValue}</TNum>
        </P>

        <InternalSystemPolicyModalTrigger policy={policyItem}>
          <IconButton
            variant={"ghost"}
            size={"sm"}
            aria-label={`Ubah ${label.toLowerCase()}`}
          >
            <AppIcon icon={PencilIcon} />
          </IconButton>
        </InternalSystemPolicyModalTrigger>
      </HStack>
    </HStack>
  );
};
