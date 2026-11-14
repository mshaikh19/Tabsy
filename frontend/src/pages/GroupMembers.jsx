import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import GroupHeader from "../components/layout/GroupHeader";

export default function GroupMembers() {
  const [toastOpen, setToastOpen] = useState(false);
  const [toastHeader, setToastHeader] = useState("Action dispatched");
  const [toastMessage, setToastMessage] = useState("Update successfully broadcast to ledger.");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortVal, setSortVal] = useState("default");
  const [activeFilter, setActiveFilter] = useState("all");
  const [nudgeStates, setNudgeStates] = useState({});

  const members = useMemo(() => [
    {
      id: "alex-morgan",
      initials: "AM",
      name: "Alex Morgan",
      tag: "YOU",
      roles: ["Organizer", "Admin"],
      email: "alex.m@tahoecamp.org",
      roleDesc: "Trip Creator & Master Ledger Holder",
      balance: 140,
      balanceLabel: "Net Surplus",
      balanceColor: "text-primary",
      badgeColor: "bg-primary text-on-primary font-bold",
      category: ["surplus", "admin"],
      fronted: "$980.00",
      frontedNote: "Airbnb & Provisions",
      share: "$480.00",
      shareNote: "Full 3-day itinerary",
      exclusions: "None",
      exclusionsNote: "Participating in all",
      receipts: "3 Receipts",
      receiptsColor: "text-secondary",
      receiptsVerified: "100% Verified",
      receiptsVerifiedColor: "text-primary font-medium",
      actionText: "Receives $80 from Sarah L. & $50 from Kim S.",
      actionIcon: "verified",
      actionColor: "text-primary",
      action2Label: "View 3 Receipts",
      action2Variant: "outline",
      action3Label: "Request Settle",
      action3Variant: "primary",
    },
    {
      id: "marco-rossi",
      initials: "MR",
      name: "Marco Rossi",
      tag: null,
      roles: ["Admin", "Lift Pass Lead"],
      email: "m.rossi@skyline.dev",
      roleDesc: "Group Pass Coordinator",
      balance: 420,
      balanceLabel: "Top Surplus",
      balanceColor: "text-primary",
      badgeColor: "bg-secondary-fixed text-on-secondary-fixed",
      category: ["surplus", "admin"],
      fronted: "$1,630.00",
      frontedNote: "Lift Tickets & Gear",
      share: "$480.00",
      shareNote: "Individual consumption",
      exclusions: "None",
      exclusionsNote: "All days skied",
      receipts: "4 Receipts",
      receiptsColor: "text-secondary",
      receiptsVerified: "Scanned & Attached",
      receiptsVerifiedColor: "text-primary font-medium",
      actionText: "Receives $220 from Noah & $200 from Jason",
      actionIcon: "swap_horiz",
      actionColor: "text-secondary",
      action2Label: "View 4 Receipts",
      action2Variant: "outline",
      action3Label: "Remind Payers",
      action3Variant: "secondary",
    },
    {
      id: "sarah-lin",
      initials: "SL",
      name: "Sarah Lin",
      tag: null,
      roles: ["Member"],
      roleTag: "Custom: No Lift Pass (-$60)",
      roleTagVariant: "bg-surface-container text-tertiary border border-tertiary-container/30",
      email: "sarah.lin@petal.io",
      roleDesc: "Remote work day Friday, skipped group passes",
      balance: -80,
      balanceLabel: "Net Deficit",
      balanceColor: "text-tertiary",
      badgeColor: "bg-surface-container-low text-on-surface-variant",
      category: ["deficit", "custom"],
      fronted: "$340.00",
      frontedNote: "Dinner & Firewood",
      share: "$420.00",
      shareNote: "Saved $60 (No pass)",
      shareNoteColor: "text-primary font-medium",
      exclusions: "Ski Lift Pass tag",
      exclusionsVariant: "text-tertiary text-xs",
      exclusionsNote: "Auto-deducted",
      receipts: "1 Receipt",
      receiptsColor: "text-on-surface",
      receiptsVerified: "Trader Joe's",
      receiptsVerifiedColor: "text-on-surface-variant block",
      actionText: "Assigned to pay $80.00 directly to Alex Morgan",
      actionIcon: "arrow_forward",
      actionColor: "text-outline",
      action2Label: "View 1 Receipt",
      action2Variant: "outline",
      action3Label: "Send Gentle Nudge",
      action3Variant: "nudge",
    },
    {
      id: "kim-sato",
      initials: "KS",
      name: "Kim Sato",
      tag: null,
      roles: ["Member"],
      email: "ksato.99@gmail.com",
      roleDesc: "Snack run & road snacks contributor",
      balance: -50,
      balanceLabel: "Small Deficit",
      balanceColor: "text-tertiary",
      badgeColor: "bg-surface-container-low text-on-surface-variant",
      category: ["deficit"],
      fronted: "$430.00",
      frontedNote: "Gas, Tolls & Snacks",
      share: "$480.00",
      shareNote: "Full group split",
      exclusions: "None",
      exclusionsNote: "Equal split",
      receipts: "2 Receipts",
      receiptsColor: "text-on-surface",
      receiptsVerified: "Chevron & Safeway",
      receiptsVerifiedColor: "text-on-surface-variant block",
      actionText: "Assigned to pay $50.00 to Alex Morgan",
      actionIcon: "arrow_forward",
      actionColor: "text-outline",
      action2Label: "View Receipts",
      action2Variant: "outline",
      action3Label: "Send Gentle Nudge",
      action3Variant: "nudge",
    },
    {
      id: "jason-parker",
      initials: "JP",
      name: "Jason P.",
      tag: null,
      roles: ["Member"],
      email: "jason.parker@outlook.com",
      roleDesc: "Has not uploaded any receipts yet",
      balance: -210,
      balanceLabel: "Unsettled Deficit",
      balanceColor: "text-tertiary",
      badgeColor: "bg-surface-container-low text-on-surface-variant",
      category: ["deficit"],
      fronted: "$270.00",
      frontedNote: "Hot tub maintenance fee",
      share: "$480.00",
      shareNote: "Standard share",
      exclusions: "None",
      exclusionsNote: "Full split applied",
      receipts: "0 In Review",
      receiptsColor: "text-on-surface",
      receiptsVerified: "No pending items",
      receiptsVerifiedColor: "text-outline block",
      actionText: "Assigned to pay $200.00 directly to Marco Rossi",
      actionIcon: "arrow_forward",
      actionColor: "text-outline",
      action2Label: null,
      action2Variant: null,
      action3Label: "Send Gentle Nudge",
      action3Variant: "nudge",
    },
    {
      id: "noah-reed",
      initials: "NR",
      name: "Noah R.",
      tag: null,
      roles: ["Member"],
      roleTag: "Invite Joined via Link",
      roleTagVariant: "bg-secondary-fixed text-on-secondary-fixed",
      email: "noah.reed@hey.com",
      roleDesc: "Trip pool contributor",
      balance: -220,
      balanceLabel: "Highest Deficit",
      balanceColor: "text-tertiary",
      badgeColor: "bg-surface-container-highest text-on-surface",
      category: ["deficit"],
      fronted: "$260.00",
      frontedNote: "Breakfast catering",
      share: "$480.00",
      shareNote: "Full share",
      exclusions: "None",
      exclusionsNote: "Active",
      receipts: "1 Receipt",
      receiptsColor: "text-on-surface",
      receiptsVerified: "Bagel shop order",
      receiptsVerifiedColor: "text-on-surface-variant block",
      actionText: "Assigned to pay $220.00 directly to Marco Rossi",
      actionIcon: "arrow_forward",
      actionColor: "text-outline",
      action2Label: null,
      action2Variant: null,
      action3Label: "Send Gentle Nudge",
      action3Variant: "nudge",
    },
  ], []);

  const visibleMembers = useMemo(() => {
    let list = members.filter((m) => {
      const q = searchQuery.toLowerCase().trim();
      const name = m.name.toLowerCase();
      const text = (m.name + " " + m.email + " " + m.roleDesc + " " + m.actionText).toLowerCase();
      const matchesQuery = !q || name.includes(q) || text.includes(q);

      let matchesCategory = true;
      if (activeFilter === "surplus") matchesCategory = m.category.includes("surplus");
      else if (activeFilter === "deficit") matchesCategory = m.category.includes("deficit");
      else if (activeFilter === "admin") matchesCategory = m.category.includes("admin");
      else if (activeFilter === "custom") matchesCategory = m.category.includes("custom");

      return matchesQuery && matchesCategory;
    });

    if (sortVal === "surplus-high") list.sort((a, b) => b.balance - a.balance);
    else if (sortVal === "owed-high") list.sort((a, b) => a.balance - b.balance);
    else if (sortVal === "alpha") list.sort((a, b) => a.name.localeCompare(b.name));

    return list;
  }, [members, searchQuery, sortVal, activeFilter]);

  const triggerToast = (header, msg) => {
    setToastHeader(header);
    setToastMessage(msg);
    setToastOpen(true);
    setTimeout(() => setToastOpen(false), 3200);
  };

  const copyInvite = () => {
    const url = "https://tabsy.me/join/tahoe-ski-449x";
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
      "lift-lead": "bg-surface-container-high text-on-surface",
      member: "bg-surface-container-low text-on-surface-variant",
      custom: "bg-surface-container text-tertiary border border-tertiary-container/30",
      "invite-link": "bg-secondary-fixed text-on-secondary-fixed",
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

  return (
    <AppLayout>
      <div className="bg-[#FAF8F5] font-body-md text-on-surface antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
        <main className="w-full pt-0 pb-24 bg-[#FAF8F5] min-h-screen">
          <div className="max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
            <GroupHeader
              title="Tahoe Ski Weekend ❄️"
              subtitle="6 friends shredding Heavenly & Kirkwood. Cabin split, collective grocery pool, and simplified end-of-trip payouts."
              currentLabel="Group Members"
              actions={
                <>
                  <Link className="group/btn relative inline-flex items-center gap-0 px-2.5 py-2 text-on-surface font-title-md text-title-md hover:bg-surface-container-lowest rounded-lg transition-all duration-300 ease-out overflow-hidden" to="/group-expenses">
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover/btn:text-primary transition-colors shrink-0">receipt_long</span>
                    <span className="max-w-0 group-hover/btn:max-w-[120px] group-hover/btn:ml-2 overflow-hidden whitespace-nowrap transition-all duration-300 ease-out opacity-0 group-hover/btn:opacity-100">
                      View Expenses
                    </span>
                  </Link>
                  <div className="w-px h-5 bg-outline-variant/40 shrink-0 transition-all duration-300 group-hover/actions:bg-transparent" />
                  <Link className="group/btn inline-flex items-center gap-0 px-2.5 py-2 bg-primary-container text-on-primary-container font-title-md text-title-md hover:opacity-95 rounded-lg transition-all duration-300 ease-out overflow-hidden" to="/group-balances">
                    <span className="material-symbols-outlined text-[18px] shrink-0">bolt</span>
                    <span className="max-w-0 group-hover/btn:max-w-[140px] group-hover/btn:ml-2 overflow-hidden whitespace-nowrap transition-all duration-300 ease-out opacity-0 group-hover/btn:opacity-100">
                      Settle Balances
                    </span>
                  </Link>
                  <div className="w-px h-5 bg-outline-variant/40 shrink-0 transition-all duration-300 group-hover/actions:bg-transparent" />
                  <Link className="group/btn inline-flex items-center gap-0 px-2.5 py-2 bg-primary-container text-on-primary-container font-title-md text-title-md hover:opacity-95 rounded-lg transition-all duration-300 ease-out overflow-hidden" to="/group-members/manage">
                    <span className="material-symbols-outlined text-[18px] shrink-0">tune</span>
                    <span className="max-w-0 group-hover/btn:max-w-[140px] group-hover/btn:ml-2 overflow-hidden whitespace-nowrap transition-all duration-300 ease-out opacity-0 group-hover/btn:opacity-100">
                      Manage Split
                    </span>
                  </Link>
                  <div className="w-px h-5 bg-outline-variant/40 shrink-0 transition-all duration-300 group-hover/actions:bg-transparent" />
                  <Link className="group/btn inline-flex items-center gap-0 px-2.5 py-2 text-on-surface font-title-md text-title-md hover:bg-surface-container-lowest rounded-lg transition-all duration-300 ease-out overflow-hidden" to="/group-members/add">
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
                    <span className="text-[11px] font-semibold text-primary uppercase tracking-wider bg-primary-fixed/40 px-2 py-0.5 rounded-md">Balanced</span>
                  </div>
                  <div className="bg-surface-container-low p-3 rounded-xl border border-surface-container flex flex-col gap-2.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-on-surface-variant font-medium">Surplus Fronted (2 Members)</span>
                      <span className="font-bold text-primary">+$560.00</span>
                    </div>
                    <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden flex">
                      <div className="bg-primary h-full rounded-full" style={{ width: "70%" }}></div>
                      <div className="bg-primary-container h-full rounded-full" style={{ width: "30%" }}></div>
                    </div>
                    <div className="flex justify-between items-center text-xs pt-1 border-t border-surface-container">
                      <span className="text-on-surface-variant font-medium">Deficit Absorbed (4 Members)</span>
                      <span className="font-bold text-tertiary">-$560.00</span>
                    </div>
                    <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden flex">
                      <div className="bg-tertiary h-full rounded-full" style={{ width: "39%" }}></div>
                      <div className="bg-tertiary-container h-full rounded-full" style={{ width: "37%" }}></div>
                      <div className="bg-tertiary-fixed-dim h-full rounded-full" style={{ width: "15%" }}></div>
                      <div className="bg-tertiary-fixed h-full rounded-full" style={{ width: "9%" }}></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="p-2.5 rounded-xl bg-primary-fixed/25 border border-primary-fixed-dim/40 flex flex-col items-center">
                      <span className="text-[10px] uppercase font-bold text-primary tracking-wide">Net Surplus</span>
                      <span className="text-sm font-bold text-primary mt-0.5">Marco & You</span>
                      <span className="text-[11px] text-on-surface-variant font-medium">+$420 / +$140</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-error-container/30 border border-error-container/60 flex flex-col items-center">
                      <span className="text-[10px] uppercase font-bold text-tertiary tracking-wide">Net Debts</span>
                      <span className="text-sm font-bold text-tertiary mt-0.5">4 Unsettled</span>
                      <span className="text-[11px] text-on-surface-variant font-medium">Noah, Jason, Sarah, Kim</span>
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
                    <span className="text-[10px] font-bold bg-secondary-fixed text-on-secondary-fixed px-2 py-0.5 rounded-full">4 Steps</span>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Algorithmic debt compression resolves all 6 multi-receipt balances with zero daisy chains:
                  </p>
                  <div className="flex flex-col gap-2" id="settlementFlowList">
                    <div className="bg-surface-container-low hover:bg-surface-container transition-colors p-3 rounded-xl border border-surface-container flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-md bg-surface-container-highest text-on-surface text-[10px] font-bold flex items-center justify-center">NR</div>
                        <span className="text-xs font-semibold text-on-surface">Noah R.</span>
                        <span className="material-symbols-outlined text-[15px] text-secondary">trending_flat</span>
                        <div className="w-6 h-6 rounded-md bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold flex items-center justify-center">MR</div>
                        <span className="text-xs font-semibold text-on-surface">Marco R.</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-on-surface block">$220.00</span>
                        <span className="text-[10px] text-outline">Lift & cabin</span>
                      </div>
                    </div>
                    <div className="bg-surface-container-low hover:bg-surface-container transition-colors p-3 rounded-xl border border-surface-container flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-md bg-tertiary-fixed text-on-tertiary-fixed-variant text-[10px] font-bold flex items-center justify-center">JP</div>
                        <span className="text-xs font-semibold text-on-surface">Jason P.</span>
                        <span className="material-symbols-outlined text-[15px] text-secondary">trending_flat</span>
                        <div className="w-6 h-6 rounded-md bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold flex items-center justify-center">MR</div>
                        <span className="text-xs font-semibold text-on-surface">Marco R.</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-on-surface block">$200.00</span>
                        <span className="text-[10px] text-outline">Direct balance</span>
                      </div>
                    </div>
                    <div className="bg-surface-container-low hover:bg-surface-container transition-colors p-3 rounded-xl border border-surface-container flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-md bg-surface-container-highest text-on-surface text-[10px] font-bold flex items-center justify-center">SL</div>
                        <span className="text-xs font-semibold text-on-surface">Sarah L.</span>
                        <span className="material-symbols-outlined text-[15px] text-primary">trending_flat</span>
                        <div className="w-6 h-6 rounded-md bg-primary-fixed text-on-primary-fixed text-[10px] font-bold flex items-center justify-center">AM</div>
                        <span className="text-xs font-semibold text-on-surface">You</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-on-surface block">$80.00</span>
                        <span className="text-[10px] text-outline">Excl. pass</span>
                      </div>
                    </div>
                    <div className="bg-surface-container-low hover:bg-surface-container transition-colors p-3 rounded-xl border border-surface-container flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-md bg-surface-container text-on-surface-variant text-[10px] font-bold flex items-center justify-center">KS</div>
                        <span className="text-xs font-semibold text-on-surface">Kim S.</span>
                        <span className="material-symbols-outlined text-[15px] text-primary">trending_flat</span>
                        <div className="w-6 h-6 rounded-md bg-primary-fixed text-on-primary-fixed text-[10px] font-bold flex items-center justify-center">AM</div>
                        <span className="text-xs font-semibold text-on-surface">You</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-on-surface block">$50.00</span>
                        <span className="text-[10px] text-outline">Groceries bal</span>
                      </div>
                    </div>
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
                    <button className="bg-surface-container-low hover:bg-surface-container-high text-on-surface border border-surface-container rounded-xl py-2 px-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors" id="dispatchVenmoBtn" type="button" onClick={() => triggerToast("Venmo Deep-Links Prepped", "Generated 4 QR deep-links for Noah, Jason, Sarah, Kim.")}>
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
                    members.forEach((m) => { next[m.id] = true; });
                    setNudgeStates(next);
                    triggerToast("Batch Nudges Sent", "Push notification alerts dispatched to all 4 unsettled members.");
                  }}>
                    <span className="material-symbols-outlined text-[16px]">forward_to_inbox</span>
                    <span>Send Nudge to 4 Deficit Members</span>
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
                    <span className="text-[10px] text-primary font-bold bg-primary-fixed/30 px-2 py-0.5 rounded-md">2 Admins</span>
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
                        <span className="font-semibold text-on-surface">Notify on Large Debts (&gt; $150)</span>
                        <span className="text-[10px] text-on-surface-variant">Weekly digest reminders triggered</span>
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
                        <option value="surplus-high">Highest Surplus (+$)</option>
                        <option value="owed-high">Highest Owed (-$)</option>
                        <option value="alpha">Alphabetical (A - Z)</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1" id="filterPillGroup">
                    <button className={pillClasses("all")} data-filter="all" onClick={() => setActiveFilter("all")}>All 6 Roster Members</button>
                    <button className={pillClasses("surplus")} data-filter="surplus" onClick={() => setActiveFilter("surplus")}>In Surplus (+2)</button>
                    <button className={pillClasses("deficit")} data-filter="deficit" onClick={() => setActiveFilter("deficit")}>In Deficit (-4)</button>
                    <button className={pillClasses("admin")} data-filter="admin" onClick={() => setActiveFilter("admin")}>Group Admins (2)</button>
                    <button className={pillClasses("custom")} data-filter="custom" onClick={() => setActiveFilter("custom")}>Custom Exclusions (1)</button>
                  </div>
                </div>

                {/* Ledger Contribution Matrix List */}
                <div className="flex flex-col gap-3.5" id="memberMatrixList">
                  {visibleMembers.map((m) => {
                    const nudged = !!nudgeStates[m.id];
                    return (
                      <div key={m.id} className={`matrix-card bg-surface-container-lowest border border-surface-container-high rounded-2xl p-4 sm:p-5 shadow-[0_2px_8px_rgba(19,27,46,0.02)] transition-all flex flex-col gap-4 ${m.id === "alex-morgan" ? "hover:border-primary/40" : m.id === "marco-rossi" ? "hover:border-secondary/40" : "hover:border-outline-variant"}`} data-alpha={m.name.toLowerCase()} data-balance={m.balance} data-category={m.category.join(" ")} data-name={m.name.toLowerCase()}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-start sm:items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl font-bold text-base flex items-center justify-center shadow-sm shrink-0 border" style={{ backgroundColor: m.id === "alex-morgan" ? "#6ffbbe" : m.id === "marco-rossi" ? "#e1e0ff" : m.id === "sarah-lin" || m.id === "kim-sato" ? "#e2e7ff" : m.id === "jason-parker" ? "#ffdadb" : "#dae2fd", color: m.id === "alex-morgan" || m.id === "marco-rossi" ? "#ffffff" : "#131b2e", borderColor: m.id === "alex-morgan" ? "#4edea380" : m.id === "marco-rossi" ? "#c0c1ff80" : "transparent" }}>
                              {m.initials}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-base font-bold text-on-surface">{m.name}</span>
                                {m.tag && <span className={badgeClasses("you")}>{m.tag}</span>}
                                {m.roles.map((r, i) => (
                                  <span key={i} className={badgeClasses(r === "Admin" ? "admin" : r === "Organizer" ? "you" : r === "Lift Pass Lead" ? "lift-lead" : "member")}>{r}</span>
                                ))}
                                {m.roleTag && <span className={badgeClasses("custom") + " " + m.roleTagVariant}>{m.roleTag}</span>}
                              </div>
                              <div className="text-xs text-on-surface-variant flex items-center gap-1.5 mt-0.5">
                                <span>{m.email}</span>
                                <span>•</span>
                                <span className="text-outline">{m.roleDesc}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{m.balanceLabel}</span>
                            <span className={`text-base sm:text-lg font-bold font-numeric-balance-lg ${m.balanceColor} bg-${m.balanceColor === "text-primary" ? "primary-fixed" : "tertiary-fixed"}/30 border-${m.balanceColor === "text-primary" ? "primary-fixed-dim" : "tertiary-fixed-dim"}/40 px-3 py-1 rounded-xl`}>
                              {m.balance >= 0 ? "+" : ""}${m.balance.toFixed(2)}
                            </span>
                          </div>
                        </div>
                        <div className={`grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-surface-container-low p-3 rounded-xl border border-surface-container text-xs`}>
                          <div>
                            <span className="text-[10px] text-outline uppercase font-semibold block">Fronted Outlay</span>
                            <span className="font-bold text-on-surface text-sm">{m.fronted}</span>
                            <span className="text-[10px] text-on-surface-variant block mt-0.5">{m.frontedNote}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-outline uppercase font-semibold block">Equal Share Debit</span>
                            <span className="font-bold text-on-surface text-sm">{m.share}</span>
                            <span className={`text-[10px] block mt-0.5 ${m.shareNoteColor || "text-on-surface-variant"}`}>{m.shareNote}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-outline uppercase font-semibold block">Exclusions</span>
                            <span className={`font-semibold text-on-surface ${m.exclusionsVariant || ""}`}>{m.exclusions}</span>
                            <span className={`text-[10px] text-on-surface-variant block mt-0.5 ${m.exclusionsVariant ? "" : "text-on-surface-variant"}`}>{m.exclusionsNote}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-outline uppercase font-semibold block">Receipts Logged</span>
                            <span className={`font-bold ${m.receiptsColor} text-sm`}>{m.receipts}</span>
                            <span className={`text-[10px] ${m.receiptsVerifiedColor} block mt-0.5`}>{m.receiptsVerified}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <span className={`text-xs flex items-center gap-1 ${m.actionColor}`}>
                            <span className="material-symbols-outlined text-[15px]">{m.actionIcon}</span>
                            <span>{m.actionText}</span>
                          </span>
                          <div className="flex items-center gap-2">
                            {m.action2Label && (
                              <button className={`text-xs font-semibold px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface border border-surface-container transition-colors flex items-center gap-1`} type="button" onClick={() => triggerToast("Receipt Vault Opened", "Itemized OCR breakdown and receipt scans previewed.")}>
                                <span className="material-symbols-outlined text-[15px]">receipt_long</span>
                                <span>{m.action2Label}</span>
                              </button>
                            )}
                            <button className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 shadow-sm ${m.action3Variant === "primary" ? "bg-primary-container hover:bg-surface-tint text-on-primary" : m.action3Variant === "secondary" ? "bg-secondary text-on-secondary hover:bg-secondary/90" : "bg-surface-container-low hover:bg-surface-container text-tertiary border border-tertiary-container/30"}`} type="button" onClick={(e) => {
                              e.stopPropagation();
                              const next = { ...nudgeStates, [m.id]: true };
                              setNudgeStates(next);
                              triggerToast("Direct Nudge Sent", `Sent gentle reminder ping to ${m.name}.`);
                            }}>
                              <span className={`material-symbols-outlined text-[15px] ${nudged ? "text-on-primary" : "text-tertiary"}`}>{nudged ? "done" : "notifications_active"}</span>
                              <span>{nudged ? "Nudged" : m.action3Label}</span>
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
                    Anyone with this link will automatically sync with this Tahoe Ski Weekend ledger and inherit default equal-share consumption splitting.
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-outline">
                    <span className="inline-flex items-center gap-1 font-semibold text-primary">
                      <span className="material-symbols-outlined text-[14px]">shield</span> Admin Managed
                    </span>
                    <span>•</span>
                    <span>Expires March 15, 2025</span>
                    <span>•</span>
                    <span>256-bit Ledger Integrity</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto bg-surface-container-lowest p-1.5 rounded-xl border border-surface-container-high shadow-sm">
                <span className="text-xs font-mono text-on-surface px-3 truncate select-all">tabsy.me/join/tahoe-ski-449x</span>
                <button className="px-3.5 py-2 rounded-lg bg-primary-container hover:bg-surface-tint text-on-primary text-xs font-bold transition-colors flex items-center gap-1 shrink-0" id="bannerCopyLinkBtn" type="button" onClick={copyInvite}>
                  <span className="material-symbols-outlined text-[16px]">content_copy</span>
                  <span>Copy Link</span>
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* 5. Consistent Tabsy Footer */}
        <footer className="w-full bg-surface-container-low border-t border-surface-container-high py-6">
          <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-on-surface-variant">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-primary-container text-on-primary-container flex items-center justify-center text-[12px]">
                <span className="material-symbols-outlined text-[14px]">receipt_long</span>
              </div>
              <span>© 2025 Tabsy. One tab. All sorted. Split-Rail Command Matrix edition.</span>
            </div>
            <div className="flex items-center gap-6 font-medium">
              <Link className="hover:text-on-surface transition-colors" data-path="overview" to="/dashboard">Overview</Link>
              <Link className="hover:text-on-surface transition-colors" data-path="balances" to="/balances">Group Balances</Link>
              <Link className="hover:text-on-surface transition-colors" data-path="terms" to="/groups">Terms</Link>
              <Link className="hover:text-on-surface transition-colors" data-path="support" to="/quick-actions">Support</Link>
            </div>
          </div>
        </footer>

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
