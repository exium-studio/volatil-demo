// src/features/mitra/help-center/components/help-center.data-list.tsx

import { Button } from "@/design-system/components/button/ui/button";
import type {
  FormattedListItem,
  FormattedTableHeader,
} from "@/design-system/components/data-display/types/data-view-table.type";
import { DataViewFooter } from "@/design-system/components/data-display/ui/data-view-footer";
import { DEFAULT_PAGE_SIZE_OPTIONS } from "@/design-system/components/data-display/ui/data-view-page-size";
import { DataView } from "@/design-system/components/data-display/ui/data-view-table";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { NoDataState } from "@/design-system/components/feedback/ui/state.no-data";
import { TopBarLoader } from "@/design-system/components/feedback/ui/top-bar-loader";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import type { FocusSelectOption } from "@/design-system/components/input/types/focus-select.type";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import { Box } from "@/design-system/components/layout/ui/box";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { ClampedP, P } from "@/design-system/components/typography/ui/p";
import { CreateHelpCenterTrigger } from "@/features/mitra/help-center/components/help-center.create";
import { useHelpCenterTicketsQuery } from "@/features/mitra/help-center/hooks/use-help-center.query";
import type {
  HelpCenterItem,
  HelpCenterQueryParams,
  HelpCenterResponse,
  HelpCenterStatus,
} from "@/features/mitra/help-center/types/help-center.type";
import {
  formatUtcDateTime,
  getPreferredUserTimezone,
} from "@/shared/utils/formatter/date.formatter";
import { StatusFilterSelect } from "@/features/shared/components/status-filter.select";
import { t } from "@/shared/libs/i18n";
import { isEmptyArray } from "@/shared/utils/data/array";
import { useNavigate } from "@tanstack/react-router";
import {
  EyeIcon,
  InboxIcon,
  MessageSquareIcon,
  PaperclipIcon,
  PlusIcon,
} from "lucide-react";
import { startTransition, useMemo, useState } from "react";

import { Heading } from "@/design-system/components/typography/ui/heading";
import { getUserSession } from "@/shared/utils/user/user-session.utils";

const STATUS_CONFIG_MAP: Record<
  HelpCenterStatus,
  { label: string; color: string }
> = {
  submitted: { label: "Diajukan", color: "orange" },
  in_review: { label: "Ditinjau", color: "blue" },
  in_progress: { label: "Diproses", color: "blue" },
  resolved: { label: "Selesai", color: "green" },
  rejected: { label: "Ditolak", color: "red" },
};

const HELP_CENTER_STATUS_OPTIONS: FocusSelectOption[] = [
  { value: "all", label: "Semua Status" },
  { value: "submitted", label: "Diajukan" },
  { value: "in_review", label: "Ditinjau" },
  { value: "in_progress", label: "Diproses" },
  { value: "resolved", label: "Selesai" },
  { value: "rejected", label: "Ditolak" },
];

