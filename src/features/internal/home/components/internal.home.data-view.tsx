// src/features/internal/home/components/internal.home.data-list.tsx

import {
  Button,
  IconButton,
} from "@/design-system/components/button/ui/button";
import type {
  FormattedListItem,
  FormattedTableHeader,
} from "@/design-system/components/data-display/types/data-view-table.type";
import { DataView } from "@/design-system/components/data-display/ui/data-view-table";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import { InfoTip } from "@/design-system/components/input/ui/toggle-tip";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { P } from "@/design-system/components/typography/ui/p";
import { Box } from "@/design-system/components/layout/ui/box";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { Loader } from "@/design-system/components/feedback/ui/loader";
import type {
  InternalHomeIgtDataViewItem,
  InternalHomeIgtDataListProps,
  SyncStatus,
} from "@/features/internal/home/types/internal.home.data-view.type";
import type { IgtBasis } from "@/features/mitra/data-request/types/mitra.data-request.igt-by-aoi.type";
import { useInternalHomeData } from "@/features/internal/home/hooks/use-internal-home.query";
import { t } from "@/shared/libs/i18n";
import {
  CopyIcon,
  ExternalLinkIcon,
  PlusIcon,
  RefreshCwIcon,
  SlidersHorizontalIcon,
} from "lucide-react";
import { useMemo } from "react";

const SYNC_STATUS_MAP: Record<SyncStatus, { label: string; color: string }> = {
  connected: { label: "Terhubung", color: "green" },
  disconnected: { label: "Terputus", color: "red" },
  syncing: { label: "Proses Sinkronisasi", color: "orange" },
};

const IGT_BASIS_MAP: Record<IgtBasis, { label: string; color: string }> = {
  bidang: { label: "IGT Berbasis Bidang", color: "blue" },
  kawasan: { label: "IGT Berbasis Kawasan", color: "orange" },
};

export const InternalHomeIgtDataList = (
  props: InternalHomeIgtDataListProps,
) => {
  return (
    <Container.Root flex={"1 1 100%"} withContext={true} {...props}>
      <Container.Body pb={"md"}>
        <InternalHomeIgtDataListHeader />

        <Separator borderColor={"bg.canvas"} />

        <InternalHomeIgtDataListTableContent />
      </Container.Body>
    </Container.Root>
  );
};

const InternalHomeIgtDataListHeader = () => {
  return (
    <HStack
      wrap={"wrap"}
      align={"center"}
      justify={"space-between"}
      gap={"md"}
      p={"md"}
    >
      <HStack gap={"xs"} align={"center"}>
        <Heading>{"Daftar Data"}</Heading>

        <InfoTip
          variant={"icon"}
          appIconProps={{
            size: "xs",
            color: "fg.subtle",
          }}
        >
          {"Daftar keseluruhan data yang Anda kelola."}
        </InfoTip>
      </HStack>

      <HStack wrap={"wrap"} align={"center"} gap={"sm"}>
        <SearchInput placeholder={t["action.search"]()} maxW={"220px"} />

        <Button variant={"outline"} px={3}>
          <AppIcon icon={RefreshCwIcon} />
          {"Status Sinkronisasi"}
        </Button>

        <IconButton variant={"outline"}>
          <AppIcon icon={SlidersHorizontalIcon} />
        </IconButton>

        <Button primary>
          <AppIcon icon={PlusIcon} />
          {"Tambah Data"}
        </Button>
      </HStack>
    </HStack>
  );
};

const InternalHomeIgtDataListTableContent = () => {
  // Queries / Data
  const { dataList, isLoading, isFetching } = useInternalHomeData();

  // Derived Values
  const headers = useMemo<FormattedTableHeader[]>(
    () => [
      { th: "Layer Data IGT-PR", sortable: true, align: "start" },
      { th: "Status Sinkronisasi", sortable: true, align: "center" },
      { th: "Terakhir Sinkronisasi", sortable: true, align: "start" },
      { th: "Jenis Tema IGT-PR", sortable: true, align: "center" },
      { th: "Link API WFS", sortable: true, align: "start" },
      { th: "API WFS", sortable: true, align: "start" },
    ],
    [],
  );

  const items = useMemo<FormattedListItem[]>(() => {
    return dataList.map((item: InternalHomeIgtDataViewItem) => ({
      id: item.id,
      data: item,
      columns: [
        {
          value: item.layerFileName,
          td: <P fontSize={"sm"}>{item.layerFileName}</P>,
          align: "start",
        },
        {
          value: item.syncStatus,
          td: (
            <Badge
              colorPalette={SYNC_STATUS_MAP[item.syncStatus].color}
              variant={"subtle"}
            >
              {SYNC_STATUS_MAP[item.syncStatus].label}
            </Badge>
          ),
          align: "center",
        },
        {
          value: item.lastSyncTime,
          td: <P fontSize={"sm"}>{item.lastSyncTime}</P>,
          align: "start",
        },
        {
          value: item.igtBasis,
          td: (
            <Badge
              colorPalette={IGT_BASIS_MAP[item.igtBasis].color}
              variant={"subtle"}
            >
              {IGT_BASIS_MAP[item.igtBasis].label}
            </Badge>
          ),
          align: "center",
        },
        {
          value: item.wfsApiLink,
          td: (
            <HStack align={"center"} gap={2}>
              <AppIcon icon={CopyIcon} color={"fg.subtle"} fontSize={"xs"} />
              <P fontSize={"sm"} color={"fg.subtle"} maxW={"180px"} truncate>
                {item.wfsApiLink}
              </P>
              <AppIcon
                icon={ExternalLinkIcon}
                color={"fg.subtle"}
                fontSize={"xs"}
              />
            </HStack>
          ),
          align: "start",
        },
        {
          value: item.wfsApiCode,
          td: (
            <HStack align={"center"} gap={2}>
              <AppIcon icon={CopyIcon} color={"fg.subtle"} fontSize={"xs"} />
              <P fontSize={"sm"} color={"fg.subtle"} maxW={"180px"} truncate>
                {item.wfsApiCode}
              </P>
            </HStack>
          ),
          align: "start",
        },
      ],
    }));
  }, [dataList]);

  return (
    <VStack bg={"bg.canvas"} w={"full"} position={"relative"}>
      {isLoading ? (
        <Skeleton h={"280px"} w={"full"} />
      ) : (
        <>
          <Box w={"full"} position={"relative"}>
            <DataView.Table.Root
              headers={headers}
              items={items}
              roundedTop={0}
              shadow={"none"}
            >
              <DataView.Table.Header />
              <DataView.Table.Body />
            </DataView.Table.Root>

            {isFetching && (
              <Box
                position={"absolute"}
                inset={0}
                bg={"bg.canvas/50"}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
                zIndex={10}
              >
                <Loader size={"md"} />
              </Box>
            )}
          </Box>
        </>
      )}
    </VStack>
  );
};
