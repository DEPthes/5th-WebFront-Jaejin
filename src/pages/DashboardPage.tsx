import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ExpenseDonut } from "../components/transaction/ExpenseDonut";
import { EmptyState } from "../components/transaction/EmptyState";
import { TransactionItem } from "../components/transaction/TransactionItem";
import { TransactionSkeleton } from "../components/transaction/TransactionSkeleton";
import { useTransactions } from "../hooks/useTransactions";
import { useCountUp } from "../hooks/useCountUp";
import { formatMoney, getMonthLabel } from "../utils/format";
import {
  getCategoryTotals,
  sortTransactionsByDate,
} from "../utils/transactions";

export function DashboardPage() {
  const { monthlyTransactions, summary, transactions, isLoading } =
    useTransactions();
  const animatedBalance = useCountUp(summary.balance);
  const animatedIncome = useCountUp(summary.income);
  const animatedExpense = useCountUp(summary.expense);
  const recentTransactions = sortTransactionsByDate(transactions).slice(0, 5);
  const incomeByCategory = getCategoryTotals(monthlyTransactions, "income");
  const expenseByCategory = getCategoryTotals(monthlyTransactions, "expense");

  return (
    <section className="page">
      <div className="welcome-row">
        <div>
          <h1>가계부</h1>
        </div>
      </div>

      <div className="balance-card">
        <p>{getMonthLabel()} 장부 · 현재 잔액</p>
        <h2>{formatMoney(animatedBalance)}</h2>
        <div className="balance-stats">
          <div>
            <span>{getMonthLabel()} 수입</span>
            <strong>+ {formatMoney(animatedIncome)}</strong>
          </div>
          <div>
            <span>{getMonthLabel()} 지출</span>
            <strong>− {formatMoney(animatedExpense)}</strong>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="content-card">
          <div className="section-title">
            <h2>최근 거래 내역</h2>
            <Link className="text-link" to="/transactions">
              전체보기 <ArrowRight size={14} />
            </Link>
          </div>
          {isLoading ? (
            <TransactionSkeleton compact />
          ) : recentTransactions.length ? (
            <div className="transaction-list">
              {recentTransactions.map((transaction) => (
                <TransactionItem
                  transaction={transaction}
                  compact
                  key={transaction.id}
                />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </section>

        <section className="content-card category-summary-card">
          <div className="section-title">
            <h2>카테고리별 수입·지출</h2>
            <span className="text-link">{getMonthLabel()}</span>
          </div>
          <div className="category-donut-section">
            <h3 className="income-text">수입</h3>
            <ExpenseDonut
              data={incomeByCategory}
              label="이번 달 수입"
              compact
              animate
            />
          </div>
          <div className="category-donut-section">
            <h3 className="expense-text">지출</h3>
            <ExpenseDonut
              data={expenseByCategory}
              label="이번 달 지출"
              compact
              animate
            />
          </div>
        </section>
      </div>
    </section>
  );
}
