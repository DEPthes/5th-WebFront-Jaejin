import { ReceiptText } from "lucide-react";

interface Props {
  title?: string;
  description?: string;
}

export function EmptyState({
  title = "아직 등록된 거래가 없어요",
  description = "첫 거래를 기록하고 소비 습관을 한눈에 확인해 보세요.",
}: Props) {
  return (
    <div className="empty-state">
      <span className="empty-icon" aria-hidden="true">
        <ReceiptText size={27} />
      </span>
      <strong>{title}</strong>
      <p>{description}</p>
    </div>
  );
}
