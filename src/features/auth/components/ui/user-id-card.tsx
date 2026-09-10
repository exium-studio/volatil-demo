// src/features/auth/components/ui/user-id-card.tsx

import { IgtLogo } from "@/design-system/components/branding/ui/igt-logo";
import { Button } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Box, Circle } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { VMaskedContainer } from "@/design-system/components/layout/ui/masked-container";
import { Image } from "@/design-system/components/media/ui/image";
import { P } from "@/design-system/components/typography/ui/p";
import { APP_CONFIG } from "@/design-system/constants/_meta";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { SignoutTrigger } from "@/features/auth/components/ui/signout-modal";
import { useSignoutMutation } from "@/features/auth/hooks/use-signout.mutation";
import type { UserIdCardProps } from "@/features/auth/types/user-id-card.type";
import { getUserSession } from "@/shared/utils/user/user-session.utils";
import { LogOutIcon } from "lucide-react";

export const UserIdCard = (props: UserIdCardProps) => {
  // Props
  const {
    maskingTop = "0px",
    withSignoutButton = false,
    user: propUser,
    userAvatarSrc = "",
    ...restProps
  } = props;

  // Stores
  const { theme } = useThemeStore();

  // Hooks
  const signoutMutation = useSignoutMutation();

  // Derived Values
  const sessionUser = getUserSession();
  const user = propUser ?? sessionUser;

  const displayName = user?.name || user?.email || "User";
  const displayRole =
    user?.role === "mitra"
      ? "Mitra ATR/BPN"
      : user?.role === "internal"
        ? "Internal Admin ATR/BPN"
        : "User Role";

  return (
    <VStack
      className={"UserIdCard"}
      align={"center"}
      w={"full"}
      pos={"relative"}
      pt={"44px"}
      {...restProps}
    >
      {/* Card behind */}
      <VStack
        flex={1}
        aspectRatio={1 / 1.6}
        w={"full"}
        maxW={restProps?.maxW}
        bg={`${theme.colorPalette}.solid`}
        rounded={theme.radii.component}
        shadow={"xs"}
        overflow={"clip"}
        pos={"absolute"}
        top={"44px"}
        transform={"translate(-36px, -6px) rotate(10deg)"}
        zIndex={1}
      >
        <HStack
          align={"center"}
          gap={2}
          pos={"absolute"}
          bottom={"10px"}
          left={"52px"}
          transform={"rotate(-90deg)"}
          transformOrigin={"left bottom"}
          whiteSpace={"nowrap"}
          opacity={0.5}
        >
          <IgtLogo boxSize={8} filter={"brightness(0) invert(1)"} />

          <P
            fontSize={"32px"}
            fontWeight={"semibold"}
            color={`${theme.colorPalette}.contrast`}
          >
            {APP_CONFIG.title}
          </P>
        </HStack>
      </VStack>

      {/* Card front */}
      <VStack
        flex={1}
        aspectRatio={1 / 1.6}
        w={"full"}
        maxW={restProps?.maxW}
        bg={"bg.body"}
        borderWidth={"1px"}
        borderColor={"border.subtle"}
        rounded={theme.radii.component}
        shadow={"sm"}
        overflow={"clip"}
        zIndex={2}
      >
        <Image
          src={userAvatarSrc}
          w={"full"}
          aspectRatio={1}
          objectFit={"cover"}
        />

        <VStack flex={1} justify={"space-between"} gap={4} p={4}>
          <VStack align={"start"} gap={1}>
            <P fontSize={"lg"} fontWeight={"medium"}>
              {displayName}
            </P>

            <P color={"fg.subtle"}>{displayRole}</P>
          </VStack>

          <HStack align={"end"} justify={"space-between"} w={"full"} pos={"relative"}>
            <P fontSize={"xs"} color={"fg.muted"}>
              {APP_CONFIG.title}
            </P>

            {withSignoutButton && (
              <SignoutTrigger>
                <Button
                  variant={"ghost"}
                  size={"xs"}
                  pos={"absolute"}
                  right={"10px"}
                  bottom={"10px"}
                  loading={signoutMutation.isPending}
                  _hover={{
                    color: "fg.error",
                  }}
                >
                  <AppIcon icon={LogOutIcon} />
                </Button>
              </SignoutTrigger>
            )}
          </HStack>
        </VStack>
      </VStack>

      {/* Card accessories */}
      <>
        {/* Hole */}
        <Circle
          size={"12px"}
          bg={"bg.body"}
          rounded={"full"}
          pos={"absolute"}
          left={"50%"}
          top={"52px"}
          transform={"translateX(-50%)"}
          zIndex={3}
        />

        {/* Hook */}
        <Box
          w={"8px"}
          h={"24px"}
          bg={"gray.400"}
          roundedBottom={"sm"}
          pos={"absolute"}
          left={"50%"}
          top={"34px"}
          transform={"translateX(-50%)"}
          zIndex={3}
        />
        <Box
          w={"40px"}
          h={"16px"}
          p={1}
          bg={"gray.500"}
          rounded={"full"}
          pos={"absolute"}
          left={"50%"}
          top={"20px"}
          transform={"translateX(-50%)"}
          zIndex={3}
        >
          <Box w={"full"} h={"full"} bg={"bg.body"} rounded={"full"} />
        </Box>

        {/* Strap */}
        <VMaskedContainer
          maskingTop={maskingTop}
          maskingBottom={0}
          pos={"absolute"}
          left={"50%"}
          top={"0px"}
          transform={"translateX(-50%)"}
          zIndex={3}
        >
          <Box
            w={"30px"}
            h={"24px"}
            bg={`${theme.colorPalette}.solid`}
            roundedBottom={"sm"}
          />
        </VMaskedContainer>
      </>
    </VStack>
  );
};
