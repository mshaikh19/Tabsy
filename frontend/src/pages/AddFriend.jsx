import { useMemo, useRef, useState } from "react";
import AppLayout from "../components/layout/AppLayout";

const METRICS = [
  { icon: "group", label: "Connected", value: "24 Peers", tint: "bg-primary-fixed text-on-primary-fixed-variant" },
  { icon: "mail", label: "Pending", value: "3 Invites", tint: "bg-secondary-fixed text-on-secondary-fixed-variant" },
  { icon: "contacts", label: "Matched", value: "18 Contacts", tint: "bg-surface-container-high text-on-surface-variant" },
  { icon: "bolt", label: "Velocity", value: "99.4%", tint: "bg-primary-fixed text-on-primary-fixed-variant", accent: true },
];

const RESULTS = [
  {
    id: "chloe",
    name: "Chloe Bennett",
    handle: "@chloeb",
    initials: "CB",
    avatarCls: "bg-primary-fixed text-on-primary-fixed",
    tag: "Loftmate",
    tagCls: "bg-secondary-fixed text-on-secondary-fixed-variant",
    subIcon: "diversity_1",
    sub: "2 mutual friends (Alex Morgan, Sarah Lin)",
    subTail: "Brooklyn Loft",
    action: "add",
    kind: "mutual",
  },
  {
    id: "david",
    name: "David Zhang",
    handle: "@davidz",
    initials: "DZ",
    avatarCls: "bg-secondary-fixed text-on-secondary-fixed",
    tag: "99% Trust",
    tagCls: "bg-surface-container text-primary",
    tagIcon: "verified_user",
    sub: "Shared: Tahoe Ski Weekend ❄️",
    subTail: "4 settled tabs",
    action: "add",
    kind: "mutual",
  },
  {
    id: "maya",
    name: "Maya Patel",
    handle: "@mayap",
    initials: "MP",
    avatarCls: "bg-tertiary-fixed text-on-tertiary-fixed",
    subIcon: "phone_iphone",
    subIconCls: "text-secondary",
    sub: "Synced from Apple Contacts",
    subTail: "(415) •••-9182",
    action: "sms",
    kind: "contact",
  },
  {
    id: "liam",
    name: "Liam Vance",
    handle: "@liamv",
    initials: "LV",
    avatarCls: "bg-surface-dim text-on-surface",
    dot: true,
    sub: "Already participant in ",
    subBold: "Brooklyn Loft",
    subAfter: " group",
    action: "connect",
    kind: "group",
  },
];

const CONTACTS = [
  { id: "sami", name: "Sami O'Connor", contact: "sami.oc@gmail.com", initials: "SO", avatarCls: "bg-primary-fixed text-on-primary-fixed" },
  { id: "nina", name: "Nina Takahashi", contact: "nina.tak@design.co", initials: "NT", avatarCls: "bg-secondary-fixed text-on-secondary-fixed" },
  { id: "kofi", name: "Kofi Boateng", contact: "kofi@apex.vc", initials: "KB", avatarCls: "bg-tertiary-fixed text-on-tertiary-fixed" },
  { id: "elena", name: "Elena Ramos", contact: "+1 415 882 1099", initials: "ER", avatarCls: "bg-surface-dim text-on-surface" },
];

const MAY = [
  { id: "marcus", name: "Marcus Lee", sub: "Tahoe Ski Weekend • 4 splits", initials: "ML", avatarCls: "bg-secondary-fixed text-on-secondary-fixed" },
  { id: "elenaR", name: "Elena Rostova", sub: "Barcelona Tapas • 2 mutuals", initials: "ER", avatarCls: "bg-tertiary-fixed text-on-tertiary-fixed" },
  { id: "julian", name: "Julian Diaz", sub: "Joshua Tree Cabin", initials: "JD", avatarCls: "bg-primary-fixed text-on-primary-fixed" },
  { id: "priya", name: "Priya Sharma", sub: "Apt 4B Groceries • 5 mutuals", initials: "PS", avatarCls: "bg-surface-dim text-on-surface" },
];

