import { useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";

const inr = (n) => `₹${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const CATEGORIES = [
  { id: "Groceries", icon: "local_grocery_store" },
  { id: "Dining & Drinks", icon: "restaurant" },
  { id: "Lodging", icon: "hotel" },
  { id: "Transit", icon: "directions_car" },
];

const PAYERS = [
  { name: "Alex Morgan", method: "Chase Sapphire Reserve •••• 4129", short: "AM", avatarBg: "bg-primary-fixed text-on-primary-fixed" },
  { name: "Marco Rossi", method: "Apple Cash •••• 9811", short: "MR", avatarBg: "bg-tertiary-fixed text-on-tertiary-fixed" },
  { name: "Sarah Lin", method: "Venmo Balance", short: "SL", avatarBg: "bg-secondary-fixed-dim text-on-secondary-fixed-variant" },
];

const MEMBERS = [
  { id: "alex", name: "Alex Morgan", short: "AM", avatarBg: "bg-primary-fixed text-on-primary-fixed", defaultWeight: 1.0 },
  { id: "marco", name: "Marco Rossi", short: "MR", avatarBg: "bg-tertiary-fixed text-on-tertiary-fixed", defaultWeight: 1.0 },
  { id: "sarah", name: "Sarah Lin", short: "SL", avatarBg: "bg-secondary-fixed-dim text-on-secondary-fixed-variant", defaultWeight: 1.0 },
  { id: "kim", name: "Kim Sato", short: "KS", avatarBg: "bg-surface-container-highest text-on-surface-variant", defaultWeight: 1.0 },
  { id: "jason", name: "Jason Powell", short: "JP", avatarBg: "bg-secondary-fixed text-on-secondary-fixed", defaultWeight: 1.0 },
];

const INITIAL_ITEMS = [
  { emoji: "🏔️", name: "Chalet 4-Nights Base Fare", amount: 79680 },
  { emoji: "🧹", name: "Cleaning & Linen Turnover", amount: 11620 },
  { emoji: "🏷️", name: "Tahoe County Occupancy Tax", amount: 8300 },
];

const SPLIT_MODES = [
  { id: "equal", label: "Equally (1/N)", icon: "calculate" },
  { id: "weights", label: "By Parts", icon: "tune" },
  { id: "amount", label: "By Amount", icon: "attach_money" },
];

function amountsFromWeights(weightArr, total) {
  const sum = weightArr.reduce((s, w) => s + (w > 0 ? w : 0), 0) || 1;
  const raw = weightArr.map((w) => Math.round((w / sum) * total * 100) / 100);
  const diff = Math.round((total - raw.reduce((s, a) => s + a, 0)) * 100) / 100;
  raw[raw.length - 1] = Math.round((raw[raw.length - 1] + diff) * 100) / 100;
  return raw;
}

export default function EditExpense() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [title, setTitle] = useState("Palisades Alpine Chalet & Loft Rental");
  const [merchant, setMerchant] = useState("Palisades Alpine Chalet (Lodging Folio)");
  const [total, setTotal] = useState(99600);
  const [category, setCategory] = useState("Lodging");
  const [payer, setPayer] = useState(PAYERS[0]);
  const [date, setDate] = useState("2025-02-14");
  const [notes, setNotes] = useState("4-night chalet + loft rental, cleaning turnover, and county occupancy tax. Split 6 ways.");
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [splitMode, setSplitMode] = useState("equal");
  const [weights, setWeights] = useState(() => Object.fromEntries(MEMBERS.map((m) => [m.id, 1.0])));
  const [amounts, setAmounts] = useState(() => amountsFromWeights(MEMBERS.map(() => 1.0), 99600));
  const [notify, setNotify] = useState(true);
  const [toast, setToast] = useState(null);
  const [saved, setSaved] = useState(false);
  const [receiptName, setReceiptName] = useState("lodging-folio-TSW-49281.pdf");

  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(null), 2800);
  }

  const safeTotal = Number.isFinite(total) && total > 0 ? total : 0;

  const weightArr = useMemo(() => MEMBERS.map((m) => weights[m.id] ?? 1.0), [weights]);
  const weightSum = useMemo(() => weightArr.reduce((s, w) => s + (w > 0 ? w : 0), 0) || 1, [weightArr]);
  const amountSum = useMemo(() => amounts.reduce((s, a) => s + (a > 0 ? a : 0), 0), [amounts]);
  const remaining = safeTotal - amountSum;
  const matchedPct = safeTotal > 0 ? Math.min(100, (amountSum / safeTotal) * 100) : 0;

  const shares = useMemo(
    () =>
      MEMBERS.map((m, i) => {
        if (splitMode === "amount") {
          return { ...m, amount: amounts[i] || 0, pct: safeTotal > 0 ? (amounts[i] || 0) / safeTotal : 0 };
        }
        const w = weights[m.id] ?? 1.0;
        const pct = w / weightSum;
        return { ...m, amount: pct * safeTotal, pct, weight: w };
      }),
    [splitMode, amounts, weights, weightSum, safeTotal]
  );

  function updateItem(i, patch) {
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  }

  function addItem() {
    setItems((prev) => [...prev, { emoji: "🧾", name: "New Line Item", amount: 0 }]);
  }

  function removeItem(i) {
    setItems((prev) => prev.filter((_, idx) => idx !== i));
  }

  function setWeight(id, value) {
    setWeights((prev) => ({ ...prev, [id]: value }));
    if (splitMode === "equal") setSplitMode("weights");
  }

  function setAmount(i, value) {
    setAmounts((prev) => prev.map((a, idx) => (idx === i ? value : a)));
    if (splitMode !== "amount") setSplitMode("amount");
  }

  function applyEqual() {
    setSplitMode("equal");
    const even = amountsFromWeights(MEMBERS.map(() => 1.0), safeTotal);
    setAmounts(even);
    setWeights(Object.fromEntries(MEMBERS.map((m) => [m.id, 1.0])));
    showToast("Split set to equal 1/N");
  }

  function applyWeights() {
    setSplitMode("weights");
    setAmounts(amountsFromWeights(weightArr, safeTotal));
  }

  function handleReceiptFile(file) {
    if (!file) return;
    setReceiptName(file.name);
    showToast("Receipt attached — OCR will re-scan on save");
  }

  function save() {
    if (saved) return;
    setSaved(true);
    showToast("Expense updated in group ledger");
    setTimeout(() => {
      setSaved(false);
      navigate("/expense-details");
    }, 900);
  }

  return (
    <AppLayout>
      <div className="bg-background font-body-md text-on-surface antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
        <main className="w-full pt-4 pb-28 bg-background min-h-screen">
          <div className="max-w-[1100px] w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-1.5 text-xs text-outline pt-2 flex-wrap">
              <Link className="hover:text-primary transition-colors flex items-center gap-1" to="/expenses">
                <span className="material-symbols-outlined text-[16px]">receipt_long</span> Expenses
              </Link>
              <span className="material-symbols-outlined text-[14px] text-outline-variant">chevron_right</span>
              <Link className="hover:text-primary transition-colors" to="/expense-details">
                Palisades Alpine Chalet
              </Link>
              <span className="material-symbols-outlined text-[14px] text-outline-variant">chevron_right</span>
              <span className="text-on-surface font-semibold">Edit Expense</span>
            </div>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">edit</span>
                  </span>
                  <h1 className="font-headline-lg text-2xl lg:text-3xl font-extrabold tracking-tight">Edit Expense</h1>
                  <span className="px-2.5 py-1 rounded-full bg-[#fef3c7] text-[#92400e] text-xs font-bold border border-amber-200">#TH-EXP-402</span>
                </div>
                <p className="text-sm text-on-surface-variant mt-1">Amend the core outlay, receipt lines, and split rules — changes recalculate the whole ledger.</p>
              </div>
              <div className="flex items-center gap-2.5">
                <Link
                  to="/expense-details"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-bold border border-surface-container transition-colors"
                >
                  <span className="material-symbols-outlined text-[17px]">close</span>
                  Cancel
                </Link>
                <button
                  className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-on-primary text-xs font-bold shadow-sm transition-all ${
                    saved ? "bg-primary-container" : "bg-primary hover:bg-primary-container"
                  }`}
                  type="button"
                  onClick={save}
                >
                  <span className={`material-symbols-outlined text-[17px] ${saved ? "" : ""}`}>{saved ? "check_circle" : "save"}</span>
                  {saved ? "Saved!" : "Save Changes"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* LEFT: form fields */}
              <div className="lg:col-span-7 flex flex-col gap-5">
                {/* Core Outlay */}
                <section className="bg-surface-container-lowest rounded-3xl border border-surface-container p-5 sm:p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px] text-primary">receipt_long</span>
                    <h2 className="font-bold text-base">Core Outlay</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block font-label-caps text-[11px] text-outline uppercase tracking-wider mb-1 font-bold">Expense Title</label>
                      <input
                        className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-sm text-on-surface border border-transparent focus:border-primary-container focus:bg-surface-container-lowest focus:outline-none transition-all"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block font-label-caps text-[11px] text-outline uppercase tracking-wider mb-1 font-bold">Paid To / Merchant</label>
                      <input
                        className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-sm text-on-surface border border-transparent focus:border-primary-container focus:bg-surface-container-lowest focus:outline-none transition-all"
                        type="text"
                        value={merchant}
                        onChange={(e) => setMerchant(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block font-label-caps text-[11px] text-outline uppercase tracking-wider mb-1 font-bold">Date</label>
                      <input
                        className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-sm text-on-surface border border-transparent focus:border-primary-container focus:bg-surface-container-lowest focus:outline-none transition-all"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block font-label-caps text-[11px] text-outline uppercase tracking-wider mb-1 font-bold">Total Amount (INR)</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-2.5 text-on-surface-variant text-sm font-bold">₹</span>
                        <input
                          className="w-full pl-7 pr-3.5 py-2.5 rounded-xl bg-surface-container-low text-sm font-bold text-on-surface border border-transparent focus:border-primary-container focus:bg-surface-container-lowest focus:outline-none transition-all"
                          inputMode="decimal"
                          type="number"
                          value={total}
                          onChange={(e) => setTotal(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-label-caps text-[11px] text-outline uppercase tracking-wider mb-1 font-bold">Category</label>
                      <div className="flex flex-wrap gap-1.5">
                        {CATEGORIES.map((c) => {
                          const selected = category === c.id;
                          return (
                            <button
                              key={c.id}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                                selected
                                  ? "bg-primary text-on-primary border-primary"
                                  : "bg-surface-container-low text-on-surface-variant border-surface-container hover:bg-surface-container"
                              }`}
                              type="button"
                              onClick={() => setCategory(c.id)}
                            >
                              <span className="material-symbols-outlined text-[16px]">{c.icon}</span>
                              {c.id}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block font-label-caps text-[11px] text-outline uppercase tracking-wider mb-1 font-bold">Paid By</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {PAYERS.map((p) => {
                          const selected = payer.name === p.name;
                          return (
                            <button
                              key={p.name}
                              className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all ${
                                selected ? "bg-primary-fixed/30 border-primary-fixed" : "bg-surface-container-low border-surface-container hover:bg-surface-container"
                              }`}
                              type="button"
                              onClick={() => setPayer(p)}
                            >
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${p.avatarBg}`}>{p.short}</div>
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-on-surface truncate">{p.name}</div>
                                <div className="text-[10px] text-outline truncate">{p.method}</div>
                              </div>
                              {selected && <span className="material-symbols-outlined text-[16px] text-primary ml-auto">check_circle</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block font-label-caps text-[11px] text-outline uppercase tracking-wider mb-1 font-bold">Notes</label>
                      <textarea
                        className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-sm text-on-surface border border-transparent focus:border-primary-container focus:bg-surface-container-lowest focus:outline-none transition-all resize-none"
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </div>
                  </div>
                </section>

                {/* Receipt line items */}
                <section className="bg-surface-container-lowest rounded-3xl border border-surface-container p-5 sm:p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[20px] text-secondary">receipt</span>
                      <h2 className="font-bold text-base">Itemized Bill Lines</h2>
                    </div>
                    <span className="font-numeric-balance-md text-sm font-bold text-on-surface">{inr(safeTotal)}</span>
                  </div>

                  <div className="space-y-2">
                    {items.map((it, i) => (
                      <div key={i} className="flex items-center gap-2 bg-surface-container-low rounded-xl p-2.5 border border-surface-container">
                        <span className="text-lg shrink-0">{it.emoji}</span>
                        <input
                          className="flex-1 min-w-0 bg-transparent text-sm text-on-surface focus:outline-none"
                          type="text"
                          value={it.name}
                          onChange={(e) => updateItem(i, { name: e.target.value })}
                        />
                        <div className="relative shrink-0 w-32">
                          <span className="absolute left-2 top-2 text-xs text-outline font-bold">₹</span>
                          <input
                            className="w-full pl-5 pr-2 py-1.5 rounded-lg bg-surface-container-lowest text-xs font-bold text-on-surface border border-surface-container focus:outline-none text-right"
                            inputMode="decimal"
                            type="number"
                            value={it.amount}
                            onChange={(e) => updateItem(i, { amount: parseFloat(e.target.value) || 0 })}
                          />
                        </div>
                        <button
                          aria-label="Remove line"
                          className="w-7 h-7 rounded-lg text-outline hover:text-error hover:bg-error-container/30 flex items-center justify-center transition-colors shrink-0"
                          type="button"
                          onClick={() => removeItem(i)}
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors"
                      type="button"
                      onClick={addItem}
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span>
                      Add Line
                    </button>
                    <span className={`font-label-caps text-[11px] font-bold ${Math.abs(items.reduce((s, it) => s + it.amount, 0) - safeTotal) < 0.5 ? "text-primary" : "text-error"}`}>
                      Lines Σ {inr(items.reduce((s, it) => s + it.amount, 0))}
                    </span>
                  </div>

                  <div
                    className="border-2 border-dashed border-surface-container-highest rounded-2xl p-4 flex items-center justify-between gap-3 hover:bg-surface-container-low/60 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      handleReceiptFile(e.dataTransfer.files?.[0]);
                    }}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface-variant shrink-0">
                        <span className="material-symbols-outlined text-[20px]">attach_file</span>
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-on-surface truncate">{receiptName || "Attach updated receipt"}</div>
                        <div className="text-[11px] text-outline">Drop or click to replace • JPG, PNG or PDF</div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-primary-fixed/40 text-on-primary-fixed-variant text-[10px] font-bold uppercase tracking-wider shrink-0">
                      {receiptName ? "Attached" : "Upload"}
                    </span>
                    <input
                      className="hidden"
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleReceiptFile(e.target.files?.[0])}
                    />
                  </div>
                </section>

                {/* Split configuration */}
                <section className="bg-surface-container-lowest rounded-3xl border border-surface-container p-5 sm:p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[20px] text-primary">pie_chart</span>
                      <h2 className="font-bold text-base">Split Configuration</h2>
                    </div>
                    <span className="text-xs text-outline">Σ weights {weightSum.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center gap-1.5 p-1 bg-surface-container-low rounded-xl w-fit">
                    {SPLIT_MODES.map((m) => {
                      const selected = splitMode === m.id;
                      return (
                        <button
                          key={m.id}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            selected ? "bg-surface-container-lowest text-on-surface shadow-sm" : "text-outline hover:text-on-surface hover:bg-surface-container"
                          }`}
                          type="button"
                          onClick={() => (m.id === "equal" ? applyEqual() : m.id === "weights" ? applyWeights() : setSplitMode("amount"))}
                        >
                          <span className={`material-symbols-outlined text-[16px] ${selected ? "text-primary" : ""}`}>{m.icon}</span>
                          {m.label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="space-y-2">
                    {MEMBERS.map((m, i) => {
                      const row = shares[i];
                      return (
                        <div key={m.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-container-low border border-surface-container">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${m.avatarBg}`}>{m.short}</div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold text-on-surface truncate">{m.name}</div>
                            {splitMode === "amount" ? (
                              <div className="relative mt-1">
                                <span className="absolute left-2 top-1 text-[10px] text-outline font-bold">₹</span>
                                <input
                                  className="w-full pl-5 pr-2 py-1 rounded-lg bg-surface-container-lowest text-xs font-bold text-on-surface border border-surface-container focus:outline-none"
                                  inputMode="decimal"
                                  type="number"
                                  value={amounts[i]}
                                  onChange={(e) => setAmount(i, parseFloat(e.target.value) || 0)}
                                />
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 mt-1">
                                <input
                                  aria-label={`${m.name} weight`}
                                  className="flex-1 h-1.5 accent-emerald-600"
                                  max="3"
                                  min="0"
                                  step="0.05"
                                  type="range"
                                  disabled={splitMode === "equal"}
                                  value={weights[m.id] ?? 1.0}
                                  onChange={(e) => setWeight(m.id, parseFloat(e.target.value) || 0)}
                                />
                                <span className="text-[11px] font-bold text-on-surface-variant w-9 text-right">{(weights[m.id] ?? 1.0).toFixed(2)}×</span>
                              </div>
                            )}
                          </div>
                          <div className="text-right shrink-0 w-24">
                            <div className="font-numeric-balance-md text-sm font-bold text-primary">{inr(row.amount)}</div>
                            <div className="text-[10px] text-outline">{(row.pct * 100).toFixed(1)}%</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <label className="flex items-center gap-2 text-xs text-on-surface-variant cursor-pointer">
                    <input
                      className="accent-emerald-600 w-4 h-4"
                      type="checkbox"
                      checked={notify}
                      onChange={(e) => setNotify(e.target.checked)}
                    />
                    Notify all participants about this change
                  </label>
                </section>
              </div>

              {/* RIGHT: live summary rail */}
              <div className="lg:col-span-5 flex flex-col gap-4 lg:sticky lg:top-20">
                <div className="bg-surface-container-lowest rounded-3xl border border-surface-container p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base">Allocation Preview</h3>
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${Math.abs(remaining) < 0.5 ? "bg-[#e8f7f0] text-primary" : "bg-[#fef3c7] text-amber-800"}`}>
                      {Math.abs(remaining) < 0.5 ? "Fully Balanced" : `${inr(Math.abs(remaining))} ${remaining > 0 ? "unallocated" : "over"}`}
                    </span>
                  </div>

                  <div className="text-center py-2">
                    <div className="text-[11px] uppercase font-bold tracking-wider text-outline">Total Expense</div>
                    <div className="font-display-hero text-4xl font-extrabold tracking-tight">{inr(safeTotal)}</div>
                    <div className="text-xs text-outline mt-1">{MEMBERS.length} participants • {(matchedPct).toFixed(0)}% allocated</div>
                  </div>

                  <div className="space-y-1.5 pt-1 border-t border-surface-container">
                    {shares.map((r) => (
                      <div key={r.id} className="flex items-center justify-between text-xs py-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 ${r.avatarBg}`}>{r.short}</div>
                          <span className="text-on-surface font-medium truncate">{r.name}</span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-numeric-balance-md text-xs font-bold text-on-surface">{inr(r.amount)}</span>
                          <span className="text-[10px] text-outline ml-1.5">{(r.pct * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  className={`w-full py-3.5 px-4 rounded-2xl text-on-primary text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 ${
                    saved ? "bg-primary-container" : "bg-primary hover:bg-primary-container"
                  }`}
                  type="button"
                  onClick={save}
                >
                  <span className="material-symbols-outlined text-[18px]">{saved ? "check_circle" : "save"}</span>
                  {saved ? "Changes Saved" : "Save Changes to Ledger"}
                </button>
                <Link
                  to="/split-expense"
                  className="w-full py-2.5 px-4 rounded-xl bg-surface-container-lowest border border-surface-container-high text-on-surface text-xs font-semibold hover:bg-surface-container transition-colors flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">tune</span>
                  Open Advanced Weight Console
                </Link>
              </div>
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