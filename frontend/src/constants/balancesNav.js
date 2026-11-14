export const BALANCES_TABS = [
  { id: "overall", label: "Overall Balances", icon: "account_balance_wallet", to: "/balances" },
  { id: "who", label: "Who Owes Whom", icon: "swap_horiz", to: "/who-owes-whom" },
  { id: "settle", label: "Settle Up", icon: "payments", to: "/settle-up" },
  { id: "history", label: "Settlement History", icon: "history", to: "/settlement-history" },
  { id: "pending", label: "Pending", icon: "pending_actions", badge: 3, to: "/pending-settlements" },
  { id: "simplify", label: "Simplify Debts", icon: "auto_graph", to: "/simplify-debts" },
  { id: "methods", label: "Payment Methods", icon: "credit_card", to: "/payment-methods" },
];