import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SPLIT_MODES = [
  { key: "equal", emoji: "⚖️", title: "Split Equally (1/N)", text: "Quick & democratic. Everyone covers identical portions." },
  { key: "itemized", emoji: "🧾", title: "Itemized Allocation", text: "Pay only what you ordered. Tailored dish by dish." },
  { key: "round", emoji: "🪙", title: "Always Round Down", text: "Eliminates awkward pennies. Pool absorbs rounding." },
];

export default function ProfileSetupPreferences() {
  const navigate = useNavigate();
  const [splitMode, setSplitMode] = useState("equal");
  const [notifications, setNotifications] = useState({
    expense: true,
    settlement: true,
    recap: false,
  });
  const [launching, setLaunching] = useState(false);

  const toggleNotification = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFinish = () => {
    setLaunching(true);
    setTimeout(() => navigate("/dashboard"), 600);
  };

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen">
      <header className="fixed top-0 left-0 right-0 w-full z-40 bg-surface/85 backdrop-blur-md border-b border-surface-container">
        <div className="max-w-7xl mx-auto px-gutter-desktop h-16 flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <img alt="Tabsy" className="w-8 h-8 rounded-xl" src="./assets/logo.svg" />
            <span className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
              Tabsy
            </span>
            <span className="hidden sm:inline-block ml-space-xs px-2.5 py-0.5 rounded-full bg-bento-mint border border-bento-mint-border font-body-sm text-body-sm text-emerald-900 font-semibold">
              One tab. All sorted.
            </span>
          </div>
          <div className="flex items-center gap-space-md">
            <a
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container transition-colors"
              href="#"
            >
              <span className="material-symbols-outlined text-[16px] text-secondary">
                help
              </span>
              <span className="font-medium">Help &amp; Security</span>
            </a>
          </div>
        </div>
      </header>

      <main className="w-full h-screen pt-16 bg-surface overflow-y-auto">
        <div className="w-full max-w-4xl mx-auto px-margin sm:px-margin-tablet lg:px-margin-desktop py-space-xl">
          <div className="flex items-center gap-space-sm mb-space-lg">
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-2.5 rounded-full bg-primary-container" />
              <div className="w-12 h-2.5 rounded-full bg-sky-400" />
            </div>
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider font-bold">
              Step 2 of 2: Profile &amp; Preferences (Part 2)
            </span>
          </div>

          <div className="bg-surface-container-lowest rounded-3xl p-space-md sm:p-space-xl border border-surface-container flex flex-col gap-space-lg shadow-sm">
            <div className="flex flex-col gap-space-sm">
              <div className="flex items-center justify-between">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase font-semibold">
                  Default Settlement Logic
                </label>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Switchable per bill
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {SPLIT_MODES.map((mode) => {
                  const active = splitMode === mode.key;
                  return (
                    <div
                      key={mode.key}
                      onClick={() => setSplitMode(mode.key)}
                      className={`cursor-pointer p-5 rounded-3xl flex flex-col justify-between gap-3 transition-all ${
                        active
                          ? "bg-white border-2 border-emerald-500 text-on-surface shadow-sm"
                          : "bg-white border border-surface-container hover:border-outline-variant text-on-surface"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-2xl bg-surface-container-low flex items-center justify-center text-xl">
                          <span>{mode.emoji}</span>
                        </div>
                        <span
                          className={`material-symbols-outlined text-[22px] ${
                            active ? "text-primary-container" : "text-outline-variant"
                          }`}
                        >
                          {active ? "check_circle" : "radio_button_unchecked"}
                        </span>
                      </div>
                      <div>
                        <p className="font-headline-sm text-title-md font-bold text-on-surface">
                          {mode.title}
                        </p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                          {mode.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-space-md sm:p-space-lg rounded-3xl bg-white border border-surface-container flex flex-col gap-space-sm shadow-sm">
              <div className="flex items-center justify-between">
                <label className="font-label-caps text-label-caps text-on-surface uppercase font-bold tracking-wider">
                  Notification Preferences
                </label>
                <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-caps text-[10px] font-bold">
                  REAL-TIME
                </span>
              </div>
              <div className="flex flex-col gap-2.5">
                {[
                  { key: "expense", icon: "receipt_long", iconColor: "text-primary-container", title: "New expense added", text: "Instant push ping when a friend logs a ticket or bill" },
                  { key: "settlement", icon: "payments", iconColor: "text-blue-600", title: "Settlement requested", text: "Alert when friends balance out or request payment transfer" },
                  { key: "recap", icon: "calendar_month", iconColor: "text-purple-700", title: "Monthly spending recap", text: "Digest breakdown of who covered what across shared trips" },
                ].map((row) => (
                  <div key={row.key} className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-container-lowest border border-surface-container">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-surface-container-low flex items-center justify-center">
                        <span className={`material-symbols-outlined text-[19px] ${row.iconColor}`}>
                          {row.icon}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-title-md text-title-md font-semibold text-on-surface">
                          {row.title}
                        </span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">
                          {row.text}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={notifications[row.key]}
                      onClick={() => toggleNotification(row.key)}
                      className={`w-12 h-7 rounded-full p-1 transition-colors flex items-center ${
                        notifications[row.key] ? "bg-primary-container" : "bg-surface-container-highest"
                      }`}
                    >
                      <span
                        className={`toggle-knob w-5 h-5 rounded-full bg-surface-container-lowest shadow-sm transform transition-transform ${
                          notifications[row.key] ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-space-md flex flex-col sm:flex-row items-center justify-between gap-space-md border-t border-surface-container">
              <div className="flex items-center gap-3 order-2 sm:order-1">
                <button
                  type="button"
                  onClick={() => navigate("/profile-setup")}
                  className="font-title-md text-body-md text-on-surface-variant hover:text-on-surface px-4 py-2 transition-colors font-semibold"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="font-title-md text-body-md text-on-surface-variant hover:text-on-surface px-4 py-2 transition-colors font-semibold"
                >
                  Skip for now
                </button>
              </div>
              <button
                type="button"
                onClick={handleFinish}
                disabled={launching}
                className="order-1 sm:order-2 w-full sm:w-auto px-8 h-14 rounded-full bg-slate-900 text-surface-container-lowest font-headline-sm text-title-md font-bold flex items-center justify-center gap-2.5 shadow-lg hover:bg-slate-800 active:scale-95 transition-all disabled:opacity-70"
              >
                <span>{launching ? "Launching..." : "Finish & Launch My First Tab"}</span>
                <span className="w-7 h-7 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container text-sm">
                  {launching ? "⚡" : "🚀"}
                </span>
              </button>
            </div>
          </div>

          <div className="mt-space-lg flex items-center justify-center gap-2 text-center text-on-surface-variant font-body-sm text-body-sm">
            <span className="material-symbols-outlined text-[16px] text-emerald-700">verified_user</span>
            <span>Preferences sync locally and are end-to-end secured on Tabsy Cloud.</span>
          </div>
        </div>
      </main>
    </div>
  );
}