import AppLayout from "../components/layout/AppLayout";

export default function Activity() {
  return (
    <AppLayout>
      <main className="w-full pt-4 pb-16 bg-[#fcfbfe]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-2">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-macaron-butter border border-macaron-butter-border text-[#7c5e10] font-label-caps text-[11px] font-bold">
                  ⚡ LIVE FEED &amp; LEDGER
                </span>
                <span className="text-on-surface-variant text-body-sm">Synced 1 min ago</span>
              </div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-extrabold">
                Activity Overview
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                Real-time pulse of shared balances, receipts, and friend settlements.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-[18px] pointer-events-none">
                  search
                </span>
                <input
                  className="pl-10 pr-4 py-2 rounded-full bg-surface-container-lowest border border-surface-container text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary shadow-sm w-56 md:w-64"
                placeholder="Filter by note or person..."
                type="text"
              />
              </div>
              <div className="relative inline-block text-left">
                <button className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-surface-container-lowest border border-surface-container text-on-surface text-body-sm font-title-md shadow-sm hover:bg-surface-container transition-all" type="button">
                  <span className="material-symbols-outlined text-[18px]">file_download</span>
                  <span>Export</span>
                  <span className="material-symbols-outlined text-[16px]">expand_more</span>
                </button>
              </div>
            </div>
          </div>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-macaron-sky border border-macaron-sky-border rounded-3xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-label-caps uppercase text-[#1d5b94] font-bold tracking-wider">
                  Total Velocity
                </span>
                <div className="w-8 h-8 rounded-2xl bg-white/80 border border-macaron-sky-border flex items-center justify-center text-[#1d5b94]">
                  <span className="material-symbols-outlined text-[18px]">speed</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-baseline gap-2">
                  <span className="font-display-hero text-headline-lg font-black text-[#0f3c66] tracking-tight">18.4</span>
                  <span className="font-title-md text-body-md text-[#1d5b94] font-semibold">tx / wk</span>
                </div>
                <p className="font-body-sm text-body-sm text-[#3b6d98] mt-1">Activity pace up +22% vs. last week</p>
              </div>
              <div className="pt-4 mt-2">
                <div className="h-8 w-full flex items-end gap-1.5">
                  <div className="flex-1 bg-[#b6d8fb] rounded-t-md h-[40%]" />
                  <div className="flex-1 bg-[#b6d8fb] rounded-t-md h-[55%]" />
                  <div className="flex-1 bg-[#b6d8fb] rounded-t-md h-[30%]" />
                  <div className="flex-1 bg-[#b6d8fb] rounded-t-md h-[70%]" />
                  <div className="flex-1 bg-[#86c0fb] rounded-t-md h-[85%]" />
                  <div className="flex-1 bg-[#257cd6] rounded-t-md h-[100%]" />
                  <div className="flex-1 bg-[#1a5da2] rounded-t-md h-[90%]" />
                </div>
              </div>
            </div>

            <div className="bg-macaron-mint border border-macaron-mint-border rounded-3xl p-5 shadow-md flex flex-col justify-between hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-label-caps uppercase text-primary font-bold tracking-wider">
                  Total Settled
                </span>
                <div className="w-8 h-8 rounded-2xl bg-white/80 border border-macaron-mint-border flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="font-display-hero text-headline-lg font-black text-[#004d34] tracking-tight">
                  ₹1,450.00
                </div>
                <p className="font-body-sm text-body-sm text-[#006c49]/80 mt-1">
                  94% of group balances cleared this month
                </p>
              </div>
              <div className="pt-4 mt-2 flex items-center justify-between bg-white/70 border border-macaron-mint-border rounded-2xl px-3.5 py-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                  <span className="font-body-sm text-body-sm text-on-surface font-medium">12 transactions resolved</span>
                </div>
                <span className="font-label-caps text-[11px] font-bold text-primary">0 DISPUTES</span>
              </div>
            </div>

            <div className="bg-macaron-blush border border-macaron-blush-border rounded-3xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-label-caps uppercase text-[#a0153e] font-bold tracking-wider">
                  Requires Sign-off
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/80 border border-macaron-blush-border text-[#a0153e] text-label-caps font-bold">
                  2 PENDING
                </span>
              </div>
              <div className="mt-4">
                <div className="flex items-baseline gap-2">
                  <span className="font-display-hero text-headline-lg font-black text-[#7a0c2c] tracking-tight">2 Items</span>
                  <span className="font-title-md text-body-md text-[#a0153e] font-semibold">awaiting split review</span>
                </div>
                <p className="font-body-sm text-body-sm text-[#9b3a55] mt-1">
                  Sintra Villa Deposit &amp; Wine Tasting bill
                </p>
              </div>
              <div className="pt-4 mt-2 flex items-center justify-between bg-white/70 border border-macaron-blush-border rounded-2xl px-3 py-2">
                <span className="font-body-sm text-body-sm text-[#7a0c2c] font-medium">
                  Potential share: <strong>₹142.50</strong>
                </span>
                <button className="px-3 py-1 rounded-xl bg-[#bc0b3b] text-white text-body-sm font-title-md shadow-sm hover:opacity-90 transition-opacity">
                  Review
                </button>
              </div>
            </div>
          </section>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-container pb-4">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {[
                { key: "all", label: "All Activity", count: 24 },
                { key: "expenses", label: "Expenses", count: 14 },
                { key: "settlements", label: "Settlements", count: 6 },
                { key: "updates", label: "Updates", count: 4 },
              ].map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setFilter(p.key)}
                  className={`filter-pill flex items-center gap-1.5 px-4 py-2 rounded-2xl font-title-md text-body-sm border shadow-sm transition-all ₹{
                    filter === p.key
                      ? "bg-surface-container-highest text-on-surface border-surface-container-high"
                      : "bg-surface-container-lowest text-on-surface-variant hover:text-on-surface border-surface-container"
                  }`}
                >
                  <span>{p.label}</span>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container text-[11px] font-bold">
                    {p.count}
                  </span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="font-body-sm text-body-sm text-on-surface-variant">Sort by:</span>
              <div className="relative">
                <select className="appearance-none bg-surface-container-lowest border border-surface-container text-body-sm font-title-md text-on-surface py-1.5 pl-3.5 pr-8 rounded-xl shadow-sm focus:outline-none focus:border-primary cursor-pointer">
                  <option>Newest First</option>
                  <option>Highest Amount</option>
                  <option>Tab / Group</option>
                </select>
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant absolute right-2.5 top-2 pointer-events-none">
                  unfold_more
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-title-md text-title-md text-on-surface font-extrabold">Today</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-macaron-mint border border-macaron-mint-border text-primary font-label-caps text-[10px] font-bold uppercase">
                      3 Events
                    </span>
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Wednesday, Oct 24</span>
                </div>

                <div className="bg-surface-container-lowest border border-surface-container rounded-3xl p-5 shadow-sm flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-macaron-mint border border-macaron-mint-border flex items-center justify-center flex-shrink-0 text-primary">
                        <span className="material-symbols-outlined text-[24px]">payments</span>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-title-md text-title-md text-on-surface font-bold">Sarah Jenkins</span>
                          <span className="px-2.5 py-0.5 rounded-full bg-macaron-mint border border-macaron-mint-border text-primary font-label-caps text-label-caps uppercase">
                            Settled Debt
                          </span>
                        </div>
                        <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                          Sent payment via <strong className="text-on-surface font-semibold">Apple Pay</strong> to Liam Vance
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container-low text-body-sm text-on-surface font-medium border border-surface-container">
                            <span className="material-symbols-outlined text-[15px] text-primary">navigation</span>
                            Goa Trip 2025
                          </span>
                          <span className="text-on-surface-variant text-body-sm flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">schedule</span> 10:14 AM
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="font-numeric-balance-lg text-numeric-balance-lg text-primary font-extrabold">
                        +₹65.00
                      </span>
                      <span className="block font-label-caps text-label-caps text-on-surface-variant uppercase mt-0.5">
                        Instant Clear
                      </span>
                    </div>
                  </div>
                  <div className="bg-macaron-mint/60 border border-macaron-mint-border/80 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-body-sm">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-primary shadow-xs">
                        <span className="material-symbols-outlined text-[18px]">verified</span>
                      </div>
                      <div>
                        <span className="font-title-md text-body-md text-on-surface block leading-tight font-semibold">
                          Zero balance reached
                        </span>
                        <span className="text-on-surface-variant text-body-sm">
                          Both Sarah &amp; Liam are squared away in this tab.
                        </span>
                      </div>
                    </div>
                    <button className="px-3.5 py-1.5 rounded-full bg-white hover:bg-surface-container-lowest text-body-sm font-title-md text-on-surface border border-macaron-mint-border shadow-sm transition-all hover:scale-105 active:scale-95">
                      Say Thanks 👏
                    </button>
                  </div>
                </div>

                <div className="bg-surface-container-lowest border border-surface-container rounded-3xl p-5 shadow-sm flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-macaron-sky border border-macaron-sky-border flex items-center justify-center flex-shrink-0 text-secondary">
                        <span className="material-symbols-outlined text-[24px]">restaurant</span>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-title-md text-title-md text-on-surface font-bold">Alex Rivera</span>
                          <span className="px-2.5 py-0.5 rounded-full bg-macaron-sky border border-macaron-sky-border text-[#1d5b94] font-label-caps text-label-caps uppercase">
                            Split 4 ways • ₹60.00 each
                          </span>
                        </div>
                        <h3 className="font-headline-sm text-title-md text-on-surface mt-1 font-bold">
                          Seafood Dinner &amp; Sangria
                        </h3>
                        <p className="font-body-md text-body-md text-on-surface-variant">
                          Paid by Alex • equally split among Alex, Liam, Marco, Chloe
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container-low text-body-sm text-on-surface font-medium border border-surface-container">
                            <span className="material-symbols-outlined text-[15px] text-secondary">explore</span>
                            Goa Trip 2025
                          </span>
                          <span className="text-on-surface-variant text-body-sm flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">schedule</span> 9:30 AM
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="font-numeric-balance-lg text-numeric-balance-lg text-on-surface font-black">
                        ₹240.00
                      </span>
                      <span className="block font-label-caps text-label-caps text-tertiary uppercase mt-0.5">
                        Your Share: ₹60.00
                      </span>
                    </div>
                  </div>
                  <div className="bg-surface-container-low border border-surface-container rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden shadow-xs flex-shrink-0 border border-outline-variant/30">
                        <img
                          className="w-full h-full object-cover"
                          alt="Itemized restaurant receipt"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBq8olu9gPcuquYx8BQh0WEXUrmrnVZDtVB-oBAYig6oDlRNMig10GF6ipgVYgP2hK2c5eDR8rPqZH_SfHaA8NJjKXzOMJ5fH7FJyKgeZVb3nYBUUH6cFnIiJBDY2a1MrUfo8yjEXwYasbugGrxdnZiXuxlyp6sjNYlpeZEY2wFr07FyEyY5WcGbV0PbFvgbOjCbAxBN6LZvTg1R2l6DutxKUkSKF05G_QZnnZQgYM"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-title-md text-body-md text-on-surface font-semibold">
                            Restaurante Ramiro
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-macaron-mint border border-macaron-mint-border text-primary text-[10px] font-bold">
                            OCR VERIFIED
                          </span>
                        </div>
                        <span className="text-on-surface-variant text-body-sm block mt-0.5">
                          4x Garlic Tiger Prawns, 2x Pitcher Sangria Blanca, Couvert
                        </span>
                      </div>
                    </div>
                    <button className="px-3.5 py-1.5 rounded-full bg-surface-container-lowest hover:bg-surface-container border border-surface-container text-body-sm font-title-md text-on-surface shadow-xs transition-colors flex items-center justify-center gap-1.5 self-start sm:self-auto">
                      <span className="material-symbols-outlined text-[16px]">receipt_long</span> View Split
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-title-md text-title-md text-on-surface font-extrabold">Yesterday</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-macaron-lilac border border-macaron-lilac-border text-secondary font-label-caps text-[10px] font-bold uppercase">
                      2 Events
                    </span>
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Tuesday, Oct 23</span>
                </div>

                <div className="bg-surface-container-lowest border border-surface-container rounded-3xl p-5 shadow-sm flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-macaron-lilac border border-macaron-lilac-border flex items-center justify-center flex-shrink-0 text-secondary">
                        <span className="material-symbols-outlined text-[24px]">folder_special</span>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-title-md text-title-md text-on-surface font-bold">Marco Rossi</span>
                          <span className="px-2.5 py-0.5 rounded-full bg-macaron-lilac border border-macaron-lilac-border text-secondary font-label-caps text-label-caps uppercase">
                            New Tab Started
                          </span>
                        </div>
                        <h3 className="font-headline-sm text-title-md text-on-surface mt-1 font-bold flex items-center gap-1.5">
                          Tahoe Ski Weekend ❄️
                        </h3>
                        <p className="font-body-md text-body-md text-on-surface-variant">
                          Marco initialized a shared pool and invited 5 team members to log cabin deposits.
                        </p>
                        <div className="flex items-center gap-2.5 mt-2.5">
                          <div className="flex items-center -space-x-2">
                            <div className="w-7 h-7 rounded-full overflow-hidden border-2 border-white shadow-xs">
                              <img className="w-full h-full object-cover" alt="Marco" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBs804BAFRxrXiJNZjD6hFtHfJV25821m4o98xqjb2xiSAfNAiMltSTepUJyEJ12cg5dwWdNQxLTzeD_jRCjvwIA2VRGdFslo58P8-VxDcFIX1bt2vvc-7lLMwJqY18WC_qLzo8DuyOxF7ORRWQ-OFyVcvrAxZSceERwBpw9r-y2DxNOCIX18LIBvOgD8dgZ7Bd2K95XJ6ID8-gNr5CS8gdpJrRnzxCF8oyxKQhSSk" />
                            </div>
                            <div className="w-7 h-7 rounded-full overflow-hidden border-2 border-white shadow-xs">
                              <img className="w-full h-full object-cover" alt="Traveler" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9W5M3ZnNCE8UeFWAN_oBXEDVEMPIOoUq_PRNSSROzN0sCmSuVE5m625W179exGCOwDG3i3d18z7TcneTIXpk1P4HNa2np7OLZN9WPKGZ-RFFHmfDAqJwawpaCH-oiFczp1zeaA6Mr-JmbtnQ4V0kJwhVwI6L2gh-sdth1vrk_26GBvvLPHLxihnK7wJndF_Sqjmd-0khkAXkWXD135mNtcervKiCYq5_j_A6W-Jw" />
                            </div>
                            <div className="w-7 h-7 rounded-full overflow-hidden border-2 border-white shadow-xs">
                              <img className="w-full h-full object-cover" alt="Designer" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqmh34AJ8-xMenUPuvxNcyGrcpYWx3nUmszx84LyBRQmm_nqYokSBttMDkcJ64aZdOGu8kqQL2p5jk4qSjbJUyKr6coBU1S84lhZtOZ9SEeosNF2VBC0sRZxV20YVTso9T1MWJe7V-BAHUp4n3OhaDaSDcGsdr2j2uK5gqhkFoSkoTPyBXwM4Pg2PrkmTEo2rPTLlzDsLFmgeUvJNLCsMUaFCqOp2xESTyP1kcR3k" />
                            </div>
                            <div className="w-7 h-7 rounded-full bg-macaron-lilac border-2 border-white text-secondary flex items-center justify-center font-bold text-[11px]">
                              +2
                            </div>
                          </div>
                          <span className="text-body-sm text-on-surface-variant font-medium">5 members active</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container-low border border-surface-container font-label-caps text-label-caps text-on-surface font-semibold uppercase">
                        Active Tab
                      </span>
                      <span className="block font-body-sm text-body-sm text-on-surface-variant mt-1">4:18 PM</span>
                    </div>
                  </div>
                  <div className="bg-macaron-lilac/50 border border-macaron-lilac-border rounded-2xl p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-on-surface text-body-sm font-medium">
                      <span className="material-symbols-outlined text-secondary text-[20px]">group_add</span>
                      <span>You were added as a co-manager</span>
                    </div>
                    <button className="px-3.5 py-1.5 rounded-full bg-secondary text-on-secondary font-title-md text-body-sm shadow-sm hover:opacity-90 transition-opacity">
                      Open Tahoe Tab
                    </button>
                  </div>
                </div>

                <div className="bg-surface-container-lowest border border-surface-container rounded-3xl p-5 shadow-sm flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-macaron-blush border border-macaron-blush-border flex items-center justify-center flex-shrink-0 text-tertiary">
                        <span className="material-symbols-outlined text-[24px]">minor_crash</span>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-title-md text-title-md text-on-surface font-bold">Chloe Dubois</span>
                          <span className="px-2.5 py-0.5 rounded-full bg-macaron-blush border border-macaron-blush-border text-tertiary font-label-caps text-label-caps uppercase">
                            OCR Verified
                          </span>
                        </div>
                        <h3 className="font-headline-sm text-title-md text-on-surface mt-1 font-bold">
                          Car Rental &amp; Fuel Refill
                        </h3>
                        <p className="font-body-md text-body-md text-on-surface-variant">
                          Europcar Aeroporto Lisboa invoice • 100% item items matched.
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container-low text-body-sm text-on-surface font-medium border border-surface-container">
                            <span className="material-symbols-outlined text-[15px] text-tertiary">local_gas_station</span>
                            Goa Trip 2025
                          </span>
                          <span className="text-on-surface-variant text-body-sm flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">schedule</span> 1:12 PM
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="font-numeric-balance-lg text-numeric-balance-lg text-on-surface font-black">
                        ₹380.00
                      </span>
                      <span className="block font-label-caps text-label-caps text-tertiary uppercase mt-0.5">
                        Your Share: ₹95.00
                      </span>
                    </div>
                  </div>
                  <div className="bg-surface-container-low border border-surface-container rounded-2xl p-3.5 flex flex-col gap-2.5">
                    <div className="flex items-center justify-between text-body-sm">
                      <div className="flex items-center gap-1.5 font-semibold text-on-surface">
                        <span className="material-symbols-outlined text-primary text-[18px]">document_scanner</span>
                        <span>AI Itemized Breakdown</span>
                      </div>
                      <span className="font-label-caps text-label-caps text-on-surface-variant">Tax included (€34.50)</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="bg-surface-container-lowest border border-surface-container rounded-xl p-2.5 flex items-center justify-between">
                        <span className="font-body-sm text-body-sm text-on-surface-variant">Renault Clio Hybrid (3 days)</span>
                        <span className="font-title-md text-body-sm text-on-surface font-bold">₹310.00</span>
                      </div>
                      <div className="bg-surface-container-lowest border border-surface-container rounded-xl p-2.5 flex items-center justify-between">
                        <span className="font-body-sm text-body-sm text-on-surface-variant">Full Tank Galp Gasolina 95</span>
                        <span className="font-title-md text-body-sm text-on-surface font-bold">₹70.00</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-title-md text-title-md text-on-surface font-extrabold">Last Weekend</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-macaron-butter border border-macaron-butter-border text-[#7c5e10] font-label-caps text-[10px] font-bold uppercase">
                      1 Event
                    </span>
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Sunday, Oct 20</span>
                </div>

                <div className="bg-surface-container-lowest border border-surface-container rounded-3xl p-5 shadow-sm flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-macaron-butter border border-macaron-butter-border flex items-center justify-center flex-shrink-0 text-[#927014]">
                        <span className="material-symbols-outlined text-[24px]">chat_bubble</span>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-title-md text-title-md text-on-surface font-bold">Liam Vance</span>
                          <span className="px-2.5 py-0.5 rounded-full bg-macaron-butter border border-macaron-butter-border text-[#7c5e10] font-label-caps text-label-caps uppercase">
                            Memo Note
                          </span>
                        </div>
                        <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                          Attached memo note to <strong className="text-on-surface font-semibold">Airbnb Sintra Villa</strong>
                        </p>
                        <blockquote className="mt-2.5 pl-3 py-1.5 rounded-r-2xl bg-macaron-butter/60 border-l-2 border-[#d4af37] font-body-md text-body-md text-on-surface italic">
                          “Marco covered the initial booking deposit back in August, so this balances out his wine tasting bill.”:
                        </blockquote>
                        <div className="flex items-center gap-3 mt-3">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container-low text-body-sm text-on-surface font-medium border border-surface-container">
                            <span className="material-symbols-outlined text-[15px] text-[#927014]">cottage</span>
                            Goa Trip 2025
                          </span>
                          <span className="text-on-surface-variant text-body-sm flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">schedule</span> Oct 20, 6:45 PM
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant shadow-xs">
                        <span className="material-symbols-outlined text-[18px]">push_pin</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-6 sticky top-24">
              <div className="flex items-center justify-between px-1">
                <span className="font-title-md text-title-md text-on-surface font-extrabold">Activity Rhythm</span>
                <span className="font-label-caps text-label-caps text-primary uppercase font-bold">This Week</span>
              </div>

              <div className="bg-surface-container-lowest border border-surface-container rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                    Fastest Settlements
                  </span>
                  <div className="w-8 h-8 rounded-2xl bg-macaron-butter border border-macaron-butter-border flex items-center justify-center text-[#927014]">
                    <span className="material-symbols-outlined text-[18px]">bolt</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display-hero text-headline-lg font-black text-on-surface tracking-tight">4.2</span>
                    <span className="font-headline-sm text-title-md text-secondary font-bold">mins turnaround</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    Average duration from receipt post to instant settlement notification.
                  </p>
                </div>
                <div className="bg-macaron-mint border border-macaron-mint-border rounded-2xl p-2.5 flex items-center gap-2 text-body-sm">
                  <span className="material-symbols-outlined text-primary text-[18px]">trending_up</span>
                  <span className="font-body-sm text-body-sm text-on-surface">
                    <strong className="font-bold text-primary">68% quicker</strong> than standard group tabs
                  </span>
                </div>
              </div>

              <div className="bg-surface-container-lowest border border-surface-container rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                    Expense Categories
                  </span>
                  <span className="font-body-sm text-body-sm font-bold text-on-surface">₹1,480 total</span>
                </div>
                <div className="w-full h-3 rounded-full overflow-hidden flex bg-surface-container gap-0.5">
                  <div className="h-full bg-secondary-container rounded-l-full w-[42%]" />
                  <div className="h-full bg-tertiary-container w-[28%]" />
                  <div className="h-full bg-primary-container w-[18%]" />
                  <div className="h-full bg-[#fbd38d] rounded-r-full w-[12%]" />
                </div>
                <div className="grid grid-cols-2 gap-2.5 pt-1 text-body-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary-container" />
                    <span className="text-on-surface font-medium">Dining</span>
                    <span className="text-on-surface-variant ml-auto font-label-caps">42%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-tertiary-container" />
                    <span className="text-on-surface font-medium">Transport</span>
                    <span className="text-on-surface-variant ml-auto font-label-caps">28%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary-container" />
                    <span className="text-on-surface font-medium">Groceries</span>
                    <span className="text-on-surface-variant ml-auto font-label-caps">18%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#fbd38d]" />
                    <span className="text-on-surface font-medium">Stays</span>
                    <span className="text-on-surface-variant ml-auto font-label-caps">12%</span>
                  </div>
                </div>
              </div>

              <div className="bg-surface-container-lowest border border-surface-container rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider block">
                      Quick Contact Nudges
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface font-semibold">
                      2 friends have unsettled shares
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-2xl bg-macaron-blush border border-macaron-blush-border flex items-center justify-center text-tertiary">
                    <span className="material-symbols-outlined text-[18px]">notifications_active</span>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between p-2.5 rounded-2xl bg-surface-container-low border border-surface-container">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden border border-outline-variant/40">
                        <img className="w-full h-full object-cover" alt="Liam" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqmh34AJ8-xMenUPuvxNcyGrcpYWx3nUmszx84LyBRQmm_nqYokSBttMDkcJ64aZdOGu8kqQL2p5jk4qSjbJUyKr6coBU1S84lhZtOZ9SEeosNF2VBC0sRZxV20YVTso9T1MWJe7V-BAHUp4n3OhaDaSDcGsdr2j2uK5gqhkFoSkoTPyBXwM4Pg2PrkmTEo2rPTLlzDsLFmgeUvJNLCsMUaFCqOp2xESTyP1kcR3k" />
                      </div>
                      <div>
                        <span className="font-title-md text-body-md text-on-surface font-bold block leading-tight">Liam Vance</span>
                        <span className="text-body-sm text-tertiary font-semibold">owes you ₹22.50</span>
                      </div>
                    </div>
                    <button className="px-3 py-1.5 rounded-xl bg-macaron-blush border border-macaron-blush-border hover:bg-macaron-blush/80 text-tertiary font-title-md text-body-sm transition-all flex items-center gap-1 shadow-xs">
                      <span className="material-symbols-outlined text-[14px]">touch_app</span> Nudge
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-2xl bg-surface-container-low border border-surface-container">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden border border-outline-variant/40">
                        <img className="w-full h-full object-cover" alt="Marco" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBs804BAFRxrXiJNZjD6hFtHfJV25821m4o98xqjb2xiSAfNAiMltSTepUJyEJ12cg5dwWdNQxLTzeD_jRCjvwIA2VRGdFslo58P8-VxDcFIX1bt2vvc-7lLMwJqY18WC_qLzo8DuyOxF7ORRWQ-OFyVcvrAxZSceERwBpw9r-y2DxNOCIX18LIBvOgD8dgZ7Bd2K95XJ6ID8-gNr5CS8gdpJrRnzxCF8oyxKQhSSk" />
                      </div>
                      <div>
                        <span className="font-title-md text-body-md text-on-surface font-bold block leading-tight">Marco Rossi</span>
                        <span className="text-body-sm text-secondary font-semibold">pending ₹35.00</span>
                      </div>
                    </div>
                    <button className="px-3 py-1.5 rounded-xl bg-macaron-sky border border-macaron-sky-border hover:bg-macaron-sky/80 text-secondary font-title-md text-body-sm transition-all flex items-center gap-1 shadow-xs">
                      <span className="material-symbols-outlined text-[14px]">send</span> Ping
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-macaron-mint/40 border border-macaron-mint-border rounded-3xl p-5 flex flex-col gap-2.5">
                <div className="flex items-center gap-2 text-on-surface font-title-md text-body-md">
                  <span className="material-symbols-outlined text-primary text-[20px]">mark_email_read</span>
                  <span className="font-bold">Automated Sunday Digest</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Next summary email will be dispatched to 5 Goa Squad members this Sunday at 8 PM.
                </p>
                <a className="font-title-md text-body-sm text-primary hover:underline flex items-center gap-1 mt-1 font-semibold" href="#">
                  Preferences &amp; schedule
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full bg-[#f6f5fb] border-t border-surface-container mt-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[14px]">receipt_long</span>
            </div>
            <span className="font-title-md text-body-md text-on-surface font-bold">Tabsy</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant ml-2">
              Â© 2025 All tabs settled effortlessly.
            </span>
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
