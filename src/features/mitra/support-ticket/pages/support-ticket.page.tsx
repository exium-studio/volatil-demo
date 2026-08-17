// src/features/mitra/support-ticket/pages/support-ticket.page.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { NoDataState } from "@/design-system/components/feedback/ui/state.no-data";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { PanelContentContainer } from "@/design-system/components/layout/ui/page-container";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { AppNavTitle } from "@/design-system/components/shell/ui/app-nav-title";
import { PADDING, SPACING } from "@/design-system/constants/styles";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { CreateTicketModal } from "@/features/mitra/support-ticket/components/support-ticket.create-modal";
import { SupportTicketItem } from "@/features/mitra/support-ticket/components/support-ticket.item";
import { SupportTicketSummary } from "@/features/mitra/support-ticket/components/support-ticket.summary";
import {
  DUMMY_TICKETS,
  DUMMY_TICKET_STATISTICS,
} from "@/features/mitra/support-ticket/constants/dummy-tickets";
import type {
  TicketItem,
  TicketStatistics,
} from "@/features/mitra/support-ticket/types/support-ticket.type";
import { APP_NAVS_MAP } from "@/shared/constants/app.navs";
import { InboxIcon, PlusIcon } from "lucide-react";
import { useMemo, useState, useTransition } from "react";

export const SupportTicketPage = () => {
  // Stores
  const { theme } = useThemeStore();

  // Transitions
  const [_isPending, startTransition] = useTransition();

  // States
  const [tickets, setTickets] = useState<TicketItem[]>(DUMMY_TICKETS);
  const [rawSearch, setRawSearch] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  // Derived Values: Filtered Tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const lowerSearch = search.trim().toLowerCase();
      return (
        !lowerSearch ||
        t.title.toLowerCase().includes(lowerSearch) ||
        t.description.toLowerCase().includes(lowerSearch) ||
        t.user?.name?.toLowerCase().includes(lowerSearch)
      );
    });
  }, [tickets, search]);

  // Derived Values: Statistics matching GET /api/tickets/statistics schema
  const statistics = useMemo<TicketStatistics>(() => {
    const activeCount = tickets.filter(
      (t) => t.status === "open" || t.status === "in_progress",
    ).length;
    const resolvedCount = tickets.filter((t) => t.status === "resolved").length;
    const openCount = tickets.filter((t) => t.status === "open").length;
    const inProgressCount = tickets.filter(
      (t) => t.status === "in_progress",
    ).length;
    const closedCount = tickets.filter(
      (t) => t.status === "closed" || t.status === "resolved",
    ).length;

    return {
      totalTickets: tickets.length || DUMMY_TICKET_STATISTICS.totalTickets,
      activeTickets: activeCount || DUMMY_TICKET_STATISTICS.activeTickets,
      resolvedTickets: resolvedCount || DUMMY_TICKET_STATISTICS.resolvedTickets,
      breakdown: {
        open: openCount,
        inProgress: inProgressCount,
        closed: closedCount,
      },
    };
  }, [tickets]);

  // Handlers
  const handleSearchChange = (val: string) => {
    setRawSearch(val);
    startTransition(() => {
      setSearch(val);
    });
  };

  const handleCreateTicketSubmit = (title: string, description: string) => {
    const nowIso = new Date().toISOString();
    const newTicket: TicketItem = {
      id: Date.now(),
      userId: 1,
      title,
      description,
      status: "open",
      attachments: [],
      createdAt: nowIso,
      updatedAt: nowIso,
      user: {
        id: 1,
        name: "Mitra User Demo",
        email: "mitra@demo.com",
        role: "mitra",
      },
      responses: [],
    };
    setTickets((prev) => [newTicket, ...prev]);
  };

  return (
    <PanelContentContainer overflowY={"auto"} gap={PADDING.sm} p={PADDING.sm}>
      <Container.Root flex={1} overflowY={"auto"} withContext={true}>
        <Container.Body flex={1} overflowY={"auto"}>
          {/* Header Title */}
          <AppNavTitle navsMap={APP_NAVS_MAP} />

          <Separator borderColor={"bg.canvas"} />

          {/* Summary Section */}
          <VStack overflowY={"auto"}>
            <SupportTicketSummary statistics={statistics} />

            <Separator borderColor={"bg.canvas"} />

            {/* Action Bar */}
            <HStack
              justify={"space-between"}
              align={"center"}
              gap={SPACING.sm}
              p={PADDING.md}
            >
              <SearchInput
                placeholder={"Cari sesuatu... ⌘K"}
                value={rawSearch}
                onValueChange={handleSearchChange}
                maxW={"280px"}
              />

              <Button primary>
                <AppIcon icon={PlusIcon} />
                {"Buat Laporan"}
              </Button>
            </HStack>

            <Separator borderColor={"bg.canvas"} />

            {/* Ticket Stream */}
            {filteredTickets.length === 0 ? (
              <NoDataState
                icon={InboxIcon}
                title={"Belum Ada Laporan"}
                description={
                  search
                    ? "Tidak ditemukan laporan sesuai kata kunci pencarian Anda."
                    : "Belum ada laporan yang diajukan."
                }
              />
            ) : (
              <VStack
                gap={PADDING.sm}
                align={"stretch"}
                overflowY={"auto"}
                w={"full"}
                bg={"bg.canvas"}
              >
                {filteredTickets.map((ticket, index) => {
                  const isLastIndex = index === filteredTickets.length - 1;
                  return (
                    <SupportTicketItem
                      key={ticket.id}
                      ticket={ticket}
                      roundedBottom={isLastIndex ? theme.radii.container : 0}
                    />
                  );
                })}
              </VStack>
            )}
          </VStack>
        </Container.Body>
      </Container.Root>

      {/* Create Ticket Modal */}
      <CreateTicketModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmitTicket={handleCreateTicketSubmit}
      />
    </PanelContentContainer>
  );
};
