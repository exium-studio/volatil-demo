// src/features/mitra/help-center/pages/help-center.page.tsx

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
import { CreateHelpCenterTrigger } from "@/features/mitra/help-center/components/help-center.create";
import { HelpCenterItem } from "@/features/mitra/help-center/components/help-center.item";
import { HelpCenterSummary } from "@/features/mitra/help-center/components/help-center.summary";
import { DUMMY_HELP_CENTER_STATISTICS } from "@/features/mitra/help-center/constants/dummy-help-center";
import { helpCenterService } from "@/features/mitra/help-center/services/help-center.service";
import type {
  HelpCenterItem as HelpCenterItemType,
  HelpCenterStatistics,
} from "@/features/mitra/help-center/types/help-center.type";
import { APP_NAVS_MAP } from "@/shared/constants/app.navs";
import { InboxIcon, PlusIcon } from "lucide-react";
import { useEffect, useMemo, useState, useTransition } from "react";

export const HelpCenterPage = () => {
  // Stores
  const { theme } = useThemeStore();

  // Transitions
  const [_isPending, startTransition] = useTransition();

  // States
  const [tickets, setTickets] = useState<HelpCenterItemType[]>([]);
  const [statistics, setStatistics] = useState<HelpCenterStatistics>(
    DUMMY_HELP_CENTER_STATISTICS,
  );
  const [rawSearch, setRawSearch] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  // Effects: Fetch initial tickets & statistics from service
  useEffect(() => {
    let isCancelled = false;

    const fetchData = async () => {
      try {
        const [ticketsRes, statsRes] = await Promise.all([
          helpCenterService.getTickets(),
          helpCenterService.getStatistics(),
        ]);

        if (!isCancelled) {
          setTickets(ticketsRes.data);
          setStatistics(statsRes);
        }
      } catch (error) {
        console.warn("Failed to fetch tickets from service:", error);
      }
    };

    fetchData();

    return () => {
      isCancelled = true;
    };
  }, []);

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

  // Handlers
  const handleSearchChange = (val: string) => {
    setRawSearch(val);
    startTransition(() => {
      setSearch(val);
    });
  };

  const handleCreateTicketSubmit = async (
    title: string,
    description: string,
    files?: File[],
  ) => {
    const createdTicket = await helpCenterService.createTicket({
      title,
      description,
      files,
    });

    setTickets((prev) => [createdTicket, ...prev]);

    // Refresh statistics
    const updatedStats = await helpCenterService.getStatistics();
    setStatistics(updatedStats);
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
            <HelpCenterSummary statistics={statistics} />

            <Separator borderColor={"bg.canvas"} />

            {/* Action Bar */}
            <HStack
              justify={"space-between"}
              align={"center"}
              gap={SPACING.sm}
              p={PADDING.md}
            >
              <SearchInput
                placeholder={"Cari..."}
                value={rawSearch}
                onValueChange={handleSearchChange}
                maxW={"280px"}
              />

              <CreateHelpCenterTrigger
                onSubmitTicket={handleCreateTicketSubmit}
              >
                <Button primary={true}>
                  <AppIcon icon={PlusIcon} />
                  {"Buat Laporan"}
                </Button>
              </CreateHelpCenterTrigger>
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
                    <HelpCenterItem
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
    </PanelContentContainer>
  );
};
