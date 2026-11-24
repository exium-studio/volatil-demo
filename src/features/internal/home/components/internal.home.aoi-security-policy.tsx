// src/features/internal/home/components/internal.home.aoi-security-policy.tsx

import { IconButton } from "@/design-system/components/button/ui/button";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { InfoTip } from "@/design-system/components/input/ui/toggle-tip";
import { Circle } from "@/design-system/components/layout/ui/box";
import {
  Container,
  useContainerContext,
} from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { HeaderContainer } from "@/design-system/components/shell/ui/header-container";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { P } from "@/design-system/components/typography/ui/p";
import { InternalSystemPolicyModalTrigger } from "@/features/internal/system-policies/components/internal.system-policies.modal";
import { useInternalSystemPoliciesQuery } from "@/features/internal/system-policies/hooks/use-internal-system-policies";
import type { SystemPolicyItem } from "@/features/mitra/data-request/types/mitra.data-request.pricing-policy.type";
import { PencilIcon, ShieldCheckIcon } from "lucide-react";
import { useMemo } from "react";

export const InternalHomeAoiSecurityPolicy = (props: { w?: string }) => {
  return (
    <Container.Root flex={"1 1 350px"} withContext={true} {...props}>
      <InternalHomeAoiSecurityPolicyContent />
    </Container.Root>
  );
};

const InternalHomeAoiSecurityPolicyContent = () => {
  // Contexts
  const { isSmContainer } = useContainerContext();

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
    return <Skeleton minH={isSmContainer ? "140px" : "110px"} w={"full"} />;
  }

  const numericValue = Number(aoiPolicy.value) || 50000;
  const formattedHa = new Intl.NumberFormat("id-ID").format(numericValue);
  const kmSq = (numericValue / 100).toFixed(0);

  return (
    <Container.Body>
      <HeaderContainer>
        <HStack align={"center"} gap={"xs"}>
          <Heading size={"md"}>
            {"Kebijakan Proteksi Geospasial & Batas AOI"}
          </Heading>

          <InfoTip
            variant={"icon"}
            appIconProps={{
              size: "xs",
              color: "fg.subtle",
            }}
          >
            {
              "Batas maksimum luas area of interest (AOI) yang diizinkan untuk query spasial dan pemesanan mitra."
            }
          </InfoTip>
        </HStack>

        <HStack align={"center"} gap={"xs"}>
          <InternalSystemPolicyModalTrigger policy={aoiPolicy}>
            <IconButton
              variant={"ghost"}
              size={"xs"}
              aria-label={"Ubah Kebijakan AOI"}
            >
              <AppIcon icon={PencilIcon} />
            </IconButton>
          </InternalSystemPolicyModalTrigger>
        </HStack>
      </HeaderContainer>

      <Separator borderColor={"bg.canvas"} />

      <HStack
        p={"md"}
        borderWidth={"1px"}
        borderRadius={"md"}
        borderColor={"border.muted"}
        bg={"bg.subtle"}
        justify={"space-between"}
        align={"center"}
        wrap={"wrap"}
        gap={"sm"}
        w={"full"}
      >
        <HStack gap={"sm"}>
          <Circle size={"40px"} bg={"blue.subtle"} color={"blue.fg"}>
            <AppIcon icon={ShieldCheckIcon} size={"md"} />
          </Circle>
          <VStack align={"start"} gap={"2xs"}>
            <HStack gap={"2xs"}>
              <P fontWeight={"semibold"}>{aoiPolicy.label}</P>
              <InfoTip content={aoiPolicy.description} />
            </HStack>
            <P fontSize={"xs"} color={"fg.muted"}>
              {`Setara dengan ±${kmSq} km² luas jangkauan wilayah`}
            </P>
          </VStack>
        </HStack>

        <HStack gap={"xs"}>
          <Heading size={"xl"} color={"blue.fg"}>
            {formattedHa}
          </Heading>
          <P fontSize={"sm"} fontWeight={"medium"} color={"fg.muted"}>
            {"Hektar (ha)"}
          </P>
        </HStack>
      </HStack>
    </Container.Body>
  );
};
