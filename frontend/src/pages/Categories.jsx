import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";

const inr = (n) => `₹${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const inr0 = (n) => `₹${Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

const DONUT_R = 75;
const DONUT_C = 2 * Math.PI * DONUT_R;

const CATEGORIES = [
  { id: "lodging", label: "Lodging", full: "Lodging", pct: 48, amount: 199200, color: "#5fd3a6", chip: "bg-[#ecfdf5] text-[#065f46] hover:bg-[#d1fae5]", dot: "bg-[#5fd3a6]", barBg: "bg-[#ecfdf5]", text: "text-[#065f46]" },
  { id: "food", label: "Dining", full: "Food & Dining", pct: 19, amount: 78020, color: "#f9a26c", chip: "bg-[#fff7ed] text-[#9a3412] hover:bg-[#ffedd5]", dot: "bg-[#f9a26c]", barBg: "bg-[#fff7ed]", text: "text-[#9a3412]" },
  { id: "lift", label: "Passes", full: "Lift Passes", pct: 17, amount: 70550, color: "#f6cf5c", chip: "bg-[#fefce8] text-[#854d0e] hover:bg-[#fef9c3]", dot: "bg-[#f6cf5c]", barBg: "bg-[#fefce8]", text: "text-[#854d0e]" },
  { id: "groceries", label: "Groceries", full: "Groceries", pct: 12, amount: 51460, color: "#c9a2f5", chip: "bg-[#faf5ff] text-[#6b21a8] hover:bg-[#f3e8ff]", dot: "bg-[#c9a2f5]", barBg: "bg-[#faf5ff]", text: "text-[#6b21a8]" },
  { id: "transit", label: "Transit", full: "Transit & Misc", pct: 4, amount: 14940, color: "#6cc4ee", chip: "bg-[#f0f9ff] text-[#075985] hover:bg-[#e0f2fe]", dot: "bg-[#6cc4ee]", barBg: "bg-[#f0f9ff]", text: "text-[#075985]" },
];

const TOTAL = CATEGORIES.reduce((s, c) => s + c.amount, 0);
const CAP = 539500;

const STRATEGIES = [
  {
    icon: "🏡",
    iconCls: "bg-[#ecfdf5] text-[#065f46]",
    title: "Lodging & Chalet",
    desc: "Strict 1/N with Master Bedroom Multiplier",
    badge: "1.25x Active",
    badgeCls: "bg-primary-fixed text-on-primary-fixed-variant",
    rows: [
      { k: "Primary Tenants (4 pax):", v: `${inr0(41500)} / ea`, vCls: "text-on-surface" },
      { k: "Master Suite (Alex & Kim):", v: `${inr0(51875)} / ea (Multiplied)`, vCls: "text-primary" },
    ],
    footLeft: "Auto-Assigned on PDF",
  },
  {
    icon: "🛒",
    iconCls: "bg-[#faf5ff] text-[#6b21a8]",
    title: "Groceries & Provisions",
    desc: "Sub-item Alcohol vs Food Separation",
    badge: "Smart Segregation",
    badgeCls: "bg-[#f3e8ff] text-[#6b21a8]",
    checks: ["Non-drinkers auto-exempt from beer/wine items", "Pantry essentials divided across all 6 members"],
    footLeft: "Receipt Optical Match",
  },
  {
    icon: "🚗",
    iconCls: "bg-[#f0f9ff] text-[#075985]",
    title: "Transport & Carpool",
    desc: "Mileage calculation + Toll allocation",
    badge: "₹29 / mi",
    badgeCls: "bg-[#e0f2fe] text-[#0284c7]",
    rows: [
      { k: "Bay Area <> Tahoe Route:", v: `420 miles (${inr0(12200)})`, vCls: "text-on-surface" },
      { k: "I-80 Chain Control & Tolls:", v: `${inr0(2739)} split 4 ways`, vCls: "text-on-surface" },
    ],
    footLeft: "GPS Verified Odometer",
  },
  {
    icon: "🍕",
    iconCls: "bg-[#fff7ed] text-[#9a3412]",
    title: "Dinners & Apres-Ski",
    desc: "Dynamic Proportional + 18% Auto-Gratuity",
    badge: "18% Gratuity Lock",
    badgeCls: "bg-[#ffedd5] text-[#f97316]",
    para: "Tip and state taxes distributed proportionally relative to individual itemized dish selections.",
    footLeft: "Itemized Line Split",
  },
];

const GUARDRAILS = [
  {
    sub: "Sub-Cap #01",
    title: "Groceries & Provisions",
    spent: 51460,
    cap: 58100,
    pct: 88.5,
    status: "Warning: 88.5%",
    statusCls: "bg-[#fee2e2] text-[#991b1b]",
    dot: "bg-[#dc2626] animate-ping",
    amountCls: "text-[#991b1b]",
    barCls: "bg-gradient-to-r from-[#eab308] to-[#dc2626]",
    callout: true,
    note: "Next Safeway trip requires group approval",
    action: "+ Expand Cap",
    actionFn: "cap",
  },
  {
    sub: "Sub-Cap #02",
    title: "Apres-Ski & Dining",
    spent: 78020,
    cap: 99600,
    pct: 78,
    status: "Healthy Cadence",
    statusCls: "bg-primary-fixed text-on-primary-fixed-variant",
    dot: "bg-primary-container",
    amountCls: "text-on-surface",
    barCls: "bg-primary",
    note: "Pacing at ₹12,950/day per person. Forecast remains safely within the weekend threshold buffer.",
  },
  {
    sub: "Fixed Expense",
    title: "Chalet Lodging Hold",
    spent: 199200,
    cap: 249000,
    pct: 80,
    status: "Locked Contract",
    statusCls: "bg-surface-container text-on-surface-variant",
    lock: true,
    amountCls: "text-on-surface",
    barCls: "bg-[#10b981]",
    note: `Security deposit hold (${inr0(49800)}) scheduled for automatic refund release on Monday checkout.`,
  },
];

const MERCHANTS = [
  { icon: "storefront", iconCls: "text-[#6b21a8]", name: "Safeway, Trader Joe's", kw: "Keywords: Grocery, Market, Bakery", cat: "Groceries", conf: "100%", pill: "bg-[#faf5ff] text-[#6b21a8]" },
  { icon: "downhill_skiing", iconCls: "text-[#854d0e]", name: "Palisades Tahoe, Vail", kw: "Keywords: Lift, Ikon, Gondola", cat: "Lift Passes", conf: "99.8%", pill: "bg-[#fefce8] text-[#854d0e]" },
  { icon: "cabin", iconCls: "text-[#065f46]", name: "Alpine Meadows Chalet", kw: "Keywords: Airbnb, VRBO, Stay", cat: "Lodging", conf: "100%", pill: "bg-[#ecfdf5] text-[#065f46]" },
  { icon: "local_gas_station", iconCls: "text-[#0284c7]", name: "Chevron, FasTrak", kw: "Keywords: Fuel, Toll, Highway", cat: "Transit", conf: "99.5%", pill: "bg-[#f0f9ff] text-[#0284c7]" },
];

const MATCH_RULES = [
  { keys: ["safeway", "trader", "market", "grocery", "whole foods"], label: "Groceries & Provisions", conf: "99.9%", icon: "shopping_cart", color: "#6b21a8", bg: "bg-[#faf5ff]" },
  { keys: ["tahoe", "lift", "ski", "vail", "gondola"], label: "Lift Passes & Activities", conf: "98.8%", icon: "downhill_skiing", color: "#854d0e", bg: "bg-[#fefce8]" },
  { keys: ["gas", "chevron", "toll", "fastrak", "fuel"], label: "Transit & Carpool", conf: "99.7%", icon: "local_gas_station", color: "#0284c7", bg: "bg-[#f0f9ff]" },
];

const DEFAULT_MATCH = { label: "Dinners & Apres-Ski", conf: "99.4%", icon: "restaurant", color: "#9a3412", bg: "bg-[#fff7ed]" };

export default function Categories() {
  const [center, setCenter] = useState(`${inr(TOTAL)}`);
  const [activeFilter, setActiveFilter] = useState("all");
  const [modalCat, setModalCat] = useState(null);
  const [paradigm, setParadigm] = useState("Proportional");
  const [optOut, setOptOut] = useState(true);
  const [multiplier, setMultiplier] = useState(1.25);
  const [merchantQuery, setMerchantQuery] = useState("Blue Coyote Bar Truckee");
  const [matchResult, setMatchResult] = useState(DEFAULT_MATCH);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);
  const centerTimer = useRef(null);

  const donutSegments = useMemo(() => {
    const before = (i) => CATEGORIES.slice(0, i).reduce((s, c) => s + c.pct, 0);
    return CATEGORIES.map((c, i) => ({
      ...c,
      dash: (c.pct / 100) * DONUT_C,
      offset: -(before(i) / 100) * DONUT_C,
    }));
  }, []);

  const headroom = CAP - TOTAL;

  function showToast(message, icon = "check_circle") {
    setToast({ message, icon });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }

  function focusCategory(cat) {
    setActiveFilter(cat.id);
    setCenter(`${inr(cat.amount)} (${cat.pct}%)`);
    showToast(`Focused Radial Matrix on: ${cat.full}`, "filter_alt");
    if (centerTimer.current) clearTimeout(centerTimer.current);
    centerTimer.current = setTimeout(() => {
      setCenter(`${inr(TOTAL)}`);
      setActiveFilter("all");
    }, 3200);
  }

  function runMatch() {
    const q = merchantQuery.toLowerCase();
    const hit = MATCH_RULES.find((r) => r.keys.some((k) => q.includes(k)));
    const result = hit || DEFAULT_MATCH;
    setMatchResult(result);
    showToast(`Receipt classified: ${result.label} (${result.conf})`, "auto_awesome");
  }

  return (
    <AppLayout>
      <div className="bg-[#f7f6fd] font-body-md text-body-md text-on-surface antialiased">
        <main className="w-full min-h-screen pb-12">
          <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-6">
            {/* 1. Top Header & Control Deck */}
            <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-3xl shadow-sm relative">
              {/* Top row: breadcrumb + status badges */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center flex-wrap gap-2 text-on-surface-variant font-label-caps text-[11px] uppercase tracking-wider">
                  <Link to="/expenses" className="hover:text-primary transition-colors">Expenses</Link>
                  <span className="material-symbols-outlined text-[13px] text-outline">chevron_right</span>
                  <span className="font-bold text-on-surface inline-flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px] text-primary">sell</span>
                    Categories
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-caps text-[11px] uppercase font-bold inline-flex items-center gap-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    Global Taxonomy
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-caps text-[11px] uppercase font-bold inline-flex items-center gap-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    Sync Active
                  </span>
                </div>
              </div>

              {/* Title + subtitle */}
              <div className="mt-3 flex flex-col gap-1 max-w-3xl">
                <h1 className="font-headline-lg text-2xl lg:text-3xl text-on-surface tracking-tight">Spending Taxonomies &amp; Allocation Governance</h1>
                <p className="text-sm text-on-surface-variant">
                  Interactive radial spending distribution, per-category budget threshold alerts, and automated peer-split execution policies.
                </p>
              </div>

              {/* Bottom action toolbar */}
              <div className="mt-5 pt-4 border-t border-surface-container flex items-center gap-2.5 flex-wrap">
                <button
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface text-sm font-semibold border border-slate-200 shadow-sm transition-colors active:scale-95"
                  type="button"
                  onClick={() => {
                    showToast("Running Monte Carlo balance simulation (+/- 15% variance)...", "hourglass_top");
                    setTimeout(() => showToast(`Simulation complete: Expected settlement within ${inr0(1030)} buffer`, "verified"), 1500);
                  }}
                >
                  <span className="material-symbols-outlined text-[18px] text-secondary">insights</span>
                  <span>Simulate Category Outlay</span>
                </button>
                <button
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface text-sm font-semibold border border-slate-200 shadow-sm transition-colors active:scale-95"
                  type="button"
                  onClick={() => showToast("Exported rule governance cryptographic manifest (SHA-256)", "policy")}
                >
                  <span className="material-symbols-outlined text-[18px] text-secondary">policy</span>
                  <span>Audit Rules Log</span>
                </button>
                <button
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-sm font-bold shadow-md transition-colors active:scale-95"
                  type="button"
                  onClick={() => setModalCat("New Custom Taxonomy")}
                >
                  <span className="material-symbols-outlined text-[18px]">add_circle</span>
                  <span>Create Taxonomy</span>
                </button>
              </div>
            </div>

            {/* 2. Central Radial Visualizer + Health */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Radial Donut (7 cols) */}
              <div className="lg:col-span-7 bg-surface-container-lowest p-5 sm:p-6 rounded-3xl shadow-sm flex flex-col justify-between relative overflow-hidden">
                <div className="flex items-center justify-between pb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-primary-fixed flex items-center justify-center text-on-primary-fixed-variant">
                      <span className="material-symbols-outlined text-[20px]">pie_chart</span>
                    </div>
                    <div>
                      <h2 className="font-bold text-base text-on-surface leading-tight">Radial Spend Allocation Matrix</h2>
                      <p className="text-xs text-on-surface-variant">Live proportional weighting based on finalized group tabs</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low text-on-surface-variant font-label-caps text-[11px]">
                    <span className="material-symbols-outlined text-[16px] text-primary">verified_user</span>
                    <span>Ledger In-Sync</span>
                  </div>
                </div>

                <div className="py-4 flex flex-col md:flex-row items-center justify-around gap-6 relative">
                  <div className="relative w-64 h-64 md:w-72 md:h-72 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 200 200">
                      {donutSegments.map((s) => (
                        <circle
                          key={s.id}
                          cx="100"
                          cy="100"
                          fill="transparent"
                          r={DONUT_R}
                          stroke={s.color}
                          strokeDasharray={`${s.dash.toFixed(1)} ${DONUT_C.toFixed(1)}`}
                          strokeDashoffset={s.offset.toFixed(1)}
                          strokeWidth="24"
                          className="transition-all duration-300 hover:opacity-90 cursor-pointer"
                          style={{ opacity: activeFilter === "all" || activeFilter === s.id ? 1 : 0.35 }}
                          onClick={() => focusCategory(s)}
                        />
                      ))}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
                      <span className="font-label-caps text-[11px] text-outline uppercase tracking-wider">Total Outlay</span>
                      <span className="font-numeric-balance-lg text-xl md:text-2xl text-on-surface font-extrabold tracking-tight mt-0.5">{center}</span>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-primary font-bold text-[11px]">12 Categories</span>
                        <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-bold text-[11px]">4 Custom</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2.5 w-full max-w-xs">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-on-surface">Category Velocity</span>
                      <span className="text-primary font-semibold">98.4% Matched</span>
                    </div>
                    {CATEGORIES.map((c) => (
                      <button
                        key={c.id}
                        className={`p-2.5 rounded-2xl ${c.barBg} flex items-center justify-between transition-all hover:shadow-sm ${activeFilter === c.id ? "ring-2 ring-primary" : ""}`}
                        type="button"
                        onClick={() => focusCategory(c)}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-full ${c.dot}`} />
                          <span className={`font-semibold text-sm ${c.text}`}>
                            {c.full} ({c.pct}%)
                          </span>
                        </div>
                        <span className={`font-numeric-balance-md text-sm ${c.text} font-bold`}>{inr0(c.amount)}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-on-surface-variant bg-surface-container-low/60 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-4 px-5 sm:px-6 rounded-b-3xl">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-primary">data_thresholding</span>
                    <span>Cluster confidence rating: <strong className="text-on-surface">99.2% via Macaron Engine</strong></span>
                  </div>
                  <span className="font-mono text-[12px] bg-surface-container-lowest px-2 py-0.5 rounded-md text-outline">taxonomy_v4.2_tahoe.json</span>
                </div>
              </div>

              {/* Health & Legend (5 cols) */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="bg-surface-container-lowest p-4 rounded-3xl shadow-sm flex items-center gap-4 relative overflow-hidden">
                  <div className="w-14 h-14 rounded-2xl bg-primary-fixed flex items-center justify-center text-on-primary-fixed-variant shrink-0">
                    <span className="material-symbols-outlined text-[32px]">task_alt</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-base text-on-surface">Zero Unassigned Expenses</span>
                      <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-caps text-[11px] uppercase">100% Locked</span>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-0.5">Every single line item is cryptographically mapped to an authorized policy rule and participant quorum.</p>
                  </div>
                </div>

                <div className="bg-surface-container-lowest p-5 rounded-3xl shadow-sm flex flex-col justify-between gap-4 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-base text-on-surface">Active Budget Health</h3>
                      <p className="text-xs text-on-surface-variant">Aggregate cap: {inr0(CAP)} • Consumed: {inr0(TOTAL)} ({((TOTAL / CAP) * 100).toFixed(1)}%)</p>
                    </div>
                    <div className="flex items-center gap-1 bg-surface-container-low px-2 py-1 rounded-full text-on-surface-variant font-label-caps text-[11px]">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      <span>Controlled</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="w-full h-4 bg-surface-container-low rounded-full overflow-hidden flex p-0.5 shadow-inner">
                      {CATEGORIES.map((c) => (
                        <div key={c.id} className="h-full" style={{ width: `${(c.amount / CAP) * 100}%`, backgroundColor: c.color }} title={`${c.full}: ${inr0(c.amount)}`} />
                      ))}
                      <div className="h-full bg-surface-container-high flex-1 rounded-r-full" title="Headroom Available" />
                    </div>
                    <div className="flex justify-between items-center text-xs text-on-surface-variant px-1">
                      <span>Spent: {inr0(TOTAL)}</span>
                      <span className="font-semibold text-primary">Headroom Left: {inr0(headroom)}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="font-label-caps text-[11px] text-outline uppercase tracking-wider">Interactive Taxonomy Filter</span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        className={`px-3 py-1.5 rounded-full font-medium text-sm flex items-center gap-1.5 shadow-sm ${activeFilter === "all" ? "bg-primary text-on-primary" : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"}`}
                        type="button"
                        onClick={() => setActiveFilter("all")}
                      >
                        <span>All (5)</span>
                      </button>
                      {CATEGORIES.map((c) => (
                        <button
                          key={c.id}
                          className={`px-3 py-1.5 rounded-full font-medium text-sm flex items-center gap-1 transition-colors ${c.chip} ${activeFilter === c.id ? "ring-2 ring-primary" : ""}`}
                          type="button"
                          onClick={() => focusCategory(c)}
                        >
                          <span>{c.label}</span>
                          <span className="font-bold text-[11px]">{c.pct}%</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <button className="p-3.5 rounded-2xl bg-surface-container-low flex items-center justify-between text-left hover:bg-surface-container transition-colors" type="button" onClick={() => setModalCat("Auto-Allocation Quorum")}>
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[24px] text-secondary">tune</span>
                      <div>
                        <span className="font-semibold text-sm text-on-surface">Auto-Allocation Quorum</span>
                        <p className="text-xs text-on-surface-variant">Default 2/3 majority requirement for new categories</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-outline">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Bottom 3 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Column A: Default Split Strategy */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-6 rounded-full bg-primary" />
                    <div>
                      <h3 className="font-bold text-base text-on-surface">Default Split Strategy</h3>
                      <p className="text-xs text-on-surface-variant">Execution behaviors per category upload</p>
                    </div>
                  </div>
                  <span className="font-label-caps text-[11px] bg-surface-container-high px-2 py-0.5 rounded-md text-on-surface-variant">Col A</span>
                </div>
                {STRATEGIES.map((s) => (
                  <div key={s.title} className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-10 h-10 rounded-xl ${s.iconCls} flex items-center justify-center font-bold text-[20px] shrink-0`}>{s.icon}</div>
                        <div className="min-w-0">
                          <h4 className="font-semibold text-sm text-on-surface leading-tight">{s.title}</h4>
                          <p className="text-xs text-on-surface-variant">{s.desc}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-[11px] font-bold shrink-0 ${s.badgeCls}`}>{s.badge}</span>
                    </div>
                    {s.rows && (
                      <div className="p-2.5 rounded-xl bg-surface-container-low text-xs text-on-surface-variant flex flex-col gap-1">
                        {s.rows.map((r) => (
                          <div key={r.k} className="flex justify-between gap-2">
                            <span className="min-w-0">{r.k}</span>
                            <span className={`font-semibold shrink-0 ${r.vCls}`}>{r.v}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {s.checks && (
                      <div className="p-2.5 rounded-xl bg-surface-container-low text-xs text-on-surface-variant flex flex-col gap-1">
                        {s.checks.map((c) => (
                          <div key={c} className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px] text-primary">check</span>
                            <span>{c}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {s.para && <p className="text-xs text-on-surface-variant">{s.para}</p>}
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <span className="text-outline font-label-caps text-[11px] uppercase">{s.footLeft}</span>
                      <button className="text-primary hover:text-on-primary-fixed-variant font-semibold text-sm flex items-center gap-1" type="button" onClick={() => setModalCat(s.title)}>
                        <span>Customize Split Rule</span>
                        <span className="material-symbols-outlined text-[16px]">edit</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Column B: Budget Guardrails */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-6 rounded-full bg-[#f97316]" />
                    <div>
                      <h3 className="font-bold text-base text-on-surface">Budget Guardrails</h3>
                      <p className="text-xs text-on-surface-variant">Threshold triggers and circuit breakers</p>
                    </div>
                  </div>
                  <span className="font-label-caps text-[11px] bg-surface-container-high px-2 py-0.5 rounded-md text-on-surface-variant">Col B</span>
                </div>
                {GUARDRAILS.map((g) => (
                  <div key={g.sub} className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-label-caps text-[11px] text-outline uppercase tracking-wider">{g.sub}</span>
                        <h4 className="font-semibold text-sm text-on-surface font-bold">{g.title}</h4>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 shrink-0 ${g.statusCls}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${g.dot || "bg-primary-container"}`} />
                        {g.lock && <span className="material-symbols-outlined text-[14px]">lock</span>}
                        {g.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className={`font-numeric-balance-lg text-xl ${g.amountCls} font-bold`}>{inr0(g.spent)}</span>
                      <span className="text-xs text-on-surface-variant">
                        Cap: <strong>{inr0(g.cap)}</strong> ({g.pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-surface-container-low rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${g.barCls}`} style={{ width: `${g.pct}%` }} />
                    </div>
                    {g.callout && (
                      <div className="p-3 rounded-xl bg-[#fef2f2] text-[#991b1b] flex items-center gap-2 text-xs">
                        <span className="material-symbols-outlined text-[18px]">warning</span>
                        <span className="font-semibold">Approaching Limit • {inr0(g.cap - g.spent)} headroom left</span>
                      </div>
                    )}
                    <div className="text-xs text-on-surface-variant flex items-center justify-between gap-2">
                      <span className="min-w-0">{g.note}</span>
                      {g.action && (
                        <button className="text-secondary font-semibold hover:underline shrink-0" type="button" onClick={() => showToast(`Requested ${inr0(16600)} cap extension for ${g.title} (Pending 3 approvals)`, "add_circle")}>
                          {g.action}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <div className="bg-secondary-fixed/50 p-4 rounded-2xl flex flex-col gap-2 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#25d366] text-white flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px]">chat</span>
                      </div>
                      <span className="font-semibold text-sm text-on-surface font-bold">WhatsApp Threshold Beacon</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-[#25d366]/20 text-[#128c7e] text-[11px] font-bold">Active</span>
                  </div>
                  <p className="text-xs text-on-surface-variant">Automated alerts dispatched to the Tahoe 2025 WhatsApp channel whenever any category crosses the 80% mark.</p>
                </div>
              </div>

              {/* Column C: OCR Matcher & Registry */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-6 rounded-full bg-secondary" />
                    <div>
                      <h3 className="font-bold text-base text-on-surface">OCR Matcher &amp; Registry</h3>
                      <p className="text-xs text-on-surface-variant">Neural keyword parsing engine</p>
                    </div>
                  </div>
                  <span className="font-label-caps text-[11px] bg-surface-container-high px-2 py-0.5 rounded-md text-on-surface-variant">Col C</span>
                </div>
                <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm flex flex-col gap-3">
                  <span className="font-label-caps text-[11px] text-outline uppercase tracking-wider">Trained Pattern Matches</span>
                  {MERCHANTS.map((m) => (
                    <div key={m.name} className="p-2.5 rounded-xl bg-surface-container-low flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`material-symbols-outlined text-[18px] ${m.iconCls} shrink-0`}>{m.icon}</span>
                        <div className="min-w-0">
                          <span className="font-mono text-[13px] font-semibold text-on-surface block truncate">{m.name}</span>
                          <span className="text-[11px] text-outline block truncate">{m.kw}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="material-symbols-outlined text-[14px] text-outline">arrow_forward</span>
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${m.pill}`}>{m.cat} ({m.conf})</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-on-surface font-bold">Simulate Merchant Match</span>
                    <span className="material-symbols-outlined text-secondary text-[20px]">smart_toy</span>
                  </div>
                  <div className="relative">
                    <input
                      className="w-full bg-surface-container-low px-3.5 py-2.5 rounded-xl text-on-surface placeholder:text-outline text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-20"
                      placeholder="e.g. Blue Coyote Bar & Grill Truckee"
                      type="text"
                      value={merchantQuery}
                      onChange={(e) => setMerchantQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && runMatch()}
                    />
                    <button className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-lg bg-surface-container-lowest text-primary font-bold text-[12px] shadow-sm hover:bg-surface-container" type="button" onClick={runMatch}>
                      Test
                    </button>
                  </div>
                  <div className={`p-3 rounded-xl flex items-center justify-between gap-2 ${matchResult.bg}`}>
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="material-symbols-outlined text-[18px] shrink-0" style={{ color: matchResult.color }}>
                        {matchResult.icon}
                      </span>
                      <span className="text-sm font-semibold truncate" style={{ color: matchResult.color }}>
                        Matched: {matchResult.label}
                      </span>
                    </div>
                    <span className="font-mono text-[11px] bg-surface-container-lowest px-2 py-0.5 rounded font-bold shrink-0" style={{ color: matchResult.color }}>
                      {matchResult.conf} confidence
                    </span>
                  </div>
                  <button
                    className="w-full py-2.5 rounded-xl border border-dashed border-outline-variant hover:border-primary text-on-surface-variant hover:text-primary font-semibold text-sm transition-colors flex items-center justify-center gap-1.5"
                    type="button"
                    onClick={() => showToast("Opened Keyword Corpus Registry tool", "spellcheck")}
                  >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    <span>+ Add Custom Keyword Match</span>
                  </button>
                </div>
                <div className="p-3.5 rounded-2xl bg-surface-container-low/70 flex items-center justify-between text-xs text-on-surface-variant">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-primary">security</span>
                    <span>Policy Governance Hash:</span>
                  </div>
                  <span className="font-mono text-[11px] text-outline">0x8f2a...390d</span>
                </div>
              </div>
            </div>

            {/* 4. Venue Footprint */}
            <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-3xl shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex flex-col gap-2 max-w-xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-caps text-[11px] uppercase font-bold">Spatial Footprint</span>
                  <span className="text-on-surface-variant text-sm">Olympic Valley &amp; Tahoe City</span>
                </div>
                <h3 className="font-bold text-base text-on-surface">Category Venue Distribution</h3>
                <p className="text-sm text-on-surface-variant">Geographic triangulation ensures zero misattribution between Truckee valley markets and on-mountain resort hospitality.</p>
              </div>
              <div className="w-full lg:w-96 h-36 rounded-2xl overflow-hidden shadow-inner relative group bg-gradient-to-br from-[#cfe9ff] via-[#e6f4ff] to-[#eafff5] shrink-0">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[56px] text-[#0284c7]/60">landscape</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-transparent to-transparent flex items-end p-3">
                  <div className="flex items-center justify-between w-full text-inverse-on-surface">
                    <span className="font-semibold text-sm font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[18px] text-primary-fixed">pin_drop</span>
                      Palisades Tahoe Quad
                    </span>
                    <span className="font-label-caps text-[11px] uppercase bg-primary/80 px-2 py-0.5 rounded">6 Geotags Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Policy Modal */}
        {modalCat && (
          <div className="fixed inset-0 z-50 bg-on-background/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && setModalCat(null)}>
            <div className="bg-surface-container-lowest rounded-3xl max-w-lg w-full p-6 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-fixed text-on-primary-fixed-variant flex items-center justify-center">
                    <span className="material-symbols-outlined text-[22px]">tune</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-on-surface">Customize {modalCat} Rule</h3>
                    <p className="text-xs text-on-surface-variant">Tahoe Ski Weekend Governance Engine</p>
                  </div>
                </div>
                <button className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high" type="button" onClick={() => setModalCat(null)}>
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
              <div className="flex flex-col gap-3 py-2">
                <label className="font-label-caps text-[11px] text-outline uppercase tracking-wider">Allocation Paradigm</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "Proportional", icon: "equalizer" },
                    { id: "Equal 1/N", icon: "balance" },
                    { id: "Shares %", icon: "percent" },
                  ].map((p) => (
                    <button
                      key={p.id}
                      className={`py-2.5 rounded-xl font-semibold text-sm flex flex-col items-center gap-1 ${paradigm === p.id ? "bg-primary text-on-primary shadow-sm" : "bg-surface-container-low text-on-surface hover:bg-surface-container"}`}
                      type="button"
                      onClick={() => setParadigm(p.id)}
                    >
                      <span className="material-symbols-outlined text-[18px]">{p.icon}</span>
                      <span>{p.id}</span>
                    </button>
                  ))}
                </div>
                <div className="flex flex-col gap-1.5 mt-2">
                  <label className="font-label-caps text-[11px] text-outline uppercase tracking-wider">Exemption Overrides</label>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low">
                    <span className="text-sm text-on-surface">Allow non-participating member opt-outs</span>
                    <button
                      aria-label="Toggle opt-out"
                      className={`relative w-10 h-6 rounded-full transition-colors shrink-0 ${optOut ? "bg-primary" : "bg-surface-container-highest"}`}
                      type="button"
                      onClick={() => setOptOut((v) => !v)}
                    >
                      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${optOut ? "translate-x-[18px]" : "translate-x-0.5"}`} />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-caps text-[11px] text-outline uppercase tracking-wider">Dynamic Multiplier</label>
                  <div className="flex items-center gap-3">
                    <input className="w-full accent-primary" max="2" min="1" step="0.25" type="range" value={multiplier} onChange={(e) => setMultiplier(Number(e.target.value))} />
                    <span className="font-mono font-bold text-on-surface">{multiplier.toFixed(2)}x</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button className="px-4 py-2 rounded-xl bg-surface-container-low text-on-surface-variant font-semibold text-sm hover:bg-surface-container" type="button" onClick={() => setModalCat(null)}>
                  Cancel
                </button>
                <button
                  className="px-5 py-2 rounded-xl bg-primary text-on-primary font-semibold text-sm hover:bg-primary-container shadow-md"
                  type="button"
                  onClick={() => {
                    setModalCat(null);
                    showToast("Updated split algorithm & synchronized with peer nodes", "sync");
                  }}
                >
                  Save Execution Policy
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast */}
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