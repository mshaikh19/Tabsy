import { useState } from "react";
import { Link } from "react-router-dom";

export default function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="bg-[#FAF8F5] text-zinc-900 font-sans antialiased min-h-screen p-3 md:p-5 lg:p-6 selection:bg-emerald-100 selection:text-emerald-900">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={`fixed top-0 left-0 lg:top-3 lg:left-3 h-full lg:h-[calc(100vh-1.5rem)] w-72 bg-[#18181B] text-zinc-300 rounded-r-3xl lg:rounded-3xl p-5 flex flex-col justify-between shrink-0 shadow-xl shadow-zinc-900/5 border border-zinc-800/80 z-50 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
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
          </div>

          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-zinc-400 text-[18px]">search</span>
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
            <Link className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-zinc-400 hover:text-white hover:bg-zinc-800/40 text-[13.5px] font-medium transition-all" to="/dashboard">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px]">space_dashboard</span>
                <span>Overview</span>
              </div>
            </Link>
            <Link className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-zinc-400 hover:text-white hover:bg-zinc-800/40 text-[13.5px] font-medium transition-all" to="/activity">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px]">notifications_active</span>
                <span>Activity</span>
              </div>
            </Link>
            <Link className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-zinc-400 hover:text-white hover:bg-zinc-800/40 text-[13.5px] font-medium transition-all" to="/balances">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
                <span>Balances</span>
              </div>
            </Link>
            <Link className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-zinc-400 hover:text-white hover:bg-zinc-800/40 text-[13.5px] font-medium transition-all" to="/quick-actions">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                <span>Quick Actions</span>
              </div>
            </Link>
          </div>
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
          <Link className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-zinc-300 hover:text-white hover:bg-zinc-800/50 text-[13px] transition-all group" to="/dashboard">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
              <span className="truncate font-medium">Goa Beach Trip</span>
            </div>
            <span className="text-sm">🌴</span>
          </Link>
          <Link className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-zinc-300 hover:text-white hover:bg-zinc-800/50 text-[13px] transition-all group" to="/dashboard">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-300 shrink-0" />
              <span className="truncate font-medium">Mumbai Flat 4B</span>
            </div>
            <span className="text-sm">🏠</span>
          </Link>
          <Link className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-zinc-300 hover:text-white hover:bg-zinc-800/50 text-[13px] transition-all group" to="/dashboard">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400 shrink-0" />
              <span className="truncate font-medium">Delhi Weekend Tour</span>
            </div>
            <span className="text-sm">🗾</span>
          </Link>
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

      <div className="lg:ml-[19.5rem]">
        <div className="lg:hidden flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="w-10 h-10 rounded-2xl bg-white border border-[#EFECE6] flex items-center justify-center text-zinc-700 shadow-sm"
          >
            <span className="material-symbols-outlined text-[22px]">menu</span>
          </button>
          <span className="font-extrabold text-[#18181B] text-lg">tabsy</span>
        </div>
        {children}
      </div>
    </div>
  );
}