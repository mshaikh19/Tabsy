import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import GroupHeader from "../components/layout/GroupHeader";

const TOTAL = 23696.5;

const CATEGORIES = [
  { id: "Groceries", icon: "local_grocery_store" },
  { id: "Dining & Drinks", icon: "restaurant" },
  { id: "Lodging", icon: "hotel" },
  { id: "Transit", icon: "directions_car" },
];

const PAYERS = [
  { name: "Alex Morgan", method: "Chase Sapphire Reserve •••• 4129", short: "AM", avatarBg: "bg-primary-fixed text-on-primary-fixed", isYou: true },
  { name: "Marco Rossi", method: "Apple Cash •••• 9811", short: "MR", avatarBg: "bg-tertiary-fixed text-on-tertiary-fixed", isYou: false },
  { name: "Sarah Lin", method: "Venmo Balance", short: "SL", avatarBg: "bg-secondary-fixed-dim text-on-secondary-fixed-variant", isYou: false },
];

const MEMBERS = [
  { id: 0, name: "Alex Morgan", short: "AM", label: "Paying Payer", base: 6588.54, avatarBg: "bg-primary-fixed text-on-primary-fixed", dot: "bg-primary-fixed", color: "#6ffbbe" },
  { id: 1, name: "Marco Rossi", short: "MR", label: "+2 Organic Items", base: -9960.0, avatarBg: "bg-tertiary-fixed text-on-tertiary-fixed", dot: "bg-tertiary-fixed", color: "#ffdadb" },
  { id: 2, name: "Sarah Lin", short: "SL", label: "Base Share", base: 1245.0, avatarBg: "bg-secondary-fixed-dim text-on-secondary-fixed-variant", dot: "bg-secondary-fixed-dim", color: "#c0c1ff" },
  { id: 3, name: "Kim Sato", short: "KS", label: "Standard Share", base: 0.0, avatarBg: "bg-surface-container-highest text-on-surface-variant", dot: "bg-surface-container-highest", color: "#eaedff" },
  { id: 4, name: "Jason Powell", short: "JP", label: "Standard Share", base: 2126.46, avatarBg: "bg-secondary-fixed text-on-secondary-fixed", dot: "bg-secondary-fixed", color: "#e1e0ff" },
];

const PRESETS = {
  equal: { label: "Equal Split (5)", weights: [1.0, 1.0, 1.0, 1.0, 1.0] },
  nondrinkers: { label: "Opt-out Non-Drinkers", weights: [1.4, 1.3, 0.7, 0.5, 0.5] },
  couples: { label: "Couples 2x Weight", weights: [2.0, 2.0, 1.0, 1.0, 1.0] },
  reset: { label: "Reset Defaults", weights: [1.4, 1.1, 1.0, 0.825, 0.65] },
};

const DEFAULT_WEIGHTS = [1.4, 1.1, 1.0, 0.825, 0.65];

function amountsFromWeights(weightArr, total) {
  const sum = weightArr.reduce((s, w) => s + (w > 0 ? w : 0), 0) || 1;
  const raw = weightArr.map((w) => Math.round((w / sum) * total * 100) / 100);
  const diff = Math.round((total - raw.reduce((s, a) => s + a, 0)) * 100) / 100;
  raw[raw.length - 1] = Math.round((raw[raw.length - 1] + diff) * 100) / 100;
  return raw;
}

const RECEIPT_ITEMS = [
  { emoji: "🥑", name: "Organic Fresh Produce", amount: 4000.6 },
  { emoji: "🍷", name: "Pinot Noir Reserva (Marco + Alex)", amount: 4482.0 },
  { emoji: "🥩", name: "Grassfed Butcher Counter", amount: 9329.2 },
  { emoji: "☕", name: "Artisan Coffee Beans & Pantry", amount: 5884.7 },
];

const ROUTES = [
  { name: "Marco Rossi", provider: "via Venmo" },
  { name: "Sarah Lin", provider: "via Apple Cash" },
  { name: "Kim Sato", provider: "via Ledger" },
  { name: "Jason Powell", provider: "via Venmo" },
];

const RING_RADIUS = 62;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const STEPS = [
  { id: 1, icon: "receipt_long", title: "Core Outlay & Proof", desc: "Merchant, amount & receipt proof" },
  { id: 2, icon: "pie_chart", title: "Allocation & Weights", desc: "Wheel visualizer & multipliers" },
  { id: 3, icon: "publish", title: "Review & Ledger Route", desc: "Net balance shift & notifications" },
];

