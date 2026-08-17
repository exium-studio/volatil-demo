// src/features/auth/components/ui/user-profile-popover.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Switch } from "@/design-system/components/input/ui/switch";
import { ConfirmationTrigger } from "@/design-system/components/feedback/ui/confirmation-trigger";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Avatar } from "@/design-system/components/media/ui/avatar";
import { NavButton } from "@/design-system/components/navigation/ui/nav";
import { Popover } from "@/design-system/components/overlay/ui/popover";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { ClampedP, P } from "@/design-system/components/typography/ui/p";
import { SPACING } from "@/design-system/constants/styles";
import { useColorMode } from "@/design-system/hooks/use-color-mode";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { useSignoutMutation } from "@/features/auth/hooks/use-signout.mutation";
import type { UserProfilePopoverProps } from "@/features/auth/types/user-profile-popover.type";
import { t } from "@/shared/libs/i18n";
import { getUserSession } from "@/shared/utils/user/user-session.utils";
import { LogOutIcon, MoonIcon, SunIcon, UserIcon } from "lucide-react";
import { useMemo } from "react";

export const UserProfilePopover = (props: UserProfilePopoverProps) => {
  // Props
  const { expanded = false } = props;

  // Stores & Hooks
  const { theme } = useThemeStore();
  const { colorMode, toggleColorMode } = useColorMode();
  const signoutMutation = useSignoutMutation();

  // Derived Values
  const user = useMemo(() => getUserSession(), []);
  const isDarkMode = colorMode === "dark";

  const displayName = user?.name ?? "";
  const displayEmail = user?.email ?? "";
  const displayRole = user?.role === "mitra" ? "Mitra" : "Internal";
  const roleColor = user?.role === "mitra" ? "blue" : "purple";

  return (
    <Popover.Root
      positioning={{
        placement: "right-end",
        gutter: 12,
      }}
    >
      <Popover.Trigger>
        <NavButton
          aria-label={t["app.navs.profile"]()}
          variant={"ghost"}
          w={expanded ? "full" : undefined}
        >
          <AppIcon icon={UserIcon} />
          {expanded && t["app.navs.profile"]()}
        </NavButton>
      </Popover.Trigger>

      <Popover.Content minW={"280px"}>
        <Popover.Body p={4}>
          <VStack gap={SPACING.md}>
            <HStack gap={3} align={"center"} mb={2}>
              <Avatar
                name={displayName || displayEmail || "User"}
                size={"lg"}
                colorPalette={theme.colorPalette}
                flexShrink={0}
              />

              <VStack align={"start"} gap={0} flex={1} overflow={"hidden"}>
                <HStack align={"center"} gap={2} w={"full"}>
                  <ClampedP fontWeight={"semibold"}>{displayName}</ClampedP>

                  {user?.role && (
                    <Badge
                      colorPalette={roleColor}
                      variant={"subtle"}
                      size={"xs"}
                    >
                      {displayRole}
                    </Badge>
                  )}
                </HStack>

                {displayEmail && (
                  <P color={"fg.muted"} truncate w={"full"}>
                    {displayEmail}
                  </P>
                )}
              </VStack>
            </HStack>

            {/* Dark Mode Toggle */}
            <Button
              justifyContent={"space-between"}
              px={2}
              onClick={toggleColorMode}
            >
              <HStack gap={SPACING.md} align={"center"}>
                <AppIcon
                  icon={isDarkMode ? MoonIcon : SunIcon}
                  color={"fg.muted"}
                />

                <P>{"Mode Gelap"}</P>
              </HStack>

              <Switch checked={isDarkMode} pointerEvents={"none"} />
            </Button>

            {/* Signout Button */}
            <ConfirmationTrigger
              modalKey={"auth-signout-confirmation"}
              icon={LogOutIcon}
              title={"Keluar dari Aplikasi"}
              description={"Apakah Anda yakin ingin keluar dari akun Anda?"}
              confirmLabel={"Keluar"}
              cancelLabel={"Batal"}
              colorPalette={"red"}
              onConfirm={() => signoutMutation.mutate()}
            >
              <Button
                variant={"subtle"}
                colorPalette={"red"}
                w={"full"}
                size={"sm"}
                loading={signoutMutation.isPending}
              >
                <AppIcon icon={LogOutIcon} />
                {"Keluar"}
              </Button>
            </ConfirmationTrigger>
          </VStack>
        </Popover.Body>
      </Popover.Content>
    </Popover.Root>
  );
};
