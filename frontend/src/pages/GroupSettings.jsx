import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import GroupHeader from "../components/layout/GroupHeader";

const SPLIT_POLICIES = [
  {
    id: "equal",
    icon: "group",
    title: "Equal (1 / N)",
    desc: "Even distribution across all confirmed cabin mates",
    tag: "Default for Ski Trips",
  },
  {
    id: "percent",
    icon: "percent",
    title: "Exact Percent (%)",
    desc: "Fixed percentage allocation per trip participant",
    tag: "Ratio Fixed",
  },
  {
    id: "weighted",
    icon: "tune",
    title: "Weighted Shares",
    desc: "Configurable shares (Master Suite 1.5x, Weekend 0.5x)",
    tag: "Dynamic Weight",
  },
];

const CO_HOSTS = [
  {
    initials: "AM",
    name: "Alex Morgan (You)",
    role: "Owner & Cabin Primary",
    badge: "FULL ACCESS",
    avatarClass: "bg-primary text-on-primary",
    badgeClass: "bg-primary-fixed text-on-primary-fixed",
    delegated: false,
  },
  {
    initials: "MR",
    name: "Marco Rossi",
    role: "Co-Admin & Pass Coordinator",
    badge: "CO-HOST",
    avatarClass: "bg-secondary text-on-secondary",
    badgeClass: "bg-surface-container-high text-secondary",
    delegated: true,
  },
];

const SIM_MEMBERS = [
  { initials: "MR", name: "Marco Rossi", role: "Standard Share", weight: 1, avatarClass: "bg-secondary-fixed text-on-secondary-fixed" },
  { initials: "AM", name: "Alex Morgan (Host)", role: "Standard Share", weight: 1, avatarClass: "bg-primary-fixed text-on-primary-fixed", isHost: true },
  { initials: "SL", name: "Sarah Lin", role: "Standard Share", weight: 1, avatarClass: "bg-surface-container-highest text-on-surface" },
  { initials: "KC", name: "Kim Chen", role: "Standard Share", weight: 1, avatarClass: "bg-surface-container text-on-surface" },
  { initials: "JD", name: "Jason Diaz", role: "Standard Share", weight: 1, avatarClass: "bg-surface-dim text-on-surface" },
  { initials: "NT", name: "Noah Taylor", role: "Standard Share", weight: 1, avatarClass: "bg-surface-container-highest text-on-surface" },
];

