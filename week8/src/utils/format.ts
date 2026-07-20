const moneyFormatter = new Intl.NumberFormat("ko-KR");

export const formatMoney = (amount: number) =>
  `${moneyFormatter.format(amount)}원`;

export const formatSignedMoney = (amount: number, type: "income" | "expense") =>
  `${type === "income" ? "+" : "-"}${formatMoney(amount)}`;

export const formatDate = (date: string) => {
  const [year, month, day] = date.split("-");
  return `${year.slice(2)}.${month}.${day}`;
};

export const getLocalDate = (offset = 0) => {
  const target = new Date();
  target.setDate(target.getDate() + offset);
  const year = target.getFullYear();
  const month = String(target.getMonth() + 1).padStart(2, "0");
  const day = String(target.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getMonthKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

export const getMonthLabel = (date = new Date()) => `${date.getMonth() + 1}월`;

export const getCurrentMonthKey = () => getMonthKey(new Date());

export const getRecentMonths = (count: number) =>
  Array.from({ length: count }, (_, index) => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() - (count - 1 - index));

    return { key: getMonthKey(date), label: getMonthLabel(date) };
  });

export const isCurrentMonth = (date: string) =>
  date.startsWith(getCurrentMonthKey());
