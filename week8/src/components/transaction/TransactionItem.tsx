import type { Transaction } from "../../types/transaction";
import { Pencil, Trash2 } from "lucide-react";
import { getCategoryIcon } from "../../utils/categories";
import { formatDate, formatSignedMoney } from "../../utils/format";

interface Props {
  transaction: Transaction;
  compact?: boolean;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => void;
}

export function TransactionItem({
  transaction,
  compact = false,
  onEdit,
  onDelete,
}: Props) {
  const CategoryIcon = getCategoryIcon(transaction.category);

  return (
    <article className={`transaction-item ${compact ? "compact" : ""}`}>
      <span className="category-icon" aria-hidden="true">
        <CategoryIcon size={19} strokeWidth={1.8} />
      </span>
      <div className="transaction-info">
        <strong>{transaction.title}</strong>
        <span>
          {transaction.category} · {formatDate(transaction.date)}
        </span>
      </div>
      <strong className={`transaction-amount ${transaction.type}`}>
        {formatSignedMoney(transaction.amount, transaction.type)}
      </strong>
      {!compact && (
        <div className="transaction-actions">
          <button
            className="mini-action"
            aria-label={`${transaction.title} 수정`}
            onClick={() => onEdit?.(transaction)}
          >
            <Pencil size={15} />
          </button>
          <button
            className="mini-action delete"
            aria-label={`${transaction.title} 삭제`}
            onClick={() => onDelete?.(transaction)}
          >
            <Trash2 size={15} />
          </button>
        </div>
      )}
    </article>
  );
}
