import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import Breadcrumbs from "../components/layout/Breadcrumbs";
import { BALANCES_TABS } from "../constants/balancesNav";

const RUPEE = "₹";
const inr = (n) => RUPEE + Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const inr0 = (n) => RUPEE + Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });

const TABS = BALANCES_TABS;

const RECIPIENTS = [
  { id: "sarah", name: "Sarah Lin", initials: "SL", tag: "ROOMMATE", sub: "Brooklyn Loft #4B • HDFC Bank • UPI Connected", net: -4648, avatar: "bg-matcha-100 text-matcha-800", rail: "@sarahlin@okhdfcbank" },
  { id: "jason", name: "Jason Wu", initials: "JW", tag: "ROOMMATE", sub: "Brooklyn Loft #4B • ICICI Bank • UPI Connected", net: -9462, avatar: "bg-buttercup-100 text-buttercup-700", rail: "@jasonwu@ybl" },
  { id: "maya", name: "Maya & Kai", initials: "MK", tag: "GUESTS", sub: "Goa Beach Trip • Split 2 ways", net: -2697.5, avatar: "bg-lilac-100 text-lilac-700", rail: "@mayakai@paytm" },
];

const RAILS = [
  { id: "upi", name: "UPI / GPay", sub: "gpay • phonepe • bhim", icon: "qr_code_2", iconCls: "bg-primary-fixed text-on-primary-fixed", meta: "Scan any UPI QR or enter a VPA. 0% fee, settles instantly via NPCI." },
  { id: "imps", name: "IMPS Bank Transfer", sub: "HDFC •••• 4819", icon: "account_balance", iconCls: "bg-secondary-fixed text-on-secondary-fixed", meta: "IMPS via account aggregator. ₹0 fee, instant and live 24x7." },
  { id: "paytm", name: "Paytm Wallet", sub: "@98765 43210", icon: "wallet", iconCls: "bg-sky-100 text-sky-700", meta: "Paytm UPI deep-link with pre-filled note and amount." },
  { id: "cash", name: "Record as Cash", sub: "In-Person Handshake", icon: "handshake", iconCls: "bg-buttercup-100 text-buttercup-700", meta: "Instant ledger zeroing without digital funds routing." },
];

const RECEIPTS = [
  { id: "tj", name: "Trader Joe's Shared Pantry", sub: "Paid by Sarah Lin on Oct 14 • Split 50/50", amount: -4648, tag: "Applies in full", tagCls: "text-primary", enabled: true },
  { id: "oat", name: "Barista Oat Milk • Whole Foods", sub: "Settled via Tabsy on Oct 10 • 0 balance", amount: 0, tag: "Archived", tagCls: "text-outline", enabled: false },
];

const REACTIONS = [
  "🙏 Dhanyavaad, all sorted!",
  "🪙 UPI sent — check your bank",
  "🤝 Square ho gaya, bro!",
  "☕ Chai on me next time",
  "✅ Settled full & final",
  "🛒 Restock hero!",
];

const EMOJIS = ["🙏", "🤝", "🪙", "💸", "✅", "👍", "👏", "🙌", "😄", "😅", "🥰", "😎", "🔥", "🎉", "☕", "🍕", "🛒", "🏠", "🚕", "🎟️", "💡", "❤️", "🤞", "😴"];

const BARS = [3, 1.5, 4, 2, 1.5, 3.5, 2, 5, 1, 3, 2, 4, 1.5, 3, 2.5, 4, 1, 3.5, 2, 3, 1.5, 4, 2, 1, 3.5, 2, 4.5, 1.5, 3, 2.5, 4, 1, 3, 2, 4, 2.5, 3];

