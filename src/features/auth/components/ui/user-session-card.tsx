// src/features/auth/components/ui/user-session-card.tsx

import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { UserIdCard } from "@/features/auth/components/ui/user-id-card";
import type { UserSessionCardProps } from "@/features/auth/types/user-session-card.type";

export const UserSessionCard = (props: UserSessionCardProps) => {
  // Props
  const { user, children, ...restProps } = props;

  return (
    <VStack align={"center"} gap={"md"} w={"full"} {...restProps}>
      <UserIdCard user={user} maxW={"200px"} withSignoutButton={false} />

      {children}
    </VStack>
  );
};
