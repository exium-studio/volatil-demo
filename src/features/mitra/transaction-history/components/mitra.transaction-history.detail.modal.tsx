// src/features/mitra/transaction-history/components/mitra.transaction-history.detail.modal.tsx

import {
  TransactionDetailModalContent as SharedTransactionDetailModalContent,
  TransactionDetailTrigger as SharedTransactionDetailTrigger,
} from "@/features/shared/components/transaction-detail.modal";
import type {
  TransactionDetailModalContentProps,
  TransactionDetailTriggerProps,
} from "@/features/mitra/transaction-history/types/transaction-history.modal.type";

export const TransactionDetailTrigger = (
  props: TransactionDetailTriggerProps,
) => {
  // Props
  const { modalKey, transaction, children } = props;

  return (
    <SharedTransactionDetailTrigger
      modalKey={modalKey}
      transaction={transaction}
      showPayButton={true}
    >
      {children}
    </SharedTransactionDetailTrigger>
  );
};

export const TransactionDetailModalContent = (
  props: TransactionDetailModalContentProps,
) => {
  // Props
  const { transaction } = props;

  return (
    <SharedTransactionDetailModalContent
      transaction={transaction}
      showPayButton={true}
    />
  );
};
