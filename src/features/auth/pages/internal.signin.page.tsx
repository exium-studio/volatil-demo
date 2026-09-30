// src/features/auth/pages/internal.signin.page.tsx

import { IgtLogo } from "@/design-system/components/branding/ui/igt-logo";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { SimpleGrid } from "@/design-system/components/layout/ui/grid";
import { P, PSerif } from "@/design-system/components/typography/ui/p";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { InternalSignin } from "@/features/auth/components/ui/signin.form";
import { FeaturesCarousel } from "@/features/branding/components/ui/features-carousel";

export const InternalSigninPage = () => {
  // Stores
  const { theme } = useThemeStore();

  return (
    <SimpleGrid
      columns={[1, null, 2]}
      overflow={"clip"}
      w={"full"}
      maxW={"1200px"}
      h={[null, null, "720px"]}
      m={"auto"}
      bg={"bg.body"}
      rounded={theme.radii.container}
      shadow={"2xl"}
    >
      <FeaturesCarousel h={"full"} />

      <VStack h={"full"} overflowY={"auto"} px={[0, null, 12]} py={12} justify={"center"}>
        <HStack align={"center"} justify={"center"} gap={4} ml={-4}>
          <IgtLogo />

          <VStack>
            <P fontSize={"lg"} fontWeight={"semibold"}>
              {"Kementrian ATR/BPM"}
            </P>

            <PSerif>{"Melayani Profesional Terpercaya"}</PSerif>
          </VStack>
        </HStack>

        <InternalSignin px={[0, null, 8]} mt={8} />
      </VStack>
    </SimpleGrid>
  );
};
