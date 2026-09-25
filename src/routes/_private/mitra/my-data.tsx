// src\routes\_private\mitra\my-data.tsx

// src\routes\_private\mitra\my-data.tsx

import { requireRoleGuard } from "@/features/auth/services/auth-guard.service";
import { MitraMyDataPage } from "@/features/mitra/my-data/pages/mitra.my-data.page";
import type {
  MitraMyDataSearch,
  MitraMyDataTab,
} from "@/features/mitra/my-data/types/my-data.type";
import { createFileRoute, redirect } from "@tanstack/react-router";

const VALID_MY_DATA_TABS: MitraMyDataTab[] = ["workspace", "layers"];

export const Route = createFileRoute("/_private/mitra/my-data")({
  validateSearch: (search: Record<string, unknown>): MitraMyDataSearch => {
    const rawTab = search.tab;
    const isValidTab =
      typeof rawTab === "string" &&
      VALID_MY_DATA_TABS.includes(rawTab as MitraMyDataTab);

    return {
      tab: isValidTab ? (rawTab as MitraMyDataTab) : undefined,
    };
  },
  beforeLoad: async ({ search }) => {
    await requireRoleGuard("mitra");

    if (!search.tab) {
      throw redirect({
        to: "/mitra/my-data",
        search: {
          ...search,
          tab: "workspace",
        },
        replace: true,
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <MitraMyDataPage />;
}
