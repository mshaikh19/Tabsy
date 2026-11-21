import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import Breadcrumbs from "../components/layout/Breadcrumbs";
import { BALANCES_TABS } from "../constants/balancesNav";

const RUPEE = "₹";
const inr = (n) => RUPEE + Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const inr0 = (n) => RUPEE + Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });

const TABS = BALANCES_TABS;

const VOLUME = 205840;
const SETTLED_TOTAL = 160522;
const NET = 11827.5;
const SAVES = 19920;

const GROUPS = [
  { id: "all", name: "All Groups & Circles" },
  { id: "loft", name: "Brooklyn Loft #4B" },
  { id: "tahoe", name: "Tahoe Ski Trip 2025" },
  { id: "dinner", name: "Dinner & Weekend Outings" },
];

const RECEIVE = [
  {
    id: "marcus",
    name: "Marcus Vance",
    handle: "@marcus_v",
    group: "tahoe",
    groupLabel: "Tahoe Ski Trip",
    sub: "Tahoe Cabin rental share + Gas surcharge",
    amount: 10665.5,
    note: "Agreed 5-way split via receipt OCR",
    noteIcon: "verified",
    noteCls: "text-primary",
    meta: "Ping sent 2h ago",
    action: "settle",
    avatar: "bg-matcha-100 text-matcha-800",
    dirIcon: "south_west",
    dirCls: "bg-primary-container text-on-primary",
  },
  {
    id: "chloe",
    name: "Chloe Bennett",
    handle: "@chloeb",
    group: "dinner",
    groupLabel: "Live Concerts",
    sub: "Radiohead Tribute VIP pass • Tier 1",
    amount: 7802,
    note: "Expensed 3 days ago • Venmo linked",
    noteIcon: "calendar_today",
    noteCls: "text-on-surface-variant",
    meta: "Payment in transit",
    metaCls: "bg-primary-fixed/80 text-on-primary-fixed",
    action: "ping",
    avatar: "bg-sky-100 text-sky-700",
    dirIcon: "south_west",
    dirCls: "bg-primary-container text-on-primary",
  },
  {
    id: "alex",
    name: "Alex Morgan",
    handle: "@alex_m",
    group: "loft",
    groupLabel: "Loft Food",
    sub: "Trader Joe's pantry restock run • Personal Tab",
    amount: 7470,
    note: "Pending split confirmation",
    noteIcon: "shopping_cart",
    noteCls: "text-on-surface-variant",
    meta: "Personal Tab balance",
    action: "nudge",
    avatar: "bg-lilac-100 text-lilac-700",
    dirIcon: "south_west",
    dirCls: "bg-primary-container text-on-primary",
  },
];

const PAY = [
  {
    id: "jason",
    name: "Jason Wu",
    handle: "@jason_wu",
    group: "loft",
    groupLabel: "Brooklyn Loft #4B",
    sub: "Gigabit WiFi & Electric utility Q1 invoice",
    amount: 9462,
    meta: "Due Mar 1",
    metaCls: "text-error font-semibold",
    note: "Auto-nets with Marcus if accepted",
    noteIcon: "account_balance_wallet",
    noteCls: "text-secondary",
    action: "pay",
    avatar: "bg-buttercup-100 text-buttercup-700",
    dirIcon: "north_east",
    dirCls: "bg-tertiary text-on-tertiary",
  },
  {
    id: "sarah",
    name: "Sarah Lin",
    handle: "@sarah_lin",
    group: "loft",
    groupLabel: "Brooklyn Loft #4B",
    sub: "Pantry bulk groceries & artisanal coffee beans",
    amount: 4648,
    meta: "Due Feb 28",
    metaCls: "text-on-surface-variant",
    note: "Preference: Apple Cash",
    noteIcon: null,
    noteCls: "text-on-surface",
    action: "payDark",
    avatar: "bg-peach-100 text-peach-700",
    dirIcon: "north_east",
    dirCls: "bg-tertiary text-on-tertiary",
  },
];

const NUDGES = [
  "Settling tonight after work! 🏠",
  "Coffee on me tomorrow! ☕",
  "High five! All sorted on Tabsy 🙌",
];

