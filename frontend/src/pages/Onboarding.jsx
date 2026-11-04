import { useNavigate } from "react-router-dom";

export default function Onboarding() {
  const navigate = useNavigate();

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
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col items-center">
          <div className="flex items-center gap-3 bg-white border border-[#EFECE6] px-4 py-2 rounded-full mb-3 shadow-sm">
            <div className="flex items-center gap-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-[#10B981] text-white text-[11px] font-bold tracking-wide">
                1
              </span>
              <span className="w-6 h-1.5 rounded-full bg-[#10B981]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#EFECE6] border border-[#DCD8D0]" />
            </div>
            <div className="h-3 w-[1px] bg-[#EFECE6]" />
            <span className="font-bold text-[11px] text-zinc-600 uppercase tracking-wider">
              Step 1 of 2 : <span className="text-zinc-900">How Tabsy Works</span>
            </span>
          </div>

          <div className="text-center max-w-3xl mx-auto mb-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF9C4] text-[#B45309] border border-[#FDE68A] text-xs font-bold mb-3">
              <span>✨</span> Delightful Multi-Person Accounting
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-[30px] font-extrabold text-[#18181B] tracking-tight leading-[1.15] mb-3">
              Split expenses in 3 simple steps
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 max-w-xl mx-auto leading-relaxed">
              No complicated spreadsheets. No awkward debt chasers. Pure
              mathematical clarity wrapped in joyful pastel precision.
            </p>
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="relative bg-[#E3F2FD] border-2 border-[#BAE6FD] rounded-3xl p-5 sm:p-6 flex flex-col justify-between overflow-hidden shadow-sm hover:translate-y-[-2px] transition-all">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-[#BAE6FD] flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-[#0284C7] text-[26px]">
                      link
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#0284C7] text-white font-extrabold text-[11px] tracking-wider uppercase">
                    STEP 01
                  </span>
                </div>
                <h2 className="text-base font-bold text-[#0D47A1] mb-3 leading-snug">
                  1. Create a shared tab 🌴
                </h2>
                <p className="text-[11px] text-[#0D47A1]/80 leading-relaxed font-medium">
                  Invite roommates, travel buddies, or dinner crews via a single
                  instant magic link. No app download required for guests.
                </p>
              </div>
              <div className="mt-2 bg-white border border-[#BAE6FD] rounded-2xl p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-[#E8F5E9] border-2 border-white text-[#1B5E20] font-bold text-xs flex items-center justify-center shadow-sm">
                      AL
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#FFF9C4] border-2 border-white text-[#B45309] font-bold text-xs flex items-center justify-center shadow-sm">
                      MY
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#F3E5F5] border-2 border-white text-[#4A148C] font-bold text-xs flex items-center justify-center shadow-sm">
                      SK
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#FCE4EC] border-2 border-white text-[#880E4F] font-bold text-xs flex items-center justify-center shadow-sm">
                      LO
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#18181B] border-2 border-white text-white font-bold text-[10px] flex items-center justify-center shadow-sm">
                      +4
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#E8F5E9] text-[#1B5E20] border border-[#C8E6C9] font-bold text-xs flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">
                      check_circle
                    </span>
                    Active Tab
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#EFECE6] text-xs">
                  <span className="font-mono text-zinc-500 text-[11px] truncate max-w-[150px]">
                    tabsy.me/bali-retreat
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#E3F2FD] text-[#0284C7] font-bold text-[10px] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">
                      content_copy
                    </span>
                    Link copied!
                  </span>
                </div>
              </div>
            </div>

            <div className="relative bg-[#FFF9C4] border-2 border-[#FDE68A] rounded-3xl p-5 sm:p-6 flex flex-col justify-between overflow-hidden shadow-sm hover:translate-y-[-2px] transition-all">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-[#FDE68A] flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-[#D97706] text-[26px]">
                      receipt_long
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#D97706] text-white font-extrabold text-[11px] tracking-wider uppercase">
                    STEP 02
                  </span>
                </div>
                <h2 className="text-base font-bold text-[#B45309] mb-3 leading-snug">
                  2. Snap receipts or log on the fly 🧾
                </h2>
                <p className="text-[11px] text-[#B45309]/85 leading-relaxed font-medium">
                  Multi-modal smart OCR instantly parses dishes, tax, and tips.
                  Assign drinks item-by-item or split the feast equally in
                  seconds.
                </p>
              </div>
              <div className="mt-2 bg-white border border-[#FDE68A] rounded-2xl p-4 shadow-sm space-y-2.5">
                <div className="flex items-center justify-between pb-1.5 border-b border-[#EFECE6]">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#D97706]">
                      document_scanner
                    </span>
                    <span className="text-xs font-bold text-zinc-800">
                      El Born Tapas Bar
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#FFF9C4] text-[#B45309] font-bold text-[10px] border border-[#FDE68A]">
                    OCR 100%
                  </span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#EC4899]" />
                      <span className="text-zinc-700 font-medium">
                        Patatas Bravas &amp; Tapas
                      </span>
                    </div>
                    <span className="font-mono font-bold text-zinc-900">
                      $42.00
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#0284C7]" />
                      <span className="text-zinc-700 font-medium">
                        Sangria Pitcher (x2)
                      </span>
                    </div>
                    <span className="font-mono font-bold text-zinc-900">
                      $28.50
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                      <span className="text-zinc-700 font-medium">
                        Seafood Paella Grande
                      </span>
                    </div>
                    <span className="font-mono font-bold text-zinc-900">
                      $54.00
                    </span>
                  </div>
                </div>
                <div className="pt-2 border-t border-[#EFECE6] flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-zinc-500">
                    Total Bill:{" "}
                    <strong className="text-zinc-900 font-mono">$124.50</strong>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#FCE4EC] text-[#880E4F] font-bold text-[10px]">
                    Split 4 ways
                  </span>
                </div>
              </div>
            </div>

            <div className="relative bg-[#F3E5F5] border-2 border-[#E9D5FF] rounded-3xl p-5 sm:p-6 flex flex-col justify-between overflow-hidden shadow-sm hover:translate-y-[-2px] transition-all">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-[#E9D5FF] flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-[#7E22CE] text-[26px]">
                      hub
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#7E22CE] text-white font-extrabold text-[11px] tracking-wider uppercase">
                    STEP 03
                  </span>
                </div>
                <h2 className="text-base font-bold text-[#4A148C] mb-3 leading-snug">
                  3. Settle in one tap ⚡
                </h2>
                <p className="text-[11px] text-[#4A148C]/85 leading-relaxed font-medium">
                  Our bipartite graph engine consolidates tangled multi-person
                  debts into minimum direct settlements. Zero ping-pong
                  payments.
                </p>
              </div>
              <div className="mt-2 bg-white border border-[#E9D5FF] rounded-2xl p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide block">
                      Debt Graph Optimization
                    </span>
                    <span className="font-extrabold text-sm text-[#18181B]">
                      12 debts → Only 2 payouts
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#E8F5E9] text-[#1B5E20] border border-[#C8E6C9] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">
                      bolt
                    </span>
                  </div>
                </div>
                <div className="space-y-1.5 pt-1">
                  <div className="p-2 rounded-xl bg-[#FAF8F5] border border-[#EFECE6] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-medium text-zinc-700">
                      <span className="font-bold text-[#880E4F]">Alex</span>
                      <span className="text-zinc-400">→</span>
                      <span className="font-bold text-[#1B5E20]">Sam</span>
                    </div>
                    <span className="font-mono font-bold text-emerald-700 bg-[#E8F5E9] px-2 py-0.5 rounded-full">
                      $36.40
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#FAF8F5] border border-[#EFECE6] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-medium text-zinc-700">
                      <span className="font-bold text-[#B45309]">Maya</span>
                      <span className="text-zinc-400">→</span>
                      <span className="font-bold text-[#0D47A1]">Sam</span>
                    </div>
                    <span className="font-mono font-bold text-emerald-700 bg-[#E8F5E9] px-2 py-0.5 rounded-full">
                      $21.80
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              type="button"
              onClick={() => navigate("/onboarding/personalize")}
              className="px-7 py-3 rounded-full bg-[#1E232F] text-white hover:bg-[#11141B] font-bold text-base shadow-md transition-all flex items-center gap-3 group active:scale-95 border border-[#18181B]"
            >
              <span>Set Up My Profile</span>
              <span className="w-7 h-7 rounded-full bg-[#10B981] text-[#003B26] flex items-center justify-center transition-transform group-hover:translate-x-1">
                <span className="material-symbols-outlined text-[18px]">
                  arrow_forward
                </span>
              </span>
            </button>
          </div>

          <div className="mt-2 flex items-center gap-2 text-zinc-500 font-medium text-xs">
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
