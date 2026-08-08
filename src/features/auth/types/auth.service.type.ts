// src/features/auth/types/auth.service.type.ts

import type { Role } from "@/shared/types/auth.type";
import type { ApiResponse, User } from "@/shared/types/response.type";

export type LoginPayload = {
  email: string;
  password: string;
  role: Role;
};

export type AuthData<TUser = User> = {
  token: string;
  user: TUser;
};

export type AuthResponse<TUser = User> = ApiResponse<AuthData<TUser>>;
