import { Link } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";

export default function GroupExpenses() {
  return (
    <AppLayout>
      <main className="w-full pt-4 bg-surface min-h-screen">
        <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
              <Link className="hover:text-primary transition-colors flex items-center gap-1" to="/groups">
                <span className="material-symbols-outlined text-[16px]">groups</span>
                Groups
              </Link>
              <span className="text-outline-variant font-bold">/</span>
              <Link className="text-on-surface font-title-md text-title-md flex items-center gap-1.5 hover:text-primary transition-colors" to="/group-details">
                <span>Tahoe Ski Weekend ❄️</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-surface-container-high text-secondary text-label-caps font-label-caps tracking-wider uppercase">Active Cohort</span>
              </Link>
              <span className="text-outline-variant font-bold">/</span>
              <span className="text-primary font-title-md text-title-md font-semibold">Expenses Matrix</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-lowest shadow-sm text-on-surface-variant font-body-sm text-body-sm">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-medium text-on-surface">Live Ledger Sync</span>
              <span className="text-outline-variant">•</span>
              <span className="text-primary font-semibold">Block #8,419 Verified</span>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl p-4 md:p-6 shadow-sm flex flex-col gap-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Group Expenses Workspace</h1>
                  <span className="px-3 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-caps text-label-caps uppercase tracking-wider">8 Entries • ₹2,880.00 Total</span>
                  <span className="px-3 py-1 rounded-full bg-primary-container/20 text-on-primary-container font-label-caps text-label-caps uppercase tracking-wider flex items-center gap-1">
                    <span className="material-symbols-outlined text-body-md">lock_reset</span>
                    Auto-Balanced
                  </span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Cross-category matrix linked directly to peer liquidity, instant OCR verification, and 2-hop minimized debts.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface-container-low text-on-surface hover:bg-surface-container transition-all text-title-md font-title-md shadow-sm" type="button">
                  <span className="material-symbols-outlined text-[18px] text-secondary">file_download</span>
                  Export CSV / PDF
                </button>
                <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-secondary-fixed text-on-secondary-fixed hover:bg-secondary-fixed-dim transition-all text-title-md font-title-md shadow-sm" type="button">
                  <span className="material-symbols-outlined text-[18px]">document_scanner</span>
                  Scan Receipt (OCR)
                </button>
                <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-on-primary hover:bg-on-primary-container transition-all text-title-md font-title-md shadow-md" type="button">
                  <span className="material-symbols-outlined text-[20px]">add</span>
                  Add Expense
                </button>
              </div>
            </div>
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center bg-surface-container-low rounded-xl px-3 py-1.5 gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px]">search</span>
                <input className="bg-transparent font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none w-48 sm:w-60" placeholder="Filter entry, payer, tag..." type="text" />
              </div>
              <div className="flex items-center bg-surface-container-low rounded-xl px-3 py-1.5 gap-1.5 text-on-surface-variant cursor-pointer">
                <span className="material-symbols-outlined text-[18px] text-primary">calendar_today</span>
                <span className="font-body-sm text-body-sm text-on-surface font-medium">Feb 14 – Feb 18, 2025</span>
                <span className="material-symbols-outlined text-[16px]">arrow_drop_down</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <section className="lg:col-span-8 flex flex-col gap-6">
              <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-high/70 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-container-low/75 text-on-surface-variant font-label-caps text-label-caps uppercase tracking-wider border-b border-surface-container-high/60">
                        <th className="py-3 px-3 font-semibold w-16">Date</th>
                        <th className="py-3 px-3 font-semibold">Expense &amp; Merchant</th>
                        <th className="py-3 px-3 font-semibold">Paid By</th>
                        <th className="py-3 px-3 font-semibold">Split Logic</th>
                        <th className="py-3 px-3 text-right font-semibold">Total</th>
                        <th className="py-3 px-3 text-right font-semibold">Your Share</th>
                        <th className="py-3 px-3 text-center font-semibold w-24">Slip / Sub</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container-high/40 text-body-sm text-on-surface">
                      {[
                        { date: "Feb 14", title: "Chalet Cabin Deposit", badge: "Lodging", badgeIcon: "cottage", merchant: "Airbnb #8821 • South Lake Tahoe", paidBy: "Marco Rossi", paidInitials: "MR", split: "Equal 6/6", total: "₹1,450.00", share: "-₹241.66", shareColor: "text-tertiary", shareLabel: "owe Marco" },
                        { date: "Feb 15", title: "Heavenly 2-Day Lift Passes", badge: "Activities", badgeIcon: "downhill_skiing", badgeColor: "bg-primary-fixed text-on-primary-fixed", merchant: "Epic Ski Tahoe • 5 adult day tickets", paidBy: "Alex (You)", paidInitials: "YOU", paidYou: true, split: "5/6 Excludes Sarah", total: "₹980.00", share: "+₹784.00", shareColor: "text-primary", shareLabel: "group owes you" },
                        { date: "Feb 15", title: "Safeway Groceries & Wood", badge: "Groceries", badgeIcon: "local_grocery_store", badgeColor: "bg-secondary-fixed text-on-secondary-fixed", merchant: "Safeway #1492 • Chili feast & breakfast supply", paidBy: "Sarah Lin", paidInitials: "SL", split: "Equal 6/6", total: "₹340.00", share: "-₹56.66", shareColor: "text-tertiary", shareLabel: "owe Sarah" },
                        { date: "Feb 16", title: "Highway Tire Chains & Shell", badge: "Transport", badgeIcon: "directions_car", badgeColor: "bg-surface-container-high text-on-surface-variant", merchant: "Shell Express HWY 50 • Mandatory Caltrans storm pass", paidBy: "Kim Sato", paidInitials: "KS", split: "Equal 6/6", total: "₹110.00", share: "-₹18.33", shareColor: "text-tertiary", shareLabel: "owe Kim" },
                        { date: "Feb 16", title: "Basecamp Pizza & Drinks", badge: "Dining", badgeIcon: "local_pizza", badgeColor: "bg-tertiary-fixed text-on-tertiary-fixed-variant", merchant: "Basecamp Pizza Co. • Craft pints & 3 artisan pies", paidBy: "Jason P.", paidInitials: "JP", split: "Equal 6/6", total: "₹215.00", share: "-₹35.83", shareColor: "text-tertiary", shareLabel: "owe Jason" },
                        { date: "Feb 17", title: "Snowboard Rental & Tune", badge: "Activities", badgeIcon: "downhill_skiing", badgeColor: "bg-primary-fixed text-on-primary-fixed", merchant: "Tahoe Sports LTD • Edge wax & Burton setup", paidBy: "Noah R.", paidInitials: "NR", split: "Noah & Marco 2-way", total: "₹160.00", share: "₹0.00", shareColor: "text-on-surface-variant", shareLabel: "You excluded" },
                        { date: "Feb 17", title: "Cabin Hot Cocoa & Snacks", badge: "Groceries", badgeIcon: "local_grocery_store", badgeColor: "bg-secondary-fixed text-on-secondary-fixed", merchant: "Raley's South Lake • Ghirardelli & marshmallows", paidBy: "Alex (You)", paidInitials: "YOU", paidYou: true, split: "Equal 6/6", total: "₹45.00", share: "+₹37.50", shareColor: "text-primary", shareLabel: "group owes you" },
                        { date: "Feb 18", title: "Chalet Cleaning Sanitation", badge: "Lodging", badgeIcon: "cottage", badgeColor: "bg-surface-container-high text-secondary", merchant: "Tahoe Pine Maid • Checkout sanitation fee", paidBy: "Marco Rossi", paidInitials: "MR", split: "Equal 6/6", total: "₹180.00", share: "-₹30.00", shareColor: "text-tertiary", shareLabel: "owe Marco" },
                      ].map((e, idx) => (
                        <tr key={idx} className="hover:bg-surface-container-low/50 transition-colors group cursor-pointer">
                          <td className="py-3 px-3 whitespace-nowrap text-on-surface-variant font-medium">
                            <span className="font-semibold text-on-surface">{e.date}</span>
                          </td>
                          <td className="py-3 px-3 min-w-[200px]">
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-on-surface text-body-md leading-tight">{e.title}</span>
                              <span className={`inline-flex items-center gap-0.5 px-2 py-0.2 rounded-full font-label-caps text-label-caps ${e.badgeColor || "bg-surface-container-high text-secondary"} font-bold`}>
                                <span className="material-symbols-outlined text-label-caps">{e.badgeIcon}</span> {e.badge}
                              </span>
                            </div>
                            <div className="text-[12px] text-outline flex items-center gap-1 mt-0.5">
                              <span>{e.merchant}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <div className={`w-6 h-6 rounded-full ${e.paidYou ? "bg-primary text-on-primary" : "bg-surface-container-highest text-on-surface"} flex items-center justify-center font-bold text-label-caps shrink-0`}>{e.paidInitials}</div>
                              <span className={`font-medium text-body-sm ${e.paidYou ? "text-primary font-bold" : "text-on-surface"}`}>{e.paidBy}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-surface-container font-medium text-label-caps text-on-surface">{e.split}</span>
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap text-right font-numeric-balance-md text-body-md font-bold text-on-surface">{e.total}</td>
                          <td className="py-3 px-3 whitespace-nowrap text-right">
                            <span className={`${e.shareColor} font-numeric-balance-md text-body-sm font-bold`}>{e.share}</span>
                            <div className="text-label-caps text-on-surface-variant">{e.shareLabel}</div>
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap text-center">
                            <button className="px-2 py-1 rounded-lg bg-surface-container-high hover:bg-surface-container text-on-surface text-label-caps font-medium flex items-center gap-0.5 transition-colors" type="button">
                              <span className="material-symbols-outlined text-body-sm">receipt</span> Slip
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="bg-surface-container-low/60 px-4 py-2.5 flex items-center justify-between text-body-sm border-t border-surface-container-high/60">
                  <div className="flex items-center gap-2 text-outline text-[12px]">
                    <span className="material-symbols-outlined text-[16px]">touch_app</span>
                    <span>Click any row to reveal itemized splits &amp; guest shares</span>
                  </div>
                  <div className="text-[12px] font-semibold text-on-surface">
                    Ledger Total: <span className="font-numeric-balance-md text-primary">₹2,880.00</span>
                  </div>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-4 rounded-2xl border border-surface-container-high/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-body-sm">
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px] text-primary">verified_user</span>
                  <span className="text-[12px]">Cryptographically balanced: individual shares sum precisely to ₹2,880.00</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface text-[12px] font-semibold flex items-center gap-1 transition-colors" type="button">
                    <span className="material-symbols-outlined text-body-md text-outline">folder_zip</span>
                    <span>ZIP Receipts</span>
                  </button>
                  <button className="px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface text-[12px] font-semibold flex items-center gap-1 transition-colors" type="button">
                    <span className="material-symbols-outlined text-body-md text-outline">send</span>
                    <span>Send Report</span>
                  </button>
                </div>
              </div>

              <div className="bg-surface-container-lowest rounded-2xl p-4 md:p-6 shadow-sm flex flex-col gap-4">
                <h2 className="font-headline-sm text-headline-sm text-on-surface">Smart Bipartite Debt Simplification</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Min-cost network flow eliminated 7 circular hops down to just 2 optimal direct transfers.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-3">
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
                      </div>
                      <div className="flex flex-col items-center gap-1 text-center">
                        <div className="w-11 h-11 rounded-full bg-secondary text-on-secondary font-bold flex items-center justify-center text-body-md">MR</div>
                        <span className="font-title-md text-title-md font-semibold text-on-surface">Marco R.</span>
                        <span className="font-body-sm text-body-sm text-primary font-medium">Receives ₹220</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-3 ring-2 ring-primary-container/20">
                    <div className="flex items-center justify-between">
                      <span className="font-label-caps text-label-caps uppercase text-primary font-bold">DIRECT TRANSFER #2 (TO YOU)</span>
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
                      </div>
                      <div className="flex flex-col items-center gap-1 text-center">
                        <div className="w-11 h-11 rounded-full bg-primary text-on-primary font-bold flex items-center justify-center text-body-md shadow-sm">You</div>
                        <span className="font-title-md text-title-md font-semibold text-on-surface">Alex M.</span>
                        <span className="font-body-sm text-body-sm text-primary font-medium">Receives ₹210</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <aside className="lg:col-span-4 flex flex-col gap-6 sticky top-24">
              <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-primary animate-ping opacity-75" />
                    <h2 className="font-title-md text-title-md text-on-surface font-bold">Your Standing &amp; Liquidity</h2>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-primary-container/20 text-on-primary-container font-label-caps text-label-caps uppercase tracking-wider font-bold">Net Surplus</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="bg-surface-container-low rounded-xl p-3 flex flex-col">
                    <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider">Paid Upfront</span>
                    <span className="font-numeric-balance-md text-numeric-balance-md text-on-surface font-bold">₹980.00</span>
                    <span className="font-body-sm text-label-caps text-on-surface-variant">Across 2 items</span>
                  </div>
                  <div className="bg-surface-container-low rounded-xl p-3 flex flex-col">
                    <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider">True Fair Share</span>
                    <span className="font-numeric-balance-md text-numeric-balance-md text-on-surface font-bold">-₹480.00</span>
                    <span className="font-body-sm text-label-caps text-on-surface-variant">Your net consumption</span>
                  </div>
                </div>
                <div className="bg-surface-container-lowest p-3 rounded-xl flex items-center justify-between shadow-sm gap-2">
                  <div className="flex flex-col min-w-0">
                    <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">Net Owed to You:</span>
                    <span className="font-numeric-balance-md text-numeric-balance-md font-extrabold text-primary leading-tight whitespace-nowrap">+₹140.00</span>
                  </div>
                  <button className="px-3 py-2 rounded-xl bg-primary text-on-primary hover:bg-on-primary-container transition-all font-title-md text-title-md text-sm shadow-md flex items-center gap-1.5 shrink-0" type="button">
                    <span className="material-symbols-outlined text-[18px]">payments</span>
                    Request Payout
                  </button>
                </div>
              </div>

              <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm flex flex-col gap-4">
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
            </aside>
          </div>
        </div>
      </main>
    </AppLayout>
  );
}

