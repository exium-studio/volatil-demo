// src/design-system/components/toast/ui/notification-center.tsx

import { X } from "lucide-react";
import { useToastHistory } from "@/design-system/components/toast/hooks/use-toast-history";
import type { HistoryEntry } from "@/design-system/components/toast/types/toast.types";
import { ToastStack } from "@/design-system/components/toast/ui/toast.stack";
import { getToastConfig } from "@/design-system/components/toast/core/toast.config";
import { P } from "@/design-system/components/typography/ui/p";
import { Box } from "@/design-system/components/layout/ui/box";
import { Button } from "@/design-system/components/button/ui/button";
import { VStack } from "@/design-system/components/layout/ui/flex-box";

function ToastHistoryItem({
  entry,
  onDelete,
}: {
  entry: HistoryEntry;
  onDelete: (id: string) => void;
}) {
  return (
    <Box
      borderWidth={"1px"}
      borderRadius={"md"}
      p={2}
      bg={entry.read ? "bg.subtle" : "bg.panel"}
      pos={"relative"}
    >
      <Box display={"flex"} justifyContent={"space-between"} gap={2}>
        <VStack flex={"1"}>
          {entry.title ? (
            <P fontSize={"sm"} fontWeight={"medium"}>
              {entry.title}
            </P>
          ) : null}
          {entry.description ? (
            <P fontSize={"sm"} color={"fg.muted"}>
              {entry.description}
            </P>
          ) : null}
          <P fontSize={"xs"} color={"fg.muted"} mt={1}>
            {`v${entry.version}${entry.isUpdate ? " · updated" : ""}${
              entry.dismissedReason ? ` · ${entry.dismissedReason}` : ""
            }`}
          </P>
        </VStack>

        <Box
          as={"button"}
          aria-label={"Delete from history"}
          onClick={(event: React.MouseEvent) => {
            event.stopPropagation();
            onDelete(entry.historyEntryId);
          }}
        >
          <X size={14} />
        </Box>
      </Box>
    </Box>
  );
}

export function NotificationCenter() {
  const { groups, deleteOne, deleteMany, markAllRead } = useToastHistory();
  const { maxVisiblePerGroup } = getToastConfig();

  if (groups.length === 0) {
    return (
      <P fontSize={"sm"} color={"fg.muted"}>
        {"No notifications yet"}
      </P>
    );
  }

  return (
    <Box display={"flex"} flexDirection={"column"} gap={4}>
      <Box display={"flex"} justifyContent={"flex-end"}>
        <Button size={"2xs"} variant={"ghost"} onClick={markAllRead}>
          {"Mark all as read"}
        </Button>
      </Box>

      {groups.map(({ group, entries }) => (
        <ToastStack
          key={group}
          groupLabel={group}
          items={entries}
          getId={(entry) => entry.historyEntryId}
          maxVisible={maxVisiblePerGroup}
          renderItem={(entry) => (
            <ToastHistoryItem entry={entry.item} onDelete={deleteOne} />
          )}
          onCloseAll={() =>
            deleteMany(entries.map((entry) => entry.historyEntryId))
          }
        />
      ))}
    </Box>
  );
}
