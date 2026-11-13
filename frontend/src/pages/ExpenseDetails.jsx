import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";

const inr = (n) => `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const SETTLEMENT_NODES = [
  { initials: "MR", name: "Marco Rossi", method: "credit_card", methodLabel: "Apple Cash", amount: 16600, avatar: "bg-secondary-fixed text-on-secondary-fixed" },
  { initials: "SL", name: "Sarah Lin", method: "account_balance_wallet", methodLabel: "Venmo", amount: 16600, avatar: "bg-tertiary-fixed text-on-tertiary-fixed" },
  { initials: "KS", name: "Kim Sato", method: "sync_alt", methodLabel: "Tabsy Instant", amount: 16600, avatar: "bg-[#fef3c7] text-[#92400e]" },
  { initials: "JP", name: "Jason Powell", method: "account_balance", methodLabel: "Bank ACH", amount: 16600, avatar: "bg-[#e0e7ff] text-[#3730a3]" },
  { initials: "TE", name: "Taylor Evans", method: "account_balance_wallet", methodLabel: "Venmo • Completed reconciliation loop", amount: 16600, avatar: "bg-[#dcfce7] text-[#166534]" },
];

const BILL_ITEMS = [
  { name: "Northstar Chalet (4 Nights)", sub: "4 nights @ ₹19,920.00/night", amount: 79680, pct: "80.0%", bar: "bg-primary" },
  { name: "Cleaning & Linen Turnover Service", sub: "Hot tub mid-stay sanitize + eco turnover fee", amount: 11620, pct: "11.7%", bar: "bg-secondary" },
  { name: "Tahoe County Occupancy Tax", sub: "Municipal Transient Occupancy Tax (8.5% Base rate)", amount: 8300, pct: "8.3%", bar: "bg-[#f59e0b]" },
];

const AUDIT_EVENTS = [
  { time: "Feb 16 • 11:20 AM", title: "Taylor Evans settled share • Ledger Balanced", desc: "Venmo transaction confirmed. All 5 debt obligations closed.", detail: "TxID: #VN-8849-TE • Auto-cleared in group reconciliation ledger.", dot: "bg-primary-container" },
  { time: "Feb 15 • 1:40 PM", title: "Jason Powell settled share", desc: "Bank ACH payment matched and marked cleared.", detail: "ACH Trace #ACH-44102-JP • Settlement verified via Plaid integration.", dot: "bg-primary" },
  { time: "Feb 15 • 9:10 AM", title: "Kim Sato settled share", desc: "Tabsy Instant in-app balance transfer credited.", detail: "Tabsy Internal Transfer #TB-99120-KS • Zero processing fees.", dot: "bg-primary" },
  { time: "Feb 14 • 5:45 PM", title: "Sarah Lin settled share", desc: "Venmo payment acknowledged by host Alex Morgan.", detail: "Receipt match confirmed via notification webhook.", dot: "bg-primary" },
  { time: "Feb 14 • 3:30 PM", title: "Marco Rossi settled share", desc: "Apple Cash peer transfer settled instantly.", detail: "Apple Cash ref #AC-2931-MR • Auto-cleared by Alex Morgan.", dot: "bg-primary" },
  { time: "Feb 14 • 2:18 PM", title: "Split configuration locked", desc: "Equal 6-way split confirmed by group consensus.", detail: "Split Ratio: 16.666% per participant (₹16,600.00 exact).", dot: "bg-secondary" },
  { time: "Feb 14 • 2:16 PM", title: "Receipt OCR Diff completed", desc: "3 items recognized with 100% confidence match.", detail: "Parser model: Tabsy-Vision-v4.2 • Zero character mismatches.", dot: "bg-secondary-fixed-dim" },
  { time: "Feb 14 • 2:15 PM", title: "Expense created by Alex Morgan", desc: "Assigned to 'Tahoe Ski Weekend ❄️' pool.", detail: "Original Transaction: Chase Sapphire Reserve • Auth code #CSR-77821.", dot: "bg-surface-container-high" },
];

const OCR_ROWS = [
  { extracted: "Chalet 4-Nights: ₹79,680.00", mapped: "Matched (₹79,680.00)" },
  { extracted: "Linen / Clean: ₹11,620.00", mapped: "Matched (₹11,620.00)" },
  { extracted: "Tax TOT (8.5%): ₹8,300.00", mapped: "Matched (₹8,300.00)" },
];

const PROOFS = [
  { name: "Marco Rossi (Apple Cash)", token: "Proof Token #AC-992-01" },
  { name: "Sarah Lin (Venmo)", token: "Proof Token #VN-311-88" },
  { name: "Kim Sato (Tabsy Pay)", token: "Proof Token #TB-402-KS" },
];

const DECK_TABS = [
  { id: "audit", label: "Audit Log" },
  { id: "ocr", label: "Receipt OCR Diff" },
  { id: "proof", label: "Settlement Proofs" },
];

export default function ExpenseDetails() {
  const navigate = useNavigate();
  const [deckTab, setDeckTab] = useState("audit");
  const [openEvents, setOpenEvents] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState(null);

  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(null), 2800);
  }

  function toggleEvent(i) {
    setOpenEvents((prev) => ({ ...prev, [i]: !prev[i] }));
  }

  function copyText(text, message) {
    try {
      navigator.clipboard.writeText(text);
    } catch {
      /* clipboard unavailable */
    }
    showToast(message);
  }

  return (
    <AppLayout>
      <div className="bg-background font-body-md text-on-surface antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
        <main className="w-full pt-4 pb-16 bg-background min-h-screen">
          <div className="max-w-[1360px] w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
            {/* Breadcrumbs & Meta Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs">
                <Link className="text-on-surface-variant hover:text-on-surface flex items-center gap-1 font-medium transition-colors" to="/expenses">
                  <span className="material-symbols-outlined text-[15px]">receipt_long</span>
                  Expenses
                </Link>
                <span className="material-symbols-outlined text-[13px] text-outline">chevron_right</span>
                <Link className="text-on-surface-variant hover:text-on-surface font-medium transition-colors flex items-center gap-1" to="/group-details">
                  <span>❄️</span> Tahoe Ski Weekend
                </Link>
                <span className="material-symbols-outlined text-[13px] text-outline">chevron_right</span>
                <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-mono font-medium text-[11px]">#TH-EXP-402</span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#e8f7f0] text-primary text-[11px] font-semibold border border-primary/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Live Studio View
                </span>
              </nav>
              <div className="flex items-center gap-2 text-xs text-outline">
                <span className="material-symbols-outlined text-[16px] text-primary">verified_user</span>
                <span>
                  Ledger Hash: <strong className="font-mono text-on-surface text-[11px]">#a89f-c402</strong>
                </span>
              </div>
            </div>

            {/* Hero Card */}
            <section className="rounded-3xl bg-surface-container-lowest border border-surface-container p-6 lg:p-8 shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-5 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-2xl bg-secondary-fixed text-on-secondary-fixed text-xs font-semibold border border-secondary/15">
                      <span className="text-sm">🏡</span> Lodging
                    </span>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-2xl bg-surface-variant text-on-surface-variant text-xs font-semibold">
                      <span>❄️</span> Tahoe Ski Weekend
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-2xl bg-[#fef3c7] text-[#92400e] text-xs font-semibold">
                      <span className="text-xs">📍</span> Olympic Valley
                    </span>
                  </div>
                  <h1 className="font-headline-lg text-2xl lg:text-3xl font-extrabold text-on-surface tracking-tight leading-tight">
                    Palisades Alpine Chalet &amp; Loft Rental
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-outline pt-0.5">
                    <span className="flex items-center gap-1.5 text-on-surface-variant font-medium">
                      <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
                      Paid &amp; verified by <strong>Alex Morgan (You)</strong>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">schedule</span>
                      Feb 14, 2025 • 2:15 PM PST
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-4 flex flex-col items-start lg:items-center justify-center py-3 px-4 lg:px-6 lg:border-x lg:border-surface-container">
                  <div className="text-[11px] uppercase font-bold tracking-wider text-outline mb-1">Total Expense Spend</div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display-hero text-4xl lg:text-5xl font-extrabold text-on-surface tracking-tight">
                      ₹99,600<span className="text-2xl text-outline font-semibold">.00</span>
                    </span>
                    <span className="text-xs font-semibold text-outline">INR</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#e8f7f0] text-primary text-xs font-bold border border-primary/20">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" /> Fully Balanced
                    </span>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container-high text-on-surface text-xs font-semibold">
                      ₹16,600.00 / pax • 6 Shares
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-3 flex flex-col justify-center gap-2">
                  <div className="flex items-stretch gap-2">
                    <button
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-surface-container-low hover:bg-surface-container text-on-surface font-title-md text-xs font-bold transition-all border border-surface-container"
                      type="button"
                      onClick={() => showToast("Downloading PDF Statement…")}
                    >
                      <span className="material-symbols-outlined text-[17px] text-secondary">download</span>
                      <span>Download PDF</span>
                    </button>
                    <button
                      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-primary-fixed hover:bg-primary-fixed-dim text-on-primary-fixed-variant font-title-md text-xs font-bold transition-all border border-primary-fixed-dim/60"
                      type="button"
                      onClick={() => navigate("/expense-history")}
                      title="View expense version history"
                    >
                      <span className="material-symbols-outlined text-[17px]">history</span>
                      <span>History</span>
                    </button>
                  </div>
                  <div className="flex items-stretch gap-2">
                    <button
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-2xl bg-surface-container-low hover:bg-surface-container text-on-surface font-title-md text-xs font-semibold transition-all border border-surface-container"
                      type="button"
                      onClick={() => navigate("/split-expense")}
                      title="Adjust split weights"
                    >
                      <span className="material-symbols-outlined text-[17px] text-primary">pie_chart</span>
                      <span>Split Rules</span>
                    </button>
                    <button
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-2xl bg-secondary-fixed hover:bg-secondary-fixed-dim text-on-secondary-fixed-variant font-title-md text-xs font-bold transition-all"
                      type="button"
                      onClick={() => navigate("/expense-edit")}
                    >
                      <span className="material-symbols-outlined text-[17px]">edit</span>
                      <span>Edit</span>
                    </button>
                    <div className="relative shrink-0">
                      <button
                        aria-expanded={menuOpen}
                        aria-label="More expense actions"
                        className="h-full w-10 rounded-2xl bg-surface-container-low hover:bg-surface-container text-on-surface-variant flex items-center justify-center transition-colors border border-surface-container"
                        type="button"
                        onClick={() => setMenuOpen((v) => !v)}
                      >
                        <span className="material-symbols-outlined text-[18px]">more_vert</span>
                      </button>
                      {menuOpen && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                          <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest rounded-2xl shadow-xl py-1.5 z-50 border border-surface-container">
                            <button
                              className="w-full text-left px-3.5 py-2 text-xs font-medium text-on-surface hover:bg-surface-container-low flex items-center gap-2"
                              type="button"
                              onClick={() => {
                                copyText("https://tabsy.me/expense/TH-EXP-402", "Unique URL copied!");
                                setMenuOpen(false);
                              }}
                            >
                              <span className="material-symbols-outlined text-[16px] text-primary">link</span> Share Expense Link
                            </button>
                            <button
                              className="w-full text-left px-3.5 py-2 text-xs font-medium text-on-surface hover:bg-surface-container-low flex items-center gap-2"
                              type="button"
                              onClick={() => {
                                showToast("Duplicate created in Drafts");
                                setMenuOpen(false);
                              }}
                            >
                              <span className="material-symbols-outlined text-[16px]">content_copy</span> Duplicate Expense
                            </button>
                            <div className="h-px bg-surface-container my-1" />
                            <button
                              className="w-full text-left px-3.5 py-2 text-xs font-medium text-on-surface hover:bg-surface-container-low flex items-center gap-2"
                              type="button"
                              onClick={() => {
                                setMenuOpen(false);
                                navigate("/expense-delete");
                              }}
                            >
                              <span className="material-symbols-outlined text-[16px] text-error">delete</span> Delete Expense
                            </button>
                            <button
                              className="w-full text-left px-3.5 py-2 text-xs font-medium text-error hover:bg-error-container/30 flex items-center gap-2"
                              type="button"
                              onClick={() => {
                                showToast("Report filed with moderation");
                                setMenuOpen(false);
                              }}
                            >
                              <span className="material-symbols-outlined text-[16px]">flag</span> Report Discrepancy
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Dual Deck */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Deck 1: Visual Flow & Breakdown */}
              <div className="lg:col-span-6 flex flex-col gap-6">
                <div className="rounded-3xl bg-surface-container-lowest border border-surface-container p-6 shadow-sm space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-2xl bg-[#e8f7f0] text-primary flex items-center justify-center font-bold">
                        <span className="material-symbols-outlined text-[18px]">hub</span>
                      </div>
                      <div>
                        <h2 className="font-headline-sm text-base font-bold text-on-surface">Visual Settlement Flow Studio</h2>
                        <p className="text-xs text-outline">Real-time reimbursement distribution node topology</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed text-[11px] font-bold">
                      100% Repaid (₹83,000 / ₹83,000)
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-surface-container-low/70 border border-surface-container/60 space-y-4">
                    <div className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-container-lowest border border-primary/30 shadow-xs">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-11 h-11 rounded-2xl bg-primary text-on-primary flex items-center justify-center font-title-md font-bold text-sm shadow-xs">AM</div>
                          <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-primary-container text-on-primary flex items-center justify-center text-[10px] font-bold">★</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-title-md text-sm font-bold text-on-surface">Alex Morgan</span>
                            <span className="px-2 py-0.5 rounded-md bg-[#e8f7f0] text-primary text-[10px] font-bold uppercase tracking-wider">Host &amp; Payer</span>
                          </div>
                          <div className="text-xs text-outline">Fronted total charge ₹99,600.00 • Chase Sapphire</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-numeric-balance-md text-xs font-bold text-tertiary">Net: -₹16,600.00</span>
                        <div className="text-[11px] text-outline font-medium">Reimbursed +₹83,000</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 py-1 text-xs text-outline font-medium">
                      <div className="h-px bg-surface-container flex-1" />
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-on-surface-variant bg-surface-container-lowest px-3 py-1 rounded-full border border-surface-container">
                        <span className="material-symbols-outlined text-[14px] text-primary">arrow_downward</span>
                        Disbursed equal obligation (₹16,600.00 ea)
                      </span>
                      <div className="h-px bg-surface-container flex-1" />
                    </div>

                    <div className="grid grid-cols-1 gap-2.5">
                      {SETTLEMENT_NODES.map((n) => (
                        <div
                          key={n.initials}
                          className="p-3 rounded-2xl bg-surface-container-lowest border border-surface-container flex items-center justify-between gap-3 hover:border-primary-container transition-all"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className={`w-9 h-9 rounded-xl ${n.avatar} flex items-center justify-center font-bold text-xs shrink-0`}>{n.initials}</div>
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-on-surface truncate">{n.name}</div>
                              <div className="text-[11px] text-outline flex items-center gap-1 min-w-0">
                                <span className="material-symbols-outlined text-[12px] text-primary shrink-0">{n.method}</span>
                                <span className="truncate">{n.methodLabel}</span>
                              </div>
                            </div>
                          </div>
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#e8f7f0] text-primary text-[11px] font-bold shrink-0">
                            <span className="material-symbols-outlined text-[12px]">check</span> {inr(n.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs px-3 py-2.5 rounded-2xl bg-[#f0fdf4] border border-[#bbf7d0] text-[#166534]">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      All 5 channels reconciled with 0 friction
                    </span>
                    <button className="font-bold underline hover:text-primary" type="button" onClick={() => showToast("Reimbursement route map exported")}>
                      Export Routing
                    </button>
                  </div>
                </div>

                <div className="rounded-3xl bg-surface-container-lowest border border-surface-container p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-1">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-2xl bg-secondary-fixed text-secondary flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px]">receipt</span>
                      </div>
                      <div>
                        <h3 className="font-headline-sm text-base font-bold text-on-surface">Itemized Bill Breakdown</h3>
                        <p className="text-xs text-outline">Verified invoice decomposition with cost weights</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface">3 Sub-components</span>
                  </div>

                  <div className="space-y-3 pt-1">
                    {BILL_ITEMS.map((item) => (
                      <div key={item.name} className="p-3.5 rounded-2xl bg-surface-container-low/60 border border-surface-container/50 space-y-2">
                        <div className="flex items-center justify-between text-xs gap-3">
                          <div className="min-w-0">
                            <span className="font-bold text-on-surface text-sm block">{item.name}</span>
                            <span className="text-outline text-xs block">{item.sub}</span>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="font-mono font-bold text-sm text-on-surface">{inr(item.amount)}</span>
                            <span className="text-[11px] text-outline block">{item.pct} of total</span>
                          </div>
                        </div>
                        <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                          <div className={`${item.bar} h-1.5 rounded-full`} style={{ width: item.pct }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3.5 rounded-2xl bg-surface-container-low flex items-center justify-between text-xs font-semibold">
                    <span className="text-on-surface">Sum Total Recorded</span>
                    <span className="font-numeric-balance-lg text-lg font-extrabold text-primary">₹99,600.00</span>
                  </div>
                </div>

                <div className="rounded-3xl bg-surface-container-lowest border border-surface-container p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-2xl bg-[#fef3c7] text-[#92400e] flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px]">key</span>
                      </div>
                      <h3 className="font-headline-sm text-base font-bold text-on-surface">Property Access &amp; Logistics</h3>
                    </div>
                    <button
                      className="text-xs text-primary font-bold hover:underline"
                      type="button"
                      onClick={() => copyText("Keycode: 7492# • WiFi: TahoeChalet_5G / ski2025", "Access notes & WiFi credentials copied to clipboard")}
                    >
                      Copy All Details
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-2xl bg-surface-container-low/70 border border-surface-container/50">
                      <div className="text-outline font-medium text-[11px] uppercase tracking-wider mb-1">Front Door Keycode</div>
                      <div className="font-mono text-base font-bold text-on-surface flex items-center justify-between">
                        <span>7492#</span>
                        <button aria-label="Copy keycode" className="text-outline hover:text-on-surface" type="button" onClick={() => copyText("7492#", "Keycode copied: 7492#")}>
                          <span className="material-symbols-outlined text-[16px]">content_copy</span>
                        </button>
                      </div>
                    </div>
                    <div className="p-3 rounded-2xl bg-surface-container-low/70 border border-surface-container/50">
                      <div className="text-outline font-medium text-[11px] uppercase tracking-wider mb-1">High-Speed WiFi</div>
                      <div className="font-mono text-xs font-bold text-on-surface flex items-center justify-between gap-2">
                        <span className="truncate">TahoeChalet_5G / ski2025</span>
                        <button aria-label="Copy WiFi password" className="text-outline hover:text-on-surface shrink-0" type="button" onClick={() => copyText("TahoeChalet_5G / ski2025", "WiFi password copied")}>
                          <span className="material-symbols-outlined text-[16px]">wifi</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-surface-container-low text-xs text-on-surface-variant leading-relaxed">
                    <span className="font-bold text-on-surface block mb-0.5">Check-in Note:</span>
                    "Direct chalet booking for 4-day ski pass access. Check-in Feb 14 at 4:00 PM PST. Hot tub service scheduled Saturday at 11 AM."
                  </div>
                </div>
              </div>

              {/* Deck 2: Audit Journal */}
              <div className="lg:col-span-6">
                <div className="rounded-3xl bg-surface-container-lowest border border-surface-container p-6 shadow-sm space-y-5">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-surface-container">
                    <div>
                      <h2 className="font-headline-sm text-base font-bold text-on-surface">Audit Journal &amp; Explorer</h2>
                      <p className="text-xs text-outline">Immutable ledger events &amp; proof certification</p>
                    </div>
                    <div className="inline-flex p-1 rounded-2xl bg-surface-container-low border border-surface-container text-xs font-semibold">
                      {DECK_TABS.map((t) => (
                        <button
                          key={t.id}
                          className={`px-3 py-1.5 rounded-xl transition-all ${
                            deckTab === t.id ? "bg-surface-container-lowest text-on-surface shadow-xs" : "text-outline hover:text-on-surface"
                          }`}
                          type="button"
                          onClick={() => setDeckTab(t.id)}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {deckTab === "audit" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-on-surface">Timestamped Ledger Chronology</span>
                        <span className="text-outline text-[11px]">8 Verified Events</span>
                      </div>
                      <div className="relative pl-6 space-y-3.5 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-surface-container">
                        {AUDIT_EVENTS.map((e, i) => {
                          const open = !!openEvents[i];
                          return (
                            <div key={e.time} className="relative group cursor-pointer" onClick={() => toggleEvent(i)}>
                              <div className={`absolute -left-6 top-1 w-4 h-4 rounded-full ${e.dot} border-2 border-surface-container-lowest`} />
                              <div className="p-3 rounded-2xl bg-surface-container-low/70 border border-surface-container hover:bg-surface-container transition-colors">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-xs font-bold text-on-surface">{e.title}</span>
                                  <span className="text-[11px] font-mono text-outline shrink-0">{e.time}</span>
                                </div>
                                <div className="text-xs text-on-surface-variant mt-0.5">{e.desc}</div>
                                {open && (
                                  <div className="text-[11px] text-primary mt-2 pt-2 border-t border-surface-container font-mono">{e.detail}</div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {deckTab === "ocr" && (
                    <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary text-[20px]">document_scanner</span>
                          <span className="text-xs font-bold text-on-surface">Smart OCR Line Item Matching</span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#e8f7f0] text-primary text-[11px] font-bold">100% Match</span>
                      </div>
                      <div className="space-y-2 text-xs font-mono">
                        {OCR_ROWS.map((row) => (
                          <div key={row.extracted} className="p-2.5 rounded-xl bg-surface-container-lowest border border-surface-container flex items-center justify-between gap-3">
                            <div>
                              <span className="text-outline text-[11px] block">Extracted from PDF</span>
                              <span className="text-on-surface font-semibold">{row.extracted}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-outline text-[11px] block">Ledger Mapped</span>
                              <span className="text-primary font-bold">{row.mapped} ✓</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {deckTab === "proof" && (
                    <div className="space-y-2.5">
                      {PROOFS.map((p) => (
                        <div key={p.token} className="p-3.5 rounded-2xl bg-surface-container-low border border-surface-container flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-secondary text-[20px]">badge</span>
                            <div>
                              <span className="font-bold text-on-surface block">{p.name}</span>
                              <span className="text-[11px] text-outline font-mono">{p.token}</span>
                            </div>
                          </div>
                          <button
                            className="px-2.5 py-1 rounded-xl bg-surface-container-lowest hover:bg-surface-container font-semibold text-[11px]"
                            type="button"
                            onClick={() => showToast(`Viewing ${p.name.split(" ")[0]}'s settlement receipt`)}
                          >
                            View Slip
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs relative overflow-hidden">
                    <div className="flex items-start justify-between gap-2 border-b border-surface-container pb-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-surface-container-low flex items-center justify-center text-secondary">
                          <span className="material-symbols-outlined text-[22px]">picture_as_pdf</span>
                        </div>
                        <div>
                          <div className="font-bold text-xs text-on-surface">Chalet_Booking_Confirmation.pdf</div>
                          <div className="text-[11px] text-outline">1.4 MB • Airbnb Res #HM499A2</div>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#e8f7f0] text-primary text-[10px] font-bold uppercase tracking-wider">
                        <span className="material-symbols-outlined text-[13px]">verified</span> Proof Sealed
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs bg-surface-container-low/60 p-3 rounded-xl">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-outline tracking-wider block">Cryptographic Hash</span>
                        <span className="font-mono text-[11px] text-on-surface font-semibold">sha256: 88c2e9a0...39df</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          className="px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs transition-colors flex items-center gap-1"
                          type="button"
                          onClick={() => showToast("Opening PDF Document…")}
                        >
                          <span className="material-symbols-outlined text-[14px]">visibility</span> Preview
                        </button>
                        <button
                          aria-label="Download receipt PDF"
                          className="w-8 h-8 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface flex items-center justify-center transition-colors"
                          type="button"
                          onClick={() => showToast("Download initialized: Chalet_Booking_Confirmation.pdf")}
                        >
                          <span className="material-symbols-outlined text-[16px]">download</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-surface-container">
                    <button
                      className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold transition-colors"
                      type="button"
                      onClick={() => copyText("https://tabsy.me/proof/TH-EXP-402", "Public shareable proof link copied!")}
                    >
                      <span className="material-symbols-outlined text-[15px] text-primary">share</span>
                      <span>Share Receipt Link</span>
                    </button>
                    <button
                      className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold transition-colors"
                      type="button"
                      onClick={() => showToast("Audit Certificate generated successfully")}
                    >
                      <span className="material-symbols-outlined text-[15px] text-secondary">verified</span>
                      <span>Generate Audit Certificate</span>
                    </button>
                    <button
                      className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-error text-xs font-semibold transition-colors"
                      type="button"
                      onClick={() => showToast("Record safely moved to archive")}
                    >
                      <span className="material-symbols-outlined text-[15px]">inventory_2</span>
                      <span>Archive Record</span>
                    </button>
                  </div>
                </div>
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