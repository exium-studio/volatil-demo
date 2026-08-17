// src/features/notification/components/notification.item.tsx

import { getToastConfig } from "@/design-system/components/toast/core/toast.config";
import type { ToastRecord } from "@/design-system/components/toast/types/toast.types";
import { ToastItem } from "@/design-system/components/toast/ui/toast.item";
import { ToastStack } from "@/design-system/components/toast/ui/toast.stack";
import type { NotificationCategoryGroup } from "@/features/notification/types/notification.type";
import { memo } from "react";

export type NotificationGroupStackCardProps = {
  group: NotificationCategoryGroup;
  onDeleteGroup?: (records: ToastRecord[]) => void;
  onDeleteNotification?: (id: string) => void;
};

export const NotificationGroupStackCard = memo(
  (props: NotificationGroupStackCardProps) => {
    // Props
    const { group, onDeleteGroup, onDeleteNotification } = props;

    // Config
    const { maxVisiblePerGroup } = getToastConfig();

    return (
      <ToastStack
        groupLabel={group.groupName}
        items={group.records}
        getId={(record) => record.id}
        maxVisible={maxVisiblePerGroup}
        onCloseAll={
          onDeleteGroup ? () => onDeleteGroup(group.records) : undefined
        }
        renderItem={({ item, index, stackExpanded, setStackExpanded }) => (
          <ToastItem
            record={item}
            index={index}
            stackExpanded={stackExpanded}
            onRequestExpand={() => setStackExpanded?.(true)}
            onClose={
              onDeleteNotification
                ? (rec) => onDeleteNotification(rec.id)
                : undefined
            }
          />
        )}
      />
    );
  },
);
