import { useRef, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import Breadcrumbs from "../components/layout/Breadcrumbs";
import AnalyticsScopeBar from "../components/layout/AnalyticsScopeBar";

const inr = (n) => `₹${Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
const inr2 = (n) => `₹${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const KPIS = [
  {
    label: "Gross Shared Spend",
    icon: "account_balance_wallet",
    tone: "bg-sky-100",
    value: inr2(284565.5),
    sub: "28 pooled expenses across 5 streams",
    blob: "bg-sky-200/60",
  },
  {
    label: "Your Adjusted Burden",
    icon: "person_check",
    tone: "bg-matcha-100",
    value: inr2(85001.96),
    sub: "Weighted tab after line-item split",
    pill: "29.8% Share",
    blob: "bg-matcha-200/60",
  },
  {
    label: "Fronted Category Capital",
    icon: "verified",
    tone: "bg-buttercup-100",
    value: inr2(199563.54),
    sub: "100% reimbursed to linked cards",
    blob: "bg-buttercup-200/60",
  },
  {
    label: "Netting Drift & Invariance",
    icon: "all_inclusive",
    tone: "bg-lilac-100",
    value: "₹0.00 Drift",
    sub: "5 categories mathematically locked",
    pill: "Zero-Loss",
    blob: "bg-lilac-200/60",
  },
];

const CATS = [
  {
    id: "lodging",
    name: "Lodging",
    icon: "villa",
    tone: "bg-sky-100",
    seg: "bg-sky-200",
    dot: "bg-sky-600",
    width: "36.4%",
    total: 103750,
    mine: 25937.5,
    group: 77812.5,
    txns: 3,
    accuracy: 100,
    split: "custom",
    splitLabel: "CUSTOM WEIGHTED",
    cap: 124500,
    participants: "5 participants · 3 nights",
    items: [
      { icon: "villa", label: "Airbnb Chalet · 3 nights", amount: 73790, note: "Split 8 ways", tag: "OCR" },
      { icon: "cleaning_services", label: "Cleaning & Service Fee", amount: 17430, note: "Split 8 ways", tag: "OCR" },
      { icon: "hot_tub", label: "Hot Tub Surcharge", amount: 12530, note: "Split 8 ways", tag: "OCR" },
    ],
  },
  {
    id: "groceries",
    name: "Groceries",
    icon: "shopping_basket",
    tone: "bg-matcha-100",
    seg: "bg-matcha-200",
    dot: "bg-matcha-600",
    width: "24.5%",
    total: 69894.3,
    mine: 17473.16,
    group: 52421.14,
    txns: 18,
    accuracy: 98,
    split: "equal",
    splitLabel: "EQUAL SPLIT",
    cap: 74700,
    participants: "3 participants · 18 baskets",
    items: [
      { icon: "storefront", label: "Trader Joe's · 42% share", amount: 29350.5, note: "Weighted 42%", tag: "OCR" },
      { icon: "grocery", label: "Whole Foods Pantry Run", amount: 25077.8, note: "Equal 3-way", tag: "PRO-RATA" },
      { icon: "local_drink", label: "Costco Bulk Order", amount: 15466, note: "Equal 3-way", tag: "OCR" },
    ],
  },
  {
    id: "dining",
    name: "Dining",
    icon: "restaurant",
    tone: "bg-peach-100",
    seg: "bg-peach-200",
    dot: "bg-peach-600",
    width: "17.0%",
    total: 48488.6,
    mine: 15512.7,
    group: 32975.9,
    txns: 22,
    accuracy: 91,
    split: "custom",
    splitLabel: "CUSTOM WEIGHTED",
    cap: 49800,
    near: true,
    participants: "4 participants · 22 outings",
    items: [
      { icon: "local_pizza", label: "Wood-Fired Margherita", amount: 1826, note: "Shared 100%", tag: "OCR" },
      { icon: "bakery_dining", label: "Burrata Heirloom", amount: 1535.5, note: "Shared 100%", tag: "OCR" },
      { icon: "no_drinks", label: "Spritz Cocktails (x3)", amount: 3735, note: "Excluded from 2 non-drinkers", tag: "EXCL" },
      { icon: "percent", label: "Tip & Service Charge (20%)", amount: 1419.3, note: "Pro-rata by headcount", tag: "PRO-RATA" },
    ],
  },
  {
    id: "utilities",
    name: "Utilities",
    icon: "wifi",
    tone: "bg-lilac-100",
    seg: "bg-lilac-200",
    dot: "bg-lilac-600",
    width: "11.4%",
    total: 32370,
    mine: 10790,
    group: 21580,
    txns: 4,
    accuracy: 100,
    split: "equal",
    splitLabel: "EQUAL SPLIT",
    cap: 37350,
    participants: "3 participants · 4 bills",
    items: [
      { icon: "bolt", label: "ConEd Energy Statement", amount: 17430, note: "Split 3 ways", tag: "OCR" },
      { icon: "wifi", label: "Verizon Fios 1 Gig", amount: 8300, note: "Split 3 ways", tag: "PRO-RATA" },
      { icon: "water_drop", label: "Water & Sewer", amount: 6640, note: "Split 3 ways", tag: "OCR" },
    ],
  },
  {
    id: "transport",
    name: "Transport",
    icon: "directions_car",
    tone: "bg-buttercup-100",
    seg: "bg-buttercup-200",
    dot: "bg-buttercup-700",
    width: "10.6%",
    total: 30062.6,
    mine: 15288.6,
    group: 14774,
    txns: 6,
    accuracy: 88,
    split: "equal",
    splitLabel: "EQUAL SPLIT",
    cap: 37350,
    participants: "2 participants · 6 rentals",
    items: [
      { icon: "car_rental", label: "Hertz SUV · 3 days", amount: 12450, note: "Split 2 ways", tag: "OCR" },
      { icon: "local_gas_station", label: "Fuel & Tolls", amount: 6980.6, note: "Split 2 ways", tag: "PRO-RATA" },
      { icon: "flight", label: "SFO Airport Shuttle", amount: 10632, note: "Split 2 ways", tag: "OCR" },
    ],
  },
];

const FILTERS = [
  { id: "all", label: "ALL (5)" },
  { id: "near", label: "NEAR CAP (1)" },
  { id: "equal", label: "EQUAL SPLIT (3)" },
  { id: "custom", label: "CUSTOM WEIGHTED (2)" },
];

const TAGS = [
  { label: "Trader Joe's", weight: "42%", tone: "bg-matcha-100" },
  { label: "Airbnb Tahoe", weight: "100%", tone: "bg-sky-100" },
  { label: "ConEd Energy", weight: "100%", tone: "bg-lilac-100" },
  { label: "Whole Foods", weight: "28%", tone: "bg-matcha-100" },
  { label: "Palmetto Diner", weight: "18%", tone: "bg-peach-100" },
  { label: "Lift Tickets", weight: "65%", tone: "bg-buttercup-100" },
  { label: "Hertz SUV", weight: "50%", tone: "bg-buttercup-100" },
];

const HASH = "0x7f9a4c1e8b20d6a5f3c9…3c2e::cat_invariant_verified_ok";

export default function CategoryDrift() {
  const [active, setActive] = useState("dining");
  const [filter, setFilter] = useState("all");
  const [autoPing, setAutoPing] = useState(true);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  function showToast(message, icon = "check_circle") {
    setToast({ message, icon });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }

  const cat = CATS.find((c) => c.id === active) || CATS[0];
  const share = Math.round((cat.mine / cat.total) * 1000) / 10;
  const variance = Math.round((100 / CATS.length - share) * 10) / 10;
  const consumed = Math.round((cat.total / cat.cap) * 1000) / 10;
  const remaining = Math.max(cat.cap - cat.total, 0);

  const rows = CATS.filter((c) => {
    if (filter === "near") return c.near === true;
    if (filter === "equal") return c.split === "equal";
    if (filter === "custom") return c.split === "custom";
    return true;
  });

  async function copyHash() {
    try {
      await navigator.clipboard.writeText(HASH);
      showToast("Category invariant hash copied.", "content_copy");
    } catch {
      showToast("Copy unavailable in this browser.", "content_copy");
    }
  }

  return (
    <AppLayout>
      <main className="w-full min-h-screen overflow-x-clip">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumbs
            items={[
              { label: "Home", to: "/dashboard", icon: "home" },
              { label: "Analytics", to: "/analytics", icon: "insights" },
              { label: "Categories" },
            ]}
            status={{ label: "May 2024", note: "Category invariant locked" }}
          />

          {/* Header card */}
          <div className="relative overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm shadow-zinc-900/5 border border-outline-variant/60 w-full px-4 py-4 sm:px-5 mb-4">
            <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 font-label-caps text-[10px] tracking-wider text-on-surface-variant mb-1 flex-wrap">
                  <span className="text-primary font-bold uppercase">Category Drift Studio</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span>May 1 – May 31, 2024 · Ledger Invariant</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-on-surface tracking-tight leading-tight">Category Analysis &amp; Allocation</h1>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-low border border-outline-variant/40 font-label-caps text-[10px] text-on-surface font-semibold">
                  <span className="material-symbols-outlined text-[13px] text-primary">auto_awesome</span>
                  Auto-Calibration: ON
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-caps text-[10px] font-bold">
                  <span className="material-symbols-outlined text-[13px]">verified</span>
                  Ledger Clean
                </span>
              </div>
            </div>

            {/* Scope row */}
            <AnalyticsScopeBar current="Categories" />
            </div>

          {/* KPI strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-4">
            {KPIS.map((k) => (
              <div key={k.label} className={`relative overflow-hidden ${k.tone} p-4 rounded-2xl flex flex-col justify-between shadow-sm shadow-zinc-900/5`}>
                <div className={`absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl pointer-events-none ${k.blob}`} />
                <div className="relative flex items-center justify-between gap-2">
                  <span className="font-label-caps text-[10px] uppercase font-bold tracking-wider text-on-surface/70 truncate">{k.label}</span>
                  {k.pill ? (
                    <span className="font-label-caps text-[10px] px-2 py-0.5 rounded-full bg-surface-container-lowest text-primary font-bold shadow-sm shrink-0 whitespace-nowrap">{k.pill}</span>
                  ) : (
                    <span className="material-symbols-outlined text-[18px] text-on-surface shrink-0">{k.icon}</span>
                  )}
                </div>
                <div className="relative mt-2">
                  <div className="text-2xl font-extrabold font-mono text-on-surface leading-tight">{k.value}</div>
                  <p className="text-xs text-on-surface-variant mt-0.5">{k.sub}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            {/* LEFT */}
            <div className="lg:col-span-8 min-w-0 flex flex-col gap-4">
              {/* Allocation & trajectory */}
              <div className="bg-surface-container-lowest p-4 sm:p-5 rounded-3xl shadow-sm border border-outline-variant/60 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="min-w-0">
                    <h2 className="text-base font-bold text-on-surface">Category Allocation &amp; Trajectory</h2>
                    <p className="text-xs text-on-surface-variant">Aggregate pool distribution and live line-item drilldown</p>
                  </div>
                  <span className="font-label-caps text-[10px] px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-bold self-start sm:self-auto shrink-0">5 ACTIVE CATEGORIES</span>
                </div>

                {/* Stacked bar */}
                <div className="flex flex-col gap-2">
                  <div className="w-full h-3.5 rounded-full overflow-hidden flex gap-1 bg-surface-container-low p-0.5">
                    {CATS.map((c) => {
                      const isActive = active === c.id;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setActive(c.id)}
                          style={{ width: c.width }}
                          className={`h-full rounded-full transition-all ${c.seg} ${isActive ? "ring-2 ring-inset ring-tertiary-container" : "hover:opacity-80"}`}
                          aria-label={`${c.name} ${inr(c.total)}`}
                        />
                      );
                    })}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-on-surface-variant">
                    {CATS.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setActive(c.id)}
                        className={`flex items-center gap-1.5 transition-colors ${active === c.id ? "text-on-surface font-bold" : "hover:text-on-surface"}`}
                      >
                        <span className={`w-3 h-3 rounded-full shrink-0 ${c.dot}`} />
                        <span className="whitespace-nowrap">
                          {c.name} {inr2(c.total)} ({Math.round((c.total / 284565.5) * 1000) / 10}%)
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto px-1 py-2 -mx-1">
                  {CATS.map((c) => {
                    const isActive = active === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setActive(c.id)}
                        className={`px-3.5 py-1.5 rounded-full text-xs whitespace-nowrap shrink-0 border transition-colors ${
                          isActive
                            ? `${c.tone} text-on-surface font-bold shadow-sm border-tertiary-container`
                            : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-medium border-transparent"
                        }`}
                      >
                        {c.name}
                      </button>
                    );
                  })}
                </div>

                {/* Deep dive */}
                <div className={`p-4 sm:p-5 rounded-2xl border flex flex-col gap-4 ${cat.id === "dining" ? "bg-peach-50 border-peach-200" : "bg-surface-container-low border-outline-variant/40"}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-surface-container">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-10 h-10 rounded-2xl ${cat.tone} flex items-center justify-center text-on-surface shrink-0`}>
                        <span className="material-symbols-outlined text-[22px]">{cat.icon}</span>
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-on-surface truncate">{cat.name} Active Ledger</h3>
                        <span className="text-xs text-on-surface-variant">{cat.participants}</span>
                      </div>
                    </div>
                    <div className="flex items-baseline gap-5 shrink-0">
                      <div className="text-right">
                        <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">Group Total</span>
                        <div className="text-lg font-extrabold font-mono text-on-surface">{inr2(cat.total)}</div>
                      </div>
                      <div className="text-right">
                        <span className="font-label-caps text-[10px] text-primary uppercase">Your Tab</span>
                        <div className="text-lg font-extrabold font-mono text-primary">
                          {inr2(cat.mine)} <span className="text-xs font-normal text-on-surface-variant">({share}%)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Variance gauge */}
                  <div className="p-3 bg-surface-container-lowest rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="material-symbols-outlined text-primary text-[20px] shrink-0">tune</span>
                      <span className="text-xs text-on-surface font-medium whitespace-nowrap">Fair-Share Variance Gauge:</span>
                      <span className="text-xs text-primary font-bold">
                        {variance >= 0 ? "You paid" : "You covered"} {Math.abs(variance)}% {variance >= 0 ? "less" : "more"} than an equal {CATS.length}-way split due to itemized exclusions
                      </span>
                    </div>
                    <span className="font-label-caps text-[10px] px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-bold shrink-0 self-start sm:self-auto">FAIR ADJUSTED</span>
                  </div>

                  {/* Line items */}
                  <div className="flex flex-col gap-2">
                    <span className="font-label-caps text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">Itemized Line-Item Allocations</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {cat.items.map((it) => {
                        const excluded = it.tag === "EXCL";
                        return (
                          <div
                            key={it.label}
                            className={`p-2.5 rounded-xl flex items-center justify-between gap-2 ${excluded ? "bg-peach-50" : "bg-surface-container-lowest shadow-sm"}`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className={`material-symbols-outlined text-[16px] shrink-0 ${excluded ? "text-tertiary" : "text-primary"}`}>{it.icon}</span>
                              <div className="min-w-0">
                                <span className={`block text-xs font-semibold truncate ${excluded ? "text-tertiary" : "text-on-surface"}`}>{it.label}</span>
                                <span className="block text-[11px] text-outline truncate">{it.note}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="text-sm font-bold font-mono text-on-surface whitespace-nowrap">{inr2(it.amount)}</span>
                              <span className={`font-label-caps text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap ${excluded ? "bg-peach-100 text-tertiary font-bold" : "bg-surface-container text-on-surface-variant"}`}>
                                {it.tag}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Efficiency & fairness matrix */}
              <div className="bg-surface-container-lowest p-4 sm:p-5 rounded-3xl shadow-sm border border-outline-variant/60 flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="min-w-0">
                    <h2 className="text-base font-bold text-on-surface">Category Efficiency &amp; Fairness Matrix</h2>
                    <p className="text-xs text-on-surface-variant">Automated balance calibration based on shared ledger allocations</p>
                  </div>
                  <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
                    {FILTERS.map((f) => {
                      const isActive = filter === f.id;
                      const cls = isActive
                        ? f.id === "near"
                          ? "bg-peach-100 text-tertiary font-bold ring-1 ring-peach-200"
                          : "bg-on-surface text-surface-container-lowest font-bold"
                        : "bg-surface-container text-on-surface hover:bg-surface-container-high font-medium";
                      return (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setFilter(f.id)}
                          className={`px-3 py-1 rounded-full font-label-caps text-[10px] whitespace-nowrap shrink-0 transition-colors ${cls}`}
                        >
                          {f.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[680px]">
                    <thead>
                      <tr className="bg-surface-container-low text-on-surface-variant font-label-caps text-[10px] uppercase">
                        <th className="py-2.5 px-3 rounded-l-xl">Category</th>
                        <th className="py-2.5 px-3">Volume</th>
                        <th className="py-2.5 px-3">Group vs Mine</th>
                        <th className="py-2.5 px-3">Txns</th>
                        <th className="py-2.5 px-3">Split Accuracy</th>
                        <th className="py-2.5 px-3 rounded-r-xl text-right">Guardrail Alert</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container">
                      {rows.map((c) => {
                        const nearCap = c.near === true;
                        const hit = Math.round((c.total / c.cap) * 1000) / 10;
                        return (
                          <tr key={c.id} className={`transition-colors ${active === c.id ? "bg-surface-container-low/70" : "hover:bg-surface-container-low/60"}`}>
                            <td className="py-3 px-3">
                              <button type="button" onClick={() => setActive(c.id)} className="flex items-center gap-2 text-left">
                                <span className={`w-7 h-7 rounded-xl ${c.tone} flex items-center justify-center text-on-surface shrink-0`}>
                                  <span className="material-symbols-outlined text-[16px]">{c.icon}</span>
                                </span>
                                <span className="text-xs font-semibold text-on-surface whitespace-nowrap">{c.name}</span>
                              </button>
                            </td>
                            <td className="py-3 px-3 font-mono font-semibold text-on-surface whitespace-nowrap">{inr2(c.total)}</td>
                            <td className="py-3 px-3">
                              <div className="flex flex-col">
                                <span className="text-xs text-on-surface-variant font-medium whitespace-nowrap">Mine: {inr2(c.mine)}</span>
                                <span className="font-label-caps text-[10px] text-outline whitespace-nowrap">Group: {inr2(c.group)}</span>
                              </div>
                            </td>
                            <td className="py-3 px-3 text-on-surface-variant whitespace-nowrap">{c.txns}</td>
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-1.5">
                                <span className={`text-xs font-bold whitespace-nowrap ${nearCap ? "text-tertiary" : c.accuracy >= 95 ? "text-primary" : "text-on-surface"}`}>
                                  {c.accuracy === 100 ? "100%" : c.accuracy === 98 ? "98%" : c.accuracy === 91 ? "91% Alert" : "88%"}
                                </span>
                                <span className={`material-symbols-outlined text-[14px] ${nearCap ? "text-tertiary" : c.accuracy >= 95 ? "text-primary" : "text-outline"}`}>
                                  {nearCap ? "warning" : c.accuracy >= 95 ? "check_circle" : "info"}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-3 text-right">
                              {nearCap ? (
                                <span className="font-label-caps text-[10px] px-2 py-1 rounded-full bg-tertiary text-on-error font-bold whitespace-nowrap">{hit}% Hit</span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => showToast(`Guardrail alert armed for ${c.name} at ${c.cap ? inr(c.cap) : "custom"} per month.`, "notifications_active")}
                                  className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface hover:bg-surface-container-high font-medium text-xs transition-colors whitespace-nowrap"
                                >
                                  Set Alert
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                      {rows.length === 0 && (
                        <tr>
                          <td colSpan="6" className="py-6 text-center text-xs text-on-surface-variant">
                            No categories match this filter.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <aside className="lg:col-span-4 min-w-0 flex flex-col gap-4">
              {/* Guardrail studio */}
              <div className="bg-surface-container-lowest p-4 sm:p-5 rounded-3xl shadow-sm border border-outline-variant/60 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${nearGuard(cat) ? "bg-tertiary animate-pulse" : "bg-primary"}`} />
                    <span className={`font-label-caps text-[10px] font-bold uppercase tracking-wider truncate ${nearGuard(cat) ? "text-tertiary" : "text-primary"}`}>Guardrail Threshold Studio</span>
                  </div>
                  <span className="material-symbols-outlined text-[20px] text-on-surface-variant shrink-0" title={cat.splitLabel}>
                    tune
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-on-surface">{cat.name} Cap</h3>
                  <p className="text-xs text-on-surface-variant mt-1">Active spending meter with automated group notification thresholds.</p>
                </div>

                <div className="p-4 bg-surface-container-low rounded-2xl flex flex-col gap-2">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-xl font-extrabold font-mono text-on-surface">{inr2(cat.total)}</span>
                    <span className="text-xs font-semibold text-on-surface-variant whitespace-nowrap">Cap: {inr2(cat.cap)}</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-surface-container overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${nearGuard(cat) ? "bg-tertiary" : "bg-primary"}`} style={{ width: `${consumed}%` }} />
                  </div>
                  <div className={`p-2 rounded-xl border flex items-center justify-between gap-2 text-xs ${nearGuard(cat) ? "bg-peach-50 border-peach-200" : "bg-surface-container-lowest border-outline-variant/40"}`}>
                    <span className={`font-bold flex items-center gap-1 ${nearGuard(cat) ? "text-tertiary" : "text-on-surface-variant"}`}>
                      <span className={`material-symbols-outlined text-[16px] ${nearGuard(cat) ? "text-tertiary" : "text-on-surface-variant"}`}>warning</span>
                      {inr2(remaining)} remaining
                    </span>
                    <span className="text-on-surface-variant font-semibold whitespace-nowrap">{consumed}% consumed</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-surface-container-low flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="material-symbols-outlined text-primary text-[18px] shrink-0">cell_tower</span>
                    <span className="text-xs text-on-surface font-medium">Auto-ping group chat at 95% threshold</span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={autoPing}
                    onClick={() => {
                      setAutoPing(!autoPing);
                      showToast(`Auto-ping ${autoPing ? "disabled" : "enabled"} for ${cat.name}.`, autoPing ? "notifications_off" : "notifications_active");
                    }}
                    className={`w-10 h-6 rounded-full p-0.5 transition-colors shrink-0 ${autoPing ? "bg-primary" : "bg-outline-variant"}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-surface-container-lowest shadow-sm transition-transform ${autoPing ? "translate-x-4" : "translate-x-0"}`} />
                  </button>
                </div>

                <div className="p-2.5 rounded-xl bg-surface-container flex items-start gap-2">
                  <span className="material-symbols-outlined text-[18px] text-primary shrink-0">notifications_active</span>
                  <p className="text-xs text-on-surface leading-snug">
                    <strong className="font-semibold">Notification Rule:</strong> &ldquo;Friendly informal nudge in group chat when {cat.name.toLowerCase()} exceeds {inr(cat.cap)}/month.&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => showToast(`Cap editor opened for ${cat.name}.`, "sliders")}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-2xl bg-primary hover:bg-primary-container text-on-primary text-xs font-bold shadow-sm transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">sliders</span>
                    Adjust Category Caps
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast("New guardrail draft created.", "add")}
                    className="flex items-center gap-1 py-2.5 px-3.5 rounded-2xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Add Guardrail
                  </button>
                </div>
              </div>

              {/* Tag cloud */}
              <div className="bg-surface-container-lowest p-4 sm:p-5 rounded-3xl shadow-sm border border-outline-variant/60 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-on-surface">Sub-Category Tag Cloud</h3>
                    <p className="text-xs text-on-surface-variant">Line-item weights &amp; OCR attestation</p>
                  </div>
                  <span className="material-symbols-outlined text-outline text-[18px] shrink-0">label</span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {TAGS.map((t) => (
                    <button
                      key={t.label}
                      type="button"
                      onClick={() => showToast(`${t.label} · ${t.weight} allocated weight.`, "sell")}
                      className={`px-3 py-1 rounded-full ${t.tone} text-on-surface text-xs flex items-center gap-1.5 hover:opacity-90 transition-opacity`}
                    >
                      <span className="font-semibold">{t.label}</span>
                      <span className="font-label-caps text-[10px] font-bold px-1.5 rounded-full bg-surface-container-lowest">{t.weight}</span>
                    </button>
                  ))}
                </div>

                <div className="p-4 bg-surface-container-low rounded-2xl border border-surface-container flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-surface-container">
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-on-surface truncate">Palmetto Table &amp; Bar</div>
                      <span className="text-xs text-on-surface-variant">Parsed May 18, 2024 · 9:42 PM</span>
                    </div>
                    <span className="font-label-caps text-[10px] px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-bold flex items-center gap-1 shrink-0">
                      <span className="material-symbols-outlined text-[13px]">verified</span>
                      99.4%
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 text-xs text-on-surface">
                    <div className="flex justify-between gap-2">
                      <span>Subtotal (4 items)</span>
                      <span className="font-medium whitespace-nowrap">{inr2(7096.5)}</span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span>Tax &amp; Hospitality Tip</span>
                      <span className="font-medium whitespace-nowrap">{inr2(1419.3)}</span>
                    </div>
                    <div className="flex justify-between gap-2 font-bold pt-1 border-t border-surface-container">
                      <span>Total Settled</span>
                      <span className="whitespace-nowrap">{inr2(8515.8)}</span>
                    </div>
                  </div>
                  <div className="pt-1 flex items-center justify-between gap-2">
                    <span className="text-xs text-on-surface-variant min-w-0 truncate">
                      Matched to: <strong className="text-on-surface">Dining &amp; Social</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => showToast("Opening the Palmetto Table & Bar receipt scan.", "receipt_long")}
                      className="text-xs font-semibold text-primary hover:underline shrink-0"
                    >
                      View Scan
                    </button>
                  </div>
                </div>
              </div>

              {/* Merkle seal */}
              <div className="bg-surface-container-low p-4 sm:p-5 rounded-3xl shadow-sm border border-outline-variant/40 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="material-symbols-outlined text-primary text-[20px] shrink-0">enhanced_encryption</span>
                    <span className="font-label-caps text-[10px] uppercase font-bold text-primary tracking-wider truncate">Merkle Category Audit</span>
                  </div>
                  <span className="font-label-caps text-[10px] px-2 py-0.5 rounded bg-surface-container-lowest text-on-surface font-mono font-bold shrink-0">SHA-256</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-on-surface">Cryptographic Zero-Drift Seal</h3>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Category tree invariant: checksum valid across all 28 ledger receipts. Zero rounding distortion recorded.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={copyHash}
                  className="p-2 rounded-xl bg-surface-container-lowest font-mono text-[11px] text-on-surface-variant text-left hover:bg-surface-container transition-colors select-all"
                >
                  {HASH}
                </button>
                <button
                  type="button"
                  onClick={() => showToast("Exporting the Category CPA pack for May 2024…", "file_download")}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-2xl bg-surface-container-lowest text-on-surface hover:bg-surface-container hover:text-primary border border-outline-variant/40 text-xs font-bold shadow-sm transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">file_download</span>
                  Export Category CPA Pack
                </button>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {toast && (
        <div className="fixed bottom-6 right-6 z-[60] flex items-center gap-3 bg-inverse-surface text-inverse-on-surface px-4 py-2.5 rounded-2xl shadow-2xl max-w-[calc(100vw-3rem)]">
          <span className="material-symbols-outlined text-primary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>{toast.icon}</span>
          <span className="text-xs font-medium break-words">{toast.message}</span>
        </div>
      )}
    </AppLayout>
  );
}

function nearGuard(cat) {
  return cat.total / cat.cap >= 0.95;
}