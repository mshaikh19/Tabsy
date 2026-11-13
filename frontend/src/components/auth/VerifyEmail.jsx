import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const LEDGERS = [
  { icon: "home", name: "Apt 4B Rent Split", amount: "$450.00 locked" },
  { icon: "luggage", name: "Weekend Trip to Tahoe", amount: "$210.00 locked" },
];

const AVATARS = [
  ["JD", "#BFDBFE"],
  ["MR", "#C7D2FE"],
  ["SR", "#DDD6FE"],
];

const formatTime = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

export default function VerifyEmail({
  email = "arjun@tabsy.app",
  sessionId = "#TB-8842",
  initialOtp = ["7", "3", "9", "", "", ""],
  initialSeconds = 42,
  onVerified,
}) {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(initialOtp);
  const [seconds, setSeconds] = useState(initialSeconds);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  const inputs = useRef([]);
  const verifyTimer = useRef(null);
  useEffect(() => () => clearTimeout(verifyTimer.current), []);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const canResend = seconds === 0;

  const handleChange = (i, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    setOtp((prev) => prev.map((d, idx) => (idx === i ? digit : d)));
    if (digit && i < 5) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0)
      inputs.current[i - 1]?.focus();
    if (e.key === "ArrowLeft" && i > 0) inputs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < 5) inputs.current[i + 1]?.focus();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!pasted) return;
    e.preventDefault();
    setOtp(Array.from({ length: 6 }, (_, i) => pasted[i] || ""));
    inputs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleResend = () => {
    if (!canResend) return;
    setSeconds(60);
    setOtp(["", "", "", "", "", ""]);
    inputs.current[0]?.focus();
  };

  const handleVerify = () => {
    if (verifying) return;
    if (otp.join("").length === 6) {
      setVerifying(true);
      verifyTimer.current = setTimeout(() => {
        setVerifying(false);
        setVerified(true);
        onVerified?.();
      }, 700);
    } else {
      inputs.current[
        Math.max(0, otp.findIndex((d) => !d))
      ]?.focus();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F8FD] text-[#0F1A3A] font-['Plus_Jakarta_Sans'] antialiased">
      <header className="sticky top-0 z-30 bg-[#F6F8FD]/95 backdrop-blur-md border-b border-[#E0E7FF]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              alt="Tabsy"
              className="w-9 h-9 rounded-xl"
              src="./assets/logo.svg"
            />
            <span className="text-xl font-extrabold tracking-tight mr-2.5">
              Tabsy
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EEF2FF] border border-[#C7D2FE] text-[#4338CA] text-xs font-semibold whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
              VAULT CLUSTER: EU-NORTH
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#E0E7FF] text-[#475569] text-xs font-semibold whitespace-nowrap shadow-[0_1px_2px_rgba(15,26,58,.05)]">
              <span className="material-symbols-outlined text-[16px] text-[#2563EB]">
                verified_user
              </span>
              TLS 1.3 Strict &amp; eIDAS Validated
            </div>
            <a
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#C7D2FE] text-[#334155] text-xs font-semibold whitespace-nowrap shadow-[0_1px_2px_rgba(15,26,58,.05)] hover:text-[#2563EB] hover:border-[#60A5FA] transition-colors"
              href="#"
            >
              <span className="material-symbols-outlined text-[16px] text-[#2563EB]">
                vpn_key
              </span>
              Concierge &amp; Key Audit
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-5">
            <section className="bg-white border border-[#E0E7FF] rounded-[28px] shadow-[0_10px_40px_-16px_rgba(40,52,120,.16)] p-9 flex flex-col justify-between min-h-[520px]">
              {verified ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
                  <div className="w-16 h-16 rounded-full bg-[#D1FAE5] border border-[#A7F3D0] text-[#10B981] flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-[34px]">
                      check_circle
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Email verified</h2>
                  <p className="text-sm text-[#475569] max-w-[280px]">
                    Your email has been successfully verified. You can now
                    access all Tabsy features.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate("/onboarding")}
                    className="mt-6 px-6 py-2.5 rounded-xl bg-[#2563EB] text-white text-sm font-semibold flex items-center gap-2 hover:bg-[#1D4ED8] transition-colors"
                  >
                    Continue
                    <span className="material-symbols-outlined text-[18px]">
                      arrow_forward
                    </span>
                  </button>
                </div>
              ) : (
                <form
                  className="flex flex-col"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleVerify();
                  }}
                >
                  <div className="flex items-center justify-between gap-3 mb-6">
                    <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EEF2FF] border border-[#C7D2FE] text-[#4338CA] text-xs font-bold tracking-wider uppercase whitespace-nowrap">
                      <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
                      Authentication Stage 02
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] text-xs font-medium tracking-wider uppercase whitespace-nowrap">
                      Session: {sessionId}
                    </span>
                  </div>

                  <h1 className="text-3xl font-extrabold tracking-tight mb-3 leading-tight">
                    Verify your email identity
                  </h1>
                  <p className="text-[15px] leading-relaxed text-[#475569] mb-7">
                    We sent an encrypted 6-digit session pin to{" "}
                    <span className="inline-block px-2 rounded-md bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] font-medium">
                      {email}
                    </span>
                    . Enter it to unlock your shared tab vault.
                  </p>

                  <div className="grid grid-cols-6 gap-2" onPaste={handlePaste}>
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => (inputs.current[i] = el)}
                        className={`h-16 min-w-0 rounded-[18px] border-2 text-center text-3xl font-bold outline-none transition-all placeholder:text-[#A5B4FC] placeholder:text-base focus:border-[#3B82F6] focus:shadow-[0_0_0_4px_rgba(147,197,253,.45)] ${
                          digit
                            ? "bg-white border-[#2563EB]"
                            : "bg-[#EEF2FF] border-[#C7D2FE]"
                        }`}
                        type="text"
                        inputMode="numeric"
                        autoComplete={i === 0 ? "one-time-code" : "off"}
                        maxLength={1}
                        placeholder="•"
                        value={digit}
                        onChange={(e) => handleChange(i, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(i, e)}
                        aria-label={`Digit ${i + 1}`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between mt-3.5 px-1">
                    <p className="flex items-center gap-2 text-sm text-[#475569]">
                      <span className="material-symbols-outlined text-[18px] text-[#2563EB]">
                        schedule
                      </span>
                      <span>
                        Expires in{" "}
                        <b className="text-[#0F1A3A] font-bold">
                          {formatTime(seconds)}
                        </b>
                      </span>
                    </p>
                    <button
                      type="button"
                      className={`flex items-center gap-1.5 bg-transparent border-0 p-0 text-sm font-medium transition-colors ${
                        canResend
                          ? "text-[#2563EB] cursor-pointer hover:text-[#1D4ED8]"
                          : "text-[#93B4FA] cursor-default"
                      }`}
                      onClick={handleResend}
                      disabled={!canResend}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        refresh
                      </span>
                      Resend code
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={verifying}
                    className="w-full h-14 mt-6 rounded-2xl bg-[#2563EB] text-white text-[17px] font-semibold flex items-center justify-center gap-2 shadow-[0_10px_24px_-10px_rgba(37,99,235,.6)] hover:bg-[#1D4ED8] transition-colors disabled:opacity-80 disabled:cursor-default"
                  >
                    {verifying ? "Verifying..." : "Verify & Enter Workspace"}
                    {!verifying && (
                      <span className="material-symbols-outlined text-[20px]">
                        arrow_forward
                      </span>
                    )}
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    <a
                      className="h-[42px] rounded-xl bg-[#EEF2FF] border border-[#C7D2FE] text-[#1D4ED8] text-[15px] font-medium flex items-center justify-center gap-2 whitespace-nowrap hover:bg-[#E0E7FF] transition-colors"
                      href="https://mail.google.com"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        mail
                      </span>
                      Open Gmail
                      <span className="material-symbols-outlined text-[13px]">
                        north_east
                      </span>
                    </a>
                    <a
                      className="h-[42px] rounded-xl bg-[#EEF2FF] border border-[#C7D2FE] text-[#1D4ED8] text-[15px] font-medium flex items-center justify-center gap-2 whitespace-nowrap hover:bg-[#E0E7FF] transition-colors"
                      href="message://"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        mark_email_read
                      </span>
                      Open Apple Mail
                      <span className="material-symbols-outlined text-[13px]">
                        north_east
                      </span>
                    </a>
                  </div>
                </form>
              )}

              <div className="mt-10 pt-5 border-t border-[#E0E7FF] flex items-center justify-between text-sm text-[#64748B]">
                <button
                  type="button"
                  className="flex items-center gap-1.5 bg-transparent border-0 p-0 text-[#64748B] hover:text-[#2563EB] transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    edit
                  </span>
                  Change email address
                </button>
                <span className="w-1 h-1 rounded-full bg-[#C7D2FE]" />
                <button
                  type="button"
                  className="bg-transparent border-0 p-0 text-[#64748B] hover:text-[#2563EB] transition-colors"
                >
                  Wrong account? Sign out
                </button>
              </div>
            </section>

            <div className="flex flex-col gap-5">
              <section className="bg-[#EEF2FF] border border-[#E0E7FF] rounded-[28px] p-7 shadow-none">
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="relative w-11 h-11 shrink-0 rounded-xl bg-white border border-[#E0E7FF] text-[#2563EB] flex items-center justify-center shadow-[0_1px_2px_rgba(15,26,58,.06)]">
                    <span className="material-symbols-outlined text-[22px]">
                      lock
                    </span>
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#4F46E5] border-2 border-[#EEF2FF]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold tracking-widest uppercase text-[#4338CA] mb-0.5">
                      Ledger Continuity
                    </p>
                    <h2 className="text-lg font-bold tracking-tight leading-snug">
                      Your Shared Balances Are Safe
                    </h2>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-[#475569] mb-5">
                  Your balances, active group splits, and pending receipts remain
                  cryptographically isolated while identity handshake finishes.
                </p>

                <div className="bg-white border border-[#E0E7FF] rounded-[18px] p-4 shadow-[0_1px_2px_rgba(15,26,58,.05)]">
                  <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-[#E0E7FF]">
                    <span className="flex items-center gap-2 text-sm font-semibold">
                      <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
                      Active Ledger Breakdown
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] text-xs font-semibold whitespace-nowrap">
                      2 Pools Locked
                    </span>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {LEDGERS.map((l) => (
                      <div
                        key={l.name}
                        className="flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-6 h-6 shrink-0 rounded-md bg-[#EEF2FF] border border-[#E0E7FF] text-[#2563EB] flex items-center justify-center">
                            <span className="material-symbols-outlined text-[15px]">
                              {l.icon}
                            </span>
                          </div>
                          <span className="text-sm text-[#334155] truncate">
                            {l.name}
                          </span>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] text-sm font-semibold whitespace-nowrap">
                          {l.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section className="bg-white border border-[#E0E7FF] rounded-[28px] p-6 flex items-start gap-4">
                <div className="w-9 h-9 shrink-0 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shadow-[0_4px_10px_-2px_rgba(37,99,235,.35)]">
                  <span className="material-symbols-outlined text-[20px]">
                    verified
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="text-lg font-bold tracking-tight">
                      SOC-2 Type II &amp; ISO 27001
                    </h3>
                    <span className="px-2 py-0.5 rounded-md bg-[#DBEAFE] border border-[#BFDBFE] text-[#1D4ED8] text-xs font-bold uppercase">
                      Audited
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-[#475569]">
                    Zero unverified tab transfers. Private keys and participant
                    settlement accounts are safeguarded under strict bank-grade
                    protocols.
                  </p>
                </div>
              </section>

              <section className="bg-white border border-[#E0E7FF] rounded-[28px] px-6 py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 shrink-0 rounded-full bg-[#E0E7FF] border border-[#C7D2FE] text-[#4338CA] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[17px]">
                      group
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold">Trusted by 45,000+ roommates</p>
                    <p className="text-xs text-[#64748B]">
                      Across London, New York &amp; Stockholm
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0">
                  {AVATARS.map(([text, bg], idx) => (
                    <div
                      key={text}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-[#3730A3] shadow-[0_0_0_2px_#fff] ${
                        idx > 0 ? "-ml-2" : ""
                      }`}
                      style={{ background: bg }}
                    >
                      {text}
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-3 flex-wrap text-sm text-[#64748B]">
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[17px] text-[#2563EB]">
                lock
              </span>
              256-bit bank-grade encryption for group settlement security
            </span>
            <span className="w-1 h-1 rounded-full bg-[#C7D2FE]" />
            <span className="text-xs text-[#94A3B8]">
              Build 2.9.0-electric-cobalt
            </span>
          </div>
        </div>
      </main>

      <footer className="py-5 text-center text-sm text-[#94A3B8]">
        © Tabsy Technologies AB. Stockholm • Oslo • Copenhagen • London
      </footer>
    </div>
  );
}