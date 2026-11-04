import { useEffect, useRef, useState } from "react";

const CHANNELS = {
  email: {
    tab: "Email Code",
    label: "Linked Email Destination",
    placeholder: "alex@tabsy.app",
    type: "email",
    value: "alex@tabsy.app",
    icon: "alternate_email",
    badgeText: "tabsy.app verified",
    showPasskey: false,
    showTip: true,
  },
  passkey: {
    tab: "Passkey / Touch ID",
    label: "Biometric Passkey Identifier",
    placeholder: "Passkey: MacBook Pro Touch ID (Active)",
    type: "text",
    value: "Alex (Touch ID / iCloud Keychain)",
    icon: "fingerprint",
    badgeText: "FIDO2 / WebAuthn ready",
    showPasskey: true,
    showTip: false,
  },
  sms: {
    tab: "SMS Backup",
    label: "Verified Mobile Number",
    placeholder: "+1 (555) 382-9401",
    type: "tel",
    value: "+1 (555) 382-9401",
    icon: "smartphone",
    badgeText: "US (+1) Carrier linked",
    showPasskey: false,
    showTip: true,
  },
};

const BUTTON_TEXT = {
  idle: "Verify & Unlock Account",
  sending: "Authenticating Channel...",
  sent: "Instant Key Dispatched!",
};

const FEATURES = [
  ["fingerprint", "WebAuthn Biometric Key Pairing"],
  ["history_toggle_off", "Immutable Real-Time Audit Trail"],
  ["verified_user", "24/7 Fraud Guard & Settlement Protection"],
];

const AVATARS = [
  ["AM", "bg-[#dcfce7] text-[#15803d]", "text-[10px]"],
  ["SK", "bg-[#fce7f3] text-[#be185d]", "text-[10px]"],
  ["LN", "bg-[#f3e8ff] text-[#7e22ce]", "text-[10px]"],
  ["+14k", "bg-[#e0f2fe] text-[#0369a1]", "text-[9px]"],
];

const OTP_INPUT =
  "w-full h-11 text-center font-bold text-base rounded-xl bg-white border border-[#e2dcd2] focus:border-[#006c49] focus:ring-2 focus:ring-emerald-50 text-[#131b2e] shadow-xs focus:outline-none transition-all placeholder:text-[#cbd5e1]";

const TAB_ACTIVE =
  "flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all duration-150 bg-white text-[#131b2e] shadow-sm border border-[#e4ded3] flex items-center justify-center gap-1.5 cursor-pointer";
const TAB_INACTIVE =
  "flex-1 py-2 px-3 rounded-xl text-xs font-medium text-on-surface-variant hover:text-[#131b2e] transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer";

