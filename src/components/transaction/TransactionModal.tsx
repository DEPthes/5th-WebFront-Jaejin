import { FormEvent, useEffect, useRef, useState } from "react";
import { CalendarDays, Check, ChevronDown, X } from "lucide-react";
import { useTransactionModal } from "../../hooks/useTransactionModal";
import { useTransactions } from "../../hooks/useTransactions";
import type {
  TransactionInput,
  TransactionType,
} from "../../types/transaction";
import { categories } from "../../utils/categories";
import { getLocalDate } from "../../utils/format";

const createDefaultForm = (): TransactionInput => ({
  type: "expense",
  amount: 0,
  category: "식비",
  title: "",
  date: getLocalDate(),
  memo: "",
});

const quickAmountOptions = [
  { label: "100만", amount: 1_000_000 },
  { label: "10만", amount: 100_000 },
  { label: "5만", amount: 50_000 },
  { label: "1만", amount: 10_000 },
];

export function TransactionModal() {
  const { isOpen, editingTransaction, closeTransactionModal } =
    useTransactionModal();
  const { addTransaction, editTransaction } = useTransactions();
  const [form, setForm] = useState<TransactionInput>(createDefaultForm);
  const [error, setError] = useState("");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const categoryPickerRef = useRef<HTMLDivElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const openDatePicker = () => {
    const dateInput = dateInputRef.current;
    if (!dateInput) return;

    dateInput.focus();
    dateInput.showPicker?.();
  };

  useEffect(() => {
    if (!isOpen) return;

    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeTransactionModal();
    };
    setForm(
      editingTransaction
        ? {
            type: editingTransaction.type,
            amount: editingTransaction.amount,
            category: editingTransaction.category,
            title: editingTransaction.title,
            date: editingTransaction.date,
            memo: editingTransaction.memo,
          }
        : createDefaultForm(),
    );
    setError("");
    setIsCategoryOpen(false);
    window.addEventListener("keydown", closeWithEscape);
    return () => window.removeEventListener("keydown", closeWithEscape);
  }, [isOpen, editingTransaction, closeTransactionModal]);

  useEffect(() => {
    if (!isOpen || !isCategoryOpen) return;

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (
        categoryPickerRef.current &&
        !categoryPickerRef.current.contains(event.target as Node)
      ) {
        setIsCategoryOpen(false);
      }
    };
    window.addEventListener("mousedown", closeOnOutsideClick);
    return () => window.removeEventListener("mousedown", closeOnOutsideClick);
  }, [isOpen, isCategoryOpen]);

  const setField = <K extends keyof TransactionInput>(
    key: K,
    value: TransactionInput[K],
  ) => setForm((current) => ({ ...current, [key]: value }));

  const selectType = (type: TransactionType) => {
    setForm((current) => ({ ...current, type, category: categories[type][0] }));
    setIsCategoryOpen(false);
  };
  const addQuickAmount = (amount: number) => {
    setForm((current) => ({ ...current, amount: current.amount + amount }));
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.title.trim()) return setError("거래 제목을 입력해 주세요.");
    if (!Number.isFinite(form.amount) || form.amount <= 0) {
      return setError("금액은 1원 이상 입력해 주세요.");
    }
    if (!form.date) return setError("날짜를 선택해 주세요.");

    const input = {
      ...form,
      title: form.title.trim(),
      memo: form.memo.trim(),
    };
    if (editingTransaction) editTransaction(editingTransaction.id, input);
    else addTransaction(input);
    closeTransactionModal();
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop transaction-modal-backdrop"
      role="presentation"
      onMouseDown={closeTransactionModal}
    >
      <section
        className="transaction-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="transaction-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="transaction-modal-header">
          <div>
            <h2 id="transaction-modal-title">
              {editingTransaction ? "거래 수정" : "거래 추가"}
            </h2>
          </div>
          <button
            className="icon-button"
            aria-label="닫기"
            onClick={closeTransactionModal}
          >
            <X size={20} />
          </button>
        </header>
        <form className="transaction-form" onSubmit={submit}>
          <div className="type-selector">
            <button
              type="button"
              onClick={() => selectType("expense")}
              className={form.type === "expense" ? "active expense" : ""}
            >
              지출
            </button>
            <button
              type="button"
              onClick={() => selectType("income")}
              className={form.type === "income" ? "active income" : ""}
            >
              수입
            </button>
          </div>
          <div className="form-field amount-field">
            <span>
              금액 <i>필수</i>
            </span>
            <div className="amount-input">
              <input
                type="number"
                min="1"
                inputMode="numeric"
                value={form.amount || ""}
                onChange={(event) =>
                  setField("amount", Number(event.target.value))
                }
                placeholder="0"
                autoFocus
              />
              <em>원</em>
            </div>
            <div className="quick-amounts" aria-label="빠른 금액 추가">
              {quickAmountOptions.map((option) => (
                <button
                  key={option.amount}
                  type="button"
                  onClick={() => addQuickAmount(option.amount)}
                >
                  + {option.label}
                </button>
              ))}
            </div>
          </div>
          <div className="form-grid">
            <div className="form-field">
              <span>
                카테고리 <i>필수</i>
              </span>
              <div className="category-picker" ref={categoryPickerRef}>
                <button
                  type="button"
                  className={`category-trigger ${isCategoryOpen ? "open" : ""}`}
                  aria-haspopup="listbox"
                  aria-expanded={isCategoryOpen}
                  onClick={() => setIsCategoryOpen((current) => !current)}
                >
                  <span>{form.category}</span>
                  <ChevronDown size={19} aria-hidden="true" />
                </button>
                {isCategoryOpen && (
                  <div
                    className="category-options"
                    role="listbox"
                    aria-label="카테고리 선택"
                  >
                    {categories[form.type].map((category) => {
                      const isSelected = category === form.category;
                      return (
                        <button
                          key={category}
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          className={isSelected ? "selected" : ""}
                          onClick={() => {
                            setField("category", category);
                            setIsCategoryOpen(false);
                          }}
                        >
                          <span>{category}</span>
                          {isSelected && <Check size={17} aria-hidden="true" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            <label className="form-field">
              <span>
                날짜 <i>필수</i>
              </span>
              <div className="date-input-wrap">
                <input
                  ref={dateInputRef}
                  type="date"
                  value={form.date}
                  onChange={(event) => setField("date", event.target.value)}
                />
                <button
                  type="button"
                  className="date-picker-button"
                  onClick={openDatePicker}
                  aria-label="날짜 선택"
                >
                  <CalendarDays
                    size={19}
                    strokeWidth={1.9}
                    aria-hidden="true"
                  />
                </button>
              </div>
            </label>
          </div>
          <label className="form-field">
            <span>
              제목 <i>필수</i>
            </span>
            <input
              maxLength={40}
              value={form.title}
              onChange={(event) => setField("title", event.target.value)}
              placeholder="제목을 입력해주세요."
            />
          </label>
          <label className="form-field">
            <span>
              메모 <i>선택</i>
            </span>
            <textarea
              maxLength={160}
              value={form.memo}
              onChange={(event) => setField("memo", event.target.value)}
              placeholder="기억하고 싶은 내용을 적어보세요."
            />
          </label>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <div className="modal-actions">
            <button
              type="button"
              className="button secondary"
              onClick={closeTransactionModal}
            >
              취소
            </button>
            <button className="button primary" type="submit">
              {editingTransaction ? "수정 완료" : "거래 저장하기"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
