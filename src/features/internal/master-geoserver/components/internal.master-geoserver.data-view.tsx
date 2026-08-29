// src/features/internal/master-geoserver/components/internal.master-geoserver.data-view.tsx

import { Button } from "@/design-system/components/button/ui/button";
import type { FormattedTableHeader } from "@/design-system/components/data-display/types/data-view-table.type";
import type { DataViewItemActionsGenerator } from "@/design-system/components/data-display/types/data-view.type";
import { ClipboardButton } from "@/design-system/components/data-display/ui/clipboard-button";
import { DataViewFooter } from "@/design-system/components/data-display/ui/data-view-footer";
import { DEFAULT_PAGE_SIZE_OPTIONS } from "@/design-system/components/data-display/ui/data-view-page-size";
import { DataView } from "@/design-system/components/data-display/ui/data-view-table";
import { ConfirmationTrigger } from "@/design-system/components/feedback/ui/confirmation-trigger";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { NoDataState } from "@/design-system/components/feedback/ui/state.no-data";
import { NoResultState } from "@/design-system/components/feedback/ui/state.no-result";
import { TopBarLoader } from "@/design-system/components/feedback/ui/top-bar-loader";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import { InfoTip } from "@/design-system/components/input/ui/toggle-tip";
import { Box } from "@/design-system/components/layout/ui/box";
import { Center } from "@/design-system/components/layout/ui/center";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { ExternalLink } from "@/design-system/components/navigation/ui/link";
import { HeaderContainer } from "@/design-system/components/shell/ui/header-container";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { ClampedP, P } from "@/design-system/components/typography/ui/p";
import { InternalMasterGeoserverCreateTrigger } from "@/features/internal/master-geoserver/components/internal.master-geoserver.create-modal";
import { InternalMasterGeoserverEditTrigger } from "@/features/internal/master-geoserver/components/internal.master-geoserver.edit-modal";
import {
  useDeleteMasterGeoserver,
  useMasterGeoserverQuery,
} from "@/features/internal/master-geoserver/hooks/use-master-geoserver";
import type { MasterGeoserverItem } from "@/features/internal/master-geoserver/types/master-geoserver.type";
import { isEmptyArray } from "@/shared/utils/data/array";
import {
  formatUtcDateTime,
  getPreferredUserTimezone,
} from "@/shared/utils/formatter/date.formatter";
import { PencilIcon, PlusIcon, ServerOffIcon, Trash2Icon } from "lucide-react";
import { useMemo, useState, useTransition } from "react";

