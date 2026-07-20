import { useState, type MouseEvent } from "react";
import { formatMoney } from "../../utils/format";
import { useCountUp } from "../../hooks/useCountUp";

interface Props {
  data: { category: string; amount: number }[];
  animate?: boolean;
  label?: string;
  compact?: boolean;
  interactive?: boolean;
}
const colors = [
  "#2f6b4f",
  "#6fa07f",
  "#af3c31",
  "#d98b7f",
  "#b08d3f",
  "#7a8b9c",
];

export function ExpenseDonut({
  data,
  animate = false,
  label = "이번 달 지출",
  compact = false,
  interactive = false,
}: Props) {
  const total = data.reduce((sum, item) => sum + item.amount, 0);
  const animatedTotal = useCountUp(total, 1_050, animate);
  const [tooltip, setTooltip] = useState<{
    category: string;
    amount: number;
    x: number;
    y: number;
  } | null>(null);
  if (!total)
    return (
      <div className="chart-layout">
        <p className="chart-empty">
          {label}을 기록하면
          <br />
          카테고리별 소비가 보여요.
        </p>
      </div>
    );
  let cursor = 0;
  const segments = data.map((item, index) => {
    const start = (cursor / total) * 100;
    cursor += item.amount;
    return {
      ...item,
      start,
      end: (cursor / total) * 100,
      color: colors[index % colors.length],
    };
  });
  const stops = segments
    .map((segment) => `${segment.color} ${segment.start}% ${segment.end}%`)
    .join(", ");
  const showTooltip = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - (rect.left + rect.width / 2);
    const y = event.clientY - (rect.top + rect.height / 2);
    const radius = Math.hypot(x, y);

    if (radius < rect.width * 0.37 || radius > rect.width * 0.5) {
      setTooltip(null);
      return;
    }

    const percentage =
      (((Math.atan2(y, x) * 180) / Math.PI + 90 + 360) % 360) / 3.6;
    const segment = segments.find(
      (item) => percentage >= item.start && percentage < item.end,
    );
    if (!segment) return;
    setTooltip({
      category: segment.category,
      amount: segment.amount,
      x: event.clientX + 14,
      y: event.clientY + 14,
    });
  };
  return (
    <>
      <div className="chart-layout">
        <div
          className={`donut ${animate ? "donut-animated" : ""} ${compact ? "compact-donut" : ""}`}
          onMouseMove={interactive ? showTooltip : undefined}
          onMouseLeave={interactive ? () => setTooltip(null) : undefined}
        >
          <div
            className="donut-fill"
            style={{ background: `conic-gradient(from 0deg, ${stops})` }}
          />
          <div className="donut-center">
            <span>{label}</span>
            <strong>{formatMoney(animatedTotal)}</strong>
          </div>
        </div>
        <div className="chart-legend">
          {data.slice(0, 5).map((item, index) => (
            <div className="legend-row" key={item.category}>
              <i
                className="legend-dot"
                style={{ background: colors[index % colors.length] }}
              />
              <span>{item.category}</span>
              <b>{Math.round((item.amount / total) * 100)}%</b>
            </div>
          ))}
        </div>
      </div>
      {tooltip && (
        <div
          className="chart-tooltip"
          style={{ left: tooltip.x, top: tooltip.y }}
          role="status"
        >
          <span>{tooltip.category}</span>
          <strong className="expense-text">
            {formatMoney(tooltip.amount)}
          </strong>
        </div>
      )}
    </>
  );
}
