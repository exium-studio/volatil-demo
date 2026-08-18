// src/features/mitra/help-center/components/help-center.data-list.tsx

import { Button } from "@/design-system/components/button/ui/button";
import type {
  FormattedListItem,
  FormattedTableHeader,
} from "@/design-system/components/data-display/types/data-list-table.type";
import { DataListFooter } from "@/design-system/components/data-display/ui/data-list-footer";
import { DEFAULT_PAGE_SIZE_OPTIONS } from "@/design-system/components/data-display/ui/data-list-page-size";
import { DataListTable } from "@/design-system/components/data-display/ui/data-list-table";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { NoDataState } from "@/design-system/components/feedback/ui/state.no-data";
import { TopBarLoader } from "@/design-system/components/feedback/ui/top-bar-loader";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import { Box } from "@/design-system/components/layout/ui/box";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { Menu } from "@/design-system/components/overlay/ui/menu";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { P } from "@/design-system/components/typography/ui/p";
import { PADDING, SPACING } from "@/design-system/constants/styles";
import { CreateHelpCenterTrigger } from "@/features/mitra/help-center/components/help-center.create";
import { useHelpCenterTicketsQuery } from "@/features/mitra/help-center/hooks/use-help-center.query";
import type {
  HelpCenterItem,
  HelpCenterResponse,
  HelpCenterStatus,
} from "@/features/mitra/help-center/types/help-center.type";
import {
  formatUtcDateTime,
  getPreferredUserTimezone,
} from "@/features/mitra/my-data/utils/my-data-date";
import type { FocusSelectOption } from "@/design-system/components/input/types/focus-select.type";
import { StatusSelect } from "@/shared/components/select/ui/status-select";
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

const STATUS_CONFIG_MAP: Record<
  HelpCenterStatus,
  { label: string; color: string }
