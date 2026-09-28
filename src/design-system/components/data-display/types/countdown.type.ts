// src/design-system/components/data-display/types/countdown.type.ts

import type { PProps } from "@/design-system/components/typography/types/p.type";

export type CountdownProps = Omit<PProps, "children"> & {
  finishedAt: string | Date;
  format?: string;
  /** Number of days remaining to trigger warning color (default: 3 days). Set to 0 to disable. */
  warningThresholdDays?: number;
  /** Number of hours remaining to trigger warning color (e.g. 1 for < 1 hour). Overrides warningThresholdDays when provided. */
  warningThresholdHours?: number;
  /** Color when finished/expired. Defaults to 'fg.error'. */
  finishColor?: string;
};

export type CountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isFinished: boolean;
};
