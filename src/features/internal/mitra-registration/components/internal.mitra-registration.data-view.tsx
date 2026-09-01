// src/features/internal/mitra-registration/components/internal.mitra-registration.data-view.tsx

import type { FormattedTableHeader } from "@/design-system/components/data-display/types/data-view-table.type";
import type { DataViewItemActionsGenerator } from "@/design-system/components/data-display/types/data-view.type";
import { DataViewFooter } from "@/design-system/components/data-display/ui/data-view-footer";
import { DEFAULT_PAGE_SIZE_OPTIONS } from "@/design-system/components/data-display/ui/data-view-page-size";
import { DataView } from "@/design-system/components/data-display/ui/data-view-table";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { NoDataState } from "@/design-system/components/feedback/ui/state.no-data";
import { NoResultState } from "@/design-system/components/feedback/ui/state.no-result";
import { TopBarLoader } from "@/design-system/components/feedback/ui/top-bar-loader";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import { InfoTip } from "@/design-system/components/input/ui/toggle-tip";
import { Box } from "@/design-system/components/layout/ui/box";
import { Center } from "@/design-system/components/layout/ui/center";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { HeaderContainer } from "@/design-system/components/shell/ui/header-container";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { ClampedP, P } from "@/design-system/components/typography/ui/p";
import { InternalMitraRegistrationApproveTrigger } from "@/features/internal/mitra-registration/components/internal.mitra-registration.approve-modal";
import { InternalMitraRegistrationRejectTrigger } from "@/features/internal/mitra-registration/components/internal.mitra-registration.reject-modal";
import { useInternalMitraRegistrationsQuery } from "@/features/internal/mitra-registration/hooks/use-mitra-registration.query";
import type {
  InternalMitraRegistrationItem,
  InternalMitraRegistrationQueryParams,
  MitraRegistrationStatus,
} from "@/features/internal/mitra-registration/types/mitra-registration.type";
import { StatusFilterSelect } from "@/features/shared/components/status-filter.select";
import { isEmptyArray } from "@/shared/utils/data/array";
import {
  formatUtcDateTime,
  getPreferredUserTimezone,
} from "@/shared/utils/formatter/date.formatter";
import { useNavigate } from "@tanstack/react-router";
import {
  CheckCircle2Icon,
  EyeIcon,
  HandshakeIcon,
  XCircleIcon,
} from "lucide-react";
import { useMemo, useState, useTransition } from "react";

const REGISTRATION_STATUS_OPTIONS = [
  { value: "all", label: "Semua Status" },
  { value: "pending_verification", label: "Menunggu Verifikasi" },
  { value: "approved", label: "Disetujui" },
  { value: "rejected", label: "Ditolak" },
];

const STATUS_BADGE_MAP: Record<
  MitraRegistrationStatus,
  { label: string; colorPalette: string }
> = {
  pending_verification: {
    label: "Menunggu Verifikasi",
    colorPalette: "orange",
  },
  approved: {
    label: "Disetujui",
    colorPalette: "green",
  },
  rejected: {
    label: "Ditolak",
    colorPalette: "red",
  },
};

