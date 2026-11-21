import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";

const inr = (n) => `₹${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const inr0 = (n) => `₹${Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

const PEERS = [
  {
    id: 1,
    name: "Alex Morgan",
    handle: "@alexm",
    initials: "AM",
    avatarCls: "bg-primary-fixed text-on-primary-fixed-variant",
    relation: "Close",
    dir: "in",
    amount: 19920,
    note: "Lift Pass + Gear Rental",
    groups: ["Tahoe Ski Weekend", "Cabin 2025"],
    settle: "< 24h",
    settleIcon: "speed",
    meta: "99.8% Reliability",
    dot: "bg-primary-container",
    dotTitle: "Connected Instant ACH",
    actions: "settle",
  },
  {
    id: 2,
    name: "Sarah Lin",
    handle: "@sarah_lin",
    initials: "SL",
    avatarCls: "bg-secondary-fixed text-on-secondary-fixed-variant",
    relation: "Roommate",
    dir: "out",
    amount: 4648,
    note: "Pantry staples & Wifi",
    groups: ["Brooklyn Loft", "Weekly Groceries"],
    settle: "< 2h",
    settleIcon: "electric_bolt",
    meta: "Auto-Reconcile On",
    dot: "bg-outline-variant",
    dotTitle: "Idle",
    actions: "pay",
  },
  {
    id: 3,
    name: "Marco Rossi",
    handle: "@marcor",
    initials: "MR",
    avatarCls: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
    relation: "Travel",
    dir: "out",
    amount: 7179.5,
    note: "Snow chains + gas split",
    groups: ["Tahoe Ski", "Alpine Gear"],
    settle: "~12h",
    settleIcon: "speed",
    meta: "Due in 3d",
    dot: "bg-primary-container",
    dotTitle: "Connected Instant ACH",
    actions: "pay",
  },
  {
    id: 4,
    name: "Kim Larson",
    handle: "@kim_l",
    initials: "KL",
    avatarCls: "bg-primary-fixed text-on-primary-fixed-variant",
    relation: "Brunch",
    dir: "in",
    amount: 3320,
    note: "Group dinner & cider",
    groups: ["Tahoe Ski Weekend"],
    settle: "< 6h",
    settleIcon: "speed",
    meta: "UPI linked",
    dot: "bg-primary-container",
    dotTitle: "Connected Instant ACH",
    actions: "request",
  },
  {
    id: 5,
    name: "Jason Wu",
    handle: "@jasonwu",
    initials: "JW",
    avatarCls: "bg-surface-container-high text-on-surface",
    relation: "Tech",
    dir: "zero",
    amount: 0,
    note: "No pending ledger items",
    groups: ["4 Shared Hubs", "Brooklyn Loft"],
    settle: "100% Reconciled",
    settleIcon: "done_all",
    meta: "4 Hubs",
    dot: "bg-outline-variant",
    dotTitle: "Idle",
    actions: "split",
  },
  {
    id: 6,
    name: "Elena Ramos",
    handle: "@elena_r",
    initials: "ER",
    avatarCls: "bg-primary-fixed text-on-primary-fixed-variant",
    relation: "Tokyo",
    dir: "in",
    amount: 7785.4,
    note: "Flight booking adjustment",
    groups: ["Tokyo Ramen Crawl"],
    settle: "< 18h",
    settleIcon: "speed",
    meta: "GPay Fast",
    dot: "bg-primary-container",
    dotTitle: "Connected Instant ACH",
    actions: "nudge",
  },
];

const TABS = [
  { id: "all", label: "All Friends", count: 24 },
  { id: "you-owe", label: "Action Required: You Owe", count: 2, tone: "out" },
  { id: "owe-you", label: "Outstanding: They Owe", count: 8, tone: "in" },
  { id: "settled", label: "Reconciled", count: 14, tone: "zero" },
];

const GROUPS = [
  { label: "Tahoe Ski", count: 4 },
  { label: "Brooklyn Loft", count: 3 },
  { label: "Tokyo Ramen Trip", count: 2 },
  { label: "Groceries", count: 2 },
];

const METHODS = [
  { label: "GPay", icon: "account_balance_wallet" },
  { label: "PhonePe", icon: "qr_code_2" },
  { label: "Paytm", icon: "smartphone" },
  { label: "UPI", icon: "qr_code" },
];

const SORTS = [
  { id: "priority", label: "Sort: Net Priority" },
  { id: "balance", label: "Sort: Balance (High to Low)" },
  { id: "speed", label: "Sort: Speed to Settle" },
  { id: "alpha", label: "Sort: Alphabetical" },
];

function dirMeta(dir) {
  if (dir === "in") {
    return {
      badge: "bg-primary-fixed/35 border-primary-container/20",
      label: "Owes you",
      labelCls: "text-on-primary-fixed-variant",
      amountCls: "text-primary",
      card: "border-surface-container-high/60",
      sign: "+",
    };
  }
  if (dir === "out") {
    return {
      badge: "bg-tertiary-fixed/40 border-tertiary/20",
      label: "You owe",
      labelCls: "text-tertiary",
      amountCls: "text-tertiary",
      card: "border-tertiary-fixed/60",
      sign: "-",
    };
  }
  return {
    badge: "bg-secondary-fixed/30 border-secondary/20",
    label: "All Settled",
    labelCls: "text-secondary",
    amountCls: "text-secondary",
    card: "border-surface-container-high/60",
    sign: "",
  };
}

export default function Friends() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");
  const [activeGroup, setActiveGroup] = useState(null);
  const [sort, setSort] = useState("priority");
  const [view, setView] = useState("grid");
  const [selected, setSelected] = useState({ 2: true, 3: true });
  const [method, setMethod] = useState("GPay");
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  function showToast(message, icon = "check_circle") {
    setToast({ message, icon });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }

  function toggleSelect(id) {
    setSelected((prev) => {
      const next = { ...prev };
      if (next[id]) delete next[id];
      else next[id] = true;
      return next;
    });
  }

  const netSpread = useMemo(() => {
    const tin = PEERS.filter((p) => p.dir === "in").reduce((s, p) => s + p.amount, 0);
    const tout = PEERS.filter((p) => p.dir === "out").reduce((s, p) => s + p.amount, 0);
    return tin - tout;
  }, []);

  const filtered = useMemo(() => {
    let list = PEERS.filter((p) => {
      if (tab === "you-owe" && p.dir !== "out") return false;
      if (tab === "owe-you" && p.dir !== "in") return false;
      if (tab === "settled" && p.dir !== "zero") return false;
      if (activeGroup && !p.groups.some((g) => g.toLowerCase().includes(activeGroup.toLowerCase()))) return false;
      if (query) {
        const q = query.toLowerCase();
        const hay = `${p.name} ${p.handle} ${p.note} ${p.groups.join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    list = [...list].sort((a, b) => {
      if (sort === "balance") return b.amount - a.amount;
      if (sort === "speed") {
        const av = parseFloat(a.settle) || 999;
        const bv = parseFloat(b.settle) || 999;
        return av - bv;
      }
      if (sort === "alpha") return a.name.localeCompare(b.name);
      return b.amount - a.amount;
    });

    return list;
  }, [tab, query, activeGroup, sort]);

  const selectedPeers = PEERS.filter((p) => selected[p.id]);
  const combined = selectedPeers.reduce((s, p) => s + p.amount, 0);

  function settleSelected() {
    if (!selectedPeers.length) return;
    showToast(`Cleared ${selectedPeers.length} debts (${inr(combined)}) via ${method} — zero fee`, "bolt");
    setSelected({});
  }

  function act(name, verb) {
    showToast(`${verb} · ${name}`, "check_circle");
  }

  return (
    <AppLayout>
      <div className="bg-[#f7f6fd] font-body-md text-body-md text-on-surface antialiased">
        <main className="w-full min-h-screen pb-12">
          <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-6">
            {/* 1. Header & Action Ribbon */}
            <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-3xl shadow-sm relative">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center flex-wrap gap-2 text-on-surface-variant font-label-caps text-[11px] uppercase tracking-wider">
                  <span className="hover:text-primary transition-colors cursor-pointer">Tabsy Core</span>
                  <span className="material-symbols-outlined text-[13px] text-outline">chevron_right</span>
                  <span className="hover:text-primary transition-colors cursor-pointer">Bilateral Ledger</span>
                  <span className="material-symbols-outlined text-[13px] text-outline">chevron_right</span>
                  <span className="font-bold text-primary inline-flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px] text-primary">group</span>
                    Modular Horizon Deck
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-caps text-[11px] uppercase font-bold inline-flex items-center gap-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    Zero Fees
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-caps text-[11px] uppercase font-bold inline-flex items-center gap-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    24 Connected Peers
                  </span>
                </div>
              </div>

              <div className="mt-3 flex flex-col gap-1 max-w-3xl">
                <h1 className="font-headline-lg text-2xl lg:text-3xl text-on-surface tracking-tight">Friends &amp; Bilateral Matrix</h1>
                <p className="text-sm text-on-surface-variant">
                  Fluid scanning and real-time bilateral clearing. Select multiple peers to batch reconcile debts in a single touch.
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-surface-container flex items-center gap-2.5 flex-wrap">
                <button
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface text-sm font-semibold border border-slate-200 shadow-sm transition-colors active:scale-95"
                  type="button"
                  onClick={() => showToast("Exported bilateral ledger (CSV/PDF)", "file_download")}
                >
                  <span className="material-symbols-outlined text-[18px] text-secondary">file_download</span>
                  <span>Export Ledger (CSV/PDF)</span>
                </button>
                <button
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface text-sm font-semibold border border-slate-200 shadow-sm transition-colors active:scale-95"
                  type="button"
                  onClick={() => navigate("/friend-requests")}
                >
                  <span className="material-symbols-outlined text-[18px] text-primary">person_add</span>
                  <span>Requests</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-tertiary text-on-tertiary text-[10px] font-bold">3</span>
                </button>
                <button
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-sm font-bold shadow-md transition-colors active:scale-95"
                  type="button"
                  onClick={() => navigate("/add-friend")}
                >
                  <span className="material-symbols-outlined text-[20px]">add</span>
                  <span>Add Friend</span>
                </button>
              </div>
            </div>

            {/* 2. Filter Deck & Search */}
            <div className="w-full bg-surface-container-lowest rounded-3xl p-4 md:p-5 shadow-sm border border-surface-container flex flex-col gap-4">
              <div className="flex items-center justify-between flex-wrap gap-3 border-b border-surface-container pb-3.5">
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5">
                  {TABS.map((t) => {
                    const active = tab === t.id;
                    const toneCls =
                      t.tone === "out"
                        ? "bg-tertiary-fixed/60 hover:bg-tertiary-fixed text-on-tertiary-container"
                        : t.tone === "in"
                          ? "bg-primary-fixed/50 hover:bg-primary-fixed text-on-primary-fixed-variant"
                          : t.tone === "zero"
                            ? "bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface"
                            : "";
                    const dotCls = t.tone === "out" ? "bg-tertiary" : t.tone === "in" ? "bg-primary" : "";
                    const countCls =
                      t.tone === "out"
                        ? "bg-tertiary text-on-tertiary"
                        : t.tone === "in"
                          ? "bg-primary text-on-primary"
                          : "bg-surface-container-high text-on-surface-variant";
                    return (
                      <button
                        key={t.id}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-title-md text-[13px] tracking-tight shrink-0 transition-colors ${
                          active ? "bg-on-surface text-surface shadow-sm" : toneCls || "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                        }`}
                        type="button"
                        onClick={() => setTab(t.id)}
                      >
                        {t.tone && <span className={`w-2 h-2 rounded-full ${active ? "bg-surface" : dotCls}`} />}
                        <span>{t.label}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${active ? "bg-surface/20 text-surface" : countCls}`}>{t.count}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center gap-3 px-3.5 py-1.5 rounded-2xl bg-surface-container-low border border-surface-container text-body-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="text-outline text-xs">Net Spread:</span>
                    <span className={`font-numeric-balance-md font-bold ${netSpread >= 0 ? "text-primary" : "text-tertiary"}`}>
                      {netSpread >= 0 ? "+" : "-"}
                      {inr0(Math.abs(netSpread))}
                    </span>
                  </div>
                  <span className="h-3 w-px bg-outline-variant" />
                  <div className="flex items-center gap-1 text-xs text-on-surface-variant font-medium">
                    <span className="material-symbols-outlined text-[15px] text-primary">verified</span>
                    <span>3 Groups Active</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
                <div className="relative flex-1 min-w-[280px]">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px] pointer-events-none">search</span>
                  <input
                    className="w-full bg-surface-container-low pl-10 pr-12 py-2.5 rounded-2xl text-on-surface placeholder:text-outline font-body-sm text-body-sm border border-transparent focus:border-outline-variant focus:bg-surface-container-lowest focus:outline-none transition-all"
                    placeholder="Filter by friend name, @handle, or debt note..."
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <kbd className="absolute right-3.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-surface-container-high text-[10px] font-label-caps uppercase text-outline pointer-events-none">⌘K</kbd>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
                  <span className="font-label-caps text-label-caps text-outline uppercase tracking-wider shrink-0 mr-1">Shared:</span>
                  {GROUPS.map((g) => {
                    const on = activeGroup === g.label;
                    return (
                      <button
                        key={g.label}
                        className={`px-3 py-1.5 rounded-xl font-body-sm text-[12px] shrink-0 transition-colors flex items-center gap-1 ${
                          on ? "bg-surface-container-high text-on-surface font-semibold" : "bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface font-medium"
                        }`}
                        type="button"
                        onClick={() => setActiveGroup(on ? null : g.label)}
                      >
                        <span>{g.label}</span>
                        <span className="text-outline text-[11px]">({g.count})</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end lg:self-auto">
                  <div className="relative">
                    <select
                      className="appearance-none bg-surface-container-low hover:bg-surface-container text-on-surface font-body-sm text-body-sm font-semibold py-2 pl-3 pr-8 rounded-2xl border border-surface-container-high cursor-pointer focus:outline-none transition-colors"
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                    >
                      {SORTS.map((s) => (
                        <option key={s.id} value={s.id}>{s.label}</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[16px] text-outline pointer-events-none">arrow_drop_down</span>
                  </div>
                  <div className="flex items-center bg-surface-container-low p-1 rounded-2xl border border-surface-container-high">
                    <button
                      aria-label="Deck grid view"
                      className={`w-8 h-8 rounded-xl flex items-center justify-center ${view === "grid" ? "bg-surface-container-lowest text-on-surface shadow-sm" : "text-outline hover:text-on-surface"} transition-colors`}
                      type="button"
                      onClick={() => setView("grid")}
                    >
                      <span className="material-symbols-outlined text-[18px]">grid_view</span>
                    </button>
                    <button
                      aria-label="Ledger list view"
                      className={`w-8 h-8 rounded-xl flex items-center justify-center ${view === "list" ? "bg-surface-container-lowest text-on-surface shadow-sm" : "text-outline hover:text-on-surface"} transition-colors`}
                      type="button"
                      onClick={() => setView("list")}
                    >
                      <span className="material-symbols-outlined text-[18px]">table_rows</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Peer Cards */}
            <div>
              <div className="flex items-center justify-between mb-4 px-1 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-title-md text-title-md text-on-surface font-bold">Interactive Peer Cards</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-caps text-label-caps uppercase">Batch Deck</span>
                </div>
                <div className="flex items-center gap-2 text-outline font-body-sm text-body-sm">
                  <span className="material-symbols-outlined text-[16px]">touch_app</span>
                  <span>Select checkboxes to trigger batch multi-settlement</span>
                </div>
              </div>

              {filtered.length === 0 ? (
                <div className="bg-surface-container-lowest rounded-3xl p-10 border border-surface-container text-center flex flex-col items-center gap-2">
                  <span className="material-symbols-outlined text-[40px] text-outline">group_off</span>
                  <p className="font-title-md text-on-surface font-semibold">No peers match this view</p>
                  <p className="text-sm text-on-surface-variant">Adjust the tab, search, or shared group filter.</p>
                </div>
              ) : (
                <div className={`grid gap-4 ${view === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
                  {filtered.map((p) => {
                    const m = dirMeta(p.dir);
                    const selectable = p.dir !== "zero";
                    const isSel = !!selected[p.id];
                    return (
                      <article
                        key={p.id}
                        className={`bg-surface-container-lowest rounded-3xl p-5 shadow-sm hover:shadow-md transition-all border ${m.card} flex flex-col justify-between group relative overflow-hidden`}
                      >
                        <div className="absolute top-0 right-0 w-28 h-28 rounded-full blur-2xl pointer-events-none opacity-70 bg-primary-fixed/20" />

                        <div>
                          <div className="flex items-start justify-between gap-3 mb-4">
                            <div className="flex items-center gap-3">
                              <label className={`relative flex items-center ${selectable ? "cursor-pointer" : "cursor-not-allowed"}`}>
                                <input
                                  aria-label={`Select ${p.name} for batch settlement`}
                                  className="peer sr-only"
                                  type="checkbox"
                                  checked={isSel}
                                  disabled={!selectable}
                                  onChange={() => selectable && toggleSelect(p.id)}
                                />
                                <div className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all border-2 ${
                                  selectable
                                    ? isSel
                                      ? "bg-primary border-primary"
                                      : "border-outline-variant"
                                    : "border-surface-container bg-surface-container-low opacity-40"
                                }`}>
                                  <span className={`material-symbols-outlined text-white text-[14px] font-bold ${selectable ? (isSel ? "" : "opacity-0 peer-checked:opacity-100") : ""} ${selectable && !isSel ? "opacity-0" : ""}`}>
                                    {selectable ? "check" : "lock"}
                                  </span>
                                </div>
                              </label>
                              <div className="relative">
                                <div className={`w-[52px] h-[52px] rounded-2xl flex items-center justify-center font-bold text-sm shadow-sm ${p.avatarCls}`}>{p.initials}</div>
                                <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full ring-2 ring-surface-container-lowest ${p.dot}`} title={p.dotTitle} />
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <button type="button" onClick={() => navigate("/friend-profile")} className="font-title-md text-title-md text-on-surface font-bold leading-tight hover:text-primary transition-colors text-left">{p.name}</button>
                                  <span className="material-symbols-outlined text-primary text-[16px]">verified</span>
                                </div>
                                <span className="font-body-sm text-body-sm text-outline">{p.handle}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className={`px-2 py-0.5 rounded-full font-label-caps text-[10px] uppercase ${
                                p.dir === "out" ? "bg-tertiary-fixed text-on-tertiary-fixed font-bold" : p.dir === "in" ? "bg-secondary-fixed text-on-secondary-fixed font-bold" : "bg-surface-container text-on-surface-variant"
                              }`}>
                                {p.relation}
                              </span>
                              <button aria-label="Manage connection" className="w-7 h-7 rounded-lg hover:bg-surface-container text-outline hover:text-on-surface flex items-center justify-center transition-colors" type="button" onClick={() => navigate("/friend-manage")}>
                                <span className="material-symbols-outlined text-[18px]">more_vert</span>
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-body-sm mb-3.5 bg-surface-container-low/70 px-3 py-2 rounded-2xl border border-surface-container">
                            <div className="flex items-center gap-1.5 text-on-surface-variant text-[12px]">
                              <span className={`material-symbols-outlined text-[15px] ${p.settleIcon === "electric_bolt" ? "text-secondary" : p.settleIcon === "done_all" ? "text-secondary" : "text-primary"}`}>{p.settleIcon}</span>
                              {p.settleIcon === "done_all" ? <span>100% Reconciled</span> : <span>Settles in <strong>{p.settle}</strong></span>}
                            </div>
                            <span className={`font-label-caps text-label-caps uppercase ${p.dir === "out" && p.meta === "Due in 3d" ? "text-tertiary font-semibold" : "text-outline"}`}>{p.meta}</span>
                          </div>

                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {p.groups.map((g) => (
                              <span key={g} className="px-2.5 py-1 rounded-xl bg-surface-container text-on-surface-variant font-body-sm text-[11px] font-medium">{g}</span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className={`p-3.5 rounded-2xl border flex items-center justify-between mb-3.5 ${m.badge}`}>
                            <div className="flex flex-col">
                              <span className={`font-label-caps text-label-caps uppercase font-bold ${m.labelCls}`}>{m.label}</span>
                              <span className="text-[11px] text-outline">{p.note}</span>
                            </div>
                            <span className={`font-numeric-balance-lg text-[24px] font-extrabold leading-none ${m.amountCls}`}>
                              {m.sign}
                              {inr(p.amount)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {p.actions === "settle" && (
                              <>
                                <button className="flex-1 py-2.5 px-3 rounded-2xl bg-primary-container text-on-primary-container font-title-md text-[13px] font-bold hover:bg-primary hover:text-on-primary transition-all text-center shadow-sm" type="button" onClick={() => act(p.name, "Settle Up")}>Settle Up</button>
                                <button className="py-2.5 px-3.5 rounded-2xl bg-surface-container-low hover:bg-surface-container text-on-surface font-title-md text-[13px] font-semibold transition-colors flex items-center gap-1" type="button" onClick={() => act(p.name, "Nudged")}>
                                  <span className="material-symbols-outlined text-[16px] text-outline">notifications_active</span>
                                  <span>Nudge</span>
                                </button>
                              </>
                            )}
                            {p.actions === "pay" && (
                              <>
                                <button className="flex-1 py-2.5 px-3 rounded-2xl bg-tertiary text-on-tertiary font-title-md text-[13px] font-bold hover:opacity-95 transition-all text-center shadow-sm flex items-center justify-center gap-1" type="button" onClick={() => act(p.name, `Pay ${inr(p.amount)}`)}>
                                  <span className="material-symbols-outlined text-[16px]">payment</span>
                                  <span>Pay {inr(p.amount)}</span>
                                </button>
                                <button className="py-2.5 px-3.5 rounded-2xl bg-surface-container-low hover:bg-surface-container text-on-surface font-title-md text-[13px] font-semibold transition-colors" type="button" onClick={() => act(p.name, "Details")}>Details</button>
                              </>
                            )}
                            {p.actions === "request" && (
                              <>
                                <button className="flex-1 py-2.5 px-3 rounded-2xl bg-surface-container-low hover:bg-surface-container text-on-surface font-title-md text-[13px] font-bold transition-colors text-center" type="button" onClick={() => act(p.name, "Request sent")}>Request</button>
                                <button className="py-2.5 px-3.5 rounded-2xl bg-surface-container-low hover:bg-surface-container text-on-surface font-title-md text-[13px] font-semibold transition-colors" type="button" onClick={() => act(p.name, "Nudged")}>Nudge</button>
                              </>
                            )}
                            {p.actions === "nudge" && (
                              <>
                                <button className="flex-1 py-2.5 px-3 rounded-2xl bg-surface-container-low hover:bg-surface-container text-on-surface font-title-md text-[13px] font-bold transition-colors text-center" type="button" onClick={() => act(p.name, "Nudge sent")}>Send Nudge</button>
                                <button className="py-2.5 px-3.5 rounded-2xl bg-surface-container-low hover:bg-surface-container text-on-surface font-title-md text-[13px] font-semibold transition-colors" type="button" onClick={() => act(p.name, "Reminder set")}>Reminder</button>
                              </>
                            )}
                            {p.actions === "split" && (
                              <button className="flex-1 py-2.5 px-3 rounded-2xl bg-surface-container-low hover:bg-surface-container text-on-surface font-title-md text-[13px] font-semibold transition-colors text-center" type="button" onClick={() => act(p.name, "New split tab")}>+ Split New Tab</button>
                            )}
                            <button aria-label="View bilateral statement" className="w-9 h-9 rounded-2xl bg-surface-container-low hover:bg-surface-container text-outline hover:text-on-surface flex items-center justify-center transition-colors" type="button" onClick={() => navigate("/friend-balances")}>
                              <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}

              <div className="w-full flex items-center justify-between py-6 px-1 flex-wrap gap-2">
                <span className="font-body-sm text-body-sm text-outline">Showing {filtered.length} of 24 connected peers</span>
                <button className="px-4 py-2 rounded-2xl bg-surface-container-lowest hover:bg-surface-container text-on-surface border border-surface-container-high font-body-sm text-body-sm font-semibold transition-colors shadow-sm" type="button" onClick={() => showToast("Loaded 18 more peers", "download_done")}>
                  Load 18 More Peers
                </button>
              </div>
            </div>

            {/* 4. Bilateral Reliability Matrix */}
            <div className="w-full bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-surface-container">
              <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-surface-container">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-primary-fixed/40 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[22px]">insights</span>
                  </div>
                  <div>
                    <h3 className="font-title-md text-title-md text-on-surface font-bold">Bilateral Reliability Matrix</h3>
                    <p className="font-body-sm text-body-sm text-outline">Autonomous ledger synchronization &amp; fee audits</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3.5 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-[12px] font-semibold transition-colors flex items-center gap-1.5" type="button" onClick={() => showToast("Downloaded bilateral audit (CSV)", "download")}>
                    <span className="material-symbols-outlined text-[16px] text-outline">download</span>
                    <span>Download Bilateral Audit (CSV)</span>
                  </button>
                  <button className="px-3.5 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-[12px] font-semibold transition-colors flex items-center gap-1.5" type="button" onClick={() => showToast("Statement PDF generated", "picture_as_pdf")}>
                    <span className="material-symbols-outlined text-[16px] text-outline">picture_as_pdf</span>
                    <span>Statement PDF</span>
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
                <div className="p-4 rounded-2xl bg-surface-container-low/60 border border-surface-container flex flex-col justify-between">
                  <span className="font-label-caps text-label-caps uppercase text-outline">Network Trust Score</span>
                  <div className="my-2">
                    <div className="font-numeric-balance-lg text-[26px] text-primary font-extrabold">99.4%</div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Top 2% reliability cohort</p>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-primary font-semibold">
                    <span className="material-symbols-outlined text-[14px]">verified_user</span>
                    <span>All 24 peers bank verified</span>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-surface-container-low/60 border border-surface-container flex flex-col justify-between">
                  <span className="font-label-caps text-label-caps uppercase text-outline">Zero-Fee Volume Saved</span>
                  <div className="my-2">
                    <div className="font-numeric-balance-lg text-[26px] text-on-surface font-extrabold">{inr(15288.6)}</div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Saved vs traditional 3% fees</p>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-secondary font-semibold">
                    <span className="material-symbols-outlined text-[14px]">price_check</span>
                    <span>Zero surcharge guaranteed</span>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-surface-container-low/60 border border-surface-container flex flex-col justify-between">
                  <span className="font-label-caps text-label-caps uppercase text-outline">Median Velocity</span>
                  <div className="my-2">
                    <div className="font-numeric-balance-lg text-[26px] text-on-surface font-extrabold">8.4 Hours</div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">From expense post to settle</p>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-on-surface-variant font-medium">
                    <span className="material-symbols-outlined text-[14px] text-primary">bolt</span>
                    <span>UPI enabled</span>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-surface-container-low/60 border border-surface-container flex flex-col justify-between">
                  <span className="font-label-caps text-label-caps uppercase text-outline">Mutual Hub Ledgers</span>
                  <div className="my-2">
                    <div className="font-numeric-balance-lg text-[26px] text-secondary font-extrabold">12 Hubs</div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Cross-group offset active</p>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-primary font-semibold">
                    <span className="material-symbols-outlined text-[14px]">sync</span>
                    <span>All ledgers balanced today</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Sticky Batch Settlement Ribbon */}
            {selectedPeers.length > 0 && (
              <div className="sticky bottom-4 z-40">
                <div className="bg-inverse-surface/95 backdrop-blur-xl text-inverse-on-surface p-3.5 sm:p-4 rounded-3xl shadow-2xl border border-surface-variant/20 flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4">
                  {/* Identity + peers */}
                  <div className="flex items-center gap-3 min-w-0 lg:flex-1">
                    <div className="w-10 h-10 rounded-2xl bg-primary-container/20 flex items-center justify-center text-primary-fixed shrink-0">
                      <span className="material-symbols-outlined text-[24px]">layers</span>
                    </div>
                    <div className="flex flex-col min-w-0 gap-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-title-md text-[15px] font-bold text-inverse-on-surface leading-tight">Batch Settlement Active</span>
                        <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-caps text-[10px] uppercase font-extrabold">{selectedPeers.length} Selected</span>
                      </div>
                      <p className="text-[12px] text-inverse-on-surface/70 break-words leading-snug">
                        {selectedPeers.map((p) => `${p.name} (${inr(p.amount)})`).join(" + ")} • Zero-Fee Clearing
                      </p>
                    </div>
                  </div>

                  {/* Method pills */}
                  <div className="flex items-center gap-2 flex-wrap px-2.5 py-1.5 rounded-2xl bg-surface-container-highest/10 border border-surface-container-highest/15 text-xs shrink-0">
                    <span className="text-inverse-on-surface/70 font-label-caps uppercase text-[10px]">Method:</span>
                    {METHODS.map((mth) => (
                      <button
                        key={mth.label}
                        className={`px-2.5 py-1 rounded-xl font-semibold flex items-center gap-1 transition-colors ${
                          method === mth.label ? "bg-inverse-on-surface/20 text-inverse-on-surface" : "text-inverse-on-surface/80 hover:bg-inverse-on-surface/10"
                        }`}
                        type="button"
                        onClick={() => setMethod(mth.label)}
                      >
                        <span className="material-symbols-outlined text-[14px]">{mth.icon}</span>
                        <span>{mth.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Combined + settle */}
                  <div className="flex items-center gap-3.5 justify-between lg:justify-end shrink-0 w-full lg:w-auto">
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] uppercase font-label-caps text-inverse-on-surface/70 tracking-wider leading-tight">Combined Checkout</span>
                      <span className="font-numeric-balance-lg text-[22px] font-bold text-tertiary-fixed leading-none">{inr(combined)}</span>
                    </div>
                    <button className="px-5 py-2.5 rounded-2xl bg-primary hover:bg-primary-container text-on-primary hover:text-on-primary-container font-title-md text-[14px] font-bold shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center gap-2 shrink-0 whitespace-nowrap" type="button" onClick={settleSelected}>
                      <span className="material-symbols-outlined text-[20px]">bolt</span>
                      <span>Settle {selectedPeers.length} {selectedPeers.length === 1 ? "Debt" : "Debts"} Instantly</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {toast && (
          <div className="fixed bottom-6 right-6 z-50">
            <div className="flex items-center gap-3 bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-xl shadow-xl max-w-[90vw]">
              <span className="material-symbols-outlined text-primary-fixed text-[20px] shrink-0">{toast.icon}</span>
              <span className="font-medium text-[13px]">{toast.message}</span>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}