export const HelpCenterDataView = () => {
  // Navigation
  const navigate = useNavigate();

  // States — Centralized query/action parameters
  const [params, setParams] = useState<HelpCenterQueryParams>({
    page: 1,
    limit: DEFAULT_PAGE_SIZE_OPTIONS[0],
    search: "",
    status: undefined,
  });

  const preferredTimezone = useMemo(() => getPreferredUserTimezone(), []);

  // Queries
  const { tickets, pagination, isLoading, isFetching } =
    useHelpCenterTicketsQuery({
      search: params.search?.trim() || undefined,
      page: params.page,
      limit: params.limit,
      status: params.status,
    });

  // Derived Values - DataList headers, items, itemActions
  const dataList = useMemo(() => {
    const headers: FormattedTableHeader[] = [
      { th: "Judul Laporan", sortable: true, align: "start" },
      { th: "Pesan", sortable: true, align: "start" },
      { th: "Status", sortable: true, align: "start" },
      { th: "Pelapor", sortable: true, align: "start" },
      { th: "Balasan Terakhir", sortable: false, align: "start" },
      { th: "Transaksi Terkait", sortable: true, align: "start" },
      { th: "Lampiran", sortable: false, align: "start" },
      { th: "Waktu Dibuat", sortable: true, align: "start" },
    ];

    const items: FormattedListItem<HelpCenterItem>[] = tickets.map(
      (ticket: HelpCenterItem) => {
      const repliesList: HelpCenterResponse[] =
        ticket.responses ?? ticket.replies ?? [];
      const latestReply =
        repliesList.length > 0
          ? repliesList[repliesList.length - 1]
          : undefined;

      const totalAttachments =
        ticket.attachmentsCount ?? ticket.attachments?.length ?? 0;

      const statusConfig = STATUS_CONFIG_MAP[ticket.status] ?? {
        label: ticket.status,
        color: "gray",
      };

      const hasTransaction = Boolean(
        ticket.orderNumber || ticket.transactionId,
      );

      return {
        id: String(ticket.id),
        data: ticket,
        columns: [
          {
            value: ticket.title,
            td: <P fontWeight={"medium"}>{ticket.title}</P>,
          },
          {
            value: ticket.title,
            td: (
              <ClampedP color={"fg.subtle"} w={"200px"}>
                {ticket.description}
              </ClampedP>
            ),
          },
          {
            value: ticket.status,
            td: (
              <Badge colorPalette={statusConfig.color} variant={"subtle"}>
                {statusConfig.label}
              </Badge>
            ),
            align: "start",
          },
          {
            value: ticket.user?.name,
            td: (
              <VStack align={"start"} gap={0} minW={"140px"}>
                <P>{ticket.user?.name || "?"}</P>

                <P fontSize={"sm"} color={"fg.subtle"}>
                  {ticket.user?.email || "?"}
                </P>
              </VStack>
            ),
          },
          {
            value: latestReply?.message ?? "-",
            td: latestReply ? (
              <VStack align={"start"} gap={0} minW={"200px"}>
                <HStack gap={1} align={"center"}>
                  <AppIcon
                    icon={MessageSquareIcon}
                    size={"sm"}
                    color={"fg.subtle"}
                  />

                  <P fontSize={"sm"} fontWeight={"medium"} color={"fg.subtle"}>
                    {latestReply.admin?.name ?? latestReply.user?.name ?? "?"}
                  </P>
                </HStack>

                <ClampedP color={"fg.muted"} lineClamp={1} maxW={"260px"}>
                  {latestReply.message}
                </ClampedP>
              </VStack>
            ) : (
              <P color={"fg.subtle"} fontSize={"sm"}>
                {"Belum ada balasan"}
              </P>
            ),
          },
          {
            value: ticket.orderNumber ?? ticket.transactionId ?? "-",
            td: (
              <P
                color={hasTransaction ? "fg.muted" : "fg.subtle"}
                fontSize={"sm"}
              >
                {ticket.orderNumber ?? ticket.transactionId ?? "-"}
              </P>
            ),
            align: "start",
          },
          {
            value: totalAttachments,
            td:
              totalAttachments > 0 ? (
                <Badge variant={"outline"} colorPalette={"gray"}>
                  <AppIcon icon={PaperclipIcon} />
                  {String(totalAttachments)}
                </Badge>
              ) : (
                <P color={"fg.subtle"} fontSize={"sm"}>
                  {"-"}
                </P>
              ),
            align: "start",
          },
          {
            value: ticket.createdAt,
            td: (
              <P whiteSpace={"nowrap"} color={"fg.muted"} fontSize={"sm"}>
                {formatUtcDateTime(ticket.createdAt, preferredTimezone)}
              </P>
            ),
          },
        ],
      };
    });

    const itemActions = [
      {
        key: "view-detail",
        label: "Lihat Detail",
        icon: EyeIcon,
        onClick: (ticket: HelpCenterItem) => {
          void navigate({
            to: "/mitra/help-center/$ticketId",
            params: { ticketId: String(ticket.id) },
          });
        },
      },
    ];

    return {
      headers,
      items,
      batchActions: [],
      itemActions,
    };
  }, [tickets, preferredTimezone, navigate]);

  const currentUser = useMemo(() => getUserSession(), []);
  const isInternalAdmin = currentUser?.role === "internal";

  return (
    <Container.Root withContext={true}>
      <Container.Body overflowY={"auto"}>
        <VStack align={"start"} gap={1} p={"md"}>
          <Heading>{"Daftar Laporan Kendala"}</Heading>

          <P fontSize={"sm"} color={"fg.subtle"}>
            {"Pantau perkembangan status tiket kendala dan riwayat balasan."}
          </P>
        </VStack>

        <Separator borderColor={"bg.canvas"} />

        <HStack
          wrap={"wrap"}
          align={"center"}
          justify={"space-between"}
          gap={"sm"}
          p={"md"}
        >
          <HStack wrap={"wrap"} align={"center"} gap={"sm"}>
            <SearchInput
              placeholder={t["action.search"]()}
              value={params.search}
              onValueChange={(val) =>
                startTransition(() => {
                  setParams((prev) => ({ ...prev, search: val, page: 1 }));
                })
              }
              maxW={"240px"}
            />

            <StatusFilterSelect
              modalKey={"help-center-status-filter"}
              options={HELP_CENTER_STATUS_OPTIONS}
              value={params.status ?? "all"}
              onValueChange={(val) =>
                startTransition(() => {
                  setParams((prev) => ({
                    ...prev,
                    status:
                      val === "all" ? undefined : (val as HelpCenterStatus),
                    page: 1,
                  }));
                })
              }
            />
          </HStack>

          {!isInternalAdmin && (
            <CreateHelpCenterTrigger>
              <Button primary={true} pl={3}>
                <AppIcon icon={PlusIcon} />
                {"Buat Laporan"}
              </Button>
            </CreateHelpCenterTrigger>
          )}
        </HStack>

        <Separator borderColor={"bg.canvas"} />

        {/* Table & Footer Content */}
        <VStack position={"relative"} w={"full"} bg={"bg.canvas"}>
          {isLoading && (
            <Skeleton w={"full"} h={"300px"} p={"md"} roundedTop={0} />
          )}

          {!isLoading && isEmptyArray(tickets) && (
            <Box py={"xl"} w={"full"} bg={"bg.body"}>
              <NoDataState
                icon={InboxIcon}
                title={"Belum Ada Laporan"}
                description={
                  params.search
                    ? "Tidak ditemukan laporan yang sesuai dengan kata kunci pencarian Anda."
                    : "Belum ada laporan atau tiket yang diajukan."
                }
              />
            </Box>
          )}

          {!isLoading && !isEmptyArray(tickets) && (
            <Box w={"full"} position={"relative"}>
              <DataView.Table.Root
                headers={dataList.headers}
                items={dataList.items}
                itemActions={dataList.itemActions}
                page={params.page}
                pageSize={params.limit}
                roundedTop={0}
              >
                <DataView.Table.Header />
                <DataView.Table.Body />
              </DataView.Table.Root>

              <TopBarLoader isFetching={isFetching} />

              <DataViewFooter
                page={params.page ?? 1}
                pageSize={params.limit ?? DEFAULT_PAGE_SIZE_OPTIONS[0]}
                setPage={(newPage: number) =>
                  setParams((prev) => ({ ...prev, page: newPage }))
                }
                setPageSize={(newSize: number) => {
                  setParams((prev) => ({
                    ...prev,
                    limit: newSize,
                    page: 1,
                  }));
                }}
                currentDataLength={tickets.length}
                totalData={pagination.totalItems}
                totalPage={pagination.totalPages}
              />
            </Box>
          )}
        </VStack>
      </Container.Body>
    </Container.Root>
  );
};
