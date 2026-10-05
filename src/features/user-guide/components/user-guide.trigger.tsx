// src/features/user-guide/components/user-guide.trigger.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { P } from "@/design-system/components/typography/ui/p";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { UserGuideModal } from "@/features/user-guide/components/user-guide.modal";
import type { UserGuideTriggerProps } from "@/features/user-guide/types/user-guide.type";
import { BookOpenIcon, ChevronRightIcon, HelpCircleIcon } from "lucide-react";

export const UserGuideTrigger = (props: UserGuideTriggerProps) => {
  // Props
  const {
    modalKey = "login-user-guide-modal",
    portalType = "all",
    variant = "banner",
    children,
  } = props;

  // Stores
  const { theme } = useThemeStore();

  // Stores & Hooks
  const { isOpen, open, close } = usePopModal({ modalKey });

  return (
    <>
      {children && (
        <span onClick={() => open()} style={{ cursor: "pointer" }}>
          {children}
        </span>
      )}

      {!children && variant === "button" && (
        <Button
          variant={"outline"}
          colorPalette={"gray"}
          onClick={() => open()}
        >
          <AppIcon icon={BookOpenIcon} />
          {"Panduan Pengguna"}
        </Button>
      )}

      {!children && variant === "banner" && (
        <HStack
          align={"center"}
          justify={"space-between"}
          w={"full"}
          p={"sm"}
          bg={"bg.subtle"}
          border={"1px solid"}
          borderColor={"border.subtle"}
          rounded={theme.radii.component}
          cursor={"pointer"}
          transition={"200ms"}
          _hover={{
            bg: "bg.canvas",
            borderColor: `${theme.colorPalette}.focusRing`,
          }}
          onClick={() => open()}
        >
          <HStack gap={"sm"} align={"center"}>
            <AppIcon icon={BookOpenIcon} color={`${theme.colorPalette}.fg`} />

            <VStack align={"start"} gap={0}>
              <P fontWeight={"medium"} color={"fg"}>
                {"Butuh Bantuan? Pelajari Dokumen Panduan"}
              </P>

              <P color={"fg.subtle"}>
                {"Manual book & petunjuk alur penggunaan sistem IGT"}
              </P>
            </VStack>
          </HStack>

          <AppIcon icon={ChevronRightIcon} boxSize={4} color={"fg.subtle"} />
        </HStack>
      )}

      {!children && variant === "link" && (
        <HStack
          gap={"2xs"}
          align={"center"}
          cursor={"pointer"}
          onClick={() => open()}
          color={"fg.subtle"}
          _hover={{ color: `${theme.colorPalette}.fg` }}
        >
          <AppIcon icon={HelpCircleIcon} boxSize={3.5} />
          <P textDecoration={"underline"}>
            {"Buku Petunjuk Penggunaan"}
          </P>
        </HStack>
      )}

      <UserGuideModal
        modalKey={modalKey}
        portalType={portalType}
        opened={isOpen}
        open={open}
        close={close}
      />
    </>
  );
};
