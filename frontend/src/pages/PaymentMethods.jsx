import { useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import Breadcrumbs from "../components/layout/Breadcrumbs";
import { BALANCES_TABS } from "../constants/balancesNav";

const RUPEE = "₹";
const inr = (n) => RUPEE + Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const inr0 = (n) => RUPEE + Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });

const KPIS = [
  {
    label: "Default Outgoing",
    title: "UPI / GPay",
    icon: "contactless",
    iconCls: "bg-surface-container-low text-on-surface",
    chip: "Instant • 0% Fee",
    value: inr(28220),
    chipCls: "bg-primary-fixed text-on-primary-fixed",
    valueCls: "text-primary",
  },
  {
    label: "Default Receiving",
    title: "HDFC Savings ••••4019",
    icon: "account_balance",
    iconCls: "bg-secondary-fixed text-on-secondary-fixed",
    note: "NPCI Direct AA Routing",
    noteIcon: "sync_saved_locally",
  },
  {
    label: "Linked Settlement Mesh",
    title: "4 Accounts",
    icon: "hub",
    iconCls: "bg-surface-container-high text-primary",
    avatars: [
      { label: "UP", name: "UPI / GPay", cls: "bg-surface-container-highest text-on-surface" },
      { label: "HD", name: "HDFC Savings", cls: "bg-secondary-fixed text-on-secondary-fixed" },
      { label: "PP", name: "PhonePe", cls: "bg-surface-container-low text-secondary" },
      { label: "VS", name: "Visa Debit", cls: "bg-tertiary-fixed text-tertiary" },
    ],
    note: "All synced healthy",
  },
  {
    label: "Security & Vault",
    title: "Bank-Grade AES",
    icon: "lock",
    dark: true,
    note: "AES-256 Tokenized",
    badge: "DICGC ₹5 L",
  },
];

const FILTERS = [
  { id: "all", label: "All Rails (4)" },
  { id: "instant", label: "Instant Direct (2)" },
  { id: "bank", label: "Traditional Bank (1)" },
  { id: "backup", label: "Backup Cards (1)" },
];

const BASE_RULES = [
  { icon: "apartment", title: "Roommate & Rent Splits", meta: "Route automatically to HDFC Savings ••••4019", tag: "FIXED" },
  { icon: "local_cafe", title: `Casual Food & Coffee <${inr0(2490)}`, meta: "Retain in UPI balance for micro-settling", tag: "INSTANT" },
];

const LINK_OPTIONS = [
  { icon: "account_balance", title: "Instant Bank (Account Aggregator)", meta: "Connect HDFC, ICICI, SBI & 10,000+ banks" },
  { icon: "contactless", title: "UPI Intent / GPay", meta: "Fast biometric 1-tap splits" },
  { icon: "credit_card", title: "Debit or Credit Card", meta: "Visa, Mastercard, Amex with 3D Secure" },
];

function Toggle({ on, onChange, label }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer shrink-0">
      <input
        type="checkbox"
        checked={on}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only peer"
        aria-label={label}
      />
      <span className="w-11 h-6 bg-outline-variant rounded-full peer peer-checked:bg-primary-container relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
    </label>
  );
}

function RailCard({ children }) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
      {children}
    </div>
  );
}

