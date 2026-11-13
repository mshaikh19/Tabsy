import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";

const inr = (n) => `₹${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const CIRCLES = [
  { id: "goa", name: "Goa Trip", icon: "flight", net: 180.0 },
  { id: "mumbai", name: "Mumbai Flat 4B", icon: "home", net: -65.5 },
  { id: "cabin", name: "Weekend Cabin", icon: "cabin", net: 150.0 },
];

const OWED_TO_YOU = 482.5;
const YOU_OWE = 165.2;

const RING_RADIUS = 74;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export default function Balances() {
  const [scope, setScope] = useState("individual");
  const [settled, setSettled] = useState({});
  const [nudged, setNudged] = useState({});
  const [toast, setToast] = useState(null);

  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(null), 2800);
  }

  const scale = scope === "group" ? 3 : 1;
  const owedToYou = OWED_TO_YOU * scale;
  const youOwe = YOU_OWE * scale;
  const net = owedToYou - youOwe;

  const debts = useMemo(
    () => [
      { id: "marco", initials: "MP", name: "Marco P.", sub: "Ski Lodge Deposit", amount: 105.2, icon: "cabin" },
      { id: "emily", initials: "ER", name: "Emily R.", sub: "Concert Tickets", amount: 60.0, icon: "cabin" },
    ],
    []
  );
  const receivables = useMemo(
    () => [
      { id: "sarah", initials: "SM", name: "Sarah M.", sub: "Lisbon Roadtrip", amount: 124.0, icon: "flight_takeoff", avatar: "bg-primary-container/20 text-primary" },
      { id: "leo", initials: "LK", name: "Leo K.", sub: "Tokyo Flights", amount: 218.5, icon: "flight_takeoff", avatar: "bg-secondary-fixed text-secondary" },
    ],
    []
  );
  const goodStanding = useMemo(
    () => [
      { id: "tyler", initials: "TY", name: "Tyler Y.", sub: "Friday Tapas", amount: 85.0, avatar: "bg-surface-variant text-on-surface", balanced: false },
      { id: "sam", initials: "SW", name: "Samantha W.", sub: "Groceries", amount: 55.0, avatar: "bg-macaron-yellow text-macaron-yellow-dark", balanced: false },
      { id: "liam", initials: "LV", name: "Liam V.", sub: "Equilibrium reached", amount: 0, avatar: "bg-macaron-lilac text-macaron-lilac-dark", balanced: true },
    ],
    []
  );

  const payable = debts.reduce((s, d) => s + (settled[d.id] ? 0 : d.amount), 0);
  const receivable = receivables.reduce((s, r) => s + r.amount, 0);

  function settle(id, name, amount) {
    setSettled((prev) => ({ ...prev, [id]: true }));
    showToast(`${inr(amount)} settled with ${name}`);
  }

  function nudge(id, name) {
    setNudged((prev) => ({ ...prev, [id]: true }));
    showToast(`Reminder sent to ${name}`);
  }

  function settleAll() {
    const next = {};
    debts.forEach((d) => {
      next[d.id] = true;
    });
    setSettled(next);
    showToast(`All net settled — ${inr(payable)} paid out`);
  }

  function sendAllNudges() {
    const next = {};
    receivables.forEach((r) => {
      next[r.id] = true;
    });
    setNudged(next);
    showToast("Polite reminders dispatched to all pending peers");
  }

  const positivePct = owedToYou > 0 ? (owedToYou / (owedToYou + youOwe)) * 100 : 0;

  return (
    <AppLayout>
      <main className="w-full pt-4 bg-background min-h-screen">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 border-b border-surface-container pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-macaron-lilac text-macaron-lilac-dark font-label-caps text-label-caps uppercase tracking-wider mb-2">
                <span className="w-2 h-2 rounded-full bg-primary-container" />
                Radial Circle Matrix &amp; Group Ledger
              </div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">Your Social Balances</h1>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">Multi-circle ledger with automated peer simplification &amp; instant payouts.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                className="px-4 py-2.5 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface font-title-md text-title-md transition-all flex items-center gap-2 shadow-sm border border-surface-container"
                type="button"
                onClick={() => showToast("Proof of balances exported as PDF")}
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                <span>Export Proof of Balances</span>
              </button>
              <button
                className="px-5 py-2.5 rounded-full bg-primary-container hover:bg-primary text-on-primary font-title-md text-title-md transition-all flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                type="button"
                onClick={settleAll}
                disabled={payable <= 0}
              >
                <span className="material-symbols-outlined text-[18px]">bolt</span>
                <span>{payable > 0 ? `Settle All Net (${inr(payable)})` : "All Settled"}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Net Standing Overview */}
            <div className="lg:col-span-5 bg-surface-container-lowest p-7 rounded-3xl shadow-sm flex flex-col justify-between border border-surface-container">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary-container" />
                  <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Net Standing Overview</h2>
                </div>
                <div className="flex items-center bg-surface-container-low p-1 rounded-full text-xs font-title-md">
                  {["individual", "group"].map((s) => (
                    <button
                      key={s}
                      className={`px-3 py-1 rounded-full transition-all ${scope === s ? "bg-surface-container-lowest text-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}
                      type="button"
                      onClick={() => setScope(s)}
                    >
                      {s === "individual" ? "Individual" : "Group"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative flex items-center justify-center my-6">
                <svg className="w-56 h-56 transform -rotate-90" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" fill="none" r={RING_RADIUS} stroke="#eaedff" strokeWidth="18" />
                  <circle
                    cx="100"
                    cy="100"
                    fill="none"
                    r={RING_RADIUS}
                    stroke="#10b981"
                    strokeWidth="18"
                    strokeLinecap="round"
                    strokeDasharray={`${(positivePct / 100) * RING_CIRCUMFERENCE} ${RING_CIRCUMFERENCE}`}
                  />
                  <circle
                    cx="100"
                    cy="100"
                    fill="none"
                    r={RING_RADIUS}
                    stroke="#ff7886"
                    strokeWidth="18"
                    strokeLinecap="round"
                    strokeDasharray={`${((100 - positivePct) / 100) * RING_CIRCUMFERENCE} ${RING_CIRCUMFERENCE}`}
                    strokeDashoffset={-((positivePct / 100) * RING_CIRCUMFERENCE)}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                  <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider font-bold">Net Standing</span>
                  <div className={`font-numeric-balance-lg text-numeric-balance-lg tracking-tight font-extrabold mt-0.5 ${net >= 0 ? "text-primary" : "text-tertiary"}`}>
                    {net >= 0 ? "+" : "−"}
                    {inr(Math.abs(net))}
                  </div>
                  <span className={`inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full font-title-md text-body-sm font-semibold ${net >= 0 ? "bg-macaron-mint/20 text-primary" : "bg-macaron-peach/40 text-tertiary"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${net >= 0 ? "bg-primary-container" : "bg-tertiary-container"}`} />
                    {net >= 0 ? "Surplus Balance" : "Net Deficit"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-surface-container">
                <div className="p-3 bg-surface-container-low rounded-2xl flex items-center gap-3">
                  <div className="w-3.5 h-3.5 rounded-full bg-primary-container shrink-0" />
                  <div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-none">Owed To You</p>
                    <p className="font-numeric-balance-md text-numeric-balance-md text-on-surface font-bold mt-1">{inr(owedToYou)}</p>
                  </div>
                </div>
                <div className="p-3 bg-macaron-peach/40 rounded-2xl flex items-center gap-3">
                  <div className="w-3.5 h-3.5 rounded-full bg-tertiary-container shrink-0" />
                  <div>
                    <p className="font-body-sm text-body-sm text-macaron-peach-dark leading-none">You Owe</p>
                    <p className="font-numeric-balance-md text-numeric-balance-md text-tertiary font-bold mt-1">{inr(youOwe)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right cluster */}
            <div className="lg:col-span-7 flex flex-col gap-4 justify-between">
              <div className="bg-macaron-sky/60 p-6 rounded-3xl border border-sky-100 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-macaron-sky-dark text-[22px]">diversity_3</span>
                    <h3 className="font-title-md text-title-md text-on-surface font-bold">Active Shared Circles</h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/80 text-macaron-sky-dark font-label-caps text-label-caps font-bold">
                    {CIRCLES.length} Synchronized Pools
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {CIRCLES.map((p) => (
                    <Link
                      to="/groups"
                      key={p.id}
                      className="p-3.5 bg-white/90 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-title-md text-body-sm text-on-surface font-semibold truncate">{p.name}</span>
                        <span className={`material-symbols-outlined text-body-md ${p.net >= 0 ? "text-primary" : "text-tertiary"}`}>{p.icon}</span>
                      </div>
                      <div className="mt-2 flex items-baseline justify-between">
                        <span className="font-body-sm text-label-caps text-on-surface-variant">Net Pool</span>
                        <span className={`font-numeric-balance-md text-body-md font-bold ${p.net >= 0 ? "text-primary" : "text-tertiary"}`}>
                          {p.net >= 0 ? "+" : "−"}
                          {inr(Math.abs(p.net))}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                <div className="bg-macaron-yellow/50 p-6 rounded-3xl border border-yellow-100 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-macaron-yellow-dark text-[22px]">notifications_paused</span>
                      <h3 className="font-title-md text-title-md text-on-surface font-bold">Pending Nudges</h3>
                    </div>
                    <span className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center font-label-caps text-macaron-yellow-dark font-bold">
                      {receivables.filter((r) => !nudged[r.id]).length}
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant my-2">
                    Gentle reminders scheduled for automated dispatch today via warm iMessage cards.
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex -space-x-1.5">
                      {receivables.map((r) => (
                        <div
                          key={r.id}
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-label-caps font-bold shadow-sm border border-yellow-200 ${nudged[r.id] ? "bg-macaron-mint text-primary" : "bg-white text-macaron-yellow-dark"}`}
                        >
                          {nudged[r.id] ? "✓" : r.initials}
                        </div>
                      ))}
                    </div>
                    <button
                      className="px-3 py-1.5 rounded-full bg-white hover:bg-yellow-50 text-macaron-yellow-dark font-title-md text-body-sm font-bold transition-colors shadow-sm disabled:opacity-50"
                      type="button"
                      onClick={sendAllNudges}
                      disabled={receivables.every((r) => nudged[r.id])}
                    >
                      {receivables.every((r) => nudged[r.id]) ? "Sent" : "Send Now"}
                    </button>
                  </div>
                </div>

                <div className="bg-macaron-lilac/60 p-6 rounded-3xl border border-purple-100 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-macaron-lilac-dark text-[22px]">route</span>
                      <h3 className="font-title-md text-title-md text-on-surface font-bold">Algorithm Savings</h3>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-white/80 text-macaron-lilac-dark font-label-caps text-label-caps font-bold">Saved {inr(15)}</span>
                  </div>
                  <div className="my-2">
                    <div className="font-numeric-balance-lg text-[22px] text-macaron-lilac-dark font-extrabold tracking-tight">{inr(15)} fees avoided</div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">4 intermediate wire hops bypassed via bipartite matrix graph reduction.</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-macaron-lilac-dark font-title-md text-[12px] font-semibold">
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    <span>Optimized Settlement Tree</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Peer Settlement Matrix */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Peer Settlement Matrix</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Classified by action urgency with one-click resolution triggers.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-surface-container font-label-caps text-label-caps text-on-surface-variant uppercase">
                {debts.length + receivables.length + goodStanding.length} Connected Peers
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Immediate Action */}
              <div className="bg-surface-container-lowest p-6 rounded-3xl border border-surface-container shadow-sm flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-surface-container">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-tertiary-container" />
                      <h3 className="font-title-md text-title-md text-on-surface font-bold">Immediate Action</h3>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-macaron-peach text-tertiary font-label-caps text-label-caps font-bold">
                      {debts.filter((d) => !settled[d.id]).length} Debts
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">You owe these peers. Instant zero-fee settlement available.</p>
                  {debts.map((p) => {
                    const isSettled = !!settled[p.id];
                    return (
                      <div key={p.id} className={`p-4 bg-surface-container-low rounded-2xl space-y-3 transition-colors ${isSettled ? "opacity-60" : "hover:bg-surface-container"}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-macaron-peach text-macaron-peach-dark flex items-center justify-center font-title-md text-title-md font-bold">
                              {p.initials}
                            </div>
                            <div>
                              <h4 className="font-title-md text-body-md text-on-surface font-bold">{p.name}</h4>
                              <div className="flex items-center gap-1 text-on-surface-variant text-[12px]">
                                <span className="material-symbols-outlined text-body-sm">{p.icon}</span>
                                <span>{p.sub}</span>
                              </div>
                            </div>
                          </div>
                          <span className="font-numeric-balance-md text-numeric-balance-md text-tertiary font-bold">−{inr(p.amount)}</span>
                        </div>
                        <button
                          className={`w-full py-2 px-3 rounded-full font-title-md text-body-sm flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                            isSettled ? "bg-macaron-mint text-primary cursor-default" : "bg-tertiary text-on-tertiary hover:opacity-95"
                          }`}
                          type="button"
                          onClick={() => settle(p.id, p.name, p.amount)}
                          disabled={isSettled}
                        >
                          <span className="material-symbols-outlined text-[16px]">{isSettled ? "check_circle" : "credit_card"}</span>
                          <span>{isSettled ? "Settled" : `1-Tap Settle ${inr(p.amount)}`}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 pt-3 border-t border-surface-container flex items-center justify-between text-xs text-on-surface-variant">
                  <span>Total Payable</span>
                  <span className="font-numeric-balance-md text-tertiary font-bold">{inr(payable)}</span>
                </div>
              </div>

              {/* Awaiting Collection */}
              <div className="bg-surface-container-lowest p-6 rounded-3xl border border-surface-container shadow-sm flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-surface-container">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-primary-container" />
                      <h3 className="font-title-md text-title-md text-on-surface font-bold">Awaiting Collection</h3>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-macaron-mint/20 text-primary font-label-caps text-label-caps font-bold">
                      {receivables.filter((r) => !nudged[r.id]).length} Pending
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Peers who owe you. Gentle reminder ping cards with direct pay links.</p>
                  {receivables.map((p) => {
                    const isNudged = !!nudged[p.id];
                    return (
                      <div key={p.id} className="p-4 bg-surface-container-low rounded-2xl space-y-3 hover:bg-surface-container transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full ${p.avatar} flex items-center justify-center font-title-md text-title-md font-bold`}>{p.initials}</div>
                            <div>
                              <h4 className="font-title-md text-body-md text-on-surface font-bold">{p.name}</h4>
                              <div className="flex items-center gap-1 text-on-surface-variant text-[12px]">
                                <span className="material-symbols-outlined text-body-sm">{p.icon}</span>
                                <span>{p.sub}</span>
                              </div>
                            </div>
                          </div>
                          <span className="font-numeric-balance-md text-numeric-balance-md text-primary font-bold">+{inr(p.amount)}</span>
                        </div>
                        <button
                          className={`w-full py-2 px-3 rounded-full font-title-md text-body-sm flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                            isNudged ? "bg-macaron-mint text-primary cursor-default" : "bg-primary-container text-on-primary hover:bg-primary"
                          }`}
                          type="button"
                          onClick={() => nudge(p.id, p.name)}
                          disabled={isNudged}
                        >
                          <span className="material-symbols-outlined text-[16px]">{isNudged ? "check_circle" : "notifications_active"}</span>
                          <span>{isNudged ? "Reminder Sent" : "Trigger Polite Reminder"}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 pt-3 border-t border-surface-container flex items-center justify-between text-xs text-on-surface-variant">
                  <span>Total Receivable</span>
                  <span className="font-numeric-balance-md text-primary font-bold">+{inr(receivable)}</span>
                </div>
              </div>

              {/* In Good Standing */}
              <div className="bg-surface-container-lowest p-6 rounded-3xl border border-surface-container shadow-sm flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-surface-container">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-secondary" />
                      <h3 className="font-title-md text-title-md text-on-surface font-bold">In Good Standing</h3>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface font-label-caps text-label-caps font-bold">
                      {goodStanding.length} Peers
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Recently reconciled tabs and zero-drift active members.</p>
                  {goodStanding.map((p) => (
                    <div key={p.id} className="p-3.5 bg-surface-container-low rounded-2xl flex items-center justify-between hover:bg-surface-container transition-colors min-h-[60px]">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full ${p.avatar} flex items-center justify-center font-title-md text-title-md font-bold`}>{p.initials}</div>
                        <div>
                          <h4 className="font-title-md text-body-sm text-on-surface font-bold">{p.name}</h4>
                          <span className="text-on-surface-variant text-label-caps">{p.sub}</span>
                        </div>
                      </div>
                      <div className="text-right min-w-[72px] flex flex-col items-end justify-center">
                        <span className={`font-numeric-balance-md text-body-md font-bold ${p.balanced ? "text-on-surface-variant" : "text-primary"}`}>
                          {p.balanced ? inr(0) : `+${inr(p.amount)}`}
                        </span>
                        {p.balanced && (
                          <span className="block text-label-caps text-primary inline-flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[12px]">check_circle</span> Balanced
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-surface-container flex items-center justify-between text-xs text-on-surface-variant">
                  <span>Circle Harmony</span>
                  <span className="font-title-md text-primary font-bold">100% Balanced</span>
                </div>
              </div>
            </div>
          </div>

          {/* Zero-Drift Guarantee */}
          <div className="p-4 bg-surface-container-lowest rounded-3xl border border-surface-container shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-on-surface-variant">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-macaron-mint/20 text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">verified</span>
              </div>
              <div>
                <span className="font-title-md text-body-sm text-on-surface font-bold block">Zero-Drift Cryptographic Balance Guarantee</span>
                <span className="font-body-sm text-[12px] text-on-surface-variant">
                  Tabsy enforces double-entry verification on each ledger delta. Sum total across all circles strictly evaluates to Σ(net) = {inr(0)}.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="px-3 py-1 rounded-full bg-surface-container font-label-caps text-label-caps text-primary font-bold">Audit Hash: #9FA2-OK</span>
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
    </AppLayout>
  );
}