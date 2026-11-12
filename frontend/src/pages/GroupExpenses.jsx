import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import GroupHeader from "../components/layout/GroupHeader";

export default function GroupExpenses() {
  const [activeView, setActiveView] = useState(() => {
    try {
      return localStorage.getItem("tabsy:groupExpensesView") || "ledger";
    } catch {
      return "ledger";
    }
  });
  let onlyMissingFilterActive = false;

  function switchView(view) {
    if (activeView === view) return;
    setActiveView(view);
    try {
      localStorage.setItem("tabsy:groupExpensesView", view);
    } catch {}
  }

  function toggleLedgerShareDetails(id) {
    const el = document.getElementById(id);
    if (el) el.classList.toggle("hidden");
  }

  function applyDynamicSearch(query) {
    const q = (query || "").toLowerCase();
    const rows = document.querySelectorAll(".ledger-item");
    let visible = 0;
    rows.forEach((row) => {
      const text = row.innerText.toLowerCase();
      const matchesQuery = text.includes(q);
      const isMissing = row.getAttribute("data-missing") === "true";
      const matchesMissing = !onlyMissingFilterActive || isMissing;
      if (matchesQuery && matchesMissing) {
        row.style.display = "";
        visible++;
      } else {
        row.style.display = "none";
      }
    });
    const badge = document.getElementById("ledgerCountBadge");
    if (badge) badge.innerText = visible + " Records";
  }

  function setPayerQuickFilter(type, btn) {
    document.querySelectorAll(".payer-btn").forEach((b) => {
      b.classList.remove(
        "bg-surface-container-lowest",
        "text-on-surface",
        "shadow-sm",
        "font-semibold"
      );
      b.classList.add("text-on-surface-variant", "font-medium");
    });
    btn.classList.add(
      "bg-surface-container-lowest",
      "text-on-surface",
      "shadow-sm",
      "font-semibold"
    );
    btn.classList.remove("text-on-surface-variant", "font-medium");
    const rows = document.querySelectorAll(".ledger-item");
    let visible = 0;
    rows.forEach((row) => {
      const payer = row.getAttribute("data-payer");
      if (type === "all" || payer === type) {
        row.style.display = "";
        visible++;
      } else {
        row.style.display = "none";
      }
    });
    const badge = document.getElementById("ledgerCountBadge");
    if (badge) badge.innerText = visible + " Records";
  }

  function toggleMissingFilter(btn) {
    onlyMissingFilterActive = !onlyMissingFilterActive;
    if (onlyMissingFilterActive) {
      btn.classList.remove("bg-surface-container-low", "text-on-surface-variant");
      btn.classList.add("bg-error-container", "text-on-error-container", "font-semibold");
    } else {
      btn.classList.add("bg-surface-container-low", "text-on-surface-variant");
      btn.classList.remove("bg-error-container", "text-on-error-container", "font-semibold");
    }
    const input = document.getElementById("interactiveSearchInput");
    applyDynamicSearch(input ? input.value : "");
  }

  function previewReceipt(title, amt) {
    const t = document.getElementById("receiptModalTitle");
    const a = document.getElementById("receiptModalAmount");
    const m = document.getElementById("receiptPreviewModal");
    if (t) t.innerText = title;
    if (a) a.innerText = amt;
    if (m) m.classList.remove("hidden");
  }

  function closeReceiptPreview() {
    const m = document.getElementById("receiptPreviewModal");
    if (m) m.classList.add("hidden");
  }

  useEffect(() => {
    const ledgerContainer = document.getElementById("ledgerViewContainer");
    const kanbanContainer = document.getElementById("kanbanViewContainer");
    const glider = document.getElementById("viewPillGlider");
    const ledgerBtn = document.getElementById("ledgerViewBtn");
    const kanbanBtn = document.getElementById("kanbanViewBtn");

    if (activeView === "ledger") {
      if (glider) { glider.style.left = "4px"; glider.style.width = "132px"; }
      if (ledgerBtn) { ledgerBtn.classList.add("text-on-surface", "font-semibold"); ledgerBtn.classList.remove("text-on-surface-variant", "font-medium"); }
      if (kanbanBtn) { kanbanBtn.classList.remove("text-on-surface", "font-semibold"); kanbanBtn.classList.add("text-on-surface-variant", "font-medium"); }
      if (kanbanContainer) { kanbanContainer.classList.add("opacity-0", "translate-y-3", "hidden"); }
      if (ledgerContainer) { ledgerContainer.classList.remove("hidden", "opacity-0", "translate-y-3"); ledgerContainer.classList.add("opacity-100", "translate-y-0"); }
    } else {
      if (glider) { glider.style.left = "136px"; glider.style.width = "140px"; }
      if (kanbanBtn) { kanbanBtn.classList.add("text-on-surface", "font-semibold"); kanbanBtn.classList.remove("text-on-surface-variant", "font-medium"); }
      if (ledgerBtn) { ledgerBtn.classList.remove("text-on-surface", "font-semibold"); ledgerBtn.classList.add("text-on-surface-variant", "font-medium"); }
      if (ledgerContainer) { ledgerContainer.classList.remove("opacity-100", "translate-y-0"); ledgerContainer.classList.add("opacity-0", "translate-y-3", "hidden"); }
      if (kanbanContainer) { kanbanContainer.classList.remove("hidden", "opacity-0", "translate-y-3"); kanbanContainer.classList.add("opacity-100", "translate-y-0"); }
    }
  }, [activeView]);

  useEffect(() => {
    window.switchView = switchView;
    window.toggleLedgerShareDetails = toggleLedgerShareDetails;
    window.applyDynamicSearch = applyDynamicSearch;
    window.setPayerQuickFilter = setPayerQuickFilter;
    window.toggleMissingFilter = toggleMissingFilter;
    window.previewReceipt = previewReceipt;
    window.closeReceiptPreview = closeReceiptPreview;
  }, []);

  return (
    <AppLayout>
      <div className="bg-background font-body-md text-on-surface antialiased overflow-x-clip max-w-[100vw]">
        <style>{`
          @layer base {
            html, body { margin: 0; padding: 0; }
            body { overscroll-behavior: none; }
            main > :first-child { margin-top: 0 !important; }
            main > :last-child { margin-bottom: 0 !important; }
          }
          ::-webkit-scrollbar { display: none; }
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>

        {/* Main Container */}
        <main className="w-full bg-background">
          <div className="flex flex-col w-full">
              <div className="max-w-7xl w-full mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop">
                <GroupHeader
                title="Tahoe Ski Weekend ❄️"
                subtitle="6 friends shredding Heavenly & Kirkwood. Cabin split, collective grocery pool, and simplified end-of-trip payouts."
                currentLabel="Group Expenses"
                actions={
                  <>
                    <Link className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-secondary-container text-on-secondary-container font-title-md text-title-md shadow-sm hover:opacity-95 active:scale-95 transition-all" to="/group-members">
                      <span className="material-symbols-outlined text-[18px]">group</span>
                      View Members
                    </Link>
                    <button className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-secondary text-on-secondary font-title-md text-title-md shadow-sm hover:opacity-95 active:scale-95 transition-all" type="button">
                      <span className="material-symbols-outlined text-[18px]">bolt</span>
                      Settle Balances
                    </button>
                    <button className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface-container-high text-on-surface font-title-md text-title-md hover:bg-surface-variant active:scale-95 transition-all" type="button">
                      <span className="material-symbols-outlined text-[18px]">group_add</span>
                      Invite Friends
                    </button>
                  </>
                }
              />
              </div>
            {/* Key Metrics Strip */}
            <section className="max-w-7xl w-full mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop mt-space-md">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-sm">
                <div className="bg-surface-container-lowest p-space-md rounded-2xl border border-outline-variant/60 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider">Expedition Spend</span>
                    <div className="w-7 h-7 rounded-lg bg-surface-container-low text-on-surface-variant flex items-center justify-center">
                      <span className="material-symbols-outlined text-[16px]">payments</span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-numeric-balance-lg text-numeric-balance-lg text-on-surface tracking-tight">$2,880.00</span>
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 font-body-sm text-body-sm text-on-surface-variant">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
                    <span>8 ledger items recorded</span>
                  </div>
                </div>
                <div className="bg-surface-container-lowest p-space-md rounded-2xl border border-outline-variant/60 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider">Your Outlay</span>
                    <div className="w-7 h-7 rounded-lg bg-surface-container-low text-on-surface-variant flex items-center justify-center">
                      <span className="material-symbols-outlined text-[16px]">account_balance_wallet</span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-numeric-balance-lg text-numeric-balance-lg text-on-surface tracking-tight">$980.00</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">upfront</span>
                  </div>
                  <div className="mt-1 font-body-sm text-body-sm text-on-surface-variant">2 major bills paid directly by you</div>
                </div>
                <div className="bg-surface-container-lowest p-space-md rounded-2xl border border-outline-variant/60 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps uppercase text-primary font-bold tracking-wider">Net Position</span>
                    <div className="w-7 h-7 rounded-lg bg-primary-fixed text-on-primary-fixed flex items-center justify-center">
                      <span className="material-symbols-outlined text-[16px]">trending_up</span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-numeric-balance-lg text-numeric-balance-lg text-primary tracking-tight">+$140.00</span>
                    <span className="font-label-caps text-label-caps text-primary uppercase font-bold">Surplus</span>
                  </div>
                  <div className="mt-1 font-body-sm text-body-sm text-on-surface-variant">Expected receipt from Jason Park</div>
                </div>
                <div className="bg-surface-container-lowest p-space-md rounded-2xl border border-outline-variant/60 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider">Receipt Slip Vault</span>
                    <span className="font-label-caps text-label-caps px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-bold">1 Missing</span>
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-numeric-balance-lg text-numeric-balance-lg text-on-surface tracking-tight">7 <span className="text-on-surface-variant text-headline-sm">/ 8</span></span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">slips digitized</span>
                  </div>
                  <div className="mt-2 w-full h-1.5 rounded-full bg-surface-container-high overflow-hidden">
                    <div className="h-full bg-primary-container rounded-full" style={{ width: "87.5%" }}></div>
                  </div>
                </div>
              </div>
            </section>

            {/* Interactive Controls Toolbar */}
            <section className="max-w-7xl w-full mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop mt-space-md">
              <div className="p-space-sm rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm sticky top-[9rem] z-10 backdrop-blur-sm">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-space-sm">
                  <div className="flex items-center flex-wrap gap-space-sm">
                    <div className="relative bg-surface-container-low p-1 rounded-xl flex items-center">
                      <div className="absolute top-1 bottom-1 rounded-lg bg-surface-container-lowest shadow-sm transition-all duration-300 ease-out" id="viewPillGlider" style={{ left: 4, width: 132 }}></div>
                      <button className="relative z-10 px-3.5 py-1.5 rounded-lg font-body-sm text-body-sm font-semibold text-on-surface flex items-center gap-1.5 transition-colors" id="ledgerViewBtn" onClick={() => switchView("ledger")} type="button">
                        <span className="material-symbols-outlined text-[18px]">table_rows</span>
                        <span>Ledger View</span>
                      </button>
                      <button className="relative z-10 px-3.5 py-1.5 rounded-lg font-body-sm text-body-sm font-medium text-on-surface-variant hover:text-on-surface flex items-center gap-1.5 transition-colors" id="kanbanViewBtn" onClick={() => switchView("kanban")} type="button">
                        <span className="material-symbols-outlined text-[18px]">view_kanban</span>
                        <span>Kanban View</span>
                      </button>
                    </div>
                    <div className="flex items-center bg-surface-container-low p-1 rounded-xl hidden lg:flex">
                      <button className="payer-btn px-3 py-1 rounded-lg font-body-sm text-body-sm font-semibold bg-surface-container-lowest text-on-surface shadow-sm" onClick={(e) => setPayerQuickFilter("all", e.currentTarget)} type="button">All (8)</button>
                      <button className="payer-btn px-3 py-1 rounded-lg font-body-sm text-body-sm font-medium text-on-surface-variant hover:text-on-surface" onClick={(e) => setPayerQuickFilter("you", e.currentTarget)} type="button">By You (2)</button>
                      <button className="payer-btn px-3 py-1 rounded-lg font-body-sm text-body-sm font-medium text-on-surface-variant hover:text-on-surface" onClick={(e) => setPayerQuickFilter("others", e.currentTarget)} type="button">By Others (6)</button>
                    </div>
                  </div>
                  <div className="flex items-center flex-wrap gap-space-xs mt-2 md:mt-0">
                    <div className="relative flex-1 sm:w-64">
                      <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-[18px]">search</span>
                      <input className="w-full bg-surface-container-low rounded-xl pl-9 pr-3 py-1.5 text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container" id="interactiveSearchInput" onInput={(e) => applyDynamicSearch(e.target.value)} placeholder="Filter bills or items..." type="text" />
                    </div>
                    <button className="px-3 py-1.5 rounded-xl bg-surface-container-low text-on-surface-variant hover:bg-surface-container font-body-sm text-body-sm flex items-center gap-1 transition-colors" id="missingFilterBtn" onClick={(e) => toggleMissingFilter(e.currentTarget)} type="button">
                      <span className="material-symbols-outlined text-[16px] text-tertiary">warning</span>
                      <span className="hidden sm:inline">Missing Slip</span>
                    </button>
                    <button className="px-3 py-1.5 rounded-xl bg-surface-container-low text-on-surface-variant hover:bg-surface-container font-body-sm text-body-sm flex items-center gap-1 transition-colors" onClick={() => alert("Exporting Tahoe_Expedition_Ledger.csv (8 records)...")} type="button">
                      <span className="material-symbols-outlined text-[16px]">file_download</span>
                      <span>Export</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Main Content Stage: Ledger vs Kanban + Companion Rail */}
            <section className="max-w-7xl w-full mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop mt-space-md mb-space-lg">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
                {/* Primary Canvas */}
                <div className="lg:col-span-8 min-w-0">
                  <div className="w-full transition-all duration-300 transform opacity-100 translate-y-0" id="ledgerViewContainer">
                    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-sm overflow-hidden">
                      <div className="p-space-md bg-surface-container-low/50 flex items-center justify-between">
                        <div className="flex items-center gap-space-xs">
                          <span className="font-title-md text-title-md text-on-surface">Chronological Ledger</span>
                          <span className="font-label-caps text-label-caps px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant" id="ledgerCountBadge">8 Records</span>
                        </div>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">Click row to inspect split shares</span>
                      </div>
                      <div className="flex flex-col" id="ledgerRowsList">
                        {/* Ledger Item 1 */}
                        <div className="ledger-item group p-space-md transition-colors hover:bg-surface-container-low cursor-pointer" data-category="lodging" data-missing="false" data-payer="you" onClick={() => toggleLedgerShareDetails("share-1")}>
                          <div className="flex items-center justify-between gap-space-sm">
                            <div className="flex items-center gap-space-sm min-w-0">
                              <div className="w-10 h-10 rounded-xl bg-surface-container-highest text-secondary flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-[20px]">villa</span>
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-title-md text-title-md text-on-surface truncate">Timberline Chalet AirBnb</span>
                                  <span className="font-label-caps text-label-caps px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant shrink-0">Lodging</span>
                                  <span className="material-symbols-outlined text-[16px] text-primary" title="Receipt verified">receipt</span>
                                </div>
                                <p className="font-body-sm text-body-sm text-on-surface-variant truncate mt-0.5">Feb 14 • Paid by <strong className="text-on-surface">Alex Morgan (You)</strong> • Split 6 ways</p>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="font-numeric-balance-md text-numeric-balance-md text-on-surface block">$1,440.00</span>
                              <span className="font-label-caps text-label-caps text-primary font-bold">You lent $1,200.00</span>
                            </div>
                          </div>
                          <div className="hidden mt-space-sm pt-space-sm bg-surface-container-low/70 p-space-sm rounded-xl" id="share-1">
                            <div className="flex items-center justify-between text-body-sm font-semibold text-on-surface mb-2">
                              <span>Split Breakdown (Equal 6 shares @ $240.00 each):</span>
                              <button className="text-secondary font-body-sm text-body-sm hover:underline flex items-center gap-1" onClick={(e) => { e.stopPropagation(); previewReceipt("Timberline Chalet AirBnb", "$1,440.00"); }} type="button">
                                <span className="material-symbols-outlined text-[14px]">visibility</span> View PDF Slip
                              </button>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              <div className="p-2 rounded-lg bg-surface-container-lowest text-body-sm">Alex Morgan: <strong className="text-primary">$240.00 (Self)</strong></div>
                              <div className="p-2 rounded-lg bg-surface-container-lowest text-body-sm">Noah Reynolds: <strong>$240.00</strong></div>
                              <div className="p-2 rounded-lg bg-surface-container-lowest text-body-sm">Marco Rossi: <strong>$240.00</strong></div>
                              <div className="p-2 rounded-lg bg-surface-container-lowest text-body-sm">Jason Park: <strong>$240.00</strong></div>
                              <div className="p-2 rounded-lg bg-surface-container-lowest text-body-sm">Elena Rostova: <strong>$240.00</strong></div>
                              <div className="p-2 rounded-lg bg-surface-container-lowest text-body-sm">Chloe Vance: <strong>$240.00</strong></div>
                            </div>
                          </div>
                        </div>
                        {/* Ledger Item 2 */}
                        <div className="ledger-item group p-space-md transition-colors hover:bg-surface-container-low cursor-pointer" data-category="mountain" data-missing="false" data-payer="others" onClick={() => toggleLedgerShareDetails("share-2")}>
                          <div className="flex items-center justify-between gap-space-sm">
                            <div className="flex items-center gap-space-sm min-w-0">
                              <div className="w-10 h-10 rounded-xl bg-surface-container-high text-on-surface flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-[20px]">downhill_skiing</span>
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-title-md text-title-md text-on-surface truncate">Palisades 2-Day Lift Passes</span>
                                  <span className="font-label-caps text-label-caps px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant shrink-0">Mountain</span>
                                  <span className="material-symbols-outlined text-[16px] text-primary" title="Receipt verified">receipt</span>
                                </div>
                                <p className="font-body-sm text-body-sm text-on-surface-variant truncate mt-0.5">Feb 15 • Paid by <strong className="text-on-surface">Noah Reynolds</strong> • 4 riders split</p>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="font-numeric-balance-md text-numeric-balance-md text-on-surface block">$620.00</span>
                              <span className="font-label-caps text-label-caps text-tertiary font-bold">You owe $155.00</span>
                            </div>
                          </div>
                          <div className="hidden mt-space-sm pt-space-sm bg-surface-container-low/70 p-space-sm rounded-xl" id="share-2">
                            <div className="flex items-center justify-between text-body-sm font-semibold text-on-surface mb-2">
                              <span>Split Breakdown (Custom 4 passes @ $155.00):</span>
                              <button className="text-secondary font-body-sm text-body-sm hover:underline flex items-center gap-1" onClick={(e) => { e.stopPropagation(); previewReceipt("Palisades Lift Passes", "$620.00"); }} type="button">
                                <span className="material-symbols-outlined text-[14px]">visibility</span> View Slip
                              </button>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-body-sm">
                              <div className="p-2 rounded-lg bg-surface-container-lowest">Noah R: <strong>$155.00</strong></div>
                              <div className="p-2 rounded-lg bg-surface-container-lowest text-tertiary">Alex M (You): <strong>$155.00</strong></div>
                              <div className="p-2 rounded-lg bg-surface-container-lowest">Elena R: <strong>$155.00</strong></div>
                              <div className="p-2 rounded-lg bg-surface-container-lowest">Jason P: <strong>$155.00</strong></div>
                            </div>
                          </div>
                        </div>
                        {/* Ledger Item 3 */}
                        <div className="ledger-item group p-space-md transition-colors hover:bg-surface-container-low cursor-pointer" data-category="groceries" data-missing="false" data-payer="others" onClick={() => toggleLedgerShareDetails("share-3")}>
                          <div className="flex items-center justify-between gap-space-sm">
                            <div className="flex items-center gap-space-sm min-w-0">
                              <div className="w-10 h-10 rounded-xl bg-primary-fixed text-on-primary-fixed flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-[20px]">local_grocery_store</span>
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-title-md text-title-md text-on-surface truncate">Safeway Group Groceries & Firewood</span>
                                  <span className="font-label-caps text-label-caps px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant shrink-0">Groceries</span>
                                  <span className="material-symbols-outlined text-[16px] text-primary" title="Receipt verified">receipt</span>
                                </div>
                                <p className="font-body-sm text-body-sm text-on-surface-variant truncate mt-0.5">Feb 15 • Paid by <strong className="text-on-surface">Marco Rossi</strong> • Split 6 ways</p>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="font-numeric-balance-md text-numeric-balance-md text-on-surface block">$246.50</span>
                              <span className="font-label-caps text-label-caps text-tertiary font-bold">You owe $41.08</span>
                            </div>
                          </div>
                          <div className="hidden mt-space-sm pt-space-sm bg-surface-container-low/70 p-space-sm rounded-xl" id="share-3">
                            <p className="font-body-sm text-body-sm text-on-surface mb-2">Split across all 6 chalet guests: $41.08/person</p>
                          </div>
                        </div>
                        {/* Ledger Item 4 */}
                        <div className="ledger-item group p-space-md transition-colors hover:bg-surface-container-low cursor-pointer" data-category="transit" data-missing="false" data-payer="others" onClick={() => toggleLedgerShareDetails("share-4")}>
                          <div className="flex items-center justify-between gap-space-sm">
                            <div className="flex items-center gap-space-sm min-w-0">
                              <div className="w-10 h-10 rounded-xl bg-surface-container-highest text-on-surface-variant flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-[20px]">airport_shuttle</span>
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-title-md text-title-md text-on-surface truncate">AWD SUV Rental & Snow Chains</span>
                                  <span className="font-label-caps text-label-caps px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant shrink-0">Transit</span>
                                  <span className="material-symbols-outlined text-[16px] text-primary" title="Receipt verified">receipt</span>
                                </div>
                                <p className="font-body-sm text-body-sm text-on-surface-variant truncate mt-0.5">Feb 14 • Paid by <strong className="text-on-surface">Marco Rossi</strong> • Split 6 ways</p>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="font-numeric-balance-md text-numeric-balance-md text-on-surface block">$285.00</span>
                              <span className="font-label-caps text-label-caps text-tertiary font-bold">You owe $47.50</span>
                            </div>
                          </div>
                          <div className="hidden mt-space-sm pt-space-sm bg-surface-container-low/70 p-space-sm rounded-xl" id="share-4">
                            <p className="font-body-sm text-body-sm text-on-surface mb-2">Split across all 6 road trip passengers: $47.50/person</p>
                          </div>
                        </div>
                        {/* Ledger Item 5 (Missing Slip!) */}
                        <div className="ledger-item group p-space-md transition-colors hover:bg-surface-container-low cursor-pointer bg-error-container/20" data-category="dining" data-missing="true" data-payer="others" onClick={() => toggleLedgerShareDetails("share-5")}>
                          <div className="flex items-center justify-between gap-space-sm">
                            <div className="flex items-center gap-space-sm min-w-0">
                              <div className="w-10 h-10 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-[20px]">restaurant</span>
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-title-md text-title-md text-on-surface truncate">Fireside Tavern Après-Ski Dinner</span>
                                  <span className="font-label-caps text-label-caps px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant shrink-0">Transit & Dining</span>
                                  <span className="font-label-caps text-label-caps px-1.5 py-0.5 rounded-md bg-error text-on-error font-bold flex items-center gap-0.5">
                                    <span className="material-symbols-outlined text-[12px]">receipt_long</span> Missing Slip
                                  </span>
                                </div>
                                <p className="font-body-sm text-body-sm text-on-surface-variant truncate mt-0.5">Feb 16 • Paid by <strong className="text-on-surface">Jason Park</strong> • Split 6 ways</p>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="font-numeric-balance-md text-numeric-balance-md text-on-surface block">$168.00</span>
                              <span className="font-label-caps text-label-caps text-tertiary font-bold">You owe $28.00</span>
                            </div>
                          </div>
                          <div className="hidden mt-space-sm pt-space-sm bg-surface-container-low/70 p-space-sm rounded-xl" id="share-5">
                            <div className="flex items-center justify-between text-body-sm">
                              <span className="text-error font-semibold flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px]">warning</span> Jason has not snapped the itemized receipt yet.
                              </span>
                              <button className="px-2.5 py-1 rounded-lg bg-surface-container text-on-surface font-body-sm text-body-sm hover:bg-surface-container-high" onClick={(e) => { e.stopPropagation(); alert("Nudge sent to Jason Park on Telegram!"); }} type="button">Nudge Jason</button>
                            </div>
                          </div>
                        </div>
                        {/* Ledger Item 6 */}
                        <div className="ledger-item group p-space-md transition-colors hover:bg-surface-container-low cursor-pointer" data-category="mountain" data-missing="false" data-payer="others" onClick={() => toggleLedgerShareDetails("share-6")}>
                          <div className="flex items-center justify-between gap-space-sm">
                            <div className="flex items-center gap-space-sm min-w-0">
                              <div className="w-10 h-10 rounded-xl bg-surface-container-high text-on-surface flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-[20px]">ice_skating</span>
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-title-md text-title-md text-on-surface truncate">Demo Ski Gear & Helmet Rentals</span>
                                  <span className="font-label-caps text-label-caps px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant shrink-0">Mountain</span>
                                  <span className="material-symbols-outlined text-[16px] text-primary">receipt</span>
                                </div>
                                <p className="font-body-sm text-body-sm text-on-surface-variant truncate mt-0.5">Feb 15 • Paid by <strong className="text-on-surface">Chloe Vance</strong> • 2 riders split</p>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="font-numeric-balance-md text-numeric-balance-md text-on-surface block">$110.00</span>
                              <span className="font-label-caps text-label-caps text-on-surface-variant">Not involved ($0.00)</span>
                            </div>
                          </div>
                          <div className="hidden mt-space-sm pt-space-sm bg-surface-container-low/70 p-space-sm rounded-xl" id="share-6">
                            <p className="font-body-sm text-body-sm text-on-surface">Split between Chloe Vance & Elena Rostova ($55.00 each).</p>
                          </div>
                        </div>
                        {/* Ledger Item 7 */}
                        <div className="ledger-item group p-space-md transition-colors hover:bg-surface-container-low cursor-pointer" data-category="transit" data-missing="false" data-payer="others" onClick={() => toggleLedgerShareDetails("share-7")}>
                          <div className="flex items-center justify-between gap-space-sm">
                            <div className="flex items-center gap-space-sm min-w-0">
                              <div className="w-10 h-10 rounded-xl bg-surface-container-highest text-on-surface-variant flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-[20px]">local_gas_station</span>
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-title-md text-title-md text-on-surface truncate">Sierra Highway Gas & Tolls</span>
                                  <span className="font-label-caps text-label-caps px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant shrink-0">Transit</span>
                                  <span className="material-symbols-outlined text-[16px] text-primary">receipt</span>
                                </div>
                                <p className="font-body-sm text-body-sm text-on-surface-variant truncate mt-0.5">Feb 17 • Paid by <strong className="text-on-surface">Elena Rostova</strong> • Split 6 ways</p>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="font-numeric-balance-md text-numeric-balance-md text-on-surface block">$74.50</span>
                              <span className="font-label-caps text-label-caps text-tertiary font-bold">You owe $12.42</span>
                            </div>
                          </div>
                          <div className="hidden mt-space-sm pt-space-sm bg-surface-container-low/70 p-space-sm rounded-xl" id="share-7">
                            <p className="font-body-sm text-body-sm text-on-surface">Equal split across 6 trip attendees ($12.42 each).</p>
                          </div>
                        </div>
                        {/* Ledger Item 8 */}
                        <div className="ledger-item group p-space-md transition-colors hover:bg-surface-container-low cursor-pointer" data-category="groceries" data-missing="false" data-payer="you" onClick={() => toggleLedgerShareDetails("share-8")}>
                          <div className="flex items-center justify-between gap-space-sm">
                            <div className="flex items-center gap-space-sm min-w-0">
                              <div className="w-10 h-10 rounded-xl bg-primary-fixed text-on-primary-fixed flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-[20px]">wine_bar</span>
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-title-md text-title-md text-on-surface truncate">Cabin Craft Brews & S'mores</span>
                                  <span className="font-label-caps text-label-caps px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant shrink-0">Groceries</span>
                                  <span className="material-symbols-outlined text-[16px] text-primary">receipt</span>
                                </div>
                                <p className="font-body-sm text-body-sm text-on-surface-variant truncate mt-0.5">Feb 16 • Paid by <strong className="text-on-surface">Alex Morgan (You)</strong> • Split 5 ways</p>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="font-numeric-balance-md text-numeric-balance-md text-on-surface block">$95.00</span>
                              <span className="font-label-caps text-label-caps text-primary font-bold">You lent $76.00</span>
                            </div>
                          </div>
                          <div className="hidden mt-space-sm pt-space-sm bg-surface-container-low/70 p-space-sm rounded-xl" id="share-8">
                            <p className="font-body-sm text-body-sm text-on-surface">Split among 5 participants ($19.00 each). Jason P was off hiking.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Kanban View */}
                  <div className="w-full hidden opacity-0 translate-y-3 transition-all duration-300" id="kanbanViewContainer">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-space-sm">
                      <div className="bg-surface-container-low/70 p-3 rounded-2xl flex flex-col gap-space-sm self-start min-h-0">
                        <div className="flex items-center justify-between px-1">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                            <span className="font-title-md text-title-md text-on-surface">Lodging & Stay</span>
                          </div>
                          <span className="font-label-caps text-label-caps px-2 py-0.5 rounded-full bg-surface-container-lowest text-on-surface-variant">$1,440.00</span>
                        </div>
                        <div className="bg-surface-container-lowest p-space-sm rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer" onClick={() => toggleLedgerShareDetails("share-1")}>
                          <div className="flex items-start justify-between gap-1">
                            <span className="font-title-md text-title-md text-on-surface leading-tight">Timberline Chalet AirBnb</span>
                            <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
                          </div>
                          <div className="mt-2 flex items-baseline justify-between">
                            <span className="font-numeric-balance-md text-numeric-balance-md text-on-surface">$1,440.00</span>
                            <span className="font-label-caps text-label-caps px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed">You paid</span>
                          </div>
                          <div className="mt-3 pt-2 flex items-center justify-between text-body-sm text-on-surface-variant">
                            <span className="text-xs">Equal 6-way split</span>
                            <span className="text-primary font-semibold text-xs">+ $1,200.00 owed to you</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-surface-container-low/70 p-3 rounded-2xl flex flex-col gap-space-sm self-start min-h-0">
                        <div className="flex items-center justify-between px-1">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                            <span className="font-title-md text-title-md text-on-surface">Mountain</span>
                          </div>
                          <span className="font-label-caps text-label-caps px-2 py-0.5 rounded-full bg-surface-container-lowest text-on-surface-variant">$730.00</span>
                        </div>
                        <div className="bg-surface-container-lowest p-space-sm rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer">
                          <div className="flex items-start justify-between gap-1">
                            <span className="font-title-md text-title-md text-on-surface leading-tight">Palisades 2-Day Lift Passes</span>
                            <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
                          </div>
                          <div className="mt-2 flex items-baseline justify-between">
                            <span className="font-numeric-balance-md text-numeric-balance-md text-on-surface">$620.00</span>
                            <span className="font-body-sm text-body-sm text-on-surface-variant">Paid by Noah</span>
                          </div>
                          <div className="mt-3 pt-2 flex items-center justify-between text-body-sm text-on-surface-variant">
                            <span className="text-xs">4 Riders split</span>
                            <span className="text-tertiary font-semibold text-xs">You owe $155.00</span>
                          </div>
                        </div>
                        <div className="bg-surface-container-lowest p-space-sm rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer">
                          <div className="flex items-start justify-between gap-1">
                            <span className="font-title-md text-title-md text-on-surface leading-tight">Demo Ski Gear Rentals</span>
                            <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
                          </div>
                          <div className="mt-2 flex items-baseline justify-between">
                            <span className="font-numeric-balance-md text-numeric-balance-md text-on-surface">$110.00</span>
                            <span className="font-body-sm text-body-sm text-on-surface-variant">Paid by Chloe</span>
                          </div>
                          <div className="mt-3 pt-2 flex items-center justify-between text-body-sm text-on-surface-variant">
                            <span className="text-xs">2 Riders</span>
                            <span className="text-on-surface-variant text-xs">Not involved</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-surface-container-low/70 p-3 rounded-2xl flex flex-col gap-space-sm self-start min-h-0">
                        <div className="flex items-center justify-between px-1">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-primary-container"></span>
                            <span className="font-title-md text-title-md text-on-surface">Groceries</span>
                          </div>
                          <span className="font-label-caps text-label-caps px-2 py-0.5 rounded-full bg-surface-container-lowest text-on-surface-variant">$341.50</span>
                        </div>
                        <div className="bg-surface-container-lowest p-space-sm rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer">
                          <div className="flex items-start justify-between gap-1">
                            <span className="font-title-md text-title-md text-on-surface leading-tight">Safeway Group Supplies</span>
                            <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
                          </div>
                          <div className="mt-2 flex items-baseline justify-between">
                            <span className="font-numeric-balance-md text-numeric-balance-md text-on-surface">$246.50</span>
                            <span className="font-body-sm text-body-sm text-on-surface-variant">Paid by Marco</span>
                          </div>
                          <div className="mt-3 pt-2 flex items-center justify-between text-body-sm text-on-surface-variant">
                            <span className="text-xs">Equal 6-way</span>
                            <span className="text-tertiary font-semibold text-xs">You owe $41.08</span>
                          </div>
                        </div>
                        <div className="bg-surface-container-lowest p-space-sm rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer">
                          <div className="flex items-start justify-between gap-1">
                            <span className="font-title-md text-title-md text-on-surface leading-tight">Cabin Craft Brews</span>
                            <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
                          </div>
                          <div className="mt-2 flex items-baseline justify-between">
                            <span className="font-numeric-balance-md text-numeric-balance-md text-on-surface">$95.00</span>
                            <span className="font-label-caps text-label-caps px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed">You paid</span>
                          </div>
                          <div className="mt-3 pt-2 flex items-center justify-between text-body-sm text-on-surface-variant">
                            <span className="text-xs">5-way split</span>
                            <span className="text-primary font-semibold text-xs">+ $76.00 owed to you</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-surface-container-low/70 p-3 rounded-2xl flex flex-col gap-space-sm self-start min-h-0">
                        <div className="flex items-center justify-between px-1">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span>
                            <span className="font-title-md text-title-md text-on-surface">Transit & Dining</span>
                          </div>
                          <span className="font-label-caps text-label-caps px-2 py-0.5 rounded-full bg-surface-container-lowest text-on-surface-variant">$527.50</span>
                        </div>
                        <div className="bg-surface-container-lowest p-space-sm rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer">
                          <div className="flex items-start justify-between gap-1">
                            <span className="font-title-md text-title-md text-on-surface leading-tight">SUV Rental & Chains</span>
                            <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
                          </div>
                          <div className="mt-2 flex items-baseline justify-between">
                            <span className="font-numeric-balance-md text-numeric-balance-md text-on-surface">$285.00</span>
                            <span className="font-body-sm text-body-sm text-on-surface-variant">Paid by Marco</span>
                          </div>
                          <div className="mt-3 pt-2 flex items-center justify-between text-body-sm text-on-surface-variant">
                            <span className="text-xs">Equal 6-way</span>
                            <span className="text-tertiary font-semibold text-xs">You owe $47.50</span>
                          </div>
                        </div>
                        <div className="bg-surface-container-lowest p-space-sm rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer ring-1 ring-tertiary/20">
                          <div className="flex items-start justify-between gap-1">
                            <span className="font-title-md text-title-md text-on-surface leading-tight">Fireside Tavern Dinner</span>
                            <span className="material-symbols-outlined text-[16px] text-tertiary">warning</span>
                          </div>
                          <div className="mt-2 flex items-baseline justify-between">
                            <span className="font-numeric-balance-md text-numeric-balance-md text-on-surface">$168.00</span>
                            <span className="font-body-sm text-body-sm text-on-surface-variant">Paid by Jason</span>
                          </div>
                          <div className="mt-2 px-2 py-1 rounded bg-error-container/40 text-on-error-container text-xs font-semibold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">receipt_long</span> Missing receipt slip
                          </div>
                          <div className="mt-2 pt-2 flex items-center justify-between text-body-sm text-on-surface-variant">
                            <span className="text-xs">6-way split</span>
                            <span className="text-tertiary font-semibold text-xs">You owe $28.00</span>
                          </div>
                        </div>
                        <div className="bg-surface-container-lowest p-space-sm rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer">
                          <div className="flex items-start justify-between gap-1">
                            <span className="font-title-md text-title-md text-on-surface leading-tight">Highway Gas & Tolls</span>
                            <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
                          </div>
                          <div className="mt-2 flex items-baseline justify-between">
                            <span className="font-numeric-balance-md text-numeric-balance-md text-on-surface">$74.50</span>
                            <span className="font-body-sm text-body-sm text-on-surface-variant">Paid by Elena</span>
                          </div>
                          <div className="mt-3 pt-2 flex items-center justify-between text-body-sm text-on-surface-variant">
                            <span className="text-xs">6-way split</span>
                            <span className="text-tertiary font-semibold text-xs">You owe $12.42</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Companion Rail */}
                <aside className="lg:col-span-4 flex flex-col gap-space-md">
                  <div className="bg-surface-container-lowest p-space-md rounded-2xl border border-outline-variant/60 shadow-sm">
                    <div className="flex items-center justify-between pb-space-sm">
                      <div className="flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-primary text-[22px]">account_balance</span>
                        <h2 className="font-headline-sm text-headline-sm text-on-surface">Your Liquidity</h2>
                      </div>
                      <span className="font-label-caps text-label-caps px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed uppercase font-bold">Surplus</span>
                    </div>
                    <div className="mt-2 space-y-2 text-body-sm">
                      <div className="flex items-center justify-between py-1 text-on-surface-variant">
                        <span>Paid upfront by you</span>
                        <span className="font-numeric-balance-md text-body-md text-on-surface font-semibold">$980.00</span>
                      </div>
                      <div className="flex items-center justify-between py-1 text-on-surface-variant">
                        <span>Your actual calculated share</span>
                        <span className="font-numeric-balance-md text-body-md text-tertiary font-semibold">-$840.00</span>
                      </div>
                      <div className="pt-2 flex items-center justify-between">
                        <span className="font-title-md text-title-md text-on-surface font-semibold">Net Payout to Receive</span>
                        <span className="font-numeric-balance-lg text-numeric-balance-md text-primary font-bold">+$140.00</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <button className="w-full py-2.5 px-4 rounded-xl bg-primary-container text-on-primary-container font-body-sm text-body-sm font-semibold hover:bg-primary hover:text-on-primary transition-all flex items-center justify-center gap-2 shadow-sm" onClick={() => alert("Instant settlement request link generated for group members!")} type="button">
                        <span className="material-symbols-outlined text-[18px]">send</span>
                        <span>Request Payout ($140.00)</span>
                      </button>
                    </div>
                  </div>
                  <div className="bg-surface-container-lowest p-space-md rounded-2xl border border-outline-variant/60 shadow-sm">
                    <div className="flex items-center justify-between pb-space-sm">
                      <div>
                        <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider">Algorithm</span>
                        <h3 className="font-title-md text-title-md text-on-surface">Debt Simplification</h3>
                      </div>
                      <div className="w-7 h-7 rounded-lg bg-surface-container-low text-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px]">schema</span>
                      </div>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Reduced 15 multi-way IOUs into 2 clean direct transfers:</p>
                    <div className="mt-3 p-3 rounded-xl bg-surface-container-low/70 flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-secondary text-on-secondary font-label-caps text-label-caps flex items-center justify-center font-bold shrink-0">NR</div>
                        <span className="material-symbols-outlined text-[16px] text-outline">arrow_forward</span>
                        <div className="w-7 h-7 rounded-full bg-surface-container-highest text-on-surface font-label-caps text-label-caps flex items-center justify-center font-bold shrink-0">MR</div>
                        <div className="min-w-0">
                          <span className="font-body-sm text-body-sm text-on-surface font-semibold block truncate">Noah → Marco</span>
                          <span className="text-xs text-on-surface-variant">Lodge adjustment</span>
                        </div>
                      </div>
                      <span className="font-numeric-balance-md text-body-md text-on-surface font-bold shrink-0">$220.00</span>
                    </div>
                    <div className="mt-2.5 p-3 rounded-xl bg-primary-fixed/20 flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-caps text-label-caps flex items-center justify-center font-bold shrink-0">JP</div>
                        <span className="material-symbols-outlined text-[16px] text-primary">arrow_forward</span>
                        <div className="w-7 h-7 rounded-full bg-primary-container text-on-primary-container font-label-caps text-label-caps flex items-center justify-center font-bold shrink-0">AM</div>
                        <div className="min-w-0">
                          <span className="font-body-sm text-body-sm text-on-surface font-bold block truncate">Jason → You</span>
                          <span className="text-xs text-primary font-medium">Final resolution</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-numeric-balance-md text-body-md text-primary font-bold block">+$140.00</span>
                        <button className="text-xs text-secondary hover:underline font-semibold flex items-center justify-end gap-0.5 mt-0.5" onClick={() => alert("Apple Pay request link nudged to Jason Park!")} type="button">
                          <span className="material-symbols-outlined text-[12px]">contactless</span> Apple Pay nudge
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="bg-surface-container-lowest p-space-md rounded-2xl border border-outline-variant/60 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-secondary text-[20px]">cloud_upload</span>
                        <h3 className="font-title-md text-title-md text-on-surface">Receipt Vault</h3>
                      </div>
                      <span className="font-label-caps text-label-caps text-primary font-semibold">OCR Ready</span>
                    </div>
                    <div className="mt-3 p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer text-center" onClick={() => document.getElementById("receiptFileInput")?.click()}>
                      <input className="hidden" id="receiptFileInput" onChange={() => alert("Receipt uploaded! Scanning merchant, subtotal & tip with AI OCR...")} type="file" />
                      <span className="material-symbols-outlined text-primary text-[28px]">document_scanner</span>
                      <p className="font-title-md text-body-sm font-semibold text-on-surface mt-1">Drop paper bill or click to scan</p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant text-xs mt-0.5">Automatically associates with Tahoe group</p>
                    </div>
                  </div>
                </aside>
              </div>
            </section>

            {/* Receipt Inspection Modal */}
            <div className="hidden fixed inset-0 z-50 bg-on-surface/40 backdrop-blur-sm flex items-center justify-center p-4" id="receiptPreviewModal">
              <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-space-lg shadow-2xl relative">
                <button className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface-container-low text-on-surface-variant flex items-center justify-center hover:bg-surface-container" onClick={closeReceiptPreview} type="button">
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-primary">verified</span>
                  <span className="font-label-caps text-label-caps uppercase text-primary font-bold">Digitized Receipt Slip</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface" id="receiptModalTitle">Timberline Chalet AirBnb</h3>
                <p className="font-numeric-balance-lg text-numeric-balance-lg text-on-surface mt-1" id="receiptModalAmount">$1,440.00</p>
                <div className="mt-4 p-space-sm rounded-xl bg-surface-container-low text-body-sm space-y-1 text-on-surface-variant">
                  <div className="flex justify-between"><span>Merchant:</span> <strong className="text-on-surface">AirBnb Inc.</strong></div>
                  <div className="flex justify-between"><span>Date:</span> <strong className="text-on-surface">Feb 14, 2025 • 14:22 PST</strong></div>
                  <div className="flex justify-between"><span>Payment method:</span> <strong className="text-on-surface">Apple Card (Alex)</strong></div>
                  <div className="flex justify-between"><span>OCR confidence:</span> <strong className="text-primary">99.4% Match</strong></div>
                </div>
                <div className="mt-5 flex gap-2">
                  <button className="w-full py-2 rounded-xl bg-primary-container text-on-primary-container font-semibold text-body-sm hover:bg-primary hover:text-on-primary transition-colors" onClick={closeReceiptPreview} type="button">Done</button>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Global Footer */}
        <footer className="w-full bg-surface-container-low py-space-lg border-t border-surface-container-high/60 mt-space-lg">
          <div className="max-w-7xl w-full mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop flex flex-col md:flex-row items-center justify-between gap-space-md text-on-surface-variant">
            <div className="flex items-center gap-space-xs">
              <div className="w-6 h-6 rounded-md bg-primary-container text-on-primary-container flex items-center justify-center text-[12px]">
                <span className="material-symbols-outlined text-[14px]">receipt_long</span>
              </div>
              <span className="font-body-sm text-body-sm">© 2025 Tabsy. One tab. All sorted. Minimal flat pastel studio edition.</span>
            </div>
            <div className="flex items-center gap-space-lg font-body-sm text-body-sm">
              <a className="hover:text-on-surface transition-colors" data-path="overview" href="#">Overview</a>
              <a className="hover:text-on-surface transition-colors" data-path="balances" href="#">Group Balances</a>
              <a className="hover:text-on-surface transition-colors" data-path="terms" href="#">Terms</a>
              <a className="hover:text-on-surface transition-colors" data-path="support" href="#">Support</a>
            </div>
          </div>
        </footer>
      </div>
    </AppLayout>
  );
}
