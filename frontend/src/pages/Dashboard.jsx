import { useState } from "react";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="bg-[#FAF8F5] text-zinc-900 font-sans antialiased min-h-screen p-3 md:p-5 lg:p-6 selection:bg-emerald-100 selection:text-emerald-900">
      <div className="relative min-h-screen">
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <aside className={`fixed top-0 left-0 lg:top-3 lg:left-3 h-full lg:h-[calc(100vh-1.5rem)] w-72 bg-[#18181B] text-zinc-300 rounded-r-3xl lg:rounded-3xl p-5 flex flex-col justify-between shrink-0 shadow-xl shadow-zinc-900/5 border border-zinc-800/80 z-50 transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
          <div className="flex flex-col gap-6 overflow-y-auto">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-sm font-bold">
                  <span className="material-symbols-outlined text-[22px]">payments</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-white text-[19px] tracking-tight">tabsy</span>
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-[10px] tracking-wider text-zinc-400 font-semibold uppercase block font-mono">
                    Shared Studio
                  </span>
                </div>
              </div>
              <button
                className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-all lg:hidden"
                title="Close menu"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="material-symbols-outlined text-[19px]">close</span>
              </button>
              <button className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-all hidden lg:flex" title="Collapse sidebar">
                <span className="material-symbols-outlined text-[19px]">left_panel_close</span>
              </button>
            </div>

            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-zinc-400 text-[18px]">
                search
              </span>
              <input
                className="w-full bg-zinc-800/80 text-zinc-200 text-[13px] pl-10 pr-12 py-2.5 rounded-2xl border border-zinc-700/50 focus:outline-none focus:border-emerald-500 placeholder:text-zinc-500 transition-colors"
                placeholder="Jump to tab or friend..."
                type="text"
              />
              <span className="absolute right-3 top-2.5 px-1.5 py-0.5 rounded-md bg-zinc-700/60 text-[10px] font-mono text-zinc-400">
                ⌘K
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-3 mb-1 font-mono">
                Main Hub
              </span>
              <a className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-zinc-800 text-white text-[13.5px] font-semibold transition-all group" href="#">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="material-symbols-outlined text-[20px] text-emerald-400">space_dashboard</span>
                  <span>Overview</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400/90 font-medium">Live</span>
              </a>
              <a className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-zinc-400 hover:text-white hover:bg-zinc-800/40 text-[13.5px] font-medium transition-all" href="#">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[20px]">notifications_active</span>
                  <span>Activity</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-800 text-zinc-300">
                  2 unread
                </span>
              </a>
              <a className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-zinc-400 hover:text-white hover:bg-zinc-800/40 text-[13.5px] font-medium transition-all" href="#">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
                  <span>Balances</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-950/70 text-emerald-400 border border-emerald-800/30">
                  +₹317.30
                </span>
              </a>
              <a className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-zinc-400 hover:text-white hover:bg-zinc-800/40 text-[13.5px] font-medium transition-all" href="#">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                  <span>All Receipts</span>
                </div>
              </a>
              <a className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-zinc-400 hover:text-white hover:bg-zinc-800/40 text-[13.5px] font-medium transition-all" href="#">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[20px]">hub</span>
                  <span>Debt Simplifier</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-950/80 text-indigo-300">
                  Auto
                </span>
              </a>
            </div>

            <div className="flex flex-col gap-1.5 pt-3 border-t border-zinc-800/80">
              <div className="flex items-center justify-between px-3 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-mono">
                  Shared Spaces
                </span>
                <button className="text-zinc-500 hover:text-zinc-300 text-[18px] leading-none" title="Create Space">
                  +
                </button>
              </div>
              <a className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-zinc-300 hover:text-white hover:bg-zinc-800/50 text-[13px] transition-all group" href="#">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
                  <span className="truncate font-medium">Lisbon Roadtrip</span>
                </div>
                <span className="text-sm">🌴</span>
              </a>
              <a className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-zinc-300 hover:text-white hover:bg-zinc-800/50 text-[13px] transition-all group" href="#">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-300 shrink-0" />
                  <span className="truncate font-medium">Mumbai Flat 4B</span>
                </div>
                <span className="text-sm">🏠</span>
              </a>
              <a className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-zinc-300 hover:text-white hover:bg-zinc-800/50 text-[13px] transition-all group" href="#">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400 shrink-0" />
                  <span className="truncate font-medium">Delhi Weekend Tour</span>
                </div>
                <span className="text-sm">🗾</span>
              </a>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800/80">
            <div className="p-3 bg-zinc-900/90 rounded-2xl border border-zinc-800/90 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white font-bold text-[13px] flex items-center justify-center shrink-0 shadow-inner">
                  AM
                </div>
                <div className="min-w-0">
                  <p className="text-white text-[13px] font-bold truncate leading-tight">Arjun Sharma</p>
                  <p className="text-zinc-400 text-[11px] font-mono truncate">arjun@tabsy.co</p>
                </div>
              </div>
              <button className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors" title="Account settings">
                <span className="material-symbols-outlined text-[17px]">settings</span>
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 flex flex-col gap-6 min-w-0 lg:ml-[19.5rem] px-0 lg:px-2">
          <div className="lg:hidden flex items-center justify-between mb-2">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="w-10 h-10 rounded-2xl bg-white border border-[#EFECE6] flex items-center justify-center text-zinc-700 shadow-sm"
            >
              <span className="material-symbols-outlined text-[22px]">menu</span>
            </button>
            <span className="font-extrabold text-[#18181B] text-lg">tabsy</span>
          </div>
          <header className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EFECE6] shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 text-[11px] font-mono font-bold tracking-tight">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  SYNC ACTIVE
                </span>
                <span className="text-zinc-400 text-[12px] font-medium">• 12 seconds ago</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
                Good morning, Arjun 🥑
              </h1>
              <p className="text-[13.5px] text-zinc-500 mt-0.5 font-medium">
                All 3 tabs in balance • 0 disputes • 2 settlements pending your approval
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center p-1 rounded-2xl bg-[#F4EFEA] border border-[#EFECE6] text-xs font-bold">
                <button className="px-3 py-1.5 rounded-xl bg-white text-zinc-900 shadow-sm transition-all font-mono">
                  ₹ INR
                </button>
                <button className="px-3 py-1.5 rounded-xl text-zinc-500 hover:text-zinc-900 transition-all font-mono">
                  € EUR
                </button>
              </div>
              <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-zinc-900 text-white font-semibold text-[13px] hover:bg-zinc-800 transition-all shadow-sm active:scale-95">
                <span className="material-symbols-outlined text-[18px] text-emerald-400">add</span>
                <span>Log Expense</span>
              </button>
              <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-100 text-emerald-900 border border-emerald-200/70 font-semibold text-[13px] hover:bg-emerald-200/70 transition-all shadow-sm active:scale-95">
                <span className="material-symbols-outlined text-[18px]">bolt</span>
                <span>Settle Up</span>
              </button>
              <button className="w-10 h-10 rounded-2xl bg-white border border-[#EFECE6] flex items-center justify-center text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition-all shadow-sm relative">
                <span className="material-symbols-outlined text-[20px]">notifications</span>
                <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-rose-500" />
              </button>
            </div>
          </header>

          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
            <div className="bg-white rounded-3xl p-6 border border-[#EFECE6] shadow-sm flex flex-col justify-between hover:border-emerald-200 transition-all">
              <div className="flex items-start justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-zinc-500">
                  Net Position
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200/50">
                  Surplus
                </span>
              </div>
              <div className="my-4">
                <div className="text-3xl font-extrabold text-emerald-600 tracking-tight font-mono">
                  +₹317.30
                </div>
                <p className="text-[12px] text-zinc-500 mt-1 flex items-center gap-1.5 font-medium">
                  <span className="material-symbols-outlined text-[15px] text-emerald-600">auto_graph</span>
                  Optimized by Tabsy Graph
                </p>
              </div>
              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-[11.5px] text-zinc-500">
                <span>Overall Ledger status</span>
                <span className="font-bold text-zinc-800">Healthy ✨</span>
              </div>
            </div>

            <div className="bg-pastel-rose rounded-3xl p-6 border border-[#FCD6D3] shadow-sm flex flex-col justify-between hover:border-rose-300 transition-all">
              <div className="flex items-start justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-rose-800">
                  You Owe
                </span>
                <div className="w-7 h-7 rounded-xl bg-white/80 flex items-center justify-center text-rose-600">
                  <span className="material-symbols-outlined text-[17px]">arrow_outward</span>
                </div>
              </div>
              <div className="my-4">
                <div className="text-3xl font-extrabold text-rose-950 tracking-tight font-mono">
                  ₹165.20
                </div>
                <p className="text-[12px] text-rose-800/80 mt-1 font-medium">
                  Across 2 friends (Vikram &amp; Rahul)
                </p>
              </div>
              <button className="w-full py-2.5 px-3 rounded-2xl bg-white text-rose-900 font-bold text-[12.5px] border border-rose-200/70 hover:bg-rose-50 transition-all shadow-sm flex items-center justify-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">credit_card</span>
                <span>Pay via Apple Pay</span>
              </button>
            </div>

            <div className="bg-pastel-mint rounded-3xl p-6 border border-[#CDEEDC] shadow-sm flex flex-col justify-between hover:border-emerald-300 transition-all">
              <div className="flex items-start justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-emerald-800">
                  Owed to You
                </span>
                <div className="w-7 h-7 rounded-xl bg-white/80 flex items-center justify-center text-emerald-700">
                  <span className="material-symbols-outlined text-[17px]">south_west</span>
                </div>
              </div>
              <div className="my-4">
                <div className="text-3xl font-extrabold text-emerald-950 tracking-tight font-mono">
                  ₹482.50
                </div>
                <p className="text-[12px] text-emerald-800/80 mt-1 font-medium">
                  From Priya, Ananya &amp; 2 roommates
                </p>
              </div>
              <button className="w-full py-2.5 px-3 rounded-2xl bg-white text-emerald-900 font-bold text-[12.5px] border border-emerald-200/70 hover:bg-emerald-50 transition-all shadow-sm flex items-center justify-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">touch_app</span>
                <span>Send Soft Nudge</span>
              </button>
            </div>

            <div className="bg-pastel-butter rounded-3xl p-6 border border-[#FBEEC0] shadow-sm flex flex-col justify-between hover:border-amber-300 transition-all">
              <div className="flex items-start justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-amber-900">
                  Active Pool Spend
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/80 text-amber-900 font-mono font-bold text-[11px] border border-amber-200/60">
                  84% Settled
                </span>
              </div>
              <div className="my-4">
                <div className="text-3xl font-extrabold text-amber-950 tracking-tight font-mono">
                  ₹2,140.00
                </div>
                <div className="w-full bg-amber-200/60 rounded-full h-2 mt-2.5 overflow-hidden">
                  <div className="bg-amber-600 h-2 rounded-full w-[84%]" />
                </div>
              </div>
              <div className="pt-2 flex items-center justify-between text-[11.5px] text-amber-900/80 font-medium">
                <span>October Cycle</span>
                <span className="font-bold text-amber-950">₹340 remaining</span>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <div>
                <h2 className="text-xl font-extrabold text-zinc-900 tracking-tight">
                  Active Shared Tabs
                </h2>
                <p className="text-[13px] text-zinc-500 font-medium">
                  Collaborative group pools with synchronized settlement
                </p>
              </div>
              <a className="inline-flex items-center gap-1 text-[13px] font-bold text-emerald-700 hover:text-emerald-800 transition-colors" href="#">
                <span>View all 6 spaces</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white rounded-3xl p-6 border border-[#EFECE6] shadow-sm flex flex-col justify-between hover:shadow-md hover:border-emerald-200 transition-all group">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                      🌴
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-mono font-bold text-xs border border-emerald-200">
                      + ₹241.50
                    </span>
                  </div>
                  <h3 className="font-extrabold text-[17px] text-zinc-900 group-hover:text-emerald-700 transition-colors">
                    Goa Beach Trip 2025
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1">4 travel buddies • Oct 14–22</p>
                  <div className="mt-4 p-4 rounded-2xl bg-[#FAF8F5] border border-[#EFECE6]">
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="text-zinc-500 font-medium">Settled Ratio</span>
                      <span className="font-mono font-bold text-zinc-800">92%</span>
                    </div>
                    <div className="w-full bg-zinc-200/70 rounded-full h-2 overflow-hidden">
                      <div className="bg-emerald-500 h-2 rounded-full w-[92%]" />
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-zinc-400 mt-2 font-mono">
                      <span>Pool: ₹1,840.00</span>
                      <span className="text-emerald-700 font-bold">₹148 open</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between">
                  <div className="flex -space-x-2 items-center">
                    <img alt="Priya" className="w-7 h-7 rounded-full border-2 border-white object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqwYPcROfR5-TXCBDtxQHPPn7Y00TamIr6bkfmyp7arJc5u3RCo6SOoSP96Jn6ABfApaOEaHrQByxEXhGbdoQQNu3KDs9iqN2dyADSug95BqdoRtB2mNtsIzCmt8hREaPOtCRBW2IhyY77jVPqsLmj6BRw7g_cRGzsLmg-89ZiJdKi_WNLq0WFE360E1p_Jl4A4KZDRhCU5gD1GjRXhUT4VGvizGG3gvP2B5wVRJ8" />
                    <img alt="Rahul" className="w-7 h-7 rounded-full border-2 border-white object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtWb9_4JtaLMOszPUMT1aEMKP5HK_Q1-q6j9PzurVQubgV-MPjohj0fC5O0mnA_9uqCqiYwpeWr1LJXxAoZtxqvSyz1r1QVDOIZjOD1_M92xNypwjz7xc75_jaK0DQDUcNqhTtGbNjVnfjlwdK7BSLw7C-WGnU0B4IktXkWkRrP9GdQhdhvdrhN4ZpKqLuuAIgh83A05iexvMjJyvrlVsMzG-15x96O4T-i0gvqnY" />
                    <div className="w-7 h-7 rounded-full border-2 border-white bg-indigo-100 text-indigo-800 text-[10px] font-bold font-mono flex items-center justify-center">
                      +2
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl">
                    You're owed
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-[#EFECE6] shadow-sm flex flex-col justify-between hover:shadow-md hover:border-amber-200 transition-all group">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                      🏠
                    </div>
                    <span className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 font-mono font-bold text-xs border border-zinc-200/70">
                      Settled ₹0.00
                    </span>
                  </div>
                  <h3 className="font-extrabold text-[17px] text-zinc-900 group-hover:text-emerald-700 transition-colors">
                    Mumbai Flat 4B
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1">3 roommates • Monthly shared utilities</p>
                  <div className="mt-4 p-4 rounded-2xl bg-[#FAF8F5] border border-[#EFECE6]">
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="text-zinc-500 font-medium">Settled Ratio</span>
                      <span className="font-mono font-bold text-zinc-800">100%</span>
                    </div>
                    <div className="w-full bg-zinc-200/70 rounded-full h-2 overflow-hidden">
                      <div className="bg-zinc-700 h-2 rounded-full w-full" />
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-zinc-400 mt-2 font-mono">
                      <span>Pool: ₹3,420.00</span>
                      <span className="text-zinc-600 font-bold">All clear</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between">
                  <div className="flex -space-x-2 items-center">
                    <div className="w-7 h-7 rounded-full border-2 border-white bg-emerald-100 text-emerald-800 text-[10px] font-bold font-mono flex items-center justify-center">
                      JD
                    </div>
                    <div className="w-7 h-7 rounded-full border-2 border-white bg-zinc-200 text-zinc-800 text-[10px] font-bold font-mono flex items-center justify-center">
                      SL
                    </div>
                    <div className="w-7 h-7 rounded-full border-2 border-white bg-indigo-100 text-indigo-800 text-[10px] font-bold font-mono flex items-center justify-center">
                      ME
                    </div>
                  </div>
                  <span className="text-xs font-bold text-zinc-600 bg-zinc-100 px-2.5 py-1 rounded-xl">
                    All square ✌️
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-[#EFECE6] shadow-sm flex flex-col justify-between hover:shadow-md hover:border-rose-200 transition-all group">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                      🗾
                    </div>
                    <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-900 font-mono font-bold text-xs border border-rose-200">
                      - ₹68.00
                    </span>
                  </div>
                  <h3 className="font-extrabold text-[17px] text-zinc-900 group-hover:text-emerald-700 transition-colors">
                    Delhi Weekend Tour
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1">8 friends • Shinkansen &amp; izakaya pool</p>
                  <div className="mt-4 p-4 rounded-2xl bg-[#FAF8F5] border border-[#EFECE6]">
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="text-zinc-500 font-medium">Settled Ratio</span>
                      <span className="font-mono font-bold text-zinc-800">68%</span>
                    </div>
                    <div className="w-full bg-zinc-200/70 rounded-full h-2 overflow-hidden">
                      <div className="bg-rose-500 h-2 rounded-full w-[68%]" />
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-zinc-400 mt-2 font-mono">
                      <span>Pool: ₹544.00</span>
                      <span className="text-rose-700 font-bold">₹174 pending</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between">
                  <div className="flex -space-x-2 items-center">
                    <img alt="Vikram" className="w-7 h-7 rounded-full border-2 border-white object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAz9scSz__8rgDEmPB-vj-7V5IngekUkMOdETiRHg69SX_LHoxAnXCLfGjiEF1hZOtl7DRwFXhLVo7CV12YDa8yCiYM4pGmTOo5UEnZgCCSIuHh9TNH-QAkhJBLO5BwpFj2lp-sgIEx3BFr4BzRpyIvuLOnKuZpdjrn6oCJuBfQQwHyIv-hQAzT2Djk_AbRMGXMB9y6aNIobaAOWBh5ZHpWVbKC_1sXgUoIw67q-1k" />
                    <div className="w-7 h-7 rounded-full border-2 border-white bg-rose-100 text-rose-800 text-[10px] font-bold font-mono flex items-center justify-center">
                      +6
                    </div>
                  </div>
                  <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-xl">
                    Action Needed
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pb-6">
            <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-7 border border-[#EFECE6] shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-emerald-700 block">
                      Tabsy Graph Engine
                    </span>
                    <h3 className="text-lg font-extrabold text-zinc-900 tracking-tight">
                      Smart Debt Simplification
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-mono font-bold text-xs border border-emerald-200">
                    6 debts ➔ 2 transfers
                  </span>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Instead of passing cash back-and-forth across 6 participants,
                  Tabsy calculated the minimal cash flow graph to clear everyone's
                  ledger in 2 direct hops.
                </p>
                <div className="mt-6 p-5 rounded-3xl bg-[#FAF8F5] border border-[#EFECE6] space-y-4">
                  <div className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Calculated Route</span>
                    <span className="text-emerald-700">Zero Fees • Instant Settlement</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-[#EFECE6] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <div className="w-9 h-9 rounded-xl bg-zinc-900 text-white font-bold text-xs flex items-center justify-center font-mono">
                        YOU
                      </div>
                      <div>
                        <div className="font-bold text-xs text-zinc-900">Arjun Sharma</div>
                        <span className="text-[11px] text-zinc-500">Sender</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 text-rose-900 border border-rose-200/60 font-mono text-xs font-bold">
                      <span className="material-symbols-outlined text-[15px] text-rose-600">arrow_forward</span>
                      <span>₹165.20</span>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                      <div className="text-right">
                        <div className="font-bold text-xs text-zinc-900">Rahul Rossi</div>
                        <span className="text-[11px] text-zinc-500">Recipient</span>
                      </div>
                      <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-900 font-bold text-xs flex items-center justify-center font-mono">
                        MR
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-[#EFECE6] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <img alt="Priya" className="w-9 h-9 rounded-xl object-cover border border-zinc-100" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA15o5nefBV9PSweTfltWsXdR5pbxBsaNUVAGuJqNKMvdA5cSe2GUX4Q__ldIJ2J6yqxsHiWhfmLnsV88vHHLPnbJL0xQtN1yL7FFWKV94BkGadQLzUDXiUa_N-8DDsqKWg76TZHad-egkRACvOVbDPCfYQYDqlzGL_oSFXDcjiBRYO0Gccb1OCCyMr1lhDqs1I7QliUEOUhgni8pWgXPntMdjlsMF8JkFUvGHcpSI" />
                      <div>
                        <div className="font-bold text-xs text-zinc-900">Priya Martins</div>
                        <span className="text-[11px] text-zinc-500">Sender</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200/60 font-mono text-xs font-bold">
                      <span className="material-symbols-outlined text-[15px] text-emerald-600">arrow_forward</span>
                      <span>₹482.50</span>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                      <div className="text-right">
                        <div className="font-bold text-xs text-zinc-900">Arjun Sharma</div>
                        <span className="text-[11px] text-zinc-500">Recipient (You)</span>
                      </div>
                      <div className="w-9 h-9 rounded-xl bg-zinc-900 text-white font-bold text-xs flex items-center justify-center font-mono">
                        YOU
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between">
                <span className="text-xs text-zinc-500 font-medium">
                  Saves 4 unnecessary intermediate transfers
                </span>
                <button className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-sm">
                  Execute Graph Plan
                </button>
              </div>
            </div>

            <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-7 border border-[#EFECE6] shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-zinc-400 block">
                    Realtime Stream
                  </span>
                  <h3 className="text-lg font-extrabold text-zinc-900 tracking-tight">
                    Live Ledger Feed
                  </h3>
                </div>
                <div className="flex items-center gap-1 text-xs text-zinc-400 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live updates
                </div>
              </div>
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EFECE6] hover:bg-white transition-all flex items-start justify-between gap-3 group">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px]">restaurant</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[13.5px] text-zinc-900 group-hover:text-emerald-700 transition-colors">
                          Pastéis de Belém
                        </span>
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-mono font-bold border border-emerald-200/50">
                          <span className="material-symbols-outlined text-[11px]">verified</span> OCR Verified
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 mt-0.5">Paid by you • Split 4 ways (Lisbon Tab)</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] font-mono text-zinc-400">11:42 AM</span>
                        <span className="text-zinc-300">•</span>
                        <button className="text-[11px] font-bold text-emerald-700 hover:underline inline-flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[13px]">receipt</span> View receipt PDF
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-extrabold font-mono text-emerald-700 block">+₹18.40</span>
                    <span className="text-[10px] font-mono text-zinc-400">Total ₹73.60</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EFECE6] hover:bg-white transition-all flex items-start justify-between gap-3 group">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px]">wifi</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[13.5px] text-zinc-900">Fiber Gigabit Restock</span>
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-zinc-100 text-zinc-700 text-[10px] font-mono font-bold">
                          Automated
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 mt-0.5">Rahul paid • You owe ₹0.00 (Brooklyn 4B)</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] font-mono text-zinc-400">Yesterday</span>
                        <span className="text-zinc-300">•</span>
                        <span className="text-[11px] text-zinc-500 font-medium">Auto-deducted from pool</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-extrabold font-mono text-zinc-600 block">₹0.00</span>
                    <span className="text-[10px] font-mono text-zinc-400">Settled</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EFECE6] hover:bg-white transition-all flex items-start justify-between gap-3 group">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px]">train</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[13.5px] text-zinc-900">Tokyo Shinkansen Nozomi</span>
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-rose-50 text-rose-800 text-[10px] font-mono font-bold border border-rose-200/50">
                          Pending
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 mt-0.5">Vikram paid • Equal share (Tokyo Tab)</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] font-mono text-zinc-400">2 days ago</span>
                        <span className="text-zinc-300">•</span>
                        <button className="text-[11px] font-bold text-rose-700 hover:underline">
                          1-tap settle
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-extrabold font-mono text-rose-600 block">-₹68.00</span>
                    <span className="text-[10px] font-mono text-zinc-400">Your Share</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EFECE6] hover:bg-white transition-all flex items-start justify-between gap-3 group">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[13.5px] text-zinc-900">Trader Joe's Essentials</span>
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-mono font-bold border border-emerald-200/50">
                          <span className="material-symbols-outlined text-[11px]">verified</span> Scanned
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 mt-0.5">Paid by you • Roommates split 3-ways</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] font-mono text-zinc-400">3 days ago</span>
                        <span className="text-zinc-300">•</span>
                        <span className="text-[11px] text-zinc-500 font-medium">All approved</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-extrabold font-mono text-emerald-700 block">+₹42.10</span>
                    <span className="text-[10px] font-mono text-zinc-400">Owed to you</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-zinc-100 text-center">
                <button className="text-xs font-bold text-zinc-600 hover:text-zinc-900 py-1 transition-colors">
                  Load full ledger archive (64 items)
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
