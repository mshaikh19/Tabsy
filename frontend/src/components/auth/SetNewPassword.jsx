import { useState } from "react";

const CRITERIA = [
  { key: "length", label: "8+ Characters" },
  { key: "case", label: "Uppercase (A-Z)" },
  { key: "number", label: "Numeric digit" },
  { key: "symbol", label: "Special character" },
];

export default function SetNewPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const checks = {
    length: newPassword.length >= 8,
    case: /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword),
    number: /\d/.test(newPassword),
    symbol: /[!@#$%^&*()_.-]/.test(newPassword),
  };
  const valid = Object.values(checks).every(Boolean);
  const match = confirmPassword.length > 0 && newPassword === confirmPassword;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!valid || !match) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
    }, 1000);
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-[#131b2e] font-['Plus_Jakarta_Sans'] antialiased px-6">
        <div className="w-full max-w-md text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold mb-4">
            <span className="material-symbols-outlined text-[18px]">
              verified
            </span>
            <span>Vault Key Secured &amp; Propagated!</span>
          </div>
          <p className="text-[12px] text-gray-500 leading-relaxed">
            Zero ledger disruption detected. Redirecting to active balances in 2
            seconds...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center overflow-hidden">
      <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
          <a className="flex items-center gap-2.5 shrink-0 group" href="#">
            <img
              alt="Tabsy"
              className="w-10 h-10 rounded-2xl shadow-xs group-hover:scale-105 transition-transform duration-200"
              src="./assets/logo.svg"
            />
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-[#131b2e] flex items-center gap-1.5 leading-none">
                Tabsy
                <span className="text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                  Flat v2.5
                </span>
              </span>
              <span className="text-[10px] text-gray-500 font-medium mt-0.5">
                Collaborative expense settlement
              </span>
            </div>
          </a>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-full bg-white">
              <div className="w-2 h-2 bg-emerald-500 rounded-full" />
              <span className="text-xs font-bold text-slate-900 tracking-wide">
                VAULT SECURE
              </span>
            </div>
            <a
              href="#"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px] text-gray-500">
                headset_mic
              </span>
              <span className="text-sm text-gray-500 font-medium">
                Concierge &amp; Security
              </span>
            </a>
          </div>
        </div>
      </header>

      <main className="pt-20 pb-4 px-4 text-center bg-white overflow-hidden">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-full bg-white mb-4 shadow-sm">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-emerald-800 rounded-full" />
              <span className="text-xs font-bold text-emerald-800 tracking-wide">
                SECURITY PROTOCOL
              </span>
            </div>
            <span className="text-slate-300">·</span>
            <span className="text-xs font-medium text-slate-400 tracking-wide">
              LEVEL 3 ZERO-KNOWLEDGE
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Set your master vault key.
          </h1>
        </div>
      </main>

      <section className="px-4 pb-24 bg-white overflow-hidden">
        <div className="max-w-[1024px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 rounded-2xl border border-slate-200 shadow-sm overflow-hidden bg-white min-h-[600px]">
            <div className="lg:col-span-7 p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col gap-6">
              <div className="flex justify-between items-center mb-2">
                <div className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-md flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-emerald-800 rounded-full" />
                  <span className="text-[10px] font-bold text-slate-500 tracking-wide">
                    CREDENTIAL ROTATION
                  </span>
                </div>
                <span className="text-xs font-medium text-slate-400 tracking-wide">
                  AES-256 GCM
                </span>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Create vault credentials
                </h2>
                <p className="text-sm text-slate-500">
                  Choose a resilient passkey to guard shared tabs and personal
                  cards.
                </p>
              </div>

              <form className="space-y-4 flex-1" onSubmit={handleSubmit}>
                <div>
                  <label className="text-xs font-bold text-slate-900 tracking-wide mb-2 block">
                    NEW MASTER PASSWORD
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[12px] text-slate-400">
                      lock
                    </span>
                    <input
                      type={showNew ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter 8+ resilient characters..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-12 py-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-shadow"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew((v) => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px] leading-none">
                        {showNew ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-slate-500 tracking-wide">
                      KEY ENTROPY:
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">
                      {valid ? "Strong" : "Enter characters"}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 mb-3">
                    {CRITERIA.map((c) => (
                      <div
                        key={c.key}
                        className={`h-1 rounded-full w-full transition-colors ${
                          checks[c.key] ? "bg-emerald-500" : "bg-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {CRITERIA.map((c) => (
                      <div
                        key={c.key}
                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg"
                      >
                        <span
                          className={`material-symbols-outlined text-[12px] ${
                            checks[c.key]
                              ? "text-emerald-500"
                              : "text-slate-400"
                          }`}
                        >
                          {checks[c.key] ? "check" : "close"}
                        </span>
                        <span className="text-xs text-slate-600">{c.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-900 tracking-wide mb-2 block">
                    CONFIRM PASSWORD
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[12px] text-slate-400">
                      lock
                    </span>
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter master password..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-12 py-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-shadow"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px] leading-none">
                        {showConfirm ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                  {confirmPassword.length > 0 && (
                    <p
                      className={`mt-2 text-xs font-semibold ${
                        match ? "text-emerald-600" : "text-rose-500"
                      }`}
                    >
                      {match ? "Passwords match" : "Passwords do not match"}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!valid || !match || submitting}
                  className="w-full h-12 px-6 rounded-xl bg-slate-900 text-white font-bold text-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-default"
                >
                  {submitting ? "Updating..." : "Update Vault Key & Re-anchor"}
                  {!submitting && (
                    <span className="material-symbols-outlined text-[18px] text-white leading-none">
                      arrow_forward
                    </span>
                  )}
                </button>
              </form>
            </div>

            <div className="lg:col-span-5 bg-slate-50 p-8 lg:p-10 flex flex-col gap-6 w-full">
              <div className="flex justify-between items-center mb-2">
                <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-full flex items-center gap-2 shadow-sm">
                  <div className="w-1.5 h-1.5 bg-emerald-800 rounded-full" />
                  <span className="text-[10px] font-bold text-slate-900 tracking-wide">
                    LEDGER INTEGRITY: 100% SECURE
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 tracking-wide">
                  HASH SYNCED
                </span>
              </div>

              <div className="flex flex-col items-center mb-2">
                <div className="w-12 h-12 bg-emerald-100/50 border border-emerald-200 rounded-2xl flex items-center justify-center mb-3 shadow-sm">
                  <span className="material-symbols-outlined text-[24px] text-emerald-500">
                    shield_person
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 text-center mb-2">
                  Your shared splits remain undisturbed
                </h3>
                <p className="text-xs text-slate-500 text-center leading-relaxed max-w-xs">
                  Changing your master vault key never freezes recurring splits,
                  roommates' pending IOUs, or linked open-banking
                  synchronization.
                </p>
              </div>

              <div className="space-y-2.5 mb-4">
                {[
                  "Zero transaction delays across active pools",
                  "End-to-end cryptographic session isolation",
                  "Hardware passkey & FIDO2 compliant",
                ].map((text) => (
                  <div
                    key={text}
                    className="flex items-center gap-3 px-3.5 py-3 bg-white border border-slate-200 rounded-xl shadow-sm"
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[12px] text-emerald-500">
                        check
                      </span>
                    </div>
                    <span className="text-xs font-medium text-slate-900">
                      {text}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-auto flex justify-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full shadow-sm">
                  <span className="material-symbols-outlined text-[14px] text-emerald-500">
                    verified
                  </span>
                  <span className="text-[11px] font-medium text-slate-500">
                    Audited across 32,000+ shared pools &amp; ledgers
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}