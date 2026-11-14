import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import Breadcrumbs from "../components/layout/Breadcrumbs";
import { BALANCES_TABS } from "../constants/balancesNav";

const inr = (n) => `₹${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const inr0 = (n) => `₹${Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

const FRIENDS = [
  { id: "sarah", name: "Sarah Lin", initials: "SL", dir: "owe", amount: 4648, group: "Brooklyn Loft #4B", groupCls: "bg-surface-container text-on-surface-variant", sub: "ConEd & Grocery run", due: "Due in 3d", dueSoon: true, avatar: "bg-peach-100 text-peach-700", ring: "ring-peach-200", dot: "bg-tertiary-container", netted: false },
  { id: "marcus", name: "Marcus Vance", initials: "MV", dir: "owed", amount: 10665.5, group: "Tahoe Ski Trip", groupCls: "bg-matcha-100 text-matcha-800", sub: "Cabin deposit & ski pass", meta: "Updated 2h ago", avatar: "bg-matcha-100 text-matcha-800", ring: "ring-matcha-200", dot: "bg-primary-container", netted: true },
  { id: "jason", name: "Jason Wu", initials: "JW", dir: "owe", amount: 9462, group: "Utilities", groupCls: "bg-surface-container text-on-surface-variant", sub: "Gigabit Fiber & Water bill", due: "Due in 5d", avatar: "bg-peach-100 text-peach-700", ring: "ring-peach-200", dot: "bg-tertiary-container", netted: true },
  { id: "chloe", name: "Chloe Bennett", initials: "CB", dir: "owed", amount: 7802, group: "Live Concerts", groupCls: "bg-sky-100 text-sky-700", sub: "Radiohead Tribute & Lyft rides", avatar: "bg-matcha-100 text-matcha-800", ring: "ring-matcha-200", dot: "bg-primary-container", netted: false },
  { id: "alex", name: "Alex Morgan", initials: "AM", dir: "owed", amount: 7470, group: "Personal Tab", groupCls: "bg-lilac-100 text-lilac-700", sub: "Weekend groceries split • Settling via Apple Cash", avatar: "bg-matcha-100 text-matcha-800", ring: "ring-matcha-200", dot: "bg-primary-container", netted: false },
];

const GROUPS = [
  { id: "loft", name: "Brooklyn Loft #4B", icon: "apartment", members: "4 members", pool: 205840, dir: "owe", amount: 4648, dueLabel: "Due Mar 01", iconCls: "bg-peach-100 text-peach-700", dot: "bg-tertiary-container", netted: false, pile: [{ i: "SL", c: "bg-matcha-100 text-matcha-800" }, { i: "JW", c: "bg-sky-100 text-sky-700" }, { i: "ME", c: "bg-ink text-white" }, { i: "+1", c: "bg-surface-container text-on-surface-variant" }] },
  { id: "tahoe", name: "Tahoe Ski Trip 2025", icon: "downhill_skiing", members: "6 travelers", pool: 318720, dir: "owed", amount: 10665.5, dueLabel: "Lodge Settled", iconCls: "bg-matcha-100 text-matcha-800", dot: "bg-primary-container", netted: false, pile: [{ i: "MV", c: "bg-matcha-100 text-matcha-800" }, { i: "CB", c: "bg-sky-100 text-sky-700" }, { i: "AM", c: "bg-lilac-100 text-lilac-700" }, { i: "+3", c: "bg-surface-container text-on-surface-variant" }] },
  { id: "dinner", name: "Friday Dinner Club", icon: "restaurant", members: "8 foodies", pool: 68060, dir: "owed", amount: 5810, dueLabel: "", iconCls: "bg-buttercup-100 text-buttercup-700", dot: "bg-primary-container", netted: false, pile: [{ i: "SL", c: "bg-buttercup-100 text-buttercup-700" }, { i: "MV", c: "bg-matcha-100 text-matcha-800" }, { i: "+6", c: "bg-surface-container text-on-surface-variant" }] },
];

const RAILS = [
  { id: "apple", name: "Apple Cash", sub: "Direct wallet transfer", tag: "0% Fee", tagCls: "text-primary" },
  { id: "ach", name: "Chase Checking ••4819", sub: "Plaid ACH link", tag: "Instant", tagCls: "text-primary" },
  { id: "venmo", name: "Venmo Sync", sub: "@jordan-tabsy", tag: "Connected", tagCls: "text-on-surface-variant" },
];

const FLOWS = [
  { from: "You", fromInit: "YOU", fromCls: "bg-ink text-white", to: "Sarah", amount: 4648, note: "Loft ConEd & supplies" },
  { from: "Sarah", fromInit: "SL", fromCls: "bg-peach-100 text-tertiary border border-tertiary-container", to: "Marcus", amount: 3120, note: "Tahoe cabin deposit" },
  { from: "Marcus", fromInit: "MV", fromCls: "bg-matcha-100 text-matcha-800 border border-primary-container", to: "You", amount: 3120, note: "Ski pass share" },
];

const NET_FLOW = { from: "Sarah", fromInit: "SL", fromCls: "bg-peach-100 text-tertiary border border-tertiary-container", to: "Marcus", amount: 4648, note: "Single net settlement" };

const TABS = BALANCES_TABS;

const FILTERS = [
  { id: "all", label: "All Active Balances", icon: "widgets", iconCls: "text-on-surface", sub: "", badge: "8" },
  { id: "owed", label: "Owes You", icon: "call_received", iconCls: "text-primary-container", sub: "3 people", badge: "+₹25,937.50", badgeCls: "text-primary bg-matcha-100" },
  { id: "i-owe", label: "You Owe", icon: "call_made", iconCls: "text-tertiary-container", sub: "2 people", badge: "-₹14,110.00", badgeCls: "text-tertiary bg-peach-100" },
  { id: "groups", label: "Active Shared Groups", icon: "group_work", iconCls: "text-pastel-sky-deep", sub: "", badge: "3", badgeCls: "text-pastel-sky-deep bg-sky-100" },
  { id: "netted", label: "Auto-Netted Pools", icon: "hub", iconCls: "text-pastel-amber-deep", sub: "Optimized", badge: "2", badgeCls: "text-buttercup-700 bg-buttercup-100" },
];

export default function OverallBalances() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("due");
  const [netting, setNetting] = useState(false);
  const [recipient, setRecipient] = useState({ name: "Sarah Lin", amount: 4648 });
  const [amountInput, setAmountInput] = useState("4648");
  const [rail, setRail] = useState("apple");
  const [selectedIds, setSelectedIds] = useState([]);
  const [showPriority, setShowPriority] = useState(true);
  const [toast, setToast] = useState(null);

  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(null), 2800);
  }

  const stream = useMemo(
    () => [
      ...FRIENDS.map((f) => ({ kind: "friend", ...f })),
      ...GROUPS.map((g) => ({ kind: "group", ...g })),
    ],
    []
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = stream.filter((item) => {
      let catOk = true;
      if (activeFilter === "owed") catOk = item.dir === "owed";
      else if (activeFilter === "i-owe") catOk = item.dir === "owe";
      else if (activeFilter === "groups") catOk = item.kind === "group";
      else if (activeFilter === "netted") catOk = item.netted;
      const nameOk = !q || item.name.toLowerCase().includes(q);
      return catOk && nameOk;
    });
    const sorted = [...filtered];
    if (sortBy === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === "amount") sorted.sort((a, b) => b.amount - a.amount);
    return sorted;
  }, [stream, activeFilter, query, sortBy]);

  const payableFriends = FRIENDS.filter((f) => f.dir === "owe");
  const selectedItems = stream.filter((s) => selectedIds.includes(s.id));
  const batchTotal = selectedItems.reduce((sum, s) => sum + s.amount, 0);
  const batchNames = selectedItems.map((s) => s.name.split(" ")[0]).join(", ");

  function toggleSelect(id) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function toggleSelectAll() {
    const ids = payableFriends.map((f) => f.id);
    const allOn = ids.every((id) => selectedIds.includes(id));
    setSelectedIds(allOn ? [] : ids);
    showToast(allOn ? "Cleared selections" : "Selected all active payable debts");
  }

  function chooseRecipient(name, amount) {
    setRecipient({ name, amount });
    setAmountInput(String(amount));
  }

  function authorize() {
    const val = parseFloat(amountInput);
    if (!val || val <= 0) {
      showToast("Please enter a valid amount");
      return;
    }
    const railName = RAILS.find((r) => r.id === rail)?.name || "Instant Rail";
    showToast(`Settled ${inr(val)} to ${recipient.name} via ${railName}`);
    if (recipient.name === "Sarah Lin") setShowPriority(false);
  }

  const INCOMING = 25937.5;
  const OUTGOING = 14110;
  const NET = INCOMING - OUTGOING;
  const incomingPct = (INCOMING / (INCOMING + OUTGOING)) * 100;
  const CIRC = 2 * Math.PI * 30;

  return (
    <AppLayout>
      <main className="w-full min-h-screen overflow-x-clip">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumbs
            items={[
              { label: "Balances", to: "/balances", icon: "account_balance_wallet" },
              { label: "Overall Balances" },
            ]}
            status={{ label: "Consolidated Ledger Node #98124", note: "Double-entry verified" }}
          />

          {/* Page header — GroupHeader-style card */}
          <div className="relative overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm shadow-zinc-900/5 border border-outline-variant/60 w-full px-4 py-3.5 sm:px-5 mb-5">
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              {/* LEFT — eyebrow + title + description */}
              <div className="flex flex-col gap-1.5 min-w-0">
                <div className="flex items-center flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded-full bg-primary-fixed/40 text-on-primary-fixed-variant font-label-caps text-label-caps uppercase flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" />
                    Consolidated Ledger Studio
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-sky-100 border border-sky-200 text-pastel-sky-deep text-[11px] font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-pastel-sky-deep" />
                    INR Ledger Active • Zero Slippage
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-matcha-100 border border-matcha-200 text-matcha-800 text-[11px] font-bold font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" />
                    SETTLED 94%
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-on-surface tracking-tight leading-none">Overall Balances</h1>
                <p className="font-body-sm text-body-sm text-on-surface-variant max-w-2xl leading-snug">
                  One ledger for every friend, group and auto-netted pool — with instant zero-fee settlement.
                </p>
              </div>

              {/* RIGHT — status + sync */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-on-surface-variant">
                  <span className="material-symbols-outlined text-[15px] text-primary">verified_user</span>
                  Double-entry verified
                </span>
                <button
                  type="button"
                  onClick={() => showToast("Ledger re-indexed with bank feed")}
                  className="w-9 h-9 rounded-full bg-surface-container-lowest border border-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors shadow-sm"
                  title="Refresh Sync"
                >
                  <span className="material-symbols-outlined text-[18px]">sync</span>
                </button>
              </div>
            </div>

            {/* Sub-nav row (inside card) */}
            <div className="relative z-10 mt-3 pt-3 border-t border-surface-container flex items-center gap-1.5 overflow-x-auto">
              {TABS.map((t) => {
                const cls = `px-3.5 py-2 rounded-xl font-title-md text-xs flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  t.id === "overall"
                    ? "bg-matcha-100 text-matcha-800 font-bold shadow-sm"
                    : "text-on-surface-variant hover:bg-surface-container font-semibold"
                }`;
                const inner = (
                  <>
                    <span className="material-symbols-outlined text-base" style={t.id === "overall" ? { fontVariationSettings: "'FILL' 1" } : undefined}>{t.icon}</span>
                    <span>{t.label}</span>
                    {t.badge && <span className="bg-peach-100 text-tertiary text-[10px] font-bold px-1.5 py-0.5 rounded-full">{t.badge}</span>}
                  </>
                );
                return t.to ? (
                  <Link key={t.id} to={t.to} className={cls}>{inner}</Link>
                ) : (
                  <button key={t.id} type="button" onClick={() => t.id !== "overall" && showToast(`${t.label} view coming soon`)} className={cls}>{inner}</button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* ============ COLUMN 1 ============ */}
            <div className="lg:col-span-3 min-w-0 flex flex-col gap-5">
              {/* Consolidated Position */}
              <div className="bg-surface-container-lowest p-5 rounded-3xl border border-surface-container shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant font-mono break-words">Consolidated Position</span>
                  <span className="shrink-0 px-2.5 py-0.5 rounded-full bg-matcha-100 text-matcha-800 text-[11px] font-bold">Surplus</span>
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className={`text-2xl font-extrabold tracking-tight font-mono leading-tight ${NET >= 0 ? "text-on-surface" : "text-tertiary"}`}>
                      {NET >= 0 ? "+" : "−"}{inr(Math.abs(NET))}
                    </div>
                    <div className="text-xs text-on-surface-variant font-medium mt-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-primary text-sm">verified</span>
                      Incoming exceeds debt
                    </div>
                  </div>
                  <div className="relative w-[72px] h-[72px] shrink-0">
                    <svg className="w-[72px] h-[72px] -rotate-90" viewBox="0 0 72 72">
                      <circle cx="36" cy="36" fill="none" r="30" stroke="var(--color-surface-container)" strokeWidth="6.5" />
                      <circle cx="36" cy="36" fill="none" r="30" stroke="var(--color-primary-container)" strokeWidth="6.5" strokeLinecap="round" strokeDasharray={`${(incomingPct / 100) * CIRC} ${CIRC}`} />
                      <circle cx="36" cy="36" fill="none" r="30" stroke="var(--color-tertiary-container)" strokeWidth="6.5" strokeLinecap="round" strokeDasharray={`${((100 - incomingPct) / 100) * CIRC} ${CIRC}`} strokeDashoffset={-((incomingPct / 100) * CIRC)} />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-[10px] font-bold text-on-surface-variant uppercase font-mono">Offset</span>
                      <span className="text-xs font-extrabold text-on-surface font-mono">1.83x</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-surface-container">
                  <div className="bg-matcha-50 p-2.5 rounded-2xl border border-matcha-100">
                    <div className="text-[10px] font-bold text-matcha-800 uppercase tracking-wider font-mono">Incoming</div>
                    <div className="text-base font-extrabold text-matcha-800 mt-0.5 font-mono">+{inr0(INCOMING)}</div>
                    <div className="text-[10px] text-on-surface-variant">Across 3 friends</div>
                  </div>
                  <div className="bg-peach-50 p-2.5 rounded-2xl border border-peach-100">
                    <div className="text-[10px] font-bold text-tertiary uppercase tracking-wider font-mono">Outgoing</div>
                    <div className="text-base font-extrabold text-tertiary mt-0.5 font-mono">−{inr0(OUTGOING)}</div>
                    <div className="text-[10px] text-on-surface-variant">Across 2 friends</div>
                  </div>
                </div>
              </div>

              {/* Reputation & Velocity */}
              <div className="bg-surface-container-lowest p-5 rounded-3xl border border-surface-container shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-8 h-8 rounded-xl bg-lilac-100 text-lilac-700 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-lg">speed</span>
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-on-surface break-words">Reputation &amp; Velocity</h4>
                      <p className="text-[11px] text-on-surface-variant break-words">P2P Settlement speed</p>
                    </div>
                  </div>
                  <span className="shrink-0 px-2 py-0.5 rounded-full bg-lilac-100 text-lilac-700 font-bold text-[10px] font-mono">Top 2%</span>
                </div>
                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-extrabold text-on-surface font-mono">1.4</span>
                      <span className="text-xs font-bold text-on-surface-variant">Days avg</span>
                    </div>
                    <span className="text-[11px] text-matcha-600 font-semibold flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-xs">verified</span>
                      100% dispute-free record
                    </span>
                  </div>
                  <div className="flex items-end gap-1.5 h-10">
                    {[16, 24, 12, 28, 36].map((h, i) => (
                      <div key={i} className={`w-2 rounded-t ${i >= 3 ? "bg-lilac-600" : i === 3 ? "bg-lilac-600/60" : "bg-surface-container-highest"}`} style={{ height: `${h}px` }} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Ledger Filters */}
              <div className="bg-surface-container-lowest p-4 rounded-3xl border border-surface-container shadow-sm">
                <div className="flex items-center justify-between mb-3 px-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant font-mono">Ledger Filters</span>
                  <button
                    type="button"
                    onClick={() => { setActiveFilter("all"); setQuery(""); }}
                    className="text-[11px] text-on-surface-variant hover:text-on-surface font-semibold transition-colors"
                  >
                    Reset
                  </button>
                </div>
                <div className="flex flex-col gap-1.5">
                  {FILTERS.map((f) => {
                    const active = activeFilter === f.id;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setActiveFilter(f.id)}
                        className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-left transition-all ${
                          active ? "bg-ink text-white" : "hover:bg-surface-container-low text-on-surface"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className={`material-symbols-outlined text-base ${active ? "text-white" : f.iconCls}`}>{f.icon}</span>
                          <div className="min-w-0">
                            <span className="text-xs font-bold block leading-tight break-words">{f.label}</span>
                            {f.sub && <span className={`text-[10px] font-mono ${active ? "text-zinc-300" : "text-on-surface-variant"}`}>{f.sub}</span>}
                          </div>
                        </div>
                        <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full shrink-0 ${active ? "bg-white/20 text-white" : f.badgeCls || "bg-surface-container text-on-surface-variant"}`}>{f.badge}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* One-Tap Pings */}
              <div className="bg-surface-container-lowest p-5 rounded-3xl border border-surface-container shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant font-mono">One-Tap Pings</span>
                  <span className="material-symbols-outlined text-on-surface-variant text-sm">bolt</span>
                </div>
                <div className="flex flex-col gap-2">
                  {[{ n: "Marcus V.", i: "MV", a: 10665.5, label: "Nudge" }, { n: "Chloe B.", i: "CB", a: 7802, label: "Invoice" }].map((p) => (
                    <div key={p.n} className="flex items-center justify-between p-2 bg-surface-container-low rounded-2xl">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={`w-8 h-8 rounded-full ${p.i === "MV" ? "bg-matcha-100 text-matcha-800" : "bg-sky-100 text-sky-700"} flex items-center justify-center text-[10px] font-bold shrink-0`}>{p.i}</div>
                        <div className="leading-none min-w-0">
                          <div className="text-xs font-bold text-on-surface break-words">{p.n}</div>
                          <span className="text-[10px] text-matcha-700 font-mono">+{inr0(p.a)}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => showToast(`${p.label} sent to ${p.n}`)}
                        className="px-2.5 py-1 bg-surface-container-lowest hover:bg-ink hover:text-white text-on-surface text-[11px] font-bold rounded-xl border border-surface-container transition-all shadow-sm shrink-0"
                      >
                        {p.label}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ============ COLUMN 2 ============ */}
            <div className="lg:col-span-5 xl:col-span-6 min-w-0 flex flex-col gap-5">
              {/* Controls bar */}
              <div className="bg-surface-container-lowest rounded-3xl p-3.5 border border-surface-container shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-64 flex items-center bg-surface-container-low rounded-2xl px-3 py-2 border border-surface-container">
                  <span className="material-symbols-outlined text-on-surface-variant text-base mr-2">search</span>
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-transparent text-xs font-medium text-on-surface outline-none placeholder:text-on-surface-variant"
                    placeholder="Filter friends or groups..."
                    type="text"
                  />
                </div>
                <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end overflow-x-auto">
                  <span className="text-[11px] font-bold text-on-surface-variant font-mono hidden md:inline">SORT:</span>
                  {[{ id: "due", label: "Due Date" }, { id: "amount", label: "Amount" }, { id: "name", label: "A–Z" }].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => { setSortBy(s.id); showToast(`Sorted ledger by ${s.label.toUpperCase()}`); }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                        sortBy === s.id ? "bg-ink text-white shadow-sm" : "text-on-surface-variant hover:bg-surface-container font-semibold"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority banner */}
              {showPriority && (
                <div className="bg-gradient-to-r from-peach-100 via-rose-50 to-buttercup-50 rounded-3xl p-4 border border-peach-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-pastel-rose-deep text-white flex items-center justify-center shrink-0 shadow-sm">
                      <span className="material-symbols-outlined text-xl">priority_high</span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-extrabold text-tertiary uppercase font-mono tracking-wider">Priority Due Soon</span>
                        <span className="px-2 py-0.5 rounded-full bg-surface-container-lowest text-tertiary text-[10px] font-bold">3 days left</span>
                      </div>
                      <p className="text-xs font-medium text-on-surface mt-0.5">
                        Pay <strong>Sarah Lin</strong> <span className="font-mono font-bold">−{inr(4648)}</span> for Brooklyn Loft ConEd &amp; supplies
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => { chooseRecipient("Sarah Lin", 4648); showToast(`Loaded Sarah Lin (${inr(4648)}) into Quick Settle Console`); }}
                    className="px-4 py-2 bg-pastel-rose-deep hover:bg-tertiary text-white text-xs font-bold rounded-2xl shadow-sm transition-all shrink-0 flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-sm">bolt</span>
                    <span>1-Click Pay {inr0(4648)}</span>
                  </button>
                </div>
              )}

              {/* Section title */}
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold text-on-surface tracking-tight">Active Ledger Stream</h3>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-low text-on-surface-variant font-mono text-[10px] font-bold">{visible.length} items</span>
                </div>
                <button type="button" onClick={toggleSelectAll} className="text-xs font-bold text-on-surface-variant hover:text-on-surface transition-colors">
                  Select All Payable
                </button>
              </div>

              {/* Ledger stream */}
              <div className="flex flex-col gap-3">
                {visible.map((item) =>
                  item.kind === "friend" ? (
                    <FriendCard key={item.id} item={item} selected={selectedIds.includes(item.id)} onToggle={() => toggleSelect(item.id)} onAction={(msg) => showToast(msg)} onSettle={(n, a) => chooseRecipient(n, a)} />
                  ) : (
                    <GroupCard key={item.id} item={item} />
                  )
                )}
                {visible.length === 0 && (
                  <div className="bg-surface-container-lowest rounded-3xl p-10 border border-dashed border-surface-container-high text-center text-on-surface-variant text-sm">
                    No balances match this filter.
                  </div>
                )}
              </div>
            </div>

            {/* ============ COLUMN 3 ============ */}
            <div className="lg:col-span-4 xl:col-span-3 min-w-0 flex flex-col gap-5">
              {/* Bilateral Debt Flow */}
              <div className="bg-surface-container-lowest p-5 rounded-3xl border border-surface-container shadow-sm">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-9 h-9 rounded-xl bg-matcha-100 text-matcha-800 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-lg">hub</span>
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-on-surface break-words leading-tight">Bilateral Debt Flow</h4>
                      <p className="text-[10px] text-on-surface-variant break-words">Circular debt across 4 nodes</p>
                    </div>
                  </div>
                  <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-matcha-100 text-matcha-800 text-[10px] font-bold font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" />
                    Live Matrix
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Multi-party circular debt detected between <strong>You</strong>, <strong>Sarah</strong>, <strong>Jason</strong>, and <strong>Marcus</strong>.
                </p>
                <div className="mt-4 p-3 bg-surface-container-low rounded-2xl border border-surface-container">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-mono font-bold text-on-surface-variant">FLOW SCHEMATIC</span>
                    <span className={`text-[11px] font-mono font-bold ${netting ? "text-matcha-700" : "text-tertiary"}`}>
                      {netting ? "1 NET SETTLEMENT (-66% LOAD)" : "3 UNCOMPRESSED TRANSFERS"}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    {(netting ? [NET_FLOW] : FLOWS).map((f, i) => (
                      <div key={i} className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-surface-container-lowest border border-surface-container">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`w-7 h-7 rounded-full ${f.fromCls} flex items-center justify-center text-[9px] font-bold shrink-0`}>{f.fromInit}</span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1 text-[11px] font-semibold text-on-surface">
                              <span className="break-words max-w-[64px]">{f.from}</span>
                              <span className="material-symbols-outlined text-[13px] text-on-surface-variant shrink-0">arrow_forward</span>
                              <span className="break-words max-w-[64px]">{f.to}</span>
                            </div>
                            <div className="text-[10px] text-on-surface-variant break-words">{f.note}</div>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-xs font-mono font-bold text-tertiary">−{inr0(f.amount)}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 pt-3 border-t border-surface-container flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-on-surface">Netting Compression</div>
                      <div className="text-[10px] text-on-surface-variant">Collapse cyclic debts</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setNetting((v) => !v); showToast(netting ? "Restored raw bilateral flow" : "Netting compressed 3 debts into 1 wire"); }}
                      className="px-2.5 py-1 rounded-xl bg-surface-container-lowest border border-surface-container text-[11px] font-bold text-on-surface hover:bg-surface-container transition-all flex items-center gap-1 shadow-sm shrink-0"
                    >
                      <span className={`material-symbols-outlined text-sm ${netting ? "text-on-surface-variant" : "text-primary"}`}>{netting ? "open_in_full" : "compress"}</span>
                      <span>{netting ? "Restore" : "Simplify"}</span>
                    </button>
                  </div>
                </div>
                <div className="mt-3 text-[11px] text-on-surface-variant bg-matcha-50 p-2.5 rounded-2xl border border-matcha-100">
                  {netting ? (
                    <><strong className="text-on-surface">Compression Active:</strong> Sarah settles with Marcus directly. Your outgoing liability of {inr(4648)} is netted.</>
                  ) : (
                    <>Eliminates 2 transfers: Sarah pays Marcus directly, collapsing your debt automatically.</>
                  )}
                </div>
              </div>

              {/* Instant Settle Console */}
              <div className="bg-surface-container-lowest p-5 rounded-3xl border border-surface-container shadow-sm">
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-9 h-9 rounded-xl bg-matcha-100 text-matcha-800 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-lg">terminal</span>
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-on-surface break-words leading-tight">Instant Settle Console</h4>
                      <p className="text-[10px] text-on-surface-variant break-words">Zero-gas bilateral rails</p>
                    </div>
                  </div>
                  <span className="shrink-0 px-2 py-0.5 rounded-full bg-matcha-100 text-matcha-800 font-mono text-[10px] font-bold">Fast-Lane</span>
                </div>

                <div className="mb-3">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-mono block mb-1.5">Selected Recipient</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[{ n: "Sarah Lin", s: "SL", a: 4648 }, { n: "Jason Wu", s: "JW", a: 9462 }, { n: "Other", s: "+", a: 2075 }].map((r) => {
                      const active = recipient.name === r.n;
                      return (
                        <button
                          key={r.n}
                          type="button"
                          onClick={() => chooseRecipient(r.n, r.a)}
                          className={`p-2 rounded-2xl flex flex-col items-center gap-1 transition-all ${active ? "bg-ink text-white" : "bg-surface-container-low text-on-surface hover:bg-surface-container"}`}
                        >
                          <span className={`w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center ${active ? "bg-white/20 text-white" : "bg-surface-container-highest text-on-surface-variant"}`}>{r.s}</span>
                          <span className="text-[11px] font-bold break-words max-w-full">{r.n === "Sarah Lin" ? "Sarah L." : r.n === "Jason Wu" ? "Jason W." : "Other"}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-mono">Amount (INR)</label>
                    <span className="text-[10px] font-mono text-tertiary font-bold">Owed: {inr(recipient.amount)}</span>
                  </div>
                  <div className="relative flex items-center bg-surface-container-low rounded-2xl px-3.5 py-2.5 border border-surface-container">
                    <span className="text-xl font-extrabold text-on-surface-variant mr-1">₹</span>
                    <input
                      value={amountInput}
                      onChange={(e) => setAmountInput(e.target.value)}
                      className="w-full bg-transparent font-mono text-xl font-extrabold text-on-surface outline-none"
                      inputMode="decimal"
                      type="number"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    {[{ l: "Full", a: recipient.amount }, { l: "Half", a: Math.round(recipient.amount / 2) }, { l: "₹830", a: 830 }].map((c) => (
                      <button
                        key={c.l}
                        type="button"
                        onClick={() => setAmountInput(String(c.a))}
                        className="px-2.5 py-1 rounded-xl bg-surface-container-lowest border border-surface-container hover:bg-surface-container text-on-surface text-[11px] font-bold font-mono transition-colors"
                      >
                        {c.l}{c.l.startsWith("₹") ? "" : ` (${inr0(c.a)})`}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-mono block mb-1.5">Payment Method Rail</label>
                  <div className="flex flex-col gap-1.5">
                    {RAILS.map((r) => {
                      const active = rail === r.id;
                      return (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => setRail(r.id)}
                          className={`flex items-center justify-between p-2.5 rounded-2xl text-left border transition-all ${active ? "bg-matcha-50 border-matcha-200" : "bg-surface-container-low border-surface-container hover:bg-surface-container"}`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 ${active ? "border-primary" : "border-outline-variant"}`}>
                              {active && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                            </span>
                            <div className="leading-tight min-w-0">
                              <span className="text-xs font-bold text-on-surface block break-words">{r.name}</span>
                              <span className="text-[10px] text-on-surface-variant break-words block">{r.sub}</span>
                            </div>
                          </div>
                          <span className={`text-[10px] font-bold font-mono shrink-0 ${r.tagCls}`}>{r.tag}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={authorize}
                  className="w-full py-3 bg-primary-container hover:bg-primary text-on-primary font-extrabold text-xs rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">lock</span>
                  <span>Authorize &amp; Settle Instantly</span>
                </button>
              </div>

              {/* Ledger Integrity Seal */}
              <div className="bg-surface-container-lowest p-5 rounded-3xl border border-surface-container shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-lg">verified_user</span>
                    <h4 className="text-xs font-bold text-on-surface">Ledger Integrity Seal</h4>
                  </div>
                  <span className="text-[10px] font-mono text-on-surface-variant">SHA-256</span>
                </div>
                <p className="text-[11px] text-on-surface-variant leading-relaxed mb-3">
                  Every transaction state is signed with a deterministic hash:
                  <code className="block mt-1 font-mono text-[10px] bg-surface-container-low p-1.5 rounded-xl text-on-surface break-all border border-surface-container">e8a2-99b4-3f1c-77d0-ledger-ok</code>
                </p>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => showToast("Exported CSV ledger for this period")} className="flex-1 py-2 bg-surface-container-low hover:bg-surface-container-high text-on-surface text-[11px] font-bold rounded-xl transition-all flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-sm">download</span>
                    <span>CSV Ledger</span>
                  </button>
                  <button type="button" onClick={() => showToast("Generated audit statement PDF with verified seal")} className="flex-1 py-2 bg-surface-container-low hover:bg-surface-container-high text-on-surface text-[11px] font-bold rounded-xl transition-all flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-sm">print</span>
                    <span>Statement PDF</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Batch settle bar */}
      {selectedIds.length > 0 && (
        <div className="sticky bottom-6 z-40 mx-auto max-w-3xl px-4">
          <div className="bg-ink text-white rounded-3xl p-4 shadow-xl border border-zinc-700 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-primary-container text-ink flex items-center justify-center font-mono font-bold text-xs shrink-0">{selectedIds.length}</div>
              <div className="min-w-0">
                <div className="text-xs font-bold leading-tight">Payables Selected</div>
                <div className="text-[11px] text-zinc-300 font-mono break-words">Total: −{inr(batchTotal)} ({batchNames})</div>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button type="button" onClick={() => setSelectedIds([])} className="px-3 py-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors">Cancel</button>
              <button type="button" onClick={() => { showToast(`Batch authorized: −${inr(batchTotal)} paid across ${selectedIds.length} recipients`); setSelectedIds([]); }} className="px-4 py-2 bg-primary-container hover:bg-primary-fixed-dim text-ink font-bold text-xs rounded-2xl transition-all shadow-sm flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">payments</span>
                <span>Batch Settle Now</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-inverse-surface text-inverse-on-surface px-4 py-2.5 rounded-full shadow-2xl">
          <span className="material-symbols-outlined text-[18px] text-primary-fixed">check_circle</span>
          <span className="text-xs font-semibold">{toast}</span>
        </div>
      )}
    </AppLayout>
  );
}

function FriendCard({ item, selected, onToggle, onAction, onSettle }) {
  const isOwe = item.dir === "owe";
  const amountCls = isOwe ? "text-tertiary" : "text-matcha-700";
  const labelCls = isOwe ? "text-tertiary" : "text-matcha-800";
  const label = isOwe ? "You Owe" : "Owes You";
  const actionCls = isOwe
    ? "bg-peach-100 hover:bg-pastel-rose-deep hover:text-white text-tertiary"
    : "bg-matcha-50 hover:bg-primary-container hover:text-on-primary text-matcha-800";
  return (
    <div className="bg-surface-container-lowest rounded-3xl p-4 border border-surface-container hover:border-outline-variant hover:shadow-sm transition-all flex items-center justify-between gap-4">
      <div className="flex items-center gap-3.5 min-w-0">
        <input
          type="checkbox"
          checked={selected}
          disabled={!isOwe}
          onChange={onToggle}
          className={`w-4 h-4 rounded shrink-0 ${isOwe ? "accent-pastel-rose-deep cursor-pointer" : "opacity-40 cursor-not-allowed"}`}
        />
        <div className="relative shrink-0">
          <div className={`w-12 h-12 rounded-2xl ${item.avatar} ring-2 ${item.ring} flex items-center justify-center font-bold text-sm`}>{item.initials}</div>
          <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full ${item.dot} border-2 border-surface-container-lowest`} />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-bold text-on-surface">{item.name}</h4>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${item.groupCls}`}>{item.group}</span>
            {item.netted && <span className="px-1.5 py-0.5 rounded-full bg-buttercup-100 text-buttercup-700 text-[9px] font-bold">Netted</span>}
          </div>
          <div className="text-xs text-on-surface-variant mt-0.5 flex items-center gap-1.5 flex-wrap">
            <span>{item.sub}</span>
            <span>•</span>
            <span className={isOwe ? "text-tertiary font-semibold" : ""}>{item.due || item.meta}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <div className="text-right">
          <span className={`text-[10px] font-bold uppercase font-mono tracking-wider block ${labelCls}`}>{label}</span>
          <span className={`text-base font-extrabold font-mono ${amountCls}`}>{isOwe ? "−" : "+"}{inr(item.amount)}</span>
        </div>
        <button
          type="button"
          onClick={() => (isOwe ? onSettle(item.name, item.amount) : onAction(`Reminder sent to ${item.name}`))}
          className={`px-3.5 py-2 text-xs font-bold rounded-2xl transition-all flex items-center gap-1 ${actionCls}`}
        >
          <span>{isOwe ? "Settle" : "Nudge"}</span>
          <span className="material-symbols-outlined text-sm">{isOwe ? "arrow_forward" : "notifications_active"}</span>
        </button>
      </div>
    </div>
  );
}

function GroupCard({ item }) {
  const isOwe = item.dir === "owe";
  const amountCls = isOwe ? "text-tertiary" : "text-matcha-700";
  const label = isOwe ? "Your Share Due" : "Your Net Balance";
  const dotCls = isOwe ? "bg-tertiary-container" : "bg-primary-container";
  return (
    <div className="bg-surface-container-lowest rounded-3xl p-4 border border-surface-container hover:border-outline-variant hover:shadow-sm transition-all flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-10 h-10 rounded-2xl ${item.iconCls} flex items-center justify-center shrink-0`}>
            <span className="material-symbols-outlined text-lg">{item.icon}</span>
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-on-surface break-words">{item.name}</h4>
            <div className="flex items-center gap-2 text-xs text-on-surface-variant flex-wrap">
              <span>{item.members}</span>
              <span>•</span>
              <span>Pool spend: {inr(item.pool)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center -space-x-2 shrink-0">
          {item.pile.map((p, i) => (
            <span key={i} className={`w-6 h-6 rounded-full ${p.c} text-[10px] font-bold flex items-center justify-center ring-2 ring-surface-container-lowest`}>{p.i}</span>
          ))}
        </div>
      </div>
      <div className="bg-surface-container-low p-3 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${dotCls}`} />
          <span className="text-xs font-semibold text-on-surface">{label}:</span>
        </div>
        <span className={`text-xs font-mono font-bold ${amountCls}`}>
          {isOwe ? "−" : "+"}{inr(item.amount)}{item.dueLabel ? ` (${item.dueLabel})` : ""}
        </span>
      </div>
    </div>
  );
}