import { useCallback, useEffect, useMemo, useState } from "react";
import type { Transaction, TransactionInput } from "../types/transaction";
import { readTransactions, writeTransactions } from "../utils/storage";
import { isCurrentMonth } from "../utils/format";

export const useTransactions = () => {
  const [transactions, setTransactions] =
    useState<Transaction[]>(readTransactions);
  const [isLoading, setIsLoading] = useState(true);

  const update = useCallback(
    (updater: (current: Transaction[]) => Transaction[]) => {
      setTransactions((current) => {
        const next = updater(current);
        writeTransactions(next);
        window.dispatchEvent(new Event("balance-note-transactions-updated"));
        return next;
      });
    },
    [],
  );

  useEffect(() => {
    const syncTransactions = () => setTransactions(readTransactions());
    const loadingTimer = window.setTimeout(() => setIsLoading(false), 300);

    window.addEventListener(
      "balance-note-transactions-updated",
      syncTransactions,
    );
    return () => {
      window.clearTimeout(loadingTimer);
      window.removeEventListener(
        "balance-note-transactions-updated",
        syncTransactions,
      );
    };
  }, []);

  const addTransaction = useCallback(
    (input: TransactionInput) => {
      const transaction: Transaction = {
        ...input,
        id: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
        createdAt: new Date().toISOString(),
      };
      update((current) => [transaction, ...current]);
      return transaction;
    },
    [update],
  );

  const editTransaction = useCallback(
    (id: string, input: TransactionInput) => {
      update((current) =>
        current.map((transaction) =>
          transaction.id === id ? { ...transaction, ...input } : transaction,
        ),
      );
    },
    [update],
  );

  const deleteTransaction = useCallback(
    (id: string) => {
      update((current) =>
        current.filter((transaction) => transaction.id !== id),
      );
    },
    [update],
  );

  const monthlyTransactions = useMemo(
    () =>
      transactions.filter((transaction) => isCurrentMonth(transaction.date)),
    [transactions],
  );
  const summary = useMemo(() => {
    const income = monthlyTransactions
      .filter((transaction) => transaction.type === "income")
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    const expense = monthlyTransactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    const balance = transactions.reduce(
      (sum, transaction) =>
        sum +
        (transaction.type === "income"
          ? transaction.amount
          : -transaction.amount),
      0,
    );
    return { income, expense, balance };
  }, [monthlyTransactions, transactions]);

  return {
    transactions,
    isLoading,
    monthlyTransactions,
    summary,
    addTransaction,
    editTransaction,
    deleteTransaction,
  };
};
