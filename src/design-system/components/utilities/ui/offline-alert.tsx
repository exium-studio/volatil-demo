// src/design-system/components/utilities/ui/offline-alert.tsx

"use client";

import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Box, Circle } from "@/design-system/components/layout/ui/box";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { toast } from "@/design-system/components/toast";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { P } from "@/design-system/components/typography/ui/p";
import { Portal } from "@/design-system/components/utilities/ui/portal";
import { t } from "@/shared/libs/i18n";
import { WifiOffIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export const OfflineAlert = () => {
  // States
  const [isVisible, setIsVisible] = useState(false);

  // Refs
  const isOfflineRef = useRef(
    typeof navigator !== "undefined" ? !navigator.onLine : false,
  );
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Handlers
  const triggerAlert = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }
    setIsVisible(true);
    hideTimerRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 3000);
  }, []);

  // Effects
  useEffect(() => {
    const handleOffline = () => {
      isOfflineRef.current = true;
      triggerAlert();
    };

    const handleOnline = () => {
      isOfflineRef.current = false;
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
      setIsVisible(false);
      toast.create({
        variant: "success",
        title: "You're back online",
      });
    };

    // Initial check on mount
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      handleOffline();
    }

    // Polling every 30 seconds
    const pollInterval = setInterval(() => {
      const isCurrentlyOffline =
        typeof navigator !== "undefined"
          ? !navigator.onLine
          : isOfflineRef.current;
      if (isCurrentlyOffline || isOfflineRef.current) {
        triggerAlert();
      }
    }, 30000);

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    window.addEventListener("app:network-offline", handleOffline);

    return () => {
      clearInterval(pollInterval);
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("app:network-offline", handleOffline);
    };
  }, [triggerAlert]);

  return (
    <Portal>
      <Box
        pos={"fixed"}
        inset={0}
        zIndex={"max"}
        pointerEvents={"none"}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        p={"md"}
        opacity={isVisible ? 1 : 0}
        transform={isVisible ? "scale(1)" : "scale(0.95)"}
        transition={
          "opacity 300ms cubic-bezier(0.16, 1, 0.3, 1), transform 300ms cubic-bezier(0.16, 1, 0.3, 1)"
        }
      >
        <VStack align={"center"} gap={"md"} textAlign={"center"}>
          <Box
            pos={"relative"}
            display={"inline-flex"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            {/* Outer expanding elegant pulse ripple */}
            <Circle
              pos={"absolute"}
              inset={0}
              size={"76px"}
              bg={"red.emphasized"}
              opacity={0.35}
              pointerEvents={"none"}
              animation={"ping 2s cubic-bezier(0, 0, 0.2, 1) infinite"}
            />

            {/* Inner Icon Circle */}
            <Circle
              size={"76px"}
              pos={"relative"}
              bg={"red.muted"}
              color={"red.fg"}
              border={"12px solid"}
              borderColor={"red.subtle"}
            >
              <AppIcon icon={WifiOffIcon} size={"lg"} />
            </Circle>
          </Box>

          <VStack gap={"xs"} align={"center"}>
            <Heading size={"md"} fontWeight={"semibold"} color={"fg.default"}>
              {t["offline_alert.title"]()}
            </Heading>
            <P fontSize={"sm"} color={"fg.muted"} maxW={"300px"}>
              {t["offline_alert.description"]()}
            </P>
          </VStack>
        </VStack>
      </Box>
    </Portal>
  );
};
