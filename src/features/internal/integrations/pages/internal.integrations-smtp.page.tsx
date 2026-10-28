// src/features/internal/integrations/pages/internal.integrations-smtp.page.tsx

import { Container } from "@/design-system/components/layout/ui/container";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { AppContentContainer } from "@/design-system/components/layout/ui/page-container";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { HeaderContainer } from "@/design-system/components/shell/ui/header-container";
import { ClampedHeading } from "@/design-system/components/typography/ui/heading";
import { P } from "@/design-system/components/typography/ui/p";
import { SmtpConfigForm } from "@/features/internal/integrations/components/smtp-config-form";

export const InternalIntegrationsSmtpPage = () => {
  return (
    <AppContentContainer flex={1} minH={0} position={"relative"}>
      <Container.Root withContext={true} flex={1} w={"full"} minH={0} position={"relative"}>
        <Container.Body overflowY={"auto"}>
          {/* Header */}
          <HeaderContainer justify={"space-between"} pr={"xs"}>
            <VStack align={"start"} gap={1} py={"sm"}>
              <ClampedHeading>
                {"Integrasi Email - SMTP"}
              </ClampedHeading>

              <P fontSize={"sm"} color={"fg.muted"}>
                {"Pengaturan mail server untuk pengiriman kode billing, kredensial pendaftaran, dan notifikasi sistem."}
              </P>
            </VStack>
          </HeaderContainer>

          <Separator borderColor={"border.subtle"} />

          {/* Body Form */}
          <VStack align={"stretch"} w={"full"} flex={1} p={["md", "lg"]} pb={16}>
            <SmtpConfigForm />
          </VStack>
        </Container.Body>
      </Container.Root>
    </AppContentContainer>
  );
};
