import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import GroupHeader from "../components/layout/GroupHeader";
import { groupService, balanceService } from "../services";

const formatMoney = (amount, currency = "INR") => {
  const major = (amount || 0) / 100;
  try {
    return major.toLocaleString("en-IN", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  } catch {
    return `${currency} ${major.toFixed(2)}`;
  }
};

const getCategoryIcon = (category) => {
  const icons = {
    lodging: "villa",
    mountain: "downhill_skiing",
    groceries: "local_grocery_store",
    transit: "directions_car",
    dining: "restaurant",
    activity: "sports_esports",
    default: "receipt_long",
  };
  return icons[category?.toLowerCase()] || icons.default;
};

const getCategoryBg = (category) => {
  const bgs = {
    lodging: "bg-surface-container-highest text-secondary",
    mountain: "bg-surface-container-high text-on-surface",
    groceries: "bg-primary-fixed text-on-primary-fixed",
    transit: "bg-surface-container-highest text-on-surface-variant",
    dining: "bg-tertiary-fixed text-on-tertiary-fixed",
    activity: "bg-secondary-container text-on-secondary-container",
    default: "bg-surface-variant text-on-surface",
  };
  return bgs[category?.toLowerCase()] || bgs.default;
};

export default function GroupExpenses() {
  const location = useLocation();
  const navigate = useNavigate();
  const groupId = location.state?.groupId;

  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState(null);
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeView, setActiveView] = useState(() => {
    try {
      return localStorage.getItem("tabsy:groupExpensesView") || "ledger";
    } catch {
      return "ledger";
    }
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [payerFilter, setPayerFilter] = useState("all");
  const [missingFilter, setMissingFilter] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const onlyMissingFilterRef = useRef(false);

  useEffect(() => {
    if (!groupId) {
      navigate("/groups");
      return;
    }
    load();
  }, [groupId]);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [expData, bal, grp, mem] = await Promise.all([
        groupService.expenses(groupId),
        groupService.balances(groupId),
        groupService.get(groupId),
        groupService.members(groupId),
      ]);

      const rawExpenses = expData?.expenses || [];

      const normalized = rawExpenses.map((e) => {
        const payerName = e.paidBy?.name || "Someone";
        const hasReceipt = !!e.receipt?.url;
        const splits = (e.participants || []).map((p) => ({
          user: p.userId,
          name: p.name || p.userId?.slice?.(0, 2).toUpperCase() || "?",
          share: p.amount || 0,
        }));
        return {
          ...e,
          paidByName: payerName,
          date: e.expenseDate,
          splits,
          missingReceipt: !hasReceipt,
          receiptVerified: hasReceipt,
        };
      });

      setExpenses(normalized);
      setBalances(bal);
      setGroup(grp);
      setMembers(mem);
    } catch (err) {
      setError(err?.response?.data?.error?.message || "Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem("tabsy:groupExpensesView", activeView);
    } catch {}
  }, [activeView]);

  const switchView = (view) => {
    if (activeView === view) return;
    setActiveView(view);
  };

  const toggleLedgerShareDetails = (id) => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle("hidden");
  };

  const applyDynamicSearch = (query) => {
    setSearchQuery(query);
  };

  const setPayerQuickFilter = (type, btn) => {
    document.querySelectorAll(".payer-btn").forEach((b) => {
      b.classList.remove(
        "bg-surface-container-lowest",
        "text-on-surface",
        "shadow-sm",
        "font-semibold"
      );
      b.classList.add("text-on-surface-variant", "font-medium");
    });
    btn.classList.add(
      "bg-surface-container-lowest",
      "text-on-surface",
      "shadow-sm",
      "font-semibold"
    );
    btn.classList.remove("text-on-surface-variant", "font-medium");
    setPayerFilter(type);
  };

  const toggleMissingFilter = (btn) => {
    onlyMissingFilterRef.current = !onlyMissingFilterRef.current;
    setMissingFilter(onlyMissingFilterRef.current);
    if (onlyMissingFilterRef.current) {
      btn.classList.remove("bg-surface-container-low", "text-on-surface-variant");
      btn.classList.add("bg-error-container", "text-on-error-container", "font-semibold");
    } else {
      btn.classList.add("bg-surface-container-low", "text-on-surface-variant");
      btn.classList.remove("bg-error-container", "text-on-error-container", "font-semibold");
    }
  };

  const previewReceipt = (title, amt) => {
    const t = document.getElementById("receiptModalTitle");
    const a = document.getElementById("receiptModalAmount");
    const m = document.getElementById("receiptPreviewModal");
    if (t) t.innerText = title;
    if (a) a.innerText = amt;
    if (m) m.classList.remove("hidden");
  };

  const openExpenseDetails = (expenseId) => {
    if (expenseId) {
      navigate("/expense-details", { state: { expenseId, groupId } });
    }
  };

  const closeReceiptPreview = () => {
    const m = document.getElementById("receiptPreviewModal");
    if (m) m.classList.add("hidden");
  };

  // Compute net for current user per expense
  const getUserNetForExpense = (expense) => {
    const currentUserId = balances?.matrix ? getMyUserId() : null;
    if (!currentUserId) return 0;
    const participant = expense.splits?.find((s) => s.user === currentUserId);
    if (!participant) return 0;
    const paid = expense.paidBy?._id === currentUserId ? expense.amount : 0;
    return paid - (participant.share || 0);
  };

  // The balances endpoint returns { position, plan, matrix } without userId.
  // We derive current user from members (the one with admin role is often self,
  // but we use the token's user via the members list matched to position.net).
  const getMyUserId = () => {
    if (balances?.userId) return balances.userId;
    // Fallback: the member whose net matches position.net
    if (balances?.position && members.length) {
      const posNet = balances.position.net || 0;
      const match = members.find((m) => (m.net || 0) === posNet);
      if (match) return match.user;
    }
    return null;
  };

  // Filter expenses
  const filteredExpenses = expenses
    .filter((e) => {
      if (categoryFilter !== "all" && e.category !== categoryFilter) return false;
      if (payerFilter !== "all") {
        const isYou = e.paidBy?._id === myUserId;
        if (payerFilter === "you" && !isYou) return false;
        if (payerFilter === "others" && isYou) return false;
      }
      if (missingFilter && !e.missingReceipt) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const text = `${e.title} ${e.category} ${e.paidByName || ""}`.toLowerCase();
        if (!text.includes(q)) return false;
      }
      return true;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const categories = Array.from(new Set(expenses.map((e) => e.category).filter(Boolean)));

  const myUserId = getMyUserId();
  const currency = group?.currency || "INR";
  const totalSpend = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const myPaid = expenses
    .filter((e) => e.paidBy?._id === myUserId)
    .reduce((sum, e) => sum + (e.amount || 0), 0);
  const myNet = balances?.position?.net || 0;
  const expenseCount = expenses.length;
  const missingCount = expenses.filter((e) => e.missingReceipt).length;

  if (!groupId) return null;
  if (loading) {
    return (
      <AppLayout>
        <div className="bg-background font-body-md text-on-surface antialiased overflow-x-clip max-w-[100vw]">
          <main className="w-full bg-background">
            <div className="flex flex-col w-full">
              <div className="max-w-7xl w-full mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop">
                <GroupHeader
                  title="Loading..."
                  subtitle=""
                  currentLabel="Group Expenses"
                />
              </div>
              <div className="text-center py-16 text-on-surface-variant">Loading expenses…</div>
            </div>
          </main>
        </div>
      </AppLayout>
    );
  }
  if (error) {
    return (
      <AppLayout>
        <div className="bg-background font-body-md text-on-surface antialiased overflow-x-clip max-w-[100vw]">
          <main className="w-full bg-background">
            <div className="flex flex-col w-full">
              <div className="max-w-7xl w-full mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop">
                <GroupHeader
                  title="Error"
                  subtitle=""
                  currentLabel="Group Expenses"
                />
              </div>
              <div className="max-w-7xl w-full mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop mt-space-md">
                <div className="px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">{error}</div>
              </div>
            </div>
          </main>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="bg-background font-body-md text-on-surface antialiased overflow-x-clip max-w-[100vw]">
        <style>{`
          @layer base {
            html, body { margin: 0; padding: 0; }
            body { overscroll-behavior: none; }
            main > :first-child { margin-top: 0 !important; }
            main > :last-child { margin-bottom: 0 !important; }
          }
          ::-webkit-scrollbar { display: none; }
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>

        <main className="w-full bg-background">
          <div className="flex flex-col w-full">
            <div className="max-w-7xl w-full mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop">
              <GroupHeader
                title={group?.name || "Group Expenses"}
                subtitle={group?.description}
                currentLabel="Group Expenses"
                actions={
                  <>
                    <Link className="group/btn relative inline-flex items-center gap-0 px-2.5 py-2 text-on-surface font-title-md text-title-md hover:bg-surface-container-lowest rounded-lg transition-all duration-300 ease-out overflow-hidden" to="/group-expenses/add" state={{ groupId }}>
                      <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover/btn:text-primary transition-colors shrink-0">add</span>
                      <span className="max-w-0 group-hover/btn:max-w-[120px] group-hover/btn:ml-2 overflow-hidden whitespace-nowrap transition-all duration-300 ease-out opacity-0 group-hover/btn:opacity-100">
                        Add Expense
                      </span>
                    </Link>
                    <div className="w-px h-5 bg-outline-variant/40 shrink-0 transition-all duration-300 group-hover/actions:bg-transparent" />
                    <Link className="group/btn relative inline-flex items-center gap-0 px-2.5 py-2 text-on-surface font-title-md text-title-md hover:bg-surface-container-lowest rounded-lg transition-all duration-300 ease-out overflow-hidden" to="/group-members" state={{ groupId }}>
                      <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover/btn:text-secondary transition-colors shrink-0">group</span>
                      <span className="max-w-0 group-hover/btn:max-w-[120px] group-hover/btn:ml-2 overflow-hidden whitespace-nowrap transition-all duration-300 ease-out opacity-0 group-hover/btn:opacity-100">
                        View Members
                      </span>
                    </Link>
                    <div className="w-px h-5 bg-outline-variant/40 shrink-0 transition-all duration-300 group-hover/actions:bg-transparent" />
                    <Link className="group/btn inline-flex items-center gap-0 px-2.5 py-2 bg-primary-container text-on-primary-container font-title-md text-title-md hover:opacity-95 rounded-lg transition-all duration-300 ease-out overflow-hidden" to="/group-balances" state={{ groupId }}>
                      <span className="material-symbols-outlined text-[18px] shrink-0">bolt</span>
                      <span className="max-w-0 group-hover/btn:max-w-[140px] group-hover/btn:ml-2 overflow-hidden whitespace-nowrap transition-all duration-300 ease-out opacity-0 group-hover/btn:opacity-100">
                        Settle Balances
                      </span>
                    </Link>
                    <div className="w-px h-5 bg-outline-variant/40 shrink-0 transition-all duration-300 group-hover/actions:bg-transparent" />
                    <Link className="group/btn inline-flex items-center gap-0 px-2.5 py-2 text-on-surface font-title-md text-title-md hover:bg-surface-container-lowest rounded-lg transition-all duration-300 ease-out overflow-hidden" to="/group-activity" state={{ groupId }}>
                      <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover/btn:text-secondary transition-colors shrink-0">timeline</span>
                      <span className="max-w-0 group-hover/btn:max-w-[120px] group-hover/btn:ml-2 overflow-hidden whitespace-nowrap transition-all duration-300 ease-out opacity-0 group-hover/btn:opacity-100">
                        Activity Log
                      </span>
                    </Link>
                    <div className="w-px h-5 bg-outline-variant/40 shrink-0 transition-all duration-300 group-hover/actions:bg-transparent" />
                    <Link className="group/btn inline-flex items-center gap-0 px-2.5 py-2 text-on-surface font-title-md text-title-md hover:bg-surface-container-lowest rounded-lg transition-all duration-300 ease-out overflow-hidden" to="/group-members/add" state={{ groupId }}>
                      <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover/btn:text-on-surface transition-colors shrink-0">group_add</span>
                      <span className="max-w-0 group-hover/btn:max-w-[120px] group-hover/btn:ml-2 overflow-hidden whitespace-nowrap transition-all duration-300 ease-out opacity-0 group-hover/btn:opacity-100">
                        Invite Friends
                      </span>
                    </Link>
                  </>
                }
              />
            </div>
            {/* Key Metrics Strip */}
            <section className="max-w-7xl w-full mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop mt-space-md">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-sm">
                <div className="bg-surface-container-lowest p-space-md rounded-2xl border border-outline-variant/60 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider">Expedition Spend</span>
                    <div className="w-7 h-7 rounded-lg bg-surface-container-low text-on-surface-variant flex items-center justify-center">
                      <span className="material-symbols-outlined text-[16px]">payments</span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-numeric-balance-lg text-numeric-balance-lg text-on-surface tracking-tight">{formatMoney(totalSpend, currency)}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 font-body-sm text-body-sm text-on-surface-variant">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
                    <span>{expenseCount} ledger items recorded</span>
                  </div>
                </div>
                <div className="bg-surface-container-lowest p-space-md rounded-2xl border border-outline-variant/60 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider">Your Outlay</span>
                    <div className="w-7 h-7 rounded-lg bg-surface-container-low text-on-surface-variant flex items-center justify-center">
                      <span className="material-symbols-outlined text-[16px]">account_balance_wallet</span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-numeric-balance-lg text-numeric-balance-lg text-on-surface tracking-tight">{formatMoney(myPaid, currency)}</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">upfront</span>
                  </div>
                  <div className="mt-1 font-body-sm text-body-sm text-on-surface-variant">Paid directly by you</div>
                </div>
                <div className="bg-surface-container-lowest p-space-md rounded-2xl border border-outline-variant/60 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps uppercase text-primary font-bold tracking-wider">Net Position</span>
                    <div className="w-7 h-7 rounded-lg bg-primary-fixed text-on-primary-fixed flex items-center justify-center">
                      <span className="material-symbols-outlined text-[16px]">trending_up</span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-numeric-balance-lg text-numeric-balance-lg text-primary tracking-tight">
                      {myNet >= 0 ? "+" : ""}{formatMoney(Math.abs(myNet), currency)}
                    </span>
                    <span className={`font-label-caps text-label-caps uppercase font-bold ${myNet > 0 ? "text-primary" : myNet < 0 ? "text-error" : "text-on-surface-variant"}`}>
                      {myNet > 0 ? "Surplus" : myNet < 0 ? "Deficit" : "Settled"}
                    </span>
                  </div>
                  <div className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
                    {myNet > 0 ? "Expected receipt from group" : myNet < 0 ? "You owe the group" : "All settled up"}
                  </div>
                </div>
                <div className="bg-surface-container-lowest p-space-md rounded-2xl border border-outline-variant/60 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider">Receipt Slip Vault</span>
                    <span className="font-label-caps text-label-caps px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-bold">{missingCount} Missing</span>
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-numeric-balance-lg text-numeric-balance-lg text-on-surface tracking-tight">
                      {expenseCount - missingCount} <span className="text-on-surface-variant text-headline-sm">/ {expenseCount}</span>
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">slips digitized</span>
                  </div>
                  <div className="mt-2 w-full h-1.5 rounded-full bg-surface-container-high overflow-hidden">
                    <div className="h-full bg-primary-container rounded-full" style={{ width: expenseCount > 0 ? `${((expenseCount - missingCount) / expenseCount) * 100}%` : "0%" }}></div>
                  </div>
                </div>
              </div>
            </section>

            {/* Interactive Controls Toolbar */}
            <section className="max-w-7xl w-full mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop mt-space-md">
              <div className="p-space-sm rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm sticky top-[9rem] z-10 backdrop-blur-sm">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-space-sm">
                  <div className="flex items-center flex-wrap gap-space-sm">
                    <div className="relative bg-surface-container-low p-1 rounded-xl flex items-center">
                      <div className="absolute top-1 bottom-1 rounded-lg bg-surface-container-lowest shadow-sm transition-all duration-300 ease-out" id="viewPillGlider" style={{ left: activeView === "ledger" ? 4 : 136, width: activeView === "ledger" ? 132 : 140 }}></div>
                      <button className={`relative z-10 px-3.5 py-1.5 rounded-lg font-body-sm text-body-sm font-semibold text-on-surface flex items-center gap-1.5 transition-colors ${activeView === "ledger" ? "text-on-surface font-semibold" : "text-on-surface-variant font-medium"}`} id="ledgerViewBtn" onClick={() => switchView("ledger")} type="button">
                        <span className="material-symbols-outlined text-[18px]">table_rows</span>
                        <span>Ledger View</span>
                      </button>
                      <button className={`relative z-10 px-3.5 py-1.5 rounded-lg font-body-sm text-body-sm font-medium text-on-surface-variant hover:text-on-surface flex items-center gap-1.5 transition-colors ${activeView === "kanban" ? "text-on-surface font-semibold" : ""}`} id="kanbanViewBtn" onClick={() => switchView("kanban")} type="button">
                        <span className="material-symbols-outlined text-[18px]">view_kanban</span>
                        <span>Kanban View</span>
                      </button>
                    </div>
                    <div className="flex items-center bg-surface-container-low p-1 rounded-xl hidden lg:flex">
                      <button className={`payer-btn px-3 py-1 rounded-lg font-body-sm text-body-sm font-semibold ${payerFilter === "all" ? "bg-surface-container-lowest text-on-surface shadow-sm" : "bg-surface-container-low text-on-surface-variant hover:text-on-surface"}`} onClick={(e) => setPayerQuickFilter("all", e.currentTarget)} type="button">All ({expenseCount})</button>
                      <button className={`payer-btn px-3 py-1 rounded-lg font-body-sm text-body-sm font-medium ${payerFilter === "you" ? "bg-surface-container-lowest text-on-surface shadow-sm" : "bg-surface-container-low text-on-surface-variant hover:text-on-surface"}`} onClick={(e) => setPayerQuickFilter("you", e.currentTarget)} type="button">By You</button>
                      <button className={`payer-btn px-3 py-1 rounded-lg font-body-sm text-body-sm font-medium ${payerFilter === "others" ? "bg-surface-container-lowest text-on-surface shadow-sm" : "bg-surface-container-low text-on-surface-variant hover:text-on-surface"}`} onClick={(e) => setPayerQuickFilter("others", e.currentTarget)} type="button">By Others</button>
                    </div>
                  </div>
                  <div className="flex items-center flex-wrap gap-space-xs mt-2 md:mt-0">
                    <div className="relative flex-1 sm:w-64">
                      <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-[18px]">search</span>
                      <input className="w-full bg-surface-container-low rounded-xl pl-9 pr-3 py-1.5 text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container" id="interactiveSearchInput" onInput={(e) => applyDynamicSearch(e.target.value)} placeholder="Filter bills or items..." type="text" value={searchQuery} />
                    </div>
                    <button className={`px-3 py-1.5 rounded-xl ${missingFilter ? "bg-error-container text-on-error-container" : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"} font-body-sm text-body-sm flex items-center gap-1 transition-colors`} id="missingFilterBtn" onClick={(e) => toggleMissingFilter(e.currentTarget)} type="button">
                      <span className="material-symbols-outlined text-[16px] text-tertiary">warning</span>
                      <span className="hidden sm:inline">Missing Slip</span>
                    </button>
                    <button className="px-3 py-1.5 rounded-xl bg-surface-container-low text-on-surface-variant hover:bg-surface-container font-body-sm text-body-sm flex items-center gap-1 transition-colors" onClick={() => alert("Exporting ledger as CSV...")} type="button">
                      <span className="material-symbols-outlined text-[16px]">file_download</span>
                      <span>Export</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Main Content Stage: Ledger vs Kanban */}
            <section className="max-w-7xl w-full mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop mt-space-md mb-space-lg">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
                {/* Primary Canvas */}
                <div className="lg:col-span-8 min-w-0">
                  {/* Ledger View */}
                  <div className={`w-full transition-all duration-300 transform ${activeView === "ledger" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 hidden"}`} id="ledgerViewContainer">
                    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-sm overflow-hidden">
                      <div className="p-space-md bg-surface-container-low/50 flex items-center justify-between">
                        <div className="flex items-center gap-space-xs">
                          <span className="font-title-md text-title-md text-on-surface">Chronological Ledger</span>
                          <span className="font-label-caps text-label-caps px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant" id="ledgerCountBadge">{filteredExpenses.length} Records</span>
                        </div>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">Click row to inspect split shares</span>
                      </div>
                      <div className="flex flex-col" id="ledgerRowsList">
                        {filteredExpenses.length === 0 ? (
                          <div className="p-8 text-center text-on-surface-variant">No expenses match your filters</div>
                        ) : (
                          filteredExpenses.map((expense, idx) => {
                            const net = getUserNetForExpense(expense);
                            const isYou = expense.paidBy?._id === myUserId;
                            const statusText = net > 0 ? `You lent ${formatMoney(net, currency)}` : net < 0 ? `You owe ${formatMoney(Math.abs(net), currency)}` : "Settled";
                            const statusColor = net > 0 ? "text-primary" : net < 0 ? "text-tertiary" : "text-on-surface-variant";
                            const shareId = `share-${expense._id || idx}`;

                            return (
                              <div key={expense._id || idx} className={`ledger-item group p-space-md transition-colors hover:bg-surface-container-low cursor-pointer ${expense.missingReceipt ? "bg-error-container/20" : ""}`} data-category={expense.category} data-missing={expense.missingReceipt ? "true" : "false"} data-payer={isYou ? "you" : "others"} onClick={() => toggleLedgerShareDetails(shareId)}>
                                <div className="flex items-center justify-between gap-space-sm">
                                  <div className="flex items-center gap-space-sm min-w-0">
                                    <div className={`w-10 h-10 rounded-xl ${getCategoryBg(expense.category)} flex items-center justify-center shrink-0`}>
                                      <span className="material-symbols-outlined text-[20px]">{getCategoryIcon(expense.category)}</span>
                                    </div>
                                    <div className="min-w-0">
                                      <div className="flex items-center gap-2">
                                        <span className="font-title-md text-title-md text-on-surface truncate">{expense.title}</span>
                                        <span className="font-label-caps text-label-caps px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant shrink-0">{expense.category}</span>
                                        {expense.receiptVerified && <span className="material-symbols-outlined text-[16px] text-primary" title="Receipt verified">receipt</span>}
                                        {expense.missingReceipt && (
                                          <span className="font-label-caps text-label-caps px-1.5 py-0.5 rounded-md bg-error text-on-error font-bold flex items-center gap-0.5">
                                            <span className="material-symbols-outlined text-[12px]">receipt_long</span> Missing Slip
                                          </span>
                                        )}
                                      </div>
                                      <p className="font-body-sm text-body-sm text-on-surface-variant truncate mt-0.5">
                                        {new Date(expense.date).toLocaleDateString()} • Paid by <strong className="text-on-surface">{expense.paidByName || (isYou ? "You" : "Someone")}</strong> • Split {expense.splits?.length || 0} ways
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-right shrink-0">
                                    <span className="font-numeric-balance-md text-numeric-balance-md text-on-surface block">{formatMoney(expense.amount, currency)}</span>
                                    <span className={`font-label-caps text-label-caps ${statusColor} font-bold`}>{statusText}</span>
                                  </div>
                                </div>
                                <div className="hidden mt-space-sm pt-space-sm bg-surface-container-low/70 p-space-sm rounded-xl" id={shareId}>
                                  <div className="flex items-center justify-between text-body-sm font-semibold text-on-surface mb-2">
                                    <span>Split Breakdown:</span>
                                    <button className="text-secondary font-body-sm text-body-sm hover:underline flex items-center gap-1" onClick={(e) => { e.stopPropagation(); previewReceipt(expense.title, formatMoney(expense.amount, currency)); }} type="button">
                                      <span className="material-symbols-outlined text-[14px]">visibility</span> View Receipt
                                    </button>
                                  </div>
                                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {expense.splits?.map((split) => (
                                      <div key={split.user} className="p-2 rounded-lg bg-surface-container-lowest text-body-sm">
                                        {split.name || split.user?.slice?.(0, 2).toUpperCase() || "?"}: <strong className={split.user === myUserId ? "text-primary" : ""}>{formatMoney(split.share, currency)}</strong>
                                        {split.user === myUserId && <span className="text-primary ml-1">(Self)</span>}
                                      </div>
                                    ))}
                                  </div>
                                  <button className="mt-2 pt-2 w-full border-t border-outline-variant/40 text-secondary font-body-sm text-body-sm hover:underline flex items-center justify-center gap-1" onClick={(e) => { e.stopPropagation(); openExpenseDetails(expense._id); }} type="button">
                                    <span className="material-symbols-outlined text-[14px]">open_in_new</span> View Full Expense Details
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Kanban View */}
                  <div className={`w-full hidden opacity-0 translate-y-3 transition-all duration-300 ${activeView === "kanban" ? "opacity-100 translate-y-0" : ""}`} id="kanbanViewContainer">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-space-sm">
                      {categories.map((cat) => {
                        const catExpenses = filteredExpenses.filter((e) => e.category === cat);
                        const catTotal = catExpenses.reduce((sum, e) => sum + e.amount, 0);
                        return (
                          <div key={cat} className="bg-surface-container-low/70 p-3 rounded-2xl flex flex-col gap-space-sm self-start min-h-0">
                            <div className="flex items-center justify-between px-1">
                              <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                                <span className="font-title-md text-title-md text-on-surface">{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                              </div>
                              <span className="font-label-caps text-label-caps px-2 py-0.5 rounded-full bg-surface-container-lowest text-on-surface-variant">{formatMoney(catTotal, currency)}</span>
                            </div>
                            {catExpenses.map((expense, idx) => {
                              const net = getUserNetForExpense(expense);
                              const isYou = expense.paidBy?._id === myUserId;
                              return (
                                <div key={`${cat}-${idx}`} className="bg-surface-container-lowest p-space-sm rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer" onClick={(e) => { e.stopPropagation(); openExpenseDetails(expense._id); }}>
                                  <div className="flex items-start justify-between gap-1">
                                    <span className="font-title-md text-title-md text-on-surface leading-tight truncate">{expense.title}</span>
                                    {expense.receiptVerified && <span className="material-symbols-outlined text-[16px] text-primary">verified</span>}
                                  </div>
                                  <div className="mt-2 flex items-baseline justify-between">
                                    <span className="font-numeric-balance-md text-numeric-balance-md text-on-surface">{formatMoney(expense.amount, currency)}</span>
                                    <span className={`font-label-caps text-label-caps px-2 py-0.5 rounded-full ${isYou ? "bg-primary-fixed text-on-primary-fixed" : net < 0 ? "bg-error-container text-on-error-container" : "bg-primary-container text-on-primary-container"}`}>
                                      {isYou ? "You paid" : net < 0 ? "You owe" : "Owed to you"}
                                    </span>
                                  </div>
                                  <div className="mt-3 pt-2 flex items-center justify-between text-body-sm text-on-surface-variant">
                                    <span className="text-xs">Split {expense.splits?.length || 0} ways</span>
                                    <span className={`text-xs font-semibold ${net > 0 ? "text-primary" : net < 0 ? "text-tertiary" : "text-on-surface-variant"}`}>
                                      {net >= 0 ? "+" : ""}{formatMoney(net, currency)}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Companion Rail */}
                <div className="lg:col-span-4 hidden lg:block">
                  <div className="sticky top-[9rem] flex flex-col gap-space-sm self-start">
                    <div className="bg-surface-container-lowest p-space-md rounded-2xl border border-outline-variant/60 shadow-sm">
                      <h3 className="font-title-md text-title-md text-on-surface mb-3">Quick Actions</h3>
                      <div className="flex flex-col gap-2">
                        <Link to="/group-expenses/add" state={{ groupId }} className="w-full py-2.5 px-3 rounded-xl bg-primary-container text-on-primary-container font-title-md text-title-md text-center hover:opacity-90 transition-all">
                          <span className="material-symbols-outlined text-[18px] inline-block mr-1">add</span> Add Expense
                        </Link>
                        <Link to="/group-balances" state={{ groupId }} className="w-full py-2.5 px-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-title-md text-title-md text-center transition-colors">
                          <span className="material-symbols-outlined text-[18px] inline-block mr-1">bolt</span> Settle Balances
                        </Link>
                        <Link to="/group-members/add" state={{ groupId }} className="w-full py-2.5 px-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-title-md text-title-md text-center transition-colors">
                          <span className="material-symbols-outlined text-[18px] inline-block mr-1">group_add</span> Invite Members
                        </Link>
                      </div>
                    </div>
                    <div className="bg-surface-container-lowest p-space-md rounded-2xl border border-outline-variant/60 shadow-sm">
                      <h3 className="font-title-md text-title-md text-on-surface mb-3">Category Breakdown</h3>
                      <div className="flex flex-col gap-2">
                        {categories.map((cat) => {
                          const catExpenses = expenses.filter((e) => e.category === cat);
                          const catTotal = catExpenses.reduce((sum, e) => sum + e.amount, 0);
                          const pct = totalSpend > 0 ? Math.round((catTotal / totalSpend) * 100) : 0;
                          return (
                            <div key={cat} className="flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-xl ${getCategoryBg(cat)} flex items-center justify-center shrink-0`}>
                                <span className="material-symbols-outlined text-[18px]">{getCategoryIcon(cat)}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className="font-body-sm text-body-sm text-on-surface truncate">{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                                  <span className="font-body-sm text-body-sm text-on-surface-variant">{formatMoney(catTotal, currency)}</span>
                                </div>
                                <div className="w-full h-1.5 rounded-full bg-surface-container-high overflow-hidden mt-1">
                                  <div className="h-full bg-primary-container rounded-full" style={{ width: `${pct}%` }}></div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="bg-surface-container-lowest p-space-md rounded-2xl border border-outline-variant/60 shadow-sm">
                      <h3 className="font-title-md text-title-md text-on-surface mb-3">Payer Summary</h3>
                      <div className="flex flex-col gap-2">
                        {members.map((m) => {
                          const net = m.net || 0;
                          return (
                            <div key={m.user || m._id} className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-primary text-on-primary font-bold flex items-center justify-center text-body-sm">
                                  {m.name?.slice(0, 2).toUpperCase() || "?"}
                                </div>
                                <span className="font-body-sm text-body-sm text-on-surface">{m.name || "Member"}</span>
                              </div>
                              <div className="text-right">
                                <span className={`font-body-sm font-bold ${net > 0 ? "text-primary" : net < 0 ? "text-error" : "text-on-surface"}`}>
                                  {net >= 0 ? "+" : ""}{formatMoney(net, currency)}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </AppLayout>
  );
}