function FlowGraph({ netting }) {
  return (
    <div className="w-full bg-surface-container-low rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden">
      <svg className="w-full h-auto max-w-[340px]" fill="none" viewBox="0 0 360 260" xmlns="http://www.w3.org/2000/svg">
        <path d="M 60 70 Q 180 20 300 70" opacity="0.6" stroke="#bbcabf" strokeDasharray="4 4" strokeWidth="2" />
        <path d="M 60 190 Q 180 240 300 190" opacity="0.6" stroke="#bbcabf" strokeDasharray="4 4" strokeWidth="2" />
        <path d="M 70 70 L 170 120" markerEnd="url(#arrow-emerald)" stroke="#10b981" strokeLinecap="round" strokeWidth="3" />
        <path d="M 70 190 L 170 140" markerEnd="url(#arrow-emerald)" stroke="#10b981" strokeLinecap="round" strokeWidth="2.5" />
        <path d="M 190 125 L 290 75" markerEnd="url(#arrow-coral)" stroke="#bc0b3b" strokeLinecap="round" strokeWidth="3" />
        <path d="M 190 135 L 290 185" markerEnd="url(#arrow-coral)" stroke="#bc0b3b" strokeLinecap="round" strokeWidth="2" />
        {netting && <path d="M 80 60 C 180 -10, 220 10, 290 60" stroke="#4648d4" strokeDasharray="3 3" strokeWidth="2.5" opacity="0.9" />}
        <defs>
          <marker id="arrow-emerald" markerHeight="6" markerWidth="6" orient="auto-start-reverse" refX="6" refY="5" viewBox="0 0 10 10">
            <path d="M 0 1 L 8 5 L 0 9 z" fill="#10b981" />
          </marker>
          <marker id="arrow-coral" markerHeight="6" markerWidth="6" orient="auto-start-reverse" refX="6" refY="5" viewBox="0 0 10 10">
            <path d="M 0 1 L 8 5 L 0 9 z" fill="#bc0b3b" />
          </marker>
        </defs>
        <g transform="translate(60, 60)">
          <circle fill="#ffffff" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.06))" r="22" />
          <circle fill="#f2f3ff" r="20" />
          <text fill="#131b2e" fontFamily="Plus Jakarta Sans" fontSize="11" fontWeight="700" textAnchor="middle" y="4">MV</text>
          <text fill="#3c4a42" fontFamily="Plus Jakarta Sans" fontSize="10" textAnchor="middle" y="34">Marcus</text>
        </g>
        <g transform="translate(60, 200)">
          <circle fill="#ffffff" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.06))" r="22" />
          <circle fill="#f2f3ff" r="20" />
          <text fill="#131b2e" fontFamily="Plus Jakarta Sans" fontSize="11" fontWeight="700" textAnchor="middle" y="4">CB</text>
          <text fill="#3c4a42" fontFamily="Plus Jakarta Sans" fontSize="10" textAnchor="middle" y="34">Chloe</text>
        </g>
        <g transform="translate(180, 130)">
          <circle fill="#10b981" filter="drop-shadow(0 4px 10px rgba(16,185,129,0.3))" r="28" />
          <text fill="#ffffff" fontFamily="Plus Jakarta Sans" fontSize="12" fontWeight="800" textAnchor="middle" y="4">YOU</text>
          <text fill="#006c49" fontFamily="Inter" fontSize="11" fontWeight="700" textAnchor="middle" y="40">+{inr0(NET)} net</text>
        </g>
        <g transform="translate(300, 60)">
          <circle fill="#ffffff" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.06))" r="22" />
          <circle fill="#ffdadb" r="20" />
          <text fill="#bc0b3b" fontFamily="Plus Jakarta Sans" fontSize="11" fontWeight="700" textAnchor="middle" y="4">JW</text>
          <text fill="#3c4a42" fontFamily="Plus Jakarta Sans" fontSize="10" textAnchor="middle" y="34">Jason</text>
        </g>
        <g transform="translate(300, 200)">
          <circle fill="#ffffff" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.06))" r="22" />
          <circle fill="#ffdadb" r="20" />
          <text fill="#bc0b3b" fontFamily="Plus Jakarta Sans" fontSize="11" fontWeight="700" textAnchor="middle" y="4">SL</text>
          <text fill="#3c4a42" fontFamily="Plus Jakarta Sans" fontSize="10" textAnchor="middle" y="34">Sarah</text>
        </g>
      </svg>
      <div className="mt-2 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm text-center">
        <span className="material-symbols-outlined text-secondary text-[16px] shrink-0">insights</span>
        <span className="text-xs text-on-surface font-medium break-words">
          {netting ? `Marcus can directly transfer ${inr0(9462)} to Jason to collapse 2 debts` : "Netting preview is off — turn it on to see the optimal shortcut"}
        </span>
      </div>
    </div>
  );
}

