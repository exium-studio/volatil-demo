// src/features/auth/pages/signin.page.tsx

import { AtrLogo } from "@/design-system/components/branding/ui/atr-logo";
import { SegmentedControl } from "@/design-system/components/input/ui/segmented-control";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { SimpleGrid } from "@/design-system/components/layout/ui/grid";
import { PageContainer } from "@/design-system/components/layout/ui/page-container";
import { P, PSerif } from "@/design-system/components/typography/ui/p";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import {
  InternalSignin,
  MitraSignin,
} from "@/features/auth/components/ui/signin.form";
import { FeaturesCarousel } from "@/features/branding/components/ui/features-carousel";
import type { Role } from "@/shared/types/auth.type";
import { useState } from "react";

export const SigninPage = () => {
  // Stores
  const { theme } = useThemeStore();

  // State
  const [role, setRole] = useState<Role>("mitra");

  // Constants
  const SIGNIN_MAP = {
    mitra: {
      component: <MitraSignin />,
    },
    internal: {
      component: <InternalSignin />,
    },
  };
  const ROLE_OPTIONS = [
    {
      label: "Mitra Kementrian ATR/BPN",
      value: "mitra",
    },
    {
      label: "Internal Kementrian ATR/BPN",
      value: "internal",
    },
  ];

  return (
    <PageContainer align={"center"} p={4}>
      <SimpleGrid
        columns={[1, null, 2]}
        flex={1}
        overflow={"clip"}
        w={"full"}
        maxW={"1200px"}
        maxH={[null, null, "680px"]}
        my={"auto"}
        // border={"1px solid"}
        borderColor={"border.subtle"}
        rounded={theme.radii.container}
        // shadow={"md"}
      >
        <FeaturesCarousel />

        <VStack overflowY={"auto"} px={[0, null, 12]} py={12}>
          <HStack align={"center"} justify={"center"} gap={2} ml={-4}>
            <AtrLogo />

            <VStack>
              <P fontSize={"lg"} fontWeight={"semibold"}>
                Kementrian ATR/BPM
              </P>

              <PSerif>Melayani Profesional Terpercaya</PSerif>
            </VStack>
          </HStack>

          <VStack flex={1} mt={12}>
            <VStack align={"center"} gap={1}>
              <P fontSize={"2xl"} fontWeight={"semibold"} textAlign={"center"}>
                Selamat Datang Kembali 👋🏻
              </P>

              <P color={"fg.muted"} textAlign={"center"}>
                Pastikan informasi yang dimasukkan sudah benar!
              </P>
            </VStack>

            <VStack flex={1} gap={10} px={[0, null, 8]} mt={4}>
              <SegmentedControl
                options={ROLE_OPTIONS}
                defaultValue={"mitra"}
                onValueChange={(details) => {
                  setRole(details.value as Role);
                }}
                w={"fit"}
                mx={"auto"}
                mt={4}
              />

              <VStack flex={1}>{SIGNIN_MAP[role].component}</VStack>
            </VStack>
          </VStack>
        </VStack>
      </SimpleGrid>
    </PageContainer>
  );
};
