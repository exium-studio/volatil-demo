import assert from "node:assert/strict";
import test from "node:test";

import { getPaginatedMyData } from "./my-data.service.ts";
import type { MyDataItem } from "../types/my-data.type.ts";

const item = (overrides: Partial<MyDataItem>): MyDataItem => ({
  id: "DATA-1",
  name: "Layer Bidang Jakarta",
  basis: "bidang",
  purchasedBy: { id: "USR-1", name: "Siti Aminah", email: "siti@example.com" },
  transactionDate: "2026-08-01T01:00:00.000Z",
  transactionSettledAt: "2026-08-01T02:00:00.000Z",
  transactionStatus: "settled",
  wfsUrl: "https://example.com/wfs/1",
  expiresAt: "2026-09-01T02:00:00.000Z",
  status: "active",
  ...overrides,
});

const items = [
  item({}),
  item({ id: "DATA-2", name: "Layer Kawasan Bali", basis: "kawasan", wfsUrl: null }),
  item({ id: "DATA-3", name: "Layer Lama", status: "expired" }),
];

test("searches and applies active and WFS IGT filters before pagination", () => {
  const result = getPaginatedMyData(items, {
    page: 1,
    pageSize: 10,
    search: "bali",
    status: "active",
    basis: "kawasan",
  });

  assert.deepEqual(result.items.map(({ id }) => id), ["DATA-2"]);
  assert.equal(result.meta.total, 1);
  assert.equal(result.meta.totalPages, 1);
});
