// src\features\auth\components\ui\totp-verify-step.tsx

// src\features\auth\components\ui\totp-verify-step.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { PinInput } from "@/design-system/components/input/ui/pin-input";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { P } from "@/design-system/components/typography/ui/p";
import { useInternalTotpVerifyMutation } from "@/features/auth/hooks/use-internal-auth.mutation";
import type { TotpVerifyStepProps } from "@/features/auth/types/totp.type";
import { ApiError } from "@/shared/libs/api-client/api-error";
import {
  AlertTriangleIcon,
  ArrowLeftIcon,
  CheckCircle2Icon,
  ShieldCheckIcon,
} from "lucide-react";
import { useState } from "react";

export const TotpVerifyStep = (props: TotpVerifyStepProps) => {
  // Props
  const { mfaToken, onBackToLogin, ...restProps } = props;

  // States
  const [totpCode, setTotpCode] = useState<string>("");
  const [customError, setCustomError] = useState<string | null>(null);

  // Mutations
  const verifyMutation = useInternalTotpVerifyMutation();

  // Handlers
  const handleVerify = (codeToVerify?: string) => {
    const code = codeToVerify || totpCode;
    if (code.length !== 6) {
      setCustomError("Masukkan 6 digit kode dari Google Authenticator");
      return;
    }

    setCustomError(null);
    verifyMutation.mutate(
      {
        mfaToken,
        totpCode: code,
      },
      {
        onError: (error) => {
          if (error instanceof ApiError) {
            if (error.message.includes("MFA_TOKEN_EXPIRED") || error.statusCode === 401 && error.message.toLowerCase().includes("kedaluwarsa")) {
              setCustomError("MFA token telah kedaluwarsa. Silakan login ulang.");
              return;
            }
          }
          setCustomError(
            error.message || "Kode Google Authenticator salah atau sudah kedaluwarsa. Coba lagi.",
          );
        },
      },
    );
  };

  const handleValueComplete = (details: { value: string[] }) => {
    const fullCode = details.value.join("");
    setTotpCode(fullCode);
    if (fullCode.length === 6) {
      handleVerify(fullCode);
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
        handleVerify();
      }}
      flex={1}
      justify={"space-between"}
      gap={"lg"}
      w={"full"}
      {...restProps}
    >
      <VStack align={"center"} gap={"lg"} w={"full"}>
        <Badge size={"lg"} colorPalette={"purple"}>
          <AppIcon icon={ShieldCheckIcon} size={"sm"} />

          <P fontSize={"xs"} fontWeight={"semibold"} letterSpacing={"wider"}>
            {"TWO-FACTOR AUTHENTICATION"}
          </P>
        </Badge>

        <VStack align={"center"} gap={1}>
          <P fontSize={"2xl"} fontWeight={"semibold"} textAlign={"center"}>
            {"Verifikasi 2 Langkah 🔐"}
          </P>

          <P color={"fg.muted"} textAlign={"center"} fontSize={"sm"}>
            {"Masukkan 6 digit kode dari aplikasi "}
            <P as={"span"} fontWeight={"semibold"} color={"fg.default"}>
              {"Google Authenticator"}
            </P>
            {"."}
          </P>
        </VStack>
      </VStack>

      {/* Error Alert */}
      {customError && (
        <HStack
          p={3}
          bg={"bg.error"}
          borderColor={"border.error"}
          borderWidth={"1px"}
          rounded={"md"}
          w={"full"}
          gap={3}
          align={"start"}
        >
          <AppIcon icon={AlertTriangleIcon} color={"fg.error"} size={"md"} />

          <P fontSize={"sm"} color={"fg.error"}>
            {customError}
          </P>
        </HStack>
      )}

      {/* Pin Input */}
      <VStack align={"center"} gap={"md"} py={2} w={"full"}>
        <PinInput
          count={6}
          size={"lg"}
          autoFocus={true}
          otp={true}
          onValueChange={handleValueChange}
          onValueComplete={handleValueComplete}
        />

        <P fontSize={"xs"} color={"fg.subtle"} textAlign={"center"}>
          {"Kode berganti setiap 30 detik pada aplikasi Authenticator Anda."}
        </P>
      </VStack>

      {/* Actions */}
      <VStack gap={3} w={"full"}>
        <Button
          primary={true}
          type={"submit"}
          w={"full"}
          size={"lg"}
          loading={verifyMutation.isPending}
          disabled={totpCode.length !== 6}
        >
          <AppIcon icon={CheckCircle2Icon} />
          {"Verifikasi & Masuk"}
        </Button>

        <Button
          variant={"subtle"}
          type={"button"}
          w={"full"}
          onClick={onBackToLogin}
        >
          <AppIcon icon={ArrowLeftIcon} />
          {"Kembali ke Form Login"}
        </Button>
      </VStack>
    </VStack>
  );
};
