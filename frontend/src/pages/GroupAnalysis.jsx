import { useRef, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import Breadcrumbs from "../components/layout/Breadcrumbs";
import AnalyticsScopeBar from "../components/layout/AnalyticsScopeBar";

const inr = (n) => `₹${Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
const inr2 = (n) => `₹${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const KPIS = [
  {
    label: "Gross Managed Pool",
    icon: "account_balance",
    tile: "bg-secondary-fixed text-secondary",
    value: inr(475590),
    unit: "INR",
    sub: "Across 3 active circles & 17 participants",
  },
  {
    label: "True Personal Liability",
    icon: "shield_person",
    tile: "bg-primary-fixed text-primary",
    value: inr2(97151.5),
    unit: "20.4%",
    unitCls: "text-primary font-bold",
    sub: "Net personal burn across all active groups",
  },
  {
    label: "Temporary Peer Float",
    icon: "payments",
    tile: "bg-tertiary-fixed text-tertiary",
    value: inr(177620),
    unit: "Float",
    unitCls: "text-tertiary font-semibold",
    sub: `${inr2(141307.5)} reimbursed · ${inr2(36312.5)} pending float`,
  },
  {
    label: "Cross-Pod Netting",
    icon: "sync_alt",
    tile: "bg-primary-container/20 text-primary",
    value: "100%",
    unit: "INVARIANT",
    unitCls: "text-on-primary-fixed-variant font-bold bg-primary-fixed px-1.5 py-0.5 rounded",
    sub: "₹0.00 skew, 14 peer loops collapsed",
  },
];

const PODS = [
  {
    id: "tahoe",
    emoji: "❄️",
    tile: "bg-secondary-fixed",
    name: "Tahoe Ski Weekend",
    dot: "bg-primary-container",
    kind: "trips",
    meta: "8 members · March 2024 · Alpine Meadows",
    status: { label: "100% RECONCILED", icon: "check_circle", cls: "bg-primary-fixed text-on-primary-fixed" },
    stats: [
      { label: "Gross Pool", value: inr2(152720), cls: "text-on-surface" },
      { label: "Your Share", value: inr2(19090), cls: "text-on-surface" },
      { label: "Upfront Fronted", value: inr2(73870), cls: "text-secondary" },
      { label: "Recouped", value: `+${inr2(54780)}`, cls: "text-primary" },
    ],
    highlight: false,
    roster: ["AL", "KW", "SL", "+5"],
    rosterCls: ["bg-secondary-fixed text-secondary", "bg-primary-fixed text-primary", "bg-tertiary-fixed text-tertiary", "bg-surface-container-high text-on-surface-variant"],
    note: { icon: "verified", cls: "text-primary", text: "OCR Verified" },
    action: { label: "Expand Roster", icon: "group", cls: "bg-surface-container hover:bg-surface-container-high text-primary" },
  },
  {
    id: "brooklyn",
    emoji: "🏠",
    tile: "bg-primary-fixed/50",
    name: "Brooklyn Loft #4B",
    dot: "bg-tertiary-container",
    kind: "leases",
    meta: "4 roommates · Recurring lease · Next cycle: 6 days",
    status: { label: "94% SETTLED", icon: "sync", cls: "bg-surface-container-high text-primary" },
    stats: [
      { label: "Gross Total", value: inr2(269750), cls: "text-on-surface" },
      { label: "Your Share (1/4)", value: inr2(67437.5), cls: "text-on-surface" },
      { label: "Upfront Paid", value: inr2(103750), cls: "text-primary" },
      { label: "Owed to You", value: `+${inr2(36312.5)}`, cls: "text-tertiary" },
    ],
    highlight: true,
    roster: ["YO", "SL", "DK", "EM"],
    rosterCls: ["bg-primary-fixed text-primary", "bg-tertiary-fixed text-tertiary", "bg-secondary-fixed text-secondary", "bg-surface-container-high text-on-surface-variant"],
    note: { icon: "pending", cls: "text-tertiary", text: `Sarah owes ${inr2(36312.5)}` },
    action: { label: "Nudge Sarah", icon: "send", cls: "bg-tertiary hover:bg-on-tertiary-container text-white" },
  },
  {
    id: "joshua",
    emoji: "🌵",
    tile: "bg-tertiary-fixed",
    name: "Joshua Tree Reunion",
    dot: "bg-primary-container",
    kind: "trips",
    meta: "5 friends · Feb 2024 · Stargazing camp",
    status: { label: "100% SETTLED", icon: "inventory_2", cls: "bg-primary-fixed text-on-primary-fixed" },
    stats: [
      { label: "Spend Pool", value: inr2(53120), cls: "text-on-surface" },
      { label: "Your Share (1/5)", value: inr2(10624), cls: "text-on-surface" },
      { label: "Fronted Paid", value: inr2(10624), cls: "text-on-surface" },
      { label: "Status", value: "Paid in Full", cls: "text-primary" },
    ],
    highlight: false,
    roster: ["BM", "TN", "YOU", "+2"],
    rosterCls: ["bg-secondary-fixed text-secondary", "bg-primary-fixed text-primary", "bg-primary-container text-white", "bg-surface-container-high text-on-surface-variant"],
    note: { icon: "archive", cls: "text-on-surface-variant", text: "Ledger Archived" },
    action: { label: "Receipt Ledger", icon: "receipt_long", cls: "bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface" },
  },
];

const FILTERS = [
  { id: "all", label: "All (3)" },
  { id: "leases", label: "Leases" },
  { id: "trips", label: "Trips" },
  { id: "archived", label: "Archived" },
];

const BAR_GROUPS = [
  {
    label: "Lodging / Rent",
    bars: [
      { id: "tahoe", value: 81170 },
      { id: "brooklyn", value: 124500 },
      { id: "joshua", value: 23990 },
    ],
  },
  {
    label: "Food & Groceries",
    bars: [
      { id: "tahoe", value: 47980 },
      { id: "brooklyn", value: 57190 },
      { id: "joshua", value: 18430 },
    ],
  },
  {
    label: "Outings & Passes",
    bars: [
      { id: "tahoe", value: 29550 },
      { id: "brooklyn", value: 16600 },
      { id: "joshua", value: 12950 },
    ],
  },
];

const BAR_COLORS = {
  tahoe: "bg-secondary-container",
  brooklyn: "bg-primary-container",
  joshua: "bg-tertiary-container",
};

const BAR_FILLS = {
  tahoe: "#6063ee",
  brooklyn: "#10b981",
  joshua: "#ff7886",
};

const MAX_BAR_VALUE = 124500;
const MAX_BAR_HEIGHT = 135;
const BAR_BASELINE = 155;
const AXIS = [
  { y: 20, label: inr(207500) },
  { y: 65, label: inr(124500) },
  { y: 110, label: inr(41500) },
  { y: 155, label: inr(0) },
];

const PEERS = [
  {
    initials: "KW",
    tile: "bg-secondary-fixed text-secondary",
    name: "Kevin Wong",
    sub: `${inr(156870)} fronted across 2 pods`,
    chip: "TOP UPFRONT PAYER",
    chipCls: "bg-secondary-fixed-dim/40 text-on-secondary-fixed",
  },
  {
    initials: "SL",
    tile: "bg-primary-fixed text-primary",
    name: "Sarah Lin",
    sub: "14 min avg turnaround",
    chip: "LIGHTNING",
    chipCls: "bg-primary-fixed text-on-primary-fixed",
    icon: "bolt",
  },
  {
    initials: "MV",
    tile: "bg-tertiary-fixed text-tertiary",
    name: "Marcus Vance",
    sub: "100% on-time settlement rate",
    chip: "STEADY 100%",
    chipCls: "bg-surface-container-high text-on-surface",
  },
];

const RADAR_AXES = [
  { label: "UPFRONT LEAD", scores: { lodging: 0.88, food: 0.62, outings: 0.41 } },
  { label: "SPEED", scores: { lodging: 0.74, food: 0.91, outings: 0.66 } },
  { label: "RATIO", scores: { lodging: 0.95, food: 0.68, outings: 0.52 } },
  { label: "EQUAL RATIO", scores: { lodging: 0.81, food: 0.93, outings: 0.72 } },
  { label: "LIQUIDITY", scores: { lodging: 0.69, food: 0.85, outings: 0.44 } },
  { label: "CONSENSUS", scores: { lodging: 0.9, food: 0.79, outings: 0.61 } },
];

const RADAR_SERIES = [
  { id: "lodging", label: "Lodging", stroke: "#6063ee" },
  { id: "food", label: "Food & Groceries", stroke: "#10b981" },
  { id: "outings", label: "Outings & Passes", stroke: "#ff7886" },
];

const RADAR_CENTER = 100;
const RADAR_RADIUS = 70;

function radarPoint(index, value) {
  const angle = (Math.PI * 2 * index) / RADAR_AXES.length - Math.PI / 2;
  const x = RADAR_CENTER + Math.cos(angle) * RADAR_RADIUS * value;
  const y = RADAR_CENTER + Math.sin(angle) * RADAR_RADIUS * value;
  return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
}

function radarPolygon(values) {
  return values.map((v, i) => radarPoint(i, v).join(",")).join(" ");
}

export default function GroupAnalysis() {
  const [filter, setFilter] = useState("all");
  const [netting, setNetting] = useState("idle");
  const [hoverBar, setHoverBar] = useState(null);
  const [visibleSeries, setVisibleSeries] = useState(RADAR_SERIES.map((s) => s.id));
  const [hoverSeries, setHoverSeries] = useState(null);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  function showToast(message, icon = "check_circle") {
    setToast({ message, icon });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }

  function toggleSeries(id) {
    setVisibleSeries((prev) => {
      if (prev.includes(id)) return prev.length === 1 ? prev : prev.filter((x) => x !== id);
      return RADAR_SERIES.map((s) => s.id).filter((x) => x === id || prev.includes(x));
    });
  }

  const activeSeries = RADAR_SERIES.filter((s) => visibleSeries.includes(s.id));
  const parity = activeSeries.length
    ? (RADAR_AXES.reduce((sum, a) => sum + Math.max(...activeSeries.map((s) => a.scores[s.id])), 0) / RADAR_AXES.length) * 10
    : 0;
  const focusLabel = hoverSeries ? `${RADAR_SERIES.find((s) => s.id === hoverSeries).label} category focus` : "All categories · best-per-axis";

  const pods = PODS.filter((p) => (filter === "all" ? true : p.kind === filter));

  function runNetting() {
    if (netting === "running") return;
    setNetting("running");
    setTimeout(() => {
      setNetting("done");
      showToast("Netting pass complete · 14 loops collapsed · ₹0.00 skew.", "bolt");
    }, 1100);
  }

  return (
    <AppLayout>
      <main className="w-full min-h-screen overflow-x-clip">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumbs
            items={[
              { label: "Home", to: "/dashboard", icon: "home" },
              { label: "Analytics", to: "/analytics", icon: "insights" },
              { label: "Groups" },
            ]}
            status={{ label: "May 2024", note: "Live ledger netting active" }}
          />

          {/* Header card */}
          <div className="relative overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm shadow-zinc-900/5 border border-outline-variant/60 w-full px-4 py-4 sm:px-5 mb-4">
            <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 font-label-caps text-[10px] tracking-wider mb-1 flex-wrap">
                  <span className="text-primary font-bold uppercase bg-primary-fixed/60 px-2 py-0.5 rounded">Split-Rail Command &amp; Live Netting Studio</span>
                  <span className="text-on-surface-variant flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-container" />
                    Live Ledger Netting Active
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-on-surface tracking-tight leading-tight">Group-wise Analysis</h1>
                <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5 max-w-3xl">
                  Real-time cross-pod liquidity reconciliation, bilateral debt collapse invariance, and multi-cohort capital efficiency attribution.
                </p>
              </div>

              <div className="flex items-center gap-3 bg-surface-container-low border border-outline-variant/60 px-4 py-2 rounded-2xl shrink-0">
                <div className="flex -space-x-1.5">
                  {["❄️", "🏠", "🌵"].map((e) => (
                    <span key={e} className="w-6 h-6 rounded-full bg-surface-container-lowest flex items-center justify-center text-[11px] ring-2 ring-surface-container-lowest">
                      {e}
                    </span>
                  ))}
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-on-surface block leading-tight">3 Active Circles</span>
                  <span className="font-label-caps text-[10px] text-on-surface-variant">17 Participants Active</span>
                </div>
              </div>
            </div>

            {/* Scope row */}
            <AnalyticsScopeBar
              current="Groups"
              trailing={
                <button
                  type="button"
                  onClick={() => showToast("Preparing the May 2024 CPA binder…", "folder_zip")}
                  className="px-3 py-1.5 rounded-xl text-xs whitespace-nowrap text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-medium transition-colors shrink-0"
                >
                  Export &amp; Statements
                </button>
              }
            />
            </div>

          {/* KPI strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-4">
            {KPIS.map((k) => (
              <div key={k.label} className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/60 shadow-sm flex flex-col justify-between hover:border-outline transition-colors">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-label-caps text-[10px] uppercase text-on-surface-variant font-bold tracking-wider truncate">{k.label}</span>
                  <span className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${k.tile}`}>
                    <span className="material-symbols-outlined text-[16px]">{k.icon}</span>
                  </span>
                </div>
                <div className="mt-2">
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className={`text-2xl font-extrabold font-mono leading-tight ${k.unitCls ? "" : "text-on-surface"}`}>{k.value}</span>
                    <span className={`font-label-caps text-[10px] ${k.unitCls || "text-outline font-semibold"}`}>{k.unit}</span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-0.5">{k.sub}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            {/* LEFT */}
            <div className="lg:col-span-7 min-w-0 flex flex-col gap-4">
              {/* Allocation ledger */}
              <div className="bg-surface-container-lowest rounded-3xl p-4 sm:p-5 border border-outline-variant/60 shadow-sm flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-4 border-b border-surface-container">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary-container shrink-0" />
                      <h2 className="text-base font-bold text-on-surface tracking-tight">Cross-Pod Allocation Ledger</h2>
                    </div>
                    <p className="text-xs text-on-surface-variant">Live breakdown of individual liabilities, upfront float capital, and reconciliation integrity.</p>
                  </div>
                  <div className="flex items-center gap-1.5 bg-surface-container-low p-1 rounded-xl shrink-0 overflow-x-auto">
                    {FILTERS.map((f) => {
                      const isActive = filter === f.id;
                      return (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setFilter(f.id)}
                          className={`px-2.5 py-1 rounded-lg text-xs whitespace-nowrap transition-colors ${
                            isActive ? "bg-surface-container-lowest text-on-surface font-bold shadow-sm" : "text-on-surface-variant hover:text-on-surface font-medium"
                          }`}
                        >
                          {f.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {pods.map((p) => (
                    <div key={p.id} className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/60 hover:border-outline transition-colors flex flex-col gap-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className={`w-10 h-10 rounded-xl ${p.tile} text-lg flex items-center justify-center shrink-0 shadow-sm`}>{p.emoji}</span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <h3 className="text-sm font-bold text-on-surface truncate">{p.name}</h3>
                              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${p.dot}`} />
                            </div>
                            <p className="text-[11px] text-on-surface-variant font-medium truncate">{p.meta}</p>
                          </div>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full font-label-caps text-[10px] font-bold flex items-center gap-1 shrink-0 whitespace-nowrap ${p.status.cls}`}>
                          <span className="material-symbols-outlined text-[13px]">{p.status.icon}</span>
                          {p.status.label}
                        </span>
                      </div>

                      <div className={`grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-surface-container-lowest p-3 rounded-xl border ${p.highlight ? "border-tertiary-container/40" : "border-outline-variant/50"}`}>
                        {p.stats.map((s) => (
                          <div key={s.label} className={s.cls === "text-tertiary" ? "bg-peach-50 p-1.5 rounded-lg border border-peach-200" : ""}>
                            <span className={`font-label-caps text-[10px] uppercase font-semibold block ${s.cls === "text-tertiary" ? "text-on-tertiary-container font-bold" : "text-on-surface-variant"}`}>{s.label}</span>
                            <span className={`text-base font-bold font-mono ${s.cls}`}>{s.value}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="flex -space-x-2 shrink-0">
                            {p.roster.map((r, i) => (
                              <span key={r} className={`w-7 h-7 rounded-full ${p.rosterCls[i]} flex items-center justify-center font-bold text-[10px] ring-2 ring-surface-container-lowest`}>
                                {r}
                              </span>
                            ))}
                          </div>
                          <span className={`text-[11px] font-medium flex items-center gap-1 min-w-0 ${p.note.cls}`}>
                            <span className="material-symbols-outlined text-[13px] shrink-0">{p.note.icon}</span>
                            <span className="truncate">{p.note.text}</span>
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => showToast(`${p.action.label} · ${p.name}.`, p.action.icon)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors self-start sm:self-auto shrink-0 ${p.action.cls}`}
                        >
                          <span className="material-symbols-outlined text-[14px]">{p.action.icon}</span>
                          {p.action.label}
                        </button>
                      </div>
                    </div>
                  ))}

                  {pods.length === 0 && (
                    <div className="bg-surface-container-low rounded-2xl p-6 border border-dashed border-outline-variant flex flex-col items-center gap-1.5 text-center">
                      <span className="material-symbols-outlined text-[26px] text-outline">inventory_2</span>
                      <span className="text-xs font-semibold text-on-surface">No cohorts in this filter</span>
                      <span className="text-[11px] text-on-surface-variant">Archived cohorts are retained for 7 years in the audit vault.</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-surface-container flex items-center justify-between gap-2 text-xs">
                  <span className="text-on-surface-variant">Showing {pods.length} of 3 cross-pod cohorts</span>
                  <button
                    type="button"
                    onClick={() => showToast("Split engine configuration opened.", "tune")}
                    className="font-bold text-primary hover:text-on-surface transition-colors flex items-center gap-1 shrink-0"
                  >
                    Configure Split Engines
                    <span className="material-symbols-outlined text-[14px]">tune</span>
                  </button>
                </div>
              </div>

              {/* Dispersion chart */}
              <div className="bg-surface-container-lowest rounded-3xl p-4 sm:p-5 border border-outline-variant/60 shadow-sm flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-surface-container">
                  <div className="min-w-0">
                    <h2 className="text-base font-bold text-on-surface tracking-tight">Category Overlap Dispersion</h2>
                    <p className="text-xs text-on-surface-variant">Comparative share across Lodging, Food &amp; Drinks, and Outings/Activities.</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {Object.entries(BAR_COLORS).map(([id, cls]) => (
                      <span key={id} className="flex items-center gap-1.5 font-label-caps text-[11px] text-on-surface-variant">
                        <span className={`w-2.5 h-2.5 rounded ${cls}`} />
                        {PODS.find((p) => p.id === id).name.split(" ")[0]}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="py-2">
                  <svg className="w-full h-52" viewBox="0 0 600 190" role="img" aria-label="Category overlap dispersion bar chart">
                    {AXIS.map((t) => (
                      <line key={t.y} x1="45" x2="585" y1={t.y} y2={t.y} stroke="#eaedff" strokeWidth="1" />
                    ))}
                    {AXIS.map((t) => (
                      <text key={`l-${t.y}`} x="4" y={t.y + 4} fill="#6c7a71" fontFamily="Inter, sans-serif" fontSize="11">
                        {t.label}
                      </text>
                    ))}

                    {BAR_GROUPS.map((g, gi) =>
                      g.bars.map((b, bi) => {
                        const h = Math.max(Math.round((b.value / MAX_BAR_VALUE) * MAX_BAR_HEIGHT), 6);
                        const x = 90 + gi * 160 + bi * 36;
                        const key = `${g.label}-${b.id}`;
                        const isHover = hoverBar === key;
                        return (
                          <g key={key} onMouseEnter={() => setHoverBar(key)} onMouseLeave={() => setHoverBar(null)}>
                            <rect
                              x={x}
                              y={BAR_BASELINE - h}
                              width="30"
                              height={h}
                              rx="6"
                              fill={BAR_FILLS[b.id]}
                              className="transition-opacity"
                              opacity={hoverBar && !isHover ? 0.45 : 1}
                            />
                            {isHover && (
                              <text x={x + 15} y={BAR_BASELINE - h - 6} textAnchor="middle" fill="#131b2e" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="700">
                                {inr(b.value)}
                              </text>
                            )}
                            <title>{`${PODS.find((p) => p.id === b.id).name} · ${g.label}: ${inr(b.value)}`}</title>
                          </g>
                        );
                      }),
                    )}

                    {BAR_GROUPS.map((g, gi) => (
                      <text key={`x-${g.label}`} x={106 + gi * 160} y="178" textAnchor="middle" fill="#131b2e" fontFamily="Inter, sans-serif" fontSize="12" fontWeight="700">
                        {g.label}
                      </text>
                    ))}
                  </svg>
                </div>

                <div className="bg-surface-container-low p-3 rounded-2xl border border-outline-variant/50 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-8 h-8 rounded-xl bg-primary-fixed flex items-center justify-center text-primary shrink-0">
                      <span className="material-symbols-outlined text-[18px]">insights</span>
                    </span>
                    <p className="text-xs text-on-surface leading-snug">
                      <strong className="font-semibold">Macro Note:</strong> Brooklyn Loft fixed rent accounts for <strong>73.8%</strong> of ongoing overhead while Tahoe is <strong>47%</strong> leisure &amp; dining.
                    </p>
                  </div>
                  <span className="font-label-caps text-[10px] uppercase font-bold text-primary bg-primary-fixed/60 px-2.5 py-1 rounded-md shrink-0">Optimal Mix</span>
                </div>
              </div>

              {/* Netting terminal */}
              <div className="bg-surface-container-lowest rounded-3xl p-4 sm:p-5 border border-outline-variant/60 shadow-sm flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-surface-container">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary-container animate-ping shrink-0" />
                      <h2 className="text-base font-bold text-on-surface tracking-tight">Live Cross-Circle Netting Terminal</h2>
                    </div>
                    <p className="text-xs text-on-surface-variant">Autonomous bilateral cancellation graph collapsing multi-pod circular debts.</p>
                  </div>
                  <span className="font-label-caps text-[10px] text-on-primary-fixed font-bold bg-primary-fixed px-3 py-1 rounded-full shrink-0 self-start sm:self-auto">
                    0xNET INVARIANT RUNNING
                  </span>
                </div>

                <div className="rounded-2xl border border-outline-variant/60 bg-surface-container-low overflow-hidden">
                  <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-stretch divide-y sm:divide-y-0 sm:divide-x divide-outline-variant/60">
                    {/* Credit node */}
                    <div className="p-2.5 flex items-start gap-2.5 min-w-0">
                      <span className="w-8 h-8 rounded-lg bg-secondary-fixed text-secondary flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[17px]">call_received</span>
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-bold text-on-surface break-words">Tahoe</span>
                          <span className="font-label-caps text-[10px] bg-secondary-container text-white px-1.5 rounded font-bold shrink-0">CREDIT</span>
                        </div>
                        <span className="text-[11px] text-on-surface-variant block break-words leading-snug">Sarah owes you · cabin surcharge</span>
                      </div>
                      <span className="text-sm sm:text-base font-extrabold font-mono text-primary shrink-0 whitespace-nowrap">+{inr2(4648)}</span>
                    </div>

                    {/* Collapse spine */}
                    <div className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 bg-surface-container-lowest">
                      <span className="h-px w-3 bg-outline-variant shrink-0" />
                      <span className={`w-7 h-7 rounded-full bg-surface-container-low text-primary flex items-center justify-center shrink-0 ${netting === "running" ? "ring-2 ring-primary/25" : ""}`}>
                        <span className={`material-symbols-outlined text-[15px] ${netting === "running" ? "animate-spin" : ""}`}>{netting === "done" ? "task_alt" : "sync_alt"}</span>
                      </span>
                      <span className="font-label-caps text-[10px] font-bold text-primary whitespace-nowrap">
                        {netting === "done" ? "settled" : "offset"} · {inr(0)} skew
                      </span>
                      <span className="h-px w-3 bg-outline-variant shrink-0" />
                    </div>

                    {/* Debit node */}
                    <div className="p-2.5 flex items-start gap-2.5 min-w-0">
                      <span className="w-8 h-8 rounded-lg bg-peach-100 text-tertiary flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[17px]">call_made</span>
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-bold text-on-surface break-words">Brooklyn</span>
                          <span className="font-label-caps text-[10px] bg-tertiary text-white px-1.5 rounded font-bold shrink-0">DEBIT</span>
                        </div>
                        <span className="text-[11px] text-on-surface-variant block break-words leading-snug">You owe Sarah · router bill</span>
                      </div>
                      <span className="text-sm sm:text-base font-extrabold font-mono text-tertiary shrink-0 whitespace-nowrap">−{inr2(4648)}</span>
                    </div>
                  </div>

                  <div className="px-2.5 py-1.5 border-t border-outline-variant/60 bg-surface-container-lowest flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                    <span className="flex items-center gap-1.5 min-w-0 flex-wrap">
                      <span className="material-symbols-outlined text-[14px] text-primary shrink-0">lock_reset</span>
                      <code className="font-mono text-[10px] text-on-surface-variant break-all">0x7c91..b903</code>
                      <span className="font-label-caps text-[10px] font-bold text-on-surface-variant">· {inr2(9296)} → {inr(0)}</span>
                    </span>
                    <span className="font-label-caps text-[10px] font-bold bg-primary-fixed text-on-primary-fixed px-2 py-0.5 rounded shrink-0">14 loops · 0 wires</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={runNetting}
                  className="w-full bg-primary hover:bg-primary-container text-on-primary px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">bolt</span>
                  {netting === "running" ? "Running Netting Pass…" : netting === "done" ? "Run Netting Pass Again" : "Execute Autonomous Netting Pass"}
                </button>
              </div>
            </div>

            {/* RIGHT */}
            <aside className="lg:col-span-5 min-w-0 flex flex-col gap-4">
              {/* Equity radar */}
              <div className="bg-surface-container-lowest rounded-3xl p-4 sm:p-5 border border-outline-variant/60 shadow-sm flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-surface-container">
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-on-surface">Capital Equity Matrix</h3>
                    <p className="text-xs text-on-surface-variant">Multilateral fairness &amp; liquidity velocity parity</p>
                  </div>
                  <span className="w-8 h-8 rounded-xl bg-surface-container-low flex items-center justify-center text-outline shrink-0">
                    <span className="material-symbols-outlined text-[18px]">radar</span>
                  </span>
                </div>

                <div className="flex items-center justify-center py-1">
                  <svg className="w-full max-w-[268px]" viewBox="0 0 200 200" role="img" aria-label="Capital equity radar comparing category fairness">
                    {[0.25, 0.5, 0.75, 1].map((level) => (
                      <polygon
                        key={level}
                        points={radarPolygon(RADAR_AXES.map(() => level))}
                        fill={level === 1 ? "#faf8ff" : "none"}
                        stroke={level === 1 ? "#dae2fd" : "#eaedff"}
                        strokeWidth={level === 1 ? "1.4" : "1"}
                      />
                    ))}

                    {RADAR_AXES.map((a, i) => {
                      const [x, y] = radarPoint(i, 1);
                      return <line key={a.label} x1="100" y1="100" x2={x} y2={y} stroke="#dae2fd" strokeWidth="1" strokeDasharray="3 3" />;
                    })}

                    {activeSeries.map((s) => {
                      const dim = hoverSeries && hoverSeries !== s.id;
                      return (
                        <g
                          key={s.id}
                          opacity={dim ? 0.25 : 1}
                          onMouseEnter={() => setHoverSeries(s.id)}
                          onMouseLeave={() => setHoverSeries(null)}
                          className="cursor-pointer transition-opacity"
                        >
                          <polygon
                            points={radarPolygon(RADAR_AXES.map((a) => a.scores[s.id]))}
                            fill={s.stroke}
                            fillOpacity={hoverSeries === s.id ? 0.22 : 0.13}
                            stroke={s.stroke}
                            strokeWidth="2"
                            strokeLinejoin="round"
                          />
                          {RADAR_AXES.map((a) => {
                            const [cx, cy] = radarPoint(RADAR_AXES.indexOf(a), a.scores[s.id]);
                            return <circle key={a.label} cx={cx} cy={cy} r="2.4" fill="#ffffff" stroke={s.stroke} strokeWidth="1.7" />;
                          })}
                        </g>
                      );
                    })}

                    {RADAR_AXES.map((a, i) => {
                      const [x, y] = radarPoint(i, 1.2);
                      const cos = Math.cos((Math.PI * 2 * i) / RADAR_AXES.length - Math.PI / 2);
                      const anchor = Math.abs(cos) < 0.25 ? "middle" : cos > 0 ? "start" : "end";
                      return (
                        <text key={a.label} x={x} y={y + 2} textAnchor={anchor} fill="#3c4a42" fontFamily="Inter, sans-serif" fontSize="8" fontWeight="700">
                          {a.label}
                        </text>
                      );
                    })}

                    <circle cx="100" cy="100" r="1.8" fill="#6c7a71" />
                  </svg>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {RADAR_SERIES.map((s) => {
                    const on = visibleSeries.includes(s.id);
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => toggleSeries(s.id)}
                        aria-pressed={on}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold transition-colors ${
                          on ? "border-outline-variant/70 bg-surface-container-lowest text-on-surface" : "border-transparent bg-surface-container text-on-surface-variant"
                        }`}
                      >
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.stroke }} />
                        {s.label}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-3 border-t border-surface-container flex flex-col gap-2">
                  <div className="flex items-end justify-between gap-2">
                    <div>
                      <span className="font-label-caps text-[11px] text-on-surface-variant uppercase font-semibold">Parity Rating</span>
                      <div className="text-sm font-bold text-on-surface">Equity Fairness Index</div>
                    </div>
                    <div className="text-right shrink-0 leading-none">
                      <span className="text-2xl font-extrabold font-mono text-primary">{parity.toFixed(1)}</span>
                      <span className="text-xs text-outline font-semibold"> / 10.0</span>
                    </div>
                  </div>

                  <div className="h-1.5 w-full rounded-full bg-surface-container overflow-hidden">
                    <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${parity * 10}%` }} />
                  </div>

                  <div className="flex items-center justify-between gap-2 text-[11px]">
                    <span className="text-on-surface-variant truncate">{focusLabel}</span>
                    <span className="font-mono font-semibold text-on-surface shrink-0">{activeSeries.length}/3 categories</span>
                  </div>
                </div>
              </div>

              {/* Velocity */}
              <div className="bg-surface-container-lowest rounded-3xl p-4 sm:p-5 border border-outline-variant/60 shadow-sm flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-surface-container">
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-on-surface">Velocity &amp; Attribution</h3>
                    <p className="text-xs text-on-surface-variant">Top upfront lenders &amp; rapid responders</p>
                  </div>
                  <span className="font-label-caps text-[10px] bg-primary-fixed text-on-primary-fixed px-2 py-0.5 rounded font-bold shrink-0">PEER RANK</span>
                </div>

                <div className="flex flex-col divide-y divide-surface-container">
                  {PEERS.map((p) => (
                    <button
                      key={p.initials}
                      type="button"
                      onClick={() => showToast(`Opening ${p.name}'s attribution log.`, "person")}
                      className="py-3 flex items-center justify-between gap-2 text-left first:pt-1 last:pb-1"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`w-9 h-9 rounded-xl ${p.tile} flex items-center justify-center font-bold text-xs shadow-sm shrink-0`}>{p.initials}</span>
                        <div className="min-w-0">
                          <span className="text-sm font-bold text-on-surface block truncate">{p.name}</span>
                          <span className="text-[11px] text-on-surface-variant truncate block">{p.sub}</span>
                        </div>
                      </div>
                      <span className={`font-label-caps text-[10px] font-bold ${p.chipCls} px-2 py-1 rounded-md flex items-center gap-1 shrink-0 whitespace-nowrap`}>
                        {p.icon && <span className="material-symbols-outlined text-[12px]">{p.icon}</span>}
                        {p.chip}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Vault */}
              <div className="bg-surface-container-lowest rounded-3xl p-4 sm:p-5 border border-outline-variant/60 shadow-sm flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-10 h-10 rounded-2xl bg-primary-fixed/60 text-primary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[22px]">savings</span>
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-on-surface truncate">Shared Reserve Vault</h4>
                      <span className="font-label-caps text-[10px] text-on-surface-variant uppercase font-semibold">Idle Float Accumulator</span>
                    </div>
                  </div>
                  <span className="font-label-caps text-[11px] bg-primary-container text-white px-2.5 py-0.5 rounded-full font-bold shrink-0">APY 4.2%</span>
                </div>

                <div className="bg-surface-container-low p-4 rounded-2xl flex items-center justify-between gap-3 border border-outline-variant/50">
                  <div className="min-w-0">
                    <span className="text-[11px] text-on-surface-variant font-medium">Current Vault Balance</span>
                    <div className="text-xl font-extrabold font-mono text-on-surface">{inr2(117860)}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[11px] text-primary font-bold block">+{inr2(1230.06)} this month</span>
                    <span className="text-[10px] text-on-surface-variant">Shared pro-rata</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] text-outline font-medium">Automatic daily compounding</span>
                  <button
                    type="button"
                    onClick={() => showToast("Vault policy opened: 4.2% APY, daily compounding.", "policy")}
                    className="text-xs font-bold text-primary hover:underline shrink-0"
                  >
                    Vault Policy
                  </button>
                </div>
              </div>

              {/* Merkle */}
              <div className="bg-surface-container-lowest rounded-3xl p-4 sm:p-5 border border-outline-variant/60 shadow-sm flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-surface-container">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="material-symbols-outlined text-primary text-[20px] shrink-0">verified_user</span>
                    <h4 className="text-sm font-bold text-on-surface truncate">Merkle Cohort Audit</h4>
                  </div>
                  <span className="font-label-caps text-[10px] bg-primary-fixed text-on-primary-fixed px-2 py-0.5 rounded font-bold shrink-0">ZERO DRIFT</span>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/50">
                    <span className="font-label-caps text-[10px] text-on-surface-variant uppercase block">SHA-256 Ledger Root</span>
                    <span className="font-mono text-[11px] font-bold text-on-surface break-all">0x8f2a67e01b3d…c391bb740</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="text-on-surface-variant">Consensus Validation:</span>
                    <span className="font-semibold text-primary whitespace-nowrap">All 17 Nodes Signed</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="text-on-surface-variant">Last Cryptographic Proof:</span>
                    <span className="font-semibold text-on-surface whitespace-nowrap">Today, 14:02 UTC</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => showToast("Downloading the Cohort CPA binder…", "download")}
                  className="w-full mt-1 bg-surface-container-high hover:bg-surface-container text-on-surface font-bold text-xs py-2.5 rounded-xl border border-outline-variant/60 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px] text-primary">download</span>
                  Download Cohort CPA Binder
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