function RailHeader({ icon, iconCls, title, badge, badgeCls, subtitle }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${iconCls}`}>
          <span className="material-symbols-outlined text-[26px]">{icon}</span>
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-bold text-on-surface break-words">{title}</h3>
            {badge && (
              <span className={`font-label-caps text-[11px] px-2 py-0.5 rounded-full font-bold ${badgeCls}`}>{badge}</span>
            )}
          </div>
          <div className="text-xs text-on-surface-variant mt-0.5 break-words">{subtitle}</div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentMethods() {
  const [filter, setFilter] = useState("all");
  const [autoSettle, setAutoSettle] = useState(true);
  const [threshold, setThreshold] = useState(4150);
  const [biometric, setBiometric] = useState(true);
  const [privacy, setPrivacy] = useState(true);
  const [deepLink, setDeepLink] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [visaDefault, setVisaDefault] = useState(false);
  const [extraRule, setExtraRule] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);

  const rules = extraRule
    ? [...BASE_RULES, { icon: "flight", title: "Travel & Trips", meta: "Route to HDFC Savings ••••4019", tag: "SMART" }]
    : BASE_RULES;

  function refreshBalance() {
    if (refreshing) return;
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }

  function makeVisaDefault() {
    setVisaDefault(true);
    setTimeout(() => setVisaDefault(false), 2400);
  }

  return (
    <AppLayout>
      <main className="w-full min-h-screen overflow-x-clip">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumbs
            items={[
              { label: "Balances", to: "/balances", icon: "account_balance_wallet" },
              { label: "Payment Methods" },
            ]}
            status={{ label: "Vault Encryption Active", note: "AES-256 tokenized rails" }}
          />

          {/* Page header card */}
          <div className="relative overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm shadow-zinc-900/5 border border-outline-variant/60 w-full px-4 py-3.5 sm:px-5 mb-5">
            <div className="relative z-10 flex flex-col gap-1.5 min-w-0">
              <div className="flex items-center flex-wrap gap-1.5">
                <span className="px-2 py-0.5 rounded-full bg-primary-fixed/40 text-on-primary-fixed-variant font-label-caps text-label-caps uppercase flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">credit_card</span>
                  Payment Methods
                </span>
                <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-caps text-label-caps font-bold uppercase">4 Rails Active</span>
                <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface font-label-caps text-label-caps font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">verified_user</span>
                  256-bit encrypted
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-on-surface tracking-tight leading-none">Connected Rails, Auto-Settle &amp; Routing Rules</h1>
              <p className="font-body-sm text-body-sm text-on-surface-variant max-w-2xl leading-snug">
                Manage the UPI, bank, and card rails Tabsy uses to settle — plus the rules that keep small tabs from piling up.
              </p>
            </div>

            {/* Sub-nav row (inside card) */}
            <div className="relative z-10 mt-3 pt-3 border-t border-surface-container flex items-center gap-1.5 overflow-x-auto">
              {BALANCES_TABS.map((t) => {
                const active = t.id === "methods";
                const cls = `px-3.5 py-2 rounded-xl font-title-md text-xs flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  active ? "bg-matcha-100 text-matcha-800 font-bold shadow-sm" : "text-on-surface-variant hover:bg-surface-container font-semibold"
                }`;
                const inner = (
                  <>
                    <span className="material-symbols-outlined text-base" style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}>{t.icon}</span>
                    <span>{t.label}</span>
                    {t.badge && <span className="bg-peach-100 text-tertiary text-[10px] font-bold px-1.5 py-0.5 rounded-full">{t.badge}</span>}
                  </>
                );
                return t.to ? (
                  <Link key={t.id} to={t.to} className={cls}>{inner}</Link>
                ) : (
                  <span key={t.id} className={cls}>{inner}</span>
                );
              })}
            </div>
          </div>

          {/* KPI strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-4">
            {KPIS.map((k) => (
              <div
                key={k.label}
                className={`rounded-2xl p-4 shadow-sm relative overflow-hidden flex flex-col justify-between ${
                  k.dark ? "bg-primary text-on-primary" : "bg-surface-container-lowest border border-surface-container"
                }`}
              >
                <div className="flex items-start justify-between gap-2 relative z-10">
                  <div className="flex flex-col min-w-0">
                    <span className={`font-label-caps text-[11px] uppercase tracking-wider ${k.dark ? "text-primary-fixed" : "text-on-surface-variant"}`}>{k.label}</span>
                    <span className={`text-base font-bold mt-1 break-words ${k.dark ? "text-on-primary" : "text-on-surface"}`}>{k.title}</span>
                  </div>
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${k.dark ? "bg-on-primary/10 text-on-primary" : k.iconCls}`}>
                    <span className="material-symbols-outlined text-[22px]">{k.icon}</span>
                  </div>
                </div>

                <div className="mt-3 relative z-10 flex flex-col gap-1.5">
                  {k.chip && (
                    <div className="flex items-center justify-between gap-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-label-caps text-[11px] font-bold ${k.chipCls}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        {k.chip}
                      </span>
                      <span className={`text-base font-bold font-mono ${k.valueCls}`}>{k.value}</span>
                    </div>
                  )}
                  {k.note && !k.dark && (
                    <div className="flex flex-col gap-1.5 text-xs">
                      {k.noteIcon && (
                        <div className="flex items-center gap-1.5 text-on-surface-variant">
                          <span className="material-symbols-outlined text-primary text-[16px] shrink-0">{k.noteIcon}</span>
                          <span className="truncate">{k.note}</span>
                        </div>
                      )}
                      {k.avatars && (
                        <>
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center">
                              {k.avatars.map((a, i) => (
                                <span
                                  key={a.label}
                                  title={a.name}
                                  className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold font-label-caps ring-2 ring-white ${a.cls} ${i > 0 ? "-ml-2" : ""}`}
                                >
                                  {a.label}
                                </span>
                              ))}
                            </div>
                            <span className="font-label-caps text-[11px] font-bold text-on-surface-variant shrink-0">4 / 4</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-on-surface-variant">
                            <span className="w-1.5 h-1.5 rounded-full bg-matcha-600 shrink-0" />
                            <span className="truncate">{k.note}</span>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                  {k.dark && (
                    <div className="flex items-center justify-between gap-2 text-primary-fixed text-xs">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">verified_user</span>
                        <span>{k.note}</span>
                      </span>
                      <span className="font-label-caps text-[10px] bg-on-primary/20 text-on-primary px-1.5 py-0.5 rounded">{k.badge}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            {/* LEFT RAIL — connected rails */}
            <div className="lg:col-span-7 min-w-0 flex flex-col gap-3.5">
              <div className="flex items-center justify-between gap-2 px-1 flex-wrap">
                <div className="min-w-0">
                  <h2 className="text-base font-bold text-on-surface">Connected Payment Methods</h2>
                  <p className="text-xs text-on-surface-variant">Manage default sending channels, micro-settle routes, and backup cards.</p>
                </div>
                <span className="px-2.5 py-1 bg-surface-container rounded-full font-label-caps text-[11px] text-on-surface-variant font-bold shrink-0">4 RAILS ACTIVE</span>
              </div>

              {/* Filter pills */}
              <div className="flex items-center gap-2 overflow-x-auto py-1">
                {FILTERS.map((f) => {
                  const active = filter === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFilter(f.id)}
                      className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all ${
                        active ? "bg-primary text-on-primary font-bold shadow-sm" : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container font-medium"
                      }`}
                    >
                      {f.label}
                    </button>
                  );
                })}
              </div>

              {/* Default UPI rail */}
              {filter !== "bank" && filter !== "backup" && (
                <RailCard>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
                    <div className="min-w-0 flex-1">
                      <RailHeader
                        icon="payments"
                        iconCls="bg-surface text-on-surface"
                        title="UPI / GPay"
                        badge="DEFAULT 1-TAP"
                        badgeCls="bg-primary text-on-primary"
                        subtitle="Fast splits via your UPI balance and linked bank"
                      />
                    </div>
                    <div className="text-left sm:text-right shrink-0">
                      <div className="text-xl font-extrabold text-primary font-mono leading-tight">{inr(28220)}</div>
                      <div className="font-label-caps text-[11px] text-on-surface-variant">AVAILABLE BALANCE</div>
                    </div>
                  </div>
                  <div className="bg-surface-container-low/60 rounded-xl p-2.5 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-on-primary-container">
                        <span className="material-symbols-outlined text-primary text-[16px]">check_circle</span>
                        Instant 0% Network Fee
                      </span>
                      <span className="w-1 h-1 rounded-full bg-outline-variant" />
                      <span className="text-xs text-on-surface-variant">Settles in &lt;1.2 seconds</span>
                    </div>
                    <div className="flex items-center gap-1 ml-auto">
                      <button
                        type="button"
                        onClick={refreshBalance}
                        className="px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs text-on-surface font-semibold transition-colors flex items-center gap-1"
                      >
                        <span className={`material-symbols-outlined text-[16px] ${refreshing ? "animate-spin" : ""}`}>refresh</span>
                        <span>Refresh</span>
                      </button>
                      <button type="button" className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors" title="Settings">
                        <span className="material-symbols-outlined text-[18px]">more_vert</span>
                      </button>
                    </div>
                  </div>
                </RailCard>
              )}

              {/* Bank rail */}
              {filter !== "instant" && filter !== "backup" && (
                <RailCard>
                  <RailHeader
                    icon="account_balance"
                    iconCls="bg-secondary-fixed text-on-secondary-fixed"
                    title="HDFC Savings"
                    badge="PRIMARY RECEIVING"
                    badgeCls="bg-secondary text-on-secondary"
                    subtitle={`Account ••••4019  |  IFSC HDFC0000421`}
                  />
                  <div className="flex items-center gap-2 flex-wrap pb-3">
                    <span className="inline-flex items-center gap-1 bg-surface-container-high px-2.5 py-1 rounded-full font-label-caps text-[11px] text-primary font-bold">
                      <span className="material-symbols-outlined text-[16px]">verified</span> NPCI Verified
                    </span>
                    <span className="inline-flex items-center gap-1 bg-surface-container px-2.5 py-1 rounded-full font-label-caps text-[11px] text-on-surface-variant font-bold">
                      <span className="material-symbols-outlined text-[16px]">account_balance</span> Account Aggregator linked
                    </span>
                  </div>
                  <div className="bg-surface-container-low rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="material-symbols-outlined text-secondary text-[18px]">home</span>
                      <span className="text-xs text-on-surface font-medium break-words">Assigned to: Monthly Rent &amp; Group Outings &gt;{inr0(8300)}</span>
                    </div>
                    <button type="button" className="text-xs text-primary font-bold hover:underline shrink-0">Change Routing</button>
                  </div>
                </RailCard>
              )}

              {/* P2P deep-link rail */}
              {filter !== "bank" && filter !== "backup" && (
                <RailCard>
                  <div className="flex items-start justify-between gap-3">
                    <RailHeader
                      icon="qr_code_2"
                      iconCls="bg-surface-container-high text-secondary"
                      title="PhonePe Peer Sync"
                      badge="LINKED"
                      badgeCls="bg-surface-container text-on-surface-variant"
                      subtitle="@arjun-sharma-92"
                    />
                    <button
                      type="button"
                      onClick={() => setQrOpen(true)}
                      className="px-3 py-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-xs text-on-surface font-semibold flex items-center gap-1 transition-colors shrink-0"
                    >
                      <span className="material-symbols-outlined text-[16px]">qr_code</span>
                      <span>QR Pass</span>
                    </button>
                  </div>
                  <div className="mt-3 pt-3 flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 min-w-0">
                      <Toggle on={deepLink} onChange={setDeepLink} label="Deep-link enabled for non-Tabsy peer requests" />
                      <span className="material-symbols-outlined text-primary-container text-[18px]">bolt</span>
                      <span className="text-xs text-on-surface-variant break-words">Deep-link enabled for non-Tabsy peer requests</span>
                    </div>
                    <button type="button" className="text-xs text-on-surface-variant hover:text-error transition-colors shrink-0">Unlink</button>
                  </div>
                </RailCard>
              )}

              {/* Backup card rail */}
              {filter !== "instant" && filter !== "bank" && (
                <RailCard>
                  <RailHeader
                    icon="credit_card"
                    iconCls="bg-tertiary-fixed text-on-tertiary-fixed"
                    title="Visa Debit ••••8812"
                    badge="BACKUP"
                    badgeCls="bg-surface-container text-on-surface-variant"
                    subtitle="Exp 09/27 • Verified by Visa 3D Secure"
                  />
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-xs text-on-surface-variant">Card-to-card settlements when UPI is depleted.</span>
                    <button
                      type="button"
                      onClick={makeVisaDefault}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                        visaDefault ? "bg-primary-fixed text-on-primary-fixed" : "bg-surface-container hover:bg-surface-container-high text-on-surface"
                      }`}
                    >
                      {visaDefault ? "Default Selected" : "Make Default"}
                    </button>
                  </div>
                </RailCard>
              )}

              {/* Add rail CTA */}
              <div className="w-full border-2 border-dashed border-outline-variant/70 hover:border-primary/50 hover:bg-primary-fixed/10 transition-colors duration-200 rounded-2xl px-4 py-3 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-surface-container-lowest text-primary flex items-center justify-center shadow-sm shrink-0">
                  <span className="material-symbols-outlined text-[22px]">add</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-on-surface truncate">Link New Bank Account or Card</h4>
                  <p className="text-xs text-on-surface-variant truncate">Account Aggregator, UPI, or RuPay / Visa Debit</p>
                </div>
                <button
                  type="button"
                  onClick={() => setLinkOpen(true)}
                  className="flex items-center gap-1.5 bg-primary text-on-primary hover:bg-primary-container px-3.5 py-2 rounded-xl font-bold text-xs shadow-sm transition-all shrink-0 whitespace-nowrap"
                >
                  <span>Connect Rail</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>

              {/* Security banner */}
              <div className="bg-surface-container-low/70 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center text-primary shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">shield</span>
                </div>
                <div className="min-w-0">
                  <span className="text-sm text-on-surface font-bold block">End-to-End Vaulted Credentials</span>
                  <span className="text-xs text-on-surface-variant break-words">
                    Tabsy never stores your raw card numbers or bank credentials. All rails execute via AES-256 tokens directly with regulated banks and NPCI.
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT RAIL — automation + privacy */}
            <aside className="lg:col-span-5 min-w-0 flex flex-col gap-3.5">
              {/* Auto-Settle Engine */}
              <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm flex flex-col gap-3.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-3 h-3 rounded-full bg-primary-container shrink-0" />
                    <h2 className="text-base font-bold text-on-surface break-words">Auto-Settle Engine</h2>
                  </div>
                  <span className={`font-label-caps text-[11px] px-2.5 py-0.5 rounded-full font-bold shrink-0 ${autoSettle ? "bg-primary-fixed text-on-primary-fixed" : "bg-surface-container text-on-surface-variant"}`}>
                    {autoSettle ? "ACTIVE" : "PAUSED"}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Automate micro-settlements without manual approval so tabs never pile up or spark awkward reminders.
                </p>

                <div className="bg-surface-container-low rounded-2xl p-4 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <span className="text-sm font-bold text-on-surface block">Auto-settle small tabs</span>
                    <span className="text-xs text-on-surface-variant mt-0.5 block break-words">Chai, snacks, shared autos under threshold settle automatically.</span>
                  </div>
                  <Toggle on={autoSettle} onChange={setAutoSettle} label="Auto-settle small tabs" />
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-on-surface">Maximum Auto-Settle Limit</span>
                    <span className="text-sm font-bold text-primary font-mono bg-primary-fixed px-2.5 py-1 rounded-lg">{inr0(threshold)}</span>
                  </div>
                  <input
                    type="range"
                    min="830"
                    max="12450"
                    step="415"
                    value={threshold}
                    onChange={(e) => setThreshold(Number(e.target.value))}
                    className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary-container"
                    aria-label="Maximum auto-settle limit"
                  />
                  <div className="flex justify-between font-label-caps text-[11px] text-on-surface-variant">
                    <span>{inr0(830)} (Min)</span>
                    <span>{inr0(4150)} (Recommended)</span>
                    <span>{inr0(12450)} (Max)</span>
                  </div>
                </div>

                <div className="bg-surface-container-low rounded-2xl p-4 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-primary text-[18px]">fingerprint</span>
                      <span className="text-sm font-bold text-on-surface">Biometric Step-Up</span>
                    </div>
                    <span className="text-xs text-on-surface-variant mt-0.5 block break-words">Require FaceID or fingerprint for single payments exceeding {inr0(8300)}.</span>
                  </div>
                  <Toggle on={biometric} onChange={setBiometric} label="Biometric step-up" />
                </div>
              </div>

              {/* Smart Payout Rules */}
              <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm flex flex-col gap-2.5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base font-bold text-on-surface">Smart Payout Rules</h3>
                  <span className="material-symbols-outlined text-outline text-[20px]">tune</span>
                </div>
                <div className="flex flex-col gap-2">
                  {rules.map((r) => (
                    <div key={r.title} className="p-3 bg-surface-container-low rounded-xl flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary shrink-0">
                          <span className="material-symbols-outlined text-[18px]">{r.icon}</span>
                        </span>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-on-surface break-words">{r.title}</div>
                          <div className="text-xs text-on-surface-variant break-words">{r.meta}</div>
                        </div>
                      </div>
                      <span className="font-label-caps text-[11px] bg-surface-container px-2 py-1 rounded text-on-surface-variant font-bold shrink-0">{r.tag}</span>
                    </div>
                  ))}
                </div>
                {!extraRule && (
                  <button
                    type="button"
                    onClick={() => setExtraRule(true)}
                    className="w-full py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs text-on-surface font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[18px]">add_circle</span>
                    <span>+ Add Custom Payout Rule</span>
                  </button>
                )}
              </div>

              {/* Privacy */}
              <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm flex flex-col gap-2.5">
                <h3 className="text-base font-bold text-on-surface">Privacy &amp; Social Discretion</h3>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <span className="text-sm font-bold text-on-surface block">Hide account specifics from peers</span>
                    <span className="text-xs text-on-surface-variant mt-0.5 block break-words">Friends see only your verified green badge — never bank names, IFSCs, or account tails.</span>
                  </div>
                  <Toggle on={privacy} onChange={setPrivacy} label="Hide account specifics from peers" />
                </div>
                <div className="pt-3 flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-1 rounded-full bg-primary-fixed font-label-caps text-[11px] text-on-primary-fixed font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">verified</span>
                    VERIFIED SETTLER
                  </span>
                  <span className="text-xs text-on-surface-variant">Displayed on your public profile</span>
                </div>
              </div>

              {/* DICGC badge */}
              <div className="p-4 rounded-2xl bg-surface-container-low flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-surface-container-lowest flex items-center justify-center text-primary shrink-0 shadow-sm font-label-caps font-black text-[13px]">
                  DICGC
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-on-surface block">Insured Partner Banks (DICGC)</span>
                  <span className="text-xs text-on-surface-variant break-words">Balances held at partner banks are insured up to ₹5,00,000 per depositor per bank.</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Link rail modal */}
      {linkOpen && (
        <div className="fixed inset-0 z-50 bg-on-surface/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setLinkOpen(false)}>
          <div className="bg-surface-container-lowest rounded-3xl max-w-md w-full p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-4 border-b border-surface-container">
              <h3 className="text-base font-bold text-on-surface">Connect Payment Rail</h3>
              <button type="button" className="p-1 rounded-full hover:bg-surface-container text-on-surface-variant" onClick={() => setLinkOpen(false)} aria-label="Close">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <p className="text-xs text-on-surface-variant mt-3">Link securely with AES-256 encryption. Tabsy never sees your login credentials.</p>
            <div className="flex flex-col gap-2.5 mt-4">
              {LINK_OPTIONS.map((o) => (
                <button key={o.title} type="button" className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all text-left">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center text-primary font-bold shrink-0">
                      <span className="material-symbols-outlined text-[20px]">{o.icon}</span>
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-on-surface break-words">{o.title}</div>
                      <div className="text-xs text-on-surface-variant break-words">{o.meta}</div>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-outline shrink-0">chevron_right</span>
                </button>
              ))}
            </div>
            <button type="button" onClick={() => setLinkOpen(false)} className="w-full mt-5 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* QR pass modal */}
      {qrOpen && (
        <div className="fixed inset-0 z-50 bg-on-surface/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setQrOpen(false)}>
          <div className="bg-surface-container-lowest rounded-3xl max-w-sm w-full p-6 shadow-2xl text-center" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-end">
              <button type="button" className="p-1 rounded-full hover:bg-surface-container text-on-surface-variant" onClick={() => setQrOpen(false)} aria-label="Close">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-secondary-fixed text-on-secondary-fixed mx-auto flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-[34px]">qr_code_2</span>
            </div>
            <h3 className="text-base font-bold text-on-surface">Arjun Sharma&apos;s UPI QR</h3>
            <p className="text-xs text-on-surface-variant mt-1">arjun@okhdfcbank • Ready to scan for settlement</p>
            <div className="mt-4 p-4 bg-surface-container-low rounded-2xl inline-flex items-center justify-center mx-auto">
              <div className="w-44 h-44 bg-surface-container-lowest rounded-xl flex items-center justify-center border-2 border-dashed border-outline-variant">
                <span className="material-symbols-outlined text-[96px] text-on-surface">qr_code</span>
              </div>
            </div>
            <div className="mt-4">
              <button type="button" onClick={() => setQrOpen(false)} className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs hover:bg-primary-container transition-colors">
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
