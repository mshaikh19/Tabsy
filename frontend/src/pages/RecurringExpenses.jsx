import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";

const inr = (n) => `₹${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const inr0 = (n) => `₹${Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

const INITIAL_CYCLES = [
  {
    id: "starlink",
    icon: "wifi_tethering",
    iconClass: "bg-primary-fixed text-primary",
    category: "Utilities 📡",
    catClass: "bg-primary-fixed/60 text-on-primary-fixed-variant",
    group: "Tahoe Ski Weekend ❄️",
    status: "auto",
    title: "Palisades Mountain High-Speed Starlink",
    amount: 9960,
    cadence: "Billed Monthly",
    payer: { initials: "AM", name: "Alex (You)", cls: "bg-primary text-on-primary" },
    split: "6-way (₹1,660.00 ea)",
    thirdLabel: "Automated Debits",
    thirdValue: "5 peers queued",
    thirdClass: "text-primary",
    channels: [
      { icon: "mark_chat_read", label: "WhatsApp", cls: "text-primary" },
      { icon: "notifications_active", label: "Push", cls: "text-secondary" },
    ],
    scope: "tahoe",
    paused: false,
  },
  {
    id: "groceries",
    icon: "local_grocery_store",
    iconClass: "bg-tertiary-fixed text-tertiary",
    category: "Groceries 🛒",
    catClass: "bg-tertiary-fixed/60 text-on-tertiary-fixed-variant",
    group: "Tahoe Ski Weekend ❄️",
    status: "ocr",
    title: "Whole Foods Bi-Weekly Cabin Essentials",
    amount: 23240,
    cadence: "Bi-Weekly (Tue)",
    payer: { initials: "SL", name: "Sarah Lin", cls: "bg-secondary text-on-secondary" },
    split: "Equal 5-way (₹4,648/ea)",
    thirdLabel: "Validation",
    thirdValue: "Receipt Match Ready",
    thirdClass: "text-primary",
    channels: [
      { icon: "mark_chat_read", label: "WhatsApp", cls: "text-primary" },
      { icon: "account_balance", label: "Auto-Ledger", cls: "text-secondary" },
    ],
    scope: "tahoe",
    paused: false,
  },
  {
    id: "coned",
    icon: "electric_bolt",
    iconClass: "bg-surface-container-highest text-secondary",
    category: "Utilities ⚡",
    catClass: "bg-surface-container-high text-on-surface-variant",
    group: "Brooklyn Loft 🏙️",
    status: "cap",
    title: "ConEd Power & Natural Gas Hub",
    amount: 13695,
    approx: true,
    cadence: "Monthly on 15th",
    payer: { initials: "MR", name: "Marco Rossi", cls: "bg-secondary-container text-on-secondary-container" },
    split: "3 roommates (₹4,565 avg)",
    thirdLabel: "Safety Guard",
    thirdValue: "Plaid Auto-Fetch",
    thirdClass: "text-secondary",
    channels: [
      { icon: "mark_chat_read", label: "WhatsApp", cls: "text-primary" },
      { icon: "shield", label: "Surge Protected", cls: "" },
    ],
    scope: "brooklyn",
    paused: false,
  },
  {
    id: "spotify",
    icon: "graphic_eq",
    iconClass: "bg-secondary-fixed text-secondary",
    category: "Entertainment 🎵",
    catClass: "bg-secondary-fixed-dim/40 text-on-secondary-fixed-variant",
    group: "Brooklyn Loft 🏙️",
    status: "instant",
    title: "Spotify & Entertainment Suite",
    amount: 1908,
    cadence: "Billed Monthly (10th)",
    payer: { initials: "JP", name: "Jason Powell", cls: "bg-outline text-surface-container-lowest" },
    split: "3 roommates (₹636 / person)",
    thirdLabel: "Zero-Balance Split",
    thirdValue: "Instant Auto-Credit",
    thirdClass: "text-primary",
    channels: [
      { icon: "mark_chat_read", label: "WhatsApp", cls: "text-primary" },
      { icon: "account_balance_wallet", label: "Apple Wallet", cls: "text-outline" },
    ],
    scope: "brooklyn",
    paused: false,
  },
  {
    id: "storage",
    icon: "downhill_skiing",
    iconClass: "bg-surface-container-high text-outline",
    category: "Storage 🎿",
    catClass: "bg-surface-container-high text-on-surface-variant",
    group: "Tahoe Ski Weekend ❄️",
    status: "paused",
    title: "Storage Unit 402 Gear Locker",
    amount: 7885,
    cadence: "Cadence Suspended",
    payer: { initials: "AM", name: "Alex Morgan", cls: "bg-primary text-on-primary" },
    split: "4-way (₹1,971.25 ea)",
    thirdLabel: "Status",
    thirdValue: "Resumes Nov 1",
    thirdClass: "text-outline",
    channels: [],
    scope: "tahoe",
    paused: true,
    nextCheck: "Next scheduled check: Nov 01, 2025",
  },
];

const BURDEN = [
  { name: "Alex Morgan (You)", pct: 23, amount: 35135, color: "#006c49" },
  { name: "Sarah Lin", pct: 30, amount: 45816, color: "#4648d4" },
  { name: "Marco Rossi", pct: 22, amount: 33594, color: "#ff7886" },
  { name: "Jason Powell", pct: 25, amount: 38175, color: "#6063ee" },
];

const BURDEN_CIRC = 2 * Math.PI * 14;

const RING_RADIUS = 26;
const RING_CIRC = 2 * Math.PI * RING_RADIUS;

const AUDIT_LOG = [
  { date: "Feb 15", name: "ConEd Power", amount: 13147, txn: "#0x92F4...E8A1", tag: "Verified Plaid" },
  { date: "Feb 10", name: "Spotify Hub", amount: 1908, txn: "#0x47B1...C902", tag: "Instant Credit" },
  { date: "Feb 01", name: "Starlink Wifi", amount: 9960, txn: "#0x13C8...7D43", tag: "Ledger Settled" },
];

const STATUS_STYLES = {
  auto: { label: "Auto-Publish", cls: "bg-primary text-on-primary", dot: true },
  ocr: { label: "Smart OCR Guard", cls: "bg-surface-container text-on-surface", icon: "document_scanner" },
  cap: { label: "Cap: ₹18,260.00", cls: "bg-secondary-fixed text-on-secondary-fixed-variant", icon: "security" },
  instant: { label: "Instant Split", cls: "bg-primary-fixed text-on-primary-fixed-variant" },
  paused: { label: "Paused for Spring", cls: "bg-tertiary-fixed text-on-tertiary-fixed-variant", icon: "pause_circle" },
};

function SectionHeader({ dotClass, label, meta }) {
  return (
    <div className="flex items-center justify-between gap-3 h-6">
      <div className="flex items-center gap-2 min-w-0">
        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${dotClass}`} />
        <span className="font-label-caps text-[11px] uppercase text-on-surface-variant font-bold tracking-wider leading-none whitespace-nowrap">{label}</span>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">{meta}</div>
    </div>
  );
}

export default function RecurringExpenses() {
  const [cycles, setCycles] = useState(INITIAL_CYCLES);
  const [filter, setFilter] = useState("all");
  const [running, setRunning] = useState(false);
  const [ranAll, setRanAll] = useState(false);
  const [flashId, setFlashId] = useState(null);
  const [toast, setToast] = useState(null);
  const [inspector, setInspector] = useState(null);
  const [surgePct, setSurgePct] = useState(15);
  const [freezeCap, setFreezeCap] = useState(20770);
  const [channels, setChannels] = useState({ whatsapp: true, wallet: true, slack: true });
  const toastTimer = useRef(null);

  function showToast(message) {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  }

  const activeCycles = useMemo(() => cycles.filter((c) => !c.paused), [cycles]);
  const monthlyOutlay = useMemo(() => cycles.reduce((s, c) => s + (c.paused ? 0 : c.amount), 0), [cycles]);
  const yourShare = Math.round(monthlyOutlay * 0.23);
  const armedCount = cycles.length;

  const filteredCycles = useMemo(() => {
    if (filter === "all") return cycles;
    if (filter === "vault") return cycles.filter((c) => c.id === "storage" || c.id === "spotify");
    return cycles.filter((c) => c.scope === filter);
  }, [cycles, filter]);

  function togglePause(id) {
    setCycles((prev) => prev.map((c) => (c.id === id ? { ...c, paused: !c.paused } : c)));
    const target = cycles.find((c) => c.id === id);
    showToast(target && !target.paused ? "Recurring cadence paused. Roommates notified." : "Recurring cadence resumed!");
  }

  function resumeCycle(id) {
    setCycles((prev) => prev.map((c) => (c.id === id ? { ...c, paused: false } : c)));
    showToast("Storage Unit 402 Cadence has been resumed!");
  }

  function simulateCard(id, title) {
    setFlashId(id);
    setTimeout(() => setFlashId(null), 900);
    showToast(`Simulated execution test for "${title}" — ledger balanced!`);
  }

  function simulateAll() {
    setRanAll(true);
    showToast("Simulating run on all active recurring streams…");
    setTimeout(() => setRanAll(false), 900);
  }

  function runBatch() {
    if (running) return;
    setRunning(true);
    setTimeout(() => {
      setRunning(false);
      showToast("All 8 automated recurring cadences executed & verified!");
    }, 1600);
  }

  const dialOffset = running ? 0 : 40;

  return (
    <AppLayout>
      <div className={`bg-surface font-body-md text-body-md text-on-surface antialiased ${flashId ? "" : ""}`}>
        <main className="w-full pt-4 pb-16 bg-surface min-h-screen">
          <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6 py-2">
            {/* Breadcrumbs & Studio Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-surface-container-high/40">
              <div className="flex flex-col gap-1 min-w-0">
                <nav className="flex items-center gap-2 text-xs text-on-surface-variant flex-wrap">
                  <Link className="hover:text-primary transition-colors flex items-center gap-1" to="/expenses">
                    <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                    <span>Expenses</span>
                  </Link>
                  <span className="material-symbols-outlined text-[13px] text-outline">chevron_right</span>
                  <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-semibold text-xs">Recurring Studio</span>
                  <span className="material-symbols-outlined text-[13px] text-outline">chevron_right</span>
                  <span className="text-on-surface font-semibold text-xs">Cycle Health Matrix</span>
                </nav>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <h1 className="font-headline-lg text-2xl lg:text-3xl text-on-surface font-extrabold tracking-tight">Recurring Expenses &amp; Automated Tabs</h1>
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed/80 border border-primary-fixed-dim/60 text-on-primary-fixed-variant font-label-caps text-[11px] uppercase">
                    <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                    Live Matrix Armed
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full lg:w-auto shrink-0">
                <button
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-surface-container-lowest border border-surface-container hover:bg-surface-container-high text-on-surface text-sm font-semibold shadow-sm transition-all active:scale-95"
                  type="button"
                  onClick={simulateAll}
                >
                  <span className="material-symbols-outlined text-secondary text-[18px]">network_ping</span>
                  <span>Simulate All {armedCount} Cycles</span>
                </button>
                <Link
                  to="/group-expenses/add"
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-primary text-on-primary text-sm font-bold shadow-md hover:brightness-105 active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-[20px]">add_circle</span>
                  <span>+ Create Recurring Cadence</span>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* COLUMN 1: Cadence Health */}
              <div className="lg:col-span-4 flex flex-col gap-5">
                <SectionHeader
                  dotClass="bg-primary"
                  label="01 / Cadence Health Hub"
                  meta={<span className="text-[11px] text-outline font-mono leading-none whitespace-nowrap">NODE #AP-SOUTH-AUTO</span>}
                />

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="p-4 rounded-3xl bg-primary-fixed/70 border border-primary-fixed-dim/60 shadow-sm flex flex-col justify-between min-h-[142px] transition-all hover:shadow-md hover:-translate-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-label-caps text-[10px] text-on-primary-fixed-variant uppercase tracking-wider font-bold">Monthly Outlay</span>
                      <div className="w-7 h-7 rounded-xl bg-surface-container-lowest/80 flex items-center justify-center text-primary shadow-sm">
                        <span className="material-symbols-outlined text-[17px]">account_balance_wallet</span>
                      </div>
                    </div>
                    <div>
                      <div className="font-numeric-balance-lg text-[22px] leading-tight text-on-primary-fixed font-black tracking-tight">{inr0(monthlyOutlay)}</div>
                      <div className="text-[11px] text-on-primary-fixed-variant mt-1 font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        Across {armedCount} active cycles
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-3xl bg-surface-container-high border border-surface-container-highest shadow-sm flex flex-col justify-between min-h-[142px] transition-all hover:shadow-md hover:-translate-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-label-caps text-[10px] text-secondary uppercase tracking-wider font-bold">Your Share</span>
                      <div className="w-7 h-7 rounded-xl bg-surface-container-lowest/90 flex items-center justify-center text-secondary shadow-sm">
                        <span className="material-symbols-outlined text-[17px]">person_check</span>
                      </div>
                    </div>
                    <div>
                      <div className="font-numeric-balance-lg text-[22px] leading-tight text-on-surface font-black tracking-tight">{inr0(yourShare)}</div>
                      <div className="text-[11px] text-on-surface-variant mt-1 font-medium flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px] text-primary">verified</span>
                        Auto-settled 23%
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-3xl bg-secondary-fixed/70 border border-secondary-fixed-dim/60 shadow-sm flex flex-col justify-between min-h-[142px] transition-all hover:shadow-md hover:-translate-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-label-caps text-[10px] text-on-secondary-fixed-variant uppercase tracking-wider font-bold">Next Auto-Run</span>
                      <div className="w-7 h-7 rounded-xl bg-surface-container-lowest/90 flex items-center justify-center text-secondary shadow-sm">
                        <span className="material-symbols-outlined text-[17px]">schedule</span>
                      </div>
                    </div>
                    <div>
                      <div className="font-title-md text-[18px] leading-tight text-on-secondary-fixed font-extrabold tracking-tight">In 3 Days</div>
                      <div className="text-[11px] text-on-secondary-fixed-variant mt-1 font-medium truncate">Mar 1 • Chalet Wifi</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-3xl bg-surface-container-lowest border border-surface-container shadow-sm flex flex-col justify-between min-h-[142px] transition-all hover:shadow-md hover:-translate-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-label-caps text-[10px] text-outline uppercase tracking-wider font-bold">Reliability</span>
                      <div className="relative flex items-center justify-center">
                        <span className="w-2.5 h-2.5 rounded-full bg-primary-container animate-ping absolute" />
                        <span className="w-2 h-2 rounded-full bg-primary-container relative" />
                      </div>
                    </div>
                    <div>
                      <div className="font-numeric-balance-lg text-[22px] leading-tight text-on-surface font-black">99.8%</div>
                      <div className="text-[11px] text-primary font-bold mt-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">shield_check</span>
                        Zero Failures (60d)
                      </div>
                    </div>
                  </div>
                </div>

                {/* One-Click Cycle Runner */}
                <div className="p-5 rounded-3xl bg-surface-container-lowest border border-surface-container shadow-sm flex flex-col gap-4 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-on-surface">One-Click Cycle Runner</h3>
                      <p className="text-xs text-on-surface-variant">Trigger and reconcile due ledger batches immediately</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-caps text-[10px]">{running ? "SYNCING" : "READY"}</span>
                  </div>
                  <div className="flex items-center gap-4 bg-surface-container-low p-3.5 rounded-2xl border border-surface-container-high/50">
                    <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
                      <svg className="w-16 h-16 transform -rotate-90">
                        <circle cx="32" cy="32" fill="transparent" r={RING_RADIUS} stroke="#eaedff" strokeWidth="5" />
                        <circle
                          className="transition-all duration-700"
                          cx="32"
                          cy="32"
                          fill="transparent"
                          r={RING_RADIUS}
                          stroke="#006c49"
                          strokeDasharray={RING_CIRC}
                          strokeDashoffset={dialOffset}
                          strokeLinecap="round"
                          strokeWidth="5"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="font-numeric-balance-md text-xs font-bold text-on-surface">{running ? "…" : "8/8"}</span>
                        <span className="text-[9px] text-outline font-medium leading-none">ARMED</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                      <div className="flex items-center justify-between text-xs text-on-surface-variant font-medium">
                        <span>Batch #2025-03-A</span>
                        <span className={`font-bold ${running ? "text-secondary animate-pulse" : "text-primary"}`}>{running ? "Syncing…" : "Idle"}</span>
                      </div>
                      <button
                        className="w-full py-2.5 px-3.5 rounded-xl bg-primary hover:bg-surface-tint active:scale-[0.98] text-on-primary text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 disabled:opacity-60"
                        type="button"
                        onClick={runBatch}
                        disabled={running}
                      >
                        <span className={`material-symbols-outlined text-[17px] ${running ? "animate-spin" : ""}`}>{running ? "sync" : "play_circle"}</span>
                        <span>{running ? "Reconciling Batches…" : "Run Cadence Batch Now"}</span>
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-outline pt-1 border-t border-surface-container">
                    <span>Next cron: Mar 01, 00:00 UTC</span>
                    <button className="text-secondary font-semibold hover:underline" type="button" onClick={() => showToast("Cron: 0 0 1 * * (1st of every month, 00:00 UTC)")}>
                      Inspect Cron Schedule
                    </button>
                  </div>
                </div>

                {/* Quick Scope Filter */}
                <div className="p-4 rounded-3xl bg-surface-container-low border border-surface-container-high/40 shadow-sm flex flex-col gap-2.5">
                  <span className="font-label-caps text-[10px] text-outline uppercase tracking-wider font-bold">Quick Scope Filter</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: "all", label: `All (${cycles.length})` },
                      { id: "tahoe", label: "Tahoe Ski Weekend ❄️ (3)" },
                      { id: "brooklyn", label: "Brooklyn Loft 🏙️ (2)" },
                      { id: "vault", label: "Personal Vault 🔒 (2)" },
                    ].map((f) => {
                      const active = filter === f.id;
                      return (
                        <button
                          key={f.id}
                          className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                            active ? "font-bold bg-on-surface text-surface shadow-sm" : "font-semibold bg-surface-container-lowest text-on-surface-variant hover:text-on-surface border border-surface-container"
                          }`}
                          type="button"
                          onClick={() => setFilter(f.id)}
                        >
                          {f.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Member Burden Distribution */}
                <div className="p-5 rounded-3xl bg-surface-container-lowest border border-surface-container shadow-sm flex flex-col gap-3.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider">Member Burden Distribution</h4>
                      <p className="text-[11px] text-on-surface-variant">Automated split weights across active tabs</p>
                    </div>
                    <span className="text-xs font-bold text-primary font-mono">{inr0(monthlyOutlay)}/mo</span>
                  </div>
                  <div className="flex items-center gap-4 py-1">
                    <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center">
                      <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" fill="none" r="14" stroke="#e1e0ff" strokeWidth="4.5" />
                        {BURDEN.map((b, i) => {
                          const before = BURDEN.slice(0, i).reduce((s, x) => s + x.pct, 0);
                          return (
                            <circle
                              key={b.name}
                              cx="18"
                              cy="18"
                              fill="none"
                              r="14"
                              stroke={b.color}
                              strokeDasharray={`${((b.pct / 100) * BURDEN_CIRC).toFixed(2)} ${BURDEN_CIRC.toFixed(2)}`}
                              strokeDashoffset={((before / 100) * BURDEN_CIRC * -1).toFixed(2)}
                              strokeWidth="4.5"
                            />
                          );
                        })}
                      </svg>
                      <div className="absolute text-[10px] font-bold text-on-surface font-mono">4 Peers</div>
                    </div>
                    <div className="flex flex-col gap-1.5 flex-1 text-xs min-w-0">
                      {BURDEN.map((b) => (
                        <div key={b.name} className="flex items-center justify-between gap-2">
                          <span className="flex items-center gap-1.5 text-on-surface font-medium truncate">
                            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: b.color }} />
                            <span className="truncate">{b.name}</span>
                          </span>
                          <span className="font-bold text-on-surface font-mono shrink-0">{inr0(b.amount)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="w-full bg-surface-container-low rounded-full h-1.5 overflow-hidden flex">
                    {BURDEN.map((b) => (
                      <div key={b.name} style={{ width: `${b.pct}%`, backgroundColor: b.color }} className="h-full" />
                    ))}
                  </div>
                </div>
              </div>

              {/* COLUMN 2: Schedule Stream */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <SectionHeader
                  dotClass="bg-secondary"
                  label="02 / Schedule Stream"
                  meta={
                    <>
                      <span className="text-[11px] text-outline font-mono leading-none whitespace-nowrap">{activeCycles.length} active recurring pipelines</span>
                      <button className="p-1 rounded-full text-outline hover:text-on-surface hover:bg-surface-container transition-colors" title="Reload schedule feed" type="button" onClick={() => showToast("Schedule feed reloaded")}>
                        <span className="material-symbols-outlined text-[16px]">sync</span>
                      </button>
                    </>
                  }
                />

                {filteredCycles.map((c) => {
                  const st = STATUS_STYLES[c.status];
                  const isPaused = c.paused;
                  return (
                    <div
                      key={c.id}
                      className={`p-5 rounded-3xl border shadow-sm hover:shadow-md transition-all flex flex-col gap-3.5 relative overflow-hidden ${
                        isPaused ? "bg-surface-container-low/70 border-surface-container-high/60 opacity-90 hover:opacity-100" : "bg-surface-container-lowest border-surface-container"
                      } ${flashId === c.id || ranAll ? "ring-2 ring-primary-container" : ""}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${c.iconClass}`}>
                            <span className="material-symbols-outlined text-[24px]">{(c.icon)}</span>
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={`px-2 py-0.5 rounded-full font-label-caps text-[10px] uppercase ${c.catClass}`}>{c.category}</span>
                              <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-caps text-[10px]">{c.group}</span>
                              {isPaused ? (
                                <span className={`px-2 py-0.5 rounded-full font-label-caps text-[10px] flex items-center gap-1 ${st.cls}`}>
                                  <span className="material-symbols-outlined text-[11px]">{st.icon}</span>
                                  {st.label}
                                </span>
                              ) : c.status === "auto" ? (
                                <span className={`px-2 py-0.5 rounded-full font-label-caps text-[10px] flex items-center gap-1 ${st.cls}`}>
                                  <span className="w-1.5 h-1.5 rounded-full bg-on-primary animate-pulse" />
                                  {st.label}
                                </span>
                              ) : (
                                <span className={`px-2 py-0.5 rounded-full font-label-caps text-[10px] flex items-center gap-1 ${st.cls}`}>
                                  {st.icon && <span className="material-symbols-outlined text-[12px]">{st.icon}</span>}
                                  {st.label}
                                </span>
                              )}
                            </div>
                            <h3 className={`text-[15px] font-bold mt-1 leading-snug ${isPaused ? "text-on-surface-variant" : "text-on-surface"}`}>{c.title}</h3>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className={`font-numeric-balance-lg text-[20px] leading-tight font-extrabold ${isPaused ? "text-on-surface-variant line-through opacity-70" : "text-on-surface"}`}>
                            {c.approx && <span className="text-[11px] font-bold text-outline align-top">EST. </span>}
                            {c.approx ? "~" : ""}
                            {inr0(c.amount)}
                          </div>
                          <div className={`text-[11px] font-medium ${isPaused ? "text-tertiary" : "text-outline"}`}>{c.cadence}</div>
                        </div>
                      </div>

                      <div className={`grid grid-cols-3 gap-2 p-2.5 rounded-2xl border text-xs ${isPaused ? "bg-surface-container border-surface-container-high/50" : "bg-surface-container-low border-surface-container-high/40"}`}>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-outline block">Payer</span>
                          <span className={`font-semibold flex items-center gap-1 mt-0.5 ${isPaused ? "text-on-surface-variant" : "text-on-surface"}`}>
                            <span className={`w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-bold ${c.payer.cls}`}>{c.payer.initials}</span>
                            {c.payer.name}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-outline block">{c.id === "coned" ? "Roommates" : c.id === "spotify" ? "Roommates" : "Distribution"}</span>
                          <span className={`font-semibold block mt-0.5 ${isPaused ? "text-on-surface-variant" : "text-on-surface"}`}>{c.split}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-outline block">{c.thirdLabel}</span>
                          <span className={`font-semibold block mt-0.5 ${c.thirdClass}`}>{c.thirdValue}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
                        {isPaused ? (
                          <div className="flex items-center gap-1.5 text-xs text-outline">
                            <span className="material-symbols-outlined text-[15px]">event</span>
                            <span>{c.nextCheck}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {c.channels.map((ch) => (
                              <span
                                key={ch.label}
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium ${
                                  ch.label === "Surge Protected" ? "bg-secondary-fixed/50 text-on-secondary-fixed font-semibold" : "bg-surface-container text-on-surface-variant"
                                }`}
                              >
                                <span className={`material-symbols-outlined text-[13px] ${ch.cls}`}>{ch.icon}</span>
                                {ch.label}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center gap-1.5">
                          <button className="p-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors" title="Split Weight Inspector" type="button" onClick={() => setInspector(c)}>
                            <span className="material-symbols-outlined text-[18px]">balance</span>
                          </button>
                          {!isPaused && (
                            <button
                              className="px-2.5 py-1.5 rounded-xl bg-surface-container-high hover:bg-primary-fixed text-on-surface hover:text-on-primary-fixed-variant text-xs font-bold flex items-center gap-1 transition-all active:scale-95"
                              type="button"
                              onClick={() => simulateCard(c.id, c.title)}
                            >
                              <span className="material-symbols-outlined text-[16px]">bolt</span>
                              <span>Simulate Run</span>
                            </button>
                          )}
                          {isPaused ? (
                            <button className="px-4 py-1.5 rounded-full bg-primary text-on-primary text-xs font-bold shadow-sm hover:brightness-105 active:scale-95 transition-all" type="button" onClick={() => resumeCycle(c.id)}>
                              Resume Cadence
                            </button>
                          ) : (
                            <button className="w-8 h-8 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-tertiary transition-colors" title="Pause Cadence" type="button" onClick={() => togglePause(c.id)}>
                              <span className="material-symbols-outlined text-[18px]">pause</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* COLUMN 3: Governance & Guard */}
              <div className="lg:col-span-3 flex flex-col gap-5">
                <SectionHeader
                  dotClass="bg-tertiary"
                  label="03 / Governance & Guard"
                  meta={<span className="text-[11px] text-outline font-mono leading-none whitespace-nowrap">v4.2 SECURE</span>}
                />

                {/* Surge Protection */}
                <div className="p-5 rounded-3xl bg-surface-container-lowest border border-surface-container shadow-sm flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 text-tertiary">
                        <span className="material-symbols-outlined text-[18px]">security_update_warning</span>
                        <span className="font-label-caps text-[10px] uppercase font-bold tracking-wider">Spike Shield</span>
                      </div>
                      <h4 className="text-sm font-bold text-on-surface mt-0.5">Surge Protection Rules</h4>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-caps text-[10px] font-bold shrink-0">ARMED</span>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">Tabsy automatically holds variable bills if surges exceed safe percentage limits.</p>
                  <div className="flex flex-col gap-3">
                    <div className="p-3 rounded-2xl bg-surface-container-low border border-surface-container-high/40 flex items-center justify-between gap-2">
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-semibold text-on-surface">Spike Alert Threshold</span>
                        <span className="text-[11px] text-outline">Notify roommates if bill rises</span>
                      </div>
                      <div className="flex items-center gap-1 bg-surface-container-lowest px-2.5 py-1 rounded-xl border border-surface-container shadow-sm shrink-0">
                        <span className="text-xs font-bold text-on-surface">&gt;</span>
                        <input className="w-10 text-center text-xs font-bold text-primary bg-transparent focus:outline-none" max="100" min="1" type="number" value={surgePct} onChange={(e) => setSurgePct(Number(e.target.value) || 0)} />
                        <span className="text-xs font-bold text-outline">%</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-2xl bg-surface-container-low border border-surface-container-high/40 flex items-center justify-between gap-2">
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-semibold text-on-surface">Hard Dollar Freeze</span>
                        <span className="text-[11px] text-outline">Halt auto-debit if exceeds</span>
                      </div>
                      <div className="flex items-center gap-1 bg-surface-container-lowest px-2.5 py-1 rounded-xl border border-surface-container shadow-sm shrink-0">
                        <span className="text-xs font-bold text-outline">₹</span>
                        <input className="w-14 text-center text-xs font-bold text-on-surface bg-transparent focus:outline-none" max="200000" min="500" type="number" value={freezeCap} onChange={(e) => setFreezeCap(Number(e.target.value) || 0)} />
                      </div>
                    </div>
                  </div>
                  <button className="w-full py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-bold transition-all text-center" type="button" onClick={() => showToast("Guardrail policies updated")}>
                    Update Guardrail Policies
                  </button>
                </div>

                {/* Multi-Channel Alerts */}
                <div className="p-5 rounded-3xl bg-surface-container-lowest border border-surface-container shadow-sm flex flex-col gap-3.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-on-surface">Multi-Channel Alerts</h4>
                    <span className="material-symbols-outlined text-outline text-[18px]">hub</span>
                  </div>
                  <p className="text-xs text-on-surface-variant">48-hour heads-up dispatch routing for automated cycles</p>
                  <div className="flex flex-col gap-2.5 pt-1">
                    {[
                      { id: "whatsapp", icon: "chat", title: "WhatsApp Ping", sub: "Group preview + quick reply", wrap: "bg-primary-fixed/80 text-primary" },
                      { id: "wallet", icon: "credit_card", title: "Apple Wallet Pass", sub: "Live lockscreen widget", wrap: "bg-surface-container-high text-secondary" },
                      { id: "slack", icon: "webhook", title: "Slack/Discord Bot", sub: "#roommates-expenses", wrap: "bg-secondary-fixed text-secondary" },
                    ].map((ch) => {
                      const on = channels[ch.id];
                      return (
                        <div key={ch.id} className="flex items-center justify-between p-2.5 rounded-2xl bg-surface-container-low border border-surface-container-high/40">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${ch.wrap}`}>
                              <span className="material-symbols-outlined text-[17px]">{ch.icon}</span>
                            </div>
                            <div className="min-w-0">
                              <span className="text-xs font-bold text-on-surface block leading-tight truncate">{ch.title}</span>
                              <span className="text-[10px] text-outline truncate block">{ch.sub}</span>
                            </div>
                          </div>
                          <button
                            aria-label={`Toggle ${ch.title}`}
                            className={`relative w-9 h-5 rounded-full transition-colors shrink-0 ${on ? "bg-primary" : "bg-surface-container-highest"}`}
                            type="button"
                            onClick={() => setChannels((prev) => ({ ...prev, [ch.id]: !prev[ch.id] }))}
                          >
                            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${on ? "translate-x-[18px]" : "translate-x-0.5"}`} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Autopay Audit Trail */}
                <div className="p-5 rounded-3xl bg-surface-container-lowest border border-surface-container shadow-sm flex flex-col gap-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[17px] text-primary">verified_user</span>
                      <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider">Autopay Audit Trail</h4>
                    </div>
                    <span className="text-[10px] font-mono text-outline">SHA-256</span>
                  </div>
                  <div className="flex flex-col gap-2 font-mono text-[11px]">
                    {AUDIT_LOG.map((log) => (
                      <div key={log.txn} className="p-2.5 rounded-xl bg-surface-container-low border border-surface-container flex flex-col gap-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-sans font-bold text-on-surface text-xs truncate">
                            {log.date} • {log.name}
                          </span>
                          <span className="text-primary font-bold font-numeric-balance-md text-xs shrink-0">{inr0(log.amount)}</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-outline">
                          <span>Txn: {log.txn}</span>
                          <span className="text-primary font-semibold">{log.tag}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="text-center text-xs font-bold text-secondary hover:underline pt-1" type="button" onClick={() => showToast("Audit CSV & hash proofs downloaded")}>
                    Download Full Audit CSV &amp; Hash Proofs →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Split Weight Inspector Modal */}
        {inspector && (
          <div className="fixed inset-0 z-50 bg-on-surface/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && setInspector(null)}>
            <div className="w-full max-w-md bg-surface-container-lowest rounded-3xl p-6 shadow-2xl border border-surface-container flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[18px]">balance</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-on-surface">Split Weight Inspector</h4>
                    <span className="text-xs text-on-surface-variant">Tactile Ledger Proportions</span>
                  </div>
                </div>
                <button className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-outline hover:text-on-surface" type="button" onClick={() => setInspector(null)}>
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
              <div className="p-3.5 rounded-2xl bg-surface-container-low border border-surface-container flex flex-col gap-2 text-xs">
                <div className="flex items-center justify-between font-semibold text-on-surface gap-2">
                  <span className="shrink-0">Target Cadence:</span>
                  <span className="font-bold text-primary truncate text-right">{inspector.title}</span>
                </div>
                <div className="flex items-center justify-between text-on-surface-variant">
                  <span>Gross Billing Cycle:</span>
                  <span className="font-mono font-bold text-on-surface">{inr(inspector.amount)}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 text-xs font-medium">
                {[
                  { initials: "AM", name: "Alex Morgan (You)", cls: "bg-primary text-on-primary", amt: 1660 },
                  { initials: "SL", name: "Sarah Lin", cls: "bg-secondary text-on-secondary", amt: 1660 },
                  { initials: "MR", name: "Marco Rossi", cls: "bg-secondary-container text-on-secondary-container", amt: 1660 },
                  { initials: "JP", name: "Jason Powell", cls: "bg-outline text-surface-container-lowest", amt: 1660 },
                  { initials: "+2", name: "2 Other Roommates", cls: "bg-surface-variant text-on-surface", amt: 3320 },
                ].map((p) => {
                  const totalW = 1660 * 4 + 3320;
                  const pct = ((p.amt / totalW) * 100).toFixed(1);
                  return (
                    <div key={p.initials} className="flex items-center justify-between p-2 rounded-xl bg-surface-container-lowest border border-surface-container">
                      <span className="flex items-center gap-2 min-w-0">
                        <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${p.cls}`}>{p.initials}</span>
                        <span className="truncate">{p.name}</span>
                      </span>
                      <span className="font-mono font-bold text-on-surface shrink-0">
                        {inr(p.amt)} ({pct}%)
                      </span>
                    </div>
                  );
                })}
              </div>
              <button className="w-full py-2.5 rounded-full bg-primary text-on-primary font-bold text-xs hover:brightness-105 transition-all" type="button" onClick={() => setInspector(null)}>
                Done Inspecting
              </button>
            </div>
          </div>
        )}

        {/* Toast */}
        {toast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 p-3 pr-4 rounded-2xl bg-on-surface text-surface text-xs font-medium flex items-center gap-3 shadow-2xl max-w-[92vw]">
            <div className="flex items-center gap-2 min-w-0">
              <span className="material-symbols-outlined text-primary-fixed text-[18px] shrink-0">verified</span>
              <span className="truncate">{toast}</span>
            </div>
            <span className="text-[10px] text-surface-variant font-mono shrink-0">JUST NOW</span>
          </div>
        )}
      </div>
    </AppLayout>
  );
}