// src/features/internal/user-management/components/internal.user-management.data-list.tsx

import type {
  FormattedListItem,
  FormattedTableHeader,
} from "@/design-system/components/data-display/types/data-list-table.type";
import { DataListFooter } from "@/design-system/components/data-display/ui/data-list-footer";
import { DEFAULT_PAGE_SIZE_OPTIONS } from "@/design-system/components/data-display/ui/data-list-page-size";
import { DataListTable } from "@/design-system/components/data-display/ui/data-list-table";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { TopBarLoader } from "@/design-system/components/feedback/ui/top-bar-loader";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import { Box } from "@/design-system/components/layout/ui/box";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { P } from "@/design-system/components/typography/ui/p";
import { SPACING } from "@/design-system/constants/styles";
import {
  useUpdateUserStatus,
  useUserManagementUsersQuery,
} from "@/features/internal/user-management/hooks/use-user-management.query";
import type {
  UserManagementItem,
  UserStatus,
} from "@/features/internal/user-management/types/user-management.type";
import {
  formatUtcDateTime,
  getPreferredUserTimezone,
} from "@/shared/utils/formatter/date.formatter";
import { t } from "@/shared/libs/i18n";
import type { UserRole } from "@/shared/types/common-response.type";
import { CheckCircleIcon, ShieldAlertIcon } from "lucide-react";
import { startTransition, useMemo, useState } from "react";

const STATUS_MAP: Record<UserStatus, { label: string; color: string }> = {
  active: { label: "Aktif", color: "green" },
  inactive: { label: "Tidak Aktif", color: "gray" },
};

const ROLE_MAP: Record<UserRole, { label: string; color: string }> = {
  internal: { label: "Internal", color: "purple" },
  mitra: { label: "Mitra", color: "blue" },
};

import { RoleSelect } from "@/shared/components/select/ui/role-select";
import { StatusSelect } from "@/shared/components/select/ui/status-select";

export const InternalUserManagementDataList = () => {
  // States
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(
    DEFAULT_PAGE_SIZE_OPTIONS[0],
  );
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedRole, setSelectedRole] = useState<string>("all");

  const preferredTimezone = useMemo(() => getPreferredUserTimezone(), []);

  // Mutations
  const updateStatusMutation = useUpdateUserStatus();

  // Queries
  const { users, total, totalPages, isLoading, isFetching } =
    useUserManagementUsersQuery({
      search: search.trim() || undefined,
      page,
      pageSize,
      status:
        selectedStatus === "all" ? undefined : (selectedStatus as UserStatus),
      role: selectedRole === "all" ? undefined : (selectedRole as UserRole),
    });

  // Derived Values - Headers, Items, BatchActions, ItemActions in 1 useMemo
  const dataList = useMemo(() => {
    const headers: FormattedTableHeader[] = [
      { th: "Pengguna", sortable: true, align: "start" },
      { th: "Role", sortable: true, align: "start" },
      { th: "Instansi / Perusahaan", sortable: true, align: "start" },
      { th: "Status", sortable: true, align: "start" },
      { th: "Terakhir Masuk", sortable: true, align: "start" },
    ];

    const items: FormattedListItem<UserManagementItem>[] = users.map(
      (user: UserManagementItem) => ({
        id: user.id,
        data: user,
        columns: [
          {
            value: user.name,
            td: (
              <VStack align={"start"} gap={0} minW={"180px"}>
                <P fontWeight={"medium"}>{user.name}</P>
                <P fontSize={"sm"} color={"fg.subtle"}>
                  {user.email}
                </P>
              </VStack>
            ),
            align: "start",
          },
          {
            value: user.role,
            td: (
              <Badge
                colorPalette={ROLE_MAP[user.role].color}
                variant={"subtle"}
              >
                {ROLE_MAP[user.role].label}
              </Badge>
            ),
            align: "start",
          },
          {
            value: user.agencyOrCompany,
            td: <P color={"fg.muted"}>{user.agencyOrCompany}</P>,
            align: "start",
          },
          {
            value: user.status,
            td: (
              <Badge
                colorPalette={STATUS_MAP[user.status].color}
                variant={"subtle"}
              >
                {STATUS_MAP[user.status].label}
              </Badge>
            ),
            align: "start",
          },
          {
            value: user.lastLoginAt ?? "",
            td: (
              <P whiteSpace={"nowrap"} color={"fg.muted"}>
                {formatUtcDateTime(user.lastLoginAt, preferredTimezone)}
              </P>
            ),
            align: "start",
          },
        ],
      }),
    );

    const itemActions = [
      {
        key: "toggle-status",
        label: (user: UserManagementItem) =>
          user.status === "active"
            ? "Nonaktifkan Pengguna"
            : "Aktifkan Pengguna",
        icon: (user: UserManagementItem) =>
          user.status === "active" ? ShieldAlertIcon : CheckCircleIcon,
        colorPalette: (user: UserManagementItem) =>
          user.status === "active" ? "red" : "green",
        confirmation: (user: UserManagementItem) => ({
          title:
            user.status === "active"
              ? "Nonaktifkan Pengguna?"
              : "Aktifkan Pengguna?",
          description: `Apakah Anda yakin ingin mengubah status akun ${user.name}?`,
          confirmLabel:
            user.status === "active" ? "Nonaktifkan" : "Aktifkan",
          colorPalette: user.status === "active" ? "red" : "green",
          onConfirm: () => {
            updateStatusMutation.mutate({
              id: user.id,
              status: user.status === "active" ? "inactive" : "active",
            });
          },
        }),
      },
    ];

    return {
      headers,
      items,
      batchActions: [],
      itemActions,
    };
  }, [users, preferredTimezone, updateStatusMutation]);

  return (
    <Container.Root withContext={true}>
      <Container.Body overflow={"clip"}>
        {/* Header Actions */}
        <HStack
          wrap={"wrap"}
          align={"center"}
          justify={"space-between"}
          gap={SPACING.md}
          p={SPACING.md}
        >
          <VStack gap={1} align={"start"}>
            <Heading>
              {"Daftar Pengguna"}
            </Heading>
            <P fontSize={"sm"} color={"fg.subtle"}>
              {"Kelola data akun pengguna internal dan mitra ATR/BPN."}
            </P>
          </VStack>

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
              maxW={"220px"}
            />

            <StatusSelect
              modalKey={"user-management-status-filter"}
              value={selectedStatus}
              onValueChange={(val) =>
                startTransition(() => {
                  setSelectedStatus(val);
                  setPage(1);
                })
              }
              w={"150px"}
            />

            <RoleSelect
              modalKey={"user-management-role-filter"}
              value={selectedRole}
              onValueChange={(val) =>
                startTransition(() => {
                  setSelectedRole(val);
                  setPage(1);
                })
              }
              w={"140px"}
            />
          </HStack>
        </HStack>

        <Separator borderColor={"bg.canvas"} />

        {/* Table & Footer Content */}
        <VStack bg={"bg.canvas"} w={"full"} position={"relative"} gap={0}>
          {isLoading ? (
            <Skeleton h={"280px"} w={"full"} p={SPACING.md} roundedTop={0} />
          ) : (
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
                currentDataLength={users.length}
                totalData={total}
                totalPage={totalPages}
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
