import AppLayout from "../components/layout/AppLayout";

export default function Balances() {
  return (
    <AppLayout>
      <main className="w-full pt-4 bg-surface">
        <div className="max-w-7xl mx-auto w-full px-6 lg:px-12 py-6 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 border-b border-surface-container pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-macaron-lilac text-macaron-lilac-dark font-label-caps text-label-caps uppercase tracking-wider mb-2">
                <span className="w-2 h-2 rounded-full bg-primary-container" />
                Radial Circle Matrix &amp; Group Ledger
              </div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                Your Social Balances
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                Multi-circle ledger with automated peer simplification &amp; instant payouts.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button className="px-4 py-2.5 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface font-title-md text-title-md transition-all flex items-center gap-2 shadow-sm border border-surface-container" type="button">
                <span className="material-symbols-outlined text-[18px]">download</span>
                <span>Export Proof of Balances</span>
              </button>
              <button className="px-5 py-2.5 rounded-full bg-primary-container hover:bg-primary text-on-primary font-title-md text-title-md transition-all flex items-center gap-2 shadow-sm" type="button">
                <span className="material-symbols-outlined text-[18px]">bolt</span>
                <span>Settle All Net (â‚¹165.20)</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-5 bg-surface-container-lowest p-7 rounded-3xl shadow-sm flex flex-col justify-between border border-surface-container">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary-container" />
                  <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Net Standing Overview</h2>
                </div>
                <div className="flex items-center bg-surface-container-low p-1 rounded-full text-xs font-title-md">
                  <button className="px-3 py-1 rounded-full bg-surface-container-lowest text-primary shadow-xs transition-all" type="button">
                    Individual
                  </button>
                  <button className="px-3 py-1 rounded-full text-on-surface-variant hover:text-on-surface transition-all" type="button">
                    Group
                  </button>
                </div>
              </div>
              <div className="relative flex items-center justify-center my-6">
                <svg className="w-56 h-56 transform -rotate-90" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" fill="none" r="74" stroke="#eaedff" strokeWidth="18" />
                  <circle cx="100" cy="100" fill="none" r="74" stroke="#10b981" strokeDasharray="465" strokeDashoffset="120" strokeLinecap="round" strokeWidth="18" />
                  <circle cx="100" cy="100" fill="none" r="74" stroke="#ff7886" strokeDasharray="465" strokeDashoffset="360" strokeLinecap="round" strokeWidth="18" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                  <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider font-bold">
                    Net Standing
                  </span>
                  <div className="font-numeric-balance-lg text-numeric-balance-lg text-primary tracking-tight font-extrabold mt-0.5">
                    +â‚¹317.30
                  </div>
                  <span className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full bg-macaron-mint/20 text-primary font-title-md text-body-sm font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-container" />
                    Surplus Balance
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-surface-container">
                <div className="p-3 bg-surface-container-low rounded-2xl flex items-center gap-3">
                  <div className="w-3.5 h-3.5 rounded-full bg-primary-container shrink-0" />
                  <div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-none">Owed To You</p>
                    <p className="font-numeric-balance-md text-numeric-balance-md text-on-surface font-bold mt-1">â‚¹482.50</p>
                  </div>
                </div>
                <div className="p-3 bg-macaron-peach/40 rounded-2xl flex items-center gap-3">
                  <div className="w-3.5 h-3.5 rounded-full bg-tertiary-container shrink-0" />
                  <div>
                    <p className="font-body-sm text-body-sm text-macaron-peach-dark leading-none">You Owe</p>
                    <p className="font-numeric-balance-md text-numeric-balance-md text-tertiary font-bold mt-1">â‚¹165.20</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-4 justify-between">
              <div className="bg-macaron-sky/60 p-6 rounded-3xl border border-sky-100 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-macaron-sky-dark text-[22px]">diversity_3</span>
                    <h3 className="font-title-md text-title-md text-on-surface font-bold">Active Shared Circles</h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/80 text-macaron-sky-dark font-label-caps text-label-caps font-bold">
                    3 Synchronized Pools
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { name: "Goa Trip", icon: "flight", net: "+â‚¹180.00", color: "text-primary" },
                    { name: "Mumbai Flat 4B", icon: "home", net: "-â‚¹65.50", color: "text-tertiary" },
                    { name: "Weekend Cabin", icon: "cabin", net: "+â‚¹150.00", color: "text-primary" },
                  ].map((p) => (
                    <div key={p.name} className="p-3.5 bg-white/90 rounded-2xl flex flex-col justify-between shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-title-md text-body-sm text-on-surface font-semibold truncate">{p.name}</span>
                        <span className={`material-symbols-outlined text-body-md ${p.color}`}>{p.icon}</span>
                      </div>
                      <div className="mt-2 flex items-baseline justify-between">
                        <span className="font-body-sm text-label-caps text-on-surface-variant">Net Pool</span>
                        <span className={`font-numeric-balance-md text-body-md font-bold ${p.color}`}>{p.net}</span>
                      </div>
                    </div>
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
                      2
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant my-2">
                    2 gentle reminders scheduled for automated dispatch today via warm iMessage cards.
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex -space-x-1.5">
                      <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-label-caps font-bold text-macaron-yellow-dark shadow-xs border border-yellow-200">
                        SM
                      </div>
                      <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-label-caps font-bold text-macaron-yellow-dark shadow-xs border border-yellow-200">
                        LK
                      </div>
                    </div>
                    <button className="px-3 py-1.5 rounded-full bg-white hover:bg-yellow-50 text-macaron-yellow-dark font-title-md text-body-sm font-bold transition-colors shadow-xs" type="button">
                      Send Now
                    </button>
                  </div>
                </div>

                <div className="bg-macaron-lilac/60 p-6 rounded-3xl border border-purple-100 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-macaron-lilac-dark text-[22px]">route</span>
                      <h3 className="font-title-md text-title-md text-on-surface font-bold">Algorithm Savings</h3>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-white/80 text-macaron-lilac-dark font-label-caps text-label-caps font-bold">
                      Saved â‚¹15
                    </span>
                  </div>
                  <div className="my-2">
                    <div className="font-numeric-balance-lg text-[22px] text-macaron-lilac-dark font-extrabold tracking-tight">
                      â‚¹15.00 fees avoided
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                      4 intermediate wire hops bypassed via bipartite matrix graph reduction.
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-macaron-lilac-dark font-title-md text-[12px] font-semibold">
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    <span>Optimized Settlement Tree</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Peer Settlement Matrix</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Classified by action urgency with one-click resolution triggers.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-surface-container font-label-caps text-label-caps text-on-surface-variant uppercase">
                6 Connected Peers
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-surface-container-lowest p-6 rounded-3xl border border-surface-container shadow-sm flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-surface-container">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-tertiary-container" />
                      <h3 className="font-title-md text-title-md text-on-surface font-bold">Immediate Action</h3>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-macaron-peach text-tertiary font-label-caps text-label-caps font-bold">
                      2 Debts
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    You owe these peers. Instant zero-fee settlement available.
                  </p>
                  {[
                    { initials: "MP", name: "Marco P.", sub: "Ski Lodge Deposit", amount: "â‚¹105.20", color: "text-macaron-peach-dark" },
                    { initials: "ER", name: "Emily R.", sub: "Concert Tickets", amount: "â‚¹60.00", color: "text-on-surface" },
                  ].map((p) => (
                    <div key={p.name} className="p-4 bg-surface-container-low rounded-2xl space-y-3 hover:bg-surface-container transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full ${p.color === "text-macaron-peach-dark" ? "bg-macaron-peach text-macaron-peach-dark" : "bg-surface-container-high text-on-surface"} flex items-center justify-center font-title-md text-title-md font-bold`}>
                            {p.initials}
                          </div>
                          <div>
                            <h4 className="font-title-md text-body-md text-on-surface font-bold">{p.name}</h4>
                            <div className="flex items-center gap-1 text-on-surface-variant text-[12px]">
                              <span className="material-symbols-outlined text-body-sm">cabin</span>
                              <span>{p.sub}</span>
                            </div>
                          </div>
                        </div>
                        <span className="font-numeric-balance-md text-numeric-balance-md text-tertiary font-bold">
                          -{p.amount}
                        </span>
                      </div>
                      <button className="w-full py-2 px-3 rounded-full bg-tertiary text-on-tertiary hover:opacity-95 font-title-md text-body-sm flex items-center justify-center gap-1.5 transition-all shadow-xs" type="button">
                        <span className="material-symbols-outlined text-[16px]">credit_card</span>
                        <span>1-Tap Settle {p.amount}</span>
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-surface-container flex items-center justify-between text-xs text-on-surface-variant">
                  <span>Total Payable</span>
                  <span className="font-numeric-balance-md text-tertiary font-bold">â‚¹165.20</span>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-6 rounded-3xl border border-surface-container shadow-sm flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-surface-container">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-primary-container" />
                      <h3 className="font-title-md text-title-md text-on-surface font-bold">Awaiting Collection</h3>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-macaron-mint/20 text-primary font-label-caps text-label-caps font-bold">
                      2 Pending
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Peers who owe you. Gentle reminder ping cards with direct pay links.
                  </p>
                  {[
                    { initials: "SM", name: "Sarah M.", sub: "Lisbon Roadtrip", amount: "â‚¹124.00", bg: "bg-primary-container/20", text: "text-primary" },
                    { initials: "LK", name: "Leo K.", sub: "Tokyo Flights", amount: "â‚¹218.50", bg: "bg-secondary-fixed", text: "text-secondary" },
                  ].map((p) => (
                    <div key={p.name} className="p-4 bg-surface-container-low rounded-2xl space-y-3 hover:bg-surface-container transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full ${p.bg} ${p.text} flex items-center justify-center font-title-md text-title-md font-bold`}>
                            {p.initials}
                          </div>
                          <div>
                            <h4 className="font-title-md text-body-md text-on-surface font-bold">{p.name}</h4>
                            <div className="flex items-center gap-1 text-on-surface-variant text-[12px]">
                              <span className="material-symbols-outlined text-body-sm">flight_takeoff</span>
                              <span>{p.sub}</span>
                            </div>
                          </div>
                        </div>
                        <span className="font-numeric-balance-md text-numeric-balance-md text-primary font-bold">
                          +{p.amount}
                        </span>
                      </div>
                      <button className="w-full py-2 px-3 rounded-full bg-primary-container text-on-primary hover:bg-primary font-title-md text-body-sm flex items-center justify-center gap-1.5 transition-all shadow-xs" type="button">
                        <span className="material-symbols-outlined text-[16px]">notifications_active</span>
                        <span>Trigger Polite Reminder</span>
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-surface-container flex items-center justify-between text-xs text-on-surface-variant">
                  <span>Total Receivable</span>
                  <span className="font-numeric-balance-md text-primary font-bold">+â‚¹342.50</span>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-6 rounded-3xl border border-surface-container shadow-sm flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-surface-container">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-secondary" />
                      <h3 className="font-title-md text-title-md text-on-surface font-bold">In Good Standing</h3>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface font-label-caps text-label-caps font-bold">
                      3 Peers
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Recently reconciled tabs and zero-drift active members.
                  </p>
                  {[
                    { initials: "TY", name: "Tyler Y.", sub: "Friday Tapas", amount: "â‚¹85.00", color: "bg-surface-variant text-on-surface" },
                    { initials: "SW", name: "Samantha W.", sub: "Groceries", amount: "â‚¹55.00", color: "bg-macaron-yellow text-macaron-yellow-dark" },
                    { initials: "LV", name: "Liam V.", sub: "Equilibrium reached", amount: "â‚¹0.00", color: "bg-macaron-lilac text-macaron-lilac-dark", balanced: true },
                  ].map((p) => (
                    <div key={p.name} className="p-3.5 bg-surface-container-low rounded-2xl flex items-center justify-between hover:bg-surface-container transition-colors min-h-[60px]">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full ${p.color} flex items-center justify-center font-title-md text-title-md font-bold`}>
                          {p.initials}
                        </div>
                        <div>
                          <h4 className="font-title-md text-body-sm text-on-surface font-bold">{p.name}</h4>
                          <span className="text-on-surface-variant text-label-caps">{p.sub}</span>
                        </div>
                      </div>
                      <div className="text-right min-w-[72px] flex flex-col items-end justify-center">
                        <span className={`font-numeric-balance-md text-body-md font-bold ${p.balanced ? "text-on-surface-variant" : "text-primary"}`}>
                          {p.balanced ? "â‚¹0.00" : `+${p.amount}`}
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

          <div className="p-4 bg-surface-container-lowest rounded-3xl border border-surface-container shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-on-surface-variant">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-macaron-mint/20 text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">verified</span>
              </div>
              <div>
                <span className="font-title-md text-body-sm text-on-surface font-bold block">Zero-Drift Cryptographic Balance Guarantee</span>
                <span className="font-body-sm text-[12px] text-on-surface-variant">
                  Tabsy enforces double-entry verification on each ledger delta. Sum total across all circles strictly evaluates to Î£(net) = â‚¹0.00.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="px-3 py-1 rounded-full bg-surface-container font-label-caps text-label-caps text-primary font-bold">
                Audit Hash: #9FA2-OK
              </span>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full bg-surface-container-low mt-16 border-t border-surface-container">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-body-md">receipt_long</span>
            </div>
            <span className="font-title-md text-title-md text-on-surface">Tabsy</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant ml-2">Â© 2025 All tabs settled effortlessly.</span>
          </div>
          <div className="flex items-center gap-6">
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors" href="#">
              Overview
            </a>
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors" href="#">
              Group Balances
            </a>
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors" href="#">
              Settings
            </a>
          </div>
        </div>
      </footer>
    </AppLayout>
  );
}
