// src/design-system/components/feedback/ui/state.welcome.tsx

import { IgtLogo } from "@/design-system/components/branding/ui/igt-logo";
import { Button } from "@/design-system/components/button/ui/button";
import type { WelcomeStateProps } from "@/design-system/components/feedback/types/state.welcome.type";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { PanelContentContainer } from "@/design-system/components/layout/ui/page-container";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { P } from "@/design-system/components/typography/ui/p";
import {
  APP_NAVS_MAP,
  INTERNAL_APP_NAVS_MAP,
} from "@/shared/constants/app.navs";
import { t } from "@/shared/libs/i18n";
import type { NavItem } from "@/shared/types/nav.type";
import {
  getRecentNavs,
  type RecentNavItem,
} from "@/shared/utils/navigation/recent-nav.utils";
import { getUserSession } from "@/shared/utils/user/user-session.utils";
import { useNavigate } from "@tanstack/react-router";
import { ArrowUpRightIcon } from "lucide-react";
import { useMemo } from "react";

const getDisplayNavItems = (isMitra: boolean) => {
  const navsMap = (isMitra ? APP_NAVS_MAP : INTERNAL_APP_NAVS_MAP) as Record<
    string,
    NavItem
  >;
  const history = getRecentNavs();

  const fromHistory = history
    .map((item: RecentNavItem) => {
      const matchingNav = Object.values(navsMap).find(
        (nav) => nav.pathname === item.pathname,
      );
      if (!matchingNav) return null;
      return {
        pathname: item.pathname,
        title: t[matchingNav.titleKey](),
        icon: matchingNav.icon,
      };
    })
    .filter(Boolean) as {
    pathname: string;
    title: string;
    icon: NavItem["icon"];
  }[];

  if (fromHistory.length >= 3) {
    return fromHistory.slice(0, 3);
  }

  const defaultNavKeys = isMitra
    ? ["data_request", "my_data", "transaction_history"]
    : ["data_management", "batch_review", "master_geoserver"];

  const fallbackItems = defaultNavKeys
    .map((key) => {
      const nav = navsMap[key];
      if (!nav || !nav.pathname) return null;
      return {
        pathname: nav.pathname,
        title: t[nav.titleKey](),
        icon: nav.icon,
      };
    })
    .filter(Boolean) as {
    pathname: string;
    title: string;
    icon: NavItem["icon"];
  }[];

  const merged = [...fromHistory];
  for (const fb of fallbackItems) {
    if (merged.length >= 3) break;
    if (!merged.some((m) => m.pathname === fb.pathname)) {
      merged.push(fb);
    }
  }
  return merged.slice(0, 3);
};

export const WelcomeState = (props: WelcomeStateProps) => {
  // Navigation
  const navigate = useNavigate();

  // Props
  const { title, subtitle, ...restProps } = props;

  // Derived Values
  const user = useMemo(() => getUserSession(), []);
  const isMitra = user?.role === "mitra";

  const resolvedTitle = title ?? t["common.welcome_intro"]();
  const resolvedSubtitle = subtitle ?? "Semoga harini berjalan lancar";
  const displayNavItems = useMemo(() => getDisplayNavItems(isMitra), [isMitra]);

  return (
    <PanelContentContainer
      align={"center"}
      justify={"center"}
      p={"xl"}
      bg={"bg.canvas"}
      {...restProps}
    >
      <VStack
        align={"center"}
        textAlign={"center"}
        maxW={"480px"}
        w={"full"}
        gap={"lg"}
      >
        {/* Minimal Logo */}
        <IgtLogo />

        {/* Title & Subtitle */}
        <VStack align={"center"} gap={"xs"}>
          <Heading as={"h1"} size={"xl"}>
            {resolvedTitle}
          </Heading>

          <P fontSize={"sm"} color={"fg.muted"} maxW={"380px"}>
            {resolvedSubtitle}
          </P>
        </VStack>

        {/* 3 Last / Suggested Navigations in clean neutral outline VStack */}
        <VStack w={"full"} maxW={"360px"} gap={"xs"} mt={"xs"}>
          {displayNavItems.map((nav) => (
            <Button
              key={nav.pathname}
              variant={"outline"}
              w={"full"}
              justifyContent={"space-between"}
              onClick={() => {
                navigate({ to: nav.pathname });
              }}
            >
              <HStack gap={"sm"} align={"center"}>
                <AppIcon icon={nav.icon} />

                <P fontWeight={"medium"} color={"fg.base"}>
                  {nav.title}
                </P>
              </HStack>

              <AppIcon icon={ArrowUpRightIcon} color={"fg.subtle"} />
            </Button>
          ))}
        </VStack>

        <Separator w={"60px"} />

        <P fontSize={"xs"} color={"fg.subtle"}>
          {"Pilih menu pada bilah samping untuk mulai bernavigasi."}
        </P>
      </VStack>
    </PanelContentContainer>
  );
};
