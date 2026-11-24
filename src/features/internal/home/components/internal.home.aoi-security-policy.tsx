// src/features/internal/home/components/internal.home.aoi-security-policy.tsx

import { IconButton } from "@/design-system/components/button/ui/button";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { InfoTip } from "@/design-system/components/input/ui/toggle-tip";
import { Circle } from "@/design-system/components/layout/ui/box";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { P } from "@/design-system/components/typography/ui/p";
import { InternalSystemPolicyModalTrigger } from "@/features/internal/system-policies/components/internal.system-policies.modal";
import { useInternalSystemPoliciesQuery } from "@/features/internal/system-policies/hooks/use-internal-system-policies";
import type { SystemPolicyItem } from "@/features/mitra/data-request/types/mitra.data-request.pricing-policy.type";
import { PencilIcon, ShieldCheckIcon } from "lucide-react";
import { useMemo } from "react";

export const InternalHomeAoiSecurityPolicy = (props: { flex?: string; w?: string }) => {
  // Queries
  const { items: rawPolicies, isLoading } = useInternalSystemPoliciesQuery();

  // Derived Values
  const aoiPolicy = useMemo<SystemPolicyItem>(() => {
    const found = rawPolicies.find((p) => p.key === "security_max_aoi_hectares");
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

  if (isLoading) {
    return (
      <Container.Root flex={"1 1 300px"} withContext={true} {...props}>
        <Skeleton minH={"240px"} w={"full"} />
      </Container.Root>
    );
  }

  const numericValue = Number(aoiPolicy.value) || 50000;
  const formattedHa = new Intl.NumberFormat("id-ID").format(numericValue);
  const kmSq = (numericValue / 100).toFixed(0);

  return (
    <Container.Root flex={"1 1 300px"} withContext={true} {...props}>
      <Container.Body gap={"md"} py={"md"}>
        <HStack justify={"space-between"} align={"center"} px={"md"}>
          <HStack gap={"xs"} align={"center"}>
            <Heading>{"Batas AOI Geospasial"}</Heading>
            <InfoTip
              variant={"icon"}
              appIconProps={{ size: "xs", color: "fg.subtle" }}
            >
              {aoiPolicy.description}
            </InfoTip>
          </HStack>

          <InternalSystemPolicyModalTrigger policy={aoiPolicy}>
            <IconButton
              variant={"ghost"}
              size={"xs"}
              aria-label={"Ubah Batas AOI"}
            >
              <AppIcon icon={PencilIcon} />
            </IconButton>
          </InternalSystemPolicyModalTrigger>
        </HStack>

        <HStack
          align={"center"}
          justify={"space-between"}
          gap={"md"}
          px={"md"}
          py={"md"}
        >
          <HStack gap={"md"}>
            <Circle size={"48px"} bg={"blue.subtle"} color={"blue.fg"}>
              <AppIcon icon={ShieldCheckIcon} size={"lg"} />
            </Circle>
            <VStack align={"start"} gap={"2xs"}>
              <P fontSize={"xs"} color={"fg.muted"}>
                {"Luas Maksimal Per Permintaan"}
              </P>
              <HStack gap={"xs"} align={"baseline"}>
                <Heading size={"2xl"} color={"blue.fg"}>
                  {formattedHa}
                </Heading>
                <P fontSize={"sm"} fontWeight={"medium"} color={"fg.muted"}>
                  {"ha"}
                </P>
              </HStack>
              <P fontSize={"xs"} color={"fg.subtle"}>
                {`Setara ±${kmSq} km² cakupan area`}
              </P>
            </VStack>
          </HStack>
        </HStack>
      </Container.Body>
    </Container.Root>
  );
};
