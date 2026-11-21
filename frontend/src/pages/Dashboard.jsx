import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import { dashboardService } from "../services";
import { useAuth } from "../context/AuthContext";

const formatMoney = (amount, currency = "INR") => {
  const major = (amount || 0) / 100;
  try {
    return major.toLocaleString("en-IN", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  } catch {
    return `${currency} ${major.toFixed(2)}`;
  }
};

export default function Dashboard() {
  const { user } = useAuth();
  const [overview, setOverview] = useState(null);
  const [tabs, setTabs] = useState([]);
  const [plan, setPlan] = useState({ transfers: [] });
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [ov, tb, gp, lf] = await Promise.all([
          dashboardService.overview(),
          dashboardService.tabs(),
          dashboardService.graphPlan(),
          dashboardService.liveFeed(),
        ]);
        if (!active) return;
        setOverview(ov);
        setTabs(tb);
        setPlan(gp);
        setFeed(lf);
      } catch (err) {
        if (active) setError(err?.response?.data?.error?.message || "Failed to load dashboard");
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const firstName = user?.name ? user.name.split(" ")[0] : "there";
  const currency = tabs[0]?.currency || overview?.currency || "INR";

  return (
    <AppLayout>
      <main className="flex-1 flex flex-col gap-6 min-w-0">
        <header className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EFECE6] shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 text-label-caps font-mono font-bold tracking-tight">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                SYNC ACTIVE
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
              Good to see you, {firstName} 🥑
            </h1>
            <p className="text-[13.5px] text-zinc-500 mt-0.5 font-medium">
              {overview ? `${overview.groupsCount || 0} tabs active • ${overview.pendingNotifications || 0} unread updates` : "Loading your overview…"}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center p-1 rounded-2xl bg-[#F4EFEA] border border-[#EFECE6] text-xs font-bold px-3 py-1.5">
              {currency}
            </span>
            <Link
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-zinc-900 text-white font-semibold text-body-sm hover:bg-zinc-800 transition-all shadow-sm active:scale-95"
              to="/group-expenses/add"
            >
              <span className="material-symbols-outlined text-[18px] text-emerald-400">add</span>
              <span>Log Expense</span>
            </Link>
            <Link
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-100 text-emerald-900 border border-emerald-200/70 font-semibold text-body-sm hover:bg-emerald-200/70 transition-all shadow-sm active:scale-95"
              to="/balances"
            >
              <span className="material-symbols-outlined text-[18px]">bolt</span>
              <span>Settle Up</span>
            </Link>
            <Link
              className="w-10 h-10 rounded-2xl bg-white border border-[#EFECE6] flex items-center justify-center text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition-all shadow-sm relative"
              to="/notifications"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              {(overview?.pendingNotifications || 0) > 0 && (
                <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-rose-500" />
              )}
            </Link>
          </div>
        </header>

        {error && (
          <div className="px-4 py-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">{error}</div>
        )}

        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
          <div className="bg-white rounded-3xl p-6 border border-[#EFECE6] shadow-sm flex flex-col justify-between hover:border-emerald-200 transition-all">
            <div className="flex items-start justify-between">
              <span className="text-label-caps font-mono uppercase tracking-wider font-bold text-zinc-500">Net Position</span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-label-caps font-bold border border-emerald-200/50">
                {overview && overview.netPosition >= 0 ? "Surplus" : "Deficit"}
              </span>
            </div>
            <div className="my-4">
              <div className={`text-3xl font-extrabold tracking-tight font-mono ${overview && overview.netPosition >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                {overview && overview.netPosition > 0 ? "+" : ""}{formatMoney(overview?.netPosition || 0, currency)}
              </div>
              <p className="text-[12px] text-zinc-500 mt-1 flex items-center gap-1.5 font-medium">
                <span className="material-symbols-outlined text-body-md text-emerald-600">auto_graph</span>
                Optimized by Tabsy Graph
              </p>
            </div>
            <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-[11.5px] text-zinc-500">
              <span>Overall Ledger status</span>
              <span className="font-bold text-zinc-800">{overview && overview.netPosition >= 0 ? "Healthy ✨" : "Review"}</span>
            </div>
          </div>

          <div className="bg-pastel-rose rounded-3xl p-6 border border-[#FCD6D3] shadow-sm flex flex-col justify-between hover:border-rose-300 transition-all">
            <div className="flex items-start justify-between">
              <span className="text-label-caps font-mono uppercase tracking-wider font-bold text-rose-800">You Owe</span>
              <div className="w-7 h-7 rounded-xl bg-white/80 flex items-center justify-center text-rose-600">
                <span className="material-symbols-outlined text-[17px]">arrow_outward</span>
              </div>
            </div>
            <div className="my-4">
              <div className="text-3xl font-extrabold text-rose-950 tracking-tight font-mono">{formatMoney(overview?.youOwe || 0, currency)}</div>
              <p className="text-[12px] text-rose-800/80 mt-1 font-medium">Across your active groups</p>
            </div>
            <Link to="/balances" className="w-full py-2.5 px-3 rounded-2xl bg-white text-rose-900 font-bold text-[12.5px] border border-rose-200/70 hover:bg-rose-50 transition-all shadow-sm flex items-center justify-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">credit_card</span>
              <span>Settle Up</span>
            </Link>
          </div>

          <div className="bg-pastel-mint rounded-3xl p-6 border border-[#CDEEDC] shadow-sm flex flex-col justify-between hover:border-emerald-300 transition-all">
            <div className="flex items-start justify-between">
              <span className="text-label-caps font-mono uppercase tracking-wider font-bold text-emerald-800">Owed to You</span>
              <div className="w-7 h-7 rounded-xl bg-white/80 flex items-center justify-center text-emerald-700">
                <span className="material-symbols-outlined text-[17px]">south_west</span>
              </div>
            </div>
            <div className="my-4">
              <div className="text-3xl font-extrabold text-emerald-950 tracking-tight font-mono">{formatMoney(overview?.owedToYou || 0, currency)}</div>
              <p className="text-[12px] text-emerald-800/80 mt-1 font-medium">From your friends across groups</p>
            </div>
            <Link to="/balances" className="w-full py-2.5 px-3 rounded-2xl bg-white text-emerald-900 font-bold text-[12.5px] border border-emerald-200/70 hover:bg-emerald-50 transition-all shadow-sm flex items-center justify-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">touch_app</span>
              <span>View Receivables</span>
            </Link>
          </div>

          <div className="bg-pastel-butter rounded-3xl p-6 border border-[#FBEEC0] shadow-sm flex flex-col justify-between hover:border-amber-300 transition-all">
            <div className="flex items-start justify-between">
              <span className="text-label-caps font-mono uppercase tracking-wider font-bold text-amber-900">Active Pool Spend</span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/80 text-amber-900 font-mono font-bold text-label-caps border border-amber-200/60">
                {tabs.length} Groups
              </span>
            </div>
            <div className="my-4">
              <div className="text-3xl font-extrabold text-amber-950 tracking-tight font-mono">{formatMoney(overview?.activePoolSpend || 0, currency)}</div>
              <p className="text-[12px] text-amber-900/80 mt-1 font-medium">Across all shared tabs</p>
            </div>
            <div className="pt-2 flex items-center justify-between text-[11.5px] text-amber-900/80 font-medium">
              <span>Total pool spend</span>
              <Link className="font-bold text-amber-950 hover:underline" to="/groups">View groups</Link>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div>
              <h2 className="text-xl font-extrabold text-zinc-900 tracking-tight">Active Shared Tabs</h2>
              <p className="text-body-sm text-zinc-500 font-medium">Collaborative group pools with synchronized settlement</p>
            </div>
            <Link className="inline-flex items-center gap-1 text-body-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors" to="/groups">
              <span>View all groups</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12 text-zinc-500">Loading…</div>
          ) : tabs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-[#EFECE6]">
              <span className="material-symbols-outlined text-4xl text-slate-300">folder_open</span>
              <p className="mt-2 text-zinc-700 font-semibold">No groups yet</p>
              <Link to="/create-group" className="inline-block mt-3 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold">Create Group</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {tabs.slice(0, 3).map((t) => (
                <div key={t.id} className="bg-white rounded-3xl p-6 border border-[#EFECE6] shadow-sm flex flex-col justify-between hover:shadow-md hover:border-emerald-200 transition-all group">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                        {t.icon || "🧾"}
                      </div>
                      <span className={`px-3 py-1 rounded-full font-mono font-bold text-xs border ${t.netPosition > 0 ? "bg-emerald-100 text-emerald-900 border-emerald-200" : t.netPosition < 0 ? "bg-rose-100 text-rose-900 border-rose-200" : "bg-zinc-100 text-zinc-700 border-zinc-200/70"}`}>
                        {t.netPosition > 0 ? "+" : ""}{formatMoney(t.netPosition, t.currency)}
                      </span>
                    </div>
                    <Link to="/group-details" state={{ groupId: t.id }}>
                      <h3 className="font-extrabold text-[17px] text-zinc-900 group-hover:text-emerald-700 transition-colors">{t.name}</h3>
                    </Link>
                    <p className="text-xs text-zinc-500 mt-1">{t.memberCount} members • {t.category || "Group"}</p>
                    <div className="mt-4 p-4 rounded-2xl bg-[#FAF8F5] border border-[#EFECE6]">
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <span className="text-zinc-500 font-medium">Pool Total</span>
                        <span className="font-mono font-bold text-zinc-800">{formatMoney(t.poolTotal, t.currency)}</span>
                      </div>
                      <div className="flex justify-between items-center text-label-caps text-zinc-400 mt-2 font-mono">
                        <span>Your share</span>
                        <span className="font-bold text-zinc-700">{formatMoney(t.myShare, t.currency)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between">
                    <div className="flex -space-x-2 items-center">
                      {(t.members || []).slice(0, 3).map((m) => (
                        <div key={m.id} className="w-7 h-7 rounded-full border-2 border-white bg-indigo-100 text-indigo-800 text-label-caps font-bold font-mono flex items-center justify-center">
                          {m.avatarEmoji || (m.name ? m.name.slice(0, 2).toUpperCase() : "?")}
                        </div>
                      ))}
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-xl ${t.netPosition > 0 ? "text-emerald-700 bg-emerald-50" : t.netPosition < 0 ? "text-rose-700 bg-rose-50" : "text-zinc-600 bg-zinc-100"}`}>
                      {t.netPosition > 0 ? "You're owed" : t.netPosition < 0 ? "You owe" : "All square"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pb-6">
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-7 border border-[#EFECE6] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-label-caps font-mono uppercase tracking-wider font-bold text-emerald-700 block">Tabsy Graph Engine</span>
                  <h3 className="text-lg font-extrabold text-zinc-900 tracking-tight">Smart Debt Simplification</h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-mono font-bold text-xs border border-emerald-200">
                  {plan?.transfers?.length || 0} transfers
                </span>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Instead of passing cash back-and-forth across participants, Tabsy calculates the minimal cash flow graph to clear everyone's ledger.
              </p>
              <div className="mt-6 p-5 rounded-3xl bg-[#FAF8F5] border border-[#EFECE6] space-y-4">
                {(plan?.transfers || []).length === 0 ? (
                  <p className="text-sm text-zinc-500">No outstanding settlements. You're all square!</p>
                ) : (
                  plan.transfers.slice(0, 4).map((t, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white border border-[#EFECE6] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="w-9 h-9 rounded-xl bg-zinc-900 text-white font-bold text-xs flex items-center justify-center font-mono">
                          {(t.from?.name || "?").slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-xs text-zinc-900">{t.from?.name || "Member"}</div>
                          <span className="text-label-caps text-zinc-500">Sender</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 text-rose-900 border border-rose-200/60 font-mono text-xs font-bold">
                        <span className="material-symbols-outlined text-body-md text-rose-600">arrow_forward</span>
                        <span>{formatMoney(t.amount, t.currency)}</span>
                      </div>
                      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                        <div className="text-right">
                          <div className="font-bold text-xs text-zinc-900">{t.to?.name || "Member"}</div>
                          <span className="text-label-caps text-zinc-500">Recipient</span>
                        </div>
                        <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-900 font-bold text-xs flex items-center justify-center font-mono">
                          {(t.to?.name || "?").slice(0, 2).toUpperCase()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between">
              <span className="text-xs text-zinc-500 font-medium">Minimal transfers to settle all balances</span>
              <Link className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-sm" to="/balances">Open Balances</Link>
            </div>
          </div>

          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-7 border border-[#EFECE6] shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <span className="text-label-caps font-mono uppercase tracking-wider font-bold text-zinc-400 block">Realtime Stream</span>
                <h3 className="text-lg font-extrabold text-zinc-900 tracking-tight">Live Ledger Feed</h3>
              </div>
              <div className="flex items-center gap-1 text-xs text-zinc-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live updates
              </div>
            </div>
            <div className="space-y-3">
              {feed.length === 0 ? (
                <p className="text-sm text-zinc-500">No activity yet.</p>
              ) : (
                feed.slice(0, 4).map((f) => (
                  <div key={f.id} className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EFECE6] hover:bg-white transition-all flex items-start justify-between gap-3 group">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                      </div>
                      <div>
                        <span className="font-bold text-[13.5px] text-zinc-900 group-hover:text-emerald-700 transition-colors">{f.title}</span>
                        <p className="text-xs text-zinc-500 mt-0.5">{f.paidBy} • {f.group}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-label-caps font-mono text-zinc-400">
                            {f.createdAt ? new Date(f.createdAt).toLocaleDateString() : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`text-sm font-extrabold font-mono block ${f.impact > 0 ? "text-emerald-700" : f.impact < 0 ? "text-rose-600" : "text-zinc-600"}`}>
                        {f.impact > 0 ? "+" : ""}{formatMoney(f.impact, currency)}
                      </span>
                      <span className="text-label-caps font-mono text-zinc-400">{f.impactLabel}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-100 text-center">
              <Link className="text-xs font-bold text-zinc-600 hover:text-zinc-900 py-1 transition-colors" to="/activity">View full activity</Link>
            </div>
          </div>
        </section>
      </main>
    </AppLayout>
  );
}