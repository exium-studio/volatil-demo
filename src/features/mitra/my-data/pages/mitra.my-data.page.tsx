import { Container } from "@/design-system/components/layout/ui/container";
import { PanelContentContainer } from "@/design-system/components/layout/ui/page-container";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { HeaderContainer } from "@/design-system/components/shell/ui/header-container";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { MitraMyDataDataView } from "@/features/mitra/my-data/components/mitra.my-data.data-view";

export const MitraMyDataPage = () => (
  <Container.Root flex={1} minH={0} withContext={true}>
    <PanelContentContainer>
      <Container.Body flex={1} minH={0} overflowY={"auto"}>
        <HeaderContainer>
          <Heading>{"Data Saya"}</Heading>
        </HeaderContainer>

        <Separator borderColor={"bg.canvas"} />

        <MitraMyDataDataView />
      </Container.Body>
    </PanelContentContainer>
  </Container.Root>
);
