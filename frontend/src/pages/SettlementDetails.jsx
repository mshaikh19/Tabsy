import { useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import Breadcrumbs from "../components/layout/Breadcrumbs";

const inr = (n) => `₹${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const inr0 = (n) => `₹${Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

const TABS = [
  { id: "allocation", label: "Itemized Allocation & Invoices", icon: "receipt_long" },
  { id: "crypto", label: "Cryptographic Proof & Merkle Tree", icon: "enhanced_encryption" },
  { id: "signatures", label: "Peer Signatures & Escrow", icon: "draw" },
];

const ALLOCATIONS = [
  { icon: "bolt", title: "ConEd Electric & Gas (Sub-Meter Heating #4B)", tag: "OCR VERIFIED 99.4%", tagCls: "bg-primary-fixed/60 text-on-primary-fixed-variant", iconCls: "text-primary", detail: `Alex Chen 50% (${inr(2697.5)}) • Sarah Lin 50% (${inr(2697.5)}) of total ${inr(5395)} bill`, amount: inr(2697.5) },
  { icon: "router", title: "Gigabit Fiber Mesh Internet (Unit 4B)", tag: "MONTHLY RECURRING", tagCls: "bg-secondary-fixed text-on-secondary-fixed-variant", iconCls: "text-secondary", detail: `Alex Chen 50% (${inr(1867.5)}) • Sarah Lin 50% (${inr(1867.5)}) of total ${inr(3735)} bill`, amount: inr(1867.5) },
];

const AUDIT = [
  { time: "4:14 PM", title: "Settlement Initiated", body: `Alex Chen dispatched ${inr(4565)} payment intent via Apple Cash rail.` },
  { time: "4:16 PM", title: "FedNow / Apple Cash Cleared", body: "Apple Cash partner bank FedNow authorization confirmed." },
  { time: "4:18 PM", title: "Ledger Rebalanced", body: `Sarah Lin's balance zeroed out (${inr(0)}). Mutual loft debt closed.` },
  { time: "4:18 PM", title: "Block Appended", body: "Block committed to Tabsy Merkle Tree #98124.", last: true },
];

const REACTIONS = ["🙌 High Five! All sorted", "⚡ Thanks for restocking!", "🧾 Receipt saved"];

const MERKLE = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
const LEAF = "8f3b92c10a4e76d528b991ef24a08bc3e28491bb7";

export default function SettlementDetails() {
  const [tab, setTab] = useState("allocation");
  const [toast, setToast] = useState(null);
  const [copiedKey, setCopiedKey] = useState("");
  const [ping, setPing] = useState("");

  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(null), 2800);
  }

  function copy(key, value, label) {
    try {
      navigator.clipboard?.writeText(value);
    } catch {
      /* clipboard unavailable */
    }
    setCopiedKey(key);
    showToast(`${label} copied to clipboard`);
    setTimeout(() => setCopiedKey(""), 1600);
  }

  return (
    <AppLayout>
      <main className="w-full min-h-screen overflow-x-clip">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumbs
            items={[
              { label: "Balances", to: "/balances", icon: "account_balance_wallet" },
              { label: "Settlement History", to: "/settlement-history" },
              { label: "#STL-884920" },
            ]}
            status={{ label: "Live Synchronized Ledger Node #98124", note: "Mutual bilateral consent verified" }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* LEFT RAIL */}
            <div className="lg:col-span-7 min-w-0 flex flex-col gap-5">
              {/* Hero placard */}
              <div className="bg-surface-container-lowest border border-surface-container rounded-3xl p-6 sm:p-7 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                  <div className="flex items-start sm:items-center gap-4 min-w-0">
                    <div className="w-14 h-14 rounded-2xl bg-primary-fixed flex items-center justify-center shrink-0 text-primary">
                      <span className="material-symbols-outlined text-[34px]" style={{ fontVariationSettings: "'FILL' 1, 'wght' 700" }}>check_circle</span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h1 className="font-headline-sm text-headline-sm text-on-surface font-extrabold tracking-tight break-words">Settlement Successfully Cleared &amp; Verified</h1>
                        <span className="bg-primary-fixed text-on-primary-fixed text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider font-label-caps">FINALIZED</span>
                      </div>
                      <p className="text-body-sm text-on-surface-variant flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="font-medium">Cleared in 4 minutes</span>
                        <span className="text-outline-variant">•</span>
                        <span className="inline-flex items-center gap-1 text-primary font-semibold">
                          <span className="material-symbols-outlined text-[15px]">bolt</span>
                          Apple Cash Instant Rail
                        </span>
                        <span className="text-outline-variant">•</span>
                        <span>Feb 24, 2025 at 4:18 PM EST</span>
                      </p>
                    </div>
                  </div>
                  <div className="bg-surface-container-low border border-surface-container px-4 py-2.5 rounded-2xl shrink-0 flex sm:flex-col items-center sm:items-end justify-between gap-1">
                    <span className="text-[10px] text-on-surface-variant font-bold tracking-wider uppercase font-label-caps">Zero Network Fee</span>
                    <div className="flex items-baseline gap-1">
                      <span className="font-numeric-balance-lg text-2xl text-primary font-extrabold">{inr0(0)}</span>
                      <span className="text-[10px] text-on-surface-variant font-bold font-label-caps">INR</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-5 border-t border-surface-container flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <span className="text-[11px] text-on-surface-variant font-bold tracking-wider uppercase block font-label-caps">Total Net Settled</span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="font-display-hero text-4xl sm:text-5xl text-on-surface font-extrabold tracking-tight">{inr0(4565)}</span>
                      <span className="font-headline-md text-xl text-on-surface-variant font-semibold">INR</span>
                    </div>
                  </div>
                  <div className="bg-surface-container-low px-3 py-1.5 rounded-xl border border-surface-container flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[18px]">apartment</span>
                    <span className="font-title-md text-sm text-on-surface font-bold">Brooklyn Loft #4B</span>
                  </div>
                </div>
              </div>

              {/* Tab selector — icons for all, heading only on the active tab */}
              <div className="bg-surface-container-low p-1.5 rounded-2xl border border-surface-container flex items-center gap-1">
                {TABS.map((t) => {
                  const active = tab === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTab(t.id)}
                      title={t.label}
                      aria-label={t.label}
                      className={`flex items-center justify-center gap-1.5 py-2 rounded-xl transition-all font-title-md text-xs sm:text-sm ${
                        active
                          ? "flex-1 px-3 bg-surface-container-lowest text-on-surface font-bold shadow-sm"
                          : "px-3 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest/60 font-semibold"
                      }`}
                    >
                      <span className="material-symbols-outlined text-base shrink-0" style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}>{t.icon}</span>
                      {active && <span className="whitespace-nowrap break-words">{t.label}</span>}
                    </button>
                  );
                })}
              </div>

              {/* Panel: Allocation */}
              {tab === "allocation" && (
                <div className="bg-surface-container-lowest border border-surface-container rounded-3xl p-6 shadow-sm space-y-5">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div>
                      <h2 className="font-title-md text-base text-on-surface font-bold">Ledger Allocations (2 Invoices)</h2>
                      <p className="text-xs text-on-surface-variant">Bilateral balance split computed with zero decimal remainder</p>
                    </div>
                    <span className="text-[10px] bg-surface-container-high text-primary px-2.5 py-1 rounded-full font-bold uppercase font-label-caps">2 Items Reconciled</span>
                  </div>
                  {ALLOCATIONS.map((a) => (
                    <div key={a.title} className="bg-surface-container-low border border-surface-container rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-outline-variant transition-colors">
                      <div className="flex items-start gap-3.5 min-w-0">
                        <div className={`w-10 h-10 rounded-xl bg-surface-container-lowest border border-surface-container flex items-center justify-center shrink-0 ${a.iconCls}`}>
                          <span className="material-symbols-outlined text-[22px]">{a.icon}</span>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-title-md text-sm text-on-surface font-bold break-words">{a.title}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold flex items-center gap-1 font-label-caps ${a.tagCls}`}>
                              <span className="material-symbols-outlined text-[12px]">{a.icon === "bolt" ? "document_scanner" : "autorenew"}</span>
                              {a.tag}
                            </span>
                          </div>
                          <div className="text-xs text-on-surface-variant mt-1 break-words">{a.detail}</div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-numeric-balance-md text-base text-on-surface font-bold">{a.amount}</span>
                        <span className="text-[11px] text-on-surface-variant block">Settled portion</span>
                      </div>
                    </div>
                  ))}
                  <div className="bg-surface-container-high/60 border border-surface-container rounded-2xl px-5 py-3 flex items-center justify-between">
                    <span className="font-title-md text-sm text-on-surface font-bold">Combined Net Cleared</span>
                    <span className="font-numeric-balance-md text-lg text-primary font-extrabold">{inr0(4565)} INR</span>
                  </div>
                </div>
              )}

              {/* Panel: Crypto */}
              {tab === "crypto" && (
                <div className="bg-surface-container-lowest border border-surface-container rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h2 className="font-title-md text-base text-on-surface font-bold flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[20px]">enhanced_encryption</span>
                      Merkle Tree Proof &amp; Invariance Ledger
                    </h2>
                    <span className="text-[10px] bg-primary-fixed text-on-primary-fixed px-2 py-0.5 rounded-full font-bold font-label-caps">ED25519 VERIFIED</span>
                  </div>
                  <p className="text-xs text-on-surface-variant">
                    Every balance settlement is cryptographically anchored in the Tabsy state machine using double-hashed SHA-256 state tree leaves.
                  </p>
                  {[{ label: "Merkle Leaf #418902 Hash", value: LEAF, key: "leaf" }, { label: "SHA-256 Ledger Bond", value: MERKLE, key: "bond" }].map((r) => (
                    <div key={r.key} className="bg-surface-container-low rounded-2xl p-4 border border-surface-container space-y-1.5">
                      <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider font-label-caps">{r.label}</span>
                      <div className="bg-surface-container-lowest p-2.5 rounded-xl font-mono text-xs text-on-surface flex items-center justify-between gap-2 border border-surface-container">
                        <span className="break-all">{r.value}</span>
                        <button type="button" onClick={() => copy(r.key, r.value, "Hash")} className="text-xs text-primary font-bold shrink-0 font-label-caps">
                          {copiedKey === r.key ? "COPIED" : "COPY"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Panel: Signatures */}
              {tab === "signatures" && (
                <div className="bg-surface-container-lowest border border-surface-container rounded-3xl p-6 shadow-sm space-y-4">
                  <h2 className="font-title-md text-base text-on-surface font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">draw</span>
                    Peer Signatures &amp; Escrow Ledger
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 bg-surface-container-low rounded-2xl border border-surface-container">
                      <span className="text-[10px] text-on-surface-variant uppercase font-bold font-label-caps">Payer Digital Signature</span>
                      <div className="font-title-md text-sm text-on-surface font-bold mt-1">Alex Chen</div>
                      <div className="font-mono text-xs text-primary mt-1">0x4F12...99C2 [VERIFIED]</div>
                      <div className="text-[11px] text-on-surface-variant mt-1">Signed via biometric Secure Enclave</div>
                    </div>
                    <div className="p-3.5 bg-surface-container-low rounded-2xl border border-surface-container">
                      <span className="text-[10px] text-on-surface-variant uppercase font-bold font-label-caps">Payee Counter-Signature</span>
                      <div className="font-title-md text-sm text-on-surface font-bold mt-1">Sarah Lin</div>
                      <div className="font-mono text-xs text-primary mt-1">0x8B31...20A9 [VERIFIED]</div>
                      <div className="text-[11px] text-on-surface-variant mt-1">Direct clearing ack logged</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Peer flow node */}
              <div className="bg-surface-container-lowest border border-surface-container rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
                  <h2 className="font-title-md text-base text-on-surface font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[20px]">swap_horiz</span>
                    Peer Flow Node
                  </h2>
                  <span className="text-[10px] bg-surface-container-low text-on-surface-variant px-2.5 py-1 rounded-full font-bold font-label-caps">0% Slippage • Direct Node</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-11 items-center gap-3">
                  <div className="md:col-span-5 bg-surface-container-low p-4 rounded-2xl border border-surface-container">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider font-label-caps">Payer (Debited)</span>
                      <span className="bg-surface-container-highest text-on-surface-variant text-[10px] px-2 py-0.5 rounded-full font-bold font-label-caps">DEBITED</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-bold shrink-0">AC</div>
                      <div className="min-w-0">
                        <div className="font-title-md text-sm text-on-surface font-bold break-words">Alex Chen</div>
                        <div className="text-xs text-on-surface-variant">@alex_chen</div>
                      </div>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-surface-container text-xs text-on-surface-variant flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1 min-w-0">
                        <span className="material-symbols-outlined text-[15px] text-on-surface">account_balance</span>
                        <span className="break-words">Chase Checking ••••4019</span>
                      </span>
                      <span className="font-semibold text-on-surface shrink-0">Apple Cash</span>
                    </div>
                  </div>
                  <div className="md:col-span-1 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-primary-fixed text-primary flex items-center justify-center shadow-sm">
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </div>
                  </div>
                  <div className="md:col-span-5 bg-surface-container-low p-4 rounded-2xl border border-surface-container">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider font-label-caps">Payee (Credited)</span>
                      <span className="bg-primary-fixed text-on-primary-fixed text-[10px] px-2 py-0.5 rounded-full font-bold font-label-caps">CREDITED</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-secondary-fixed text-secondary flex items-center justify-center font-bold shrink-0">SL</div>
                      <div className="min-w-0">
                        <div className="font-title-md text-sm text-on-surface font-bold break-words">Sarah Lin</div>
                        <div className="text-xs text-on-surface-variant">@sarah_lin</div>
                      </div>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-surface-container text-xs text-on-surface-variant flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1 text-primary font-medium">
                        <span className="material-symbols-outlined text-[15px]">verified</span>
                        Roommate Balance
                      </span>
                      <span className="font-bold text-primary shrink-0">{inr0(0)} settled</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Compliance */}
              <div className="bg-surface-container-low border border-surface-container rounded-3xl p-5 sm:p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-surface-container-lowest border border-surface-container flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-[20px]">policy</span>
                  </div>
                  <h2 className="font-title-md text-sm text-on-surface font-bold">Verification &amp; Compliance Guarantee</h2>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  This bilateral transaction executes under Tabsy Automated Settlement Protocol v2.4. Funds routed via Apple Cash partner banking rails carry standard FDIC pass-through coverage. Double-entry state invariance guarantees zero floating debt between members. Non-taxable personal expense reimbursement compliant with IRS Reg. 1.6041-1.
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-semibold text-on-surface-variant">
                  <span className="bg-surface-container-lowest px-2.5 py-1 rounded-lg border border-surface-container">FDIC Pass-Through</span>
                  <span className="bg-surface-container-lowest px-2.5 py-1 rounded-lg border border-surface-container">Double-Entry Invariance</span>
                  <span className="bg-surface-container-lowest px-2.5 py-1 rounded-lg border border-surface-container">IRS Reg. 1.6041-1 Guaranteed</span>
                </div>
              </div>
            </div>

            {/* RIGHT RAIL */}
            <aside className="lg:col-span-5 min-w-0 flex flex-col gap-5">
              {/* Settlement pass */}
              <div className="bg-surface-container-lowest border border-surface-container rounded-3xl shadow-md overflow-hidden">
                <div className="bg-surface-container-high px-5 py-4 border-b border-surface-container flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-on-primary font-bold text-xs">T</div>
                    <div>
                      <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider block font-label-caps">Official Settlement Pass</span>
                      <span className="font-title-md text-xs text-on-surface font-extrabold">Certificate #STL-884920</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 bg-primary-fixed text-on-primary-fixed px-2 py-0.5 rounded-full text-[10px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    SEALED
                  </div>
                </div>
                <div className="p-6 space-y-5">
                  <div className="grid grid-cols-2 gap-4 pb-4 border-b border-surface-container">
                    {[
                      { l: "Initiation Rail", v: "Apple Cash Wire", mono: false },
                      { l: "Net Finality", v: `${inr0(4565)} INR`, primary: true },
                      { l: "Ledger Node", v: "US-East #98124", mono: true },
                      { l: "Mutual Consent", v: "100% Confirmed", primary: true },
                    ].map((d) => (
                      <div key={d.l}>
                        <span className="text-[10px] text-on-surface-variant uppercase font-bold font-label-caps">{d.l}</span>
                        <div className={`text-sm font-bold mt-0.5 break-words ${d.mono ? "font-mono text-xs font-medium text-on-surface" : d.primary ? "text-primary font-extrabold" : "text-on-surface"}`}>{d.v}</div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1 gap-2">
                      <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider font-label-caps">SHA-256 Merkle Root Proof</span>
                      {copiedKey === "merkle" && <span className="text-[10px] font-bold text-primary">Copied!</span>}
                    </div>
                    <div className="bg-surface-container-low border border-surface-container p-3 rounded-2xl flex items-center justify-between gap-2">
                      <span className="font-mono text-[11px] text-on-surface break-all select-all leading-snug">{MERKLE}</span>
                      <button type="button" onClick={() => copy("merkle", MERKLE, "Merkle root")} className="shrink-0 bg-surface-container-lowest hover:bg-surface-container border border-surface-container text-primary text-xs px-2.5 py-1.5 rounded-xl font-bold transition-all font-label-caps">
                        {copiedKey === "merkle" ? "COPIED" : "COPY"}
                      </button>
                    </div>
                  </div>

                  <div className="bg-surface-container-low/70 border border-surface-container p-3.5 rounded-2xl space-y-2">
                    <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider block font-label-caps">Ed25519 Mutual Signatures</span>
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="text-on-surface-variant font-medium">Alex Chen (Payer):</span>
                      <span className="font-mono text-[11px] font-bold text-on-surface">ed25519:4f12...99c2</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="text-on-surface-variant font-medium">Sarah Lin (Payee):</span>
                      <span className="font-mono text-[11px] font-bold text-on-surface">ed25519:8b31...20a9</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-dashed border-surface-container flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-[2px] h-9 w-full bg-surface-container-low p-1.5 rounded-lg border border-surface-container justify-center">
                        {[3, 1, 4, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2, 4, 1, 2, 3].map((w, i) => (
                          <span key={i} className="bg-on-surface" style={{ width: `${w}px`, height: "100%" }} />
                        ))}
                      </div>
                      <span className="font-mono text-[10px] text-on-surface-variant tracking-wider mt-1 block text-center">884920-US-98124</span>
                    </div>
                    <div className="w-14 h-14 bg-surface-container-low border border-surface-container rounded-xl p-1.5 shrink-0">
                      <div className="grid grid-cols-4 gap-0.5 w-full h-full">
                        {[1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1].map((c, i) => (
                          <span key={i} className={c ? "bg-on-surface rounded-sm" : "bg-transparent"} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action deck */}
              <div className="bg-surface-container-lowest border border-surface-container rounded-3xl p-5 shadow-sm space-y-2.5">
                <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider block mb-1 font-label-caps">Pass Command &amp; Export</span>
                <button type="button" onClick={() => showToast("Downloading official PDF settlement receipt")} className="w-full bg-primary hover:bg-on-primary-container text-on-primary py-3 px-4 rounded-2xl font-title-md text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all">
                  <span className="material-symbols-outlined text-[19px]">download</span>
                  Download Official PDF Receipt
                </button>
                <button type="button" onClick={() => showToast("Generating Apple Wallet Passbook file (.pkpass)")} className="w-full bg-on-surface hover:bg-inverse-surface text-surface py-3 px-4 rounded-2xl font-title-md text-sm font-semibold flex items-center justify-center gap-2 transition-all">
                  <span className="material-symbols-outlined text-[19px]">wallet</span>
                  Add to Apple Wallet / Passbook
                </button>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button type="button" onClick={() => showToast("Exporting JSON / Merkle state logs")} className="bg-surface-container-low hover:bg-surface-container border border-surface-container px-3 py-2.5 rounded-xl text-xs text-on-surface font-bold flex items-center justify-center gap-1.5 transition-colors">
                    <span className="material-symbols-outlined text-[16px]">data_object</span>
                    Export Merkle JSON
                  </button>
                  <button type="button" onClick={() => showToast("Opening dispute review panel")} className="bg-surface-container-low hover:bg-surface-container border border-surface-container px-3 py-2.5 rounded-xl text-xs text-error font-bold flex items-center justify-center gap-1.5 transition-colors">
                    <span className="material-symbols-outlined text-[16px]">report_problem</span>
                    Report Issue
                  </button>
                </div>
              </div>

              {/* Audit trail */}
              <div className="bg-surface-container-lowest border border-surface-container rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">history</span>
                    <h2 className="font-title-md text-sm text-on-surface font-bold">Chronological Audit Trail</h2>
                  </div>
                  <span className="text-[10px] bg-surface-container-low text-on-surface-variant px-2 py-0.5 rounded-full font-bold font-label-caps">4 Events</span>
                </div>
                <div className="flex flex-col">
                  {AUDIT.map((e, i) => {
                    const last = Boolean(e.last) || i === AUDIT.length - 1;
                    return (
                      <div key={e.title} className="flex gap-3">
                        <div className="flex flex-col items-center shrink-0">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border shadow-sm ${last ? "bg-primary text-on-primary border-primary" : "bg-surface-container-lowest border-surface-container-high text-primary"}`}>
                            {last ? <span className="material-symbols-outlined text-[15px]">check</span> : <span className="w-2 h-2 rounded-full bg-primary" />}
                          </div>
                          {!last && <div className="w-0.5 flex-1 bg-surface-container-high my-1 rounded-full" />}
                        </div>
                        <div className={`min-w-0 flex-1 ${last ? "pb-0" : "pb-5"} pt-1`}>
                          <div className="flex items-baseline justify-between gap-2">
                            <span className={`font-title-md text-xs font-bold break-words ${last ? "text-primary" : "text-on-surface"}`}>{e.title}</span>
                            <span className={`font-mono text-[10px] shrink-0 ${last ? "text-primary font-bold" : "text-on-surface-variant"}`}>{e.time}</span>
                          </div>
                          <p className="text-xs text-on-surface-variant mt-0.5 break-words leading-relaxed">{e.body}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick ping */}
              <div className="bg-surface-container-low border border-surface-container rounded-3xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider font-label-caps">Quick Roommate Ping</span>
                  {ping && <span className="text-[10px] text-primary font-bold break-words">Sent: {ping}</span>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {REACTIONS.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => { setPing(r); showToast(`Roommate ping sent: "${r}"`); }}
                      className="bg-surface-container-lowest hover:bg-surface-container-high border border-surface-container px-3 py-2 rounded-xl text-xs font-semibold text-on-surface flex items-center gap-1.5 transition-all"
                    >
                      <span>{r.split(" ")[0]}</span>
                      {r.split(" ").slice(1).join(" ")}
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-inverse-surface text-inverse-on-surface px-4 py-2.5 rounded-full shadow-2xl">
          <span className="material-symbols-outlined text-[18px] text-primary-fixed">check_circle</span>
          <span className="text-xs font-semibold">{toast}</span>
        </div>
      )}
    </AppLayout>
  );
}