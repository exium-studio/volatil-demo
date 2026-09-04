// src/shared/types/status.type.ts

import type { LucideIcon } from "lucide-react";

/**
 * SSOT 1: Transaction Status Types (Billing & Payment)
 */
export type TransactionStatus =
  | "pending"
  | "paid"
  | "processing"
  | "settled"
  | "expired"
  | "failed";

export type TransactionStatusConfig = {
  label: string;
  colorPalette: "orange" | "blue" | "purple" | "green" | "red" | "gray";
  icon?: LucideIcon;
};

/**
 * SSOT 2: Order & Provisioning Status Types (Cart Batch & Spatial Services)
 */
export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "processing"
  | "pending_review"
  | "approved"
  | "rejected"
  | "expired"
  | "queued"
  | "provisioning"
  | "ready"
  | "revoked"
  | "failed";

export type OrderProvisionStatus = OrderStatus;

export type OrderStatusConfig = {
  label: string;
  colorPalette:
    | "orange"
    | "blue"
    | "purple"
    | "green"
    | "red"
    | "neutral"
    | "gray";
  icon?: LucideIcon;
  iconColor?: string;
};
