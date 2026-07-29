// src/routes/_app/portal/welcome.tsx

import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { P } from "@/design-system/components/typography/ui/p";
import { t } from "@/shared/libs/i18n";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/portal/welcome")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <VStack flex={1} align={"center"} justify={"center"} gap={1} p={4}>
      <P fontSize={"lg"} fontWeight={"medium"} textAlign={"center"}>
        {t["common.welcome_intro"]()}
      </P>
    </VStack>
  );
}
