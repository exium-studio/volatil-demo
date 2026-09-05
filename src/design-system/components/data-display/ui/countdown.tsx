// src/design-system/components/data-display/ui/countdown.tsx

import type { CountdownProps } from "@/design-system/components/data-display/types/countdown.type";
import {
  formatCountdownParts,
  getCountdownParts,
} from "@/design-system/components/data-display/utils/countdown.utils";
import { P, TNum } from "@/design-system/components/typography/ui/p";
import { useEffect, useState } from "react";

const COUNTDOWN_INTERVAL_MS = 1000;

export const Countdown = (props: CountdownProps) => {
  const {
    finishedAt,
    format,
    warningThresholdDays = 3,
    warningThresholdHours,
    color,
    finishColor = "fg.error",
    ...restProps
  } = props;
  const [countdown, setCountdown] = useState(() =>
    getCountdownParts(finishedAt),
  );

  useEffect(() => {
    const updateCountdown = () => {
      const nextCountdown = getCountdownParts(finishedAt);
      setCountdown(nextCountdown);
      return nextCountdown.isFinished;
    };

    if (updateCountdown()) return;

    const intervalId = window.setInterval(() => {
      if (updateCountdown()) window.clearInterval(intervalId);
    }, COUNTDOWN_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [finishedAt]);

  // Derived Values — Color based on remaining time threshold
  const isNearExpiry =
    !countdown.isFinished &&
    ((warningThresholdHours !== undefined
      ? countdown.days === 0 && countdown.hours < warningThresholdHours
      : warningThresholdDays > 0 && countdown.days < warningThresholdDays));

  const dynamicColor =
    color ??
    (countdown.isFinished
      ? finishColor
      : isNearExpiry
        ? "orange.fg"
        : undefined);

  return (
    <P
      whiteSpace={"nowrap"}
      color={dynamicColor}
      fontWeight={isNearExpiry || countdown.isFinished ? "medium" : undefined}
      {...restProps}
    >
      <TNum>{formatCountdownParts(countdown, format)}</TNum>
    </P>
  );
};
