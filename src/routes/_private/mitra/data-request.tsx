// src\routes\_private\mitra\data-request.tsx

// src\routes\_private\mitra\data-request.tsx

import { requireRoleGuard } from "@/features/auth/services/auth-guard.service";
import { MitraDataRequestPage } from "@/features/mitra/data-request/pages/mitra.data-request.page";
import type {
  MitraDataRequestSearch,
  MitraDataRequestTab,
} from "@/features/mitra/data-request/types/mitra.data-request.type";
import { createFileRoute, redirect } from "@tanstack/react-router";

const VALID_DATA_REQUEST_TABS: MitraDataRequestTab[] = [
  "catalog",
  "uploadAoi",
  "drawAoi",
];

export const Route = createFileRoute("/_private/mitra/data-request")({
  validateSearch: (search: Record<string, unknown>): MitraDataRequestSearch => {
    const rawTab = search.tab;
    const isValidTab =
      typeof rawTab === "string" &&
      VALID_DATA_REQUEST_TABS.includes(rawTab as MitraDataRequestTab);

    return {
      tab: isValidTab ? (rawTab as MitraDataRequestTab) : undefined,
      layerId: typeof search.layerId === "string" ? search.layerId : undefined,
    };
  },
  beforeLoad: async ({ search }) => {
    await requireRoleGuard("mitra");

    if (!search.tab) {
      throw redirect({
        to: "/mitra/data-request",
        search: {
          ...search,
          tab: "catalog",
        },
        replace: true,
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <MitraDataRequestPage />;
}