export const InternalMasterGeoserverDataView = () => {
  // Transitions
  const [_isPending, startTransition] = useTransition();

  // States
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(
    DEFAULT_PAGE_SIZE_OPTIONS[0],
  );

  // Queries
  const {
    items: rawItems,
    pagination,
    isLoading,
    isFetching,
  } = useMasterGeoserverQuery({
    page,
    pageSize,
    search: search || undefined,
  });

  // Mutations
  const deleteMutation = useDeleteMasterGeoserver();

  // Derived Values
  const preferredTimezone = useMemo(() => getPreferredUserTimezone(), []);
  const isSearching = Boolean(search.trim());
  const searchQuery = useMemo(() => {
    if (search.trim()) return search;
    return "...";
  }, [search]);

  const dataList = useMemo(() => {
    const headers: FormattedTableHeader[] = [
      { th: "Nama Server", sortable: true },
      { th: "Base URL Geoserver", sortable: true },
      { th: "Username", sortable: true },
      { th: "Deskripsi" },
      { th: "Terakhir Diperbarui", sortable: true },
    ];

    const items = rawItems.map((item) => {
      return {
        id: item.id,
        data: item,
        columns: [
          {
            value: item.name,
            td: (
              <VStack align={"start"} gap={0} w={"200px"}>
                <ClampedP fontWeight={"medium"}>{item.name}</ClampedP>

                <P fontSize={"xs"} color={"fg.subtle"}>
                  {item.id}
                </P>
              </VStack>
            ),
            align: "start" as const,
          },
          {
            value: item.baseUrl,
            td: (
              <HStack gap={"xs"} align={"center"} maxW={"280px"}>
                <ExternalLink
                  href={item.baseUrl}
                  display={"inline-flex"}
                  alignItems={"center"}
                  minW={0}
                  flex={1}
                >
                  <ClampedP fontSize={"sm"} truncate>
                    {item.baseUrl}
                  </ClampedP>
                </ExternalLink>

                <ClipboardButton
                  value={item.baseUrl}
                  variant={"ghost"}
                  aria-label={"Salin URL Base"}
                  flexShrink={0}
                />
              </HStack>
            ),
            align: "start" as const,
          },
          {
            value: item.username,
            td: (
              <P fontSize={"sm"} color={"fg.muted"}>
                {item.username}
              </P>
            ),
            align: "start" as const,
          },
          {
            value: item.description ?? "-",
            td: (
              <ClampedP fontSize={"xs"} color={"fg.subtle"} w={"200px"}>
                {item.description || "-"}
              </ClampedP>
            ),
            align: "start" as const,
          },
          {
            value: item.updatedAt,
            td: (
              <P fontSize={"sm"} color={"fg.muted"} whiteSpace={"nowrap"}>
                {formatUtcDateTime(item.updatedAt, preferredTimezone)}
              </P>
            ),
            align: "start" as const,
          },
        ],
      };
    });

    const itemActions: DataViewItemActionsGenerator<MasterGeoserverItem>[] = [
      {
        key: "edit-geoserver",
        label: "Ubah Server",
        icon: PencilIcon,
        modal: {
          triggerComponent: (server: MasterGeoserverItem) => (
            <InternalMasterGeoserverEditTrigger
              modalKey={`geoserver-edit-${server.id}`}
              item={server}
            />
          ),
        },
      },
      {
        key: "delete-geoserver",
        label: "Hapus Server",
        icon: Trash2Icon,
        colorPalette: "red",
        modal: {
          triggerComponent: (server: MasterGeoserverItem) => (
            <ConfirmationTrigger
              modalKey={`delete-geoserver-${server.id}`}
              title={"Hapus Master GeoServer?"}
              description={`Apakah Anda yakin ingin menghapus server "${server.name}"? Server akan diarsipkan terlebih dahulu agar permohonan data yang sedang diproses tidak terganggu, lalu dihapus permanen secara otomatis setelah 30 hari.`}
              confirmLabel={"Hapus Server"}
              colorPalette={"red"}
              onConfirm={() => {
                deleteMutation.mutate(server.id);
              }}
            />
          ),
        },
      },
    ];

    return {
      headers,
      items,
      batchActions: [],
      itemActions,
    };
  }, [rawItems, preferredTimezone, deleteMutation]);

  return (
    <Container.Root withContext={true} flex={1}>
      <Container.Body overflowY={"auto"}>
        <HeaderContainer>
          <HStack justify={"space-between"} align={"center"} w={"full"}>
            <HStack gap={"xs"} align={"center"}>
              <Heading>{"Master GeoServer"}</Heading>

              <InfoTip
                variant={"icon"}
                appIconProps={{
                  size: "xs",
                  color: "fg.subtle",
                }}
              >
                {
                  "Konfigurasi kredensial dan endpoint GeoServer utama untuk kebutuhan publikasi data spasial serta provisioning layer."
                }
              </InfoTip>
            </HStack>

            <InternalMasterGeoserverCreateTrigger>
              <Button primary variant={"ghost"} pl={1.5}>
                <AppIcon icon={PlusIcon} />
                {"Tambah GeoServer"}
              </Button>
            </InternalMasterGeoserverCreateTrigger>
          </HStack>
        </HeaderContainer>

        <Separator borderColor={"bg.canvas"} />

        <HStack
          wrap={"wrap"}
          align={"center"}
          justify={"start"}
          gap={"sm"}
          w={"full"}
          p={"md"}
          bg={"bg.body"}
        >
          <SearchInput
            value={search}
            onValueChange={(val) =>
              startTransition(() => {
                setSearch(val);
                setPage(1);
              })
            }
            placeholder={"Cari nama server, URL, username..."}
            maxW={"280px"}
          />
        </HStack>

        <Separator borderColor={"bg.canvas"} />

        <VStack flex={1} gap={"sm"} w={"full"} position={"relative"}>
          {isLoading && <Skeleton p={"md"} rounded={0} />}

          {!isLoading && (
            <>
              {isEmptyArray(rawItems) && (
                <Center flex={1} w={"full"} p={"xl"} bg={"bg.body"}>
                  {isSearching ? (
                    <NoResultState query={searchQuery} />
                  ) : (
                    <NoDataState
                      icon={ServerOffIcon}
                      title={"GeoServer Kosong"}
                      description={
                        "Belum ada data GeoServer terdaftar. Silakan tambahkan server baru."
                      }
                    />
                  )}
                </Center>
              )}

              {!isEmptyArray(rawItems) && (
                <Box w={"full"} position={"relative"}>
                  <TopBarLoader isFetching={isFetching} />

                  <DataView.Table.Root<MasterGeoserverItem>
                    headers={dataList.headers}
                    items={dataList.items}
                    itemActions={dataList.itemActions}
                    withNumbering
                    page={page}
                    pageSize={pageSize}
                    pb={0}
                    rounded={0}
                  >
                    <DataView.Table.Header />
                    <DataView.Table.Body />
                  </DataView.Table.Root>

                  <Separator borderColor={"bg.canvas"} />

                  <DataViewFooter
                    page={page}
                    pageSize={pageSize}
                    setPage={(nextPage: number) => setPage(nextPage)}
                    setPageSize={(nextSize: number) => {
                      setPageSize(nextSize);
                      setPage(1);
                    }}
                    currentDataLength={rawItems.length}
                    totalData={pagination?.totalItems ?? rawItems.length}
                    totalPage={pagination?.totalPages ?? 1}
                  />
                </Box>
              )}
            </>
          )}
        </VStack>
      </Container.Body>
    </Container.Root>
  );
};
