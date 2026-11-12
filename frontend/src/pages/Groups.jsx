import { Link } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";

export default function Groups() {
  return (
    <AppLayout>
      <main className="w-full pt-4 bg-background min-h-screen">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-lowest p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-label-caps font-semibold tracking-wide uppercase mb-1 border border-emerald-100">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Split-Rail Financial Command</span>
              </div>
              <h1 className="font-headline-lg text-2xl lg:text-3xl font-bold text-on-surface tracking-tight">
                Group Tabs &amp; Ledgers
              </h1>
              <p className="font-body-md text-sm text-on-surface-variant mt-0.5">
                Collaborative expense pools, room shares, and shared vacations.
              </p>
            </div>
            <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
              <button className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-title-md text-xs sm:text-sm font-semibold border border-slate-200 transition-colors" type="button">
                <span className="material-symbols-outlined text-[18px] text-secondary">qr_code_scanner</span>
                <span>Join via Link / QR</span>
              </button>
              <Link className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-title-md text-xs sm:text-sm font-semibold shadow-sm transition-all active:scale-[0.98]" to="/create-group">
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                <span>Create Group</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="flex items-center justify-between p-4 rounded-xl bg-surface-container-lowest border border-slate-200/70 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-100">
                  <span className="material-symbols-outlined text-[20px]">folder_shared</span>
                </div>
                <div>
                  <div className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Active Ledgers</div>
                  <div className="font-headline-sm text-lg font-bold text-on-surface">4 Active Tabs</div>
                </div>
              </div>
              <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">2 Archived</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-surface-container-lowest border border-slate-200/70 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
                  <span className="material-symbols-outlined text-[20px]">currency_exchange</span>
                </div>
                <div>
                  <div className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Total Circulating</div>
                  <div className="font-headline-sm text-lg font-bold text-on-surface">₹1,845.20</div>
                </div>
              </div>
              <span className="text-label-caps font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">This Month</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
                </div>
                <div>
                  <div className="font-label-caps text-label-caps text-emerald-800 uppercase tracking-wider font-semibold">Net Balance</div>
                  <div className="font-headline-sm text-lg font-bold text-emerald-700">+₹317.30</div>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-label-caps font-bold text-emerald-800 bg-emerald-100/90 border border-emerald-200 px-2.5 py-1 rounded-full">
                <span className="material-symbols-outlined text-body-sm">trending_up</span> You're Ahead
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface-container-lowest p-2.5 rounded-xl border border-slate-200/80">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <button className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-on-surface text-surface transition-colors shadow-xs">
                All Groups (4)
              </button>
              <button className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors">
                Trips &amp; Travel (2)
              </button>
              <button className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors">
                Flats &amp; Home (1)
              </button>
              <button className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors">
                Social &amp; Events (1)
              </button>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-56">
                <span className="material-symbols-outlined absolute left-2.5 top-2 text-[16px] text-slate-400">search</span>
                <input className="w-full pl-8 pr-3 py-1.5 text-xs font-body-md rounded-lg bg-surface-container-low border border-slate-200/80 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-on-surface placeholder:text-slate-400" placeholder="Filter tabs or members..." type="text" />
              </div>
              <div className="relative">
                <select className="appearance-none bg-surface-container-low text-on-surface text-xs font-semibold pl-2.5 pr-6 py-1.5 rounded-lg border border-slate-200/80 focus:outline-none cursor-pointer">
                  <option>Recent Activity</option>
                  <option>Net Position</option>
                  <option>Alphabetical</option>
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-1.5 top-1.5 text-[16px] text-slate-400">
                  arrow_drop_down
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                header: "bg-sky-100/90 border-b border-sky-200/70",
                badge: "Trips & Travel",
                badgeIcon: "downhill_skiing",
                badgeColor: "bg-white text-sky-800 border-sky-200",
                updated: "Updated 2h ago",
                status: "4 unsettled members",
                statusColor: "bg-sky-200/70 text-sky-900",
                title: "Tahoe Ski Weekend ❄️",
                sub: "Northstar Cabin & Lift Tickets Pool",
                avatars: ["MK", "KJ", "SS", "+3"],
                total: "₹2,880.00",
                share: "₹480.00",
                net: "+₹140.00",
                netColor: "text-emerald-600",
                feed: "Alex added Lift Tickets & Gear Rental (₹640)",
                feedIcon: "receipt_long",
                feedColor: "text-sky-700",
                feedBg: "bg-sky-50/70 border-sky-100",
              },
              {
                header: "bg-amber-100/90 border-b border-amber-200/80",
                badge: "Flats & Home",
                badgeIcon: "apartment",
                badgeColor: "bg-white text-amber-800 border-amber-200",
                updated: "Updated yesterday",
                status: "Due in 2 days",
                statusColor: "bg-rose-100 text-rose-800 border-rose-200",
                title: "Apartment 4B Flatmates 🏔️",
                sub: "Rent, WiFi, Cleaning & Utilities",
                avatars: ["AL", "LE", "SM"],
                total: "₹1,420.50",
                share: "₹473.50",
                net: "-₹65.50",
                netColor: "text-rose-600",
                feed: "Leo paid Trader Joe's Supermarket Run",
                feedIcon: "shopping_basket",
                feedColor: "text-amber-700",
                feedBg: "bg-amber-50/70 border-amber-100",
              },
              {
                header: "bg-purple-100/90 border-b border-purple-200/80",
                badge: "Trips & Travel",
                badgeIcon: "flight",
                badgeColor: "bg-white text-purple-800 border-purple-200",
                updated: "Updated 3d ago",
                status: "Locked Deposits",
                statusColor: "bg-purple-200/70 text-purple-900",
                title: "Tokyo Cherry Blossoms 2026 🌸",
                sub: "Airbnbs, Shinkansen Passes & Food Tours",
                avatars: ["YOU", "AX", "SR", "LO"],
                total: "₹3,640.00",
                share: "₹910.00",
                net: "+₹218.50",
                netColor: "text-emerald-600",
                feed: "Flight deposits locked in & split 4-ways",
                feedIcon: "flight_takeoff",
                feedColor: "text-purple-700",
                feedBg: "bg-purple-50/70 border-purple-100",
              },
              {
                header: "bg-emerald-100/90 border-b border-emerald-200/80",
                badge: "Social & Events",
                badgeIcon: "local_bar",
                badgeColor: "bg-white text-emerald-800 border-emerald-200",
                updated: "Settled May 18",
                status: "Fully balanced",
                statusColor: "bg-emerald-200 text-emerald-900",
                title: "Friday Tapas & Wine Club 🍷",
                sub: "Bi-weekly dinners & tastings pool",
                avatars: ["5p"],
                total: "₹340.00",
                share: "₹68.00",
                net: "₹0.00",
                netColor: "text-slate-500",
                feed: "All 5 members settled up via instant pay",
                feedIcon: "task_alt",
                feedColor: "text-emerald-600",
                feedBg: "bg-emerald-50/70 border-emerald-100",
              },
            ].map((g) => (
              <Link key={g.title} to="/group-details" className="block">
                <div className="group bg-surface-container-lowest rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden">
                <div>
                  <div className={`${g.header} px-5 py-3 flex items-center justify-between`}>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white text-xs font-bold border shadow-2xs ${g.badgeColor}`}>
                        <span className="material-symbols-outlined text-body-sm">{g.badgeIcon}</span>
                        {g.badge}
                      </span>
                      <span className="text-label-caps font-medium text-slate-600/80">{g.updated}</span>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-label-caps font-bold border ${g.statusColor}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {g.status}
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div>
                        <h2 className="font-headline-sm text-lg font-bold text-on-surface group-hover:text-emerald-700 transition-colors flex items-center gap-1.5">
                          {g.title}
                        </h2>
                        <p className="text-xs text-on-surface-variant mt-0.5">{g.sub}</p>
                      </div>
                      <div className="flex -space-x-2 shrink-0">
                        {g.avatars.map((a) => (
                          <div key={a} className="w-7 h-7 rounded-full bg-slate-200 text-slate-800 font-bold text-label-caps flex items-center justify-center ring-2 ring-white">
                            {a}
                </div>
            ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200/70 mb-4">
                      <div>
                        <span className="font-label-caps text-label-caps text-slate-500 uppercase tracking-wider block">Total Spend</span>
                        <div className="font-title-md text-sm font-bold text-slate-900 mt-0.5">{g.total}</div>
                      </div>
                      <div className="border-l border-slate-200 pl-2.5">
                        <span className="font-label-caps text-label-caps text-slate-500 uppercase tracking-wider block">Your Share</span>
                        <div className="font-title-md text-sm font-bold text-slate-900 mt-0.5">{g.share}</div>
                      </div>
                      <div className="border-l border-slate-200 pl-2.5">
                        <span className="font-label-caps text-label-caps text-slate-500 uppercase tracking-wider block">Net Position</span>
                        <div className={`font-title-md text-sm font-bold mt-0.5 ${g.netColor}`}>{g.net}</div>
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 text-xs text-slate-600 ${g.feedBg} border px-3 py-2 rounded-lg`}>
                      <span className={`material-symbols-outlined text-[16px] shrink-0 ${g.feedColor}`}>{g.feedIcon}</span>
                      <span className="truncate">{g.feed}</span>
                    </div>
                  </div>
                </div>
                <div className="px-5 pb-5 pt-0 flex items-center justify-between gap-2 border-t border-slate-100 pt-3.5">
                  <button className="px-3.5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-title-md text-xs font-semibold transition-colors" type="button">
                    View Ledger
                  </button>
                  <button className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-title-md text-xs font-semibold transition-colors" type="button">
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    <span>Add Expense</span>
                  </button>
                </div>
              </div>
              </Link>
            ))}

            <div className="bg-surface-container-lowest rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
