import { Container } from "@/design-system/components/layout/ui/container";
import { PanelContentContainer } from "@/design-system/components/layout/ui/page-container";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { HeaderContainer } from "@/design-system/components/shell/ui/header-container";
import { ClampedP } from "@/design-system/components/typography/ui/p";
import { MitraMyDataList } from "@/features/mitra/my-data/components/mitra.my-data-list";

export const MitraMyDataPage = () => (
  <Container.Root flex={1} minH={0} withContext={true}>
    <PanelContentContainer>
      <Container.Body flex={1} minH={0} overflowY={"auto"}>
        <HeaderContainer>
          <ClampedP fontSize={"lg"} fontWeight={"semibold"}>
            {"Data Saya"}
          </ClampedP>
        </HeaderContainer>

        <Separator borderColor={"bg.canvas"} />

        <MitraMyDataList />
      </Container.Body>
    </PanelContentContainer>
  </Container.Root>
);
