import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";

const inr = (n) => `₹${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const PROTOCOLS = [
  {
    id: "remove",
    icon: "person_remove",
    iconCls: "bg-primary-fixed text-primary",
    title: "Remove from Friends",
    badge: "Gentle & Reversible",
    badgeCls: "bg-primary text-on-primary",
    desc: "Removes Liam from direct buddy lists, instant 1-on-1 pings, and quick-split suggestions. You will both still see each other in Brooklyn Loft with past expenses intact. Can reconnect anytime.",
    checkActive: "bg-primary text-on-primary",
    btn: "Confirm & Remove Friend",
    btnIcon: "person_remove",
    btnCls: "bg-tertiary-container text-on-tertiary-container hover:opacity-90 shadow-sm",
  },
  {
    id: "block",
    icon: "block",
    iconCls: "bg-tertiary-fixed text-tertiary",
    title: "Block & Restrict",
    badge: "Strict & Silent",
    badgeCls: "bg-tertiary text-on-tertiary",
    desc: "Completely hides your profile, denies all future friend or payment requests, silences direct communications, and flags shared group interactions with privacy shields.",
    checkActive: "bg-tertiary text-on-tertiary",
    btn: "Confirm & Block Liam",
    btnIcon: "block",
    btnCls: "bg-tertiary text-on-tertiary hover:opacity-95 shadow-[0_4px_14px_0_rgba(188,11,59,0.25)]",
  },
  {
    id: "mute",
    icon: "notifications_paused",
    iconCls: "bg-secondary-fixed text-secondary",
    title: "Mute & Archive Only",
    badge: "Zero-Drama",
    badgeCls: "bg-secondary text-on-secondary",
    desc: "Keep connection active for ledger history but hide from active feed, disable notifications, and suppress automated settlement nudges.",
    checkActive: "bg-secondary text-on-secondary",
    btn: "Archive & Mute Updates",
    btnIcon: "notifications_paused",
    btnCls: "bg-secondary text-on-secondary hover:opacity-95 shadow-[0_4px_14px_0_rgba(70,72,212,0.25)]",
  },
];

const REASONS = [
  "No longer in shared living space or group trips",
  "Moving out of Brooklyn Loft",
  "Inactive friend / cleaning up contacts",
  "Privacy preference",
  "Disputed ledger / unresolved split",
  "Other personal reason",
];

export default function FriendManage() {
  const navigate = useNavigate();
  const [proto, setProto] = useState("remove");
  const [switches, setSwitches] = useState({ preserve: true, notifyAdmin: false, autoDecline: true });
  const [reason, setReason] = useState(REASONS[0]);
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState("idle");
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);
  const runTimer = useRef(null);

  const active = PROTOCOLS.find((p) => p.id === proto) || PROTOCOLS[0];

  function showToast(message, icon = "check_circle") {
    setToast({ message, icon });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }

  function toggle(key) {
    setSwitches((s) => ({ ...s, [key]: !s[key] }));
  }

  function execute() {
    if (phase !== "idle") return;
    setPhase("processing");
    if (runTimer.current) clearTimeout(runTimer.current);
    runTimer.current = setTimeout(() => {
      setPhase("done");
      showToast(`Relationship updated · ${active.title}`, active.id === "block" ? "block" : active.id === "mute" ? "notifications_paused" : "person_remove");
    }, 900);
  }

  const SWITCHES = [
    { key: "preserve", title: "Preserve display name in past group receipts", desc: "Keeps historical receipts transparent for Brooklyn Loft roommates." },
    { key: "notifyAdmin", title: "Notify mutual group admin (Brooklyn Loft)", desc: "Quietly alert Alex Chen to verify upcoming shared rent splits." },
    { key: "autoDecline", title: "Auto-decline future 1-on-1 split invitations", desc: "Automatically reject any direct payment requests from Liam." },
  ];

  return (
    <AppLayout>
      <div className="bg-[#f7f6fd] font-body-md text-body-md text-on-surface antialiased">
        <main className="w-full min-h-screen pb-12">
          <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-5">
            {/* Breadcrumb + banner */}
            <div className="flex flex-col gap-3">
              <nav className="flex items-center gap-2 text-[13px] text-on-surface-variant flex-wrap">
                <Link to="/dashboard" className="hover:text-primary transition-colors">Home</Link>
                <span className="text-outline-variant text-[10px]">/</span>
                <Link to="/friends" className="hover:text-primary transition-colors">Friends</Link>
                <span className="text-outline-variant text-[10px]">/</span>
                <span className="hover:text-primary transition-colors cursor-pointer">Manage Connection</span>
                <span className="text-outline-variant text-[10px]">/</span>
                <span className="text-on-surface font-semibold">Liam Vance (@liamv)</span>
              </nav>

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-surface-container-lowest p-5 sm:p-6 rounded-3xl shadow-sm">
                <div className="flex flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-label-caps text-[11px] tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-bold">Peer #8492 • Since Jan 2024</span>
                    <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-semibold text-[13px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      <span>Direct Debt Clearance: {inr(0)} Direct Balance</span>
                    </div>
                  </div>
                  <h1 className="font-headline-lg text-2xl lg:text-3xl text-on-surface font-bold tracking-tight">Manage Connection &amp; Bilateral Standing</h1>
                  <p className="text-sm text-on-surface-variant max-w-3xl leading-relaxed">
                    Safely disconnect or restrict peer communications, audit mutual group liabilities, and preserve historical receipt ledger integrity without accidental data loss.
                  </p>
                </div>
                <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container-high text-on-surface font-semibold text-sm transition-all shrink-0" type="button" onClick={() => showToast("Opened full bilateral ledger log", "history")}>
                  <span className="material-symbols-outlined text-[18px]">history</span>
                  <span>Full Ledger Log</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* LEFT */}
              <div className="lg:col-span-7 flex flex-col gap-5">
                {/* Profile + trust */}
                <div className="bg-surface-container-lowest rounded-3xl p-5 shadow-sm flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="relative shrink-0">
                        <div className="w-20 h-20 rounded-2xl flex items-center justify-center font-bold text-2xl bg-primary-fixed text-on-primary-fixed-variant shadow-md">LV</div>
                        <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-sm">
                          <span className="material-symbols-outlined text-[14px]">verified</span>
                        </div>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold truncate">Liam Vance</h2>
                          <span className="px-2 py-0.5 rounded-full bg-surface-container font-label-caps text-[11px] text-on-surface-variant font-bold">@liamv</span>
                        </div>
                        <span className="text-sm text-on-surface-variant mt-0.5 break-all">liam.vance@ledgermail.co</span>
                        <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                          <span className="px-2.5 py-1 rounded-full bg-surface-container-low text-secondary font-label-caps text-[11px] font-semibold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">person_outline</span> 1-on-1 Connected Friend
                          </span>
                          <span className="px-2.5 py-1 rounded-full bg-surface-container-low text-on-surface-variant font-label-caps text-[11px] font-semibold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">apartment</span> Mutual Roommate
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 p-3 sm:p-0 bg-surface-container-low sm:bg-transparent rounded-xl shrink-0">
                      <div className="flex items-center gap-2">
                        <div className="relative w-12 h-12 flex items-center justify-center">
                          <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                            <path className="text-surface-container-high" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                            <path className="text-primary-container" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="98, 100" strokeLinecap="round" strokeWidth="3" />
                          </svg>
                          <span className="absolute font-numeric-balance-md text-[13px] font-bold text-on-surface">98%</span>
                        </div>
                        <div className="flex flex-col sm:items-end">
                          <span className="font-label-caps text-[11px] uppercase text-outline">Trust Score</span>
                          <span className="text-sm text-on-surface-variant">32 settled tabs</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 p-3.5 rounded-2xl bg-surface-container-low">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[20px]">roofing</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-title-md text-title-md text-on-surface font-bold">Brooklyn Loft</span>
                          <span className="px-2 py-0.5 rounded-full bg-surface-container font-label-caps text-[11px] text-on-surface-variant font-bold">4 Roommates</span>
                        </div>
                        <span className="text-sm text-on-surface-variant truncate">Active tenant split ledger since Sep 2023</span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-outline shrink-0">chevron_right</span>
                  </div>
                </div>

                {/* Bilateral audit */}
                <div className="bg-surface-container-lowest rounded-3xl p-5 shadow-sm flex flex-col gap-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[22px]">policy</span>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Bilateral Financial Audit</h3>
                    </div>
                    <span className="font-label-caps text-[11px] text-primary-container px-2 py-0.5 rounded bg-primary-fixed font-bold uppercase">Audited in Realtime</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-surface-container-low p-3.5 rounded-2xl flex flex-col">
                      <span className="font-label-caps text-[11px] uppercase text-outline mb-1">Direct 1:1 Balance</span>
                      <span className="font-numeric-balance-lg text-[24px] text-primary font-bold tracking-tight">{inr(0)}</span>
                      <span className="text-sm text-on-surface-variant mt-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px] text-primary">check_circle</span> All tabs settled
                      </span>
                    </div>
                    <div className="bg-surface-container-low p-3.5 rounded-2xl flex flex-col">
                      <span className="font-label-caps text-[11px] uppercase text-outline mb-1">Mutual Group Split</span>
                      <span className="font-numeric-balance-lg text-[24px] text-secondary font-bold tracking-tight">{inr(2838.6)}</span>
                      <span className="text-sm text-on-surface-variant mt-1">Brooklyn Loft</span>
                    </div>
                    <div className="bg-surface-container-low p-3.5 rounded-2xl flex flex-col">
                      <span className="font-label-caps text-[11px] uppercase text-outline mb-1">Outstanding IOUs</span>
                      <span className="font-numeric-balance-lg text-[24px] text-on-surface font-bold tracking-tight">0</span>
                      <span className="text-sm text-on-surface-variant mt-1">No pending drafts</span>
                    </div>
                    <div className="bg-surface-container-low p-3.5 rounded-2xl flex flex-col">
                      <span className="font-label-caps text-[11px] uppercase text-outline mb-1">Ledger Risk Index</span>
                      <span className="font-numeric-balance-lg text-[24px] text-primary font-bold tracking-tight">0%</span>
                      <span className="text-sm text-primary font-semibold mt-1">Safe to disconnect</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-surface-container-high flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-surface-container-lowest text-secondary flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                      <span className="material-symbols-outlined text-[18px]">info</span>
                    </div>
                    <div className="flex flex-col text-on-surface">
                      <span className="font-title-md text-title-md font-bold text-on-surface">Group Exposure Detail &amp; Safe Severance</span>
                      <p className="text-sm text-on-surface-variant mt-0.5 leading-relaxed">
                        Liam does not owe you directly. The <strong className="text-on-surface">{inr(2838.6)} exposure</strong> is a shared utility tab fronted by Alex Chen in Brooklyn Loft (ConEd &amp; Fiber). Your personal balance with Liam is entirely clear, so disconnection will not create orphan splits.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Separation protocol */}
                <div className="bg-surface-container-lowest rounded-3xl p-5 shadow-sm flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Separation Protocol</h3>
                      <span className="text-sm text-outline">Choose enforcement scope</span>
                    </div>
                    <p className="text-sm text-on-surface-variant">Select the operational tier for managing peer boundaries with Liam Vance.</p>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {PROTOCOLS.map((p) => {
                      const on = proto === p.id;
                      return (
                        <div
                          key={p.id}
                          onClick={() => setProto(p.id)}
                          className={`cursor-pointer p-4 rounded-2xl transition-all duration-200 ${on ? "bg-surface-container-low shadow-sm hover:shadow-md" : "bg-surface-container-lowest hover:bg-surface-container-low border border-surface-container"}`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3.5 min-w-0">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${p.iconCls}`}>
                                <span className="material-symbols-outlined text-[22px]">{p.icon}</span>
                              </div>
                              <div className="flex flex-col min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-headline-sm text-[18px] text-on-surface font-bold">{p.title}</span>
                                  <span className={`px-2 py-0.5 rounded-full font-label-caps text-[11px] font-bold ${p.badgeCls}`}>{p.badge}</span>
                                </div>
                                <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">{p.desc}</p>
                              </div>
                            </div>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 ${on ? p.checkActive : "bg-surface-container text-transparent"}`}>
                              <span className="material-symbols-outlined text-[16px]">check</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* RIGHT (sticky) */}
              <div className="lg:col-span-5 flex flex-col gap-5 lg:sticky lg:top-6">
                <div className="bg-surface-container-lowest rounded-3xl p-5 shadow-md flex flex-col gap-4">
                  <div className="flex items-center justify-between pb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-tertiary-fixed text-tertiary flex items-center justify-center">
                        <span className="material-symbols-outlined text-[20px]">security</span>
                      </div>
                      <h3 className="font-headline-sm text-[18px] text-on-surface font-bold">Safeguards &amp; Ledger Rules</h3>
                    </div>
                    <span className="font-label-caps text-[11px] text-outline uppercase">Bilateral Lock</span>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    {SWITCHES.map((s) => {
                      const on = switches[s.key];
                      return (
                        <div key={s.key} className="flex items-start justify-between gap-3 p-3 rounded-2xl bg-surface-container-low">
                          <div className="flex flex-col min-w-0">
                            <span className="font-title-md text-[14px] text-on-surface font-semibold">{s.title}</span>
                            <span className="text-sm text-on-surface-variant">{s.desc}</span>
                          </div>
                          <button
                            aria-checked={on}
                            role="switch"
                            aria-label={s.title}
                            className={`w-11 h-6 rounded-full p-0.5 transition-colors relative shrink-0 ${on ? "bg-primary-container" : "bg-surface-container-highest"}`}
                            type="button"
                            onClick={() => toggle(s.key)}
                          >
                            <span className={`block w-5 h-5 rounded-full bg-surface-container-lowest shadow-sm transform transition-transform ${on ? "translate-x-5" : "translate-x-0"}`} />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex flex-col gap-1.5 mt-1">
                    <label className="font-label-caps text-[11px] uppercase text-outline">Reason for Separation</label>
                    <div className="relative">
                      <button
                        aria-haspopup="listbox"
                        aria-expanded={open}
                        className="w-full flex items-center justify-between gap-2 bg-surface-container-low text-on-surface text-sm font-semibold rounded-lg pl-3.5 pr-3 py-2.5 border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer transition-colors"
                        type="button"
                        onClick={() => setOpen((o) => !o)}
                      >
                        <span className="truncate">{reason}</span>
                        <span className={`material-symbols-outlined text-[20px] text-outline shrink-0 transition-transform ${open ? "rotate-180" : ""}`}>arrow_drop_down</span>
                      </button>
                      {open && (
                        <>
                          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
                          <div role="listbox" className="absolute z-30 mt-1.5 w-full bg-surface-container-lowest border border-surface-container rounded-xl shadow-lg overflow-hidden">
                            <div className="max-h-64 overflow-y-auto py-1">
                              {REASONS.map((r) => (
                                <button
                                  key={r}
                                  role="option"
                                  aria-selected={r === reason}
                                  className={`w-full text-left px-3.5 py-2.5 text-sm flex items-center justify-between gap-2 transition-colors ${r === reason ? "bg-primary-fixed/20 text-primary font-semibold" : "text-on-surface hover:bg-surface-container-low"}`}
                                  type="button"
                                  onClick={() => {
                                    setReason(r);
                                    setOpen(false);
                                  }}
                                >
                                  <span className="truncate">{r}</span>
                                  {r === reason && <span className="material-symbols-outlined text-[18px] text-primary shrink-0">check</span>}
                                </button>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mt-1">
                    <button
                      className={`w-full py-3.5 px-4 rounded-full font-title-md text-title-md font-bold flex items-center justify-center gap-2 transition-all ${
                        phase === "done" ? "bg-primary text-on-primary" : `${active.btnCls} cursor-pointer`
                      }`}
                      disabled={phase !== "idle"}
                      type="button"
                      onClick={execute}
                    >
                      <span className={`material-symbols-outlined text-[20px] ${phase === "processing" ? "animate-spin" : ""}`}>
                        {phase === "processing" ? "refresh" : phase === "done" ? "done" : active.btnIcon}
                      </span>
                      <span>{phase === "processing" ? "Processing Separation..." : phase === "done" ? "Relationship Updated" : active.btn}</span>
                    </button>
                    <button className="w-full py-2.5 px-4 rounded-full bg-transparent hover:bg-surface-container-low text-on-surface-variant font-semibold text-sm transition-colors text-center" type="button" onClick={() => navigate(-1)}>
                      Cancel &amp; Return to Friends
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-surface-container-low flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-surface-container-highest text-secondary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-title-md text-[14px] text-on-surface font-bold">Contested split or missing receipt?</span>
                      <p className="text-sm text-on-surface-variant mt-0.5">Before severing connection, settle any manual cash exchanges or draft IOUs outside the app.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button className="flex-1 py-2 px-3 rounded-lg bg-surface-container-lowest hover:bg-surface-container-high text-on-surface font-semibold text-sm transition-colors flex items-center justify-center gap-1.5 shadow-sm" type="button" onClick={() => showToast("Opened instant settle tab", "add_card")}>
                      <span className="material-symbols-outlined text-[16px] text-primary">add_card</span> Instant Settle Tab
                    </button>
                    <button className="flex-1 py-2 px-3 rounded-lg bg-surface-container-lowest hover:bg-surface-container-high text-on-surface font-semibold text-sm transition-colors flex items-center justify-center gap-1.5 shadow-sm" type="button" onClick={() => showToast("Opened dispute resolution", "help_center")}>
                      <span className="material-symbols-outlined text-[16px] text-outline">help_center</span> Dispute Resolution
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {toast && (
          <div className="fixed bottom-6 right-6 z-50">
            <div className="flex items-center gap-3 bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-xl shadow-xl max-w-[90vw]">
              <span className="material-symbols-outlined text-primary-fixed text-[20px] shrink-0">{toast.icon}</span>
              <span className="font-medium text-[13px]">{toast.message}</span>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}