// src\features\auth\types\reset-password.type.ts

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

export type ResetPasswordVerifyOtpPayload = {
  email: string;
  resetToken: string;
};

export type ResetPasswordVerifyOtpData = {
  success: boolean;
  message: string;
  email: string;
  resetToken: string;
};

export type ResetPasswordVerifyOtpResponse = ApiResponse<ResetPasswordVerifyOtpData>;

export type ResetPasswordVerifyTotpPayload = {
  email: string;
  totpCode: string;
};

export type ResetPasswordVerifyTotpData = {
  success: boolean;
  message: string;
  email: string;
  resetToken: string;
};

export type ResetPasswordVerifyTotpResponse = ApiResponse<ResetPasswordVerifyTotpData>;

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

export type ResetMethod = "email" | "totp";

export type ResetPasswordStep = "method" | "request" | "otp" | "new-password";

export type ResetPasswordModalProps = {
  modalKey?: string;
  defaultEmail?: string;
  isOpen?: boolean;
  onClose?: () => void;
};

export type ResetPasswordTriggerProps = {
  children?: React.ReactNode;
  modalKey?: string;
  defaultEmail?: string;
};

export type ResetPasswordMethodFormValues = {
  method: ResetMethod;
};

export type ResetPasswordRequestFormValues = {
  email: string;
};

export type ResetPasswordOtpFormValues = {
  resetToken: string;
};

export type ResetPasswordNewPasswordFormValues = {
  newPassword: string;
  confirmPassword: string;
};

export type ResetPasswordModalContentProps = {
  modalKey: string;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  defaultEmail: string;
};

// Aliases for backward compatibility
export type InternalResetPasswordModalProps = ResetPasswordModalProps;
export type InternalResetPasswordTriggerProps = ResetPasswordTriggerProps;
export type InternalResetPasswordModalContentProps = ResetPasswordModalContentProps;

export type ResetPasswordMethodSelectorProps = {
  onSelectMethod: (method: ResetMethod) => void;
};

export type EmailResetPasswordFlowProps = {
  defaultEmail: string;
  onBackToMethod: () => void;
  onSuccess: () => void;
};

export type TotpResetPasswordFlowProps = {
  defaultEmail: string;
  onBackToMethod: () => void;
  onSuccess: () => void;
};

export type ResetMethodRadioItemProps = {
  method: ResetMethod;
  isSelected: boolean;
  onSelect: () => void;
  title: string;
  description: string;
  badge?: string;
  icon: React.ComponentType<{ size?: string | number }>;
  colorPalette?: string;
};