> = {
  submitted: { label: "Diajukan", color: "blue" },
  in_review: { label: "Ditinjau", color: "yellow" },
  in_progress: { label: "Diproses", color: "orange" },
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

export const HelpCenterDataList = () => {
  // Navigation
  const navigate = useNavigate();

  // States
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(
    DEFAULT_PAGE_SIZE_OPTIONS[0],
  );
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const preferredTimezone = useMemo(() => getPreferredUserTimezone(), []);

  // Queries
  const { tickets, pagination, isLoading, isFetching } =
    useHelpCenterTicketsQuery({
      search: search.trim() || undefined,
      page,
      limit: pageSize,
      status:
        selectedStatus === "all"
          ? undefined
          : (selectedStatus as HelpCenterStatus),
    });

  // Derived Values - DataList headers, items, itemActions
  const dataList = useMemo(() => {
    const headers: FormattedTableHeader[] = [
      { th: "Judul Laporan", sortable: true, align: "start" },
      { th: "Pelapor", sortable: true, align: "start" },
      { th: "Status", sortable: true, align: "center" },
      { th: "Balasan Terakhir", sortable: false, align: "start" },
      { th: "Lampiran", sortable: false, align: "center" },
      { th: "Waktu Dibuat", sortable: true, align: "start" },
    ];

    const items: FormattedListItem[] = tickets.map((ticket: HelpCenterItem) => {
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

      const reporterName =
        ticket.reporter?.name ?? ticket.user?.name ?? "Pelapor";
      const reporterOrg =
        ticket.reporter?.organizationName ??
        ticket.user?.organizationName ??
        "";

      return {
        id: String(ticket.id),
        data: ticket,
        columns: [
          {
            value: ticket.title,
            td: (
              <VStack align={"start"} gap={0} minW={"220px"}>
                <P fontWeight={"medium"}>{ticket.title}</P>
                <P
                  fontSize={"xs"}
                  color={"fg.subtle"}
                  lineClamp={1}
                  maxW={"300px"}
                >
                  {ticket.description}
                </P>
              </VStack>
            ),
            align: "start",
          },
          {
            value: reporterName,
            td: (
              <VStack align={"start"} gap={0} minW={"140px"}>
                <P fontWeight={"normal"}>{reporterName}</P>
                {reporterOrg && (
                  <P fontSize={"xs"} color={"fg.subtle"}>
                    {reporterOrg}
                  </P>
                )}
              </VStack>
            ),
            align: "start",
          },
          {
            value: ticket.status,
            td: (
              <Badge colorPalette={statusConfig.color} variant={"subtle"}>
                {statusConfig.label}
              </Badge>
            ),
            align: "center",
          },
          {
            value: latestReply?.message ?? "-",
            td: latestReply ? (
              <VStack align={"start"} gap={0} minW={"200px"}>
                <HStack gap={1} align={"center"}>
                  <AppIcon
                    icon={MessageSquareIcon}
                    size={"xs"}
                    color={"fg.subtle"}
                  />
                  <P fontSize={"xs"} fontWeight={"medium"} color={"fg.subtle"}>
                    {latestReply.admin?.name ??
                      latestReply.user?.name ??
                      "Admin Internal"}
                  </P>
                </HStack>
                <P
                  fontSize={"sm"}
                  color={"fg.muted"}
                  lineClamp={1}
                  maxW={"260px"}
                >
                  {latestReply.message}
                </P>
              </VStack>
            ) : (
              <P color={"fg.subtle"} fontSize={"sm"}>
                {"Belum ada balasan"}
              </P>
            ),
            align: "start",
          },
          {
            value: totalAttachments,
            td:
              totalAttachments > 0 ? (
                <Badge variant={"outline"} colorPalette={"gray"}>
                  <AppIcon icon={PaperclipIcon} size={"xs"} />
                  {String(totalAttachments)}
                </Badge>
              ) : (
                <P color={"fg.subtle"} fontSize={"sm"}>
                  {"-"}
                </P>
              ),
            align: "center",
          },
          {
            value: ticket.createdAt,
            td: (
              <P whiteSpace={"nowrap"} color={"fg.muted"} fontSize={"sm"}>
                {formatUtcDateTime(ticket.createdAt, preferredTimezone)}
              </P>
            ),
            align: "start",
          },
        ],
      };
    });

    const itemActions = [
      (item: FormattedListItem) => {
        const ticket = item.data as HelpCenterItem;

        return (
          <Menu.Item
            key={`detail-${ticket.id}`}
            value={`detail-${ticket.id}`}
            onClick={() => {
              void navigate({
                to: "/mitra/help-center/$ticketId",
                params: { ticketId: String(ticket.id) },
              });
            }}
          >
            <AppIcon icon={EyeIcon} />
            {"Lihat Detail"}
          </Menu.Item>
        );
      },
    ];

    return {
      headers,
      items,
      batchActions: [],
      itemActions,
    };
  }, [tickets, preferredTimezone, navigate]);

  return (
    <Container.Root withContext={true}>
      <Container.Body overflow={"clip"}>
        {/* Header Filter Actions */}
        <VStack align={"start"} gap={1} p={PADDING.md}>
          <P fontSize={"lg"} fontWeight={"semibold"}>
            {"Daftar Laporan"}
          </P>

          <P fontSize={"sm"} color={"fg.subtle"}>
            {"Pantau perkembangan status tiket kendala dan riwayat balasan."}
          </P>
        </VStack>

        <Separator borderColor={"bg.canvas"} />

        <HStack
          wrap={"wrap"}
          align={"center"}
          justify={"space-between"}
          gap={SPACING.sm}
          p={PADDING.md}
        >
          <HStack wrap={"wrap"} align={"center"} gap={SPACING.sm}>
            <SearchInput
              placeholder={t["action.search"]()}
              value={search}
              onValueChange={(val) =>
                startTransition(() => {
                  setSearch(val);
                  setPage(1);
                })
              }
              maxW={"240px"}
            />

            <StatusSelect
              modalKey={"help-center-status-filter"}
              options={HELP_CENTER_STATUS_OPTIONS}
              value={selectedStatus}
              onValueChange={(val) =>
                startTransition(() => {
                  setSelectedStatus(val);
                  setPage(1);
                })
              }
            />
          </HStack>

          <CreateHelpCenterTrigger>
            <Button primary={true} pl={3}>
              <AppIcon icon={PlusIcon} />
              {"Buat Laporan"}
            </Button>
          </CreateHelpCenterTrigger>
        </HStack>

        <Separator borderColor={"bg.canvas"} />

        {/* Table & Footer Content */}
        <VStack bg={"bg.canvas"} w={"full"} position={"relative"}>
          {isLoading && <Skeleton h={"280px"} w={"full"} />}

          {!isLoading && isEmptyArray(tickets) && (
            <Box py={PADDING.xl} w={"full"} bg={"bg.body"}>
              <NoDataState
                icon={InboxIcon}
                title={"Belum Ada Laporan"}
                description={
                  search
                    ? "Tidak ditemukan laporan yang sesuai dengan kata kunci pencarian Anda."
                    : "Belum ada laporan atau tiket yang diajukan."
                }
              />
            </Box>
          )}

          {!isLoading && !isEmptyArray(tickets) && (
            <Box w={"full"} position={"relative"}>
              <DataListTable.Root
                headers={dataList.headers}
                items={dataList.items}
                itemActions={dataList.itemActions}
                page={page}
                pageSize={pageSize}
                roundedTop={0}
                shadow={"none"}
              >
                <DataListTable.Header />
                <DataListTable.Body />
              </DataListTable.Root>

              <TopBarLoader isFetching={isFetching} />

              <DataListFooter
                page={page}
                pageSize={pageSize}
                setPage={setPage}
                setPageSize={(newSize) => {
                  setPageSize(newSize);
                  setPage(1);
                }}
                currentDataLength={tickets.length}
                totalData={pagination.totalItems}
                totalPage={pagination.totalPages}
                roundedBottom={0}
                shadow={"none"}
              />
            </Box>
          )}
        </VStack>
      </Container.Body>
    </Container.Root>
  );
};
