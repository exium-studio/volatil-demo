// src\features\auth\components\ui\totp-setup-step.tsx

// src\features\auth\components\ui\totp-setup-step.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { PinInput } from "@/design-system/components/input/ui/pin-input";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Image } from "@/design-system/components/media/ui/image";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { P } from "@/design-system/components/typography/ui/p";
import { useInternalTotpConfirmMutation } from "@/features/auth/hooks/use-internal-auth.mutation";
import type { TotpSetupStepProps } from "@/features/auth/types/totp.type";
import { ApiError } from "@/shared/libs/api-client/api-error";
import {
  AlertTriangleIcon,
  ArrowLeftIcon,
  CheckCircle2Icon,
  CopyCheckIcon,
  CopyIcon,
  QrCodeIcon,
  ShieldAlertIcon,
} from "lucide-react";
import { useState } from "react";

export const TotpSetupStep = (props: TotpSetupStepProps) => {
  // Props
  const { mfaToken, setupData, onBackToLogin, ...restProps } = props;

  // States
  const [totpCode, setTotpCode] = useState<string>("");
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [customError, setCustomError] = useState<string | null>(null);

  // Mutations
  const confirmMutation = useInternalTotpConfirmMutation();

  // Handlers
  const handleCopyKey = () => {
    if (!setupData?.manualEntryKey) return;
    void navigator.clipboard.writeText(setupData.manualEntryKey);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const handleConfirm = (codeToConfirm?: string) => {
    const code = codeToConfirm || totpCode;
    if (code.length !== 6) {
      setCustomError("Masukkan 6 digit kode dari Google Authenticator");
      return;
    }

    setCustomError(null);
    confirmMutation.mutate(
      {
        mfaToken,
        payload: { totpCode: code },
      },
      {
        onError: (error) => {
          if (error instanceof ApiError) {
            if (
              error.message.includes("MFA_TOKEN_EXPIRED") ||
              (error.statusCode === 401 &&
                error.message.toLowerCase().includes("kedaluwarsa"))
            ) {
              setCustomError("MFA token telah kedaluwarsa. Silakan login ulang.");
              return;
            }
          }
          setCustomError(
            error.message ||
              "Kode tidak cocok. Pastikan waktu perangkat sudah sinkron dan coba lagi.",
          );
        },
      },
    );
  };

  const handleValueComplete = (details: { value: string[] }) => {
    const fullCode = details.value.join("");
    setTotpCode(fullCode);
    if (fullCode.length === 6) {
      handleConfirm(fullCode);
    }
  };

  const handleValueChange = (details: { value: string[] }) => {
    setTotpCode(details.value.join(""));
    if (customError) {
      setCustomError(null);
    }
  };

  return (
    <VStack
      as={"form"}
      onSubmit={(e) => {
        e.preventDefault();
        handleConfirm();
      }}
      flex={1}
      justify={"space-between"}
      gap={"md"}
      w={"full"}
      {...restProps}
    >
      <VStack align={"center"} gap={"sm"} w={"full"}>
        <Badge size={"lg"} colorPalette={"purple"}>
          <AppIcon icon={QrCodeIcon} size={"sm"} />

          <P fontSize={"xs"} fontWeight={"semibold"} letterSpacing={"wider"}>
            {"SETUP GOOGLE AUTHENTICATOR"}
          </P>
        </Badge>

        <VStack align={"center"} gap={1}>
          <P fontSize={"xl"} fontWeight={"semibold"} textAlign={"center"}>
            {"Aktivasi Keamanan Akun 📱"}
          </P>

          <P color={"fg.muted"} textAlign={"center"} fontSize={"xs"}>
            {"Pindai QR code di bawah menggunakan aplikasi "}
            <P as={"span"} fontWeight={"semibold"} color={"fg.default"}>
              {"Google Authenticator"}
            </P>
            {" pada ponsel Anda."}
          </P>
        </VStack>
      </VStack>

      {/* Error Alert */}
      {customError && (
        <HStack
          p={2.5}
          bg={"bg.error"}
          borderColor={"border.error"}
          borderWidth={"1px"}
          rounded={"md"}
          w={"full"}
          gap={2.5}
          align={"start"}
        >
          <AppIcon icon={AlertTriangleIcon} color={"fg.error"} size={"sm"} />

          <P fontSize={"xs"} color={"fg.error"}>
            {customError}
          </P>
        </HStack>
      )}

      {/* QR Code & Manual Key */}
      <VStack align={"center"} gap={2} w={"full"}>
        {setupData?.qrCodeDataUrl ? (
          <Box
            p={2}
            bg={"white"}
            rounded={"lg"}
            borderColor={"border.subtle"}
            borderWidth={"1px"}
            boxShadow={"sm"}
          >
            <Image
              src={setupData.qrCodeDataUrl}
              alt={"QR Code Google Authenticator"}
              w={"150px"}
              h={"150px"}
              objectFit={"contain"}
            />
          </Box>
        ) : (
          <HStack
            p={3}
            bg={"bg.subtle"}
            rounded={"md"}
            gap={2}
            align={"center"}
          >
            <AppIcon icon={ShieldAlertIcon} color={"fg.muted"} />
            <P fontSize={"xs"} color={"fg.muted"}>
              {"Memuat QR Code Authenticator..."}
            </P>
          </HStack>
        )}

        {setupData?.manualEntryKey && (
          <VStack gap={1} align={"center"} w={"full"}>
            <P fontSize={"2xs"} color={"fg.subtle"}>
              {"Tidak bisa memindai QR? Masukkan kunci manual:"}
            </P>

            <HStack
              bg={"bg.subtle"}
              px={3}
              py={1}
              rounded={"md"}
              borderColor={"border.subtle"}
              borderWidth={"1px"}
              gap={2}
              align={"center"}
            >
              <P
                fontSize={"xs"}
                fontWeight={"mono"}
                letterSpacing={"widest"}
                color={"fg.default"}
              >
                {setupData.manualEntryKey}
              </P>

              <Button
                size={"2xs"}
                variant={"ghost"}
                type={"button"}
                onClick={handleCopyKey}
              >
                <AppIcon
                  icon={isCopied ? CopyCheckIcon : CopyIcon}
                  size={"xs"}
                  color={isCopied ? "fg.success" : "fg.subtle"}
                />
              </Button>
            </HStack>
          </VStack>
        )}
      </VStack>

      {/* Pin Input for Confirmation */}
      <VStack align={"center"} gap={1} w={"full"}>
        <P fontSize={"xs"} fontWeight={"medium"}>
          {"Masukkan 6 digit kode dari aplikasi untuk konfirmasi:"}
        </P>

        <PinInput
          count={6}
          size={"md"}
          otp={true}
          onValueChange={handleValueChange}
          onValueComplete={handleValueComplete}
        />
      </VStack>

      {/* Actions */}
      <VStack gap={2} w={"full"}>
        <Button
          primary={true}
          type={"submit"}
          w={"full"}
          size={"md"}
          loading={confirmMutation.isPending}
          disabled={totpCode.length !== 6}
        >
          <AppIcon icon={CheckCircle2Icon} />
          {"Konfirmasi & Masuk"}
        </Button>

        <Button
          variant={"subtle"}
          type={"button"}
          w={"full"}
          size={"sm"}
          onClick={onBackToLogin}
        >
          <AppIcon icon={ArrowLeftIcon} />
          {"Kembali ke Form Login"}
        </Button>
      </VStack>
    </VStack>
  );
};

