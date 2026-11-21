import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import GroupHeader from "../components/layout/GroupHeader";
import { groupService } from "../services";

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

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export default function GroupBalances() {
  const location = useLocation();
  const navigate = useNavigate();
  const groupId = location.state?.groupId;

  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [balances, setBalances] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null);

  useEffect(() => {
    if (!groupId) {
      navigate("/groups");
      return;
    }
    load();
  }, [groupId]);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [grp, bal] = await Promise.all([
        groupService.get(groupId),
        groupService.balances(groupId),
      ]);
      setGroup(grp);
      setMembers(grp?.members || []);
      setBalances(bal);
    } catch (err) {
      setError(err?.response?.data?.error?.message || "Failed to load balances");
    } finally {
      setLoading(false);
    }
  }

  const currency = group?.currency || "INR";
  const totalFronted = members.reduce((s, m) => s + (m.totalPaid || 0), 0);
  const totalConsumed = members.reduce((s, m) => s + (m.totalConsumed || 0), 0);
  const netUnsettled = Math.abs(
    members.reduce((s, m) => s + Math.min(0, m.net || 0), 0)
  );
  const settledAmount = totalFronted - netUnsettled;
  const settledPct = totalFronted > 0 ? ((settledAmount / totalFronted) * 100).toFixed(1) : "0.0";

  const myUserId = (() => {
    if (!balances?.position || !members.length) return null;
    const posNet = balances.position.net || 0;
    const match = members.find((m) => (m.net || 0) === posNet);
    return match?.id || null;
  })();

  const myMember = members.find((m) => m.id === myUserId);
  const creditors = members.filter((m) => (m.net || 0) > 0).length;
  const debtors = members.filter((m) => (m.net || 0) < 0).length;

  const routes = (balances?.plan || []).map((t, i) => ({
    id: String.fromCharCode(65 + i),
    label: `Route ${String.fromCharCode(65 + i)}`,
    sublabel: t.from?._id === myUserId || t.to?._id === myUserId ? "Your Transfer" : "Direct Transfer",
    amount: t.amount,
    payer: {
      id: t.from?._id,
      initials: getInitials(t.from?.name),
      name: t.from?.name || "Member",
      role: `Owes ${formatMoney(t.amount, currency)}`,
    },
    receiver: {
      id: t.to?._id,
      initials: getInitials(t.to?.name),
      name: t.to?.name || "Member",
      role: `Receives ${formatMoney(t.amount, currency)}`,
    },
    description: `Direct settlement from ${t.from?.name || "member"} to ${t.to?.name || "member"}.`,
    highlight: t.from?._id === myUserId || t.to?._id === myUserId,
  }));

  function showToast(message, icon = "check_circle") {
    setToast({ message, icon });
    setTimeout(() => setToast(null), 3200);
  }

  function openSettleModal(payer, recipient, amount, fromUser, toUser) {
    setModal({ payer, recipient, amount, fromUser, toUser });
  }

  function closeModal() {
    setModal(null);
  }

  async function executeSettle() {
    if (!modal?.fromUser || !modal?.toUser) return;
    setSubmitting(true);
    try {
      await groupService.settle(groupId, {
        fromUser: modal.fromUser,
        toUser: modal.toUser,
        amount: Math.round(parseFloat(modal.amount) * 100),
        method: "manual",
        note: `Settlement recorded from ${modal.payer} to ${modal.recipient}`,
      });
      closeModal();
      showToast(`Settlement recorded: ${modal.payer} → ${modal.recipient}`, "check_circle");
      await load();
    } catch (err) {
      showToast(err?.response?.data?.error?.message || "Failed to settle", "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function markReceived(route) {
    setSubmitting(true);
    try {
      await groupService.settle(groupId, {
        fromUser: route.payer.id,
        toUser: route.receiver.id,
        amount: route.amount,
        method: "manual",
        note: `Marked as received from ${route.payer.name}`,
      });
      showToast(`Payment from ${route.payer.name} recorded`, "verified");
      await load();
    } catch (err) {
      showToast(err?.response?.data?.error?.message || "Failed to record", "error");
    } finally {
      setSubmitting(false);
    }
  }

  if (!groupId) return null;

  if (loading) {
    return (
      <AppLayout>
        <div className="w-full pt-4 bg-surface">
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
            <GroupHeader title={group?.name || "Loading..."} subtitle="" currentLabel="Balances" />
            <div className="flex items-center justify-center py-20 text-on-surface-variant">
              <span className="material-symbols-outlined text-[32px] animate-spin mr-2">progress_activity</span>
              Loading balances...
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="w-full pt-4 bg-surface">
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
            <GroupHeader title="Error" subtitle="" currentLabel="Balances" />
            <div className="mt-6 px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">{error}</div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="bg-[#FAF8F5] font-body-md text-on-surface antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
        <main className="w-full pt-0 pb-24 bg-[#FAF8F5] min-h-screen">
          <div className="max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
            <GroupHeader
              title={group?.name || "Group Balances"}
              subtitle="Optimized settlement routes powered by debt minimization."
              currentLabel="Balances & Debt Resolution"
              actions={
                <button
                  className="group/btn inline-flex items-center gap-0 px-2.5 py-2 bg-primary-container text-on-primary-container font-title-md text-title-md hover:opacity-95 rounded-lg transition-all duration-300 ease-out overflow-hidden"
                  type="button"
                  disabled={submitting || !myUserId}
                  onClick={() => {
                    const myDebtRoute = routes.find((r) => r.payer.id === myUserId);
                    if (myDebtRoute) {
                      openSettleModal(myDebtRoute.payer.name, myDebtRoute.receiver.name, (myDebtRoute.amount / 100).toFixed(2), myDebtRoute.payer.id, myDebtRoute.receiver.id);
                    } else {
                      showToast("You have no outstanding debts to settle", "verified");
                    }
                  }}
                >
                  <span className="material-symbols-outlined text-[18px] shrink-0">bolt</span>
                  <span className="max-w-0 group-hover/btn:max-w-[180px] group-hover/btn:ml-2 overflow-hidden whitespace-nowrap transition-all duration-300 ease-out opacity-0 group-hover/btn:opacity-100">
                    Settle My Debts
                  </span>
                </button>
              }
            />

            {/* Top Highlight Ribbon */}
            <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-space-md shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-md">
              <div className="flex flex-col sm:flex-row sm:items-center gap-space-lg flex-1">
                <div className="flex items-center gap-3 pr-space-md sm:border-r border-outline-variant/40">
                  <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-[22px]">compare_arrows</span>
                  </div>
                  <div>
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Net Clearing Engine</span>
                    <div className="font-headline-sm text-headline-sm text-on-surface font-bold leading-tight">{group?.name || "Group"}</div>
                  </div>
                </div>

                <div className="flex-1 max-w-xl flex flex-col gap-1.5">
                  <div className="flex items-center justify-between font-body-sm text-body-sm">
                    <span className="text-on-surface-variant flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-secondary-container" />
                      Total Fronted: <strong className="text-on-surface font-semibold">{formatMoney(totalFronted, currency)}</strong>
                    </span>
                    <span className="text-on-surface-variant flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-tertiary-container" />
                      Net Unsettled: <strong className="text-tertiary font-bold">{formatMoney(netUnsettled, currency)}</strong> ({(100 - parseFloat(settledPct)).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-surface-container-low rounded-full overflow-hidden flex p-0.5">
                    <div className="h-full bg-primary-container rounded-l-full" style={{ width: `${settledPct}%` }} />
                    <div className="h-full bg-tertiary-container rounded-r-full" style={{ width: `${100 - parseFloat(settledPct)}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-on-surface-variant">
                    <span>{formatMoney(settledAmount, currency)} ({settledPct}%) already resolved</span>
                    <span className="font-medium text-primary">Zero-Sum Ledger</span>
                  </div>
                </div>
              </div>

              <div className="bg-surface-container-low border border-outline-variant/40 px-space-md py-2.5 rounded-xl flex items-center gap-space-sm shrink-0">
                <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px]">insights</span>
                </div>
                <div className="text-left">
                  <div className="font-title-md text-[13px] text-on-surface font-semibold">Algorithmic Simplification</div>
                  <div className="font-body-sm text-[12px] text-on-surface-variant">
                    {routes.length} direct clearing hops for {members.length} members
                  </div>
                </div>
                <div className="ml-2 px-2 py-0.5 rounded-full bg-primary/10 text-primary font-label-caps text-label-caps font-bold">
                  {routes.length} ROUTES
                </div>
              </div>
            </div>

            {/* Section 1: Settlement Routes */}
            {routes.length > 0 && (
              <section className="flex flex-col gap-space-sm">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-space-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary-container" />
                    <h2 className="font-headline-md text-headline-md text-on-surface tracking-tight">Optimized Settlement Routes</h2>
                    <span className="text-on-surface-variant text-body-sm ml-2 hidden sm:inline">(Minimum Hop Pairings)</span>
                  </div>
                  <div className="flex items-center gap-2 text-body-sm text-on-surface-variant font-medium">
                    <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
                    <span>{routes.length} Settlement Routes</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                  {routes.map((route) => (
                    <div
                      className={`bg-surface-container-lowest border rounded-2xl p-space-md shadow-sm hover:border-outline-variant transition-all flex flex-col justify-between gap-space-md relative overflow-hidden ${route.highlight ? "border-2 border-primary-container/60" : "border-outline-variant/60"}`}
                      key={route.id}
                    >
                      {route.highlight && <div className="absolute -right-8 -top-8 w-24 h-24 bg-primary-container/10 rounded-full pointer-events-none" />}
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-0.5 rounded-full font-label-caps text-[11px] font-bold ${route.highlight ? "bg-primary-container text-on-primary-container" : "bg-surface-container-high text-on-surface"}`}>
                              {route.label.toUpperCase()}
                            </span>
                            <span className={`text-body-sm ${route.highlight ? "text-primary font-medium" : "text-on-surface-variant"}`}>{route.sublabel}</span>
                          </div>
                          <span className={`font-numeric-balance-lg text-[22px] font-bold ${route.highlight ? "text-primary" : "text-on-surface"}`}>
                            {route.highlight ? "+" : ""}{formatMoney(route.amount, currency)}
                          </span>
                        </div>

                        <div className="bg-surface-container-low/70 rounded-xl p-3 flex items-center justify-between gap-2 border border-outline-variant/30">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-10 h-10 rounded-full bg-surface-container-highest text-on-surface font-bold text-sm flex items-center justify-center shrink-0">
                              {route.payer.initials}
                            </div>
                            <div className="truncate">
                              <div className="font-title-md text-[14px] text-on-surface font-semibold truncate">{route.payer.name}</div>
                              <div className={`text-[11px] font-medium ${route.highlight ? "text-tertiary" : "text-on-surface-variant"}`}>{route.payer.role}</div>
                            </div>
                          </div>
                          <div className="flex flex-col items-center px-2 shrink-0">
                            <span className="font-numeric-balance-md text-[12px] font-bold text-primary bg-surface-container-lowest px-2 py-0.5 rounded-full shadow-sm border border-outline-variant/40">
                              {formatMoney(route.amount, currency)}
                            </span>
                            <span className="material-symbols-outlined text-[18px] text-primary mt-0.5">trending_flat</span>
                          </div>
                          <div className="flex items-center gap-2.5 min-w-0 justify-end text-right">
                            <div className="truncate">
                              <div className="font-title-md text-[14px] text-on-surface font-semibold truncate">{route.receiver.name}</div>
                              <div className={`text-[11px] font-medium ${route.highlight ? "text-primary" : "text-on-surface-variant"}`}>{route.receiver.role}</div>
                            </div>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${route.highlight ? "bg-primary text-on-primary" : "bg-surface-container-highest text-on-surface"}`}>
                              {route.receiver.initials}
                            </div>
                          </div>
                        </div>

                        <p className="font-body-sm text-[13px] text-on-surface-variant">{route.description}</p>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-outline-variant/40">
                        {route.payer.id === myUserId ? (
                          <button
                            className="flex-1 bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container py-2 rounded-lg font-title-md text-[13px] transition-colors flex items-center justify-center gap-1 font-semibold disabled:opacity-60"
                            type="button"
                            disabled={submitting}
                            onClick={() => markReceived(route)}
                          >
                            <span className="material-symbols-outlined text-[16px]">verified</span>
                            <span>Record Payment</span>
                          </button>
                        ) : route.receiver.id === myUserId ? (
                          <button
                            className="flex-1 bg-primary-container/20 hover:bg-primary-container text-on-primary-container px-3 py-2 rounded-lg font-title-md text-[13px] transition-colors flex items-center justify-center gap-1 disabled:opacity-60"
                            type="button"
                            disabled={submitting}
                            onClick={() => openSettleModal(route.payer.name, route.receiver.name, (route.amount / 100).toFixed(2), route.payer.id, route.receiver.id)}
                          >
                            <span className="material-symbols-outlined text-[16px]">account_balance_wallet</span>
                            <span>Settle Up</span>
                          </button>
                        ) : (
                          <button
                            className="flex-1 bg-surface-container-low hover:bg-surface-container-high text-on-surface py-2 rounded-lg font-title-md text-[13px] transition-colors flex items-center justify-center gap-1 disabled:opacity-60"
                            type="button"
                            disabled={submitting}
                            onClick={() => openSettleModal(route.payer.name, route.receiver.name, (route.amount / 100).toFixed(2), route.payer.id, route.receiver.id)}
                          >
                            <span className="material-symbols-outlined text-[16px] text-primary">sync_alt</span>
                            <span>Record Transfer</span>
                          </button>
                        )}
                        <button
                          className="px-3 py-2 bg-surface-container-low hover:bg-surface-container-high text-on-surface rounded-lg font-title-md text-[13px] transition-colors flex items-center justify-center gap-1"
                          type="button"
                          onClick={() => showToast(`Nudge sent to ${route.payer.name}`, "notifications_active")}
                        >
                          <span className="material-symbols-outlined text-[16px] text-secondary">send_to_mobile</span>
                          <span>Nudge</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {routes.length === 0 && (
              <section className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-8 text-center shadow-sm">
                <span className="material-symbols-outlined text-[48px] text-primary mb-2">check_circle</span>
                <h3 className="font-headline-md text-headline-md text-on-surface">All settled up!</h3>
                <p className="text-body-sm text-on-surface-variant mt-1">No outstanding balances to resolve.</p>
              </section>
            )}

            {/* Section 2: Member Ledger */}
            <section className="flex flex-col gap-space-sm mt-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs px-1">
                <div className="flex items-center gap-space-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary-container" />
                  <h2 className="font-headline-md text-headline-md text-on-surface tracking-tight">Member Ledger & Net Position</h2>
                </div>
                <div className="flex items-center gap-3 text-body-sm text-on-surface-variant">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary-container" /> {creditors} Creditor{creditors !== 1 ? "s" : ""}</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-tertiary-container" /> {debtors} Debtor{debtors !== 1 ? "s" : ""}</span>
                  <span className="text-outline font-mono">Gross: {formatMoney(totalFronted, currency)}</span>
                </div>
              </div>

              <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-container-low/70 border-b border-outline-variant/40 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                        <th className="py-3 px-4">Member</th>
                        <th className="py-3 px-4 text-right">Fronted</th>
                        <th className="py-3 px-4 text-right">Consumed</th>
                        <th className="py-3 px-5 text-right">Net Standing</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/30 font-body-sm">
                      {members.map((m) => (
                        <tr className={`transition-colors ${m.id === myUserId ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-surface-container-low/40"}`} key={m.id}>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-full font-bold text-xs flex items-center justify-center ${m.id === myUserId ? "bg-primary text-on-primary shadow-sm" : "bg-surface-container-highest text-on-surface"}`}>
                                {m.avatarEmoji || getInitials(m.name)}
                              </div>
                              <div>
                                <div className={`font-title-md text-[14px] text-on-surface flex items-center gap-1.5 ${m.id === myUserId ? "font-bold" : "font-semibold"}`}>
                                  <span>{m.name}</span>
                                  {m.role && <span className="px-1.5 py-0.5 rounded bg-surface-container-high text-[10px] text-on-surface-variant font-medium">{m.role}</span>}
                                  {m.id === myUserId && <span className="px-1.5 py-0.5 rounded bg-primary-container text-[10px] text-on-primary font-semibold">You</span>}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-right font-numeric-balance-md text-on-surface font-medium">{formatMoney(m.totalPaid || 0, currency)}</td>
                          <td className="py-3.5 px-4 text-right font-numeric-balance-md text-on-surface-variant">{formatMoney(m.totalConsumed || 0, currency)}</td>
                          <td className="py-3.5 px-5 text-right">
                            <div className="inline-flex flex-col items-end">
                              <span className={`font-numeric-balance-lg text-[18px] font-bold ${(m.net || 0) >= 0 ? "text-primary" : "text-tertiary"}`}>
                                {(m.net || 0) >= 0 ? "+" : ""}{formatMoney(m.net || 0, currency)}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${(m.net || 0) >= 0 ? "bg-primary-container/20 text-on-primary-container" : "bg-tertiary-container/20 text-on-tertiary-container"}`}>
                                {(m.net || 0) >= 0 ? "To Receive" : "Owed"}
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            {(m.net || 0) < 0 && (() => {
                              const debtRoute = routes.find((r) => r.payer.id === m.id);
                              if (!debtRoute) return null;
                              return (
                                <button
                                  className="bg-surface-container-low hover:bg-surface-container-high text-on-surface px-3 py-1.5 rounded-lg font-title-md text-[12px] transition-colors inline-flex items-center gap-1 disabled:opacity-60"
                                  type="button"
                                  disabled={submitting}
                                  onClick={() => markReceived(debtRoute)}
                                >
                                  <span className="material-symbols-outlined text-[14px] text-primary">done</span>
                                  <span>Clear {formatMoney(m.net, currency)}</span>
                                </button>
                              );
                            })()}
                            {(m.net || 0) > 0 && m.id !== myUserId && (
                              <button
                                className="bg-surface-container-low hover:bg-surface-container-high text-on-surface px-3 py-1.5 rounded-lg font-title-md text-[12px] transition-colors inline-flex items-center gap-1"
                                type="button"
                                onClick={() => showToast(`Nudge sent to debtors of ${m.name}`, "campaign")}
                              >
                                <span className="material-symbols-outlined text-[14px] text-secondary">campaign</span>
                                <span>Nudge Debtors</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-surface-container-low/90 font-semibold border-t border-outline-variant/40 text-on-surface">
                        <td className="py-3 px-4 font-title-md text-[13px]">Totals ({members.length} Members)</td>
                        <td className="py-3 px-4 text-right font-numeric-balance-md text-[14px]">{formatMoney(totalFronted, currency)}</td>
                        <td className="py-3 px-4 text-right font-numeric-balance-md text-[14px]">{formatMoney(totalConsumed, currency)}</td>
                        <td className="py-3 px-5 text-right font-numeric-balance-md text-primary font-bold text-[15px]">{formatMoney(0, currency)} (Zero-Sum)</td>
                        <td className="py-3 px-4 text-right text-[12px] text-on-surface-variant">All balances bounded</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* Settle Up Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-sm flex items-center justify-center p-margin" onClick={closeModal}>
          <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-xl p-space-lg flex flex-col gap-space-md border border-outline-variant/60" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">credit_card</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Confirm Settlement</h3>
              </div>
              <button className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-on-surface" type="button" onClick={closeModal}>
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col gap-space-xs">
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Settlement Details</span>
              <div className="flex items-center justify-between text-on-surface mt-1">
                <span className="font-body-md text-body-md font-semibold">From: {modal.payer}</span>
                <span className="material-symbols-outlined text-[16px] text-primary">arrow_forward</span>
                <span className="font-body-md text-body-md font-semibold">To: {modal.recipient}</span>
              </div>
              <div className="mt-2 text-center py-3 bg-surface-container-lowest rounded-xl border border-outline-variant/40">
                <span className="font-body-sm text-body-sm text-on-surface-variant">Amount:</span>
                <div className="font-numeric-balance-lg text-headline-lg text-primary font-bold">{formatMoney(parseFloat(modal.amount) * 100, currency)}</div>
              </div>
            </div>

            <div className="flex items-center gap-space-sm mt-2">
              <button className="flex-1 bg-surface-container-low hover:bg-surface-container text-on-surface py-2.5 rounded-xl font-title-md text-body-sm transition-colors" type="button" onClick={closeModal}>Cancel</button>
              <button className="flex-1 bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container py-2.5 rounded-xl font-title-md text-body-sm shadow-sm transition-all flex items-center justify-center gap-1 font-semibold disabled:opacity-60" type="button" disabled={submitting} onClick={executeSettle}>
                <span className="material-symbols-outlined text-[16px]">check</span>
                <span>{submitting ? "Recording..." : "Record Settlement"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-space-md py-space-sm rounded-xl shadow-lg flex items-center gap-space-sm animate-in slide-in-from-bottom duration-300">
          <span className="material-symbols-outlined text-[20px] text-primary-fixed">{toast.icon}</span>
          <span className="font-body-md text-body-md">{toast.message}</span>
        </div>
      )}
    </AppLayout>
  );
}