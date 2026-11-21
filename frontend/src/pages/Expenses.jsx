import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import { expenseService, balanceService } from "../services";

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

const TABS = [
  { id: "all", label: "All Transactions", icon: "receipt_long" },
  { id: "personal", label: "Personal Outlays", icon: "person" },
  { id: "shared", label: "Shared Group Tabs", icon: "groups" },
  { id: "subscriptions", label: "Subscriptions", icon: "autorenew" },
];

const STATUS_META = {
  settled: { label: "Fully Settled", className: "bg-primary-fixed text-on-primary-fixed", dot: true },
  pending: { label: "Pending Settle", className: "bg-tertiary-fixed text-on-tertiary-fixed-variant", dot: true },
  partial: { label: "Partially Settled", className: "bg-primary-fixed text-on-primary-fixed", dot: false },
};

export default function Expenses() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [balances, setBalances] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [range, setRange] = useState("7D");
  const [tab, setTab] = useState("all");
  const [tabOpen, setTabOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState({});
  const [settled, setSettled] = useState({});
  const [toast, setToast] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [exp, bal] = await Promise.all([
        expenseService.listAll(),
        balanceService.overview(),
      ]);
      setTransactions(exp || []);
      setBalances(bal);
    } catch (err) {
      setError(err?.response?.data?.error?.message || "Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (title, body) => {
    setToast({ title, body });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSettled = (id) => {
    setSettled((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyLink = (title) => {
    try {
      navigator.clipboard.writeText(`https://tabsy.me/expense/${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`);
    } catch {
      /* clipboard unavailable */
    }
    showToast("Link Copied", `Share link for "${title}" copied to clipboard.`);
  };

  // Compute category distribution
  const categoryDistribution = useMemo(() => {
    const dist = {};
    transactions.forEach((t) => {
      const cat = t.category || "Other";
      dist[cat] = (dist[cat] || 0) + t.amount;
    });
    const total = Object.values(dist).reduce((a, b) => a + b, 0);
    return Object.entries(dist).map(([label, val]) => ({
      label,
      val: formatMoney(val),
      pct: total > 0 ? Math.round((val / total) * 100) + "%" : "0%",
    }));
  }, [transactions]);

  const filtered = transactions
    .filter((t) => {
      if (tab !== "all" && t.tab !== tab) return false;
      if (query && !t.title.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // Compute quick contacts from balances
  const quickContacts = useMemo(() => {
    if (!balances?.peers) return [];
    return balances.peers
      .filter((p) => p.net > 0) // People who owe you
      .slice(0, 5)
      .map((p) => ({
        name: p.name,
        initials: p.name?.slice(0, 2).toUpperCase() || "?",
        owes: p.net,
        avatarClass: "bg-primary text-on-primary",
      }));
  }, [balances]);

  if (loading) {
    return (
      <AppLayout>
        <div className="bg-background font-body-md text-on-surface antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
          <main className="w-full pt-4 bg-background min-h-screen">
            <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-lowest p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-label-caps font-semibold tracking-wide uppercase mb-1 border border-emerald-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Live Expense Intelligence</span>
                  </div>
                  <h1 className="font-headline-lg text-2xl lg:text-3xl font-bold text-on-surface tracking-tight">
                    All Expenses
                  </h1>
                </div>
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
        <div className="bg-background font-body-md text-on-surface antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
          <main className="w-full pt-4 bg-background min-h-screen">
            <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
              <div className="px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">{error}</div>
            </div>
          </main>
        </div>
      </AppLayout>
    );
  }

  const totalBurn = transactions.reduce((sum, t) => sum + t.amount, 0);
  const netPosition = balances?.netBalance || 0;
  const yourCapital = balances?.yourCapital || 0;

  return (
    <AppLayout>
      <div className="bg-[#FAF8F5] font-body-md text-on-surface antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
        <main className="w-full pt-4 bg-[#FAF8F5] min-h-screen">
          <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
            {/* Studio Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-lowest p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-label-caps font-semibold tracking-wide uppercase mb-1 border border-emerald-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Live Expense Intelligence</span>
                </div>
                <h1 className="font-headline-lg text-2xl lg:text-3xl font-bold text-on-surface tracking-tight">
                  All Expenses
                </h1>
                <p className="font-body-md text-sm text-on-surface-variant mt-0.5">
                  Every outlay across your circles — split, settled, and receipt-verified in one live feed.
                </p>
              </div>
              <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
                <button
                  className="group inline-flex items-center justify-center h-11 w-11 hover:w-auto hover:px-4 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-title-md text-xs sm:text-sm font-semibold border border-slate-200 overflow-hidden whitespace-nowrap transition-all duration-300 ease-out active:scale-95"
                  title="Feb 2025"
                  type="button"
                  onClick={() => showToast("Period Selector", `${range} ledger view — ${transactions.length} transactions synced.`)}
                >
<<<<<<< HEAD
                  <span className="material-symbols-outlined text-[18px] text-secondary shrink-0">calendar_month</span>
                  <span className="max-w-0 opacity-0 group-hover:max-w-[10rem] group-hover:opacity-100 group-hover:ml-2 transition-all duration-300 ease-out overflow-hidden">Feb 2025</span>
=======
                  <span className="material-symbols-outlined text-[18px] text-secondary">calendar_month</span>
                  <span>{range}</span>
>>>>>>> 7d94a7acf451afb31a2d657ed33b3d9084c6be7d
                </button>
                <button
                  className="group inline-flex items-center justify-center h-11 w-11 hover:w-auto hover:px-4 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-title-md text-xs sm:text-sm font-semibold border border-slate-200 overflow-hidden whitespace-nowrap transition-all duration-300 ease-out active:scale-95"
                  title="Export Audit"
                  type="button"
                  onClick={() => showToast("Audit Export Prepared", "Cryptographic audit bundle is ready for download.")}
                >
                  <span className="material-symbols-outlined text-[18px] text-secondary shrink-0">ios_share</span>
                  <span className="max-w-0 opacity-0 group-hover:max-w-[10rem] group-hover:opacity-100 group-hover:ml-2 transition-all duration-300 ease-out overflow-hidden">Export Audit</span>
                </button>
                <Link
<<<<<<< HEAD
                  className="group inline-flex items-center justify-center h-11 w-11 hover:w-auto hover:px-4 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-title-md text-xs sm:text-sm font-semibold border border-slate-200 overflow-hidden whitespace-nowrap transition-all duration-300 ease-out active:scale-95"
                  to="/recurring-expenses"
                  title="Recurring"
=======
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-title-md text-xs sm:text-sm font-semibold shadow-sm transition-all active:scale-[0.98]"
                  to="/group-expenses/add"
                  state={{ groupId: transactions[0]?.group }}
>>>>>>> 7d94a7acf451afb31a2d657ed33b3d9084c6be7d
                >
                  <span className="material-symbols-outlined text-[18px] text-secondary shrink-0">autorenew</span>
                  <span className="max-w-0 opacity-0 group-hover:max-w-[10rem] group-hover:opacity-100 group-hover:ml-2 transition-all duration-300 ease-out overflow-hidden">Recurring</span>
                </Link>
                <Link
                  className="group inline-flex items-center justify-center h-11 w-11 hover:w-auto hover:px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-title-md text-xs sm:text-sm font-semibold shadow-sm overflow-hidden whitespace-nowrap transition-all duration-300 ease-out active:scale-95"
                  to="/group-expenses/add"
                  title="Add Expense"
                >
                  <span className="material-symbols-outlined text-[18px] shrink-0">add_circle</span>
                  <span className="max-w-0 opacity-0 group-hover:max-w-[10rem] group-hover:opacity-100 group-hover:ml-2 transition-all duration-300 ease-out overflow-hidden">Add Expense</span>
                </Link>
              </div>
            </div>

            {/* Section A: Bento Deck */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
              <div className="lg:col-span-7 bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-surface-container-low flex flex-col justify-between">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-[22px]">insights</span>
                      </div>
                      <div>
                        <h2 className="font-headline-sm text-headline-sm text-on-surface">Financial Velocity & Shared Burn Rate</h2>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">Live monthly group consumption across all circles</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 p-1 bg-surface-container-low rounded-xl self-start sm:self-auto">
                      {["7D", "30D", "Season", "All Time"].map((r) => (
                        <button
                          key={r}
                          className={`px-2.5 py-1 rounded-lg text-body-sm transition-colors ${
                            range === r ? "font-semibold bg-surface-container-lowest text-on-surface shadow-xs" : "font-medium text-on-surface-variant hover:text-on-surface"
                          }`}
                          type="button"
                          onClick={() => {
                            setRange(r);
                            showToast("Range Updated", `Burn-rate chart set to ${r}.`);
                          }}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-surface-container-low mb-4 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider block">Tabsy Net Position</span>
                      <div className="flex items-baseline gap-2">
                        <span className="font-numeric-balance-lg text-numeric-balance-lg text-primary font-bold">
                          {netPosition >= 0 ? "+" : ""}{formatMoney(Math.abs(netPosition))}
                        </span>
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-body-sm font-semibold">
                          <span className="material-symbols-outlined text-[14px]">north_east</span> +8.4% velocity
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 border-l border-outline-variant/40 pl-4">
                      <div>
                        <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider block">Total Burn</span>
                        <span className="font-title-md text-title-md text-on-surface font-semibold">{formatMoney(totalBurn)}</span>
                      </div>
                      <div>
                        <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider block">Your Capital</span>
                        <span className="font-title-md text-title-md text-on-surface font-semibold">{formatMoney(yourCapital)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 mb-2">
                    <div className="flex items-center justify-between font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                      <span>Category Distribution</span>
                      <span>100% Allocated</span>
                    </div>
                    <div className="w-full h-4 rounded-full bg-surface-container-low flex overflow-hidden p-0.5 gap-0.5">
                      {categoryDistribution.map((c, idx) => (
                        <div key={c.label} className="h-full rounded-full" style={{ width: c.pct, backgroundColor: ["#e1e0ff", "#ffe0b2", "#bbdefb", "#f8bbd0"][idx % 4] }} title={`${c.label}: ${c.pct}`} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-surface-container-low">
                  {categoryDistribution.map((c, idx) => {
                    const colors = [
                      { dot: "bg-secondary", box: "bg-secondary-fixed/50", text: "text-on-secondary-fixed-variant" },
                      { dot: "bg-tertiary", box: "bg-tertiary-fixed/60", text: "text-on-tertiary-fixed-variant" },
                      { dot: "bg-primary", box: "bg-primary-fixed/60", text: "text-on-primary-fixed-variant" },
                      { dot: "bg-[#f97316]", box: "bg-[#fed7aa]/50", text: "text-[#9a3412]" },
                    ];
                    const color = colors[idx % colors.length];
                    return (
                      <div key={c.label} className={`p-2.5 rounded-2xl ${color.box}`}>
                        <div className={`flex items-center gap-1.5 font-label-caps text-label-caps ${color.text}`}>
                          <span className={`w-2 h-2 rounded-full ${color.dot}`} /> {c.label}
                        </div>
                        <div className="font-title-md text-title-md text-on-surface font-bold mt-0.5">
                          {c.pct} <span className="text-body-sm font-normal text-outline">({c.val})</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="lg:col-span-5 bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-surface-container-low flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-secondary-fixed flex items-center justify-center text-secondary">
                        <span className="material-symbols-outlined text-[22px]">hub</span>
                      </div>
                      <div>
                        <h2 className="font-headline-sm text-headline-sm text-on-surface">Smart Debt Netting</h2>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">Bilateral graph compression engine</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant text-[11px] font-bold">
                      {balances?.settlementsReduced || 0} LOOP SQUASHED
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
                    Tabsy netted circular IOUs across your groups. You eliminated cross-payments down to direct settlements.
                  </p>
                  <div className="p-2 bg-surface-container-low rounded-2xl mb-4 space-y-2">
                    {quickContacts.map((r) => (
                      <div key={r.name} className="flex items-center justify-between bg-surface-container-lowest px-3 py-2 rounded-xl border border-surface-container">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-[10px] text-on-primary font-bold">AM</div>
                          <span className="font-title-md text-body-sm text-on-surface font-semibold">You</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-primary font-numeric-balance-md text-body-sm font-bold">receives {formatMoney(r.owes)}</span>
                          <span className="material-symbols-outlined text-primary text-[18px]">arrow_forward</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-body-sm text-on-surface font-medium">{r.name}</span>
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${r.avatarClass}`}>{r.initials}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2 pt-2 border-t border-surface-container-low">
                  <div className="flex items-center justify-between text-body-sm">
                    <span className="text-outline flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-primary">verified</span> Fees Avoided: <strong>{formatMoney(balances?.feesAvoided || 0)}</strong>
                    </span>
                    <span className="text-primary font-bold text-xs uppercase tracking-wider">Ready to Settle</span>
                  </div>
                  <button
                    className="w-full py-2.5 px-4 rounded-2xl bg-secondary text-on-secondary font-title-md text-title-md font-semibold hover:bg-secondary-container transition-all flex items-center justify-center gap-2 shadow-sm"
                    type="button"
                    onClick={() => showToast("Settlement Engine Running", "Compressing bilateral graph across all circles…")}
                  >
                    <span className="material-symbols-outlined text-[18px]">account_tree</span>
                    <span>Run Global Balance Settlement</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Section B: Feed + Quick Settle Rail */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-3.5">
              <div className="xl:col-span-8 flex flex-col gap-4">
                <div className="bg-surface-container-lowest p-2 rounded-3xl shadow-sm border border-surface-container-low flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div className="relative">
                    <button
                      aria-expanded={tabOpen}
                      aria-haspopup="listbox"
                      aria-label="Filter transactions by category"
                      className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-title-md text-body-md transition-colors"
                      type="button"
                      onClick={() => setTabOpen((v) => !v)}
                    >
                      <span className="material-symbols-outlined text-[18px] text-primary">{(TABS.find((t) => t.id === tab) ?? TABS[0]).icon}</span>
                      <span>
                        {(TABS.find((t) => t.id === tab) ?? TABS[0]).label} ({(TABS.find((t) => t.id === tab) ?? TABS[0]).count || filtered.length})
                      </span>
                      <span className={`material-symbols-outlined text-[18px] text-outline transition-transform duration-200 ${tabOpen ? "rotate-180" : ""}`}>
                        expand_more
                      </span>
                    </button>
                    {tabOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setTabOpen(false)} />
                        <div
                          className="absolute left-0 top-full mt-1 z-50 min-w-[240px] bg-surface-container-lowest border border-surface-container-high rounded-xl shadow-lg shadow-zinc-900/10 p-1 flex flex-col gap-0.5"
                          role="listbox"
                        >
                          {TABS.map((t) => {
                            const active = t.id === tab;
                            return (
                              <button
                                key={t.id}
                                aria-selected={active}
                                className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-left text-[12px] font-medium transition-all ${
                                  active
                                    ? "bg-primary-fixed/40 text-on-primary-fixed"
                                    : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                                }`}
                                role="option"
                                type="button"
                                onClick={() => {
                                  setTab(t.id);
                                  setTabOpen(false);
                                }}
                              >
                                <span className="material-symbols-outlined text-[16px] shrink-0">{t.icon}</span>
                                <span className="flex-1">
                                  {t.label} <span className="text-outline font-normal">({t.count || 0})</span>
                                </span>
                                {active && <span className="material-symbols-outlined text-[16px] text-primary shrink-0">check</span>}
                              </button>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1 md:w-56">
                      <input
                        className="w-full bg-surface-container-low pl-8 pr-3 py-1.5 rounded-xl text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="Filter feed…"
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                      />
                      <span className="material-symbols-outlined text-[16px] text-outline absolute left-2.5 top-2">search</span>
                    </div>
                    <button
                      aria-label="Filter columns"
                      className="p-2 rounded-xl bg-surface-container-low text-on-surface hover:bg-surface-container transition-colors"
                      type="button"
                      onClick={() => showToast("Column Filters", "Toggle category, group, and status columns.")}
                    >
                      <span className="material-symbols-outlined text-[18px]">tune</span>
                    </button>
                  </div>
                </div>

                <div className="bg-surface-container-lowest rounded-3xl p-4 shadow-sm border border-surface-container-low space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-surface-container-low text-on-surface-variant font-label-caps text-label-caps uppercase tracking-wider">
                    <span>Expense Item & Group Origin</span>
                    <span>Split & Inline Actions</span>
                  </div>

                  {filtered.length === 0 && (
                    <div className="py-10 text-center text-on-surface-variant font-body-sm text-body-sm">
                      No transactions match this view.
                    </div>
                  )}

                  {filtered.map((t) => {
                    const isExpanded = !!expanded[t._id || t.id];
                    const isSettled = !!settled[t._id || t.id];
                    const status = isSettled ? STATUS_META.settled : STATUS_META[t.status] ?? STATUS_META.pending;
                    const net = t.net || 0;
                    const paidByYou = t.paidBy === balances?.userId;
                    const impact = paidByYou ? t.amount - (t.share || 0) : -(t.share || 0);
                    const splits = t.splits || [];

                    return (
                      <div
                        key={t._id || t.id}
                        className="p-4 rounded-2xl bg-surface-container-low/40 hover:bg-surface-container-low transition-colors border border-transparent hover:border-surface-container space-y-2"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-start gap-3 min-w-0">
                            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5 ${getCategoryBg(t.category)}`}>
                              <span className="material-symbols-outlined text-[22px]">{getCategoryIcon(t.category)}</span>
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <Link className="font-title-md text-title-md text-on-surface font-semibold hover:text-primary transition-colors" to="/expense-details" state={{ expenseId: t._id || t.id }}>
                                  {t.title}
                                </Link>
                                {t.group && (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-surface-container-high text-on-surface-variant">
                                    {t.group}
                                  </span>
                                )}
                                <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-surface-container-highest text-on-surface-variant">{t.category}</span>
                              </div>
                              <div className="flex items-center gap-2 text-body-sm text-outline mt-0.5 flex-wrap">
                                <span>{new Date(t.date).toLocaleDateString()}</span>
                                <span>•</span>
                                <span>
                                  Paid by <strong className="text-on-surface font-medium">{t.paidByName || (paidByYou ? "You" : "Someone")}</strong>
                                </span>
                                <span>•</span>
                                <span>Split {splits.length} ways</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-center">
                            <div className="font-numeric-balance-md text-numeric-balance-md text-on-surface font-bold">{formatMoney(t.amount)}</div>
                            <div className="text-right">
                              <span className={`font-numeric-balance-md text-body-sm font-bold ${impact >= 0 ? "text-primary" : "text-tertiary"}`}>
                                {impact >= 0 ? "+" : "−"}{formatMoney(Math.abs(impact))}
                              </span>
                              <span className="text-[11px] text-outline block">{impact >= 0 ? "owed to you" : "your share"}</span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-surface-container flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <button
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-surface-container-lowest text-on-surface text-body-sm hover:bg-surface-container border border-surface-container transition-colors"
                              type="button"
                              onClick={() => toggleExpand(t._id || t.id)}
                            >
                              <span className="material-symbols-outlined text-[16px] text-outline">{isExpanded ? "expand_less" : "expand_more"}</span>
                              <span className="font-semibold text-xs">{isExpanded ? "Itemized Split" : "Expand Split"}</span>
                            </button>
                            <Link
                              to="/split-expense"
                              state={{ expenseId: t._id || t.id }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-surface-container-lowest text-on-surface text-body-sm hover:bg-surface-container border border-surface-container transition-colors"
                              title="Adjust split"
                            >
                              <span className="material-symbols-outlined text-[15px] text-outline">tune</span>
                              <span className="text-xs">Adjust Split</span>
                            </Link>
                            <Link
                              to="/group-members/manage"
                              state={{ groupId: t.group }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-surface-container-lowest text-on-surface text-body-sm hover:bg-surface-container border border-surface-container transition-colors"
                              title="Manage participants"
                            >
                              <span className="material-symbols-outlined text-[15px] text-outline">group</span>
                              <span className="text-xs">Participants</span>
                            </Link>
                            <button
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-surface-container-lowest text-on-surface text-body-sm hover:bg-surface-container border border-surface-container transition-colors"
                              type="button"
                              onClick={() => copyLink(t.title)}
                              title="Copy share link"
                            >
                              <span className="material-symbols-outlined text-[15px] text-outline">link</span>
                              <span className="text-xs">Copy Link</span>
                            </button>
                            <button
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-surface-container-lowest text-on-surface text-body-sm hover:bg-surface-container border border-surface-container transition-colors"
                              type="button"
                              onClick={() => showToast("Receipt Downloaded", `${t.title} — cryptographic receipt PDF exported.`)}
                            >
                              <span className="material-symbols-outlined text-[15px] text-outline">receipt_long</span>
                              <span className="text-xs">Receipt PDF</span>
                            </button>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${status.className}`}>
                              {status.dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
                              {status.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {!isSettled && impact < 0 && (
                              <button
                                className="px-2.5 py-1 rounded-xl bg-tertiary text-on-tertiary text-xs font-semibold hover:opacity-90 transition-opacity"
                                type="button"
                                onClick={() => showToast("Payment Initiated", `Paying ${formatMoney(Math.abs(impact))} for ${t.title}…`)}
                              >
                                Pay {formatMoney(Math.abs(impact))}
                              </button>
                            )}
                            <span className="text-body-sm text-outline text-xs">Settlement status:</span>
                            <button
                              aria-label="Toggle settlement status"
                              className={`w-9 h-5 rounded-full relative p-0.5 transition-colors inline-flex items-center ${isSettled ? "bg-primary" : "bg-surface-container-highest"}`}
                              type="button"
                              onClick={() => toggleSettled(t._id || t.id)}
                            >
                              <span
                                className={`w-4 h-4 bg-surface-container-lowest rounded-full block transition-transform ${isSettled ? "translate-x-4" : "translate-x-0"}`}
                              />
                            </button>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="p-2 bg-surface-container-lowest rounded-xl border border-surface-container grid grid-cols-2 sm:grid-cols-6 gap-2">
                            {splits.map((d) => (
                              <div key={d.user} className="text-center p-1.5 bg-surface-container-low rounded-lg">
                                <span className="text-[10px] text-outline uppercase block font-bold">{d.name || d.user.slice(0, 2).toUpperCase()}</span>
                                <span className="text-body-sm font-semibold text-on-surface">{formatMoney(d.share)}</span>
                                <span className="text-[10px] text-primary block">{d.user === balances?.userId ? "Your share" : "Owes"}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <div className="p-4 bg-surface-container-low rounded-2xl border border-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-3 mt-2">
                    <div className="font-body-sm text-body-sm text-on-surface-variant">
                      Displaying <strong className="text-on-surface">{filtered.length}</strong> of <strong className="text-on-surface">{transactions.length}</strong> live transactions
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        aria-label="Previous page"
                        className="w-8 h-8 rounded-xl bg-surface-container text-outline flex items-center justify-center transition-colors disabled:opacity-40"
                        disabled
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                      </button>
                      {[1, 2, 3].map((p) => (
                        <button
                          key={p}
                          className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center transition-colors ${
                            p === 1 ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface-variant hover:text-on-surface"
                          }`}
                          type="button"
                          onClick={() => showToast("Page Loaded", `Showing page ${p} of the ledger.`)}
                        >
                          {p}
                        </button>
                      ))}
                      <button
                        aria-label="Next page"
                        className="w-8 h-8 rounded-xl bg-surface-container text-outline hover:text-on-surface flex items-center justify-center transition-colors"
                        type="button"
                        onClick={() => showToast("Page Loaded", "Next ledger page fetched.")}
                      >
                        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="xl:col-span-4 flex flex-col gap-4">
                <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-surface-container-low space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-[18px]">payments</span>
                      </div>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface">Quick Settle Rail</h3>
                    </div>
                    <span className="text-[11px] font-bold text-outline">{quickContacts.length} CONTACTS</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Live bilateral balances calculated after circular netting reduction.
                  </p>
                  {quickContacts.length > 0 ? (
                    quickContacts.map((c) => (
                      <div
                        key={c.name}
                        className="p-3 rounded-2xl flex items-center justify-between gap-3 border bg-surface-container-low border-surface-container"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-9 h-9 rounded-2xl flex items-center justify-center text-xs font-bold ${c.avatarClass}`}>{c.initials}</div>
                          <div>
                            <span className="font-title-md text-body-sm text-on-surface font-semibold block">{c.name}</span>
                            <span className="text-xs text-primary font-medium flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary-container" /> Owes you {formatMoney(c.owes)}
                            </span>
                          </div>
                        </div>
                        <button
                          className="px-3 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container transition-colors shadow-xs"
                          type="button"
                          onClick={() => showToast("Reminder Sent", `Payment request dispatched to ${c.name}.`)}
                        >
                          Request
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 rounded-2xl bg-surface-container-low border border-surface-container text-center text-on-surface-variant">
                      All settled up! No one owes you.
                    </div>
                  )}
                  <div className="p-3 rounded-2xl bg-secondary-fixed/40 border border-secondary-fixed text-center space-y-1">
                    <span className="text-xs font-bold text-secondary block">One-Tap Group Reminder</span>
                    <p className="text-[11px] text-on-surface-variant">Send a gentle pastel ping to contacts who owe you.</p>
                    <button
                      className="mt-1 w-full py-1.5 rounded-xl bg-secondary text-on-secondary text-xs font-semibold hover:bg-secondary-container transition-colors"
                      type="button"
                      onClick={() => showToast("Group Ping Dispatched", "Tabsy bot nudged contacts via push + SMS.")}
                    >
                      Send Ping via Tabsy Bot
                    </button>
                  </div>
                </div>

                <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-surface-container-low space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                    <h4 className="font-title-md text-body-md text-on-surface font-bold">Ledger Integrity Node</h4>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Every receipt split is verified with Merkle root consensus. Zero reconciliation disputes.
                  </p>
                  <div className="p-2.5 bg-surface-container-low rounded-xl font-mono text-[11px] text-outline flex items-center justify-between gap-2">
                    <span>Hash: 0x8f2a…c4e9</span>
                    <span className="text-primary font-semibold shrink-0">BLOCK #94,821</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {toast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-inverse-surface text-inverse-on-surface px-4 py-2 rounded-full font-body-sm text-body-sm shadow-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-primary-fixed">check</span>
            <div className="flex flex-col">
              <span className="font-semibold">{toast.title}</span>
              <span className="text-[11px] opacity-80">{toast.body}</span>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}