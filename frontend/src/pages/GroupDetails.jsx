import { Link } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import GroupHeader from "../components/layout/GroupHeader";

export default function GroupDetails() {
  return (
    <AppLayout>
      <main className="w-full pt-4 bg-[#FAF8F5] min-h-screen">
        <div className="max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-6">
          <GroupHeader
            title="Tahoe Ski Weekend ❄️"
            subtitle="6 friends shredding Heavenly & Kirkwood. Cabin split, collective grocery pool, and simplified end-of-trip payouts."
            currentLabel="Group Details"
            actions={
              <>
                <Link className="group/btn relative inline-flex items-center gap-0 px-2.5 py-2 text-on-surface font-title-md text-title-md hover:bg-surface-container-lowest rounded-lg transition-all duration-300 ease-out overflow-hidden" to="/group-expenses">
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover/btn:text-primary transition-colors shrink-0">receipt_long</span>
                  <span className="max-w-0 group-hover/btn:max-w-[120px] group-hover/btn:ml-2 overflow-hidden whitespace-nowrap transition-all duration-300 ease-out opacity-0 group-hover/btn:opacity-100">
                    View Expenses
                  </span>
                </Link>
                <div className="w-px h-5 bg-outline-variant/40 shrink-0 transition-all duration-300 group-hover/actions:bg-transparent" />
                <Link className="group/btn relative inline-flex items-center gap-0 px-2.5 py-2 text-on-surface font-title-md text-title-md hover:bg-surface-container-lowest rounded-lg transition-all duration-300 ease-out overflow-hidden" to="/group-members">
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover/btn:text-secondary transition-colors shrink-0">group</span>
                  <span className="max-w-0 group-hover/btn:max-w-[120px] group-hover/btn:ml-2 overflow-hidden whitespace-nowrap transition-all duration-300 ease-out opacity-0 group-hover/btn:opacity-100">
                    View Members
                  </span>
                </Link>
                <div className="w-px h-5 bg-outline-variant/40 shrink-0 transition-all duration-300 group-hover/actions:bg-transparent" />
                <button className="group/btn inline-flex items-center gap-0 px-2.5 py-2 text-on-surface font-title-md text-title-md hover:bg-surface-container-lowest rounded-lg transition-all duration-300 ease-out overflow-hidden" type="button">
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover/btn:text-on-surface transition-colors shrink-0">bolt</span>
                  <span className="max-w-0 group-hover/btn:max-w-[120px] group-hover/btn:ml-2 overflow-hidden whitespace-nowrap transition-all duration-300 ease-out opacity-0 group-hover/btn:opacity-100">
                    Settle Balances
                  </span>
                </button>
                <div className="w-px h-5 bg-outline-variant/40 shrink-0 transition-all duration-300 group-hover/actions:bg-transparent" />
                <Link className="group/btn inline-flex items-center gap-0 px-2.5 py-2 bg-primary-container text-on-primary-container font-title-md text-title-md hover:opacity-95 rounded-lg transition-all duration-300 ease-out overflow-hidden" to="/group-members/add">
                  <span className="material-symbols-outlined text-[18px] shrink-0">group_add</span>
                  <span className="max-w-0 group-hover/btn:max-w-[120px] group-hover/btn:ml-2 overflow-hidden whitespace-nowrap transition-all duration-300 ease-out opacity-0 group-hover/btn:opacity-100">
                    Invite Friends
                  </span>
                </Link>
                <div className="w-px h-5 bg-outline-variant/40 shrink-0 transition-all duration-300 group-hover/actions:bg-transparent" />
                <Link aria-label="Edit group" className="group/btn relative inline-flex items-center gap-0 px-2.5 py-2 text-on-surface font-title-md text-title-md hover:bg-surface-container-lowest rounded-lg transition-all duration-300 ease-out overflow-hidden" to="/group-edit">
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover/btn:text-primary transition-colors shrink-0">edit</span>
                  <span className="max-w-0 group-hover/btn:max-w-[100px] group-hover/btn:ml-2 overflow-hidden whitespace-nowrap transition-all duration-300 ease-out opacity-0 group-hover/btn:opacity-100">
                    Edit Group
                  </span>
                </Link>
                <div className="w-px h-5 bg-outline-variant/40 shrink-0 transition-all duration-300 group-hover/actions:bg-transparent" />
                <Link aria-label="Settings" className="group/btn relative inline-flex items-center gap-0 px-2.5 py-2 text-on-surface font-title-md text-title-md hover:bg-surface-container-lowest rounded-lg transition-all duration-300 ease-out overflow-hidden" to="/group-settings">
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover/btn:text-on-surface transition-colors shrink-0">settings</span>
                  <span className="max-w-0 group-hover/btn:max-w-[100px] group-hover/btn:ml-2 overflow-hidden whitespace-nowrap transition-all duration-300 ease-out opacity-0 group-hover/btn:opacity-100">
                    Settings
                  </span>
                </Link>
              </>
            }
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <div className="rounded-2xl bg-surface-container-low p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider">Total Group Spend</span>
                <div className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[18px]">payments</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="font-numeric-balance-lg text-numeric-balance-lg text-on-surface">₹2,880.00</div>
                <div className="mt-1 flex items-center gap-1 text-on-surface-variant font-body-sm text-body-sm">
                  <span className="material-symbols-outlined text-body-md text-primary">receipt_long</span>
                  Across 8 shared expenses
                </div>
              </div>
              <div className="mt-3 pt-2 flex items-center justify-between text-outline font-label-caps text-label-caps">
                <span>Avg / person</span>
                <span className="font-semibold text-on-surface">₹480.00</span>
              </div>
            </div>

            <div className="rounded-2xl bg-surface-container-low p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-label-caps uppercase text-on-primary-fixed-variant tracking-wider">Your Net Standing</span>
                <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="font-numeric-balance-lg text-numeric-balance-lg text-primary flex items-baseline gap-1">
                  +₹140.00
                  <span className="font-body-sm text-body-sm font-semibold text-primary">owed to you</span>
                </div>
                <div className="mt-1 text-on-surface-variant font-body-sm text-body-sm flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary-container" />
                  All 5 counterpart accounts active
                </div>
              </div>
              <div className="mt-3">
                <button className="w-full py-1.5 px-3 rounded-lg bg-primary-container text-on-primary-container font-label-caps text-label-caps uppercase text-center hover:opacity-90 active:scale-95 transition-all">
                  Request Settlement âž”
                </button>
              </div>
            </div>

            <div className="rounded-2xl bg-surface-container-low p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider">Your Total Paid</span>
                <div className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-[18px]">credit_score</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="font-numeric-balance-lg text-numeric-balance-lg text-on-surface">₹620.00</div>
                <div className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
                  Personal share is <span className="font-semibold text-on-surface">₹480.00</span>
                </div>
              </div>
              <div className="mt-3 pt-2 flex items-center justify-between text-outline font-label-caps text-label-caps">
                <span>Net Surplus Credit</span>
                <span className="font-semibold text-primary">+₹140.00</span>
              </div>
            </div>

            <div className="rounded-2xl bg-surface-container-low p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider">Circle Sync Health</span>
                <div className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary-container">
                  <span className="material-symbols-outlined text-[18px]">verified_user</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="font-numeric-balance-lg text-numeric-balance-lg text-on-surface">6 Members</div>
                <div className="mt-1 flex items-center gap-1 font-body-sm text-body-sm text-primary">
                  <span className="material-symbols-outlined text-body-md">check_circle</span>
                  100% synced • 0 disputed
                </div>
              </div>
              <div className="mt-3 pt-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="inline-block h-7 w-7 rounded-full bg-primary text-on-primary text-label-caps font-bold flex items-center justify-center ring-2 ring-surface-container-low shrink-0" title="Alex Morgan">AM</div>
                  <div className="inline-block h-7 w-7 rounded-full bg-secondary text-on-secondary text-label-caps font-bold flex items-center justify-center ring-2 ring-surface-container-low shrink-0" title="Marco Rossi">MR</div>
                  <div className="inline-block h-7 w-7 rounded-full bg-tertiary-container text-on-tertiary-container text-label-caps font-bold flex items-center justify-center ring-2 ring-surface-container-low shrink-0" title="Sarah Lin">SL</div>
                  <div className="inline-block h-7 w-7 rounded-full bg-surface-container-high text-on-surface-variant text-label-caps font-bold flex items-center justify-center ring-2 ring-surface-container-low shrink-0" title="Kim Sato">KS</div>
                  <div className="inline-block h-7 w-7 rounded-full bg-secondary-fixed text-on-secondary-fixed text-label-caps font-bold flex items-center justify-center ring-2 ring-surface-container-low shrink-0" title="2 more members">+2</div>
                </div>
                <span className="font-label-caps text-label-caps text-secondary font-semibold shrink-0">ALL AUDITED</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pb-1">
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface-container text-on-surface font-title-md text-title-md font-semibold shadow-sm transition-all">
              <span className="material-symbols-outlined text-[18px] text-primary">dashboard</span>
              Overview
              <span className="w-1.5 h-1.5 rounded-full bg-primary-container ml-1" />
            </button>
            <Link className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low font-title-md text-title-md transition-all" to="/group-expenses">
              <span className="material-symbols-outlined text-[18px]">receipt</span>
              Expenses
              <span className="px-1.5 py-0.2 rounded-full bg-surface-container-high text-on-surface-variant text-label-caps font-label-caps">8</span>
            </Link>
            <Link className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low font-title-md text-title-md transition-all" to="/group-members">
              <span className="material-symbols-outlined text-[18px]">people</span>
              Members
              <span className="px-1.5 py-0.2 rounded-full bg-surface-container-high text-on-surface-variant text-label-caps font-label-caps">6</span>
            </Link>
            <Link className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low font-title-md text-title-md transition-all" to="/group-balances">
              <span className="material-symbols-outlined text-[18px]">alt_route</span>
              Balances &amp; Routing
            </Link>
            <Link className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low font-title-md text-title-md transition-all" to="/group-activity">
              <span className="material-symbols-outlined text-[18px]">history</span>
              Activity Feed
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="rounded-2xl bg-surface-container-lowest p-4 md:p-6 shadow-sm flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="font-headline-sm text-headline-sm text-on-surface tracking-tight">Recent Group Expenses</h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Tap any expense to inspect receipt breakdowns or audit participant allocations.</p>
                  </div>
                  <Link className="inline-flex items-center gap-1 font-title-md text-title-md text-secondary hover:underline group" to="/group-expenses">
                    View all 8 in ledger
                    <span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                  </Link>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <button className="px-3 py-1 rounded-full bg-surface-container text-on-surface font-label-caps text-label-caps">All (8)</button>
                  <button className="px-3 py-1 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface-variant font-label-caps text-label-caps transition-colors">Lodging (1)</button>
                  <button className="px-3 py-1 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface-variant font-label-caps text-label-caps transition-colors">Activities (2)</button>
                  <button className="px-3 py-1 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface-variant font-label-caps text-label-caps transition-colors">Groceries (3)</button>
                  <button className="px-3 py-1 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface-variant font-label-caps text-label-caps transition-colors">Transit (2)</button>
                </div>
                <div className="flex flex-col gap-2">
                  {[
                    { icon: "cabin", iconBg: "bg-surface-variant text-secondary", title: "Chalet Cabin Deposit", badge: "Lodging", paidBy: "Marco Rossi", split: "Split 6 ways (₹241.66 ea)", amount: "₹1,450.00", status: "You owe ₹241.66", statusColor: "bg-error-container text-on-error-container" },
                    { icon: "downhill_skiing", iconBg: "bg-primary-fixed text-on-primary-fixed-variant", title: "Heavenly 2-Day Lift Passes", badge: "Activities", badgeColor: "bg-primary-fixed/40 text-on-primary-fixed", paidBy: "Paid by You", split: "Split 5 ways (₹196.00 ea)", note: "(Excludes Noah)", amount: "₹980.00", status: "You are owed ₹784.00", statusColor: "bg-primary-fixed text-on-primary-fixed-variant" },
                    { icon: "local_grocery_store", iconBg: "bg-tertiary-fixed text-on-tertiary-fixed-variant", title: "Safeway Groceries & Firewood", badge: "Groceries", paidBy: "Sarah Lin", split: "Split 6 ways (₹56.66 ea)", amount: "₹340.00", status: "You owe ₹56.66", statusColor: "bg-error-container text-on-error-container" },
                    { icon: "directions_car", iconBg: "bg-secondary-fixed text-on-secondary-fixed", title: "Highway Tire Chains & Gas", badge: "Transit", paidBy: "Kim Sato", split: "Split 6 ways (₹18.33 ea)", amount: "₹110.00", status: "You owe ₹18.33", statusColor: "bg-error-container text-on-error-container" },
                  ].map((e) => (
                    <div key={e.title} className="group p-3 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl ${e.iconBg} flex items-center justify-center shrink-0`}>
                          <span className="material-symbols-outlined text-[24px]">{e.icon}</span>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-title-md text-title-md font-semibold text-on-surface">{e.title}</span>
                            <span className={`px-2 py-0.5 rounded-full ${e.badgeColor || "bg-surface-container text-on-surface-variant"} font-label-caps text-label-caps`}>{e.badge}</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-1 text-on-surface-variant font-body-sm text-body-sm mt-0.5">
                            <span>{e.paidBy === "Paid by You" ? "" : "Paid by"}</span>
                            <span className={`font-semibold ${e.paidBy === "Paid by You" ? "text-primary" : "text-on-surface"}`}>{e.paidBy}</span>
                            <span>•</span>
                            <span>{e.split}</span>
                            {e.note && <span className="text-outline text-body-sm">{e.note}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0">
                        <span className="font-numeric-balance-md text-numeric-balance-md text-on-surface">{e.amount}</span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${e.statusColor} font-label-caps text-label-caps mt-0.5`}>{e.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-3">
                  <span className="font-label-caps text-label-caps uppercase text-outline tracking-wider block mb-2">Attached Receipt Memories</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {["Chalet", "Passes", "Safeway", "Chains"].map((label) => (
                      <div key={label} className="relative h-20 rounded-xl overflow-hidden shadow-sm group">
                        <div className="w-full h-full bg-surface-container-low" />
                        <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-[#FAF8F5]/80 backdrop-blur-sm text-label-caps font-label-caps font-semibold">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-surface-container-lowest p-4 md:p-6 shadow-sm flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-[22px]">auto_graph</span>
                    </div>
                    <div>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface">Smart Bipartite Debt Simplification</h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">Min-cost network flow eliminated 7 circular hops down to just 2 optimal direct transfers.</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-fixed/50 text-on-primary-fixed-variant font-label-caps text-label-caps">
                    <span className="material-symbols-outlined text-body-md">bolt</span>
                    OPTIMIZED
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-surface-container-low flex flex-col justify-between gap-3">
                    <div className="flex items-center justify-between">
                      <span className="font-label-caps text-label-caps uppercase text-outline">DIRECT TRANSFER #1</span>
                      <span className="font-numeric-balance-md text-numeric-balance-md text-on-surface font-bold">₹220.00</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 py-2">
                      <div className="flex flex-col items-center gap-1 text-center">
                        <div className="w-11 h-11 rounded-full bg-surface-container-high text-on-surface font-bold flex items-center justify-center text-body-md">NR</div>
                        <span className="font-title-md text-title-md font-semibold text-on-surface">Noah R.</span>
                        <span className="font-body-sm text-body-sm text-error font-medium">Sends ₹220</span>
                      </div>
                      <div className="flex-1 flex flex-col items-center px-2">
                        <div className="w-full flex items-center justify-center relative">
                          <div className="h-0.5 w-full bg-secondary-fixed-dim" />
                          <span className="material-symbols-outlined text-secondary absolute text-[18px]">arrow_forward</span>
                        </div>
                        <span className="text-label-caps font-label-caps uppercase text-outline mt-1 text-center">Apple Pay / Venmo</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 text-center">
                        <div className="w-11 h-11 rounded-full bg-secondary text-on-secondary font-bold flex items-center justify-center text-body-md">MR</div>
                        <span className="font-title-md text-title-md font-semibold text-on-surface">Marco R.</span>
                        <span className="font-body-sm text-body-sm text-primary font-medium">Receives ₹220</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="flex-1 py-2 px-3 rounded-xl bg-surface-container-high hover:bg-surface-variant text-on-surface font-title-md text-title-md transition-colors text-center">Send Nudge</button>
                      <button className="flex-1 py-2 px-3 rounded-xl bg-secondary-container text-on-secondary-container font-title-md text-title-md shadow-sm hover:opacity-95 transition-all text-center">Mark Paid</button>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-container-low flex flex-col justify-between gap-3 ring-2 ring-primary-container/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-primary-container" />
                        <span className="font-label-caps text-label-caps uppercase text-primary font-bold">DIRECT TRANSFER #2 (TO YOU)</span>
                      </div>
                      <span className="font-numeric-balance-md text-numeric-balance-md text-primary font-bold">₹210.00</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 py-2">
                      <div className="flex flex-col items-center gap-1 text-center">
                        <div className="w-11 h-11 rounded-full bg-surface-container-high text-on-surface font-bold flex items-center justify-center text-body-md">JP</div>
                        <span className="font-title-md text-title-md font-semibold text-on-surface">Jason P.</span>
                        <span className="font-body-sm text-body-sm text-error font-medium">Sends ₹210</span>
                      </div>
                      <div className="flex-1 flex flex-col items-center px-2">
                        <div className="w-full flex items-center justify-center relative">
                          <div className="h-0.5 w-full bg-primary-fixed-dim" />
                          <span className="material-symbols-outlined text-primary absolute text-[18px]">arrow_forward</span>
                        </div>
                        <span className="text-label-caps font-label-caps uppercase text-primary font-semibold mt-1 text-center">Settles Your Surplus</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 text-center">
                        <div className="w-11 h-11 rounded-full bg-primary text-on-primary font-bold flex items-center justify-center text-body-md shadow-sm">You</div>
                        <span className="font-title-md text-title-md font-semibold text-on-surface">Alex M.</span>
                        <span className="font-body-sm text-body-sm text-primary font-medium">Receives ₹210</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="flex-1 py-2 px-3 rounded-xl bg-primary-container text-on-primary-container font-title-md text-title-md shadow-sm hover:opacity-95 transition-all text-center">Request ₹210</button>
                      <button aria-label="QR Code" className="py-2 px-3 rounded-xl bg-surface-container-high hover:bg-surface-variant text-on-surface transition-colors flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-surface-container flex items-center gap-3 text-on-surface-variant font-body-sm text-body-sm">
                  <span className="material-symbols-outlined text-primary text-[20px] shrink-0">info</span>
                  <span>Instead of 6 people sending multiple ₹18 and ₹56 micro-payments, Tabsy consolidated all debts into two straight settlement paths. Everyone is fully squared after these 2 transfers.</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h2 className="font-headline-sm text-headline-sm text-on-surface">Group Members</h2>
                    <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-caps text-label-caps">6 Total</span>
                  </div>
                  <button className="text-secondary font-title-md text-title-md hover:underline" type="button">Edit</button>
                </div>
                <div className="flex flex-col gap-2">
                  {[
                    { initials: "AM", name: "Alex Morgan", badge: "YOU", badgeColor: "bg-primary-fixed text-on-primary-fixed-variant", paid: "Paid ₹620 • Share ₹480", net: "+₹140.00", netColor: "text-primary", netLabel: "Owed to you", bg: "bg-primary" },
                    { initials: "MR", name: "Marco Rossi", badge: "HOST", badgeColor: "bg-secondary-fixed text-on-secondary-fixed", paid: "Paid ₹1,630 • Share ₹480", net: "+₹420.00", netColor: "text-primary", netLabel: "Owed to him", bg: "bg-secondary" },
                    { initials: "SL", name: "Sarah Lin", paid: "Paid ₹340 • Share ₹420", net: "-₹80.00", netColor: "text-error", netLabel: "Owes", bg: "bg-tertiary-container text-on-tertiary-container" },
                    { initials: "KS", name: "Kim Sato", paid: "Paid ₹110 • Share ₹160", net: "-₹50.00", netColor: "text-error", netLabel: "Owes", bg: "bg-surface-container-high text-on-surface-variant" },
                    { initials: "JP", name: "Jason P.", paid: "Paid ₹0 • Share ₹210", net: "-₹210.00", netColor: "text-error", netLabel: "Owes", bg: "bg-surface-container-high text-on-surface-variant" },
                    { initials: "NR", name: "Noah R.", paid: "Paid ₹0 • Share ₹220", net: "-₹220.00", netColor: "text-error", netLabel: "Owes", bg: "bg-surface-container-high text-on-surface-variant" },
                  ].map((m) => (
                    <div key={m.name} className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${m.bg} text-on-primary font-bold flex items-center justify-center text-body-sm`}>{m.initials}</div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <span className="font-title-md text-title-md font-semibold text-on-surface">{m.name}</span>
                            {m.badge && <span className={`px-1.5 py-0.2 rounded ${m.badgeColor} text-label-caps font-label-caps font-bold`}>{m.badge}</span>}
                          </div>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">{m.paid}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`font-title-md text-title-md font-bold block ${m.netColor}`}>{m.net}</span>
                        <span className={`text-label-caps font-label-caps uppercase font-semibold ${m.netColor}`}>{m.netLabel}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-title-md text-title-md transition-colors text-center" type="button">
                  Manage All Members
                </button>
              </div>

              <div className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-headline-sm text-headline-sm text-on-surface">Settlement &amp; Audit</h2>
                  <span className="material-symbols-outlined text-outline text-[20px]">tune</span>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="p-3 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-tertiary-container text-on-tertiary-container flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[20px]">notifications_active</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-title-md text-title-md font-semibold text-on-surface">Nudge All Outstanding</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">₹560.00 pending across 4 debtors</span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-outline text-[18px]">chevron_right</span>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-surface-container-high text-on-surface flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[20px]">file_download</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-title-md text-title-md font-semibold text-on-surface">Export Group Ledger</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">Download full CSV or formatted audit PDF</span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-outline text-[18px]">chevron_right</span>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-2">
                    <span className="font-label-caps text-label-caps uppercase text-outline">Group Share Link</span>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-lowest gap-2">
                      <span className="font-body-sm text-body-sm text-on-surface font-mono truncate">tabsy.app/join/tahoe-ski-26</span>
                      <button className="shrink-0 text-secondary hover:opacity-80 flex items-center gap-1 font-label-caps text-label-caps" type="button">
                        <span className="material-symbols-outlined text-[16px]">content_copy</span>
                        <span>COPY</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </AppLayout>
  );
}




