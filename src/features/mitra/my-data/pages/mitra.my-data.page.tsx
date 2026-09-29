// src/features/mitra/my-data/pages/mitra.my-data.page.tsx

import { Container } from "@/design-system/components/layout/ui/container";
import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { AppContentContainer } from "@/design-system/components/layout/ui/page-container";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { AppNavTitle } from "@/design-system/components/shell/ui/app-nav-title";
import { MitraMyDataWorkspacesDataView } from "@/features/mitra/my-data/components/mitra.my-data.workspaces-data-view";
import { APP_NAVS_MAP } from "@/shared/constants/app.navs";

export const MitraMyDataPage = () => {
  return (
    <AppContentContainer overflowY={"auto"}>
      <Container.Root flex={1} overflowY={"auto"} withContext={true}>
        <Container.Body flex={1} overflowY={"auto"}>
          <HStack wrap={"wrap"} justify={"space-between"} align={"center"}>
            <AppNavTitle navsMap={APP_NAVS_MAP} />
          </HStack>

          <Separator borderColor={"bg.canvas"} />

          <MitraMyDataWorkspacesDataView />
        </Container.Body>
      </Container.Root>
    </AppContentContainer>
  );
};
