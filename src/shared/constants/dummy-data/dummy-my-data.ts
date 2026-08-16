// src/shared/constants/dummy-data/dummy-my-data.ts

import type { MyDataItem } from "@/features/mitra/my-data/types/my-data.type";

const names = [
  "Layer Bidang Jakarta",
  "Layer Kawasan Bali",
  "Layer Bidang Bandung",
  "Layer Kawasan Surabaya",
  "Layer Bidang Yogyakarta",
  "Layer Kawasan Makassar",
  "Layer Bidang Medan",
  "Layer Kawasan Semarang",
  "Layer Bidang Palembang",
  "Layer Kawasan Balikpapan",
  "Layer Bidang Manado",
  "Layer Kawasan Lombok",
];

export const dummyMitraMyDataItems: MyDataItem[] = names.map((name, index) => {
  const transactionDate = new Date(Date.UTC(2026, 6, index + 1, 1, 30));
  const expiresAt = new Date(Date.UTC(2026, 9, index + 1, 1, 30));
  const isExpired = index === names.length - 1;
  if (isExpired) expiresAt.setUTCFullYear(2025);

  return {
    id: `DATA-${String(index + 1).padStart(3, "0")}`,
    name,
    basis: index % 2 === 0 ? "bidang" : "kawasan",
    purchasedBy: {
      id: `USR-${String((index % 3) + 1).padStart(3, "0")}`,
      name: ["Siti Aminah", "Budi Santoso", "Rina Wijaya"][index % 3],
      email: ["siti@example.com", "budi@example.com", "rina@example.com"][index % 3],
    },
    transactionDate: transactionDate.toISOString(),
    transactionSettledAt: new Date(
      transactionDate.getTime() + 60 * 60 * 1000,
    ).toISOString(),
    transactionStatus: "settled",
    wfsUrl:
      index % 3 === 0
        ? null
        : `/geoserver/igt/ows?service=WFS&typeName=${index + 1}`,
    expiresAt: expiresAt.toISOString(),
    status: isExpired ? "expired" : "active",
  };
});
