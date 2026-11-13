import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";

const inr0 = (n) => `₹${Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

const GROUPS = [
  { icon: "cottage", iconCls: "bg-primary/10 text-primary", name: "Brooklyn Loft #4B", role: "Roommate", members: "4 members", since: "Since Sep 2023" },
  { icon: "downhill_skiing", iconCls: "bg-secondary-fixed text-secondary", name: "Tahoe Ski Trip", role: "Member", members: "6 members", since: "Since Jan 2024" },
  { icon: "shopping_cart", iconCls: "bg-surface-container-high text-on-surface-variant", name: "Weekly Groceries", role: "Member", members: "2 members", since: "Since Mar 2024" },
];

const MUTUAL = [
  { initials: "MR", name: "Marco R.", sub: "Brooklyn Loft", cls: "bg-secondary-fixed text-secondary" },
  { initials: "AM", name: "Alex M.", sub: "Ski Crew", cls: "bg-primary-fixed text-on-primary-fixed" },
  { initials: "JW", name: "Jason W.", sub: "Brooklyn Loft", cls: "bg-tertiary-fixed text-tertiary" },
  { initials: "CB", name: "Chloe B.", sub: "Tahoe Trip", cls: "bg-surface-container-high text-on-surface" },
];

const ACTIVITY = [
  { icon: "check_circle", iconCls: "bg-primary-fixed text-primary", title: "Settled Brooklyn Loft pantry split", sub: "Trader Joe's • You paid Sarah", time: "2d ago", amount: `+${inr0(4648)}`, amountCls: "text-primary" },
  { icon: "point_of_sale", iconCls: "bg-secondary-fixed text-secondary", title: "Logged Blue Bottle cold brew", sub: "Sarah covered you", time: "5d ago", amount: `-${inr0(1992)}`, amountCls: "text-secondary" },
  { icon: "group_add", iconCls: "bg-tertiary-fixed text-tertiary", title: "Added to Tahoe Ski Trip", sub: "By Marco R.", time: "1w ago", amount: "—", amountCls: "text-outline" },
  { icon: "sync", iconCls: "bg-surface-container-high text-on-surface-variant", title: "Netting cycle auto-cleared", sub: "3-way loop compressed", time: "2w ago", amount: inr0(0), amountCls: "text-outline" },
];

const ABOUT_STATS = [
  { label: "Member Since", value: "Oct 2023" },
  { label: "Preferred Rail", value: "GPay" },
  { label: "Response Time", value: "~1.4 days" },
  { label: "Languages", value: "EN · HI" },
];

export default function FriendProfile() {
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  function showToast(message, icon = "check_circle") {
    setToast({ message, icon });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }

  return (
    <AppLayout>
      <div className="bg-[#f7f6fd] font-body-md text-body-md text-on-surface antialiased min-h-screen">
        <main className="w-full pb-12">
          {/* Hero */}
          <div className="w-full">
            <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 pt-4">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-[13px] text-on-surface-variant flex-wrap pb-3">
                <Link to="/dashboard" className="hover:text-primary transition-colors flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">home</span> Home
                </Link>
                <span>/</span>
                <Link to="/friends" className="hover:text-primary transition-colors">Friends</Link>
                <span>/</span>
                <span className="text-on-surface font-semibold">Sarah Lin</span>
                <span>/</span>
                <span className="bg-surface-container-high text-on-surface-variant px-2.5 py-0.5 rounded-full font-label-caps text-label-caps tracking-widest uppercase shadow-sm">Profile</span>
              </div>

              {/* Profile card */}
              <div className="bg-surface-container-lowest rounded-3xl p-5 sm:p-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="relative shrink-0">
                      <div className="w-24 h-24 rounded-3xl bg-secondary-fixed flex items-center justify-center font-bold text-3xl text-on-secondary-fixed-variant shadow-sm ring-4 ring-surface-container-low">SL</div>
                      <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center shadow ring-2 ring-surface-container-lowest">
                        <span className="material-symbols-outlined text-[15px]">verified</span>
                      </div>
                    </div>

                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h1 className="font-headline-lg text-2xl sm:text-3xl text-on-surface font-bold tracking-tight">Sarah Lin</h1>
                        <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-caps text-[11px] font-bold">@sarah_lin</span>
                      </div>
                      <p className="text-sm text-on-surface-variant mt-1 max-w-xl leading-relaxed">
                        Roommate at Brooklyn Loft, weekend ski-trip planner, and the friend who always remembers to split the tip. Low-drama, high-reliability.
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5 mt-3">
                        <span className="px-2.5 py-1 rounded-full bg-surface-container-low text-on-surface-variant font-label-caps text-[11px] font-semibold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px] text-secondary">apartment</span> Roommate • Loft #4B
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-surface-container-low text-outline font-label-caps text-[11px] font-semibold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">calendar_today</span> Friends since Oct 2023
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-surface-container-low text-outline font-label-caps text-[11px] font-semibold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">location_on</span> Mumbai, IN
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
                    <button className="flex-1 md:flex-none h-10 px-4 rounded-xl bg-surface-container-low hover:bg-surface-container-high text-on-surface font-semibold text-sm transition-all flex items-center justify-center gap-1.5 whitespace-nowrap" type="button" onClick={() => showToast("Opened chat with Sarah", "chat")}>
                      <span className="material-symbols-outlined text-[18px]">chat</span> Message
                    </button>
                    <button className="flex-1 md:flex-none h-10 px-4 rounded-xl bg-primary text-on-primary font-semibold text-sm shadow-sm hover:bg-primary-container transition-all active:scale-95 flex items-center justify-center gap-1.5 whitespace-nowrap" type="button" onClick={() => navigate("/friend-balances")}>
                      <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span> Settle Up
                    </button>
                    <button aria-label="More actions" className="h-10 w-10 shrink-0 rounded-xl bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface flex items-center justify-center transition-colors" type="button" onClick={() => navigate("/friend-manage")}>
                      <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                    </button>
                  </div>
                </div>

                {/* Sub-nav tabs */}
                <div className="flex items-center gap-1 p-1 mt-5 bg-surface-container-low rounded-2xl overflow-x-auto">
                  <span className="flex-1 min-w-[120px] justify-center bg-surface-container-lowest text-on-surface font-title-md text-title-md px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm">
                    <span className="material-symbols-outlined text-[18px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>person</span> Profile
                  </span>
                  <Link to="/friend-balances" className="flex-1 min-w-[120px] justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest/60 font-title-md text-title-md px-4 py-2 rounded-xl flex items-center gap-2 transition-colors">
                    <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span> Balances
                  </Link>
                  <Link to="/friend-transactions" className="flex-1 min-w-[120px] justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest/60 font-title-md text-title-md px-4 py-2 rounded-xl flex items-center gap-2 transition-colors">
                    <span className="material-symbols-outlined text-[18px]">receipt</span> Transactions
                  </Link>
                  <Link to="/friend-activity" className="flex-1 min-w-[120px] justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest/60 font-title-md text-title-md px-4 py-2 rounded-xl flex items-center gap-2 transition-colors">
                    <span className="material-symbols-outlined text-[18px]">history</span> Activity Log
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* 2-COLUMN CONTENT (7/5 balanced) */}
          <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

              {/* LEFT */}
              <div className="lg:col-span-7 flex flex-col gap-5">
                {/* About */}
                <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="material-symbols-outlined text-primary text-[22px]">info</span>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface">About Sarah</h3>
                  </div>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    Sarah joined Tabsy when the Brooklyn Loft lease started and has been the quiet anchor of the shared ledger ever since. Prefers GPay for instant settlements, keeps receipts for every grocery run, and is usually the first to close a tab. Fluent in splitting six ways without a spreadsheet.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                    {ABOUT_STATS.map((s) => (
                      <div key={s.label} className="bg-surface-container-low rounded-2xl p-3.5">
                        <span className="font-label-caps text-[11px] uppercase text-outline">{s.label}</span>
                        <p className="font-title-md text-title-md text-on-surface font-semibold mt-0.5">{s.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shared groups */}
                <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[22px]">groups</span>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface">Shared Groups</h3>
                    </div>
                    <span className="font-label-caps text-label-caps text-outline uppercase">3 Circles</span>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {GROUPS.map((g) => (
                      <button key={g.name} type="button" onClick={() => showToast(`Opened ${g.name}`, "chevron_right")} className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-colors gap-3 text-left w-full">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${g.iconCls}`}>
                            <span className="material-symbols-outlined text-[20px]">{g.icon}</span>
                          </div>
                          <div className="min-w-0">
                            <p className="font-body-md text-body-md font-semibold text-on-surface truncate">{g.name}</p>
                            <p className="text-xs text-on-surface-variant truncate">{g.role} • {g.members} • {g.since}</p>
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-outline shrink-0">chevron_right</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recent activity timeline */}
                <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[22px]">history</span>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface">Recent Activity</h3>
                    </div>
                    <Link to="/friend-activity" className="text-xs font-semibold text-primary hover:underline">View all</Link>
                  </div>
                  <div className="relative flex flex-col gap-4">
                    <div className="absolute left-[17px] top-2 bottom-2 w-0.5 bg-surface-container" />
                    {ACTIVITY.map((a, i) => (
                      <div key={i} className="flex items-start gap-3 relative">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 z-10 ring-4 ring-surface-container-lowest ${a.iconCls}`}>
                          <span className="material-symbols-outlined text-[18px]">{a.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0 pt-0.5">
                          <p className="font-body-md text-body-md font-semibold text-on-surface truncate">{a.title}</p>
                          <p className="text-xs text-on-surface-variant truncate">{a.sub} • {a.time}</p>
                        </div>
                        <span className={`font-numeric-balance-md text-numeric-balance-md font-bold shrink-0 whitespace-nowrap pt-0.5 ${a.amountCls}`}>{a.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div className="lg:col-span-5 flex flex-col gap-5">
                {/* Trust gauge */}
                <div className="bg-surface-container-lowest rounded-3xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3 gap-2">
                    <span className="font-title-md text-title-md text-on-surface">Trust &amp; Reliability</span>
                    <span className="font-label-caps text-label-caps bg-primary-fixed text-on-primary-fixed px-2 py-0.5 rounded-full font-bold uppercase shrink-0">Tier 1</span>
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
                      <span className="font-body-md text-body-md font-semibold text-on-surface">Spotless Record</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">42 tabs settled • 0 disputes</span>
                      <span className="font-label-caps text-label-caps text-primary mt-1 uppercase font-bold">Avg settle: 1.4 days</span>
                    </div>
                  </div>
                </div>

                {/* Quick stats */}
                <div className="bg-surface-container-lowest rounded-3xl p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="material-symbols-outlined text-primary text-[20px]">insights</span>
                    <span className="font-title-md text-title-md text-on-surface">Quick Stats</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Tabs Settled", value: "42", cls: "text-on-surface" },
                      { label: "On-Time", value: "98%", cls: "text-primary" },
                      { label: "Disputes", value: "0", cls: "text-on-surface" },
                      { label: "Total Split", value: inr0(152720), cls: "text-secondary" },
                    ].map((s) => (
                      <div key={s.label} className="bg-surface-container-low rounded-2xl p-3.5">
                        <span className="font-label-caps text-[11px] uppercase text-outline">{s.label}</span>
                        <p className={`font-numeric-balance-md text-[22px] font-bold tracking-tight ${s.cls}`}>{s.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Current balance */}
                <Link to="/friend-balances" className="bg-tertiary-fixed rounded-3xl p-5 shadow-sm relative overflow-hidden block hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2 gap-2">
                    <span className="font-label-caps text-label-caps text-on-tertiary-fixed-variant uppercase tracking-wider">Current Balance</span>
                    <span className="material-symbols-outlined text-tertiary text-[18px]">open_in_new</span>
                  </div>
                  <div className="font-numeric-balance-lg text-numeric-balance-lg text-tertiary tracking-tight leading-none">-{inr0(4648)}</div>
                  <p className="font-body-sm text-body-sm text-on-tertiary-fixed mt-1">You owe Sarah • due in 3 days</p>
                </Link>

                {/* Mutual friends */}
                <div className="bg-surface-container-lowest rounded-3xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-title-md text-title-md text-on-surface">Mutual Friends</span>
                    <span className="font-label-caps text-label-caps text-outline uppercase">4 Shared</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {MUTUAL.map((m) => (
                      <div key={m.initials} className="p-3 rounded-2xl bg-surface-container-low flex items-center gap-2.5">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${m.cls}`}>{m.initials}</div>
                        <div className="min-w-0">
                          <p className="font-body-sm text-body-sm font-semibold text-on-surface truncate">{m.name}</p>
                          <p className="font-label-caps text-[10px] text-outline truncate">{m.sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick actions */}
                <div className="bg-surface-container-lowest rounded-3xl p-5 shadow-sm flex flex-col gap-2">
                  <span className="font-title-md text-title-md text-on-surface mb-1">Quick Actions</span>
                  <button className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-colors text-on-surface font-body-sm text-body-sm font-semibold" type="button" onClick={() => navigate("/friend-balances")}>
                    <span className="material-symbols-outlined text-[18px] text-primary">account_balance_wallet</span> View Balances
                  </button>
                  <button className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-colors text-on-surface font-body-sm text-body-sm font-semibold" type="button" onClick={() => showToast("Opened group invite", "group_add")}>
                    <span className="material-symbols-outlined text-[18px] text-secondary">group_add</span> Add to a Group
                  </button>
                  <button className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-colors text-on-surface font-body-sm text-body-sm font-semibold" type="button" onClick={() => navigate("/friend-manage")}>
                    <span className="material-symbols-outlined text-[18px] text-tertiary">manage_accounts</span> Manage Connection
                  </button>
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