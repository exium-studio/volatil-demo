// src/features/internal/mitra-layer-sync-jobs/components/internal.mitra-layer-sync-job.data-view.tsx

import { BackButton } from "@/design-system/components/button/ui/back-button";
import { DEFAULT_PAGE_SIZE_OPTIONS } from "@/design-system/components/data-display/ui/data-view-page-size";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { InfoTip } from "@/design-system/components/input/ui/toggle-tip";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { AppContentContainer } from "@/design-system/components/layout/ui/page-container";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { HeaderContainer } from "@/design-system/components/shell/ui/header-container";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { InternalMitraLayerSyncJobTableView } from "@/features/internal/mitra-layer-sync-jobs/components/internal.mitra-layer-sync-job.table-view";
import type { MitraLayerSyncJobDataViewProps } from "@/features/internal/mitra-layer-sync-jobs/types/mitra-layer-sync-job.type";
import { RadioIcon } from "lucide-react";

export const InternalMitraLayerSyncJobDataView = (
  props: MitraLayerSyncJobDataViewProps,
) => {
  // Props
  const {
    initialLimit = DEFAULT_PAGE_SIZE_OPTIONS[0],
    showPagination = true,
    showFilters = true,
    roundedTop = 0,
  } = props;

  return (
    <AppContentContainer overflowY={"auto"}>
      <Container.Root
        flex={1}
        withContext={true}
        position={"relative"}
        overflowY={"auto"}
      >
        <Container.Body overflowY={"auto"}>
          {/* Title Header */}
          <HeaderContainer pl={"xs"}>
            <HStack
              wrap={"wrap"}
              justify={"space-between"}
              align={"center"}
              gap={"sm"}
              w={"full"}
            >
              <HStack gap={"sm"}>
                <BackButton />

                <HStack gap={"xs"} align={"center"}>
                  <Heading>{"Antrean Pembaruan Layer Mitra"}</Heading>

                  <InfoTip
                    variant={"icon"}
                    appIconProps={{
                      size: "xs",
                      color: "fg.subtle",
                    }}
                  >
                    {
                      "Memantau antrean tugas latar belakang (antrean job) sinkronisasi layer data mitra saat layer master diperbarui."
                    }
                  </InfoTip>
                </HStack>
              </HStack>

              <HStack gap={"xs"} align={"center"}>
                <Badge colorPalette={"green"} variant={"subtle"}>
                  <AppIcon icon={RadioIcon} />
                  {"Sinkronisasi Langsung Aktif"}
                </Badge>
              </HStack>
            </HStack>
          </HeaderContainer>

          <Separator borderColor={"bg.canvas"} />

          {/* Reusable Table View */}
          <InternalMitraLayerSyncJobTableView
            initialLimit={initialLimit}
            showPagination={showPagination}
            showFilters={showFilters}
            roundedTop={roundedTop}
          />
        </Container.Body>
      </Container.Root>
    </AppContentContainer>
  );
};
