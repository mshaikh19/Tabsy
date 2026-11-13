import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";

const inr = (n) => `₹${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const inr0 = (n) => `₹${Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

const EVENTS = [
  {
    id: "e1",
    type: "expense",
    icon: "shopping_cart",
    iconCls: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
    title: "Trader Joe's Shared Pantry",
    status: "UNSETTLED",
    statusCls: "bg-error-container text-on-error-container",
    meta: "Today at 11:30 AM • Added by Sarah Lin",
    amount: `-${inr(4648)}`,
    amountCls: "text-tertiary",
    amountSub: `Total: ${inr(9296)}`,
    store: "Court St, Brooklyn, NY",
    receiptNo: "#88921",
    items: [
      { name: "Organic Whole Milk (x2)", amt: 780.2 },
      { name: "Cage-Free Pasture Eggs", amt: 539.5 },
      { name: "Artisan Sourdough Loaf", amt: 481.4 },
      { name: "Cold-Pressed Olive Oil", amt: 1651.7 },
      { name: "Greens, Berries & Snacks", amt: 5843.2 },
    ],
    gross: 9296,
    policy: "50% Equal Split (2 Shares)",
    contribution: `${inr(4648)} (Paid Front)`,
    adjustment: `-${inr(4648)}`,
  },
  {
    id: "e2",
    type: "settlement",
    icon: "bolt",
    iconCls: "bg-primary-fixed text-on-primary-fixed",
    title: "ConEd Electric & Gigabit Fiber",
    status: "SETTLED",
    statusCls: "bg-primary-fixed/50 text-on-primary-fixed-variant",
    meta: "Yesterday at 4:15 PM • Mutual Settlement via GPay",
    amount: `+${inr(4565)}`,
    amountCls: "text-primary",
    amountSub: "You sent to Sarah",
    note: `Bilateral settlement cleared instantly (Reference #CON-9921)`,
    statusText: "Status 200 OK",
  },
  {
    id: "e3",
    type: "amendment",
    icon: "contract_edit",
    iconCls: "bg-secondary-fixed text-on-secondary-fixed",
    title: "Split Proportion Revision mutually signed",
    status: "AMENDMENT",
    statusCls: "bg-surface-container-high text-secondary",
    meta: "Feb 10, 2:00 PM • Brooklyn Loft Utility Agreement",
    amount: `+${inr0(1179)} credit`,
    amountCls: "text-primary",
    amountSub: "Summer AC usage offset",
    note: `Mutual agreement: Alex credited ${inr(1179)} towards February electric split to balance living-room HVAC test runs during Sarah's remote photography workshops.`,
  },
  {
    id: "e4",
    type: "social",
    icon: "favorite",
    iconCls: "bg-tertiary-fixed text-tertiary",
    title: "Sarah Lin reacted to pantry haul",
    status: "REACTION",
    statusCls: "bg-surface-container-high text-on-surface-variant",
    meta: "Feb 04, 6:22 PM • Reaction & Social Note",
    reaction: "favorite",
    quote: "Thanks so much for picking up the cold-pressed olive oil and sourdough! Cooking mushroom risotto tonight if you're home early!",
  },
  {
    id: "e5",
    type: "netting",
    icon: "all_inclusive",
    iconCls: "bg-primary-fixed-dim/40 text-primary",
    title: "3-Way Loop Netting Cycle Executed",
    status: "AUTO-OFFSET",
    statusCls: "bg-primary-fixed text-on-primary-fixed",
    meta: "Jan 15, 1:10 PM • Alex ↔ Sarah ↔ Marco",
    amount: `Saved ${inr0(6972)}`,
    amountCls: "text-primary",
    amountSub: "0 friction txns",
    note: "Tabsy algorithm collapsed cyclic balances between 3 accounts into a single zero-step closure.",
    resolved: "Resolved",
  },
];

const FILTERS = [
  { id: "all", label: "All Events", icon: "view_stream", iconCls: "text-primary", count: 42 },
  { id: "expense", label: "New Expenses", icon: "receipt_long", iconCls: "text-tertiary", count: 14 },
  { id: "settlement", label: "Direct Settlements", icon: "payments", iconCls: "text-primary", count: 18 },
  { id: "amendment", label: "Split Edits & Disputes", icon: "tune", iconCls: "text-secondary", count: 0 },
  { id: "netting", label: "Netting Cycles", icon: "hub", iconCls: "text-primary-container", count: 4 },
  { id: "social", label: "Pings & Reactions", icon: "favorite", iconCls: "text-tertiary-container", count: 6 },
];

const MILESTONES = [
  { icon: "military_tech", iconCls: "bg-primary-fixed text-on-primary-fixed", title: "Super Splitter Tier", sub: "12 consecutive months of 100% on-time settlements" },
  { icon: "handshake", iconCls: "bg-secondary-fixed text-on-secondary-fixed", title: "Zero-Dispute Cohort", sub: "42 settled expenses without arbitration or recalculations" },
];

const SPACES = [
  { name: "Brooklyn Loft #4B", status: "ACTIVE", dot: "bg-primary animate-pulse", cls: "bg-surface-container-high text-on-surface" },
  { name: "Tahoe Ski Cabin 2024", status: "ARCHIVED", dot: "bg-outline", cls: "bg-surface-container-high text-on-surface-variant" },
  { name: "Weekly Pantry Pool", status: "AUTO-SYNC", dot: "bg-primary-container", cls: "bg-primary-fixed/60 text-on-primary-fixed-variant" },
];

const QUICK = [
  { id: "nudge", icon: "notifications_active", label: "Nudge", cls: "bg-surface-container-low hover:bg-surface-container-high text-on-surface" },
  { id: "settle", icon: "bolt", label: `Settle ${inr0(4648)}`, cls: "bg-primary-fixed/50 hover:bg-primary-fixed text-on-primary-fixed-variant" },
  { id: "coffee", icon: "local_cafe", label: "Coffee?", cls: "bg-surface-variant/70 hover:bg-surface-variant text-secondary" },
  { id: "five", icon: "waving_hand", label: "High Five", cls: "bg-tertiary-fixed/60 hover:bg-tertiary-fixed text-on-tertiary-fixed-variant" },
];

const RAILS = [
  { id: "gpay", icon: "phone_iphone", label: "GPay", iconCls: "text-on-surface" },
  { id: "phonepe", icon: "swap_horiz", label: "PhonePe", iconCls: "text-secondary" },
  { id: "upi", icon: "account_balance", label: "UPI", iconCls: "text-primary" },
];

export default function FriendActivity() {
  const [filter, setFilter] = useState("all");
  const [selectedId, setSelectedId] = useState("e1");
  const [settleState, setSettleState] = useState("idle");
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);
  const settleTimer = useRef(null);

  function showToast(message, icon = "check_circle") {
    setToast({ message, icon });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }

  const events = useMemo(
    () => (filter === "all" ? EVENTS : EVENTS.filter((e) => e.type === filter)),
    [filter]
  );
  const selected = EVENTS.find((e) => e.id === selectedId) || EVENTS[0];

  function quickSettle() {
    if (settleState !== "idle") return;
    setSettleState("running");
    if (settleTimer.current) clearTimeout(settleTimer.current);
    settleTimer.current = setTimeout(() => {
      setSettleState("done");
      showToast(`Settled ${inr(4648)} with Sarah!`, "check_circle");
    }, 1100);
  }

  return (
    <AppLayout>
      <div className="bg-[#f7f6fd] font-body-md text-body-md text-on-surface antialiased min-h-screen">
        <main className="w-full pb-12">
          {/* In-page header */}
          <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 pt-5">
            <div className="flex items-center gap-2 text-[13px] text-on-surface-variant flex-wrap mb-3">
              <Link to="/dashboard" className="hover:text-primary transition-colors flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">home</span> Home
              </Link>
              <span className="text-outline-variant text-[14px]">/</span>
              <Link to="/friends" className="hover:text-primary transition-colors">Friends</Link>
              <span className="text-outline-variant text-[14px]">/</span>
              <Link to="/friend-profile" className="hover:text-primary transition-colors">Sarah Lin</Link>
              <span className="text-outline-variant text-[14px]">/</span>
              <span className="text-primary font-title-md font-semibold">Activity Studio</span>
            </div>

            <div className="bg-surface-container-lowest rounded-3xl p-5 lg:p-6 border border-surface-container shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-secondary-fixed flex items-center justify-center font-bold text-xl text-on-secondary-fixed-variant ring-2 ring-surface-container">SL</div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center ring-2 ring-surface-container-lowest shadow-sm">
                      <span className="material-symbols-outlined text-[14px]">verified</span>
                    </div>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="font-headline-md text-headline-md text-on-surface">Sarah Lin</h1>
                      <span className="bg-secondary-fixed text-on-secondary-fixed-variant px-2.5 py-0.5 rounded-full font-label-caps text-label-caps font-semibold">@sarah_lin</span>
                      <span className="bg-primary-fixed/40 text-on-primary-fixed-variant px-2.5 py-0.5 rounded-full font-label-caps text-label-caps font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">verified</span> Bilateral Trust: 99.4% Verified
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Member since Oct 2023 · Co-Host • Brooklyn Loft · 64 interconnected ledger nodes</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap md:justify-end shrink-0">
                  <div className="flex items-center gap-3 bg-tertiary-fixed/70 border border-tertiary-container/30 px-4 py-2.5 rounded-2xl">
                    <div className="w-10 h-10 rounded-xl bg-tertiary text-on-tertiary flex items-center justify-center shadow-xs shrink-0">
                      <span className="material-symbols-outlined text-[20px]">trending_down</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-caps text-label-caps uppercase text-on-tertiary-fixed-variant tracking-wider font-bold">Your Net Balance</span>
                      <span className="font-numeric-balance-md text-numeric-balance-md text-tertiary leading-tight">-{inr(4648)} <span className="text-[11px] text-tertiary/80 font-body-sm">due to Sarah</span></span>
                    </div>
                  </div>
                  <button className="h-12 px-6 rounded-2xl bg-primary hover:bg-primary-container text-on-primary font-title-md text-title-md transition-all flex items-center gap-2 shadow-sm hover:shadow justify-center shrink-0 disabled:opacity-80" type="button" onClick={quickSettle} disabled={settleState !== "idle"}>
                    <span className={`material-symbols-outlined text-[20px] ${settleState === "running" ? "animate-spin" : ""}`}>{settleState === "done" ? "check_circle" : settleState === "running" ? "refresh" : "bolt"}</span>
                    <span>{settleState === "done" ? `Settled ${inr(4648)}` : settleState === "running" ? "Settling..." : `Instant Settle ${inr(4648)}`}</span>
                  </button>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-surface-container flex items-center gap-2 overflow-x-auto">
                <Link to="/friend-profile" className="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors font-title-md text-body-md whitespace-nowrap">Profile</Link>
                <Link to="/friend-balances" className="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors font-title-md text-body-md flex items-center gap-1.5 whitespace-nowrap">
                  <span>Balances</span>
                  <span className="px-1.5 py-0.5 rounded-md bg-tertiary-fixed text-tertiary font-label-caps text-[11px]">-{inr(4648)}</span>
                </Link>
                <Link to="/friend-transactions" className="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors font-title-md text-body-md whitespace-nowrap">Transactions (28)</Link>
                <span className="px-4 py-2 rounded-xl bg-on-surface text-inverse-on-surface font-title-md text-body-md flex items-center gap-2 shadow-xs whitespace-nowrap">
                  <span className="material-symbols-outlined text-[16px]">timeline</span> Activity
                </span>
                <Link to="/friend-manage" className="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors font-title-md text-body-md whitespace-nowrap">Bilateral Rules</Link>
              </div>
            </div>
          </div>

          {/* 3-COLUMN BENTO */}
          <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

              {/* COL 1 */}
              <div className="lg:col-span-3 flex flex-col gap-5">
                {/* Activity Pulse */}
                <div className="bg-surface-container-lowest p-5 rounded-3xl shadow-sm flex flex-col gap-5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-title-md text-title-md text-on-surface font-bold truncate">Activity Pulse</h3>
                    <span className="shrink-0 px-2 py-0.5 rounded-full bg-surface-container-high font-label-caps text-label-caps text-on-surface-variant">LIFETIME</span>
                  </div>
                  <div className="relative mx-auto w-40 h-40">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                      <circle className="text-surface-container" cx="60" cy="60" fill="none" r="48" stroke="currentColor" strokeWidth="10" />
                      <circle className="text-primary-container" cx="60" cy="60" fill="none" r="48" stroke="currentColor" strokeWidth="10" strokeDasharray="150.6 301.6" strokeDashoffset="0" />
                      <circle className="text-secondary" cx="60" cy="60" fill="none" r="48" stroke="currentColor" strokeWidth="10" strokeDasharray="86.9 301.6" strokeDashoffset="-153.6" />
                      <circle className="text-tertiary-container" cx="60" cy="60" fill="none" r="48" stroke="currentColor" strokeWidth="10" strokeDasharray="34.8 301.6" strokeDashoffset="-243.5" />
                      <circle className="text-primary-fixed-dim" cx="60" cy="60" fill="none" r="48" stroke="currentColor" strokeWidth="10" strokeDasharray="17.4 301.6" strokeDashoffset="-281.3" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="font-numeric-balance-lg text-numeric-balance-lg leading-none font-bold text-on-surface">64</span>
                      <span className="mt-1 font-label-caps text-[10px] tracking-wide uppercase text-on-surface-variant">Shared Nodes</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 bg-surface-container-low p-3 rounded-2xl">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Avg Turnaround</span>
                      <span className="font-title-md text-title-md font-bold text-primary">1.2 Days</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-body-sm text-body-sm text-on-surface-variant">On-Time Rate</span>
                      <span className="font-title-md text-title-md font-bold text-on-surface">100% (42/42)</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {[
                      { cls: "bg-primary-container", label: "Expenses & Shared Bills", pct: "52%" },
                      { cls: "bg-secondary", label: "Direct Settlements", pct: "30%" },
                      { cls: "bg-tertiary-container", label: "Social Reactions & Pings", pct: "12%" },
                      { cls: "bg-primary-fixed-dim", label: "Netting Auto-Offsets", pct: "6%" },
                    ].map((k) => (
                      <div key={k.label} className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${k.cls}`} />
                          <span className="text-on-surface-variant truncate text-body-sm font-body-sm">{k.label}</span>
                        </div>
                        <span className="font-semibold text-on-surface shrink-0 text-body-sm font-body-sm">{k.pct}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timeline Filters */}
                <div className="bg-surface-container-lowest p-5 rounded-3xl shadow-sm flex flex-col gap-2">
                  <span className="font-title-md text-title-md text-on-surface font-bold">Timeline Filters</span>
                  <div className="flex flex-col gap-1 mt-1">
                    {FILTERS.map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setFilter(f.id)}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl transition-colors ${
                          filter === f.id ? "bg-surface-container-high text-on-surface" : "hover:bg-surface-container-low text-on-surface-variant"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`material-symbols-outlined text-[18px] ${f.iconCls}`}>{f.icon}</span>
                          <span className="font-title-md text-body-md">{f.label}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full font-body-sm text-body-sm ${filter === f.id ? "bg-surface-container-lowest text-on-surface font-semibold" : "bg-surface-container-low text-on-surface-variant"}`}>{f.count}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Audit Ledger */}
                <div className="bg-surface-container-high/60 p-5 rounded-3xl flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-on-surface">
                    <span className="material-symbols-outlined text-[18px] text-primary">verified_user</span>
                    <span className="font-title-md text-title-md font-bold">Audit Ledger Immutable</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    All 64 bilateral ledger states between @alex_chen and @sarah_lin are hashed on Tabsy Core Merkle Rollup #11082.
                  </p>
                  <div className="flex items-center justify-between pt-2 gap-2">
                    <span className="font-mono text-body-sm text-outline truncate">SHA-256: 7b84...92fc</span>
                    <span className="text-primary font-bold font-label-caps text-label-caps shrink-0">0 DISPUTES</span>
                  </div>
                </div>
              </div>

              {/* COL 2 */}
              <div className="lg:col-span-5 flex flex-col gap-5">
                {/* Quick micro-interactions */}
                <div className="bg-surface-container-lowest p-4 rounded-3xl shadow-sm flex flex-col gap-2">
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase px-1">Quick Micro-Interactions</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {QUICK.map((q) => (
                      <button key={q.id} type="button" onClick={() => (q.id === "settle" ? quickSettle() : showToast(`${q.label} sent to Sarah`, q.icon))} className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-body-sm font-semibold transition-all ${q.cls}`}>
                        <span className="material-symbols-outlined text-[16px]">{q.icon}</span>
                        <span>{q.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Feed header */}
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="font-headline-sm text-headline-sm text-on-surface font-bold">Ledger Feed</span>
                    <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-label-caps text-label-caps font-semibold">Live Real-time</span>
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Sorted by recent</span>
                </div>

                {/* Feed cards */}
                <div className="flex flex-col gap-4">
                  {events.length === 0 && (
                    <div className="bg-surface-container-lowest rounded-3xl p-8 text-center text-on-surface-variant shadow-sm">
                      <span className="material-symbols-outlined text-[32px] text-outline">inbox</span>
                      <p className="font-body-sm text-body-sm mt-2">No events in this category yet.</p>
                    </div>
                  )}
                  {events.map((e) => (
                    <button key={e.id} type="button" onClick={() => setSelectedId(e.id)} className={`text-left bg-surface-container-lowest rounded-3xl p-5 shadow-sm transition-all flex flex-col gap-3 hover:shadow-md ${selectedId === e.id ? "ring-2 ring-primary" : ""}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${e.iconCls}`}>
                            <span className="material-symbols-outlined text-[20px]">{e.icon}</span>
                          </div>
                          <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-title-md text-title-md font-bold text-on-surface">{e.title}</span>
                              <span className={`px-2 py-0.5 rounded-full font-label-caps text-label-caps font-bold ${e.statusCls}`}>{e.status}</span>
                            </div>
                            <span className="font-body-sm text-body-sm text-on-surface-variant">{e.meta}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end shrink-0">
                          <span className={`font-title-md text-title-md font-bold ${e.amountCls}`}>{e.amount}</span>
                          {e.amountSub && <span className="font-body-sm text-body-sm text-outline whitespace-nowrap">{e.amountSub}</span>}
                        </div>
                      </div>

                      {/* Card-specific detail */}
                      {e.items && (
                        <div className="bg-surface-container-low rounded-2xl p-3 flex flex-col gap-2">
                          <div className="flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant border-b border-surface-container pb-1.5">
                            <span>Receipt Itemization ({e.items.length} items)</span>
                            <span className="text-primary font-semibold flex items-center gap-0.5">
                              <span className="material-symbols-outlined text-[14px]">auto_awesome</span> OCR Scanned
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-body-sm font-body-sm text-on-surface">
                            {e.items.map((it) => (
                              <div key={it.name} className="flex justify-between gap-2">
                                <span className="truncate">{it.name}</span>
                                <span className="font-semibold shrink-0">{inr(it.amt)}</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center gap-2 pt-1">
                            <span className="px-3 py-1.5 rounded-full bg-primary text-on-primary font-title-md text-body-md shadow-sm flex items-center gap-1">
                              <span className="material-symbols-outlined text-[16px]">credit_card</span> Pay {inr(4648)} via GPay
                            </span>
                            <span className="px-3 py-1.5 rounded-full bg-surface-container-high text-on-surface font-title-md text-body-md flex items-center gap-1">
                              <span className="material-symbols-outlined text-[16px]">receipt</span> View Receipt
                            </span>
                          </div>
                        </div>
                      )}

                      {e.note && !e.items && (
                        <p className={`font-body-sm text-body-sm text-on-surface-variant p-3 rounded-2xl ${e.type === "social" ? "bg-tertiary-fixed/30 italic flex items-start gap-2" : "bg-surface-container-low"}`}>
                          {e.type === "social" && <span className="material-symbols-outlined text-[18px] text-tertiary shrink-0 mt-0.5">format_quote</span>}
                          <span>{e.type === "social" ? `"${e.quote}"` : e.note}</span>
                        </p>
                      )}

                      {e.statusText && (
                        <div className="flex items-center justify-between bg-surface-container-low px-3 py-2 rounded-2xl gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="material-symbols-outlined text-[18px] text-primary shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                            <span className="font-body-sm text-body-sm text-on-surface font-medium truncate">{e.note}</span>
                          </div>
                          <span className="font-mono text-body-sm text-outline shrink-0">{e.statusText}</span>
                        </div>
                      )}

                      {e.type === "netting" && (
                        <div className="bg-surface-container-low p-3 rounded-2xl flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="material-symbols-outlined text-[16px] text-primary shrink-0">route</span>
                            <span className="text-on-surface-variant font-body-sm text-body-sm truncate">{e.note}</span>
                          </div>
                          <span className="font-semibold text-primary shrink-0">{e.resolved}</span>
                        </div>
                      )}

                      {e.type === "amendment" && e.note && (
                        <p className="font-body-sm text-body-sm text-on-surface-variant bg-surface-container-low p-3 rounded-2xl">{e.note}</p>
                      )}

                      {e.reaction && (
                        <span className="self-start px-2.5 py-1 rounded-full bg-tertiary-fixed text-tertiary text-title-md font-bold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span> Reacted
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                <button type="button" onClick={() => showToast("Loaded prior 38 events (2024 archive)", "expand_more")} className="w-full py-3 rounded-2xl bg-surface-container-high hover:bg-surface-variant text-on-surface font-title-md text-body-md transition-colors flex items-center justify-center gap-2">
                  <span>Load Prior 38 Events (2024 Archive)</span>
                  <span className="material-symbols-outlined text-[16px]">expand_more</span>
                </button>
              </div>

              {/* COL 3 */}
              <div className="lg:col-span-4 flex flex-col gap-5">
                {/* Active Inspector */}
                <div className="bg-surface-container-lowest p-5 rounded-3xl shadow-sm flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="font-title-md text-title-md text-on-surface font-bold">Active Inspector</span>
                    <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-caps text-label-caps font-bold">FOCUSED EVENT</span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="font-headline-sm text-headline-sm text-on-surface font-bold">{selected.title}</span>
                    <div className="flex items-center gap-2 text-body-sm font-body-sm text-on-surface-variant flex-wrap">
                      <span className="material-symbols-outlined text-[16px] text-outline">storefront</span>
                      <span>{selected.store || "Tabsy Ledger"}</span>
                      {selected.receiptNo && (
                        <>
                          <span>•</span>
                          <span className="font-mono">Receipt {selected.receiptNo}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Receipt visual */}
                  <div className="relative w-full h-40 rounded-2xl overflow-hidden bg-gradient-to-br from-primary-fixed/40 via-secondary-fixed/30 to-tertiary-fixed/40 flex flex-col justify-end p-3">
                    <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 25% 25%, rgba(255,255,255,0.7), transparent 45%), radial-gradient(circle at 75% 70%, rgba(255,255,255,0.5), transparent 45%)" }} />
                    <div className="relative z-10 flex items-center justify-between text-on-surface">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[18px]">document_scanner</span>
                        <span className="font-body-sm text-body-sm font-medium">Verified Paper Slip</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-surface-container-lowest/90 text-on-surface font-label-caps text-label-caps font-bold">99.2% OCR</span>
                    </div>
                  </div>

                  {/* Line-item formula */}
                  <div className="bg-surface-container-low p-3 rounded-2xl flex flex-col gap-1.5 text-body-sm font-body-sm">
                    {selected.gross ? (
                      <>
                        <div className="flex justify-between text-on-surface-variant gap-2">
                          <span>Gross Checkout Total</span>
                          <span className="font-mono text-on-surface font-semibold shrink-0">{inr(selected.gross)}</span>
                        </div>
                        <div className="flex justify-between text-on-surface-variant gap-2">
                          <span>Allocation Policy</span>
                          <span className="font-semibold text-on-surface text-right">{selected.policy}</span>
                        </div>
                        <div className="flex justify-between text-on-surface-variant gap-2">
                          <span>Sarah's Contribution</span>
                          <span className="text-primary font-semibold shrink-0">{selected.contribution}</span>
                        </div>
                        <div className="border-t border-surface-container-high pt-1.5 flex justify-between font-title-md text-title-md gap-2">
                          <span className="text-on-surface font-bold">Your Balance Adjustment</span>
                          <span className="text-tertiary font-bold shrink-0">{selected.adjustment}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between text-on-surface-variant gap-2">
                          <span>Event Amount</span>
                          <span className={`font-semibold shrink-0 ${selected.amountCls}`}>{selected.amount}</span>
                        </div>
                        <div className="flex justify-between text-on-surface-variant gap-2">
                          <span>Summary</span>
                          <span className="font-semibold text-on-surface text-right">{selected.amountSub || "—"}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Settlement rails */}
                  <div className="flex flex-col gap-2 pt-1">
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Settle this tab instantly</span>
                    <div className="grid grid-cols-3 gap-2">
                      {RAILS.map((r) => (
                        <button key={r.id} type="button" onClick={() => showToast(`Settle via ${r.label}`, "send")} className="flex flex-col items-center justify-center p-2 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors text-center">
                          <span className={`material-symbols-outlined text-[20px] ${r.iconCls}`}>{r.icon}</span>
                          <span className="font-body-sm text-body-sm font-semibold mt-1">{r.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Mutual Milestones */}
                <div className="bg-surface-container-lowest p-5 rounded-3xl shadow-sm flex flex-col gap-3">
                  <span className="font-title-md text-title-md text-on-surface font-bold">Mutual Milestones</span>
                  <div className="flex flex-col gap-3">
                    {MILESTONES.map((m) => (
                      <div key={m.title} className="flex items-center gap-3 p-2 bg-surface-container-low rounded-2xl">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${m.iconCls}`}>
                          <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>{m.icon}</span>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-title-md text-body-md font-bold text-on-surface">{m.title}</span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">{m.sub}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shared Spaces */}
                <div className="bg-surface-container-lowest p-5 rounded-3xl shadow-sm flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="font-title-md text-title-md text-on-surface font-bold">Shared Spaces</span>
                    <span className="font-body-sm text-body-sm text-primary font-semibold">Manage</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {SPACES.map((s) => (
                      <div key={s.name} className="flex items-center justify-between p-2 rounded-xl bg-surface-container-low gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${s.dot}`} />
                          <span className="font-title-md text-body-md text-on-surface font-medium truncate">{s.name}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full font-label-caps text-label-caps font-bold shrink-0 ${s.cls}`}>{s.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {toast && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-inverse-surface text-inverse-on-surface px-5 py-3 rounded-2xl shadow-2xl">
            <span className="material-symbols-outlined text-primary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>{toast.icon}</span>
            <span className="font-body-md text-body-md font-medium">{toast.message}</span>
          </div>
        )}
      </div>
    </AppLayout>
  );
}