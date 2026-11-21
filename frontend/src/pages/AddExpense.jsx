import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import GroupHeader from "../components/layout/GroupHeader";
import { groupService, expenseService } from "../services";
import { useAuth } from "../context/AuthContext";

const CATEGORIES = [
  { id: "Groceries", icon: "local_grocery_store" },
  { id: "Dining & Drinks", icon: "restaurant" },
  { id: "Lodging", icon: "hotel" },
  { id: "Transit", icon: "directions_car" },
  { id: "Activities", icon: "attractions" },
  { id: "Other", icon: "receipt_long" },
];

const STEPS = [
  { id: 1, icon: "receipt_long", title: "Core Outlay", desc: "Merchant, amount & category" },
  { id: 2, icon: "pie_chart", title: "Split", desc: "Choose who shares & how" },
  { id: 3, icon: "publish", title: "Review", desc: "Confirm & publish" },
];

const fmt = (amountMinor, currency = "INR") => {
  const major = (amountMinor || 0) / 100;
  try {
    return major.toLocaleString("en-IN", { style: "currency", currency });
  } catch {
    return `${currency} ${major.toFixed(2)}`;
  }
};

export default function AddExpense() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const presetGroupId = location.state?.groupId || null;

  const [groups, setGroups] = useState([]);
  const [groupId, setGroupId] = useState(presetGroupId);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);

  // Form fields
  const [merchant, setMerchant] = useState("");
  const [title, setTitle] = useState("");
  const [amountMajor, setAmountMajor] = useState("");
  const [category, setCategory] = useState("Groceries");
  const [paidBy, setPaidBy] = useState(null);
  const [splitMode, setSplitMode] = useState("equal");
  // participants: { userId, name, included, weight }
  const [participants, setParticipants] = useState([]);

  // Load groups on mount
  useEffect(() => {
    let active = true;
    groupService
      .list()
      .then((gs) => {
        if (!active) return;
        setGroups(gs);
        if (!presetGroupId && gs.length) setGroupId(gs[0]._id);
      })
      .catch((err) => {
        if (active) setError(err?.response?.data?.error?.message || "Failed to load groups");
      });
    return () => {
      active = false;
    };
  }, [presetGroupId]);

  // Load members when groupId changes
  useEffect(() => {
    if (!groupId) return;
    let active = true;
    setLoading(true);
    groupService
      .members(groupId)
      .then((ms) => {
        if (!active) return;
        setMembers(ms);
        setParticipants(ms.map((m) => ({ userId: m.id, name: m.name, included: true, weight: 1 })));
        setPaidBy(ms[0]?.id || null);
      })
      .catch((err) => {
        if (active) setError(err?.response?.data?.error?.message || "Failed to load members");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [groupId]);

  const selectedGroup = groups.find((g) => g._id === groupId) || null;
  const currency = selectedGroup?.currency || "INR";

  const amountMinor = Math.round((parseFloat(amountMajor) || 0) * 100);

  const includedMembers = participants.filter((p) => p.included);

  // Compute preview shares
  const shares = useMemo(() => {
    if (!amountMinor || includedMembers.length === 0) return [];
    if (splitMode === "weighted") {
      const totalWeight = includedMembers.reduce((s, p) => s + (p.weight || 0), 0) || 1;
      return includedMembers.map((p) => ({
        userId: p.userId,
        name: p.name,
        amount: Math.round((amountMinor * (p.weight || 0)) / totalWeight),
        weight: p.weight,
      }));
    }
    // equal
    const base = Math.floor(amountMinor / includedMembers.length);
    let remainder = amountMinor - base * includedMembers.length;
    return includedMembers.map((p) => {
      const extra = remainder > 0 ? 1 : 0;
      if (remainder > 0) remainder -= 1;
      return { userId: p.userId, name: p.name, amount: base + extra, weight: 1 };
    });
  }, [amountMinor, includedMembers, splitMode]);

  const toggleParticipant = (userId) => {
    setParticipants((prev) =>
      prev.map((p) => (p.userId === userId ? { ...p, included: !p.included } : p)),
    );
  };

  const setWeight = (userId, weight) => {
    setParticipants((prev) =>
      prev.map((p) => (p.userId === userId ? { ...p, weight } : p)),
    );
  };

  const validate = () => {
    if (!groupId) return "Select a group first.";
    if (!amountMinor || amountMinor <= 0) return "Enter an amount greater than 0.";
    if (!paidBy) return "Select who paid.";
    if (includedMembers.length === 0) return "Select at least one person to split with.";
    return "";
  };

  const publish = async () => {
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const payload = {
        title: title.trim() || merchant.trim() || "Expense",
        merchant: merchant.trim(),
        amount: amountMinor,
        currency,
        category,
        paidBy,
        splitMode: splitMode === "weighted" ? "weighted" : "equal",
        participants: shares.map((s) => ({
          userId: s.userId,
          ...(splitMode === "weighted" ? { weight: s.weight } : {}),
        })),
      };
      const expense = await expenseService.create(groupId, payload);
      navigate("/group-expenses", {
        state: { groupId, expenseId: expense._id },
        replace: true,
      });
    } catch (err) {
      setError(err?.response?.data?.error?.message || "Failed to create expense");
      setSubmitting(false);
    }
  };

  if (loading && !selectedGroup) {
    return (
      <AppLayout>
        <div className="p-10 text-center text-on-surface-variant">Loading…</div>
      </AppLayout>
    );
  }

  if (!groups.length && !loading) {
    return (
      <AppLayout>
        <div className="p-10 text-center">
          <p className="text-on-surface font-semibold mb-2">You need a group first</p>
          <p className="text-on-surface-variant text-sm mb-4">Create a group before adding expenses.</p>
          <Link to="/create-group" className="inline-block px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold">
            Create Group
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="bg-background font-body-md text-on-surface antialiased min-h-screen">
        <main className="w-full pb-24">
          <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6 pt-4">
            <GroupHeader
              title="Add Group Expense"
              subtitle="Record an outlay, choose how to split it, and publish to the shared ledger."
              icon="receipt_long"
              iconLabel="New Expense"
              currentLabel={selectedGroup ? selectedGroup.name : "New Expense"}
              breadcrumbs={[{ label: "Groups", to: "/groups", icon: "grid_view" }]}
            />

            {error && (
              <div className="px-4 py-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">{error}</div>
            )}

            {/* Group selector */}
            <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-slate-200">
              <label className="block text-xs font-bold text-on-surface mb-1.5">Group</label>
              <select
                className="w-full bg-surface-container-low rounded-xl px-3 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={groupId || ""}
                onChange={(e) => setGroupId(e.target.value)}
              >
                {groups.map((g) => (
                  <option key={g._id} value={g._id}>
                    {g.icon} {g.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Stepper */}
            <div className="grid grid-cols-3 gap-2">
              {STEPS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setStep(s.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-left transition-all ${
                    step === s.id
                      ? "bg-primary-fixed/30 shadow-sm"
                      : step > s.id
                      ? "bg-surface-container-low"
                      : "bg-surface-container-low/50 opacity-70"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${step >= s.id ? "bg-primary-container text-on-primary-container" : "bg-surface-container text-on-surface-variant"}`}>
                    <span className="material-symbols-outlined text-[18px]">{step > s.id ? "check" : s.icon}</span>
                  </div>
                  <span className={`text-sm truncate ${step === s.id ? "font-bold text-on-surface" : "text-on-surface-variant"}`}>{s.title}</span>
                </button>
              ))}
            </div>

            {/* STEP 1 */}
            {step === 1 && (
              <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">Title</label>
                  <input
                    className="w-full bg-surface-container-low rounded-xl px-3 py-2.5 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="e.g. Dinner at Taj"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">Merchant / Note</label>
                  <input
                    className="w-full bg-surface-container-low rounded-xl px-3 py-2.5 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="e.g. Trader Joe's"
                    value={merchant}
                    onChange={(e) => setMerchant(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1">Amount ({currency})</label>
                    <input
                      className="w-full bg-surface-container-low rounded-xl px-3 py-2.5 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="0.00"
                      type="number"
                      min="0"
                      step="0.01"
                      value={amountMajor}
                      onChange={(e) => setAmountMajor(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1">Paid by</label>
                    <select
                      className="w-full bg-surface-container-low rounded-xl px-3 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      value={paidBy || ""}
                      onChange={(e) => setPaidBy(e.target.value)}
                    >
                      {members.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                          {m.id === user?._id ? " (You)" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1.5">Category</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {CATEGORIES.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setCategory(c.id)}
                        className={`flex items-center gap-2 p-2.5 rounded-xl text-sm transition-all ${
                          category === c.id ? "bg-primary-fixed/30 text-primary font-semibold" : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px]">{c.icon}</span>
                        {c.id}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-on-surface">Split between</h3>
                  <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-full">
                    {["equal", "weighted"].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setSplitMode(m)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all ${
                          splitMode === m ? "bg-surface-container-lowest text-primary shadow-sm" : "text-on-surface-variant"
                        }`}
                      >
                        {m === "equal" ? "Equal" : "Weighted"}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {participants.map((p) => {
                    const share = shares.find((s) => s.userId === p.userId);
                    return (
                      <div key={p.userId} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-surface-container-low">
                        <div className="flex items-center gap-3 min-w-0">
                          <button
                            type="button"
                            onClick={() => toggleParticipant(p.userId)}
                            className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${p.included ? "bg-emerald-500 text-white" : "bg-surface-container-highest text-outline"}`}
                          >
                            <span className="material-symbols-outlined text-[16px]">{p.included ? "check" : "close"}</span>
                          </button>
                          <span className="text-sm text-on-surface truncate">{p.name}</span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          {splitMode === "weighted" && p.included && (
                            <input
                              type="number"
                              min="0.1"
                              step="0.1"
                              value={p.weight}
                              onChange={(e) => setWeight(p.userId, Math.max(0.1, parseFloat(e.target.value) || 1))}
                              className="w-20 bg-surface-container-lowest rounded-lg px-2 py-1 text-sm text-on-surface border border-slate-200 focus:outline-none"
                            />
                          )}
                          <span className={`text-sm font-bold font-mono ${p.included ? "text-emerald-700" : "text-outline line-through"}`}>
                            {p.included && share ? fmt(share.amount, currency) : "—"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col gap-4">
                <h3 className="font-bold text-on-surface">Review &amp; Publish</h3>
                <div className="p-4 rounded-2xl bg-surface-container-low flex flex-col gap-2 text-sm">
                  <div className="flex justify-between"><span className="text-on-surface-variant">Group</span><span className="font-semibold text-on-surface">{selectedGroup?.name}</span></div>
                  <div className="flex justify-between"><span className="text-on-surface-variant">Title</span><span className="font-semibold text-on-surface">{title || merchant || "Expense"}</span></div>
                  <div className="flex justify-between"><span className="text-on-surface-variant">Amount</span><span className="font-semibold text-on-surface">{fmt(amountMinor, currency)}</span></div>
                  <div className="flex justify-between"><span className="text-on-surface-variant">Category</span><span className="font-semibold text-on-surface">{category}</span></div>
                  <div className="flex justify-between"><span className="text-on-surface-variant">Paid by</span><span className="font-semibold text-on-surface">{members.find((m) => m.id === paidBy)?.name || "—"}</span></div>
                  <div className="flex justify-between"><span className="text-on-surface-variant">Split</span><span className="font-semibold text-on-surface capitalize">{splitMode} • {includedMembers.length} people</span></div>
                </div>
                <div className="flex flex-col gap-1.5">
                  {shares.map((s) => (
                    <div key={s.userId} className="flex justify-between text-sm px-2 py-1 rounded-lg bg-surface-container-lowest">
                      <span className="text-on-surface">{s.name}</span>
                      <span className="font-mono font-semibold text-on-surface">{fmt(s.amount, currency)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nav buttons */}
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => (step > 1 ? setStep(step - 1) : navigate(-1))}
                className="px-4 py-2.5 rounded-xl bg-surface-container text-on-surface text-sm font-semibold hover:bg-surface-container-high transition-colors inline-flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                {step > 1 ? "Back" : "Cancel"}
              </button>
              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => {
                    if (step === 1) {
                      const v = !amountMinor || amountMinor <= 0 ? "Enter an amount greater than 0." : "";
                      if (v) {
                        setError(v);
                        return;
                      }
                      setError("");
                    }
                    setStep(step + 1);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-all shadow-sm inline-flex items-center gap-2"
                >
                  Continue
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={publish}
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-all shadow-sm inline-flex items-center gap-2 disabled:opacity-60"
                >
                  <span className="material-symbols-outlined text-[18px]">task_alt</span>
                  {submitting ? "Publishing…" : "Publish Expense"}
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </AppLayout>
  );
}