export const InternalMitraRegistrationDataView = () => {
  // Hooks
  const navigate = useNavigate();

  // Transitions
  const [_isPending, startTransition] = useTransition();

  // States — Centralized query parameters
  const [params, setParams] = useState<InternalMitraRegistrationQueryParams>({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE_OPTIONS[0],
    search: "",
    status: "all",
  });

  // Queries
  const {
    items: rawItems,
    pagination,
    isLoading,
    isFetching,
  } = useInternalMitraRegistrationsQuery({
    page: params.page,
    pageSize: params.pageSize,
    search: params.search || undefined,
    status: params.status as MitraRegistrationStatus | "all",
  });

  // Derived Values
  const preferredTimezone = useMemo(() => getPreferredUserTimezone(), []);
  const isSearching = Boolean(params.search?.trim() || params.status !== "all");
  const searchQuery = useMemo(() => {
    if (params.search?.trim()) return params.search;
    if (params.status !== "all") return params.status ?? "...";
    return "...";
  }, [params.search, params.status]);

  // Derived Values - Headers, Items, BatchActions, ItemActions in 1 useMemo
  const dataList = useMemo(() => {
    const headers: FormattedTableHeader[] = [
      { th: "No. Registrasi & Instansi", sortable: true },
      { th: "Status", sortable: true },
      { th: "Penanggung Jawab", sortable: true },
      { th: "Kontak / Email", sortable: true },
      { th: "Waktu Pengajuan", sortable: true },
    ];

    const items = rawItems.map((reg) => {
      const badgeConfig =
        STATUS_BADGE_MAP[reg.status] || STATUS_BADGE_MAP.pending_verification;

      return {
        id: String(reg.id),
        data: reg,
        columns: [
          {
            value: reg.registrationNumber,
            td: (
              <VStack align={"start"} gap={0} w={"220px"}>
                <ClampedP fontWeight={"medium"}>{reg.namaInstansi}</ClampedP>
                <P fontWeight={"semibold"}>{reg.registrationNumber}</P>
                <P fontSize={"sm"} color={"fg.subtle"}>
                  {`NIB: ${reg.nib}`}
                </P>
              </VStack>
            ),
            align: "start" as const,
          },
          {
            value: reg.status,
            td: (
              <Badge colorPalette={badgeConfig.colorPalette} variant={"subtle"}>
                {badgeConfig.label}
              </Badge>
            ),
          },
          {
            value: reg.namaPenanggungJawab,
            td: (
              <VStack align={"start"} gap={0}>
                <P>{reg.namaPenanggungJawab ?? "-"}</P>
                <P fontSize={"sm"} color={"fg.subtle"}>
                  {reg.jabatan ?? "-"}
                </P>
              </VStack>
            ),
            align: "start" as const,
          },
          {
            value: reg.email,
            td: <P>{reg.email}</P>,
            align: "start" as const,
          },

          {
            value: reg.createdAt,
            td: (
              <P fontSize={"sm"} color={"fg.muted"} whiteSpace={"nowrap"}>
                {formatUtcDateTime(reg.createdAt, preferredTimezone)}
              </P>
            ),
            align: "start" as const,
          },
        ],
      };
    });

    const itemActions: DataViewItemActionsGenerator<InternalMitraRegistrationItem>[] =
      [
        {
          key: "open-detail",
          label: "Lihat Detail Berkas",
          icon: EyeIcon,
          onClick: (reg: InternalMitraRegistrationItem) => {
            void navigate({
              to: "/internal/mitra-registration/$registrationId",
              params: { registrationId: String(reg.id) },
            });
          },
        },
        {
          key: "approve-registration",
          label: "Setujui Permohonan",
          icon: CheckCircle2Icon,
          colorPalette: "green",
          hidden: (reg: InternalMitraRegistrationItem) =>
            reg.status !== "pending_verification",
          modal: {
            triggerComponent: (reg: InternalMitraRegistrationItem) => (
              <InternalMitraRegistrationApproveTrigger
                modalKey={`approve-mitra-reg-${reg.id}`}
                registration={reg}
              />
            ),
          },
        },
        {
          key: "reject-registration",
          label: "Tolak Permohonan",
          icon: XCircleIcon,
          colorPalette: "red",
          hidden: (reg: InternalMitraRegistrationItem) =>
            reg.status !== "pending_verification",
          modal: {
            triggerComponent: (reg: InternalMitraRegistrationItem) => (
              <InternalMitraRegistrationRejectTrigger
                modalKey={`reject-mitra-reg-${reg.id}`}
                registration={reg}
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
  }, [rawItems, preferredTimezone, navigate]);

  return (
    <Container.Root withContext={true} flex={1}>
      <Container.Body overflowY={"auto"}>
        <HeaderContainer>
          <HStack justify={"space-between"} align={"center"} w={"full"}>
            <HStack gap={"xs"} align={"center"}>
              <Heading>{"Permohonan Kemitraan"}</Heading>

              <InfoTip
                variant={"icon"}
                appIconProps={{
                  size: "xs",
                  color: "fg.subtle",
                }}
              >
                {
                  "Verifikasi data permohonan kemitraan dari calon mitra, periksa 6 berkas persyaratan, terbitkan kontrak kerjasama atau tolak permohonan."
                }
              </InfoTip>
            </HStack>
          </HStack>
        </HeaderContainer>

        <Separator borderColor={"bg.canvas"} />

        {/* Filter Bar */}
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
            placeholder={"Cari instansi, no registrasi, NIB..."}
            value={params.search ?? ""}
            onValueChange={(val) => {
              startTransition(() => {
                setParams((prev) => ({
                  ...prev,
                  search: val,
                  page: 1,
                }));
              });
            }}
            maxW={"280px"}
          />

          <StatusFilterSelect
            options={REGISTRATION_STATUS_OPTIONS}
            value={params.status ?? "all"}
            onValueChange={(val) => {
              startTransition(() => {
                setParams((prev) => ({
                  ...prev,
                  status: (val || "all") as MitraRegistrationStatus | "all",
                  page: 1,
                }));
              });
            }}
            placeholder={"Semua Status"}
            modalKey={"mitra-reg-status-filter"}
            w={"180px"}
          />
        </HStack>

        <Separator borderColor={"bg.canvas"} />

        {/* Table Content with Loading / Empty States */}
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
                      title={"Belum Ada Permohonan Mitra"}
                      description={
                        "Daftar permohonan kemitraan dari calon mitra luar akan muncul di sini."
                      }
                      icon={HandshakeIcon}
                    />
                  )}
                </Center>
              )}

              {!isEmptyArray(rawItems) && (
                <Box w={"full"} position={"relative"}>
                  <TopBarLoader isFetching={isFetching} />

                  <DataView.Table.Root<InternalMitraRegistrationItem>
                    headers={dataList.headers}
                    items={dataList.items}
                    itemActions={dataList.itemActions}
                    withNumbering
                    page={params.page}
                    pageSize={params.pageSize}
                    pb={0}
                    rounded={0}
                  >
                    <DataView.Table.Header />
                    <DataView.Table.Body />
                  </DataView.Table.Root>

                  <Separator borderColor={"bg.canvas"} />

                  <DataViewFooter
                    page={params.page ?? 1}
                    pageSize={params.pageSize ?? DEFAULT_PAGE_SIZE_OPTIONS[0]}
                    setPage={(newPage: number) => {
                      startTransition(() => {
                        setParams((prev) => ({ ...prev, page: newPage }));
                      });
                    }}
                    setPageSize={(newSize: number) => {
                      startTransition(() => {
                        setParams((prev) => ({
                          ...prev,
                          pageSize: newSize,
                          page: 1,
                        }));
                      });
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
