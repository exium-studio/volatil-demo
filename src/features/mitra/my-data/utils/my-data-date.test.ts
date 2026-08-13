import assert from "node:assert/strict";
import test from "node:test";

import { formatUtcDateTime } from "./my-data-date.ts";

test("formats a UTC ISO datetime in the preferred user timezone", () => {
  assert.equal(
    formatUtcDateTime("2026-08-13T08:15:00.000Z", "Asia/Jakarta"),
    "13 Agu 2026, 15.15 WIB",
  );
});

test("returns a dash for missing or invalid datetimes", () => {
  assert.equal(formatUtcDateTime(null, "Asia/Jakarta"), "-");
  assert.equal(formatUtcDateTime("not-a-date", "Asia/Jakarta"), "-");
});

test("falls back to UTC when the preferred timezone is invalid", () => {
  assert.equal(
    formatUtcDateTime("2026-08-13T08:15:00.000Z", "Invalid/Timezone"),
    "13 Agu 2026, 08.15 UTC",
  );
});
