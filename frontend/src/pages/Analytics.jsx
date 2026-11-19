import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import Breadcrumbs from "../components/layout/Breadcrumbs";
import { ANALYTICS_SCOPES } from "../constants/analyticsScopes";

const inr = (n) => `₹${Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
const inr0 = inr;

const KPIS = [
  {
    label: "Gross Outflow",
    value: inr(284566),
    chip: "+8.2% vs Mo",
    chipCls: "bg-surface-container-high text-secondary",
    icon: "payments",
    iconCls: "bg-secondary-fixed text-on-secondary-fixed-variant ring-1 ring-secondary-fixed-dim",
    blob: "bg-secondary-fixed/50",
    bar: "bg-secondary-container",
    note: "Total pooled spend across 4 active circles & 28 ledger items",
    footer: (
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2 text-[11px]">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Fronted by You</span>
          <span className="font-label-caps text-label-caps text-on-surface font-bold">62% ({inr(176431)})</span>
        </div>
        <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
          <div className="h-full bg-secondary-container rounded-full transition-all duration-700" style={{ width: "62%" }} />
        </div>
      </div>
    ),
  },
  {
    label: "Net Personal Share",
    value: inr(106273),
    chip: "Balanced",
    chipCls: "bg-surface-container text-on-primary-container",
    icon: "account_balance",
    iconCls: "bg-primary-fixed/60 text-on-primary-fixed-variant ring-1 ring-primary-fixed-dim",
    blob: "bg-matcha-100/60",
    bar: "bg-primary-container",
    note: "Your net consumption liability (37.3% of total pooled volume)",
    footer: (
      <div className="flex items-center justify-between gap-2">
        <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Velocity Cadence</span>
        <span className="font-label-caps text-label-caps text-primary font-bold bg-surface-container-lowest px-2.5 py-1 rounded-full">{inr(9485)} / day</span>
      </div>
    ),
  },
  {
    label: "Reimbursed Back",
    value: inr(136294),
    chip: "98.4% Rate",
    chipCls: "bg-secondary-fixed text-on-secondary-fixed-variant",
    icon: "price_check",
    iconCls: "bg-secondary-fixed text-on-secondary-fixed-variant ring-1 ring-secondary-fixed-dim",
    blob: "bg-lilac-100/70",
    bar: "bg-secondary",
    note: `Settled into primary bank · ${inr(41998)} pending float`,
    footer: (
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-on-surface-variant">2 Pending Payers</span>
        <span className="font-label-caps text-label-caps bg-surface-container-lowest text-secondary px-2.5 py-1 rounded-full shadow-sm">Awaiting</span>
      </div>
    ),
  },
  {
    label: "Netting Friction Saved",
    value: inr(26394),
    chip: "−18 Wires",
    chipCls: "bg-surface-container-high text-on-surface",
    icon: "hub",
    iconCls: "bg-peach-100 text-tertiary ring-1 ring-peach-200",
    blob: "bg-peach-100/70",
    bar: "bg-tertiary-container",
    note: "Saved in bank transfer overhead via automated bilateral netting loops",
    footer: (
      <div className="flex items-center justify-between gap-2">
        <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Zero-Hop Graph</span>
        <span className="font-label-caps text-label-caps text-on-tertiary-container font-bold bg-surface-container-lowest px-2 py-1 rounded-full shadow-sm">Cancelled 6 Multi-Hops</span>
      </div>
    ),
  },
];

const SCOPES = ANALYTICS_SCOPES;

const TIMEFRAMES = {
  weekly: {
    unit: "W",
    grid: [124500, 83000, 41500, 0],
    rows: [
      { label: "W01", date: "Oct 07", gross: 32, net: 12 },
      { label: "W02", date: "Oct 14", gross: 61, net: 23 },
      { label: "W03", date: "Oct 21", gross: 94, net: 32, peak: true },
      { label: "W04", date: "Oct 28", gross: 41, net: 19 },
    ],
  },
  daily: {
    unit: "D",
    grid: [18000, 12000, 6000, 0],
    rows: [
      { label: "MON", date: "Oct 21", gross: 44, net: 14 },
      { label: "TUE", date: "Oct 22", gross: 58, net: 21 },
      { label: "WED", date: "Oct 23", gross: 96, net: 36, peak: true },
      { label: "THU", date: "Oct 24", gross: 62, net: 22 },
      { label: "FRI", date: "Oct 25", gross: 78, net: 27 },
      { label: "SAT", date: "Oct 26", gross: 34, net: 11 },
      { label: "SUN", date: "Oct 27", gross: 26, net: 8 },
    ],
  },
  cumulative: {
    unit: "C",
    grid: [300000, 200000, 100000, 0],
    rows: [
      { label: "W01", date: "Oct 07", gross: 18, net: 8 },
      { label: "W02", date: "Oct 14", gross: 46, net: 21 },
      { label: "W03", date: "Oct 21", gross: 92, net: 40, peak: true },
      { label: "W04", date: "Oct 28", gross: 100, net: 55 },
    ],
  },
};

const RECONCILES = [
  {
    id: "settled",
    icon: "cabin",
    iconCls: "bg-surface-container text-primary",
    title: "Tahoe Cabin Deposit • Weekend 44",
    badge: "100% Settled",
    badgeCls: "bg-surface-container text-on-primary-container",
    meta: "Fronted by You · Split 8 ways equal · Your share: " + inr(7055),
    amount: inr(56440),
    status: `+${inr(49385)} Recovered`,
    statusCls: "text-primary",
    action: "View Matrix",
  },
  {
    id: "settled",
    icon: "bolt",
    iconCls: "bg-surface-container-high text-secondary",
    title: "Brooklyn Loft ConEd & High-Speed Fiber",
    badge: "OCR Verified",
    badgeCls: "bg-secondary-fixed text-on-secondary-fixed-variant",
    badgeIcon: "document_scanner",
    meta: "Paid by Marcus V. · Split 3 ways · Auto-cleared via netting",
    amount: inr(13695),
    status: `Your share: ${inr(4565)}`,
    statusCls: "text-on-surface-variant",
    tag: "Paid Auto",
  },
  {
    id: "fronted",
    icon: "shopping_cart",
    iconCls: "bg-surface-container-high text-tertiary",
    title: "Trader Joe's Pantry Stock",
    badge: "1 Pending Float",
    badgeCls: "bg-surface-container-highest text-tertiary",
    meta: "Fronted by You · Split 2 ways with Sarah Lin",
    amount: inr(9296),
    status: `Sarah owes ${inr(4648)}`,
    statusCls: "text-tertiary",
    action: "Send Ping",
    actionCls: "text-tertiary hover:bg-peach-100",
  },
  {
    id: "settled",
    icon: "local_gas_station",
    iconCls: "bg-surface-container-low text-on-surface",
    title: "Upstate Roadtrip Fuel & Tolls",
    badge: "Settled",
    badgeCls: "bg-surface-container text-on-primary-container",
    meta: "Paid by Jason Wu · Split 4 ways equal",
    amount: inr(7835),
    status: `Your share: ${inr(1959)}`,
    statusCls: "text-on-surface-variant",
    tag: "Reconciled",
    tagCls: "text-on-surface-variant",
  },
];

const RECON_FILTERS = [
  { id: "all", label: "All (4)" },
  { id: "fronted", label: "Unsettled" },
  { id: "settled", label: "Settled" },
];

const CATEGORIES = [
  { label: "Travel & Flights", value: 1440 * 83, pct: 42, color: "bg-secondary" },
  { label: "Lodging & Airbnbs", value: 960 * 83, pct: 28, color: "bg-primary-container" },
  { label: "Shared Groceries", value: 548.5 * 83, pct: 16, color: "bg-tertiary-container" },
  { label: "Dining & Nightlife", value: 342.8 * 83, pct: 10, color: "bg-secondary-container" },
  { label: "Utilities & WiFi", value: 137.2 * 83, pct: 4, color: "bg-outline-variant" },
];

const CIRCLES = [
  { emoji: "⛷️", iconCls: "bg-surface-container text-primary", name: "Tahoe Ski Weekend", meta: "8 members • 12 active tabs", value: 1840 * 83, status: "100% Reconciled", statusCls: "text-primary" },
  { emoji: "🏢", iconCls: "bg-surface-container-high text-secondary", name: "Brooklyn Loft #4B", meta: "3 members • Rolling tab", value: 1120 * 83, status: "Synced Yesterday", statusCls: "text-on-surface-variant" },
  { emoji: "🌵", iconCls: "bg-surface-container-highest text-tertiary", name: "Joshua Tree Trip", meta: "4 members • Closed pool", value: 468.5 * 83, status: "1 Due", statusCls: "text-tertiary" },
];

const DONUT_COLORS = ["#4648d4", "#10b981", "#ff7886", "#6063ee", "#bbcabf"];

const DONUT_CIRCUMFERENCE = 238.76;

const DONUT_ARCS = (() => {
  let offset = 0;
  return CATEGORIES.map((c, i) => {
    const len = (c.pct / 100) * DONUT_CIRCUMFERENCE;
    const arc = { label: c.label, color: DONUT_COLORS[i], len, offset };
    offset += len;
    return arc;
  });
})();

export default function Analytics() {
  const [scope, setScope] = useState("Overview");
  const [timeframe, setTimeframe] = useState("weekly");
  const [reconFilter, setReconFilter] = useState("all");
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const chart = TIMEFRAMES[timeframe];

  function showToast(message, icon = "check_circle") {
    setToast({ message, icon });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }

  function exportSnapshot() {
    showToast("Exporting the analytics snapshot as a signed PDF…", "file_download");
  }

  function simulateNetting() {
    showToast("Simulating the next netting window across 4 circles…", "schema");
  }

  return (
    <AppLayout>
      <main className="w-full min-h-screen overflow-x-clip">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumbs
            items={[
              { label: "Home", to: "/dashboard", icon: "home" },
              { label: "Analytics" },
            ]}
          />

          {/* Header card */}
          <div className="relative overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm shadow-zinc-900/5 border border-outline-variant/60 w-full px-4 py-4 sm:px-5 mb-5">
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center flex-wrap gap-1.5 mb-1.5">
                  <span className="px-2 py-0.5 rounded-full bg-primary-fixed/40 text-on-primary-fixed-variant font-label-caps text-label-caps uppercase flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" />
                    Financial Telemetry
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-caps text-label-caps font-semibold">Multi-Ledger Velocity</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-on-surface tracking-tight leading-tight">Analytics Overview &amp; Cash Flow Intelligence</h1>
                <p className="font-body-sm text-body-sm text-on-surface-variant max-w-2xl mt-1 leading-snug">
                  Real-time cross-group burn rates, multi-hop debt neutralization, and liquidity recovery metrics.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <span className="flex items-center gap-1.5 bg-surface-container-low border border-outline-variant/60 px-2.5 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                  <span className="font-label-caps text-label-caps text-on-surface font-bold">99.8% Invariance</span>
                </span>
                <span className="flex items-center gap-1.5 bg-surface-container-low border border-outline-variant/60 px-2.5 py-1 rounded-full">
                  <span className="material-symbols-outlined text-primary text-[14px]">verified</span>
                  <span className="font-label-caps text-label-caps text-on-surface-variant font-semibold">Zero Drift • SHA-256</span>
                </span>
              </div>
            </div>
          </div>

          {/* Scope toolbar */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-2.5 mb-5 p-1.5 bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-sm">
            <div className="flex items-center gap-1 overflow-x-auto min-w-0 py-0.5 px-0.5">
              {SCOPES.map((s) => {
                const active = scope === s.label;
                const cls = `px-3 py-1.5 rounded-full text-xs whitespace-nowrap shrink-0 transition-all ${
                  active ? "bg-primary-container text-on-primary-container font-semibold shadow-sm" : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-medium"
                }`;
                return s.to ? (
                  <Link key={s.label} to={s.to} className={cls}>
                    {s.label}
                  </Link>
                ) : (
                  <button key={s.label} type="button" onClick={() => setScope(s.label)} className={cls}>
                    {s.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-1.5 shrink-0 border-t xl:border-t-0 border-outline-variant/60 pt-2 xl:pt-0">
              <button
                type="button"
                onClick={exportSnapshot}
                className="flex-1 xl:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container text-xs font-semibold text-on-surface transition-colors whitespace-nowrap"
              >
                <span>Export</span>
                <span className="material-symbols-outlined text-[15px]">file_download</span>
              </button>
              <button
                type="button"
                onClick={() => showToast("Date horizon set to the past 30 days.", "calendar_today")}
                className="flex-1 xl:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-lowest border border-outline-variant/60 hover:bg-surface-container-low transition-colors whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-on-surface-variant text-[15px]">calendar_today</span>
                <span className="text-xs font-semibold text-on-surface">Past 30 Days</span>
                <span className="material-symbols-outlined text-on-surface-variant text-[15px]">expand_more</span>
              </button>
              <button
                type="button"
                onClick={exportSnapshot}
                className="flex-1 xl:flex-none flex items-center justify-center gap-1.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-semibold px-3 py-1.5 rounded-full transition-all active:scale-95 whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-[15px]">picture_as_pdf</span>
                <span>Export Snapshot</span>
              </button>
            </div>
          </div>

          {/* KPI cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3.5 mb-5">
            {KPIS.map((k) => (
              <div key={k.label} className="bg-surface-container-lowest rounded-3xl p-4 shadow-sm relative overflow-hidden flex flex-col justify-between border border-outline-variant/60">
                <div className={`absolute top-0 left-0 w-full h-1 ${k.bar}`} />
                <div className={`absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl pointer-events-none ${k.blob}`} />

                <div className="relative z-10 flex items-start justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${k.iconCls}`}>
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>{k.icon}</span>
                    </span>
                    <span className="font-label-caps text-[11px] text-on-surface-variant tracking-wider uppercase leading-tight">{k.label}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full font-label-caps text-[10px] shrink-0 ${k.chipCls}`}>{k.chip}</span>
                </div>
                <div className="relative z-10 text-2xl font-extrabold text-on-surface font-mono leading-tight">{k.value}</div>
                <p className="relative z-10 text-xs text-on-surface-variant mt-1 leading-snug">{k.note}</p>
                <div className="relative z-10 mt-3 pt-2.5 border-t border-outline-variant/60">{k.footer}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            {/* LEFT */}
            <div className="lg:col-span-8 min-w-0 flex flex-col gap-4">
              {/* Chart studio */}
              <div className="bg-surface-container-lowest rounded-3xl p-5 shadow-sm border border-outline-variant/60">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h2 className="text-base font-bold text-on-surface">Spending Trajectory &amp; Liquidity Velocity</h2>
                      <span className="material-symbols-outlined text-primary text-[18px]">insights</span>
                    </div>
                    <p className="text-xs text-on-surface-variant">Comparative burn of gross pooled payments versus your settled personal obligation</p>
                  </div>
                  <div className="inline-flex items-center p-1 bg-surface-container-low rounded-full self-start sm:self-auto shrink-0">
                    {Object.keys(TIMEFRAMES).map((key) => {
                      const active = timeframe === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setTimeframe(key)}
                          className={`px-3 py-1 rounded-full text-[11px] whitespace-nowrap transition-colors ${
                            active ? "bg-surface-container-lowest text-on-surface font-semibold shadow-sm" : "text-on-surface-variant hover:text-on-surface font-medium"
                          }`}
                        >
                          {key === "weekly" ? "Weekly" : key === "daily" ? "Daily" : "Cumulative"}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="relative w-full h-60 flex items-end justify-between gap-2 px-3 sm:px-5 bg-surface-container-low/40 rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-50">
                    {chart.grid.map((g) => (
                      <div key={g} className="w-full h-px bg-outline-variant/40 flex justify-end">
                        <span className="font-label-caps text-[10px] -mt-3 text-on-surface-variant bg-surface-container-low/80 px-1">{g === 0 ? inr0(0) : inr0(g)}</span>
                      </div>
                    ))}
                  </div>

                  {chart.rows.map((r) => (
                    <div key={r.label} className="relative z-10 flex flex-col items-center flex-1 min-w-0">
                      {r.peak && (
                        <div className="absolute -top-9 z-20 whitespace-nowrap bg-inverse-surface text-inverse-on-surface px-2.5 py-1 rounded-xl shadow-lg flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed shrink-0" />
                          <span className="font-label-caps text-[10px] font-bold">{inr0(56440)} Cabin + {inr0(19920)} Groceries</span>
                        </div>
                      )}
                      <div className="flex items-end gap-1 h-36 w-full justify-center">
                        <div className={`w-3 sm:w-4 rounded-t-lg transition-all duration-500 ${r.peak ? "bg-secondary-container" : "bg-surface-container-highest"}`} style={{ height: `${r.gross}%` }} />
                        <div className="w-3 sm:w-4 rounded-t-lg bg-primary-container transition-all duration-500" style={{ height: `${r.net}%` }} />
                      </div>
                      <span className={`font-label-caps text-[10px] mt-1.5 truncate w-full text-center ${r.peak ? "text-on-surface font-bold" : "text-on-surface-variant"}`}>
                        {r.label} • {r.date}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2.5">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-secondary-container" />
                      <span className="text-xs text-on-surface-variant font-medium">Gross Pooled Spend</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary-container" />
                      <span className="text-xs text-on-surface-variant font-medium">Personal Obligation</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-surface-container-highest" />
                      <span className="text-xs text-on-surface-variant font-medium">Fronted Float</span>
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-primary">
                    <span className="material-symbols-outlined text-[15px]">bolt</span>
                    <span className="font-label-caps text-[10px] font-bold">Velocity: 1.8 Days to Net Settlement</span>
                  </span>
                </div>

                <div className="w-full mt-2.5 p-2.5 bg-surface-container-low rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="material-symbols-outlined text-primary text-[17px] shrink-0">gavel</span>
                    <span className="text-xs text-on-surface truncate">Audited by Double-Entry Ledger Verification Engine v2.4</span>
                  </div>
                  <span className="font-label-caps text-[10px] text-on-surface-variant bg-surface-container-lowest px-2 py-0.5 rounded-md shrink-0">Block Height #482,901</span>
                </div>
              </div>

              {/* Reconciliations */}
              <div className="bg-surface-container-lowest rounded-3xl p-5 shadow-sm border border-outline-variant/60 flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="min-w-0">
                    <h2 className="text-base font-bold text-on-surface">High-Impact Multi-Circle Reconciliations</h2>
                    <p className="text-xs text-on-surface-variant">Cross-referenced ledger breakdown sorted by highest liquidity velocity</p>
                  </div>
                  <div className="inline-flex items-center p-1 bg-surface-container-low rounded-full self-start sm:self-auto shrink-0">
                    {RECON_FILTERS.map((f) => {
                      const active = reconFilter === f.id;
                      return (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setReconFilter(f.id)}
                          className={`px-3 py-1 rounded-full text-[11px] whitespace-nowrap transition-colors ${
                            active ? "bg-surface-container-lowest text-on-surface font-semibold shadow-sm" : "text-on-surface-variant hover:text-on-surface font-medium"
                          }`}
                        >
                          {f.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {RECONCILES.filter((r) => reconFilter === "all" || r.id === reconFilter).map((r) => (
                    <div key={r.title} className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 p-3 rounded-2xl bg-surface-container-low/50 hover:bg-surface-container-low transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${r.iconCls}`}>
                          <span className="material-symbols-outlined text-[19px]">{r.icon}</span>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-bold text-on-surface break-words">{r.title}</h4>
                            <span className={`px-2 py-0.5 rounded-full font-label-caps text-[10px] ${r.badgeCls} ${r.badgeIcon ? "flex items-center gap-1" : ""}`}>
                              {r.badgeIcon && <span className="material-symbols-outlined text-[12px]">{r.badgeIcon}</span>}
                              {r.badge}
                            </span>
                          </div>
                          <div className="text-xs text-on-surface-variant mt-0.5 break-words">{r.meta}</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
                        <div className="text-left md:text-right">
                          <div className="text-sm font-bold text-on-surface font-mono">{r.amount}</div>
                          <span className={`font-label-caps text-[10px] font-bold ${r.statusCls}`}>{r.status}</span>
                        </div>
                        {r.action ? (
                          <button
                            type="button"
                            onClick={() => showToast(r.action === "Send Ping" ? "Ping sent to Sarah Lin." : "Opening settlement matrix.", r.action === "Send Ping" ? "send" : "table_view")}
                            className={`bg-surface-container-lowest px-3 py-1.5 rounded-xl font-label-caps text-[10px] font-semibold shadow-sm transition-colors ${r.actionCls || "text-on-surface hover:bg-surface-container"}`}
                          >
                            {r.action}
                          </button>
                        ) : (
                          <span className={`bg-surface-container-lowest px-3 py-1.5 rounded-xl font-label-caps text-[10px] font-bold shadow-sm ${r.tagCls || "text-primary"}`}>{r.tag}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <aside className="lg:col-span-4 min-w-0 flex flex-col gap-4">
              {/* Category allocation */}
              <div className="bg-surface-container-lowest rounded-3xl p-5 shadow-sm border border-outline-variant/60 flex flex-col">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base font-bold text-on-surface">Category Allocation</h3>
                  <span className="font-label-caps text-[10px] text-on-surface-variant bg-surface-container-low px-2 py-1 rounded-full shrink-0">30-Day Quota</span>
                </div>
                <p className="text-xs text-on-surface-variant mb-3 mt-1">Granular category spread across your personal pool consumption.</p>

                <div className="relative w-40 h-40 mx-auto my-1 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100" role="img" aria-label="Category allocation donut chart">
                    <circle cx="50" cy="50" fill="transparent" r="38" stroke="#f2f3ff" strokeWidth="11" />
                    {DONUT_ARCS.map((a) => (
                      <circle
                        key={a.label}
                        cx="50"
                        cy="50"
                        fill="transparent"
                        r="38"
                        stroke={a.color}
                        strokeWidth="11"
                        strokeDasharray={`${a.len} ${DONUT_CIRCUMFERENCE}`}
                        strokeDashoffset={-a.offset}
                      />
                    ))}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                    <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">Allocated</span>
                    <span className="text-base font-bold text-on-surface font-mono">{inr0(284524)}</span>
                    <span className="font-label-caps text-[10px] text-primary font-semibold">100% Mapped</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 mt-2">
                  {CATEGORIES.map((c) => (
                    <div key={c.label} className="flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${c.color}`} />
                        <span className="text-on-surface font-medium truncate">{c.label}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-semibold text-on-surface font-mono">{inr0(c.value)}</span>
                        <span className="font-label-caps text-[10px] text-on-surface-variant w-7 text-right">{c.pct}%</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-3 p-2.5 bg-surface-container-high/60 rounded-xl flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="material-symbols-outlined text-secondary text-[16px] shrink-0">notifications_active</span>
                    <span className="text-xs text-on-surface truncate">Dining quota at <strong>94%</strong></span>
                  </div>
                  <button
                    type="button"
                    onClick={() => showToast("Dining cap opened for adjustment.", "tune")}
                    className="bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-caps text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-sm transition-colors shrink-0"
                  >
                    Adjust Cap
                  </button>
                </div>
              </div>

              {/* Top circles */}
              <div className="bg-surface-container-lowest rounded-3xl p-5 shadow-sm border border-outline-variant/60 flex flex-col">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base font-bold text-on-surface">Top Shared Circles</h3>
                  <span className="font-label-caps text-[10px] text-primary font-bold shrink-0">3 Active</span>
                </div>
                <p className="text-xs text-on-surface-variant mb-3 mt-1">Group hubs ranked by current monthly velocity</p>

                <div className="flex flex-col gap-2">
                  {CIRCLES.map((c) => (
                    <div key={c.name} className="p-3 rounded-2xl bg-surface-container-low/60 hover:bg-surface-container-low transition-colors flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-sm text-base ${c.iconCls}`}>{c.emoji}</div>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-on-surface truncate">{c.name}</div>
                          <div className="text-[11px] text-on-surface-variant truncate">{c.meta}</div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-sm font-bold text-on-surface font-mono">{inr0(c.value)}</div>
                        <span className={`font-label-caps text-[10px] font-bold ${c.statusCls}`}>{c.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>

          {/* Netting engine */}
          <section className="w-full mt-4 bg-surface-container-lowest rounded-3xl p-4 lg:p-5 shadow-sm border border-outline-variant/60 relative overflow-hidden">
            <div className="absolute -right-24 -top-24 w-72 h-72 rounded-full bg-primary-container/10 pointer-events-none blur-3xl" />
            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2.5 pb-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="bg-surface-container text-on-primary-container px-2 py-0.5 rounded-full font-label-caps text-[10px] font-bold">PROPRIETARY GRAPH RESOLVER</span>
                  <span className="font-label-caps text-[10px] text-on-surface-variant">Direct Bilateral Neutralization</span>
                </div>
                <h3 className="text-base font-bold text-on-surface">Autonomous Multi-Hop Netting Loop Engine</h3>
                <p className="text-xs text-on-surface-variant mt-0.5 max-w-2xl leading-snug">
                  Cyclic debts between shared friends cancel out automatically before reaching your bank ledger, eliminating unnecessary transaction friction and transfer limits.
                </p>
              </div>
              <button
                type="button"
                onClick={simulateNetting}
                className="bg-primary-container hover:bg-primary hover:text-on-primary text-on-primary-container text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-sm transition-all flex items-center gap-1.5 shrink-0"
              >
                <span className="material-symbols-outlined text-[15px]">schema</span>
                <span>Simulate Netting</span>
              </button>
            </div>

            <div className="relative z-10 w-full p-3 bg-surface-container-low/40 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-2.5">
              <div className="flex flex-col items-center text-center py-2.5 px-3 bg-surface-container-lowest rounded-2xl shadow-sm w-full md:w-48">
                <div className="w-9 h-9 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed-variant font-bold text-xs">A</div>
                <div className="text-[13px] font-bold text-on-surface mt-1">Alice Wong</div>
                <span className="font-label-caps text-[10px] text-on-surface-variant">Tahoe Circle</span>
                <div className="mt-0.5 text-primary text-xs font-bold font-mono">Owes You {inr(6972)}</div>
              </div>

              <div className="flex flex-col items-center text-secondary shrink-0">
                <span className="material-symbols-outlined text-[22px] rotate-90 md:rotate-0">sync_alt</span>
                <span className="font-label-caps text-[10px] font-bold">Offset</span>
              </div>

              <div className="flex flex-col items-center text-center py-3 px-3 bg-surface-container rounded-2xl shadow-md w-full md:w-52 border-2 border-primary-container/30 relative">
                <span className="absolute -top-2.5 bg-primary text-on-primary font-label-caps text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider font-bold">Your Account</span>
                <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-extrabold text-xs">You</div>
                <div className="text-[13px] font-bold text-on-surface mt-1">Liquid Node</div>
                <span className="font-label-caps text-[10px] text-on-surface-variant">All 4 Circles Active</span>
                <div className="mt-0.5 text-secondary text-xs font-bold font-mono">You Owe Bob {inr(6972)}</div>
              </div>

              <div className="flex flex-col items-center text-secondary shrink-0">
                <span className="material-symbols-outlined text-[22px] rotate-90 md:rotate-0">sync_alt</span>
                <span className="font-label-caps text-[10px] font-bold">Offset</span>
              </div>

              <div className="flex flex-col items-center text-center py-2.5 px-3 bg-surface-container-lowest rounded-2xl shadow-sm w-full md:w-48">
                <div className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface font-bold text-xs">B</div>
                <div className="text-[13px] font-bold text-on-surface mt-1">Bob Martinez</div>
                <span className="font-label-caps text-[10px] text-on-surface-variant">Brooklyn Loft</span>
                <div className="mt-0.5 text-on-tertiary-container text-xs font-bold font-mono">Owes Alice {inr(6972)}</div>
              </div>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mt-2.5">
              <span className="bg-surface-container-lowest border border-outline-variant/60 px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[14px]">verified_user</span>
                <span className="font-label-caps text-[10px] text-on-surface font-bold">3 Transactions Collapsed • 0 Bank Transfers Required</span>
              </span>
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="material-symbols-outlined text-[14px] text-primary shrink-0">lock</span>
                <code className="text-[11px] font-mono text-on-surface-variant truncate">Hash: e4b29f0c2a8d11ef84e27ab57492c10b</code>
                <span className="font-label-caps text-[10px] uppercase text-on-surface-variant shrink-0 hidden lg:inline">• Validated 0.04s</span>
              </div>
            </div>
          </section>
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