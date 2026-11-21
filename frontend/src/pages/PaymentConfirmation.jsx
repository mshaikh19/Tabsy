import { useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import Breadcrumbs from "../components/layout/Breadcrumbs";
import { BALANCES_TABS } from "../constants/balancesNav";

const RUPEE = "₹";
const inr = (n) => RUPEE + Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const inr0 = (n) => RUPEE + Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });

const TABS = BALANCES_TABS;

const GROUP_TOTAL = 102920;
const TRANSFER = 10665.5;
const CABIN = 7055;
const SKI = 3610.5;

const ITEMS = [
  { id: "cabin", icon: "cottage", name: "Tahoe Cabin Deposit", sub: "Split equally (1/8 share) • Jan 14", amount: CABIN, iconCls: "text-primary" },
  { id: "ski", icon: "downhill_skiing", name: "Ski Pass & Groceries", sub: "Custom Share (Safeway + Epic) • Jan 16", amount: SKI, iconCls: "text-secondary" },
];

const PEERS = [
  { id: "sarah", name: "Sarah Lin", initials: "SL", sub: "Lodge firewood split", amount: 4648, action: "NUDGE", avatar: "bg-buttercup-100 text-buttercup-700" },
  { id: "jason", name: "Jason Wu", initials: "JW", sub: "Rental SUV chains", amount: 9462, action: "SETTLE", avatar: "bg-lilac-100 text-lilac-700" },
];

const CHECKS = [
  { id: "bank", title: "Funds verified in bank or UPI account", sub: "UPI ref #UPI-993810 settled to HDFC account ending ••4091" },
  { id: "split", title: "Split items and ledger debits audited", sub: "Cabin deposit and ski passes reconcile to receipt total without remainder" },
  { id: "zero", title: "Bilateral zeroing & audit lock authorized", sub: "Signs zero-balance transition between Alex Chen and Marcus Vance" },
];

const REACTIONS = ["🙌 High Five! All sorted", "☕ Next round on me", "⛷️ Ski legend"];

const BARS = [3, 1, 2, 4, 1, 3, 2, 1, 3, 4, 2, 1, 3, 1, 2, 4, 1, 2, 3, 1, 2, 4, 2];

const UNWIND = [
  { step: "1. Before Sign-off", sub: "Marcus owes Alex", value: `+${inr(TRANSFER)}`, cls: "bg-surface-container-low border-surface-container text-primary" },
  { step: "2. Cleared via UPI", sub: "Inbound credit applied", value: `+${inr(TRANSFER)}`, cls: "bg-surface-container-low border-surface-container text-secondary" },
  { step: "3. Neutral Harmony", sub: "Zero debt remaining", value: inr(0), cls: "bg-matcha-50 border-matcha-200 text-primary" },
];

