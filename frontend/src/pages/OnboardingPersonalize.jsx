import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CHIPS = [
  { label: "Vacations & Trips", emoji: "âœˆï¸", bg: "bg-[#E3F2FD]", text: "text-[#0369A1]", border: "border-[#BAE6FD]", hover: "hover:border-[#0284C7]" },
  { label: "Roommate Rent & Utilities", emoji: "ðŸ¡", bg: "bg-[#E8F5E9]", text: "text-[#15803D]", border: "border-[#BBF7D0]", hover: "hover:border-[#10B981]" },
  { label: "Dinners & Parties", emoji: "ðŸ•", bg: "bg-[#FFF9C4]", text: "text-[#B45309]", border: "border-[#FDE68A]", hover: "hover:border-[#D97706]" },
  { label: "Couple & Shared Home", emoji: "ðŸ’¼", bg: "bg-[#FCE4EC]", text: "text-[#BE185D]", border: "border-[#FBCFE8]", hover: "hover:border-[#EC4899]" },
  { label: "Coffee Runs & Daily", emoji: "â˜•", bg: "bg-[#F3E5F5]", text: "text-[#7E22CE]", border: "border-[#E9D5FF]", hover: "hover:border-[#9333EA]" },
  { label: "Road Trips & Festivals", emoji: "ðŸš—", bg: "bg-[#FBE9E7]", text: "text-[#C2410C]", border: "border-[#FFEDD5]", hover: "hover:border-[#EA580C]" },
];

export default function OnboardingPersonalize() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);

  const toggle = (label) => {
    setSelected((prev) =>
      prev.includes(label) ? prev.filter((v) => v !== label) : [...prev, label],
    );
  };

  return (
    <div className="bg-[#FAF8F5] text-[#18181B] antialiased min-h-screen selection:bg-[#FFE082] selection:text-[#18181B]">
      <header className="fixed top-0 left-0 right-0 w-full z-40 bg-[#FAF8F5] border-b border-[#EFECE6]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img alt="Tabsy" className="w-9 h-9 rounded-2xl" src="./assets/logo.svg" />
            <span className="font-extrabold text-xl text-[#18181B] tracking-tight">
              Tabsy
            </span>
            <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full bg-[#E8F5E9] text-[#1B5E20] font-semibold text-xs border border-[#C8E6C9]">
              One tab. All sorted.
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a
              className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 px-3.5 py-2 rounded-full bg-white border border-[#EFECE6] flex items-center gap-1.5 transition-all shadow-sm"
              href="#"
            >
              <span className="material-symbols-outlined text-[16px] text-[#0284C7]">
                verified_user
              </span>
              <span>Help &amp; Security</span>
            </a>
          </div>
        </div>
      </header>

      <main className="w-full pt-20 pb-16 flex flex-col justify-center items-center">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center">
          <div className="flex items-center gap-3 bg-white border border-[#EFECE6] px-4 py-2 rounded-full mb-8 shadow-sm">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EFECE6] border border-[#DCD8D0]" />
              <span className="w-6 h-1.5 rounded-full bg-[#10B981]" />
              <span className="px-2.5 py-0.5 rounded-full bg-[#10B981] text-white text-label-caps font-bold tracking-wide">
                2
              </span>
            </div>
            <div className="h-3 w-[1px] bg-[#EFECE6]" />
            <span className="font-bold text-label-caps text-zinc-600 uppercase tracking-wider">
              Step 2 of 2 : <span className="text-zinc-900">Personalize Your Hub</span>
            </span>
          </div>

          <div className="w-full max-w-4xl bg-white border border-[#EFECE6] rounded-3xl p-6 sm:p-9 shadow-sm flex flex-col items-center mb-10 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F5E9] text-[#1B5E20] border border-[#C8E6C9] text-label-caps font-extrabold uppercase tracking-wider mb-2.5">
              <span>ðŸŽ¯</span> Personalize Your Hub
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#18181B] tracking-tight mb-2">
              What will you use Tabsy for most?
            </h3>
            <p className="text-sm text-zinc-500 mb-6">
              Select your primary use cases to load optimized tab presets.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 w-full">
              {CHIPS.map((chip) => {
                const active = selected.includes(chip.label);
                return (
                  <button
                    key={chip.label}
                    type="button"
                    onClick={() => toggle(chip.label)}
                    className={`px-5 py-3 rounded-full font-bold text-sm transition-all flex items-center gap-2.5 active:scale-95 shadow-sm border-2 ${
                      active
                        ? "ring-4 ring-[#18181B]/20 scale-105 " + chip.bg + " " + chip.text + " " + chip.border
                        : chip.bg + " " + chip.text + " " + chip.border + " " + chip.hover
                    }`}
                  >
                    <span className="text-base">{chip.emoji}</span>
                    <span>{chip.label}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-zinc-400 mt-5">
              You can easily toggle and add customized categories anytime.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              type="button"
              onClick={() => navigate("/profile-setup")}
              className="px-9 py-4 rounded-full bg-[#1E232F] text-white hover:bg-[#11141B] font-bold text-base shadow-md transition-all flex items-center gap-3 group active:scale-95 border border-[#18181B]"
            >
              <span>Set Up My Profile</span>
              <span className="w-7 h-7 rounded-full bg-[#10B981] text-[#003B26] flex items-center justify-center transition-transform group-hover:translate-x-1">
                <span className="material-symbols-outlined text-[18px]">
                  arrow_forward
                </span>
              </span>
            </button>
          </div>

          <div className="mt-7 flex items-center gap-2 text-zinc-500 font-medium text-xs">
            <span className="material-symbols-outlined text-[18px] text-[#10B981]">
              verified
            </span>
            <span>
              No bank card or registration fee required. 100% free for personal
              tabs.
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
