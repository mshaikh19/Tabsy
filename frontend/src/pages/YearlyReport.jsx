import { useRef, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import Breadcrumbs from "../components/layout/Breadcrumbs";
import AnalyticsScopeBar from "../components/layout/AnalyticsScopeBar";

const inr = (n) => `₹${Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

const FLOW_TOTAL = 2890060;
const PERSONAL_SHARE = 950350;
const FRONTED_FLOAT = 1939710;

const PERSONAL_DEG = 0.329 * 360;
const SLICE_GAP = 1.6;

function polar(cx, cy, r, deg) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

function donutSlice(startDeg, endDeg, rOuter, rInner) {
  const large = endDeg - startDeg > 180 ? 1 : 0;
  const [x0o, y0o] = polar(80, 80, rOuter, startDeg);
  const [x1o, y1o] = polar(80, 80, rOuter, endDeg);
  const [x1i, y1i] = polar(80, 80, rInner, endDeg);
  const [x0i, y0i] = polar(80, 80, rInner, startDeg);
  return `M ${x0o} ${y0o} A ${rOuter} ${rOuter} 0 ${large} 1 ${x1o} ${y1o} L ${x1i} ${y1i} A ${rInner} ${rInner} 0 ${large} 0 ${x0i} ${y0i} Z`;
}

const PERSONAL_PATH = donutSlice(SLICE_GAP / 2, PERSONAL_DEG - SLICE_GAP / 2, 70, 46);
const FRONTED_PATH = donutSlice(PERSONAL_DEG + SLICE_GAP / 2, 360 - SLICE_GAP / 2, 70, 46);

const MONTHS = [
  { m: "JAN", gross: 315400, personal: 38, peak: { tag: "SKI", total: 315400 }, title: "January Spike: Aspen Mountain Ski Chalet", desc: "Lift tickets, chalet rental & gear pools • 8 settlers", share: 78020 },
  { m: "FEB", gross: 116200, personal: 18 },
  { m: "MAR", gross: 136950, personal: 22 },
  { m: "APR", gross: 157700, personal: 24 },
  { m: "MAY", gross: 240700, personal: 34, peak: { tag: "JT", total: 240700 }, title: "May Peak: Joshua Tree Revolv Retreat", desc: "Architectural desert dome & carpool split • 10 settlers", share: 58220 },
  { m: "JUN", gross: 174300, personal: 26 },
  { m: "JUL", gross: 224100, personal: 30 },
  { m: "AUG", gross: 381800, personal: 48, peak: { tag: "SPIKE", total: 381800 }, title: "August Spike: European Summer Odyssey", desc: "South of France + Lisbon • 14 ledger entries • 7 settlers", share: 78020 },
  { m: "SEP", gross: 149400, personal: 22 },
  { m: "OCT", gross: 232400, personal: 32, peak: { tag: "FALL", total: 232400 }, title: "October Retreat: Catskills Harvest Escape", desc: "Farmhouse provisions & woodfire sauna weekend • 6 settlers", share: 61170 },
  { m: "NOV", gross: 128650, personal: 20 },
  { m: "DEC", gross: 205840, personal: 28 },
];

const PEAK_MONTHS = ["JAN", "MAY", "AUG", "OCT"];

const CATEGORIES = [
  { icon: "cottage", iconCls: "bg-secondary-fixed text-secondary", label: "Lodging & Cabins", value: 1178600, pct: "40.7%", width: "40.7%", bar: "bg-secondary", note: "100% Settled", noteCls: "text-primary" },
  { icon: "shopping_basket", iconCls: "bg-primary-fixed text-primary", label: "Communal Groceries", value: 701350, pct: "24.2%", width: "24.2%", bar: "bg-primary-container", note: "Bi-weekly base", noteCls: "text-on-surface" },
  { icon: "restaurant", iconCls: "bg-tertiary-fixed text-tertiary", label: "Dining & Social", value: 574360, pct: "19.8%", width: "19.8%", bar: "bg-tertiary-container", note: "42 splits", noteCls: "text-on-surface" },
  { icon: "bolt", iconCls: "bg-surface-container-highest text-on-surface", label: "Utilities & Fiber", value: 435750, pct: "15.3%", width: "15.3%", bar: "bg-primary", note: "Autopay synced", noteCls: "text-primary" },
];

const CIRCLES = [
  { dot: "bg-secondary", name: "Tahoe Ski Weekend", total: 615860, pct: "100% Settled", pctCls: "bg-primary-fixed text-primary", status: "Archived", icon: "check_circle", statusCls: "text-primary" },
  { dot: "bg-primary", name: "Brooklyn Loft #4B", total: 1456650, pct: "98.2% Settled", pctCls: "bg-secondary-fixed text-secondary", status: "Active Hub", icon: "sync", statusCls: "text-on-surface-variant", iconCls: "text-secondary" },
  { dot: "bg-primary-container", name: "Joshua Tree Revolv", total: 240700, pct: "100% Settled", pctCls: "bg-primary-fixed text-primary", status: "Archived", icon: "check_circle", statusCls: "text-primary" },
  { dot: "bg-tertiary", name: "Europe Summer Odyssey", total: 381800, pct: "100% Settled", pctCls: "bg-primary-fixed text-primary", status: "Archived", icon: "check_circle", statusCls: "text-primary" },
];

const PEERS = [
  { initials: "SL", cls: "bg-primary-fixed text-primary", name: "Sarah Lin", rating: "A+", ratingCls: "bg-primary-fixed/60 text-on-primary-fixed-variant", value: 567720, rate: "99.8% On-Time" },
  { initials: "MV", cls: "bg-secondary-fixed text-secondary", name: "Marcus Vance", rating: "A+", ratingCls: "bg-secondary-fixed/70 text-on-secondary-fixed", value: 349430, rate: "100% Settled" },
  { initials: "JW", cls: "bg-tertiary-fixed text-tertiary", name: "Jason Wu", rating: "A", ratingCls: "bg-surface-container-high text-on-surface-variant", value: 257300, rate: "100% Settled" },
  { initials: "EG", cls: "bg-surface-container-highest text-on-surface", name: "Elena Gomez", rating: "A", ratingCls: "bg-surface-container-high text-on-surface-variant", value: 186750, rate: "99.2% Settled" },
];

export default function YearlyReport() {
  const [selected, setSelected] = useState("AUG");
  const [period, setPeriod] = useState("2024");
  const [hover, setHover] = useState(null);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const active = MONTHS.find((m) => m.m === selected) || MONTHS[7];

  function showToast(message, icon = "check_circle") {
    setToast({ message, icon });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }

  function pickMonth(month) {
    setSelected(month.m);
    if (!month.title) {
      showToast(`${month.m} 2024: ${inr(month.gross)} pooled across shared ledgers.`, "bar_chart");
    }
  }

  function pickPeriod(p) {
    setPeriod(p);
    showToast(p === "2024" ? "Full fiscal year 2024 loaded." : `${p} fiscal window loaded.`, "calendar_today");
  }

  return (
    <AppLayout>
      <main className="w-full min-h-screen overflow-x-clip">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumbs
            items={[
              { label: "Home", to: "/dashboard", icon: "home" },
              { label: "Analytics", to: "/analytics", icon: "insights" },
              { label: "Yearly Report" },
            ]}
          />

          {/* Header card */}
          <div className="relative overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm shadow-zinc-900/5 border border-outline-variant/60 w-full px-4 py-4 sm:px-5 mb-4">
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center flex-wrap gap-1.5 mb-1">
                  <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-caps text-label-caps font-bold uppercase">Tactile Neo-Bento Studio</span>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-caps text-label-caps font-semibold">FY 2024 · Jan 01 – Dec 31</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-on-surface tracking-tight leading-tight">Yearly Report &amp; Netting Archive</h1>
                <p className="font-body-sm text-body-sm text-on-surface-variant max-w-2xl mt-1 leading-snug">
                  Twelve months of pooled spend, personal absorption, and algorithmic loop neutralization across 14 ledgers.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="inline-flex items-center p-1 bg-surface-container-low rounded-2xl">
                  {["2024", "Q1–Q4", "Custom Fiscal"].map((p) => {
                    const isActive = period === p;
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => pickPeriod(p)}
                        className={`px-2.5 py-1.5 rounded-xl font-label-caps text-[10px] whitespace-nowrap transition-all ${
                          isActive ? "bg-surface-container-lowest text-on-surface font-bold shadow-sm" : "text-on-surface-variant hover:text-on-surface font-medium"
                        }`}
                      >
                        {p.toUpperCase()}
                      </button>
                    );
                  })}
                </div>
                <button
                  type="button"
                  onClick={() => showToast("Exporting the FY2024 summary statement…", "sim_card_download")}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-lowest border border-outline-variant/60 hover:bg-surface-container-low text-on-surface rounded-xl shadow-sm transition-colors text-xs font-semibold shrink-0"
                >
                  <span className="material-symbols-outlined text-[16px] text-primary">sim_card_download</span>
                  <span className="hidden sm:inline">Export Summary</span>
                </button>
              </div>
            </div>

            <AnalyticsScopeBar
              current="Yearly Report"
              trailing={
                <button
                  type="button"
                  onClick={() => showToast("Statement export opened for the selected fiscal window.", "file_download")}
                  className="px-3 py-1.5 rounded-xl text-xs whitespace-nowrap text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-medium transition-colors shrink-0"
                >
                  Export &amp; Statements
                </button>
              }
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            {/* COLUMN 1 */}
            <div className="lg:col-span-4 xl:col-span-3 min-w-0 flex flex-col gap-4">
              {/* Absorption dial */}
              <div className="bg-surface-container-lowest p-4 rounded-3xl shadow-sm border border-outline-variant/60 relative overflow-hidden">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-label-caps text-[11px] text-on-surface-variant uppercase tracking-wider font-bold">Annual Absorption Dial</span>
                  <div className="w-7 h-7 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary shrink-0">
                    <span className="material-symbols-outlined text-[15px]">donut_large</span>
                  </div>
                </div>

                <div className="relative w-full max-w-[220px] mx-auto aspect-square my-1.5">
                  <svg className="w-full h-full" viewBox="0 0 160 160" role="img" aria-label="Personal share 32.9 percent, fronted float 67.1 percent" focusable="false">
                    <circle cx="80" cy="80" r="58" fill="none" stroke="#eaedff" strokeWidth="24" />

                    <path
                      d={PERSONAL_PATH}
                      fill="#10b981"
                      className="transition-all duration-300"
                      opacity={hover === "fronted" ? 0.28 : 1}
                      stroke="#ffffff"
                      strokeWidth={hover === "personal" ? 0 : 1}
                    />
                    <path
                      d={FRONTED_PATH}
                      fill={hover === "fronted" ? "#4648d4" : "#6063ee"}
                      className="transition-all duration-300"
                      opacity={hover === "personal" ? 0.28 : 1}
                      stroke="#ffffff"
                      strokeWidth={hover === "fronted" ? 0 : 1}
                    />

                    <circle cx="80" cy="80" r="44" fill="#ffffff" />
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-7">
                    <span className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider leading-none">
                      {hover === "personal" ? "Personal Share" : hover === "fronted" ? "Fronted Float" : "Total Flow"}
                    </span>
                    <span className={`text-[13px] font-extrabold font-mono leading-tight mt-1 whitespace-nowrap ${hover === "fronted" ? "text-secondary" : "text-on-surface"}`}>
                      {hover === "personal" ? inr(PERSONAL_SHARE) : hover === "fronted" ? inr(FRONTED_FLOAT) : inr(FLOW_TOTAL)}
                    </span>
                    <span className="font-label-caps text-[9px] text-primary font-semibold leading-none mt-1">
                      {hover === "personal" ? "32.9% of flow" : hover === "fronted" ? "67.1% cleared" : "100% mapped"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 mt-2 pt-2.5 border-t border-outline-variant/60">
                  <button
                    type="button"
                    onMouseEnter={() => setHover("personal")}
                    onMouseLeave={() => setHover(null)}
                    onFocus={() => setHover("personal")}
                    onBlur={() => setHover(null)}
                    className={`p-2.5 rounded-2xl flex items-center justify-between gap-2 text-left transition-colors ${hover === "personal" ? "bg-surface-container" : "bg-surface-container-low hover:bg-surface-container"}`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary-container shrink-0" />
                      <span className="text-xs font-semibold text-on-surface truncate">Personal Share</span>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-label-caps text-[11px] font-bold text-on-surface">{inr(PERSONAL_SHARE)}</div>
                      <span className="font-label-caps text-[10px] text-on-surface-variant">32.9% Burn</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onMouseEnter={() => setHover("fronted")}
                    onMouseLeave={() => setHover(null)}
                    onFocus={() => setHover("fronted")}
                    onBlur={() => setHover(null)}
                    className={`p-2.5 rounded-2xl flex items-center justify-between gap-2 text-left transition-colors ${hover === "fronted" ? "bg-surface-container" : "bg-surface-container-low hover:bg-surface-container"}`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-secondary shrink-0" />
                      <span className="text-xs font-semibold text-on-surface truncate">Fronted Float</span>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-label-caps text-[11px] font-bold text-secondary">{inr(FRONTED_FLOAT)}</div>
                      <span className="font-label-caps text-[10px] text-on-surface-variant">67.1% Cleared</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Velocity */}
              <div className="bg-surface-container-lowest p-4 rounded-3xl shadow-sm border border-outline-variant/60">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-label-caps text-[11px] text-on-surface-variant uppercase tracking-wider font-bold">Reimbursement Velocity</span>
                  <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-primary font-label-caps text-[10px] font-bold shrink-0">TOP 2%</span>
                </div>
                <div className="flex items-baseline gap-1.5 mt-1.5">
                  <span className="text-2xl font-extrabold text-primary font-mono leading-none">1.6</span>
                  <span className="text-sm font-bold text-on-surface">days</span>
                </div>
                <p className="text-xs text-on-surface-variant mt-1 leading-snug">Average settlement payback latency across 28 peers in 2024.</p>
                <div className="mt-3 pt-2.5 bg-surface-container-low px-2.5 py-2 rounded-2xl flex items-center justify-between gap-2">
                  <span className="text-[11px] text-on-surface-variant flex items-center gap-1.5 min-w-0">
                    <span className="material-symbols-outlined text-[15px] text-primary shrink-0">speed</span>
                    <span className="truncate">Network Benchmark</span>
                  </span>
                  <span className="font-label-caps text-[10px] font-bold text-on-surface shrink-0">5.8d Avg</span>
                </div>
              </div>

              {/* Frictional savings */}
              <div className="bg-surface-container-lowest p-4 rounded-3xl shadow-sm border border-outline-variant/60">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-label-caps text-[11px] text-tertiary font-bold uppercase tracking-wider flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">bolt</span> Frictional Savings
                  </span>
                  <div className="w-7 h-7 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary shrink-0">
                    <span className="material-symbols-outlined text-[15px]">savings</span>
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-on-surface font-mono mt-1.5 leading-tight">{inr(40006)}</div>
                <p className="text-xs text-on-surface-variant mt-1 leading-snug">
                  Saved in wire fees and <strong className="text-on-surface font-semibold">184 circular loops</strong> automatically neutralized.
                </p>
                <div className="mt-3 p-2.5 bg-surface-container-low rounded-2xl flex items-center justify-between gap-2">
                  <span className="text-xs text-on-surface-variant truncate">Neutralized Ghost Capital</span>
                  <span className="font-label-caps text-[10px] font-bold text-tertiary shrink-0">{inr(283030)}</span>
                </div>
              </div>

              {/* Tax binder CTA */}
              <div className="bg-surface-container-lowest p-3.5 rounded-3xl shadow-sm border border-outline-variant/60">
                <button
                  type="button"
                  onClick={() => showToast("Preparing the FY2024 tax binder (CPA ready)…", "folder_zip")}
                  className="w-full py-2.5 px-3 bg-primary text-on-primary rounded-2xl text-xs font-bold shadow-sm hover:bg-primary-container transition-all flex items-center justify-center gap-1.5 group"
                >
                  <span className="material-symbols-outlined text-[17px] group-hover:-translate-y-0.5 transition-transform">folder_zip</span>
                  <span className="truncate">Export 2024 Tax Binder</span>
                </button>
                <p className="text-center font-label-caps text-[10px] text-on-surface-variant mt-1.5 leading-snug">Schedule 1, Form 1099-K &amp; stamped CSV</p>
              </div>
            </div>

            {/* COLUMN 2 */}
            <div className="lg:col-span-8 xl:col-span-6 min-w-0 flex flex-col gap-4">
              {/* Monthly cadence */}
              <div className="bg-surface-container-lowest rounded-3xl p-4 shadow-sm border border-outline-variant/60">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider">Annual Cadence Studio</span>
                    <h2 className="text-base font-bold text-on-surface">12-Month Burn &amp; Peak Indicator</h2>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="flex items-center gap-1.5 text-[11px] text-on-surface-variant px-2 py-0.5 bg-surface-container-low rounded-lg">
                      <span className="w-2 h-2 rounded-sm bg-secondary-fixed ring-1 ring-inset ring-secondary-fixed-dim" /> Fronted
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px] text-on-surface-variant px-2 py-0.5 bg-surface-container-low rounded-lg">
                      <span className="w-2 h-2 rounded-sm bg-primary-container ring-1 ring-inset ring-primary/30" /> Personal
                    </span>
                  </div>
                </div>

                {/* Bars with per-month peak badges */}
                <div className="pt-1">
                  <div className="flex items-end justify-between gap-1 px-0.5 border-b border-outline-variant pb-0">
                    {MONTHS.map((m) => {
                      const isActive = selected === m.m;
                      const grossH = Math.max(14, Math.round((m.gross / 381800) * 112));
                      const personalH = Math.max(8, Math.round(((m.gross * m.personal) / 100 / 381800) * 112));
                      return (
                        <button
                          key={m.m}
                          type="button"
                          onClick={() => pickMonth(m)}
                          aria-label={`${m.m} 2024 details`}
                          className="flex-1 flex flex-col items-center justify-end min-w-0 group"
                        >
                          <span className="h-9 flex flex-col items-center justify-end mb-1">
                            {m.peak && (
                              <span
                                className={`px-1 py-0.5 rounded-md text-center shadow-sm leading-tight transition-transform group-hover:scale-105 ${
                                  m.m === "AUG" ? "bg-tertiary-fixed text-on-tertiary-fixed-variant ring-1 ring-tertiary/20" : m.m === "JAN" || m.m === "OCT" ? "bg-secondary-fixed text-on-secondary-fixed" : "bg-primary-fixed text-on-primary-fixed-variant"
                                }`}
                              >
                                <span className="font-label-caps text-[8px] block font-bold">{m.peak.tag}</span>
                                <span className="text-[9px] font-bold block whitespace-nowrap">{inr(m.peak.total)}</span>
                              </span>
                            )}
                          </span>
                          <div className="flex items-end justify-center gap-[3px] w-full max-w-[34px]">
                            <div
                              className={`w-1/2 rounded-t-md ring-1 ring-inset transition-all ${
                                isActive ? "bg-secondary ring-secondary" : "bg-secondary-fixed ring-secondary-fixed-dim group-hover:bg-secondary-fixed-dim"
                              }`}
                              style={{ height: `${grossH}px` }}
                            />
                            <div
                              className={`w-1/2 rounded-t-md ring-1 ring-inset transition-all ${
                                isActive ? "bg-primary ring-primary" : "bg-primary-container ring-primary/30"
                              }`}
                              style={{ height: `${personalH}px` }}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Month axis */}
                  <div className="flex justify-between gap-1 px-0.5 mt-1.5">
                    {MONTHS.map((m) => {
                      const isActive = selected === m.m;
                      return (
                        <button
                          key={m.m}
                          type="button"
                          onClick={() => pickMonth(m)}
                          aria-label={`${m.m} 2024 details`}
                          className="flex-1 min-w-0 text-center"
                        >
                          <span className={`font-label-caps text-[10px] ${isActive || PEAK_MONTHS.includes(m.m) ? "text-on-surface font-bold" : "text-on-surface-variant"}`}>{m.m}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Detail panel */}
                <div className="mt-3 p-3 bg-surface-container-low rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-surface-container-lowest flex items-center justify-center text-primary shadow-sm shrink-0">
                      <span className="material-symbols-outlined text-[17px]">travel_explore</span>
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-on-surface break-words">
                        {active.title || `${active.m} 2024 Base Spend`}
                      </h4>
                      <p className="text-[11px] text-on-surface-variant break-words">
                        {active.desc || "Routine shared ledger reconciliation entries"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-left sm:text-right">
                      <div className="text-sm font-bold text-on-surface font-mono">{inr(active.gross)}</div>
                      <span className="text-[11px] text-primary font-semibold">{active.share ? `Your share: ${inr(active.share)}` : `Your share: ${inr(Math.round((active.gross * active.personal) / 100))}`}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => showToast(`Opening the ${active.m} 2024 breakdown.`, "table_view")}
                      className="px-2.5 py-1.5 rounded-xl bg-surface-container-lowest hover:bg-surface-container text-on-surface text-[11px] font-semibold transition-colors shadow-sm shrink-0"
                    >
                      Breakdown
                    </button>
                  </div>
                </div>
              </div>

              {/* Category spread */}
              <div className="bg-surface-container-lowest rounded-3xl p-4 shadow-sm border border-outline-variant/60">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="min-w-0">
                    <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider">Annual Category Spread</span>
                    <h3 className="text-base font-bold text-on-surface">Expenditure Matrix</h3>
                  </div>
                  <span className="text-xs text-on-surface-variant shrink-0">4 Core Pillars</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.label}
                      type="button"
                      onClick={() => showToast(`${c.label}: ${inr(c.value)} across 2024 (${c.pct} of volume).`, c.icon)}
                      className="p-3 bg-surface-container-low hover:bg-surface-container rounded-2xl transition-all text-left"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${c.iconCls}`}>
                            <span className="material-symbols-outlined text-[17px]">{c.icon}</span>
                          </div>
                          <span className="text-xs font-bold text-on-surface truncate">{c.label}</span>
                        </div>
                        <span className="text-xs font-bold text-on-surface font-mono shrink-0">{inr(c.value)}</span>
                      </div>
                      <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-2.5 overflow-hidden">
                        <div className={`h-full rounded-full ${c.bar}`} style={{ width: c.width }} />
                      </div>
                      <div className="flex justify-between items-center gap-2 mt-1.5 font-label-caps text-[10px] text-on-surface-variant">
                        <span className="truncate">{c.pct} total volume</span>
                        <span className={`font-semibold shrink-0 ${c.noteCls}`}>{c.note}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Circle efficiency table */}
              <div className="bg-surface-container-lowest rounded-3xl p-4 shadow-sm border border-outline-variant/60">
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="min-w-0">
                    <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider">Multi-Circle Settlement Archive</span>
                    <h3 className="text-base font-bold text-on-surface">Circle Efficiency Table</h3>
                  </div>
                  <span className="font-label-caps text-[10px] font-bold text-primary bg-primary-fixed px-2 py-0.5 rounded-full shrink-0">ALL RECONCILED</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[460px]">
                    <thead>
                      <tr className="border-b border-outline-variant/60 text-on-surface-variant font-label-caps text-[10px] uppercase">
                        <th className="pb-2 font-bold">Circle / Hub</th>
                        <th className="pb-2 font-bold text-right">Gross Total</th>
                        <th className="pb-2 font-bold text-center">Settlement</th>
                        <th className="pb-2 font-bold text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container">
                      {CIRCLES.map((c) => (
                        <tr key={c.name} className="hover:bg-surface-container-low/50 transition-colors">
                          <td className="py-2.5 font-semibold text-on-surface">
                            <span className="flex items-center gap-2 min-w-0">
                              <span className={`w-2 h-2 rounded-full shrink-0 ${c.dot}`} />
                              <span className="truncate">{c.name}</span>
                            </span>
                          </td>
                          <td className="py-2.5 text-right font-bold text-on-surface font-mono whitespace-nowrap">{inr(c.total)}</td>
                          <td className="py-2.5 text-center">
                            <span className={`px-2 py-0.5 rounded-full font-bold font-label-caps text-[10px] whitespace-nowrap ${c.pctCls}`}>{c.pct}</span>
                          </td>
                          <td className={`py-2.5 text-right font-semibold whitespace-nowrap ${c.statusCls}`}>
                            <span className="inline-flex items-center justify-end gap-1">
                              <span className={`material-symbols-outlined text-[15px] ${c.iconCls || ""}`}>{c.icon}</span>
                              {c.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* COLUMN 3 */}
            <div className="lg:col-span-12 xl:col-span-3 min-w-0 flex flex-col gap-4">
              {/* Peers */}
              <div className="bg-surface-container-lowest rounded-3xl p-4 shadow-sm border border-outline-variant/60">
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="min-w-0">
                    <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider">Bilateral Peers</span>
                    <h3 className="text-base font-bold text-on-surface">Top Financial Peers</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-low text-on-surface font-label-caps text-[10px] font-semibold shrink-0">28 Total</span>
                </div>

                <div className="flex flex-col gap-2">
                  {PEERS.map((p) => (
                    <button
                      key={p.initials}
                      type="button"
                      onClick={() => showToast(`Opening ${p.name}'s bilateral ledger (${inr(p.value)}).`, "person")}
                      className="p-2.5 bg-surface-container-low rounded-2xl hover:bg-surface-container transition-colors group text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-[11px] ${p.cls}`}>{p.initials}</div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="text-xs font-bold text-on-surface truncate">{p.name}</span>
                            <span className={`px-1 py-px rounded font-label-caps text-[9px] font-bold shrink-0 ${p.ratingCls}`}>{p.rating}</span>
                          </div>
                          <span className="font-label-caps text-[10px] text-on-surface-variant block">Bilateral ledger</span>
                        </div>
                        <span className="material-symbols-outlined text-[17px] text-outline group-hover:text-primary transition-colors shrink-0">chevron_right</span>
                      </div>

                      <div className="mt-2 pt-2 border-t border-outline-variant/60 flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-on-surface font-mono truncate">{inr(p.value)}</span>
                        <span className="px-1.5 py-0.5 rounded-full bg-surface-container-lowest font-label-caps text-[10px] font-bold text-primary shrink-0">{p.rate}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Merkle seal */}
              <div className="bg-surface-container-lowest rounded-3xl p-4 shadow-sm border border-outline-variant/60">
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="font-label-caps text-[10px] text-primary font-bold uppercase tracking-wider flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">lock</span> Merkle Ledger Seal
                  </span>
                  <span className="w-2 h-2 rounded-full bg-primary-container shrink-0" />
                </div>

                <div className="p-3.5 bg-surface-container-low rounded-2xl text-center">
                  <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary mx-auto mb-1.5 shadow-sm">
                    <span className="material-symbols-outlined text-[21px]">verified_user</span>
                  </div>
                  <span className="text-xs font-bold text-on-surface block">100% Zero-Drift Certified</span>
                  <p className="font-label-caps text-[10px] text-on-surface-variant font-mono mt-1 break-all">HASH: 0x9f8a32..c4180d</p>
                  <div className="mt-2.5 pt-2 border-t border-surface-container flex items-center justify-between gap-2 text-[11px]">
                    <span className="text-on-surface-variant">Double-entry proof</span>
                    <span className="font-bold text-primary">Balanced (Δ = 0)</span>
                  </div>
                </div>

                <p className="text-xs text-on-surface-variant leading-relaxed mt-2.5">
                  Cryptographically verified by decentralized peer consensus across all 14 group instances.
                </p>
              </div>

              {/* Actions */}
              <div className="bg-surface-container-lowest rounded-3xl p-4 shadow-sm border border-outline-variant/60 flex flex-col gap-2">
                <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider font-bold mb-0.5">Audit &amp; Social Actions</span>
                <button
                  type="button"
                  onClick={() => showToast("Downloading the FY2024 statement (CSV / PDF)…", "download")}
                  className="w-full py-2 px-2.5 bg-surface-container-low hover:bg-surface-container text-on-surface rounded-2xl text-xs font-semibold transition-colors flex items-center justify-between gap-2"
                >
                  <span className="flex items-center gap-1.5 min-w-0">
                    <span className="material-symbols-outlined text-[16px] text-primary shrink-0">download</span>
                    <span className="truncate">Download Statement</span>
                  </span>
                  <span className="material-symbols-outlined text-[15px] text-outline shrink-0">arrow_forward</span>
                </button>
                <button
                  type="button"
                  onClick={() => showToast("Year-end thank-you note queued for all 28 peers.", "favorite")}
                  className="w-full py-2 px-2.5 bg-surface-container-low hover:bg-surface-container text-on-surface rounded-2xl text-xs font-semibold transition-colors flex items-center justify-between gap-2"
                >
                  <span className="flex items-center gap-1.5 min-w-0">
                    <span className="material-symbols-outlined text-[16px] text-secondary shrink-0">favorite</span>
                    <span className="truncate">Send Year-End Thank You</span>
                  </span>
                  <span className="material-symbols-outlined text-[15px] text-outline shrink-0">arrow_forward</span>
                </button>
              </div>

              <div className="px-3 py-2 rounded-2xl bg-primary-fixed/50 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary shrink-0 animate-pulse" />
                <span className="text-[11px] text-on-primary-fixed-variant font-semibold break-words">Balanced to zero across 14 ledgers</span>
              </div>
            </div>
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