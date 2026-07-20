import { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

interface Props {
  open: boolean;
  title: string;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmModal({ open, title, onConfirm, onClose }: Props) {
  useEffect(() => {
    const closeWithEscape = (event: KeyboardEvent) =>
      event.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", closeWithEscape);
    return () => window.removeEventListener("keydown", closeWithEscape);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <div
        className="confirm-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          className="icon-button modal-close"
          aria-label="닫기"
          onClick={onClose}
        >
          <X size={18} />
        </button>
        <div className="modal-symbol">
          <AlertTriangle size={20} />
        </div>
        <h2 id="modal-title">거래 내역을 삭제할까요?</h2>
        <p>‘{title}’ 내역은 삭제 후 복구할 수 없어요.</p>
        <div className="modal-actions">
          <button className="button secondary" onClick={onClose}>
            취소
          </button>
          <button className="button danger" onClick={onConfirm}>
            삭제하기
          </button>
        </div>
      </div>
    </div>
  );
}
