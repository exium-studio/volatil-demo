import { Container } from "@/design-system/components/layout/ui/container";
import { PanelContentContainer } from "@/design-system/components/layout/ui/page-container";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { HeaderContainer } from "@/design-system/components/shell/ui/header-container";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { HelpCenterDataView } from "@/features/mitra/help-center/components/help-center.data-view";
import { HelpCenterSummary } from "@/features/mitra/help-center/components/help-center.summary";

export const HelpCenterPage = () => {
  return (
    <PanelContentContainer overflowY={"auto"}>
      <Container.Root withContext={true}>
        <Container.Body p={0}>
          <HeaderContainer>
            <Heading>Ringkasan Laporan</Heading>
          </HeaderContainer>

          <Separator borderColor={"bg.canvas"} />

          <HelpCenterSummary />
        </Container.Body>
      </Container.Root>

      <HelpCenterDataView />
    </PanelContentContainer>
  );
};
