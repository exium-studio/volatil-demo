// src/features/auth/types/user-id-card.type.ts

import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import type { User } from "@/shared/types/common-response.type";

export type UserIdCardProps = StackProps & {
  maskingTop?: string | number;
  withSignoutButton?: boolean;
  user?: User | null;
  userAvatarSrc?: string;
  onEnter?: () => void;
};
