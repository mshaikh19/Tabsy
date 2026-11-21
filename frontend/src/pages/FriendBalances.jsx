import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import Breadcrumbs from "../components/layout/Breadcrumbs";

const inr = (n) => `₹${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const inr0 = (n) => `₹${Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

const NET = 4648;
const GROSS_YOU = 9296;
const GROSS_SARAH = 4648;

const PROFILE_TABS = [
  { label: "Profile", to: "/friend-profile" },
  { label: "Balances", to: "/friend-balances", active: true },
  { label: "Transactions", to: "/friend-transactions" },
  { label: "Activity", to: "/friend-activity" },
];

const GROUPS = [
  {
    icon: "apartment",
    iconCls: "bg-peach-50 text-tertiary border border-peach-200",
    bar: "bg-tertiary",
    title: "Brooklyn Loft",
    sub: "Living expenses • 50/50 split",
    state: "Unsettled",
    stateCls: "bg-peach-50 text-tertiary border border-peach-200",
    item: "Trader Joe's Shared Pantry",
    date: "Feb 20",
    meta: `Total: ${inr(GROSS_YOU)}`,
    amount: `You owe ${inr(NET)}`,
    amountCls: "text-tertiary",
    footerIcon: "event",
    footer: "Feb 25",
    footerCls: "text-tertiary",
    action: { label: "Settle Item", amount: NET, group: "Brooklyn Loft" },
  },
  {
    icon: "shopping_cart",
    iconCls: "bg-matcha-50 text-matcha-700 border border-matcha-200",
    bar: "bg-matcha-600",
    title: "Weekly Groceries",
    sub: "Direct tab • Auto-sync",
    state: "Settled 100%",
    stateCls: "bg-matcha-50 text-matcha-700 border border-matcha-200",
    item: "BigBasket Weekly Order",
    date: "Feb 12",
    meta: "Cleared via UPI",
    amount: inr(0),
    amountCls: "text-matcha-700",
    footerIcon: "check_circle",
    footer: "All clear",
    footerCls: "text-matcha-700",
    tail: "Archived cycle",
  },
  {
    icon: "downhill_skiing",
    iconCls: "bg-secondary-fixed text-on-secondary-fixed",
    bar: "bg-secondary",
    title: "Tahoe Ski Weekend",
    sub: "Travel group • 6 contributors",
    state: "Netted Out",
    stateCls: "bg-secondary-fixed text-on-secondary-fixed",
    item: "Chalet & Lift Passes",
    date: "Jan 29",
    meta: "Multilateral offset applied",
    amount: inr(0),
    amountCls: "text-secondary",
    footerIcon: "hub",
    footer: "Netting Optimized",
    footerCls: "text-secondary",
    tail: "View Log",
  },
];

const HISTORY = [
  {
    id: "apple",
    icon: "check",
    iconCls: "bg-matcha-50 text-matcha-700 border border-matcha-200",
    title: "BigBasket Weekly Order",
    date: "Feb 12, 2025 • 04:32 PM",
    group: "Weekly Groceries",
    method: "UPI / GPay",
    methodIcon: "contactless",
    methodCls: "text-secondary",
    amount: `+${inr(4025.5)}`,
    amountCls: "text-matcha-700",
    verify: "Voucher",
    verifyId: "AC-2940291",
  },
  {
    id: "bank",
    icon: "done_all",
    iconCls: "bg-matcha-50 text-matcha-700 border border-matcha-200",
    title: "Match Day Catering Split",
    date: "Feb 09, 2025 • 11:15 AM",
    group: "Direct Settle",
    method: "IMPS Bank Transfer",
    methodIcon: "account_balance",
    methodCls: "text-matcha-700",
    amount: `+${inr(2656)}`,
    amountCls: "text-matcha-700",
    verify: "Voucher",
    verifyId: "PL-892182",
  },
  {
    id: "netting",
    icon: "hub",
    iconCls: "bg-secondary-fixed text-on-secondary-fixed",
    title: "Tahoe Cabin Multi-netting",
    date: "Jan 30, 2025 • 08:20 PM",
    group: "Tahoe Ski Trip",
    method: "Debt Netting",
    methodIcon: "autorenew",
    methodCls: "text-secondary",
    amount: `${inr(0)} Net`,
    amountCls: "text-on-surface",
    verify: "Audit Log",
    verifyId: "NET-491290",
    verifyCls: "text-secondary",
  },
];

const HISTORY_FILTERS = [
  { id: "all", label: "All Records" },
  { id: "apple", label: "UPI / GPay" },
  { id: "bank", label: "IMPS Bank" },
  { id: "netting", label: "Netting Optimizations" },
];

const RAILS = [
  { id: "gpay", label: "UPI / GPay", sub: "Instant", icon: "contactless", iconCls: "text-secondary" },
  { id: "imps", label: "IMPS Bank", sub: "HDFC •••• 4019", icon: "account_balance", iconCls: "text-matcha-700" },
  { id: "phonepe", label: "PhonePe", sub: "@sarah-lin-94", icon: "account_balance_wallet", iconCls: "text-secondary" },
];

const NUDGES = [
  { emoji: "☕", msg: "Coffee's on me next!" },
  { emoji: "💼", msg: "Settling tonight after work" },
  { emoji: "🙌", msg: "High five — all sorted!" },
];

export default function FriendBalances() {
  const [rail, setRail] = useState("gpay");
  const [amount, setAmount] = useState(NET);
  const [payInput, setPayInput] = useState(NET.toFixed(2));
  const [paying, setPaying] = useState(false);
  const [historyFilter, setHistoryFilter] = useState("all");
  const [simState, setSimState] = useState("idle");
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);
  const payTimer = useRef(null);
  const inputRef = useRef(null);

  const activeRail = RAILS.find((r) => r.id === rail) || RAILS[0];

  function showToast(message, icon = "check_circle") {
    setToast({ message, icon });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }

  function pickAmount(val) {
    const clamped = Math.max(Math.min(val, NET), 0);
    setAmount(clamped);
    setPayInput(clamped.toFixed(2));
  }

  function onInput(val) {
    setPayInput(val);
    setAmount(Math.max(Math.min(parseFloat(val) || 0, NET), 0));
  }

  function authorize() {
    if (paying) return;
    if (!amount || amount <= 0) {
      showToast("Enter a valid settlement amount.", "error");
      return;
    }
    setPaying(true);
    if (payTimer.current) clearTimeout(payTimer.current);
    payTimer.current = setTimeout(() => {
      setPaying(false);
      showToast(`Settlement of ${inr(amount)} dispatched to Sarah Lin via ${activeRail.label}.`, "send");
    }, 1000);
  }

  function settleItem(item) {
    pickAmount(item.amount);
    setRail("gpay");
    showToast(`${item.group} loaded — ${inr(item.amount)} queued for settlement.`, "bolt");
    inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function simulate() {
    if (simState === "running") return;
    setSimState("running");
    setTimeout(() => {
      setSimState("done");
      setTimeout(() => setSimState("idle"), 3500);
    }, 800);
  }

  function exportReport(kind) {
    showToast(`Generating ${kind} statement for the Sarah Lin bilateral ledger…`, "file_download");
  }

  function sendNudge(msg) {
    showToast(`Nudge sent to @sarah_lin: "${msg}"`, "send");
  }

  return (
    <AppLayout>
      <main className="w-full min-h-screen overflow-x-clip">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumbs
            items={[
              { label: "Home", to: "/dashboard", icon: "home" },
              { label: "Friends", to: "/friends", icon: "diversity_3" },
              { label: "Sarah Lin", to: "/friend-profile" },
              { label: "Bilateral Balances" },
            ]}
            status={{ label: "Bilateral Ledger Online", note: "Zero friction index" }}
          />

          {/* Profile sub-header */}
          <div className="relative overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm shadow-zinc-900/5 border border-outline-variant/60 w-full px-4 py-4 sm:px-5 mb-5">
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="relative shrink-0">
                  <div className="w-14 h-14 rounded-3xl bg-secondary-fixed text-on-secondary-fixed-variant flex items-center justify-center font-bold text-lg ring-2 ring-surface-container">SL</div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center ring-2 ring-surface-container-lowest">
                    <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl sm:text-2xl font-extrabold text-on-surface tracking-tight leading-none">Sarah Lin</h1>
                    <span className="bg-secondary-fixed text-on-secondary-fixed-variant px-2 py-0.5 rounded-full font-label-caps text-label-caps font-semibold">@sarah_lin</span>
                    <span className="bg-matcha-50 text-matcha-800 border border-matcha-200 font-label-caps text-label-caps px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">shield</span> Trusted Splitter
                    </span>
                  </div>
                  <div className="text-xs text-on-surface-variant mt-1.5 flex items-center gap-2 flex-wrap">
                    <span>Shared 4 groups</span>
                    <span className="text-outline-variant">•</span>
                    <span>Settled 28 times</span>
                    <span className="text-outline-variant">•</span>
                    <span className="text-matcha-700 font-semibold flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[13px]">bolt</span> Zero balance friction
                    </span>
                  </div>
                </div>
              </div>

              {/* Pill tabs */}
              <div className="inline-flex p-1.5 rounded-2xl bg-surface-container-low border border-outline-variant/60 gap-1 self-start lg:self-auto overflow-x-auto max-w-full">
                {PROFILE_TABS.map((t) => (
                  <Link
                    key={t.label}
                    to={t.to}
                    className={`px-3.5 py-2 rounded-xl text-xs whitespace-nowrap transition-all ${
                      t.active ? "bg-surface-container-high text-on-surface font-semibold shadow-sm border border-outline-variant/60" : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest font-medium"
                    }`}
                  >
                    {t.label === "Balances" ? (
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
                        <span>{t.label}</span>
                        <span className="px-1.5 py-0.5 rounded-full bg-peach-100 text-tertiary text-[10px] font-bold">{inr0(NET)}</span>
                      </span>
                    ) : (
                      t.label
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            {/* LEFT RAIL */}
            <div className="lg:col-span-7 min-w-0 flex flex-col gap-4">
              {/* Hero bilateral ledger */}
              <div className="bg-surface-container-lowest rounded-3xl p-5 border border-outline-variant/60 shadow-sm relative overflow-hidden">
                <div className="absolute -top-16 -right-16 w-44 h-44 bg-peach-100/60 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-matcha-100/50 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col gap-4">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="material-symbols-outlined text-tertiary text-[18px]">balance</span>
                      <span className="font-label-caps text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">Bilateral Standing Ledger</span>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-peach-100 text-tertiary text-xs font-bold flex items-center gap-1.5 border border-peach-200 shrink-0">
                      <span className="material-symbols-outlined text-[13px]">schedule</span> Due in 3 days
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1.5 sm:gap-4">
                    <span className="text-4xl sm:text-5xl font-extrabold text-tertiary tracking-tight font-mono leading-none">-{inr(NET)}</span>
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-on-surface">You owe Sarah Lin</span>
                      <span className="text-xs text-on-surface-variant">Bilateral cycle ends Feb 25, 2025</span>
                    </div>
                  </div>

                  <div className="bg-surface-container-low rounded-2xl p-3.5 border border-outline-variant/60 flex flex-col md:flex-row md:items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-peach-50 border border-peach-200 text-tertiary flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[17px]">arrow_outward</span>
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider font-label-caps block">Your Gross Debt</span>
                        <span className="text-sm font-bold text-tertiary font-mono">{inr(GROSS_YOU)}</span>
                      </div>
                    </div>
                    <span className="text-on-surface-variant font-bold hidden md:block">−</span>
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-matcha-50 border border-matcha-200 text-matcha-700 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[17px]">arrow_downward</span>
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider font-label-caps block">Sarah&apos;s Gross Debt</span>
                        <span className="text-sm font-bold text-matcha-700 font-mono">{inr(GROSS_SARAH)}</span>
                      </div>
                    </div>
                    <span className="text-on-surface-variant font-bold hidden md:block">=</span>
                    <div className="flex items-center justify-between md:justify-start gap-2 bg-surface-container-lowest px-3 py-2 rounded-xl border border-outline-variant/60">
                      <span className="text-[11px] font-bold text-on-surface uppercase tracking-wider">Net:</span>
                      <span className="text-sm font-bold text-tertiary font-mono">-{inr(NET)}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs text-on-surface-variant w-full sm:w-auto">
                      <span className="material-symbols-outlined text-matcha-600 text-[17px]">verified_user</span>
                      <span className="truncate">Zero bilateral friction • NPCI verified rail</span>
                    </div>
                    <button
                      type="button"
                      onClick={authorize}
                      disabled={paying}
                      className={`w-full sm:w-auto px-5 py-2.5 rounded-2xl text-xs font-bold shadow-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99] shrink-0 ${
                        paying ? "bg-matcha-700 text-white" : "bg-primary hover:bg-primary-container text-on-primary"
                      }`}
                    >
                      <span className={`material-symbols-outlined text-[17px] ${paying ? "animate-spin" : ""}`}>{paying ? "sync" : "send"}</span>
                      <span>{paying ? "Clearing with NPCI…" : `Instant Pay ${inr0(amount)} via ${activeRail.label}`}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Group-by-group breakdown */}
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between gap-2 px-1">
                  <div className="min-w-0">
                    <h2 className="text-base font-bold text-on-surface">Group-by-Group Breakdown</h2>
                    <p className="text-xs text-on-surface-variant">Itemized origin accounts composing your bilateral balance with Sarah</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-surface-container-lowest border border-outline-variant/60 text-xs font-semibold text-on-surface-variant shrink-0">3 Shared Circles</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {GROUPS.map((g) => (
                    <div key={g.title} className="bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-sm flex flex-col overflow-hidden hover:shadow-md transition-all">
                      <div className={`h-1 ${g.bar}`} />
                      <div className="p-4 flex flex-col gap-3 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${g.iconCls}`}>
                            <span className="material-symbols-outlined text-[18px]">{g.icon}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase font-label-caps ${g.stateCls}`}>{g.state}</span>
                        </div>

                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-on-surface break-words">{g.title}</h3>
                          <p className="text-[11px] text-on-surface-variant break-words">{g.sub}</p>
                        </div>

                        <div className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/60 flex flex-col gap-1 mt-auto">
                          <div className="flex items-center justify-between gap-2 text-xs">
                            <span className="font-medium text-on-surface truncate">{g.item}</span>
                            <span className="text-[10px] text-on-surface-variant font-label-caps shrink-0">{g.date}</span>
                          </div>
                          <div className="flex items-center justify-between gap-2 text-xs">
                            <span className="text-[11px] text-on-surface-variant truncate">{g.meta}</span>
                            <span className={`font-bold shrink-0 ${g.amountCls}`}>{g.amount}</span>
                          </div>
                        </div>
                      </div>

                      <div className="px-4 py-3 border-t border-outline-variant/60 flex items-center justify-between gap-2">
                        <span className={`text-[11px] font-semibold flex items-center gap-1 ${g.footerCls}`}>
                          <span className="material-symbols-outlined text-[13px]">{g.footerIcon}</span>
                          {g.footer}
                        </span>
                        {g.action ? (
                          <button
                            type="button"
                            onClick={() => settleItem(g.action)}
                            className="px-3 py-1.5 rounded-xl bg-tertiary hover:bg-on-tertiary-fixed-variant text-on-tertiary text-[11px] font-bold shadow-sm transition-all active:scale-95 shrink-0"
                          >
                            {g.action.label}
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => showToast(`Opening audit log for ${g.title}.`, "description")}
                            className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-[11px] font-semibold transition-colors shrink-0"
                          >
                            {g.tail}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Voucher history */}
              <div className="bg-surface-container-lowest rounded-3xl p-5 border border-outline-variant/60 shadow-sm flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="min-w-0">
                    <h2 className="text-base font-bold text-on-surface">Bilateral Settlement Voucher History</h2>
                    <p className="text-xs text-on-surface-variant">Permanent record of signed vouchers and bank transfers</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button type="button" onClick={() => exportReport("CSV")} className="px-3 py-1.5 rounded-xl bg-surface-container-low border border-outline-variant/60 hover:bg-surface-container text-on-surface text-[11px] font-semibold flex items-center gap-1.5 transition-colors">
                      <span className="material-symbols-outlined text-[14px]">file_download</span>
                      <span>CSV</span>
                    </button>
                    <button type="button" onClick={() => exportReport("PDF")} className="px-3 py-1.5 rounded-xl bg-surface-container-low border border-outline-variant/60 hover:bg-surface-container text-on-surface text-[11px] font-semibold flex items-center gap-1.5 transition-colors">
                      <span className="material-symbols-outlined text-[14px]">picture_as_pdf</span>
                      <span>PDF Export</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-outline-variant/60">
                  {HISTORY_FILTERS.map((f) => {
                    const active = historyFilter === f.id;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setHistoryFilter(f.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all ${
                          active ? "bg-surface-container-high text-on-surface font-bold border border-outline-variant/60" : "text-on-surface-variant hover:text-on-surface font-medium"
                        }`}
                      >
                        {f.label}
                      </button>
                    );
                  })}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[560px]">
                    <thead>
                      <tr className="text-[10px] font-bold text-on-surface-variant font-label-caps uppercase tracking-wider border-b border-outline-variant/60">
                        <th className="py-2 px-2">Transaction / Memo</th>
                        <th className="py-2 px-2">Group Context</th>
                        <th className="py-2 px-2">Method</th>
                        <th className="py-2 px-2 text-right">Amount</th>
                        <th className="py-2 px-2 text-right">Verification</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container">
                      {HISTORY.filter((r) => historyFilter === "all" || r.id === historyFilter).map((r) => (
                        <tr key={r.title} className="hover:bg-surface-container-low transition-colors">
                          <td className="py-2.5 px-2">
                            <div className="flex items-center gap-2.5">
                              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${r.iconCls}`}>
                                <span className="material-symbols-outlined text-[15px]">{r.icon}</span>
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-on-surface break-words">{r.title}</p>
                                <p className="text-[10px] text-on-surface-variant">{r.date}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-2.5 px-2">
                            <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-medium text-[11px] border border-outline-variant/60 whitespace-nowrap">{r.group}</span>
                          </td>
                          <td className="py-2.5 px-2">
                            <div className="flex items-center gap-1.5 text-on-surface-variant">
                              <span className={`material-symbols-outlined text-[14px] ${r.methodCls}`}>{r.methodIcon}</span>
                              <span className="whitespace-nowrap">{r.method}</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-2 text-right">
                            <span className={`font-bold font-mono whitespace-nowrap ${r.amountCls}`}>{r.amount}</span>
                          </td>
                          <td className="py-2.5 px-2 text-right">
                            <button
                              type="button"
                              onClick={() => showToast(`${r.verify} ${r.verifyId} opened.`, "open_in_new")}
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container-lowest border border-outline-variant/60 hover:bg-surface-container text-[11px] font-semibold transition-all shrink-0 ${r.verifyCls || "text-primary"}`}
                            >
                              <span>{r.verify}</span>
                              <span className="material-symbols-outlined text-[11px]">open_in_new</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* RIGHT RAIL */}
            <aside className="lg:col-span-5 min-w-0 flex flex-col gap-4">
              {/* Payment rails */}
              <div className="bg-surface-container-lowest rounded-3xl p-5 border border-outline-variant/60 shadow-sm flex flex-col gap-3.5">
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-outline-variant/60">
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-on-surface flex items-center gap-1.5">
                      <span className="truncate">Payment Rails</span>
                      <span className="material-symbols-outlined text-on-surface-variant text-[15px]">tune</span>
                    </h3>
                    <p className="text-[11px] text-on-surface-variant break-words">Destination channel for settling with @sarah_lin</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-matcha-50 text-matcha-800 text-[10px] font-bold uppercase font-label-caps border border-matcha-200 shrink-0">Instant 0%</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {RAILS.map((r) => {
                    const active = rail === r.id;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setRail(r.id)}
                        className={`p-2.5 rounded-2xl border-2 flex flex-col items-center justify-center text-center transition-all relative ${
                          active ? "border-primary bg-primary-fixed/15 shadow-sm" : "border-outline-variant/60 bg-surface-container-low hover:border-outline"
                        }`}
                      >
                        <span className="w-8 h-8 rounded-xl bg-surface-container-lowest border border-outline-variant/60 flex items-center justify-center shadow-sm">
                          <span className={`material-symbols-outlined text-[18px] ${r.iconCls}`}>{r.icon}</span>
                        </span>
                        <span className="text-[11px] font-bold text-on-surface mt-1.5 break-words w-full">{r.label}</span>
                        <span className="text-[10px] text-on-surface-variant break-words w-full">{r.sub}</span>
                        {active && (
                          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-primary text-on-primary flex items-center justify-center text-[10px] ring-2 ring-surface-container-lowest">
                            <span className="material-symbols-outlined text-[10px]">check</span>
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Partial settlement */}
                <div className="bg-surface-container-low rounded-2xl p-3 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-on-surface flex items-center gap-1.5 min-w-0">
                      <span className="material-symbols-outlined text-[14px] text-primary">sync_alt</span>
                      <span className="truncate">Propose Custom Settlement</span>
                    </span>
                    <span className="text-[10px] text-on-surface-variant font-mono shrink-0">Max: {inr0(NET)}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {[2075, 4150].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => pickAmount(v)}
                        className={`flex-1 py-1.5 rounded-xl border text-xs font-semibold transition-all active:scale-95 ${
                          amount === v ? "bg-matcha-50 border-matcha-200 text-matcha-800 font-bold" : "bg-surface-container-lowest border-outline-variant/60 text-on-surface hover:border-primary"
                        }`}
                      >
                        {inr0(v)}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => pickAmount(NET)}
                      className={`flex-1 py-1.5 rounded-xl border text-xs transition-all active:scale-95 ${
                        amount === NET ? "bg-matcha-50 border-matcha-400 text-matcha-800 font-bold" : "bg-surface-container-lowest border-outline-variant/60 text-on-surface hover:border-primary font-semibold"
                      }`}
                    >
                      {inr0(NET)} Full
                    </button>
                  </div>

                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-xs font-bold text-on-surface-variant">₹</span>
                    <input
                      ref={inputRef}
                      value={payInput}
                      onChange={(e) => onInput(e.target.value)}
                      inputMode="decimal"
                      aria-label="Custom settlement amount"
                      className="w-full pl-7 pr-20 py-2 bg-surface-container-lowest border border-outline-variant/60 rounded-xl text-xs font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/40 focus:border-primary-container"
                      placeholder="0.00"
                    />
                    <button
                      type="button"
                      onClick={() => showToast(`Custom amount ${inr(amount)} staged for ${activeRail.label}.`, "check")}
                      className="absolute right-1.5 px-3 py-1 bg-primary hover:bg-matcha-700 text-on-primary text-[11px] font-bold rounded-lg transition-all active:scale-95"
                    >
                      Set Pay
                    </button>
                  </div>
                </div>
              </div>

              {/* 3-way netting engine */}
              <div className="bg-surface-container-lowest rounded-3xl p-5 border border-outline-variant/60 shadow-sm flex flex-col gap-3.5">
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-outline-variant/60">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-matcha-50 text-matcha-700 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[16px]">hub</span>
                    </div>
                    <h3 className="text-sm font-bold text-on-surface break-words">3-Way Debt Netting Engine</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-matcha-50 text-matcha-800 text-[10px] font-bold border border-matcha-200 shrink-0">2 Cycles Saved</span>
                </div>

                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Instead of you paying Marco {inr0(3320)} and Marco paying Sarah {inr0(3320)}, Tabsy compresses the multi-party cycle into a single bilateral clearance.
                </p>

                <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/60 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-label-caps">
                      Gross Volume: <span className="text-on-surface font-extrabold">{inr(12616)}</span>
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-matcha-700 font-label-caps">
                      Compressed: <span className="font-extrabold">{inr(NET)}</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-col items-center shrink-0">
                      <div className="w-9 h-9 rounded-2xl bg-secondary-fixed text-on-secondary-fixed-variant font-bold text-[11px] flex items-center justify-center border border-secondary-fixed-dim">AM</div>
                      <span className="text-[10px] font-semibold text-on-surface mt-1">You</span>
                      <span className="text-[10px] text-tertiary font-bold font-mono">-{inr0(NET)}</span>
                    </div>

                    <div className="flex-1 flex flex-col items-center px-1 min-w-0">
                      <span className="text-[10px] text-on-surface-variant font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-matcha-600 shrink-0" />
                        <span className="truncate">Marco R. (Net-Neutral)</span>
                      </span>
                      <div className="w-full flex items-center my-1.5 relative">
                        <div className="h-0.5 w-full bg-matcha-600 rounded-full" />
                        <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 px-2 py-0.5 rounded-full bg-surface-container-lowest border border-outline-variant/60 text-[10px] font-bold text-primary shadow-sm font-mono whitespace-nowrap">
                          {inr0(NET)} Direct
                        </span>
                      </div>
                      <span className="text-[9px] text-on-surface-variant">3 transactions collapsed to 1</span>
                    </div>

                    <div className="flex flex-col items-center shrink-0">
                      <div className="w-9 h-9 rounded-2xl bg-secondary-fixed text-on-secondary-fixed-variant font-bold text-[11px] flex items-center justify-center border border-matcha-200">SL</div>
                      <span className="text-[10px] font-semibold text-on-surface mt-1">Sarah</span>
                      <span className="text-[10px] text-matcha-700 font-bold font-mono">+{inr0(NET)}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={simulate}
                    className="w-full py-2 px-3 rounded-xl bg-surface-container-lowest border border-outline-variant/60 hover:bg-surface-container text-on-surface text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-[0.99]"
                  >
                    <span className={`material-symbols-outlined text-[15px] text-primary ${simState === "running" ? "animate-spin" : ""}`}>autorenew</span>
                    <span>
                      {simState === "running" ? "Verifying circular cycles…" : simState === "done" ? `Optimal: 1 direct transfer of ${inr0(NET)}` : "Simulate 3-Way Rebalance"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Nudge & memo */}
              <div className="bg-surface-container-lowest rounded-3xl p-5 border border-outline-variant/60 shadow-sm flex flex-col gap-3.5">
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-outline-variant/60">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="material-symbols-outlined text-secondary text-[17px]">chat_bubble</span>
                    <h3 className="text-sm font-bold text-on-surface truncate">Tactile Nudge &amp; Memo</h3>
                  </div>
                  <span className="text-[10px] text-on-surface-variant uppercase font-label-caps shrink-0">1-Tap Send</span>
                </div>

                <div className="flex flex-col gap-1.5">
                  {NUDGES.map((n) => (
                    <button
                      key={n.msg}
                      type="button"
                      onClick={() => sendNudge(n.msg)}
                      className="text-left px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/60 hover:border-primary hover:bg-matcha-50/40 text-xs font-medium text-on-surface flex items-center justify-between gap-2 transition-all"
                    >
                      <span className="flex items-center gap-2 min-w-0">
                        <span className="text-sm shrink-0">{n.emoji}</span>
                        <span className="truncate">&quot;{n.msg}&quot;</span>
                      </span>
                      <span className="material-symbols-outlined text-[13px] text-on-surface-variant shrink-0">send</span>
                    </button>
                  ))}
                </div>

                <div className="pt-2.5 border-t border-outline-variant/60 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-matcha-50 text-matcha-700 border border-matcha-200 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[16px]">lock</span>
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-on-surface block">Tabsy Safe Escrow Guaranteed</span>
                    <span className="text-[10px] text-on-surface-variant break-words">DICGC-insured partner banks • End-to-end ledger auditing</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[60] flex items-center gap-3 bg-inverse-surface text-inverse-on-surface px-4 py-2.5 rounded-2xl shadow-2xl max-w-[calc(100vw-3rem)]">
          <span className="material-symbols-outlined text-primary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>{toast.icon}</span>
          <span className="text-xs font-medium break-words">{toast.message}</span>
        </div>
      )}
    </AppLayout>
  );
}