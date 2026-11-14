import { useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import GroupHeader from "../components/layout/GroupHeader";

const MEMBERS = [
  {
    id: "marco",
    initials: "MR",
    name: "Marco Rossi",
    role: "Trip Lead",
    fronted: 69720,
    consumed: 34860,
    net: 34860,
    status: "creditor",
    verification: "audited",
  },
  {
    id: "alex",
    initials: "YOU",
    name: "Alex Morgan (You)",
    role: "Active User",
    fronted: 46480,
    consumed: 34860,
    net: 11620,
    status: "creditor",
    verification: "locked",
  },
  {
    id: "noah",
    initials: "NR",
    name: "Noah Reed",
    role: "",
    fronted: 0,
    consumed: 18260,
    net: -18260,
    status: "debtor",
    verification: "pending",
  },
  {
    id: "jason",
    initials: "JP",
    name: "Jason Parker",
    role: "Snow Gear",
    fronted: 5810,
    consumed: 23240,
    net: -17430,
    status: "debtor",
    verification: "split",
  },
  {
    id: "sarah",
    initials: "SL",
    name: "Sarah Lin",
    role: "Gas & Chains",
    fronted: 16600,
    consumed: 23240,
    net: -6640,
    status: "debtor",
    verification: "grouped",
  },
  {
    id: "kim",
    initials: "KS",
    name: "Kim Sato",
    role: "Tolls & Permits",
    fronted: 12450,
    consumed: 16600,
    net: -4150,
    status: "debtor",
    verification: "grouped",
  },
];

const ROUTES = [
  {
    id: "A",
    label: "Route A",
    sublabel: "Single Direct Hop",
    amount: 18260,
    payer: { initials: "NR", name: "Noah Reed", role: "Payer (Owes ₹18,260.00)" },
    receiver: { initials: "MR", name: "Marco Rossi", role: "Receiver (Cabin Admin)" },
    description:
      "Covers lift passes & chalet share. Prunes 3 indirect transfers directly into Marco's ledger.",
    highlight: false,
  },
  {
    id: "B",
    label: "Route B (Your Tab)",
    sublabel: "Direct Incoming",
    amount: 11620,
    payer: { initials: "JP", name: "Jason Parker", role: "Payer (Owes ₹11,620.00)" },
    receiver: { initials: "YOU", name: "Alex Morgan (You)", role: "Fronted Groceries & Gear" },
    description:
      "Directly resolves Jason's share of your grocery store and grocery cart receipts.",
    highlight: true,
  },
  {
    id: "C",
    label: "Route C",
    sublabel: "Direct Transfer",
    amount: 5810,
    payer: { initials: "JP", name: "Jason Parker", role: "Remaining balance" },
    receiver: { initials: "MR", name: "Marco Rossi", role: "Cabin & Van Rental" },
    description:
      "Clears Jason's portion of cabin utility fee and rental snow chains directly to Marco.",
    highlight: false,
  },
  {
    id: "D",
    label: "Route D (Consolidated)",
    sublabel: "2-Payer Consolidated Pool",
    amount: 10790,
    payer: {
      initials: "SL+KS",
      name: "Sarah Lin & Kim Sato",
      role: "Payer Pool",
      subPayers: [
        { initials: "SL", name: "Sarah Lin", amount: -6640 },
        { initials: "KS", name: "Kim Sato", amount: -4150 },
      ],
    },
    receiver: { initials: "MR", name: "Marco Rossi", role: "Receives Full Pool" },
    description:
      "Consolidated food & fuel pool. Sarah & Kim co-fund remainder of Marco's fronted chalet booking.",
    highlight: false,
  },
];

export default function GroupBalances() {
  const [splitPolicy, setSplitPolicy] = useState("strict");
  const [autoLock, setAutoLock] = useState(true);
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null);

  function showToast(message, icon = "check_circle") {
    setToast({ message, icon });
    setTimeout(() => setToast(null), 3200);
  }

  function openSettleModal(payer, recipient, amount) {
    setModal({ payer, recipient, amount });
  }

  function closeModal() {
    setModal(null);
  }

  function executeSettle() {
    closeModal();
    showToast("Settlement transfer broadcasted to banking network!", "send");
  }

  function markReceived(name, amount) {
    showToast(`Marked ₹${amount} from ${name} as received and settled!`, "verified");
  }

  const totalFronted = MEMBERS.reduce((s, m) => s + m.fronted, 0);
  const totalConsumed = MEMBERS.reduce((s, m) => s + m.consumed, 0);
  const netUnsettled = Math.abs(
    MEMBERS.reduce((s, m) => s + Math.min(0, m.net), 0)
  );
  const settledAmount = totalFronted - netUnsettled;
  const settledPct = ((settledAmount / totalFronted) * 100).toFixed(1);

  return (
    <AppLayout>
      <div className="bg-[#FAF8F5] font-body-md text-on-surface antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
        <main className="w-full pt-0 pb-24 bg-[#FAF8F5] min-h-screen">
          <div className="max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
            <GroupHeader
              title="Tahoe Ski Weekend ❄️"
              subtitle="High-density group balance resolution powered by Bipartite Debt Minimization."
              currentLabel="Balances & Debt Resolution"
              actions={
                <>
                  <button
                    className="group/btn relative inline-flex items-center gap-0 px-2.5 py-2 text-on-surface font-title-md text-title-md hover:bg-surface-container-lowest rounded-lg transition-all duration-300 ease-out overflow-hidden"
                    type="button"
                    onClick={() =>
                      showToast(
                        "Broadcasted polite nudge ping to Noah, Jason, Sarah & Kim!",
                        "campaign"
                      )
                    }
                  >
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover/btn:text-secondary transition-colors shrink-0">
                      campaign
                    </span>
                    <span className="max-w-0 group-hover/btn:max-w-[140px] group-hover/btn:ml-2 overflow-hidden whitespace-nowrap transition-all duration-300 ease-out opacity-0 group-hover/btn:opacity-100">
                      Nudge All Debtors
                    </span>
                  </button>
                  <div className="w-px h-5 bg-outline-variant/40 shrink-0 transition-all duration-300 group-hover/actions:bg-transparent" />
                  <button
                    className="group/btn inline-flex items-center gap-0 px-2.5 py-2 bg-primary-container text-on-primary-container font-title-md text-title-md hover:opacity-95 rounded-lg transition-all duration-300 ease-out overflow-hidden"
                    type="button"
                    onClick={() =>
                      openSettleModal("Alex Morgan (You)", "Group Escrow Clearing", "0.00")
                    }
                  >
                    <span className="material-symbols-outlined text-[18px] shrink-0">
                      bolt
                    </span>
                    <span className="max-w-0 group-hover/btn:max-w-[180px] group-hover/btn:ml-2 overflow-hidden whitespace-nowrap transition-all duration-300 ease-out opacity-0 group-hover/btn:opacity-100">
                      1-Click Settle All My Debts
                    </span>
                  </button>
                </>
              }
            />

            {/* Top Highlight Ribbon: Net Clearing Engine */}
            <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-space-md shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-md">
              <div className="flex flex-col sm:flex-row sm:items-center gap-space-lg flex-1">
                <div className="flex items-center gap-3 pr-space-md sm:border-r border-outline-variant/40">
                  <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-[22px]">
                      compare_arrows
                    </span>
                  </div>
                  <div>
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                      Net Clearing Engine
                    </span>
                    <div className="font-headline-sm text-headline-sm text-on-surface font-bold leading-tight">
                      Tahoe Tab Clearance
                    </div>
                  </div>
                </div>

                <div className="flex-1 max-w-xl flex flex-col gap-1.5">
                  <div className="flex items-center justify-between font-body-sm text-body-sm">
                    <span className="text-on-surface-variant flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-secondary-container" />
                      Total Fronted:{" "}
                      <strong className="text-on-surface font-semibold">
                        ₹{totalFronted.toFixed(2)}
                      </strong>
                    </span>
                    <span className="text-on-surface-variant flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-tertiary-container" />
                      Net Unsettled:{" "}
                      <strong className="text-tertiary font-bold">
₹{netUnsettled.toFixed(2)}
                      </strong>{" "}
                      ({(100 - parseFloat(settledPct)).toFixed(1)}%)
                    </span>
                  </div>

                  <div className="w-full h-3 bg-surface-container-low rounded-full overflow-hidden flex p-0.5">
                    <div
                      className="h-full bg-primary-container rounded-l-full"
                      style={{ width: `${settledPct}%` }}
                      title={`Settled: ₹${settledAmount.toFixed(2)}`}
                    />
                    <div
                      className="h-full bg-tertiary-container rounded-r-full"
                      style={{ width: `${100 - parseFloat(settledPct)}%` }}
                      title={`Unsettled: ₹${netUnsettled.toFixed(2)}`}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-on-surface-variant">
                    <span>
                      ₹{settledAmount.toFixed(2)} ({settledPct}%) already resolved & balanced
                    </span>
                    <span className="font-medium text-primary">
                      Zero-Sum Ledger Hash OK
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-surface-container-low border border-outline-variant/40 px-space-md py-2.5 rounded-xl flex items-center gap-space-sm shrink-0">
                <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px]">
                    insights
                  </span>
                </div>
                <div className="text-left">
                  <div className="font-title-md text-[13px] text-on-surface font-semibold">
                    Algorithmic Simplification
                  </div>
                  <div className="font-body-sm text-[12px] text-on-surface-variant">
                    Pruned 6 circular transactions into 4 direct clearing hops
                  </div>
                </div>
                <div className="ml-2 px-2 py-0.5 rounded-full bg-primary/10 text-primary font-label-caps text-label-caps font-bold">
                  -60% TRANSFERS
                </div>
              </div>
            </div>

            {/* Section 1: Optimized Settlement Routes */}
            <section className="flex flex-col gap-space-sm">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-space-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary-container" />
                  <h2 className="font-headline-md text-headline-md text-on-surface tracking-tight">
                    Section 1: Optimized Settlement Routes
                  </h2>
                  <span className="text-on-surface-variant text-body-sm ml-2 hidden sm:inline">
                    (Minimum Hop Pairings)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-body-sm text-on-surface-variant font-medium">
                  <span className="material-symbols-outlined text-[16px] text-primary">
                    verified
                  </span>
                  <span>4 Certified Bilateral Pathways</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                {ROUTES.map((route) => (
                  <div
                    className={`bg-surface-container-lowest border rounded-2xl p-space-md shadow-sm hover:border-outline-variant transition-all flex flex-col justify-between gap-space-md relative overflow-hidden ${
                      route.highlight
                        ? "border-2 border-primary-container/60"
                        : "border-outline-variant/60"
                    }`}
                    key={route.id}
                  >
                    {route.highlight && (
                      <div className="absolute -right-8 -top-8 w-24 h-24 bg-primary-container/10 rounded-full pointer-events-none" />
                    )}
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full font-label-caps text-[11px] font-bold ${
                              route.highlight
                                ? "bg-primary-container text-on-primary-container"
                                : "bg-surface-container-high text-on-surface"
                            }`}
                          >
                            {route.label.toUpperCase()}
                          </span>
                          <span
                            className={`text-body-sm ${
                              route.highlight
                                ? "text-primary font-medium"
                                : "text-on-surface-variant"
                            }`}
                          >
                            {route.sublabel}
                          </span>
                        </div>
                        <span
                          className={`font-numeric-balance-lg text-[22px] font-bold ${
                            route.highlight ? "text-primary" : "text-on-surface"
                          }`}
                        >
                          {route.id === "B" ? "+" : ""}₹{route.amount.toFixed(2)}
                        </span>
                      </div>

                      <div className="bg-surface-container-low/70 rounded-xl p-3 flex items-center justify-between gap-2 border border-outline-variant/30">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-10 h-10 rounded-full bg-surface-container-highest text-on-surface font-bold text-sm flex items-center justify-center shrink-0">
                            {route.payer.initials}
                          </div>
                          <div className="truncate">
                            <div className="font-title-md text-[14px] text-on-surface font-semibold truncate">
                              {route.payer.name}
                            </div>
                            <div
                              className={`text-[11px] font-medium ${
                                route.highlight
                                  ? "text-tertiary"
                                  : "text-on-surface-variant"
                              }`}
                            >
                              {route.payer.role}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-center px-2 shrink-0">
                          <span className="font-numeric-balance-md text-[12px] font-bold text-primary bg-surface-container-lowest px-2 py-0.5 rounded-full shadow-sm border border-outline-variant/40">
                            ₹{route.amount.toFixed(2)}
                          </span>
                          <span className="material-symbols-outlined text-[18px] text-primary mt-0.5">
                            {route.id === "D" ? "merge_type" : "trending_flat"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2.5 min-w-0 justify-end text-right">
                          <div className="truncate">
                            <div className="font-title-md text-[14px] text-on-surface font-semibold truncate">
                              {route.receiver.name}
                            </div>
                            <div
                              className={`text-[11px] font-medium ${
                                route.highlight
                                  ? "text-primary"
                                  : "text-on-surface-variant"
                              }`}
                            >
                              {route.receiver.role}
                            </div>
                          </div>
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                              route.highlight
                                ? "bg-primary text-on-primary"
                                : "bg-surface-container-highest text-on-surface"
                            }`}
                          >
                            {route.receiver.initials}
                          </div>
                        </div>
                      </div>

                      <p className="font-body-sm text-[13px] text-on-surface-variant">
                        {route.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-outline-variant/40">
                      {route.id === "A" && (
                        <>
                          <button
                            className="flex-1 bg-surface-container-low hover:bg-surface-container-high text-on-surface py-2 rounded-lg font-title-md text-[13px] transition-colors flex items-center justify-center gap-1"
                            type="button"
                            onClick={() =>
                              openSettleModal("Noah Reed", "Marco Rossi", "220.00")
                            }
                          >
                            <span className="material-symbols-outlined text-[16px] text-primary">
                              account_balance_wallet
                            </span>
                            <span>Venmo</span>
                          </button>
                          <button
                            className="flex-1 bg-surface-container-low hover:bg-surface-container-high text-on-surface py-2 rounded-lg font-title-md text-[13px] transition-colors flex items-center justify-center gap-1"
                            type="button"
                            onClick={() =>
                              openSettleModal("Noah Reed", "Marco Rossi", "220.00")
                            }
                          >
                            <span className="material-symbols-outlined text-[16px] text-secondary">
                              phone_iphone
                            </span>
                            <span>Apple Pay</span>
                          </button>
                          <button
                            className="bg-primary-container/20 hover:bg-primary-container text-on-primary-container px-3 py-2 rounded-lg font-title-md text-[13px] transition-colors flex items-center justify-center gap-1"
                            type="button"
                            onClick={() =>
                              showToast("Route A marked as settled by Marco Rossi", "check_circle")
                            }
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              done
                            </span>
                            <span>Mark Settled</span>
                          </button>
                        </>
                      )}
                      {route.id === "B" && (
                        <>
                          <button
                            className="bg-surface-container-low hover:bg-surface-container-high text-on-surface px-3 py-2 rounded-lg font-title-md text-[13px] transition-colors flex items-center justify-center gap-1"
                            type="button"
                            onClick={() =>
                              showToast("Nudge sent to Jason Parker via SMS & Tabsy push", "notifications_active")
                            }
                          >
                            <span className="material-symbols-outlined text-[16px] text-secondary">
                              send_to_mobile
                            </span>
                            <span>Nudge</span>
                          </button>
                          <button
                            className="bg-surface-container-low hover:bg-surface-container-high text-on-surface px-3 py-2 rounded-lg font-title-md text-[13px] transition-colors flex items-center justify-center gap-1"
                            type="button"
                            onClick={() =>
                              showToast("Payment link copied to clipboard: tabsy.me/pay/route-b", "link")
                            }
                          >
                            <span className="material-symbols-outlined text-[16px] text-outline">
                              link
                            </span>
                            <span>Copy Link</span>
                          </button>
                          <button
                            className="flex-1 bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container py-2 rounded-lg font-title-md text-[13px] transition-colors flex items-center justify-center gap-1 font-semibold"
                            type="button"
                            onClick={() => markReceived("Jason Parker", "₹11,620.00")}
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              verified
                            </span>
                            <span>Record Payment</span>
                          </button>
                        </>
                      )}
                      {route.id === "C" && (
                        <>
                          <button
                            className="flex-1 bg-surface-container-low hover:bg-surface-container-high text-on-surface py-2 rounded-lg font-title-md text-[13px] transition-colors flex items-center justify-center gap-1.5"
                            type="button"
                            onClick={() =>
                              openSettleModal("Jason Parker", "Marco Rossi", "70.00")
                            }
                          >
                            <span className="material-symbols-outlined text-[16px] text-secondary">
                              sync_alt
                            </span>
                            <span>Execute Direct Transfer</span>
                          </button>
                          <button
                            className="px-3 py-2 bg-surface-container-low hover:bg-surface-container-high text-on-surface rounded-lg font-title-md text-[13px] transition-colors flex items-center justify-center gap-1"
                            type="button"
                            onClick={() =>
                              showToast("Copied Zelle routing ID for Marco Rossi", "content_copy")
                            }
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              content_copy
                            </span>
                          </button>
                        </>
                      )}
                      {route.id === "D" && (
                        <>
                          <button
                            className="flex-1 bg-surface-container-low hover:bg-surface-container-high text-on-surface py-2 rounded-lg font-title-md text-[13px] transition-colors flex items-center justify-center gap-1"
                            type="button"
                            onClick={() =>
                              openSettleModal("Sarah Lin & Kim Sato", "Marco Rossi", "130.00")
                            }
                          >
                            <span className="material-symbols-outlined text-[16px] text-primary">
                              merge
                            </span>
                            <span>Merge Settle (₹10,790.00)</span>
                          </button>
                          <button
                            className="px-3 py-2 bg-surface-container-low hover:bg-surface-container-high text-on-surface rounded-lg font-title-md text-[13px] transition-colors flex items-center justify-center gap-1"
                            type="button"
                            onClick={() =>
                              showToast("Sent payment request batch link to Sarah and Kim", "outgoing_mail")
                            }
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              share
                            </span>
                            <span>Batch Request</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 2: Complete Group Member Ledger */}
            <section className="flex flex-col gap-space-sm mt-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs px-1">
                <div className="flex items-center gap-space-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary-container" />
                  <h2 className="font-headline-md text-headline-md text-on-surface tracking-tight">
                    Section 2: Complete Group Member Ledger & Net Position
                  </h2>
                </div>
                <div className="flex items-center gap-3 text-body-sm text-on-surface-variant">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-primary-container" /> 2 Net Creditors
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-tertiary-container" /> 4 Net Debtors
                  </span>
                  <span className="text-outline font-mono">
                    Gross: ₹{totalFronted.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-container-low/70 border-b border-outline-variant/40 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                        <th className="py-3 px-4">Member Name & Role</th>
                        <th className="py-3 px-4 text-right">Fronted Amount</th>
                        <th className="py-3 px-4 text-right">Consumed Share</th>
                        <th className="py-3 px-5 text-right">Net Standing</th>
                        <th className="py-3 px-4 text-center">Verification Status</th>
                        <th className="py-3 px-4 text-right">
                          Direct Bilateral Settlement Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/30 font-body-sm">
                      {MEMBERS.map((m) => (
                        <tr
                          className={`transition-colors ${
                            m.id === "alex"
                              ? "bg-primary/5 hover:bg-primary/10"
                              : "hover:bg-surface-container-low/40"
                          }`}
                          key={m.id}
                        >
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-9 h-9 rounded-full font-bold text-xs flex items-center justify-center ${
                                  m.id === "alex"
                                    ? "bg-primary text-on-primary shadow-sm"
                                    : "bg-surface-container-highest text-on-surface"
                                }`}
                              >
                                {m.initials}
                              </div>
                              <div>
                                <div
                                  className={`font-title-md text-[14px] text-on-surface flex items-center gap-1.5 ${
                                    m.id === "alex" ? "font-bold" : "font-semibold"
                                  }`}
                                >
                                  <span>{m.name}</span>
                                  {m.role && (
                                    <span className="px-1.5 py-0.5 rounded bg-surface-container-high text-[10px] text-on-surface-variant font-medium">
                                      {m.role}
                                    </span>
                                  )}
                                  {m.id === "alex" && (
                                    <span className="px-1.5 py-0.5 rounded bg-primary-container text-[10px] text-on-primary font-semibold">
                                      Active User
                                    </span>
                                  )}
                                </div>
                                <div className="text-[12px] text-on-surface-variant">
                                  {m.id === "marco" && "Chalet rental, Tahoe park pass"}
                                  {m.id === "alex" && "Lift passes fronted, grocery run"}
                                  {m.id === "noah" && "No direct fronting recorded"}
                                  {m.id === "jason" && "Snow gear deposit (₹5,810)"}
                                  {m.id === "sarah" && "Subaru gas, mountain chains & snacks"}
                                  {m.id === "kim" && "FasTrak tolls & highway permits"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-right font-numeric-balance-md text-on-surface font-medium">
                            ₹{m.fronted.toFixed(2)}
                          </td>
                          <td className="py-3.5 px-4 text-right font-numeric-balance-md text-on-surface-variant">
                            ₹{m.consumed.toFixed(2)}
                          </td>
                          <td className="py-3.5 px-5 text-right">
                            <div className="inline-flex flex-col items-end">
                              <span
                                className={`font-numeric-balance-lg text-[18px] font-bold ${
                                  m.net >= 0 ? "text-primary" : "text-tertiary"
                                }`}
                              >
                                {m.net >= 0 ? "+" : ""}₹{m.net.toFixed(2)}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                  m.net >= 0
                                    ? "bg-primary-container/20 text-on-primary-container"
                                    : "bg-tertiary-container/20 text-on-tertiary-container"
                                }`}
                              >
                                {m.net >= 0 ? "To Receive" : "Owed"}
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-medium text-[11px] ${
                                m.verification === "locked"
                                  ? "bg-primary-container/30 text-on-primary-container font-semibold"
                                  : m.verification === "pending"
                                    ? "bg-error-container text-on-error-container"
                                    : m.verification === "audited"
                                      ? "bg-surface-container-high text-primary"
                                      : "bg-surface-container-high text-on-surface-variant"
                              }`}
                            >
                              <span className="material-symbols-outlined text-[13px]">
                                {m.verification === "locked" && "lock"}
                                {m.verification === "pending" && "pending"}
                                {m.verification === "audited" && "verified"}
                                {m.verification === "split" && "call_split"}
                                {m.verification === "grouped" && "merge"}
                              </span>
                              {m.verification === "locked" && "Signed & Locked"}
                              {m.verification === "pending" && "Pending Route A"}
                              {m.verification === "audited" && "Audited OK"}
                              {m.verification === "split" && "Split (B & C)"}
                              {m.verification === "grouped" && "Route D Grouped"}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            {m.id === "marco" && (
                              <button
                                className="bg-surface-container-low hover:bg-surface-container-high text-on-surface px-3 py-1.5 rounded-lg font-title-md text-[12px] transition-colors inline-flex items-center gap-1"
                                type="button"
                                onClick={() =>
                                  showToast("Marco has 3 pending incoming settlement transfers", "insights")
                                }
                              >
                                <span className="material-symbols-outlined text-[14px] text-secondary">
                                  stacked_line_chart
                                </span>
                                <span>Review Inflow (3)</span>
                              </button>
                            )}
                            {m.id === "alex" && (
                              <button
                                className="bg-primary hover:bg-primary-container text-on-primary hover:text-on-primary-container px-3 py-1.5 rounded-lg font-title-md text-[12px] transition-colors inline-flex items-center gap-1 font-medium"
                                type="button"
onClick={() => markReceived("Jason Parker", "₹11,620.00")}
                              >
                                <span className="material-symbols-outlined text-[14px]">
                                  done_all
                                </span>
                                <span>Collect ₹11,620</span>
                              </button>
                            )}
                            {m.id === "noah" && (
                              <button
                                className="bg-surface-container-low hover:bg-surface-container-high text-on-surface px-3 py-1.5 rounded-lg font-title-md text-[12px] transition-colors inline-flex items-center gap-1"
                                type="button"
                                onClick={() =>
                                  showToast("Nudge sent to Noah Reed (₹18,260.00 due to Marco)", "notifications_active")
                                }
                              >
                                <span className="material-symbols-outlined text-[14px] text-outline">
                                  sms
                                </span>
                                <span>Send Nudge</span>
                              </button>
                            )}
                            {m.id === "jason" && (
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  className="bg-surface-container-low hover:bg-surface-container-high text-on-surface px-2.5 py-1.5 rounded-lg font-title-md text-[12px] transition-colors"
                                  type="button"
                                  onClick={() => showToast("Nudge sent to Jason Parker", "send_to_mobile")}
                                >
                                  Nudge
                                </button>
                                <button
                                  className="bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary px-2.5 py-1.5 rounded-lg font-title-md text-[12px] transition-colors"
                                  type="button"
onClick={() => markReceived("Jason Parker", "₹11,620.00")}
                                >
                                  Clear ₹11,620
                                </button>
                              </div>
                            )}
                            {(m.id === "sarah" || m.id === "kim") && (
                              <button
                                className="bg-surface-container-low hover:bg-surface-container-high text-on-surface px-3 py-1.5 rounded-lg font-title-md text-[12px] transition-colors inline-flex items-center gap-1"
                                type="button"
                                onClick={() =>
                                  showToast(
                                    `Sent reminder to ${m.name} for ₹${Math.abs(m.net).toFixed(0)} pool share`,
                                    "sms"
                                  )
                                }
                              >
                                <span className="material-symbols-outlined text-[14px]">
                                  send
                                </span>
                                <span>Prompt Share</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-surface-container-low/90 font-semibold border-t border-outline-variant/40 text-on-surface">
                        <td className="py-3 px-4 font-title-md text-[13px]">
                          Tabsy Verified Sums (6 Members)
                        </td>
                        <td className="py-3 px-4 text-right font-numeric-balance-md text-[14px]">
₹{totalFronted.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-right font-numeric-balance-md text-[14px]">
                          ₹{totalConsumed.toFixed(2)}
                        </td>
                        <td className="py-3 px-5 text-right font-numeric-balance-md text-primary font-bold text-[15px]">
                          ₹0.00 (Zero-Sum)
                        </td>
                        <td className="py-3 px-4 text-center font-label-caps text-[11px] text-primary">
                          STRICT EQUALITY OK
                        </td>
                        <td className="py-3 px-4 text-right text-[12px] text-on-surface-variant">
                          All balances mathematically bounded
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </section>

            {/* Bottom Governance Bar */}
            <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-space-md shadow-sm flex flex-col md:flex-row items-center justify-between gap-space-md">
              <div className="flex flex-col sm:flex-row sm:items-center gap-space-lg w-full md:w-auto">
                <div className="flex items-center gap-3">
                  <span className="font-body-sm text-[13px] text-on-surface-variant font-medium">
                    Split Policy:
                  </span>
                  <div className="bg-surface-container-low p-1 rounded-full flex items-center">
                    <button
                      className={`font-title-md text-[12px] px-3 py-1 rounded-full transition-all ${
                        splitPolicy === "strict"
                          ? "bg-surface-container-lowest text-on-surface shadow-sm"
                          : "text-on-surface-variant hover:text-on-surface"
                      }`}
                      type="button"
                      onClick={() => {
                        setSplitPolicy("strict");
                        showToast("Enforcing strict equal split policy across all active tabs", "tune");
                      }}
                    >
                      Strict Equal Split
                    </button>
                    <button
                      className={`font-title-md text-[12px] px-3 py-1 rounded-full transition-all ${
                        splitPolicy === "custom"
                          ? "bg-surface-container-lowest text-on-surface shadow-sm"
                          : "text-on-surface-variant hover:text-on-surface"
                      }`}
                      type="button"
                      onClick={() => {
                        setSplitPolicy("custom");
                        showToast("Custom exceptions enabled: adjustments for non-skiers permitted", "tune");
                      }}
                    >
                      Include Custom Exceptions
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      checked={autoLock}
                      className="sr-only peer"
                      type="checkbox"
                      onChange={(e) => {
                        setAutoLock(e.target.checked);
                        showToast(
                          e.target.checked
                            ? "Auto-balance lock enabled"
                            : "Auto-balance lock unlocked for manual adjustments",
                          "lock"
                        );
                      }}
                    />
                    <div className="w-9 h-5 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" />
                  </label>
                  <span className="font-body-sm text-[13px] text-on-surface font-medium">
                    Auto-Balance Lock
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-space-md w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-2 md:pt-0 border-outline-variant/40">
                <div className="flex items-center gap-1.5 text-on-surface-variant text-[12px]">
                  <span className="material-symbols-outlined text-[16px] text-primary">
                    verified_user
                  </span>
                  <span>
                    Audit Sig:{" "}
                    <span className="font-mono text-on-surface font-semibold">0x4b9a..71ec</span>
                  </span>
                </div>
                <button
                  className="bg-surface-container-low hover:bg-surface-container-high text-on-surface px-3 py-1.5 rounded-lg font-title-md text-[12px] transition-colors flex items-center gap-1"
                  type="button"
                  onClick={() =>
                    showToast("Cryptographic ledger audit verified. Zero loss confirmed.", "verified")
                  }
                >
                  <span className="material-symbols-outlined text-[15px]">
                    refresh
                  </span>
                  <span>Verify Ledger</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Settle Up Modal */}
      {modal && (
        <div
          className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-sm flex items-center justify-center p-margin"
          onClick={closeModal}
        >
          <div
            className="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-xl p-space-lg flex flex-col gap-space-md border border-outline-variant/60"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">
                    credit_card
                  </span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">
                  Confirm Bilateral Settlement
                </h3>
              </div>
              <button
                className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-on-surface"
                type="button"
                onClick={closeModal}
              >
                <span className="material-symbols-outlined text-[18px]">
                  close
                </span>
              </button>
            </div>

            <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col gap-space-xs">
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                Settlement Details
              </span>
              <div className="flex items-center justify-between text-on-surface mt-1">
                <span className="font-body-md text-body-md font-semibold">
                  Sender: {modal.payer}
                </span>
                <span className="material-symbols-outlined text-[16px] text-primary">
                  arrow_forward
                </span>
                <span className="font-body-md text-body-md font-semibold">
                  Recipient: {modal.recipient}
                </span>
              </div>
              <div className="mt-2 text-center py-3 bg-surface-container-lowest rounded-xl border border-outline-variant/40">
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Cleared Amount:
                </span>
                <div className="font-numeric-balance-lg text-headline-lg text-primary font-bold">
                  ₹{modal.amount}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-space-xs">
              <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                Instant Payout Provider
              </label>
              <div className="grid grid-cols-3 gap-space-xs">
                <button
                  className="bg-surface-container-high text-on-surface p-space-sm rounded-xl text-center font-title-md text-body-sm flex flex-col items-center gap-1 shadow-sm border border-primary/20"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px] text-primary">
                    account_balance_wallet
                  </span>
                  <span>Venmo</span>
                </button>
                <button
                  className="bg-surface-container-low hover:bg-surface-container-high text-on-surface p-space-sm rounded-xl text-center font-title-md text-body-sm flex flex-col items-center gap-1 transition-colors"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px] text-secondary">
                    phone_iphone
                  </span>
                  <span>Apple Pay</span>
                </button>
                <button
                  className="bg-surface-container-low hover:bg-surface-container-high text-on-surface p-space-sm rounded-xl text-center font-title-md text-body-sm flex flex-col items-center gap-1 transition-colors"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px] text-outline">
                    currency_exchange
                  </span>
                  <span>Zelle</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-space-sm mt-2">
              <button
                className="flex-1 bg-surface-container-low hover:bg-surface-container text-on-surface py-2.5 rounded-xl font-title-md text-body-sm transition-colors"
                type="button"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="flex-1 bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container py-2.5 rounded-xl font-title-md text-body-sm shadow-sm transition-all flex items-center justify-center gap-1 font-semibold"
                type="button"
                onClick={executeSettle}
              >
                <span className="material-symbols-outlined text-[16px]">
                  check
                </span>
                <span>Execute Clearing Transfer</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-space-md py-space-sm rounded-xl shadow-lg flex items-center gap-space-sm animate-in slide-in-from-bottom duration-300">
          <span className="material-symbols-outlined text-[20px] text-primary-fixed">
            {toast.icon}
          </span>
          <span className="font-body-md text-body-md">{toast.message}</span>
        </div>
      )}
    </AppLayout>
  );
}