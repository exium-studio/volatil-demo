// src/design-system/components/shell/ui/basic-app-shell.tsx

import { Logo } from "@/design-system/components/branding/ui/logo";
import { Button } from "@/design-system/components/button/ui/button";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { PageContainer } from "@/design-system/components/layout/ui/page-container";
import { VNavs } from "@/design-system/components/navigation/ui/v-navs";
import type { GisAppShellProps } from "@/design-system/components/shell/types/gis-app-shell.type";
import { P } from "@/design-system/components/typography/ui/p";
import { APP } from "@/design-system/constants/_meta";
import { SettingsTrigger } from "@/features/settings/components/settings";
import { APP_NAV_GROUPS } from "@/shared/constants/app.nav-groups.";
import { APP_NAVS_MAP } from "@/shared/constants/app.navs";
import type { AppNavKey } from "@/shared/types/app-navs.type";
import { Outlet, useNavigate, useParams } from "@tanstack/react-router";

export const GisAppShell = (props: GisAppShellProps) => {
  // Props
  const { ...restProps } = props;

  return (
    <PageContainer flexDir={"row"} {...restProps}>
      <SideBar />

      <SettingsTrigger modalKey={"settings"} mt={"auto"}>
        <Button>Settings</Button>
      </SettingsTrigger>
      <Outlet />
    </PageContainer>
  );
};

const SideBar = () => {
  // Hooks
  const navigate = useNavigate();
  const params = useParams({
    strict: false,
  }) as {
    activeAppNavKey: AppNavKey;
  };

  // Derived Values
  const activeAppNavKey = params.activeAppNavKey;

  return (
    <VStack className={"debug"} w={"240px"}>
      <HStack align={"center"} justify={"center"} gap={1} p={4}>
        <Logo />

        <P mr={1} fontSize={"lg"} fontWeight={"semibold"}>
          {APP.title}
        </P>
      </HStack>

      <VNavs<AppNavKey>
        groups={APP_NAV_GROUPS}
        navs={APP_NAVS_MAP}
        // expanded={false}
        onNavClick={(key) => {
          navigate({
            to: ".",
            resetScroll: false,
            replace: !!activeAppNavKey,
            search: (old) => ({ ...old, activeAppNavKey: key }),
          });
        }}
        p={2}
      />
    </VStack>
  );
};