function SettlementCard({ item, onSettle, onNudge, onPay, onPayDark }) {
  return (
    <div className="bg-surface-container-lowest rounded-3xl p-5 border border-surface-container shadow-sm hover:shadow-md transition-all flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0 flex-1">
          <div className="shrink-0 self-start">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-label-caps text-sm font-bold ${item.avatar}`}>
              {item.name.split(" ").map((w) => w[0]).join("")}
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-title-md text-[15px] text-on-surface font-bold">{item.name}</h3>
              <span className="text-xs text-on-surface-variant">{item.handle}</span>
              <span className="font-label-caps text-[10px] uppercase bg-surface-container-high px-2 py-0.5 rounded-full text-on-surface-variant font-semibold">{item.groupLabel}</span>
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5 break-words">{item.sub}</p>
          </div>
        </div>
        <div className="shrink-0 flex flex-col items-start sm:items-end gap-1.5">
          <span className={`inline-flex items-center gap-1 font-label-caps text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
            item.dirIcon === "south_west" ? "bg-matcha-100 text-matcha-800" : "bg-peach-100 text-tertiary"
          }`}>
            <span className="material-symbols-outlined text-[13px] leading-none">{item.dirIcon}</span>
            {item.dirIcon === "south_west" ? "Owes you" : "You owe"}
          </span>
          <div className={`text-[22px] font-extrabold font-mono leading-none ${item.dirIcon === "south_west" ? "text-primary" : "text-tertiary"}`}>
            {item.dirIcon === "south_west" ? "+" : "−"}{inr(item.amount)}
          </div>
          {item.metaCls ? (
            <span className={`inline-block font-label-caps text-[10px] px-2 py-0.5 rounded-full font-bold mt-0.5 ${item.metaCls}`}>{item.meta}</span>
          ) : (
            <span className="text-xs text-on-surface-variant block">{item.meta}</span>
          )}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 bg-surface-container-low/60 p-3.5 rounded-2xl">
        <div className="flex items-center gap-2 min-w-0">
          {item.noteIcon && <span className={`material-symbols-outlined text-[18px] shrink-0 ${item.noteCls}`}>{item.noteIcon}</span>}
          <span className={`text-xs break-words ${item.note === "Preference: Apple Cash" ? "text-on-surface-variant" : "text-on-surface"}`}>
            {item.note === "Preference: Apple Cash" ? "Preference: " : ""}
            {item.note === "Preference: Apple Cash" ? <span className="font-semibold">Apple Cash</span> : item.note}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {item.action === "settle" && (
            <>
              <button type="button" onClick={onNudge} className="px-3.5 py-1.5 bg-surface-container-lowest hover:bg-surface-container text-on-surface rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-secondary">mark_chat_unread</span>
                <span>Send Friendly Nudge</span>
              </button>
              <button type="button" onClick={onSettle} className="px-3.5 py-1.5 bg-primary-fixed hover:bg-primary-fixed-dim text-on-primary-fixed text-xs font-bold rounded-xl transition-all shadow-sm">
                Mark Settled as Received
              </button>
            </>
          )}
          {item.action === "ping" && (
            <>
              <button type="button" onClick={onNudge} className="px-3.5 py-1.5 bg-surface-container-lowest hover:bg-surface-container text-on-surface rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-primary">thumb_up</span>
                <span>Friendly Ping</span>
              </button>
              <button type="button" onClick={onNudge} className="px-3 py-1.5 bg-surface-container-lowest hover:bg-surface-container text-on-surface-variant hover:text-on-surface rounded-xl text-xs transition-all flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                <span>View Receipt</span>
              </button>
            </>
          )}
          {item.action === "nudge" && (
            <>
              <button type="button" onClick={onNudge} className="px-3.5 py-1.5 bg-surface-container-lowest hover:bg-surface-container text-primary rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">send</span>
                <span>Send Nudge</span>
              </button>
              <button type="button" onClick={onNudge} className="px-3 py-1.5 bg-surface-container-lowest hover:bg-surface-container text-on-surface-variant hover:text-on-surface rounded-xl text-xs transition-all flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">format_list_bulleted</span>
                <span>Split Details</span>
              </button>
            </>
          )}
          {item.action === "pay" && (
            <button type="button" onClick={onPay} className="px-4 py-2 bg-primary text-on-primary hover:bg-primary-container text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">bolt</span>
              <span>Instant Pay {inr0(item.amount)} via Apple Cash</span>
            </button>
          )}
          {item.action === "payDark" && (
            <button type="button" onClick={onPayDark} className="px-4 py-2 bg-inverse-surface text-inverse-on-surface hover:opacity-90 text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">phone_iphone</span>
              <span>Pay {inr0(item.amount)} Now</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function WhoOwesWhom() {
  const [netting, setNetting] = useState(true);
  const [filter, setFilter] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [basket, setBasket] = useState(["sarah", "jason"]);
  const [settled, setSettled] = useState([]);
  const [toast, setToast] = useState(null);

  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  }

  const groupName = GROUPS.find((g) => g.id === filter)?.name || "All Groups & Circles";

  const receive = useMemo(() => RECEIVE.filter((r) => (filter === "all" || r.group === filter) && !settled.includes(r.id)), [filter, settled]);
  const pay = useMemo(() => PAY.filter((p) => (filter === "all" || p.group === filter) && !settled.includes(p.id)), [filter, settled]);

  const receiveTotal = receive.reduce((s, r) => s + r.amount, 0);
  const payTotal = pay.reduce((s, p) => s + p.amount, 0);

  const basketItems = PAY.filter((p) => basket.includes(p.id));
  const basketTotal = basketItems.reduce((s, p) => s + p.amount, 0);

  function toggleBasket(id) {
    setBasket((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function settleOne(id, name, amount) {
    setSettled((prev) => [...prev, id]);
    showToast(`Ledger rebalanced — ${inr(amount)} settled with ${name}`);
  }

  function batchSettle() {
    if (!basket.length) {
      showToast("Select at least one obligation to settle");
      return;
    }
    setSettled((prev) => [...new Set([...prev, ...basket])]);
    showToast(`Batch settled — ${inr(basketTotal)} paid via Apple Cash`);
    setBasket([]);
  }

  return (
    <AppLayout>
      <main className="w-full min-h-screen overflow-x-clip">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumbs
            items={[
              { label: "Balances", to: "/balances", icon: "account_balance_wallet" },
              { label: "Who Owes Whom" },
            ]}
            status={{ label: "Bilateral Clearing Node #98124", note: "Ledger synchronized" }}
          />

          {/* Page header — GroupHeader-style card */}
          <div className="relative overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm shadow-zinc-900/5 border border-outline-variant/60 w-full px-4 py-3.5 sm:px-5 mb-5">
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              <div className="flex flex-col gap-1.5 min-w-0">
                <div className="flex items-center flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded-full bg-primary-fixed/40 text-on-primary-fixed-variant font-label-caps text-label-caps uppercase flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" />
                    Bilateral Clearing Desk
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-matcha-100 border border-matcha-200 text-matcha-800 text-[11px] font-bold font-mono flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">verified</span>
                    Double-entry verified
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-sky-100 border border-sky-200 text-pastel-sky-deep text-[11px] font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-pastel-sky-deep" />
                    INR Ledger Active
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-on-surface tracking-tight leading-none">Who Owes Whom</h1>
                <p className="font-body-sm text-body-sm text-on-surface-variant max-w-2xl leading-snug">
                  A single directional ledger of every bilateral obligation — with algorithmic netting to collapse circular debt.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setFilterOpen((v) => !v)}
                    className="flex items-center gap-2 bg-surface-container-low hover:bg-surface-container px-3.5 py-2 rounded-xl text-xs font-semibold text-on-surface border border-surface-container transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px] text-primary">filter_alt</span>
                    <span className="text-left leading-snug break-words">{groupName}</span>
                    <span className="material-symbols-outlined text-[16px] text-on-surface-variant">expand_more</span>
                  </button>
                  {filterOpen && (
                    <div className="absolute right-0 mt-1 w-56 z-30 bg-surface-container-lowest border border-surface-container rounded-2xl shadow-lg p-1.5">
                      {GROUPS.map((g) => (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => { setFilter(g.id); setFilterOpen(false); }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors flex items-center justify-between gap-2 ${
                            filter === g.id ? "bg-matcha-100 text-matcha-800 font-bold" : "text-on-surface hover:bg-surface-container"
                          }`}
                        >
                          <span className="break-words">{g.name}</span>
                          {filter === g.id && <span className="material-symbols-outlined text-[15px]">check</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button type="button" onClick={() => showToast("Record expense flow opened")} className="px-3.5 py-2 rounded-xl bg-primary text-on-primary hover:bg-primary-container text-xs font-bold shadow-sm transition-all flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">add_circle</span>
                  <span>Record Expense</span>
                </button>
              </div>
            </div>

            {/* Sub-nav row (inside card) */}
            <div className="relative z-10 mt-3 pt-3 border-t border-surface-container flex items-center gap-1.5 overflow-x-auto">
              {TABS.map((t) => {
                const cls = `px-3.5 py-2 rounded-xl font-title-md text-xs flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  t.id === "who"
                    ? "bg-matcha-100 text-matcha-800 font-bold shadow-sm"
                    : "text-on-surface-variant hover:bg-surface-container font-semibold"
                }`;
                const inner = (
                  <>
                    <span className="material-symbols-outlined text-base" style={t.id === "who" ? { fontVariationSettings: "'FILL' 1" } : undefined}>{t.icon}</span>
                    <span>{t.label}</span>
                    {t.badge && <span className="bg-peach-100 text-tertiary text-[10px] font-bold px-1.5 py-0.5 rounded-full">{t.badge}</span>}
                  </>
                );
                return t.to ? (
                  <Link key={t.id} to={t.to} className={cls}>{inner}</Link>
                ) : (
                  <span key={t.id} className={cls}>{inner}</span>
                );
              })}
            </div>
          </div>

          {/* KPI strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
            <div className="bg-surface-container-lowest rounded-3xl p-5 border border-surface-container shadow-sm flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant font-mono break-words">Active Tab Volume</span>
                <span className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined text-[18px]">refresh</span>
                </span>
              </div>
              <div>
                <div className="text-[26px] font-extrabold tracking-tight font-mono text-on-surface">{inr0(VOLUME)}</div>
                <p className="text-xs text-on-surface-variant mt-1 flex items-center gap-1">
                  <span className="text-primary font-semibold">+14.2%</span> across 3 active circles
                </p>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-3xl p-5 border border-surface-container shadow-sm flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant font-mono break-words">Unsettled Pairs</span>
                <span className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary shrink-0">
                  <span className="material-symbols-outlined text-[18px]">sync_alt</span>
                </span>
              </div>
              <div>
                <div className="text-[26px] font-extrabold tracking-tight text-on-surface">6 Obligations</div>
                <p className="text-xs text-on-surface-variant mt-1">3 receiving • 3 pending payout</p>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-3xl p-5 border border-surface-container shadow-sm flex flex-col justify-between gap-3 hover:bg-surface-container-low transition-all">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-secondary font-mono break-words">Optimization Alert</span>
                <span className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary shrink-0">
                  <span className="material-symbols-outlined text-[18px]">hub</span>
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[26px] font-extrabold tracking-tight text-on-surface">2 Netting Loops</span>
                  <span className="bg-secondary-fixed-dim text-secondary font-label-caps text-[10px] px-2 py-0.5 rounded-full font-bold">Saves {inr0(SAVES)}</span>
                </div>
                <p className="text-xs text-on-surface-variant mt-1 break-words">Collapses 4 txs: Marcus → Jason → You</p>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-3xl p-5 border border-surface-container shadow-sm flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant font-mono break-words">Settlement Velocity</span>
                <span className="text-xs text-primary font-bold shrink-0">78% Complete</span>
              </div>
              <div>
                <div className="w-full bg-surface-container h-2.5 rounded-full overflow-hidden mb-2">
                  <div className="bg-primary-container h-full rounded-full transition-all duration-700" style={{ width: "78%" }} />
                </div>
                <p className="text-xs text-on-surface-variant flex justify-between gap-2">
                  <span>Target: 100% by Feb 28</span>
                  <span className="text-on-surface font-semibold shrink-0">{inr0(SETTLED_TOTAL)}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* LEFT RAIL */}
            <section className="lg:col-span-7 min-w-0 flex flex-col gap-4">
              {/* People who owe you */}
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between gap-2 px-1 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary-container" />
                    <h2 className="font-headline-sm text-lg text-on-surface font-bold">People Who Owe You</h2>
                  </div>
                  <span className="text-xs font-bold text-primary bg-primary-fixed/50 px-3 py-1 rounded-full">+{inr(receiveTotal)} Total Incoming</span>
                </div>
                {receive.length === 0 && (
                  <p className="text-xs text-on-surface-variant px-1">No outstanding incoming debts in this circle.</p>
                )}
                {receive.map((item) => (
                  <SettlementCard
                    key={item.id}
                    item={item}
                    onSettle={() => settleOne(item.id, item.name, item.amount)}
                    onNudge={() => showToast(`Friendly nudge sent to ${item.name}`)}
                  />
                ))}
              </div>

              {/* People you owe */}
              <div className="flex flex-col gap-2.5 pt-1">
                <div className="flex items-center justify-between gap-2 px-1 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-tertiary-container" />
                    <h2 className="font-headline-sm text-lg text-on-surface font-bold">People You Owe</h2>
                  </div>
                  <span className="text-xs font-bold text-tertiary bg-tertiary-fixed/50 px-3 py-1 rounded-full">−{inr(payTotal)} Total Outgoing</span>
                </div>
                {pay.length === 0 && (
                  <p className="text-xs text-on-surface-variant px-1">Nothing outstanding here — you are fully settled.</p>
                )}
                {pay.map((item) => (
                  <SettlementCard
                    key={item.id}
                    item={item}
                    onPay={() => settleOne(item.id, item.name, item.amount)}
                    onPayDark={() => settleOne(item.id, item.name, item.amount)}
                  />
                ))}
              </div>
            </section>

            {/* RIGHT RAIL */}
            <aside className="lg:col-span-5 min-w-0 flex flex-col gap-4">
              {/* Bilateral flow */}
              <div className="bg-surface-container-lowest rounded-3xl p-6 border border-surface-container shadow-sm flex flex-col gap-4">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="min-w-0">
                    <h3 className="font-headline-sm text-lg text-on-surface font-bold">Bilateral Debt Flow</h3>
                    <p className="text-xs text-on-surface-variant">Live directional settlement network</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNetting((v) => !v)}
                    className="flex items-center gap-2 bg-surface-container px-3 py-1.5 rounded-full hover:bg-surface-container-high transition-all shrink-0"
                    title="Toggle algorithmic netting preview"
                  >
                    <span className={`w-3 h-3 rounded-full ${netting ? "bg-primary" : "bg-outline"}`} />
                    <span className="font-label-caps text-[11px] font-bold text-on-surface uppercase tracking-wider">{netting ? "Netting ON" : "Netting OFF"}</span>
                  </button>
                </div>
                <FlowGraph netting={netting} />
              </div>

              {/* Multi-settle basket */}
              <div className="bg-surface-container-lowest rounded-3xl p-6 border border-surface-container shadow-sm flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-7 h-7 rounded-xl bg-primary flex items-center justify-center text-on-primary shrink-0">
                      <span className="material-symbols-outlined text-[18px]">shopping_basket</span>
                    </span>
                    <h3 className="font-headline-sm text-lg text-on-surface font-bold">Multi-Settle Basket</h3>
                  </div>
                  <span className="shrink-0 font-label-caps text-[11px] text-on-primary-fixed bg-primary-fixed px-2.5 py-1 rounded-full font-bold">{basket.length} items queued</span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Bundle your outward payments into a single click settlement transaction to minimize gas &amp; platform processing.
                </p>
                <div className="flex flex-col gap-2">
                  {PAY.map((p) => {
                    const checked = basket.includes(p.id);
                    const gone = settled.includes(p.id);
                    return (
                      <label
                        key={p.id}
                        className={`flex items-center justify-between gap-2 p-3 rounded-2xl transition-all cursor-pointer ${gone ? "bg-surface-container-low opacity-60" : "bg-surface-container-low hover:bg-surface-container"}`}
                      >
                        <span className="flex items-center gap-3 min-w-0">
                          <input type="checkbox" className="w-5 h-5 accent-primary rounded-md shrink-0" checked={checked} disabled={gone} onChange={() => toggleBasket(p.id)} />
                          <span className="text-xs text-on-surface font-semibold break-words">{p.name} ({p.group === "loft" ? "Loft restock" : "WiFi & Pwr"})</span>
                        </span>
                        <span className="text-xs font-bold text-on-surface shrink-0 font-mono">{inr(p.amount)}</span>
                      </label>
                    );
                  })}
                </div>
                <div className="pt-2 flex flex-col gap-3">
                  <div className="flex justify-between items-baseline px-1">
                    <span className="text-xs text-on-surface-variant">Total Debit Balance</span>
                    <span className="text-lg font-extrabold text-on-surface font-mono">{inr(basketTotal)}</span>
                  </div>
                  <button type="button" onClick={batchSettle} className="w-full py-3.5 bg-primary text-on-primary hover:bg-primary-container font-title-md text-sm font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[20px]">lock</span>
                    <span>Batch Settle {inr0(basketTotal)} via Apple Cash</span>
                  </button>
                </div>
              </div>

              {/* Nudge presets */}
              <div className="bg-surface-container-lowest rounded-3xl p-6 border border-surface-container shadow-sm flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="material-symbols-outlined text-secondary-container text-[20px] shrink-0">chat_bubble_outline</span>
                    <h3 className="font-headline-sm text-lg text-on-surface font-bold break-words">Friendly Nudge Presets</h3>
                  </div>
                  <span className="shrink-0 font-label-caps text-[10px] text-on-surface-variant uppercase">1-Tap Send</span>
                </div>
                <p className="text-xs text-on-surface-variant">Zero-awkwardness prewritten notes with automatic deep-links.</p>
                <div className="flex flex-col gap-2 pt-1">
                  {NUDGES.map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => showToast(`Nudge sent: "${n}"`)}
                      className="text-left p-3 rounded-2xl bg-surface-container-low hover:bg-surface-container-high transition-all flex items-center justify-between gap-2 group active:scale-[0.99]"
                    >
                      <span className="text-xs text-on-surface group-hover:text-primary break-words">{n}</span>
                      <span className="material-symbols-outlined text-outline group-hover:text-primary text-[18px] shrink-0">send</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Ledger seal */}
              <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container flex items-center justify-between gap-3 text-on-surface-variant">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="material-symbols-outlined text-primary text-[20px] shrink-0">verified_user</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-label-caps text-[11px] font-bold text-on-surface uppercase">Ledger Seal</span>
                      <span className="font-mono text-[10px] text-on-surface-variant break-all">SHA-256 e8a2...3f1c</span>
                    </div>
                    <span className="text-[11px] text-on-surface-variant block break-words">FDIC Pass-Through Protected • Real-time Sync</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-outline text-[16px] shrink-0">lock_open</span>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-[calc(100vw-3rem)] flex items-center gap-2 bg-inverse-surface text-inverse-on-surface px-4 py-2.5 rounded-full shadow-2xl">
          <span className="material-symbols-outlined text-[18px] text-primary-fixed shrink-0">check_circle</span>
          <span className="text-xs font-semibold break-words">{toast}</span>
        </div>
      )}
    </AppLayout>
  );
}