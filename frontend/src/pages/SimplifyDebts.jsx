import { useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import Breadcrumbs from "../components/layout/Breadcrumbs";
import { BALANCES_TABS } from "../constants/balancesNav";

const RUPEE = "₹";
const inr = (n) => RUPEE + Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const inr0 = (n) => RUPEE + Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });

const TABS = BALANCES_TABS;

const KPIS = [
  { label: "Unoptimized Volume", value: inr0(31540), unit: "Gross", sub: "Chaotic manual settlements across 4 peers", pill: "7 Payouts (High Friction)", icon: "alt_route", iconCls: "bg-peach-100 text-tertiary border border-peach-200", pillCls: "bg-peach-100 text-tertiary border border-peach-200", dot: true },
  { label: "Compressed Execution", value: inr(6017.5), unit: "Net", valueCls: "text-primary", sub: "Consolidated to 2 direct transfers (71% fewer)", pill: "Optimal Equilibrium", icon: "bolt", iconCls: "bg-primary-fixed text-primary", pillCls: "bg-primary-fixed text-on-primary-fixed", highlight: true },
  { label: "Redundant Churn", value: inr0(19920), unit: "Cut", unitCls: "text-secondary", sub: "Zero circular ghost transactions in transit", pill: "100% Loop Eradicated", icon: "compress", iconCls: "bg-secondary-fixed text-secondary", pillCls: "bg-secondary-fixed text-on-secondary-fixed" },
  { label: "Interchange Saved", value: inr(1535.5), unit: "Saved", unitCls: "text-primary", sub: "Zero third-party instant transfer surcharges", pill: "Instant Settlement Ready", icon: "account_balance", iconCls: "bg-surface-container-high text-primary", pillCls: "bg-surface-container-high text-on-surface" },
];

const IOUS = [
  { n: 1, from: "Alex owes Sarah", item: "Tahoe Groceries & Snacks", group: "Tahoe Trip", amount: 4648 },
  { n: 2, from: "Sarah owes Marcus", item: "Ski Lift Group Passes", group: "Tahoe Trip", amount: 6972 },
  { n: 3, from: "Marcus owes Alex", item: "Cabin Security Deposit", group: "Tahoe Trip", amount: 10665.5 },
  { n: 4, from: "Jason owes Alex", item: "Loft Gas & WiFi", group: "Brooklyn Loft", amount: 3320 },
  { n: 5, from: "Alex owes Jason", item: "Sofa Rental Van", group: "Brooklyn Loft", amount: 9462 },
];

const TRANSFERS = [
  { from: "Marcus", to: "Alex", amount: 3693.5, resolves: 4, tag: "Direct In-App UPI Settlement", avatar: "bg-primary-fixed text-primary", icon: "bolt" },
  { from: "Jason", to: "Sarah", amount: 2324, resolves: 3, tag: "Instant IMPS Bank Debit Split", avatar: "bg-secondary-fixed text-secondary", icon: "account_balance" },
];

const MEMBERS = [
  { name: "Alex", net: 3693.5 },
  { name: "Sarah", net: 2324 },
  { name: "Marcus", net: -3693.5 },
  { name: "Jason", net: -2324 },
];

const CIRCLES = [
  { id: "tahoe", name: "Tahoe Winter Getaway", meta: `4 members • ${inr(22285.5)} volume`, icon: "downhill_skiing" },
  { id: "loft", name: "Brooklyn Loft Roommates", meta: `3 members • ${inr(9254.5)} volume`, icon: "apartment" },
];

const MERKLE = "0x9F4E82C108B7A42C...81EF3";

function Node({ x, y, initials, name, count, cls }) {
  return (
    <g>
      <rect x={x - 24} y={y - 24} width="48" height="48" rx="16" fill="#ffffff" stroke="#bbcabf" strokeWidth="1" />
      <rect x={x - 20} y={y - 20} width="40" height="40" rx="13" fill={cls.fill} />
      <text x={x} y={y + 5} textAnchor="middle" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="13" fontWeight="700" fill={cls.text}>{initials}</text>
      <text x={x} y={y + 42} textAnchor="middle" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="11" fontWeight="700" fill="#131b2e">{name}</text>
      <circle cx={x + 22} cy={y + 22} r="9" fill="#ba1a1a" />
      <text x={x + 22} y={y + 26} textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="700" fill="#ffffff">{count}x</text>
    </g>
  );
}

