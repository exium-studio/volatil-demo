// src/features/auth/types/auth-guard.type.ts

import type { User, UserRole } from "@/shared/types/common-response.type";

export type AuthGuardOptions = {
  requiredRole?: UserRole;
};

export type AuthRouteContext = {
  user: User | null;
};
