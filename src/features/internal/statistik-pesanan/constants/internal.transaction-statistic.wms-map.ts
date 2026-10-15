// src/features/internal/statistik-pesanan/constants/internal.transaction-statistic.wms-map.ts

import type { FocusSelectOption } from "@/design-system/components/input/types/focus-select.type";
import type {
  WmsStatusConfig,
  WmsStatusKey,
} from "@/features/internal/statistik-pesanan/types/internal.transaction-statistic.wms.type";
import { ORDER_STATUS_MAP } from "@/features/shared/constants/volatil.ssot-map";
import type { OrderStatus } from "@/shared/types/status.type";
import {
  CheckCircleIcon,
  ClockIcon,
  LoaderIcon,
  TimerOffIcon,
} from "lucide-react";

export const WMS_STATUS_MAP: Record<WmsStatusKey, WmsStatusConfig> = {
  pending_payment: {
    label: "Potensi WMS",
    orderStatus: "pending_payment",
    colorPalette: "orange",
    icon: ClockIcon,
  },
  processing: {
    label: "WMS Diproses",
    orderStatus: "processing",
    colorPalette: "purple",
    icon: LoaderIcon,
  },
  ready: {
    label: "WMS Aktif",
    orderStatus: "ready",
    colorPalette: "green",
    icon: CheckCircleIcon,
  },
  expired: {
    label: "WMS Kedaluwarsa",
    orderStatus: "expired",
    colorPalette: "gray",
    icon: TimerOffIcon,
  },
};

export const isWmsStatusKey = (
  status?: string | null,
): status is WmsStatusKey => {
  return (
    status === "pending_payment" ||
    status === "processing" ||
    status === "ready" ||
    status === "expired" ||
    status === "transaction_expired"
  );
};

export const getWmsStatusKey = (
  status?: OrderStatus | null,
): WmsStatusKey | undefined => {
  if (!status) {
    return undefined;
  }
  if (status === "transaction_expired") {
    return "expired";
  }
  if (
    status === "pending_payment" ||
    status === "processing" ||
    status === "ready" ||
    status === "expired"
  ) {
    return status;
  }
  return undefined;
};

export const ORDER_STATUS_WITH_WMS_FILTER_OPTIONS: FocusSelectOption[] = [
  { label: "Semua Status", value: "" },
  ...(Object.keys(ORDER_STATUS_MAP) as OrderStatus[]).map((key) => {
    const wmsKey = getWmsStatusKey(key);
    const wmsConfig = wmsKey ? WMS_STATUS_MAP[wmsKey] : undefined;
    const baseLabel = ORDER_STATUS_MAP[key].label;

    return {
      value: key,
      label: wmsConfig ? `${baseLabel} (${wmsConfig.label})` : baseLabel,
    };
  }),
];
