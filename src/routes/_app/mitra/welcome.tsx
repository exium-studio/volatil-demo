// src/routes/_app/mitra/welcome.tsx

import { PanelContentContainer } from "@/design-system/components/layout/ui/page-container";
import { P } from "@/design-system/components/typography/ui/p";
import { t } from "@/shared/libs/i18n";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/mitra/welcome")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PanelContentContainer align={"center"} justify={"center"} gap={1} p={4}>
      <P fontSize={"lg"} fontWeight={"medium"} textAlign={"center"}>
        {t["common.welcome_intro"]()}
      </P>
    </PanelContentContainer>
  );
}
