import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Transaction } from "../types/transaction";

interface TransactionModalContextValue {
  isOpen: boolean;
  editingTransaction: Transaction | null;
  openTransactionModal: (transaction?: Transaction) => void;
  closeTransactionModal: () => void;
}

const TransactionModalContext =
  createContext<TransactionModalContextValue | null>(null);

export function TransactionModalProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const openTransactionModal = useCallback((transaction?: Transaction) => {
    setEditingTransaction(transaction ?? null);
    setIsOpen(true);
  }, []);
  const closeTransactionModal = useCallback(() => {
    setIsOpen(false);
    setEditingTransaction(null);
  }, []);
  const value = useMemo(
    () => ({
      isOpen,
      editingTransaction,
      openTransactionModal,
      closeTransactionModal,
    }),
    [isOpen, editingTransaction, openTransactionModal, closeTransactionModal],
  );

  return (
    <TransactionModalContext.Provider value={value}>
      {children}
    </TransactionModalContext.Provider>
  );
}

export function useTransactionModal() {
  const context = useContext(TransactionModalContext);
  if (!context) {
    throw new Error("여기서는 거래내역을 추가하실 수 없습니다.");
  }
  return context;
}
