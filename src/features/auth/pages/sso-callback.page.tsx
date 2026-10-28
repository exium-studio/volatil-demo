// src/features/auth/pages/sso-callback.page.tsx

import { IgtLogo } from "@/design-system/components/branding/ui/igt-logo";
import { Button } from "@/design-system/components/button/ui/button";
import { OutlineContourPerspective } from "@/design-system/components/decorative/ui/outline-contour-perspective";
import { Loader } from "@/design-system/components/feedback/ui/loader";
import { StateRetry } from "@/design-system/components/feedback/ui/state.retry";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import {
  AbsoluteCenter,
  Center,
} from "@/design-system/components/layout/ui/center";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { PageContainer } from "@/design-system/components/layout/ui/page-container";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { P, PSerif } from "@/design-system/components/typography/ui/p";
import { useSsoCallbackMutation } from "@/features/auth/hooks/use-sso-callback.mutation";
import { useSsoSigninMutation } from "@/features/auth/hooks/use-sso-signin.mutation";
import type { SsoCallbackSearch } from "@/features/auth/types/sso.type";
import { Link, useSearch } from "@tanstack/react-router";
import { ArrowLeftIcon, ShieldCheckIcon, ShieldUserIcon } from "lucide-react";
import { useEffect, useRef } from "react";

export const SsoCallbackPage = () => {
  // Hooks
  const search = useSearch({ strict: false }) as SsoCallbackSearch;
  const ssoCallbackMutation = useSsoCallbackMutation();
  const ssoSigninMutation = useSsoSigninMutation();

  // Refs
  const hasTriggeredRef = useRef<boolean>(false);

  // Derived Values
  const code = search.code;
  const state = search.state;
  const ssoError = search.error || search.error_description;

  const isInvalidParams = !code || !state;
  const errorMessage =
    ssoError ||
    (ssoCallbackMutation.error
      ? ssoCallbackMutation.error.message
      : isInvalidParams
        ? "Parameter otorisasi SSO tidak lengkap atau tidak valid."
        : null);

  const isProcessing = ssoCallbackMutation.isPending;

  // Effects
  useEffect(() => {
    if (code && state && !hasTriggeredRef.current && !ssoError) {
      hasTriggeredRef.current = true;
      ssoCallbackMutation.mutate({ code, state });
    }
  }, [code, state, ssoError, ssoCallbackMutation]);

  // Handlers
  const handleRetry = () => {
    if (code && state) {
      ssoCallbackMutation.mutate({ code, state });
    } else {
      ssoSigninMutation.mutate();
    }
  };

  return (
    <PageContainer p={[4, 6]} pos={"relative"} overflow={"hidden"}>
      <OutlineContourPerspective
        pos={"absolute"}
        left={0}
        bottom={0}
        w={"full"}
        h={"450px"}
        opacity={0.08}
        pointerEvents={"none"}
      />

      <VStack
        m={"auto"}
        maxW={"500px"}
        w={"full"}
        py={[8, 10]}
        px={[6, 8]}
        gap={6}
        align={"center"}
        textAlign={"center"}
        pos={"relative"}
        zIndex={1}
      >
        <HStack align={"center"} justify={"center"} gap={4}>
          <IgtLogo boxSize={10} />

          <VStack align={"start"} gap={0}>
            <P fontSize={"md"} fontWeight={"semibold"}>
              {"Kementerian ATR/BPN"}
            </P>

            <PSerif fontSize={"xs"} color={"fg.muted"}>
              {"Melayani Profesional Terpercaya"}
            </PSerif>
          </VStack>
        </HStack>

        <Badge size={"lg"} colorPalette={"teal"} variant={"subtle"}>
          <AppIcon icon={ShieldCheckIcon} />

          <P fontSize={"xs"} fontWeight={"semibold"} letterSpacing={"wider"}>
            {"LAYANAN AUTENTIKASI SSO"}
          </P>
        </Badge>

        {errorMessage && (
          <StateRetry
            title={"Autentikasi SSO Gagal"}
            description={errorMessage}
            onRetry={handleRetry}
          >
            <Link to={"/"}>
              <Button variant={"ghost"} size={"sm"} mt={"xl"}>
                <AppIcon icon={ArrowLeftIcon} />
                {"Halaman Utama"}
              </Button>
            </Link>
          </StateRetry>
        )}

        {!errorMessage && (
          <VStack gap={5} py={4} align={"center"}>
            <Center pos={"relative"}>
              <Loader size={"xl"} />

              <AbsoluteCenter>
                <AppIcon icon={ShieldUserIcon} size={"xl"} />
              </AbsoluteCenter>
            </Center>

            <VStack gap={1.5} align={"center"}>
              <P fontSize={"lg"} fontWeight={"semibold"}>
                {"Memverifikasi Sesi SSO..."}
              </P>

              <P fontSize={"sm"} color={"fg.muted"} maxW={"360px"}>
                {isProcessing
                  ? "Menukar kode otorisasi dan memvalidasi kredensial profil Anda..."
                  : "Menghubungkan ke server autentikasi SSO ATR/BPN..."}
              </P>
            </VStack>
          </VStack>
        )}
      </VStack>
    </PageContainer>
  );
};
