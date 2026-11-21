import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import GroupHeader from "../components/layout/GroupHeader";
import { groupService, balanceService } from "../services";

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

const getCategoryIcon = (category) => {
  const icons = {
    lodging: "villa",
    mountain: "downhill_skiing",
    groceries: "local_grocery_store",
    transit: "directions_car",
    dining: "restaurant",
    activity: "sports_esports",
    default: "receipt_long",
  };
  return icons[category?.toLowerCase()] || icons.default;
};

export default function GroupMembers() {
  const location = useLocation();
  const navigate = useNavigate();
  const groupId = location.state?.groupId;

  const [members, setMembers] = useState([]);
  const [balances, setBalances] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toastOpen, setToastOpen] = useState(false);
  const [toastHeader, setToastHeader] = useState("Action dispatched");
  const [toastMessage, setToastMessage] = useState("Update successfully broadcast to ledger.");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortVal, setSortVal] = useState("default");
  const [activeFilter, setActiveFilter] = useState("all");
  const [nudgeStates, setNudgeStates] = useState({});

  useEffect(() => {
    if (!groupId) {
      navigate("/groups");
      return;
    }
    load();
  }, [groupId]);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [m, b] = await Promise.all([
        groupService.members(groupId),
        groupService.balances(groupId),
      ]);
      setMembers(m);
      setBalances(b);
    } catch (err) {
      setError(err?.response?.data?.error?.message || "Failed to load members");
    } finally {
      setLoading(false);
    }
  };

  const currency = balances?.currency || "INR";
  const myUserId = balances?.userId;
  const settlementPlan = balances?.plan || [];

  const visibleMembers = useMemo(() => {
    let list = members.filter((m) => {
      const q = searchQuery.toLowerCase().trim();
      const name = (m.name || "").toLowerCase();
      const email = (m.email || "").toLowerCase();
      const text = (name + " " + email).toLowerCase();
      const matchesQuery = !q || name.includes(q) || email.includes(q) || text.includes(q);

      const balance = balances?.members?.find((b) => b.user === m.user);
      const net = balance?.net || 0;

      let matchesCategory = true;
      if (activeFilter === "surplus") matchesCategory = net > 0;
      else if (activeFilter === "deficit") matchesCategory = net < 0;
      else if (activeFilter === "admin") matchesCategory = m.role === "admin";
      else if (activeFilter === "custom") matchesCategory = m.customExclusions && m.customExclusions.length > 0;

      return matchesQuery && matchesCategory;
    });

    if (sortVal === "surplus-high") list.sort((a, b) => {
      const na = balances?.members?.find((m) => m.user === a.user)?.net || 0;
      const nb = balances?.members?.find((m) => m.user === b.user)?.net || 0;
      return nb - na;
    });
    else if (sortVal === "owed-high") list.sort((a, b) => {
      const na = balances?.members?.find((m) => m.user === a.user)?.net || 0;
      const nb = balances?.members?.find((m) => m.user === b.user)?.net || 0;
      return na - nb;
    });
    else if (sortVal === "alpha") list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));

    // Put current user first
    list.sort((a, b) => (a.user === myUserId ? -1 : b.user === myUserId ? 1 : 0));

    return list;
  }, [members, searchQuery, sortVal, activeFilter, balances, myUserId]);

  const triggerToast = (header, msg) => {
    setToastHeader(header);
    setToastMessage(msg);
    setToastOpen(true);
    setTimeout(() => setToastOpen(false), 3200);
  };

  const copyInvite = () => {
    const url = `https://tabsy.me/join/${balances?.group?.inviteCode || "group"}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url);
    }
    triggerToast("Invite Link Copied", "Copied to clipboard. Share in GroupMe, Slack, or SMS.");
  };

  const badgeClasses = (variant) => {
    const base = "px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider";
    const map = {
      you: "bg-primary-container text-on-primary uppercase",
      admin: "bg-primary-container text-on-primary uppercase",
      member: "bg-surface-container-low text-on-surface-variant",
      custom: "bg-surface-container text-tertiary border border-tertiary-container/30",
    };
    return base + " " + (map[variant] || map.member);
  };

  const pillClasses = (key) => {
    const base = "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors";
    if (activeFilter === key) {
      return base + " bg-primary text-on-primary font-bold";
    }
    return base + " bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface";
  };

  // Calculate stats for settlement engine
  const surplusMembers = balances?.members?.filter((m) => m.net > 0) || [];
  const deficitMembers = balances?.members?.filter((m) => m.net < 0) || [];
  const totalSurplus = surplusMembers.reduce((sum, m) => sum + m.net, 0);
  const totalDeficit = Math.abs(deficitMembers.reduce((sum, m) => sum + m.net, 0));

  if (!groupId) return null;
  if (loading) {
    return (
      <AppLayout>
        <div className="bg-background font-body-md text-on-surface antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
          <main className="w-full pt-0 pb-24 bg-background min-h-screen">
            <div className="max-w-7xl w-full mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop flex flex-col gap-6">
              <GroupHeader
                title="Loading..."
                subtitle=""
                currentLabel="Group Members"
              />
              <div className="text-center py-16 text-on-surface-variant">Loading members&hellip;</div>
            </div>
          </main>
        </div>
      </AppLayout>
    );
  }
  if (error) {
    return (
      <AppLayout>
        <div className="bg-background font-body-md text-on-surface antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
          <main className="w-full pt-0 pb-24 bg-background min-h-screen">
            <div className="max-w-7xl w-full mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop flex flex-col gap-6">
              <GroupHeader
                title="Error"
                subtitle=""
                currentLabel="Group Members"
              />
              <div className="px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">{error}</div>
            </div>
          </main>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="bg-background font-body-md text-on-surface antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
        <main className="w-full pt-0 pb-24 bg-background min-h-screen">
          <div className="max-w-7xl w-full mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop flex flex-col gap-6">
            <GroupHeader
              title={balances?.group?.name || "Group Members"}
              subtitle={balances?.group?.description}
              currentLabel="Group Members"
              actions={
                <>
                  <Link className="group/btn relative inline-flex items-center gap-0 px-2.5 py-2 text-on-surface font-title-md text-title-md hover:bg-surface-container-lowest rounded-lg transition-all duration-300 ease-out overflow-hidden" to="/group-expenses" state={{ groupId }}>
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover/btn:text-primary transition-colors shrink-0">receipt_long</span>
                    <span className="max-w-0 group-hover/btn:max-w-[120px] group-hover/btn:ml-2 overflow-hidden whitespace-nowrap transition-all duration-300 ease-out opacity-0 group-hover/btn:opacity-100">
                      View Expenses
                    </span>
                  </Link>
                  <div className="w-px h-5 bg-outline-variant/40 shrink-0 transition-all duration-300 group-hover/actions:bg-transparent" />
                  <Link className="group/btn inline-flex items-center gap-0 px-2.5 py-2 bg-primary-container text-on-primary-container font-title-md text-title-md hover:opacity-95 rounded-lg transition-all duration-300 ease-out overflow-hidden" to="/group-balances" state={{ groupId }}>
                    <span className="material-symbols-outlined text-[18px] shrink-0">bolt</span>
                    <span className="max-w-0 group-hover/btn:max-w-[140px] group-hover/btn:ml-2 overflow-hidden whitespace-nowrap transition-all duration-300 ease-out opacity-0 group-hover/btn:opacity-100">
                      Settle Balances
                    </span>
                  </Link>
                  <div className="w-px h-5 bg-outline-variant/40 shrink-0 transition-all duration-300 group-hover/actions:bg-transparent" />
                  <Link className="group/btn inline-flex items-center gap-0 px-2.5 py-2 bg-primary-container text-on-primary-container font-title-md text-title-md hover:opacity-95 rounded-lg transition-all duration-300 ease-out overflow-hidden" to="/group-members/manage" state={{ groupId }}>
                    <span className="material-symbols-outlined text-[18px] shrink-0">tune</span>
                    <span className="max-w-0 group-hover/btn:max-w-[140px] group-hover/btn:ml-2 overflow-hidden whitespace-nowrap transition-all duration-300 ease-out opacity-0 group-hover/btn:opacity-100">
                      Manage Split
                    </span>
                  </Link>
                  <div className="w-px h-5 bg-outline-variant/40 shrink-0 transition-all duration-300 group-hover/actions:bg-transparent" />
                  <Link className="group/btn inline-flex items-center gap-0 px-2.5 py-2 text-on-surface font-title-md text-title-md hover:bg-surface-container-lowest rounded-lg transition-all duration-300 ease-out overflow-hidden" to="/group-members/add" state={{ groupId }}>
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover/btn:text-on-surface transition-colors shrink-0">group_add</span>
                    <span className="max-w-0 group-hover/btn:max-w-[120px] group-hover/btn:ml-2 overflow-hidden whitespace-nowrap transition-all duration-300 ease-out opacity-0 group-hover/btn:opacity-100">
                      Invite Friends
                    </span>
                  </Link>
                </>
              }
            />
            {/* 3. Split-Rail Command Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* LEFT RAIL (4 Columns on lg): Financial Balances & Settlement Matrix */}
              <div className="lg:col-span-4 flex flex-col gap-5">
                {/* Rail Section 1: Net Standing Breakdown */}
                <div className="bg-surface-container-lowest border border-surface-container-high rounded-2xl p-5 shadow-[0_2px_10px_rgba(19,27,46,0.02)] flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-surface-container-high text-secondary flex items-center justify-center">
                        <span className="material-symbols-outlined text-[16px]">scale</span>
                      </div>
                      <h2 className="font-bold text-sm text-on-surface">Net Standing Breakdown</h2>
                    </div>
                    <span className="text-[11px] font-semibold text-primary uppercase tracking-wider bg-primary-fixed/40 px-2 py-0.5 rounded-md">
                      {totalSurplus === totalDeficit ? "Balanced" : "Unbalanced"}
                    </span>
                  </div>
                  <div className="bg-surface-container-low p-3 rounded-xl border border-surface-container flex flex-col gap-2.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-on-surface-variant font-medium">Surplus Fronted ({surplusMembers.length} Members)</span>
                      <span className="font-bold text-primary">{formatMoney(totalSurplus, currency)}</span>
                    </div>
                    <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden flex">
                      {surplusMembers.map((m, idx) => (
                        <div key={m.user} className="bg-primary h-full rounded-full" style={{ width: totalSurplus > 0 ? `${(m.net / totalSurplus) * 100}%` : "0%" }}></div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center text-xs pt-1 border-t border-surface-container">
                      <span className="text-on-surface-variant font-medium">Deficit Absorbed ({deficitMembers.length} Members)</span>
                      <span className="font-bold text-tertiary">-{formatMoney(totalDeficit, currency)}</span>
                    </div>
                    <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden flex">
                      {deficitMembers.map((m, idx) => (
                        <div key={m.user} className={`h-full rounded-full ${idx === 0 ? "bg-tertiary" : idx === 1 ? "bg-tertiary-container" : idx === 2 ? "bg-tertiary-fixed-dim" : "bg-tertiary-fixed"}`} style={{ width: totalDeficit > 0 ? `${(Math.abs(m.net) / totalDeficit) * 100}%` : "0%" }}></div>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="p-2.5 rounded-xl bg-primary-fixed/25 border border-primary-fixed-dim/40 flex flex-col items-center">
                      <span className="text-[10px] uppercase font-bold text-primary tracking-wide">Net Surplus</span>
                      <span className="text-sm font-bold text-primary mt-0.5">{surplusMembers.length} Members</span>
                      <span className="text-[11px] text-on-surface-variant font-medium">{formatMoney(totalSurplus, currency)}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-error-container/30 border border-error-container/60 flex flex-col items-center">
                      <span className="text-[10px] uppercase font-bold text-tertiary tracking-wide">Net Debts</span>
                      <span className="text-sm font-bold text-tertiary mt-0.5">{deficitMembers.length} Unsettled</span>
                      <span className="text-[11px] text-on-surface-variant font-medium">{formatMoney(totalDeficit, currency)}</span>
                    </div>
                  </div>
                </div>

                {/* Rail Section 2: Interactive Bipartite Settlement Engine */}
                <div className="bg-surface-container-lowest border border-surface-container-high rounded-2xl p-5 shadow-[0_2px_10px_rgba(19,27,46,0.02)] flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
                        <span className="material-symbols-outlined text-[16px]">sync_alt</span>
                      </div>
                      <h2 className="font-bold text-sm text-on-surface">Bipartite Settlement Engine</h2>
                    </div>
                    <span className="text-[10px] font-bold bg-secondary-fixed text-on-secondary-fixed px-2 py-0.5 rounded-full">{settlementPlan.length} Steps</span>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Algorithmic debt compression resolves all balances with zero daisy chains:
                  </p>
                  <div className="flex flex-col gap-2" id="settlementFlowList">
                    {settlementPlan.length > 0 ? (
                      settlementPlan.map((transfer, idx) => (
                        <div key={idx} className="bg-surface-container-low hover:bg-surface-container transition-colors p-3 rounded-xl border border-surface-container flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-6 h-6 rounded-md bg-surface-container-highest text-on-surface text-[10px] font-bold flex items-center justify-center">{transfer.fromInitials}</div>
                            <span className="text-xs font-semibold text-on-surface">{transfer.from}</span>
                            <span className="material-symbols-outlined text-[15px] text-secondary">trending_flat</span>
                            <div className="w-6 h-6 rounded-md bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold flex items-center justify-center">{transfer.toInitials}</div>
                            <span className="text-xs font-semibold text-on-surface">{transfer.to}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-bold text-on-surface block">{formatMoney(transfer.amount, currency)}</span>
                            <span className="text-[10px] text-outline">{transfer.method}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="bg-surface-container-low p-3 rounded-xl border border-surface-container flex items-center justify-center text-xs text-on-surface-variant">
                        Everyone is settled up. No transfers needed.
                      </div>
                    )}
                  </div>
                </div>

                {/* Rail Section 3: Fast Settlement Dispatcher */}
                <div className="bg-surface-container-lowest border border-surface-container-high rounded-2xl p-5 shadow-[0_2px_10px_rgba(19,27,46,0.02)] flex flex-col gap-3.5">
                  <div className="flex items-center justify-between">
                    <h2 className="font-bold text-sm text-on-surface flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-secondary">bolt</span>
                      Fast Settlement Dispatcher
                    </h2>
                    <span className="text-[11px] text-outline font-medium">1-Click</span>
                  </div>
                  <p className="text-xs text-on-surface-variant">Broadcast instant payment hooks to all members with outstanding deficits:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="bg-surface-container-low hover:bg-surface-container-high text-on-surface border border-surface-container rounded-xl py-2 px-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors" id="dispatchVenmoBtn" type="button" onClick={() => triggerToast("Venmo Deep-Links Prepped", `Generated ${deficitMembers.length} QR deep-links for deficit members.`)} >
                      <span className="w-2 h-2 rounded-full bg-secondary"></span>
                      <span>Request via Venmo</span>
                    </button>
                    <button className="bg-surface-container-low hover:bg-surface-container-high text-on-surface border border-surface-container rounded-xl py-2 px-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors" id="dispatchApplePayBtn" type="button" onClick={() => triggerToast("Apple Cash Dispatcher", "Apple Pay payment requests sent via iMessage.")}>
                      <span className="material-symbols-outlined text-[15px]">credit_card</span>
                      <span>Apple Cash Link</span>
                    </button>
                  </div>
                  <button className="w-full bg-secondary-fixed hover:bg-secondary-fixed-dim text-on-secondary-fixed border border-secondary/20 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm" id="nudgeAllDispatcherBtn" type="button" onClick={() => {
                    const next = {};
                    deficitMembers.forEach((m) => { next[m.user] = true; });
                    setNudgeStates(next);
                    triggerToast("Batch Nudges Sent", `Push notification alerts dispatched to all ${deficitMembers.length} unsettled members.`);
                  }}>
                    <span className="material-symbols-outlined text-[16px]">forward_to_inbox</span>
                    <span>Send Nudge to {deficitMembers.length} Deficit Members</span>
                  </button>
                </div>

                {/* Rail Section 4: Permissions & Roles Toggle Box */}
                <div className="bg-surface-container-lowest border border-surface-container-high rounded-2xl p-5 shadow-[0_2px_10px_rgba(19,27,46,0.02)] flex flex-col gap-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-surface-container text-on-surface flex items-center justify-center">
                        <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
                      </div>
                      <h2 className="font-bold text-sm text-on-surface">Ledger Governance</h2>
                    </div>
                    <span className="text-[10px] text-primary font-bold bg-primary-fixed/30 px-2 py-0.5 rounded-md">{members.filter((m) => m.role === "admin").length} Admins</span>
                  </div>
                  <div className="flex flex-col gap-2.5 text-xs">
                    <label className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low cursor-pointer hover:bg-surface-container transition-colors">
                      <div className="flex flex-col">
                        <span className="font-semibold text-on-surface">Member Auto-Approve</span>
                        <span className="text-[10px] text-on-surface-variant">Allow participants to post receipts directly</span>
                      </div>
                      <input defaultChecked className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4" type="checkbox" />
                    </label>
                    <label className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low cursor-pointer hover:bg-surface-container transition-colors">
                      <div className="flex flex-col">
                        <span className="font-semibold text-on-surface">Freeze Ledger on Trip End</span>
                        <span className="text-[10px] text-on-surface-variant">Locks totals for final settlement</span>
                      </div>
                      <input className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4" type="checkbox" />
                    </label>
                    <label className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low cursor-pointer hover:bg-surface-container transition-colors">
                      <div className="flex flex-col">
<span className="font-semibold text-on-surface">Notify on Large Debts (&gt; ₹150)</span>                        <span className="text-[10px] text-on-surface-variant">Weekly digest reminders triggered</span>
                      </div>
                      <input defaultChecked className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4" type="checkbox" />
                    </label>
                  </div>
                </div>
              </div>

              {/* RIGHT RAIL (8 Columns on lg): Member Directory & Ledger Contribution Matrix */}
              <div className="lg:col-span-8 flex flex-col gap-5">
                {/* Matrix Controls */}
                <div className="bg-surface-container-lowest border border-surface-container-high rounded-2xl p-4 sm:p-5 shadow-[0_2px_10px_rgba(19,27,46,0.02)] flex flex-col gap-3">
                  <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                    <div className="flex items-center bg-surface-container-low px-3 py-2 rounded-xl border border-surface-container flex-1">
                      <span className="material-symbols-outlined text-[19px] mr-2 text-outline">search</span>
                      <input className="bg-transparent text-xs sm:text-sm text-on-surface placeholder:text-outline focus:outline-none w-full" id="matrixSearchInput" placeholder="Search members by name, role, email or debt level..." type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-on-surface-variant font-medium whitespace-nowrap">Sort by:</span>
                      <select className="bg-surface-container-low border border-surface-container text-xs text-on-surface font-semibold rounded-xl px-3 py-2 focus:ring-primary focus:border-primary" id="matrixSortSelect" value={sortVal} onChange={(e) => setSortVal(e.target.value)}>
                        <option value="default">Default (You First)</option>
                        <option value="surplus-high">Highest Surplus (+)</option>
                        <option value="owed-high">Highest Owed (-)</option>
                        <option value="alpha">Alphabetical (A - Z)</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1" id="filterPillGroup">
                    <button className={pillClasses("all")} data-filter="all" onClick={() => setActiveFilter("all")}>All {members.length} Roster Members</button>
                    <button className={pillClasses("surplus")} data-filter="surplus" onClick={() => setActiveFilter("surplus")}>In Surplus (+{surplusMembers.length})</button>
                    <button className={pillClasses("deficit")} data-filter="deficit" onClick={() => setActiveFilter("deficit")}>In Deficit (-{deficitMembers.length})</button>
                    <button className={pillClasses("admin")} data-filter="admin" onClick={() => setActiveFilter("admin")}>Group Admins ({members.filter((m) => m.role === "admin").length})</button>
                    <button className={pillClasses("custom")} data-filter="custom" onClick={() => setActiveFilter("custom")}>Custom Exclusions ({members.filter((m) => m.customExclusions && m.customExclusions.length > 0).length})</button>
                  </div>
                </div>

                {/* Ledger Contribution Matrix List */}
                <div className="flex flex-col gap-3.5" id="memberMatrixList">
                  {visibleMembers.map((m) => {
                    const balance = balances?.members?.find((b) => b.user === m.user);
                    const net = balance?.net || 0;
                    const paid = balance?.paid || 0;
                    const share = balance?.share || 0;
                    const isYou = m.user === myUserId;
                    const nudged = !!nudgeStates[m.user];
                    const avatarBg = m.avatarBg || (isYou ? "#6ffbbe" : "#e1e0ff");
                    const avatarColor = isYou ? "#ffffff" : "#131b2e";
                    const borderColor = isYou ? "#4edea380" : "#c0c1ff80";

                    return (
                      <div key={m.user} className={`matrix-card bg-surface-container-lowest border border-surface-container-high rounded-2xl p-4 sm:p-5 shadow-[0_2px_8px_rgba(19,27,46,0.02)] transition-all flex flex-col gap-4 ${isYou ? "hover:border-primary/40" : m.role === "admin" ? "hover:border-secondary/40" : "hover:border-outline-variant"}`} data-alpha={(m.name || "").toLowerCase()} data-balance={net} data-category={m.customExclusions && m.customExclusions.length > 0 ? "custom" : net > 0 ? "surplus" : net < 0 ? "deficit" : "neutral"} data-name={(m.name || "").toLowerCase()}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-start sm:items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl font-bold text-base flex items-center justify-center shadow-sm shrink-0 border" style={{ backgroundColor: avatarBg, color: avatarColor, borderColor }}>
                              {m.avatarEmoji || m.name?.slice(0, 2).toUpperCase() || "?"}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-base font-bold text-on-surface">{m.name}</span>
                                {isYou && <span className={badgeClasses("you")}>YOU</span>}
                                {m.roles?.map((r, i) => (
                                  <span key={i} className={badgeClasses(r === "Admin" ? "admin" : "member")}>{r}</span>
                                ))}
                                {m.customExclusions && m.customExclusions.length > 0 && <span className={badgeClasses("custom")}>Custom Exclusions</span>}
                              </div>
                              <div className="text-xs text-on-surface-variant flex items-center gap-1.5 mt-0.5">
                                <span>{m.email}</span>
                                <span>&bull;</span>
                                <span className="text-outline">{m.roleDesc || "Member"}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{net > 0 ? "Surplus" : net < 0 ? "Deficit" : "Settled"}</span>
                            <span className={`text-base sm:text-lg font-bold font-numeric-balance-lg ${net > 0 ? "text-primary" : net < 0 ? "text-error" : "text-on-surface"} bg-${net > 0 ? "primary-fixed" : net < 0 ? "error-container" : "surface-container"}/30 border-${net > 0 ? "primary-fixed-dim" : net < 0 ? "error-container" : "surface-container"}/40 px-3 py-1 rounded-xl`}>
                              {net >= 0 ? "+" : ""}{formatMoney(net, currency)}
                            </span>
                          </div>
                        </div>
                        <div className={`grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-surface-container-low p-3 rounded-xl border border-surface-container text-xs`}>
                          <div>
                            <span className="text-[10px] text-outline uppercase font-semibold block">Fronted Outlay</span>
                            <span className="font-bold text-on-surface text-sm">{formatMoney(paid, currency)}</span>
                            <span className="text-[10px] text-on-surface-variant block mt-0.5">Paid directly</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-outline uppercase font-semibold block">Equal Share Debit</span>
                            <span className="font-bold text-on-surface text-sm">{formatMoney(share, currency)}</span>
                            <span className="text-[10px] text-on-surface-variant block mt-0.5">Calculated share</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-outline uppercase font-semibold block">Exclusions</span>
                            <span className="font-semibold text-on-surface">{m.customExclusions?.length > 0 ? m.customExclusions.join(", ") : "None"}</span>
                            <span className="text-[10px] text-on-surface-variant block mt-0.5">{m.customExclusions?.length > 0 ? "Auto-deducted" : "Equal split applied"}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-outline uppercase font-semibold block">Receipts Logged</span>
                            <span className="font-bold text-on-surface text-sm">{m.receiptCount || 0}</span>
                            <span className="text-[10px] text-on-surface-variant block mt-0.5">{m.receiptVerified ? "Verified" : "Pending"}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <span className={`text-xs flex items-center gap-1 ${net > 0 ? "text-primary" : net < 0 ? "text-error" : "text-on-surface-variant"}`}>
                            <span className="material-symbols-outlined text-[15px]">{net > 0 ? "verified" : net < 0 ? "arrow_forward" : "check_circle"}</span>
                            <span>{net > 0 ? `Owed ${formatMoney(net, currency)}` : net < 0 ? `Owes ${formatMoney(Math.abs(net), currency)}` : "Fully settled"}</span>
                          </span>
                          <div className="flex items-center gap-2">
                            <button className={`text-xs font-semibold px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface border border-surface-container transition-colors flex items-center gap-1 ${m.receiptCount > 0 ? "" : "opacity-50"}`} type="button" onClick={() => triggerToast("Receipt Vault Opened", "Itemized OCR breakdown and receipt scans previewed.")}>
                              <span className="material-symbols-outlined text-[15px]">receipt_long</span>
                              <span>View Receipts</span>
                            </button>
                            <button className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 shadow-sm ${net < 0 ? "bg-surface-container-low hover:bg-surface-container text-tertiary border border-tertiary-container/30" : "bg-primary-container hover:bg-surface-tint text-on-primary"}`} type="button" onClick={(e) => {
                              e.stopPropagation();
                              const next = { ...nudgeStates, [m.user]: true };
                              setNudgeStates(next);
                              triggerToast("Direct Nudge Sent", `Sent gentle reminder ping to ${m.name}.`);
                            }}>
                              <span className={`material-symbols-outlined text-[15px] ${nudged ? "text-on-primary" : "text-tertiary"}`}>{nudged ? "done" : "notifications_active"}</span>
                              <span>{nudged ? "Nudged" : net < 0 ? "Send Nudge" : "Request Settle"}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 4. Direct Join Link & Access Permissions Banner */}
            <div className="bg-gradient-to-r from-surface-container-low via-surface-container to-surface-container-high border border-surface-container-high rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary-fixed text-on-primary-fixed flex items-center justify-center shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-[24px]">key</span>
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="font-bold text-sm text-on-surface">Trip Access & Auto-Balance URL</h3>
                  <p className="text-xs text-on-surface-variant max-w-xl leading-relaxed">
                    Anyone with this link will automatically sync with this ledger and inherit default equal-share consumption splitting.
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-outline">
                    <span className="inline-flex items-center gap-1 font-semibold text-primary">
                      <span className="material-symbols-outlined text-[14px]">shield</span> Admin Managed
                    </span>
                    <span>&bull;</span>
                    <span>Expires {balances?.group?.inviteExpires ? new Date(balances.group.inviteExpires).toLocaleDateString() : "Soon"}</span>
                    <span>&bull;</span>
                    <span>256-bit Ledger Integrity</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto bg-surface-container-lowest p-1.5 rounded-xl border border-surface-container-high shadow-sm">
                <span className="text-xs font-mono text-on-surface px-3 truncate select-all">tabsy.me/join/{balances?.group?.inviteCode || "group"}</span>
                <button className="px-3.5 py-2 rounded-lg bg-primary-container hover:bg-surface-tint text-on-primary text-xs font-bold transition-colors flex items-center gap-1 shrink-0" id="bannerCopyLinkBtn" type="button" onClick={copyInvite}>
                  <span className="material-symbols-outlined text-[16px]">content_copy</span>
                  <span>Copy Link</span>
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Toast Notification Element */}
        <div className={`fixed bottom-6 right-6 bg-surface-container-lowest border border-surface-container-high shadow-[0_10px_30px_rgba(19,27,46,0.12)] p-4 rounded-xl flex items-center gap-3 z-50 transform transition-all duration-300 ${toastOpen ? "" : "translate-y-24 opacity-0 pointer-events-none"}`} id="actionToast">
          <div className="w-8 h-8 rounded-lg bg-primary-fixed text-on-primary-fixed flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px]">check</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-on-surface" id="toastHeader">{toastHeader}</span>
            <span className="text-[11px] text-on-surface-variant" id="toastMessage">{toastMessage}</span>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
