// src/features/mitra/transaction-history/components/transaction-history.detail-modal.tsx

import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { TransactionDetailModalContent } from "@/features/mitra/transaction-history/components/transaction-history.detail-modal-content";
import type { TransactionDetailTriggerProps } from "@/features/mitra/transaction-history/types/transaction-history.modal.type";

export const TransactionDetailTrigger = (
  props: TransactionDetailTriggerProps,
) => {
  // Props
  const { modalKey: customModalKey = "transaction-detail", transaction, children } = props;

  // Stores & Hooks
  const { modalKey, isOpen, open, close } = usePopModal({
    modalKey: customModalKey,
  });

  return (
    <Modal.Root
      modalKey={modalKey}
      opened={isOpen}
      open={open}
      close={close}
      size={"lg"}
    >
      <Modal.Trigger>{children}</Modal.Trigger>

      {transaction && (
        <TransactionDetailModalContent
          transaction={transaction}
          close={close}
        />
      )}
    </Modal.Root>
  );
};
