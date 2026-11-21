<<<<<<< HEAD
import { useState } from "react";
import { Link } from "react-router-dom";
=======
﻿import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
>>>>>>> 7d94a7acf451afb31a2d657ed33b3d9084c6be7d
import AppLayout from "../components/layout/AppLayout";
import { groupService } from "../services";

const CURRENCIES = [
<<<<<<< HEAD
  { code: "USD", name: "United States Dollar", symbol: "$", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧" },
  { code: "CAD", name: "Canadian Dollar", symbol: "$", flag: "🇨🇦" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵" },
  { code: "CHF", name: "Swiss Franc", symbol: "Fr", flag: "🇨🇭" },
=======
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧" },
  { code: "INR", name: "Indian Rupee", symbol: "₹", flag: "🇮🇳" },
  { code: "CAD", name: "Canadian Dollar", symbol: "$", flag: "🇨🇦" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵" },
>>>>>>> 7d94a7acf451afb31a2d657ed33b3d9084c6be7d
];

const CATEGORIES = [
  { icon: "flight_takeoff", title: "Trips & Vacation", desc: "Shared flights, hotels, road gas, excursions" },
  { icon: "apartment", title: "Home & Roommates", desc: "Rent splits, WiFi, recurring utilities" },
  { icon: "restaurant", title: "Dining & Social", desc: "Dinners, rounds of drinks, brunch weekends" },
  { icon: "celebration", title: "Events & Parties", desc: "Concerts, parties, festival passes, gifts" },
];

const ICONS = [
  { e: "❄️", l: "Ski Chalet" },
  { e: "🏠", l: "Apartment" },
  { e: "🚐", l: "Road Trip" },
  { e: "🍕", l: "Dining" },
  { e: "🎪", l: "Festival" },
  { e: "💼", l: "Project" },
  { e: "🌴", l: "Getaway" },
  { e: "🧾", l: "General" },
];

export default function CreateGroup() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [groupName, setGroupName] = useState("");
  const [groupIcon, setGroupIcon] = useState("🧾");
  const [groupCategory, setGroupCategory] = useState("Trips & Vacation");
  const [currency, setCurrency] = useState("USD");
  const [description, setDescription] = useState("");

  const handleCreate = async () => {
    if (!groupName.trim()) {
      setError("Please enter a group name.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const payload = {
        name: groupName.trim(),
        icon: groupIcon,
        category: groupCategory,
        description,
        currency,
      };
      const group = await groupService.create(payload);
      navigate("/group-details", { state: { groupId: group._id } });
    } catch (err) {
      setError(err?.response?.data?.error?.message || "Failed to create group");
      setSubmitting(false);
    }
  };

  return (
    <AppLayout>
<<<<<<< HEAD
      <main className="w-full pt-4 bg-[#FAF8F5]">
        <div className="max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
          <div className="w-full bg-surface-container-lowest rounded-xl p-4 sm:p-6 shadow-sm flex flex-col gap-4 z-30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
                <Link className="hover:text-on-surface" to="/groups">Groups</Link>
                <span className="material-symbols-outlined text-body-md">chevron_right</span>
                <span>Create New Group</span>
                <span className="material-symbols-outlined text-body-md">chevron_right</span>
                <span className="text-primary font-semibold">{stepTitle}</span>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary-container/20 text-primary font-label-caps text-label-caps uppercase tracking-wider font-bold">
                  <span className="w-2 h-2 rounded-full bg-primary mr-1.5 animate-pulse" />
                  In Progress • Step {step} of 3 ({stepPct}%)
                </span>
                <span className="text-on-surface-variant font-body-sm text-body-sm hidden md:inline">Auto-saving</span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                <div className={`h-full bg-primary rounded-full transition-all duration-500 ${progressWidth}`} />
              </div>
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                {stepCard(1, "Identity & Style", "Theme & Scope", "Identity locked")}
                {stepCard(2, "Split & Currency", "Ratios & Limits", "Rules configured")}
                {stepCard(3, "Roster & Launch", "Invites", "Ready to launch")}
              </div>
=======
      <main className="w-full pt-4 bg-surface">
        <div className="max-w-[720px] w-full mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
          <div className="w-full bg-surface-container-lowest rounded-xl p-4 sm:p-6 shadow-sm flex flex-col gap-2">
            <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
              <Link className="hover:text-on-surface" to="/groups">Groups</Link>
              <span className="material-symbols-outlined text-body-md">chevron_right</span>
              <span className="text-primary font-semibold">Create New Group</span>
>>>>>>> 7d94a7acf451afb31a2d657ed33b3d9084c6be7d
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Create a new group</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">Start splitting expenses with zero drama.</p>
          </div>

<<<<<<< HEAD
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" style={{ alignItems: 'start' }}>
            <section className="lg:col-span-7 flex flex-col gap-6 bg-surface-container-lowest p-4 sm:p-6 rounded-2xl shadow-sm">
              {step === 1 && (
                <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <label className="font-title-md text-title-md text-on-surface font-semibold" htmlFor="group-name-input">
                        Group Name <span className="text-tertiary">*</span>
                      </label>
                      <span className="font-label-caps text-label-caps text-outline">21 / 50</span>
                    </div>
                    <div className="flex items-center gap-2 bg-surface-container-low rounded-xl p-2 shadow-inner">
                      <button className="w-12 h-12 rounded-xl bg-surface-container-lowest text-2xl flex items-center justify-center shrink-0 shadow-sm hover:scale-105 transition-transform" type="button">❄️</button>
                      <input className="w-full bg-transparent font-title-md text-title-md font-semibold text-on-surface placeholder:text-outline focus:outline-none px-2" id="group-name-input" maxLength={50} placeholder="e.g., Kyoto Cherry Blossom, Flat 4B, Friday Dinner" type="text" defaultValue="Tahoe Ski Chalet 2026" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="font-title-md text-title-md text-on-surface font-semibold">Select Preset Icon or Emoji</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { e: "❄️", l: "Ski Chalet" },
                        { e: "🏠", l: "Apartment" },
                        { e: "🚗", l: "Road Trip" },
                        { e: "🍕", l: "Dining" },
                        { e: "🎪", l: "Festival" },
                        { e: "💼", l: "Project" },
                        { e: "🌴", l: "Getaway" },
                      ].map((icon) => (
                        <button key={icon.l} className="flex items-center gap-2 p-2 bg-surface-container-low rounded-xl text-left transition-all hover:bg-surface-container-high" data-emoji={icon.e} type="button">
                          <span className="text-xl">{icon.e}</span>
                          <span className="font-body-sm text-body-sm text-on-surface font-medium">{icon.l}</span>
                        </button>
                      ))}
                      <button className="flex items-center justify-center gap-1 p-2 bg-surface-container-low rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors font-body-sm text-body-sm font-semibold" type="button">
                        <span className="material-symbols-outlined text-[18px]">add_photo_alternate</span>
                        <span>Custom</span>
                      </button>
                    </div>
                  </div>
=======
          <section className="bg-surface-container-lowest p-4 sm:p-6 rounded-2xl shadow-sm flex flex-col gap-6">
            {error && (
              <div className="px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">{error}</div>
            )}

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="font-title-md text-title-md text-on-surface font-semibold" htmlFor="group-name-input">
                  Group Name <span className="text-tertiary">*</span>
                </label>
                <span className="font-label-caps text-label-caps text-outline">{groupName.length} / 50</span>
              </div>
              <div className="flex items-center gap-2 bg-surface-container-low rounded-xl p-2 shadow-inner">
                <span className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm bg-surface-container-lowest text-2xl">{groupIcon}</span>
                <input
                  className="w-full bg-transparent font-title-md text-title-md font-semibold text-on-surface placeholder:text-outline focus:outline-none px-2"
                  id="group-name-input"
                  maxLength={50}
                  placeholder="e.g., Kyoto Cherry Blossom, Flat 4B, Friday Dinner"
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
              </div>
            </div>
>>>>>>> 7d94a7acf451afb31a2d657ed33b3d9084c6be7d

            <div className="flex flex-col gap-2">
              <span className="font-title-md text-title-md text-on-surface font-semibold">Group Icon</span>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {ICONS.map((icon) => (
                  <button
                    key={icon.l}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${groupIcon === icon.e ? "bg-primary-fixed/30 ring-2 ring-primary" : "bg-surface-container-low hover:bg-surface-container-high"}`}
                    type="button"
                    onClick={() => setGroupIcon(icon.e)}
                  >
                    <span className="text-xl">{icon.e}</span>
                    <span className="font-body-sm text-body-sm text-on-surface font-medium text-center leading-tight">{icon.l}</span>
                  </button>
                ))}
              </div>
            </div>

<<<<<<< HEAD
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2 sm:col-span-2">
                      <label className="font-title-md text-title-md text-on-surface font-semibold flex items-center justify-between" htmlFor="location-input">
                        <span>Trip Basecamp / Location</span>
                        <span className="font-body-sm text-body-sm text-primary flex items-center gap-1 font-normal">
                          <span className="material-symbols-outlined text-[16px]">location_on</span>
                          38.9399° N, 119.9772° W
                        </span>
                      </label>
                      <div className="flex items-center gap-2 bg-surface-container-low rounded-xl px-3 py-2">
                        <span className="material-symbols-outlined text-outline text-[20px]">pin_drop</span>
                        <input className="w-full bg-transparent font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none" id="location-input" placeholder="Where is this happening?" type="text" defaultValue="South Lake Tahoe, CA" />
                      </div>
=======
            <div className="flex flex-col gap-2">
              <span className="font-title-md text-title-md text-on-surface font-semibold">Category</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CATEGORIES.map((c) => (
                  <label
                    key={c.title}
                    onClick={() => setGroupCategory(c.title)}
                    className={`cursor-pointer relative flex items-start gap-3 p-4 rounded-xl transition-all shadow-sm ${groupCategory === c.title ? "bg-surface-container-low" : "bg-surface-container-lowest hover:bg-surface-container-low"}`}
                  >
                    <input
                      className="sr-only"
                      checked={groupCategory === c.title}
                      name="group-cat"
                      type="radio"
                      value={c.title}
                      onChange={() => setGroupCategory(c.title)}
                    />
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${groupCategory === c.title ? "bg-primary-container/20 text-primary" : "bg-surface-container text-on-surface-variant"}`}>
                      <span className="material-symbols-outlined text-[24px]">{c.icon}</span>
>>>>>>> 7d94a7acf451afb31a2d657ed33b3d9084c6be7d
                    </div>
                    <div className="flex flex-col flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-title-md text-title-md font-bold text-on-surface">{c.title}</span>
                        {groupCategory === c.title && <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>}
                      </div>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">{c.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

<<<<<<< HEAD
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                    <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-title-md text-title-md transition-colors shadow-sm" onClick={() => setStep(1)} type="button">
                      <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                      <span>Back to Step 1</span>
                    </button>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <button className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-surface-container-lowest text-on-surface-variant hover:text-on-surface font-title-md text-title-md transition-colors shadow-sm" type="button">
                        Save as Draft
                      </button>
                      <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary transition-all shadow-md font-title-md text-title-md font-bold" onClick={() => setStep(3)} type="button">
                        <span>Continue to Step 3: Member Roster</span>
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <nav className="flex items-center gap-1.5 font-body-sm text-body-sm text-on-surface-variant">
                      <Link className="hover:text-primary transition-colors" to="/groups">Groups</Link>
                      <span className="text-outline">/</span>
                      <Link className="hover:text-primary transition-colors" to="/create-group">Create New Group</Link>
                      <span className="text-outline">/</span>
                      <span className="text-on-surface font-semibold">Step 3: Member Roster &amp; Launch</span>
                    </nav>
                    <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">
                      Assemble your circle and launch the tab
                    </h1>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Add initial members via handle, email, or quick-add from previous circles, then share the universal link.
                    </p>
                  </div>

                  <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-secondary">history</span>
                        Frequent Companions
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Tap to add instantly</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { name: "Alex Miller", id: "alex.m@tabsy.me", initials: "AM", color: "bg-surface-container-highest" },
                        { name: "Chloe W.", id: "@chloew", initials: "CW", color: "bg-tertiary-fixed text-on-tertiary-fixed" },
                        { name: "David Chen", id: "david.c@work.org", initials: "DC", color: "bg-secondary-fixed text-on-secondary-fixed" },
                        { name: "Elena Rostova", id: "@elena_r", initials: "ER", color: "bg-surface-container-high" },
                      ].map((p) => (
                        <button key={p.name} className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low hover:bg-primary-container hover:text-on-primary-container text-on-surface transition-all duration-150 font-body-sm text-body-sm" type="button">
                          <span className={`w-5 h-5 rounded-full ${p.color} group-hover:bg-primary/20 flex items-center justify-center font-bold text-label-caps`}>{p.initials}</span>
                          <span>+ {p.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                    <div className="relative flex-1 flex items-center">
                      <span className="material-symbols-outlined text-outline absolute left-3 text-[20px]">alternate_email</span>
                      <input className="w-full bg-surface-container-low rounded-xl pl-10 pr-3 py-2.5 font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container/80 transition-all" id="new-member-input" placeholder="Enter email, @tabsy handle, or contact name..." type="text" />
                    </div>
                    <button className="px-4 py-2.5 rounded-xl bg-primary-container text-on-primary-container font-title-md text-title-md font-semibold hover:bg-primary hover:text-on-primary transition-all duration-200 flex items-center justify-center gap-1.5 shrink-0 shadow-sm" type="button">
                      <span className="material-symbols-outlined text-[20px]">person_add</span>
                      <span>+ Add to Circle</span>
                    </button>
                  </div>

                  <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col gap-3">
                    <div className="flex items-center justify-between pb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-title-md text-title-md font-bold text-on-surface">Assembled Members</span>
                        <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-caps text-label-caps font-bold">4 in group</span>
                      </div>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Default: 25.0% split each</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low/60 hover:bg-surface-container-low transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-body-md shadow-sm">AM</div>
                            <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container text-label-caps">★</span>
                          </div>
                          <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-title-md text-title-md font-bold text-on-surface truncate">Alex Morgan</span>
                              <span className="px-2 py-0.5 rounded-full bg-primary-container/20 text-on-primary-container font-label-caps text-label-caps uppercase font-bold tracking-wider">You • Host Admin</span>
                            </div>
                            <span className="font-body-sm text-body-sm text-on-surface-variant truncate">alex@tabsy.me</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="hidden sm:inline-flex items-center px-2 py-1 rounded-lg bg-surface-container text-primary font-numeric-balance-md text-body-sm font-bold">25.0%</span>
                          <span className="material-symbols-outlined text-outline/60 text-[20px] p-1 cursor-not-allowed" title="Creator cannot be removed">lock</span>
                        </div>
                      </div>
                      {[
                        { name: "Sarah Lin", initials: "SL", email: "sarah.lin@example.com", badge: "Member", color: "bg-surface-container-highest" },
                        { name: "Marco Rossi", initials: "MR", email: "marco@tabsy.me", badge: "Co-Admin Rec.", color: "bg-secondary-fixed text-on-secondary-fixed", badgeColor: "bg-secondary-fixed text-on-secondary-fixed-variant" },
                        { name: "Kim Sato", initials: "KS", email: "@kimsato", badge: "Member", color: "bg-tertiary-fixed text-on-tertiary-fixed" },
                      ].map((m) => (
                        <div key={m.name} className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low/60 hover:bg-surface-container-low transition-colors">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-10 h-10 rounded-full ${m.color} flex items-center justify-center font-bold text-body-md`}>{m.initials}</div>
                            <div className="flex flex-col min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-title-md text-title-md font-bold text-on-surface truncate">{m.name}</span>
                                <span className={`px-2 py-0.5 rounded-full ${m.badgeColor || "bg-surface-container text-on-surface-variant"} font-label-caps text-label-caps uppercase font-semibold`}>{m.badge}</span>
                              </div>
                              <span className="font-body-sm text-body-sm text-on-surface-variant truncate">{m.email}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="hidden sm:inline-flex items-center px-2 py-1 rounded-lg bg-surface-container text-on-surface font-numeric-balance-md text-body-sm font-bold">25.0%</span>
                            <button aria-label={`Remove ${m.name}`} className="p-1.5 rounded-lg text-outline hover:text-error hover:bg-error-container/40 transition-colors" type="button">
                              <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                          <span className="material-symbols-outlined text-[18px]">link</span>
                        </span>
                        <span className="font-title-md text-title-md font-bold text-on-surface">Universal Invite Link</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-caps text-label-caps">Instant Access</span>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-2 p-2 rounded-xl bg-surface-container-low">
                      <div className="flex items-center gap-2 flex-1 px-2 w-full truncate">
                        <span className="material-symbols-outlined text-outline text-[18px]">public</span>
                        <span className="font-body-md text-body-md text-on-surface font-semibold truncate select-all">tabsy.app/join/tahoe-ski-26</span>
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                        <button className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface font-body-sm text-body-sm font-semibold shadow-sm transition-all flex items-center justify-center gap-1" type="button">
                          <span className="material-symbols-outlined text-[16px]">content_copy</span>
                          <span>Copy Link</span>
                        </button>
                        <button className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface font-body-sm text-body-sm font-semibold shadow-sm transition-all flex items-center justify-center gap-1" type="button">
                          <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
                          <span>QR Code</span>
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex flex-col">
                        <span className="font-title-md text-title-md font-semibold text-on-surface">Require Host Approval to Join</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">Prevent uninvited guests from joining automatically via link</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input defaultChecked className="sr-only peer" type="checkbox" />
                        <div className="w-11 h-6 bg-surface-container rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container shadow-inner" />
                      </label>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-surface-container-lowest hover:bg-surface-container text-on-surface font-title-md text-title-md font-semibold shadow-sm transition-all flex items-center justify-center gap-1.5" onClick={() => setStep(2)} type="button">
                        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                        <span>Back to Step 2</span>
                      </button>
                      <button className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl hover:bg-surface-container-low text-on-surface-variant font-title-md text-title-md font-medium transition-colors" type="button">
                        Save as Draft
                      </button>
                    </div>
                    <button className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-primary-container hover:bg-primary text-on-primary-container hover:text-on-primary font-title-md text-title-md font-bold shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden group whitespace-nowrap" type="button">
                      <span className="relative z-10">Create Group &amp; Launch Tab</span>
                      <span className="material-symbols-outlined text-[18px] relative z-10 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5 shrink-0">rocket_launch</span>
                      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </div>
                </div>
              )}
            </section>

            <aside className="lg:col-span-5 flex flex-col gap-4 lg:sticky lg:top-4 z-20" style={{ alignSelf: 'start' }}>
              {step === 3 ? (
                <>
                  <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center text-2xl shadow-inner">❄️</div>
                        <div className="flex flex-col">
                          <span className="font-headline-sm text-headline-sm font-bold text-on-surface">Tahoe Ski Chalet 2026</span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="px-2 py-0.5 rounded-full bg-secondary-fixed/50 text-secondary font-label-caps text-label-caps font-bold">Trip &amp; Vacation</span>
                            <span className="font-body-sm text-body-sm text-on-surface-variant">• 4 active</span>
                          </div>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-primary-container text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    </div>
                    <div className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex -space-x-2 overflow-hidden">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-on-primary text-label-caps font-bold shadow-sm">AM</span>
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-surface-container-highest text-on-surface text-label-caps font-bold shadow-sm">SL</span>
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-secondary-fixed text-on-secondary-fixed text-label-caps font-bold shadow-sm">MR</span>
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-label-caps font-bold shadow-sm">KS</span>
                        </div>
                        <span className="ml-3 font-body-sm text-body-sm font-semibold text-on-surface">4 Members</span>
                      </div>
                      <div className="flex items-center gap-1 font-body-sm text-body-sm text-on-surface-variant">
                        <span>Equal split:</span>
                        <strong className="text-primary font-numeric-balance-md text-body-sm">25% ea</strong>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-left">
                      <div className="p-2.5 rounded-xl bg-surface-container-low flex flex-col gap-0.5">
                        <span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold">Ledger Currency</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="font-title-md text-title-md font-bold text-on-surface">USD ($)</span>
                          <span className="px-1.5 py-0.2 rounded bg-surface-container text-on-surface-variant font-label-caps text-label-caps">US Dollar</span>
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-surface-container-low flex flex-col gap-0.5">
                        <span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold">Debt Optimization</span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="material-symbols-outlined text-primary text-[16px]">route</span>
                          <span className="font-title-md text-title-md font-semibold text-on-surface">Min-Cost Flow</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 pt-1">
                      <div className="flex items-center justify-between">
                        <span className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant font-bold flex items-center gap-1">
                          <span className="material-symbols-outlined text-body-md text-primary">analytics</span>
                          Simulated First Entry Preview
                        </span>
                        <span className="text-primary font-body-sm text-body-sm font-bold">Ledger Demo</span>
                      </div>
                      <div className="p-3 rounded-xl bg-surface-container-low/70 flex flex-col gap-3">
                        <div className="flex items-center justify-between pb-1">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface text-body-md">🎿</div>
                            <div className="flex flex-col">
                              <span className="font-title-md text-title-md font-bold text-on-surface">Lodging &amp; Passes</span>
                              <span className="font-body-sm text-body-sm text-on-surface-variant">Paid by Marco Rossi</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="font-numeric-balance-md text-numeric-balance-md font-bold text-on-surface">$1,200.00</span>
                            <span className="font-body-sm text-body-sm text-primary font-semibold">Total Tab</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1.5 pt-1">
                          <div className="flex items-center justify-between font-body-sm text-body-sm py-1 px-2 rounded-lg bg-surface-container-lowest">
                            <span className="flex items-center gap-1.5 font-medium text-on-surface"><span className="w-2 h-2 rounded-full bg-primary" />Marco Rossi (Payer)</span>
                            <span className="font-numeric-balance-md text-body-sm font-bold text-primary">+$900.00 reimbursement</span>
                          </div>
                          <div className="flex items-center justify-between font-body-sm text-body-sm py-1 px-2 rounded-lg bg-surface-container-lowest">
                            <span className="flex items-center gap-1.5 text-on-surface-variant"><span className="w-2 h-2 rounded-full bg-outline" />Alex Morgan (You)</span>
                            <span className="font-numeric-balance-md text-body-sm font-semibold text-tertiary">-$300.00</span>
                          </div>
                          <div className="flex items-center justify-between font-body-sm text-body-sm py-1 px-2 rounded-lg bg-surface-container-lowest">
                            <span className="flex items-center gap-1.5 text-on-surface-variant"><span className="w-2 h-2 rounded-full bg-outline" />Sarah Lin</span>
                            <span className="font-numeric-balance-md text-body-sm font-semibold text-tertiary">-$300.00</span>
                          </div>
                          <div className="flex items-center justify-between font-body-sm text-body-sm py-1 px-2 rounded-lg bg-surface-container-lowest">
                            <span className="flex items-center gap-1.5 text-on-surface-variant"><span className="w-2 h-2 rounded-full bg-outline" />Kim Sato</span>
                            <span className="font-numeric-balance-md text-body-sm font-semibold text-tertiary">-$300.00</span>
                          </div>
                        </div>
                        <div className="p-2 rounded-lg bg-surface-container flex items-center justify-between font-body-sm text-body-sm">
                          <span className="text-on-surface-variant flex items-center gap-1"><span className="material-symbols-outlined text-[16px] text-primary">hub</span>Graph Efficiency:</span>
                          <span className="font-semibold text-on-surface">3 direct hops • 0 circular debt</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-primary-container/20 flex items-center gap-3 shadow-sm">
                      <span className="material-symbols-outlined text-primary text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>task_alt</span>
                      <div className="flex flex-col">
                        <span className="font-title-md text-title-md font-bold text-on-primary-container">All 3 Pillars Configured</span>
                        <span className="font-body-sm text-body-sm text-on-primary-container/80">Group ledger is synced and ready to record real transactions immediately.</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex items-center gap-3">
                    <span className="text-2xl">⚡</span>
=======
            <div className="flex flex-col gap-2">
              <label className="font-title-md text-title-md text-on-surface font-semibold" htmlFor="currency-select">Default Currency</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CURRENCIES.map((c) => (
                  <button
                    key={c.code}
                    className={`flex items-center gap-2 p-3 rounded-xl text-left transition-all ${currency === c.code ? "bg-primary-fixed/20 ring-2 ring-primary" : "bg-surface-container-low hover:bg-surface-container"}`}
                    type="button"
                    onClick={() => setCurrency(c.code)}
                  >
                    <span className="text-lg">{c.flag}</span>
>>>>>>> 7d94a7acf451afb31a2d657ed33b3d9084c6be7d
                    <div className="flex flex-col">
                      <span className="font-title-md text-title-md text-on-surface font-semibold">{c.code} ({c.symbol})</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">{c.name}</span>
                    </div>
<<<<<<< HEAD
                  </div>
                </>
              ) : step === 2 ? (
                <>
                  <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-md flex flex-col gap-4 transition-all duration-300">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-surface-container-low flex items-center justify-center text-3xl shadow-sm">❄️</div>
                        <div className="flex flex-col">
                          <span className="font-label-caps text-label-caps uppercase text-primary font-bold tracking-wider">Trips &amp; Vacation</span>
                          <h3 className="font-headline-sm text-headline-sm text-on-surface font-extrabold truncate max-w-[200px]">Tahoe Ski Chalet 2026</h3>
                        </div>
                      </div>
                      <span className="px-2 py-1 rounded-full bg-primary-container/20 text-primary font-label-caps text-label-caps font-bold">Active Tab</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface">
                        <span className="material-symbols-outlined text-[16px] text-primary">place</span>
                        <span>South Lake Tahoe, CA</span>
                      </div>
                      <div className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface">
                        <span className="material-symbols-outlined text-[16px] text-secondary">date_range</span>
                        <span>Feb 14 – Feb 18</span>
                      </div>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                      Shared groceries, cabin lodging, ski passes, and rental SUV fuel pool.
                    </p>
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center -space-x-2">
                        <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container font-title-md text-title-md flex items-center justify-center text-xs font-bold ring-2 ring-surface-container-lowest">JD</div>
                        <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container font-title-md text-title-md flex items-center justify-center text-xs font-bold ring-2 ring-surface-container-lowest">AL</div>
                        <div className="w-8 h-8 rounded-full bg-surface-container text-on-surface-variant font-label-caps text-label-caps flex items-center justify-center font-bold ring-2 ring-surface-container-lowest">+4</div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="font-label-caps text-label-caps uppercase text-outline">Target Currency</span>
                        <span className="font-numeric-balance-md text-numeric-balance-md font-bold text-on-surface">{currency} ({currencyInfo.symbol})</span>
                      </div>
                    </div>
                  </div>
=======
                  </button>
                ))}
              </div>
            </div>
>>>>>>> 7d94a7acf451afb31a2d657ed33b3d9084c6be7d

            <div className="flex flex-col gap-2">
              <label className="font-title-md text-title-md text-on-surface font-semibold flex items-center justify-between" htmlFor="desc-input">
                <span>Description</span>
                <span className="font-body-sm text-body-sm text-outline">Optional</span>
              </label>
              <textarea
                className="w-full bg-surface-container-low rounded-xl p-3 font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none resize-none"
                id="desc-input"
                placeholder="What is this group for?"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

<<<<<<< HEAD
                  <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-md flex flex-col gap-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-title-md text-title-md text-on-surface">Step 2 Calibration</span>
                      <span className="font-label-caps text-label-caps px-2 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-bold">100% Calibrated</span>
                    </div>
                    <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
                      <span className="material-symbols-outlined text-primary text-[18px]">check</span>
                      <span>Primary ledger currency locked ({currency})</span>
                    </div>
                    <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
                      <span className="material-symbols-outlined text-primary text-[18px]">check</span>
                      <span>Default split formula configured ({splitModel})</span>
                    </div>
                    <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
                      <span className="material-symbols-outlined text-primary text-[18px]">check</span>
                      <span>Smart debt netting algorithm {netting ? "enabled" : "disabled"}</span>
                    </div>
                    <div className="mt-2 pt-2 bg-surface-container-low p-2 rounded-xl text-center font-label-caps text-label-caps uppercase tracking-wider text-primary font-bold">
                      Ready for Step 3: Member Roster
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-md flex flex-col gap-4 transition-all duration-300">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-surface-container-low flex items-center justify-center text-3xl shadow-sm">❄️</div>
                        <div className="flex flex-col">
                          <span className="font-label-caps text-label-caps uppercase text-primary font-bold tracking-wider">Trips &amp; Vacation</span>
                          <h3 className="font-headline-sm text-headline-sm text-on-surface font-extrabold truncate max-w-[200px]">Tahoe Ski Chalet 2026</h3>
                        </div>
                      </div>
                      <span className="px-2 py-1 rounded-full bg-primary-container/20 text-primary font-label-caps text-label-caps font-bold">Active Tab</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface">
                        <span className="material-symbols-outlined text-[16px] text-primary">place</span>
                        <span>South Lake Tahoe, CA</span>
                      </div>
                      <div className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface">
                        <span className="material-symbols-outlined text-[16px] text-secondary">date_range</span>
                        <span>Feb 14 – Feb 18</span>
                      </div>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                      Shared groceries, cabin lodging, ski passes, and rental SUV fuel pool.
                    </p>
                    <div className="flex items-center justify-between pt-2 bg-surface-container-lowest">
                      <div className="flex items-center -space-x-2">
                        <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container font-title-md text-title-md flex items-center justify-center text-xs font-bold ring-2 ring-surface-container-lowest">JD</div>
                        <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container font-title-md text-title-md flex items-center justify-center text-xs font-bold ring-2 ring-surface-container-lowest">AL</div>
                        <div className="w-8 h-8 rounded-full bg-surface-container text-on-surface-variant font-label-caps text-label-caps flex items-center justify-center font-bold ring-2 ring-surface-container-lowest">+4</div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="font-label-caps text-label-caps uppercase text-outline">Target Currency</span>
                        <span className="font-numeric-balance-md text-numeric-balance-md font-bold text-on-surface">USD ($)</span>
                      </div>
                    </div>
                  </div>

                   <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm flex flex-col gap-3">
                     <div className="flex items-center justify-between">
                       <span className="font-title-md text-title-md text-on-surface font-semibold">Aesthetic Theme Accent</span>
                       <span className="font-body-sm text-body-sm text-primary font-medium">{themeLabel}</span>
                     </div>
                     <div className="grid grid-cols-4 gap-2">
                       {[
                         { name: "Matcha", hex: "#006c49" },
                         { name: "Sky", hex: "#6063ee" },
                         { name: "Lilac", hex: "#4648d4" },
                         { name: "Peach", hex: "#ff7886" },
                         { name: "Rose", hex: "#fb7185" },
                         { name: "Butter", hex: "#fcd34d" },
                         { name: "Mint", hex: "#6ee7b7" },
                         { name: "Lavender", hex: "#c4b5fd" },
                       ].map((t) => (
                         <button key={t.name} className={`p-2 rounded-xl flex flex-col items-center gap-1 transition-all ${themeAccent === t.name ? "bg-surface-container-high ring-2 ring-primary" : "bg-surface-container-low hover:bg-surface-container-high"}`} type="button" onClick={() => setThemeAccent(t.name)}>
                           <span className="w-6 h-6 rounded-full border border-surface-container" style={{ backgroundColor: t.hex }} />
                           <span className={`font-label-caps text-label-caps ${themeAccent === t.name ? "text-on-surface font-bold" : "text-on-surface-variant font-medium"}`}>{t.name}</span>
                         </button>
                       ))}
                     </div>
                   </div>

                  <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm flex flex-col gap-2">
                    <span className="font-title-md text-title-md text-on-surface font-semibold">Step 1 Readiness Checklist</span>
                    <div className="flex flex-col gap-1.5 font-body-sm text-body-sm text-on-surface">
                      <div className="flex items-center gap-2 text-primary font-medium">
                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                        <span>Name defined and verified</span>
                      </div>
                      <div className="flex items-center gap-2 text-primary font-medium">
                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                        <span>Category selected (Trips &amp; Vacation)</span>
                      </div>
                      <div className="flex items-center gap-2 text-primary font-medium">
                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                        <span>Dates &amp; basecamp notes logged</span>
                      </div>
                    </div>
                    <div className="mt-1 pt-2 flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">speed</span>
                        Avg. setup time: ~45 sec
                      </span>
                      <span className="text-primary font-bold">100% Ready</span>
                    </div>
                  </div>
                </>
              )}
            </aside>
          </div>
=======
            <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-2">
              <Link
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors font-title-md text-title-md font-semibold text-center"
                to="/groups"
              >
                Cancel
              </Link>
              <button
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary transition-all shadow-md font-title-md text-title-md font-bold disabled:opacity-60"
                type="button"
                disabled={submitting}
                onClick={handleCreate}
              >
                <span>{submitting ? "Creating..." : "Create Group"}</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </div>
          </section>
>>>>>>> 7d94a7acf451afb31a2d657ed33b3d9084c6be7d
        </div>
      </main>
    </AppLayout>
  );
}