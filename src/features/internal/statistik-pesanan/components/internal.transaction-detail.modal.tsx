// src/features/internal/statistik-pesanan/components/internal.transaction-detail.modal.tsx

import {
  TransactionDetailModalContent as SharedTransactionDetailModalContent,
  TransactionDetailTrigger as SharedTransactionDetailTrigger,
} from "@/features/shared/components/transaction-detail.modal";
import type {
  InternalTransactionDetailModalContentProps,
  InternalTransactionDetailTriggerProps,
} from "@/features/internal/statistik-pesanan/types/internal.transaction-detail-modal.type";

export const InternalTransactionDetailTrigger = (
  props: InternalTransactionDetailTriggerProps,
) => {
  // Props
  const { modalKey, transaction, children } = props;

  return (
    <SharedTransactionDetailTrigger
      modalKey={modalKey}
      transaction={transaction}
      showPayButton={false}
    >
      {children}
    </SharedTransactionDetailTrigger>
  );
};

export const InternalTransactionDetailModalContent = (
  props: InternalTransactionDetailModalContentProps,
) => {
  // Props
  const { transaction } = props;

  return (
    <SharedTransactionDetailModalContent
      transaction={transaction}
      showPayButton={false}
    />
  );
};
