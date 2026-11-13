import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";

const TOTAL = 99600;
const SHARE = 16600;

const inr = (n) => `₹${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const MEMBERS = [
  { id: "alex", initials: "AM", name: "Alex Morgan", role: `Paid ${inr(TOTAL)} • Share ${inr(SHARE)}`, current: 83000, after: 0, afterNote: `−${inr(83000)} removed`, avatar: "bg-primary-fixed text-on-primary-fixed", you: true },
  { id: "marco", initials: "MR", name: "Marco Rossi", role: `Equal 1/6 Share (${inr(SHARE)})`, current: 0, after: SHARE, paid: "Paid via Chase", avatar: "bg-secondary-fixed text-on-secondary-fixed" },
  { id: "sarah", initials: "SL", name: "Sarah Lin", role: `Equal 1/6 Share (${inr(SHARE)})`, current: 0, after: SHARE, paid: "Paid via ApplePay", avatar: "bg-primary-fixed text-on-primary-fixed" },
  { id: "kim", initials: "KS", name: "Kim Sato", role: `Equal 1/6 Share (${inr(SHARE)})`, current: 0, after: SHARE, paid: "Settled in group", avatar: "bg-surface-container-high text-on-surface" },
  { id: "jason", initials: "JP", name: "Jason Powell", role: `Equal 1/6 Share (${inr(SHARE)})`, current: 0, after: SHARE, paid: "Settled in group", avatar: "bg-secondary-fixed text-on-secondary-fixed" },
  { id: "taylor", initials: "TE", name: "Taylor Evans", role: "Not a participant", current: 0, after: 0, afterNote: "No impact", avatar: "bg-surface-container text-outline", neutral: true },
];

const REASONS = [
  { id: "cancelled", label: "Cancelled Booking / Refunded by Palisades Chalet Host" },
  { id: "duplicate", label: "Duplicate Entry (Already logged by another member)" },
  { id: "incorrect_split", label: "Entered Incorrectly / Recreating with Correct Amounts" },
  { id: "wrong_group", label: "Wrong Outlay Group (Moved to different trip)" },
  { id: "other", label: "Other Ledger Balancing Adjustment" },
];

export default function DeleteExpense() {
  const navigate = useNavigate();
  const [strategy, setStrategy] = useState("auto_credit");
  const [reason, setReason] = useState("cancelled");
  const [ack, setAck] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [toast, setToast] = useState(null);

  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(null), 2800);
  }

  const canDelete = ack && !deleting && !deleted;

  const netLabel = useMemo(() => (strategy === "auto_credit" ? "Ledger credit issued" : "Direct payout task queued"), [strategy]);

  function handleDelete() {
    if (!canDelete) return;
    setDeleting(true);
    setTimeout(() => {
      setDeleting(false);
      setDeleted(true);
      showToast("Expense deleted — ledger reversed");
      setTimeout(() => navigate("/group-expenses"), 1000);
    }, 800);
  }

  return (
    <AppLayout>
      <div className="bg-background font-body-md text-on-surface antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
        <main className="w-full pt-4 pb-16 bg-background min-h-screen">
          <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-2">
            {/* Breadcrumbs & Quick Alternative */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5 pt-2">
              <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-outline flex-wrap">
                <Link className="hover:text-primary transition-colors flex items-center gap-1" to="/expenses">
                  <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                  Expenses
                </Link>
                <span className="material-symbols-outlined text-[14px] text-outline-variant">chevron_right</span>
                <Link className="hover:text-primary transition-colors flex items-center gap-1 font-semibold text-on-surface" to="/groups">
                  <span>Tahoe Ski Weekend</span>
                  <span>❄️</span>
                </Link>
                <span className="material-symbols-outlined text-[14px] text-outline-variant">chevron_right</span>
                <span className="text-tertiary font-semibold bg-tertiary-fixed/60 px-2.5 py-0.5 rounded-full text-on-tertiary-fixed flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">delete</span>
                  Delete Expense
                </span>
              </nav>
              <div className="inline-flex items-center gap-2 bg-surface-container-lowest border border-surface-container px-3 py-1.5 rounded-xl shadow-sm text-on-surface-variant self-start md:self-auto">
                <span className="material-symbols-outlined text-secondary text-[18px]">info</span>
                <span className="text-xs">
                  Need adjustments? Use{" "}
                  <Link className="text-secondary font-semibold hover:underline" to="/expense-edit">
                    Edit Expense
                  </Link>{" "}
                  to alter splits instead.
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* LEFT RAIL */}
              <section className="lg:col-span-7 flex flex-col gap-5">
                {/* Transaction Summary */}
                <div className="bg-surface-container-lowest rounded-3xl p-5 sm:p-6 shadow-sm border border-surface-container/80 relative overflow-hidden">
                  <div className="absolute -right-16 -top-16 w-44 h-44 bg-surface-container-low rounded-full pointer-events-none blur-2xl opacity-60" />
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5 pb-5 border-b border-surface-container/60">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center text-[28px] shadow-sm shrink-0">🏡</div>
                      <div>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-label-caps text-[11px] text-outline uppercase tracking-wider mb-1">
                          <span className="font-semibold text-on-surface-variant">Tahoe Ski Weekend ❄️</span>
                          <span>•</span>
                          <span className="bg-surface-container-high px-2 py-0.5 rounded-md text-on-surface">Lodging</span>
                          <span>•</span>
                          <span>Feb 14, 2025</span>
                        </div>
                        <h1 className="font-headline-md text-[22px] sm:text-[24px] font-bold leading-tight">Palisades Alpine Chalet &amp; Loft Rental</h1>
                        <p className="text-[13px] text-outline mt-0.5">Original transaction logged via Tahoe Cabin Treasury Tab</p>
                      </div>
                    </div>
                    <div className="sm:text-right bg-surface-container-low sm:bg-transparent p-3 sm:p-0 rounded-2xl shrink-0">
                      <span className="font-label-caps text-[11px] uppercase text-outline tracking-wider block">Total Billed Amount</span>
                      <span className="font-numeric-balance-lg text-[28px] sm:text-[32px] font-bold tracking-tight block">{inr(TOTAL)}</span>
                      <span className="text-[11px] font-medium text-outline block">INR • Paid in full</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-5">
                    <div className="bg-surface-container-low/80 rounded-2xl p-3 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-[13px] shadow-sm shrink-0">AM</div>
                      <div className="min-w-0">
                        <span className="font-label-caps text-[10px] uppercase text-outline block leading-none mb-1">Paid by (Source)</span>
                        <span className="text-[13px] text-on-surface truncate block font-semibold">Alex Morgan</span>
                        <span className="text-[11px] text-outline">Chase Sapphire (•• 4821)</span>
                      </div>
                    </div>
                    <div className="bg-surface-container-low/80 rounded-2xl p-3 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-surface-container-highest text-primary flex items-center justify-center shadow-sm shrink-0">
                        <span className="material-symbols-outlined text-[20px]">check_circle</span>
                      </div>
                      <div className="min-w-0">
                        <span className="font-label-caps text-[10px] uppercase text-outline block leading-none mb-1">Settlement Status</span>
                        <span className="text-[13px] text-primary truncate block font-semibold">Reconciled</span>
                        <span className="text-[11px] text-outline">0 Unpaid debits</span>
                      </div>
                    </div>
                    <div className="bg-surface-container-low/80 rounded-2xl p-3 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-secondary-fixed text-on-secondary-fixed-variant flex items-center justify-center shadow-sm shrink-0">
                        <span className="material-symbols-outlined text-[20px]">groups</span>
                      </div>
                      <div className="min-w-0">
                        <span className="font-label-caps text-[10px] uppercase text-outline block leading-none mb-1">Participant Pool</span>
                        <span className="text-[13px] text-on-surface truncate block font-semibold">5 Members</span>
                        <span className="text-[11px] text-outline">{inr(83000)} collected</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-surface-container/60 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-outline">
                        <span className="material-symbols-outlined text-[16px]">verified_user</span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-label-caps text-[11px] uppercase tracking-wider text-outline">Receipt Folio:</span>
                        <span className="font-numeric-balance-md text-[12px] bg-surface-container px-2 py-0.5 rounded-md font-semibold text-on-surface">#TH-EXP-402</span>
                        <span className="inline-flex items-center gap-1 font-label-caps text-[11px] text-primary bg-primary-fixed/40 px-2 py-0.5 rounded-md">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          SHA-256 Verified
                        </span>
                      </div>
                    </div>
                    <button
                      className="inline-flex items-center gap-1 text-xs font-semibold text-secondary hover:text-on-secondary-fixed-variant bg-surface-container hover:bg-surface-container-high px-3 py-1.5 rounded-xl transition-colors"
                      type="button"
                      onClick={() => showToast("Opening PDF proof #TH-EXP-402")}
                    >
                      <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
                      Preview PDF Proof
                    </button>
                  </div>
                </div>

                {/* Balance Reversal Matrix */}
                <div className="bg-surface-container-lowest rounded-3xl p-5 sm:p-6 shadow-sm border border-surface-container/80">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-surface-container/60 gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[22px]">swap_horiz</span>
                        <h2 className="font-headline-sm text-[18px] sm:text-[20px] font-bold">Balance Reversal Matrix &amp; Netting Impact</h2>
                      </div>
                      <p className="text-[13px] text-outline mt-0.5">Pre-execution audit simulation of all 6 group accounts before and after voiding.</p>
                    </div>
                    <div className="inline-flex p-1 bg-surface-container-low rounded-2xl self-start sm:self-auto border border-surface-container shrink-0">
                      <button
                        className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${strategy === "auto_credit" ? "bg-surface-container-lowest text-on-surface shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}
                        type="button"
                        onClick={() => setStrategy("auto_credit")}
                      >
                        Pool Credit
                      </button>
                      <button
                        className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${strategy === "direct" ? "bg-surface-container-lowest text-on-surface shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}
                        type="button"
                        onClick={() => setStrategy("direct")}
                      >
                        Direct Payout
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 overflow-x-auto">
                    <div className="min-w-[580px] flex flex-col gap-2">
                      <div className="grid grid-cols-12 px-3 py-1 font-label-caps text-[11px] uppercase text-outline tracking-wider">
                        <div className="col-span-5">Member &amp; Expense Role</div>
                        <div className="col-span-3 text-right">Current Ledger</div>
                        <div className="col-span-1 text-center" />
                        <div className="col-span-3 text-right">After Reversal Net</div>
                      </div>
                      {MEMBERS.map((m) => (
                        <div
                          key={m.id}
                          className={`grid grid-cols-12 items-center rounded-2xl px-4 py-2.5 transition-colors border ${
                            m.neutral
                              ? "bg-surface-container-low/40 opacity-60 border-surface-container/30"
                              : m.you
                                ? "bg-surface-container-low/70 hover:bg-surface-container-low border-surface-container/40"
                                : "bg-surface-container-lowest hover:bg-surface-container-low/40 border-surface-container/30"
                          }`}
                        >
                          <div className="col-span-5 flex items-center gap-2.5 min-w-0">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${m.avatar}`}>{m.initials}</div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className={`text-[13px] leading-tight truncate ${m.you ? "font-bold text-on-surface" : "font-semibold text-on-surface"}`}>{m.name}</span>
                                {m.you && <span className="text-[10px] bg-primary/10 text-primary font-bold px-1.5 py-0.5 rounded shrink-0">YOU</span>}
                              </div>
                              <span className="text-[11px] text-outline block truncate">{m.role}</span>
                            </div>
                          </div>
                          <div className="col-span-3 text-right">
                            <span className={`font-numeric-balance-md text-sm ${m.you ? "text-primary font-bold" : m.neutral ? "text-outline" : "text-on-surface font-medium"}`}>
                              {m.you ? "+" : ""}
                              {inr(m.current)}
                            </span>
                            <span className="block text-[10px] text-outline">{m.you ? "Credit balance" : m.paid || "Neutral"}</span>
                          </div>
                          <div className="col-span-1 flex justify-center text-outline">
                            <span className="material-symbols-outlined text-[18px]">{m.neutral ? "remove" : "arrow_right_alt"}</span>
                          </div>
                          <div className="col-span-3 text-right">
                            <span className={`font-numeric-balance-md text-sm font-bold ${m.neutral ? "text-outline" : m.you ? "text-tertiary" : "text-primary"}`}>
                              {m.after > 0 ? `+${inr(m.after)}` : inr(m.after)}
                            </span>
                            <span className={`block text-[10px] font-medium ${m.neutral ? "text-outline" : m.you ? "text-tertiary" : "text-primary"}`}>
                              {m.you ? m.afterNote : m.neutral ? m.afterNote : netLabel}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 p-3 rounded-2xl bg-surface-container-low flex items-center justify-between text-xs text-on-surface-variant flex-wrap gap-2">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-primary text-[16px]">balance</span>
                      Zero-Sum Check: <strong className="text-on-surface">Balanced (₹0.00 delta)</strong>
                    </span>
                    <span className="font-label-caps text-[10px] uppercase text-outline">Cryptographic Netting Engine</span>
                  </div>
                </div>
              </section>

              {/* RIGHT RAIL */}
              <aside className="lg:col-span-5 flex flex-col gap-5">
                <div className="bg-gradient-to-br from-tertiary-fixed/70 via-tertiary-fixed/30 to-surface-container-lowest border border-tertiary-fixed rounded-3xl p-5 sm:p-6 shadow-sm">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-tertiary text-on-tertiary flex items-center justify-center shrink-0 shadow-sm">
                        <span className="material-symbols-outlined text-[22px]">gavel</span>
                      </div>
                      <div>
                        <span className="font-label-caps text-[10px] uppercase text-tertiary font-bold tracking-widest block">Security Protocol</span>
                        <h2 className="font-headline-sm text-[18px] font-bold text-on-tertiary-fixed leading-tight">Zero-Sum Guardrail Active</h2>
                      </div>
                    </div>
                    <span className="font-label-caps text-[10px] uppercase px-2 py-0.5 rounded-full bg-tertiary text-on-tertiary font-bold tracking-wider shrink-0">Critical</span>
                  </div>
                  <p className="text-[13px] text-on-tertiary-container mt-2 leading-relaxed">
                    Deleting this record will immediately reverse all ledger allocations across <strong className="text-tertiary font-semibold">5 participants</strong>. This action is permanently committed to the immutable event log and cannot be undone.
                  </p>
                </div>

                <div className="bg-surface-container-lowest rounded-3xl p-5 sm:p-6 shadow-sm border border-surface-container/80 flex flex-col gap-5">
                  <div>
                    <label className="text-[14px] text-on-surface font-bold block mb-1">Resolution Handling Strategy</label>
                    <p className="text-xs text-outline mb-3">Specify how reimbursed funds should be distributed back to members:</p>
                    <div className="space-y-2.5">
                      <button
                        className={`w-full flex items-start gap-3 p-3 rounded-2xl border-2 text-left transition-all ${strategy === "auto_credit" ? "bg-surface-container-low border-primary" : "bg-surface-container-low/50 border-transparent hover:bg-surface-container-low"}`}
                        type="button"
                        onClick={() => setStrategy("auto_credit")}
                      >
                        <span className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${strategy === "auto_credit" ? "border-primary" : "border-outline"}`}>
                          {strategy === "auto_credit" && <span className="w-2 h-2 rounded-full bg-primary" />}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[13px] font-bold text-on-surface flex items-center gap-1">
                              Automatic Group Credit
                              <span className="material-symbols-outlined text-primary text-[16px]">verified</span>
                            </span>
                            <span className="text-[10px] uppercase font-bold text-primary bg-primary-fixed/50 px-1.5 py-0.5 rounded shrink-0">Recommended</span>
                          </div>
                          <p className="text-[11.5px] text-on-surface-variant mt-0.5 leading-snug">
                            Offset next expenses for Marco, Sarah, Kim, and Jason automatically in Tahoe Ski Weekend.
                          </p>
                        </div>
                      </button>
                      <button
                        className={`w-full flex items-start gap-3 p-3 rounded-2xl border-2 text-left transition-all ${strategy === "direct" ? "bg-surface-container-low border-primary" : "bg-surface-container-low/50 border-transparent hover:bg-surface-container-low"}`}
                        type="button"
                        onClick={() => setStrategy("direct")}
                      >
                        <span className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${strategy === "direct" ? "border-primary" : "border-outline"}`}>
                          {strategy === "direct" && <span className="w-2 h-2 rounded-full bg-primary" />}
                        </span>
                        <div className="flex-1 min-w-0">
                          <span className="text-[13px] font-bold text-on-surface block">Direct Reimbursement Log</span>
                          <p className="text-[11.5px] text-outline mt-0.5 leading-snug">
                            Marks pending offline repayments. Prompts you to Venmo/Zelle {inr(SHARE)} to each of the 4 participants.
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-bold text-on-surface mb-1" htmlFor="delete-reason">
                      Audit Reason for Deletion <span className="text-tertiary">*</span>
                    </label>
                    <div className="relative">
                      <select
                        className="w-full bg-surface-container-low text-[13px] text-on-surface rounded-xl px-3.5 py-2.5 appearance-none focus:outline-none focus:ring-2 focus:ring-primary-container border border-surface-container transition-colors pr-9"
                        id="delete-reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                      >
                        {REASONS.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.label}
                          </option>
                        ))}
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-2.5 text-outline pointer-events-none text-[20px]">expand_more</span>
                    </div>
                  </div>

                  <div className="h-px bg-surface-container/80" />

                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-1.5 text-tertiary text-[13px] font-semibold">
                      <span className="material-symbols-outlined text-[18px]">verified</span>
                      <span>Security Authorization Required</span>
                    </div>

                    <div className="p-3 bg-surface-container-low/70 rounded-2xl border border-surface-container/60">
                      <label className="flex items-start gap-2.5 cursor-pointer select-none">
                        <input className="mt-0.5 w-4 h-4 rounded accent-primary cursor-pointer" type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} />
                        <span className="text-xs text-on-surface leading-tight">
                          I understand that deleting this expense alters the Tahoe Ski Weekend ledger total and archives receipt proof.
                        </span>
                      </label>
                    </div>

                    <div className="flex flex-col gap-2 pt-1">
                      <button
                        className={`w-full py-3 px-4 rounded-2xl text-sm flex items-center justify-center gap-2 transition-all ${
                          deleted
                            ? "bg-primary-container text-on-primary-container"
                            : canDelete
                              ? "bg-tertiary hover:brightness-105 text-on-tertiary shadow-lg shadow-tertiary/25 active:scale-[0.99] font-bold cursor-pointer"
                              : "opacity-40 cursor-not-allowed bg-tertiary-fixed text-on-tertiary-container"
                        }`}
                        disabled={!canDelete}
                        type="button"
                        onClick={handleDelete}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {deleting ? "progress_activity" : deleted ? "check_circle" : canDelete ? "delete_forever" : "lock"}
                        </span>
                        <span>{deleted ? "Expense Deleted!" : deleting ? "Reversing Ledger…" : "Permanently Delete Expense"}</span>
                      </button>
                      <Link
                        className="w-full py-2.5 px-4 rounded-2xl text-[13px] text-on-surface bg-surface-container-low hover:bg-surface-container text-center flex items-center justify-center gap-1.5 transition-colors font-semibold"
                        to="/expense-details"
                      >
                        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                        Keep Expense &amp; Return
                      </Link>
                    </div>
                  </div>

                  <div className="pt-1 text-center">
                    <span className="text-[11px] text-outline block">
                      Session Token:{" "}
                      <code className="font-numeric-balance-md text-[10.5px] bg-surface-container px-1.5 py-0.5 rounded text-on-surface-variant">tx_98f420c_lodging_reconciled</code>
                    </span>
                  </div>
                </div>
              </aside>
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