function DebtWeb() {
  return (
    <svg className="w-full h-auto" viewBox="0 0 460 250" fill="none" role="img" aria-label="Circular multi-party debt web">
      <defs>
        <marker id="sim-arrow" markerHeight="7" markerWidth="7" orient="auto-start-reverse" refX="6" refY="3.5" viewBox="0 0 10 7">
          <path d="M 0 0 L 8 3.5 L 0 7 z" fill="#bc0b3b" />
        </marker>
        <marker id="sim-arrow-red" markerHeight="7" markerWidth="7" orient="auto-start-reverse" refX="6" refY="3.5" viewBox="0 0 10 7">
          <path d="M 0 0 L 8 3.5 L 0 7 z" fill="#ba1a1a" />
        </marker>
      </defs>

      <path d="M 119,52 C 200,18 280,18 341,52" stroke="#ff7886" strokeWidth="2.2" strokeDasharray="5 4" markerEnd="url(#sim-arrow)" />
      <path d="M 378,89 C 406,125 406,160 378,186" stroke="#ff7886" strokeWidth="2.2" strokeDasharray="5 4" markerEnd="url(#sim-arrow)" />
      <path d="M 341,208 C 275,238 185,238 119,208" stroke="#ff7886" strokeWidth="2.2" strokeDasharray="5 4" markerEnd="url(#sim-arrow)" />
      <path d="M 82,170 C 58,135 58,105 82,85" stroke="#ff7886" strokeWidth="2.2" strokeDasharray="5 4" markerEnd="url(#sim-arrow)" />

      <path d="M 340,180 Q 230,120 120,72" stroke="#ba1a1a" strokeWidth="2.5" strokeDasharray="4 4" markerEnd="url(#sim-arrow-red)" />
      <path d="M 105,88 L 105,168" stroke="#ff7886" strokeWidth="1.8" strokeDasharray="4 4" markerEnd="url(#sim-arrow)" />
      <path d="M 345,82 Q 230,132 120,182" stroke="#ff7886" strokeWidth="1.8" strokeDasharray="4 4" markerEnd="url(#sim-arrow)" />

      <g fontFamily="Plus Jakarta Sans, sans-serif" fontSize="10.5" fontWeight="700" textAnchor="middle">
        <rect x="178" y="10" width="104" height="22" rx="11" fill="#ffffff" stroke="#ffdad6" />
        <text x="230" y="25" fill="#bc0b3b">{`Sarah owes ${inr0(4648)}`}</text>

        <rect x="303" y="120" width="110" height="22" rx="11" fill="#ffffff" stroke="#ffdad6" />
        <text x="358" y="135" fill="#bc0b3b">{`Marcus owes ${inr0(10665.5)}`}</text>

        <rect x="178" y="212" width="104" height="22" rx="11" fill="#ffffff" stroke="#ffdad6" />
        <text x="230" y="227" fill="#bc0b3b">{`Alex owes ${inr0(9462)}`}</text>

        <rect x="22" y="120" width="102" height="22" rx="11" fill="#ffffff" stroke="#ffdad6" />
        <text x="73" y="135" fill="#bc0b3b">{`Alex owes ${inr0(4648)}`}</text>
      </g>

      <Node x={95} y={65} initials="AL" name="Alex" count={3} cls={{ fill: "#e1e0ff", text: "#2f2ebe" }} />
      <Node x={365} y={65} initials="SA" name="Sarah" count={2} cls={{ fill: "#ffdadb", text: "#92002a" }} />
      <Node x={365} y={195} initials="MA" name="Marcus" count={2} cls={{ fill: "#6ffbbe", text: "#005236" }} />
      <Node x={95} y={195} initials="JA" name="Jason" count={2} cls={{ fill: "#e2e7ff", text: "#131b2e" }} />
    </svg>
  );
}

