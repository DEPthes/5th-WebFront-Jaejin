import { NavLink, Outlet } from "react-router-dom";
import { ChartPie, Home, List, Plus } from "lucide-react";
import { useTransactionModal } from "../../hooks/useTransactionModal";
import { TransactionModal } from "../transaction/TransactionModal";

const navItems = [
  { to: "/", icon: Home, label: "대시보드", end: true },
  { to: "/transactions", icon: List, label: "거래 내역" },
  { to: "/statistics", icon: ChartPie, label: "통계" },
];

export function AppLayout() {
  const { openTransactionModal } = useTransactionModal();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <nav aria-label="주 메뉴">
          {navItems.map(({ icon: Icon, ...item }) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className="nav-link"
            >
              <Icon size={19} strokeWidth={1.8} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
      <nav className="bottom-nav" aria-label="모바일 메뉴">
        <NavLink to="/" end className="bottom-nav-link">
          <Home size={19} />
          <span>홈</span>
        </NavLink>
        <NavLink to="/transactions" className="bottom-nav-link">
          <List size={19} />
          <span>내역</span>
        </NavLink>
        <NavLink to="/statistics" className="bottom-nav-link">
          <ChartPie size={19} />
          <span>통계</span>
        </NavLink>
      </nav>
      <button
        type="button"
        className="floating-transaction-add"
        aria-label="거래 추가"
        onClick={() => openTransactionModal()}
      >
        <Plus size={25} />
      </button>
      <TransactionModal />
    </div>
  );
}
