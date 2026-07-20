import { ArrowDownRight, ArrowUpRight, Equal } from "lucide-react";
import { useState, type MouseEvent } from "react";
import { ExpenseDonut } from "../components/transaction/ExpenseDonut";
import { EmptyState } from "../components/transaction/EmptyState";
import { useTransactions } from "../hooks/useTransactions";
import {
  formatMoney,
  getCurrentMonthKey,
  getMonthLabel,
  getRecentMonths,
} from "../utils/format";
import { getCategoryTotals } from "../utils/transactions";

interface ChartTooltip {
  label: string;
  type: "income" | "expense";
  amount: number;
  x: number;
  y: number;
}

export function StatisticsPage() {
  const { transactions } = useTransactions();
  const [tooltip, setTooltip] = useState<ChartTooltip | null>(null);
  const currentMonth = getCurrentMonthKey();
  const expenses = transactions.filter((item) => item.type === "expense");
  const monthExpense = expenses.filter((item) =>
    item.date.startsWith(currentMonth),
  );
  const categoryData = getCategoryTotals(monthExpense);
  const months = getRecentMonths(3);
  const monthlyData = months.map((month) => ({
    ...month,
    income: transactions
      .filter(
        (item) => item.type === "income" && item.date.startsWith(month.key),
      )
      .reduce((sum, item) => sum + item.amount, 0),
    expense: transactions
      .filter(
        (item) => item.type === "expense" && item.date.startsWith(month.key),
      )
      .reduce((sum, item) => sum + item.amount, 0),
  }));
  const chartMaximum = Math.max(
    ...monthlyData.flatMap((month) => [month.income, month.expense]),
    1,
  );
  const currentMonthData = monthlyData[monthlyData.length - 1];
  const previousMonthData = monthlyData[monthlyData.length - 2];
  const comparisonItems = [
    {
      key: "income",
      label: "수입",
      current: currentMonthData.income,
      previous: previousMonthData.income,
      colorClass: "income-comparison",
    },
    {
      key: "expense",
      label: "지출",
      current: currentMonthData.expense,
      previous: previousMonthData.expense,
      colorClass: "expense-comparison",
    },
  ] as const;
  const showTooltip = (
    event: MouseEvent<HTMLDivElement>,
    label: string,
    type: "income" | "expense",
    amount: number,
  ) => {
    setTooltip({
      label,
      type,
      amount,
      x: event.clientX + 14,
      y: event.clientY + 14,
    });
  };
  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <h1>소비 통계</h1>
        </div>
      </div>
      {!transactions.length ? (
        <div className="content-card">
          <EmptyState title="분석할 거래가 없어요" />
        </div>
      ) : (
        <div className="stats-grid">
          <div className="content-card spending-card">
            <h2>월별 수입·지출</h2>
            <div className="bar-chart-legend" aria-label="그래프 범례">
              <span>
                <i className="income-bar-dot" />
                수입
              </span>
              <span>
                <i className="expense-bar-dot" />
                지출
              </span>
            </div>
            <div className="bar-chart">
              {monthlyData.map((month, index) => (
                <div className="bar-column" key={month.key}>
                  <div className="bar-pair">
                    <div
                      className="bar income-bar animated-bar"
                      style={{
                        height: month.income
                          ? `${(month.income / chartMaximum) * 100}%`
                          : 0,
                        animationDelay: `${index * 110}ms`,
                      }}
                      role="img"
                      aria-label={`${month.label} 수입 ${formatMoney(month.income)}`}
                      onMouseEnter={(event) =>
                        showTooltip(event, month.label, "income", month.income)
                      }
                      onMouseMove={(event) =>
                        showTooltip(event, month.label, "income", month.income)
                      }
                      onMouseLeave={() => setTooltip(null)}
                    />
                    <div
                      className="bar expense-bar animated-bar"
                      style={{
                        height: month.expense
                          ? `${(month.expense / chartMaximum) * 100}%`
                          : 0,
                        animationDelay: `${index * 110 + 70}ms`,
                      }}
                      role="img"
                      aria-label={`${month.label} 지출 ${formatMoney(month.expense)}`}
                      onMouseEnter={(event) =>
                        showTooltip(
                          event,
                          month.label,
                          "expense",
                          month.expense,
                        )
                      }
                      onMouseMove={(event) =>
                        showTooltip(
                          event,
                          month.label,
                          "expense",
                          month.expense,
                        )
                      }
                      onMouseLeave={() => setTooltip(null)}
                    />
                  </div>
                  <span>{month.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="content-card statistics-donut-card">
            <div className="section-title">
              <h2>이번 달 소비 비중</h2>
              <span className="text-link">{getMonthLabel()}</span>
            </div>
            <ExpenseDonut data={categoryData} animate interactive />
          </div>
          <section className="content-card month-comparison-card">
            <div className="comparison-heading">
              <div>
                <h2>지난 달과 비교</h2>
                <p>
                  {previousMonthData.label}과 {currentMonthData.label}의
                  수입·지출 흐름이에요.
                </p>
              </div>
            </div>
            <div className="comparison-list">
              {comparisonItems.map((item) => {
                const difference = item.current - item.previous;
                const isIncrease = difference > 0;
                const TrendIcon =
                  difference === 0
                    ? Equal
                    : isIncrease
                      ? ArrowUpRight
                      : ArrowDownRight;
                const changeRate = item.previous
                  ? Math.round((Math.abs(difference) / item.previous) * 100)
                  : null;
                const trendClass =
                  difference === 0
                    ? "same"
                    : item.key === "income"
                      ? isIncrease
                        ? "favorable"
                        : "unfavorable"
                      : isIncrease
                        ? "unfavorable"
                        : "favorable";

                return (
                  <article
                    className={`comparison-item ${item.colorClass}`}
                    key={item.key}
                  >
                    <div className="comparison-label">
                      <span className="comparison-dot" />
                      {item.label}
                    </div>
                    <div className="comparison-values">
                      <div>
                        <span>지난 달</span>
                        <strong>{formatMoney(item.previous)}</strong>
                      </div>
                      <div>
                        <span>이번 달</span>
                        <strong>{formatMoney(item.current)}</strong>
                      </div>
                    </div>
                    <p className={`comparison-trend ${trendClass}`}>
                      <TrendIcon size={15} />
                      {difference === 0 ? (
                        "지난달과 같아요"
                      ) : (
                        <>
                          지난달보다 {formatMoney(Math.abs(difference))}{" "}
                          {isIncrease ? "증가" : "감소"}
                          {changeRate !== null && ` (${changeRate}%)`}
                        </>
                      )}
                    </p>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      )}
      {tooltip && (
        <div
          className="chart-tooltip"
          style={{ left: tooltip.x, top: tooltip.y }}
          role="status"
        >
          <span>
            {tooltip.label} {tooltip.type === "income" ? "수입" : "지출"}
          </span>
          <strong
            className={
              tooltip.type === "income" ? "income-text" : "expense-text"
            }
          >
            {formatMoney(tooltip.amount)}
          </strong>
        </div>
      )}
    </section>
  );
}
