import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";

const TOTAL_EXPENSE = 99600;
const RING_RADIUS = 62;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const inr = (n) => `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const INITIAL_ROSTER = [
  {
    id: "alex",
    initials: "AM",
    name: "Alex Morgan",
    suffix: "(Host / You)",
    badge: "Payer & Host",
    badgeClass: "bg-primary-fixed/60 text-on-primary-fixed-variant",
    avatarClass: "bg-primary-fixed/40 text-on-primary-fixed-variant border-primary-fixed",
    chipIcon: "king_bed",
    chipIconClass: "text-primary",
    chip: "Master Bedroom (En-suite)",
    note: "Tahoe Mountain Club Member",
    role: "skiers",
    room: "Master Bedroom",
    weight: 1.0,
    included: true,
    locked: true,
  },
  {
    id: "marco",
    initials: "MR",
    name: "Marco Rossi",
    suffix: "",
    badge: "Skier",
    badgeClass: "bg-secondary-fixed/50 text-on-secondary-fixed",
    avatarClass: "bg-secondary-fixed/60 text-on-secondary-fixed border-secondary-fixed",
    chipIcon: "single_bed",
    chipIconClass: "text-secondary",
    chip: "Loft Bunk 1 assigned",
    note: "Friday Night Carpool",
    role: "skiers",
    room: "Loft Bunk 1",
    weight: 1.0,
    included: true,
    locked: false,
  },
  {
    id: "sarah",
    initials: "SL",
    name: "Sarah Lin",
    suffix: "",
    badge: "Skier",
    badgeClass: "bg-secondary-fixed/50 text-on-secondary-fixed",
    avatarClass: "bg-tertiary-fixed/60 text-tertiary border-tertiary-fixed",
    chipIcon: "bedroom_parent",
    chipIconClass: "text-tertiary",
    chip: "Lower Queen Suite",
    note: "Lift Pass Coordinator",
    role: "skiers",
    room: "Lower Queen Suite",
    weight: 1.0,
    included: true,
    locked: false,
  },
  {
    id: "kim",
    initials: "KS",
    name: "Kim Sato",
    suffix: "",
    badge: "Skier",
    badgeClass: "bg-secondary-fixed/50 text-on-secondary-fixed",
    avatarClass: "bg-primary-fixed-dim/50 text-on-primary-fixed border-primary-fixed-dim",
    chipIcon: "single_bed",
    chipIconClass: "text-primary",
    chip: "Loft Bunk 2 assigned",
    note: "Grocery Lead",
    role: "skiers",
    room: "Loft Bunk 2",
    weight: 1.0,
    included: true,
    locked: false,
  },
  {
    id: "jason",
    initials: "JP",
    name: "Jason Powell",
    suffix: "",
    badge: "Skier",
    badgeClass: "bg-secondary-fixed/50 text-on-secondary-fixed",
    avatarClass: "bg-secondary-fixed-dim/60 text-secondary border-secondary-fixed-dim",
    chipIcon: "bedroom_parent",
    chipIconClass: "text-secondary",
    chip: "Lower Queen Suite",
    note: "Snowboard Equipment Trailer",
    role: "skiers",
    room: "Lower Queen Suite",
    weight: 1.0,
    included: true,
    locked: false,
  },
  {
    id: "taylor",
    initials: "TE",
    name: "Taylor Evans",
    suffix: "",
    badge: "Lodge Spectator",
    badgeClass: "bg-surface-container-high text-outline",
    avatarClass: "bg-surface-container-high text-outline border-outline-variant/40",
    chipIcon: "do_not_disturb_on",
    chipIconClass: "text-tertiary",
    chip: "Opted out: Joined trip 2 days later, arranged separate yurt accommodation",
    note: "",
    role: "lodge",
    room: "Opted Out",
    weight: 0,
    included: false,
    locked: false,
  },
];

const MODES = [
  { id: "equal", label: "Equal (1×)", icon: "equalizer" },
  { id: "weights", label: "Custom Weights", icon: "tune" },
  { id: "rooms", label: "Itemized Rooms", icon: "bed" },
  { id: "percentage", label: "Percentage Split", icon: "percent" },
];

const PRESETS = [
  { id: "all", label: "All Members", emoji: "" },
  { id: "skiers", label: "Skiers (5)", emoji: "🎿" },
  { id: "lodge", label: "Lodge Only (1)", emoji: "🏡" },
];

const AVATAR_PALETTE = [
  "bg-primary-fixed/40 text-on-primary-fixed-variant border-primary-fixed",
  "bg-secondary-fixed/60 text-on-secondary-fixed border-secondary-fixed",
  "bg-tertiary-fixed/60 text-tertiary border-tertiary-fixed",
  "bg-primary-fixed-dim/50 text-on-primary-fixed border-primary-fixed-dim",
  "bg-secondary-fixed-dim/60 text-secondary border-secondary-fixed-dim",
  "bg-tertiary-fixed-dim/60 text-tertiary border-tertiary-fixed-dim",
];

const ARC_COLORS = ["#006c49", "#4648d4", "#bc0b3b", "#4edea3", "#6063ee", "#ff7886", "#ffb2b7", "#c0c1ff"];

export default function ManageParticipants() {
  const [roster, setRoster] = useState(INITIAL_ROSTER);
  const [mode, setMode] = useState("equal");
  const [preset, setPreset] = useState("all");
  const [search, setSearch] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestContact, setGuestContact] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState(null);
  const guestIdRef = useRef(0);

  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(null), 2800);
  }

  const activeRoster = useMemo(() => roster.filter((m) => m.included), [roster]);
  const excludedCount = roster.length - activeRoster.length;

  const computed = useMemo(() => {
    const totalWeight = activeRoster.reduce((sum, m) => sum + (m.weight > 0 ? m.weight : 0), 0);
    const effectiveWeight = totalWeight > 0 ? totalWeight : 1;
    const dashList = roster.map((m) => {
      const isActive = m.included;
      const w = isActive ? (m.weight > 0 ? m.weight : 0) : 0;
      const pct = isActive ? w / effectiveWeight : 0;
      const amount = pct * TOTAL_EXPENSE;
      return { isActive, pct, amount, dash: pct * RING_CIRCUMFERENCE };
    });
    const rows = roster.map((m, i) => {
      let runningOffset = 0;
      for (let j = 0; j < i; j += 1) {
        if (dashList[j].isActive && dashList[j].dash > 0) runningOffset += dashList[j].dash;
      }
      const color = ARC_COLORS[i % ARC_COLORS.length];
      return { ...m, ...dashList[i], offset: runningOffset, color };
    });
    const perPersonRate = activeRoster.length > 0 ? TOTAL_EXPENSE / activeRoster.length : 0;
    return { rows, totalWeight: effectiveWeight, perPersonRate };
  }, [roster, activeRoster]);

  const visibleRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return computed.rows.filter((r) => {
      const matchesPreset =
        preset === "all" ? true : preset === "skiers" ? r.role === "skiers" : preset === "lodge" ? r.role === "lodge" : true;
      const matchesSearch = q.length === 0 || r.name.toLowerCase().includes(q);
      return matchesPreset && matchesSearch;
    });
  }, [computed.rows, preset, search]);

  const activeCount = activeRoster.length;
  const allRate = roster.length > 0 ? TOTAL_EXPENSE / roster.length : 0;
  const fourRate = TOTAL_EXPENSE / 4;

  function setIncluded(id, include) {
    setRoster((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        if (include) {
          return { ...m, included: true, weight: m.weight > 0 ? m.weight : 1.0 };
        }
        return { ...m, included: false };
      })
    );
  }

  function stepWeight(m, delta) {
    const next = Math.max(0.5, Math.min(4.0, (m.weight || 1) + delta));
    setRoster((prev) => prev.map((x) => (x.id === m.id ? { ...x, weight: Number(next.toFixed(1)), included: true } : x)));
  }

  function toggleLock(id) {
    setRoster((prev) => prev.map((m) => (m.id === id ? { ...m, locked: !m.locked } : m)));
  }

  function selectAll() {
    setRoster((prev) => prev.map((m) => ({ ...m, included: true, weight: m.weight > 0 ? m.weight : 1.0 })));
    showToast("All members included in split");
  }

  function deselectAll() {
    setRoster((prev) => prev.map((m) => (m.id === "alex" ? m : { ...m, included: false })));
    showToast("Deselected all — Alex kept as host anchor");
  }

  function selectPreset(id) {
    setPreset(id);
    if (id === "all" || id === "lodge") return;
    if (id === "skiers") {
      setRoster((prev) => prev.map((m) => (m.role === "skiers" ? { ...m, included: true, weight: m.weight > 0 ? m.weight : 1.0 } : m)));
    }
  }

  function applyMode(id) {
    setMode(id);
    if (id === "equal") {
      setRoster((prev) => prev.map((m) => (m.included ? { ...m, weight: 1.0 } : m)));
    } else if (id === "rooms") {
      setRoster((prev) =>
        prev.map((m) => {
          if (!m.included) return m;
          let w = 1.0;
          if (m.room.includes("Master")) w = 1.4;
          else if (m.room.includes("Bunk")) w = 0.8;
          return { ...m, weight: Number(w.toFixed(1)) };
        })
      );
    } else if (id === "percentage") {
      const n = activeRoster.length || 1;
      const evenPct = Number((100 / n).toFixed(1));
      setRoster((prev) => prev.map((m) => (m.included ? { ...m, weight: Number((evenPct / 20).toFixed(2)) } : m)));
      showToast("Weights normalized to percentage shares");
    } else if (id === "weights") {
      showToast("Custom weights mode — fine-tune with steppers");
    }
  }

  function addGuest() {
    const name = guestName.trim();
    if (!name) {
      showToast("Enter a guest name first");
      return;
    }
    guestIdRef.current += 1;
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    const id = `guest-${guestIdRef.current}`;
    setRoster((prev) => [
      ...prev,
      {
        id,
        initials: initials || "GT",
        name,
        suffix: "",
        badge: "Single-Event Guest",
        badgeClass: "bg-surface-container-high text-on-surface-variant",
        avatarClass: AVATAR_PALETTE[prev.length % AVATAR_PALETTE.length],
        chipIcon: "person",
        chipIconClass: "text-tertiary",
        chip: guestContact.trim() || "Guest Member",
        note: "",
        role: "guest",
        room: "External Guest",
        weight: 1.0,
        included: true,
        locked: false,
      },
    ]);
    setGuestName("");
    setGuestContact("");
    showToast(`${name} added as single-event guest`);
  }

  function saveRoster() {
    if (saving || saved) return;
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      showToast(`Roster synchronized (${inr(TOTAL_EXPENSE)} saved)`);
      setTimeout(() => setSaved(false), 2400);
    }, 700);
  }

  function resetRoster() {
    setRoster(INITIAL_ROSTER);
    setMode("equal");
    setPreset("all");
    setSearch("");
    showToast("Reset to default roster");
  }

  const allocationLabel = "100% Matched (₹0.00 unassigned)";

  return (
    <AppLayout>
      <div className="bg-background font-body-md text-on-surface antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
        <main className="w-full pt-4 pb-16 bg-background min-h-screen">
          <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-col gap-6">
            {/* Breadcrumbs & Live Audit Navigation */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-outline overflow-x-auto whitespace-nowrap">
                <Link className="hover:text-primary transition-colors flex items-center gap-1" to="/expenses">
                  <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                  Expenses
                </Link>
                <span className="material-symbols-outlined text-[14px] text-outline-variant">chevron_right</span>
                <Link className="hover:text-primary transition-colors flex items-center gap-1" to="/groups">
                  <span className="material-symbols-outlined text-[15px]">downhill_skiing</span>
                  Tahoe Ski Weekend
                </Link>
                <span className="material-symbols-outlined text-[14px] text-outline-variant">chevron_right</span>
                <span className="hover:text-primary transition-colors truncate max-w-[200px]" title="Palisades Alpine Chalet & Loft Rental">
                  Palisades Alpine Chalet
                </span>
                <span className="material-symbols-outlined text-[14px] text-outline-variant">chevron_right</span>
                <span className="text-on-surface font-semibold">Manage Participants</span>
              </nav>
              <div className="flex items-center gap-2 shrink-0">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-container/15 text-primary text-xs font-medium border border-primary-container/20">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  Live Draft Syncing
                </div>
                <span className="text-[10px] text-outline font-bold uppercase tracking-wider hidden md:inline">Ledger ID #TSW-884</span>
              </div>
            </div>

            {/* Bento Header */}
            <section className="relative bg-surface-container-lowest rounded-3xl p-6 lg:p-8 border border-surface-container-high/60 shadow-sm overflow-hidden">
              <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-primary-fixed/25 blur-3xl pointer-events-none" />
              <div className="absolute right-60 -bottom-20 w-64 h-64 rounded-full bg-secondary-fixed/30 blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-fixed/60 text-on-secondary-fixed font-label-caps text-[11px] uppercase tracking-wider font-semibold">
                    <span className="material-symbols-outlined text-[15px]">ac_unit</span>
                    Tahoe Ski Weekend 2025 Ledger
                  </div>
                  <h1 className="font-headline-lg text-3xl md:text-4xl font-extrabold tracking-tight">Expense Participants</h1>
                  <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
                    Palisades Alpine Chalet &amp; Loft Rental outlay of{" "}
                    <span className="font-bold text-on-surface bg-surface-container-low px-2 py-0.5 rounded-lg">{inr(TOTAL_EXPENSE)}</span> — Configure
                    member roster shares, lock anchors, and verify live allocation balance.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 shrink-0">
                  <div className="bg-surface-container-low/90 backdrop-blur-md px-5 py-3.5 rounded-3xl border border-surface-container-high flex items-center gap-4 shadow-sm">
                    <div>
                      <span className="font-label-caps text-[11px] text-outline uppercase tracking-wider block font-bold">Total Expense Outlay</span>
                      <span className="font-numeric-balance-lg text-2xl font-extrabold text-on-surface">{inr(TOTAL_EXPENSE)}</span>
                    </div>
                    <div className="h-9 w-px bg-outline-variant/40" />
                    <div className="text-right">
                      <span className="font-label-caps text-[11px] text-primary uppercase tracking-wider font-bold flex items-center justify-end gap-1">
                        <span className="material-symbols-outlined text-[14px]">verified</span>
                        Allocation State
                      </span>
                      <span className="text-sm font-bold text-primary">{allocationLabel}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
                    <button
                      className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                      type="button"
                      onClick={() => showToast("Viewing lodging folio receipt #TSW-49281.pdf")}
                    >
                      <span className="material-symbols-outlined text-[17px]">receipt_long</span>
                      View Receipt
                    </button>
                    <button
                      className="px-4 py-2 rounded-xl bg-primary-fixed/50 hover:bg-primary-fixed text-on-primary-fixed-variant text-xs font-semibold transition-colors flex items-center gap-1.5"
                      type="button"
                      onClick={() => showToast("Ledger draft is live and synced in real time across Tahoe 2025 attendees.")}
                    >
                      <span className="material-symbols-outlined text-[17px]">lock_open</span>
                      Active Folio
                    </button>
                  </div>
                </div>
              </div>

              {/* Metric Stat Cards Bento Ribbon */}
              <div className="mt-6 pt-5 border-t border-surface-container-high/70 grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
                <div className="bg-surface-container-low/70 p-3.5 rounded-2xl border border-surface-container-high/40 flex items-center justify-between">
                  <div>
                    <span className="font-label-caps text-[11px] text-outline uppercase tracking-wider block font-bold">Group Roster</span>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <span className="font-headline-sm text-2xl font-bold text-on-surface">{roster.length}</span>
                      <span className="text-xs text-outline">registered</span>
                    </div>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-secondary-fixed/50 text-secondary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">groups</span>
                  </div>
                </div>
                <div className="bg-primary-fixed/20 p-3.5 rounded-2xl border border-primary-fixed/40 flex items-center justify-between">
                  <div>
                    <span className="font-label-caps text-[11px] text-primary uppercase tracking-wider block font-bold">Included in Split</span>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <span className="font-headline-sm text-2xl font-bold text-primary">{activeCount}</span>
                      <span className="text-xs text-on-primary-container font-medium">Paying</span>
                    </div>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-primary-container/20 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">check_circle</span>
                  </div>
                </div>
                <div className="bg-tertiary-fixed/30 p-3.5 rounded-2xl border border-tertiary-fixed/50 flex items-center justify-between">
                  <div>
                    <span className="font-label-caps text-[11px] text-tertiary uppercase tracking-wider block font-bold">Opted Out</span>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <span className="font-headline-sm text-2xl font-bold text-tertiary">{excludedCount}</span>
                      <span className="text-xs text-on-tertiary-container font-medium">Excluded</span>
                    </div>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-tertiary-fixed-dim/50 text-tertiary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">person_off</span>
                  </div>
                </div>
                <div className="bg-surface-container p-3.5 rounded-2xl border border-surface-container-high/60 flex items-center justify-between">
                  <div>
                    <span className="font-label-caps text-[11px] text-on-surface-variant uppercase tracking-wider block font-bold">Effective Rate</span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="font-numeric-balance-md text-lg font-bold text-on-surface">{inr(computed.perPersonRate)}</span>
                      <span className="text-xs text-outline">/ ea</span>
                    </div>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-surface-container-highest text-secondary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">calculate</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Mode Ribbon + Filter Tooling Bar */}
            <section className="bg-surface-container-lowest rounded-3xl p-3.5 lg:p-4 border border-surface-container-high/60 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 p-1 bg-surface-container-low rounded-xl overflow-x-auto">
                {MODES.map((m) => {
                  const selected = mode === m.id;
                  return (
                    <button
                      key={m.id}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
                        selected ? "bg-surface-container-lowest text-on-surface shadow-sm" : "text-outline hover:text-on-surface hover:bg-surface-container"
                      }`}
                      type="button"
                      onClick={() => applyMode(m.id)}
                    >
                      <span className={`material-symbols-outlined text-[16px] ${selected ? "text-primary" : ""}`}>{m.icon}</span>
                      {m.label}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-2 flex-wrap md:flex-nowrap justify-between">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    className="px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-all flex items-center gap-1"
                    type="button"
                    onClick={selectAll}
                  >
                    <span className="material-symbols-outlined text-[15px]">select_all</span>
                    Select All
                  </button>
                  <button
                    className="px-2.5 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-outline hover:text-on-surface text-xs font-semibold transition-all"
                    type="button"
                    onClick={deselectAll}
                  >
                    Deselect All
                  </button>
                  <div className="h-4 w-px bg-surface-container-high mx-1 hidden sm:block" />
                  {PRESETS.map((p) => {
                    const selected = preset === p.id;
                    return (
                      <button
                        key={p.id}
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors flex items-center gap-1 ${
                          selected ? "bg-secondary-fixed text-on-secondary-fixed" : "bg-surface-container-low hover:bg-surface-container text-on-surface-variant"
                        }`}
                        type="button"
                        onClick={() => selectPreset(p.id)}
                      >
                        {p.emoji && <span>{p.emoji}</span>}
                        {p.label}
                      </button>
                    );
                  })}
                </div>
                <div className="relative w-full sm:w-44 shrink-0">
                  <span className="material-symbols-outlined absolute left-2.5 top-1.5 text-outline text-[16px]">search</span>
                  <input
                    className="w-full pl-8 pr-2.5 py-1.5 rounded-xl bg-surface-container-low text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container focus:bg-surface-container-lowest transition-all"
                    placeholder="Filter roster..."
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* Main Bento Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* LEFT: participant cards */}
              <div className="lg:col-span-8 flex flex-col gap-3">
                {visibleRows.map((m) => (
                  <div
                    key={m.id}
                    className={`participant-card bg-surface-container-lowest rounded-3xl p-4 sm:p-5 border shadow-sm transition-all ${
                      m.included ? "border-surface-container-high/80 hover:border-primary-fixed" : "bg-surface-container-low/70 opacity-70 border-dashed border-outline-variant hover:opacity-90"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <button
                          aria-label={`Toggle ${m.name}`}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shadow-sm transition-colors shrink-0 ${
                            m.included ? "bg-primary-container text-on-primary" : "bg-surface-container-highest text-outline"
                          }`}
                          type="button"
                          onClick={() => setIncluded(m.id, !m.included)}
                        >
                          <span className={`material-symbols-outlined text-[18px] ${m.included ? "" : "opacity-0"}`}>check</span>
                        </button>
                        <div className={`w-12 h-12 rounded-2xl font-headline-sm text-[16px] font-bold flex items-center justify-center shrink-0 border ${m.avatarClass}`}>
                          {m.initials}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`font-bold text-base ${m.included ? "text-on-surface" : "text-on-surface-variant"}`}>{m.name}</span>
                            {m.suffix && <span className="text-xs text-outline font-medium">{m.suffix}</span>}
                            <span className={`px-2.5 py-0.5 rounded-full font-label-caps text-[10px] uppercase font-bold tracking-wide ${m.badgeClass}`}>
                              {m.badge}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-xs text-outline flex-wrap">
                            <span className="inline-flex items-center gap-1 bg-surface-container-low px-2 py-0.5 rounded-md text-on-surface-variant font-medium">
                              <span className={`material-symbols-outlined text-[13px] ${m.chipIconClass}`}>{m.chipIcon}</span>
                              {m.chip}
                            </span>
                            {m.note && <span>• {m.note}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-4 pl-10 sm:pl-0 shrink-0">
                        <div className="flex items-center gap-2">
                          <button
                            aria-label="Lock allocation"
                            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-colors ${
                              m.locked ? "bg-secondary-fixed text-on-secondary-fixed" : "bg-surface-container-low hover:bg-surface-container text-outline hover:text-on-surface"
                            }`}
                            type="button"
                            onClick={() => toggleLock(m.id)}
                          >
                            <span className="material-symbols-outlined text-[15px]">{m.locked ? "lock" : "lock_open"}</span>
                          </button>
                          <div className="flex items-center bg-surface-container-low rounded-xl p-1 gap-1 border border-surface-container-high/50">
                            <button
                              aria-label={`Decrease ${m.name} weight`}
                              className="w-6 h-6 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface flex items-center justify-center text-xs font-bold"
                              type="button"
                              onClick={() => stepWeight(m, -0.5)}
                            >
                              -
                            </button>
                            <span className="px-2 font-numeric-balance-md text-xs font-bold text-on-surface">{m.weight.toFixed(1)}×</span>
                            <button
                              aria-label={`Increase ${m.name} weight`}
                              className="w-6 h-6 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface flex items-center justify-center text-xs font-bold"
                              type="button"
                              onClick={() => stepWeight(m, 0.5)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="text-right shrink-0 min-w-[90px]">
                          <div className="font-numeric-balance-md text-lg text-primary font-bold">{inr(m.amount)}</div>
                          <div className="text-xs text-outline">{(m.pct * 100).toFixed(1)}% of total</div>
                        </div>
                      </div>
                    </div>
                    {!m.included && (
                      <div className="mt-3 pt-3 border-t border-outline-variant/40 flex justify-end">
                        <button
                          className="px-3.5 py-1.5 rounded-xl bg-surface-container hover:bg-primary-container hover:text-on-primary text-on-surface text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
                          type="button"
                          onClick={() => setIncluded(m.id, true)}
                        >
                          <span className="material-symbols-outlined text-[15px]">add_circle</span>
                          Re-include in Split (+)
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {visibleRows.length === 0 && (
                  <div className="bg-surface-container-lowest rounded-3xl p-10 border border-dashed border-outline-variant text-center">
                    <span className="material-symbols-outlined text-[36px] text-outline">person_search</span>
                    <p className="text-sm text-on-surface-variant mt-2">No participants match this filter.</p>
                  </div>
                )}

                {/* Add External Guest */}
                <div className="bg-surface-container-lowest rounded-3xl p-5 sm:p-6 border border-surface-container-high/80 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-secondary-fixed/50 text-secondary flex items-center justify-center">
                        <span className="material-symbols-outlined text-[22px]">person_add</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-on-surface">Add External Guest or Single-Event Participant</h3>
                        <p className="text-xs text-outline">Include a one-off contributor without inviting them to the entire Tahoe ski ledger group.</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-surface-container-low text-on-surface-variant font-label-caps text-[10px] uppercase font-bold tracking-wider hidden sm:inline">
                      One-Off Pass
                    </span>
                  </div>
                  <form
                    className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1"
                    onSubmit={(e) => {
                      e.preventDefault();
                      addGuest();
                    }}
                  >
                    <div className="sm:col-span-4">
                      <label className="block font-label-caps text-[10px] text-outline uppercase tracking-wider mb-1 font-bold">Full Name</label>
                      <input
                        className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low text-sm text-on-surface placeholder:text-outline border border-transparent focus:border-primary-container focus:bg-surface-container-lowest focus:outline-none transition-all"
                        placeholder="e.g. Liam Sterling"
                        type="text"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                      />
                    </div>
                    <div className="sm:col-span-4">
                      <label className="block font-label-caps text-[10px] text-outline uppercase tracking-wider mb-1 font-bold">Email / Handle</label>
                      <input
                        className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low text-sm text-on-surface placeholder:text-outline border border-transparent focus:border-primary-container focus:bg-surface-container-lowest focus:outline-none transition-all"
                        placeholder="liam@gmail.com or @liam"
                        type="text"
                        value={guestContact}
                        onChange={(e) => setGuestContact(e.target.value)}
                      />
                    </div>
                    <div className="sm:col-span-4 flex items-end">
                      <button
                        className="w-full py-2 px-4 rounded-xl bg-surface-container-high hover:bg-secondary hover:text-on-secondary text-on-surface text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                        type="submit"
                      >
                        <span className="material-symbols-outlined text-[16px]">add</span>
                        Add Single Guest
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* RIGHT: Allocation Studio */}
              <div className="lg:col-span-4 flex flex-col gap-4 lg:sticky lg:top-20">
                <div className="bg-surface-container-lowest rounded-3xl p-5 sm:p-6 border border-surface-container-high/80 shadow-sm space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-label-caps text-[11px] text-outline uppercase tracking-wider block font-bold">Allocation Visualizer</span>
                      <h2 className="font-bold text-base text-on-surface">Split Distribution</h2>
                    </div>
                    <div className="text-right">
                      <span className="font-numeric-balance-lg text-xl font-extrabold text-on-surface">{inr(TOTAL_EXPENSE)}</span>
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-primary">100% Balanced</span>
                    </div>
                  </div>

                  <div className="relative flex flex-col items-center justify-center py-2">
                    <svg className="w-48 h-48 -rotate-90 transform" viewBox="0 0 160 160">
                      <circle cx="80" cy="80" fill="none" r={RING_RADIUS} stroke="#f2f3ff" strokeWidth="16" />
                      {computed.rows
                        .filter((r) => r.included && r.dash > 0)
                        .map((r) => (
                          <circle
                            key={r.id}
                            cx="80"
                            cy="80"
                            fill="none"
                            r={RING_RADIUS}
                            stroke={r.color}
                            strokeWidth="16"
                            strokeDasharray={`${r.dash.toFixed(1)} ${(RING_CIRCUMFERENCE - r.dash).toFixed(1)}`}
                            strokeDashoffset={(-r.offset).toFixed(1)}
                          >
                            <title>{`${r.name}: ${inr(r.amount)} (${(r.pct * 100).toFixed(1)}%)`}</title>
                          </circle>
                        ))}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                      <span className="text-[11px] font-bold text-outline uppercase tracking-wider">Per Person</span>
                      <span className="font-numeric-balance-lg text-xl font-extrabold text-primary">{inr(computed.perPersonRate)}</span>
                      <span className="text-[11px] text-on-surface-variant font-medium">{activeCount} Active Shares</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-1 border-t border-surface-container-high/60">
                    {computed.rows
                      .filter((r) => r.included)
                      .map((r) => (
                        <div key={r.id} className="flex items-center justify-between text-xs py-0.5">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: r.color }} />
                            <span className="text-on-surface font-medium truncate">{r.name}</span>
                          </div>
                          <span className="font-numeric-balance-md text-xs font-bold text-on-surface shrink-0">
                            {inr(r.amount)} ({(r.pct * 100).toFixed(1)}%)
                          </span>
                        </div>
                      ))}
                  </div>

                  <div className="bg-surface-container-low rounded-2xl p-4 border border-surface-container-high/60 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-label-caps text-[11px] text-primary uppercase tracking-wider font-bold flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px]">sync_alt</span>
                        Roster Impact Simulation
                      </span>
                      <span className="text-[10px] bg-primary-fixed/50 text-on-primary-fixed-variant px-2 py-0.5 rounded-full font-bold">Real-time</span>
                    </div>
                    <div className="space-y-1.5 text-xs font-medium">
                      <div className="flex justify-between items-center px-2.5 py-1.5 rounded-lg hover:bg-surface-container transition-colors">
                        <span className="text-outline">If All {roster.length} Members Included:</span>
                        <span className="font-numeric-balance-md text-xs text-outline font-semibold">
                          {inr(allRate)} <span className="text-[10px] font-normal">/ea</span>
                        </span>
                      </div>
                      <div className="flex justify-between items-center px-2.5 py-1.5 bg-surface-container-lowest rounded-lg border border-primary-container/20 shadow-sm">
                        <span className="font-bold text-on-surface flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary-container" />
                          Current Active ({activeCount} Members):
                        </span>
                        <span className="font-numeric-balance-md text-xs text-primary font-extrabold">
                          {inr(computed.perPersonRate)} <span className="text-[10px] font-normal">/ea</span>
                        </span>
                      </div>
                      <div className="flex justify-between items-center px-2.5 py-1.5 rounded-lg hover:bg-surface-container transition-colors">
                        <span className="text-outline">If 4 Members Included:</span>
                        <span className="font-numeric-balance-md text-xs text-outline font-semibold">
                          {inr(fourRate)} <span className="text-[10px] font-normal">/ea</span>
                        </span>
                      </div>
                    </div>
                    <div className="bg-surface-container-lowest/80 rounded-xl p-2.5 border border-surface-container-high/60 flex items-start gap-2 text-[11px] text-on-surface-variant">
                      <span className="material-symbols-outlined text-secondary text-[16px] shrink-0 mt-0.5">hub</span>
                      <span>
                        <strong>Instant Liquidity Netting:</strong> Active participants' shares directly offset ₹39,840 in existing ski shuttle
                        circular debits across Alex and Marco.
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <button
                      className={`w-full py-3.5 px-4 rounded-2xl text-on-primary text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 ${
                        saved ? "bg-primary-container" : "bg-primary hover:bg-primary-container"
                      }`}
                      type="button"
                      onClick={saveRoster}
                      disabled={saving}
                    >
                      <span className={`material-symbols-outlined text-[19px] ${saving ? "animate-spin" : ""}`}>
                        {saved ? "check_circle" : saving ? "progress_activity" : "save"}
                      </span>
                      {saved ? `Roster Synchronized (${inr(TOTAL_EXPENSE)} Saved)` : saving ? "Applying Multipliers…" : `Save Participant Roster (${inr(TOTAL_EXPENSE)})`}
                    </button>
                    <button
                      className="w-full py-2.5 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                      type="button"
                      onClick={resetRoster}
                    >
                      <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                      Reset to Default Roster
                    </button>
                    <Link
                      className="w-full py-2 px-3 text-center text-outline hover:text-on-surface text-xs transition-colors block font-medium"
                      to="/expense-details"
                    >
                      ← Return to Expense Details
                    </Link>
                  </div>
                </div>

                <div className="bg-surface-container-low rounded-3xl p-4 border border-surface-container-high/60 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-secondary-fixed/60 text-secondary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">bolt</span>
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-xs text-on-surface">Auto-Settlement Sync Active</h4>
                    <p className="text-[11px] text-outline leading-relaxed">
                      When confirmed, recalculations instantly balance individual Tahoe tabs without triggering manual Venmo or split requests.
                    </p>
                  </div>
                </div>

                <Link
                  to="/split-expense"
                  className="w-full py-2.5 px-4 rounded-xl bg-surface-container-lowest border border-surface-container-high text-on-surface text-xs font-semibold hover:bg-surface-container transition-colors flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">tune</span>
                  Open Weight Slider Console
                </Link>
              </div>
            </div>
          </div>
        </main>

        {toast && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-inverse-surface text-inverse-on-surface px-4 py-2.5 rounded-full shadow-2xl">
            <span className="material-symbols-outlined text-[18px] text-primary-fixed">check_circle</span>
            <span className="text-xs font-semibold">{toast}</span>
          </div>
        )}
      </div>
    </AppLayout>
  );
}