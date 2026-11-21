import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import { groupService } from "../services";
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

export default function Groups() {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("recent");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await groupService.list();
      setGroups(data);
    } catch (err) {
      setError(err?.response?.data?.error?.message || "Failed to load groups");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const categories = Array.from(new Set(groups.map((g) => g.category).filter(Boolean)));

  const filtered = groups
    .filter((g) => (filter === "all" ? true : g.category === filter))
    .filter((g) => {
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        (g.name || "").toLowerCase().includes(q) ||
        (g.category || "").toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sort === "alphabetical") return (a.name || "").localeCompare(b.name || "");
      if (sort === "net") return (b.myNet || 0) - (a.myNet || 0);
      return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
    });

  const activeCount = groups.length;
  const totalCirculating = groups.reduce((s, g) => s + (g.totalSpend || 0), 0);
  const netBalance = groups.reduce((s, g) => s + (g.myNet || 0), 0);

  return (
    <AppLayout>
      <main className="w-full pt-4 bg-background min-h-screen">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-lowest p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-label-caps font-semibold tracking-wide uppercase mb-1 border border-emerald-100">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Split-Rail Financial Command</span>
              </div>
              <h1 className="font-headline-lg text-2xl lg:text-3xl font-bold text-on-surface tracking-tight">
                Group Tabs &amp; Ledgers
              </h1>
              <p className="font-body-md text-sm text-on-surface-variant mt-0.5">
                Welcome back{user?.name ? `, ${user.name}` : ""}. Collaborative expense pools, room shares, and shared vacations.
              </p>
            </div>
            <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
              <Link
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-title-md text-xs sm:text-sm font-semibold border border-slate-200 transition-colors"
                to="/groups"
                onClick={(e) => {
                  e.preventDefault();
                  const code = window.prompt("Enter invite code");
                  if (code) {
                    groupService
                      .joinByCode(code.trim())
                      .then(() => load())
                      .catch((err) => setError(err?.response?.data?.error?.message || "Invalid invite"));
                  }
                }}
              >
                <span className="material-symbols-outlined text-[18px] text-secondary">qr_code_scanner</span>
                <span>Join via Code</span>
              </Link>
              <Link
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-title-md text-xs sm:text-sm font-semibold shadow-sm transition-all active:scale-[0.98]"
                to="/create-group"
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                <span>Create Group</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="flex items-center justify-between p-4 rounded-xl bg-surface-container-lowest border border-slate-200/70 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-100">
                  <span className="material-symbols-outlined text-[20px]">folder_shared</span>
                </div>
                <div>
                  <div className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Active Ledgers</div>
                  <div className="font-headline-sm text-lg font-bold text-on-surface">{activeCount} Active Tabs</div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-surface-container-lowest border border-slate-200/70 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
                  <span className="material-symbols-outlined text-[20px]">currency_exchange</span>
                </div>
                <div>
                  <div className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Total Circulating</div>
                  <div className="font-headline-sm text-lg font-bold text-on-surface">{formatMoney(totalCirculating, groups[0]?.currency || "INR")}</div>
                </div>
              </div>
              <span className="text-label-caps font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">All Time</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
                </div>
                <div>
                  <div className="font-label-caps text-label-caps text-emerald-800 uppercase tracking-wider font-semibold">Net Balance</div>
                  <div className="font-headline-sm text-lg font-bold text-emerald-700">{netBalance >= 0 ? "+" : ""}{formatMoney(Math.abs(netBalance), groups[0]?.currency || "INR")}</div>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">{error}</div>
          )}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface-container-lowest p-2.5 rounded-xl border border-slate-200/80">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <button
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filter === "all" ? "bg-on-surface text-surface shadow-xs" : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"}`}
                onClick={() => setFilter("all")}
              >
                All Groups ({groups.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`px-3.5 py-1.5 rounded-lg text-xs transition-colors ${filter === cat ? "bg-on-surface text-surface shadow-xs" : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"}`}
                  onClick={() => setFilter(cat)}
                >
                  {cat} ({groups.filter((g) => g.category === cat).length})
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-56">
                <span className="material-symbols-outlined absolute left-2.5 top-2 text-[16px] text-slate-400">search</span>
                <input
                  className="w-full pl-8 pr-3 py-1.5 text-xs font-body-md rounded-lg bg-surface-container-low border border-slate-200/80 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-on-surface placeholder:text-slate-400"
                  placeholder="Filter tabs or members..."
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <div className="relative">
                <select
                  className="appearance-none bg-surface-container-low text-on-surface text-xs font-semibold pl-2.5 pr-6 py-1.5 rounded-lg border border-slate-200/80 focus:outline-none cursor-pointer"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="recent">Recent Activity</option>
                  <option value="net">Net Position</option>
                  <option value="alphabetical">Alphabetical</option>
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-1.5 top-1.5 text-[16px] text-slate-400">arrow_drop_down</span>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16 text-on-surface-variant">Loading your groups…</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 bg-surface-container-lowest rounded-2xl border border-slate-200/80">
              <span className="material-symbols-outlined text-4xl text-slate-300">folder_open</span>
              <p className="mt-2 text-on-surface font-semibold">No groups yet</p>
              <p className="text-sm text-on-surface-variant">Create your first group to start splitting expenses.</p>
              <Link to="/create-group" className="inline-block mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold">Create Group</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filtered.map((g) => (
                <div key={g._id} className="bg-surface-container-lowest rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden">
                  <div>
                    <div className="px-5 py-3 flex items-center justify-between border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white text-xs font-bold border border-slate-200">
                          {g.icon || "🧾"} {g.category || "Other"}
                        </span>
                        <span className="text-label-caps font-medium text-slate-600/80">
                          {g.startDate ? new Date(g.startDate).toLocaleDateString() : ""}
                        </span>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-label-caps font-bold border ${g.myNet > 0 ? "bg-emerald-50 text-emerald-700 border-emerald-200" : g.myNet < 0 ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-slate-100 text-slate-600 border-slate-200"}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {g.myNet > 0 ? "You're owed" : g.myNet < 0 ? "You owe" : "Settled"}
                      </span>
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div>
                          <Link to="/group-details" state={{ groupId: g._id }}>
                            <h2 className="font-headline-sm text-lg font-bold text-on-surface hover:text-emerald-700 transition-colors flex items-center gap-1.5">
                              {g.name}
                            </h2>
                          </Link>
                          <p className="text-xs text-on-surface-variant mt-0.5">{g.description || "No description"}</p>
                        </div>
                        <div className="flex -space-x-2 shrink-0">
                          {(g.members || []).slice(0, 4).map((m) => (
                            <div key={m.id} className="w-7 h-7 rounded-full bg-slate-200 text-slate-800 font-bold text-label-caps flex items-center justify-center ring-2 ring-white">
                              {m.avatarEmoji || (m.name ? m.name.slice(0, 2).toUpperCase() : "?")}
                            </div>
                          ))}
                          {(g.memberCount || 0) > 4 && (
                            <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-800 font-bold text-label-caps flex items-center justify-center ring-2 ring-white">
                              +{g.memberCount - 4}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200/70 mb-4">
                        <div>
                          <span className="font-label-caps text-label-caps text-slate-500 uppercase tracking-wider block">Total Spend</span>
                          <div className="font-title-md text-sm font-bold text-slate-900 mt-0.5">{formatMoney(g.totalSpend, g.currency)}</div>
                        </div>
                        <div className="border-l border-slate-200 pl-2.5">
                          <span className="font-label-caps text-label-caps text-slate-500 uppercase tracking-wider block">Your Share</span>
                          <div className="font-title-md text-sm font-bold text-slate-900 mt-0.5">{formatMoney(g.myShare, g.currency)}</div>
                        </div>
                        <div className="border-l border-slate-200 pl-2.5">
                          <span className="font-label-caps text-label-caps text-slate-500 uppercase tracking-wider block">Net Position</span>
                          <div className={`font-title-md text-sm font-bold mt-0.5 ${g.myNet > 0 ? "text-emerald-600" : g.myNet < 0 ? "text-rose-600" : "text-slate-500"}`}>
                            {g.myNet > 0 ? "+" : ""}{formatMoney(g.myNet, g.currency)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="px-5 pb-5 pt-0 flex items-center justify-between gap-2 border-t border-slate-100 pt-3.5">
                    <Link
                      className="px-3.5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-title-md text-xs font-semibold transition-colors"
                      to="/group-expenses"
                      state={{ groupId: g._id }}
                    >
                      View Ledger
                    </Link>
                    <Link
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-title-md text-xs font-semibold transition-colors"
                      to="/group-expenses/add"
                      state={{ groupId: g._id }}
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span>
                      <span>Add Expense</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </AppLayout>
  );
}