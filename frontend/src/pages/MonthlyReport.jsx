import { useRef, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import Breadcrumbs from "../components/layout/Breadcrumbs";
import AnalyticsScopeBar from "../components/layout/AnalyticsScopeBar";

const inr = (n) => `₹${Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
const inr2 = (n) => `₹${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const KPIS = [
  {
    label: "Gross Managed Flow",
    icon: "account_balance_wallet",
    iconCls: "text-secondary",
    value: inr(235720),
    sub: "38 total ledger transactions",
    footer: ["All transactions logged", "100%"],
    footerCls: "text-primary",
  },
  {
    label: "Net Personal Spend",
    icon: "person_check",
    iconCls: "text-primary",
    value: inr2(78559.5),
    valueCls: "text-primary",
    sub: `33.3% actual liability (${inr(2534)}/day)`,
    footer: ["October retention ratio", "1 : 3.0"],
    footerCls: "text-on-surface-variant",
  },
  {
    label: "Fronted Liquidity Float",
    icon: "payments",
    iconCls: "text-primary-container",
    value: inr2(157160.5),
    sub: "100% repaid • 0 days delinquent",
    subCls: "text-primary font-medium",
    footer: ["Reimbursement health", "Pristine"],
    footerCls: "text-primary",
    footerWrap: "bg-primary-fixed/15",
  },
  {
    label: "Debt Loops Neutralized",
    icon: "all_inclusive",
    iconCls: "text-secondary-container",
    value: "14 Loops",
    sub: `${inr(15272)} banking friction prevented`,
    footer: ["Transaction reduction", "−62%"],
    footerCls: "text-secondary",
  },
];

const RECEIPTS = [
  {
    id: "tj",
    label: "Trader Joe's (42% Share)",
    vendor: "Trader Joe's Grand Army #521",
    date: "Oct 22, 2024",
    ref: "TJ-90412",
    items: [
      { label: "Oat Milk, Organic Produce, Pantry Essentials", amount: 4498.6, note: "Shared 100%", private: false },
      { label: "Artisan Olive Oil & Sourdough Batch", amount: 2481.7, note: "Shared 100%", private: false },
      { label: "Personal Cold Brew & Specialty Snacks", amount: 1660, note: "Excluded / Private", private: true },
    ],
    gross: 8640.3,
    billed: 3488.49,
  },
  {
    id: "airbnb",
    label: "Airbnb Tahoe (100% Shared)",
    vendor: "Airbnb Chalet — South Lake Tahoe",
    date: "Oct 08, 2024",
    ref: "AB-77120",
    items: [
      { label: "3-Bedroom Chalet · 3 nights", amount: 54700, note: "Split 8 ways", private: false },
      { label: "Cleaning & Service Fee", amount: 11620, note: "Split 8 ways", private: false },
      { label: "Hot Tub Surcharge", amount: 7470, note: "Split 8 ways", private: false },
    ],
    gross: 73790,
    billed: 9223.75,
  },
  {
    id: "coned",
    label: "ConEd Energy (100% Shared)",
    vendor: "ConEd Energy Statement",
    date: "Oct 18, 2024",
    ref: "CE-33018",
    items: [
      { label: "Electricity · 612 kWh", amount: 6640, note: "Split 3 ways", private: false },
      { label: "Delivery & Grid Charges", amount: 2075, note: "Split 3 ways", private: false },
    ],
    gross: 8715,
    billed: 2905,
  },
];

const COHORTS = [
  { initials: "BL", cls: "bg-surface-container-high text-secondary", name: "Brooklyn Loft Base", meta: "3 roommates • Monthly lease & utilities", pooled: 120350, net: 30087.5 },
  { initials: "TS", cls: "bg-surface-container-high text-primary", name: "Tahoe Ski Odyssey", meta: "8 settlers • Accommodation & lift passes", pooled: 84660, net: 21165 },
  { initials: "JT", cls: "bg-surface-container-high text-secondary-container", name: "Joshua Tree Reunion", meta: "5 members • Vehicle convoy & park entry", pooled: 30710, net: 15355 },
];

const PEERS = [
  { initials: "SL", cls: "bg-primary-container text-on-primary", name: "Sarah Lin", sub: `${inr2(52385.45)} settled • 3 requests`, latency: "0.8h (Lightning)", icon: "flash_on", chipCls: "bg-primary-fixed/25 text-primary" },
  { initials: "MV", cls: "bg-secondary text-on-secondary", name: "Marcus Vance", sub: `${inr2(52385.45)} settled • 2 requests`, latency: "1.4h (Fast)", icon: "speed", chipCls: "bg-surface-container-high text-secondary" },
  { initials: "JW", cls: "bg-surface-container-highest text-on-surface", name: "Jason Wu", sub: `${inr2(52389.6)} settled • 4 requests`, latency: "2.1h (Standard)", icon: "schedule", chipCls: "bg-surface-container text-on-surface-variant" },
];

const SURGES = [
  { dot: "bg-secondary-container", label: "Oct 08: Tahoe Chalet", value: `${inr(73870)} float`, valueCls: "text-secondary" },
  { dot: "bg-primary-container", label: "Oct 22: Loft Pantry Restock", value: `${inr(9296)} spent`, valueCls: "text-primary" },
];

export default function MonthlyReport() {
  const [receipt, setReceipt] = useState("tj");
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const activeReceipt = RECEIPTS.find((r) => r.id === receipt) || RECEIPTS[0];

  function showToast(message, icon = "check_circle") {
    setToast({ message, icon });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }

  return (
    <AppLayout>
      <main className="w-full min-h-screen overflow-x-clip">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumbs
            items={[
              { label: "Home", to: "/dashboard", icon: "home" },
              { label: "Analytics", to: "/analytics", icon: "insights" },
              { label: "Monthly Report" },
            ]}
            status={{ label: "October 2024", note: "Net invariance ₹0.00 drift" }}
          />

          {/* Header card */}
          <div className="relative overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm shadow-zinc-900/5 border border-outline-variant/60 w-full px-4 py-4 sm:px-5 mb-4">
            <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 font-label-caps text-[10px] tracking-wider text-on-surface-variant mb-1 flex-wrap">
                  <span>Analytics</span>
                  <span className="text-outline">/</span>
                  <span>Monthly Report</span>
                  <span className="text-outline">/</span>
                  <span className="text-primary font-bold">October 2024</span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-container-high text-on-surface font-semibold font-label-caps text-[10px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    NODE #490-OCTOBER-LEDGER
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container-low text-primary font-semibold font-label-caps text-[10px]">
                    <span className="material-symbols-outlined text-[13px]">verified</span>
                    NET INVARIANCE: ₹0.00 DRIFT
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-on-surface tracking-tight leading-tight mt-1">October 2024 Liquidity &amp; Compliance Report</h1>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                {[
                  { icon: "folder_zip", label: "Generate CPA Binder", iconCls: "text-primary" },
                  { icon: "mail", label: "Email Summary", iconCls: "text-secondary" },
                  { icon: "history", label: "Compare with Sep 2024", iconCls: "" },
                ].map((a) => (
                  <button
                    key={a.label}
                    type="button"
                    onClick={() => showToast(`${a.label} queued for October 2024.`, a.icon)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-surface-container-low hover:bg-surface-container-high text-on-surface rounded-xl text-xs font-medium transition-colors whitespace-nowrap"
                  >
                    <span className={`material-symbols-outlined text-[15px] ${a.iconCls || "text-on-surface-variant"}`}>{a.icon}</span>
                    <span>{a.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <AnalyticsScopeBar
              current="Monthly Report"
              trailing={
                <>
                  <span className="w-px h-4 bg-outline-variant mx-1 shrink-0" />
                  <div className="flex items-center bg-surface-container-low rounded-xl px-1 py-0.5 shrink-0">
                    <button type="button" onClick={() => showToast("Moved to September 2024.", "chevron_left")} className="p-1 text-on-surface-variant hover:text-on-surface" aria-label="Previous month">
                      <span className="material-symbols-outlined text-[15px]">chevron_left</span>
                    </button>
                    <span className="text-xs font-semibold text-on-surface px-1.5 whitespace-nowrap">October 2024</span>
                    <button type="button" onClick={() => showToast("Moved to November 2024.", "chevron_right")} className="p-1 text-on-surface-variant hover:text-on-surface" aria-label="Next month">
                      <span className="material-symbols-outlined text-[15px]">chevron_right</span>
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => showToast("Comparison view opened for October vs September 2024.", "compare_arrows")}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-surface-container-low hover:bg-surface-container-high text-on-surface rounded-xl text-xs whitespace-nowrap transition-colors shrink-0"
                  >
                    <span className="material-symbols-outlined text-[15px]">compare_arrows</span>
                    <span>Compare</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast("Exporting the October 2024 statement…", "download")}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-primary hover:bg-primary-container text-on-primary rounded-xl text-xs font-semibold whitespace-nowrap transition-colors shrink-0"
                  >
                    <span className="material-symbols-outlined text-[15px]">download</span>
                    <span>Export</span>
                  </button>
                </>
              }
            />
          </div>

          {/* KPI strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-4">
            {KPIS.map((k) => (
              <div key={k.label} className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-outline-variant/60 flex flex-col justify-between">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider truncate">{k.label}</span>
                  <span className={`material-symbols-outlined text-[19px] shrink-0 ${k.iconCls}`}>{k.icon}</span>
                </div>
                <div className="mt-1.5">
                  <div className={`text-2xl font-extrabold font-mono leading-tight ${k.valueCls || "text-on-surface"}`}>{k.value}</div>
                  <p className={`text-xs mt-0.5 ${k.subCls || "text-on-surface-variant"}`}>{k.sub}</p>
                </div>
                <div className={`mt-3 pt-2 px-2 py-1 rounded flex items-center justify-between gap-2 font-label-caps text-[10px] ${k.footerWrap || "bg-surface-container-low"} ${k.footerCls}`}>
                  <span className="truncate">{k.footer[0]}</span>
                  <span className="font-bold shrink-0">{k.footer[1]}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            {/* LEFT */}
            <div className="lg:col-span-7 min-w-0 flex flex-col gap-4">
              {/* Chart */}
              <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-outline-variant/60 flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-on-surface">Outflow Dispersion &amp; Seasonal Surge Wave</h3>
                    <p className="text-xs text-on-surface-variant">Gross pooled outflow vs personal settled net across October 1–31</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 font-label-caps text-[10px]">
                    <span className="flex items-center gap-1.5 text-on-surface">
                      <span className="w-3 h-1.5 rounded-full bg-secondary-container" /> Gross Pooled
                    </span>
                    <span className="flex items-center gap-1.5 text-on-surface">
                      <span className="w-3 h-1.5 rounded-full bg-primary-container" /> Personal Net
                    </span>
                  </div>
                </div>

                <div className="bg-surface-container-low p-2.5 rounded-xl">
                  <svg className="w-full h-44" viewBox="0 0 700 220" role="img" aria-label="October outflow dispersion line chart">
                    {[40, 90, 140].map((y) => (
                      <line key={y} x1="0" x2="700" y1={y} y2={y} stroke="#dae2fd" strokeDasharray="4 4" strokeWidth="1" />
                    ))}
                    <line x1="0" x2="700" y1="190" y2="190" stroke="#dae2fd" strokeWidth="1" />

                    {[
                      { y: 38, label: inr(83000) },
                      { y: 88, label: inr(49800) },
                      { y: 138, label: inr(24900) },
                      { y: 185, label: inr(0) },
                    ].map((t) => (
                      <text key={t.y} x="5" y={t.y} fill="#6c7a71" fontFamily="Inter, sans-serif" fontSize="10">
                        {t.label}
                      </text>
                    ))}

                    <path
                      d="M 50 180 L 100 170 L 150 175 L 180 45 L 220 150 L 290 140 L 350 160 L 410 130 L 480 85 L 540 145 L 610 170 L 670 165 L 670 190 L 50 190 Z"
                      fill="#6063ee"
                      fillOpacity="0.08"
                    />
                    <path
                      d="M 50 180 L 100 170 L 150 175 L 180 45 L 220 150 L 290 140 L 350 160 L 410 130 L 480 85 L 540 145 L 610 170 L 670 165"
                      fill="none"
                      stroke="#6063ee"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                    />
                    <path
                      d="M 50 188 L 100 182 L 150 185 L 180 140 L 220 178 L 290 175 L 350 180 L 410 172 L 480 155 L 540 175 L 610 184 L 670 182"
                      fill="none"
                      stroke="#10b981"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                    />

                    <line x1="180" x2="180" y1="45" y2="190" stroke="#6063ee" strokeDasharray="2 2" strokeWidth="1" />
                    <circle cx="180" cy="45" r="4.5" fill="#ffffff" stroke="#6063ee" strokeWidth="3" />
                    <line x1="480" x2="480" y1="85" y2="190" stroke="#10b981" strokeDasharray="2 2" strokeWidth="1" />
                    <circle cx="480" cy="85" r="4.5" fill="#ffffff" stroke="#10b981" strokeWidth="3" />
                  </svg>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-1">
                    {SURGES.map((s) => (
                      <div key={s.label} className="bg-surface-container-lowest p-2 rounded-lg flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`w-2 h-2 rounded-full shrink-0 ${s.dot}`} />
                          <span className="text-xs font-semibold text-on-surface truncate">{s.label}</span>
                        </div>
                        <span className={`text-xs font-bold font-mono shrink-0 ${s.valueCls}`}>{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cohort ledger */}
              <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-outline-variant/60 flex flex-col gap-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-on-surface">Cohort Reconciliation Ledger</h3>
                    <p className="text-xs text-on-surface-variant">Active group circles audited &amp; closed for October 2024</p>
                  </div>
                  <span className="font-label-caps text-[10px] bg-primary-fixed/25 text-primary px-2.5 py-1 rounded-full font-bold shrink-0">3/3 CLOSED</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[540px]">
                    <thead>
                      <tr className="bg-surface-container-low text-on-surface-variant font-label-caps text-[10px] uppercase">
                        <th className="py-2 px-2.5 rounded-l-lg">Circle &amp; Members</th>
                        <th className="py-2 px-2.5">Pooled Spend</th>
                        <th className="py-2 px-2.5">Your Net Share</th>
                        <th className="py-2 px-2.5">Status</th>
                        <th className="py-2 px-2.5 rounded-r-lg text-right">Audit Trail</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container">
                      {COHORTS.map((c) => (
                        <tr key={c.name} className="hover:bg-surface-container-low/60 transition-colors">
                          <td className="py-2.5 px-2.5">
                            <div className="flex items-center gap-2.5">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[11px] shrink-0 ${c.cls}`}>{c.initials}</div>
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-on-surface truncate">{c.name}</div>
                                <div className="text-[11px] text-on-surface-variant truncate">{c.meta}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-2.5 px-2.5 font-mono font-semibold text-on-surface whitespace-nowrap">{inr2(c.pooled)}</td>
                          <td className="py-2.5 px-2.5 font-mono font-semibold text-primary whitespace-nowrap">{inr2(c.net)}</td>
                          <td className="py-2.5 px-2.5">
                            <span className="inline-flex items-center gap-1 font-label-caps text-[10px] bg-primary-fixed/25 text-primary px-2 py-0.5 rounded-full font-bold whitespace-nowrap">
                              <span className="material-symbols-outlined text-[11px]">check_circle</span>
                              RECONCILED 100%
                            </span>
                          </td>
                          <td className="py-2.5 px-2.5 text-right">
                            <button
                              type="button"
                              onClick={() => showToast(`${c.name}: OCR-verified receipt trail opened.`, "document_scanner")}
                              className="inline-flex items-center gap-1 font-label-caps text-[10px] bg-surface-container px-2 py-0.5 rounded text-on-surface-variant font-medium hover:bg-surface-container-high transition-colors"
                            >
                              <span className="material-symbols-outlined text-[12px]">document_scanner</span>
                              OCR VERIFIED
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Receipt deconstruction */}
              <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-outline-variant/60 flex flex-col gap-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-on-surface">Itemized Receipt Deconstruction</h3>
                    <p className="text-xs text-on-surface-variant">Granular split parsing verified via machine-vision OCR</p>
                  </div>
                  <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
                    {RECEIPTS.map((r) => {
                      const active = receipt === r.id;
                      return (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => setReceipt(r.id)}
                          className={`px-2.5 py-1 rounded-full font-label-caps text-[10px] whitespace-nowrap shrink-0 transition-colors ${
                            active ? "bg-primary-container text-on-primary-container font-semibold" : "bg-surface-container-low hover:bg-surface-container-high text-on-surface"
                          }`}
                        >
                          {r.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-surface-container-low p-3 rounded-xl flex flex-col md:flex-row gap-3 items-start">
                  <div className="flex-1 w-full min-w-0 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-sm font-bold text-on-surface break-words">{activeReceipt.vendor}</span>
                      <span className="font-label-caps text-[10px] bg-surface-container-high text-on-surface px-2 py-0.5 rounded shrink-0">{activeReceipt.date}</span>
                    </div>

                    <div className="flex flex-col gap-1">
                      {activeReceipt.items.map((it) => (
                        <div
                          key={it.label}
                          className={`flex items-center justify-between gap-2 py-1 px-2 rounded text-xs ${
                            it.private ? "bg-peach-50" : "bg-surface-container-lowest"
                          }`}
                        >
                          <span className={it.private ? "text-tertiary font-medium break-words" : "text-on-surface break-words"}>{it.label}</span>
                          <span className={`font-mono font-semibold shrink-0 whitespace-nowrap ${it.private ? "text-tertiary font-bold" : "text-on-surface"}`}>
                            {inr2(it.amount)}{" "}
                            <span className={`font-label-caps text-[10px] ${it.private ? "text-tertiary" : "text-primary"}`}>({it.note})</span>
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1.5 mt-1 border-t border-outline-variant/60 text-xs text-on-surface-variant flex-wrap">
                      <span>
                        Receipt gross total: <strong className="text-on-surface">{inr2(activeReceipt.gross)}</strong>
                      </span>
                      <span>
                        Your billed allocation: <strong className="text-primary font-bold">{inr2(activeReceipt.billed)}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="w-full md:w-40 bg-surface-container-lowest p-2 rounded-xl flex flex-col gap-1.5 items-center text-center shrink-0">
                    <div className="w-full h-20 rounded bg-surface-container flex flex-col items-center justify-center p-2 text-on-surface-variant">
                      <span className="material-symbols-outlined text-[26px] text-primary">receipt_long</span>
                      <span className="font-label-caps text-[10px] mt-0.5">RECEIPT #{activeReceipt.ref}</span>
                      <span className="text-[10px] text-on-surface-variant">OCR Confidence: 99.4%</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => showToast(`Opening the original ${activeReceipt.vendor} receipt image.`, "visibility")}
                      className="w-full py-1 text-primary hover:bg-surface-container-low rounded font-label-caps text-[10px] font-semibold flex items-center justify-center gap-1 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[13px]">visibility</span>
                      VIEW ORIGINAL
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <aside className="lg:col-span-5 min-w-0 flex flex-col gap-4">
              {/* Compliance terminal */}
              <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-outline-variant/60 flex flex-col gap-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="material-symbols-outlined text-primary text-[21px]">gavel</span>
                    <h3 className="text-base font-bold text-on-surface truncate">Safe Harbor Terminal</h3>
                  </div>
                  <span className="font-label-caps text-[10px] bg-primary-fixed/25 text-primary px-2 py-0.5 rounded font-bold shrink-0">COMPLIANT</span>
                </div>

                <div className="bg-surface-container-low p-3 rounded-xl flex flex-col gap-1.5">
                  <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">Statutory Qualification</span>
                  <p className="text-xs text-on-surface leading-relaxed">
                    Peer cost-equalization certified under <strong>Treas. Reg. § 1.6041-1(a)</strong>. Transfers represent 1:1 reimbursement of pooled living expenses with zero taxable income event.
                  </p>
                  <div className="grid grid-cols-2 gap-1.5 mt-1">
                    <div className="bg-surface-container-lowest p-2 rounded">
                      <div className="font-label-caps text-[10px] text-on-surface-variant">Gross Reimbursed</div>
                      <div className="text-sm font-bold text-on-surface font-mono">{inr2(157160.5)}</div>
                    </div>
                    <div className="bg-surface-container-lowest p-2 rounded">
                      <div className="font-label-caps text-[10px] text-on-surface-variant">Commercial Profit</div>
                      <div className="text-sm font-bold text-primary font-mono">{inr(0)}</div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => showToast("Preparing the 1099-K safe harbor pack for October 2024…", "file_download")}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 bg-primary hover:bg-primary-container text-on-primary rounded-xl text-xs font-semibold shadow-sm transition-colors"
                >
                  <span className="material-symbols-outlined text-[17px]">file_download</span>
                  <span>Download Safe Harbor 1099-K Pack</span>
                </button>
              </div>

              {/* Peer velocity */}
              <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-outline-variant/60 flex flex-col gap-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-on-surface">Peer Settlement Velocity</h3>
                    <p className="text-xs text-on-surface-variant">Reimbursement payback response latencies</p>
                  </div>
                  <span className="material-symbols-outlined text-secondary text-[19px] shrink-0">bolt</span>
                </div>

                <div className="flex flex-col gap-1.5">
                  {PEERS.map((p) => (
                    <button
                      key={p.initials}
                      type="button"
                      onClick={() => showToast(`Opening ${p.name}'s October settlement log.`, "person")}
                      className="flex items-center justify-between gap-2 p-2.5 bg-surface-container-low rounded-xl hover:bg-surface-container transition-colors text-left"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 ${p.cls}`}>{p.initials}</div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-on-surface truncate">{p.name}</div>
                          <div className="text-[11px] text-on-surface-variant truncate">{p.sub}</div>
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-1 font-label-caps text-[10px] px-2 py-0.5 rounded font-bold shrink-0 ${p.chipCls}`}>
                        <span className="material-symbols-outlined text-[11px]">{p.icon}</span>
                        <span className="whitespace-nowrap">{p.latency}</span>
                      </span>
                    </button>
                  ))}
                </div>

                <div className="p-2.5 bg-surface-container-low rounded-lg flex items-center justify-between gap-2 text-xs">
                  <span className="text-on-surface-variant">Average cohort turnaround</span>
                  <span className="font-bold text-primary font-mono text-sm">1.43 Hours</span>
                </div>
              </div>

              {/* Attestation seal */}
              <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-outline-variant/60 flex flex-col gap-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="material-symbols-outlined text-secondary text-[20px]">lock_reset</span>
                    <h3 className="text-base font-bold text-on-surface truncate">Merkle Attestation Seal</h3>
                  </div>
                  <span className="font-label-caps text-[10px] text-on-surface-variant font-mono shrink-0">OCT-24-FINAL</span>
                </div>

                <div className="bg-surface-container-low p-3 rounded-xl flex items-center gap-3">
                  <div className="w-16 h-16 bg-surface-container-lowest rounded-lg p-1.5 flex flex-wrap gap-0.5 shadow-sm shrink-0">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div key={i} className={`w-3.5 h-3.5 rounded-sm ${i % 3 === 2 ? "bg-surface-container" : "bg-on-surface"}`} />
                    ))}
                  </div>
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">SHA-256 Ledger Root</span>
                    <code className="text-[11px] text-on-surface bg-surface-container-lowest px-2 py-1 rounded truncate block">9e8b7c3d4a1f…82e44f60a</code>
                    <span className="text-xs text-primary flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      <span className="truncate">Immutable &amp; cryptographically sealed</span>
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => showToast("Downloading the cryptographic seal (.json).", "file_save")}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-surface-container-low hover:bg-surface-container-high text-on-surface rounded-xl text-xs font-medium transition-colors"
                >
                  <span className="material-symbols-outlined text-[15px] text-secondary">file_save</span>
                  <span>Download Cryptographic Seal (.json)</span>
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