const CHANNELS = [
  { id: "sync", label: "Address Sync", icon: "sync" },
  { id: "batch", label: "Batch Roster", icon: "forward_to_inbox" },
  { id: "beam", label: "Nearby Beam", icon: "sensors" },
];

const PASS_LINK = "tabsy.me/u/alexmorgan";

export default function AddFriend() {
  const [query, setQuery] = useState("@alex");
  const [filter, setFilter] = useState("all");
  const [requested, setRequested] = useState({});
  const [channel, setChannel] = useState("sync");
  const [syncOn, setSyncOn] = useState(true);
  const [tokens, setTokens] = useState(["roommates@gmail.com", "sammy@work.com", "tahoe.trip@voyage.io"]);
  const [tokenInput, setTokenInput] = useState("");
  const [addedContacts, setAddedContacts] = useState({});
  const [connectedMay, setConnectedMay] = useState({});
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);
  const copyTimer = useRef(null);

  function showToast(message, icon = "check_circle") {
    setToast({ message, icon });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return RESULTS.filter((r) => {
      if (filter === "handles" && !r.handle) return false;
      if (filter === "mutuals" && r.kind !== "mutual") return false;
      if (!q) return true;
      return `${r.name} ${r.handle} ${r.sub} ${r.subTail || ""}`.toLowerCase().includes(q);
    });
  }, [query, filter]);

  function requestResult(r) {
    if (requested[r.id]) return;
    setRequested((p) => ({ ...p, [r.id]: true }));
    const verb = r.action === "sms" ? "Invite sent via SMS" : r.action === "connect" ? "Direct connect established" : "Friend request sent";
    showToast(`${verb} · ${r.name}`, r.action === "connect" ? "bolt" : "person_add");
  }

  function addContact(c) {
    if (addedContacts[c.id]) return;
    setAddedContacts((p) => ({ ...p, [c.id]: true }));
    showToast(`Invite sent to ${c.name}`, "person_add");
  }

  function connectMay(m) {
    if (connectedMay[m.id]) return;
    setConnectedMay((p) => ({ ...p, [m.id]: true }));
    showToast(`Connected with ${m.name}`, "check_circle");
  }

  function addToken() {
    const val = tokenInput.trim();
    if (!val) return;
    setTokens((t) => [...t, val]);
    setTokenInput("");
  }

  function removeToken(i) {
    setTokens((t) => t.filter((_, idx) => idx !== i));
  }

  function copyPass() {
    if (navigator.clipboard) navigator.clipboard.writeText(`https://${PASS_LINK}`).catch(() => {});
    setCopied(true);
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 2000);
    showToast("Pass link copied to clipboard", "content_copy");
  }

  return (
    <AppLayout>
      <div className="bg-[#f7f6fd] font-body-md text-body-md text-on-surface antialiased">
        <main className="w-full min-h-screen pb-12">
          <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-6">
            {/* Header */}
            <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-3xl shadow-sm relative">
              <div className="flex items-center flex-wrap gap-2 text-on-surface-variant font-label-caps text-[11px] uppercase tracking-wider">
                <span className="hover:text-primary transition-colors cursor-pointer inline-flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">home</span> Home
                </span>
                <span className="text-outline-variant">/</span>
                <span className="hover:text-primary transition-colors cursor-pointer">Friends Management</span>
                <span className="text-outline-variant">/</span>
                <span className="font-bold text-on-surface">Add &amp; Connect Peers</span>
              </div>

              <div className="mt-3 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                <div className="flex flex-col gap-1 max-w-2xl">
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container text-primary font-label-caps text-[11px] uppercase tracking-wider font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" />
                      Instant Bilateral Netting v2.4
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-low text-secondary font-label-caps text-[11px] uppercase">
                      <span className="material-symbols-outlined text-[12px]">verified</span> Zero-Fee Clearing
                    </span>
                  </div>
                  <h1 className="font-headline-lg text-2xl lg:text-3xl text-on-surface tracking-tight">Add &amp; Discover Friends</h1>
                  <p className="text-sm text-outline">
                    Discover peers by handle, email, contact sync, or share your personalized Tabsy Pass to instantly start splitting bills without awkward reminders.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2.5 w-full lg:w-[26rem] lg:shrink-0">
                  {METRICS.map((m) => (
                    <div key={m.label} className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl border shadow-sm ${m.accent ? "bg-primary-fixed/30 border-primary-container/20" : "bg-surface-container-lowest border-surface-container"}`}>
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${m.tint}`}>
                        <span className="material-symbols-outlined text-[19px]">{m.icon}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-label-caps text-[10px] uppercase tracking-wider leading-tight text-outline">{m.label}</p>
                        <p className={`font-numeric-balance-md text-[15px] font-bold leading-tight whitespace-nowrap ${m.accent ? "text-primary" : "text-on-surface"}`}>{m.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Split rail */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* LEFT */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                {/* Search omnibox */}
                <section className="bg-surface-container-lowest rounded-3xl p-4 sm:p-5 shadow-sm">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
                    <div className="relative flex-1">
                      <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px] pointer-events-none">search</span>
                      <input
                        className="w-full pl-10 pr-10 py-2.5 bg-surface-container-low text-on-surface rounded-xl font-body-md text-body-md border border-transparent focus:border-outline-variant focus:bg-surface-container-lowest focus:outline-none transition-all"
                        placeholder="Search by @handle, legal name, email, or phone..."
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                      />
                      {query && (
                        <button aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface flex items-center justify-center" type="button" onClick={() => setQuery("")}>
                          <span className="material-symbols-outlined text-[16px]">cancel</span>
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl shrink-0">
                      {[
                        { id: "all", label: "All Matches" },
                        { id: "handles", label: "Handles" },
                        { id: "mutuals", label: "Mutuals" },
                      ].map((f) => (
                        <button
                          key={f.id}
                          className={`px-3 py-1.5 rounded-lg text-[12px] transition-colors ${filter === f.id ? "bg-surface-container-lowest text-on-surface font-semibold shadow-sm" : "text-outline hover:text-on-surface font-medium"}`}
                          type="button"
                          onClick={() => setFilter(f.id)}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-1 mb-2">
                    <span className="font-label-caps text-[11px] uppercase tracking-wider text-outline">Search Results ({filtered.length} matches)</span>
                    <span className="font-label-caps text-[11px] text-primary font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-container" /> Live Directory Linked
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    {filtered.length === 0 && (
                      <div className="text-center py-8 text-outline text-sm">No peers match “{query}”.</div>
                    )}
                    {filtered.map((r) => {
                      const done = !!requested[r.id];
                      return (
                        <div key={r.id} className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-surface-container-low/70 hover:bg-surface-container-low transition-all">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="relative shrink-0">
                              <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${r.avatarCls}`}>{r.initials}</div>
                              {r.dot && <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-primary-container ring-2 ring-surface-container-lowest" />}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-title-md text-title-md font-bold text-on-surface truncate">{r.name}</p>
                                <span className="font-body-sm text-body-sm text-outline truncate">{r.handle}</span>
                                {r.tag && (
                                  <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${r.tagCls}`}>
                                    {r.tagIcon && <span className="material-symbols-outlined text-[11px]">{r.tagIcon}</span>}
                                    {r.tag}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 font-body-sm text-body-sm text-outline mt-0.5 flex-wrap">
                                <span className="flex items-center gap-0.5 min-w-0">
                                  {r.subIcon && <span className={`material-symbols-outlined text-[14px] ${r.subIconCls || "text-primary"}`}>{r.subIcon}</span>}
                                  <span className="truncate">
                                    {r.sub}
                                    {r.subBold && <span className="font-semibold text-on-surface">{r.subBold}</span>}
                                    {r.subAfter}
                                  </span>
                                </span>
                                {r.subTail && (
                                  <>
                                    <span>•</span>
                                    <span className="truncate text-on-surface-variant font-medium">{r.subTail}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="shrink-0 pl-1">
                            <button
                              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-body-sm text-[13px] font-semibold transition-all shadow-sm ${
                                done
                                  ? "bg-surface-container-highest text-on-surface-variant"
                                  : r.action === "sms"
                                    ? "bg-secondary text-on-secondary hover:bg-secondary-container"
                                    : r.action === "connect"
                                      ? "bg-surface-container-lowest text-on-surface hover:bg-surface-container-high"
                                      : "bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary"
                              }`}
                              type="button"
                              onClick={() => requestResult(r)}
                            >
                              <span className="material-symbols-outlined text-[16px]">
                                {done ? "check" : r.action === "sms" ? "sms" : r.action === "connect" ? "bolt" : "person_add"}
                              </span>
                              <span>{done ? (r.action === "sms" ? "Sent" : r.action === "connect" ? "Connected" : "Requested") : r.action === "sms" ? "Invite via SMS" : r.action === "connect" ? "Direct Connect" : "Add Friend"}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* Invitation channels */}
                <section className="bg-surface-container-lowest rounded-3xl p-4 sm:p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-3 flex-wrap pb-4">
                    <div>
                      <span className="font-label-caps text-[11px] text-outline uppercase tracking-wider">Multi-Channel Ingress</span>
                      <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">Invitation Channels</h2>
                    </div>
                    <div className="flex items-center bg-surface-container-low p-1 rounded-xl">
                      {CHANNELS.map((c) => (
                        <button
                          key={c.id}
                          className={`px-3 py-1.5 rounded-lg text-[12px] transition-all flex items-center gap-1.5 ${channel === c.id ? "bg-surface-container-lowest text-primary shadow-sm font-semibold" : "text-outline hover:text-on-surface font-medium"}`}
                          type="button"
                          onClick={() => setChannel(c.id)}
                        >
                          <span className="material-symbols-outlined text-[16px]">{c.icon}</span>
                          <span>{c.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {channel === "sync" && (
                    <div className="flex flex-col gap-4">
                      <div className="p-4 rounded-2xl bg-surface-container-low flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-surface-container-lowest flex items-center justify-center text-primary shadow-sm">
                            <span className="material-symbols-outlined text-[26px]">cloud_sync</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-title-md text-title-md font-bold text-on-surface">iCloud &amp; Google Contacts Connected</p>
                              <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${syncOn ? "bg-primary-fixed/40 text-on-primary-fixed-variant" : "bg-surface-container-high text-on-surface-variant"}`}>
                                {syncOn ? "Auto-Sync ON" : "Auto-Sync OFF"}
                              </span>
                            </div>
                            <p className="font-body-sm text-body-sm text-outline">Last refreshed 12 minutes ago • 32 contacts active on Tabsy</p>
                          </div>
                        </div>
                        <button
                          aria-label="Toggle contact auto-sync"
                          className={`w-12 h-6 rounded-full p-0.5 flex items-center transition-all shadow-inner shrink-0 ${syncOn ? "bg-primary-container justify-end" : "bg-surface-container-highest justify-start"}`}
                          type="button"
                          onClick={() => setSyncOn((v) => !v)}
                        >
                          <div className="w-5 h-5 rounded-full bg-surface-container-lowest shadow-sm" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {CONTACTS.map((c) => {
                          const added = !!addedContacts[c.id];
                          return (
                            <div key={c.id} className="p-3.5 rounded-2xl bg-surface-container-low/60 hover:bg-surface-container-low transition-all flex items-center justify-between gap-2">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-[13px] shrink-0 ${c.avatarCls}`}>{c.initials}</div>
                                <div className="min-w-0">
                                  <p className="font-body-md text-body-md font-bold text-on-surface truncate">{c.name}</p>
                                  <p className="font-body-sm text-body-sm text-outline truncate">{c.contact}</p>
                                </div>
                              </div>
                              <button
                                aria-label={`Add ${c.name}`}
                                className={`shrink-0 p-2 rounded-xl transition-all shadow-sm ${added ? "bg-primary-fixed text-on-primary-fixed-variant" : "bg-surface-container-lowest text-primary hover:bg-primary-container hover:text-on-primary-container"}`}
                                type="button"
                                onClick={() => addContact(c)}
                              >
                                <span className="material-symbols-outlined text-[18px]">{added ? "check" : "add"}</span>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
                        <p className="font-body-sm text-body-sm text-outline">Showing 4 of 18 auto-matched contacts from your linked devices.</p>
                        <button className="font-body-sm text-[13px] font-semibold text-secondary hover:text-secondary-container transition-colors flex items-center gap-1" type="button" onClick={() => showToast("Opened all 18 matched contacts", "contacts")}>
                          View all 18 matches <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {channel === "batch" && (
                    <div className="flex flex-col gap-4">
                      <div>
                        <label className="block font-label-caps text-[11px] uppercase tracking-wider text-outline mb-1.5">Emails or Phone Numbers</label>
                        <div className="p-2.5 rounded-2xl bg-surface-container-low flex flex-wrap gap-2 items-center min-h-[56px]">
                          {tokens.map((t, i) => (
                            <span key={`${t}-${i}`} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container-lowest text-on-surface font-body-sm text-[13px] shadow-sm">
                              <span className="material-symbols-outlined text-[14px] text-primary">mail</span>
                              {t}
                              <button aria-label={`Remove ${t}`} className="text-outline hover:text-error ml-1 leading-none" type="button" onClick={() => removeToken(i)}>×</button>
                            </span>
                          ))}
                          <input
                            className="bg-transparent text-[13px] font-body-md text-on-surface placeholder:text-outline focus:outline-none flex-1 min-w-[140px] px-1"
                            placeholder="Type next email & press Enter..."
                            type="text"
                            value={tokenInput}
                            onChange={(e) => setTokenInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addToken();
                              }
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="font-label-caps text-[11px] uppercase tracking-wider text-outline">Custom Welcome Memo</label>
                          <span className="font-body-sm text-body-sm text-outline">Included with invite</span>
                        </div>
                        <textarea
                          className="w-full p-3 rounded-2xl bg-surface-container-low text-on-surface font-body-md text-body-md border border-transparent focus:border-outline-variant focus:bg-surface-container-lowest focus:outline-none transition-all"
                          rows="2"
                          defaultValue="Hey! Join me on Tabsy to settle our shared cabin & dinner tabs in one tap without awkward math."
                        />
                      </div>
                      <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-primary-container" />
                          <span className="font-body-sm text-body-sm text-outline">Direct ledger link included</span>
                        </div>
                        <button className="px-5 py-2.5 rounded-xl bg-primary-container text-on-primary-container font-bold text-sm hover:bg-primary hover:text-on-primary transition-all shadow-sm flex items-center gap-2" type="button" onClick={() => showToast(`${tokens.length} invitations dispatched`, "send")}>
                          <span>Send {tokens.length} {tokens.length === 1 ? "Invitation" : "Invitations"}</span>
                          <span className="material-symbols-outlined text-[18px]">send</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {channel === "beam" && (
                    <div className="flex flex-col items-center justify-center p-8 bg-surface-container-low rounded-2xl text-center">
                      <div className="relative w-20 h-20 mb-4 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full bg-primary-fixed/40 animate-ping" />
                        <div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container shadow-md relative z-10">
                          <span className="material-symbols-outlined text-[32px]">sensors</span>
                        </div>
                      </div>
                      <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Tabsy Peer Beam Active</h3>
                      <p className="font-body-md text-body-md text-outline max-w-sm mt-1 mb-4">
                        Hold two phones together or stay on the same Wi-Fi network to detect nearby group members within 5 meters.
                      </p>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-lowest font-label-caps text-[11px] text-primary font-semibold">
                        <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
                        Broadcasting BLE Token: #TBS-9942
                      </div>
                    </div>
                  )}
                </section>
              </div>

              {/* RIGHT */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                {/* Tabsy Pass studio */}
                <section className="bg-surface-container-lowest rounded-3xl p-4 sm:p-5 shadow-md relative overflow-hidden">
                  <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-secondary-fixed/50 blur-xl pointer-events-none" />
                  <div className="flex items-center justify-between mb-4 relative">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center">
                        <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
                      </span>
                      <div>
                        <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface leading-tight">My Tabsy Pass</h3>
                        <p className="font-body-sm text-body-sm text-outline">Permanent Peer Ingress Card</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed/40 text-on-primary-fixed-variant font-label-caps text-[11px] font-bold">LIVE</span>
                  </div>

                  <div className="w-full bg-gradient-to-br from-surface-container-low via-surface-container-lowest to-surface-container rounded-2xl p-5 shadow-sm relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm shadow-sm">AM</div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="font-title-md text-title-md font-bold text-on-surface">Alex Morgan</p>
                            <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                          </div>
                          <p className="font-body-sm text-body-sm text-outline">{PASS_LINK}</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 rounded-lg bg-surface-container-lowest text-primary font-bold text-[11px] shadow-sm">Zero Fees</span>
                    </div>

                    <div className="bg-surface-container-lowest rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm">
                      <div className="relative w-44 h-44 flex items-center justify-center">
                        <svg className="w-40 h-40" fill="none" viewBox="0 0 160 160">
                          <rect fill="#131b2e" height="44" rx="8" width="44" x="0" y="0" />
                          <rect fill="#ffffff" height="28" rx="4" width="28" x="8" y="8" />
                          <rect fill="#006c49" height="12" rx="2" width="12" x="16" y="16" />
                          <rect fill="#131b2e" height="44" rx="8" width="44" x="116" y="0" />
                          <rect fill="#ffffff" height="28" rx="4" width="28" x="124" y="8" />
                          <rect fill="#006c49" height="12" rx="2" width="12" x="132" y="16" />
                          <rect fill="#131b2e" height="44" rx="8" width="44" x="0" y="116" />
                          <rect fill="#ffffff" height="28" rx="4" width="28" x="8" y="124" />
                          <rect fill="#006c49" height="12" rx="2" width="12" x="16" y="132" />
                          <circle fill="#131b2e" cx="60" cy="16" r="4" />
                          <circle fill="#10b981" cx="76" cy="16" r="4" />
                          <circle fill="#131b2e" cx="92" cy="16" r="4" />
                          <circle fill="#4648d4" cx="60" cy="32" r="4" />
                          <circle fill="#131b2e" cx="76" cy="32" r="4" />
                          <circle fill="#4648d4" cx="92" cy="32" r="4" />
                          <circle fill="#131b2e" cx="16" cy="60" r="4" />
                          <circle fill="#10b981" cx="32" cy="60" r="4" />
                          <circle fill="#131b2e" cx="60" cy="60" r="4" />
                          <circle fill="#131b2e" cx="100" cy="60" r="4" />
                          <circle fill="#10b981" cx="124" cy="60" r="4" />
                          <circle fill="#131b2e" cx="140" cy="60" r="4" />
                          <circle fill="#10b981" cx="16" cy="76" r="4" />
                          <circle fill="#131b2e" cx="32" cy="76" r="4" />
                          <circle fill="#4648d4" cx="124" cy="76" r="4" />
                          <circle fill="#131b2e" cx="140" cy="76" r="4" />
                          <circle fill="#131b2e" cx="16" cy="92" r="4" />
                          <circle fill="#4648d4" cx="32" cy="92" r="4" />
                          <circle fill="#131b2e" cx="60" cy="92" r="4" />
                          <circle fill="#006c49" cx="100" cy="92" r="4" />
                          <circle fill="#131b2e" cx="124" cy="92" r="4" />
                          <circle fill="#4648d4" cx="140" cy="92" r="4" />
                          <circle fill="#10b981" cx="60" cy="124" r="4" />
                          <circle fill="#131b2e" cx="76" cy="124" r="4" />
                          <circle fill="#006c49" cx="92" cy="124" r="4" />
                          <circle fill="#131b2e" cx="60" cy="140" r="4" />
                          <circle fill="#4648d4" cx="76" cy="140" r="4" />
                          <circle fill="#131b2e" cx="92" cy="140" r="4" />
                          <circle fill="#10b981" cx="108" cy="140" r="4" />
                          <circle fill="#131b2e" cx="132" cy="140" r="4" />
                        </svg>
                        <div className="absolute w-10 h-10 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center shadow-md">
                          <span className="material-symbols-outlined text-[20px]">payments</span>
                        </div>
                      </div>
                      <p className="font-body-sm text-body-sm text-outline mt-2 font-medium">Scan with camera to open live split card</p>
                    </div>

                    <div className="mt-4 flex items-center justify-between bg-surface-container-lowest p-2 rounded-xl shadow-sm">
                      <div className="flex items-center gap-2 pl-2 min-w-0">
                        <span className="material-symbols-outlined text-outline text-[16px]">link</span>
                        <span className="font-numeric-balance-md text-[13px] text-on-surface font-semibold truncate">{PASS_LINK}</span>
                      </div>
                      <button className={`px-3 py-1.5 rounded-lg font-body-sm text-[13px] font-bold transition-all flex items-center gap-1 shrink-0 ${copied ? "bg-primary-fixed text-on-primary-fixed-variant" : "bg-surface-container-low text-primary hover:bg-surface-container"}`} type="button" onClick={copyPass}>
                        <span className="material-symbols-outlined text-[14px]">{copied ? "check" : "content_copy"}</span>
                        <span>{copied ? "Copied!" : "Copy"}</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <button className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-surface-container-low text-on-surface font-body-sm text-[13px] font-semibold hover:bg-surface-container transition-all" type="button" onClick={() => showToast("Shared pass via WhatsApp", "chat")}>
                      <span className="material-symbols-outlined text-[18px] text-primary">chat</span>
                      <span>WhatsApp Share</span>
                    </button>
                    <button className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-surface-container-low text-on-surface font-body-sm text-[13px] font-semibold hover:bg-surface-container transition-all" type="button" onClick={() => showToast("Pass saved to wallet", "wallet")}>
                      <span className="material-symbols-outlined text-[18px] text-secondary">wallet</span>
                      <span>Save Pass</span>
                    </button>
                  </div>
                </section>

                {/* People you may know */}
                <section className="bg-surface-container-lowest rounded-3xl p-4 sm:p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="font-label-caps text-[11px] text-outline uppercase tracking-wider">Algorithmic Affinity</span>
                      <h3 className="font-title-md text-title-md font-bold text-on-surface">People You May Know</h3>
                    </div>
                    <span className="font-label-caps text-[11px] text-secondary font-bold">4 Mutuals</span>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {MAY.map((m) => {
                      const done = !!connectedMay[m.id];
                      return (
                        <div key={m.id} className="flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-surface-container-low/50 hover:bg-surface-container-low transition-colors">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-bold shrink-0 ${m.avatarCls}`}>{m.initials}</div>
                            <div className="min-w-0">
                              <p className="font-body-md text-body-md font-bold text-on-surface truncate">{m.name}</p>
                              <p className="font-body-sm text-body-sm text-outline truncate">{m.sub}</p>
                            </div>
                          </div>
                          <button
                            className={`px-3 py-1.5 rounded-lg font-body-sm text-[13px] font-bold transition-all shadow-sm shrink-0 ${done ? "bg-surface-container text-outline" : "bg-surface-container-lowest text-primary hover:bg-primary-container hover:text-on-primary-container"}`}
                            type="button"
                            onClick={() => connectMay(m)}
                          >
                            {done ? "Connected" : "Connect"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* Trust seal */}
                <div className="p-3.5 rounded-2xl bg-primary-fixed/20 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">verified_user</span>
                  </span>
                  <div>
                    <p className="font-body-sm text-body-sm font-bold text-on-surface">Zero-Awkwardness Guarantee</p>
                    <p className="font-body-sm text-body-sm text-outline">Friends don't need a Tabsy account to view or pay their initial shared tab.</p>
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