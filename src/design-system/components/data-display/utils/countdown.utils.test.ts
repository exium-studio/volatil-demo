import assert from "node:assert/strict";
import test from "node:test";

import {
  formatCountdownParts,
  getCountdownParts,
} from "./countdown.utils.ts";

test("calculates countdown parts from a datetime", () => {
  assert.deepEqual(
    getCountdownParts(
      "2026-08-15T10:02:03.000Z",
      new Date("2026-08-13T08:00:00.000Z"),
    ),
    {
      days: 2,
      hours: 2,
      minutes: 2,
      seconds: 3,
      isFinished: false,
    },
  );
});

test("marks elapsed and invalid datetimes as finished", () => {
  const now = new Date("2026-08-13T08:00:00.000Z");

  assert.equal(
    getCountdownParts("2026-08-13T07:59:59.000Z", now).isFinished,
    true,
  );
  assert.equal(getCountdownParts("invalid", now).isFinished, true);
});

test("formats countdown numerically by default and accepts a custom format", () => {
  const parts = {
    days: 2,
    hours: 2,
    minutes: 2,
    seconds: 3,
    isFinished: false,
  };

  assert.equal(formatCountdownParts(parts), "02:02:02:03");
  assert.equal(formatCountdownParts(parts, "{days}h {hours}j"), "2h 2j");
});
