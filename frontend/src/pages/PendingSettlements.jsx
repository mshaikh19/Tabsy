import { useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import Breadcrumbs from "../components/layout/Breadcrumbs";
import { BALANCES_TABS } from "../constants/balancesNav";

const inr = (n) => `₹${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const inr0 = (n) => `₹${Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

const TABS = BALANCES_TABS;

const IN_FLIGHT = 15438;
const OUTGOING = 9462;
const INCOMING = 5976;

const LENS = {
  marcus: {
    ref: "#VN-882193-MV",
    payer: "Marcus Vance",
    group: "Tahoe Ski Trip 2025",
    target: "Tahoe Equipment Rental",
    amount: inr(3486),
    hash: "SHA: 0x9f4a...27e1b4",
    before: "Marcus: +₹10,666.50",
    after: "Marcus: +₹7,180.50",
    impactBefore: "+₹10,666.50",
    impactAfter: "+₹7,180.50",
  },
  chloe: {
    ref: "#CSH-249102-CB",
    payer: "Chloe Bennett",
    group: "Friday Dinner Club",
    target: "Dinner & Lyft Split",
    amount: inr(2490),
    hash: "SHA: 0x3d2b...55f89c",
    before: "Chloe: +₹6,225.00",
    after: "Chloe: +₹3,735.00",
    impactBefore: "+₹6,225.00",
    impactAfter: "+₹3,735.00",
  },
  jason: {
    ref: "#ACH-9031-JW",
    payer: "Alex Chen (You)",
    group: "Mumbai Flat 4B",
    target: "Q1 WiFi & Electricity",
    amount: `−${inr(9462)}`,
    hash: "SHA: 0x7c99...e2410a",
    before: "Jason: −₹9,462.00",
    after: "Jason: ₹0.00 Balanced",
    impactBefore: "−₹9,462.00",
    impactAfter: "₹0.00 Balanced",
  },
};

const FILTERS = [
  { id: "all", label: "All Pending", icon: "dashboard", iconCls: "text-on-surface", badge: 4, badgeCls: "bg-primary text-on-primary", active: true },
  { id: "needs", label: "Needs You", icon: "priority_high", iconCls: "text-primary", badge: 2, badgeCls: "bg-primary-fixed text-on-primary-fixed", active: false },
  { id: "ach", label: "Outgoing ACH", icon: "account_balance", iconCls: "text-secondary", badge: 1, badgeCls: "bg-secondary-fixed text-on-secondary-fixed", active: false },
  { id: "loops", label: "Algorithmic Loops", icon: "join_inner", iconCls: "text-on-surface-variant", badge: 1, badgeCls: "bg-surface-container-highest text-on-surface", active: false },
];

const PINGS = [
  { name: "Jason Wu", initials: "JW", sub: `${inr(9462)} • ACH Clearance`, avatarCls: "bg-surface-variant text-on-surface-variant" },
  { name: "Sarah Lin", initials: "SL", sub: `${inr(3320)} • 3-Way Rebalance`, avatarCls: "bg-tertiary-fixed text-on-tertiary-fixed" },
];

const HISTOGRAM = [
  { h: "35%", cls: "bg-surface-container" },
  { h: "50%", cls: "bg-surface-container" },
  { h: "75%", cls: "bg-surface-container-highest" },
  { h: "100%", cls: "bg-primary-container" },
  { h: "85%", cls: "bg-primary" },
  { h: "45%", cls: "bg-surface-container-highest" },
  { h: "20%", cls: "bg-surface-container" },
];

export default function PendingSettlements() {
  const [lens, setLens] = useState("marcus");
  const [settled, setSettled] = useState([]);
  const [toast, setToast] = useState(null);

  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(null), 3200);
  }

  function selectLens(id) {
    if (settled.includes(id)) return;
    setLens(id);
    showToast(`Lens synced — inspection focus shifted to ${LENS[id].payer}`);
  }

  function settle(id, name, amount) {
    setSettled((prev) => (prev.includes(id) ? prev : [...prev, id]));
    showToast(`Ledger release authorized — ${amount} confirmed from ${name}`);
  }

  function confirmAllIncoming() {
    setSettled((prev) => [...new Set([...prev, "marcus", "chloe"])]);
    showToast(`Batch released — confirmed both pending incoming items (${inr(INCOMING)} total)`);
  }

  const active = LENS[lens];
  const isIncoming = lens !== "jason";

  return (
    <AppLayout>
      <main className="w-full min-h-screen overflow-x-clip">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumbs
            items={[
              { label: "Balances", to: "/balances", icon: "account_balance_wallet" },
              { label: "Pending Settlements" },
            ]}
            status={{ label: "Clearing Node #98124", note: "Audit validated" }}
          />

          {/* Page header — GroupHeader-style card */}
          <div className="relative overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm shadow-zinc-900/5 border border-outline-variant/60 w-full px-4 py-3.5 sm:px-5 mb-5">
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              {/* LEFT — eyebrow + title + description */}
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-surface-container flex items-center justify-center text-primary border border-surface-container-highest shadow-sm shrink-0">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
                </div>
                <div className="flex flex-col gap-1.5 min-w-0">
                  <div className="flex items-center flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-primary-fixed/40 text-on-primary-fixed-variant font-label-caps text-label-caps uppercase flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" />
                      Bilateral Clearance Desk
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-matcha-100 border border-matcha-200 text-matcha-800 text-[11px] font-bold font-mono flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">verified</span>
                      Audit Validated
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-sky-100 border border-sky-200 text-pastel-sky-deep text-[11px] font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-pastel-sky-deep" />
                      INR Ledger Active • Zero Slippage
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-on-surface tracking-tight leading-none">Pending Settlements &amp; Triage Matrix</h1>
                  <p className="font-body-sm text-body-sm text-on-surface-variant max-w-2xl leading-snug">
                    Verify, dispute and release in-flight bilateral settlements with one-tap attestation.
                  </p>
                </div>
              </div>

              {/* RIGHT — sync + refresh */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="hidden sm:flex items-center gap-1.5 bg-surface-container-low border border-surface-container px-3 py-1.5 rounded-xl text-[11px] text-on-surface-variant">
                  <span className="material-symbols-outlined text-[15px] text-primary">sync</span>
                  <span className="font-semibold">Auto-Sync</span>
                  <span className="text-outline">• 12s ago</span>
                </span>
                <button
                  type="button"
                  onClick={() => showToast("Desk refreshed — synced with FedACH clearing rails")}
                  className="px-3.5 py-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-body-sm text-xs font-semibold border border-surface-container transition-all flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">refresh</span>
                  <span>Refresh Desk</span>
                </button>
              </div>
            </div>

            {/* Sub-nav row (inside card) */}
            <div className="relative z-10 mt-3 pt-3 border-t border-surface-container flex items-center gap-1.5 overflow-x-auto">
              {TABS.map((t) => {
                const cls = `px-3.5 py-2 rounded-xl font-title-md text-xs flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  t.id === "pending"
                    ? "bg-matcha-100 text-matcha-800 font-bold shadow-sm"
                    : "text-on-surface-variant hover:bg-surface-container font-semibold"
                }`;
                const inner = (
                  <>
                    <span className="material-symbols-outlined text-base" style={t.id === "pending" ? { fontVariationSettings: "'FILL' 1" } : undefined}>{t.icon}</span>
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

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* ============ COLUMN 1 ============ */}
            <div className="lg:col-span-4 xl:col-span-3 min-w-0 flex flex-col gap-4">
              {/* In-Flight Total & Radial Ring */}
              <div className="bg-surface-container-lowest p-5 rounded-3xl border border-surface-container shadow-sm flex flex-col gap-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant font-mono break-words">In-Flight Total</span>
                  <span className="shrink-0 px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold font-label-caps uppercase tracking-wider">3 Bilateral</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-1">
                      <span className="text-[32px] font-extrabold leading-none tracking-tight font-mono text-on-surface">{inr0(IN_FLIGHT)}</span>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-1.5 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[15px] text-primary">schedule</span>
                      Awaiting bilateral release
                    </p>
                  </div>
                  <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                    <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15.9155" fill="none" stroke="var(--color-surface-container)" strokeWidth="4.5" />
                      <circle cx="18" cy="18" r="15.9155" fill="none" stroke="var(--color-secondary)" strokeWidth="4.5" strokeDasharray="61 100" strokeLinecap="round" />
                      <circle cx="18" cy="18" r="15.9155" fill="none" stroke="var(--color-primary-container)" strokeWidth="4.5" strokeDasharray="39 100" strokeDashoffset="-61" strokeLinecap="round" />
                    </svg>
                    <span className="absolute text-[11px] font-bold text-on-surface font-mono">3 Items</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-surface-container">
                  <div className="bg-surface-container-low p-2.5 rounded-2xl border border-surface-container">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-secondary shrink-0" />
                      <span className="text-[10px] uppercase font-bold text-on-surface-variant font-label-caps break-words">Outgoing (61%)</span>
                    </div>
                    <span className="text-sm font-extrabold text-on-surface mt-1 block font-mono">{inr0(OUTGOING)}</span>
                    <span className="text-[11px] text-on-surface-variant block">to Jason Wu</span>
                  </div>
                  <div className="bg-surface-container-low p-2.5 rounded-2xl border border-surface-container">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-primary-container shrink-0" />
                      <span className="text-[10px] uppercase font-bold text-on-surface-variant font-label-caps break-words">Incoming (39%)</span>
                    </div>
                    <span className="text-sm font-extrabold text-primary mt-1 block font-mono">+{inr0(INCOMING)}</span>
                    <span className="text-[11px] text-on-surface-variant block">2 peer receipts</span>
                  </div>
                </div>
              </div>

              {/* Clearing Velocity */}
              <div className="bg-surface-container-lowest p-5 rounded-3xl border border-surface-container shadow-sm flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant font-mono">Clearing Velocity</span>
                  <span className="shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-[10px] font-bold font-label-caps">
                    <span className="material-symbols-outlined text-[13px]">bolt</span>
                    Lightning Fast
                  </span>
                </div>
                <div className="flex items-baseline justify-between gap-2 flex-wrap">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[28px] font-extrabold font-mono text-on-surface">18m</span>
                    <span className="text-[11px] text-on-surface-variant">median settlement</span>
                  </div>
                  <span className="text-[11px] text-primary font-bold bg-primary-fixed/40 px-2 py-0.5 rounded-md">−4m vs group avg</span>
                </div>
                <div className="pt-1">
                  <div className="flex items-end justify-between gap-1.5 h-10 px-1">
                    {HISTOGRAM.map((b, i) => (
                      <div key={i} className={`flex-1 rounded-t ${b.cls}`} style={{ height: b.h }} />
                    ))}
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-label-caps text-on-surface-variant pt-1.5">
                    <span>5m</span>
                    <span>Target: &lt;25m</span>
                    <span>60m</span>
                  </div>
                </div>
                <div className="p-2.5 rounded-2xl bg-surface-container-low text-[11px] text-on-surface-variant flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1 min-w-0">
                    <span className="material-symbols-outlined text-[14px] text-primary shrink-0">verified</span>
                    <span className="break-words">98.2% peer accuracy</span>
                  </span>
                  <span className="font-bold text-on-surface shrink-0">Zero disputes</span>
                </div>
              </div>

              {/* Queue Filters */}
              <div className="bg-surface-container-lowest p-4 rounded-3xl border border-surface-container shadow-sm flex flex-col gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant font-mono px-1 mb-1">Queue Filters</span>
                {FILTERS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => f.id !== "all" && showToast(`${f.label} filter applied`)}
                    className={`w-full px-3 py-2.5 rounded-2xl flex items-center justify-between transition-all ${
                      f.id === "all"
                        ? "bg-surface-container text-on-surface font-bold border border-surface-container-highest"
                        : "text-on-surface font-semibold hover:bg-surface-container-low"
                    }`}
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <span className={`material-symbols-outlined text-[17px] shrink-0 ${f.iconCls}`}>{f.icon}</span>
                      <span className="break-words">{f.label}</span>
                    </span>
                    <span className={`shrink-0 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${f.badgeCls}`}>{f.badge}</span>
                  </button>
                ))}
              </div>

              {/* Banking Clearing Window */}
              <div className="bg-surface-container-low p-4 rounded-3xl border border-surface-container shadow-sm flex flex-col gap-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] uppercase font-bold text-on-surface-variant font-label-caps break-words">Banking Clearing Window</span>
                  <span className="material-symbols-outlined text-[16px] text-primary shrink-0">schedule</span>
                </div>
                <p className="text-xs text-on-surface leading-relaxed">
                  Next FedACH batch settlement operates at <strong className="font-bold text-primary">4:00 PM IST</strong>. Funds are locked in escrow until bilateral release.
                </p>
                <div className="flex items-center gap-1.5 pt-1 text-on-surface-variant text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-primary-container shrink-0" />
                  <span className="break-words">Fedwire &amp; ACH Rails Operational</span>
                </div>
              </div>

              {/* One-Tap Pings Hub */}
              <div className="bg-surface-container-lowest p-4 rounded-3xl border border-surface-container shadow-sm flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="material-symbols-outlined text-[18px] text-secondary shrink-0">send_to_mobile</span>
                    <h3 className="font-title-md text-[13px] text-on-surface font-bold break-words">One-Tap Pings Hub</h3>
                  </div>
                  <span className="shrink-0 px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-caps text-[9px] font-bold">Polite Mode</span>
                </div>
                {PINGS.map((p) => (
                  <div key={p.name} className="flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-surface-container-low border border-surface-container">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-label-caps text-[10px] font-bold shrink-0 ${p.avatarCls}`}>{p.initials}</div>
                      <div className="min-w-0">
                        <span className="font-title-md text-xs text-on-surface font-bold block truncate">{p.name}</span>
                        <span className="text-[10px] text-on-surface-variant block truncate">{p.sub}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button type="button" onClick={() => showToast(`iMessage reminder prepared for ${p.name}`)} title="Send iMessage" className="w-7 h-7 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface flex items-center justify-center border border-surface-container shadow-sm">
                        <span className="material-symbols-outlined text-[14px]">chat</span>
                      </button>
                      <button type="button" onClick={() => showToast(`WhatsApp reminder prepared for ${p.name}`)} title="Send WhatsApp" className="w-7 h-7 rounded-lg bg-primary-fixed hover:bg-primary text-on-primary-fixed hover:text-on-primary flex items-center justify-center shadow-sm transition-all">
                        <span className="material-symbols-outlined text-[14px]">forum</span>
                      </button>
                    </div>
                  </div>
                ))}
                <button type="button" onClick={() => showToast("Batch ping sent to all roommates in queue")} className="w-full py-2 rounded-2xl bg-surface-container hover:bg-surface-variant font-body-sm text-xs font-bold text-on-surface transition-all flex items-center justify-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px]">forward_to_inbox</span>
                  <span>Batch Ping All Roommates</span>
                </button>
              </div>
            </div>

            {/* ============ COLUMN 2 ============ */}
            <div className="lg:col-span-8 xl:col-span-6 min-w-0 flex flex-col gap-4">
              {/* Urgent banner */}
              <div className="bg-primary/10 border border-primary/20 p-4 rounded-3xl flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-sm">
                    <span className="material-symbols-outlined text-[20px]">notifications_active</span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-title-md text-sm text-on-surface font-bold break-words">2 Settlements Need Your Confirmation</h3>
                    <p className="text-xs text-on-surface-variant mt-0.5 break-words"><strong className="font-bold text-primary">{inr(INCOMING)}</strong> waiting for recipient release in outside accounts.</p>
                  </div>
                </div>
                <button type="button" onClick={confirmAllIncoming} className="shrink-0 px-3.5 py-1.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-body-sm text-xs font-bold shadow-sm transition-all">
                  Verify Both
                </button>
              </div>

              {/* Card 1: Marcus Vance */}
              {settled.includes("marcus") ? null : (
                <div
                  onClick={() => selectLens("marcus")}
                  className={`bg-surface-container-lowest p-5 rounded-3xl shadow-sm flex flex-col gap-3 relative transition-all cursor-pointer hover:shadow-md ${lens === "marcus" ? "border-2 border-primary/40" : "border border-surface-container"}`}
                >
                  {lens === "marcus" && (
                    <div className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-primary text-on-primary font-label-caps text-[9px] font-extrabold uppercase tracking-wider shadow-sm">
                      Selected in Lens
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-2xl bg-[#008CFF]/10 text-[#008CFF] flex items-center justify-center font-bold text-lg shrink-0 border border-[#008CFF]/20">V</div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-title-md text-[15px] text-on-surface font-extrabold">Marcus Vance</h3>
                          <span className="px-2 py-0.5 rounded-full bg-[#EBF5FF] text-[#0066CC] font-label-caps text-[10px] font-bold uppercase tracking-wider">Venmo Direct</span>
                        </div>
                        <p className="text-xs text-on-surface-variant mt-0.5 break-words">Tahoe Ski Equipment Rental • Ski Trip 2025</p>
                      </div>
                    </div>
                    <div className="flex sm:flex-col sm:items-end justify-between items-baseline shrink-0">
                      <span className="text-[22px] font-extrabold font-mono text-primary">+{inr(3486)}</span>
                      <span className="text-[11px] text-on-surface-variant">Transferred 8m ago</span>
                    </div>
                  </div>
                  <div className="bg-surface-container-low p-3 rounded-2xl border border-surface-container flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-[16px] text-on-surface-variant mt-0.5 shrink-0">format_quote</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-on-surface font-medium break-words">Sent via Venmo just now — check your app.</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="font-label-caps text-[10px] text-on-surface-variant font-semibold">Ref: #VN-882193-MV</span>
                        <span className="text-outline-variant text-[10px]">•</span>
                        <span className="text-primary font-semibold text-[10px] flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[12px]">verified</span> Direct P2P Match
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3 pt-1 flex-wrap">
                    <span className="text-[11px] text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">lock</span>
                      Instant ledger rebalance
                    </span>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={(e) => { e.stopPropagation(); showToast(`Dispute opened on ${inr(3486)} from Marcus Vance`); }} className="px-3 py-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-tertiary font-body-sm text-xs font-bold border border-surface-container transition-all">
                        Not Received
                      </button>
                      <button type="button" onClick={(e) => { e.stopPropagation(); settle("marcus", "Marcus Vance", inr(3486)); }} className="px-4 py-1.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-body-sm text-xs font-bold shadow-sm transition-all flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px]">check_circle</span>
                        <span>Confirm Received</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Card 2: Chloe Bennett */}
              {settled.includes("chloe") ? null : (
                <div
                  onClick={() => selectLens("chloe")}
                  className={`bg-surface-container-lowest p-5 rounded-3xl shadow-sm flex flex-col gap-3 transition-all cursor-pointer hover:shadow-md ${lens === "chloe" ? "border-2 border-primary/40" : "border border-surface-container"}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-2xl bg-primary-fixed text-on-primary-fixed flex items-center justify-center shrink-0 border border-primary/20">
                        <span className="material-symbols-outlined text-[22px]">payments</span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-title-md text-[15px] text-on-surface font-extrabold">Chloe Bennett</h3>
                          <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-caps text-[10px] font-bold uppercase tracking-wider">In-Person Cash</span>
                        </div>
                        <p className="text-xs text-on-surface-variant mt-0.5 break-words">Friday Night Squad dinner &amp; Lyft split</p>
                      </div>
                    </div>
                    <div className="flex sm:flex-col sm:items-end justify-between items-baseline shrink-0">
                      <span className="text-[22px] font-extrabold font-mono text-primary">+{inr(2490)}</span>
                      <span className="text-[11px] text-on-surface-variant">Logged 24m ago</span>
                    </div>
                  </div>
                  <div className="bg-surface-container-low p-3 rounded-2xl border border-surface-container flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-[16px] text-on-surface-variant mt-0.5 shrink-0">handshake</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-on-surface font-medium break-words">Handed {inr0(2490)} cash at dinner yesterday — settle when you verify your wallet.</p>
                      <span className="font-label-caps text-[10px] text-on-surface-variant font-semibold mt-1 block">Self-Attested Offline Voucher</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3 pt-1 flex-wrap">
                    <button type="button" onClick={(e) => { e.stopPropagation(); showToast(`Verification request sent to Chloe Bennett`); }} className="text-[11px] text-secondary hover:underline font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">notifications</span>
                      Send Nudge
                    </button>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={(e) => { e.stopPropagation(); showToast(`Dispute opened on ${inr(2490)} from Chloe Bennett`); }} className="px-3 py-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface-variant font-body-sm text-xs font-bold border border-surface-container transition-all">
                        Didn't Get This
                      </button>
                      <button type="button" onClick={(e) => { e.stopPropagation(); settle("chloe", "Chloe Bennett", inr(2490)); }} className="px-4 py-1.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-body-sm text-xs font-bold shadow-sm transition-all flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px]">done_all</span>
                        <span>Confirm Received</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Card 3: Outgoing ACH to Jason Wu */}
              {settled.includes("jason") ? null : (
                <div
                  onClick={() => selectLens("jason")}
                  className={`bg-surface-container-lowest p-5 rounded-3xl shadow-sm flex flex-col gap-3.5 transition-all cursor-pointer hover:shadow-md ${lens === "jason" ? "border-2 border-primary/40" : "border border-surface-container"}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-2xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center shrink-0 border border-secondary/20">
                        <span className="material-symbols-outlined text-[22px]">account_balance</span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-title-md text-[15px] text-on-surface font-extrabold">Jason Wu</h3>
                          <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-caps text-[10px] font-bold uppercase tracking-wider">Outgoing ACH</span>
                        </div>
                        <p className="text-xs text-on-surface-variant mt-0.5 break-words">Q1 WiFi &amp; Electricity • Mumbai Flat 4B Utilities</p>
                      </div>
                    </div>
                    <div className="flex sm:flex-col sm:items-end justify-between items-baseline shrink-0">
                      <span className="text-[22px] font-extrabold font-mono text-secondary">−{inr(9462)}</span>
                      <span className="text-[11px] text-on-surface-variant">Fedwire Ref #ACH-9031</span>
                    </div>
                  </div>
                  <div className="bg-surface-container-low p-3.5 rounded-2xl border border-surface-container flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2 text-[11px] flex-wrap">
                      <span className="font-bold text-on-surface flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-secondary animate-ping shrink-0" />
                        Clearing via FedACH (ETA 4:00 PM IST Today)
                      </span>
                      <span className="font-label-caps font-bold text-secondary">Stage 2 of 3</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 pt-1">
                      <div className="flex flex-col gap-1">
                        <div className="h-1.5 rounded-full bg-primary" />
                        <span className="text-[10px] text-on-surface font-bold">1. Initiated</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="h-1.5 rounded-full bg-secondary animate-pulse" />
                        <span className="text-[10px] text-secondary font-bold">2. Clearing Rail</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="h-1.5 rounded-full bg-surface-container-highest" />
                        <span className="text-[10px] text-on-surface-variant font-medium">3. Rebalanced</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3 pt-1 flex-wrap">
                    <button type="button" onClick={(e) => { e.stopPropagation(); showToast("ACH trace #9031 — Chase Checking → Jason Wu (Wells Fargo)"); }} className="text-[11px] text-secondary font-bold hover:underline flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">receipt_long</span>
                      View Wire Trace
                    </button>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={(e) => { e.stopPropagation(); showToast("ACH stop dispatched on the processing rail"); }} className="px-3 py-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-body-sm text-xs font-semibold border border-surface-container transition-all">
                        Cancel
                      </button>
                      <button type="button" onClick={(e) => { e.stopPropagation(); showToast("Check-in sent to Jason Wu"); }} className="px-3.5 py-1.5 rounded-xl bg-surface-container-high hover:bg-surface-variant text-on-surface font-body-sm text-xs font-bold border border-surface-container-highest transition-all flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px] text-secondary">mark_chat_unread</span>
                        <span>Send Check-in</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Card 4: 3-Way Circular Netting Loop */}
              <div className="bg-surface-container-lowest p-5 rounded-3xl border border-surface-container shadow-sm flex flex-col gap-3.5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-secondary-fixed text-secondary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[18px]">autorenew</span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-title-md text-sm text-on-surface font-extrabold break-words">Brooklyn Loft #4B Netting Loop</h3>
                      <span className="text-[11px] text-on-surface-variant block break-words">Algorithmic debt cancellation ring</span>
                    </div>
                  </div>
                  <span className="shrink-0 px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-caps text-[10px] font-bold">
                    Saves {inr0(6640)} churn
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-surface-container-low border border-surface-container flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-primary text-on-primary font-bold text-[11px] flex items-center justify-center shadow-sm">You</div>
                      <span className="text-[9px] font-bold text-primary mt-1">Signed</span>
                    </div>
                    <span className="material-symbols-outlined text-[14px] text-outline-variant">arrow_forward</span>
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-secondary-fixed text-on-secondary-fixed font-bold text-[11px] flex items-center justify-center shadow-sm">ML</div>
                      <span className="text-[9px] font-bold text-primary mt-1">Signed</span>
                    </div>
                    <span className="material-symbols-outlined text-[14px] text-outline-variant">arrow_forward</span>
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-bold text-[11px] flex items-center justify-center ring-2 ring-tertiary ring-offset-1 animate-pulse shadow-sm">SL</div>
                      <span className="text-[9px] font-bold text-tertiary mt-1">Pending</span>
                    </div>
                  </div>
                  <div className="text-center sm:text-right sm:border-l border-surface-container sm:pl-4 shrink-0">
                    <span className="font-title-md text-xs font-bold text-on-surface block">2 of 3 Approved</span>
                    <span className="text-[10px] text-on-surface-variant block">Waiting on Sarah Lin</span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 pt-1 flex-wrap">
                  <span className="text-[11px] text-on-surface-variant break-words">Reduces 3 bank wires down to 1 direct payout</span>
                  <button type="button" onClick={() => showToast("1-tap confirmation SMS sent to Sarah Lin")} className="px-3.5 py-1.5 rounded-xl bg-secondary-fixed hover:bg-secondary-fixed-dim text-on-secondary-fixed font-body-sm text-xs font-bold transition-all flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px]">send</span>
                    <span>Send Sarah 1-Tap Link</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ============ COLUMN 3 ============ */}
            <div className="lg:col-span-12 xl:col-span-3 min-w-0 flex flex-col gap-4">
              {/* Verification Lens */}
              <div className="bg-surface-container-lowest p-5 rounded-3xl border border-surface-container shadow-sm flex flex-col gap-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="material-symbols-outlined text-primary text-[20px] shrink-0">troubleshoot</span>
                    <h2 className="font-title-md text-sm text-on-surface font-extrabold uppercase tracking-wide break-words">Verification Lens</h2>
                  </div>
                  <span className="shrink-0 px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-caps text-[9px] font-bold">Live Inspection</span>
                </div>

                <div className="bg-[#faf8ff] p-4 rounded-2xl border border-surface-container flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-2 border-b border-surface-container pb-2.5">
                    <div className="flex flex-col min-w-0">
                      <span className="font-label-caps text-[10px] uppercase font-bold text-on-surface-variant">Digital Voucher</span>
                      <span className="text-[13px] font-bold text-on-surface font-mono break-words">{active.ref}</span>
                    </div>
                    <span className="shrink-0 px-2 py-0.5 rounded-full bg-primary/10 text-primary font-label-caps text-[10px] font-bold">Unreleased</span>
                  </div>
                  <div className="flex flex-col gap-1.5 text-xs">
                    <div className="min-w-0">
                      <span className="font-label-caps text-[10px] uppercase text-on-surface-variant block">Payer</span>
                      <span className="font-bold text-on-surface break-words block">{active.payer}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-on-surface-variant">
                      <span className="material-symbols-outlined text-[15px] shrink-0">arrow_downward</span>
                      <span className="font-label-caps text-[10px] uppercase">Sending to</span>
                    </div>
                    <div className="min-w-0">
                      <span className="font-label-caps text-[10px] uppercase text-on-surface-variant block">Recipient</span>
                      <span className="font-bold text-on-surface break-words block">{isIncoming ? "Alex Chen (You)" : active.payer}</span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-surface-container-low text-[11px] flex flex-col gap-1 border border-surface-container">
                    <div className="flex justify-between gap-2">
                      <span className="text-on-surface-variant">Origin Group:</span>
                      <span className="font-bold text-on-surface text-right break-words">{active.group}</span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-on-surface-variant">Expense Target:</span>
                      <span className="font-semibold text-on-surface text-right break-words">{active.target}</span>
                    </div>
                    <div className="flex justify-between gap-2 pt-1 border-t border-surface-container">
                      <span className="font-bold text-on-surface">Voucher Amount:</span>
                      <span className={`font-extrabold font-mono ${isIncoming ? "text-primary" : "text-secondary"}`}>{isIncoming ? "+" : ""}{active.amount}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container-low p-3.5 rounded-2xl border border-surface-container flex flex-col gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-primary">security</span>
                    <span className="font-title-md text-xs font-bold text-on-surface">Zero Phantom Guarantee</span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant leading-relaxed break-words">
                    Bilateral signature requires your affirmative tap. Once authorized, ledger updates atomically and cannot be forged.
                  </p>
                  <div className="flex items-center justify-between gap-2 bg-surface-container-lowest p-2 rounded-xl border border-surface-container">
                    <span className="font-mono text-[10px] text-on-surface-variant break-all mr-2">{active.hash}</span>
                    <button type="button" onClick={() => { navigator.clipboard?.writeText(active.hash); showToast("Hash copied to clipboard"); }} className="text-secondary font-bold hover:underline shrink-0 flex items-center gap-0.5 text-[10px]">
                      <span className="material-symbols-outlined text-[12px]">content_copy</span>
                      Copy Hash
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-1">
                  <span className="font-label-caps text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">Ledger Impact Simulator</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-surface-container-low p-2.5 rounded-2xl border border-surface-container min-w-0">
                      <span className="font-label-caps text-[9px] uppercase text-on-surface-variant block">Before Release</span>
                      <span className="text-[13px] font-bold text-on-surface font-mono break-words block">{active.impactBefore}</span>
                      <span className="text-[10px] text-on-surface-variant block mt-0.5">Total uncollected</span>
                    </div>
                    <div className="bg-primary/10 p-2.5 rounded-2xl border border-primary/20 min-w-0">
                      <span className="font-label-caps text-[9px] uppercase text-primary font-bold block">After Release</span>
                      <span className="text-[13px] font-bold text-primary font-mono break-words block">{active.impactAfter}</span>
                      <span className="text-[10px] text-primary font-semibold block mt-0.5">Reconciled instantly</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2 text-[11px] px-1 pt-1">
                    <span className="text-on-surface-variant flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-primary-container shrink-0" />
                      Group Tab Health:
                    </span>
                    <span className="font-bold text-primary">100% Balanced</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => (lens === "jason" ? showToast("ACH status marked verified with Jason Wu") : settle(lens, LENS[lens].payer, LENS[lens].amount))}
                  className="w-full py-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-title-md text-[13px] font-extrabold shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">verified_user</span>
                  <span>Authorize Ledger Release</span>
                </button>
              </div>

              {/* Security stamp */}
              <div className="bg-surface-container-low p-4 rounded-3xl border border-surface-container flex items-center gap-3 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-surface-container-lowest flex items-center justify-center text-primary shrink-0 border border-surface-container">
                  <span className="material-symbols-outlined text-[22px]">shield</span>
                </div>
                <div className="min-w-0">
                  <h4 className="font-title-md text-xs font-bold text-on-surface break-words">FDIC Pass-Through Protection</h4>
                  <p className="text-[10px] text-on-surface-variant leading-tight mt-0.5 break-words">Double-entry mathematical invariance enforced on all settlement rails.</p>
                </div>
              </div>
            </div>
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