export default function SettleUp() {
  const [recipientId, setRecipientId] = useState("sarah");
  const [amount, setAmount] = useState("4648");
  const [rail, setRail] = useState("upi");
  const [memo, setMemo] = useState("Thanks for restocking the pantry! 🥑");
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [receipts, setReceipts] = useState(["tj"]);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(null), 3200);
  }

  const recipient = RECIPIENTS.find((r) => r.id === recipientId) || RECIPIENTS[0];
  const activeRail = RAILS.find((r) => r.id === rail) || RAILS[0];
  const parsed = parseFloat(amount);
  const value = Number.isFinite(parsed) && parsed > 0 ? parsed : 0;

  function chooseRecipient(id) {
    const next = RECIPIENTS.find((r) => r.id === id);
    if (!next) return;
    setRecipientId(id);
    setAmount(String(Math.abs(next.net)));
  }

  function choosePreset(val) {
    setAmount(String(val));
  }

  function toggleReceipt(id) {
    setReceipts((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function authorize() {
    if (!value) {
      showToast("Enter a valid amount to settle");
      return;
    }
    showToast(`Authorized — ${inr(value)} sent to ${recipient.name} via ${activeRail.name}`);
    setTimeout(() => navigate("/payment-confirmation"), 700);
  }

  const presets = [
    { label: "Full Balance", value: Math.abs(recipient.net), active: value === Math.abs(recipient.net) },
    { label: "Half Split", value: Math.round(Math.abs(recipient.net) / 2), active: value === Math.round(Math.abs(recipient.net) / 2) },
    { label: "Custom Partial", value: 2075, active: value === 2075 },
    { label: "Round Bill", value: 4150, active: value === 4150 },
  ];

  return (
    <AppLayout>
      <main className="w-full min-h-screen overflow-x-clip">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumbs
            items={[
              { label: "Balances", to: "/balances", icon: "account_balance_wallet" },
              { label: "Settle Up" },
            ]}
            status={{ label: "Double-entry Ledger Node #98124", note: "Synchronized" }}
          />

          {/* Page header — GroupHeader-style card */}
          <div className="relative overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm shadow-zinc-900/5 border border-outline-variant/60 w-full px-4 py-3.5 sm:px-5 mb-5">
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              <div className="flex flex-col gap-1.5 min-w-0">
                <div className="flex items-center flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded-full bg-primary-fixed/30 text-on-primary-fixed-variant font-label-caps text-label-caps uppercase font-bold tracking-widest">Phase 01</span>
                  <span className="text-xs text-on-surface-variant">Step 1 of 2: Peer Reconciliation</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-on-surface tracking-tight leading-none">Clear Debts &amp; Instant Transfer</h1>
                <p className="font-body-sm text-body-sm text-on-surface-variant max-w-2xl leading-snug">
                  Direct cryptographic clearinghouse — settle with roommates and travel groups with zero ledger friction.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0 flex-wrap self-start">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-low border border-surface-container font-label-caps text-[11px] uppercase tracking-wider text-on-surface-variant">
                  <span className="material-symbols-outlined text-primary text-[16px]">sync_saved_locally</span>
                  Double-entry ledger: <span className="text-primary font-bold">Synchronized</span>
                </span>
                <Link
                  to="/payment-confirmation"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-container-lowest border border-surface-container text-xs font-bold text-on-surface hover:bg-surface-container transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
                  View Confirmation
                </Link>
              </div>
            </div>

            {/* Sub-nav row (inside card) */}
            <div className="relative z-10 mt-3 pt-3 border-t border-surface-container flex items-center gap-1.5 overflow-x-auto">
              {TABS.map((t) => {
                const cls = `px-3.5 py-2 rounded-xl font-title-md text-xs flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  t.id === "settle"
                    ? "bg-matcha-100 text-matcha-800 font-bold shadow-sm"
                    : "text-on-surface-variant hover:bg-surface-container font-semibold"
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
            {/* LEFT RAIL */}
            <section className="lg:col-span-7 min-w-0 flex flex-col gap-4">
              {/* Recipient selector */}
              <div className="bg-surface-container-lowest rounded-3xl p-5 border border-surface-container shadow-sm flex flex-col gap-4">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="font-title-md text-[15px] text-on-surface font-semibold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">person_check</span>
                    Recipient &amp; Household
                  </span>
                  <span className="text-xs text-primary font-bold">Step 1 of 2</span>
                </div>

                <div className="bg-surface-container p-4 rounded-2xl flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="relative w-14 h-14 rounded-2xl shrink-0 shadow-sm flex items-center justify-center font-label-caps text-base font-bold">
                      <span className={`w-14 h-14 rounded-2xl flex items-center justify-center ${recipient.avatar}`}>{recipient.initials}</span>
                      <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary-container rounded-full flex items-center justify-center ring-2 ring-surface-container">
                        <span className="material-symbols-outlined text-on-primary-container text-[12px]">check</span>
                      </span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-title-md text-[15px] text-on-surface font-bold">{recipient.name}</span>
                        <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-caps text-[10px] font-bold">{recipient.tag}</span>
                      </div>
                      <span className="text-xs text-on-surface-variant break-words">{recipient.sub}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-label-caps text-[10px] text-tertiary uppercase font-bold tracking-wider block">Net Ledger</span>
                    <span className="text-base font-extrabold font-mono text-tertiary">−{inr(Math.abs(recipient.net))}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  <span className="font-label-caps text-[10px] text-on-surface-variant uppercase shrink-0 mr-1">Other Unsettled:</span>
                  {RECIPIENTS.filter((r) => r.id !== recipientId).map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => chooseRecipient(r.id)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container transition-all shrink-0"
                    >
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center font-label-caps text-[10px] font-bold shrink-0 ${r.avatar}`}>{r.initials}</span>
                      <span className="text-xs font-semibold text-on-surface">{r.name}</span>
                      <span className="font-label-caps text-[10px] text-tertiary font-bold">−{inr0(Math.abs(r.net))}</span>
                    </button>
                  ))}
                  <button type="button" onClick={() => showToast("Custom user picker opened")} className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface-variant text-xs shrink-0">
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    <span>Custom User</span>
                  </button>
                </div>
              </div>

              {/* Amount input */}
              <div className="bg-surface-container-lowest rounded-3xl p-5 border border-surface-container shadow-sm flex flex-col gap-4">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="font-title-md text-[15px] text-on-surface font-semibold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">monetization_on</span>
                    Settlement Amount
                  </span>
                  <span className="font-label-caps text-[10px] bg-surface-container text-on-surface-variant px-2.5 py-1 rounded-full uppercase tracking-wider">Currency: INR (₹)</span>
                </div>

                <div className="bg-surface-container-low rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-2xl text-primary font-extrabold select-none">{RUPEE}</span>
                    <input
                      className="w-40 sm:w-56 bg-transparent text-center text-[32px] font-extrabold font-mono text-on-surface focus:outline-none tracking-tight"
                      inputMode="decimal"
                      type="text"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                      onBlur={() => setAmount(value ? value.toFixed(2) : "0")}
                    />
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="w-2 h-2 rounded-full bg-primary-container shrink-0" />
                    <span className="text-xs text-on-surface-variant">Covers full balance owed across {receipts.length} verified tab receipt</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {presets.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => choosePreset(p.value)}
                      className={`p-2.5 rounded-xl text-center flex flex-col items-center gap-0.5 transition-all active:scale-95 ${
                        p.active ? "bg-primary text-on-primary font-bold shadow-sm" : "bg-surface-container hover:bg-surface-container-high text-on-surface"
                      }`}
                    >
                      <span className={`text-xs ${p.active ? "text-on-primary" : "text-on-surface-variant"}`}>{p.label}</span>
                      <span className="text-xs font-extrabold font-mono">{inr0(p.value)}</span>
                    </button>
                  ))}
                </div>

                <div className="flex flex-col gap-2 pt-1">
                  <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider">Associated Receipts to Reconcile</span>
                  {RECEIPTS.map((r) => (
                    <label
                      key={r.id}
                      className={`flex items-center justify-between gap-3 p-3.5 rounded-2xl transition-all ${
                        r.enabled ? "bg-surface-container-low hover:bg-surface-container cursor-pointer" : "bg-surface-container-low/50 opacity-60 cursor-not-allowed"
                      }`}
                    >
                      <span className="flex items-center gap-3 min-w-0">
                        <input
                          type="checkbox"
                          className="w-5 h-5 accent-primary rounded-md shrink-0"
                          checked={receipts.includes(r.id)}
                          disabled={!r.enabled}
                          onChange={() => r.enabled && toggleReceipt(r.id)}
                        />
                        <span className="flex flex-col min-w-0">
                          <span className={`text-[15px] font-bold text-on-surface break-words ${r.enabled ? "" : "font-medium"}`}>{r.name}</span>
                          <span className="text-xs text-on-surface-variant break-words">{r.sub}</span>
                        </span>
                      </span>
                      <span className="text-right shrink-0">
                        <span className={`text-sm font-extrabold font-mono block ${r.amount < 0 ? "text-tertiary" : "text-primary"}`}>{r.amount < 0 ? "−" : ""}{inr(Math.abs(r.amount))}</span>
                        <span className={`font-label-caps text-[10px] uppercase block ${r.tagCls}`}>{r.tag}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Payment rails */}
              <div className="bg-surface-container-lowest rounded-3xl p-5 border border-surface-container shadow-sm flex flex-col gap-4">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="font-title-md text-[15px] text-on-surface font-semibold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">account_balance_wallet</span>
                    Clearing Rail &amp; Method
                  </span>
                    <span className="text-xs text-primary font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">lock</span>
                      UPI &amp; IMPS Enabled
                    </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {RAILS.map((r) => {
                    const on = rail === r.id;
                    return (
                      <label
                        key={r.id}
                        className={`relative flex flex-col justify-between gap-3 p-4 rounded-2xl cursor-pointer transition-all shadow-sm ${
                          on ? "bg-surface-container ring-1 ring-primary/30" : "bg-surface-container-lowest hover:bg-surface-container-low"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${r.iconCls}`}>
                              {r.icon === "V" ? <span className="font-bold text-[15px]">V</span> : <span className="material-symbols-outlined text-[20px]">{r.icon}</span>}
                            </div>
                            <div className="min-w-0">
                              <span className="font-title-md text-[15px] font-bold text-on-surface block break-words">{r.name}</span>
                              <span className={`font-label-caps text-[10px] uppercase font-bold tracking-wider block break-words ${on ? "text-primary" : "text-on-surface-variant"}`}>{r.sub}</span>
                            </div>
                          </div>
                          <input
                            type="radio"
                            name="payment_rail"
                            className="w-4 h-4 accent-primary shrink-0"
                            checked={on}
                            onChange={() => setRail(r.id)}
                          />
                        </div>
                        <p className="text-xs text-on-surface-variant break-words">{r.meta}</p>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Memo */}
              <div className="bg-surface-container-lowest rounded-3xl p-5 border border-surface-container shadow-sm flex flex-col gap-2">
                <span className="font-title-md text-[15px] text-on-surface font-semibold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">sticky_note_2</span>
                  Note / Ledger Memo
                </span>
                <div className="relative flex items-center gap-2 bg-surface-container-low px-4 py-2.5 rounded-xl">
                  <input
                    className="w-full bg-transparent text-sm text-on-surface focus:outline-none"
                    type="text"
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    placeholder="Add a note…"
                  />
                  <button
                    type="button"
                    onClick={() => setEmojiOpen((v) => !v)}
                    className={`transition-colors p-1 rounded-lg ${emojiOpen ? "text-primary bg-surface-container" : "text-on-surface-variant hover:text-on-surface"}`}
                    title="Add emoji"
                    aria-label="Add emoji"
                  >
                    <span className="material-symbols-outlined text-[20px]">mood</span>
                  </button>

                  {emojiOpen && (
                    <>
                      <div className="fixed inset-0 z-20" onClick={() => setEmojiOpen(false)} />
                      <div className="absolute right-0 top-full mt-2 z-30 w-[17.5rem] bg-surface-container-lowest border border-surface-container rounded-2xl shadow-lg p-2">
                        <div className="flex items-center justify-between px-1 pb-1.5">
                          <span className="font-label-caps text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">Quick Emoji</span>
                          <button type="button" onClick={() => setEmojiOpen(false)} className="text-on-surface-variant hover:text-on-surface" aria-label="Close emoji picker">
                            <span className="material-symbols-outlined text-[16px]">close</span>
                          </button>
                        </div>
                        <div className="grid grid-cols-8 gap-0.5">
                          {EMOJIS.map((e) => (
                            <button
                              key={e}
                              type="button"
                              onClick={() => setMemo((m) => (m ? `${m} ${e}` : e))}
                              className="w-8 h-8 rounded-lg hover:bg-surface-container flex items-center justify-center text-base transition-colors"
                            >
                              {e}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="font-label-caps text-[10px] text-on-surface-variant uppercase w-full sm:w-auto sm:mr-1">Preset Reactions:</span>
                  {REACTIONS.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => { setMemo(r); showToast(`Reaction set: ${r}`); }}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        memo === r ? "bg-primary-fixed text-on-primary-fixed" : "bg-surface-container hover:bg-surface-container-high text-on-surface"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col gap-2 pt-1">
                <button
                  type="button"
                  onClick={authorize}
                  className="w-full py-4 px-6 rounded-2xl bg-primary hover:bg-on-primary-container text-on-primary text-lg font-extrabold shadow-lg transition-all active:scale-[0.99] flex items-center justify-center gap-3"
                >
                  <span className="material-symbols-outlined text-[24px]">fingerprint</span>
                  <span className="break-words">Authorize &amp; Pay {inr0(value)} to {recipient.name.split(" ")[0]}</span>
                </button>
                <div className="flex items-center justify-center gap-2 text-center text-on-surface-variant py-1 flex-wrap">
                  <span className="material-symbols-outlined text-primary text-[16px]">verified_user</span>
                  <span className="text-xs">FaceID required • Double-blind cryptographic escrow • Immediate ledger sync</span>
                </div>
              </div>
            </section>

            {/* RIGHT RAIL */}
            <aside className="lg:col-span-5 min-w-0 flex flex-col gap-4">
              {/* Ledger simulation */}
              <div className="bg-surface-container-lowest rounded-3xl p-5 border border-surface-container shadow-sm flex flex-col gap-4">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="font-title-md text-[15px] text-on-surface font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">balance</span>
                    Ledger Simulation
                  </span>
                  <span className="font-label-caps text-[10px] bg-primary-fixed text-on-primary-fixed px-2.5 py-1 rounded-full font-bold shrink-0">Real-Time Math</span>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-surface-container-low p-3.5 rounded-2xl">
                  <div className="flex flex-col p-2.5 rounded-xl bg-surface-container-lowest min-w-0">
                    <span className="font-label-caps text-[10px] text-on-surface-variant uppercase font-semibold">Prior Balance</span>
                    <span className="text-base font-extrabold font-mono text-tertiary mt-1 break-words">−{inr(Math.abs(recipient.net))}</span>
                    <span className="text-xs text-on-surface-variant mt-0.5">Unsettled debt</span>
                  </div>
                  <div className="flex flex-col p-2.5 rounded-xl bg-primary-fixed/40 min-w-0">
                    <span className="font-label-caps text-[10px] text-on-primary-fixed-variant uppercase font-semibold">Post Execution</span>
                    <span className="text-base font-extrabold font-mono text-primary mt-1 break-words">{inr(0)}</span>
                    <span className="text-xs text-on-primary-fixed font-medium mt-0.5">Harmony Restored</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-surface-container">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[18px]">verified</span>
                    </div>
                    <div className="min-w-0">
                      <span className="text-sm font-bold text-on-surface block">Bilateral Trust Index</span>
                      <span className="text-xs text-on-surface-variant block">28 settlements without delay</span>
                    </div>
                  </div>
                  <span className="text-lg font-extrabold text-primary shrink-0">99.4%</span>
                </div>

                <div className="flex flex-col gap-1.5 pt-1">
                  <div className="flex items-center justify-between gap-2 font-label-caps text-[10px] uppercase text-on-surface-variant">
                    <span className="break-words">Household Settlement Velocity</span>
                    <span className="text-primary font-bold shrink-0">&lt; 4 Hours Avg</span>
                  </div>
                  <div className="w-full h-10 rounded-lg bg-surface-container-low flex items-center px-2">
                    <svg className="w-full h-7 text-primary" fill="none" preserveAspectRatio="none" viewBox="0 0 240 30">
                      <path d="M0 25 C 40 25, 60 10, 100 15 C 140 20, 180 5, 240 2" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" />
                      <circle className="fill-primary" cx="240" cy="2" r="3.5" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Digital clearing pass */}
              <div className="bg-surface-container-lowest rounded-3xl p-5 border border-dashed border-outline-variant shadow-sm flex flex-col gap-4 relative overflow-hidden">
                <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#FAF8F5]" />
                <span className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#FAF8F5]" />

                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary-container" />
                    <span className="font-title-md text-[15px] font-bold text-on-surface">Digital Clearing Pass</span>
                  </div>
                  <span className="font-mono text-xs text-on-surface-variant shrink-0">REC-2024-OCT-8821</span>
                </div>

                <div className="flex flex-col gap-2.5 py-2">
                  <div className="flex justify-between items-center gap-2 text-xs">
                    <span className="text-on-surface-variant">Debtor / Payer:</span>
                    <span className="font-semibold text-on-surface text-right break-words">Alex Chen (You)</span>
                  </div>
                  <div className="flex justify-between items-center gap-2 text-xs">
                    <span className="text-on-surface-variant">Creditor / Beneficiary:</span>
                    <span className="font-semibold text-on-surface text-right break-words">{recipient.name} ({recipient.rail})</span>
                  </div>
                  <div className="flex justify-between items-center gap-2 text-xs">
                    <span className="text-on-surface-variant">Execution Timestamp:</span>
                    <span className="font-semibold text-on-surface text-right break-words">Oct 16, 2024 • Immediate</span>
                  </div>
                  <div className="flex justify-between items-center gap-2 text-xs">
                    <span className="text-on-surface-variant">Amount:</span>
                    <span className="font-bold text-on-surface text-right font-mono break-words">{inr(value)}</span>
                  </div>
                  <div className="flex justify-between items-center gap-2 text-xs">
                    <span className="text-on-surface-variant">Clearing Protocol:</span>
                    <span className="font-semibold text-primary text-right break-words">{activeRail.name} Instant Rail</span>
                  </div>
                  <div className="flex justify-between items-center gap-2 text-xs">
                    <span className="text-on-surface-variant">Network Settlement Fee:</span>
                    <span className="font-bold text-primary text-right">Waived ({inr(0)})</span>
                  </div>
                </div>

                <div className="pt-3 flex flex-col items-center gap-2 bg-surface-container-low p-4 rounded-2xl">
                  <svg className="w-full h-9 text-on-surface opacity-80" fill="currentColor" viewBox="0 0 200 36">
                    {BARS.map((w, i) => (
                      <rect key={i} x={i * 5.5} y="0" width={w} height="36" />
                    ))}
                  </svg>
                  <span className="font-mono text-[10px] tracking-widest text-on-surface-variant break-all text-center">
                    SHA256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
                  </span>
                </div>
              </div>

              {/* Guarantee */}
              <div className="bg-surface-container rounded-3xl p-4 shadow-sm flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-[24px] shrink-0 mt-0.5">verified</span>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="font-title-md text-[15px] font-bold text-on-surface break-words">Tabsy Zero-Conflict Guarantee</span>
                  <p className="text-xs text-on-surface-variant leading-relaxed break-words">
                    Funds route via FDIC-insured partner rails with 256-bit encryption. {recipient.name.split(" ")[0]} receives an instant notification with automatic ledger balance closure.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-[calc(100vw-3rem)] flex items-center gap-2 bg-inverse-surface text-inverse-on-surface px-4 py-2.5 rounded-full shadow-2xl">
          <span className="material-symbols-outlined text-[18px] text-primary-fixed shrink-0">check_circle</span>
          <span className="text-xs font-semibold break-words">{toast}</span>
        </div>
      )}
    </AppLayout>
  );
}