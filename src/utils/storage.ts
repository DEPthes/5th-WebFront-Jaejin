import type { Transaction } from "../types/transaction";
const STORAGE_KEY = "balance-note-transactions";

export const readTransactions = (): Transaction[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === null) return [];
    return JSON.parse(saved) as Transaction[];
  } catch {
    return [];
  }
};

export const writeTransactions = (transactions: Transaction[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
};
