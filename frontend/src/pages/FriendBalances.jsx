import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";

const inr = (n) => `₹${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const inr0 = (n) => `₹${Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

const HUBS = [
  {
    icon: "cottage",
    iconCls: "bg-primary/10 text-primary",
    name: "Brooklyn Loft #4B",
    tag: "Active Tab",
    tagCls: "text-primary",
    amount: `-${inr(4648)}`,
    amountCls: "text-tertiary",
  },
  {
    icon: "downhill_skiing",
    iconCls: "bg-secondary-fixed text-secondary",
    name: "Tahoe Ski Trip",
    tag: "All Settled",
    tagCls: "text-outline",
    amount: inr(0),
    amountCls: "text-outline",
  },
  {
    icon: "shopping_cart",
    iconCls: "bg-surface-container-high text-on-surface-variant",
    name: "Weekly Groceries",
    tag: "Settled",
    tagCls: "text-outline",
    amount: inr(0),
    amountCls: "text-outline",
  },
];

const MUTUAL = [
  { initials: "MR", name: "Marco R.", sub: "Brooklyn Loft", cls: "bg-secondary-fixed text-secondary" },
  { initials: "AM", name: "Alex M.", sub: "Ski Crew", cls: "bg-primary-fixed text-on-primary-fixed" },
  { initials: "JW", name: "Jason W.", sub: "Brooklyn Loft", cls: "bg-tertiary-fixed text-tertiary" },
  { initials: "CB", name: "Chloe B.", sub: "Tahoe Trip", cls: "bg-surface-container-high text-on-surface" },
];

const RAILS = [
  { id: "gpay", label: "GPay", sub: "UPI • Instant", badge: "Default", icon: "G", iconCls: "bg-inverse-surface text-inverse-on-surface" },
  { id: "phonepe", label: "PhonePe", sub: "@sarah-lin-94", icon: "P", iconCls: "bg-secondary-fixed text-secondary" },
  { id: "upi", label: "UPI Direct", sub: "HDFC •••• 4019", icon: "account_balance", iconCls: "bg-surface-container-high text-on-surface" },
];

const NUDGES = [
  "Settling tonight after work! 🏠",
  "Coffee on me tomorrow! ☕️",
  "High five! Tabs looking good",
];

function QrArt({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="currentColor">
      <rect fill="#006C49" height="25" rx="4" width="25" x="5" y="5" />
      <rect fill="#131B2E" height="25" rx="4" width="25" x="70" y="5" />
      <rect fill="#4648D4" height="25" rx="4" width="25" x="5" y="70" />
      <circle cx="50" cy="50" fill="#BC0B3B" r="8" />
      <rect fill="#131B2E" height="10" rx="2" width="10" x="40" y="20" />
      <rect fill="#006C49" height="15" rx="3" width="15" x="70" y="70" />
      <circle cx="50" cy="80" fill="#131B2E" r="4" />
      <circle cx="20" cy="45" fill="#131B2E" r="4" />
    </svg>
  );
}

export default function FriendBalances() {
  const [rail, setRail] = useState("gpay");
  const [amount, setAmount] = useState(4648);
  const [payInput, setPayInput] = useState("4648.00");
  const [activePill, setActivePill] = useState("full");
  const [authorizing, setAuthorizing] = useState(false);
  const [offsetOpen, setOffsetOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [toggles, setToggles] = useState({ auto: true, ping: true, receipt: false });
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);
  const payTimer = useRef(null);

  const activeRail = RAILS.find((r) => r.id === rail) || RAILS[0];

  function showToast(message, icon = "check_circle") {
    setToast({ message, icon });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }

  function pickAmount(val, pill) {
    const num = Math.max(Math.min(val, 4648), 0);
    setAmount(num);
    setPayInput(num.toFixed(2));
    setActivePill(pill);
  }

  function onInput(val) {
    setPayInput(val);
    const num = Math.min(Math.max(parseFloat(val) || 0, 0), 4648);
    setAmount(num);
    setActivePill("custom");
  }

  function customAmount() {
    setActivePill("custom");
    setAmount(0);
    setPayInput("");
  }

  function authorize() {
    if (authorizing) return;
    if (!amount || amount <= 0) {
      showToast("Please specify a valid amount.", "error");
      return;
    }
    setAuthorizing(true);
    if (payTimer.current) clearTimeout(payTimer.current);
    payTimer.current = setTimeout(() => {
      setAuthorizing(false);
      showToast(`Transferred ${inr(amount)} via ${activeRail.label} to Sarah Lin!`, "send");
    }, 900);
  }

  function quickSettle() {
    showToast(`Opening 1-tap settlement of ${inr(amount)} via ${activeRail.label}...`, "bolt");
  }

  function copyHash() {
    navigator.clipboard?.writeText("e4b78910ac9018fa6712bc9001TabsyAuditVerifiedSHA256");
    showToast("Cryptographic hash ledger seal copied!", "content_copy");
  }

  function sendNudge(phrase) {
    showToast(`Nudge sent to Sarah: "${phrase}"`, "send");
  }

  function proposeOffset(name) {
    showToast(`Split offset proposal sent to Sarah: ${name}`, "swap_horiz");
    setOffsetOpen(false);
  }

  function toggle(key) {
    setToggles((t) => ({ ...t, [key]: !t[key] }));
  }

  return (
    <AppLayout>
      <div className="bg-[#f7f6fd] font-body-md text-body-md text-on-surface antialiased min-h-screen">
        <main className="w-full pb-12">
          {/* In-page header */}
          <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 pt-5">
            <div className="flex items-center gap-2 text-[13px] text-on-surface-variant flex-wrap mb-3">
              <Link to="/dashboard" className="hover:text-primary transition-colors flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">home</span> Home
              </Link>
              <span className="text-outline-variant text-[14px]">/</span>
              <Link to="/friends" className="hover:text-primary transition-colors">Friends</Link>
              <span className="text-outline-variant text-[14px]">/</span>
              <Link to="/friend-profile" className="hover:text-primary transition-colors">Sarah Lin</Link>
              <span className="text-outline-variant text-[14px]">/</span>
              <span className="text-primary font-title-md font-semibold">Bilateral Balances</span>
            </div>

            <div className="bg-surface-container-lowest rounded-3xl p-5 lg:p-6 border border-surface-container shadow-xs">
              {/* Identity + net + settle */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-secondary-fixed flex items-center justify-center font-bold text-xl text-on-secondary-fixed-variant ring-2 ring-surface-container">SL</div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center ring-2 ring-surface-container-lowest shadow-sm">
                      <span className="material-symbols-outlined text-[14px]">verified</span>
                    </div>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="font-headline-md text-headline-md text-on-surface">Sarah Lin</h1>
                      <span className="bg-secondary-fixed text-on-secondary-fixed-variant px-2.5 py-0.5 rounded-full font-label-caps text-label-caps font-semibold">@sarah_lin</span>
                      <span className="bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-caps text-label-caps px-2.5 py-0.5 rounded-full font-semibold">Brooklyn Loft Roommate</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Roommate • Loft #4B · Since Oct 2023 · 4 shared groups</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap md:justify-end shrink-0">
                  <div className="flex items-center gap-3 bg-tertiary-fixed/70 border border-tertiary-container/30 px-4 py-2.5 rounded-2xl">
                    <div className="w-10 h-10 rounded-xl bg-tertiary text-on-tertiary flex items-center justify-center shadow-xs shrink-0">
                      <span className="material-symbols-outlined text-[20px]">trending_down</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-caps text-label-caps uppercase text-on-tertiary-fixed-variant tracking-wider font-bold">Net Balance</span>
                      <span className="font-numeric-balance-md text-numeric-balance-md text-tertiary leading-tight">-{inr(4648)}</span>
                    </div>
                  </div>
                  <button className="h-12 px-6 rounded-2xl bg-primary hover:bg-primary-container text-on-primary font-title-md text-title-md transition-all flex items-center gap-2 shadow-sm hover:shadow justify-center shrink-0" type="button" onClick={quickSettle}>
                    <span className="material-symbols-outlined text-[20px]">bolt</span>
                    <span>Settle Tab</span>
                  </button>
                </div>
              </div>

              {/* Sub-tabs */}
              <div className="mt-5 pt-4 border-t border-surface-container flex items-center gap-2 overflow-x-auto">
                <Link to="/friend-profile" className="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors font-title-md text-body-md whitespace-nowrap">Profile</Link>
                <span className="px-4 py-2 rounded-xl bg-on-surface text-inverse-on-surface font-title-md text-body-md flex items-center gap-2 shadow-xs whitespace-nowrap">
                  <span>Balances</span>
                  <span className="px-2 py-0.5 rounded-full bg-inverse-on-surface/20 text-inverse-on-surface font-label-caps text-label-caps">28 active</span>
                </span>
                <Link to="/friend-transactions" className="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors font-title-md text-body-md whitespace-nowrap">Transactions</Link>
                <Link to="/friend-activity" className="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors font-title-md text-body-md whitespace-nowrap">Activity Log</Link>
                <Link to="/friend-manage" className="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors font-title-md text-body-md whitespace-nowrap">Bilateral Rules</Link>
                <div className="ml-auto hidden lg:flex items-center gap-2 text-outline font-label-caps text-label-caps uppercase tracking-wider shrink-0">
                  <span className="inline-block w-2 h-2 rounded-full bg-primary-container" /> Bilateral Ledger Online
                </div>
              </div>
            </div>
          </div>

          {/* 2-COLUMN BALANCED GRID */}
          <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

              {/* LEFT (primary workflow) */}
              <div className="lg:col-span-7 flex flex-col gap-5">
                {/* Debt Unwind Engine */}
                <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-[20px]">calculate</span>
                      </div>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface">Tactile Debt Unwind Engine</h3>
                    </div>
                    <span className="bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full font-label-caps text-label-caps uppercase tracking-wider">Real-time Netting</span>
                  </div>

                  <div className="flex flex-col gap-3 my-2">
                    {/* Step 1 */}
                    <div className="p-3.5 rounded-2xl bg-surface-container-low flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-surface-container-lowest flex items-center justify-center font-bold text-on-surface text-xs shadow-xs shrink-0">01</div>
                        <div className="min-w-0">
                          <p className="font-body-md text-body-md font-semibold text-on-surface truncate">Trader Joe's Shared Pantry</p>
                          <p className="font-body-sm text-body-sm text-outline truncate">Feb 20 • Sarah paid upfront ({inr(18592)} total split)</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-numeric-balance-md text-numeric-balance-md text-tertiary whitespace-nowrap">+{inr(9296)}</span>
                        <p className="font-label-caps text-label-caps text-tertiary uppercase">Gross Liability</p>
                      </div>
                    </div>

                    {/* Connector */}
                    <div className="flex items-center justify-center gap-2 text-outline">
                      <div className="h-0.5 w-12 bg-surface-container-highest" />
                      <span className="font-label-caps text-label-caps uppercase font-bold bg-surface-container px-2 py-0.5 rounded-full">Less Offset</span>
                      <div className="h-0.5 w-12 bg-surface-container-highest" />
                    </div>

                    {/* Step 2 */}
                    <div className="p-3.5 rounded-2xl bg-surface-container-low flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-surface-container-lowest flex items-center justify-center font-bold text-on-surface text-xs shadow-xs shrink-0">02</div>
                        <div className="min-w-0">
                          <p className="font-body-md text-body-md font-semibold text-on-surface truncate">Blue Bottle Pastries &amp; Cold Brew</p>
                          <p className="font-body-sm text-body-sm text-outline truncate">Feb 22 • You covered Sarah ({inr(4648)} offset)</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-numeric-balance-md text-numeric-balance-md text-primary whitespace-nowrap">-{inr(4648)}</span>
                        <p className="font-label-caps text-label-caps text-primary uppercase">Bilateral Credit</p>
                      </div>
                    </div>

                    {/* Result */}
                    <div className="p-4 rounded-2xl bg-tertiary-fixed flex items-center justify-between mt-1 gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-tertiary text-on-tertiary flex items-center justify-center shadow-xs shrink-0">
                          <span className="material-symbols-outlined text-[18px]">equal</span>
                        </div>
                        <div className="min-w-0">
                          <span className="font-title-md text-title-md text-on-tertiary-fixed block font-bold leading-tight truncate">Net Bilateral Delta</span>
                          <span className="font-body-sm text-body-sm text-on-tertiary-fixed-variant truncate block">Single transaction resolves both cycles</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-numeric-balance-lg text-numeric-balance-lg text-tertiary font-extrabold whitespace-nowrap">-{inr(4648)}</span>
                        <span className="block font-label-caps text-label-caps text-tertiary uppercase font-bold">You Owe Sarah</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Settlement Console */}
                <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface">Settlement Console</h3>
                    <span className="font-body-sm text-body-sm text-primary font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">lock_reset</span> Zero Friction
                    </span>
                  </div>

                  {/* Amount pills */}
                  <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-surface-container-low mb-4">
                    <button className={`flex-1 py-2 px-3 rounded-xl font-title-md text-title-md transition-all text-center ${activePill === "full" ? "bg-surface-container-lowest text-on-surface shadow-sm" : "text-on-surface-variant hover:bg-surface-container"}`} type="button" onClick={() => pickAmount(4648, "full")}>Full ({inr(4648)})</button>
                    <button className={`flex-1 py-2 px-3 rounded-xl font-title-md text-title-md transition-all text-center ${activePill === "half" ? "bg-surface-container-lowest text-on-surface shadow-sm" : "text-on-surface-variant hover:bg-surface-container"}`} type="button" onClick={() => pickAmount(2324, "half")}>Half ({inr(2324)})</button>
                    <button className={`flex-1 py-2 px-3 rounded-xl font-title-md text-title-md transition-all text-center ${activePill === "custom" ? "bg-surface-container-lowest text-on-surface shadow-sm" : "text-on-surface-variant hover:bg-surface-container"}`} type="button" onClick={customAmount}>Custom</button>
                  </div>

                  {/* Amount input */}
                  <div className="p-4 rounded-2xl bg-surface-container mb-4 flex items-center justify-between">
                    <span className="font-body-md text-body-md text-outline">Authorizing Transfer</span>
                    <div className="flex items-center gap-1">
                      <span className="font-headline-md text-headline-md text-on-surface font-mono font-bold">₹</span>
                      <input className="w-32 bg-transparent text-right font-headline-md text-headline-md text-on-surface font-mono font-bold focus:outline-none" inputMode="decimal" type="text" value={payInput} onChange={(e) => onInput(e.target.value)} />
                    </div>
                  </div>

                  {/* Authorize CTA */}
                  <button className="w-full bg-primary hover:bg-primary-container text-on-primary py-4 rounded-2xl font-title-md text-title-md shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group active:scale-[0.99]" type="button" onClick={authorize}>
                    <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">{authorizing ? "hourglass_top" : "lock"}</span>
                    <span>{authorizing ? "Processing..." : amount > 0 ? `Authorize ${inr(amount)} Instant Transfer` : "Authorize Transfer"}</span>
                  </button>

                  {/* Offset accordion */}
                  <div className="mt-4 pt-3">
                    <button className="w-full flex items-center justify-between text-on-surface font-body-md text-body-md py-1 group" type="button" onClick={() => setOffsetOpen((o) => !o)}>
                      <span className="flex items-center gap-2 font-semibold">
                        <span className="material-symbols-outlined text-secondary text-[18px]">swap_horiz</span> Propose In-Kind Split Offset Instead
                      </span>
                      <span className={`material-symbols-outlined text-outline transition-transform duration-200 ${offsetOpen ? "rotate-180" : ""}`}>expand_more</span>
                    </button>
                    {offsetOpen && (
                      <div className="mt-3 p-3.5 rounded-2xl bg-surface-container-low text-on-surface-variant font-body-sm text-body-sm flex flex-col gap-2">
                        <p>Have an unlogged ticket or grocery receipt? Propose offsetting this debt directly without moving fiat funds:</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <button className="bg-surface-container-lowest px-3 py-1.5 rounded-xl font-body-sm text-on-surface shadow-xs hover:bg-surface-container transition-colors" type="button" onClick={() => proposeOffset("Utilities Wifi Nov")}>Offset with Wifi ({inr(4980)})</button>
                          <button className="bg-surface-container-lowest px-3 py-1.5 rounded-xl font-body-sm text-on-surface shadow-xs hover:bg-surface-container transition-colors" type="button" onClick={() => proposeOffset("Cleaning Supplies")}>Offset Supplies ({inr(1992)})</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Shared Hubs */}
                <div className="bg-surface-container-lowest rounded-3xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-title-md text-title-md text-on-surface">Shared Hubs</span>
                    <span className="font-label-caps text-label-caps text-outline uppercase">3 Groups</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {HUBS.map((h) => (
                      <div key={h.name} className="flex sm:flex-col items-start sm:items-start justify-between p-3 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-colors gap-2">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${h.iconCls}`}>
                          <span className="material-symbols-outlined text-[18px]">{h.icon}</span>
                        </div>
                        <div className="min-w-0 flex-1 sm:mt-1">
                          <p className="font-body-md text-body-md font-semibold text-on-surface leading-tight truncate">{h.name}</p>
                          <span className={`font-label-caps text-label-caps uppercase ${h.tagCls}`}>{h.tag}</span>
                        </div>
                        <span className={`font-numeric-balance-md text-numeric-balance-md shrink-0 whitespace-nowrap ${h.amountCls}`}>{h.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Historical Shared Volume */}
                <div className="bg-surface-container-lowest rounded-3xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-2 gap-2">
                    <span className="font-title-md text-title-md text-on-surface">Historical Shared Volume</span>
                    <span className="font-body-sm text-body-sm text-outline whitespace-nowrap">{inr0(152720)} Total YTD</span>
                  </div>
                  <div className="w-full h-3 rounded-full overflow-hidden flex bg-surface-container my-3">
                    <div className="h-full bg-secondary" style={{ width: "62%" }} title="Utilities: 62%" />
                    <div className="h-full bg-primary-container" style={{ width: "28%" }} title="Groceries: 28%" />
                    <div className="h-full bg-tertiary-container" style={{ width: "10%" }} title="Trips: 10%" />
                  </div>
                  <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
                      <span className="text-on-surface-variant font-body-sm">Loft Utilities (62%)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary-container" />
                      <span className="text-on-surface-variant font-body-sm">Pantry (28%)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-tertiary-container" />
                      <span className="text-on-surface-variant font-body-sm">Tahoe Trip (10%)</span>
                    </div>
                  </div>
                </div>

                {/* Split Protocols */}
                <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface">Bilateral Split Protocols</h3>
                    <span className="material-symbols-outlined text-outline text-[20px]">tune</span>
                  </div>
                  <div className="flex flex-col gap-3">
                    {[
                      { key: "auto", icon: "flash_auto", iconCls: "text-primary", title: "Auto-Accept Under " + inr0(2075), sub: "Bypasses manual approvals for minor coffees & cabs" },
                      { key: "ping", icon: "chat_bubble", iconCls: "text-secondary", title: "Discreet Ping Channel", sub: "Route reminders silently to iMessage (No push alerts)" },
                      { key: "receipt", icon: "receipt_long", iconCls: "text-outline", title: "Strict Receipt Verification", sub: "Require itemized photos before splitting" },
                    ].map((t) => (
                      <div key={t.key} className="flex items-center justify-between p-3 rounded-2xl bg-surface-container-low gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className={`material-symbols-outlined text-[22px] shrink-0 ${t.iconCls}`}>{t.icon}</span>
                          <div className="min-w-0">
                            <p className="font-body-md text-body-md font-semibold text-on-surface leading-tight truncate">{t.title}</p>
                            <p className="font-body-sm text-body-sm text-outline truncate">{t.sub}</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                          <input checked={toggles[t.key]} className="sr-only peer" type="checkbox" onChange={() => toggle(t.key)} />
                          <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all ${toggles[t.key] ? (t.key === "ping" ? "bg-secondary" : "bg-primary") : "bg-surface-container-highest"}`} />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT (reference) */}
              <div className="lg:col-span-5 flex flex-col gap-5">
                {/* Net Standing */}
                <div className="bg-tertiary-fixed rounded-3xl p-5 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2 gap-2">
                    <span className="font-label-caps text-label-caps text-on-tertiary-fixed-variant uppercase tracking-wider">Unwind Liability</span>
                    <span className="bg-surface-container-lowest/80 backdrop-blur-sm text-tertiary font-label-caps text-label-caps uppercase px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1 shrink-0 whitespace-nowrap">
                      <span className="material-symbols-outlined text-[12px] animate-spin">sync</span> 3d until auto-clear
                    </span>
                  </div>
                  <div className="my-2">
                    <div className="font-numeric-balance-lg text-numeric-balance-lg text-tertiary tracking-tight leading-none">-{inr(4648)}</div>
                    <p className="font-body-sm text-body-sm text-on-tertiary-fixed mt-1">You owe Sarah for shared groceries</p>
                  </div>
                  <button className="w-full mt-3 bg-tertiary text-on-tertiary font-title-md text-title-md py-3 rounded-2xl shadow hover:bg-on-tertiary-fixed-variant transition-colors flex items-center justify-center gap-2 group active:scale-95" type="button" onClick={authorize}>
                    <span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform">{authorizing ? "hourglass_top" : "send"}</span>
                    {authorizing ? "Processing..." : `Pay ${inr(4648)} with ${activeRail.label}`}
                  </button>
                </div>

                {/* Bilateral Integrity */}
                <div className="bg-surface-container-lowest rounded-3xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3 gap-2">
                    <span className="font-title-md text-title-md text-on-surface">Bilateral Integrity</span>
                    <span className="font-label-caps text-label-caps bg-primary-fixed text-on-primary-fixed px-2 py-0.5 rounded-full font-bold uppercase shrink-0">Tier 1 Trust</span>
                  </div>
                  <div className="flex items-center gap-4 my-2">
                    <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path className="text-surface-container" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5" />
                        <path className="text-primary stroke-current" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeDasharray="98, 100" strokeLinecap="round" strokeWidth="3.5" />
                      </svg>
                      <span className="absolute font-headline-sm text-[15px] font-extrabold text-on-surface">98%</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-body-md text-body-md font-semibold text-on-surface">Spotless Bilateral Record</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">42 Tabs Settled • 0 Disputes</span>
                      <span className="font-label-caps text-label-caps text-primary mt-1 uppercase font-bold">Avg Settlement: 1.4 Days</span>
                    </div>
                  </div>
                </div>

                {/* Settlement Rails */}
                <div className="bg-surface-container-lowest rounded-3xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-title-md text-title-md text-on-surface">Settlement Rails</span>
                    <span className="font-label-caps text-label-caps text-primary uppercase">Connected</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {RAILS.map((r) => (
                      <label key={r.id} className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-colors gap-2 ${rail === r.id ? "bg-surface-container" : "bg-surface-container-low hover:bg-surface-container"}`}>
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${r.iconCls}`}>
                            {r.icon === "account_balance" ? <span className="material-symbols-outlined text-[16px]">account_balance</span> : r.icon}
                          </div>
                          <div className="min-w-0">
                            <p className="font-body-md text-body-md font-semibold text-on-surface leading-none truncate">{r.label}</p>
                            <span className={`font-label-caps text-label-caps uppercase ${r.badge ? "text-primary" : "text-outline"} block truncate`}>{r.badge ? `${r.badge} • ${r.sub}` : r.sub}</span>
                          </div>
                        </div>
                        <input checked={rail === r.id} className="accent-primary shrink-0" name="payment_rail" type="radio" onChange={() => setRail(r.id)} />
                      </label>
                    ))}
                  </div>
                </div>

                {/* Live QR */}
                <button className="bg-surface-container-lowest rounded-3xl p-5 shadow-sm group hover:shadow-md transition-all text-left w-full" type="button" onClick={() => setQrOpen(true)}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-title-md text-title-md text-on-surface">Sarah's Live QR</span>
                    <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-[20px]">open_in_full</span>
                  </div>
                  <div className="bg-surface-container-low p-4 rounded-2xl flex items-center justify-center flex-col text-center">
                    <QrArt className="w-24 h-24 text-on-surface mb-2 group-hover:scale-105 transition-transform" />
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider font-semibold">Tap to Expand QR Code</span>
                  </div>
                </button>

                {/* 3-Way Loop Netting */}
                <div className="bg-surface-container-lowest rounded-3xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-2 gap-2">
                    <span className="font-title-md text-title-md text-on-surface">3-Way Loop Netting</span>
                    <span className="bg-primary-fixed text-on-primary-fixed text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0">Compressed</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-3">Tabsy algorithm unwound 1 redundant loop between mutual flatmates.</p>
                  <div className="relative bg-surface-container-low rounded-2xl p-4 flex items-center justify-center">
                    <div className="w-full max-w-[200px] h-28 relative flex items-center justify-center">
                      <div className="absolute top-0 left-4 flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs shadow-xs">You</div>
                      </div>
                      <div className="absolute top-0 right-4 flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold text-xs shadow-xs">SL</div>
                      </div>
                      <div className="absolute bottom-0 inset-x-0 mx-auto w-8 h-8 rounded-full bg-surface-container-highest text-on-surface flex items-center justify-center font-bold text-xs shadow-xs">MR</div>
                      <svg className="absolute inset-0 w-full h-full pointer-events-none text-outline-variant" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 200 112">
                        <path d="M 45 16 L 155 16" stroke="#BC0B3B" strokeDasharray="3 3" />
                        <path d="M 160 30 L 115 85" strokeLinecap="round" />
                        <path d="M 85 85 L 40 30" strokeLinecap="round" />
                      </svg>
                      <div className="bg-surface-container-lowest px-2 py-0.5 rounded-full shadow-xs text-primary font-label-caps text-label-caps uppercase font-bold z-10 whitespace-nowrap">Direct: {inr0(4648)}</div>
                    </div>
                  </div>
                </div>

                {/* Mutual Friends */}
                <div className="bg-surface-container-lowest rounded-3xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-title-md text-title-md text-on-surface">Mutual Friends</span>
                    <span className="font-label-caps text-label-caps text-outline uppercase">4 Shared</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {MUTUAL.map((m) => (
                      <div key={m.initials} className="p-2 rounded-2xl bg-surface-container-low flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${m.cls}`}>{m.initials}</div>
                        <div className="min-w-0">
                          <p className="font-body-sm text-body-sm font-semibold text-on-surface truncate">{m.name}</p>
                          <p className="font-label-caps text-[10px] text-outline truncate">{m.sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Friendly Nudge */}
                <div className="bg-surface-container-lowest rounded-3xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-title-md text-title-md text-on-surface">Friendly Nudge</span>
                    <span className="material-symbols-outlined text-outline text-[18px]">waving_hand</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {NUDGES.map((n) => (
                      <button key={n} className="w-full text-left px-3.5 py-2.5 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-colors text-on-surface font-body-sm text-body-sm flex items-center justify-between gap-2" type="button" onClick={() => sendNudge(n)}>
                        <span className="truncate">"{n}"</span>
                        <span className="material-symbols-outlined text-outline text-[16px] shrink-0">send</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ledger Seal */}
                <div className="bg-surface-container-low rounded-2xl p-3.5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                    <div className="min-w-0">
                      <p className="font-label-caps text-label-caps text-on-surface font-bold uppercase truncate">SHA-256 Ledger Bond</p>
                      <p className="font-body-sm text-[10px] text-outline font-mono truncate">e4b7...910a:verified</p>
                    </div>
                  </div>
                  <button className="px-2 py-1 bg-surface-container-lowest hover:bg-surface-container-high rounded-lg text-on-surface text-[11px] font-label-caps uppercase transition-colors shrink-0" type="button" onClick={copyHash}>Copy</button>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* QR Modal */}
        {qrOpen && (
          <div className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setQrOpen(false)}>
            <div className="bg-surface-container-lowest max-w-sm w-full rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center relative" onClick={(e) => e.stopPropagation()}>
              <button className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors" type="button" onClick={() => setQrOpen(false)}>
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
              <div className="w-12 h-12 rounded-2xl bg-secondary-fixed flex items-center justify-center text-secondary mb-3">
                <span className="material-symbols-outlined text-[28px]">qr_code_2</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">Sarah's Direct Rail</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-5">Scan with GPay, PhonePe, or any UPI app</p>
              <div className="p-4 bg-surface-container-lowest rounded-2xl shadow-inner border border-surface-container-highest flex items-center justify-center">
                <QrArt className="w-48 h-48 text-on-surface" />
              </div>
              <div className="mt-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container font-label-caps text-label-caps text-on-surface-variant uppercase">
                <span className="w-2 h-2 rounded-full bg-primary animate-ping" /> Ephemeral Key: SL-9842-LIVE
              </div>
            </div>
          </div>
        )}

        {/* Toast */}
        {toast && (
          <div className="fixed bottom-6 right-6 z-[60] flex items-center gap-3 bg-inverse-surface text-inverse-on-surface px-5 py-3 rounded-2xl shadow-2xl">
            <span className="material-symbols-outlined text-primary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>{toast.icon}</span>
            <span className="font-body-md text-body-md font-medium">{toast.message}</span>
          </div>
        )}
      </div>
    </AppLayout>
  );
}