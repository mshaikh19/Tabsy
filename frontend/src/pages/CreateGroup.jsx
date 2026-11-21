import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import { groupService } from "../services";

const CURRENCIES = [
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧" },
  { code: "INR", name: "Indian Rupee", symbol: "₹", flag: "🇮🇳" },
  { code: "CAD", name: "Canadian Dollar", symbol: "$", flag: "🇨🇦" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵" },
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
      <main className="w-full pt-4 bg-surface">
        <div className="max-w-[720px] w-full mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
          <div className="w-full bg-surface-container-lowest rounded-xl p-4 sm:p-6 shadow-sm flex flex-col gap-2">
            <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
              <Link className="hover:text-on-surface" to="/groups">Groups</Link>
              <span className="material-symbols-outlined text-body-md">chevron_right</span>
              <span className="text-primary font-semibold">Create New Group</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Create a new group</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">Start splitting expenses with zero drama.</p>
          </div>

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
                    <div className="flex flex-col">
                      <span className="font-title-md text-title-md text-on-surface font-semibold">{c.code} ({c.symbol})</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">{c.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

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
        </div>
      </main>
    </AppLayout>
  );
}