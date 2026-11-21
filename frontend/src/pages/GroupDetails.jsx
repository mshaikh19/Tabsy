<<<<<<< HEAD
import { Link } from "react-router-dom";
=======
﻿import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
>>>>>>> 7d94a7acf451afb31a2d657ed33b3d9084c6be7d
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

export default function GroupDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const groupId = location.state?.groupId;

  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [balances, setBalances] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      const [g, m, b, a] = await Promise.all([
        groupService.get(groupId),
        groupService.members(groupId),
        groupService.balances(groupId),
        groupService.activity(groupId),
      ]);
      setGroup(g);
      setMembers(m);
      setBalances(b);
      setRecentActivity(a?.items || a || []);
    } catch (err) {
      setError(err?.response?.data?.error?.message || "Failed to load group");
    } finally {
      setLoading(false);
    }
  };

  if (!groupId) return null;
  if (loading) {
    return (
      <AppLayout>
        <main className="w-full pt-4 bg-surface min-h-screen">
          <div className="max-w-7xl w-full mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop py-4 flex flex-col gap-6">
            <div className="text-center py-16 text-on-surface-variant">Loading group…</div>
          </div>
        </main>
      </AppLayout>
    );
  }
  if (error) {
    return (
      <AppLayout>
        <main className="w-full pt-4 bg-surface min-h-screen">
          <div className="max-w-7xl w-full mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop py-4 flex flex-col gap-6">
            <div className="px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">{error}</div>
          </div>
        </main>
      </AppLayout>
    );
  }

  const currency = group?.currency || "INR";
  const myBalance = balances?.members?.find((m) => m.user === group?.userId) || {};
  const myNet = myBalance.net || 0;
  const totalSpend = balances?.totalSpend || 0;
  const memberCount = members?.length || 0;
  const myShare = totalSpend / memberCount;
  const myPaid = balances?.members?.find((m) => m.user === group?.userId)?.paid || 0;

  return (
    <AppLayout>
      <main className="w-full pt-4 bg-[#FAF8F5] min-h-screen">
        <div className="max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-6">
          <GroupHeader
            title={group?.name}
            subtitle={group?.description}
            currentLabel="Group Details"
            actions={
              <>
                <Link className="group/btn relative inline-flex items-center gap-0 px-2.5 py-2 text-on-surface font-title-md text-title-md hover:bg-surface-container-lowest rounded-lg transition-all duration-300 ease-out overflow-hidden" to="/group-expenses" state={{ groupId }}>
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover/btn:text-primary transition-colors shrink-0">receipt_long</span>
                  <span className="max-w-0 group-hover/btn:max-w-[120px] group-hover/btn:ml-2 overflow-hidden whitespace-nowrap transition-all duration-300 ease-out opacity-0 group-hover/btn:opacity-100">
                    View Expenses
                  </span>
                </Link>
                <div className="w-px h-5 bg-outline-variant/40 shrink-0 transition-all duration-300 group-hover/actions:bg-transparent" />
                <Link className="group/btn relative inline-flex items-center gap-0 px-2.5 py-2 text-on-surface font-title-md text-title-md hover:bg-surface-container-lowest rounded-lg transition-all duration-300 ease-out overflow-hidden" to="/group-members" state={{ groupId }}>
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover/btn:text-secondary transition-colors shrink-0">group</span>
                  <span className="max-w-0 group-hover/btn:max-w-[120px] group-hover/btn:ml-2 overflow-hidden whitespace-nowrap transition-all duration-300 ease-out opacity-0 group-hover/btn:opacity-100">
                    View Members
                  </span>
                </Link>
                <div className="w-px h-5 bg-outline-variant/40 shrink-0 transition-all duration-300 group-hover/actions:bg-transparent" />
                <Link className="group/btn inline-flex items-center gap-0 px-2.5 py-2 text-on-surface font-title-md text-title-md hover:bg-surface-container-lowest rounded-lg transition-all duration-300 ease-out overflow-hidden" to="/group-balances" state={{ groupId }}>
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover/btn:text-on-surface transition-colors shrink-0">bolt</span>
                  <span className="max-w-0 group-hover/btn:max-w-[120px] group-hover/btn:ml-2 overflow-hidden whitespace-nowrap transition-all duration-300 ease-out opacity-0 group-hover/btn:opacity-100">
                    Settle Balances
                  </span>
                </Link>
                <div className="w-px h-5 bg-outline-variant/40 shrink-0 transition-all duration-300 group-hover/actions:bg-transparent" />
                <Link className="group/btn inline-flex items-center gap-0 px-2.5 py-2 bg-primary-container text-on-primary-container font-title-md text-title-md hover:opacity-95 rounded-lg transition-all duration-300 ease-out overflow-hidden" to="/group-members/add" state={{ groupId }}>
                  <span className="material-symbols-outlined text-[18px] shrink-0">group_add</span>
                  <span className="max-w-0 group-hover/btn:max-w-[120px] group-hover/btn:ml-2 overflow-hidden whitespace-nowrap transition-all duration-300 ease-out opacity-0 group-hover/btn:opacity-100">
                    Invite Friends
                  </span>
                </Link>
                <div className="w-px h-5 bg-outline-variant/40 shrink-0 transition-all duration-300 group-hover/actions:bg-transparent" />
                <Link aria-label="Edit group" className="group/btn relative inline-flex items-center gap-0 px-2.5 py-2 text-on-surface font-title-md text-title-md hover:bg-surface-container-lowest rounded-lg transition-all duration-300 ease-out overflow-hidden" to="/group-edit" state={{ groupId }}>
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover/btn:text-primary transition-colors shrink-0">edit</span>
                  <span className="max-w-0 group-hover/btn:max-w-[100px] group-hover/btn:ml-2 overflow-hidden whitespace-nowrap transition-all duration-300 ease-out opacity-0 group-hover/btn:opacity-100">
                    Edit Group
                  </span>
                </Link>
                <div className="w-px h-5 bg-outline-variant/40 shrink-0 transition-all duration-300 group-hover/actions:bg-transparent" />
                <Link aria-label="Settings" className="group/btn relative inline-flex items-center gap-0 px-2.5 py-2 text-on-surface font-title-md text-title-md hover:bg-surface-container-lowest rounded-lg transition-all duration-300 ease-out overflow-hidden" to="/group-settings" state={{ groupId }}>
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover/btn:text-on-surface transition-colors shrink-0">settings</span>
                  <span className="max-w-0 group-hover/btn:max-w-[100px] group-hover/btn:ml-2 overflow-hidden whitespace-nowrap transition-all duration-300 ease-out opacity-0 group-hover/btn:opacity-100">
                    Settings
                  </span>
                </Link>
              </>
            }
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <div className="rounded-2xl bg-surface-container-low p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider">Total Group Spend</span>
                <div className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[18px]">payments</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="font-numeric-balance-lg text-numeric-balance-lg text-on-surface">{formatMoney(totalSpend, currency)}</div>
                <div className="mt-1 flex items-center gap-1 text-on-surface-variant font-body-sm text-body-sm">
                  <span className="material-symbols-outlined text-body-md text-primary">receipt_long</span>
                  Across {balances?.expenseCount || 0} shared expenses
                </div>
              </div>
              <div className="mt-3 pt-2 flex items-center justify-between text-outline font-label-caps text-label-caps">
                <span>Avg / person</span>
                <span className="font-semibold text-on-surface">{formatMoney(myShare, currency)}</span>
              </div>
            </div>

            <div className="rounded-2xl bg-surface-container-low p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-label-caps uppercase text-on-primary-fixed-variant tracking-wider">Your Net Standing</span>
                <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="font-numeric-balance-lg text-numeric-balance-lg text-primary flex items-baseline gap-1">
                  {myNet >= 0 ? "+" : ""}{formatMoney(Math.abs(myNet), currency)}
                  <span className="font-body-sm text-body-sm font-semibold text-primary">
                    {myNet > 0 ? " owed to you" : myNet < 0 ? " you owe" : " settled"}
                  </span>
                </div>
                <div className="mt-1 text-on-surface-variant font-body-sm text-body-sm flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary-container" />
                  {memberCount - 1} counterpart accounts active
                </div>
              </div>
              <div className="mt-3">
                <Link to="/group-balances" state={{ groupId }} className="w-full py-1.5 px-3 rounded-lg bg-primary-container text-on-primary-container font-label-caps text-label-caps uppercase text-center hover:opacity-90 active:scale-95 transition-all block">
                  {myNet > 0 ? "Request Settlement" : myNet < 0 ? "View Settlement Plan" : "All Settled"}
                </Link>
              </div>
            </div>

            <div className="rounded-2xl bg-surface-container-low p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider">Your Total Paid</span>
                <div className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-[18px]">credit_score</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="font-numeric-balance-lg text-numeric-balance-lg text-on-surface">{formatMoney(myPaid, currency)}</div>
                <div className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
                  Personal share is <span className="font-semibold text-on-surface">{formatMoney(myShare, currency)}</span>
                </div>
              </div>
              <div className="mt-3 pt-2 flex items-center justify-between text-outline font-label-caps text-label-caps">
                <span>Net Surplus Credit</span>
                <span className={`font-semibold ${myNet > 0 ? "text-primary" : myNet < 0 ? "text-error" : "text-on-surface"}`}>
                  {myNet >= 0 ? "+" : ""}{formatMoney(myNet, currency)}
                </span>
              </div>
            </div>

            <div className="rounded-2xl bg-surface-container-low p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider">Circle Sync Health</span>
                <div className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary-container">
                  <span className="material-symbols-outlined text-[18px]">verified_user</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="font-numeric-balance-lg text-numeric-balance-lg text-on-surface">{memberCount} Members</div>
                <div className="mt-1 flex items-center gap-1 font-body-sm text-body-sm text-primary">
                  <span className="material-symbols-outlined text-body-md">check_circle</span>
                  100% synced • 0 disputed
                </div>
              </div>
              <div className="mt-3 pt-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  {members.slice(0, 5).map((m) => (
                    <div key={m.user} className="inline-block h-7 w-7 rounded-full bg-primary text-on-primary text-label-caps font-bold flex items-center justify-center ring-2 ring-surface-container-low shrink-0" title={m.name}>
                      {m.avatarEmoji || m.name?.slice(0, 2).toUpperCase() || "?"}
                    </div>
                  ))}
                  {memberCount > 5 && (
                    <div className="inline-block h-7 w-7 rounded-full bg-secondary-fixed text-on-secondary-fixed text-label-caps font-bold flex items-center justify-center ring-2 ring-surface-container-low shrink-0" title={`${memberCount - 5} more members`}>
                      +{memberCount - 5}
                    </div>
                  )}
                </div>
                <span className="font-label-caps text-label-caps text-secondary font-semibold shrink-0">ALL AUDITED</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pb-1">
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface-container text-on-surface font-title-md text-title-md font-semibold shadow-sm transition-all">
              <span className="material-symbols-outlined text-[18px] text-primary">dashboard</span>
              Overview
              <span className="w-1.5 h-1.5 rounded-full bg-primary-container ml-1" />
            </button>
            <Link className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low font-title-md text-title-md transition-all" to="/group-expenses" state={{ groupId }}>
              <span className="material-symbols-outlined text-[18px]">receipt</span>
              Expenses
              <span className="px-1.5 py-0.2 rounded-full bg-surface-container-high text-on-surface-variant text-label-caps font-label-caps">{balances?.expenseCount || 0}</span>
            </Link>
            <Link className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low font-title-md text-title-md transition-all" to="/group-members" state={{ groupId }}>
              <span className="material-symbols-outlined text-[18px]">people</span>
              Members
              <span className="px-1.5 py-0.2 rounded-full bg-surface-container-high text-on-surface-variant text-label-caps font-label-caps">{memberCount}</span>
            </Link>
            <Link className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low font-title-md text-title-md transition-all" to="/group-balances" state={{ groupId }}>
              <span className="material-symbols-outlined text-[18px]">alt_route</span>
              Balances & Routing
            </Link>
            <Link className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low font-title-md text-title-md transition-all" to="/group-activity" state={{ groupId }}>
              <span className="material-symbols-outlined text-[18px]">history</span>
              Activity Feed
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="rounded-2xl bg-surface-container-lowest p-4 md:p-6 shadow-sm flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="font-headline-sm text-headline-sm text-on-surface tracking-tight">Recent Group Expenses</h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Tap any expense to inspect receipt breakdowns or audit participant allocations.</p>
                  </div>
                  <Link className="inline-flex items-center gap-1 font-title-md text-title-md text-secondary hover:underline group" to="/group-expenses" state={{ groupId }}>
                    View all {balances?.expenseCount || 0} in ledger
                    <span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                  </Link>
                </div>
                <div className="flex flex-col gap-2">
                  {(recentActivity.slice(0, 4) || []).map((activity) => (
                    <div key={activity._id || activity.id} className="group p-3 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl ${activity.iconBg || "bg-surface-variant text-secondary"} flex items-center justify-center shrink-0`}>
                          <span className="material-symbols-outlined text-[24px]">{activity.icon || "receipt_long"}</span>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-title-md text-title-md font-semibold text-on-surface">{activity.title}</span>
                            <span className={`px-2 py-0.5 rounded-full ${activity.badgeColor || "bg-surface-container text-on-surface-variant"} font-label-caps text-label-caps`}>{activity.category}</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-1 text-on-surface-variant font-body-sm text-body-sm mt-0.5">
                            <span>{activity.paidBy === "You" ? "Paid by you" : `Paid by ${activity.paidBy}`}</span>
                            <span>•</span>
                            <span>{activity.split}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0">
                        <span className="font-numeric-balance-md text-numeric-balance-md text-on-surface">{formatMoney(activity.amount, currency)}</span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${activity.statusColor || "bg-primary-container text-on-primary-container"} font-label-caps text-label-caps mt-0.5`}>
                          {activity.net >= 0 ? `Owed ${formatMoney(activity.net, currency)}` : `Owe ${formatMoney(Math.abs(activity.net), currency)}`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
<<<<<<< HEAD
                <div className="pt-3">
                  <span className="font-label-caps text-label-caps uppercase text-outline tracking-wider block mb-2">Attached Receipt Memories</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {["Chalet", "Passes", "Safeway", "Chains"].map((label) => (
                      <div key={label} className="relative h-20 rounded-xl overflow-hidden shadow-sm group">
                        <div className="w-full h-full bg-surface-container-low" />
                        <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-[#FAF8F5]/80 backdrop-blur-sm text-label-caps font-label-caps font-semibold">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
=======
>>>>>>> 7d94a7acf451afb31a2d657ed33b3d9084c6be7d
              </div>

              <div className="rounded-2xl bg-surface-container-lowest p-4 md:p-6 shadow-sm flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-[22px]">auto_graph</span>
                    </div>
                    <div>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface">Smart Bipartite Debt Simplification</h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        {balances?.plan?.length > 0
                          ? `Min-cost network flow simplified debts into ${balances.plan.length} optimal direct transfers.`
                          : "All members are settled up. No transfers needed."}
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-fixed/50 text-on-primary-fixed-variant font-label-caps text-label-caps">
                    <span className="material-symbols-outlined text-body-md">bolt</span>
                    {balances?.plan?.length > 0 ? "OPTIMIZED" : "SETTLED"}
                  </span>
                </div>
                {balances?.plan?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {balances.plan.slice(0, 2).map((transfer, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-surface-container-low flex flex-col justify-between gap-3">
                        <div className="flex items-center justify-between">
                          <span className="font-label-caps text-label-caps uppercase text-outline">DIRECT TRANSFER #{idx + 1}</span>
                          <span className="font-numeric-balance-md text-numeric-balance-md text-on-surface font-bold">{formatMoney(transfer.amount, currency)}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2 py-2">
                          <div className="flex flex-col items-center gap-1 text-center">
                            <div className="w-11 h-11 rounded-full bg-surface-container-high text-on-surface font-bold flex items-center justify-center text-body-md">{transfer.fromInitials}</div>
                            <span className="font-title-md text-title-md font-semibold text-on-surface">{transfer.from}</span>
                            <span className="font-body-sm text-body-sm text-error font-medium">Sends {formatMoney(transfer.amount, currency)}</span>
                          </div>
                          <div className="flex-1 flex flex-col items-center px-2">
                            <div className="w-full flex items-center justify-center relative">
                              <div className="h-0.5 w-full bg-secondary-fixed-dim" />
                              <span className="material-symbols-outlined text-secondary absolute text-[18px]">arrow_forward</span>
                            </div>
                            <span className="text-label-caps font-label-caps uppercase text-outline mt-1 text-center">{transfer.method}</span>
                          </div>
                          <div className="flex flex-col items-center gap-1 text-center">
                            <div className="w-11 h-11 rounded-full bg-secondary text-on-secondary font-bold flex items-center justify-center text-body-md">{transfer.toInitials}</div>
                            <span className="font-title-md text-title-md font-semibold text-on-surface">{transfer.to}</span>
                            <span className="font-body-sm text-body-sm text-primary font-medium">Receives {formatMoney(transfer.amount, currency)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="flex-1 py-2 px-3 rounded-xl bg-surface-container-high hover:bg-surface-variant text-on-surface font-title-md text-title-md transition-colors text-center">Send Nudge</button>
                          <button className="flex-1 py-2 px-3 rounded-xl bg-secondary-container text-on-secondary-container font-title-md text-title-md shadow-sm hover:opacity-95 transition-all text-center">Mark Paid</button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-surface-container flex items-center gap-3 text-on-surface-variant font-body-sm text-body-sm text-primary">
                    <span className="material-symbols-outlined text-primary text-[20px] shrink-0">check_circle</span>
                    <span>Everyone is fully settled. No outstanding balances.</span>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h2 className="font-headline-sm text-headline-sm text-on-surface">Group Members</h2>
                    <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-caps text-label-caps">{memberCount} Total</span>
                  </div>
                  <Link to="/group-members" state={{ groupId }} className="text-secondary font-title-md text-title-md hover:underline">Edit</Link>
                </div>
                <div className="flex flex-col gap-2">
                  {members.map((m) => {
                    const balance = balances?.members?.find((b) => b.user === m.user);
                    const net = balance?.net || 0;
                    const paid = balance?.paid || 0;
                    const share = balance?.share || 0;
                    return (
                      <div key={m.user} className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full ${m.avatarBg || "bg-primary"} text-on-primary font-bold flex items-center justify-center text-body-sm`}>
                            {m.avatarEmoji || m.name?.slice(0, 2).toUpperCase() || "?"}
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1.5">
                              <span className="font-title-md text-title-md font-semibold text-on-surface">{m.name}</span>
                              {m.isCurrentUser && <span className="px-1.5 py-0.2 rounded bg-primary-fixed text-on-primary-fixed-variant text-label-caps font-label-caps font-bold">YOU</span>}
                              {m.role === "admin" && !m.isCurrentUser && <span className="px-1.5 py-0.2 rounded bg-secondary-fixed text-on-secondary-fixed text-label-caps font-label-caps font-bold">ADMIN</span>}
                            </div>
                            <span className="font-body-sm text-body-sm text-on-surface-variant">Paid {formatMoney(paid, currency)} • Share {formatMoney(share, currency)}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`font-title-md text-title-md font-bold block ${net > 0 ? "text-primary" : net < 0 ? "text-error" : "text-on-surface"}`}>
                            {net >= 0 ? "+" : ""}{formatMoney(net, currency)}
                          </span>
                          <span className={`text-label-caps font-label-caps uppercase font-semibold ${net > 0 ? "text-primary" : net < 0 ? "text-error" : "text-on-surface-variant"}`}>
                            {net > 0 ? "Owed to you" : net < 0 ? "Owes" : "Settled"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <Link to="/group-members" state={{ groupId }} className="w-full py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-title-md text-title-md transition-colors text-center">
                  Manage All Members
                </Link>
              </div>

              <div className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-headline-sm text-headline-sm text-on-surface">Settlement & Audit</h2>
                  <span className="material-symbols-outlined text-outline text-[20px]">tune</span>
                </div>
                <div className="flex flex-col gap-2">
                  <Link to="/group-balances" state={{ groupId }} className="p-3 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-tertiary-container text-on-tertiary-container flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[20px]">notifications_active</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-title-md text-title-md font-semibold text-on-surface">Nudge All Outstanding</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">
                          {balances?.totalOutstanding > 0 ? `${formatMoney(balances.totalOutstanding, currency)} pending` : "No outstanding debts"}
                        </span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-outline text-[18px]">chevron_right</span>
                  </Link>
                  <Link to="/group-activity" state={{ groupId }} className="p-3 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-surface-container-high text-on-surface flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[20px]">file_download</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-title-md text-title-md font-semibold text-on-surface">Export Group Ledger</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">Download full CSV or formatted audit PDF</span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-outline text-[18px]">chevron_right</span>
                  </Link>
                  <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-2">
                    <span className="font-label-caps text-label-caps uppercase text-outline">Group Share Link</span>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-lowest gap-2">
                      <span className="font-body-sm text-body-sm text-on-surface font-mono truncate">tabsy.app/join/{group?.inviteCode}</span>
                      <button className="shrink-0 text-secondary hover:opacity-80 flex items-center gap-1 font-label-caps text-label-caps" type="button">
                        <span className="material-symbols-outlined text-[16px]">content_copy</span>
                        <span>COPY</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </AppLayout>
  );
}