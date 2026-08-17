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
  DUMMY_TICKET_METRICS,
} from "@/features/mitra/support-ticket/constants/dummy-tickets";
import type { TicketItem } from "@/features/mitra/support-ticket/types/support-ticket.type";
import { APP_NAVS_MAP } from "@/shared/constants/app.navs";
import { isEmptyArray } from "@/shared/utils/data/array";
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

  // Derived Values: User Tickets Filtered by Search
  const userTickets = useMemo(() => {
    return tickets.filter((t) => {
      const lowerSearch = search.trim().toLowerCase();
      return (
        !lowerSearch ||
        t.title.toLowerCase().includes(lowerSearch) ||
        t.description.toLowerCase().includes(lowerSearch) ||
        t.authorName.toLowerCase().includes(lowerSearch)
      );
    });
  }, [tickets, search]);

  // Derived Values: Summary Metrics
  const metrics = useMemo(() => {
    const activeCount = tickets.filter(
      (t) => t.status === "active" || t.status === "pending",
    ).length;
    const resolvedCount = tickets.filter((t) => t.status === "resolved").length;
    return {
      activeCount: activeCount || DUMMY_TICKET_METRICS.activeCount,
      resolvedCount: resolvedCount || DUMMY_TICKET_METRICS.resolvedCount,
      totalCount: tickets.length || DUMMY_TICKET_METRICS.totalCount,
    };
  }, [tickets]);

  // Handlers
  const handleSearchChange = (val: string) => {
    setRawSearch(val);
    startTransition(() => {
      setSearch(val);
    });
  };

  const handleCreateTicketSubmit = (
    newTicketData: Omit<
      TicketItem,
      "id" | "createdAt" | "status" | "upvotesCount"
    >,
  ) => {
    const newTicket: TicketItem = {
      ...newTicketData,
      id: `ticket-${Date.now()}`,
      createdAt: "Hari ini",
      status: "active",
      upvotesCount: 0,
      isUpvoted: false,
      replies: [],
    };
    setTickets((prev) => [newTicket, ...prev]);
  };

  return (
    <PanelContentContainer overflowY={"auto"} gap={PADDING.sm} p={PADDING.sm}>
      <Container.Root flex={1} overflowY={"auto"} withContext={true}>
        <Container.Body flex={1} overflowY={"auto"}>
          {/* Header Container with Wording Greeting */}
          <AppNavTitle navsMap={APP_NAVS_MAP} />

          <Separator borderColor={"bg.canvas"} />

          <VStack align={"stretch"} overflowY={"auto"}>
            <SupportTicketSummary metrics={metrics} />

            <Separator borderColor={"bg.canvas"} />

            {/* Action Bar (Search & Create Ticket Button) */}
            <HStack
              justify={"space-between"}
              align={"center"}
              gap={SPACING.sm}
              w={"full"}
              p={PADDING.md}
            >
              <SearchInput
                placeholder={"Cari sesuatu... ⌘K"}
                value={rawSearch}
                onValueChange={handleSearchChange}
                maxW={"280px"}
              />

              <Button
                colorPalette={theme.colorPalette}
                onClick={() => setIsCreateModalOpen(true)}
              >
                <AppIcon icon={PlusIcon} />
                {"Buat Laporan"}
              </Button>
            </HStack>

            <Separator borderColor={"bg.canvas"} />

            {/* User Ticket List */}
            {isEmptyArray(userTickets) && (
              <NoDataState
                icon={InboxIcon}
                title={"Belum Ada Laporan"}
                description={
                  search
                    ? "Tidak ditemukan laporan sesuai kata kunci pencarian Anda."
                    : "Belum ada laporan yang Anda ajukan."
                }
              />
            )}

            {!isEmptyArray(userTickets) && (
              <VStack gap={SPACING.xs} overflowY={"auto"} bg={"bg.canvas"}>
                {userTickets.map((ticket, index) => {
                  const isLastIndex = index === userTickets.length - 1;

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

      {/* Modal Dialog to Create New Ticket */}
      <CreateTicketModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmitTicket={handleCreateTicketSubmit}
      />
    </PanelContentContainer>
  );
};