export default function ForgotPassword() {
  const [currentChannel, setCurrentChannel] = useState("email");
  const [recoveryValue, setRecoveryValue] = useState(CHANNELS.email.value);
  const [isPrivacyMasked, setIsPrivacyMasked] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | sending | sent
  const [otp, setOtp] = useState(["4", "8", "1", "", "", ""]);

  const otpRefs = useRef([]);
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const config = CHANNELS[currentChannel];
  const isValid = recoveryValue.trim().length > 3;

  const setRecoveryChannel = (channel) => {
    setCurrentChannel(channel);
    setRecoveryValue(CHANNELS[channel].value);
  };

  const handleOtpChange = (index, raw) => {
    const digit = raw.slice(-1);
    setOtp((prev) => prev.map((d, i) => (i === index ? digit : d)));
    if (digit && otpRefs.current[index + 1]) otpRefs.current[index + 1].focus();
  };

  const togglePrivacy = () => setIsPrivacyMasked((prev) => !prev);

  const handleSendCode = () => {
    if (status !== "idle") return;
    setStatus("sending");
    timers.current.push(
      setTimeout(() => {
        setStatus("sent");
        timers.current.push(setTimeout(() => setStatus("idle"), 1800));
      }, 900),
    );
  };

  return (
    <div className="bg-[#F8F7F4] text-[#131b2e] antialiased min-h-screen flex flex-col font-['Plus_Jakarta_Sans'] selection:bg-emerald-100 selection:text-emerald-900">
      <style>{`
        html, body { margin: 0; padding: 0; }
        body { overscroll-behavior: none; }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Header Navigation */}
      <header className="fixed top-0 w-full z-50 bg-[#F8F7F4]/80 backdrop-blur-xl border-b border-[#ece8df]">
        <div className="h-16 max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#006c49] flex items-center justify-center shadow-sm ring-2 ring-emerald-100/80">
              <img
                alt="Tabsy"
                className="w-7 h-7 rounded-lg"
                src="./assets/logo.svg"
              />
            </div>
            <div className="flex items-baseline gap-2.5">
              <span className="text-[17px] font-bold text-[#131b2e] tracking-tight">
                Tabsy
              </span>
              <span className="hidden sm:inline-block text-[#dfd9cd] select-none text-xs">
                /
              </span>
              <span className="hidden sm:inline-block text-xs font-semibold text-on-surface-variant/80">
                Multi-Factor Ledger Hub
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              className="flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-[#131b2e] transition-all py-1.5 px-3.5 rounded-xl hover:bg-white border border-transparent hover:border-[#e5dfd3] shadow-xs"
              href="#"
            >
              <span className="material-symbols-outlined text-[17px] text-[#006c49]">
                verified_user
              </span>
              <span>Help &amp; Security</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main View */}
      <main className="w-full flex-1 pt-18 pb-8 bg-[#F8F7F4] flex flex-col items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-5xl flex flex-col items-center">
          {/* Eyebrow & Top Header */}
          <div className="text-center mx-auto mb-4 w-full">
            <h1 className="text-xl sm:text-4xl font-extrabold text-[#131b2e] tracking-tight mb-2 flex items-center justify-center gap-2">
              Reset your password
            </h1>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Verify through your preferred recovery channel to decrypt and
              regain instant pool control.
            </p>
          </div>

          {/* Bento Dual-Panel Card */}
          <div className="w-full bg-white rounded-3xl border border-[#ece8df] shadow-tactile-card overflow-hidden grid grid-cols-1 lg:grid-cols-2 min-h-[620px] relative">
            {/* Left Panel */}
            <div className="col-span-1 lg:col-span-1 p-4 sm:p-7 lg:p-6 flex flex-col justify-between bg-white">
              <div>
                <div className="flex items-start justify-between gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fde8ef] border border-[#fad0df] text-[#b81d5a] text-[11px] font-bold font-['Inter'] tracking-wider uppercase">
                    <span className="material-symbols-outlined text-[13px]">
                      shield
                    </span>
                    <span>Tabsy Security Shield · 2-Step Verify</span>
                  </span>
                  <div className="w-9 h-9 rounded-2xl bg-[#fff0f5] border border-[#fbdde8] flex items-center justify-center text-lg select-none shadow-xs">
                    🌸
                  </div>
                </div>
                <h2 className="text-2xl font-extrabold text-[#131b2e] tracking-tight mb-1">
                  Account Recovery
                </h2>
                <p className="text-xs sm:text-sm text-on-surface-variant mb-5">
                  Select your authenticated channel to disburse a 6-digit
                  confirmation key.
                </p>

                {/* Channel Selector */}
                <div
                  className="mb-5 bg-[#F6F5F0] p-1.5 rounded-2xl flex items-center gap-1 border border-[#e8e4da] shadow-neo-inset"
                  id="channelSelector"
                >
                  {Object.entries(CHANNELS).map(([key, c]) => (
                    <button
                      key={key}
                      className={
                        currentChannel === key ? TAB_ACTIVE : TAB_INACTIVE
                      }
                      onClick={() => setRecoveryChannel(key)}
                      type="button"
                    >
                      <span>{c.emoji}</span>
                      <span className="truncate">{c.tab}</span>
                    </button>
                  ))}
                </div>

                {/* Recovery Form */}
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendCode();
                  }}
                >
                  <div className="relative bg-[#FAFAF8] rounded-2xl p-2.5 border border-[#e8e3d8] focus-within:border-[#006c49] focus-within:ring-2 focus-within:ring-emerald-50 transition-all">
                    <div className="flex items-center justify-between mb-1 px-1">
                      <label
                        className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant"
                        htmlFor="recoveryInput"
                      >
                        {config.label}
                      </label>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#006c49] bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span>{config.badgeText}</span>
                      </span>
                    </div>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-2 text-outline text-[19px] select-none">
                        {config.icon}
                      </span>
                      <input
                        className="w-full pl-9 pr-9 py-1.5 bg-transparent text-sm font-semibold text-[#131b2e] placeholder:text-[#9ba3af] focus:outline-none border-none focus:ring-0"
                        id="recoveryInput"
                        placeholder={config.placeholder}
                        type={config.type}
                        value={recoveryValue}
                        onChange={(e) => setRecoveryValue(e.target.value)}
                      />
                      <span
                        className={`material-symbols-outlined absolute right-2 text-[20px] transition-opacity ${
                          isValid ? "text-emerald-600" : "text-amber-500"
                        }`}
                      >
                        {isValid ? "check_circle" : "info"}
                      </span>
                    </div>
                  </div>

                  {/* Passkey prompt (passkey channel only) */}
                  {config.showPasskey && (
                    <div className="p-4 rounded-2xl bg-[#eff6ff] border border-[#bfdbfe] text-left flex items-start gap-3">
                      <span className="material-symbols-outlined text-[#2563eb] text-[22px] shrink-0 mt-0.5">
                        fingerprint
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-[#1e3a8a] mb-0.5">
                          Device Biometrics Ready
                        </h4>
                        <p className="text-[11px] text-[#3b82f6] leading-relaxed">
                          You can instantly bypass OTP codes using iCloud
                          Keychain or WebAuthn Touch ID paired on this Mac.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Tip */}
                  {config.showTip && (
                    <div className="p-3.5 rounded-2xl bg-[#fefce8] border border-[#fef08a] text-left flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-[#ca8a04] text-[19px] shrink-0 mt-0.5">
                        lightbulb
                      </span>
                      <p className="text-xs text-[#713f12] leading-relaxed">
                        <span className="font-bold">Tip:</span> Check your spam
                        or promotions folder if you do not receive the email
                        within 2 minutes.
                      </p>
                    </div>
                  )}

                  {/* OTP */}
                  <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#ece7dc]">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-xs font-bold text-[#131b2e] flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Instant 6-Digit Code Preview
                      </span>
                      <span className="text-[11px] font-semibold text-on-surface-variant">
                        Expires in 04:59
                      </span>
                    </div>
                    <div className="grid grid-cols-6 gap-2">
                      {otp.map((digit, i) => (
                        <input
                          key={i}
                          ref={(el) => (otpRefs.current[i] = el)}
                          className={OTP_INPUT}
                          maxLength={1}
                          placeholder={i > 2 ? "·" : undefined}
                          type="text"
                          value={digit}
                          onChange={(e) => handleOtpChange(i, e.target.value)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    className={`w-full py-3.5 px-6 rounded-2xl text-white font-bold text-sm tracking-tight transition-all shadow-tactile-btn active:translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:cursor-not-allowed ${
                      status === "sent"
                        ? "bg-emerald-800"
                        : "bg-[#151922] hover:bg-[#0c0e14]"
                    }`}
                    disabled={status === "sending"}
                    type="submit"
                  >
                    <span>{BUTTON_TEXT[status]}</span>
                    {status === "sending" ? (
                      <span className="material-symbols-outlined text-[18px] animate-spin">
                        progress_activity
                      </span>
                    ) : (
                      <span className="material-symbols-outlined text-[18px]">
                        arrow_forward
                      </span>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Right Panel (col-span-5) */}
            <div className="lg:col-span-1 hidden lg:block p-7 bg-[#edf7f1] flex flex-col justify-between relative min-w-0">
              <div className="w-full flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full bg-white text-[#006c49] font-bold text-[11px] font-['Inter'] tracking-wider uppercase shadow-xs border border-emerald-100 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Vault Health: Active
                </span>
                <div className="w-10 h-10 rounded-full bg-white border border-[#d6ebd9] flex items-center justify-center text-xs font-bold text-[#006c49] shadow-xs">
                  256b
                </div>
              </div>

              <h3 className="text-2xl font-extrabold text-[#131b2e] tracking-tight mb-1">
                Zero Stress Settlement
              </h3>
              <p className="text-xs text-[#4a5568] max-w-xs leading-relaxed mb-4">
                Balances, active group receipts, and split ledgers remain
                encrypted and safely anchored.
              </p>

              {/* Account Snapshot */}
              <div className="w-full bg-white/90 backdrop-blur-md rounded-2xl p-3.5 border border-white/80 shadow-tactile-sub text-left mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-emerald-100/70 text-[#006c49] font-bold text-xs flex items-center justify-center">
                      A
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#131b2e]">
                        Alex's Pool Vault
                      </p>
                      <p className="text-[10px] text-outline">alex@tabsy.app</p>
                    </div>
                  </div>
                  <button
                    className="p-1 rounded-lg hover:bg-slate-100 text-outline hover:text-[#131b2e] transition-colors cursor-pointer"
                    onClick={togglePrivacy}
                    title="Toggle Privacy Mask"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[17px]">
                      {isPrivacyMasked ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
                <div className="bg-[#F8FBF9] rounded-xl p-2.5 border border-[#e2efe5] flex items-center justify-between gap-2">
                  <div>
                    <span className="whitespace-nowrap text-[10px] uppercase font-bold text-outline-variant tracking-wider">
                      Safe Net Balance
                    </span>
                    <div className="text-sm font-extrabold text-[#006c49]">
                      {isPrivacyMasked ? "••••••••" : "+ ₹317.30"}
                    </div>
                  </div>
                  <div className="text-right min-w-0">
                    <span className="whitespace-nowrap text-[10px] uppercase font-bold text-outline-variant tracking-wider">
                      Active Ledgers
                    </span>
                    <p className="text-[11px] font-semibold text-[#131b2e]">
                      {isPrivacyMasked
                        ? "3 Hidden Pools (Encrypted)"
                        : "Goa 🌴 · Banglore 🏠 · Mumbai 🗾"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Checklist */}
              <div className="w-full space-y-2 text-left bg-white/70 p-3 rounded-2xl border border-white/80 mb-2">
                {FEATURES.map(([icon, text]) => (
                  <div
                    key={icon}
                    className="flex items-center gap-2.5 text-xs font-medium text-[#131b2e]"
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-[#006c49] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[13px] font-bold">
                        {icon}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold">{text}</span>
                  </div>
                ))}
              </div>

              {/* Social Proof */}
              <div className="flex items-center justify-between gap-2 bg-white/80 px-3.5 py-4 rounded-2xl shadow-xs border border-white/90 mb-2">
                <div className="flex -space-x-2 shrink-0">
                  {AVATARS.map(([text, colors, size]) => (
                    <div
                      key={text}
                      className={`w-6 h-6 rounded-full ${colors} flex items-center justify-center ${size} font-bold ring-2 ring-white`}
                    >
                      {text}
                    </div>
                  ))}
                </div>
                <span className="text-[11px] font-bold text-on-surface-variant text-right">
                  Protected across 14,000+ shared pools
                </span>
              </div>

              {/* FAQ */}
              <div className="pt-1">
                <button
                  className="w-full py-2.5 px-3 rounded-xl bg-[#FAF9F6] border border-[#e9e4d9] hover:bg-[#f3efea] transition-colors text-left flex items-center justify-between text-xs text-on-surface-variant font-medium cursor-pointer"
                  onClick={() => setFaqOpen((o) => !o)}
                  type="button"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#ca8a04] text-[17px]">
                      help_center
                    </span>
                    <span>
                      Need alternative recovery? Lost SIM or Authenticator?
                    </span>
                  </div>
                  <span
                    className="material-symbols-outlined text-[16px] transition-transform duration-200"
                    style={{
                      transform: faqOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  >
                    expand_more
                  </span>
                </button>
                {faqOpen && (
                  <div className="mt-2 p-3 rounded-xl bg-white border border-[#e9e4d9] text-[11px] text-on-surface-variant leading-relaxed">
                    <p className="mb-1 font-semibold text-[#131b2e]">
                      Emergency Account Fallback
                    </p>
                    You can use your 24-word emergency recovery phrase generated
                    when creating your shared Tab ledger, or request trusted
                    pool co-hosts (Alex, Sarah) to authorize your reinstatement.
                  </div>
                )}
              </div>

              {/* Bottom Navigation Footer */}
              <div className="pt-4 text-xs text-on-surface-variant border-t border-[#ece8df] mt-6 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                <div>
                  <span>Remembered your password?</span>
                  <a
                    className="font-bold text-secondary hover:underline ml-1 inline-flex items-center gap-0.5"
                    href="#"
                  >
                    <span>Back to Login</span>
                    <span className="material-symbols-outlined text-[14px]">
                      arrow_forward
                    </span>
                  </a>
                </div>
                <a
                  className="text-xs text-outline hover:text-[#131b2e] font-medium transition-colors flex items-center gap-1"
                  href="#"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    support_agent
                  </span>
                  <span>Live Concierge Support</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
