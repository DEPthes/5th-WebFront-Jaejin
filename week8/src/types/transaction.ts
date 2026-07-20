export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  title: string;
  date: string;
  memo: string;
  createdAt: string;
}

export type TransactionInput = Omit<Transaction, "id" | "createdAt">;
