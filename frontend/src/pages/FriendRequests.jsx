import { useMemo, useRef, useState } from "react";
import AppLayout from "../components/layout/AppLayout";

const inr = (n) => `₹${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const inr0 = (n) => `₹${Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

const CURRENT_NET = 11827.5;

const REQUESTS = [
  {
    id: "liam",
    name: "Liam Vance",
    handle: "@liamv",
    initials: "LV",
    avatarCls: "bg-pastel-mint text-pastel-emerald-deep",
    dot: "bg-primary",
    ring: "ring-primary/30",
    tag: "Tab Pending",
    tagCls: "bg-pastel-mint text-pastel-emerald-deep border-emerald-200",
    cohortIcon: "apartment",
    cohortIconCls: "text-primary",
    cohortCls: "bg-pastel-mint/40 text-pastel-emerald-deep",
    cohort: "Brooklyn Loft Cohort",
    cohortMeta: `${inr(2838.6)} split`,
    note: "Hey Alex! Adding you so we can settle the February utilities tab directly without bouncing cash transfers around.",
    sourceIcon: "groups",
    sourceLabel: "3 mutual friends",
    sourceCls: "text-outline",
    inspect: "Inspecting",
    inspectCls: "text-primary",
    mutuals: [
      { i: "MR", cls: "bg-purple-300 text-purple-900" },
      { i: "SL", cls: "bg-pink-300 text-pink-900" },
      { i: "DK", cls: "bg-emerald-300 text-emerald-900" },
    ],
    mutualNames: "Marco, Sarah, Dev",
    profile: "Product Designer at Craftline • Active member in Brooklyn Loft (8 roommates)",
    since: "Tabsy user 14 months",
    reliability: "99.4% on-time settlement",
    tabAmount: 2838.6,
    tabDesc: "Feb ConEd Electricity + Highspeed Fiber wifi split",
    group: "Brooklyn Loft",
    isOwed: true,
  },
  {
    id: "jessica",
    name: "Jessica Miller",
    handle: "@jessm",
    initials: "JM",
    avatarCls: "bg-pastel-lavender text-pastel-violet-deep",
    dot: "bg-secondary",
    ring: "ring-secondary/30",
    tag: "Address Book",
    tagCls: "bg-pastel-lavender text-pastel-violet-deep border-purple-200",
    cohortIcon: "downhill_skiing",
    cohortIconCls: "text-secondary",
    cohortCls: "bg-pastel-lavender/50 text-pastel-violet-deep",
    cohort: "Tahoe Ski Trip Cohort",
    cohortMeta: "2 mutuals",
    note: "Met at Tahoe ski trip dinner! Let's connect for future splits and gear rentals.",
    sourceIcon: "contact_phone",
    sourceLabel: "Contacts Sync Match",
    sourceCls: "text-outline",
    inspect: "Tap to inspect",
    inspectCls: "text-secondary",
    mutuals: [
      { i: "JD", cls: "bg-emerald-300 text-emerald-900" },
      { i: "KP", cls: "bg-sky-300 text-sky-900" },
    ],
    mutualNames: "Julian, Kevin",
    profile: "Backend Engineer • Active member in Tahoe Ski Trip cohort",
    since: "Tabsy user 8 months",
    reliability: "97.1% on-time settlement",
    tabAmount: 4814,
    tabDesc: "Cabin Wood & Grocery Provisions split",
    group: "Tahoe Ski Trip",
    isOwed: true,
  },
  {
    id: "jordan",
    name: "Jordan Reed",
    handle: "@jordanr",
    initials: "JR",
    avatarCls: "bg-pastel-buttercup text-pastel-amber-deep",
    dot: "bg-outline",
    ring: "ring-outline/30",
    tag: "Public Link",
    tagCls: "bg-pastel-buttercup text-pastel-amber-deep border-yellow-200",
    cohortIcon: "link",
    cohortIconCls: "text-amber-700",
    cohortCls: "bg-pastel-buttercup/60 text-pastel-amber-deep",
    cohort: "tabsy.me/u/alexmorgan",
    cohortMeta: "Unverified",
    note: "Joined from your bio link to settle the coworking espresso tab!",
    sourceIcon: "shield",
    sourceLabel: "Zero mutual groups",
    sourceCls: "text-tertiary",
    inspect: "Tap to inspect",
    inspectCls: "text-outline",
    mutuals: [],
    mutualNames: "",
    profile: "Freelance barista • Joined via public beam link",
    since: "New Tabsy user",
    reliability: "Unverified settlement",
    tabAmount: 1203.5,
    tabDesc: "Coworking batch drip & espresso order",
    group: "Direct Public Link",
    isOwed: false,
  },
];

const OUTGOING = [
  { id: "kevin", name: "Kevin Park", sub: "@kevinp • Direct Ping", initials: "KP", avatarCls: "bg-pastel-blue text-pastel-sky-deep", badge: "3h lock", kind: "lock", sent: "Sent 21 hours ago", status: "Awaiting peer tap", statusCls: "text-primary", action: "nudge", actionLabel: "Resend Nudge", actionIcon: "notifications_active" },
  { id: "rachel", name: "Rachel Adams", sub: "rachel.a@domain.com", initials: "RA", avatarCls: "bg-pastel-rose text-pastel-rose-deep", badge: "Email", kind: "label", sent: "Sent 4 days ago", status: "Unopened link", statusCls: "text-outline", action: "sms", actionLabel: "Send via SMS", actionIcon: "sms" },
];

const FILTERS = [
  { id: "all", label: "All (3)" },
  { id: "cohorts", label: "Trip Cohort" },
  { id: "links", label: "Public Link" },
];

export default function FriendRequests() {
  const [activeKey, setActiveKey] = useState("liam");
  const [filter, setFilter] = useState("all");
  const [resolved, setResolved] = useState({});
  const [outDone, setOutDone] = useState({});
  const [revoked, setRevoked] = useState({});
  const [fastInput, setFastInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [modal, setModal] = useState(false);
  const [allCleared, setAllCleared] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);
  const copyTimer = useRef(null);

  function showToast(message, icon = "check_circle") {
    setToast({ message, icon });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }

  const dossier = REQUESTS.find((r) => r.id === activeKey) || REQUESTS[0];

  const visible = useMemo(() => {
    if (filter === "cohorts") return REQUESTS.filter((r) => r.id !== "jordan");
    if (filter === "links") return REQUESTS.filter((r) => r.id === "jordan");
    return REQUESTS;
  }, [filter]);

  const newNet = CURRENT_NET + dossier.tabAmount;
  const tabPct = Math.round((dossier.tabAmount / newNet) * 100);

  function selectRequest(id) {
    setActiveKey(id);
    const r = REQUESTS.find((x) => x.id === id);
    showToast(`Inspecting ${r.name}'s bilateral exposure`, "person_search");
  }

  function resolve(type) {
    const name = dossier.name;
    const verb =
      type === "link_group"
        ? `Linked ${name} to shared group ledger`
        : type === "one_on_one"
          ? `Connected with ${name} as 1-on-1 contact`
          : type === "decline"
            ? `Declined request from ${name}`
            : `Reported ${name} & throttled domain`;
    setResolved((p) => ({ ...p, [dossier.id]: true }));
    showToast(verb, type === "spam" ? "security" : type === "decline" ? "cancel" : "hub");
  }

  function copyBeam() {
    if (navigator.clipboard) navigator.clipboard.writeText("https://tabsy.me/u/alexmorgan").catch(() => {});
    setCopied(true);
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 2000);
    showToast("Personal beam link copied to clipboard", "content_copy");
  }

  function doOutgoing(o) {
    if (outDone[o.id]) return;
    setOutDone((p) => ({ ...p, [o.id]: true }));
    showToast(o.action === "sms" ? `Sent SMS dispatch invite to ${o.name}` : `Pinged push reminder to ${o.name}`, o.action === "sms" ? "sms" : "notifications_active");
  }

  function revoke(o) {
    setRevoked((p) => ({ ...p, [o.id]: true }));
    showToast(`Revoked invite to ${o.name}`, "cancel");
  }

  function sendFast() {
    const val = fastInput.trim();
    if (!val) {
      showToast("Please enter an email or phone number", "error");
      return;
    }
    showToast(`Invite dispatched to ${val}`, "send");
    setFastInput("");
  }

  function acceptAll() {
    if (allCleared) return;
    setAllCleared(true);
    setResolved({ liam: true, jessica: true });
    showToast("Auto-cleared 2 mutual requests & merged ledgers", "done_all");
  }

  return (
    <AppLayout>
      <div className="bg-[#f7f6fd] font-body-md text-body-md text-on-surface antialiased">
        <main className="w-full min-h-screen pb-12">
          <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider font-label-caps text-outline mb-1">
                  <span className="hover:text-primary transition-colors cursor-pointer">Home</span>
                  <span>/</span>
                  <span className="hover:text-primary transition-colors cursor-pointer">Friends Management</span>
                  <span>/</span>
                  <span className="text-primary font-bold">Bilateral Triage Matrix</span>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight">Tactile Neo-Bento Studio</h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-pastel-buttercup text-pastel-amber-deep border border-yellow-200">Live Matrix v3.2</span>
                </div>
                <p className="text-xs md:text-sm text-on-surface-variant mt-1">Bilateral exposure verification, zero-leak peer ledger clearance, and inbound dispatch stream.</p>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto bg-surface-container-lowest p-1.5 rounded-2xl border border-surface-container shadow-sm">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-pastel-mint/60 rounded-xl text-pastel-emerald-deep min-w-0">
                  <span className="material-symbols-outlined text-[18px] shrink-0">verified_user</span>
                  <div className="leading-tight min-w-0">
                    <div className="text-[10px] uppercase font-bold text-outline truncate">Verified Queue</div>
                    <div className="text-xs font-bold whitespace-nowrap">3 Inbound</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-pastel-blue/60 rounded-xl text-pastel-sky-deep min-w-0">
                  <span className="material-symbols-outlined text-[18px] shrink-0">outbox</span>
                  <div className="leading-tight min-w-0">
                    <div className="text-[10px] uppercase font-bold text-outline truncate">Awaiting Peer</div>
                    <div className="text-xs font-bold whitespace-nowrap">2 Outbound</div>
                  </div>
                </div>
                <button aria-label="Matrix preferences" className="w-8 h-8 rounded-xl bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-outline hover:text-on-surface transition-colors shrink-0" type="button" onClick={() => setModal(true)}>
                  <span className="material-symbols-outlined text-[18px]">tune</span>
                </button>
              </div>
            </div>

            {/* Bento grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* COLUMN 1 */}
              <aside className="lg:col-span-4 flex flex-col gap-4">
                <div className="bg-surface-container-lowest rounded-3xl p-4 border border-surface-container shadow-sm flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                      <span className="text-xs font-bold uppercase tracking-wider text-on-surface">Inbound Triage Stream</span>
                    </div>
                    <span className="text-[11px] font-semibold text-outline px-2 py-0.5 rounded-full bg-surface-container">3 queued</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 bg-surface-container-low p-1 rounded-2xl text-[11px] font-semibold text-center">
                    {FILTERS.map((f) => (
                      <button
                        key={f.id}
                        className={`py-1.5 rounded-xl transition-all ${filter === f.id ? "bg-surface-container-lowest text-on-surface shadow-sm" : "text-outline hover:text-on-surface"}`}
                        type="button"
                        onClick={() => {
                          setFilter(f.id);
                          showToast(f.id === "all" ? "Showing all queued requests" : f.id === "cohorts" ? "Filtered by trip cohorts" : "Filtered by public links", "filter_alt");
                        }}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {visible.map((r) => {
                  const isActive = activeKey === r.id;
                  const done = !!resolved[r.id];
                  return (
                    <div
                      key={r.id}
                      onClick={() => selectRequest(r.id)}
                      className={`bg-surface-container-lowest rounded-3xl p-4 shadow-sm cursor-pointer transition-all relative overflow-hidden ${
                        isActive ? "border-2 border-primary" : "border border-surface-container hover:border-primary/40"
                      } ${done ? "opacity-40 pointer-events-none" : ""}`}
                    >
                      <div className="absolute top-0 right-0 w-16 h-16 bg-pastel-mint/30 rounded-bl-3xl pointer-events-none" />
                      <div className="relative z-10 flex flex-col gap-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm ring-2 ${r.avatarCls} ${r.ring}`}>{r.initials}</div>
                              <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-surface-container-lowest ${r.dot}`} />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <h3 className="text-sm font-bold text-on-surface">{r.name}</h3>
                                <span className="material-symbols-outlined text-[15px] text-primary">verified</span>
                              </div>
                              <span className="text-xs text-outline">{r.handle} • {r.id === "liam" ? "2h ago" : r.id === "jessica" ? "Yesterday" : "3d ago"}</span>
                            </div>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${r.tagCls}`}>{r.tag}</span>
                        </div>

                        <div className={`flex items-center gap-2 text-xs px-2.5 py-1.5 rounded-xl ${r.cohortCls}`}>
                          <span className={`material-symbols-outlined text-[16px] ${r.cohortIconCls}`}>{r.cohortIcon}</span>
                          <span className="font-medium truncate">{r.cohort}</span>
                          <span className="ml-auto text-[11px] font-bold shrink-0">{r.cohortMeta}</span>
                        </div>

                        <p className="text-xs text-on-surface-variant truncate italic">“{r.note}”</p>

                        <div className="flex items-center justify-between text-[11px] text-outline pt-1 border-t border-surface-container">
                          <span className={`flex items-center gap-1 ${r.sourceCls}`}>
                            <span className="material-symbols-outlined text-[14px]">{r.sourceIcon}</span> {r.sourceLabel}
                          </span>
                          <span className={`font-semibold flex items-center gap-0.5 ${r.inspectCls}`}>
                            {r.inspect} <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Inbound shield rules */}
                <div className="bg-surface-container-lowest rounded-3xl p-4 border border-surface-container shadow-sm flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[20px]">security</span>
                      <span className="text-xs font-bold uppercase tracking-wider text-on-surface">Inbound Shield Rules</span>
                    </div>
                    <span className="text-[10px] font-bold text-primary bg-pastel-mint px-2 py-0.5 rounded-full">Active</span>
                  </div>
                  {[
                    { t: "Auto-link Mutual Trips", d: "Auto-admit shared cabin/housemate expenses" },
                    { t: "Phone Privacy Mask", d: "Never expose digits to unlinked peers" },
                    { t: "Anti-Spam Throttling", d: "Max 3 public requests per 24 hours" },
                  ].map((row) => (
                    <div key={row.t} className="flex items-center justify-between p-2 rounded-2xl bg-surface-container-low">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-on-surface">{row.t}</span>
                        <span className="text-[11px] text-outline">{row.d}</span>
                      </div>
                      <span className="w-8 h-5 rounded-full bg-primary flex items-center justify-end p-0.5 shrink-0">
                        <span className="w-4 h-4 rounded-full bg-surface-container-lowest shadow" />
                      </span>
                    </div>
                  ))}
                </div>
              </aside>

              {/* COLUMN 2 — Dossier */}
              <section className="lg:col-span-5 flex flex-col gap-4">
                <div className="bg-surface-container-lowest rounded-3xl p-5 md:p-6 border border-surface-container shadow-sm flex flex-col gap-5 relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-container">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-pastel-mint text-pastel-emerald-deep border border-emerald-200 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px]">sync_alt</span> Bilateral Triage Dossier
                      </span>
                      <span className="text-[11px] text-outline">ID: #TAB-REQ-8821</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-primary font-semibold">
                      <span className="material-symbols-outlined text-[16px]">verified</span> Cryptographically Signed
                    </div>
                  </div>

                  {/* Identity */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 bg-surface-container-low/70 p-4 rounded-2xl border border-surface-container">
                    <div className="flex items-start gap-3.5">
                      <div className="relative shrink-0">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-lg ring-4 ring-surface-container-lowest ${dossier.avatarCls}`}>{dossier.initials}</div>
                        <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-pastel-mint text-pastel-emerald-deep flex items-center justify-center text-[10px] font-bold border-2 border-surface-container-lowest">✓</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="text-lg font-bold text-on-surface">{dossier.name}</h2>
                          <span className="text-xs text-outline">{dossier.handle}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pastel-mint text-pastel-emerald-deep">Mutual Cohort</span>
                        </div>
                        <p className="text-xs text-on-surface-variant mt-1">{dossier.profile}</p>
                        <div className="flex items-center gap-2 text-[11px] mt-2.5 flex-wrap">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-medium">
                            <span className="material-symbols-outlined text-[14px] text-outline">calendar_today</span> {dossier.since}
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-fixed/40 text-on-primary-fixed-variant font-bold">
                            <span className="material-symbols-outlined text-[14px]">verified_user</span> {dossier.reliability}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Exposure matrix */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-on-surface flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-primary">query_stats</span> Bilateral Exposure Before Accepting
                      </span>
                      <span className="text-[11px] font-medium text-outline">Audit Snapshot</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-pastel-mint/30 rounded-2xl p-3.5 border border-emerald-200/80 flex flex-col justify-between gap-2">
                        <div className="flex items-center justify-between text-xs text-pastel-emerald-deep font-medium">
                          <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">receipt</span> Pending Group Tab</span>
                          <span className="font-bold text-[10px] uppercase bg-pastel-mint px-1.5 py-0.5 rounded-md">{dossier.group}</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-extrabold text-on-surface tracking-tight">{inr(dossier.tabAmount)}</span>
                          <span className="text-xs font-semibold text-primary">{dossier.isOwed ? "He owes you" : "You owe"}</span>
                        </div>
                        <div className="text-[11px] text-on-surface-variant">{dossier.tabDesc}</div>
                      </div>

                      <div className="bg-pastel-lavender/30 rounded-2xl p-3.5 border border-purple-200/80 flex flex-col justify-between gap-2">
                        <div className="flex items-center justify-between text-xs text-pastel-violet-deep font-medium">
                          <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">diversity_3</span> Verified Mutuals</span>
                          <span className="font-bold text-[10px] uppercase bg-pastel-lavender px-1.5 py-0.5 rounded-md">{dossier.mutuals.length} Endorsers</span>
                        </div>
                        {dossier.mutuals.length > 0 ? (
                          <div className="flex items-center -space-x-2 py-0.5">
                            {dossier.mutuals.map((m) => (
                              <div key={m.i} className={`w-7 h-7 rounded-xl font-bold text-[10px] flex items-center justify-center ring-2 ring-surface-container-lowest ${m.cls}`}>{m.i}</div>
                            ))}
                            <span className="pl-3 text-[11px] font-semibold text-on-surface">{dossier.mutualNames}</span>
                          </div>
                        ) : (
                          <div className="text-[11px] font-medium text-outline py-1">No verified mutuals — unverified source</div>
                        )}
                        <div className="text-[11px] text-outline">Co-signed under group charter</div>
                      </div>
                    </div>

                    <div className="bg-pastel-buttercup/40 rounded-2xl p-3.5 border border-yellow-200/60 flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-[18px] text-amber-800 shrink-0 mt-0.5">format_quote</span>
                      <p className="text-xs text-on-surface leading-relaxed">“{dossier.note}”</p>
                    </div>
                  </div>

                  {/* Simulated balance */}
                  <div className="bg-surface-container-low rounded-2xl p-4 border border-surface-container flex flex-col gap-3">
                    <div className="flex items-center justify-between text-xs flex-wrap gap-1">
                      <span className="font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-secondary">pie_chart</span> Simulated Balance Post-Acceptance
                      </span>
                      <span className="text-xs font-semibold text-primary">Instant Ledger Consolidate</span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-[11px] flex-wrap gap-1">
                        <span className="text-outline">Current Net Balance: <strong className="text-on-surface">{inr(CURRENT_NET)}</strong></span>
                        <span className="text-primary font-bold">New Net Balance: {inr(newNet)} (+ {inr(dossier.tabAmount)})</span>
                      </div>
                      <div className="w-full h-3 bg-surface-container-highest rounded-full overflow-hidden flex">
                        <div className="h-full bg-primary" style={{ width: `${100 - tabPct}%` }} />
                        <div className="h-full bg-primary-container animate-pulse" style={{ width: `${tabPct}%` }} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-outline flex-wrap gap-1">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary" /> Active Portfolio ({100 - tabPct}%)</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary-container" /> Consolidated Tab (+{tabPct}%)</span>
                      <span className="text-on-surface-variant font-medium">0 Settlement Fees</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 pt-2 border-t border-surface-container">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-outline">Bilateral Resolution Actions</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button className="px-4 py-3 rounded-2xl bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container transition-all font-semibold text-xs flex items-center justify-center gap-2 shadow-sm" type="button" onClick={() => resolve("link_group")}>
                        <span className="material-symbols-outlined text-[18px]">hub</span>
                        <span>Accept &amp; Link to {dossier.group === "Direct Public Link" ? "Group" : dossier.group}</span>
                      </button>
                      <button className="px-4 py-3 rounded-2xl bg-surface-container hover:bg-surface-container-high text-on-surface transition-all font-semibold text-xs flex items-center justify-center gap-2" type="button" onClick={() => resolve("one_on_one")}>
                        <span className="material-symbols-outlined text-[18px]">person_check</span>
                        <span>Accept as 1-on-1 Contact Only</span>
                      </button>
                    </div>
                    <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
                      <button className="px-3 py-2 rounded-xl text-outline hover:text-on-surface hover:bg-surface-container transition-colors text-xs font-medium flex items-center gap-1.5" type="button" onClick={() => resolve("decline")}>
                        <span className="material-symbols-outlined text-[16px]">close</span> Decline Request
                      </button>
                      <button className="px-3 py-2 rounded-xl text-tertiary hover:bg-tertiary-fixed/30 transition-colors text-xs font-medium flex items-center gap-1.5" type="button" onClick={() => resolve("spam")}>
                        <span className="material-symbols-outlined text-[16px]">flag</span> Report Suspicious / Spam
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* COLUMN 3 */}
              <aside className="lg:col-span-3 flex flex-col gap-4">
                {/* Beam pass */}
                <div className="bg-surface-container-lowest rounded-3xl p-5 border border-surface-container shadow-sm flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary text-[20px]">qr_code_2</span>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface">Your Live Beam Pass</h3>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                  </div>
                  <div className="bg-gradient-to-br from-pastel-blue via-pastel-lavender to-pastel-rose p-4 rounded-2xl border border-surface-container flex flex-col items-center text-center gap-3 relative overflow-hidden">
                    <div className="bg-surface-container-lowest p-3 rounded-2xl shadow-sm border border-surface-container">
                      <svg className="w-28 h-28 text-on-surface" fill="currentColor" viewBox="0 0 100 100">
                        <path d="M10 10h30v30h-30z M15 15v20h20v-20h-20z M20 20h10v10h-10z" />
                        <path d="M60 10h30v30h-30z M65 15v20h20v-20h-20z M70 20h10v10h-10z" />
                        <path d="M10 60h30v30h-30z M15 65v20h20v-20h-20z M20 70h10v10h-10z" />
                        <rect height="6" rx="1.5" width="6" x="45" y="12" />
                        <rect height="6" rx="1.5" width="6" x="45" y="24" />
                        <rect height="6" rx="1.5" width="6" x="12" y="46" />
                        <rect height="6" rx="1.5" width="6" x="24" y="46" />
                        <rect height="6" rx="1.5" width="6" x="36" y="46" />
                        <rect fill="#006c49" height="8" rx="2" width="8" x="48" y="46" />
                        <rect height="6" rx="1.5" width="6" x="62" y="46" />
                        <rect height="6" rx="1.5" width="6" x="74" y="46" />
                        <rect height="6" rx="1.5" width="6" x="86" y="46" />
                        <rect height="6" rx="1.5" width="6" x="48" y="62" />
                        <rect height="6" rx="1.5" width="6" x="62" y="62" />
                        <rect height="6" rx="1.5" width="6" x="74" y="62" />
                        <rect height="6" rx="1.5" width="6" x="86" y="62" />
                        <rect height="6" rx="1.5" width="6" x="48" y="74" />
                        <rect height="6" rx="1.5" width="6" x="62" y="74" />
                        <rect height="6" rx="1.5" width="6" x="74" y="74" />
                        <rect height="6" rx="1.5" width="6" x="86" y="74" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-on-surface">Alex Morgan</div>
                      <div className="text-[11px] font-mono text-on-surface-variant">tabsy.me/u/alexmorgan</div>
                    </div>
                    <div className="flex items-center gap-2 w-full pt-1">
                      <button className={`flex-1 py-2 px-3 rounded-xl font-semibold text-xs shadow-sm border border-surface-container flex items-center justify-center gap-1.5 transition-all ${copied ? "bg-primary-fixed text-on-primary-fixed-variant" : "bg-surface-container-lowest hover:bg-surface-bright text-on-surface"}`} type="button" onClick={copyBeam}>
                        <span className="material-symbols-outlined text-[16px] text-primary">{copied ? "check" : "content_copy"}</span>
                        <span>{copied ? "Copied!" : "Copy Link"}</span>
                      </button>
                      <button className="py-2 px-3 rounded-xl bg-surface-container-lowest hover:bg-surface-bright text-on-surface font-semibold text-xs shadow-sm border border-surface-container flex items-center justify-center gap-1 transition-all" type="button" onClick={() => showToast("NFC beacon active — hold phone near peer device", "contactless")}>
                        <span className="material-symbols-outlined text-[16px] text-secondary">contactless</span>
                        <span>Beam</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sent by you */}
                <div className="bg-surface-container-lowest rounded-3xl p-5 border border-surface-container shadow-sm flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-outline text-[20px]">schedule_send</span>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface">Sent by You</h3>
                    </div>
                    <span className="text-[11px] font-bold text-secondary bg-pastel-lavender px-2 py-0.5 rounded-full">2 Active</span>
                  </div>
                  {OUTGOING.map((o) => {
                    const done = !!outDone[o.id];
                    const revokedFlag = !!revoked[o.id];
                    return (
                      <div key={o.id} className={`bg-surface-container-low rounded-2xl p-3 flex flex-col gap-2.5 border border-surface-container min-w-0 ${revokedFlag ? "opacity-40" : ""}`}>
                        <div className="flex flex-col gap-1.5 min-w-0">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className={`w-9 h-9 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 ${o.avatarCls}`}>{o.initials}</div>
                            <div className="text-xs font-bold text-on-surface truncate flex-1 min-w-0">{o.name}</div>
                            {o.kind === "lock" ? (
                              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border border-surface-container bg-surface-container-lowest shrink-0" title="Reminder cooldown">
                                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
                                <span className="text-[10px] font-mono font-bold text-outline leading-none whitespace-nowrap">{o.badge}</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-surface-container bg-pastel-rose/60 text-pastel-rose-deep text-[10px] font-bold uppercase tracking-wider leading-none shrink-0">
                                <span className="material-symbols-outlined text-[12px]">mail</span> <span className="whitespace-nowrap">{o.badge}</span>
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-outline truncate">{o.sub}</span>
                        </div>
                        <div className="text-[11px] text-on-surface-variant flex items-center justify-between gap-2">
                          <span className="truncate">{o.sent}</span>
                          <span className={`shrink-0 ${o.statusCls}`}>{o.status}</span>
                        </div>
                        <div className="flex items-center gap-2 pt-1 border-t border-surface-container">
                          <button className={`flex-1 min-w-0 py-1.5 px-2 rounded-xl font-semibold text-[11px] flex items-center justify-center gap-1 transition-colors border border-surface-container ${done ? "bg-primary-fixed text-on-primary-fixed-variant" : "bg-surface-container-lowest hover:bg-surface-container text-on-surface"}`} type="button" onClick={() => doOutgoing(o)}>
                            <span className="material-symbols-outlined text-[14px] text-primary shrink-0">{done ? "check" : o.actionIcon}</span>
                            <span className="truncate">{done ? (o.action === "sms" ? "SMS Dispatched" : "Nudged!") : o.actionLabel}</span>
                          </button>
                          <button aria-label={`Revoke ${o.name}`} className="p-1.5 rounded-xl text-outline hover:text-tertiary hover:bg-tertiary-fixed/30 transition-colors" type="button" onClick={() => revoke(o)}>
                            <span className="material-symbols-outlined text-[16px]">cancel</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Fast batch invite */}
                <div className="bg-surface-container-lowest rounded-3xl p-5 border border-surface-container shadow-sm flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">person_add</span>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface">Fast Batch Invite</h3>
                  </div>
                  <p className="text-[11px] text-outline">Enter phone or email to invite someone directly into your split pool.</p>
                  <div className="flex items-center gap-2">
                    <input className="flex-1 min-w-0 px-3 py-2 rounded-2xl bg-surface-container-low border border-surface-container text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary" placeholder="e.g. dev@domain.com or +1 555..." type="text" value={fastInput} onChange={(e) => setFastInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); sendFast(); } }} />
                    <button className="px-3 py-2 rounded-2xl bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container text-xs font-bold transition-all shrink-0" type="button" onClick={sendFast}>Send</button>
                  </div>
                </div>
              </aside>
            </div>

            {/* Sticky batch clearance */}
            <div className="sticky bottom-4 z-40 bg-surface-container-lowest/95 backdrop-blur-md rounded-3xl p-4 md:px-6 border border-surface-container shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="w-10 h-10 rounded-2xl bg-pastel-mint flex items-center justify-center text-pastel-emerald-deep shrink-0">
                  <span className="material-symbols-outlined text-[22px]">auto_awesome</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-on-surface">Tactile Batch Clearance</span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-pastel-mint text-pastel-emerald-deep">Recommended</span>
                  </div>
                  <span className="text-xs text-on-surface-variant">Liam Vance and Jessica Miller share verified mutual circles with you.</span>
                </div>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end shrink-0">
                <button className="text-xs text-outline hover:text-on-surface transition-colors flex items-center gap-1.5 px-3 py-2" type="button" onClick={() => setModal(true)}>
                  <span className="material-symbols-outlined text-[16px]">tune</span>
                  <span>Studio Preferences</span>
                </button>
                <button className={`w-full sm:w-auto px-5 py-2.5 rounded-2xl font-semibold text-xs transition-all shadow-sm flex items-center justify-center gap-2 ${allCleared ? "bg-primary-container text-on-primary-container" : "bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container"}`} type="button" onClick={acceptAll}>
                  <span className="material-symbols-outlined text-[18px]">{allCleared ? "verified" : "done_all"}</span>
                  <span>{allCleared ? "All 2 Mutuals Cleared!" : "Accept All Verified Mutuals (2)"}</span>
                </button>
              </div>
            </div>
          </div>
        </main>

        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/30 backdrop-blur-sm" onClick={() => setModal(false)}>
            <div className="bg-surface-container-lowest rounded-3xl max-w-md w-full p-6 shadow-xl border border-surface-container flex flex-col gap-5" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-pastel-mint flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[20px]">tune</span>
                  </div>
                  <h3 className="text-base font-bold text-on-surface">Bilateral Triage Preferences</h3>
                </div>
                <button aria-label="Close" className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-outline" type="button" onClick={() => setModal(false)}>
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
              <div className="flex flex-col gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-surface-container-low flex flex-col gap-1">
                  <span className="font-bold text-on-surface">Auto-Consolidation Radius</span>
                  <span className="text-outline">Immediately merge expenses under {inr0(4150)} from mutual group peers into main balance</span>
                </div>
                <div className="p-3 rounded-2xl bg-surface-container-low flex flex-col gap-1">
                  <span className="font-bold text-on-surface">Bilateral Cryptographic Receipts</span>
                  <span className="text-outline">Generate double-entry ledger signatures for every accepted contact</span>
                </div>
              </div>
              <button className="w-full py-2.5 rounded-2xl bg-primary text-on-primary text-xs font-bold hover:bg-primary-container hover:text-on-primary-container transition-colors" type="button" onClick={() => { setModal(false); showToast("Matrix preferences saved", "check_circle"); }}>
                Save Changes
              </button>
            </div>
          </div>
        )}

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