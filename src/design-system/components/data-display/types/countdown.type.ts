// src/design-system/components/data-display/types/countdown.type.ts

import type { PProps } from "@/design-system/components/typography/types/p.type";

export type CountdownProps = Omit<PProps, "children"> & {
  finishedAt: string | Date;
  format?: string;
  /** Number of days remaining to trigger warning color (default: 3 days). Set to 0 to disable. */
  warningThresholdDays?: number;
};
