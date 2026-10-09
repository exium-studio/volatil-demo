// src/features/mitra/my-data/utils/extension.utils.ts

import type { SystemPolicies } from "@/features/mitra/data-request/types/mitra.data-request.pricing-policy.type";
import type { MitraWorkspaceItem } from "@/features/mitra/my-data/types/my-data.type";

const DEFAULT_EXTENSION_WINDOW_DAYS = 7;
const DEFAULT_MAX_EXTENSION_COUNT = 1;

export type ExtensionEligibility = {
  canExtend: boolean;
  daysRemaining: number;
  reason?: string;
};

/**
 * Validates whether a workspace order can be extended based on system policies and H-7 extension window.
 * 
 * Rules:
 * 1. Order status must be "ready".
 * 2. Days remaining must be: 0 < daysRemaining <= order_extension_window_days (default H-7 window).
 * 3. Extension count must not exceed order_max_extension_count (default 1x).
 */
export function checkOrderExtensionEligibility(
  workspace: MitraWorkspaceItem,
  systemPolicies?: SystemPolicies,
): ExtensionEligibility {
  const extensionWindowDays =
    systemPolicies?.order_extension_window_days ?? DEFAULT_EXTENSION_WINDOW_DAYS;
  const maxExtensionCount =
    systemPolicies?.order_max_extension_count ?? DEFAULT_MAX_EXTENSION_COUNT;

  if (workspace.status !== "ready") {
    return {
      canExtend: false,
      daysRemaining: 0,
      reason: "Perpanjangan hanya tersedia untuk pesanan dengan status 'Siap Digunakan'.",
    };
  }

  const currentCount = workspace.extensionCount ?? 0;
  if (currentCount >= maxExtensionCount) {
    return {
      canExtend: false,
      daysRemaining: 0,
      reason: `Pesanan telah mencapai batas maksimal perpanjangan (${maxExtensionCount}x).`,
    };
  }

  const expiryDate = new Date(workspace.expiresAt);
  if (Number.isNaN(expiryDate.getTime())) {
    return {
      canExtend: false,
      daysRemaining: 0,
      reason: "Tanggal kedaluwarsa pesanan tidak valid.",
    };
  }

  const now = new Date();
  const diffMs = expiryDate.getTime() - now.getTime();
  const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (daysRemaining <= 0) {
    return {
      canExtend: false,
      daysRemaining,
      reason: "Masa aktif pesanan telah habis (expired).",
    };
  }

  if (daysRemaining > extensionWindowDays) {
    return {
      canExtend: false,
      daysRemaining,
      reason: `Perpanjangan baru dapat dilakukan mulai H-${extensionWindowDays} sebelum kedaluwarsa.`,
    };
  }

  return {
    canExtend: true,
    daysRemaining,
  };
}
