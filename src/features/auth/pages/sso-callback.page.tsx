// src\features\auth\pages\sso-callback.page.tsx

import { IgtLogo } from "@/design-system/components/branding/ui/igt-logo";
import { Button } from "@/design-system/components/button/ui/button";
import { Loader } from "@/design-system/components/feedback/ui/loader";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { PageContainer } from "@/design-system/components/layout/ui/page-container";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { P, PSerif } from "@/design-system/components/typography/ui/p";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { useSsoCallbackMutation } from "@/features/auth/hooks/use-sso-callback.mutation";
import { useSsoSigninMutation } from "@/features/auth/hooks/use-sso-signin.mutation";
import type { SsoCallbackSearch } from "@/features/auth/types/sso.type";
import { Link, useSearch } from "@tanstack/react-router";
import {
  AlertTriangleIcon,
  ArrowLeftIcon,
  RefreshCwIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { useEffect, useRef } from "react";

export const SsoCallbackPage = () => {
  // Stores
  const { theme } = useThemeStore();

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
    <PageContainer p={4}>
      <VStack
        m={"auto"}
        maxW={"540px"}
        w={"full"}
        py={12}
        px={[4, null, 8]}
        borderWidth={"1px"}
        borderColor={"border.subtle"}
        rounded={theme.radii.container}
        bg={"bg.subtle"}
        shadow={"sm"}
        gap={6}
        align={"center"}
        textAlign={"center"}
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

        <Badge size={"lg"} colorPalette={"purple"}>
          <AppIcon icon={ShieldCheckIcon} size={"sm"} />

          <P fontSize={"xs"} fontWeight={"semibold"} letterSpacing={"wider"}>
            {"SSO KEYCLOAK INTERNAL"}
          </P>
        </Badge>

        {errorMessage ? (
          <VStack gap={4} w={"full"} align={"center"}>
            <HStack
              p={3}
              bg={"bg.error"}
              borderColor={"border.error"}
              borderWidth={"1px"}
              rounded={theme.radii.component}
              w={"full"}
              gap={3}
              align={"start"}
              textAlign={"left"}
            >
              <AppIcon
                icon={AlertTriangleIcon}
                color={"fg.error"}
                size={"md"}
              />

              <VStack gap={1} flex={1}>
                <P fontWeight={"semibold"} color={"fg.error"}>
                  {"Autentikasi SSO Gagal"}
                </P>

                <P fontSize={"sm"} color={"fg.error"}>
                  {errorMessage}
                </P>
              </VStack>
            </HStack>

            <HStack gap={3} w={"full"} justify={"center"} mt={2}>
              <Button
                variant={"outline"}
                onClick={handleRetry}
                loading={
                  ssoCallbackMutation.isPending || ssoSigninMutation.isPending
                }
              >
                <AppIcon icon={RefreshCwIcon} />
                {"Coba Lagi"}
              </Button>

              <Link to={"/admin"}>
                <Button primary={true}>
                  <AppIcon icon={ArrowLeftIcon} />
                  {"Kembali ke Login"}
                </Button>
              </Link>
            </HStack>
          </VStack>
        ) : (
          <VStack gap={4} py={4} align={"center"}>
            <Loader size={"xl"} color={`${theme.colorPalette}.solid`} />

            <VStack gap={1} align={"center"}>
              <P fontSize={"lg"} fontWeight={"semibold"}>
                {"Memverifikasi Sesi SSO..."}
              </P>

              <P fontSize={"sm"} color={"fg.muted"}>
                {isProcessing
                  ? "Menukar kode otorisasi dan memvalidasi profil kepegawaian Anda..."
                  : "Menghubungkan ke server autentikasi internal ATR/BPN..."}
              </P>
            </VStack>
          </VStack>
        )}
      </VStack>
    </PageContainer>
  );
};
