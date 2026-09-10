// src/features/auth/components/ui/user-session-card.tsx

import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { P } from "@/design-system/components/typography/ui/p";
import { UserIdCard } from "@/features/auth/components/ui/user-id-card";
import type { UserSessionCardProps } from "@/features/auth/types/user-session-card.type";
import { ShieldAlertIcon } from "lucide-react";

export const UserSessionCard = (props: UserSessionCardProps) => {
  // Props
  const { user, portalType, children, ...restProps } = props;

  // Derived Values
  const userRole = user.role;
  const isRoleMismatch = userRole !== portalType;

  return (
    <VStack align={"center"} gap={"md"} w={"full"} {...restProps}>
      <UserIdCard user={user} maxW={"200px"} withSignoutButton={false} />

      {isRoleMismatch && (
        <HStack
          p={3}
          bg={"orange.50"}
          rounded={"md"}
          borderWidth={"1px"}
          borderColor={"orange.200"}
          gap={2}
          w={"full"}
          align={"start"}
        >
          <AppIcon icon={ShieldAlertIcon} color={"orange.600"} size={"sm"} />
          <P fontSize={"xs"} color={"orange.800"}>
            {portalType === "internal"
              ? "Akun Anda terdaftar sebagai Mitra. Menekan 'Masuk' akan mengarahkan Anda ke Dashboard Mitra."
              : "Akun Anda terdaftar sebagai Internal. Menekan 'Masuk' akan mengarahkan Anda ke Dashboard Internal."}
          </P>
        </HStack>
      )}

      {children}
    </VStack>
  );
};
