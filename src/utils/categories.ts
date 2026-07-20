import type { TransactionType } from "../types/transaction";
import {
  Banknote,
  BookOpen,
  BusFront,
  CircleDollarSign,
  Gift,
  HeartPulse,
  Home,
  Landmark,
  PartyPopper,
  ReceiptText,
  ShoppingBag,
  Utensils,
  type LucideIcon,
} from "lucide-react";

export const categories: Record<TransactionType, string[]> = {
  income: ["급여", "용돈", "부수입", "이자", "기타 수입"],
  expense: [
    "식비",
    "교통",
    "쇼핑",
    "주거/통신",
    "문화/여가",
    "의료/건강",
    "교육",
    "기타 지출",
  ],
};

const categoryIcons: Record<string, LucideIcon> = {
  급여: Banknote,
  용돈: Gift,
  부수입: CircleDollarSign,
  이자: Landmark,
  "기타 수입": CircleDollarSign,
  식비: Utensils,
  교통: BusFront,
  쇼핑: ShoppingBag,
  "주거/통신": Home,
  "문화/여가": PartyPopper,
  "의료/건강": HeartPulse,
  교육: BookOpen,
  "기타 지출": ReceiptText,
};

export const getCategoryIcon = (category: string) =>
  categoryIcons[category] ?? ReceiptText;
