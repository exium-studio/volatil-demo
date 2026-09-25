// src/features/auth/types/reset-password.type.ts

import type { ApiResponse } from "@/shared/types/common-response.type";
import type React from "react";

export type ResetPasswordRequestPayload = {
  email: string;
};

export type ResetPasswordRequestData = {
  message: string;
  email: string;
  expiresIn?: number;
  resetToken?: string;
};

export type ResetPasswordRequestResponse = ApiResponse<ResetPasswordRequestData>;

export type ResetPasswordConfirmPayload = {
  email: string;
  resetToken: string;
  newPassword: string;
  confirmPassword?: string;
};

export type ResetPasswordConfirmData = {
  success: boolean;
  message: string;
};

export type ResetPasswordConfirmResponse = ApiResponse<ResetPasswordConfirmData>;

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
  confirmPassword?: string;
};

export type ChangePasswordData = {
  success: boolean;
  message: string;
};

export type ChangePasswordResponse = ApiResponse<ChangePasswordData>;

export type ResetPasswordStep = "request" | "confirm" | "change";

export type InternalResetPasswordModalProps = {
  modalKey?: string;
  defaultEmail?: string;
  initialStep?: ResetPasswordStep;
  isOpen?: boolean;
  onClose?: () => void;
};

export type InternalResetPasswordTriggerProps = {
  children?: React.ReactNode;
  modalKey?: string;
  defaultEmail?: string;
  initialStep?: ResetPasswordStep;
};

export type ResetPasswordRequestFormValues = {
  email: string;
};

export type ResetPasswordConfirmFormValues = {
  email: string;
  resetToken: string;
  newPassword: string;
  confirmPassword: string;
};

export type ChangePasswordFormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type InternalResetPasswordFormValues = {
  email: string;
  resetToken: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
};

export type InternalResetPasswordModalContentProps = {
  modalKey: string;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  defaultEmail: string;
  initialStep: ResetPasswordStep;
};


