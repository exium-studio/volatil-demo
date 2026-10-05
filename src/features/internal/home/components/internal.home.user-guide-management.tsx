// src/features/internal/home/components/internal.home.user-guide-management.tsx

import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { InfoTip } from "@/design-system/components/input/ui/toggle-tip";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { HeaderContainer } from "@/design-system/components/shell/ui/header-container";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { InternalUserGuideTableView } from "@/features/user-guide/components/internal.user-guide.table-view";
import { BookOpenIcon } from "lucide-react";

export const InternalHomeUserGuideManagement = () => {
  return (
    <Container.Root withContext={true} w={"full"} position={"relative"}>
      <Container.Body overflowY={"auto"}>
        {/* Header */}
        <HeaderContainer justify={"space-between"} gap={"sm"} pr={"xs"}>
          <HStack wrap={"wrap"} gap={"sm"} py={"sm"}>
            <HStack wrap={"wrap"} align={"center"} gap={"sm"}>
              <AppIcon icon={BookOpenIcon} boxSize={5} color={"fg.muted"} />

              <Heading>{"Manajemen Dokumen Panduan Pengguna"}</Heading>

              <InfoTip
                variant={"icon"}
                appIconProps={{ size: "xs", color: "fg.subtle" }}
              >
                {
                  "Kelola daftar buku panduan, spesifikasi teknis, dan manual book sistem IGT yang dapat diakses dan diunduh oleh Mitra dan staf Internal."
                }
              </InfoTip>
            </HStack>
          </HStack>
        </HeaderContainer>

        <Separator borderColor={"bg.canvas"} />

        {/* Table View */}
        <InternalUserGuideTableView
          initialLimit={10}
          showPagination={true}
          showFilters={true}
          roundedTop={0}
        />
      </Container.Body>
    </Container.Root>
  );
};
