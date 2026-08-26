import { Button } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Switch } from "@/design-system/components/input/ui/switch";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { Avatar } from "@/design-system/components/media/ui/avatar";
import { Popover } from "@/design-system/components/overlay/ui/popover";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { ClampedP, P } from "@/design-system/components/typography/ui/p";
import { useColorMode } from "@/design-system/hooks/use-color-mode";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { SignoutTrigger } from "@/features/auth/components/ui/signout-modal";
import { useSignoutMutation } from "@/features/auth/hooks/use-signout.mutation";
import type { UserProfilePopoverTriggerProps } from "@/features/auth/types/user-profile-popover.type";
import { getUserSession } from "@/shared/utils/user/user-session.utils";
import { LogOutIcon, MoonIcon, SunIcon } from "lucide-react";
import { useMemo } from "react";

export const UserProfilePopoverTrigger = (
  props: UserProfilePopoverTriggerProps,
) => {
  // Props
  const { children } = props;

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
  const roleColorPalette = user?.role === "mitra" ? "blue" : "purple";

  return (
    <Popover.Root
      positioning={{
        placement: "right-end",
        gutter: 12,
      }}
    >
      <Popover.Trigger>{children}</Popover.Trigger>

      <Popover.Content minW={"240px"} zIndex={"dropdown"}>
        <Popover.Body p={0}>
          <VStack>
            <VStack gap={"md"} align={"center"} p={"md"}>
              <Avatar
                name={displayName || displayEmail || "User"}
                size={"2xl"}
                colorPalette={theme.colorPalette}
                flexShrink={0}
              />

              <VStack align={"center"} gap={"xs"}>
                {user?.role && (
                  <Badge
                    colorPalette={roleColorPalette}
                    variant={"subtle"}
                    mb={"xs"}
                  >
                    {displayRole}
                  </Badge>
                )}

                <HStack
                  align={"center"}
                  justify={"center"}
                  gap={"sm"}
                  w={"full"}
                >
                  <ClampedP fontWeight={"semibold"} textAlign={"center"}>
                    {displayName}
                  </ClampedP>
                </HStack>

                {displayEmail && (
                  <ClampedP
                    fontSize={"sm"}
                    color={"fg.muted"}
                    textAlign={"center"}
                  >
                    {displayEmail}
                  </ClampedP>
                )}
              </VStack>
            </VStack>

            <Separator />

            <VStack gap={"2xs"} p={"xs"}>
              {/* Dark Mode Toggle */}
              <Button
                justifyContent={"space-between"}
                px={"sm"}
                onClick={toggleColorMode}
              >
                <HStack gap={"xs"} align={"center"}>
                  <AppIcon
                    icon={isDarkMode ? MoonIcon : SunIcon}
                    color={"fg.muted"}
                  />

                  <P>{"Mode Gelap"}</P>
                </HStack>

                <Switch checked={isDarkMode} pointerEvents={"none"} />
              </Button>

              {/* Signout Button */}
              <SignoutTrigger>
                <Button
                  colorPalette={"red"}
                  size={"sm"}
                  w={"full"}
                  px={"sm"}
                  loading={signoutMutation.isPending}
                  justifyContent={"start"}
                >
                  <AppIcon icon={LogOutIcon} />
                  {"Keluar"}
                </Button>
              </SignoutTrigger>
            </VStack>
          </VStack>
        </Popover.Body>
      </Popover.Content>
    </Popover.Root>
  );
};
