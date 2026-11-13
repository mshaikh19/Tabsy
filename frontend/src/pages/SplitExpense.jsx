import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";

const TOTAL_BILL = 70550;
const RING_RADIUS = 48;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const inr = (n) => `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const MEMBERS = [
  {
    id: "alex",
    initials: "AM",
    name: "Alex Morgan",
    role: "Payer / You",
    roleClass: "bg-emerald-100 text-emerald-800",
    avatarClass: "bg-emerald-100 ring-emerald-400 text-emerald-800",
    arc: "#006c49",
    accent: "#006c49",
    subtotalClass: "text-primary",
    items: [
      { label: "2-Day Lift Pass", className: "bg-pastel-mint text-emerald-800 border-emerald-200" },
      { label: "Ski Boots", className: "bg-pastel-sky text-sky-800 border-sky-200" },
    ],
    defaultWeight: 1.83,
    defaultActive: true,
  },
  {
    id: "marco",
    initials: "MR",
    name: "Marco Rossi",
    role: "Group Co-Host",
    roleClass: "bg-indigo-50 text-indigo-700",
    avatarClass: "bg-indigo-100 ring-indigo-400 text-indigo-800",
    arc: "#4648d4",
    accent: "#4648d4",
    subtotalClass: "text-secondary",
    items: [
      { label: "2-Day Lift Pass", className: "bg-pastel-lavender text-indigo-800 border-indigo-200" },
      { label: "Snowboard Pro", className: "bg-pastel-peach text-rose-800 border-rose-200" },
    ],
    defaultWeight: 1.83,
    defaultActive: true,
  },
  {
    id: "sarah",
    initials: "SL",
    name: "Sarah Lin",
    role: "Own Gear",
    roleClass: "bg-purple-50 text-purple-700",
    avatarClass: "bg-purple-100 ring-purple-400 text-purple-800",
    arc: "#9333ea",
    accent: "#9333ea",
    subtotalClass: "text-purple-700",
    items: [
      { label: "2-Day Lift Pass", className: "bg-pastel-lavender text-purple-800 border-purple-200" },
      { label: "Brought Skis", className: "bg-slate-100 text-slate-700 border-slate-200" },
    ],
    defaultWeight: 1.41,
    defaultActive: true,
  },
  {
    id: "kim",
    initials: "KS",
    name: "Kim Sato",
    role: "Beginner Plan",
    roleClass: "bg-amber-50 text-amber-800",
    avatarClass: "bg-amber-100 ring-amber-400 text-amber-800",
    arc: "#d97706",
    accent: "#d97706",
    subtotalClass: "text-amber-700",
    items: [
      { label: "1-Day Pass", className: "bg-pastel-butter text-amber-900 border-amber-200" },
      { label: "Helmet & Ski Rental", className: "bg-amber-50 text-amber-800 border-amber-200" },
    ],
    defaultWeight: 1.0,
    defaultActive: true,
  },
  {
    id: "jason",
    initials: "JP",
    name: "Jason Powell",
    role: "Half-Day",
    roleClass: "bg-teal-50 text-teal-800",
    avatarClass: "bg-teal-100 ring-teal-400 text-teal-800",
    arc: "#0d9488",
    accent: "#0d9488",
    subtotalClass: "text-teal-700",
    items: [
      { label: "1-Day Pass", className: "bg-pastel-mint text-teal-800 border-teal-200" },
      { label: "Brought Own Gear", className: "bg-slate-100 text-slate-700 border-slate-200" },
    ],
    defaultWeight: 1.0,
    defaultActive: true,
  },
  {
    id: "taylor",
    initials: "TE",
    name: "Taylor Evans",
    role: "Opted Out",
    roleClass: "bg-slate-200 text-slate-600",
    avatarClass: "bg-slate-200 ring-slate-300 text-slate-600",
    arc: "#cbd5e1",
    accent: "#94a3b8",
    subtotalClass: "text-slate-400",
    items: [{ label: "Lodge Spectator (Did Not Ski)", className: "bg-white text-slate-500 border-slate-200" }],
    defaultWeight: 0,
    defaultActive: false,
  },
];

const MODES = [
  { id: "equal", label: "Equally (1/N)", icon: "calculate" },
  { id: "weights", label: "Weight Sliders", icon: "tune" },
  { id: "exact", label: "Exact Amounts", icon: "attach_money" },
  { id: "percentages", label: "Percentages (%)", icon: "percent" },
  { id: "itemized", label: "By Item Line", icon: "receipt_long" },
];

export default function SplitExpense() {
  const [mode, setMode] = useState("weights");
  const [weights, setWeights] = useState(() => Object.fromEntries(MEMBERS.map((m) => [m.id, m.defaultWeight])));
  const [active, setActive] = useState(() => Object.fromEntries(MEMBERS.map((m) => [m.id, m.defaultActive])));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState(null);

  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(null), 2800);
  }

  const computed = useMemo(() => {
    const totalWeight = MEMBERS.reduce((sum, m) => sum + (active[m.id] ? weights[m.id] || 0 : 0), 0);
    const dashValues = MEMBERS.map((m) => {
      const isActive = !!active[m.id];
      const w = isActive ? weights[m.id] || 0 : 0;
      const pct = totalWeight > 0 ? w / totalWeight : 0;
      const amount = pct * TOTAL_BILL;
      return { isActive, weight: w, pct, amount, dash: pct * RING_CIRCUMFERENCE };
    });
    const rows = MEMBERS.map((m, i) => {
      let runningOffset = 0;
      for (let j = 0; j < i; j += 1) runningOffset += dashValues[j].dash;
      return { ...m, ...dashValues[i], offset: runningOffset };
    });
    const allocated = rows.reduce((sum, r) => sum + r.amount, 0);
    const alexShare = rows.find((r) => r.id === "alex")?.amount ?? 0;
    const payerNet = TOTAL_BILL - alexShare;
    return { rows, totalWeight, allocated, payerNet, leftover: TOTAL_BILL - allocated };
  }, [weights, active]);

  const balanced = Math.abs(computed.leftover) < 0.5;

  function setWeight(id, value) {
    setWeights((prev) => ({ ...prev, [id]: value }));
  }

  function toggleMember(id) {
    setActive((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      if (next[id]) setWeight(id, 1.0);
      return next;
    });
  }

  function applyPresetWeights(weightMap) {
    setWeights((prev) => {
      const next = { ...prev };
      for (const m of MEMBERS) {
        if (active[m.id] && weightMap[m.id] != null) next[m.id] = weightMap[m.id];
      }
      return next;
    });
  }

  function equalizeActive() {
    applyPresetWeights(Object.fromEntries(MEMBERS.filter((m) => active[m.id]).map((m) => [m.id, 1.0])));
    showToast("Equalized all active members to 1.0x");
  }

  function resetEqual() {
    const nextActive = Object.fromEntries(MEMBERS.map((m) => [m.id, m.id !== "taylor"]));
    setActive(nextActive);
    setWeights(Object.fromEntries(MEMBERS.map((m) => [m.id, 1.0])));
    showToast("Reset to 1/N equal split");
  }

  function skiersOnly() {
    const nextActive = Object.fromEntries(MEMBERS.map((m) => [m.id, m.id !== "taylor"]));
    setActive(nextActive);
    applyPresetWeights(Object.fromEntries(MEMBERS.filter((m) => m.id !== "taylor").map((m) => [m.id, 1.0])));
    showToast("Split set to skiers only — Taylor excluded");
  }

  function sponsorPayerFree() {
    setWeight("alex", 0);
    showToast("Sponsor mode — Alex's share absorbed by the group");
  }

  function roundToFive() {
    showToast("Shares snapped to nearest ₹5 at settlement");
  }

  function saveRules() {
    if (saving || saved) return;
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      showToast("Rules saved to Tahoe Ledger!");
      setTimeout(() => setSaved(false), 2400);
    }, 700);
  }

  return (
    <AppLayout>
      <div className="bg-background font-body-md text-on-surface antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
        <main className="w-full pt-4 pb-16 bg-background min-h-screen">
          <div className="max-w-[1400px] w-full mx-auto px-4 md:px-6 lg:px-8 py-2 flex flex-col gap-6">
            {/* Breadcrumbs & Context Banner */}
            <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-surface-container pb-5">
              <div>
                <nav className="flex items-center gap-1.5 font-label-caps text-[11px] uppercase tracking-wider text-outline mb-1.5 flex-wrap">
                  <Link className="hover:text-primary transition-colors" to="/expenses">Expenses</Link>
                  <span className="text-outline-variant">/</span>
                  <span className="text-on-surface-variant">Add Expense</span>
                  <span className="text-outline-variant">/</span>
                  <span className="text-on-surface-variant">Split Rules</span>
                  <span className="text-outline-variant">/</span>
                  <span className="text-primary font-bold normal-case tracking-normal">Heavenly All-Mountain Pass &amp; Gear ({inr(TOTAL_BILL)})</span>
                </nav>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="font-headline-lg text-2xl lg:text-3xl font-extrabold text-on-surface tracking-tight">
                    Interactive Visual Weight &amp; Slider Console
                  </h1>
                  <span className="px-2.5 py-1 rounded-full bg-pastel-mint border border-emerald-200 text-primary text-xs font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">tune</span> Weight Studio v2.4
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
                  Fine-tune individual consumption multipliers, ski gear packages, and custom ratios with instant net settlement calculation.
                </p>
              </div>
              <div className="flex items-center gap-3 bg-surface-container-lowest p-2 rounded-3xl border border-surface-container shadow-xs self-start lg:self-auto">
                <div className="px-4 py-2 rounded-xl bg-surface-container-low border border-surface-container flex flex-col">
                  <span className="font-label-caps text-[10px] text-outline uppercase font-semibold">Total Bill</span>
                  <span className="font-numeric-balance-lg text-xl font-bold text-on-surface">{inr(TOTAL_BILL)}</span>
                </div>
                <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 ${balanced ? "bg-pastel-mint border-emerald-200" : "bg-pastel-butter border-amber-200"}`}>
                  <span className={`material-symbols-outlined text-[20px] ${balanced ? "text-primary" : "text-amber-600"}`}>{balanced ? "verified" : "hourglass_top"}</span>
                  <div>
                    <span className={`font-label-caps text-[10px] uppercase font-bold block ${balanced ? "text-emerald-800" : "text-amber-800"}`}>Status</span>
                    <span className={`text-xs font-bold ${balanced ? "text-emerald-900" : "text-amber-900"}`}>
                      {balanced ? "100% Balanced (₹0.00 left)" : `Distributing ${inr(Math.abs(computed.leftover))}…`}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Workspace */}
              <section className="lg:col-span-7 flex flex-col gap-5">
                <div className="bg-surface-container-lowest p-2 rounded-3xl border border-surface-container shadow-xs">
                  <div className="flex items-center justify-between mb-1.5 px-2">
                    <span className="font-label-caps text-[10px] uppercase font-bold text-outline tracking-wider">Split Computation Formula</span>
                    <span className="text-[11px] text-primary font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Live Weighted Mode
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                    {MODES.map((m) => {
                      const selected = mode === m.id;
                      return (
                        <button
                          key={m.id}
                          className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs transition-all ${
                            selected
                              ? "font-bold bg-primary text-white shadow-xs ring-1 ring-emerald-700"
                              : "font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                          } ${m.id === "itemized" ? "col-span-2 sm:col-span-1" : ""}`}
                          type="button"
                          onClick={() => {
                            setMode(m.id);
                            if (m.id !== "weights") showToast(`${m.label} mode selected — adjust in the weight console below`);
                          }}
                        >
                          <span className="material-symbols-outlined text-[16px]">{m.icon}</span>
                          <span>{m.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-pastel-sky border border-sky-200 p-3 rounded-3xl flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sky-700 text-[18px]">auto_fix_high</span>
                    <span className="text-xs font-bold text-sky-900">Batch Presets:</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button className="px-2.5 py-1.5 rounded-lg bg-white border border-sky-300 text-sky-900 text-xs font-medium hover:bg-sky-50 transition-colors flex items-center gap-1 shadow-xs" type="button" onClick={equalizeActive}>
                      <span className="material-symbols-outlined text-[14px]">equalizer</span> Equalize All (1.0x)
                    </button>
                    <button className="px-2.5 py-1.5 rounded-lg bg-white border border-sky-300 text-sky-900 text-xs font-medium hover:bg-sky-50 transition-colors flex items-center gap-1 shadow-xs" type="button" onClick={skiersOnly}>
                      <span className="material-symbols-outlined text-[14px]">downhill_skiing</span> Split Skiers Only
                    </button>
                    <button className="px-2.5 py-1.5 rounded-lg bg-white border border-sky-300 text-sky-900 text-xs font-medium hover:bg-sky-50 transition-colors flex items-center gap-1 shadow-xs" type="button" onClick={sponsorPayerFree}>
                      <span className="material-symbols-outlined text-[14px]">redeem</span> Sponsor Payer Free
                    </button>
                    <button className="px-2.5 py-1.5 rounded-lg bg-white border border-sky-300 text-sky-900 text-xs font-medium hover:bg-sky-50 transition-colors flex items-center gap-1 shadow-xs" type="button" onClick={roundToFive}>
                      <span className="material-symbols-outlined text-[14px]">toll</span> Round to ₹5
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {computed.rows.map((m) => (
                    <div
                      key={m.id}
                      className={`p-4 rounded-3xl border shadow-xs transition-all ${
                        m.isActive
                          ? "bg-surface-container-lowest border-surface-container hover:border-emerald-300"
                          : "bg-surface-container-low border-surface-container opacity-70 hover:opacity-90"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 mb-2.5">
                        <div className="flex items-center gap-3 min-w-0">
                          <button
                            aria-label={`Toggle ${m.name}`}
                            className={`w-9 h-5 rounded-full p-0.5 transition-colors relative flex items-center shrink-0 ${m.isActive ? "bg-emerald-500" : "bg-slate-300"}`}
                            type="button"
                            onClick={() => toggleMember(m.id)}
                          >
                            <span className={`w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${m.isActive ? "translate-x-4" : "translate-x-0"}`} />
                          </button>
                          <div className={`w-10 h-10 rounded-full ring-2 flex items-center justify-center font-bold text-xs shadow-xs shrink-0 ${m.avatarClass}`}>
                            {m.initials}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={`font-bold text-sm truncate ${m.isActive ? "text-on-surface" : "text-slate-700"}`}>{m.name}</span>
                              <span className={`px-1.5 py-0.2 rounded font-label-caps text-[10px] font-bold uppercase tracking-wider ${m.roleClass}`}>{m.role}</span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                              {m.items.map((item) => (
                                <span key={item.label} className={`px-2 py-0.5 rounded-full text-[11px] font-medium border ${m.isActive ? item.className : "bg-white text-slate-500 border-slate-200"}`}>
                                  {item.label}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="flex items-center justify-end gap-1.5">
                            <span className="text-xs text-outline font-medium">{(m.pct * 100).toFixed(2)}%</span>
                            <span className={`font-numeric-balance-lg font-bold text-base ${m.subtotalClass}`}>{inr(m.amount)}</span>
                          </div>
                          <span className="text-[11px] text-outline font-medium">
                            Multiplier: <strong className={m.isActive ? "text-on-surface" : "text-slate-500"}>{m.weight.toFixed(2)}x</strong>
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2 pt-1 border-t border-slate-100">
                        <div className="flex items-center gap-3">
                          <span className="text-[11px] font-bold text-outline w-7">0.0x</span>
                          <input
                            aria-label={`${m.name} weight`}
                            className="slider-weight flex-1 h-2"
                            disabled={!m.isActive}
                            max="3.0"
                            min="0.0"
                            step="0.05"
                            type="range"
                            value={m.isActive ? m.weight : 0}
                            style={{ accentColor: m.accent }}
                            onChange={(e) => setWeight(m.id, parseFloat(e.target.value) || 0)}
                          />
                          <span className="text-[11px] font-bold text-outline w-7 text-right">3.0x</span>
                        </div>
                        <div className="flex items-center justify-between gap-1 pt-0.5 flex-wrap">
                          <div className="flex items-center gap-1.5">
                            {[1.0, 1.5, 2.0].map((v) => (
                              <button
                                key={v}
                                className="px-2 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-[11px] text-on-surface-variant font-medium transition-colors disabled:opacity-40"
                                disabled={!m.isActive}
                                type="button"
                                onClick={() => setWeight(m.id, v)}
                              >
                                {v}x {v === 1.0 ? "Standard" : v === 1.5 ? "Premium" : "Couple"}
                              </button>
                            ))}
                          </div>
                          <button
                            className={`text-[11px] font-medium px-2 py-0.5 rounded transition-colors ${
                              m.isActive ? "text-rose-600 hover:text-rose-700 hover:bg-rose-50" : "text-primary hover:text-emerald-700 font-semibold"
                            }`}
                            type="button"
                            onClick={() => toggleMember(m.id)}
                          >
                            {m.isActive ? "Set Spectator (0x)" : "Re-include Member"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Right Companion Rail */}
              <section className="lg:col-span-5 flex flex-col gap-5">
                <div className="bg-surface-container-lowest p-5 rounded-3xl border border-surface-container shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-headline-sm font-bold text-base text-on-surface flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-primary text-[20px]">pie_chart</span>
                        Allocation Donut &amp; Arc Dial
                      </h3>
                      <p className="text-xs text-on-surface-variant">Live visual weight distribution</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full font-label-caps text-[11px] font-bold border ${balanced ? "bg-pastel-mint border-emerald-200 text-primary" : "bg-pastel-butter border-amber-200 text-amber-800"}`}>
                      {balanced ? "100% Balanced" : "Distributing…"}
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center pt-2">
                    <div className="relative w-48 h-48 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" fill="none" r={RING_RADIUS} stroke="#f1f5f9" strokeWidth="12" />
                        {computed.rows
                          .filter((r) => r.isActive && r.dash > 0)
                          .map((r) => (
                            <circle
                              key={r.id}
                              cx="60"
                              cy="60"
                              fill="none"
                              r={RING_RADIUS}
                              stroke={r.arc}
                              strokeDasharray={`${r.dash.toFixed(1)} ${(RING_CIRCUMFERENCE - r.dash).toFixed(1)}`}
                              strokeDashoffset={(-r.offset).toFixed(1)}
                              strokeWidth="12"
                            />
                          ))}
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                        <span className="text-[10px] uppercase font-bold text-outline font-label-caps tracking-wider">Total Active</span>
                        <span className="font-numeric-balance-lg text-lg font-extrabold text-on-surface">{inr(TOTAL_BILL)}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full mt-0.5 ${balanced ? "text-emerald-700 bg-pastel-mint" : "text-amber-800 bg-pastel-butter"}`}>
                          {balanced ? "₹0.00 Remaining" : `${inr(Math.abs(computed.leftover))} left`}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 w-full pt-4 border-t border-slate-100 text-xs">
                      {computed.rows.map((r) => (
                        <div key={r.id} className={`flex items-center gap-1.5 ${r.isActive ? "" : "opacity-40"}`}>
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: r.arc }} />
                          <span className="text-on-surface truncate">
                            {r.name.split(" ")[0]} {r.isActive ? `(${(r.pct * 100).toFixed(1)}%)` : "(0%)"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container-lowest p-5 rounded-3xl border border-surface-container shadow-xs space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-headline-sm font-bold text-base text-on-surface flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-secondary text-[20px]">currency_exchange</span>
                        Live Net Settlement Matrix
                      </h3>
                      <p className="text-xs text-on-surface-variant">Real-time projection across Tahoe trip ledger</p>
                    </div>
                    <span className="material-symbols-outlined text-outline text-[18px]">sync_alt</span>
                  </div>

                  <div className="bg-pastel-mint border border-emerald-200 p-3 rounded-xl flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">AM</div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-emerald-950 truncate">Alex Morgan (You)</span>
                          <span className="px-1 py-0.2 rounded bg-emerald-200 text-emerald-800 text-[9px] font-bold uppercase shrink-0">Payer</span>
                        </div>
                        <span className="text-[11px] text-emerald-800">Paid {inr(TOTAL_BILL)} upfront</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-label-caps text-[9px] uppercase font-bold text-emerald-700 block">Net Reimbursement</span>
                      <span className="font-numeric-balance-md text-base font-extrabold text-primary">+{inr(computed.payerNet)}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    {computed.rows
                      .filter((r) => r.id !== "alex")
                      .map((r) => (
                        <div key={r.id} className={`flex items-center justify-between p-2 rounded-lg transition-colors ${r.isActive ? "bg-surface-container-low hover:bg-surface-container" : "bg-surface-container-low opacity-50"}`}>
                          <div className="flex items-center gap-2 min-w-0">
                            <span className={`material-symbols-outlined text-[16px] shrink-0 ${r.isActive ? "text-rose-500" : "text-slate-400"}`}>
                              {r.isActive ? "arrow_forward" : "remove"}
                            </span>
                            <span className={`text-xs font-medium truncate ${r.isActive ? "text-on-surface" : "text-slate-500"}`}>
                              {r.name} {r.isActive ? "owes Alex" : "(Spectator)"}
                            </span>
                          </div>
                          <span className={`font-numeric-balance-md text-xs font-bold shrink-0 ${r.isActive ? "text-tertiary" : "text-slate-400"}`}>
                            {r.isActive ? `-${inr(r.amount)}` : inr(0)}
                          </span>
                        </div>
                      ))}
                  </div>

                  <div className="p-3 rounded-xl bg-pastel-butter border border-amber-200 flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-amber-700 text-[18px] mt-0.5">auto_awesome</span>
                    <div>
                      <span className="text-xs font-bold text-amber-900 block">Smart Netting Insight</span>
                      <p className="text-xs text-amber-800 leading-snug">
                        Tabsy algorithm combined Marco's {inr(18260)} share with yesterday's dinner credit, netting down to <strong>{inr(6009.2)}</strong> total settleable transfer.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container-lowest p-5 rounded-3xl border border-surface-container shadow-sm space-y-3">
                  <button
                    className="w-full py-2.5 px-3 rounded-xl bg-surface-container border border-surface-container-high font-semibold text-xs text-on-surface hover:bg-surface-container-high transition-colors flex items-center justify-center gap-1.5"
                    type="button"
                    onClick={equalizeActive}
                  >
                    <span className="material-symbols-outlined text-[16px]">balance</span>
                    <span>Equalize Remaining Across Active</span>
                  </button>
                  <button
                    className="w-full py-2.5 px-3 rounded-xl bg-white border border-surface-container-high font-semibold text-xs text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors flex items-center justify-center gap-1.5"
                    type="button"
                    onClick={resetEqual}
                  >
                    <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                    <span>Reset to 1/N Equal Split</span>
                  </button>
                  <div className="pt-2">
                    <button
                      className={`w-full py-3.5 px-4 rounded-xl text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                        saved ? "bg-emerald-600" : "bg-primary hover:bg-emerald-700"
                      }`}
                      disabled={saving}
                      type="button"
                      onClick={saveRules}
                    >
                      <span className={`material-symbols-outlined text-[18px] ${saving ? "animate-spin" : ""}`}>
                        {saved ? "check_circle" : saving ? "progress_activity" : "done_all"}
                      </span>
                      <span>{saved ? "Rules Saved to Tahoe Ledger!" : saving ? "Applying Multipliers…" : "Save & Apply Split Rules"}</span>
                      {!saving && !saved && <span className="material-symbols-outlined text-[16px]">arrow_forward</span>}
                    </button>
                    <div className="text-center pt-2">
                      <Link className="text-xs text-outline hover:text-on-surface transition-colors inline-flex items-center gap-1" to="/expense-details">
                        <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                        <span>Back to Expense Details</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>

        {toast && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-inverse-surface text-inverse-on-surface px-4 py-2.5 rounded-full shadow-2xl">
            <span className="material-symbols-outlined text-[18px] text-primary-fixed">check_circle</span>
            <span className="text-xs font-semibold">{toast}</span>
          </div>
        )}
      </div>
    </AppLayout>
  );
}