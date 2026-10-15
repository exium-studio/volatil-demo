// src/features/auth/components/ui/signin-shell.tsx

import { IgtLogo } from "@/design-system/components/branding/ui/igt-logo";
import { OutlineContourPerspective } from "@/design-system/components/decorative/ui/outline-contour-perspective";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { SimpleGrid } from "@/design-system/components/layout/ui/grid";
import { PageContainer } from "@/design-system/components/layout/ui/page-container";
import { P, PSerif } from "@/design-system/components/typography/ui/p";
import { useThemeStore } from "@/design-system/stores/theme-store";
import type { SigninShellProps } from "@/features/auth/types/signin.type";
import { FeaturesCarousel } from "@/features/branding/components/ui/features-carousel";
import { UserGuideTrigger } from "@/features/user-guide/components/user-guide.trigger";

export const SigninShell = (props: SigninShellProps) => {
  // Props
  const {
    portalType,
    intro,
    children,
    showUserGuide = true,
    guideModalKey,
  } = props;

  // Stores
  const { theme } = useThemeStore();

  // Derived Values
  const modalKey =
    guideModalKey ??
    (portalType === "mitra"
      ? "mitra-login-user-guide"
      : "internal-login-user-guide");

  return (
    <PageContainer p={[2, 4, 6]} pos={"relative"}>
      <OutlineContourPerspective
        pos={"absolute"}
        left={0}
        bottom={0}
        w={"full"}
        h={"500px"}
        opacity={0.1}
      />

      <SimpleGrid
        columns={[1, null, 2]}
        overflow={"clip"}
        w={"full"}
        maxW={"1200px"}
        minH={[null, null, "720px"]}
        m={"auto"}
        bg={"bg.body"}
        rounded={theme.radii.container}
      >
        <FeaturesCarousel h={"full"} />

        <VStack
          overflowY={"auto"}
          maxW={"450px"}
          h={"full"}
          mx={"auto"}
          py={[8, 10, 12]}
          justify={"center"}
        >
          {intro ?? (
            <HStack align={"center"} justify={"center"} gap={4} ml={-4}>
              <IgtLogo />

              <VStack>
                <P fontSize={"lg"} fontWeight={"semibold"}>
                  {"Kementerian ATR/BPN"}
                </P>

                <PSerif>{"Melayani Profesional Terpercaya"}</PSerif>
              </VStack>
            </HStack>
          )}

          {children}

          {showUserGuide && (
            <Box w={"full"} px={[0, null, 8]} mt={8} mx={"auto"}>
              <UserGuideTrigger
                modalKey={modalKey}
                portalType={portalType}
                variant={"banner"}
              />
            </Box>
          )}
        </VStack>
      </SimpleGrid>
    </PageContainer>
  );
};