<h2 className="font-headline-sm text-lg font-bold text-on-surface group-hover:text-emerald-700 transition-colors flex items-center gap-1.5">
                      Friday Tapas & Wine Club 🍷
</h2>
                    <p className="text-xs text-on-surface-variant mt-0.5">Bi-weekly dinners &amp; tastings pool</p>
                  </div>
                  <div className="flex -space-x-2 shrink-0">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold text-label-caps flex items-center justify-center ring-2 ring-white">
                      5p
                    </div>
                    <div className="w-7 h-7 rounded-full bg-slate-200 text-emerald-700 font-bold text-label-caps flex items-center justify-center ring-2 ring-white">
                      <span className="material-symbols-outlined text-body-md">done_all</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200/70 mb-4">
                  <div>
                    <span className="font-label-caps text-label-caps text-slate-500 uppercase tracking-wider block">Total Spend</span>
                    <div className="font-title-md text-sm font-bold text-slate-900 mt-0.5">₹340.00</div>
                  </div>
                  <div className="border-l border-slate-200 pl-2.5">
                    <span className="font-label-caps text-label-caps text-slate-500 uppercase tracking-wider block">Your Share</span>
                    <div className="font-title-md text-sm font-bold text-slate-900 mt-0.5">₹68.00</div>
                  </div>
                  <div className="border-l border-slate-200 pl-2.5">
                    <span className="font-label-caps text-label-caps text-slate-500 uppercase tracking-wider block">Net Position</span>
                    <div className="font-title-md text-sm font-bold text-slate-500 mt-0.5">₹0.00</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50/70 border border-emerald-100 px-3 py-2 rounded-lg">
                  <span className="material-symbols-outlined text-[16px] text-emerald-600 shrink-0">task_alt</span>
                  <span className="truncate font-medium">All 5 members settled up via instant pay</span>
                </div>
              </div>
              <div className="px-5 pb-5 pt-0 flex items-center justify-between gap-2 border-t border-slate-100 pt-3.5">
                <button className="px-3.5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-title-md text-xs font-semibold transition-colors" type="button">
                  View Ledger
                </button>
                <button className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-title-md text-xs font-medium transition-colors" type="button">
                  <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                  <span>Restart Tab</span>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl border border-slate-200/90 shadow-sm p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-100">
                  <span className="material-symbols-outlined text-[18px]">diversity_3</span>
                </div>
                <div>
                  <h3 className="font-title-md text-sm font-bold text-on-surface">Cross-Group Peer Circle</h3>
                  <p className="text-label-caps text-on-surface-variant">12 frequent peers across all ledgers</p>
                </div>
              </div>
              <button className="text-indigo-600 hover:text-indigo-800 text-xs font-semibold transition-colors" type="button">
                See all
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2.5 mb-4">
              {[
                { initials: "AL", name: "Alex L." },
                { initials: "LE", name: "Leo E." },
                { initials: "MK", name: "Maya K." },
                { initials: "SR", name: "Sam R." },
                { initials: "KJ", name: "Ken J." },
                { initials: "SM", name: "Sidd M." },
                { initials: "LO", name: "Liv O." },
              ].map((p) => (
                <div key={p.name} className="group/peer flex flex-col items-center p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 transition-colors cursor-pointer border border-transparent hover:border-emerald-200">
                  <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center">
                    {p.initials}
                  </div>
                  <span className="text-label-caps font-semibold text-slate-700 mt-1 truncate max-w-full">{p.name}</span>
                </div>
              ))}
              <div className="group/peer flex flex-col items-center p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 transition-colors cursor-pointer border border-transparent hover:border-emerald-200">
                <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center">
                  +5
                </div>
                <span className="text-label-caps font-semibold text-slate-500 mt-1">More</span>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <button className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors" type="button">
                <span className="material-symbols-outlined text-body-md">send_money</span>
                <span>Ping Peer</span>
              </button>
              <button className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold transition-colors" type="button">
                <span className="material-symbols-outlined text-body-md">person_add</span>
                <span>Start 1:1 Tab</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full bg-surface-container-low mt-16 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-body-md">receipt_long</span>
            </div>
            <span className="font-title-md text-title-md text-on-surface">Tabsy</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant ml-2">© 2025 All tabs settled effortlessly.</span>
          </div>
          <div className="flex items-center gap-6">
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors" href="#">
              Overview
            </a>
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors" href="#">
              Consolidated Ledger
            </a>
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors" href="#">
              Terms of Service
            </a>
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors" href="#">
              Help &amp; Support
            </a>
          </div>
        </div>
      </footer>
    </AppLayout>
  );
}

