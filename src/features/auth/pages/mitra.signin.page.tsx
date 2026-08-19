// src/features/auth/pages/mitra.signin.page.tsx

import { IgtLogo } from "@/design-system/components/branding/ui/igt-logo";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { SimpleGrid } from "@/design-system/components/layout/ui/grid";
import { PageContainer } from "@/design-system/components/layout/ui/page-container";
import { P, PSerif } from "@/design-system/components/typography/ui/p";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { MitraSignin } from "@/features/auth/components/ui/signin.form";
import { FeaturesCarousel } from "@/features/branding/components/ui/features-carousel";

export const MitraSigninPage = () => {
  // Stores
  const { theme } = useThemeStore();

  return (
    <PageContainer p={4}>
      <SimpleGrid
        columns={[1, null, 2]}
        flex={1}
        overflow={"clip"}
        w={"full"}
        maxW={"1200px"}
        maxH={[null, null, "680px"]}
        m={"auto"}
        borderColor={"border.subtle"}
        rounded={theme.radii.container}
      >
        <FeaturesCarousel />

        <VStack overflowY={"auto"} px={[0, null, 12]} py={12}>
          <HStack align={"center"} justify={"center"} gap={4} ml={-4}>
            <IgtLogo />

            <VStack>
              <P fontSize={"lg"} fontWeight={"semibold"}>
                {"Kementrian ATR/BPM"}
              </P>

              <PSerif>{"Melayani Profesional Terpercaya"}</PSerif>
            </VStack>
          </HStack>

          <MitraSignin px={[0, null, 8]} mt={8} />
        </VStack>
      </SimpleGrid>
    </PageContainer>
  );
};
