import { useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import GroupHeader from "../components/layout/GroupHeader";

const ROLE_OPTIONS = [
  {
    value: "Organizer",
    label: "Organizer",
    icon: "shield_person",
    color: "text-primary",
    bg: "bg-primary-fixed/40",
  },
  {
    value: "Member",
    label: "Member",
    icon: "person",
    color: "text-on-surface-variant",
    bg: "bg-surface-container-high",
  },
  {
    value: "View-Only",
    label: "View-Only",
    icon: "visibility",
    color: "text-outline",
    bg: "bg-surface-container-low",
  },
];

const DEFAULT_ROLE_OPTIONS = [
  {
    value: "Member",
    label: "Member",
    icon: "person",
    color: "text-on-surface-variant",
    bg: "bg-surface-container-high",
  },
  {
    value: "View-Only",
    label: "View-Only",
    icon: "visibility",
    color: "text-outline",
    bg: "bg-surface-container-low",
  },
];

function CustomSelect({
  value,
  onChange,
  options,
  size = "sm",
  variant = "default",
  className = "",
  ariaLabel,
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value) || options[0];

  const sizeClasses =
    size === "xs"
      ? "px-1.5 py-0.5 text-[10px] gap-1"
      : "px-2.5 py-1.5 text-[11px] gap-1.5";

  const variantClasses =
    variant === "chip"
      ? `${selected.bg} ${selected.color} hover:opacity-80`
      : "bg-surface-container-low border border-surface-container text-on-surface hover:bg-surface-container transition-colors";

  const iconSize = size === "xs" ? "text-[12px]" : "text-[14px]";

  return (
    <div
      className={`relative ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        className={`flex items-center rounded-lg font-label-caps text-label-caps cursor-pointer outline-none transition-all ${sizeClasses} ${variantClasses}`}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
      >
        <span
          className={`material-symbols-outlined ${iconSize} shrink-0`}
        >
          {selected.icon}
        </span>
        <span className="truncate">{selected.label}</span>
        <span
          className={`material-symbols-outlined ${iconSize} transition-transform duration-200 shrink-0 ${open ? "rotate-180" : ""}`}
        >
          expand_more
        </span>
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div
            className="absolute left-0 top-full mt-1 z-50 min-w-[140px] bg-surface-container-lowest border border-surface-container-high rounded-xl shadow-lg shadow-zinc-900/10 p-1 flex flex-col gap-0.5"
            role="listbox"
          >
            {options.map((opt) => {
              const active = opt.value === value;
              return (
                <button
                  className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-left text-[11px] font-medium transition-all ${
                    active
                      ? `${opt.bg} ${opt.color}`
                      : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                  }`}
                  key={opt.value}
                  role="option"
                  aria-selected={active}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(opt.value);
                    setOpen(false);
                  }}
                >
                  <span className="material-symbols-outlined text-[14px] shrink-0">
                    {opt.icon}
                  </span>
                  <span className="flex-1">{opt.label}</span>
                  {active && (
                    <span className="material-symbols-outlined text-[14px] text-primary shrink-0">
                      check
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function RoleDropdown({ value, onChange }) {
  return (
    <div className="-ml-0.5">
      <CustomSelect
        ariaLabel="Member role"
        size="xs"
        value={value}
        onChange={onChange}
        options={ROLE_OPTIONS}
        variant="chip"
      />
    </div>
  );
}

const INITIAL_PENDING = [
  {
    id: "ps",
    initials: "PS",
    name: "Priya Sharma",
    detail: "priya.s@email.com",
    role: "Member",
    avatarClass: "bg-surface-container-high text-on-surface-variant",
  },
  {
    id: "rm",
    initials: "RM",
    name: "Rahul Mehta",
    detail: "@rahul_skis",
    role: "View-Only",
    avatarClass: "bg-surface-container-high text-on-surface-variant",
  },
];

const INVITE_LINK = "tabsy.app/j/tahoe-2026";

export default function AddMembers() {
  const [inputValue, setInputValue] = useState("");
  const [chips, setChips] = useState([
    { id: 1, label: "sam@tahoecamp.org", role: "Organizer" },
  ]);
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [pending, setPending] = useState(INITIAL_PENDING);
  const [copied, setCopied] = useState(false);
  const [showAllRoster, setShowAllRoster] = useState(false);

  function handleKeyDown(e) {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      setChips((prev) => [
        ...prev,
        { id: Date.now(), label: inputValue.trim(), role: "Member" },
      ]);
      setInputValue("");
    }
  }

  function removeChip(id) {
    setChips((prev) => prev.filter((c) => c.id !== id));
  }

  function resendInvite(name) {
    setPending((prev) =>
      prev.map((p) => (p.name === name ? { ...p, resent: true } : p))
    );
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(`https://${INVITE_LINK}`);
    } catch {
      // Clipboard API not available; still show feedback.
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <AppLayout>
      <div className="bg-[#FAF8F5] font-body-md text-on-surface antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
        <main className="w-full pt-0 pb-24 bg-[#FAF8F5] min-h-screen">
          <div className="max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
            <GroupHeader
              title="Tahoe Ski Weekend ❄️"
              subtitle="Invite friends to split the cabin, groceries, and lift tickets. No download required to join the ledger."
              currentLabel="Add Members"
              actions={
                <>
                  <Link
                    className="group/btn relative inline-flex items-center gap-0 px-2.5 py-2 text-on-surface font-title-md text-title-md hover:bg-surface-container-lowest rounded-lg transition-all duration-300 ease-out overflow-hidden"
                    to="/group-members"
                  >
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover/btn:text-secondary transition-colors shrink-0">
                      group
                    </span>
                    <span className="max-w-0 group-hover/btn:max-w-[120px] group-hover/btn:ml-2 overflow-hidden whitespace-nowrap transition-all duration-300 ease-out opacity-0 group-hover/btn:opacity-100">
                      View Members
                    </span>
                  </Link>
                  <div className="w-px h-5 bg-outline-variant/40 shrink-0 transition-all duration-300 group-hover/actions:bg-transparent" />
                  <Link
                    className="group/btn relative inline-flex items-center gap-0 px-2.5 py-2 bg-primary-container text-on-primary-container font-title-md text-title-md hover:opacity-95 rounded-lg transition-all duration-300 ease-out overflow-hidden"
                    to="/group-expenses"
                  >
                    <span className="material-symbols-outlined text-[18px] relative z-10 shrink-0">
                      receipt_long
                    </span>
                    <span className="max-w-0 group-hover/btn:max-w-[120px] group-hover/btn:ml-2 overflow-hidden whitespace-nowrap transition-all duration-300 ease-out opacity-0 group-hover/btn:opacity-100">
                      View Expenses
                    </span>
                  </Link>
                  <div className="w-px h-5 bg-outline-variant/40 shrink-0 transition-all duration-300 group-hover/actions:bg-transparent" />
                  <button
                    className="group/btn inline-flex items-center gap-0 px-2.5 py-2 text-on-surface font-title-md text-title-md hover:bg-surface-container-lowest rounded-lg transition-all duration-300 ease-out overflow-hidden"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover/btn:text-on-surface transition-colors shrink-0">
                      download
                    </span>
                    <span className="max-w-0 group-hover/btn:max-w-[120px] group-hover/btn:ml-2 overflow-hidden whitespace-nowrap transition-all duration-300 ease-out opacity-0 group-hover/btn:opacity-100">
                      Export Roster
                    </span>
                  </button>
                </>
              }
            />

            {/* KPI Bento Ribbon */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-sm">
              <div className="bg-surface-container-lowest p-space-md rounded-2xl border border-outline-variant/60 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider">
                    Active Members
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-surface-container-low text-on-surface-variant flex items-center justify-center">
                    <span className="material-symbols-outlined text-[16px]">
                      group
                    </span>
                  </div>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-numeric-balance-lg text-numeric-balance-lg text-on-surface tracking-tight">
                    7
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-1.5 font-body-sm text-body-sm text-on-surface-variant">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-container" />
                  <span>6 friends + you</span>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-space-md rounded-2xl border border-outline-variant/60 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider">
                    Awaiting Response
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-surface-container-low text-on-surface-variant flex items-center justify-center">
                    <span className="material-symbols-outlined text-[16px]">
                      hourglass_top
                    </span>
                  </div>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-numeric-balance-lg text-numeric-balance-lg text-on-surface tracking-tight">
                    {pending.length}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-1.5 font-body-sm text-body-sm text-on-surface-variant">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed-dim" />
                  <span>Invites pending</span>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-space-md rounded-2xl border border-outline-variant/60 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="font-label-caps text-label-caps uppercase text-primary font-bold tracking-wider">
                    Organizers
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-primary-fixed text-on-primary-fixed flex items-center justify-center">
                    <span className="material-symbols-outlined text-[16px]">
                      shield_person
                    </span>
                  </div>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-numeric-balance-lg text-numeric-balance-lg text-primary tracking-tight">
                    2
                  </span>
                  <span className="font-label-caps text-label-caps text-primary uppercase font-bold">
                    Admins
                  </span>
                </div>
                <div className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
                  Full ledger control
                </div>
              </div>

              <div className="bg-surface-container-lowest p-space-md rounded-2xl border border-outline-variant/60 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider">
                    QR Link Active
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-surface-container-low text-on-surface-variant flex items-center justify-center">
                    <span className="material-symbols-outlined text-[16px]">
                      qr_code_2
                    </span>
                  </div>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-numeric-balance-lg text-numeric-balance-lg text-on-surface tracking-tight">
                    5h 42m
                  </span>
                </div>
                <div className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
                  No app download needed
                </div>
              </div>
            </section>

            {/* Main Bento Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Column 1: Invite Engine + Pending Queue */}
              <section className="lg:col-span-5 flex flex-col gap-6">
                {/* Multi-Channel Invite Engine */}
                <div className="bg-surface-container-lowest border border-surface-container-high rounded-2xl p-5 shadow-[0_2px_10px_rgba(19,27,46,0.02)] flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-surface-container-high text-secondary flex items-center justify-center">
                        <span className="material-symbols-outlined text-[16px]">
                          group_add
                        </span>
                      </div>
                      <h2 className="font-bold text-sm text-on-surface">
                        Multi-Channel Invite Engine
                      </h2>
                    </div>
                    <span className="text-[11px] font-semibold text-primary uppercase tracking-wider bg-primary-fixed/40 px-2 py-0.5 rounded-md">
                      Batch
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-on-surface-variant">
                      Add members by email or Tabsy handle
                    </label>
                    <div
                      className="min-h-[52px] w-full bg-surface-container-low rounded-xl border border-surface-container p-2 flex flex-wrap gap-1.5 items-center cursor-text focus-within:border-outline-variant focus-within:ring-1 focus-within:ring-primary/20 transition-all"
                      onClick={() => {
                        const input =
                          document.getElementById("invite-input");
                        if (input) input.focus();
                      }}
                    >
                      {chips.map((chip) => (
                        <span
                          className="inline-flex items-center gap-1 pl-2.5 pr-1 py-1 rounded-lg bg-surface-container-highest text-on-surface text-body-sm font-medium border border-outline-variant/40"
                          key={chip.id}
                        >
                          {chip.label}
                          <span className="w-1.5 h-1.5 rounded-full bg-primary-container ml-0.5" />
                          <RoleDropdown
                            value={chip.role}
                            onChange={(newRole) => {
                              setChips((prev) =>
                                prev.map((c) =>
                                  c.id === chip.id
                                    ? { ...c, role: newRole }
                                    : c
                                )
                              );
                            }}
                          />
                          <button
                            className="w-5 h-5 rounded-md flex items-center justify-center text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeChip(chip.id);
                            }}
                          >
                            <span className="material-symbols-outlined text-[14px]">
                              close
                            </span>
                          </button>
                        </span>
                      ))}
                      <input
                        className="flex-1 min-w-[140px] bg-transparent border-none outline-none text-body-md font-body-md text-on-surface placeholder:text-outline px-1.5 py-1"
                        id="invite-input"
                        placeholder="name@email.com or @handle"
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="font-label-caps text-label-caps text-on-surface-variant">
                        QUICK ADD:
                      </span>
                      <button className="px-2 py-0.5 rounded-md bg-surface-container-low border border-surface-container text-[11px] font-medium text-on-surface-variant hover:border-outline-variant hover:text-on-surface transition-colors">
                        + Cabin
                      </button>
                      <button className="px-2 py-0.5 rounded-md bg-surface-container-low border border-surface-container text-[11px] font-medium text-on-surface-variant hover:border-outline-variant hover:text-on-surface transition-colors">
                        + Ski Crew
                      </button>
                    </div>
                    <span className="text-body-sm text-body-sm text-outline">
                      {chips.length} queued
                    </span>
                  </div>

                  <div className="pt-3 border-t border-surface-container">
                    <button
                      aria-expanded={welcomeOpen}
                      className="w-full flex items-center justify-between text-left group"
                      type="button"
                      onClick={() => setWelcomeOpen((v) => !v)}
                    >
                      <span className="flex items-center gap-2 text-body-md font-body-md font-medium text-on-surface">
                        <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                          mail
                        </span>
                        Customize Welcome Message
                      </span>
                      <span
                        className={`material-symbols-outlined text-[18px] text-outline transition-transform ${welcomeOpen ? "rotate-180" : ""}`}
                      >
                        expand_more
                      </span>
                    </button>
                    {welcomeOpen && (
                      <div className="mt-3">
                        <textarea
                          className="w-full bg-surface-container-low rounded-xl border border-surface-container p-3 text-body-md font-body-md text-on-surface placeholder:text-outline focus:outline-none focus:border-outline-variant focus:ring-1 focus:ring-primary/20 resize-none transition-all"
                          defaultValue="Hey! Join our Tahoe trip ledger on Tabsy to track shared expenses and settle up at the end."
                          rows={3}
                        />
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-body-sm text-body-sm text-outline">
                            Sent with your invite link
                          </span>
                          <span className="text-body-sm text-body-sm text-outline">
                            0/240
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary-container text-on-primary-container font-title-md text-title-md shadow-sm hover:opacity-95 active:scale-[0.99] transition-all">
                    <span className="material-symbols-outlined text-[18px]">
                      send
                    </span>
                    Send Invites
                  </button>
                </div>

                {/* Pending Queue */}
                <div className="bg-surface-container-lowest border border-surface-container-high rounded-2xl p-5 shadow-[0_2px_10px_rgba(19,27,46,0.02)] flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-surface-container-high text-on-surface flex items-center justify-center">
                        <span className="material-symbols-outlined text-[16px]">
                          schedule
                        </span>
                      </div>
                      <h2 className="font-bold text-sm text-on-surface">
                        Pending Queue
                      </h2>
                    </div>
                    <span className="text-[10px] font-bold bg-secondary-fixed text-on-secondary-fixed px-2 py-0.5 rounded-full">
                      {pending.length} Pending
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {pending.map((p) => (
                      <div
                        className="group flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low border border-surface-container hover:border-outline-variant/60 transition-colors"
                        key={p.id}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 ${p.avatarClass}`}
                          >
                            {p.initials}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-on-surface truncate">
                                {p.name}
                              </span>
                              <span className="text-[10px] font-label-caps text-label-caps px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface-variant">
                                {p.role}
                              </span>
                            </div>
                            <div className="text-[11px] text-outline truncate mt-0.5">
                              {p.detail} · Sent 2h ago
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            className="w-7 h-7 rounded-md flex items-center justify-center text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
                            title="Resend invite"
                            type="button"
                            onClick={() => resendInvite(p.name)}
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              refresh
                            </span>
                          </button>
                          <button
                            className="w-7 h-7 rounded-md flex items-center justify-center text-outline hover:text-error hover:bg-error-container/30 transition-colors"
                            title="Revoke invite"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              cancel
                            </span>
                          </button>
                        </div>
                        {p.resent && (
                          <span className="text-[10px] font-label-caps text-label-caps text-primary ml-2 shrink-0">
                            SENT
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Column 2: Instant Join Hub */}
              <section className="lg:col-span-3 flex flex-col gap-6">
                <div className="bg-surface-container-lowest border border-surface-container-high rounded-2xl p-5 shadow-[0_2px_10px_rgba(19,27,46,0.02)] h-full flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-surface-container-high text-secondary flex items-center justify-center">
                        <span className="material-symbols-outlined text-[16px]">
                          qr_code_2
                        </span>
                      </div>
                      <h2 className="font-bold text-sm text-on-surface">
                        Instant Join Hub
                      </h2>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-primary-container" />
                  </div>

                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                      Shortlink
                    </div>
                    <div className="flex items-center bg-surface-container-low rounded-xl border border-surface-container p-1 pl-3">
                      <span className="text-[12px] font-mono text-on-surface-variant truncate flex-1">
                        {INVITE_LINK}
                      </span>
                      <button
                        className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center text-on-surface hover:opacity-80 transition-opacity shrink-0"
                        type="button"
                        onClick={copyLink}
                        title="Copy link"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {copied ? "check" : "content_copy"}
                        </span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                      Gate QR Pass
                    </div>
                    <div className="bg-surface-container-low border border-surface-container rounded-xl p-4 flex flex-col items-center justify-center flex-1 min-h-[160px]">
                      <div className="w-36 h-36 bg-white rounded-lg border border-surface-container flex items-center justify-center shadow-inner">
                        <div
                          className="w-28 h-28"
                          style={{
                            backgroundImage:
                              "repeating-linear-gradient(0deg,#131b2e,#131b2e 6px,transparent 6px,transparent 12px),repeating-linear-gradient(90deg,#131b2e,#131b2e 6px,transparent 6px,transparent 12px)",
                            backgroundBlendMode: "multiply",
                            opacity: 0.85,
                          }}
                        />
                      </div>
                      <div className="text-[11px] text-on-surface-variant mt-3 text-center">
                        Scan to join · No app download needed
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-surface-container flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-on-surface-variant">
                        Link expires
                      </span>
                      <span className="text-xs font-semibold text-on-surface">
                        Never
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-on-surface-variant">
                        Default role
                      </span>
                      <CustomSelect
                        ariaLabel="Default role"
                        value="Member"
                        onChange={() => {}}
                        options={DEFAULT_ROLE_OPTIONS}
                        size="sm"
                      />
                    </div>
                  </div>

                  <button className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-surface-container-low border border-surface-container text-body-md font-body-md text-on-surface hover:bg-surface-container transition-colors">
                    <span className="material-symbols-outlined text-[16px]">
                      settings
                    </span>
                    Link Settings
                  </button>
                </div>
              </section>

              {/* Column 3: Active Roster + Pro Tip */}
              <section className="lg:col-span-4 flex flex-col gap-6">
                <div className="bg-surface-container-lowest border border-surface-container-high rounded-2xl shadow-[0_2px_10px_rgba(19,27,46,0.02)] flex-1 flex flex-col overflow-hidden">
                  {/* Card Header */}
                  <div className="px-5 pt-5 pb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-primary-fixed/40 text-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px]">
                          diversity_3
                        </span>
                      </div>
                      <div>
                        <h2 className="font-bold text-sm text-on-surface leading-none">
                          Active Roster
                        </h2>
                        <p className="text-[11px] text-on-surface-variant mt-1">
                          {showAllRoster ? "7" : "5"} of 7 members
                        </p>
                      </div>
                    </div>
                    <button className="w-8 h-8 rounded-lg flex items-center justify-center text-outline hover:text-on-surface hover:bg-surface-container-low transition-colors">
                      <span className="material-symbols-outlined text-[20px]">
                        more_horiz
                      </span>
                    </button>
                  </div>

                  {/* Search */}
                  <div className="px-5 pb-3">
                    <div className="flex items-center bg-surface-container-low rounded-xl border border-surface-container px-3 py-2 focus-within:border-outline-variant focus-within:ring-1 focus-within:ring-primary/20 transition-all">
                      <span className="material-symbols-outlined text-outline text-[18px] mr-2">
                        search
                      </span>
                      <input
                        className="bg-transparent border-none outline-none text-body-sm font-body-sm text-on-surface placeholder:text-outline w-full"
                        placeholder="Filter roster..."
                        type="text"
                      />
                    </div>
                  </div>

                  {/* Member List */}
                  <div className="px-2 flex-1 overflow-y-auto">
                    {/* You - highlighted */}
                    <div className="flex items-center justify-between px-3 py-3 rounded-xl bg-primary-fixed/20 border border-primary-fixed-dim/30 mb-1.5 hover:bg-primary-fixed/30 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative shrink-0">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-container to-primary flex items-center justify-center font-bold text-[12px] text-on-primary shadow-sm ring-2 ring-primary-fixed/40">
                            AM
                          </div>
                          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-primary-container border-2 border-surface-container-lowest flex items-center justify-center">
                            <span className="material-symbols-outlined text-[8px] text-on-primary">
                              check
                            </span>
                          </span>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-semibold text-on-surface truncate">
                              Alex Morgan
                            </span>
                            <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-primary-container text-on-primary-container">
                              You
                            </span>
                          </div>
                          <div className="text-[11px] text-on-surface-variant truncate mt-0.5">
                            alex.m@tahoecamp.org
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary-fixed/40 px-2 py-1 rounded-md">
                          Organizer
                        </span>
                      </div>
                    </div>

                    {/* Other Members */}
                    {[
                      {
                        initials: "JC",
                        name: "Jamie Chen",
                        email: "jamie.c@gmail.com",
                        role: "Member",
                        gradient:
                          "from-macaron-lilac to-lilac-200",
                        text: "text-lilac-700",
                      },
                      {
                        initials: "MR",
                        name: "Marcus Reed",
                        email: "m.reed@outlook.com",
                        role: "Member",
                        gradient:
                          "from-macaron-sky to-sky-200",
                        text: "text-sky-700",
                      },
                      {
                        initials: "SR",
                        name: "Sofia Ramirez",
                        email: "sofia.r@tahoecamp.org",
                        role: "Admin",
                        gradient:
                          "from-macaron-blush to-peach-200",
                        text: "text-peach-700",
                      },
                      {
                        initials: "EW",
                        name: "Ethan Wright",
                        email: "ethan.w@icloud.com",
                        role: "Member",
                        gradient:
                          "from-macaron-butter to-buttercup-200",
                        text: "text-buttercup-700",
                      },
                      ...(showAllRoster
                        ? [
                            {
                              initials: "NP",
                              name: "Nina Patel",
                              email: "nina.p@gmail.com",
                              role: "Member",
                              gradient:
                                "from-matcha-100 to-matcha-200",
                              text: "text-matcha-700",
                            },
                            {
                              initials: "LN",
                              name: "Liam Novak",
                              email: "liam.n@tahoecamp.org",
                              role: "Member",
                              gradient:
                                "from-surface-container-highest to-surface-container-high",
                              text: "text-on-surface-variant",
                            },
                          ]
                        : []),
                    ].map((m) => (
                      <div
                        className="group flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-surface-container-low transition-all mb-0.5 cursor-default"
                        key={m.initials}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-9 h-9 rounded-full bg-gradient-to-br ${m.gradient} flex items-center justify-center font-bold text-[11px] ${m.text} shrink-0 shadow-sm`}
                          >
                            {m.initials}
                          </div>
                          <div className="min-w-0">
                            <span className="text-sm font-semibold text-on-surface truncate block">
                              {m.name}
                            </span>
                            <div className="text-[11px] text-on-surface-variant truncate">
                              {m.email}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
                              m.role === "Admin"
                                ? "text-secondary bg-secondary-fixed/40"
                                : "text-on-surface-variant bg-surface-container-high"
                            }`}
                          >
                            {m.role}
                          </span>
                          <button className="w-6 h-6 rounded-md flex items-center justify-center text-outline opacity-0 group-hover:opacity-100 hover:text-on-surface hover:bg-surface-container transition-all">
                            <span className="material-symbols-outlined text-[16px]">
                              more_vert
                            </span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Show All Toggle */}
                  <div className="p-3 border-t border-surface-container">
                    <button
                      aria-expanded={showAllRoster}
                      className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-on-surface-variant hover:text-on-surface transition-colors rounded-lg hover:bg-surface-container-low"
                      type="button"
                      onClick={() => setShowAllRoster((v) => !v)}
                    >
                      <span>
                        {showAllRoster
                          ? "Show less"
                          : "Show all 7 members"}
                      </span>
                      <span
                        className={`material-symbols-outlined text-[16px] transition-transform ${showAllRoster ? "rotate-180" : ""}`}
                      >
                        expand_more
                      </span>
                    </button>
                  </div>
                </div>

                {/* Pro Tip Card */}
                <div className="bg-surface-container-lowest border border-surface-container-high rounded-2xl p-4 shadow-[0_2px_10px_rgba(19,27,46,0.02)]">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary-fixed/40 text-primary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[18px]">
                        lightbulb
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-on-surface">
                        Pro Tip
                      </h4>
                      <p className="text-[11px] text-on-surface-variant mt-1 leading-relaxed">
                        Members without a Tabsy account can claim their spot and view balances via the shortlink.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Footer hint */}
            <div className="flex items-center gap-1.5 justify-center pt-2">
              <span className="material-symbols-outlined text-outline text-[14px]">
                lock
              </span>
              <span className="text-body-sm text-body-sm text-outline">
                End-to-end ledger · Only invited members can edit expenses
              </span>
            </div>
          </div>
        </main>
      </div>
    </AppLayout>
  );
}