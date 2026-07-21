// src/design-system/components/shell/ui/basic-app-shell.tsx

"use client";

import { Logo } from "@/design-system/components/branding/ui/logo";
import { Button } from "@/design-system/components/button/ui/button";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { PageContainer } from "@/design-system/components/layout/ui/page-container";
import type { GisAppShellProps } from "@/design-system/components/shell/types/gis-app-shell.type";
import { SettingsTrigger } from "@/features/settings/components/settings";
import { Outlet } from "@tanstack/react-router";

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
  return (
    <VStack>
      <HStack align={"center"}>
        <Logo />
      </HStack>
    </VStack>
  );
};
