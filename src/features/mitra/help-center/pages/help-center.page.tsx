// src/features/mitra/help-center/pages/help-center.page.tsx

import { Container } from "@/design-system/components/layout/ui/container";
import { PanelContentContainer } from "@/design-system/components/layout/ui/page-container";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { HeaderContainer } from "@/design-system/components/shell/ui/header-container";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { SPACING } from "@/design-system/constants/styles";
import { HelpCenterDataList } from "@/features/mitra/help-center/components/help-center.data-list";
import { HelpCenterSummary } from "@/features/mitra/help-center/components/help-center.summary";

export const HelpCenterPage = () => {
  return (
    <PanelContentContainer overflowY={"auto"} gap={SPACING.sm} p={SPACING.sm}>
      <Container.Root withContext={true}>
        <Container.Body p={0}>
          <HeaderContainer>
            <Heading>Ringkasan Laporan</Heading>
          </HeaderContainer>

          <Separator borderColor={"bg.canvas"} />

          <HelpCenterSummary />
        </Container.Body>
      </Container.Root>

      <HelpCenterDataList />
    </PanelContentContainer>
  );
};
