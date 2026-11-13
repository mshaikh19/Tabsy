import { useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import GroupHeader from "../components/layout/GroupHeader";

const STEPS = [
  {
    id: 1,
    stepLabel: "Step 01",
    labelClass: "text-primary",
    badge: "In Progress",
    badgeClass: "bg-primary/10 text-primary",
    title: "Reconcile Balance",
    desc: "+₹11,620.00 debt settlement",
    icon: "account_balance",
    pillClass: "bg-primary-container text-on-primary",
  },
  {
    id: 2,
    stepLabel: "Step 02",
    labelClass: "text-outline",
    badge: "Configured",
    badgeClass: "bg-surface-container text-secondary",
    title: "Transfer Admin",
    desc: "Assign Marco Rossi",
    icon: "admin_panel_settings",
    pillClass: "bg-surface-container text-secondary",
  },
  {
    id: 3,
    stepLabel: "Step 03",
    labelClass: "text-outline",
    badge: "Ready",
    badgeClass: "bg-surface-container text-outline",
    title: "Review & Exit",
    desc: "Immutable closure",
    icon: "verified_user",
    pillClass: "bg-surface-container text-on-surface-variant",
  },
];

const RECONCILIATION_OPTIONS = [
  {
    id: "request",
    title: "Request Immediate Settle-Up Payout",
    badge: "Instant SMS Link",
    badgeClass: "text-primary bg-primary/10",
    desc: "Direct Jason to settle via Venmo/Apple Pay. Group exit holds pending settlement confirmation.",
  },
  {
    id: "swap",
    title: "Assign Claim to Marco Rossi (Debt Swap)",
    badge: "Recommended",
    badgeClass: "text-secondary bg-secondary-fixed",
    desc: "Marco absorbs Jason's ₹11,620.00 debt and settles with you directly. You leave immediately at ₹0.00.",
  },
  {
    id: "forgive",
    title: "Forgive Debt (₹11,620.00 Gift)",
    badge: "Zero-out",
    badgeClass: "text-tertiary bg-tertiary-fixed",
    desc: "Treat Jason's share as a gift. The group ledger adjusts with no required payout from him.",
  },
];

const SUCCESSORS = [
  {
    name: "Marco Rossi",
    role: "Co-Host",
    subtitle: "Recommended Co-Host",
    initials: "MR",
    activity: "Activity: High (9 splits)",
    avatarClass: "bg-primary-container text-on-primary",
  },
  {
    name: "Sarah Lin",
    role: "Member",
    subtitle: "Active Participant",
    initials: "SL",
    activity: "Activity: Med (4 splits)",
    avatarClass: "bg-secondary-fixed text-on-secondary-fixed",
  },
  {
    name: "Kim Sato",
    role: "Member",
    subtitle: "Logistics Lead",
    initials: "KS",
    activity: "Activity: High (6 splits)",
    avatarClass: "bg-tertiary-fixed text-on-tertiary-fixed",
  },
];

const TRANSFERRED_PERMISSIONS = [
  { icon: "lock_reset", label: "Ledger lock & freeze authority" },
  { icon: "payments", label: "Payout link modifications" },
  { icon: "person_add", label: "Invite / Remove group peers" },
  { icon: "receipt_long", label: "Export final tax / CSV records" },
];

export default function LeaveGroup() {
  const [activeStep, setActiveStep] = useState(1);
  const [reconciliation, setReconciliation] = useState("request");
  const [successor, setSuccessor] = useState(SUCCESSORS[0]);
  const [exitModalOpen, setExitModalOpen] = useState(false);
  const [exited, setExited] = useState(false);
  const [toast, setToast] = useState(null);

  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(null), 2600);
  }

  function switchStep(stepNum) {
    setActiveStep(stepNum);
    showToast(`Viewing Step 0${stepNum} configuration`);
  }

  function updateReconciliation(type) {
    setReconciliation(type);
    const messages = {
      request: "Settlement set: Request Fast Payout (₹11,620.00)",
      swap: `Debt Novation: ${successor.name} assumes ₹11,620.00 claim`,
      forgive: "Debt zeroed out: balance marked as forgiven",
    };
    showToast(messages[type]);
  }

  function selectSuccessor(s) {
    setSuccessor(s);
    showToast(`Successor updated to ${s.name}`);
  }

  const resolution = {
    request: { text: "Fast Payout (₹11,620.00)", className: "text-primary" },
    swap: { text: `Assigned to ${successor.name} (₹0.00 Net)`, className: "text-secondary" },
    forgive: { text: "Forgiven as Gift (₹0.00 Net)", className: "text-outline" },
  }[reconciliation];

  const clearance = {
    request: { note: "Venmo/Apple Pay link prepped", percent: "100% Ready", barClass: "bg-primary-container" },
    swap: { note: `Claim successfully transferred to ${successor.name}`, percent: "100% Ready (Instant)", barClass: "bg-secondary-container" },
    forgive: { note: "Debt absorbed and archived", percent: "100% Ready", barClass: "bg-primary-container" },
  }[reconciliation];

  const modalSettleText = {
    request: "Fast Payout (₹11,620.00)",
    swap: `Debt Novation to ${successor.name}`,
    forgive: "Forgiven (₹0.00)",
  }[reconciliation];

  function confirmExit() {
    setExitModalOpen(false);
    showToast("Group departure finalized! Redirecting to Groups list...");
    setTimeout(() => setExited(true), 1000);
  }

  return (
    <AppLayout>
      <div className="bg-background font-body-md text-on-surface antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
        <main className="w-full pt-0 pb-24 bg-background min-h-screen">
          <div className="max-w-7xl w-full mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop flex flex-col gap-6">
            <GroupHeader
              title="Leave Tahoe Ski Weekend ❄️"
              subtitle="Guided exit protocol — reconcile your balance, transfer host admin, and detach cleanly with zero dangling balances."
              icon="logout"
              iconLabel="Handover & Resolution Protocol"
              dateLabel=""
              locationLabel=""
              currentLabel="Safe Exit Wizard"
              breadcrumbs={[
                { label: "Groups", to: "/groups", icon: "group" },
                { label: "Tahoe Ski Weekend ❄️", to: "/group-details" },
              ]}
              actions={
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-container-low border border-outline-variant/40">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary-container inline-block" />
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Active Member: <strong className="text-on-surface font-semibold">Alex Morgan (Admin)</strong>
                  </span>
                </div>
              }
            />

            {/* Stepper Node Progression Track */}
            <div className="bg-surface-container-lowest rounded-2xl p-space-md lg:p-space-lg shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md relative">
                {STEPS.map((step) => {
                  const isActive = activeStep === step.id;
                  return (
                    <button
                      key={step.id}
                      className={`flex items-start gap-space-sm text-left group transition-all cursor-pointer p-space-xs rounded-xl ${
                        isActive ? "bg-surface-container-low" : "hover:bg-surface-container-low"
                      }`}
                      type="button"
                      onClick={() => switchStep(step.id)}
                    >
                      <div
                        className={`w-10 h-10 rounded-full ${step.pillClass} flex items-center justify-center font-headline-sm text-headline-sm shrink-0 shadow-sm transition-transform group-hover:scale-105`}
                      >
                        <span className="material-symbols-outlined text-[20px]">{step.icon}</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className={`font-label-caps text-label-caps uppercase ${step.labelClass} font-bold`}>
                            {step.stepLabel}
                          </span>
                          <span
                            className={`font-body-sm text-body-sm px-2 py-0.5 rounded-full font-semibold ${
                              isActive ? "bg-primary/10 text-primary" : step.badgeClass
                            }`}
                          >
                            {isActive ? "Active" : step.badge}
                          </span>
                        </div>
                        <span className="font-title-md text-title-md font-bold text-on-surface truncate">
                          {step.title}
                        </span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">{step.desc}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Context Note Banner */}
              <div className="mt-space-md bg-surface-container-low rounded-xl px-space-md py-space-sm flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-primary text-[22px] shrink-0">info</span>
                <p className="font-body-md text-body-md text-on-surface">
                  <strong>Guided Exit Protocol:</strong> Tabsy guarantees zero dangling balances and continuity
                  for all remaining 5 members before token revocation.
                </p>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
              {/* Left Column: Configuration */}
              <div className="lg:col-span-7 flex flex-col gap-space-md">
                {/* SECTION A: Balance Reconciler */}
                <div className="bg-surface-container-lowest rounded-2xl p-space-md lg:p-space-lg shadow-sm flex flex-col gap-space-md">
                  <div className="flex items-center justify-between pb-space-xs">
                    <div className="flex items-center gap-space-xs">
                      <span className="w-7 h-7 rounded-lg bg-surface-container text-primary font-bold flex items-center justify-center text-sm">
                        1
                      </span>
                      <div>
                        <h2 className="font-title-md text-title-md font-bold text-on-surface">
                          Balance Reconciliation
                        </h2>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          You have a net credit surplus of +₹11,620.00
                        </p>
                      </div>
                    </div>
                    <span className="px-space-sm py-1 rounded-full bg-surface-container text-primary font-numeric-balance-md text-numeric-balance-md font-bold">
                      +₹11,620.00
                    </span>
                  </div>

                  {/* Debtor Callout Tile */}
                  <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
                    <div className="flex items-center gap-space-sm">
                      <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center shrink-0">
                        <span className="font-title-md text-title-md font-bold text-secondary">JP</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-title-md text-title-md font-bold text-on-surface">
                            Jason Powell
                          </span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">
                            • Tahoe Cabin Rental share
                          </span>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Pending since Feb 14 (3 days ago) • Venmo/Zelle linked
                        </p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="font-label-caps text-label-caps uppercase text-outline">
                        Jason Owes You
                      </span>
                      <div className="font-headline-sm text-headline-sm font-bold text-primary">₹11,620.00</div>
                    </div>
                  </div>

                  {/* Radio Actions for Resolution */}
                  <div className="flex flex-col gap-space-xs">
                    <span className="font-label-caps text-label-caps uppercase text-outline font-semibold">
                      Select Handover Resolution
                    </span>
                    {RECONCILIATION_OPTIONS.map((opt) => {
                      const selected = reconciliation === opt.id;
                      return (
                        <label
                          key={opt.id}
                          className={`group relative flex items-start gap-space-sm p-space-sm rounded-xl cursor-pointer transition-all ${
                            selected
                              ? "bg-surface-container-low"
                              : "bg-surface-container-lowest hover:bg-surface-container-low"
                          }`}
                        >
                          <input
                            className="mt-1 accent-primary w-4 h-4 cursor-pointer"
                            name="reconcile-action"
                            type="radio"
                            value={opt.id}
                            checked={selected}
                            onChange={() => updateReconciliation(opt.id)}
                          />
                          <div className="flex flex-col flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-title-md text-title-md font-bold text-on-surface">
                                {opt.title}
                              </span>
                              <span
                                className={`font-label-caps text-label-caps px-2 py-0.5 rounded-full font-bold ${opt.badgeClass}`}
                              >
                                {opt.badge}
                              </span>
                            </div>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">{opt.desc}</p>
                          </div>
                        </label>
                      );
                    })}
                  </div>

                  {/* Clearance Meter Widget */}
                  <div className="bg-surface-container-low rounded-xl p-space-sm flex flex-col gap-space-xs mt-space-xs">
                    <div className="flex items-center justify-between font-body-sm text-body-sm">
                      <span className="text-on-surface-variant font-medium flex items-center gap-1">
                        <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                        Exit Clearance Readiness
                      </span>
                      <span className="font-bold text-primary">{clearance.percent}</span>
                    </div>
                    <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
                      <div className={`${clearance.barClass} h-full rounded-full transition-all duration-300`} style={{ width: "100%" }} />
                    </div>
                    <div className="flex items-center justify-between font-label-caps text-label-caps text-outline pt-0.5">
                      <span>Ledger Parity Verified</span>
                      <span>{clearance.note}</span>
                    </div>
                  </div>
                </div>

                {/* SECTION B: Designate Successor Organiser */}
                <div className="bg-surface-container-lowest rounded-2xl p-space-md lg:p-space-lg shadow-sm flex flex-col gap-space-md">
                  <div className="flex items-center justify-between pb-space-xs">
                    <div className="flex items-center gap-space-xs">
                      <span className="w-7 h-7 rounded-lg bg-surface-container text-secondary font-bold flex items-center justify-center text-sm">
                        2
                      </span>
                      <div>
                        <h2 className="font-title-md text-title-md font-bold text-on-surface">
                          Designate Successor Organiser
                        </h2>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Groups require at least one active Host to finalize bills
                        </p>
                      </div>
                    </div>
                    <span className="font-label-caps text-label-caps bg-surface-container-low text-secondary px-2.5 py-1 rounded-full font-bold uppercase">
                      Mandatory
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
                    {SUCCESSORS.map((s) => {
                      const selected = successor.name === s.name;
                      return (
                        <button
                          key={s.name}
                          className={`text-left p-space-sm rounded-xl transition-all flex flex-col gap-space-xs shadow-sm cursor-pointer ${
                            selected ? "bg-surface-container" : "bg-surface-container-low hover:bg-surface-container"
                          }`}
                          type="button"
                          onClick={() => selectSuccessor(s)}
                        >
                          <div className="flex items-center justify-between">
                            <div
                              className={`w-10 h-10 rounded-full ${s.avatarClass} flex items-center justify-center font-bold text-body-md`}
                            >
                              {s.initials}
                            </div>
                            <span
                              className={`material-symbols-outlined text-[20px] ${
                                selected ? "text-primary" : "text-outline"
                              }`}
                            >
                              {selected ? "check_circle" : "radio_button_unchecked"}
                            </span>
                          </div>
                          <div>
                            <div className="font-title-md text-title-md font-bold text-on-surface">{s.name}</div>
                            <div
                              className={`font-body-sm text-body-sm font-medium ${
                                selected ? "text-primary" : "text-on-surface-variant"
                              }`}
                            >
                              {s.subtitle}
                            </div>
                          </div>
                          <div className="font-label-caps text-label-caps text-outline mt-1">{s.activity}</div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Handover Permissions Details Box */}
                  <div className="bg-surface-container-low rounded-xl p-space-sm flex flex-col gap-space-xs">
                    <span className="font-label-caps text-label-caps uppercase text-outline font-bold">
                      Permissions Transferred Automatically:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-xs font-body-sm text-body-sm text-on-surface pt-1">
                      {TRANSFERRED_PERMISSIONS.map((p) => (
                        <div key={p.label} className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-primary text-[18px]">{p.icon}</span>
                          {p.label}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Departure Manifest */}
              <div className="lg:col-span-5 flex flex-col gap-space-md">
                <div className="bg-surface-container-lowest rounded-2xl p-space-md lg:p-space-lg shadow-sm flex flex-col gap-space-md">
                  <div className="flex items-center justify-between pb-space-xs">
                    <div className="flex items-center gap-space-xs">
                      <span className="w-8 h-8 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px]">preview</span>
                      </span>
                      <div>
                        <h3 className="font-title-md text-title-md font-bold text-on-surface">
                          Departure Manifest
                        </h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Live generated exit summary
                        </p>
                      </div>
                    </div>
                    <span className="font-label-caps text-label-caps uppercase text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-full">
                      Valid
                    </span>
                  </div>

                  <div className="flex flex-col gap-space-xs divide-y divide-surface-container-low">
                    <div className="flex items-center justify-between py-2">
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Departing Member</span>
                      <div className="flex items-center gap-1.5">
                        <span className="w-6 h-6 rounded-full bg-primary-container text-on-primary font-bold text-xs flex items-center justify-center">
                          AM
                        </span>
                        <span className="font-body-md text-body-md font-semibold text-on-surface">
                          Alex Morgan
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-outline">(Host)</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Balance Settlement</span>
                      <span className={`font-body-md text-body-md font-bold ${resolution.className}`}>
                        {resolution.text}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Post-Exit Balance</span>
                      <div className="flex items-center gap-1">
                        <span className="font-numeric-balance-md text-numeric-balance-md font-bold text-on-surface">
                          ₹0.00
                        </span>
                        <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="font-body-sm text-body-sm text-on-surface-variant">New Primary Host</span>
                      <div className="flex items-center gap-1.5">
                        <span className="w-6 h-6 rounded-full bg-secondary-container text-on-secondary font-bold text-xs flex items-center justify-center">
                          {successor.initials}
                        </span>
                        <span className="font-body-md text-body-md font-semibold text-on-surface">
                          {successor.name}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Past Outlays Retained</span>
                      <div className="text-right">
                        <span className="font-body-md text-body-md font-semibold text-on-surface">₹81,340.00</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant block">
                          3 receipts archived
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Group Access Key</span>
                      <span className="font-body-sm text-body-sm text-tertiary font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">key_off</span>
                        Revoked upon exit
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-space-xs pt-space-xs">
                    <button
                      className={`w-full py-space-sm px-space-md rounded-xl font-title-md text-title-md font-bold transition-all flex items-center justify-center gap-2 ${
                        exited
                          ? "bg-surface-container text-on-surface-variant cursor-not-allowed"
                          : "bg-tertiary text-on-tertiary hover:bg-on-tertiary-fixed-variant active:scale-[0.99] shadow-md cursor-pointer"
                      }`}
                      type="button"
                      disabled={exited}
                      onClick={() => setExitModalOpen(true)}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {exited ? "task_alt" : "logout"}
                      </span>
                      {exited ? "Departure Complete" : "Step 3: Finalize & Depart Group"}
                    </button>
                    <Link
                      className="text-center py-space-xs font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface font-medium transition-colors"
                      to="/group-details"
                    >
                      Stay in Tahoe Ski Weekend
                    </Link>
                  </div>
                </div>

                {/* Soft Exit Alternatives Box */}
                <div className="bg-surface-container-low rounded-2xl p-space-md shadow-sm flex flex-col gap-space-sm">
                  <div className="flex items-center gap-space-xs text-on-surface">
                    <span className="material-symbols-outlined text-secondary text-[20px]">pause_circle</span>
                    <span className="font-title-md text-title-md font-bold">Not sure? Pause without leaving</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    You can silence push notifications and keep your historical access while taking a break from
                    notifications.
                  </p>
                  <div className="grid grid-cols-2 gap-space-xs pt-space-xs">
                    <button
                      className="py-space-xs px-space-sm rounded-xl bg-surface-container-lowest text-on-surface font-body-sm text-body-sm font-semibold hover:bg-surface-container transition-all flex items-center justify-center gap-1 cursor-pointer"
                      type="button"
                      onClick={() => showToast("Group snoozed for 30 days!")}
                    >
                      <span className="material-symbols-outlined text-[16px]">snooze</span>
                      Snooze 30 Days
                    </button>
                    <button
                      className="py-space-xs px-space-sm rounded-xl bg-surface-container-lowest text-on-surface font-body-sm text-body-sm font-semibold hover:bg-surface-container transition-all flex items-center justify-center gap-1 cursor-pointer"
                      type="button"
                      onClick={() => showToast("Converted to Read-Only member!")}
                    >
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                      Read-Only Mode
                    </button>
                  </div>
                </div>

                {/* Mini Ledger Status Visual Card */}
                <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-space-sm">
                    <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[20px]">pie_chart</span>
                    </div>
                    <div>
                      <div className="font-body-md text-body-md font-bold text-on-surface">
                        Group Settlement Rate
                      </div>
                      <div className="font-body-sm text-body-sm text-on-surface-variant">
                        92% settled • 1 pending outlay
                      </div>
                    </div>
                  </div>
                  <span className="font-title-md text-title-md font-bold text-primary">92%</span>
                </div>
              </div>
            </div>

            {/* Security & Consensus Footer Bar */}
            <div className="bg-surface-container-low rounded-xl px-space-md py-space-sm flex flex-col sm:flex-row items-center justify-between gap-space-xs text-on-surface-variant font-body-sm text-body-sm shadow-sm">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                <span>Consensus-backed exit verification • Zero-sum ledger parity intact</span>
              </div>
              <div className="flex items-center gap-space-sm font-label-caps text-label-caps uppercase text-outline">
                <span>Tabsy Engine v3.4</span>
                <span>•</span>
                <span>TLS 256-bit Encrypted</span>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Interactive Confirmation Dialog / Modal */}
      {exitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/40 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-space-lg shadow-xl flex flex-col gap-space-md">
            <div className="w-14 h-14 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[32px]">warning</span>
            </div>
            <div className="text-center">
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Confirm Departure</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                You are about to transfer Host admin to{" "}
                <strong className="text-on-surface">{successor.name}</strong> and permanently detach your
                account from <strong className="text-on-surface">Tahoe Ski Weekend ❄️</strong>.
              </p>
            </div>
            <div className="bg-surface-container-low rounded-xl p-space-sm flex flex-col gap-1 text-left font-body-sm text-body-sm">
              <div className="flex justify-between text-on-surface-variant">
                <span>Settlement Mode:</span>
                <span className="font-semibold text-on-surface">{modalSettleText}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Successor Admin:</span>
                <span className="font-semibold text-on-surface">
                  {successor.name} ({successor.role})
                </span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Active Status:</span>
                <span className="font-semibold text-tertiary">Permanent Deactivation</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-space-xs pt-space-xs">
              <button
                className="flex-1 py-space-sm px-space-md rounded-xl bg-tertiary text-on-tertiary font-title-md text-title-md font-bold hover:bg-on-tertiary-fixed-variant transition-colors flex items-center justify-center gap-1 cursor-pointer"
                type="button"
                onClick={confirmExit}
              >
                <span className="material-symbols-outlined text-[18px]">check</span>
                Yes, Leave Group
              </button>
              <button
                className="flex-1 py-space-sm px-space-md rounded-xl bg-surface-container text-on-surface font-title-md text-title-md font-bold hover:bg-surface-container-high transition-colors cursor-pointer"
                type="button"
                onClick={() => setExitModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Micro-interaction Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-inverse-surface text-inverse-on-surface font-body-sm text-body-sm py-2 px-4 rounded-xl shadow-lg flex items-center gap-2">
          <span className="material-symbols-outlined text-primary-fixed text-[18px]">check_circle</span>
          <span>{toast}</span>
        </div>
      )}
    </AppLayout>
  );
}