import { useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";

const inr = (n) => `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const TABS = [
  { id: "all", label: "All Transactions", count: 28, icon: "receipt_long" },
  { id: "personal", label: "Personal Outlays", count: 8, icon: "person" },
  { id: "shared", label: "Shared Group Tabs", count: 18, icon: "groups" },
  { id: "subscriptions", label: "Subscriptions", count: 2, icon: "autorenew" },
];

const TRANSACTIONS = [
  {
    id: 1,
    title: "Palisades Luxury Chalet Rental",
    icon: "villa",
    iconClass: "bg-secondary-fixed-dim text-secondary",
    group: "❄️ Tahoe Ski",
    groupClass: "bg-secondary-fixed text-on-secondary-fixed-variant",
    category: "🏡 Lodging",
    categoryClass: "bg-surface-container-highest text-on-surface-variant",
    date: "Feb 14, 2025",
    paidBy: "Alex Morgan (You)",
    splitNote: "6-way equal tab",
    amount: 99600,
    impact: 83000,
    status: "settled",
    tab: "shared",
    drawer: [
      { name: "Alex (You)", amount: 16600, tag: "Paid" },
      { name: "Marco R.", amount: 16600, tag: "Reimbursed" },
      { name: "Sarah L.", amount: 16600, tag: "Reimbursed" },
      { name: "Taylor E.", amount: 16600, tag: "Reimbursed" },
      { name: "Kim S.", amount: 16600, tag: "Reimbursed" },
      { name: "Chris D.", amount: 16600, tag: "Reimbursed" },
    ],
  },
  {
    id: 2,
    title: "Whole Foods Market Provisioning",
    icon: "shopping_cart",
    iconClass: "bg-tertiary-fixed text-tertiary",
    group: "❄️ Tahoe Ski",
    groupClass: "bg-secondary-fixed text-on-secondary-fixed-variant",
    category: "🛒 Groceries",
    categoryClass: "bg-[#fed7aa]/60 text-[#9a3412]",
    date: "Feb 15, 2025",
    paidBy: "Sarah Lin",
    splitNote: "6 members split",
    amount: 28452.4,
    impact: -4741.79,
    status: "pending",
    tab: "shared",
    drawer: [
      { name: "Alex (You)", amount: 4742.07, tag: "Your share" },
      { name: "Marco R.", amount: 4742.07, tag: "Owes Sarah" },
      { name: "Sarah L.", amount: 4742.07, tag: "Paid" },
      { name: "Taylor E.", amount: 4742.07, tag: "Owes Sarah" },
      { name: "Kim S.", amount: 4742.07, tag: "Owes Sarah" },
      { name: "Chris D.", amount: 4742.07, tag: "Owes Sarah" },
    ],
  },
  {
    id: 3,
    title: "Artisan Sourdough & Williamsburg Brunch",
    icon: "bakery_dining",
    iconClass: "bg-tertiary-fixed-dim text-on-tertiary-fixed-variant",
    group: "🏙️ Brooklyn Loft",
    groupClass: "bg-surface-container-high text-on-surface",
    category: "🍕 Dining",
    categoryClass: "bg-[#fde047]/40 text-[#854d0e]",
    date: "Feb 18, 2025",
    paidBy: "Marco Rossi",
    splitNote: "3-way tab",
    amount: 5353.5,
    impact: -1784.5,
    status: "netting",
    tab: "shared",
    drawer: [
      { name: "Alex (You)", amount: 1784.5, tag: "Offset applied" },
      { name: "Marco R.", amount: 1784.5, tag: "Paid" },
      { name: "Sarah L.", amount: 1784.5, tag: "Offset applied" },
    ],
  },
  {
    id: 4,
    title: "Tokyo Metro 72-Hour Tourist Pass",
    icon: "subway",
    iconClass: "bg-primary-fixed text-primary",
    group: "🌸 Japan Trip",
    groupClass: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
    category: "🚗 Transit",
    categoryClass: "bg-[#e0f2fe] text-[#0369a1]",
    date: "Feb 10, 2025",
    paidBy: "Alex Morgan (You)",
    splitNote: "2 travelers",
    amount: 3984,
    impact: 1992,
    status: "settled",
    tab: "personal",
    drawer: [
      { name: "Alex (You)", amount: 1992, tag: "Paid" },
      { name: "Sarah L.", amount: 1992, tag: "Reimbursed" },
    ],
  },
];

const QUICK_CONTACTS = [
  { initials: "MR", name: "Marco Rossi", avatarClass: "bg-inverse-surface text-inverse-on-surface", owes: 3949.14 },
  { initials: "SL", name: "Sarah Lin", avatarClass: "bg-secondary-container text-on-secondary", owes: 3949.14 },
  { initials: "TE", name: "Taylor Evans", avatarClass: "bg-surface-container-high text-on-surface", owes: 0 },
];

const STATUS_META = {
  settled: { label: "Fully Settled", className: "bg-primary-fixed text-on-primary-fixed", dot: true },
  pending: { label: "Pending Settle", className: "bg-tertiary-fixed text-on-tertiary-fixed-variant", dot: true },
  netting: { label: "Settled via Netting", className: "bg-primary-fixed text-on-primary-fixed", dot: false },
};

export default function Expenses() {
  const [range, setRange] = useState("7D");
  const [tab, setTab] = useState("all");
  const [tabOpen, setTabOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState({ 1: true });
  const [settled, setSettled] = useState({ 1: true, 4: true });
  const [toast, setToast] = useState(null);

  function showToast(title, body) {
    setToast({ title, body });
    setTimeout(() => setToast(null), 3000);
  }

  function toggleExpand(id) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function toggleSettled(id) {
    setSettled((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function copyLink(title) {
    try {
      navigator.clipboard.writeText(`https://tabsy.me/expense/${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`);
    } catch {
      /* clipboard unavailable */
    }
    showToast("Link Copied", `Share link for “${title}” copied to clipboard.`);
  }

  const filtered = TRANSACTIONS.filter((t) => {
    if (tab !== "all" && t.tab !== tab) return false;
    if (query && !t.title.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  return (
    <AppLayout>
      <div className="bg-background font-body-md text-on-surface antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
        <main className="w-full pt-4 bg-background min-h-screen">
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
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-title-md text-xs sm:text-sm font-semibold border border-slate-200 transition-colors"
                  type="button"
                  onClick={() => showToast("Period Selector", "February 2025 ledger view — 28 transactions synced.")}
                >
                  <span className="material-symbols-outlined text-[18px] text-secondary">calendar_month</span>
                  <span>Feb 2025</span>
                </button>
                <button
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-title-md text-xs sm:text-sm font-semibold border border-slate-200 transition-colors"
                  type="button"
                  onClick={() => showToast("Audit Export Prepared", "Cryptographic audit bundle is ready for download.")}
                >
                  <span className="material-symbols-outlined text-[18px] text-secondary">ios_share</span>
                  <span>Export Audit</span>
                </button>
                <Link
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-title-md text-xs sm:text-sm font-semibold shadow-sm transition-all active:scale-[0.98]"
                  to="/group-expenses/add"
                >
                  <span className="material-symbols-outlined text-[18px]">add_circle</span>
                  <span>Add Expense</span>
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
                        <h2 className="font-headline-sm text-headline-sm text-on-surface">Financial Velocity &amp; Shared Burn Rate</h2>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">Live monthly group consumption across 4 circles</p>
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
                        <span className="font-numeric-balance-lg text-numeric-balance-lg text-primary font-bold">+₹26,335.90</span>
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-body-sm font-semibold">
                          <span className="material-symbols-outlined text-[14px]">north_east</span> +8.4% velocity
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 border-l border-outline-variant/40 pl-4">
                      <div>
                        <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider block">Total Burn</span>
                        <span className="font-title-md text-title-md text-on-surface font-semibold">₹4,00,101.50</span>
                      </div>
                      <div>
                        <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider block">Your Capital</span>
                        <span className="font-title-md text-title-md text-on-surface font-semibold">₹1,77,620.00</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 mb-2">
                    <div className="flex items-center justify-between font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                      <span>Category Distribution</span>
                      <span>100% Allocated</span>
                    </div>
                    <div className="w-full h-4 rounded-full bg-surface-container-low flex overflow-hidden p-0.5 gap-0.5">
                      <div className="h-full rounded-full bg-secondary-fixed-dim" style={{ width: "48%" }} title="Lodging: 48%" />
                      <div className="h-full rounded-full bg-tertiary-fixed" style={{ width: "24%" }} title="Dining: 24%" />
                      <div className="h-full rounded-full bg-primary-fixed" style={{ width: "18%" }} title="Activities: 18%" />
                      <div className="h-full rounded-full bg-[#fed7aa]" style={{ width: "10%" }} title="Transit: 10%" />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-surface-container-low">
                  {[
                    { label: "Lodging", dot: "bg-secondary", box: "bg-secondary-fixed/50", text: "text-on-secondary-fixed-variant", pct: "48%", val: "₹1,92,049" },
                    { label: "Dining", dot: "bg-tertiary", box: "bg-tertiary-fixed/60", text: "text-on-tertiary-fixed-variant", pct: "24%", val: "₹96,024" },
                    { label: "Activities", dot: "bg-primary", box: "bg-primary-fixed/60", text: "text-on-primary-fixed-variant", pct: "18%", val: "₹72,018" },
                    { label: "Transit", dot: "bg-[#f97316]", box: "bg-[#fed7aa]/50", text: "text-[#9a3412]", pct: "10%", val: "₹40,010" },
                  ].map((c) => (
                    <div key={c.label} className={`p-2.5 rounded-2xl ${c.box}`}>
                      <div className={`flex items-center gap-1.5 font-label-caps text-label-caps ${c.text}`}>
                        <span className={`w-2 h-2 rounded-full ${c.dot}`} /> {c.label}
                      </div>
                      <div className="font-title-md text-title-md text-on-surface font-bold mt-0.5">
                        {c.pct} <span className="text-body-sm font-normal text-outline">({c.val})</span>
                      </div>
                    </div>
                  ))}
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
                    <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant text-[11px] font-bold">5 LOOP SQUASHED</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
                    Tabsy netted circular IOUs between you, Marco, and Sarah. You eliminated 5 cross-payments down to just 2 direct settlements.
                  </p>
                  <div className="p-2 bg-surface-container-low rounded-2xl mb-4 space-y-2">
                    {[
                      { name: "Marco Rossi", initials: "MR", avatar: "bg-inverse-surface text-inverse-on-surface", amount: 15288.6 },
                      { name: "Sarah Lin", initials: "SL", avatar: "bg-secondary-container text-on-secondary", amount: 11047.3 },
                    ].map((r) => (
                      <div key={r.name} className="flex items-center justify-between bg-surface-container-lowest px-3 py-2 rounded-xl border border-surface-container">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-[10px] text-on-primary font-bold">AM</div>
                          <span className="font-title-md text-body-sm text-on-surface font-semibold">Alex (You)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-primary font-numeric-balance-md text-body-sm font-bold">receives {inr(r.amount)}</span>
                          <span className="material-symbols-outlined text-primary text-[18px]">arrow_forward</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-body-sm text-on-surface font-medium">{r.name}</span>
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${r.avatar}`}>{r.initials}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2 pt-2 border-t border-surface-container-low">
                  <div className="flex items-center justify-between text-body-sm">
                    <span className="text-outline flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-primary">verified</span> Fees Avoided: <strong>₹1,228.40</strong>
                    </span>
                    <span className="text-primary font-bold text-xs uppercase tracking-wider">Ready to Settle</span>
                  </div>
                  <button
                    className="w-full py-2.5 px-4 rounded-2xl bg-secondary text-on-secondary font-title-md text-title-md font-semibold hover:bg-secondary-container transition-all flex items-center justify-center gap-2 shadow-sm"
                    type="button"
                    onClick={() => showToast("Settlement Engine Running", "Compressing bilateral graph across 4 circles…")}
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
                        {(TABS.find((t) => t.id === tab) ?? TABS[0]).label} ({(TABS.find((t) => t.id === tab) ?? TABS[0]).count})
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
                                  {t.label} <span className="text-outline font-normal">({t.count})</span>
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
                    <span>Expense Item &amp; Group Origin</span>
                    <span>Split &amp; Inline Actions</span>
                  </div>

                  {filtered.length === 0 && (
                    <div className="py-10 text-center text-on-surface-variant font-body-sm text-body-sm">
                      No transactions match this view.
                    </div>
                  )}

                  {filtered.map((t) => {
                    const isExpanded = !!expanded[t.id];
                    const isSettled = !!settled[t.id];
                    const status = isSettled ? STATUS_META.settled : STATUS_META[t.status] ?? STATUS_META.pending;
                    return (
                      <div
                        key={t.id}
                        className="p-4 rounded-2xl bg-surface-container-low/40 hover:bg-surface-container-low transition-colors border border-transparent hover:border-surface-container space-y-2"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-start gap-3 min-w-0">
                            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5 ${t.iconClass}`}>
                              <span className="material-symbols-outlined text-[22px]">{t.icon}</span>
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <Link className="font-title-md text-title-md text-on-surface font-semibold hover:text-primary transition-colors" to="/expense-details">
                                  {t.title}
                                </Link>
                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${t.groupClass}`}>
                                  {t.group}
                                </span>
                                <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${t.categoryClass}`}>{t.category}</span>
                              </div>
                              <div className="flex items-center gap-2 text-body-sm text-outline mt-0.5 flex-wrap">
                                <span>{t.date}</span>
                                <span>•</span>
                                <span>
                                  Paid by <strong className="text-on-surface font-medium">{t.paidBy}</strong>
                                </span>
                                <span>•</span>
                                <span>{t.splitNote}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-center">
                            <div className="font-numeric-balance-md text-numeric-balance-md text-on-surface font-bold">{inr(t.amount)}</div>
                            <div className="text-right">
                              <span className={`font-numeric-balance-md text-body-sm font-bold ${t.impact >= 0 ? "text-primary" : "text-tertiary"}`}>
                                {t.impact >= 0 ? "+" : "−"}{inr(Math.abs(t.impact))}
                              </span>
                              <span className="text-[11px] text-outline block">{t.impact >= 0 ? "owed to you" : "your share"}</span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-surface-container flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <button
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-surface-container-lowest text-on-surface text-body-sm hover:bg-surface-container border border-surface-container transition-colors"
                              type="button"
                              onClick={() => toggleExpand(t.id)}
                            >
                              <span className="material-symbols-outlined text-[16px] text-outline">{isExpanded ? "expand_less" : "expand_more"}</span>
                              <span className="font-semibold text-xs">{isExpanded ? "Itemized Split" : "Expand Split"}</span>
                            </button>
                            <Link
                              to="/split-expense"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-surface-container-lowest text-on-surface text-body-sm hover:bg-surface-container border border-surface-container transition-colors"
                              title="Adjust split"
                            >
                              <span className="material-symbols-outlined text-[15px] text-outline">tune</span>
                              <span className="text-xs">Adjust Split</span>
                            </Link>
                            <Link
                              to="/group-members/manage"
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
                            {!isSettled && t.impact < 0 && (
                              <button
                                className="px-2.5 py-1 rounded-xl bg-tertiary text-on-tertiary text-xs font-semibold hover:opacity-90 transition-opacity"
                                type="button"
                                onClick={() => showToast("Payment Initiated", `Paying ${inr(Math.abs(t.impact))} for ${t.title}…`)}
                              >
                                Pay {inr(Math.abs(t.impact))}
                              </button>
                            )}
                            <span className="text-body-sm text-outline text-xs">Settlement status:</span>
                            <button
                              aria-label="Toggle settlement status"
                              className={`w-9 h-5 rounded-full relative p-0.5 transition-colors inline-flex items-center ${isSettled ? "bg-primary" : "bg-surface-container-highest"}`}
                              type="button"
                              onClick={() => toggleSettled(t.id)}
                            >
                              <span
                                className={`w-4 h-4 bg-surface-container-lowest rounded-full block transition-transform ${isSettled ? "translate-x-4" : "translate-x-0"}`}
                              />
                            </button>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="p-2 bg-surface-container-lowest rounded-xl border border-surface-container grid grid-cols-2 sm:grid-cols-6 gap-2">
                            {t.drawer.map((d) => (
                              <div key={d.name} className="text-center p-1.5 bg-surface-container-low rounded-lg">
                                <span className="text-[10px] text-outline uppercase block font-bold">{d.name}</span>
                                <span className="text-body-sm font-semibold text-on-surface">{inr(d.amount)}</span>
                                <span className="text-[10px] text-primary block">{d.tag}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <div className="p-4 bg-surface-container-low rounded-2xl border border-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-3 mt-2">
                    <div className="font-body-sm text-body-sm text-on-surface-variant">
                      Displaying <strong className="text-on-surface">{filtered.length}</strong> of <strong className="text-on-surface">28</strong> live transactions
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
                    <span className="text-[11px] font-bold text-outline">3 CONTACTS</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Live bilateral balances calculated after circular netting reduction.
                  </p>
                  {QUICK_CONTACTS.map((c) => {
                    const settledContact = c.owes === 0;
                    return (
                      <div
                        key={c.name}
                        className={`p-3 rounded-2xl flex items-center justify-between gap-3 border ${
                          settledContact ? "bg-surface-container-low/60 border-transparent" : "bg-surface-container-low border-surface-container"
                        }`}
                      >
                        <div className={`flex items-center gap-2.5 ${settledContact ? "opacity-80" : ""}`}>
                          <div className={`w-9 h-9 rounded-2xl flex items-center justify-center text-xs font-bold ${c.avatarClass}`}>{c.initials}</div>
                          <div>
                            <span className="font-title-md text-body-sm text-on-surface font-semibold block">{c.name}</span>
                            {settledContact ? (
                              <span className="text-xs text-outline flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px] text-primary">check_circle</span> All squared up
                              </span>
                            ) : (
                              <span className="text-xs text-primary font-medium flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary-container" /> Owes you {inr(c.owes)}
                              </span>
                            )}
                          </div>
                        </div>
                        {settledContact ? (
                          <span className="px-2.5 py-1 rounded-xl bg-surface-container text-outline text-[11px] font-semibold">Settled</span>
                        ) : (
                          <button
                            className="px-3 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container transition-colors shadow-xs"
                            type="button"
                            onClick={() => showToast("Reminder Sent", `Payment request dispatched to ${c.name}.`)}
                          >
                            Request
                          </button>
                        )}
                      </div>
                    );
                  })}
                  <div className="p-3 rounded-2xl bg-secondary-fixed/40 border border-secondary-fixed text-center space-y-1">
                    <span className="text-xs font-bold text-secondary block">One-Tap Group Reminder</span>
                    <p className="text-[11px] text-on-surface-variant">Send a gentle pastel ping to Sarah and Marco simultaneously.</p>
                    <button
                      className="mt-1 w-full py-1.5 rounded-xl bg-secondary text-on-secondary text-xs font-semibold hover:bg-secondary-container transition-colors"
                      type="button"
                      onClick={() => showToast("Group Ping Dispatched", "Tabsy bot nudged Marco and Sarah via push + SMS.")}
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