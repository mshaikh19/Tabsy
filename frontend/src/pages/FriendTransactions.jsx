import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";

const inr = (n) => `₹${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const inr0 = (n) => `₹${Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

const TRANSACTIONS = [
  {
    id: "t1",
    icon: "shopping_cart",
    iconCls: "bg-primary-fixed/40 text-on-primary-fixed-variant border border-primary/30",
    title: "Trader Joe's Shared Pantry",
    status: "Unsettled",
    statusCls: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
    extra: "Due in 3 days",
    extraCls: "bg-pastel-amber/50 text-[#92400e]",
    date: "Feb 14, 2025",
    time: "18:42 EST",
    address: "Brooklyn Court St, NY",
    group: "Brooklyn Loft",
    groupIcon: "apartment",
    total: 9296,
    payerName: "Sarah Lin (Payer)",
    payerAmount: 9296,
    debtorName: "Alex (Debtor)",
    debtorAmount: 4648,
    amount: 4648,
    amountKind: "owe",
    amountSub: "Your Share (50%)",
    settledLabel: "",
    hash: "9f72-bc10-ee48",
    note: "Picked up pantry restock on the way back from gym! Let me know if we need paper towels too.",
    items: [
      { name: "Organic Whole Milk 1gal", amt: 497.17 },
      { name: "Pasture-Raised Eggs (Dozen)", amt: 538.67 },
      { name: "San Francisco Sourdough Boule", amt: 581.0 },
      { name: "Organic Mixed Greens & Produce", amt: 3527.5 },
      { name: "Pantry Staples, Olive Oil & Coffee", amt: 4151.66 },
    ],
  },
  {
    id: "t2",
    icon: "bolt",
    iconCls: "bg-secondary-fixed text-secondary border border-secondary-fixed-dim",
    title: "ConEd Electric & Highspeed Fiber",
    status: "OCR Verified",
    statusCls: "bg-surface-container-high text-on-surface",
    verified: true,
    date: "Feb 02, 2025",
    time: "09:10 EST",
    address: "ConEd Utilities, NY",
    group: "Brooklyn Loft",
    groupIcon: "apartment",
    total: 13695,
    payerName: "Sarah Lin (Payer)",
    payerAmount: 13695,
    debtorName: "Alex (Debtor)",
    debtorAmount: 4565,
    amount: 4565,
    amountKind: "settled",
    amountSub: "",
    settledLabel: "Settled via GPay Feb 03",
    hash: "3ab1-77c2-19de",
    note: "Auto-split utility cycle for February. Fiber + electric combined.",
    items: [
      { name: "Electricity (Feb cycle)", amt: 8300.0 },
      { name: "Highspeed Fiber 1Gbps", amt: 5395.0 },
    ],
  },
  {
    id: "t3",
    icon: "local_cafe",
    iconCls: "bg-surface-container-high text-on-surface",
    title: "Blue Bottle Coffee & Pastries",
    status: "Direct 1-on-1",
    statusCls: "bg-primary-fixed/40 text-on-primary-fixed",
    date: "Jan 28, 2025",
    time: "08:05 EST",
    address: "Blue Bottle Coffee, NY",
    group: null,
    groupIcon: null,
    total: 2033.5,
    payerName: "Alex (Payer)",
    payerAmount: 2033.5,
    debtorName: "Sarah Lin (Debtor)",
    debtorAmount: 1016.75,
    amount: 1016.75,
    amountKind: "credit",
    amountSub: "",
    settledLabel: "Sarah Settled Jan 28",
    hash: "c40e-9b71-2a6f",
    note: "Grabbed flat whites and almond croissants on the way to the airport.",
    items: [
      { name: "Cold Brew (2)", amt: 620.0 },
      { name: "Almond Croissants (2)", amt: 1413.5 },
    ],
  },
  {
    id: "t4",
    icon: "sanitizer",
    iconCls: "bg-tertiary-fixed text-tertiary",
    title: "Target Home Supplies & Filters",
    status: "Settled",
    statusCls: "bg-surface-container-high text-on-surface",
    date: "Jan 18, 2025",
    time: "17:20 EST",
    address: "Target, Brooklyn NY",
    group: "Brooklyn Loft",
    groupIcon: "apartment",
    total: 6972,
    payerName: "Sarah Lin (Payer)",
    payerAmount: 6972,
    debtorName: "Alex (Debtor)",
    debtorAmount: 2324,
    amount: 2324,
    amountKind: "settled",
    amountSub: "",
    settledLabel: "Settled Jan 20",
    hash: "77bd-0a13-cc90",
    note: "HVAC filters + cleaning restock for the loft.",
    items: [
      { name: "HVAC Filters (4-pack)", amt: 4320.0 },
      { name: "Cleaning Supplies", amt: 2652.0 },
    ],
  },
  {
    id: "t5",
    icon: "downhill_skiing",
    iconCls: "bg-secondary-fixed text-secondary",
    title: "Tahoe Snowboard Rental Sub-share",
    status: "Pot Transfer",
    statusCls: "bg-surface-container-high text-on-surface-variant",
    date: "Jan 05, 2025",
    time: "11:45 EST",
    address: "Tahoe Ski Resort, CA",
    group: "Tahoe Ski Weekend",
    groupIcon: "terrain",
    total: 14940,
    payerName: "Group Pot (Payer)",
    payerAmount: 14940,
    debtorName: "Netting",
    debtorAmount: 0,
    amount: 0,
    amountKind: "zero",
    amountSub: "",
    settledLabel: "Absorbed by Pot / 3-Way Netting ₹0",
    hash: "e19a-4d02-8811",
    note: "Rental absorbed by the group pot and compressed through 3-way netting.",
    items: [
      { name: "Snowboard Rental (3-day)", amt: 9960.0 },
      { name: "Boots & Helmet Add-on", amt: 4980.0 },
    ],
  },
];

const FILTERS = [
  { id: "all", label: "All (28)" },
  { id: "unsettled", label: "Unsettled (1)" },
  { id: "Groceries", label: "Groceries (12)" },
  { id: "Utilities", label: "Utilities (8)" },
  { id: "Dining", label: "Dining (5)" },
  { id: "Travel", label: "Travel (3)" },
];

const CATEGORY = { t1: "Groceries", t2: "Utilities", t3: "Dining", t4: "Utilities", t5: "Travel" };

export default function FriendTransactions() {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("t1");
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  function showToast(message, icon = "check_circle") {
    setToast({ message, icon });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }

  const rows = useMemo(() => {
    return TRANSACTIONS.filter((t) => {
      const matchesFilter =
        filter === "all"
          ? true
          : filter === "unsettled"
            ? t.amountKind === "owe"
            : CATEGORY[t.id] === filter;
      const q = query.trim().toLowerCase();
      const matchesQuery = q === "" || t.title.toLowerCase().includes(q) || (t.group || "").toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [filter, query]);

  const selected = TRANSACTIONS.find((t) => t.id === selectedId) || TRANSACTIONS[0];
  const totalSum = TRANSACTIONS.reduce((s, t) => s + t.total, 0);

  function renderAmount(t) {
    if (t.amountKind === "owe") return <span className="font-numeric-balance-md text-numeric-balance-md text-tertiary font-bold">-{inr(t.amount)}</span>;
    if (t.amountKind === "credit") return <span className="font-numeric-balance-md text-numeric-balance-md text-primary font-bold">+{inr(t.amount)}</span>;
    if (t.amountKind === "settled") return <span className="font-numeric-balance-md text-numeric-balance-md text-on-surface-variant">-{inr(t.amount)}</span>;
    return <span className="font-numeric-balance-md text-numeric-balance-md text-outline font-semibold">{inr(0)}</span>;
  }

  return (
    <AppLayout>
      <div className="bg-[#f7f6fd] font-body-md text-body-md text-on-surface antialiased min-h-screen">
        <main className="w-full pb-12">
          <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
            {/* Breadcrumb + live status */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2 text-[13px] text-on-surface-variant flex-wrap">
                <Link to="/dashboard" className="hover:text-primary transition-colors flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">home</span> Home
                </Link>
                <span className="text-outline-variant text-[14px]">/</span>
                <Link to="/friends" className="hover:text-primary transition-colors">Friends</Link>
                <span className="text-outline-variant text-[14px]">/</span>
                <Link to="/friend-profile" className="hover:text-primary transition-colors font-title-md text-on-surface">Sarah Lin</Link>
                <span className="text-outline-variant text-[14px]">/</span>
                <span className="text-primary font-title-md font-semibold">Bilateral Transaction Ledger</span>
              </div>
              <div className="flex items-center gap-2 self-start md:self-auto">
                <div className="flex items-center gap-2 bg-surface-container-lowest px-3 py-1.5 rounded-full border border-surface-container shadow-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                  <span className="font-label-caps text-label-caps text-on-surface uppercase tracking-wider font-semibold">Sync: Live GPay</span>
                </div>
                <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-container-lowest hover:bg-surface-container-high transition-colors font-body-sm text-body-sm text-on-surface border border-surface-container shadow-xs" type="button" onClick={() => showToast("Ledger exported as CSV audit file", "download")}>
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  <span>Export Ledger</span>
                </button>
              </div>
            </div>

            {/* Panoramic status header */}
            <div className="bg-surface-container-lowest rounded-3xl p-5 lg:p-6 border border-surface-container shadow-xs mb-5">
              {/* Identity + settle */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative shrink-0">
                    <div className="w-20 h-20 rounded-2xl bg-secondary-fixed flex items-center justify-center font-bold text-2xl text-on-secondary-fixed-variant ring-2 ring-surface-container">SL</div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center text-[12px] font-bold ring-2 ring-surface-container-lowest shadow-sm">✓</div>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="font-headline-md text-headline-md text-on-surface">Sarah Lin</h1>
                      <span className="bg-secondary-fixed text-on-secondary-fixed-variant px-2.5 py-0.5 rounded-full font-label-caps text-label-caps font-semibold">@sarah_lin</span>
                      <span className="bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-caps text-label-caps px-2.5 py-0.5 rounded-full font-semibold">Brooklyn Loft Roommate</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Since Aug 2023 · Co-signed in 3 Shared Pots · Auto-settle active</p>
                  </div>
                </div>
                <Link to="/friend-balances" className="h-12 px-6 rounded-2xl bg-primary hover:bg-primary-container text-on-primary font-title-md text-title-md transition-all flex items-center gap-2 shadow-sm hover:shadow justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">credit_card</span>
                  <span>Settle {inr(4648)}</span>
                </Link>
              </div>

              {/* Stat tiles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
                <div className="flex items-center gap-3 bg-tertiary-fixed/70 border border-tertiary-container/30 px-4 py-3 rounded-2xl">
                  <div className="w-10 h-10 rounded-xl bg-tertiary text-on-tertiary flex items-center justify-center shadow-xs shrink-0">
                    <span className="material-symbols-outlined text-[20px]">call_made</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-label-caps text-label-caps uppercase text-on-tertiary-fixed-variant tracking-wider font-bold">You Owe Sarah</span>
                      <span className="px-1.5 py-0.5 rounded bg-tertiary/10 text-tertiary text-[10px] font-label-caps font-bold">Action Needed</span>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-numeric-balance-md text-numeric-balance-md text-tertiary leading-tight">-{inr(4648)}</span>
                      <span className="text-[11px] text-tertiary/80 font-body-sm">3-day window</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-surface-container border border-surface-container-high px-4 py-3 rounded-2xl">
                  <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center shadow-xs shrink-0">
                    <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider font-semibold">Settled YTD</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-numeric-balance-md text-numeric-balance-md text-primary leading-tight">{inr0(148089)}</span>
                      <span className="text-[11px] text-on-surface-variant font-body-sm">28 tabs</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sub-tabs */}
              <div className="mt-5 pt-4 border-t border-surface-container flex items-center gap-2 overflow-x-auto">
                <Link to="/friend-profile" className="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors font-title-md text-body-md whitespace-nowrap">Profile</Link>
                <Link to="/friend-balances" className="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors font-title-md text-body-md flex items-center gap-1.5 whitespace-nowrap">
                  <span>Balances</span>
                  <span className="px-1.5 py-0.5 rounded-md bg-tertiary-fixed text-tertiary font-label-caps text-[11px]">-{inr(4648)}</span>
                </Link>
                <span className="px-4 py-2 rounded-xl bg-on-surface text-inverse-on-surface font-title-md text-body-md flex items-center gap-2 shadow-xs whitespace-nowrap">
                  <span>Transactions</span>
                  <span className="px-2 py-0.5 rounded-full bg-inverse-on-surface/20 text-inverse-on-surface font-label-caps text-label-caps">28 active</span>
                </span>
                <Link to="/friend-activity" className="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors font-title-md text-body-md whitespace-nowrap">Activity Log</Link>
                <Link to="/friend-manage" className="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors font-title-md text-body-md whitespace-nowrap">Bilateral Rules</Link>
              </div>
            </div>

            {/* Analytics cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
              {/* Total volume */}
              <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container shadow-xs flex items-center justify-between gap-3">
                <div className="flex flex-col min-w-0">
                  <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider font-semibold">Total Bilateral Volume</span>
                  <span className="font-numeric-balance-lg text-numeric-balance-lg text-on-surface mt-1">{inr0(totalSum)}</span>
                  <span className="font-body-sm text-body-sm text-primary font-semibold mt-0.5">YTD · 28 records</span>
                </div>
                <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                  <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                    <path className="text-surface-container" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5" />
                    <path className="text-primary stroke-current" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeDasharray="97, 100" strokeLinecap="round" strokeWidth="3.5" />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="font-label-caps text-label-caps text-on-surface font-bold leading-none">97%</span>
                    <span className="text-[8px] text-outline uppercase font-label-caps">on-time</span>
                  </div>
                </div>
              </div>

              {/* Alex contributed */}
              <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider font-semibold">Alex Contributed</span>
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-primary-fixed/30 text-on-primary-fixed font-label-caps text-[11px] font-bold">
                    <span className="material-symbols-outlined text-[14px]">arrow_upward</span> 48.5%
                  </span>
                </div>
                <div className="mt-2">
                  <span className="font-numeric-balance-lg text-numeric-balance-lg text-on-surface">{inr0(74044)}</span>
                  <div className="w-full bg-surface-container rounded-full h-1.5 mt-2 overflow-hidden">
                    <div className="bg-primary-container h-1.5 rounded-full" style={{ width: "48.5%" }} />
                  </div>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant mt-1.5">Direct &amp; Pot reimbursements</span>
              </div>

              {/* Sarah paid upfront */}
              <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider font-semibold">Sarah Paid Upfront</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-caps text-[11px] font-bold">
                    <span className="material-symbols-outlined text-[13px]">flag</span> 51.5% Upfront
                  </span>
                </div>
                <div className="mt-2">
                  <span className="font-numeric-balance-lg text-numeric-balance-lg text-on-surface">{inr0(78692)}</span>
                  <div className="w-full bg-surface-container rounded-full h-1.5 mt-2 overflow-hidden">
                    <div className="bg-tertiary h-1.5 rounded-full" style={{ width: "51.5%" }} />
                  </div>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant mt-1.5">Primary payer for groceries &amp; utils</span>
              </div>

              {/* Velocity */}
              <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider font-semibold">Bilateral Velocity</span>
                  <span className="px-2 py-0.5 rounded-md bg-primary-fixed/40 text-on-primary-fixed font-label-caps text-[11px] font-bold">Top 1% Tier</span>
                </div>
                <div className="flex items-baseline gap-1.5 mt-2">
                  <span className="font-numeric-balance-lg text-numeric-balance-lg text-on-surface">1.2</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">days avg. turnaround</span>
                </div>
                <p className="font-body-sm text-body-sm text-primary font-medium mt-1.5 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px]">bolt</span> Lightning Pace across roommate pair
                </p>
              </div>
            </div>

            {/* Main workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* LEFT: ledger */}
              <div className="lg:col-span-7 flex flex-col gap-5">
                {/* Search + filters */}
                <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="relative flex-1">
                      <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
                      <input className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-surface-container-low focus:bg-surface-container-lowest text-on-surface placeholder:text-outline font-body-md text-body-md outline-none border border-transparent focus:border-surface-container transition-all" placeholder="Filter transactions by merchant, item, category..." type="text" value={query} onChange={(e) => setQuery(e.target.value)} />
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center bg-surface-container-low px-3 py-2 rounded-xl border border-surface-container text-on-surface font-title-md text-body-sm cursor-pointer hover:bg-surface-container">
                        <span className="material-symbols-outlined text-[17px] text-outline mr-1.5">calendar_today</span>
                        <span>Year 2025</span>
                        <span className="material-symbols-outlined text-[16px] text-outline ml-1">arrow_drop_down</span>
                      </div>
                      <button className="p-2 rounded-xl bg-surface-container-low hover:bg-surface-container border border-surface-container text-on-surface-variant" title="Advanced Filters" type="button" onClick={() => showToast("Advanced filters opened", "tune")}>
                        <span className="material-symbols-outlined text-[20px]">tune</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
                    {FILTERS.map((f) => (
                      <button
                        key={f.id}
                        className={`px-3.5 py-1.5 rounded-full font-title-md text-body-sm whitespace-nowrap transition-colors ${
                          filter === f.id
                            ? f.id === "unsettled"
                              ? "bg-tertiary-fixed text-on-tertiary-fixed-variant font-semibold border border-tertiary-container/30"
                              : "bg-on-surface text-inverse-on-surface shadow-xs"
                            : "bg-surface-container-low hover:bg-surface-container text-on-surface-variant border border-surface-container"
                        }`}
                        type="button"
                        onClick={() => setFilter(f.id)}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ledger list */}
                <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container shadow-xs">
                  <div className="flex items-center justify-between pb-3 mb-2 border-b border-surface-container gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="font-title-md text-title-md text-on-surface">Ledger Records</span>
                      <span className="bg-surface-container px-2.5 py-0.5 rounded-full font-label-caps text-label-caps text-on-surface-variant font-medium">Showing {rows.length} of 28</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-body-sm text-body-sm text-outline">Sorted by recent</span>
                      <span className="material-symbols-outlined text-[18px] text-outline">sort</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 mt-3">
                    {rows.length === 0 && (
                      <div className="text-center py-10 text-on-surface-variant">
                        <span className="material-symbols-outlined text-[32px] text-outline">search_off</span>
                        <p className="font-body-sm text-body-sm mt-2">No transactions match this filter.</p>
                      </div>
                    )}
                    {rows.map((t) => {
                      const active = t.id === selectedId;
                      return (
                        <div
                          key={t.id}
                          onClick={() => setSelectedId(t.id)}
                          className={`group p-4 rounded-2xl transition-all cursor-pointer border relative ${
                            active ? "bg-surface-container-low/60 border-2 border-primary shadow-sm" : "bg-surface-container-lowest hover:bg-surface-container-low border border-surface-container shadow-xs"
                          }`}
                        >
                          {active && <div className="absolute left-0 top-3 bottom-3 w-1.5 bg-primary rounded-r" />}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pl-1">
                            <div className="flex items-start gap-3 min-w-0">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${t.iconCls}`}>
                                <span className="material-symbols-outlined text-[24px]">{t.icon}</span>
                              </div>
                              <div className="flex flex-col min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-title-md text-title-md text-on-surface font-semibold">{t.title}</span>
                                  <span className={`px-2 py-0.5 rounded-md font-label-caps text-label-caps font-bold ${t.statusCls}`}>{t.status}</span>
                                  {t.verified && (
                                    <span className="px-2 py-0.5 rounded-md bg-surface-container-high text-on-surface font-label-caps text-label-caps flex items-center gap-1">
                                      <span className="material-symbols-outlined text-[13px] text-primary">verified</span> OCR Verified
                                    </span>
                                  )}
                                  {t.extra && <span className={`px-2 py-0.5 rounded-md font-label-caps text-label-caps font-semibold ${t.extraCls}`}>{t.extra}</span>}
                                </div>
                                <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm mt-1 flex-wrap">
                                  <span>{t.date}</span>
                                  <span>·</span>
                                  {t.group && (
                                    <>
                                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">{t.groupIcon}</span> {t.group}</span>
                                      <span>·</span>
                                    </>
                                  )}
                                  <span>Total: {inr(t.total)}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0 gap-1.5">
                              {renderAmount(t)}
                              {t.amountKind === "owe" ? (
                                <div className="flex items-center gap-2">
                                  <span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold">{t.amountSub}</span>
                                  <button className="px-2.5 py-1 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-body-sm text-[12px] font-semibold transition-all shadow-xs" type="button" onClick={(e) => { e.stopPropagation(); showToast(`Paying ${inr(t.amount)} to Sarah`, "send_money"); }}>
                                    Pay Now
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5">
                                  {t.amountKind !== "zero" && <span className="w-2 h-2 rounded-full bg-primary-container" />}
                                  <span className={`font-label-caps text-label-caps uppercase font-semibold ${t.amountKind === "credit" ? "text-primary" : "text-outline"}`}>{t.settledLabel}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pagination */}
                  <div className="flex flex-col sm:flex-row items-center justify-between pt-4 mt-4 border-t border-surface-container gap-3">
                    <div className="flex items-center gap-3">
                      <button className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-body-sm text-body-sm border border-surface-container transition-colors" type="button" onClick={() => showToast("Downloaded CSV audit ledger", "table_view")}>
                        <span className="material-symbols-outlined text-[18px]">table_view</span>
                        <span>Download CSV Audit Ledger</span>
                      </button>
                      <span className="font-body-sm text-body-sm text-outline">Page 1 of 6</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button className="w-8 h-8 rounded-lg bg-surface-container-low text-outline flex items-center justify-center cursor-not-allowed border border-surface-container" disabled type="button">
                        <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                      </button>
                      <button className="w-8 h-8 rounded-lg bg-primary text-on-primary font-label-caps text-label-caps font-bold flex items-center justify-center shadow-xs" type="button">1</button>
                      <button className="w-8 h-8 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-caps text-label-caps flex items-center justify-center border border-surface-container" type="button">2</button>
                      <button className="w-8 h-8 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-caps text-label-caps flex items-center justify-center border border-surface-container" type="button">3</button>
                      <button className="w-8 h-8 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface flex items-center justify-center border border-surface-container" title="Next" type="button">
                        <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT: inspector (sticky) */}
              <div className="lg:col-span-5 flex flex-col gap-5 lg:sticky lg:top-6">
                <div className="bg-surface-container-lowest rounded-3xl p-5 border border-surface-container shadow-xs">
                  {/* Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-surface-container gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[22px]">document_scanner</span>
                      <span className="font-title-md text-title-md text-on-surface font-bold">Receipt Inspection Lens</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary-fixed/40 text-on-primary-fixed font-label-caps text-[11px] font-bold border border-primary/30">
                      <span className="material-symbols-outlined text-[13px]">verified_user</span>
                      <span>OCR 99.2% • Verified</span>
                    </div>
                  </div>

                  {/* Merchant badge */}
                  <div className="bg-surface-container-low rounded-2xl p-3 my-3 flex items-center justify-between border border-surface-container gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-surface-container-lowest flex items-center justify-center shadow-xs shrink-0 border border-surface-container text-primary">
                        <span className="material-symbols-outlined text-[22px]">{selected.icon}</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-title-md text-title-md text-on-surface truncate font-semibold">{selected.title}</span>
                        <span className="font-body-sm text-body-sm text-outline truncate">{selected.address}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end shrink-0 pl-2">
                      <span className="font-label-caps text-label-caps text-on-surface font-semibold whitespace-nowrap">{selected.date}</span>
                      <span className="font-body-sm text-[11px] text-outline">{selected.time}</span>
                    </div>
                  </div>

                  {/* Thermal receipt preview */}
                  <div className="relative w-full rounded-2xl overflow-hidden mb-4 border border-surface-variant bg-[#fbfbfa] p-4 font-mono text-[12px] shadow-inner select-none">
                    <div className="text-center border-b border-dashed border-secondary-fixed-dim pb-2 mb-2">
                      <div className="font-bold tracking-widest text-on-surface text-[13px] uppercase">{selected.title}</div>
                      <div className="text-[10px] text-outline">{selected.address}</div>
                      <div className="text-[10px] text-outline">RECEIPT · {selected.date} · {selected.time}</div>
                    </div>
                    <div className="space-y-1.5 text-on-surface">
                      {selected.items.map((it, i) => (
                        <div key={i} className="flex justify-between items-center p-0.5 rounded">
                          <span className="truncate pr-2">{it.name}</span>
                          <span className="font-bold ml-2 shrink-0">{inr(it.amt)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-dashed border-secondary-fixed-dim pt-2 mt-2 flex justify-between items-center font-bold text-[13px] text-on-surface">
                      <span>TOTAL</span>
                      <span className="text-primary font-bold text-[14px]">{inr(selected.total)}</span>
                    </div>
                    <div className="mt-3 pt-2 border-t border-surface-variant flex flex-col items-center gap-1 opacity-70">
                      <div className="h-6 w-48 bg-[repeating-linear-gradient(90deg,#131b2e_0,#131b2e_2px,transparent_2px,transparent_4px,#131b2e_4px,#131b2e_7px,transparent_7px,transparent_8px)]" />
                      <span className="text-[9px] tracking-widest text-outline">TX-{selected.id.toUpperCase()}-2025</span>
                    </div>
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-on-surface/80 text-surface font-label-caps text-[10px] uppercase tracking-wider backdrop-blur-xs flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span>Scanned</span>
                    </div>
                  </div>

                  {/* Itemized */}
                  <div className="flex flex-col gap-2 mb-4">
                    <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider font-semibold">Itemized OCR Extraction</span>
                    <div className="bg-surface-container-low rounded-2xl p-3 flex flex-col gap-2 font-body-sm text-body-sm border border-surface-container">
                      {selected.items.map((it, i) => (
                        <div key={i} className="flex items-center justify-between text-on-surface gap-2">
                          <span className="truncate pr-2">{it.name}</span>
                          <span className="font-numeric-balance-md text-body-md font-semibold shrink-0">{inr(it.amt)}</span>
                        </div>
                      ))}
                      <div className="pt-2 mt-1 border-t border-surface-container flex items-center justify-between font-title-md text-title-md text-on-surface font-bold">
                        <span>Subtotal + Tax</span>
                        <span className="font-numeric-balance-md text-primary">{inr(selected.total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Split math */}
                  <div className="p-3 bg-surface-container rounded-2xl flex flex-col gap-2 mb-4 border border-surface-container-high">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-title-md text-title-md text-on-surface font-semibold">Bilateral Split Math</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-surface-container-lowest font-label-caps text-label-caps text-primary font-bold border border-surface-container whitespace-nowrap">50% Equal Split</span>
                    </div>
                    <div className="flex items-center justify-between font-body-sm text-body-sm text-on-surface-variant gap-2">
                      <span className="truncate">{selected.payerName}</span>
                      <span className="font-semibold text-on-surface shrink-0">Paid {inr(selected.payerAmount)} upfront</span>
                    </div>
                    <div className="flex items-center justify-between font-body-sm text-body-sm text-tertiary font-semibold gap-2">
                      <span className="truncate">{selected.debtorName}</span>
                      <span className="font-bold shrink-0">Owes {inr(selected.debtorAmount)}</span>
                    </div>
                    <div className="mt-1 pt-2 border-t border-surface-container-high flex items-center justify-between text-outline text-[11px] font-mono gap-2">
                      <span className="truncate">Ledger Hash: <code className="text-on-surface font-semibold">{selected.hash}</code></span>
                      <span className="text-primary font-sans font-semibold shrink-0">Match: OK ✓</span>
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className="flex flex-col gap-2">
                    <button className="w-full py-3 rounded-2xl bg-primary hover:bg-primary-container text-on-primary font-title-md text-title-md transition-all shadow-sm flex items-center justify-center gap-2" type="button" onClick={() => showToast(selected.amountKind === "owe" ? `Instant Pay ${inr(selected.amount)} to Sarah` : "Signed PDF voucher shared", selected.amountKind === "owe" ? "send_money" : "verified")}>
                      <span className="material-symbols-outlined text-[20px]">{selected.amountKind === "owe" ? "send_money" : "verified"}</span>
                      <span>{selected.amountKind === "owe" ? `Instant Pay ${inr(selected.amount)} to Sarah` : "Share Signed PDF Voucher"}</span>
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      <button className="py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container font-body-sm text-body-sm text-on-surface flex items-center justify-center gap-1.5 border border-surface-container transition-colors" type="button" onClick={() => showToast("Split proportion editor opened", "edit")}>
                        <span className="material-symbols-outlined text-[16px]">edit</span>
                        <span>Edit Split Proportion</span>
                      </button>
                      <button className="py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container font-body-sm text-body-sm text-on-surface flex items-center justify-center gap-1.5 border border-surface-container transition-colors" type="button" onClick={() => showToast("Signed PDF voucher shared", "verified")}>
                        <span className="material-symbols-outlined text-[16px]">verified</span>
                        <span>Share Signed Voucher</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Transaction note */}
                <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container shadow-xs">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-secondary text-[20px]">forum</span>
                    <span className="font-title-md text-title-md text-on-surface font-semibold">Transaction Note</span>
                  </div>
                  <div className="bg-surface-container-low p-3 rounded-xl border border-surface-container">
                    <p className="font-body-sm text-body-sm text-on-surface italic leading-relaxed">"{selected.note}"</p>
                    <span className="font-label-caps text-label-caps text-outline mt-2 block font-medium">— Sarah Lin (via Tabsy Chat)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {toast && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-inverse-surface text-inverse-on-surface px-5 py-3 rounded-2xl shadow-2xl">
            <span className="material-symbols-outlined text-primary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>{toast.icon}</span>
            <span className="font-body-md text-body-md font-medium">{toast.message}</span>
          </div>
        )}
      </div>
    </AppLayout>
  );
}