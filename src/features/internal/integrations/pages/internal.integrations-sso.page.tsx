// src/features/internal/integrations/pages/internal.integrations-sso.page.tsx

import { Container } from "@/design-system/components/layout/ui/container";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { AppContentContainer } from "@/design-system/components/layout/ui/page-container";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { HeaderContainer } from "@/design-system/components/shell/ui/header-container";
import { ClampedHeading } from "@/design-system/components/typography/ui/heading";
import { P } from "@/design-system/components/typography/ui/p";
import { SsoConfigForm } from "@/features/internal/integrations/components/sso-config-form";

export const InternalIntegrationsSsoPage = () => {
  return (
    <AppContentContainer flex={1} minH={0} position={"relative"}>
      <Container.Root
        withContext={true}
        flex={1}
        w={"full"}
        minH={0}
        position={"relative"}
      >
        <Container.Body overflowY={"auto"}>
          {/* Header */}
          <HeaderContainer justify={"space-between"} pr={"xs"}>
            <VStack align={"start"} gap={1} py={"sm"}>
              <ClampedHeading>
                {"Integrasi Single Sign-On (SSO) Keycloak"}
              </ClampedHeading>
            </VStack>
          </HeaderContainer>

          <Separator borderColor={"border.subtle"} />

          {/* Body Form */}
          <VStack
            flex={1}
            align={"stretch"}
            gap={"xl"}
            w={"full"}
            p={"md"}
            overflowY={"auto"}
          >
            <P fontSize={"sm"} color={"fg.muted"}>
              {
                "Konfigurasi protokol OpenID Connect (OIDC) Pusdatin ATR/BPN untuk autentikasi pegawai internal."
              }
            </P>

            <SsoConfigForm />
          </VStack>
        </Container.Body>
      </Container.Root>
    </AppContentContainer>
  );
};
