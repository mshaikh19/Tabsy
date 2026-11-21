import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";

const inr0 = (n) => `₹${Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

const VERSIONS = [
  {
    id: "v3.0",
    title: "v3.0 Split Reconfig",
    badge: "HEAD",
    badgeCls: "bg-primary-fixed text-on-primary-fixed-variant",
    dot: "bg-primary",
    ring: "ring-primary-fixed",
    meta: "Today 2:15 PM • Alex Morgan",
    tag: "v3.0",
    scope: "Member Opt-out Shift",
    timestamp: "Today at 2:15 PM UTC",
    heroTitle: "Split Reconfiguration Applied",
    description:
      "Marcus Vance opted out following medical clearance; per-member share recalculated equally across remaining active occupants. Master tab balance unchanged at ₹99,600.00.",
    author: "Alex Morgan",
    signature: "sig:0x39bfa482d",
    json: {
      version: "3.0",
      parent_hash: "0x419d8820f12c",
      tx_signature: "0x39bfa482d901f",
      timestamp: "2025-02-14T14:15:00Z",
      author: "alex.morgan@tabsy.id",
      event_type: "MEMBER_OPT_OUT",
      modified_roster: { alex: 19920, sarah: 19920, jason: 19920, kim: 19920, marco: 19920, taylor_evans: 0 },
      delta_checksum: "0x00000000_ZERO_LEAK",
    },
  },
  {
    id: "v2.1",
    title: "v2.1 Receipt OCR",
    badge: "100% OCR",
    badgeCls: "bg-secondary-fixed text-on-secondary-fixed-variant",
    dot: "bg-secondary",
    ring: "ring-secondary-fixed",
    meta: "Yesterday 4:30 PM • System OCR",
    tag: "v2.1",
    scope: "Receipt OCR Replacement",
    timestamp: "Yesterday at 4:30 PM UTC",
    heroTitle: "Receipt Scanned & Replaced",
    description:
      "High-res PDF statement ingested from Palisades Tahoe lodging portal. Line items normalized and tax ID verified with state lodging board.",
    author: "System OCR",
    signature: "sig:0xe220a7b41",
    json: {
      version: "2.1",
      parent_hash: "0x419d88f120",
      tx_signature: "0xe220a7b41a99",
      timestamp: "2025-02-13T16:30:00Z",
      author: "tesseract.neural.ocr@tabsy.internal",
      event_type: "RECEIPT_DIGITIZED",
      confidence_mean: 0.997,
      merchant: "Palisades Tahoe Resort & Lodging",
      tax_id: "CA-9402910-B",
    },
  },
  {
    id: "v2.0",
    title: "v2.0 Itemization",
    badge: "3 Tiers",
    badgeCls: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
    dot: "bg-tertiary",
    ring: "ring-tertiary-fixed",
    meta: "Feb 14, 10:15 AM • Alex M.",
    tag: "v2.0",
    scope: "Line Item Itemization",
    timestamp: "Feb 14, 2025 at 10:15 AM",
    heroTitle: "Itemized Line Items Added",
    description:
      "Lumpsum booking decomposed into Base Chalet (₹79,680), Hot Tub Sanitization (₹11,620), and Regional Lodging Tax (₹8,300).",
    author: "Alex Morgan",
    signature: "sig:0x419d88ef0",
    json: {
      version: "2.0",
      parent_hash: "0x98f420c81",
      tx_signature: "0x419d88ef001",
      timestamp: "2025-02-14T10:15:00Z",
      author: "alex.morgan@tabsy.id",
      event_type: "ITEMIZATION_DECOMPOSITION",
      breakdown: [
        { item: "Chalet Rental", amount: 79680 },
        { item: "Sanitize & Hot Tub", amount: 11620 },
        { item: "Occupancy Tax 10%", amount: 8300 },
      ],
    },
  },
  {
    id: "v1.2",
    title: "v1.2 Marco Settlement",
    badge: "Paid",
    badgeCls: "bg-primary-fixed text-on-primary-fixed-variant",
    dot: "bg-secondary",
    ring: "ring-secondary-fixed",
    meta: "Feb 14, 9:45 AM • Marco Rossi",
    tag: "v1.2",
    scope: "Settlement Milestone",
    timestamp: "Feb 14, 2025 at 9:45 AM",
    heroTitle: "Settlement Recorded: Marco Rossi",
    description: "Direct Apple Pay transfer of ₹19,920.00 confirmed and net debt obligations updated in real-time.",
    author: "Marco Rossi",
    signature: "sig:0x98f420c81",
    json: {
      version: "1.2",
      parent_hash: "0x0001fa8e9b",
      tx_signature: "0x98f420c812d",
      timestamp: "2025-02-14T09:45:00Z",
      author: "marco.rossi@tabsy.id",
      event_type: "PAYMENT_SETTLED",
      payment_channel: "Apple Cash Pay",
      amount_settled: 19920,
      remaining_balance: 0,
    },
  },
  {
    id: "v1.0",
    title: "v1.0 Inception",
    badge: "Genesis",
    badgeCls: "bg-surface-container text-on-surface-variant",
    dot: "bg-outline",
    ring: "ring-surface-container-highest",
    meta: "Feb 14, 9:00 AM • Genesis",
    tag: "v1.0",
    scope: "Genesis Ledger Inception",
    timestamp: "Feb 14, 2025 at 9:00 AM",
    heroTitle: "Genesis Expense Created",
    description: "Original reservation hold recorded at ₹99,600.00 evenly divided across 6 occupants (₹16,600.00/person).",
    author: "Alex Morgan",
    signature: "sig:0x0001fa8e9",
    json: {
      version: "1.0",
      parent_hash: "0x0000000000",
      tx_signature: "0x0001fa8e9b00",
      timestamp: "2025-02-14T09:00:00Z",
      author: "alex.morgan@tabsy.id",
      event_type: "EXPENSE_GENESIS",
      total_principal: 99600,
      initial_headcount: 6,
      initial_pax_quote: 16600,
    },
  },
];

const ACTORS = [
  { label: "Alex Morgan (4)", cls: "bg-primary-fixed/60 text-on-primary-fixed-variant border-primary-fixed-dim/60" },
  { label: "System OCR (1)", cls: "bg-secondary-fixed text-on-secondary-fixed-variant border-secondary-fixed-dim/60" },
  { label: "Marco Rossi (1)", cls: "bg-[#e0f2fe] text-[#0369a1] border-[#bae6fd]" },
];

const EVENT_TYPES = ["Splits", "Receipts", "Payments"];

const ROSTER = [
  { initials: "AM", name: "Alex Morgan", sub: "Primary Payer (₹99,600 Upfront)", av: "bg-primary text-on-primary", before: 16600, after: 19920, delta: 3320, status: "Settled Up", statusCls: "bg-primary-fixed text-on-primary-fixed-variant" },
  { initials: "SJ", name: "Sarah Jenkins", sub: "Occupant • Alpine Suite", av: "bg-[#e0f2fe] text-[#0369a1]", before: 16600, after: 19920, delta: 3320, status: "Pending (₹3,320)", statusCls: "bg-[#fef9c3] text-[#780021]" },
  { initials: "JW", name: "Jason Wu", sub: "Occupant • Loft Bunk", av: "bg-secondary-fixed text-secondary", before: 16600, after: 19920, delta: 3320, status: "Settled Up", statusCls: "bg-primary-fixed text-on-primary-fixed-variant" },
  { initials: "KL", name: "Kim Larson", sub: "Occupant • Loft Bunk", av: "bg-[#fef3c7] text-[#b45309]", before: 16600, after: 19920, delta: 3320, status: "Settled Up", statusCls: "bg-primary-fixed text-on-primary-fixed-variant" },
  { initials: "MR", name: "Marco Rossi", sub: "Occupant • Alpine Suite", av: "bg-secondary-container text-on-secondary-container", before: 16600, after: 19920, delta: 3320, status: "Reconciled", statusCls: "bg-primary-fixed text-on-primary-fixed-variant" },
  { initials: "TE", name: "Taylor Evans", sub: "Opted Out (Medical)", av: "bg-surface-container text-outline", before: 16600, after: 0, delta: -16600, status: "Excused", statusCls: "bg-surface-container text-on-surface-variant", excused: true },
];

const RECEIPT = [
  { target: "base", no: "01", label: "CHALET_RENTAL_3N", amount: 79680, boxCls: "bg-primary-fixed border-primary", textCls: "text-on-primary-fixed-variant" },
  { target: "clean", no: "02", label: "SANITIZE_HOTTUB_FEE", amount: 11620, boxCls: "bg-secondary-fixed border-secondary", textCls: "text-secondary" },
  { target: "tax", no: "03", label: "CA_OCCUPANCY_TAX_10%", amount: 8300, boxCls: "bg-[#ffe4e6] border-tertiary", textCls: "text-tertiary" },
];

const OCR_CARDS = [
  { id: "base", title: "Base Lodging (3 Nights)", amount: 79680, meta: "Line Item #01 • Chalet Quota", badge: "99.8% OCR Confidence", badgeCls: "bg-primary-fixed text-on-primary-fixed-variant" },
  { id: "clean", title: "Deep Sanitization & Hot Tub", amount: 11620, meta: "Line Item #02 • Shared Amenity", badge: "99.4% OCR Confidence", badgeCls: "bg-secondary-fixed text-secondary" },
  { id: "tax", title: "Regional Lodging Occupancy Tax", amount: 8300, meta: "Line Item #03 • 10% County Assessment", badge: "100% Tax Math Verified", badgeCls: "bg-[#ffe4e6] text-tertiary" },
];

function SectionHeader({ icon, iconCls, title, right, sub }) {
  return (
    <div className="flex items-center justify-between gap-3 pb-3 mb-3 border-b border-surface-container-high/70">
      <div className="flex items-center gap-2 min-w-0">
        {icon && (
          <span className={`material-symbols-outlined text-[18px] shrink-0 ${iconCls || "text-primary"}`}>{icon}</span>
        )}
        <div className="min-w-0">
          <h3 className="font-bold text-[14px] text-on-surface leading-tight truncate">{title}</h3>
          {sub && <p className="text-[11px] text-outline">{sub}</p>}
        </div>
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}

export default function ExpenseHistory() {
  const [selected, setSelected] = useState("v3.0");
  const [mode, setMode] = useState("diff");
  const [hoverToken, setHoverToken] = useState(null);
  const [toast, setToast] = useState(null);
  const [revertVotes, setRevertVotes] = useState(1);
  const toastTimer = useRef(null);

  function showToast(message, icon = "check_circle") {
    setToast({ message, icon });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2800);
  }

  const version = VERSIONS.find((v) => v.id === selected) || VERSIONS[0];
  const jsonText = JSON.stringify(version.json, null, 2);

  function copyHash() {
    const hash = "0x8f2ab7c19e4402af...7d91c2";
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(hash).catch(() => {});
    }
    showToast("Merkle consensus hash copied to clipboard", "content_copy");
  }

  function requestRevert() {
    setRevertVotes((v) => Math.min(4, v + 1));
    showToast(`Rollback authorization broadcasted (${Math.min(4, revertVotes + 1)} of 4 peer signatures confirmed)`, "how_to_vote");
  }

  return (
    <AppLayout>
      <div className="bg-[#f7f6fd] font-body-md text-body-md text-on-surface antialiased">
        <main className="w-full min-h-screen pb-12">
          {/* Page Header */}
          <section className="w-full bg-surface-container-low border-b border-surface-container-high/70 pt-4 pb-5">
            <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-4">
              {/* Breadcrumb row */}
              <div className="flex items-center flex-wrap gap-2 text-on-surface-variant text-[13px]">
                <Link className="hover:text-primary transition-colors flex items-center gap-1 font-medium" to="/expenses">
                  <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                  <span>Expenses</span>
                </Link>
                <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
                <Link className="hover:text-primary transition-colors flex items-center gap-1 font-medium" to="/group-details">
                  <span className="inline-flex w-4 h-4 rounded-full bg-[#e0f2fe] items-center justify-center text-[10px]">❄️</span>
                  <span>Tahoe Ski Weekend</span>
                </Link>
                <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
                <Link className="hover:text-primary transition-colors font-semibold text-on-surface" to="/expense-details">Palisades Alpine Chalet &amp; Loft Rental</Link>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-fixed text-secondary text-[11px] font-bold">
                  <span className="material-symbols-outlined text-[13px]">schema</span>
                  Neo-Bento Studio
                </span>
              </div>

              {/* Title + actions row */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-wrap min-w-0">
                  <div className="w-11 h-11 rounded-2xl bg-primary flex items-center justify-center text-on-primary shadow-sm shrink-0">
                    <span className="material-symbols-outlined text-[24px]">account_tree</span>
                  </div>
                  <h1 className="font-headline-lg text-2xl lg:text-3xl font-extrabold text-on-surface tracking-tight leading-tight whitespace-nowrap">Expense History &amp; Version Ledger</h1>
                  <p className="text-sm text-on-surface-variant">Immutable revision timeline — inspect state diffs, Merkle consensus, and rollback guards.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-[11px] font-bold tracking-wide">
                    <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
                    IMMUTABLE STATE CONSENSUS
                  </span>
                  <span className="font-mono text-[11px] text-outline bg-surface-container-lowest px-2.5 py-1 rounded-full border border-surface-container">Chain #9,481,204</span>
                  <button
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-primary text-on-primary text-sm font-bold shadow-md hover:brightness-105 active:scale-95 transition-all"
                    type="button"
                    onClick={() => showToast("Signed cryptographic audit proof generated (JSON & PDF)", "download_done")}
                  >
                    <span className="material-symbols-outlined text-[18px]">verified_user</span>
                    <span>Export Proof</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* COLUMN 1: Telemetry & Version Tree */}
              <aside className="lg:col-span-3 flex flex-col gap-4">
                {/* Ledger Telemetry */}
                <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container shadow-sm transition-all hover:border-primary/40">
                  <SectionHeader
                    icon="hub"
                    iconCls="text-primary"
                    title="Ledger Telemetry"
                    right={<span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-bold text-[11px]">Healthy</span>}
                  />
                  <div className="space-y-3">
                    <div>
                      <span className="text-[11px] font-semibold text-outline uppercase tracking-wider">Ledger Block Height</span>
                      <div className="flex items-baseline justify-between mt-0.5">
                        <span className="font-mono font-extrabold text-[22px] text-on-surface">#9,481,204</span>
                        <span className="text-[11px] font-mono text-primary font-bold">5 Revisions</span>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-surface-bright border border-surface-container">
                      <div className="flex items-center justify-between text-[12px] mb-1">
                        <span className="text-on-surface-variant font-medium">Zero-Delta Verification</span>
                        <span className="font-bold text-primary">100% Balanced</span>
                      </div>
                      <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                        <div className="bg-primary-container h-full rounded-full" style={{ width: "100%" }} />
                      </div>
                      <div className="flex justify-between items-center mt-1.5 text-[10px] text-outline font-mono">
                        <span>Inception {inr0(99600)}</span>
                        <span>Head {inr0(99600)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Version Branch Tree */}
                <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container shadow-sm">
                  <SectionHeader
                    title="Version Branch Tree"
                    sub="Click node to inspect state snapshot"
                    right={<span className="material-symbols-outlined text-outline text-[18px]">account_tree</span>}
                  />
                  <div className="relative space-y-2">
                    <span className="absolute left-[15px] top-3 bottom-3 w-0.5 bg-surface-container-highest" />
                    {VERSIONS.map((v) => {
                      const active = selected === v.id;
                      return (
                        <button
                          key={v.id}
                          className={`w-full text-left relative pl-9 pr-3 py-2.5 rounded-xl transition-all border flex items-center gap-2 ${
                            active ? "bg-surface-container-low border-primary/40" : "border-transparent hover:bg-surface-container-low"
                          }`}
                          type="button"
                          onClick={() => {
                            setSelected(v.id);
                            showToast(`Active inspector switched to version ${v.tag}`, "tune");
                          }}
                        >
                          <span className={`absolute left-2.5 top-3.5 w-3.5 h-3.5 rounded-full ring-4 z-10 transition-transform group-hover:scale-110 ${v.dot} ${v.ring}`} />
                          <div className="flex flex-col min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-[13px] text-on-surface">{v.title}</span>
                              <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold shrink-0 ${v.badgeCls}`}>{v.badge}</span>
                            </div>
                            <span className="text-[11px] text-outline mt-0.5 leading-snug">{v.meta}</span>
                          </div>
                          <span className={`material-symbols-outlined text-[16px] shrink-0 transition-opacity ${active ? "text-primary opacity-100" : "text-outline opacity-0"}`}>
                            {active ? "radio_button_checked" : "radio_button_unchecked"}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Filter Chips */}
                  <div className="mt-4 pt-3 border-t border-surface-container">
                    <span className="text-[10px] font-bold text-outline uppercase tracking-wider block mb-2">Filter Ledger By Actor</span>
                    <div className="flex flex-wrap gap-1.5">
                      {ACTORS.map((a) => (
                        <button
                          key={a.label}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border hover:opacity-90 ${a.cls}`}
                          type="button"
                          onClick={() => showToast(`Filtered ledger view by: ${a.label}`, "filter_alt")}
                        >
                          {a.label}
                        </button>
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-outline uppercase tracking-wider block mt-3 mb-2">Filter By Event Type</span>
                    <div className="flex flex-wrap gap-1.5">
                      {EVENT_TYPES.map((t) => (
                        <button
                          key={t}
                          className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-surface-container-low text-on-surface border border-outline-variant/30 hover:bg-surface-container"
                          type="button"
                          onClick={() => showToast(`Filtered ledger view by: ${t}`, "filter_alt")}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Proof Export Station */}
                <div className="bg-surface-container-lowest rounded-2xl p-4 border border-surface-container shadow-sm flex flex-col gap-2">
                  <span className="text-[11px] font-bold text-outline uppercase tracking-wider block px-1">Proof Export Station</span>
                  <button
                    className="w-full px-3 py-3 rounded-xl bg-surface-container-low hover:bg-secondary-fixed text-on-surface text-[12px] font-semibold border border-surface-container flex items-center gap-2 text-left transition-colors group"
                    type="button"
                    onClick={() => showToast("Signed cryptographic audit proof generated (JSON & PDF)", "download_done")}
                  >
                    <span className="material-symbols-outlined text-[18px] text-secondary shrink-0">verified_user</span>
                    <span className="flex-1 leading-snug">Export Audit Proof (JSON / PDF)</span>
                    <span className="material-symbols-outlined text-[16px] text-secondary shrink-0 group-hover:translate-x-0.5 transition-transform">download</span>
                  </button>
                  <button
                    className="w-full px-3 py-3 rounded-xl bg-surface-container-low hover:bg-primary-fixed text-on-surface text-[12px] font-semibold border border-surface-container flex items-center gap-2 text-left transition-colors group"
                    type="button"
                    onClick={() => showToast("Merkle tree inclusion proof exported (merkle_0x8f2a.proof)", "account_tree")}
                  >
                    <span className="material-symbols-outlined text-[18px] text-secondary shrink-0">account_tree</span>
                    <span className="flex-1 leading-snug">Download Merkle Tree Proof</span>
                    <span className="material-symbols-outlined text-[16px] text-secondary shrink-0 group-hover:translate-x-0.5 transition-transform">download</span>
                  </button>
                </div>
              </aside>

              {/* COLUMN 2: Active Version Inspector */}
              <section className="lg:col-span-6 flex flex-col gap-4">
                {/* Hero Banner */}
                <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container shadow-sm relative overflow-hidden">
                  <div className="absolute -right-10 -top-10 w-36 h-36 bg-primary-fixed/20 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-start justify-between gap-3 relative z-10">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-extrabold text-[12px]">{version.tag}</span>
                        <span className="px-2 py-0.5 rounded-full bg-[#fef9c3] text-[#780021] font-bold text-[11px] uppercase tracking-wide">{version.scope}</span>
                        <span className="text-[12px] text-outline font-medium">{version.timestamp}</span>
                      </div>
                      <h2 className="text-[20px] font-extrabold text-on-surface tracking-tight">{version.heroTitle}</h2>
                      <p className="text-[13px] text-on-surface-variant mt-1 leading-relaxed">{version.description}</p>
                    </div>
                    <div className="shrink-0 flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-surface-bright border border-surface-container">
                        <div className="w-5 h-5 rounded-full bg-primary text-on-primary text-[10px] font-bold flex items-center justify-center">AM</div>
                        <span className="text-[12px] font-bold text-on-surface">{version.author}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-surface-container font-semibold text-outline">Host</span>
                      </div>
                      <span className="font-mono text-[10px] text-outline mt-1">{version.signature}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-surface-container flex items-center justify-between flex-wrap gap-2">
                    <div className="inline-flex p-1 bg-surface-container/60 rounded-xl gap-1">
                      {[
                        { id: "diff", label: "Visual Diff" },
                        { id: "snapshot", label: "Full Snapshot" },
                        { id: "json", label: "Raw JSON" },
                      ].map((m) => (
                        <button
                          key={m.id}
                          className={`px-3 py-1 rounded-lg text-[12px] transition-all ${
                            mode === m.id ? "bg-surface-container-lowest text-on-surface shadow-sm font-bold" : "text-on-surface-variant hover:text-on-surface font-medium"
                          }`}
                          type="button"
                          onClick={() => setMode(m.id)}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 text-[12px] text-primary font-semibold">
                      <span className="material-symbols-outlined text-[16px]">verified</span>
                      <span>Cryptographically Reconciled</span>
                    </div>
                  </div>
                </div>

                {/* Comparison Card */}
                <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container shadow-sm">
                  {mode === "diff" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-secondary text-[20px]">compare_arrows</span>
                          <h3 className="font-bold text-[14px] text-on-surface">State Transformation Delta</h3>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-[#ffe4e6] text-[#ba1a1a] text-[11px] font-bold">+{inr0(3320)} / remaining occupant</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container-highest">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-outline">State Before (v2.1)</span>
                            <span className="w-2 h-2 rounded-full bg-outline" />
                          </div>
                          <div className="mt-2 flex flex-col">
                            <span className="text-[12px] text-on-surface-variant">
                              Active Quota: <strong className="text-on-surface">6 members</strong>
                            </span>
                            <span className="font-mono font-bold text-[18px] text-on-surface mt-0.5">
                              {inr0(16600)} <span className="text-[11px] font-normal text-outline">/ person</span>
                            </span>
                          </div>
                          <span className="text-[11px] text-outline mt-1 block">Roster includes Marcus Vance</span>
                        </div>
                        <div className="p-3 rounded-xl bg-primary-fixed/60 border border-primary-fixed-dim/70">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-on-primary-fixed-variant">Revised State (v3.0)</span>
                            <span className="w-2 h-2 rounded-full bg-primary-container" />
                          </div>
                          <div className="mt-2 flex flex-col">
                            <span className="text-[12px] text-on-surface-variant">
                              Active Quota: <strong className="text-on-surface">5 members</strong>
                            </span>
                            <span className="font-mono font-bold text-[18px] text-primary mt-0.5">
                              {inr0(19920)} <span className="text-[11px] font-normal text-on-primary-fixed-variant">/ person</span>
                            </span>
                          </div>
                          <span className="text-[11px] text-primary font-medium mt-1 block">Marcus V. (₹0 liability)</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {mode === "snapshot" && (
                    <div className="space-y-3">
                      <div className="p-3 rounded-xl bg-surface-bright border border-surface-container">
                        <h4 className="font-bold text-[13px] text-on-surface mb-2">Immutable Snapshot Header ({version.tag}.0-rc1)</h4>
                        <div className="grid grid-cols-2 gap-2 text-[12px]">
                          <div>
                            <span className="text-outline">Lodging Base:</span> <span className="font-bold">{inr0(79680)}</span>
                          </div>
                          <div>
                            <span className="text-outline">Amenity Tax:</span> <span className="font-bold">{inr0(19920)}</span>
                          </div>
                          <div>
                            <span className="text-outline">Primary Payer:</span> <span className="font-bold text-primary">Alex Morgan</span>
                          </div>
                          <div>
                            <span className="text-outline">Master State:</span> <span className="font-bold text-primary">BALANCED</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {mode === "json" && (
                    <div>
                      <pre className="p-3 rounded-xl bg-[#131b2e] text-[#6ffbbe] font-mono text-[11px] overflow-x-auto leading-relaxed max-h-56">
                        <code>{jsonText}</code>
                      </pre>
                    </div>
                  )}
                </div>

                {/* Member Quota Shift Matrix */}
                <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container shadow-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-surface-container">
                    <div>
                      <h3 className="font-bold text-[14px] text-on-surface">Member Quota Shift Matrix</h3>
                      <p className="text-[11px] text-outline">Real-time delta attribution per cabin member</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-surface-container-low text-on-surface-variant font-mono text-[11px] font-bold">6 Group Members</span>
                  </div>
                  <div className="mt-3 divide-y divide-surface-container">
                    {ROSTER.map((m) => (
                      <div key={m.initials} className={`py-2.5 flex items-center justify-between gap-3 text-[13px] ${m.excused ? "opacity-75" : ""}`}>
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-8 h-8 rounded-full ${m.av} font-bold text-[11px] flex items-center justify-center shrink-0`}>{m.initials}</div>
                          <div className="min-w-0">
                            <span className={`font-bold block leading-tight truncate ${m.excused ? "line-through text-on-surface" : "text-on-surface"}`}>{m.name}</span>
                            <span className={`text-[11px] ${m.excused ? "text-tertiary font-semibold" : "text-outline"}`}>{m.sub}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-right shrink-0">
                          <div>
                            <span className="text-[11px] text-outline line-through">{inr0(m.before)}</span>
                            <span className={`font-mono font-bold block ${m.excused ? "text-outline" : "text-on-surface"}`}>{inr0(m.after)}</span>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-bold ${
                              m.excused ? "bg-[#f1f5f9] text-outline" : "bg-[#ffe4e6] text-[#ba1a1a]"
                            }`}
                          >
                            {m.delta >= 0 ? "+" : "−"}
                            {inr0(Math.abs(m.delta))}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${m.statusCls}`}>{m.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interactive Receipt & Proof Lens */}
                <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container shadow-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-surface-container">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary text-[20px]">document_scanner</span>
                      <h3 className="font-bold text-[14px] text-on-surface">Interactive Receipt &amp; Proof Lens</h3>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-secondary text-[11px] font-bold">Tesseract Neural OCR</span>
                  </div>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-5 bg-surface-bright p-3 rounded-xl border border-surface-container-highest">
                      <div className="bg-surface-container-lowest rounded-lg p-3 shadow-inner border border-surface-container text-[10px] font-mono leading-relaxed space-y-2">
                        <div className="text-center border-b border-dashed border-outline-variant pb-1.5">
                          <p className="font-bold text-[11px] text-on-surface">PALISADES TAHOE LODGE</p>
                          <p className="text-outline break-words">1960 Squaw Valley Rd, Olympic Valley</p>
                        </div>
                        {RECEIPT.map((r) => (
                          <div
                            key={r.target}
                            className={`p-1 rounded transition-colors flex items-start justify-between gap-2 cursor-pointer ${
                              hoverToken === r.target ? `${r.boxCls} ring-2 ring-primary` : `${r.boxCls}`
                            }`}
                            onMouseEnter={() => setHoverToken(r.target)}
                            onMouseLeave={() => setHoverToken(null)}
                            onClick={() => showToast(`Inspecting bounding token: ${r.label.toLowerCase()}`, "manage_search")}
                          >
                            <span className="min-w-0 break-words">
                              {r.no}. {r.label}
                            </span>
                            <span className={`font-bold shrink-0 text-right ${r.textCls}`}>{inr0(r.amount)}</span>
                          </div>
                        ))}
                        <div className="border-t border-dashed border-outline-variant pt-1 flex items-start justify-between gap-2 font-bold text-on-surface text-[11px]">
                          <span className="min-w-0 break-words">TOTAL_CHARGED</span>
                          <span className="shrink-0">{inr0(99600)}</span>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[10px] text-outline">
                        <span>SHA256: d8f3...a9b2</span>
                        <span className="text-secondary font-semibold">Hover boxes to cross-reference</span>
                      </div>
                    </div>
                    <div className="md:col-span-7 space-y-2.5">
                      {OCR_CARDS.map((c) => (
                        <div
                          key={c.id}
                          className={`p-2.5 rounded-xl bg-surface-bright border border-surface-container transition-all ${
                            hoverToken === c.id ? "ring-2 ring-primary scale-[1.01]" : ""
                          }`}
                          onMouseEnter={() => setHoverToken(c.id)}
                          onMouseLeave={() => setHoverToken(null)}
                        >
                          <div className="flex items-start justify-between gap-2 text-[12px]">
                            <span className="font-bold text-on-surface min-w-0 break-words">{c.title}</span>
                            <span className="font-mono font-bold text-primary shrink-0">{inr0(c.amount)}</span>
                          </div>
                          <div className="flex items-start justify-between gap-2 text-[11px] text-outline mt-1">
                            <span className="min-w-0 break-words">{c.meta}</span>
                            <span className={`px-1.5 py-0.2 rounded font-bold text-[10px] shrink-0 text-center ${c.badgeCls}`}>{c.badge}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* COLUMN 3: Security & Consensus */}
              <aside className="lg:col-span-3 flex flex-col gap-4">
                {/* Merkle Consensus */}
                <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container shadow-sm">
                  <SectionHeader
                    icon="lock_reset"
                    iconCls="text-primary"
                    title="Merkle Consensus Card"
                    right={<span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-[11px] font-bold">Synced</span>}
                  />
                  <div className="space-y-2.5 text-[12px]">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-outline block">Active Block Hash</span>
                      <div className="flex items-center justify-between mt-1 p-2 rounded-lg bg-surface-bright border border-surface-container">
                        <code className="font-mono text-[11px] text-on-surface truncate">0x8f2ab7...7d91c2</code>
                        <button className="p-1 text-outline hover:text-on-surface transition-colors" title="Copy Merkle Hash" type="button" onClick={copyHash}>
                          <span className="material-symbols-outlined text-[15px]">content_copy</span>
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 rounded-lg bg-surface-bright border border-surface-container">
                        <span className="text-[10px] text-outline font-bold block">NONCE</span>
                        <span className="font-mono font-bold text-on-surface">#449,102</span>
                      </div>
                      <div className="p-2 rounded-lg bg-surface-bright border border-surface-container">
                        <span className="text-[10px] text-outline font-bold block">TIMESTAMP</span>
                        <span className="font-mono font-bold text-on-surface">1739542500</span>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#e0f2fe]/60 border border-[#bae6fd] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-[#0369a1] uppercase block">Consensus Validator</span>
                        <span className="font-semibold text-on-surface text-[12px]">Tahoe Peer Network Node #3</span>
                      </div>
                      <span className="material-symbols-outlined text-[#0369a1] text-[20px]">verified</span>
                    </div>
                  </div>
                </div>

                {/* Settlement Netting Impact */}
                <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container shadow-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-surface-container">
                    <div>
                      <h3 className="font-bold text-[14px] text-on-surface">Settlement Netting Impact</h3>
                      <p className="text-[11px] text-outline">Version 3.0 peer debt restructuring</p>
                    </div>
                    <span className="material-symbols-outlined text-secondary text-[18px]">alt_route</span>
                  </div>
                  <div className="mt-3.5 space-y-2.5">
                    <div className="p-3 rounded-xl bg-surface-bright border border-surface-container">
                      <div className="flex items-center justify-between gap-2 text-[12px]">
                        <div className="flex items-center gap-1.5 min-w-0 font-bold">
                          <span className="text-on-surface">Sarah J.</span>
                          <span className="material-symbols-outlined text-[15px] text-primary shrink-0">arrow_forward</span>
                          <span className="text-primary">Alex M.</span>
                        </div>
                        <span className="font-mono font-bold text-on-surface shrink-0">+{inr0(3320)}</span>
                      </div>
                      <span className="text-[11px] text-outline mt-1 block">Net settlement • v3.0</span>
                    </div>
                    <div className="p-3 rounded-xl bg-surface-bright border border-surface-container">
                      <div className="flex items-center justify-between gap-2 text-[12px]">
                        <div className="flex items-center gap-1.5 min-w-0 font-bold">
                          <span className="text-on-surface">Jason W.</span>
                          <span className="material-symbols-outlined text-[15px] text-primary shrink-0">arrow_forward</span>
                          <span className="text-primary">Alex M.</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-[10px] font-bold shrink-0">Auto</span>
                      </div>
                      <span className="text-[11px] text-outline mt-1 block">Auto-reconciled transfer</span>
                    </div>
                    <div className="p-3 rounded-xl bg-primary-fixed/70 border border-primary-fixed-dim/70">
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="text-on-primary-fixed-variant font-bold">Total Cabin Inflow</span>
                        <span className="font-mono font-extrabold text-on-primary-fixed-variant">{inr0(99600)}</span>
                      </div>
                      <p className="text-[11px] text-on-surface-variant mt-1">Instant bilateral debt compression eliminates 3 redundant circular transfers.</p>
                    </div>
                  </div>
                </div>

                {/* Dispute & Rollback Console */}
                <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container shadow-sm">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#ffe4e6] text-tertiary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[18px]">history_toggle_off</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-[14px] text-on-surface leading-snug">Dispute &amp; Rollback Console</h3>
                      <p className="text-[11px] text-outline mt-0.5">Non-destructive compensating revision</p>
                    </div>
                  </div>
                  <div className="mt-3.5 p-3 rounded-xl bg-surface-bright border border-surface-container space-y-2">
                    <div className="flex justify-between items-center text-[12px]">
                      <span className="font-medium text-on-surface-variant">Peer Consensus Threshold:</span>
                      <span className="font-bold text-on-surface">4 of 5 Required</span>
                    </div>
                    <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                      <div className="bg-secondary h-full rounded-full transition-all duration-300" style={{ width: `${(revertVotes / 4) * 100}%` }} />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-outline">
                      <span>{revertVotes} member{revertVotes > 1 ? "s" : ""} requested review</span>
                      <span>Threshold: 80%</span>
                    </div>
                  </div>
                  <button
                    className="w-full mt-3 py-2 px-3 rounded-xl bg-surface-container text-on-surface hover:bg-[#ffe4e6] hover:text-[#780021] text-[12px] font-bold border border-transparent transition-all flex items-center justify-center gap-1.5"
                    type="button"
                    onClick={requestRevert}
                  >
                    <span className="material-symbols-outlined text-[16px]">undo</span>
                    <span>Request Reversion to Selected</span>
                  </button>
                  <div className="mt-3 pt-2.5 border-t border-surface-container text-[11px] text-outline flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-container" />
                    <span>Dispute log: Zero active contested claims</span>
                  </div>
                </div>

                {/* Audit Compliance Seal */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-primary-fixed/60 to-secondary-fixed/60 border border-surface-container flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface-container-lowest flex items-center justify-center text-primary shadow-sm shrink-0">
                    <span className="material-symbols-outlined text-[22px]">shield_with_heart</span>
                  </div>
                  <div>
                    <span className="font-bold text-[12px] text-on-surface block">SOC2 Type II / ISO 27001</span>
                    <span className="text-[11px] text-on-surface-variant block mt-0.5">Zero-Knowledge cryptographic ledger certification verified.</span>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </main>

        {/* Toast */}
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 transition-all duration-300">
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