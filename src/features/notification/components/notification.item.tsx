// src/features/notification/components/notification.item.tsx

import { getToastConfig } from "@/design-system/components/toast/core/toast.config";
import type { ToastItemData } from "@/design-system/components/toast/types/toast.type";
import { ToastItem } from "@/design-system/components/toast/ui/toast.item";
import { ToastStack } from "@/design-system/components/toast/ui/toast.stack";
import type { NotificationCategoryGroup } from "@/features/notification/types/notification.type";
import { memo } from "react";

type NotificationGroupStackCardProps = {
  group: NotificationCategoryGroup;
  onDeleteGroup?: (toasts: ToastItemData[]) => void;
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
        items={group.toasts}
        getId={(toastItem) => toastItem.id}
        maxVisible={maxVisiblePerGroup}
        onCloseAll={
          onDeleteGroup ? () => onDeleteGroup(group.toasts) : undefined
        }
        renderItem={({ item, index, stackExpanded, setStackExpanded }) => (
          <ToastItem
            toast={item}
            index={index}
            stackExpanded={stackExpanded}
            showTimestamp={true}
            onRequestExpand={() => setStackExpanded?.(true)}
            onClose={
              onDeleteNotification
                ? (t) => onDeleteNotification(t.id)
                : undefined
            }
          />
        )}
      />
    );
  },
);