export default function GroupSettings() {
  const navigate = useNavigate();
  const [activePolicy, setActivePolicy] = useState("equal");
  const [simMode, setSimMode] = useState("equal");
  const [simAmount, setSimAmount] = useState(360);
  const [fxToggle, setFxToggle] = useState(true);
  const [bipartiteToggle, setBipartiteToggle] = useState(true);
  const [receiptToggle, setReceiptToggle] = useState(true);
  const [approvalToggle, setApprovalToggle] = useState(true);
  const [lockToggle, setLockToggle] = useState(true);
  const [toast, setToast] = useState(null);

  function showToast(title, body) {
    setToast({ title, body });
    setTimeout(() => setToast(null), 3000);
  }

  function handlePolicySelect(id) {
    setActivePolicy(id);
    showToast("Default Split Updated", `Group default policy changed to: ${id.toUpperCase()}`);
  }

  function calculateShares() {
    if (simMode === "equal") {
      const per = simAmount / 6;
      return SIM_MEMBERS.map((m) => ({ ...m, amount: per, excluded: false }));
    }
    if (simMode === "weighted") {
      const totalWeight = 6.5;
      const base = simAmount / totalWeight;
      return SIM_MEMBERS.map((m, i) => ({
        ...m,
        amount: i === 2 ? base * 1.5 : base,
        excluded: false,
      }));
    }
    const per = simAmount / 4;
    return SIM_MEMBERS.map((m, i) => ({
      ...m,
      amount: i < 4 ? per : 0,
      excluded: i >= 4,
    }));
  }

  const simResults = calculateShares();

  return (
    <AppLayout>
      <div className="bg-background font-body-md text-on-surface antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
        <main className="w-full pt-0 pb-24 bg-background min-h-screen">
          <div className="max-w-7xl w-full mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop flex flex-col gap-6">
            <GroupHeader
              title="Group Settings & Financial Governance"
              subtitle="Ledger v2.4 Engine · Saved 1m ago · All 6 cabin members synchronized"
              currentLabel="Financial Governance"
              actions={
                <>
                  <button
                    className="group/btn relative inline-flex items-center gap-0 px-2.5 py-2 text-on-surface font-title-md text-title-md hover:bg-surface-container-lowest rounded-lg transition-all duration-300 ease-out overflow-hidden"
                    type="button"
                    onClick={() =>
                      showToast("Defaults Restored", "Ledger rules reverted to standard equal-split configuration.")
                    }
                  >
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover/btn:text-secondary transition-colors shrink-0">
                      restart_alt
                    </span>
                    <span className="max-w-0 group-hover/btn:max-w-[140px] group-hover/btn:ml-2 overflow-hidden whitespace-nowrap transition-all duration-300 ease-out opacity-0 group-hover/btn:opacity-100">
                      Reset to Defaults
                    </span>
                  </button>
                  <div className="w-px h-5 bg-outline-variant/40 shrink-0 transition-all duration-300 group-hover/actions:bg-transparent" />
                  <button
                    className="group/btn inline-flex items-center gap-0 px-2.5 py-2 bg-primary-container text-on-primary-container font-title-md text-title-md hover:opacity-95 rounded-lg transition-all duration-300 ease-out overflow-hidden"
                    type="button"
                    onClick={() =>
                      showToast("Governance Saved", "Financial policy rules saved & synced across 6 cabin participants.")
                    }
                  >
                    <span className="material-symbols-outlined text-[18px] shrink-0">
                      check_circle
                    </span>
                    <span className="max-w-0 group-hover/btn:max-w-[160px] group-hover/btn:ml-2 overflow-hidden whitespace-nowrap transition-all duration-300 ease-out opacity-0 group-hover/btn:opacity-100">
                      Save Policy Changes
                    </span>
                  </button>
                </>
              }
            />

            {/* KPI Ribbon */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-sm">
              {/* Ledger Health */}
              <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col justify-between gap-3 border border-outline-variant/40">
                <div className="flex items-center justify-between">
                  <span className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant">
                    Ledger Health
                  </span>
                  <div className="w-8 h-8 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-numeric-balance-lg text-numeric-balance-lg text-on-surface">
                    100% Balanced
                  </span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-2 h-2 rounded-full bg-primary-container" />
                    <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">
                      Zero-sum verified (ΣΔ = ₹0.00)
                    </span>
                  </div>
                </div>
              </div>

              {/* Active Policies */}
              <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col justify-between gap-3 border border-outline-variant/40">
                <div className="flex items-center justify-between">
                  <span className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant">
                    Active Policies
                  </span>
                  <div className="w-8 h-8 rounded-full bg-surface-container-high text-secondary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">shield</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-numeric-balance-lg text-numeric-balance-lg text-on-surface">
                    8 Safeguards
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    Debt Minimization & Gate Active
                  </span>
                </div>
              </div>

              {/* Settlement Cadence */}
              <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col justify-between gap-3 border border-outline-variant/40">
                <div className="flex items-center justify-between">
                  <span className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant">
                    Settlement Cadence
                  </span>
                  <div className="w-8 h-8 rounded-full bg-surface-variant text-on-surface flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">schedule</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-numeric-balance-lg text-numeric-balance-lg text-on-surface">
                    Smart Auto-Nudge
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    Every 3 days · Quiet 10PM-8AM
                  </span>
                </div>
              </div>

              {/* Currency */}
              <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col justify-between gap-3 border border-outline-variant/40">
                <div className="flex items-center justify-between">
                  <span className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant">
                    Trip Currency & Rates
                  </span>
                  <div className="w-8 h-8 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">currency_exchange</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-numeric-balance-lg text-numeric-balance-lg text-on-surface">
                    INR (₹)
                  </span>
                  <span className="font-body-sm text-body-sm text-primary font-semibold mt-1">
                    Live ECB Mid-Market 0% fee
                  </span>
                </div>
              </div>
            </section>

            {/* Main Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Rail */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                {/* Section 1: General Ledger & Split Rules */}
                <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm flex flex-col gap-6 border border-outline-variant/40">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary-fixed text-on-primary-fixed flex items-center justify-center">
                        <span className="material-symbols-outlined text-[22px]">balance</span>
                      </div>
                      <div className="flex flex-col">
                        <h2 className="font-headline-sm text-headline-sm text-on-surface">
                          General Ledger & Split Rules
                        </h2>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Core mathematical models defining how cabin outlays are apportioned
                        </p>
                      </div>
                    </div>
                    <span className="bg-surface-container-low text-on-surface-variant text-label-caps font-label-caps uppercase px-2.5 py-1 rounded-full">
                      Primary Rule
                    </span>
                  </div>

                  {/* Currency Setting */}
                  <div className="bg-surface-container-low p-4 rounded-xl flex flex-col gap-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <label className="font-title-md text-title-md text-on-surface block">
                          Base Expedition Currency
                        </label>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">
                          All balances consolidate into this reference unit
                        </span>
                      </div>
                      <select className="bg-surface-container-lowest text-on-surface text-sm font-semibold rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary border border-outline-variant/40">
                        <option value="INR">INR (₹) - Indian Rupee</option>
                        <option value="USD">USD ($) - United States Dollar</option>
                        <option value="EUR">EUR (€) - Eurozone</option>
                        <option value="CAD">CAD ($) - Canadian Dollar</option>
                        <option value="CHF">CHF (Fr) - Swiss Franc</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] text-primary">sync</span>
                        <span className="font-body-sm text-body-sm text-on-surface font-medium">
                          Auto-convert foreign receipts at mid-market ECB rate
                        </span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          checked={fxToggle}
                          className="sr-only peer"
                          type="checkbox"
                          onChange={(e) => setFxToggle(e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-surface-dim peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                      </label>
                    </div>
                  </div>

                  {/* Split Policy Selector */}
                  <div className="flex flex-col gap-3">
                    <span className="font-title-md text-title-md text-on-surface">
                      Default Expense Split Policy
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {SPLIT_POLICIES.map((p) => {
                        const active = activePolicy === p.id;
                        return (
                          <div
                            key={p.id}
                            className={`cursor-pointer p-4 rounded-xl transition-all flex flex-col justify-between gap-3 ${
                              active
                                ? "bg-surface-container-high text-on-surface shadow-sm"
                                : "bg-surface-container-low text-on-surface hover:bg-surface-container"
                            }`}
                            onClick={() => handlePolicySelect(p.id)}
                          >
                            <div className="flex items-center justify-between">
                              <span className={`material-symbols-outlined text-[20px] ${active ? "text-primary" : "text-on-surface-variant"}`}>
                                {p.icon}
                              </span>
                              {active && (
                                <span className="bg-primary text-on-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
                                  ACTIVE
                                </span>
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-title-md text-title-md font-bold">{p.title}</span>
                              <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                                {p.desc}
                              </span>
                            </div>
                            <span className={`font-label-caps text-label-caps uppercase ${active ? "text-primary" : "text-on-surface-variant"}`}>
                              {p.tag}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Smart Debt Minimization */}
                  <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary-fixed text-on-primary-fixed flex items-center justify-center shrink-0 mt-0.5">
                          <span className="material-symbols-outlined text-[18px]">hub</span>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-title-md text-title-md text-on-surface font-bold">
                              Smart Debt Minimization
                            </span>
                            <span className="bg-primary-container text-on-primary text-label-caps font-label-caps px-2 py-0.5 rounded-full">
                              Bipartite v2
                            </span>
                          </div>
                          <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                            Reduces 14 pairwise debts to 3 direct payments (-78% social friction) using optimal graph simplification.
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input
                          checked={bipartiteToggle}
                          className="sr-only peer"
                          type="checkbox"
                          onChange={(e) => setBipartiteToggle(e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-surface-dim peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                      </label>
                    </div>
                    <div className="bg-surface-container-lowest p-3 rounded-lg flex items-center justify-between text-xs text-on-surface-variant">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-tertiary" />
                        <span>Without: 14 transfers (₹1,07,123 gross)</span>
                      </div>
                      <span className="material-symbols-outlined text-[16px] text-primary">arrow_forward</span>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-primary-container" />
                        <span className="text-primary font-bold">With Engine: 3 transfers (₹26,342 net)</span>
                      </div>
                    </div>
                  </div>

                  {/* Remainder & Cent Tolerance */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                    <div>
                      <span className="font-title-md text-title-md text-on-surface block">
                        Remainder & Cent Tolerance
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        Specify how fractional cent residues are resolved
                      </span>
                    </div>
                    <select className="bg-surface-container-low text-on-surface text-sm font-semibold rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary border border-outline-variant/40">
                      <option>Absorb to host (Alex Morgan)</option>
                      <option>Round to nearest ₹0.01 strictly</option>
                      <option>Evenly distribute residual cents</option>
                      <option>Donate penny residue to Carbon Offset</option>
                    </select>
                  </div>
                </div>

                {/* Section 2: Permissions & Evidence Matrix */}
                <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm flex flex-col gap-6 border border-outline-variant/40">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-surface-container-high text-secondary flex items-center justify-center">
                        <span className="material-symbols-outlined text-[22px]">admin_panel_settings</span>
                      </div>
                      <div className="flex flex-col">
                        <h2 className="font-headline-sm text-headline-sm text-on-surface">
                          Permissions & Evidence Matrix
                        </h2>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Access control rules for outlay entry, edits, and validation
                        </p>
                      </div>
                    </div>
                    <span className="bg-surface-container-low text-on-surface-variant text-label-caps font-label-caps uppercase px-2.5 py-1 rounded-full">
                      Governance
                    </span>
                  </div>

                  {/* Who Can Log Outlays */}
                  <div className="flex flex-col gap-2">
                    <span className="font-title-md text-title-md text-on-surface">Who Can Log Outlays?</span>
                    <div className="bg-surface-container-low p-1 rounded-xl grid grid-cols-2 gap-1 text-sm font-medium">
                      <button className="py-2 px-3 rounded-lg bg-surface-container-lowest text-on-surface font-semibold shadow-xs flex items-center justify-center gap-2" type="button">
                        <span className="material-symbols-outlined text-[18px] text-primary">public</span>
                        <span>All Confirmed Mates (Open)</span>
                      </button>
                      <button className="py-2 px-3 rounded-lg text-on-surface-variant hover:text-on-surface transition-colors flex items-center justify-center gap-2" type="button">
                        <span className="material-symbols-outlined text-[18px]">lock</span>
                        <span>Admins & Organizers Only</span>
                      </button>
                    </div>
                  </div>

                  {/* Who Can Edit/Delete */}
                  <div className="flex flex-col gap-2">
                    <span className="font-title-md text-title-md text-on-surface">
                      Who Can Edit or Void Receipts?
                    </span>
                    <div className="bg-surface-container-low p-1 rounded-xl grid grid-cols-2 gap-1 text-sm font-medium">
                      <button className="py-2 px-3 rounded-lg bg-surface-container-lowest text-on-surface font-semibold shadow-xs flex items-center justify-center gap-2" type="button">
                        <span className="material-symbols-outlined text-[18px] text-primary">shield_person</span>
                        <span>Payer & Admins Only</span>
                      </button>
                      <button className="py-2 px-3 rounded-lg text-on-surface-variant hover:text-on-surface transition-colors flex items-center justify-center gap-2" type="button">
                        <span className="material-symbols-outlined text-[18px]">verified_user</span>
                        <span>Admins Strictly</span>
                      </button>
                    </div>
                  </div>

                  {/* Verification Toggles */}
                  <div className="flex flex-col gap-3 pt-2">
                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low">
                      <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-[20px] text-on-surface mt-0.5">document_scanner</span>
                        <div className="flex flex-col">
                          <span className="font-title-md text-title-md text-on-surface">
                            Mandatory Receipt Photo / OCR Slip
                          </span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">
                            Enforces camera scanning for any outlays exceeding ₹4,150
                          </span>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input
                          checked={receiptToggle}
                          className="sr-only peer"
                          type="checkbox"
                          onChange={(e) => setReceiptToggle(e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-surface-dim peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low">
                      <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-[20px] text-on-surface mt-0.5">approval_delegation</span>
                        <div className="flex flex-col">
                          <span className="font-title-md text-title-md text-on-surface">
                            Admin Approval Gate (&gt; ₹8,300)
                          </span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">
                            Holds outlay in pending state until Alex or Marco signs off
                          </span>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input
                          checked={approvalToggle}
                          className="sr-only peer"
                          type="checkbox"
                          onChange={(e) => setApprovalToggle(e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-surface-dim peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low">
                      <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-[20px] text-on-surface mt-0.5">lock_clock</span>
                        <div className="flex flex-col">
                          <span className="font-title-md text-title-md text-on-surface">
                            Lock Ledger Upon Checkout
                          </span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">
                            Freeze new outlay submissions on Sunday, Feb 18 at 8:00 PM
                          </span>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input
                          checked={lockToggle}
                          className="sr-only peer"
                          type="checkbox"
                          onChange={(e) => setLockToggle(e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-surface-dim peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Section 3: Communication & Nudges */}
                <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm flex flex-col gap-6 border border-outline-variant/40">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-surface-variant text-on-surface flex items-center justify-center">
                        <span className="material-symbols-outlined text-[22px]">notifications_active</span>
                      </div>
                      <div className="flex flex-col">
                        <h2 className="font-headline-sm text-headline-sm text-on-surface">
                          Communication & Gentle Nudges
                        </h2>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Automated reminders without awkward group chat callouts
                        </p>
                      </div>
                    </div>
                    <span className="bg-surface-container-low text-on-surface-variant text-label-caps font-label-caps uppercase px-2.5 py-1 rounded-full">
                      Automation
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="font-title-md text-title-md text-on-surface">
                        Automated Debt Reminder Cadence
                      </label>
                      <select className="bg-surface-container-low text-on-surface text-sm font-semibold rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary border border-outline-variant/40">
                        <option>Gentle nudge every 3 days during trip</option>
                        <option>Daily summary at 10:00 AM</option>
                        <option>Manual organizer triggers only</option>
                        <option>End of trip settlement blast only</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="font-title-md text-title-md text-on-surface">
                        Quiet Hours Window
                      </label>
                      <div className="bg-surface-container-low p-2 rounded-lg flex items-center justify-between">
                        <span className="text-sm font-medium text-on-surface flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                            bedtime
                          </span>
                          10:00 PM – 8:00 AM PST
                        </span>
                        <span className="bg-primary-fixed text-on-primary-fixed text-[10px] font-bold px-2 py-0.5 rounded-full">
                          PAUSED
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 pt-1">
                    <span className="font-title-md text-title-md text-on-surface">
                      Supported Delivery Channels
                    </span>
                    <div className="flex flex-wrap items-center gap-3">
                      {["In-App Push", "Direct SMS Link", "WhatsApp Hook", "Daily Digest Email"].map((ch, i) => (
                        <label
                          key={ch}
                          className="flex items-center gap-2 bg-surface-container-low px-3.5 py-2 rounded-xl cursor-pointer hover:bg-surface-container transition-colors"
                        >
                          <input
                            defaultChecked={i < 3}
                            className="rounded text-primary focus:ring-primary h-4 w-4"
                            type="checkbox"
                          />
                          <span className={`text-sm font-semibold ${i < 3 ? "text-on-surface" : "text-on-surface-variant"}`}>
                            {ch}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Rail */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                {/* Policy Impact Simulator */}
                <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm flex flex-col gap-5 border border-outline-variant/40">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px]">calculate</span>
                      </div>
                      <h2 className="font-headline-sm text-headline-sm text-on-surface">
                        Split Policy Live Simulator
                      </h2>
                    </div>
                    <span className="bg-surface-container-high text-secondary text-label-caps font-label-caps uppercase px-2 py-0.5 rounded-full font-bold">
                      Interactive
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Test policy shifts before publishing to see how individual cabin member balances change.
                  </p>

                  <div className="bg-surface-container-low p-4 rounded-xl flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                        Simulated Outlay
                      </span>
                      <span className="text-lg font-bold font-numeric text-primary">
                        ₹{simAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                        dinner_dining
                      </span>
                      <input
                        className="flex-1 h-2 bg-surface-dim rounded-full appearance-none cursor-pointer accent-primary"
                        max="99600"
                        min="4980"
                        step="2490"
                        type="range"
                        value={simAmount}
                        onChange={(e) => setSimAmount(Number(e.target.value))}
                      />
                      <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                        downhill_skiing
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-on-surface-variant font-numeric">
                      <span>₹4,980 Breakfast</span>
                      <span className="font-bold text-on-surface">Alpine Fondue Dinner</span>
                      <span>₹99,600 Lift Passes</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 pt-2">
                      {[
                        { id: "equal", label: "Equal (1/6)" },
                        { id: "weighted", label: "Weighted" },
                        { id: "exclude", label: "Ski Excl (4)" },
                      ].map((m) => (
                        <button
                          key={m.id}
                          className={`py-1.5 rounded-lg text-xs transition-all ${
                            simMode === m.id
                              ? "bg-surface-container-lowest text-primary font-bold shadow-xs"
                              : "text-on-surface-variant font-medium hover:bg-surface-container"
                          }`}
                          type="button"
                          onClick={() => setSimMode(m.id)}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    {simResults.map((m, i) => (
                      <div
                        key={m.initials}
                        className={`flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low ${m.excluded ? "opacity-50" : ""}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-7 h-7 rounded-full ${m.avatarClass} text-xs font-bold flex items-center justify-center`}>
                            {m.initials}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-on-surface">
                              {m.name}
                            </span>
                            <span className="text-[10px] text-on-surface-variant">
                              {m.excluded
                                ? "Non-Skier (Excluded ₹0)"
                                : simMode === "weighted" && i === 2
                                  ? "Master Suite (1.5x share)"
                                  : simMode === "equal"
                                    ? "Standard Share (1/6)"
                                    : "Ski Pass Holder (1/4)"}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`font-numeric text-sm font-bold ${
                            m.excluded ? "text-on-surface-variant line-through" : "text-on-surface"
                          }`}
                        >
                          ₹{m.amount.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Co-Hosts & Roles */}
                <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm flex flex-col gap-5 border border-outline-variant/40">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-surface-container-high text-secondary flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
                      </div>
                      <h2 className="font-headline-sm text-headline-sm text-on-surface">
                        Trip Co-Hosts & Roles
                      </h2>
                    </div>
                    <button
                      className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                      type="button"
                      onClick={() => showToast("Invite Co-Host", "Select a confirmed cabin mate to delegate admin rights.")}
                    >
                      <span className="material-symbols-outlined text-[16px]">person_add</span>
                      <span>+ Add Co-Host</span>
                    </button>
                  </div>

                  <div className="flex flex-col gap-3">
                    {CO_HOSTS.map((h) => (
                      <div key={h.initials} className="p-3.5 rounded-xl bg-surface-container-low flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-full ${h.avatarClass} font-bold text-xs flex items-center justify-center`}>
                              {h.initials}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-on-surface">{h.name}</span>
                              <span className="text-[11px] text-on-surface-variant">{h.role}</span>
                            </div>
                          </div>
                          <span className={`${h.badgeClass} text-label-caps font-label-caps px-2 py-0.5 rounded-full`}>
                            {h.badge}
                          </span>
                        </div>
                        {h.delegated && (
                          <div className="pt-1 flex flex-col gap-2 text-xs">
                            <label className="flex items-center justify-between cursor-pointer">
                              <span className="text-on-surface-variant">Manage Members & Invites</span>
                              <input defaultChecked className="rounded text-primary focus:ring-primary h-3.5 w-3.5" type="checkbox" />
                            </label>
                            <label className="flex items-center justify-between cursor-pointer">
                              <span className="text-on-surface-variant">Approve Receipts &gt; ₹8,300</span>
                              <input defaultChecked className="rounded text-primary focus:ring-primary h-3.5 w-3.5" type="checkbox" />
                            </label>
                            <label className="flex items-center justify-between cursor-pointer">
                              <span className="text-on-surface-variant">Force-Reconcile Ledger</span>
                              <input className="rounded text-primary focus:ring-primary h-3.5 w-3.5" type="checkbox" />
                            </label>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="bg-surface-container-low p-3 rounded-xl flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 truncate">
                      <span className="material-symbols-outlined text-[16px] text-on-surface-variant">link</span>
                      <span className="text-xs font-mono text-on-surface truncate">
                        tabsy.app/join/tahoe-ski-26?role=guest
                      </span>
                    </div>
                    <button
                      className="shrink-0 px-2.5 py-1 rounded-lg bg-surface-container-lowest text-xs font-bold text-on-surface hover:bg-surface-container transition-colors"
                      type="button"
                      onClick={() => showToast("Link Copied", "Guest access link copied to clipboard.")}
                    >
                      Copy Link
                    </button>
                  </div>
                </div>

                {/* Audit & Data Exports */}
                <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm flex flex-col gap-4 border border-outline-variant/40">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-surface-variant text-on-surface flex items-center justify-center">
                      <span className="material-symbols-outlined text-[18px]">download_for_offline</span>
                    </div>
                    <h2 className="font-headline-sm text-headline-sm text-on-surface">
                      Audit & Data Exports
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      className="p-3 rounded-xl bg-surface-container-low hover:bg-surface-container text-left transition-colors flex flex-col gap-1"
                      type="button"
                      onClick={() => showToast("CSV Export Started", "Downloading itemized tahoe_ski_ledger.csv")}
                    >
                      <span className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-primary">table_view</span>
                        Download CSV / Excel
                      </span>
                      <span className="text-[11px] text-on-surface-variant">
                        Raw journal logs with itemized timestamps
                      </span>
                    </button>
                    <button
                      className="p-3 rounded-xl bg-surface-container-low hover:bg-surface-container text-left transition-colors flex flex-col gap-1"
                      type="button"
                      onClick={() => showToast("Audit PDF Compiled", "Cryptographic verification report generated.")}
                    >
                      <span className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-secondary">picture_as_pdf</span>
                        Cryptographic PDF
                      </span>
                      <span className="text-[11px] text-on-surface-variant">
                        Merkle verification hash included
                      </span>
                    </button>
                  </div>
                  <button
                    className="w-full py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                    type="button"
                    onClick={() => showToast("Trip Active", "Cannot archive while pending receipts exist.")}
                  >
                    <span className="material-symbols-outlined text-[16px]">inventory_2</span>
                    <span>Cold Archive Group Tab (Read-Only Mode)</span>
                  </button>
                </div>

                {/* Danger Zone */}
                <div className="bg-error-container p-6 rounded-2xl flex flex-col gap-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white text-error flex items-center justify-center">
                      <span className="material-symbols-outlined text-[18px]">warning</span>
                    </div>
                    <h2 className="font-headline-sm text-headline-sm text-on-error-container">
                      Danger Zone
                    </h2>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-on-error-container">Leave Group Tab</span>
                        <span className="text-[11px] text-on-error-container/80">
                          Requires personal balance = ₹0.00
                        </span>
                      </div>
                      <button
                        className="px-3 py-1.5 rounded-lg bg-white text-error hover:bg-error/10 text-xs font-bold transition-colors"
                        type="button"
                        onClick={() => {
                          navigate("/group-leave");
                          window.scrollTo({ top: 0, behavior: "instant" });
                        }}
                      >
                        Leave
                      </button>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-on-error-container">
                          Disband & Delete Group
                        </span>
                        <span className="text-[11px] text-on-error-container/80">
                          Disabled: ₹26,342 pending balance must be zeroed
                        </span>
                      </div>
                      <button
                        className="px-3 py-1.5 rounded-lg bg-white/40 text-on-error-container/40 text-xs font-bold cursor-not-allowed"
                        disabled
                        type="button"
                      >
                        Disband
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Seal Ribbon */}
            <div className="w-full py-4 px-6 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-on-surface-variant border border-outline-variant/40">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-primary">security</span>
                <span className="font-medium">
                  SHA-256 Merkle Ledger Consensus: All modifications signed by trip co-hosts
                </span>
              </div>
              <div className="flex items-center gap-4 font-numeric">
                <span>
                  Hash: <span className="font-mono text-on-surface">e7a9...f420</span>
                </span>
                <span>
                  Reconciliation Sync: <span className="text-primary font-bold">100% OK</span>
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-surface-container-lowest border border-outline-variant/60 shadow-xl p-4 rounded-2xl flex items-center gap-3 z-50 animate-in slide-in-from-bottom duration-300">
          <div className="w-8 h-8 rounded-xl bg-primary-fixed text-on-primary-fixed flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[18px]">check</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-on-surface">{toast.title}</span>
            <span className="text-[11px] text-on-surface-variant">{toast.body}</span>
          </div>
        </div>
      )}
    </AppLayout>
  );
}