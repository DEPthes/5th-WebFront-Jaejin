import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTransactionModal } from "../hooks/useTransactionModal";
import { useTransactions } from "../hooks/useTransactions";

export function TransactionModalRoute() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { transactions } = useTransactions();
  const { openTransactionModal } = useTransactionModal();

  useEffect(() => {
    const transaction =
      id === "new" ? undefined : transactions.find((item) => item.id === id);

    if (id === "new" || transaction) {
      openTransactionModal(transaction);
    }
    navigate(id === "new" ? "/" : "/transactions", { replace: true });
  }, [id, navigate, openTransactionModal, transactions]);

  return null;
}
