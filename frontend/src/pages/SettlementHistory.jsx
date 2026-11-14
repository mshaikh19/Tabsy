import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import Breadcrumbs from "../components/layout/Breadcrumbs";
import { BALANCES_TABS } from "../constants/balancesNav";

const inr = (n) => `₹${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const inr0 = (n) => `₹${Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
const signed = (n) => `${n < 0 ? "−" : n > 0 ? "+" : ""}${inr(Math.abs(n))}`;

const RIBBON = BALANCES_TABS;

const STATS = [
  { label: "Total Settled (2025 YTD)", value: inr0(318761.5), icon: "payments", iconCls: "bg-matcha-50 text-primary border border-matcha-100", trend: "+18% MoM", trendCls: "bg-matcha-50 text-matcha-700 border border-matcha-200", sub: "48 cleared transactions" },
  { label: "Turnaround Velocity", value: "1.2 Days", icon: "speed", iconCls: "bg-secondary-fixed text-secondary border border-secondary-fixed", trend: "LIGHTNING FAST", trendCls: "bg-primary-fixed/60 text-on-primary-fixed-variant", sub: "Top 1% peer tier" },
  { label: "Dispute Ratio", value: "0.0%", valueCls: "text-primary", icon: "verified", iconCls: "bg-matcha-50 text-primary border border-matcha-200", dot: true, sub: "Flawless zero-dispute audit (0/48)" },
  { label: "Redundant Volume Cut", value: inr0(34860), valueCls: "text-primary", icon: "alt_route", iconCls: "bg-surface-container text-secondary border border-secondary-fixed", sub: "Saved via 3-way circular debt netting" },
];

const LEDGER = [
  { id: "STL-884920", title: "ConEd Electric & Gigabit Fiber", amount: -4565, type: "paid", category: "paid p2p", peer: "Sarah Lin", myRole: "Payer", date: "Feb 24, 2025", time: "4:18 PM EST", rail: "Apple Cash Instant Rail", railIcon: "smartphone", status: "Cleared", hash: "0x7f48a1c9e820b...94b2a8d1", block: "Block #18,924", breakdown: `ConEd Sub-meter (${inr(2697.5)}) + Gigabit Fiber Split (${inr(1867.5)})`, month: "February 2025", icon: "bolt", iconCls: "bg-secondary-fixed text-secondary border border-secondary-fixed" },
  { id: "STL-882104", title: "Blue Bottle Pastries & Cold Brew", amount: 1016.75, type: "received", category: "received p2p", peer: "Sarah Lin", myRole: "Payee", date: "Feb 22, 2025", time: "9:34 AM EST", rail: "Direct In-App Ledger Transfer", railIcon: "account_balance_wallet", status: "Cleared", hash: "0x3b8901fe7194a...55c829e0", block: "Block #18,882", breakdown: `Oat Cold Brew x2 (${inr(788.5)}) + Almond Croissant (${inr(228.25)})`, month: "February 2025", icon: "coffee", iconCls: "bg-primary-fixed text-on-primary-fixed border border-primary-fixed-dim" },
  { id: "STL-771902", title: "Tahoe Cabin Rental Deposit", amount: -19920, type: "paid", category: "paid p2p", peer: "Marcus Vance", myRole: "Payer", date: "Jan 28, 2025", time: "2:10 PM EST", rail: "Plaid ACH Bank Transfer", railIcon: "account_balance", status: "Cleared", hash: "0x550a12cf99b24...1a88bb39", block: "Block #18,310", breakdown: `Weekend Lodging Portion (${inr(16600)}) + Cleaning Fee Surcharge (${inr(3320)})`, month: "January 2025", icon: "cottage", iconCls: "bg-secondary-fixed-dim/60 text-secondary border border-secondary-fixed" },
  { id: "NET-399104", title: "Autonomous 3-Way Netting Offset", amount: 6972, type: "netting", category: "netting", peer: "Alex, Sarah & Marcus", myRole: "Beneficiary", date: "Jan 15, 2025", time: "11:02 PM EST", rail: "Tabsy Netting Engine (Circular Multi-Hop)", railIcon: "hub", status: "Automated Offset", hash: "0x9924f0aa284dc...77e411b0", block: "Block #17,942", breakdown: `Alex owed Marcus ${inr(6972)} • Marcus owed Sarah ${inr(6972)} • Sarah owed Alex ${inr(6972)} (Auto-Canceled)`, month: "January 2025", icon: "hub", iconCls: "bg-secondary-container text-white border border-secondary-container" },
  { id: "STL-742918", title: "Sushi Night Split", amount: 3735, type: "received", category: "received p2p", peer: "Chloe Bennett", myRole: "Payee", date: "Jan 10, 2025", time: "8:44 PM EST", rail: "Venmo Instant Transfer", railIcon: "send", status: "Cleared", hash: "0x41ba92419c8f0...bb91044e", block: "Block #17,801", breakdown: `Omakase Set (${inr(3154)}) + Shared Nigiri (${inr(581)})`, month: "January 2025", icon: "restaurant", iconCls: "bg-tertiary-fixed text-on-tertiary-fixed border border-tertiary-fixed-dim" },
  { id: "STL-693019", title: "Whole Foods Groceries", amount: -4025.5, type: "paid", category: "paid p2p", peer: "Sarah Lin", myRole: "Payer", date: "Dec 24, 2024", time: "5:12 PM EST", rail: "Apple Cash Instant Rail", railIcon: "smartphone", status: "Cleared", hash: "0x892a014e7a81b...c914022a", block: "Block #17,112", breakdown: `Pantry staples (${inr(2199.5)}) + Organic Produce (${inr(1826)})`, month: "December 2024", icon: "shopping_cart", iconCls: "bg-surface-container-highest text-on-surface-variant border border-surface-container" },
];

const FILTERS = [
  { id: "all", label: "All Settlements", count: 48 },
  { id: "paid", label: "You Paid", count: 26 },
  { id: "received", label: "You Received", count: 22 },
  { id: "p2p", label: "Direct P2P", count: 34 },
  { id: "netting", label: "Group Netting", count: 14 },
];

const BARS = [
  { m: "OCT", h: 40, cls: "bg-surface-container-highest" },
  { m: "NOV", h: 52, cls: "bg-surface-container-highest" },
  { m: "DEC*", h: 74, cls: "bg-secondary-fixed-dim", peak: true },
  { m: "JAN", h: 60, cls: "bg-primary-fixed" },
  { m: "FEB", h: 68, cls: "bg-primary-container", current: true },
  { m: "MAR", h: 35, cls: "bg-surface-container border border-dashed border-outline-variant", projected: true },
];

export default function SettlementHistory() {
  const [activeId, setActiveId] = useState(LEDGER[0].id);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("recent");
  const [verifyVal, setVerifyVal] = useState("#STL-884920");
  const [verifyState, setVerifyState] = useState("idle");
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [toast, setToast] = useState(null);

  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(null), 2800);
  }

  const selected = LEDGER.find((i) => i.id === activeId) || LEDGER[0];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = LEDGER.filter((it) => {
      const catOk = filter === "all" || it.category.includes(filter);
      const qOk = !q || it.title.toLowerCase().includes(q) || it.peer.toLowerCase().includes(q) || it.id.toLowerCase().includes(q) || it.hash.toLowerCase().includes(q);
      return catOk && qOk;
    });
    if (sort === "amount") list = [...list].sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));
    return list;
  }, [filter, query, sort]);

  const grouped = useMemo(() => {
    const map = new Map();
    filtered.forEach((it) => {
      if (!map.has(it.month)) map.set(it.month, []);
      map.get(it.month).push(it);
    });
    return Array.from(map.entries());
  }, [filtered]);

  function copyId() {
    try {
      navigator.clipboard?.writeText(`#${selected.id}`);
    } catch {
      /* clipboard unavailable */
    }
    setCopied(true);
    showToast(`Copied #${selected.id}`);
    setTimeout(() => setCopied(false), 1600);
  }

  function runVerify(e) {
    e.preventDefault();
    setVerifyState("loading");
    setTimeout(() => {
      setVerifyState("done");
      showToast("Voucher verified — cryptographically valid");
    }, 700);
  }

  function runExport() {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      showToast("Statement bundle ready (CSV / PDF)");
    }, 900);
  }

  const amountCls = selected.amount < 0 ? "text-tertiary" : selected.amount > 0 ? (selected.type === "netting" ? "text-secondary" : "text-primary") : "text-on-surface";
  const statusCls = selected.type === "netting" ? "bg-secondary-fixed text-on-secondary-fixed-variant" : "bg-matcha-100 text-matcha-800";

  return (
    <AppLayout>
      <main className="w-full min-h-screen overflow-x-clip">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumbs
            items={[
              { label: "Balances", to: "/balances", icon: "account_balance_wallet" },
              { label: "Settlement History" },
            ]}
            status={{ label: "Audit Ledger Node #98124", note: "Zero disputes" }}
          />

          {/* Header card — GroupHeader-style */}
          <div className="relative overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm shadow-zinc-900/5 border border-outline-variant/60 w-full px-4 py-3.5 sm:px-5 mb-5">
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              <div className="flex flex-col gap-1.5 min-w-0">
                <div className="flex items-center flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded-full bg-primary-fixed/40 text-on-primary-fixed-variant font-label-caps text-label-caps uppercase flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" />
                    Balances Studio
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-matcha-100 border border-matcha-200 text-matcha-800 text-[11px] font-bold font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" />
                    SETTLED 94%
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-on-surface tracking-tight leading-none">Settlement History</h1>
                <p className="font-body-sm text-body-sm text-on-surface-variant max-w-2xl leading-snug">
                  Split-rail visual audit of every cleared transfer — inspect vouchers, hashes and netting offsets.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link to="/balances" className="px-3.5 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-title-md text-xs font-semibold transition-colors flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base">arrow_back</span>
                  Back to Balances
                </Link>
              </div>
            </div>

            {/* Ribbon */}
            <div className="relative z-10 mt-3 pt-3 border-t border-surface-container flex items-center gap-1.5 overflow-x-auto">
              {RIBBON.map((t) => {
                const active = t.id === "history";
                const cls = `px-3.5 py-2 rounded-xl font-title-md text-xs flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  active ? "bg-matcha-100 text-matcha-800 font-bold shadow-sm" : "text-on-surface-variant hover:bg-surface-container font-semibold"
                }`;
                const inner = (
                  <>
                    <span className="material-symbols-outlined text-base" style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}>{t.icon}</span>
                    <span>{t.label}</span>
                    {t.badge && <span className="bg-peach-100 text-tertiary text-[10px] font-bold px-1.5 py-0.5 rounded-full">{t.badge}</span>}
                    {active && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                  </>
                );
                return t.to ? (
                  <Link key={t.id} to={t.to} className={cls}>{inner}</Link>
                ) : (
                  <button key={t.id} type="button" onClick={() => !active && showToast(`${t.label} view coming soon`)} className={cls}>{inner}</button>
                );
              })}
            </div>
          </div>

          {/* Telemetry strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {STATS.map((s) => (
              <div key={s.label} className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-container flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant font-mono break-words">{s.label}</span>
                  <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${s.iconCls}`}>
                    <span className="material-symbols-outlined text-[20px]">{s.icon}</span>
                  </div>
                </div>
                <div>
                  <div className={`font-numeric-balance-lg text-numeric-balance-lg leading-tight font-extrabold tracking-tight ${s.valueCls || "text-on-surface"}`}>{s.value}</div>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    {s.trend && <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${s.trendCls}`}>{s.trend}</span>}
                    {s.dot && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                    <span className="text-[12px] text-on-surface-variant break-words">{s.sub}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* LEFT RAIL — audit stream */}
            <section className="lg:col-span-7 min-w-0 flex flex-col gap-4">
              {/* Toolbar */}
              <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-container flex flex-col gap-3">
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                  <div className="relative flex-1">
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[19px]">search</span>
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="w-full bg-surface-container-low focus:bg-surface-container-lowest pl-10 pr-16 py-2 rounded-xl font-body-md text-[13px] text-on-surface placeholder:text-on-surface-variant/70 border border-transparent focus:border-primary/40 outline-none transition-all"
                      placeholder="Search by peer, group, memo, voucher hash..."
                      type="text"
                    />
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                      <kbd className="bg-surface-container-lowest font-label-caps text-[10px] text-on-surface-variant px-1.5 py-0.5 rounded border border-surface-container">CTRL</kbd>
                      <kbd className="bg-surface-container-lowest font-label-caps text-[10px] text-on-surface-variant px-1 py-0.5 rounded border border-surface-container">/</kbd>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative inline-flex items-center bg-surface-container-low hover:bg-surface-container px-3 py-2 rounded-xl border border-surface-container transition-colors">
                      <span className="material-symbols-outlined text-[17px] text-outline mr-1.5">calendar_month</span>
                      <select className="bg-transparent font-title-md text-[13px] font-semibold text-on-surface outline-none cursor-pointer pr-5 appearance-none">
                        <option>Year to Date 2025</option>
                        <option>Full Year 2024</option>
                        <option>Last 90 Days</option>
                        <option>Custom Window...</option>
                      </select>
                      <span className="material-symbols-outlined text-[16px] text-outline absolute right-1.5 pointer-events-none">expand_more</span>
                    </div>
                    <button
                      type="button"
                      onClick={runExport}
                      className="bg-secondary text-white hover:bg-secondary/90 px-3.5 py-2 rounded-xl font-title-md text-[13px] font-semibold transition-all shadow-sm flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <span className={`material-symbols-outlined text-[17px] ${exporting ? "animate-spin" : ""}`}>{exporting ? "sync" : "download"}</span>
                      {exporting ? "Generating..." : "Export (CSV / PDF)"}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1 border-t border-surface-container/60">
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                    {FILTERS.map((f) => {
                      const active = filter === f.id;
                      return (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setFilter(f.id)}
                          className={`px-3 py-1 rounded-full font-title-md text-[12px] flex items-center gap-1.5 shrink-0 transition-all ${
                            active ? "bg-primary text-white font-bold shadow-sm" : "bg-surface-container text-on-surface-variant font-semibold hover:bg-surface-container-high"
                          }`}
                        >
                          <span>{f.label}</span>
                          <span className={`text-[10px] px-1.5 rounded-full font-extrabold ${active ? "bg-white/25 text-white" : "bg-surface-container-highest text-on-surface-variant"}`}>{f.count}</span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                    <span className="text-[12px] text-on-surface-variant">Sort:</span>
                    <div className="flex items-center bg-surface-container rounded-lg p-0.5">
                      {[{ id: "recent", l: "Recent" }, { id: "amount", l: "Amount" }].map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setSort(s.id)}
                          className={`px-2 py-0.5 rounded-md font-body-sm text-[11px] transition-colors ${sort === s.id ? "bg-surface-container-lowest text-primary font-bold shadow-sm" : "text-on-surface-variant font-medium hover:text-on-surface"}`}
                        >
                          {s.l}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Audit stream header */}
              <div className="flex items-center justify-between gap-2 px-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-headline-sm text-headline-sm text-on-surface font-extrabold tracking-tight">Audit Stream</h2>
                  <span className="bg-primary/10 text-primary font-label-caps text-[11px] font-bold px-2 py-0.5 rounded-full">Click to Inspect</span>
                </div>
                <span className="text-[12px] text-on-surface-variant font-medium shrink-0">{filtered.length} of {LEDGER.length} records</span>
              </div>

              {/* Grouped list */}
              <div className="flex flex-col gap-4">
                {grouped.map(([month, items]) => (
                  <div key={month}>
                    <div className="flex items-center gap-2 mb-2 px-1">
                      <span className="font-label-caps text-[11px] font-extrabold text-on-surface-variant uppercase tracking-wider">{month}</span>
                      <div className="flex-grow h-px bg-surface-container" />
                    </div>
                    <div className="flex flex-col gap-2.5">
                      {items.map((it) => (
                        <LedgerRow key={it.id} item={it} active={it.id === activeId} onSelect={() => setActiveId(it.id)} />
                      ))}
                    </div>
                  </div>
                ))}
                {filtered.length === 0 && (
                  <div className="bg-surface-container-lowest rounded-2xl p-10 border border-dashed border-surface-container-high text-center text-on-surface-variant text-sm">
                    No settlements match this filter.
                  </div>
                )}
              </div>

              {/* Pagination */}
              <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-container flex items-center justify-between">
                <button type="button" disabled className="px-3.5 py-1.5 rounded-xl bg-surface-container-low text-on-surface-variant font-title-md text-[13px] font-semibold flex items-center gap-1 cursor-not-allowed opacity-60">
                  <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                  Prev
                </button>
                <div className="flex items-center gap-1.5">
                  <span className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-[13px]">1</span>
                  {[2, 3].map((n) => (
                    <button key={n} type="button" onClick={() => showToast(`Page ${n} coming soon`)} className="w-8 h-8 rounded-xl hover:bg-surface-container text-on-surface-variant flex items-center justify-center font-semibold text-[13px] transition-colors">{n}</button>
                  ))}
                  <span className="text-outline text-xs px-1">...</span>
                  <button type="button" onClick={() => showToast("Page 5 coming soon")} className="w-8 h-8 rounded-xl hover:bg-surface-container text-on-surface-variant flex items-center justify-center font-semibold text-[13px] transition-colors">5</button>
                </div>
                <button type="button" onClick={() => showToast("Next page coming soon")} className="px-3.5 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-title-md text-[13px] font-semibold transition-colors flex items-center gap-1">
                  Next
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </button>
              </div>
            </section>

            {/* RIGHT RAIL — voucher inspector */}
            <aside className="lg:col-span-5 min-w-0 flex flex-col gap-4 lg:sticky lg:top-4">
              {/* Voucher inspector */}
              <div className="bg-surface-container-lowest rounded-3xl p-5 shadow-sm border border-surface-container">
                <div className="flex items-start justify-between gap-3 pb-3.5 border-b border-surface-container">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
                      <span className="text-[11px] font-extrabold text-primary uppercase tracking-widest font-label-caps">Digital Settlement Pass</span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm font-extrabold text-on-surface mt-1 break-words">{selected.title}</h3>
                    <p className="text-[12px] text-on-surface-variant">{selected.date} • {selected.time}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className={`font-numeric-balance-lg text-numeric-balance-lg font-black break-words ${amountCls}`}>{selected.type === "netting" ? inr0(selected.amount) : signed(selected.amount)}</div>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full font-label-caps mt-1 ${statusCls}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${selected.type === "netting" ? "bg-secondary" : "bg-matcha-600"}`} />
                      {selected.status}
                    </span>
                  </div>
                </div>

                {/* Routing ribbon */}
                <div className="py-3.5 flex items-center justify-between gap-2 border-b border-surface-container/60">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-primary-fixed/60 flex items-center justify-center font-bold text-on-primary-fixed text-sm border border-primary-fixed-dim shrink-0">
                      {selected.myRole === "Payer" ? "YOU" : selected.myRole === "Payee" ? selected.peer.split(" ").map((w) => w[0]).join("").slice(0, 2) : "NET"}
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] text-outline uppercase block font-semibold font-label-caps">{selected.myRole === "Payer" ? "Payer" : selected.myRole === "Payee" ? "Payer" : "Netting Ring"}</span>
                      <span className="font-title-md text-[13px] font-bold text-on-surface break-words block">{selected.myRole === "Payer" ? "Alex Chen (You)" : selected.myRole === "Payee" ? selected.peer : "Multi-Party"}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center px-1 shrink-0">
                    <span className="material-symbols-outlined text-[18px] text-primary">arrow_forward</span>
                    <span className="text-[9px] text-outline font-medium tracking-tight">VERIFIED</span>
                  </div>
                  <div className="flex items-center gap-2.5 min-w-0 flex-row-reverse text-right">
                    <div className="w-10 h-10 rounded-2xl bg-secondary-fixed/80 flex items-center justify-center font-bold text-secondary text-sm border border-secondary-fixed shrink-0">
                      {selected.myRole === "Payer" ? selected.peer.split(" ").map((w) => w[0]).join("").slice(0, 2) : "YOU"}
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] text-outline uppercase block font-semibold font-label-caps">{selected.myRole === "Payer" ? "Payee" : selected.myRole === "Payee" ? "Payee" : "Beneficiary"}</span>
                      <span className="font-title-md text-[13px] font-bold text-on-surface break-words block">{selected.myRole === "Payer" ? selected.peer : selected.myRole === "Payee" ? "Alex Chen (You)" : "Alex Chen (Netted)"}</span>
                    </div>
                  </div>
                </div>

                {/* Rail & breakdown */}
                <div className="py-3.5 space-y-2.5 text-[12px]">
                  <div className="flex items-center justify-between gap-2 text-on-surface-variant">
                    <span className="flex items-center gap-1.5 min-w-0">
                      <span className="material-symbols-outlined text-[16px] text-outline">{selected.railIcon}</span>
                      <span className="font-medium">Clearing Rail:</span>
                    </span>
                    <span className="font-semibold text-on-surface text-right break-words">{selected.rail}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 text-on-surface-variant">
                    <span className="font-medium">Voucher Reference:</span>
                    <div className="flex items-center gap-1 text-primary font-mono font-bold">
                      <span>#{selected.id}</span>
                      <button type="button" onClick={copyId} className="hover:opacity-75 transition-opacity" title="Copy voucher ID">
                        <span className="material-symbols-outlined text-[13px]">{copied ? "check" : "content_copy"}</span>
                      </button>
                    </div>
                  </div>
                  <div className="bg-surface-container-low rounded-2xl p-3 border border-surface-container mt-2">
                    <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-surface-container/60">
                      <span className="text-[10px] text-outline uppercase font-bold tracking-wider font-label-caps">Itemized Allocation</span>
                      <span className="text-[10px] text-outline font-label-caps">2 Ledger Lines</span>
                    </div>
                    <p className="text-on-surface text-[12px] font-medium leading-relaxed break-words">{selected.breakdown}</p>
                  </div>
                </div>

                {/* Crypto proof */}
                <div className="p-3 bg-surface rounded-2xl border border-surface-container mb-3.5 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] text-primary font-extrabold flex items-center gap-1 font-label-caps">
                      <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                      SHA-256 MERKLE RECEIPT
                    </span>
                    <span className="text-[10px] text-outline font-label-caps">{selected.block}</span>
                  </div>
                  <div className="font-mono text-[11px] text-on-surface-variant break-all bg-surface-container-lowest px-2 py-1.5 rounded-lg border border-surface-container">{selected.hash}</div>
                  <div className="flex items-center justify-between pt-1 text-[11px] text-on-surface-variant gap-2">
                    <span className="flex items-center gap-1 text-matcha-700 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-container" /> 100% Bilateral Consent
                    </span>
                    <span className="text-outline font-medium text-right">Locked &amp; Non-Reversible</span>
                  </div>
                </div>

                <Link to="/settlement-details" className="mt-2 w-full bg-secondary text-white hover:bg-secondary/90 py-2.5 px-3 rounded-xl font-title-md text-[12px] font-bold transition-all flex items-center justify-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                  View Full Settlement Details
                </Link>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button type="button" onClick={() => showToast(`Downloading signed PDF for #${selected.id}`)} className="bg-primary text-white hover:bg-primary/95 py-2 px-3 rounded-xl font-title-md text-[12px] font-bold transition-all shadow-sm flex items-center justify-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
                    Download PDF
                  </button>
                  <button type="button" onClick={() => showToast("Added voucher pass to wallet")} className="bg-surface-container text-secondary hover:bg-surface-container-high py-2 px-3 rounded-xl font-title-md text-[12px] font-bold transition-all flex items-center justify-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">wallet</span>
                    Add to Wallet
                  </button>
                </div>
              </div>

              {/* Volume chart */}
              <div className="bg-surface-container-lowest rounded-3xl p-5 shadow-sm border border-surface-container">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-extrabold tracking-tight">Settlement Volume</h3>
                    <p className="text-[12px] text-on-surface-variant">Last 6 Months Trend (INR)</p>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-surface-container flex items-center justify-center text-outline">
                    <span className="material-symbols-outlined text-[18px]">bar_chart</span>
                  </div>
                </div>
                <div className="flex items-end justify-between gap-2 h-28 pt-3">
                  {BARS.map((b) => (
                    <div key={b.m} className="flex flex-col items-center gap-1 flex-1">
                      <div className={`w-full max-w-[26px] rounded-t-md ${b.cls}`} style={{ height: `${b.h}px` }} />
                      <span className={`text-[9px] font-semibold font-label-caps ${b.current ? "text-primary font-extrabold" : b.peak ? "text-secondary font-bold" : "text-outline"}`}>{b.m}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 pt-2.5 border-t border-surface-container flex items-center justify-between gap-2 text-[12px] text-on-surface-variant font-medium flex-wrap">
                  <span>Peak Month: <strong className="text-on-surface font-bold">{inr0(78020)} (Dec)</strong></span>
                  <span className="text-primary font-bold flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[15px]">trending_up</span>
                    +18% MoM Velocity
                  </span>
                </div>
              </div>

              {/* Verifier */}
              <div className="bg-surface-container-lowest rounded-3xl p-5 shadow-sm border border-surface-container">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 rounded-xl bg-primary-fixed flex items-center justify-center text-primary font-bold">
                    <span className="material-symbols-outlined text-[16px]">lock_reset</span>
                  </div>
                  <h3 className="font-title-md text-title-md text-on-surface font-extrabold">Instant Proof Verifier</h3>
                </div>
                <p className="text-[12px] text-on-surface-variant mb-3">
                  Paste any settlement voucher ID or SHA-256 hash to test cryptographic immutability.
                </p>
                <form className="flex flex-col gap-2" onSubmit={runVerify}>
                  <input
                    value={verifyVal}
                    onChange={(e) => setVerifyVal(e.target.value)}
                    className="w-full bg-surface-container-low focus:bg-surface-container-lowest px-3 py-2 rounded-xl font-mono text-[12px] text-on-surface outline-none border border-surface-container focus:border-primary transition-all"
                    placeholder="e.g. #STL-884920 or 0x7f48..."
                    type="text"
                  />
                  <button type="submit" className="w-full bg-surface-container hover:bg-surface-container-high text-on-surface font-title-md text-[12px] font-bold py-2 rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-surface-container-high">
                    <span className={`material-symbols-outlined text-[16px] ${verifyState === "loading" ? "animate-spin" : ""}`}>{verifyState === "loading" ? "sync" : "search_check"}</span>
                    {verifyState === "loading" ? "Verifying..." : "Check Ledger Authenticity"}
                  </button>
                </form>
                <div className={`mt-2.5 p-2.5 rounded-xl border transition-all ${verifyState === "done" ? "bg-matcha-50 border-matcha-200" : "bg-surface-container-low border-surface-container"}`}>
                  <div className="flex items-center justify-between mb-0.5 gap-2">
                    <span className={`text-[10px] font-extrabold flex items-center gap-1 font-label-caps ${verifyState === "done" ? "text-matcha-800" : "text-on-surface-variant"}`}>
                      <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      CRYPTOGRAPHICALLY VALID
                    </span>
                    <span className="text-[10px] text-outline">{verifyState === "done" ? "Verified just now" : "Node US-East"}</span>
                  </div>
                  <div className="text-[10px] font-mono text-on-surface-variant break-all">Root: {selected.hash} • Immutably Audited</div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-inverse-surface text-inverse-on-surface px-4 py-2.5 rounded-full shadow-2xl">
          <span className="material-symbols-outlined text-[18px] text-primary-fixed">check_circle</span>
          <span className="text-xs font-semibold">{toast}</span>
        </div>
      )}
    </AppLayout>
  );
}

function LedgerRow({ item, active, onSelect }) {
  const isNetting = item.type === "netting";
  const amountColor = item.amount < 0 ? "text-tertiary" : isNetting ? "text-secondary" : "text-primary";
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left rounded-2xl p-4 shadow-sm border cursor-pointer transition-all break-words ${
        active
          ? "bg-surface-container-lowest border-primary/60 ring-2 ring-primary/30"
          : isNetting
          ? "bg-surface-container-low border-secondary-fixed/50 hover:border-secondary"
          : "bg-surface-container-lowest border-surface-container hover:border-primary/50"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${item.iconCls}`}>
            <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-title-md text-[15px] font-bold text-on-surface break-words">{item.title}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 font-label-caps ${isNetting ? "bg-secondary-fixed text-on-secondary-fixed-variant" : "bg-matcha-100 text-matcha-800"}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isNetting ? "bg-secondary" : "bg-matcha-600"}`} />
                {item.status}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1 text-on-surface-variant text-[12px] flex-wrap">
              <span>{item.myRole === "Payer" ? "Paid to" : item.myRole === "Payee" ? "Received from" : "Netted between"} <strong className="font-semibold text-on-surface">{item.peer}</strong></span>
              <span>•</span>
              <span>{item.date}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-outline">
                <span className="material-symbols-outlined text-[13px]">{item.railIcon}</span>
                {item.rail.split(" ")[0]}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className={`font-numeric-balance-md text-[17px] font-bold break-words ${amountColor}`}>
            {item.type === "netting" ? `${inr0(item.amount)} NET` : signed(item.amount)}
          </div>
          <div className="text-[11px] text-outline font-semibold flex items-center justify-end gap-1 mt-0.5 font-label-caps">
            <span>#{item.id}</span>
            <span className="material-symbols-outlined text-[13px]">{active ? "visibility" : "content_copy"}</span>
          </div>
        </div>
      </div>
    </button>
  );
}