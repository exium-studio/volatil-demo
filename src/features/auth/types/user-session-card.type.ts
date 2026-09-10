// src/features/auth/types/user-session-card.type.ts

import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import type { User } from "@/shared/types/common-response.type";
import type { ReactNode } from "react";

export type UserSessionCardProps = StackProps & {
  user: User;
  portalType: "mitra" | "internal";
  children?: ReactNode;
};

export type UserSessionActionsProps = StackProps & {
  user?: User | null;
  onEnterDashboard?: () => void;
};
