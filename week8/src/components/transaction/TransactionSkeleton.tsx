interface TransactionSkeletonProps {
  compact?: boolean;
  count?: number;
}

export function TransactionSkeleton({
  compact = false,
  count = 5,
}: TransactionSkeletonProps) {
  return (
    <div
      className="transaction-skeleton-list"
      role="status"
      aria-label="거래 내역을 불러오는 중입니다."
    >
      {Array.from({ length: count }, (_, index) => (
        <article
          className={`transaction-item transaction-skeleton ${compact ? "compact" : ""}`}
          key={`transaction-skeleton-${index}`}
        >
          <span className="skeleton-block skeleton-category-icon" />
          <div className="skeleton-info">
            <span className="skeleton-block skeleton-title" />
            <span className="skeleton-block skeleton-meta" />
          </div>
          <span className="skeleton-block skeleton-amount" />
          {!compact && (
            <div className="transaction-actions" aria-hidden="true">
              <span className="skeleton-block skeleton-action" />
              <span className="skeleton-block skeleton-action" />
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
