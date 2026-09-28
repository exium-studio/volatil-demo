// src/features/internal/home/components/internal.home.mitra-layer-sync-jobs-quick-view.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { InfoTip } from "@/design-system/components/input/ui/toggle-tip";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { NavLink } from "@/design-system/components/navigation/ui/link";
import { HeaderContainer } from "@/design-system/components/shell/ui/header-container";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { InternalMitraLayerSyncJobTableView } from "@/features/internal/mitra-layer-sync-jobs/components/internal.mitra-layer-sync-job.table-view";
import { ArrowRightIcon } from "lucide-react";

export const InternalHomeMitraLayerSyncJobsQuickView = () => {
  return (
    <Container.Root withContext={true} w={"full"} position={"relative"}>
      <Container.Body overflowY={"auto"}>
        {/* Header */}
        <HeaderContainer justify={"space-between"} gap={"sm"} pr={"xs"}>
          <HStack wrap={"wrap"} gap={"sm"} py={"sm"}>
            <HStack wrap={"wrap"} align={"center"} gap={"sm"}>
              <Heading>{"Antrean Pembaruan Layer Mitra"}</Heading>

              <InfoTip
                variant={"icon"}
                appIconProps={{ size: "xs", color: "fg.subtle" }}
              >
                {
                  "Menampilkan 10 antrean tugas sinkronisasi layer data mitra terbaru yang berjalan di latar belakang."
                }
              </InfoTip>
            </HStack>
          </HStack>

          <Button
            asChild={true}
            variant={"ghost"}
            size={"sm"}
            colorPalette={"gray"}
          >
            <NavLink to={"/internal/jobs"}>
              {"Lihat Semua Antrean"}
              <AppIcon icon={ArrowRightIcon} />
            </NavLink>
          </Button>
        </HeaderContainer>

        <Separator borderColor={"bg.canvas"} />

        {/* Reusable Table View with initialLimit 10, no pagination & no filters */}
        <InternalMitraLayerSyncJobTableView
          initialLimit={10}
          showPagination={false}
          showFilters={false}
          roundedTop={0}
        />
      </Container.Body>
    </Container.Root>
  );
};
