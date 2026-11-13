import AppLayout from "../components/layout/AppLayout";

export default function Notifications() {
  return (
    <AppLayout>
      <main className="w-full pt-4 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-label-caps font-bold tracking-wider uppercase bg-lilac-100 text-lilac-700">
                  Inbox &amp; Activity
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span className="text-xs font-medium text-slate-500">5 unread updates across 3 circles</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Tactile Priority Inbox
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Review instant settlement pings, new trip splits, and pending confirmations.
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition shadow-sm" type="button">
                <span className="material-symbols-outlined text-[17px] text-emerald-600">done_all</span>
                <span>Mark all read</span>
              </button>
              <button className="w-10 h-10 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 flex items-center justify-center transition shadow-sm" type="button">
                <span className="material-symbols-outlined text-[19px]">tune</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-peach-100 border border-peach-200 rounded-3xl p-5 flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-2xl bg-white/90 text-peach-600 flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-[22px]">notification_important</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-label-caps font-bold bg-white text-peach-700 shadow-2xs uppercase tracking-wider font-mono">
                  Urgent
                </span>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-black text-slate-900">2 Actions</div>
                <div className="text-xs text-slate-600 font-medium">Pending approvals &amp; settles</div>
              </div>
              <button className="mt-3.5 w-full py-2 px-3 rounded-2xl bg-peach-600 hover:bg-peach-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-xs" type="button">
                <span>Clear Urgent</span>
                <span className="material-symbols-outlined text-body-md">arrow_forward</span>
              </button>
            </div>

            <div className="bg-sky-100 border border-sky-200 rounded-3xl p-5 flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-2xl bg-white/90 text-sky-600 flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-[22px]">group_add</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-label-caps font-bold bg-white text-sky-700 shadow-2xs font-mono">
                  1 New
                </span>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-black text-slate-900">1 Trip Invite</div>
                <div className="text-xs text-slate-600 font-medium">Tahoe Ski Weekend â„ï¸</div>
              </div>
              <div className="mt-3.5 flex items-center gap-1.5 py-1.5 px-3 rounded-2xl bg-white/70 text-sky-800 text-xs font-semibold">
                <span className="material-symbols-outlined text-body-md">timer</span>
                <span>Awaiting RSVP</span>
              </div>
            </div>

            <div className="bg-matcha-100 border border-matcha-200 rounded-3xl p-5 flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-2xl bg-white/90 text-matcha-700 flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-[22px]">sync_alt</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-label-caps font-bold bg-white text-matcha-800 shadow-2xs font-mono">
                  Synced
                </span>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-black text-slate-900">2 Syncs</div>
                <div className="text-xs text-slate-600 font-medium">Supermarket &amp; Omakase</div>
              </div>
              <div className="mt-3.5 flex items-center gap-1.5 py-1.5 px-3 rounded-2xl bg-white/70 text-matcha-800 text-xs font-semibold">
                <span className="material-symbols-outlined text-body-md">check</span>
                <span>Auto-balanced</span>
              </div>
            </div>

            <div className="bg-lilac-100 border border-lilac-200 rounded-3xl p-5 flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-2xl bg-white/90 text-lilac-600 flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-[22px]">bedtime</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-label-caps font-bold bg-white text-lilac-700 shadow-2xs uppercase tracking-wider font-mono">
                  Active
                </span>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-black text-slate-900">DND Quiet Mode</div>
                <div className="text-xs text-slate-600 font-medium">Muted until 8:00 AM</div>
              </div>
              <div className="mt-3.5 flex items-center justify-between bg-white/80 p-2 rounded-2xl">
                <span className="text-xs font-bold text-slate-700">Night Mute</span>
                <button aria-checked="true" className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full bg-lilac-600 transition-colors focus:outline-none" role="switch" type="button">
                  <span className="inline-block h-4 w-4 transform translate-x-4 rounded-full bg-white shadow-xs transition-transform mt-0.5" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {[
                  { key: "all", label: "All", count: 5 },
                  { key: "action", label: "Action Required", count: 2 },
                  { key: "invitations", label: "Invitations", count: 1 },
                  { key: "bills", label: "Bill Updates", count: 2 },
                  { key: "archive", label: "Archive", count: null },
                ].map((p) => (
                  <button
                    key={p.key}
                    type="button"
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-xs transition ${
                      p.key === "all"
                        ? "bg-slate-900 text-white shadow-xs"
                        : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {p.key !== "all" && p.key !== "archive" && (
                      <span
                        className={`w-2 h-2 rounded-full ${
                          p.key === "action"
                            ? "bg-rose-500"
                            : p.key === "invitations"
                            ? "bg-sky-500"
                            : "bg-emerald-500"
                        }`}
                      />
                    )}
                    {p.key === "archive" && (
                      <span className="material-symbols-outlined text-body-md text-slate-400">archive</span>
                    )}
                    <span>{p.label}</span>
                    {p.count !== null && (
                      <span
                        className={`px-1.5 py-0.2 rounded-full font-mono text-label-caps ${
                          p.key === "all"
                            ? "bg-white/20 text-white"
                            : p.key === "action"
                            ? "bg-peach-100 text-peach-700"
                            : p.key === "invitations"
                            ? "bg-sky-100 text-sky-700"
                            : "bg-matcha-100 text-matcha-700"
                        }`}
                      >
                        {p.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[19px] text-peach-600">bolt</span>
                    <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 font-mono">
                      Urgent &amp; Direct Actions
                    </h2>
                  </div>
                  <span className="text-xs font-bold text-peach-600 font-mono">2 needs response</span>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs hover:border-slate-300 transition">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[24px]">downhill_skiing</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-700 text-label-caps font-bold font-mono tracking-wider uppercase">
                            TRIP INVITATION
                          </span>
                          <span className="text-xs text-slate-400 font-medium">12m ago</span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900">
                          Marco invited you to join â€œTahoe Ski Weekend â„ï¸â€
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500">
                          6 friends already joined â€¢ Estimated shared tab is â‚¹480/person covering chalet rental &amp; lift tickets.
                        </p>
                      </div>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0 mt-1" />
                  </div>
                  <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/80 p-4 rounded-2xl">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <div className="flex -space-x-2 overflow-hidden">
                        <div className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center text-xs font-bold ring-2 ring-white">
                          M
                        </div>
                        <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold ring-2 ring-white">
                          K
                        </div>
                        <div className="w-8 h-8 rounded-full bg-lilac-200 text-lilac-700 flex items-center justify-center text-xs font-bold ring-2 ring-white">
                          +4
                        </div>
                      </div>
                      <span className="text-xs font-medium text-slate-600">Includes Tahoe Chalet rental tab</span>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <button className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs transition" type="button">
                        Decline
                      </button>
                      <button className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-xs" type="button">
                        <span className="material-symbols-outlined text-[16px] text-emerald-400">check</span>
                        <span>Accept Invite</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs hover:border-slate-300 transition">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-peach-100 text-peach-600 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[24px]">waving_hand</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-peach-100 text-peach-700 text-label-caps font-bold font-mono tracking-wider uppercase">
                            PAYMENT NUDGE
                          </span>
                          <span className="text-xs text-slate-400 font-medium">45m ago</span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900">
                          Gentle Nudge: Sarah requested settlement for â‚¹60.00
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500">
                          Tab: <strong className="text-slate-700 font-semibold">Seafood Dinner at Pier 39</strong> â€¢ Total was â‚¹240.00 split equally among 4.
                        </p>
                      </div>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0 mt-1" />
                  </div>
                  <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-peach-50/70 border border-peach-100 p-4 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-2xl bg-white text-peach-600 flex items-center justify-center font-bold text-xs shadow-2xs">
                        <span className="material-symbols-outlined text-[19px]">restaurant</span>
                      </div>
                      <div>
                        <span className="text-label-caps font-bold text-slate-500 uppercase tracking-wider font-mono">
                          Due to Sarah Lin
                        </span>
                        <div className="text-base font-extrabold text-peach-600 font-mono">â‚¹60.00</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <button className="px-4 py-2 rounded-xl bg-white border border-peach-200 text-slate-700 hover:bg-peach-100/50 font-bold text-xs transition" type="button">
                        Split Details
                      </button>
                      <button className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-xs" type="button">
                        <span className="material-symbols-outlined text-[17px]">bolt</span>
                        <span>Pay Now â‚¹60.00</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[19px] text-slate-400">history_toggle_off</span>
                    <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 font-mono">
                      Recent Updates &amp; Receipts
                    </h2>
                  </div>
                  <span className="text-xs font-bold text-slate-400 font-mono">3 recorded</span>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs hover:border-slate-300 transition">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-buttercup-100 text-buttercup-700 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[24px]">shopping_cart</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-buttercup-100 text-buttercup-700 text-label-caps font-bold font-mono tracking-wider uppercase">
                            EXPENSE ADDED
                          </span>
                          <span className="text-xs text-slate-400 font-medium">2h ago</span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900">
                          Alex added â€œSupermarket Runâ€ (â‚¹142.50) to Apartment 4B
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500">
                          Shared with 3 roommates. Your calculated share is <strong className="text-slate-800">â‚¹47.50</strong>.
                        </p>
                      </div>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-buttercup-200 shrink-0 mt-1" />
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-50 rounded-2xl">
                    <div className="flex items-center gap-2 text-slate-600 text-xs font-medium">
                      <span className="material-symbols-outlined text-[17px] text-emerald-600">receipt_long</span>
                      <span>Split 33.3% evenly â€¢ Itemized receipt (6 grocery items)</span>
                    </div>
                    <button className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs transition shadow-2xs">
                      <span>View Breakdown</span>
                      <span className="material-symbols-outlined text-body-md">chevron_right</span>
                    </button>
                  </div>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs hover:border-slate-300 transition">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-matcha-100 text-matcha-700 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[24px]">verified</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-matcha-100 text-matcha-700 text-label-caps font-bold font-mono tracking-wider uppercase">
                            SETTLEMENT CONFIRMED
                          </span>
                          <span className="text-xs text-slate-400 font-medium">Yesterday, 6:15 PM</span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900">
                          Leo settled â‚¹124.00 via Apple Pay. Balance updated.
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500">
                          Leo completed their share for <strong className="text-slate-800">Friday Omakase</strong> tab. Net balance is now â‚¹0.00.
                        </p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-emerald-600 text-[20px] shrink-0">check_circle</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between p-3.5 bg-matcha-50/70 border border-matcha-100 rounded-2xl">
                    <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>Transaction ID #TAB-88392 â€¢ Direct Deposit to Apple Cash</span>
                    </div>
                    <span className="text-sm font-bold text-emerald-700 font-mono">+â‚¹124.00 Received</span>
                  </div>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs hover:border-slate-300 transition">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-lilac-100 text-lilac-600 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[24px]">celebration</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-lilac-100 text-lilac-700 text-label-caps font-bold font-mono tracking-wider uppercase">
                            TAB FINALIZED ðŸŽ‰
                          </span>
                          <span className="text-xs text-slate-400 font-medium">May 18</span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900">Goa Trip tab has been fully settled and closed!</h3>
                        <p className="text-xs sm:text-sm text-slate-500">
                          All 5 members are square with zero lingering debts. PDF summary ledger generated for everyone.
                        </p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-lilac-600 text-[20px] shrink-0">task_alt</span>
                  </div>
                  <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 bg-slate-50 rounded-2xl">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-lilac-100 text-lilac-600 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[17px]">picture_as_pdf</span>
                      </div>
                      <span className="text-xs font-semibold text-slate-800 font-mono">Goa_Trip_Ledger_Archive.pdf</span>
                    </div>
                    <button className="w-full sm:w-auto px-4 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-lilac-700 font-bold text-xs transition shadow-2xs flex items-center justify-center gap-1.5" type="button">
                      <span className="material-symbols-outlined text-[16px]">download</span>
                      <span>Download Ledger</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700">
                      <span className="material-symbols-outlined text-[20px]">tune</span>
                    </div>
                    <h3 className="text-sm font-extrabold text-slate-900">Channel Preferences</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-matcha-100 text-matcha-700 text-label-caps font-bold font-mono tracking-wider uppercase">
                    Live Sync
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-5 leading-relaxed">
                  Customize alerts so you only get nudged when high-priority settlements take place.
                </p>
                <div className="space-y-3.5">
                  {[
                    { title: "In-App Banners", sub: "Instant banners for bill requests", on: true },
                    { title: "Email Daily Digest", sub: "Morning summary of group ledger", on: true },
                    { title: "SMS Payment Pings", sub: "Direct text when settlements clear", on: false },
                    { title: "Group Chat Nudges", sub: "Light haptic pings on friend mentions", on: true },
                  ].map((t) => (
                    <div key={t.title} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/70 transition">
                      <div className="pr-2">
                        <div className="text-xs font-bold text-slate-900">{t.title}</div>
                        <div className="text-label-caps text-slate-500">{t.sub}</div>
                      </div>
                      <button
                        aria-checked={t.on}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors focus:outline-none ${
                          t.on ? "bg-emerald-600" : "bg-slate-300"
                        }`}
                        role="switch"
                        type="button"
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs transition-transform mt-0.5 ml-0.5 ${
                            t.on ? "translate-x-5.5" : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-buttercup-100 text-buttercup-700 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[18px]">volume_off</span>
                    </div>
                    <h3 className="text-sm font-extrabold text-slate-900">Muted Groups</h3>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">1 active</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
                      â„ï¸
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">Tahoe Ski Weekend</div>
                      <div className="text-label-caps text-slate-500">Muted until Friday 6:00 PM</div>
                    </div>
                  </div>
                  <button className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-label-caps font-bold text-slate-600 hover:text-slate-900 transition" type="button">
                    Unmute
                  </button>
                </div>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-peach-100 text-peach-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">send</span>
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-900">Quick Nudge Back</h3>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Send a polite 1-tap emoji ping to friends with outstanding tab shares.
                </p>
                <div className="space-y-2.5">
                  {[
                    { initial: "S", name: "Sarah Lin", tag: "#Pier39", color: "bg-peach-200 text-peach-700", btn: "bg-peach-100 hover:bg-peach-200 text-peach-700", emoji: "ðŸ‘‹ Ping" },
                    { initial: "M", name: "Marco Rossi", tag: "#Tahoe", color: "bg-sky-200 text-sky-700", btn: "bg-sky-100 hover:bg-sky-200 text-sky-700", emoji: "ðŸŽ¿ Reply" },
                  ].map((n) => (
                    <div key={n.name} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-full ${n.color} flex items-center justify-center text-xs font-bold`}>
                          {n.initial}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-800">{n.name}</span>
                          <span className="text-label-caps text-slate-400 ml-1 font-mono">{n.tag}</span>
                        </div>
                      </div>
                      <button className={`px-3 py-1 rounded-xl ${n.btn} font-bold text-xs transition flex items-center gap-1`}>
                        <span>{n.emoji}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-matcha-50/70 border border-matcha-200/80 rounded-3xl p-5 flex items-start gap-3">
                <span className="material-symbols-outlined text-emerald-600 text-[22px] shrink-0 mt-0.5">verified_user</span>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900 tracking-tight">End-to-End Ledger Integrity</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Tabsy only triggers notifications for confirmed mutual events and encrypted transaction settlement updates. No spam or commercial pushes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full bg-slate-100 border-t border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-emerald-500 flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-white text-body-md">receipt_long</span>
            </div>
            <span className="font-bold text-sm text-slate-800">Tabsy</span>
            <span className="text-xs text-slate-500 ml-2">Â© 2025 All tabs settled effortlessly.</span>
          </div>
          <div className="flex items-center gap-6">
            <a className="text-xs font-medium text-slate-600 hover:text-slate-900 transition" href="#">
              Overview
            </a>
            <a className="text-xs font-medium text-slate-600 hover:text-slate-900 transition" href="#">
              Group Balances
            </a>
            <a className="text-xs font-medium text-slate-600 hover:text-slate-900 transition" href="#">
              Settings
            </a>
          </div>
        </div>
      </footer>
    </AppLayout>
  );
}
