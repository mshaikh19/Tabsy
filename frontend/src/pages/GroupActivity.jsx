import { useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import GroupHeader from "../components/layout/GroupHeader";

const CATEGORIES = [
  {
    id: "lodging",
    label: "Lodging & Chalet",
    pct: 49.4,
    amount: 135290,
    slips: 2,
    color: "bg-secondary-fixed",
    icon: "cabin",
    bar: "bg-secondary-container",
  },
  {
    id: "lift",
    label: "Lift Passes & Gear",
    pct: 29.7,
    amount: 81340,
    slips: 2,
    color: "bg-primary-fixed",
    icon: "downhill_skiing",
    bar: "bg-primary-container",
  },
  {
    id: "dining",
    label: "Food & Hot Drinks",
    pct: 18.2,
    amount: 49800,
    slips: 3,
    color: "bg-tertiary-fixed",
    icon: "restaurant",
    bar: "bg-tertiary-container",
  },
  {
    id: "transit",
    label: "Highway Transit & Fuel",
    pct: 8.2,
    amount: 22410,
    slips: 1,
    color: "bg-surface-container-high",
    icon: "directions_car",
    bar: "bg-surface-container-highest",
  },
];

const MILESTONES = [
  {
    id: 1,
    date: "FEB 18 • 11:20 AM",
    title: "Chalet cleaning fee confirmed",
    desc: "6-member split finalized at ₹2,490/person",
    color: "bg-primary-container",
  },
  {
    id: 2,
    date: "FEB 17 • 08:45 PM",
    title: "Rental tune-up pair settled",
    desc: "2 members opt-in: Marco R. & Leo K.",
    color: "bg-secondary-container",
  },
  {
    id: 3,
    date: "FEB 15 • 07:10 AM",
    title: "Heavenly Lift tickets locked",
    desc: "Alex Morgan fronted full group pass",
    color: "bg-primary",
  },
  {
    id: 4,
    date: "FEB 14 • 03:00 PM",
    title: "Genesis Group Initialized",
    desc: "6 members joined, rules set to zero-fee instant",
    color: "bg-outline-variant",
  },
];

const PARTICIPANTS = [
  {
    initials: "AM",
    name: "Alex Morgan (You)",
    actions: 5,
    fronted: 85075,
    highlight: true,
    avatar: "bg-primary-container text-on-primary-container",
  },
  {
    initials: "MR",
    name: "Marco Rossi",
    actions: 4,
    fronted: 120350,
    highlight: false,
    avatar: "bg-secondary-fixed text-on-secondary-fixed",
  },
  {
    initials: "LK",
    name: "Leo Kim",
    actions: 3,
    fronted: 30710,
    highlight: false,
    avatar: "bg-tertiary-fixed text-on-tertiary-fixed",
  },
  {
    initials: "SZ",
    name: "Sarah Zhang",
    actions: 2,
    fronted: 17845,
    highlight: false,
    avatar: "bg-surface-container-high text-on-surface",
  },
];

const ACTIVITY_ITEMS = [
  {
    id: 1,
    dateGroup: "today",
    dateLabel: "Today • Tuesday, Feb 18",
    subLabel: "Checkout Day",
    items: [
      {
        id: 1,
        title: "Chalet Deep Clean & Linen Fee",
        desc: "Paid by Marco Rossi • Split equally 6 ways",
        amount: 14940,
        yourShare: -2490,
        category: "Lodging",
        icon: "cleaning_services",
        iconColor: "bg-secondary-fixed text-on-secondary-fixed",
        slip: "Slip #TH-08",
        ocrVerified: true,
        members: ["AM", "MR", "SZ", "+3"],
        audited: true,
      },
    ],
  },
  {
    id: 2,
    dateGroup: "yesterday",
    dateLabel: "Yesterday • Monday, Feb 17",
    subLabel: "Slopes & Evening",
    items: [
      {
        id: 3,
        title: "Fireside Artisan Hot Cocoa & Pastries",
        desc: "Paid by Alex Morgan (You) • Split 6 ways",
        amount: 3735,
        yourShare: 3112.5,
        category: "Dining",
        icon: "coffee",
        iconColor: "bg-tertiary-fixed text-on-tertiary-fixed",
        missingReceipt: true,
      },
      {
        id: 4,
        title: "Board Wax & Edge Tune-Up",
        desc: "Paid by Leo Kim • Custom 2-way split",
        amount: 13280,
        yourShare: 0,
        category: "Lift Passes",
        icon: "snowboarding",
        iconColor: "bg-primary-fixed text-on-primary-fixed-variant",
        customShares: true,
        splitDesc: "Leo Kim (₹6,640) & Marco Rossi (₹6,640)",
      },
    ],
  },
  {
    id: 3,
    dateGroup: "sunday",
    dateLabel: "Sunday • Feb 16",
    subLabel: "Mountain Storm Day",
    items: [
      {
        id: 5,
        title: "Basecamp Woodfired Pizza & Drinks",
        desc: "Paid by Sarah Zhang • Split equally 6 ways",
        amount: 17845,
        yourShare: -2973.89,
        category: "Dining",
        icon: "local_pizza",
        iconColor: "bg-tertiary-fixed text-on-tertiary-fixed",
        slipAttached: true,
        slipMerchant: "Lake Tahoe Basecamp Co.",
        audited: true,
      },
      {
        id: 6,
        title: "Hwy 50 Emergency Snow Chains",
        desc: "Paid by Leo Kim • Split carpool 3 ways",
        amount: 9130,
        yourShare: -3043.61,
        category: "Transit",
        icon: "tire_repair",
        iconColor: "bg-surface-container-high text-on-surface",
      },
    ],
  },
  {
    id: 4,
    dateGroup: "saturday",
    dateLabel: "Saturday • Feb 15",
    subLabel: "Peak Ride Day",
    items: [
      {
        id: 7,
        title: "Heavenly 2-Day Mountain Passes",
        desc: "Paid by Alex Morgan (You) • 5 Skiers opt-in",
        amount: 81340,
        yourShare: 65072,
        category: "Lift Passes",
        icon: "confirmation_number",
        iconColor: "bg-primary-container text-on-primary-container",
        major: true,
        splitNote: "Sarah opted out (snowshoed). Split across 5 riders (₹16,268/ea).",
      },
    ],
  },
  {
    id: 5,
    dateGroup: "friday",
    dateLabel: "Friday • Feb 14",
    subLabel: "Arrival & Cabin Lock",
    items: [
      {
        id: 8,
        title: "VRBO Pinecrest Ski Lodge Deposit",
        desc: "Paid by Marco Rossi • Equal 6 ways",
        amount: 120350,
        yourShare: -20058.41,
        category: "Lodging",
        icon: "villa",
        iconColor: "bg-secondary-fixed text-on-secondary-fixed",
      },
    ],
  },
];

const RECEIPTS = [
  { id: 1, merchant: "Grocery Mart", amount: 17845, alt: "Paper receipt from Lake Tahoe Mountain Supermarket" },
  { id: 2, merchant: "Heavenly Ski", amount: 81340, alt: "Digital lift pass invoice for Heavenly Mountain Resort" },
  { id: 3, merchant: "Shell Gas", amount: 9130, alt: "Gas station receipt from Shell Truck Stop" },
  { id: 4, merchant: "VRBO Lodge", amount: 120350, alt: "Booking confirmation for luxury pine chalet vacation rental" },
];

export default function GroupActivity() {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState(null);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [feedFilter, setFeedFilter] = useState("expenses");

  function showToast(msg, icon = "check_circle") {
    setToast({ msg, icon });
    setTimeout(() => setToast(null), 3000);
  }

  function handleFilterClick(f) {
    setFilter(f);
    showToast(`Filter applied: ${f}`, "tune");
  }

  function handleFeedFilterClick(f) {
    setFeedFilter(f);
    showToast(`Feed filter: ${f}`, "tune");
  }

  const filteredItems = ACTIVITY_ITEMS.flatMap((g) => g.items).filter((item) => {
    const matchesSearch =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === "all") return true;
    if (filter === "high") return item.amount >= 100;
    if (filter === "review") return item.missingReceipt;
    if (filter === "resolved") return item.audited;
    return true;
  });

  return (
    <AppLayout>
      <div className="bg-background font-body-md text-on-surface antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
        <main className="w-full pt-0 pb-24 bg-background min-h-screen">
          <div className="max-w-7xl w-full mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop flex flex-col gap-6">
            {/* Header */}
            <GroupHeader
              title="Tahoe Ski Weekend 2025"
              subtitle="Immutable double-entry log of expenses, settlement transfers, and verified proof-of-purchase slips across 6 group members."
              currentLabel="Group Activity & Audit Log"
              meta="Ledger #TAB-8492-TH"
              actions={
                <>
                  <Link className="group/btn relative inline-flex items-center gap-0 px-2.5 py-2 text-on-surface font-title-md text-title-md hover:bg-surface-container-lowest rounded-lg transition-all duration-300 ease-out overflow-hidden" to="/group-expenses">
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover/btn:text-secondary transition-colors shrink-0">
                      receipt_long
                    </span>
                    <span className="max-w-0 group-hover/btn:max-w-[120px] group-hover/btn:ml-2 overflow-hidden whitespace-nowrap transition-all duration-300 ease-out opacity-0 group-hover/btn:opacity-100">
                      View Expenses
                    </span>
                  </Link>
                  <div className="w-px h-5 bg-outline-variant/40 shrink-0 transition-all duration-300 group-hover/actions:bg-transparent" />
                  <Link
                    className="group/btn inline-flex items-center gap-0 px-2.5 py-2 bg-primary-container text-on-primary-container font-title-md text-title-md hover:opacity-95 rounded-lg transition-all duration-300 ease-out overflow-hidden"
                    to="/group-expenses"
                  >
                    <span className="material-symbols-outlined text-[18px] shrink-0">
                      ios_share
                    </span>
                    <span className="max-w-0 group-hover/btn:max-w-[140px] group-hover/btn:ml-2 overflow-hidden whitespace-nowrap transition-all duration-300 ease-out opacity-0 group-hover/btn:opacity-100">
                      Export Proof
                    </span>
                  </Link>
                </>
              }
            />

            {/* Top Bento Ribbon */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-sm">
              {/* Bento 1: Total Volume */}
              <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow border border-outline-variant/40">
                <div className="flex items-center justify-between">
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                    Total Group Volume
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-surface-container-high text-on-surface flex items-center justify-center">
                    <span className="material-symbols-outlined text-[16px]">payments</span>
                  </div>
                </div>
                <div className="my-space-sm">
                  <div className="font-numeric-balance-lg text-numeric-balance-lg text-on-surface tracking-tight">₹2,73,900.00</div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    8 receipts logged across 5 days
                  </div>
                </div>
                <div className="flex items-center gap-1.5 pt-space-xs">
                  <span className="w-2 h-2 rounded-full bg-primary-container" />
                  <span className="font-body-sm text-body-sm text-primary font-medium">100% categorised & tagged</span>
                </div>
              </div>

              {/* Bento 2: Personal Impact */}
              <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow border border-outline-variant/40">
                <div className="flex items-center justify-between">
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                    Your Personal Impact
                  </span>
                  <span className="px-space-xs py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-caps text-label-caps">
                    NET SURPLUS
                  </span>
                </div>
                <div className="my-space-sm">
                  <div className="font-numeric-balance-lg text-numeric-balance-lg text-primary tracking-tight">+₹53,176.44</div>
                  <div className="flex items-center gap-space-xs font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    <span>Fronted: ₹85,075.00</span>
                    <span className="text-outline-variant">•</span>
                    <span>Consumed: ₹31,898.56</span>
                  </div>
                </div>
                <div className="w-full bg-surface-container-low rounded-full h-1.5 overflow-hidden">
                  <div className="bg-primary-container h-full rounded-full" style={{ width: "72%" }} />
                </div>
              </div>

              {/* Bento 3: Audit Status */}
              <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow border border-outline-variant/40">
                <div className="flex items-center justify-between">
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                    Audit Chain Status
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-surface-container text-on-surface-variant flex items-center justify-center">
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                  </div>
                </div>
                <div className="my-space-sm">
                  <div className="flex items-baseline gap-space-xs">
                    <span className="font-numeric-balance-lg text-numeric-balance-lg text-on-surface">18/18</span>
                    <span className="font-body-md text-body-md text-primary font-medium">Valid</span>
                  </div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    Zero hash mismatches • Merkle verified
                  </div>
                </div>
                <div className="flex items-center gap-1 font-body-sm text-body-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-[14px] text-primary">lock</span>
                  <span>Block Height #429</span>
                </div>
              </div>

              {/* Bento 4: Fast Filter Hub */}
              <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow border border-outline-variant/40">
                <div className="flex items-center justify-between">
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                    Fast Filter Hub
                  </span>
                  <span className="material-symbols-outlined text-[16px] text-outline">tune</span>
                </div>
                <div className="flex flex-wrap gap-1.5 my-space-sm">
                  {[
                    { key: "all", label: "ALL (18)" },
                    { key: "high", label: ">₹8,300 HIGH" },
                    { key: "review", label: "REVIEW (1)" },
                    { key: "resolved", label: "SETTLED (3)" },
                  ].map((f) => (
                    <button
                      key={f.key}
                      className={`px-space-sm py-1 rounded-full text-label-caps font-label-caps transition-all ${
                        filter === f.key
                          ? "bg-inverse-surface text-inverse-on-surface"
                          : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
                      }`}
                      onClick={() => handleFilterClick(f.key)}
                      type="button"
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
                <div className="font-body-sm text-body-sm text-on-surface-variant flex items-center justify-between">
                  <span>Active View: Real-time</span>
                  <span className="text-primary font-medium">6 participants</span>
                </div>
              </div>
            </section>

            {/* Main 3-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md items-start">
              {/* Column 1: Categories, Milestones, Participants */}
              <div className="lg:col-span-4 space-y-space-md">
                {/* Spend Distribution */}
                <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm space-y-space-md border border-outline-variant/40">
                  <div className="flex items-center justify-between">
                    <h2 className="font-title-md text-title-md text-on-surface">Category Streams</h2>
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Split by %</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-surface-container-low overflow-hidden flex gap-0.5">
                    {CATEGORIES.map((c) => (
                      <div
                        key={c.id}
                        className={`h-full ${c.bar}`}
                        style={{ width: `${c.pct}%` }}
                        title={`${c.label} ${c.pct}%`}
                      />
                    ))}
                  </div>
                  <div className="space-y-space-xs">
                    {CATEGORIES.map((c) => (
                      <div
                        key={c.id}
                        className="flex items-center justify-between p-space-xs rounded-lg hover:bg-surface-container-low transition-colors"
                      >
                        <div className="flex items-center gap-space-sm">
                          <div className={`w-8 h-8 rounded-lg ${c.color} flex items-center justify-center`}>
                            <span className="material-symbols-outlined text-[18px]">{c.icon}</span>
                          </div>
                          <div>
                            <div className="font-body-md text-body-md font-medium text-on-surface">{c.label}</div>
                            <div className="font-body-sm text-body-sm text-on-surface-variant">
                              {c.slips} slips • {c.pct}%
                            </div>
                          </div>
                        </div>
                        <div className="font-numeric-balance-md text-numeric-balance-md text-on-surface">
                          ₹{c.amount.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ledger Milestones */}
                <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm space-y-space-md border border-outline-variant/40">
                  <div className="flex items-center justify-between">
                    <h2 className="font-title-md text-title-md text-on-surface">Ledger Milestones</h2>
                    <span className="material-symbols-outlined text-[18px] text-outline">timeline</span>
                  </div>
                  <div className="space-y-space-sm relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-surface-container-high">
                    {MILESTONES.map((m) => (
                      <div key={m.id} className="relative flex items-start gap-space-sm pl-6">
                        <span className={`absolute left-1.5 top-1 w-3 h-3 rounded-full ${m.color} ring-4 ring-surface-container-lowest`} />
                        <div>
                          <span className="font-label-caps text-label-caps text-on-surface-variant">{m.date}</span>
                          <p className="font-body-md text-body-md text-on-surface font-medium">{m.title}</p>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">{m.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Participant Activity */}
                <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm space-y-space-md border border-outline-variant/40">
                  <div className="flex items-center justify-between">
                    <h2 className="font-title-md text-title-md text-on-surface">Participant Ledger Activity</h2>
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">6 Contribs</span>
                  </div>
                  <div className="space-y-space-xs">
                    {PARTICIPANTS.map((p) => (
                      <div
                        key={p.initials}
                        className={`flex items-center justify-between p-space-xs rounded-lg ${
                          p.highlight ? "bg-surface-container-low" : "hover:bg-surface-container-low transition-colors"
                        }`}
                      >
                        <div className="flex items-center gap-space-sm">
                          <div className={`w-8 h-8 rounded-full ${p.avatar} font-headline-sm text-body-sm flex items-center justify-center font-bold`}>
                            {p.initials}
                          </div>
                          <div>
                            <div className="font-body-md text-body-md font-medium text-on-surface">{p.name}</div>
                            <div className="font-body-sm text-body-sm text-on-surface-variant">
                              {p.actions} actions • Fronted ₹{p.fronted.toFixed(2)}
                            </div>
                          </div>
                        </div>
                        {p.highlight ? (
                          <span className="px-space-xs py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-caps text-label-caps">
                            +{p.actions} ACTIONS
                          </span>
                        ) : (
                          <span className="font-body-sm text-body-sm text-on-surface-variant">{p.actions} actions</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Column 2: Master Chronological Feed */}
              <div className="lg:col-span-5 space-y-space-md">
                {/* Feed Filter & Search */}
                <div className="bg-surface-container-lowest p-space-sm rounded-xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-space-sm border border-outline-variant/40">
                  <div className="flex items-center gap-space-xs w-full sm:w-auto flex-1 bg-surface-container-low px-space-sm py-1.5 rounded-full">
                    <span className="material-symbols-outlined text-[18px] text-outline">search</span>
                    <input
                      className="bg-transparent font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none w-full"
                      placeholder="Filter merchant, member, or notes..."
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-1 shrink-0 overflow-x-auto w-full sm:w-auto">
                    {[
                      { key: "expenses", label: "Expenses (8)" },
                      { key: "settles", label: "Settles (3)" },
                      { key: "audit", label: "Audit (7)" },
                    ].map((f) => (
                      <button
                        key={f.key}
                        className={`px-space-xs py-1 rounded-full text-label-caps font-label-caps transition-colors ${
                          feedFilter === f.key
                            ? "bg-surface-container-high text-on-surface"
                            : "text-on-surface-variant hover:bg-surface-container-low"
                        }`}
                        onClick={() => handleFeedFilterClick(f.key)}
                        type="button"
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Feed Items */}
                <div className="space-y-space-md">
                  {ACTIVITY_ITEMS.map((group) => {
                    const items = filteredItems.filter((i) =>
                      group.items.some((gi) => gi.id === i.id)
                    );
                    if (items.length === 0) return null;
                    return (
                      <div key={group.id} className="space-y-space-xs">
                        <div className="flex items-center justify-between px-space-xs">
                          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                            {group.dateLabel}
                          </span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">{group.subLabel}</span>
                        </div>
                        {items.map((item) => (
                          <div
                            key={item.id}
                            className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow space-y-space-sm border border-outline-variant/40"
                          >
                            <div className="flex items-start justify-between gap-space-sm">
                              <div className="flex items-start gap-space-sm">
                                <div className={`w-10 h-10 rounded-xl ${item.iconColor} flex items-center justify-center shrink-0`}>
                                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                                </div>
                                <div>
                                  <div className="flex items-center gap-space-xs">
                                    <h3 className="font-title-md text-title-md text-on-surface">{item.title}</h3>
                                    {item.major && (
                                      <span className="px-space-xs py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-caps text-label-caps">
                                        MAJOR
                                      </span>
                                    )}
                                  </div>
                                  <p className="font-body-sm text-body-sm text-on-surface-variant">{item.desc}</p>
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <div className="font-numeric-balance-md text-numeric-balance-md text-on-surface">
                                  ₹{item.amount.toFixed(2)}
                                </div>
                                <span
                                  className={`font-body-sm text-body-sm ${
                                    item.yourShare < 0
                                      ? "text-tertiary"
                                      : item.yourShare > 0
                                        ? "text-primary font-medium"
                                        : "text-on-surface-variant"
                                  }`}
                                >
                                  {item.yourShare < 0
? `You owe ₹${Math.abs(item.yourShare).toFixed(2)}`
                                      : item.yourShare > 0
                                        ? `You are owed +₹${item.yourShare.toFixed(2)}`
                                        : `Not in this split (₹0.00)`}
                                </span>
                              </div>
                            </div>

                            {/* Metadata */}
                            <div className="flex items-center justify-between pt-space-xs flex-wrap gap-space-xs">
                              <div className="flex items-center gap-space-xs flex-wrap">
                                {item.slip && (
                                  <span className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded-full bg-surface-container-low text-on-surface font-body-sm text-body-sm">
                                    <span className="material-symbols-outlined text-[14px] text-primary">receipt</span>
                                    {item.slip}
                                  </span>
                                )}
                                {item.ocrVerified && (
                                  <span className="px-space-xs py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-caps text-label-caps">
                                    OCR VERIFIED
                                  </span>
                                )}
                                {item.customShares && (
                                  <span className="px-space-xs py-0.5 rounded-full bg-surface-container-high text-on-surface font-label-caps text-label-caps">
                                    CUSTOM SHARES
                                  </span>
                                )}
                                {item.audited && (
                                  <span className="px-space-xs py-0.5 rounded-full bg-surface-container text-on-surface font-label-caps text-label-caps">
                                    AUDITED
                                  </span>
                                )}
                              </div>
                              {item.members && (
                                <div className="flex items-center gap-1">
                                  <div className="flex -space-x-1.5 overflow-hidden">
                                    {item.members.map((m, idx) => (
                                      <span
                                        key={idx}
                                        className={`w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center ${
                                          idx === 0
                                            ? "bg-primary-container text-on-primary-container"
                                            : idx === 1
                                              ? "bg-secondary-container text-on-secondary-container"
                                              : idx === 2
                                                ? "bg-tertiary-container text-on-tertiary-container"
                                                : "bg-surface-container-high text-on-surface"
                                        }`}
                                      >
                                        {m}
                                      </span>
                                    ))}
                                  </div>
                                  {item.audited && (
                                    <button
                                      className="ml-space-xs text-primary hover:text-on-primary-container text-[12px] font-semibold flex items-center gap-0.5"
                                      type="button"
                                      onClick={() => showToast("Verification status refreshed", "verified")}
                                    >
                                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                                      Audited
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Alert rows */}
                            {item.missingReceipt && (
                              <div className="flex items-center justify-between p-space-xs rounded-lg bg-error-container text-on-error-container">
                                <div className="flex items-center gap-1.5 font-body-sm text-body-sm">
                                  <span className="material-symbols-outlined text-[16px]">warning</span>
                                  <span>Missing receipt slip attachment</span>
                                </div>
                                <button
                                  className="text-label-caps font-label-caps underline hover:opacity-80"
                                  type="button"
                                  onClick={() => showToast("Receipt upload prompt sent to Alex", "upload")}
                                >
                                  Upload Photo
                                </button>
                              </div>
                            )}

                            {item.slipAttached && (
                              <div className="flex items-center justify-between pt-space-xs">
                                <span className="inline-flex items-center gap-1 font-body-sm text-body-sm text-on-surface-variant">
                                  <span className="material-symbols-outlined text-[14px]">attachment</span>
                                  Receipt Slip Attached • {item.slipMerchant}
                                </span>
                              </div>
                            )}

                            {item.splitNote && (
                              <div className="p-space-xs rounded-lg bg-surface-container-low flex items-center justify-between">
                                <span className="font-body-sm text-body-sm text-on-surface-variant">{item.splitNote}</span>
                                <span className="material-symbols-outlined text-[16px] text-primary">task_alt</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Column 3: Receipts Gallery & Vault */}
              <div className="lg:col-span-3 space-y-space-md">
                {/* Receipts Gallery */}
                <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm space-y-space-md border border-outline-variant/40">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-title-md text-title-md text-on-surface">Receipts Gallery</h2>
                      <div className="font-body-sm text-body-sm text-on-surface-variant">7 Scanned Proof Slips</div>
                    </div>
                    <button
                      className="font-body-sm text-body-sm text-primary hover:underline font-semibold"
                      type="button"
                      onClick={() => showToast("Viewing all receipts", "receipt_long")}
                    >
                      View All
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-space-xs">
                    {RECEIPTS.map((r) => (
                      <div
                        key={r.id}
                        className="group relative rounded-lg overflow-hidden bg-surface-container aspect-square cursor-pointer shadow-sm hover:shadow-md transition-all"
                        onClick={() => setSelectedReceipt(r)}
                      >
                        <div
                          className="w-full h-full bg-surface-container-high flex items-center justify-center text-on-surface-variant"
                          title={r.alt}
                        >
                          <span className="material-symbols-outlined text-[32px] opacity-30">receipt_long</span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-transparent to-transparent flex flex-col justify-end p-space-xs text-inverse-on-surface">
                          <span className="font-label-caps text-[10px] leading-tight font-bold">{r.merchant}</span>
                          <span className="font-numeric-balance-md text-[11px] leading-tight">₹{r.amount.toFixed(2)}</span>
                        </div>
                        <span className="absolute top-1.5 right-1.5 px-1 py-0.5 rounded bg-primary text-on-primary font-label-caps text-[9px]">
                          OCR OK
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Missing Slip Alert */}
                  <div className="p-space-sm rounded-xl bg-error-container/40 space-y-space-xs">
                    <div className="flex items-center gap-space-xs text-on-error-container font-label-caps text-label-caps font-bold">
                      <span className="material-symbols-outlined text-[16px]">priority_high</span>
                      <span>1 Flagged Expense Missing Slip</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Hot Cocoa & Pastries (₹3,735.00) requires a photo proof before final settlement lock.
                    </p>
                    <button
                      className="w-full py-1.5 rounded-full bg-surface-container-lowest text-on-surface font-body-sm text-body-sm font-semibold hover:bg-surface-container-low transition-colors shadow-sm text-center"
                      type="button"
                      onClick={() => showToast("SMS Nudge sent to Alex!", "sms")}
                    >
                      Request Slip from Alex
                    </button>
                  </div>
                </div>

                {/* Cryptographic Vault */}
                <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm space-y-space-md border border-outline-variant/40">
                  <div className="flex items-center justify-between">
                    <h2 className="font-title-md text-title-md text-on-surface">Cryptographic Vault</h2>
                    <div className="w-2.5 h-2.5 rounded-full bg-primary-container animate-pulse" />
                  </div>

                  <div className="space-y-space-xs bg-surface-container-low p-space-sm rounded-lg font-mono text-[11px] leading-relaxed text-on-surface-variant">
                    <div className="flex justify-between">
                      <span className="text-outline">Algorithm:</span>
                      <span className="text-on-surface font-medium">SHA-256 Merkle</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-outline">Root Hash:</span>
                      <span className="text-primary truncate max-w-[140px]" title="0x7f9a883b2e001cda">0x7f9a883b2e001cda</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-outline">Signatures:</span>
                      <span className="text-on-surface font-medium">6/6 Validated</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-outline">Replay Protection:</span>
                      <span className="text-primary font-medium">Active (EIP-712)</span>
                    </div>
                  </div>

                  <div className="p-space-xs rounded-lg bg-surface-container-lowest flex items-center gap-space-sm">
                    <div className="relative w-12 h-12 shrink-0">
                      <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                        <path className="text-surface-container-high" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5" />
                        <path className="text-primary-container" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="100, 100" strokeLinecap="round" strokeWidth="3.5" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center font-numeric-balance-md text-[11px] font-bold text-on-surface">
                        100%
                      </div>
                    </div>
                    <div>
                      <div className="font-body-md text-body-md font-semibold text-on-surface">Zero Variance</div>
                      <div className="font-body-sm text-body-sm text-on-surface-variant">All balances mathematically balance to ₹0.00.</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-space-xs pt-space-xs">
                    {[
                      { icon: "data_object", label: "JSON" },
                      { icon: "table_chart", label: "CSV" },
                      { icon: "picture_as_pdf", label: "PDF AUDIT" },
                    ].map((btn) => (
                      <button
                        key={btn.label}
                        className="flex flex-col items-center justify-center p-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface transition-colors"
                        type="button"
                        onClick={() => showToast(`${btn.label} export signed`, "verified")}
                      >
                        <span className="material-symbols-outlined text-[18px]">{btn.icon}</span>
                        <span className="font-label-caps text-[10px] mt-1">{btn.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Receipt Preview Modal */}
      {selectedReceipt && (
        <div
          className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-md flex items-center justify-center p-margin"
          onClick={() => setSelectedReceipt(null)}
        >
          <div
            className="bg-surface-container-lowest max-w-lg w-full rounded-xl overflow-hidden shadow-2xl space-y-space-md p-space-lg transform transition-transform"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Audit Inspection</span>
                <h3 className="font-title-md text-title-md text-on-surface">
                  {selectedReceipt.merchant} Receipt
                </h3>
              </div>
              <button
                className="w-8 h-8 rounded-full bg-surface-container-low text-on-surface flex items-center justify-center hover:bg-surface-container"
                type="button"
                onClick={() => setSelectedReceipt(null)}
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="w-full h-64 rounded-lg bg-surface-container overflow-hidden relative flex items-center justify-center">
              <span className="material-symbols-outlined text-[64px] text-on-surface-variant opacity-20">
                receipt_long
              </span>
            </div>

            <div className="grid grid-cols-2 gap-space-sm bg-surface-container-low p-space-sm rounded-lg text-on-surface font-body-sm text-body-sm">
              <div>
                <span className="text-outline font-label-caps text-[10px] uppercase">Verified Amount</span>
                <div className="font-numeric-balance-md text-numeric-balance-md font-bold text-on-surface">
                  ₹{selectedReceipt.amount.toFixed(2)} INR
                </div>
              </div>
              <div>
                <span className="text-outline font-label-caps text-[10px] uppercase">OCR Confidence</span>
                <div className="font-numeric-balance-md text-numeric-balance-md font-bold text-primary">99.8% Match</div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-space-xs pt-space-xs">
              <button
                className="px-space-md py-space-xs rounded-full bg-primary text-on-primary font-body-md text-body-md hover:bg-on-primary-container transition-colors"
                type="button"
                onClick={() => {
                  setSelectedReceipt(null);
                  showToast("Audit record confirmed", "verified");
                }}
              >
                Confirm Audit Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-space-md py-space-sm rounded-xl shadow-lg flex items-center gap-space-sm animate-in slide-in-from-bottom duration-300">
          <span className="material-symbols-outlined text-[20px] text-primary-fixed">{toast.icon}</span>
          <span className="font-body-md text-body-md">{toast.msg}</span>
        </div>
      )}
    </AppLayout>
  );
}