export default function SimplifyDebts() {
  const [auto, setAuto] = useState(true);
  const [scopes, setScopes] = useState({ tahoe: true, loft: true });
  const [compression, setCompression] = useState(5);
  const [phase, setPhase] = useState("idle");
  const [copied, setCopied] = useState(false);

  const totalOptimized = TRANSFERS.reduce((s, t) => s + t.amount, 0);

  function execute() {
    if (phase !== "idle") return;
    setPhase("working");
    setTimeout(() => setPhase("done"), 1000);
  }

  function copyHash() {
    navigator.clipboard?.writeText(MERKLE);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <AppLayout>
      <main className="w-full min-h-screen overflow-x-clip">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumbs
            items={[
              { label: "Balances", to: "/balances", icon: "account_balance_wallet" },
              { label: "Simplify Debts" },
            ]}
            status={{ label: "Edmonds-Karp v4.2 Kernel Active", note: "Zero math invariance bond" }}
          />

          {/* Page header — GroupHeader-style card */}
          <div className="relative overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm shadow-zinc-900/5 border border-outline-variant/60 w-full px-4 py-3.5 sm:px-5 mb-5">
            <div className="relative z-10 flex flex-col gap-1.5 min-w-0">
              <div className="flex items-center flex-wrap gap-1.5">
                <span className="px-2 py-0.5 rounded-full bg-primary-fixed/40 text-on-primary-fixed-variant font-label-caps text-label-caps uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" />
                  Smart Debt Netting
                </span>
                <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-caps text-label-caps font-bold uppercase">Live Studio</span>
                <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface font-label-caps text-label-caps font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">verified_user</span>
                  Zero Math Invariance Bond
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-on-surface tracking-tight leading-none">Smart Debt Netting &amp; Algorithmic Compression</h1>
              <p className="font-body-sm text-body-sm text-on-surface-variant max-w-2xl leading-snug">
                Collapse circular liabilities into the minimum number of real transfers — without moving a single unapproved rupee.
              </p>
            </div>

            {/* Sub-nav row (inside card) */}
            <div className="relative z-10 mt-3 pt-3 border-t border-surface-container flex items-center gap-1.5 overflow-x-auto">
              {TABS.map((t) => {
                const cls = `px-3.5 py-2 rounded-xl font-title-md text-xs flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  t.id === "simplify" ? "bg-matcha-100 text-matcha-800 font-bold shadow-sm" : "text-on-surface-variant hover:bg-surface-container font-semibold"
                }`;
                const inner = (
                  <>
                    <span className="material-symbols-outlined text-base" style={t.id === "simplify" ? { fontVariationSettings: "'FILL' 1" } : undefined}>{t.icon}</span>
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
            {KPIS.map((k) => (
              <div key={k.label} className={`bg-surface-container-lowest rounded-3xl p-5 shadow-sm border ${k.highlight ? "border-primary-fixed" : "border-surface-container"}`}>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`text-[11px] uppercase tracking-wider font-semibold break-words ${k.label === "Compressed Execution" ? "text-primary font-bold" : "text-on-surface-variant"}`}>{k.label}</span>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${k.iconCls}`}>
                    <span className="material-symbols-outlined text-[18px]">{k.icon}</span>
                  </div>
                </div>
                <div className={`text-2xl md:text-3xl font-extrabold font-mono ${k.valueCls || "text-on-surface"}`}>
                  {k.value} <span className={`text-xs font-semibold ${k.unitCls || "text-on-surface-variant"}`}>{k.unit}</span>
                </div>
                <p className="text-xs text-on-surface-variant mt-1 break-words">{k.sub}</p>
                <div className={`mt-3.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold font-label-caps ${k.pillCls}`}>
                  {k.dot && <span className="w-1.5 h-1.5 rounded-full bg-error shrink-0" />}
                  <span className="break-words">{k.pill}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* LEFT RAIL */}
            <div className="lg:col-span-7 min-w-0 flex flex-col gap-4">
              {/* Before */}
              <div className="bg-surface-container-lowest rounded-3xl p-5 md:p-6 border border-surface-container shadow-sm flex flex-col gap-4">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-3.5 h-3.5 rounded-full bg-error shrink-0" />
                    <h2 className="text-lg md:text-xl text-on-surface font-extrabold tracking-tight break-words">Before Optimization: The Debt Web</h2>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-peach-100 text-tertiary font-label-caps text-[11px] font-bold uppercase tracking-wider shrink-0">Without Simplification</span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Tahoe Getaway &amp; Brooklyn Loft accounts have tangled overlapping liabilities. Rupees cycle uselessly through 7 redundant back-and-forth payouts.
                </p>

                <div className="rounded-2xl bg-surface-container-low p-4 border border-surface-container">
                  <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                    <span className="font-label-caps text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">Circular Multi-Party Netting Web (4 Node Cluster)</span>
                    <span className="text-[11px] text-tertiary font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">sync_problem</span> 5 Circular Loops Detected
                    </span>
                  </div>
                  <div className="w-full flex items-center justify-center py-2">
                    <DebtWeb />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="font-label-caps text-[11px] uppercase tracking-wider text-on-surface-variant font-bold px-1">Fragmented Unprocessed IOUs (5 of 7 listed)</span>
                  {IOUS.map((iou) => (
                    <div key={iou.n} className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all border border-surface-container">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-6 h-6 rounded-full bg-peach-100 text-tertiary flex items-center justify-center font-label-caps text-xs font-bold shrink-0">{iou.n}</span>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-on-surface break-words">{iou.from}</div>
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            <span className="text-xs text-on-surface-variant break-words">{iou.item}</span>
                            <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[10px] font-medium">{iou.group}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-base text-tertiary font-bold font-mono block">{inr(iou.amount)}</span>
                        <div className="text-[10px] font-label-caps text-tertiary">Pending</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3.5 rounded-2xl bg-surface-container flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-xs text-on-surface-variant font-medium">Total gross sum of 7 manual payouts:</span>
                  <span className="text-base text-on-surface font-extrabold font-mono">{inr(31540)} INR</span>
                </div>
              </div>

              {/* After */}
              <div className="bg-surface-container-lowest rounded-3xl p-5 md:p-6 border border-primary-fixed shadow-sm flex flex-col gap-4">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-3.5 h-3.5 rounded-full bg-primary animate-pulse shrink-0" />
                    <h2 className="text-lg md:text-xl text-on-surface font-extrabold tracking-tight break-words">After Tabsy Algorithmic Compression</h2>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-caps text-[11px] font-bold uppercase tracking-wider shrink-0">Simplified Path</span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Every redundant loop and reciprocal debt is eliminated. The entire 4-member liability matrix resolves into just <strong className="text-primary font-bold">2 direct settlements</strong>.
                </p>

                <div className="flex flex-col gap-3">
                  {TRANSFERS.map((t) => (
                    <div key={`${t.from}-${t.to}`} className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container hover:shadow-md transition-all">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 text-sm font-bold shadow-sm ${t.avatar}`}>
                            {t.from.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-base font-bold text-on-surface">{t.from}</span>
                              <span className="material-symbols-outlined text-[18px] text-primary">arrow_right_alt</span>
                              <span className="text-base font-bold text-on-surface">{t.to}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                              <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-[11px] font-bold font-label-caps">{t.tag}</span>
                              <span className="text-[11px] text-on-surface-variant flex items-center gap-1">
                                <span className="material-symbols-outlined text-[13px]">{t.icon}</span>
                                Resolves {t.resolves} debts
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-left sm:text-right shrink-0">
                          <div className="text-xl font-extrabold text-primary font-mono">{inr(t.amount)}</div>
                          <span className="text-[11px] font-label-caps font-semibold text-on-surface-variant">Single consolidated transfer</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl bg-surface-container-low p-4 border border-surface-container">
                  <div className="flex items-center justify-between gap-2 pb-3 flex-wrap">
                    <span className="font-label-caps text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">Net Balance Invariance Audit Table</span>
                    <span className="font-label-caps text-xs text-primary font-bold flex items-center gap-1 bg-primary-fixed/50 px-2.5 py-0.5 rounded-full">
                      <span className="material-symbols-outlined text-[14px]">verified</span> Exact to the cent
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {MEMBERS.map((m) => (
                      <div key={m.name} className="bg-surface-container-lowest rounded-2xl p-3 text-center border border-surface-container shadow-sm min-w-0">
                        <span className="text-xs font-bold text-on-surface block">{m.name}</span>
                        <div className={`text-base font-extrabold font-mono mt-0.5 break-words ${m.net >= 0 ? "text-primary" : "text-tertiary"}`}>{m.net >= 0 ? "+" : "−"}{inr(Math.abs(m.net))}</div>
                        <span className={`font-label-caps text-[10px] font-semibold block uppercase mt-0.5 ${m.net >= 0 ? "text-primary" : "text-tertiary"}`}>{m.net >= 0 ? "Receives" : "Sends"}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-primary-fixed/40 flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-xs text-on-primary-fixed-variant font-semibold">Total funds necessary to settle entire cluster:</span>
                  <span className="text-base text-primary font-extrabold font-mono">{inr(totalOptimized)} Net</span>
                </div>
              </div>
            </div>

            {/* RIGHT RAIL */}
            <aside className="lg:col-span-5 min-w-0 flex flex-col gap-4">
              {/* Simulator desk */}
              <div className="bg-surface-container-lowest rounded-3xl p-5 md:p-6 border border-surface-container shadow-sm flex flex-col gap-5">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-label-caps text-[11px] uppercase tracking-wider text-secondary font-bold">Simulator Desk</span>
                    <span className="material-symbols-outlined text-secondary text-[20px]">tune</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-extrabold text-on-surface mt-1">Settlement Command</h3>
                  <p className="text-xs text-on-surface-variant mt-1">Configure algorithmic compression scopes across active tabs.</p>
                </div>

                <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-surface-container-low border border-surface-container">
                  <div className="flex flex-col pr-2 min-w-0">
                    <span className="text-xs font-bold text-on-surface">Always Auto-Simplify</span>
                    <span className="text-[11px] text-on-surface-variant mt-0.5 break-words">Whenever 3+ friends have circular loops</span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={auto}
                    aria-label="Toggle auto-simplify"
                    onClick={() => setAuto((v) => !v)}
                    className={`w-12 h-6 rounded-full p-0.5 transition-colors relative shrink-0 focus:outline-none ${auto ? "bg-primary-container" : "bg-surface-container-high"}`}
                  >
                    <span className={`block w-5 h-5 rounded-full bg-surface-container-lowest shadow-sm transition-transform ${auto ? "translate-x-6" : "translate-x-0"}`} />
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="font-label-caps text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">Active Circle Scopes</span>
                  {CIRCLES.map((c) => {
                    const on = scopes[c.id];
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setScopes((prev) => ({ ...prev, [c.id]: !prev[c.id] }))}
                        className={`flex items-center justify-between gap-2 p-3 rounded-2xl border text-left transition-all ${
                          on ? "bg-surface-container-lowest border-secondary/40" : "bg-surface-container-low border-surface-container opacity-70"
                        }`}
                      >
                        <span className="flex items-center gap-2.5 min-w-0">
                          <span className="material-symbols-outlined text-secondary text-[20px] shrink-0">{c.icon}</span>
                          <span className="min-w-0">
                            <span className="text-xs font-bold text-on-surface block break-words">{c.name}</span>
                            <span className="text-[11px] text-on-surface-variant block break-words">{c.meta}</span>
                          </span>
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-label-caps shrink-0 ${on ? "bg-primary-fixed text-primary" : "bg-surface-container text-on-surface-variant"}`}>
                          {on ? "CONNECTED" : "MUTED"}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-col gap-2 p-4 rounded-2xl bg-surface-container-low border border-surface-container">
                  <div className="flex items-center justify-between gap-2 font-label-caps text-[11px] text-on-surface font-bold uppercase">
                    <span className="break-words">Compress 7 transfers → 2 transfers</span>
                    <span className="text-primary font-bold shrink-0">{compression * 20}% Ready</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={compression}
                    onChange={(e) => setCompression(Number(e.target.value))}
                    className="w-full accent-primary h-2 bg-surface-container-high rounded-lg cursor-pointer"
                    aria-label="Compression level"
                  />
                  <div className="flex items-center justify-between gap-2 text-[11px] text-on-surface-variant pt-1">
                    <span>Direct Pairs Only</span>
                    <span className="text-right">Max Bipartite Simplification</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden mt-1">
                    <div className="h-full bg-primary-container transition-all duration-300" style={{ width: `${compression * 20}%` }} />
                  </div>
                </div>

                <div className="flex flex-col gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={execute}
                    disabled={phase !== "idle"}
                    className={`w-full py-3.5 px-4 rounded-2xl text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 active:scale-[0.99] ${
                      phase === "done" ? "bg-primary-container text-white" : "bg-primary hover:bg-on-primary-container text-on-primary"
                    } ${phase === "working" ? "opacity-90" : ""}`}
                  >
                    <span className={`material-symbols-outlined text-[20px] ${phase === "working" ? "animate-spin" : ""}`}>
                      {phase === "working" ? "sync" : phase === "done" ? "check_circle" : "bolt"}
                    </span>
                    <span className="break-words text-center">
                      {phase === "working" ? "Netting & executing transfers…" : phase === "done" ? `2 transfers dispatched (${inr0(totalOptimized)})` : `Execute 1-Tap Algorithmic Settlement (${inr0(totalOptimized)})`}
                    </span>
                    {phase === "idle" && <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold ml-1 shrink-0">BIOMETRIC</span>}
                  </button>
                  <button type="button" className="w-full py-2.5 px-4 rounded-2xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold transition-all flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[17px] text-on-surface-variant">picture_as_pdf</span>
                    <span>Download Formal Debt Compression Audit (PDF)</span>
                  </button>
                </div>
              </div>

              {/* Proof card */}
              <div className="bg-surface-container-lowest rounded-3xl p-5 md:p-6 border border-surface-container shadow-sm flex flex-col gap-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-surface-container-high text-primary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[18px]">rule</span>
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-on-surface break-words">Mathematical Zero-Loss Proof</h4>
                      <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">Kernel Conservation Theorem</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-primary text-[10px] font-bold font-label-caps shrink-0">Verified</span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Tabsy solves for minimum edge cardinality across bipartite debt graphs. Mathematical invariance is guaranteed:
                </p>
                <code className="block p-2.5 bg-surface-container-low rounded-xl text-primary font-mono text-[11px] font-bold text-center break-words">
                  Σ Debts (Incoming) ≡ Σ Credits (Outgoing) = {inr(0)} Dev
                </code>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  No peer loses, gains, or shifts an unapproved rupee.
                </p>

                <div className="p-3.5 rounded-2xl bg-surface-container-low border border-surface-container flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2 text-[11px] font-label-caps text-on-surface-variant">
                    <span>Consensus Block Voucher</span>
                    <span className="text-primary font-bold shrink-0">#481,294</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 bg-surface-container-lowest px-3 py-2 rounded-xl border border-surface-container">
                    <code className="font-mono text-[11px] text-on-surface font-semibold break-all mr-2">{MERKLE}</code>
                    <button type="button" onClick={copyHash} className="text-primary hover:text-on-primary-container transition-colors shrink-0" title="Copy hash">
                      <span className="material-symbols-outlined text-[16px]">{copied ? "done" : "content_copy"}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center font-label-caps text-[10px] font-bold uppercase text-on-surface-variant">
                  <div className="p-2 rounded-xl bg-surface-container-low flex items-center justify-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-[15px]">verified_user</span>
                    <span className="break-words">Zero-Dispute Guarantee</span>
                  </div>
                  <div className="p-2 rounded-xl bg-surface-container-low flex items-center justify-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-[15px]">account_balance</span>
                    <span className="break-words">RBI Pass-Through</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </AppLayout>
  );
}