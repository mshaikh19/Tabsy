import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import GroupHeader from "../components/layout/GroupHeader";
import { groupService } from "../services";

export default function AddMembers() {
  const location = useLocation();
  const navigate = useNavigate();
  const groupId = location.state?.groupId;

  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [emailList, setEmailList] = useState([]);
  const [copied, setCopied] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [g, m] = await Promise.all([
        groupService.get(groupId),
        groupService.members(groupId),
      ]);
      setGroup(g);
      setMembers(m);
    } catch (err) {
      setError(err?.response?.data?.error?.message || "Failed to load group");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!groupId) {
      navigate("/groups");
      return;
    }
    load();
  }, [groupId]);

  const inviteLink = group?.inviteCode
    ? `${window.location.origin}/join/${group.inviteCode}`
    : "";

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
    } catch {
      /* clipboard unavailable */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const addEmail = () => {
    const email = emailInput.trim().toLowerCase();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (emailList.includes(email)) {
      setError("Email already in the list.");
      return;
    }
    setEmailList((prev) => [...prev, email]);
    setEmailInput("");
    setError("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addEmail();
    }
  };

  const removeEmail = (email) => {
    setEmailList((prev) => prev.filter((e) => e !== email));
  };

  const handleAddMembers = async () => {
    if (emailList.length === 0) {
      setError("Add at least one email to invite.");
      return;
    }
    setError("");
    setSuccessMsg("");
    setSubmitting(true);
    try {
      const result = await groupService.addMembers(groupId, emailList);
      setMembers(result.members);
      const added = result.added?.filter((a) => a.status === "added") || [];
      const skipped = result.added?.filter((a) => a.status !== "added") || [];
      let msg = "";
      if (added.length) msg += `${added.length} member(s) added. `;
      if (skipped.length) {
        const notReg = skipped.filter((s) => s.status === "not_registered").length;
        const already = skipped.filter((s) => s.status === "already_member").length;
        if (notReg) msg += `${notReg} not registered (share invite link instead). `;
        if (already) msg += `${already} already in group. `;
      }
      setSuccessMsg(msg.trim() || "No members added.");
      setEmailList([]);
    } catch (err) {
      setError(err?.response?.data?.error?.message || "Failed to add members");
    } finally {
      setSubmitting(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="w-full pt-4 bg-surface">
          <div className="max-w-[720px] w-full mx-auto px-4 sm:px-6 py-6">
            <div className="flex items-center justify-center py-20 text-on-surface-variant">
              <span className="material-symbols-outlined text-[32px] animate-spin mr-2">progress_activity</span>
              Loading...
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="bg-background font-body-md text-on-surface antialiased">
        <main className="w-full pt-0 pb-24 bg-background min-h-screen">
          <div className="max-w-[920px] w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
            <GroupHeader
              title={group?.name || "Group"}
              subtitle="Invite friends to split shared expenses. No download required to join the ledger."
              currentLabel="Add Members"
              actions={
                <>
                  <Link
                    className="group/btn relative inline-flex items-center gap-0 px-2.5 py-2 text-on-surface font-title-md text-title-md hover:bg-surface-container-lowest rounded-lg transition-all duration-300 ease-out overflow-hidden"
                    to="/group-members"
                    state={{ groupId }}
                  >
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover/btn:text-secondary transition-colors shrink-0">
                      group
                    </span>
                    <span className="max-w-0 group-hover/btn:max-w-[120px] group-hover/btn:ml-2 overflow-hidden whitespace-nowrap transition-all duration-300 ease-out opacity-0 group-hover/btn:opacity-100">
                      View Members
                    </span>
                  </Link>
                  <div className="w-px h-5 bg-outline-variant/40 shrink-0 transition-all duration-300 group-hover/actions:bg-transparent" />
                  <Link
                    className="group/btn relative inline-flex items-center gap-0 px-2.5 py-2 bg-primary-container text-on-primary-container font-title-md text-title-md hover:opacity-95 rounded-lg transition-all duration-300 ease-out overflow-hidden"
                    to="/group-expenses"
                    state={{ groupId }}
                  >
                    <span className="material-symbols-outlined text-[18px] relative z-10 shrink-0">
                      receipt_long
                    </span>
                    <span className="max-w-0 group-hover/btn:max-w-[120px] group-hover/btn:ml-2 overflow-hidden whitespace-nowrap transition-all duration-300 ease-out opacity-0 group-hover/btn:opacity-100">
                      View Expenses
                    </span>
                  </Link>
                </>
              }
            />

            {error && (
              <div className="px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">{error}</div>
            )}
            {successMsg && (
              <div className="px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">{successMsg}</div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              {/* Left: Add members */}
              <section className="bg-surface-container-lowest border border-surface-container-high rounded-2xl p-5 shadow-sm flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-surface-container-high text-secondary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[16px]">group_add</span>
                  </div>
                  <h2 className="font-bold text-sm text-on-surface">Add Members by Email</h2>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-on-surface-variant">
                    Enter email addresses to add members
                  </label>
                  <div
                    className="min-h-[52px] w-full bg-surface-container-low rounded-xl border border-surface-container p-2 flex flex-wrap gap-1.5 items-center cursor-text focus-within:border-outline-variant focus-within:ring-1 focus-within:ring-primary/20 transition-all"
                    onClick={() => {
                      const input = document.getElementById("invite-input");
                      if (input) input.focus();
                    }}
                  >
                    {emailList.map((email) => (
                      <span
                        className="inline-flex items-center gap-1 pl-2.5 pr-1 py-1 rounded-lg bg-surface-container-highest text-on-surface text-body-sm font-medium border border-outline-variant/40"
                        key={email}
                      >
                        {email}
                        <button
                          className="w-5 h-5 rounded-md flex items-center justify-center text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeEmail(email);
                          }}
                        >
                          <span className="material-symbols-outlined text-[14px]">close</span>
                        </button>
                      </span>
                    ))}
                    <input
                      className="flex-1 min-w-[140px] bg-transparent border-none outline-none text-body-md font-body-md text-on-surface placeholder:text-outline px-1.5 py-1"
                      id="invite-input"
                      placeholder="name@email.com"
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                  </div>
                </div>

                <button
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary-container text-on-primary-container font-title-md text-title-md shadow-sm hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-60"
                  type="button"
                  disabled={submitting || emailList.length === 0}
                  onClick={handleAddMembers}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {submitting ? "progress_activity" : "person_add"}
                  </span>
                  {submitting ? "Adding..." : `Add ${emailList.length || ""} Member${emailList.length !== 1 ? "s" : ""}`}
                </button>

                <div className="pt-3 border-t border-surface-container">
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Members added by email will be notified. If they don't have a Tabsy account yet, share the invite link below so they can sign up and join.
                  </p>
                </div>
              </section>

              {/* Right: Invite link + roster */}
              <section className="flex flex-col gap-4">
                {/* Invite link */}
                <div className="bg-surface-container-lowest border border-surface-container-high rounded-2xl p-5 shadow-sm flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-surface-container-high text-secondary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[16px]">link</span>
                    </div>
                    <h2 className="font-bold text-sm text-on-surface">Invite Link</h2>
                  </div>
                  <div className="flex items-center bg-surface-container-low rounded-xl border border-surface-container p-1 pl-3 gap-2">
                    <span className="text-[12px] font-mono text-on-surface-variant truncate flex-1 select-all">
                      {inviteLink || "No invite code"}
                    </span>
                    <button
                      className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center text-on-surface hover:opacity-80 transition-opacity shrink-0"
                      type="button"
                      onClick={copyLink}
                      title="Copy link"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {copied ? "check" : "content_copy"}
                      </span>
                    </button>
                  </div>
                  <p className="text-[11px] text-on-surface-variant">
                    Share this link with anyone to let them join the group directly.
                  </p>
                </div>

                {/* Current members */}
                <div className="bg-surface-container-lowest border border-surface-container-high rounded-2xl p-5 shadow-sm flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-primary-fixed/40 text-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-[16px]">diversity_3</span>
                      </div>
                      <h2 className="font-bold text-sm text-on-surface">Current Members</h2>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-caps text-label-caps font-bold">
                      {members.length} member{members.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 max-h-[320px] overflow-y-auto">
                    {members.map((m) => (
                      <div
                        className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low/60 hover:bg-surface-container-low transition-colors"
                        key={m.id}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-[11px] shrink-0">
                            {m.avatarEmoji || getInitials(m.name)}
                          </div>
                          <div className="min-w-0">
                            <span className="text-sm font-semibold text-on-surface truncate block">
                              {m.name || "Unknown"}
                            </span>
                            <span className="text-[11px] text-on-surface-variant truncate">
                              {m.email || m.handle || "—"}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary-fixed/40 px-2 py-1 rounded-md shrink-0">
                          {m.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </AppLayout>
  );
}