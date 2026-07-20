import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Search } from "lucide-react";
import { ConfirmModal } from "../components/transaction/ConfirmModal";
import { EmptyState } from "../components/transaction/EmptyState";
import { TransactionItem } from "../components/transaction/TransactionItem";
import { TransactionSkeleton } from "../components/transaction/TransactionSkeleton";
import { useTransactions } from "../hooks/useTransactions";
import { useTransactionModal } from "../hooks/useTransactionModal";
import type { Transaction, TransactionType } from "../types/transaction";
import {
  sortTransactionsByDate,
  type TransactionSortOrder,
} from "../utils/transactions";

type Filter = "all" | TransactionType;
type DateOrder = TransactionSortOrder;

export function TransactionsPage() {
  const { transactions, deleteTransaction, isLoading } = useTransactions();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [dateOrder, setDateOrder] = useState<DateOrder>("desc");
  const [pendingDelete, setPendingDelete] = useState<Transaction | null>(null);
  const { openTransactionModal } = useTransactionModal();
  const filtered = useMemo(
    () =>
      sortTransactionsByDate(
        transactions
          .filter((item) => filter === "all" || item.type === filter)
          .filter((item) =>
            `${item.title} ${item.category} ${item.memo}`
              .toLowerCase()
              .includes(query.trim().toLowerCase()),
          ),
        dateOrder,
      ),
    [transactions, filter, query, dateOrder],
  );

  const confirmDelete = () => {
    if (pendingDelete) deleteTransaction(pendingDelete.id);
    setPendingDelete(null);
  };
  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <h1>전체 거래 내역</h1>
        </div>
      </div>
      <div className="filter-panel">
        <div className="tabs" aria-label="거래 유형 필터">
          {(
            [
              ["all", "전체"],
              ["income", "수입"],
              ["expense", "지출"],
            ] as [Filter, string][]
          ).map(([value, label]) => (
            <button
              key={value}
              className={`${filter === value ? "active" : ""} ${value === "income" ? "income-tab" : value === "expense" ? "expense-tab" : ""}`}
              onClick={() => setFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="search-box">
          <Search size={16} aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="제목이나 카테고리로 검색"
            aria-label="거래 검색"
          />
        </label>
      </div>
      <div className="content-card full-list">
        <div className="list-head">
          <span>총 {filtered.length}건</span>
          <button
            type="button"
            className="list-sort-button"
            onClick={() =>
              setDateOrder((current) => (current === "desc" ? "asc" : "desc"))
            }
            aria-label={`날짜 ${dateOrder === "desc" ? "오래된순" : "최신순"}으로 정렬`}
          >
            날짜 {dateOrder === "desc" ? "최신순" : "오래된순"}
            {dateOrder === "desc" ? (
              <ArrowDown size={14} aria-hidden="true" />
            ) : (
              <ArrowUp size={14} aria-hidden="true" />
            )}
          </button>
        </div>
        {isLoading ? (
          <TransactionSkeleton />
        ) : filtered.length ? (
          <div className="transaction-list">
            {filtered.map((item) => (
              <TransactionItem
                key={item.id}
                transaction={item}
                onEdit={(transaction) => openTransactionModal(transaction)}
                onDelete={setPendingDelete}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="조건에 맞는 거래가 없어요"
            description="다른 검색어 또는 필터를 선택해 보세요."
          />
        )}
      </div>
      <ConfirmModal
        open={Boolean(pendingDelete)}
        title={pendingDelete?.title ?? ""}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </section>
  );
}
