import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { TransactionModalProvider } from "./hooks/useTransactionModal";
import { DashboardPage } from "./pages/DashboardPage";
import { StatisticsPage } from "./pages/StatisticsPage";
import { TransactionModalRoute } from "./pages/TransactionModalRoute";
import { TransactionsPage } from "./pages/TransactionsPage";

export default function App() {
  return (
    <TransactionModalProvider>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="transaction/:id" element={<TransactionModalRoute />} />
          <Route path="statistics" element={<StatisticsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </TransactionModalProvider>
  );
}