function fmtINR(n) {
  return `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function fmtSigned(n) {
  return `${n >= 0 ? "+" : "-"}${fmtINR(Math.abs(n))}`;
}

export default function AddExpense() {
  const navigate = useNavigate();
  const [step, setStep] = useState(() => {
    try {
      const saved = parseInt(localStorage.getItem("tabsy:addExpenseStep"), 10);
      return saved >= 1 && saved <= 3 ? saved : 1;
    } catch {
      return 1;
    }
  });
  const [mode, setMode] = useState("guided");
  const [merchant, setMerchant] = useState("Whole Foods Market");
  const [total, setTotal] = useState(TOTAL);
  const [category, setCategory] = useState("Groceries");
  const [payer, setPayer] = useState(PAYERS[0]);
  const [weights, setWeights] = useState(DEFAULT_WEIGHTS);
  const [splitMode, setSplitMode] = useState("weight");
  const [amounts, setAmounts] = useState(() => amountsFromWeights(DEFAULT_WEIGHTS, TOTAL));
  const [notify, setNotify] = useState(true);
  const [toast, setToast] = useState(null);
  const [published, setPublished] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [ocrState, setOcrState] = useState("idle");
  const [scanOpen, setScanOpen] = useState(false);
  const fileInputRef = useRef(null);

  function showToast(title, body) {
    setToast({ title, body });
    setTimeout(() => setToast(null), 3000);
  }

  function goToStep(n) {
    setStep(n);
    try {
      localStorage.setItem("tabsy:addExpenseStep", String(n));
    } catch {}
  }

  function handleReceiptFile(file) {
    if (!file) return;
    setReceipt({
      name: file.name,
      size: file.size,
      url: URL.createObjectURL(file),
      isImage: file.type.startsWith("image/"),
    });
    setOcrState("scanning");
    showToast("Receipt Uploaded", `${file.name} attached — running OCR scan.`);
    setTimeout(() => setOcrState("done"), 1500);
  }

  function openScan() {
    if (!receipt) return;
    if (receipt.isImage) setScanOpen(true);
    else window.open(receipt.url, "_blank");
  }

  const safeTotal = Number.isFinite(total) && total > 0 ? total : 0;
  const totalWeight = weights.reduce((sum, w) => sum + (w > 0 ? w : 0), 0) || 1;
  const amountMode = splitMode === "amount";
  const amountSum = amounts.reduce((s, a) => s + (a > 0 ? a : 0), 0);
  const shares = MEMBERS.map((m, i) => {
    const weight = weights[i] ?? 0;
    if (amountMode) {
      const amount = Math.max(0, amounts[i] || 0);
      return { ...m, weight, amount, pct: safeTotal > 0 ? amount / safeTotal : 0 };
    }
    const pct = weight / totalWeight;
    return { ...m, weight, pct, amount: pct * safeTotal };
  });
  const remaining = amountMode ? safeTotal - amountSum : 0;
  const matchedPct = safeTotal > 0 ? Math.min(100, ((amountMode ? amountSum : safeTotal) / safeTotal) * 100) : 0;

  const payerId = MEMBERS.find((m) => m.name === payer.name)?.id ?? 0;

  const segments = shares.map((s, i) => ({
    color: s.color,
    dash: s.pct * RING_CIRCUMFERENCE,
    offset: shares.slice(0, i).reduce((sum, prev) => sum + prev.pct * RING_CIRCUMFERENCE, 0),
  }));

  function adjustWeight(id, delta) {
    setWeights((prev) =>
      prev.map((w, i) => (i === id ? Math.max(0.1, Math.round((w + delta) * 10) / 10) : w))
    );
  }

  function applyPreset(key) {
    const preset = PRESETS[key];
    if (!preset) return;
    setWeights(preset.weights);
    setAmounts(amountsFromWeights(preset.weights, safeTotal));
    showToast("Preset Applied", `${preset.label} — all shares recalculated.`);
  }

  function setMemberAmount(id, value) {
    setAmounts((prev) => prev.map((a, i) => (i === id ? Math.max(0, Math.round(value * 100) / 100) : a)));
  }

  function switchSplitMode(next) {
    if (next === splitMode) return;
    setSplitMode(next);
    if (next === "amount") {
      setAmounts(amountsFromWeights(weights, safeTotal));
    }
    showToast(
      next === "amount" ? "Split by Amount" : "Split by Parts",
      next === "amount" ? "Enter precise INR amounts per member." : "Fine-tune share parts with multipliers."
    );
  }

  function copySummary() {
    const lines = [
      "Tabsy — Expense #0849 Summary",
      `${merchant} • ${fmtINR(safeTotal)}`,
      `Paid by ${payer.name}`,
      "",
      ...shares.map((s) => `${s.name} (${s.weight}x): ${fmtINR(s.amount)} — ${(s.pct * 100).toFixed(1)}%`),
    ];
    try {
      navigator.clipboard.writeText(lines.join("\n"));
    } catch {
      /* clipboard unavailable */
    }
    showToast("Summary Copied", "Expense breakdown copied to clipboard.");
  }

  function publish() {
    setPublished(true);
  }

  function closeModal() {
    setPublished(false);
    goToStep(1);
    navigate("/dashboard");
  }

  const nextLabel =
    step === 1 ? "Continue to Step 2: Allocation" : step === 2 ? "Continue to Step 3: Review" : "Publish Expense to Group Ledger";
  const nextIcon = step === 3 ? "task_alt" : "arrow_forward";

  return (
    <AppLayout>
      <div className="bg-background font-body-md text-on-surface antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
        <main className="w-full pt-0 pb-24 bg-background min-h-screen">
          <div className="max-w-7xl w-full mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop flex flex-col gap-6">
            <input
              accept="image/*,application/pdf"
              className="hidden"
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                handleReceiptFile(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
            <GroupHeader
              title="Add Group Expense"
              subtitle="Record a new outlay, tune the split with the weight engine, and publish straight to the shared ledger."
              icon="receipt_long"
              iconLabel="New Group Outlay"
              dateLabel=""
              locationLabel=""
              currentLabel="Expense #0849"
              breadcrumbs={[
                { label: "Groups", to: "/groups", icon: "grid_view" },
                { label: "Tahoe Ski Weekend ❄️", to: "/group-details" },
              ]}
            />

            {/* Breadcrumbs & Mode Switcher */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-label-caps text-label-caps uppercase text-primary tracking-widest bg-primary-fixed/30 px-2.5 py-1 rounded-full">
                  New Group Outlay
                </span>
                <span className="text-outline-variant text-[14px]">/</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">Tahoe Ski Weekend ❄️</span>
                <span className="text-outline-variant text-[14px]">/</span>
                <span className="font-body-sm text-body-sm text-on-surface font-semibold">Expense #0849</span>
              </div>
              <div className="flex items-center gap-1 self-start md:self-auto bg-surface-container-low px-1 py-1 rounded-full shadow-sm">
                <button
                  className={`px-3 py-1 rounded-full font-body-sm text-body-sm flex items-center gap-1 transition-all ${
                    mode === "guided"
                      ? "bg-surface-container-lowest text-on-surface shadow-xs font-semibold"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                  type="button"
                  onClick={() => setMode("guided")}
                >
                  <span className="material-symbols-outlined text-[16px] text-primary">route</span>
                  Guided Stepper
                </button>
                <button
                  className={`px-3 py-1 rounded-full font-body-sm text-body-sm flex items-center gap-1 transition-colors group ${
                    mode === "rapid" ? "bg-surface-container-lowest text-on-surface shadow-xs font-semibold" : "text-on-surface-variant hover:text-on-surface"
                  }`}
                  type="button"
                  onClick={() => {
                    setMode("rapid");
                    showToast("Rapid Mode", "All steps unlocked — jump to any step from the stepper.");
                  }}
                >
                  <span className="material-symbols-outlined text-[16px] text-outline group-hover:text-on-surface">bolt</span>
                  Rapid Mode
                </button>
              </div>
            </div>

            {/* Stepper Header */}
            {mode === "guided" && (
              <section className="bg-surface-container-lowest rounded-3xl p-4 md:p-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
                  {STEPS.map((s) => {
                    const active = step === s.id;
                    const done = step > s.id;
                    return (
                      <button
                        key={s.id}
                        className={`flex items-start gap-3 relative text-left transition-all p-2 rounded-2xl hover:bg-surface-container-low/50 group ${
                          active || done ? "" : "opacity-60"
                        }`}
                        type="button"
                        onClick={() => goToStep(s.id)}
                      >
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-colors ${
                            active
                              ? "bg-secondary-container text-on-secondary-container shadow-md"
                              : done
                                ? "bg-primary-fixed text-on-primary-fixed"
                                : "bg-surface-container-high text-on-surface-variant"
                          }`}
                        >
                          <span className="material-symbols-outlined text-[20px]">{done ? "check" : s.icon}</span>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-label-caps text-label-caps uppercase tracking-wider font-bold ${
                                active ? "text-secondary" : done ? "text-primary" : "text-outline"
                              }`}
                            >
                              {active ? `Step ${s.id} • Active` : `Step ${s.id}`}
                            </span>
                            {active && <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />}
                            {done && <span className="font-label-caps text-label-caps text-outline">Verified</span>}
                          </div>
                          <h3 className={`font-title-md text-title-md text-on-surface truncate ${active ? "font-bold" : ""}`}>{s.title}</h3>
                          <p className={`font-body-sm text-body-sm truncate ${active ? "text-secondary font-medium" : "text-on-surface-variant"}`}>
                            {s.id === 1 ? `${merchant} • ${fmtINR(safeTotal)}` : s.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div className="w-full bg-surface-container-low h-1.5 rounded-full mt-4 overflow-hidden">
                  <div
                    className="bg-primary-container h-full rounded-full transition-all duration-500"
                    style={{ width: step === 1 ? "33.3%" : step === 2 ? "66.6%" : "100%" }}
                  />
                </div>
              </section>
            )}

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left: Step Viewport */}
              <div className="lg:col-span-6 flex flex-col gap-6 min-w-0">
                {step === 1 && (
                  <section className="bg-surface-container-lowest rounded-3xl p-4 md:p-6 shadow-sm flex flex-col gap-6">
                    <div className="flex items-center justify-between border-b border-surface-container pb-3">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[20px] text-primary">edit_note</span>
                          <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider">Outlay Details</span>
                        </div>
                        <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Core Outlay &amp; Proof</h2>
                      </div>
                      <span className="px-2.5 py-1 rounded-full font-label-caps text-label-caps bg-primary-fixed/40 text-primary font-bold uppercase tracking-wider">
                        Step 1 of 3
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                      <div className="sm:col-span-7 flex flex-col gap-1.5">
                        <label className="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold tracking-wider">
                          Expense Description / Merchant
                        </label>
                        <div className="flex items-center bg-surface-container-low rounded-2xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-primary-container focus-within:bg-surface-container-lowest transition-all">
                          <span className="material-symbols-outlined text-outline text-[20px] mr-2">storefront</span>
                          <input
                            className="w-full bg-transparent font-title-md text-title-md text-on-surface focus:outline-none placeholder:text-outline font-semibold"
                            type="text"
                            value={merchant}
                            placeholder="e.g. Trader Joe's, Airbnb"
                            onChange={(e) => setMerchant(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="sm:col-span-5 flex flex-col gap-1.5">
                        <label className="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold tracking-wider">
                          Total Outlay (₹)
                        </label>
                        <div className="flex items-center bg-surface-container-low rounded-2xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-primary-container focus-within:bg-surface-container-lowest transition-all">
                          <span className="font-numeric-balance-md text-numeric-balance-md text-primary font-bold mr-1">₹</span>
                          <input
                            className="w-full bg-transparent font-numeric-balance-lg text-numeric-balance-lg text-on-surface font-bold focus:outline-none"
                            type="number"
                            step="0.01"
                            min="0"
                            value={total}
                            onChange={(e) => setTotal(parseFloat(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold tracking-wider">Spending Category</label>
                      <div className="flex flex-wrap items-center gap-2">
                        {CATEGORIES.map((c) => {
                          const selected = category === c.id;
                          return (
                            <button
                              key={c.id}
                              className={`px-3 py-1.5 rounded-xl font-body-sm text-body-sm flex items-center gap-1.5 transition-colors ${
                                selected
                                  ? "bg-primary-container text-on-primary font-semibold shadow-xs"
                                  : "bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-medium"
                              }`}
                              type="button"
                              onClick={() => {
                                setCategory(c.id);
                                showToast("Category Set", `${c.id} selected for this outlay.`);
                              }}
                            >
                              <span className={`material-symbols-outlined text-[16px] ${selected ? "" : "text-outline"}`}>{c.icon}</span>
                              {c.id}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold tracking-wider">Who Paid / Fronted Sum?</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {PAYERS.map((p) => {
                          const selected = payer.name === p.name;
                          return (
                            <button
                              key={p.name}
                              className={`flex items-center gap-2.5 p-2 rounded-2xl text-left transition-all ${
                                selected ? "bg-primary-fixed/30 ring-2 ring-primary" : "bg-surface-container-low hover:bg-surface-container"
                              }`}
                              type="button"
                              onClick={() => {
                                setPayer(p);
                                showToast("Outlay Sponsor Set", `${p.name} fronted this expense.`);
                              }}
                            >
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${p.avatarBg}`}>{p.short}</div>
                              <div className="min-w-0">
                                <p className={`font-body-sm text-body-sm truncate ${selected ? "text-on-surface font-bold" : "text-on-surface font-medium"}`}>{p.name}</p>
                                <p className={`font-body-sm text-[11px] truncate ${selected ? "text-primary font-semibold" : "text-outline"}`}>
                                  {p.isYou ? "You (Payer)" : "Member"}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 bg-surface-container-low rounded-2xl p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary text-[20px]">document_scanner</span>
                          <span className="font-title-md text-title-md text-on-surface font-semibold">Receipt Proof &amp; OCR Items</span>
                        </div>
                        <span className="font-body-sm text-[11px] text-primary font-bold bg-primary-fixed/40 px-2 py-0.5 rounded-full">
                          {RECEIPT_ITEMS.length} items match {fmtINR(safeTotal)}
                        </span>
                      </div>
                      <div className="space-y-1.5 mt-1">
                        {RECEIPT_ITEMS.map((item) => (
                          <div key={item.name} className="flex items-center justify-between p-2 rounded-xl bg-surface-container-lowest shadow-xs">
                            <span className="font-body-sm text-body-sm text-on-surface flex items-center gap-1.5">
                              <span>{item.emoji}</span>
                              {item.name}
                            </span>
                            <span className="font-numeric-balance-md text-body-sm text-on-surface font-bold">{fmtINR(item.amount)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-1 gap-2">
                        <span className="font-body-sm text-[11px] text-outline truncate">
                          {receipt ? `Attached: ${receipt.name}` : "No receipt attached yet"}
                        </span>
                        <button
                          className="px-2.5 py-1 rounded-lg bg-surface-container-lowest text-on-surface font-body-sm text-body-sm font-semibold shadow-xs flex items-center gap-1 shrink-0"
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <span className="material-symbols-outlined text-[14px]">upload</span>
                          {receipt ? "Replace" : "Upload"}
                        </button>
                      </div>
                    </div>
                  </section>
                )}

                {step === 2 && (
                  <section className="bg-surface-container-lowest rounded-3xl p-4 md:p-6 shadow-sm flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[20px] text-secondary">tune</span>
                          <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider">
                            {amountMode ? "Amount Engine" : "Parts Engine"}
                          </span>
                        </div>
                        <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Interactive Split Wheel</h2>
                      </div>
                      <div className="text-right">
                        <span className="font-label-caps text-label-caps uppercase text-outline block">Total Outlay</span>
                        <span className="font-numeric-balance-lg text-numeric-balance-lg text-on-surface">{fmtINR(safeTotal)}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        className={`flex items-center gap-3 p-3 rounded-2xl text-left transition-all ${
                          !amountMode
                            ? "bg-primary-fixed/25 border-2 border-primary"
                            : "bg-surface-container-low border-2 border-transparent hover:bg-surface-container"
                        }`}
                        type="button"
                        onClick={() => switchSplitMode("weight")}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${!amountMode ? "bg-primary text-on-primary" : "bg-surface-container-lowest text-on-surface-variant shadow-xs"}`}>
                          <span className="material-symbols-outlined text-[20px]">pie_chart</span>
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="font-title-md text-title-md text-on-surface font-bold">Split by Parts</span>
                          <span className="font-body-sm text-[11px] text-on-surface-variant">
                            Assign share parts (2x, 1.5x) — parts decide the split
                          </span>
                        </div>
                        {!amountMode && <span className="material-symbols-outlined text-[18px] text-primary shrink-0">check_circle</span>}
                      </button>
                      <button
                        className={`flex items-center gap-3 p-3 rounded-2xl text-left transition-all ${
                          amountMode
                            ? "bg-primary-fixed/25 border-2 border-primary"
                            : "bg-surface-container-low border-2 border-transparent hover:bg-surface-container"
                        }`}
                        type="button"
                        onClick={() => switchSplitMode("amount")}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${amountMode ? "bg-primary text-on-primary" : "bg-surface-container-lowest text-on-surface-variant shadow-xs"}`}>
                          <span className="material-symbols-outlined text-[20px]">currency_rupee</span>
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="font-title-md text-title-md text-on-surface font-bold">Split by Amount</span>
                          <span className="font-body-sm text-[11px] text-on-surface-variant">
                            Enter exact ₹ amount owed by each member
                          </span>
                        </div>
                        {amountMode && <span className="material-symbols-outlined text-[18px] text-primary shrink-0">check_circle</span>}
                      </button>
                    </div>

                    <div className="bg-surface-container-low rounded-2xl p-4 flex flex-col md:flex-row items-center justify-center gap-6 relative overflow-hidden">
                      <div className="relative w-52 h-52 shrink-0 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
                          <circle className="text-surface-container" cx="80" cy="80" fill="none" r={RING_RADIUS} stroke="currentColor" strokeWidth="18" />
                          {segments.map((seg, i) => (
                            <circle
                              key={i}
                              className="transition-all duration-500 hover:opacity-80 cursor-pointer"
                              cx="80"
                              cy="80"
                              fill="none"
                              r={RING_RADIUS}
                              stroke={seg.color}
                              strokeDasharray={`${seg.dash.toFixed(1)} ${(RING_CIRCUMFERENCE - seg.dash).toFixed(1)}`}
                              strokeDashoffset={(-seg.offset).toFixed(1)}
                              strokeWidth="18"
                            />
                          ))}
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                          <span className="font-label-caps text-label-caps text-outline uppercase tracking-wider">{shares.length} Active</span>
                          <span className="font-numeric-balance-md text-numeric-balance-md text-on-surface font-bold">{matchedPct.toFixed(0)}%</span>
                          <span className="font-body-sm text-[11px] text-primary font-semibold">{amountMode ? "Allocated" : "Matched"}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 w-full md:w-auto">
                        {shares.map((s) => (
                          <div key={s.id} className="flex items-center justify-between gap-4 p-1.5 rounded-xl hover:bg-surface-container-lowest/60 transition-colors">
                            <div className="flex items-center gap-2">
                              <div className={`w-3.5 h-3.5 rounded-full shadow-xs ${s.dot}`} />
                              <span className="font-body-sm text-body-sm text-on-surface font-medium">{s.name.split(" ")[0]} {s.name.split(" ")[1]?.[0]}.</span>
                            </div>
                            <span className="font-numeric-balance-md text-body-sm text-on-surface font-semibold">
                              {fmtINR(s.amount)} ({(s.pct * 100).toFixed(1)}%)
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold tracking-wider">Quick Split Presets</span>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          className="px-3 py-1.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-body-sm text-body-sm font-semibold transition-colors flex items-center gap-1.5"
                          type="button"
                          onClick={() => applyPreset("equal")}
                        >
                          <span className="material-symbols-outlined text-[16px] text-outline">equal</span> Equal Split (5)
                        </button>
                        <button
                          className="px-3 py-1.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-body-sm text-body-sm font-semibold transition-colors flex items-center gap-1.5"
                          type="button"
                          onClick={() => applyPreset("nondrinkers")}
                        >
                          <span className="material-symbols-outlined text-[16px] text-tertiary">liquor</span> Opt-out Non-Drinkers
                        </button>
                        <button
                          className="px-3 py-1.5 rounded-xl bg-secondary-fixed hover:bg-secondary-fixed-dim text-on-secondary-fixed font-body-sm text-body-sm font-semibold transition-colors flex items-center gap-1.5"
                          type="button"
                          onClick={() => applyPreset("couples")}
                        >
                          <span className="material-symbols-outlined text-[16px] text-secondary">people</span> Couples 2x Weight
                        </button>
                        <button
                          className="px-3 py-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface-variant font-body-sm text-body-sm transition-colors"
                          type="button"
                          onClick={() => applyPreset("reset")}
                        >
                          Reset
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold tracking-wider">
                          {amountMode ? "Exact Amounts & Shares" : "Parts & Shares"}
                        </span>
                        <span className={`font-body-sm text-[12px] font-medium ${amountMode && Math.abs(remaining) > 0.005 ? "text-error" : "text-primary"}`}>
                          {amountMode
                            ? Math.abs(remaining) <= 0.005
                              ? "Fully allocated"
                              : `${fmtINR(Math.abs(remaining))} ${remaining > 0 ? "unallocated" : "over-allocated"}`
                            : "Unlocked Custom Shares"}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {shares.map((m) => (
                          <div key={m.id} className="flex items-center justify-between p-3 bg-surface-container-low rounded-2xl gap-3">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className={`w-8 h-8 rounded-full ${m.avatarBg} flex items-center justify-center font-bold text-xs shrink-0`}>{m.short}</div>
                              <div className="min-w-0">
                                <p className="font-body-sm text-body-sm text-on-surface font-semibold truncate">{m.name}</p>
                                <p className="font-body-sm text-[11px] text-outline truncate">
                                  {amountMode ? `${(m.pct * 100).toFixed(1)}% share` : m.label}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              {amountMode ? (
                                <div className="flex items-center bg-surface-container-lowest rounded-xl px-2.5 py-1.5 shadow-xs">
                                  <span className="font-numeric-balance-md text-body-sm text-outline font-bold mr-1">₹</span>
                                  <input
                                    className="w-24 bg-transparent font-numeric-balance-md text-body-sm text-on-surface font-bold focus:outline-none"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={amounts[m.id] ?? 0}
                                    onChange={(e) => setMemberAmount(m.id, parseFloat(e.target.value) || 0)}
                                  />
                                </div>
                              ) : (
                                <div className="flex items-center bg-surface-container-lowest rounded-xl px-1.5 py-1 shadow-xs">
                                  <button
                                    className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-surface-container-high text-on-surface text-[14px] font-bold"
                                    type="button"
                                    onClick={() => adjustWeight(m.id, -0.1)}
                                  >
                                    -
                                  </button>
                                  <span className="text-xs font-bold text-on-surface px-1.5 min-w-[36px] text-center">{m.weight}x</span>
                                  <button
                                    className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-surface-container-high text-on-surface text-[14px] font-bold"
                                    type="button"
                                    onClick={() => adjustWeight(m.id, 0.1)}
                                  >
                                    +
                                  </button>
                                </div>
                              )}
                              <span className="font-numeric-balance-md text-body-sm text-on-surface font-bold min-w-[80px] text-right">{fmtINR(m.amount)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                )}

                {step === 3 && (
                  <section className="bg-surface-container-lowest rounded-3xl p-4 md:p-6 shadow-sm flex flex-col gap-6">
                    <div className="flex items-center justify-between border-b border-surface-container pb-3">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[20px] text-primary">verified</span>
                          <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider">Final Verification</span>
                        </div>
                        <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Review &amp; Ledger Route</h2>
                      </div>
                      <span className="px-2.5 py-1 rounded-full font-label-caps text-label-caps bg-primary-container text-on-primary font-bold uppercase tracking-wider">
                        Ready to sync
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-4 bg-surface-container-low rounded-2xl flex flex-col">
                        <span className="font-label-caps text-label-caps text-outline uppercase tracking-wider">Fronted Expense</span>
                        <span className="font-numeric-balance-lg text-numeric-balance-lg text-primary font-bold mt-1">{fmtINR(safeTotal)}</span>
                        <span className="font-body-sm text-[11px] text-on-surface-variant mt-0.5 truncate">{merchant}</span>
                      </div>
                      <div className="p-4 bg-surface-container-low rounded-2xl flex flex-col">
                        <span className="font-label-caps text-label-caps text-outline uppercase tracking-wider">Participants</span>
                        <span className="font-numeric-balance-lg text-numeric-balance-lg text-on-surface font-bold mt-1">{shares.length} Members</span>
                        <span className={`font-body-sm text-[11px] font-medium mt-0.5 ${amountMode && Math.abs(remaining) > 0.005 ? "text-error" : "text-primary"}`}>
                          {amountMode
                            ? Math.abs(remaining) <= 0.005
                              ? "100% Balanced"
                              : `${fmtINR(Math.abs(remaining))} ${remaining > 0 ? "unallocated" : "over"}`
                            : "100% Balanced"}
                        </span>
                      </div>
                      <div className="p-4 bg-surface-container-low rounded-2xl flex flex-col">
                        <span className="font-label-caps text-label-caps text-outline uppercase tracking-wider">Settlement Route</span>
                        <span className="font-numeric-balance-lg text-numeric-balance-lg text-secondary font-bold mt-1">Instant</span>
                        <span className="font-body-sm text-[11px] text-on-surface-variant mt-0.5">Venmo / Apple Cash</span>
                      </div>
                    </div>

                    <div className="bg-surface-container-low rounded-2xl p-4 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-secondary text-[20px]">route</span>
                          <h4 className="font-title-md text-title-md text-on-surface font-bold">Automated Settlement Route</h4>
                        </div>
                        <span className="font-label-caps text-label-caps text-primary bg-primary-fixed/40 px-2 py-0.5 rounded-full font-bold">
                          Optimized ({ROUTES.length} transfers saved)
                        </span>
                      </div>
                      <div className="space-y-2 font-body-sm text-body-sm">
                        {ROUTES.map((r, i) => {
                          const member = shares[i + 1];
                          return (
                            <div key={r.name} className="flex items-center justify-between p-2 rounded-xl bg-surface-container-lowest shadow-xs">
                              <span className="flex items-center gap-2 text-on-surface">
                                <span className="w-2 h-2 rounded-full bg-secondary" /> {r.name} ➔ {payer.name}
                              </span>
                              <span className="font-numeric-balance-md text-tertiary font-bold">
                                {fmtINR(member?.amount ?? 0)} {r.provider}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-2xl bg-surface-container-high/60 gap-3">
                      <div className="flex items-center gap-2.5">
                        <input
                          className="w-4 h-4 accent-primary rounded cursor-pointer"
                          id="notify-members-check"
                          type="checkbox"
                          checked={notify}
                          onChange={(e) => setNotify(e.target.checked)}
                        />
                        <label className="font-body-sm text-body-sm text-on-surface font-medium cursor-pointer" htmlFor="notify-members-check">
                          Notify {shares.length - 1} group members via Push &amp; SMS with itemized receipt link
                        </label>
                      </div>
                      <span className="material-symbols-outlined text-outline text-[18px] shrink-0">send</span>
                    </div>
                  </section>
                )}
              </div>

              {/* Right: Companion Deck */}
              <section className="lg:col-span-6 flex flex-col gap-6">
                <div className="bg-surface-container-lowest rounded-3xl p-4 md:p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[20px] text-primary">credit_card</span>
                      <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider">Outlay Sponsor</span>
                    </div>
                    <span className="font-label-caps text-label-caps text-primary bg-primary-fixed/40 px-2 py-0.5 rounded-full font-bold">100% Upfront</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-surface-container-low rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-on-primary font-bold shadow-md">
                        <span className="material-symbols-outlined text-[24px]">account_circle</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-title-md text-title-md text-on-surface font-bold">{payer.name}</h4>
                          <span className="bg-surface-container-lowest px-2 py-0.5 rounded-md font-body-sm text-[11px] font-semibold text-secondary">
                            {payer.isYou ? "You" : "Member"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="material-symbols-outlined text-[14px] text-outline">payments</span>
                          <span className="font-body-sm text-body-sm text-outline">{payer.method}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="font-label-caps text-label-caps uppercase text-outline block">Fronted Sum</span>
                      <span className="font-numeric-balance-md text-numeric-balance-md text-primary font-bold">{fmtSigned(safeTotal)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container-lowest rounded-3xl p-4 md:p-6 shadow-sm flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider font-bold">Projection Simulation</span>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Net Ledger Balance Shift</h3>
                    </div>
                    <div className="flex items-center gap-1.5 bg-surface-container-high px-2.5 py-1 rounded-full">
                      <span className="w-2 h-2 rounded-full bg-primary-container" />
                      <span className="font-body-sm text-[11px] text-on-surface-variant font-semibold">Simulated Real-time</span>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-outline font-label-caps text-label-caps uppercase pb-2">
                          <th className="py-2 font-normal">Member</th>
                          <th className="py-2 font-normal">Current Tab</th>
                          <th className="py-2 font-normal">Impact</th>
                          <th className="py-2 font-normal text-right">Projected Tab</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-container-low">
                        {shares.map((m) => {
                          const isPayer = m.id === payerId;
                          const impact = isPayer ? safeTotal - m.amount : -m.amount;
                          const projected = m.base + impact;
                          return (
                            <tr key={m.id} className="group hover:bg-surface-container-low/40 transition-colors">
                              <td className="py-3">
                                <div className="flex items-center gap-2">
                                  <div className={`w-7 h-7 rounded-lg ${m.avatarBg} flex items-center justify-center text-xs font-bold shrink-0`}>{m.short}</div>
                                  <span className="font-body-sm text-body-sm text-on-surface font-semibold truncate">{m.name}</span>
                                </div>
                              </td>
                              <td className={`py-3 font-numeric-balance-md text-body-sm ${m.base >= 0 ? "text-primary" : "text-tertiary"}`}>
                                {fmtSigned(m.base)}
                              </td>
                              <td className="py-3">
                                <span className={`font-body-sm text-body-sm font-semibold flex items-center gap-0.5 ${impact >= 0 ? "text-primary" : "text-tertiary"}`}>
                                  <span className="material-symbols-outlined text-[14px]">{impact >= 0 ? "arrow_upward" : "arrow_downward"}</span>
                                  {fmtSigned(impact)}
                                </span>
                              </td>
                              <td className="py-3 text-right">
                                <span
                                  className={`font-numeric-balance-md text-body-sm font-bold px-2 py-0.5 rounded-lg ${
                                    projected >= 0 ? "text-primary bg-primary-fixed/30" : "text-tertiary bg-error-container/30"
                                  }`}
                                >
                                  {fmtSigned(projected)}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-3 rounded-2xl bg-surface-container-low flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-on-primary">
                        <span className="material-symbols-outlined text-[20px]">bolt</span>
                      </div>
                      <div>
                        <p className="font-body-sm text-body-sm text-on-surface font-bold">Instant Settlement Sync Ready</p>
                        <p className="font-body-sm text-[11px] text-on-surface-variant">Auto-reconciliation active via Venmo &amp; Apple Cash</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-primary text-[20px] shrink-0">check_circle</span>
                  </div>
                </div>

                <div className="bg-surface-container-lowest rounded-3xl p-4 shadow-sm">
                  {receipt ? (
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center text-on-surface overflow-hidden relative shrink-0">
                          {receipt.isImage ? (
                            <img className="w-full h-full object-cover" src={receipt.url} alt="Receipt preview" />
                          ) : (
                            <span className="material-symbols-outlined text-[24px]">receipt</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className="font-title-md text-title-md text-on-surface font-semibold block truncate">{receipt.name}</span>
                          <span className={`font-body-sm text-[12px] ${ocrState === "done" ? "text-outline" : "text-primary"}`}>
                            {ocrState === "scanning" ? "OCR Match: scanning…" : "OCR Match: 100% • Items parsed cleanly"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          className="px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high font-body-sm text-body-sm text-on-surface font-semibold flex items-center gap-1 transition-colors"
                          type="button"
                          onClick={openScan}
                        >
                          <span className="material-symbols-outlined text-[16px]">visibility</span> View Scan
                        </button>
                        <button
                          aria-label="Replace receipt"
                          className="w-8 h-8 rounded-xl bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <span className="material-symbols-outlined text-[16px]">upload</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      className="w-full border-2 border-dashed border-surface-container-highest rounded-2xl p-4 flex flex-col items-center justify-center gap-1.5 hover:bg-surface-container-low/60 transition-colors"
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        handleReceiptFile(e.dataTransfer.files?.[0]);
                      }}
                    >
                      <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                        <span className="material-symbols-outlined text-[22px]">upload_file</span>
                      </div>
                      <span className="font-body-sm text-body-sm text-on-surface font-semibold">Drop receipt or click to upload</span>
                      <span className="font-body-sm text-[11px] text-outline">JPG, PNG or PDF • OCR auto-scan on attach</span>
                    </button>
                  )}
                </div>
              </section>
            </div>

            {/* Floating Action Dock */}
            <section className="bg-surface-container-lowest/90 backdrop-blur-xl rounded-3xl p-3 sm:p-4 shadow-lg sticky bottom-4 z-40">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2.5 md:gap-3">
                <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start shrink-0">
                  {step > 1 && (
                    <button
                      className="px-4 py-2.5 rounded-2xl bg-surface-container hover:bg-surface-container-high text-on-surface font-body-md text-body-md font-semibold flex items-center gap-2 transition-colors"
                      type="button"
                      onClick={() => goToStep(step - 1)}
                    >
                      <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                      Back to Step {step - 1}
                    </button>
                  )}
                  <div className="flex items-center gap-1.5 font-body-sm text-body-sm min-w-0">
                    <span className={`material-symbols-outlined text-[16px] shrink-0 ${amountMode && Math.abs(remaining) > 0.005 ? "text-error" : "text-primary"}`}>
                      {amountMode && Math.abs(remaining) > 0.005 ? "error" : "verified_user"}
                    </span>
                    <span className={`truncate ${amountMode && Math.abs(remaining) > 0.005 ? "text-error font-semibold" : "text-on-surface-variant"}`}>
                      {amountMode
                        ? Math.abs(remaining) <= 0.005
                          ? `Zero discrepancy: ${fmtINR(safeTotal)}`
                          : `Unallocated: ${fmtINR(Math.abs(remaining))}`
                        : `Zero discrepancy: ${fmtINR(safeTotal)}`}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:flex md:items-center md:gap-2.5 w-full md:w-auto">
                  <button
                    className="px-4 py-2.5 rounded-2xl bg-surface-container hover:bg-surface-container-high text-on-surface font-body-md text-body-md font-semibold flex items-center justify-center gap-1.5 transition-colors md:flex-1"
                    type="button"
                    onClick={copySummary}
                  >
                    <span className="material-symbols-outlined text-[18px]">share</span>
                    Copy Summary
                  </button>
                  <Link
                    to="/split-expense"
                    className="px-4 py-2.5 rounded-2xl bg-surface-container-highest text-on-surface font-body-md text-body-md font-bold shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 transition-all transform active:scale-98 md:flex-1"
                    title="Fine-tune allocation with sliders"
                  >
                    <span className="material-symbols-outlined text-[18px]">tune</span>
                    Advanced Split
                  </Link>
                  <button
                    className={`px-6 py-2.5 rounded-2xl text-on-primary font-body-md text-body-md font-bold shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-98 md:flex-1 ${
                      step === 3 ? "bg-primary hover:bg-primary-container" : "bg-primary-container hover:bg-primary"
                    }`}
                    type="button"
                    onClick={() => {
                      if (step < 3) goToStep(step + 1);
                      else publish();
                    }}
                  >
                    {nextLabel}
                    <span className="material-symbols-outlined text-[18px]">{nextIcon}</span>
                  </button>
                </div>
              </div>
            </section>
          </div>
        </main>

        {/* Success Modal */}
        {published && (
          <div className="fixed inset-0 z-50 bg-on-surface/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-surface-container-lowest rounded-3xl p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center text-primary shadow-sm">
                <span className="material-symbols-outlined text-[36px]">task_alt</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-label-caps text-label-caps uppercase text-primary font-bold tracking-widest">Expense Published</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Ledger Re-balanced!</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  The expense of <strong className="text-on-surface">{fmtINR(safeTotal)}</strong> at{" "}
                  <strong className="text-on-surface">{merchant}</strong> has been recorded
                  {notify ? " and notifications dispatched to the group" : ""}.
                </p>
              </div>
              <div className="w-full p-3 bg-surface-container-low rounded-2xl flex items-center justify-between text-left">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">account_balance_wallet</span>
                  <span className="font-body-sm text-body-sm text-on-surface font-semibold">Your New Net Tab:</span>
                </div>
                <span className="font-numeric-balance-md text-primary font-bold">{fmtSigned(317.3)}</span>
              </div>
              <button
                className="w-full py-2.5 rounded-2xl bg-primary-container text-on-primary font-body-md font-bold shadow-md hover:bg-primary transition-colors"
                type="button"
                onClick={closeModal}
              >
                Done &amp; Return to Dashboard
              </button>
            </div>
          </div>
        )}

        {/* Receipt Scan Modal */}
        {scanOpen && receipt?.isImage && (
          <div className="fixed inset-0 z-50 bg-on-surface/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setScanOpen(false)}>
            <div className="bg-surface-container-lowest rounded-3xl p-4 max-w-lg w-full shadow-2xl flex flex-col gap-3" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between gap-2">
                <span className="font-title-md text-title-md text-on-surface font-semibold truncate">{receipt.name}</span>
                <button
                  aria-label="Close scan preview"
                  className="w-8 h-8 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface flex items-center justify-center transition-colors shrink-0"
                  type="button"
                  onClick={() => setScanOpen(false)}
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
              <img className="w-full max-h-[70vh] object-contain rounded-2xl bg-surface-container-low" src={receipt.url} alt="Receipt scan preview" />
            </div>
          </div>
        )}

        {/* Toast */}
        {toast && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-inverse-surface text-inverse-on-surface px-4 py-2 rounded-full font-body-sm text-body-sm shadow-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-primary-fixed">check</span>
            <div className="flex flex-col">
              <span className="font-semibold">{toast.title}</span>
              <span className="text-[11px] opacity-80">{toast.body}</span>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}