export default function PaymentConfirmation() {
  const [checks, setChecks] = useState({ bank: true, split: true, zero: true });
  const [phase, setPhase] = useState("idle");
  const [reaction, setReaction] = useState("");
  const [copied, setCopied] = useState(false);
  const [flagged, setFlagged] = useState(false);

  const allChecked = checks.bank && checks.split && checks.zero;

  function toggle(id) {
    setChecks((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function confirm() {
    if (!allChecked || phase !== "idle") return;
    setPhase("working");
    setTimeout(() => setPhase("done"), 900);
  }

  function reset() {
    setPhase("idle");
    setChecks({ bank: true, split: true, zero: true });
    setReaction("");
  }

  function copyProof() {
    navigator.clipboard?.writeText("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function flagSplit() {
    setFlagged(true);
    setTimeout(() => setFlagged(false), 2600);
  }

  return (
    <AppLayout>
      <main className="w-full min-h-screen overflow-x-clip">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumbs
            items={[
              { label: "Balances", to: "/balances", icon: "account_balance_wallet" },
              { label: "Settle Up", to: "/settle-up" },
              { label: "Payment Confirmation" },
            ]}
            status={{ label: "Secure Ledger Node #98124", note: "Receiver sign-off pending" }}
          />

          {/* Page header — GroupHeader-style card */}
          <div className="relative overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm shadow-zinc-900/5 border border-outline-variant/60 w-full px-4 py-3.5 sm:px-5 mb-5">
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              <div className="flex flex-col gap-1.5 min-w-0">
                <div className="flex items-center flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded-full bg-primary-fixed/40 text-on-primary-fixed-variant font-label-caps text-label-caps uppercase flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" />
                    Bilateral Clearing Desk
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-buttercup-100 border border-buttercup-200 text-buttercup-700 font-label-caps text-label-caps uppercase font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-buttercup-700 animate-ping" />
                    Inbound Receiver Sign-off Required
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface font-label-caps text-label-caps font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">lock</span>
                    Secure Ledger
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-on-surface tracking-tight leading-none">Payment Confirmation</h1>
                <p className="font-body-sm text-body-sm text-on-surface-variant max-w-2xl leading-snug">
                  Dual-signature attestation for the Tahoe Ski Trip 2025 inbound transfer — verify, sign and lock the ledger.
                </p>
              </div>
            </div>

            {/* Sub-nav row (inside card) */}
            <div className="relative z-10 mt-3 pt-3 border-t border-surface-container flex items-center gap-1.5 overflow-x-auto">
              {TABS.map((t) => {
                const cls = `px-3.5 py-2 rounded-xl font-title-md text-xs flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  t.id === "settle" ? "bg-matcha-100 text-matcha-800 font-bold shadow-sm" : "text-on-surface-variant hover:bg-surface-container font-semibold"
                }`;
                const inner = (
                  <>
                    <span className="material-symbols-outlined text-base" style={t.id === "settle" ? { fontVariationSettings: "'FILL' 1" } : undefined}>{t.icon}</span>
                    <span>{t.label}</span>
                    {t.badge && <span className="bg-peach-100 text-tertiary text-[10px] font-bold px-1.5 py-0.5 rounded-full">{t.badge}</span>}
                  </>
                );
                return t.to ? (
                  <Link key={t.id} to={t.to} className={cls}>{inner}</Link>
                ) : (
                  <span key={t.id} className={cls}>{inner}</span>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* ============ COLUMN 1 ============ */}
            <aside className="lg:col-span-3 min-w-0 flex flex-col gap-4">
              {/* Group settle health */}
              <div className="bg-surface-container-lowest border border-surface-container rounded-3xl p-5 shadow-sm">
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-surface-container">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary-container shrink-0" />
                    <h3 className="font-title-md text-[15px] font-bold text-on-surface break-words">Group Settle Health</h3>
                  </div>
                  <span className="text-[11px] font-bold font-label-caps uppercase text-primary bg-matcha-50 px-2 py-0.5 rounded-md shrink-0">Realtime</span>
                </div>
                <div className="py-4 flex flex-col items-center">
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    <svg className="w-36 h-36 -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15.9155" fill="none" stroke="var(--color-surface-container)" strokeWidth="3.4" />
                      <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#c0c1ff" strokeWidth="3.4" strokeDasharray="90 100" strokeLinecap="round" />
                      <circle cx="18" cy="18" r="15.9155" fill="none" stroke="var(--color-primary-container)" strokeWidth="3.4" strokeDasharray="100 100" strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-[24px] font-extrabold text-on-surface leading-none">100%</span>
                      <span className="font-label-caps text-[10px] uppercase font-bold text-primary mt-1">Full Clear</span>
                    </div>
                  </div>
                  <div className="mt-2 text-center">
                    <div className="text-base font-extrabold font-mono text-on-surface">{inr0(GROUP_TOTAL)} <span className="text-on-surface-variant font-normal text-xs">/ {inr0(GROUP_TOTAL)}</span></div>
                    <p className="text-xs text-on-surface-variant mt-0.5">8 friends • 14 expenses reconciled</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-surface-container">
                  <div className="bg-surface-container-low p-2.5 rounded-2xl text-center">
                    <span className="font-label-caps text-[10px] uppercase text-on-surface-variant block font-bold">Unsettled</span>
                    <span className="text-[15px] font-bold text-primary font-mono">{inr(0)}</span>
                  </div>
                  <div className="bg-surface-container-low p-2.5 rounded-2xl text-center">
                    <span className="font-label-caps text-[10px] uppercase text-on-surface-variant block font-bold">Disputes</span>
                    <span className="text-[15px] font-bold text-on-surface">0 open</span>
                  </div>
                </div>
              </div>

              {/* Inbound rail */}
              <div className="bg-surface-container-lowest border border-surface-container rounded-3xl p-5 shadow-sm">
                <div className="flex items-center justify-between gap-2 pb-3">
                  <span className="font-label-caps text-[11px] uppercase text-primary font-bold tracking-wider">Inbound Rail</span>
                  <span className="px-2 py-0.5 rounded-md bg-secondary-fixed text-secondary font-label-caps text-[11px] font-bold shrink-0">UPI Instant</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-surface-container-low border border-surface-container">
                  <div className="w-11 h-11 rounded-full bg-matcha-100 text-matcha-800 flex items-center justify-center font-label-caps text-xs font-bold shrink-0">MV</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[15px] font-bold text-on-surface break-words">Marcus Vance</div>
                    <div className="text-xs text-on-surface-variant break-words">@marcus_v • Tahoe 2025</div>
                  </div>
                  <span className="material-symbols-outlined text-primary text-[20px] shrink-0">check_circle</span>
                </div>
                <div className="mt-3 p-3 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="material-symbols-outlined text-pastel-sky-deep text-[18px] shrink-0">bolt</span>
                    <div className="min-w-0">
                      <span className="font-label-caps text-[10px] text-pastel-sky-deep uppercase font-bold block">Turnaround Velocity</span>
                      <span className="text-[13px] font-bold text-on-surface">1.2 Days Average</span>
                    </div>
                  </div>
                  <span className="font-label-caps text-[10px] bg-surface-container-lowest text-pastel-sky-deep font-bold px-2 py-1 rounded-full border border-sky-200 shrink-0">Fastest 5%</span>
                </div>
                <div className="mt-3 flex items-center justify-between gap-2 text-xs text-on-surface-variant font-mono pt-2 border-t border-surface-container">
                  <span>Channel ID:</span>
                  <span className="font-bold text-on-surface break-all">UPI-993810</span>
                </div>
              </div>

              {/* Peer triage */}
              <div className="bg-surface-container-lowest border border-surface-container rounded-3xl p-5 shadow-sm">
                <div className="flex items-center justify-between gap-2 pb-3">
                  <h4 className="font-title-md text-[14px] font-bold text-on-surface break-words">Household Peer Triage</h4>
                  <span className="font-label-caps text-[10px] text-on-surface-variant uppercase font-bold shrink-0">2 Other Pending</span>
                </div>
                <div className="flex flex-col gap-2.5">
                  {PEERS.map((p) => (
                    <div key={p.id} className="p-2.5 rounded-2xl bg-surface-container-low border border-surface-container flex items-center justify-between gap-2 hover:bg-surface-container transition-all">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-label-caps text-xs font-bold shrink-0 ${p.avatar}`}>{p.initials}</div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-on-surface break-words">{p.name}</div>
                          <div className="text-[11px] text-on-surface-variant break-words">{p.sub}</div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-tertiary font-mono block">−{inr0(p.amount)}</span>
                        <button type="button" className="font-label-caps text-[10px] text-primary hover:underline font-bold mt-0.5">{p.action}</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            {/* ============ COLUMN 2 ============ */}
            <section className="lg:col-span-6 min-w-0 flex flex-col gap-4">
              {/* Attestation console */}
              <div className="bg-surface-container-lowest border border-surface-container rounded-3xl p-5 sm:p-7 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary-container" />

                <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-matcha-50 border border-matcha-200">
                    <span className="w-2 h-2 rounded-full bg-primary-container" />
                    <span className="font-label-caps text-[11px] text-primary uppercase font-bold tracking-wider">Inbound Settle Console</span>
                  </div>
                  <div className="text-xs text-on-surface-variant">
                    Ref: <span className="font-mono font-bold text-on-surface">TAB-THO-882</span>
                  </div>
                </div>

                {/* Hero amount */}
                <div className="text-center py-5 bg-surface-container-low rounded-2xl border border-surface-container mb-5">
                  <span className="font-label-caps text-[11px] uppercase tracking-widest text-on-surface-variant block font-bold mb-1 break-words">Transfer Amount Under Review</span>
                  <div className="flex items-baseline justify-center gap-1.5 flex-wrap">
                    <span className="text-xl font-extrabold text-on-surface">{RUPEE}</span>
                    <span className="text-[44px] sm:text-[52px] leading-none font-extrabold text-on-surface tracking-tight font-mono break-all">
                      {Number(TRANSFER).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 mt-3 px-3.5 py-1 rounded-full bg-matcha-50 text-matcha-800 border border-matcha-200 font-semibold text-xs">
                    <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
                    Exact Split Balance Match
                  </div>
                </div>

                {/* Sender note */}
                <div className="p-4 rounded-2xl bg-buttercup-50 border border-buttercup-200 flex items-start gap-3 mb-5">
                  <span className="material-symbols-outlined text-buttercup-700 text-[20px] mt-0.5 shrink-0">chat_bubble</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="font-label-caps text-[10px] text-buttercup-700 uppercase font-bold tracking-wider">Sender Note from Marcus</span>
                      <span className="text-[11px] text-buttercup-700">Today 2:44 PM</span>
                    </div>
                    <p className="text-sm font-medium italic mt-0.5 text-on-surface break-words">"Thanks for organizing the lodge, Alex! Epic trip."</p>
                  </div>
                </div>

                {/* Itemized allocation */}
                <div className="mb-5">
                  <div className="flex items-center justify-between gap-2 mb-2.5 flex-wrap">
                    <span className="font-label-caps text-[11px] text-on-surface-variant uppercase font-bold tracking-wider">Itemized Bill Allocation ({ITEMS.length} items)</span>
                    <span className="font-label-caps text-[11px] text-secondary font-bold">View OCR Receipts ({ITEMS.length})</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {ITEMS.map((it) => (
                      <div key={it.id} className="p-3.5 rounded-2xl bg-surface-container-low border border-surface-container flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-9 h-9 rounded-xl bg-surface-container-lowest border border-surface-container flex items-center justify-center shadow-sm shrink-0 ${it.iconCls}`}>
                            <span className="material-symbols-outlined text-[20px]">{it.icon}</span>
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[14px] font-bold text-on-surface break-words">{it.name}</span>
                              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-lilac-100 text-lilac-700 font-semibold shrink-0">OCR-PASS</span>
                            </div>
                            <span className="text-xs text-on-surface-variant block break-words">{it.sub}</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-base font-extrabold text-on-surface font-mono block">{inr(it.amount)}</span>
                          <span className="font-label-caps text-[10px] text-primary block font-bold">Cleared</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Attestation matrix */}
                <div className="p-4 rounded-2xl bg-[#faf8ff] border border-surface-container mb-6">
                  <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                    <span className="font-label-caps text-[11px] uppercase tracking-wider text-on-surface font-bold">Dual-Attestation Checkbox Matrix</span>
                    <span className={`font-label-caps text-[10px] font-bold ${allChecked ? "text-primary" : "text-buttercup-700"}`}>
                      {Object.values(checks).filter(Boolean).length}/3 Required
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    {CHECKS.map((c) => (
                      <label key={c.id} className="flex items-start gap-3 cursor-pointer select-none group p-2 rounded-xl hover:bg-surface-container-low transition-colors">
                        <input
                          type="checkbox"
                          className="mt-0.5 w-4 h-4 rounded accent-primary shrink-0"
                          checked={checks[c.id]}
                          onChange={() => toggle(c.id)}
                        />
                        <span className="flex-1 min-w-0">
                          <span className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors block break-words">{c.title}</span>
                          <span className="text-[11px] text-on-surface-variant block break-words">{c.sub}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-stretch gap-3">
                  <button
                    type="button"
                    onClick={confirm}
                    disabled={!allChecked || phase !== "idle"}
                    className={`flex-1 py-4 px-6 rounded-2xl text-base font-extrabold flex items-center justify-center gap-2.5 shadow-lg transition-all active:scale-[0.99] ${
                      allChecked && phase === "idle"
                        ? "bg-primary-container hover:bg-primary text-white cursor-pointer"
                        : "bg-surface-container text-on-surface-variant cursor-not-allowed"
                    }`}
                  >
                    <span className={`material-symbols-outlined text-[22px] ${phase === "working" ? "animate-spin" : ""}`}>
                      {phase === "working" ? "progress_activity" : "fingerprint"}
                    </span>
                    <span className="break-words text-center">
                      {phase === "working" ? "Reconciling Merkle Root…" : `Authorize & Confirm ${inr0(TRANSFER)} Receipt`}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={flagSplit}
                    className={`py-4 px-5 rounded-2xl border font-semibold text-sm transition-all flex items-center justify-center gap-1.5 ${
                      flagged
                        ? "bg-peach-100 border-peach-200 text-tertiary"
                        : "bg-surface-container-low border-surface-container text-on-surface hover:bg-peach-50 hover:text-tertiary"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">{flagged ? "check" : "flag"}</span>
                    <span>{flagged ? "Split Flagged for Review" : "Report Issue / Flag Split"}</span>
                  </button>
                </div>

                {/* Success overlay */}
                {phase === "done" && (
                  <div className="absolute inset-0 bg-surface-container-lowest/95 backdrop-blur-md rounded-3xl p-8 flex flex-col items-center justify-center text-center z-30">
                    <div className="w-16 h-16 rounded-full bg-matcha-50 border border-matcha-200 flex items-center justify-center mb-3 shadow-sm">
                      <span className="material-symbols-outlined text-primary text-[36px]">verified</span>
                    </div>
                    <span className="font-label-caps text-[11px] text-primary uppercase font-bold tracking-widest mb-1">Audit Ledger Signed</span>
                    <h2 className="text-xl font-extrabold text-on-surface mb-2">Attestation Matrix Complete</h2>
                    <p className="text-sm text-on-surface-variant max-w-sm mb-5 break-words">
                      Marcus's balance is locked at {inr(0)}. Tahoe Ski Trip 2025 is 100% reconciled across all 8 co-travelers.
                    </p>
                    <div className="flex items-center gap-3 flex-wrap justify-center">
                      <span className="px-3.5 py-1.5 rounded-xl bg-surface-container-low font-mono text-xs text-on-surface font-bold border border-surface-container">ROOT: 0x8F4A...B901</span>
                      <button type="button" onClick={reset} className="px-5 py-2 rounded-xl bg-primary-container text-white text-xs font-bold shadow-sm hover:opacity-95">Done</button>
                    </div>
                  </div>
                )}
              </div>

              {/* Memo studio */}
              <div className="bg-surface-container-lowest border border-surface-container rounded-3xl p-5 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="material-symbols-outlined text-secondary text-[20px] shrink-0">chat</span>
                    <span className="font-title-md text-[14px] font-bold text-on-surface break-words">Interactive Memo Studio</span>
                  </div>
                  <span className="text-xs text-on-surface-variant">Sends instant push ping to Marcus</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {REACTIONS.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setReaction(r === reaction ? "" : r)}
                      className={`px-3.5 py-2 rounded-2xl border text-[13px] font-medium transition-all active:scale-95 flex items-center gap-1.5 ${
                        reaction === r
                          ? "bg-primary-container text-white border-primary-container"
                          : "bg-surface-container-low hover:bg-surface-container border-surface-container text-on-surface"
                      }`}
                    >
                      <span>{r.split(" ")[0]}</span>
                      <span>{r.split(" ").slice(1).join(" ")}</span>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* ============ COLUMN 3 ============ */}
            <aside className="lg:col-span-3 min-w-0 flex flex-col gap-4">
              {/* Clearance pass */}
              <div className="bg-surface-container-lowest border border-surface-container rounded-3xl p-5 shadow-sm">
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-surface-container">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="material-symbols-outlined text-primary text-[20px] shrink-0">token</span>
                    <h4 className="font-title-md text-[14px] font-bold text-on-surface break-words">Digital Clearance Pass</h4>
                  </div>
                  <span className="font-label-caps text-[10px] bg-lilac-100 text-lilac-700 px-2 py-0.5 rounded-full font-bold shrink-0">Voucher</span>
                </div>
                <div className="mt-3 bg-surface-container-low rounded-2xl p-4 border border-surface-container">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-label-caps text-[10px] text-on-surface-variant uppercase font-bold">Consensus Block</span>
                    <span className="font-mono text-[11px] font-bold text-on-surface">#4,891,023</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-surface-container-lowest border border-surface-container mb-3">
                    <span className="font-label-caps text-[9px] text-on-surface-variant uppercase font-bold block mb-1">SHA-256 Merkle Root Hash</span>
                    <p className="font-mono text-[10px] text-on-surface break-all leading-relaxed">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</p>
                  </div>
                  <div className="bg-surface-container-lowest p-2.5 rounded-xl border border-surface-container flex flex-col items-center">
                    <div className="w-full h-8 flex items-center justify-between gap-[2px] px-2">
                      {BARS.map((w, i) => (
                        <span key={i} className="h-7 bg-on-surface" style={{ width: `${w}px` }} />
                      ))}
                    </div>
                    <span className="font-mono text-[10px] text-on-surface-variant tracking-widest mt-1">TX-2025-089A-SIG</span>
                  </div>
                </div>
              </div>

              {/* Unwind matrix */}
              <div className="bg-surface-container-lowest border border-surface-container rounded-3xl p-5 shadow-sm">
                <div className="flex items-center justify-between gap-2 pb-3">
                  <h4 className="font-title-md text-[14px] font-bold text-on-surface break-words">Bilateral Balance Unwind</h4>
                  <span className="font-label-caps text-[10px] text-primary uppercase font-bold shrink-0">Simulated</span>
                </div>
                <div className="flex flex-col gap-2">
                  {UNWIND.map((u) => (
                    <div key={u.step} className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 ${u.cls}`}>
                      <div className="min-w-0">
                        <span className="font-label-caps text-[10px] uppercase block font-bold">{u.step}</span>
                        <span className="text-[11px] text-on-surface-variant block break-words">{u.sub}</span>
                      </div>
                      <span className="text-xs font-bold font-mono shrink-0">{u.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Export */}
              <div className="bg-surface-container-lowest border border-surface-container rounded-3xl p-5 shadow-sm">
                <span className="font-label-caps text-[11px] uppercase text-on-surface-variant font-bold block mb-2">Export &amp; Integrations</span>
                <div className="flex flex-col gap-1.5 mb-4">
                  <button type="button" className="w-full p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container border border-surface-container text-xs font-semibold text-on-surface flex items-center justify-between gap-2 transition-colors">
                    <span className="flex items-center gap-2 min-w-0">
                      <span className="material-symbols-outlined text-[16px] text-on-surface-variant shrink-0">picture_as_pdf</span>
                      <span className="break-words">Download PDF Receipt</span>
                    </span>
                    <span className="material-symbols-outlined text-[16px] shrink-0">chevron_right</span>
                  </button>
                  <button type="button" className="w-full p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container border border-surface-container text-xs font-semibold text-on-surface flex items-center justify-between gap-2 transition-colors">
                    <span className="flex items-center gap-2 min-w-0">
                      <span className="material-symbols-outlined text-[16px] text-on-surface-variant shrink-0">wallet</span>
                      <span className="break-words">Add to Apple Wallet</span>
                    </span>
                    <span className="material-symbols-outlined text-[16px] shrink-0">chevron_right</span>
                  </button>
                  <button type="button" onClick={copyProof} className="w-full p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container border border-surface-container text-xs font-semibold text-on-surface flex items-center justify-between gap-2 transition-colors">
                    <span className="flex items-center gap-2 min-w-0">
                      <span className="material-symbols-outlined text-[16px] text-on-surface-variant shrink-0">content_copy</span>
                      <span className="break-words">{copied ? "Copied to Clipboard!" : "Copy Audit Proof"}</span>
                    </span>
                    <span className="material-symbols-outlined text-[16px] shrink-0">share</span>
                  </button>
                </div>
                <div className="p-3 rounded-2xl bg-surface-container-low border border-surface-container flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">verified_user</span>
                  <div className="min-w-0">
                    <span className="font-label-caps text-[10px] text-on-surface uppercase font-bold block">RBI-Regulated Partner &amp; GST Compliant</span>
                    <p className="text-[11px] text-on-surface-variant mt-0.5 leading-snug break-words">
                      Secured via partner bank escrow with 256-bit encryption, conforming to RBI PPI guidelines for peer ledger thresholds.
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </AppLayout>
  );
}