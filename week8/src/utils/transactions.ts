import type { Transaction, TransactionType } from "../types/transaction";

export type TransactionSortOrder = "asc" | "desc";

export interface CategoryTotal {
  category: string;
  amount: number;
}

export const sortTransactionsByDate = (
  transactions: Transaction[],
  order: TransactionSortOrder = "desc",
) =>
  [...transactions].sort((a, b) => {
    const comparison =
      a.date.localeCompare(b.date) || a.createdAt.localeCompare(b.createdAt);

    return order === "desc" ? -comparison : comparison;
  });

export const getCategoryTotals = (
  transactions: Transaction[],
  type?: TransactionType,
): CategoryTotal[] => {
  const totals = transactions.reduce<Record<string, number>>(
    (result, transaction) => {
      if (type && transaction.type !== type) return result;

      result[transaction.category] =
        (result[transaction.category] ?? 0) + transaction.amount;
      return result;
    },
    {},
  );

  return Object.entries(totals)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
};
