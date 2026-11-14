import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import GroupHeader from "../components/layout/GroupHeader";
import GroupMap from "../components/GroupMap";
import EmojiPicker from "../components/EmojiPicker";

const ICONS = [
  { icon: "❄️", name: "Snowflake", tint: "Mint" },
  { icon: "⛷️", name: "Ski Trip", tint: "Cerulean" },
  { icon: "🏔️", name: "Mountain", tint: "Lavender" },
  { icon: "🏡", name: "Cabin", tint: "Peach" },
  { icon: "🍕", name: "Foodie", tint: "Lemon" },
  { icon: "🏕️", name: "Camping", tint: "Mint" },
  { icon: "🏄", name: "Surf", tint: "Cerulean" },
  { icon: "✈️", name: "Flight", tint: "Lavender" },
  { icon: "🎒", name: "Roadtrip", tint: "Peach" },
];

const CATEGORIES = [
  "Trips & Travel",
  "Roommates & Housing",
  "Couple / Duo",
  "Event / Party",
  "Work Project",
];

const CURRENCIES = [
  { code: "INR", symbol: "₹" },
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "CAD", symbol: "CA$" },
  { code: "JPY", symbol: "¥" },
];

const ACCENTS = [
  { id: "mint", name: "Emerald Mint", swatch: "bg-[#10b981]", ring: "ring-primary", badgeClass: "bg-primary-fixed text-on-primary-fixed" },
  { id: "lavender", name: "Macaron Lavender", swatch: "bg-[#6063ee]", ring: "ring-secondary", badgeClass: "bg-secondary-fixed text-on-secondary-fixed" },
  { id: "peach", name: "Sunset Peach", swatch: "bg-[#ff7886]", ring: "ring-tertiary", badgeClass: "bg-tertiary-fixed text-on-tertiary-fixed" },
  { id: "sky", name: "Sky Cerulean", swatch: "bg-[#0284c7]", ring: "ring-[#0284c7]", badgeClass: "bg-[#e0f2fe] text-[#0369a1]" },
  { id: "lemon", name: "Lemon Sorbet", swatch: "bg-[#f59e0b]", ring: "ring-[#f59e0b]", badgeClass: "bg-[#fef3c7] text-[#92400e]" },
];

const VIEW_TABS = [
  { id: "dashboard", label: "Dashboard Card" },
  { id: "explore", label: "Invite Placard" },
  { id: "kiosk", label: "Fridge Pass" },
];

const REVISIONS = [
  { version: "2.3", note: "+2 tags added", meta: "Feb 11, 2025 by Alex Morgan" },
  { version: "2.2", note: "Dates updated", meta: "Feb 8, 2025 by Jordan Lee" },
];

function computeDuration(start, end) {
  const s = new Date(start);
  const e = new Date(end);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return null;
  const days = Math.round((e.getTime() - s.getTime()) / 86400000);
  return days > 0 ? days : null;
}

function formatDateRange(start, end) {
  const s = new Date(start);
  const e = new Date(end);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return `${start} - ${end}`;
  const month = { month: "short" };
  const sMonth = s.toLocaleDateString("en-US", month);
  const eMonth = e.toLocaleDateString("en-US", month);
  if (s.getFullYear() === e.getFullYear() && sMonth === eMonth) {
    return `${sMonth} ${s.getDate()} – ${e.getDate()}, ${e.getFullYear()}`;
  }
  if (s.getFullYear() === e.getFullYear()) {
    return `${sMonth} ${s.getDate()} – ${eMonth} ${e.getDate()}, ${e.getFullYear()}`;
  }
  return `${sMonth} ${s.getDate()}, ${s.getFullYear()} – ${eMonth} ${e.getDate()}, ${e.getFullYear()}`;
}

function copyText(text) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
  } catch {
    /* clipboard unavailable */
  }
}

function QrGlyph({ className, plain = false }) {
  return (
    <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect fill="currentColor" height="28" rx="4" width="28" x="6" y="6" />
      <rect fill="#ffffff" height="16" rx="2" width="16" x="12" y="12" />
      <rect fill="currentColor" height="8" rx="1" width="8" x="16" y="16" />
      <rect fill="currentColor" height="28" rx="4" width="28" x="66" y="6" />
      <rect fill="#ffffff" height="16" rx="2" width="16" x="72" y="12" />
      <rect fill="currentColor" height="8" rx="1" width="8" x="76" y="16" />
      <rect fill="currentColor" height="28" rx="4" width="28" x="6" y="66" />
      <rect fill="#ffffff" height="16" rx="2" width="16" x="12" y="72" />
      <rect fill="currentColor" height="8" rx="1" width="8" x="16" y="76" />
      <rect fill="currentColor" height="6" width="6" x="40" y="10" />
      <rect fill="currentColor" height="6" width="6" x="52" y="10" />
      <rect fill="currentColor" height="6" width="6" x="46" y="22" />
      <rect fill="currentColor" height="6" width="6" x="40" y="34" />
      <rect fill="currentColor" height="6" width="6" x="54" y="34" />
      <rect fill="currentColor" height="6" width="6" x="10" y="46" />
      <rect fill="currentColor" height="6" width="6" x="22" y="46" />
      <rect fill="currentColor" height="6" width="6" x="66" y="46" />
      <rect fill="currentColor" height="6" width="6" x="82" y="46" />
      <rect fill="currentColor" height="6" width="6" x="40" y="66" />
      <rect fill="currentColor" height="6" width="6" x="52" y="78" />
      <rect fill="currentColor" height="6" width="6" x="66" y="66" />
      <rect fill="currentColor" height="6" width="6" x="78" y="78" />
      <rect fill="currentColor" height="6" width="6" x="88" y="66" />
      <rect fill="currentColor" height="6" width="6" x="66" y="88" />
      <rect fill="currentColor" height="6" width="6" x="88" y="88" />
      {!plain && (
        <>
          <circle cx="50" cy="50" fill="#10b981" r="10" />
          <text dominantBaseline="central" fontSize="11" textAnchor="middle" x="50" y="51">
            ❄️
          </text>
        </>
      )}
    </svg>
  );
}

export default function EditGroup() {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState("Tahoe Ski Weekend");
  const [selectedIcon, setSelectedIcon] = useState(ICONS[0]);
  const [customOpen, setCustomOpen] = useState(false);
  const customAnchorRef = useRef(null);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [startDate, setStartDate] = useState("Feb 14, 2025");
  const [endDate, setEndDate] = useState("Feb 18, 2025");
  const [location, setLocation] = useState("South Lake Tahoe, CA (Palisades / Heavenly)");
  const [notes, setNotes] = useState(
    "Shared household bills, recurring subscriptions, and day-to-day group spending — everyone can add expenses anytime."
  );
  const [tags, setTags] = useState(["Lodging", "Lift Passes", "Groceries", "Dining", "Transit", "Firewood"]);
  const [tagInputOpen, setTagInputOpen] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [privacy, setPrivacy] = useState("public");
  const [silentUpdate, setSilentUpdate] = useState(false);
  const [broadcastLog, setBroadcastLog] = useState(true);
  const [announcement, setAnnouncement] = useState(
    "Updated group tags and default categories for easier split tallying."
  );
  const [viewTab, setViewTab] = useState("dashboard");
  const [accent, setAccent] = useState(ACCENTS[0]);
  const [passcode, setPasscode] = useState("8492");
  const [coords, setCoords] = useState({ lat: 39.148, lon: -120.236 });
  const [toast, setToast] = useState(null);

  function showToast(title, body) {
    setToast({ title, body });
    setTimeout(() => setToast(null), 3200);
  }

  const duration = computeDuration(startDate, endDate);
  const durationText = duration
    ? `${duration} Days • ${startDate} - ${endDate}`
    : "Set valid trip dates";
  const previewDates = `${startDate} - ${endDate}`;
  const placardDates = formatDateRange(startDate, endDate);
  const locationSnippet = location.split(" (")[0] || "Custom Destination";
  const symbol = CURRENCIES.find((c) => c.code === currency)?.symbol || "$";
  const previewName = groupName.trim() || "Untitled Group";

  const previewCardClass =
    viewTab === "kiosk"
      ? "bg-surface-container-low border-2 border-secondary/40"
      : viewTab === "explore"
        ? "bg-surface-container-low ring-1 ring-primary/30 border border-surface-container-high/40"
        : "bg-surface-container-low border border-surface-container-high/40";

  function addTag() {
    const value = tagInput.trim();
    if (!value) {
      setTagInputOpen(false);
      return;
    }
    if (!tags.some((t) => t.toLowerCase() === value.toLowerCase())) {
      setTags([...tags, value]);
    }
    setTagInput("");
    setTagInputOpen(false);
    showToast("Tag Added", `#${value} is now available for expense splits.`);
  }

  return (
    <AppLayout>
      <div className="bg-[#FAF8F5] font-body-md text-on-surface antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
        <main className="w-full pt-0 pb-24 bg-[#FAF8F5] min-h-screen">
          <div className="max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
            <GroupHeader
              title="Interactive Group Studio"
              subtitle="Customize group identity, schedule, taxonomies, and settlement rules — every tweak renders live in the preview sandbox."
              icon="palette"
              iconLabel="Group Identity & Customizer"
              dateLabel=""
              locationLabel=""
              currentLabel="Edit Group"
              breadcrumbs={[
                { label: "Groups", to: "/groups", icon: "grid_view" },
                { label: "Tahoe Ski Weekend ❄️", to: "/group-details" },
              ]}
              actions={
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-fixed text-on-primary-fixed text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
                  Active Trip • 6 Members
                </div>
              }
            />

            {/* Top Action Toolbar */}
            <div className="flex items-center justify-end gap-2.5 flex-wrap">
              <button
                className="px-3.5 py-2 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface-variant font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-all"
                type="button"
                onClick={() =>
                  showToast("Compare View Loaded", "Highlighted changes: Added #Utilities tag, tuned base location pin.")
                }
              >
                <span className="material-symbols-outlined text-[18px]">difference</span>
                Compare with Current
              </button>
              <button
                className="px-3.5 py-2 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface-variant font-medium text-xs sm:text-sm transition-all"
                type="button"
                onClick={() => showToast("Changes Discarded", "Reverted back to Version 2.4 state.")}
              >
                Discard Changes
              </button>
              <button
                className="px-5 py-2 rounded-full bg-primary hover:bg-primary-container text-white font-semibold text-xs sm:text-sm shadow-sm flex items-center gap-2 transition-all"
                type="button"
                onClick={() => {
                  showToast("Changes Published Successfully", `${previewName} updated and synced across all 6 members.`);
                  navigate("/group-details");
                  window.scrollTo({ top: 0, behavior: "instant" });
                }}
              >
                <span className="material-symbols-outlined text-[18px]">bolt</span>
                Publish Changes
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Controls */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                {/* 1. Identity & Visual Avatar Studio */}
                <div className="bg-surface-container-lowest rounded-2xl p-6 sm:p-7 shadow-sm border border-surface-container-high/40 flex flex-col gap-6">
                  <div className="flex items-center justify-between pb-2 border-b border-surface-container-low">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary-fixed flex items-center justify-center text-on-primary-fixed">
                        <span className="material-symbols-outlined text-[20px]">palette</span>
                      </div>
                      <div>
                        <h2 className="font-headline-sm text-lg font-bold text-on-surface">Identity & Visual Studio</h2>
                        <p className="text-xs text-on-surface-variant">
                          Customize group name, avatar icon, and category classification.
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-surface-container-low text-on-surface-variant">
                      Step 1
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold text-on-surface" htmlFor="groupNameInput">
                        Group Title
                      </label>
                      <span className="font-numeric text-xs font-semibold text-on-surface-variant">
                        {groupName.length} / 40
                      </span>
                    </div>
                    <input
                      className="w-full px-4 py-3 rounded-xl bg-surface-container-low border-0 text-on-surface font-semibold text-base focus:ring-2 focus:ring-primary/20 placeholder:text-outline transition-all"
                      id="groupNameInput"
                      maxLength={40}
                      type="text"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold text-on-surface">Interactive Icon Picker</label>
                      <span className="text-xs text-on-surface-variant">
                        Selected:{" "}
                        <strong className="text-on-surface">
                          {selectedIcon.icon} {selectedIcon.name}
                        </strong>
                      </span>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {ICONS.map((ic) => {
                        const selected = selectedIcon.name === ic.name;
                        return (
                          <button
                            key={ic.name}
                            className={`flex flex-col items-center justify-center p-3 rounded-xl text-center transition-all border border-transparent ${
                              selected
                                ? "bg-primary-fixed text-on-primary-fixed shadow-xs"
                                : "bg-surface-container-low hover:bg-surface-container text-on-surface"
                            }`}
                            type="button"
                            onClick={() => setSelectedIcon(ic)}
                          >
                            <span className="text-2xl mb-1">{ic.icon}</span>
                            <span className="text-xs font-semibold">{ic.name}</span>
                            <span className="text-[9px] opacity-75 mt-0.5">{ic.tint}</span>
                          </button>
                        );
                      })}
                      <button
                        className="flex flex-col items-center justify-center p-3 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant hover:text-on-surface text-center transition-all"
                        type="button"
                        ref={customAnchorRef}
                        onClick={() => setCustomOpen(!customOpen)}
                      >
                        <span className="material-symbols-outlined text-[24px] mb-1">add_reaction</span>
                        <span className="text-xs font-semibold">Custom</span>
                        <span className="text-[9px] opacity-75 mt-0.5">Any Emoji</span>
                      </button>
                    </div>
                    {customOpen && (
                      <div className="relative">
                        <EmojiPicker
                          anchorRef={customAnchorRef}
                          onClose={() => setCustomOpen(false)}
                          onSelect={(emoji) => {
                            setSelectedIcon({ icon: emoji, name: "Custom", tint: "Any" });
                            setCustomOpen(false);
                            showToast("Custom Icon Set", `${emoji} is now the group icon.`);
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold text-on-surface">Group Cover Banner & Key Visual</label>
                      <button
                        className="text-xs text-primary font-medium hover:underline"
                        type="button"
                        onClick={() => showToast("Banner Reset", "Cover visual reverted to the default alpine backdrop.")}
                      >
                        Reset to Default
                      </button>
                    </div>
                    <div className="relative border-2 border-dashed border-surface-container-highest rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 bg-surface-container-low/60 hover:bg-surface-container-low transition-colors">
                      <div className="w-28 h-20 rounded-xl bg-gradient-to-br from-[#10b981] via-[#0284c7] to-[#6063ee] bg-cover bg-center overflow-hidden shrink-0 shadow-xs relative">
                        <div className="absolute inset-0 bg-inverse-surface/20" />
                        <span className="absolute bottom-1 right-1 px-1.5 py-0.5 text-[9px] font-bold rounded bg-surface-container-lowest/80 text-on-surface">
                          16:9
                        </span>
                      </div>
                      <div className="flex-1 flex flex-col text-center sm:text-left">
                        <span className="text-xs font-bold text-on-surface">Alpine Tahoe Cabin Photo (Winter 2025)</span>
                        <span className="text-[11px] text-on-surface-variant mt-0.5">
                          Drop an image here or click to browse (JPG, PNG, WebP up to 8MB).
                        </span>
                        <div className="mt-2.5 flex items-center gap-2 justify-center sm:justify-start">
                          <button
                            className="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high text-xs font-semibold transition-colors flex items-center gap-1.5"
                            type="button"
                            onClick={() => showToast("Image Selector Opened", "Choose a JPG, PNG, or WebP up to 8MB.")}
                          >
                            <span className="material-symbols-outlined text-[15px]">upload</span>
                            Upload Banner
                          </button>
                          <button
                            className="px-2.5 py-1.5 rounded-lg text-outline hover:text-tertiary text-xs transition-colors"
                            type="button"
                            onClick={() => showToast("Image Removed", "Banner reverted to the default pattern.")}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    <label className="text-sm font-semibold text-on-surface">Category Classification</label>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.map((cat) => {
                        const selected = category === cat;
                        return (
                          <button
                            key={cat}
                            className={`px-4 py-2 rounded-full font-semibold text-xs transition-all ${
                              selected
                                ? "bg-secondary text-on-secondary"
                                : "bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant"
                            }`}
                            type="button"
                            onClick={() => setCategory(cat)}
                          >
                            {cat}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 2. Dates, Pin & Geofenced Basecamp */}
                <div className="bg-surface-container-lowest rounded-2xl p-6 sm:p-7 shadow-sm border border-surface-container-high/40 flex flex-col gap-6">
                  <div className="flex items-center justify-between pb-2 border-b border-surface-container-low">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
                        <span className="material-symbols-outlined text-[20px]">pin_drop</span>
                      </div>
                      <div>
                        <h2 className="font-headline-sm text-lg font-bold text-on-surface">
                          Schedule, Pin & Base Location
                        </h2>
                        <p className="text-xs text-on-surface-variant">
                          Set the group's active dates and pin a base location for automatic expense tagging.
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-surface-container-low text-on-surface-variant">
                      Step 2
                    </span>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold text-on-surface">Event Duration & Dates</label>
                      <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[11px] font-bold font-numeric">
                        {durationText}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center bg-surface-container-low rounded-xl px-3.5 py-3">
                        <span className="material-symbols-outlined text-[19px] text-outline mr-2">calendar_today</span>
                        <div className="flex flex-col flex-1">
                          <span className="text-[10px] uppercase font-bold text-outline">Start Date</span>
                          <input
                            className="bg-transparent text-sm font-semibold text-on-surface focus:outline-none w-full border-0 p-0"
                            type="text"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="flex items-center bg-surface-container-low rounded-xl px-3.5 py-3">
                        <span className="material-symbols-outlined text-[19px] text-outline mr-2">event</span>
                        <div className="flex flex-col flex-1">
                          <span className="text-[10px] uppercase font-bold text-outline">End Date</span>
                          <input
                            className="bg-transparent text-sm font-semibold text-on-surface focus:outline-none w-full border-0 p-0"
                            type="text"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-on-surface" htmlFor="locationInput">
                      Destination & Geotag
                    </label>
                    <div className="flex items-center bg-surface-container-low rounded-xl px-3.5 py-2.5">
                      <span className="material-symbols-outlined text-[19px] text-tertiary mr-2.5">near_me</span>
                      <input
                        className="bg-transparent text-sm font-medium text-on-surface focus:outline-none w-full border-0 p-0"
                        id="locationInput"
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="rounded-2xl overflow-hidden bg-surface-container-low border border-surface-container-high/60 shadow-xs relative">
                    <GroupMap query={location} onGeocode={setCoords} />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                      <span className="px-2.5 py-1 rounded-lg bg-surface-container-lowest/90 backdrop-blur-md text-[11px] font-bold text-on-surface flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-primary">my_location</span>
                        {Math.abs(coords.lat).toFixed(4)}° {coords.lat >= 0 ? "N" : "S"},{" "}
                        {Math.abs(coords.lon).toFixed(4)}° {coords.lon >= 0 ? "E" : "W"}
                      </span>
                      <span className="px-2 py-1 rounded-lg bg-surface-container-lowest/90 backdrop-blur-md text-[11px] font-bold text-on-surface flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-secondary">elevation</span>
                        6,225 ft Alt
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-lg bg-surface-container-lowest/95 backdrop-blur-md text-[11px] font-bold text-on-surface flex items-center gap-1.5 shadow-xs">
                        ❄️ 28°F Sunny Snow
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-surface-container-lowest/95 backdrop-blur-md p-2.5 rounded-xl">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary-container" />
                        <span className="text-xs font-bold text-on-surface">Geofenced Radius Active</span>
                          <span className="text-[11px] text-on-surface-variant hidden sm:inline">• 1.5 mi base boundary</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-[9px] text-outline">© OpenStreetMap</span>
                        <button
                          className="text-[11px] text-primary font-bold hover:underline"
                          type="button"
                          onClick={() =>
                            showToast("Boundary Editor Opened", "Drag the pin to adjust the 1.5 mi geofence.")
                          }
                        >
                          Edit Boundary
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-on-surface" htmlFor="notesInput">
                      Trip Notes & Logistics Overview
                    </label>
                    <textarea
                      className="w-full px-4 py-3 rounded-xl bg-surface-container-low border-0 text-on-surface text-xs sm:text-sm placeholder:text-outline focus:ring-2 focus:ring-primary/20 resize-none"
                      id="notesInput"
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                </div>

                {/* 3. Expense Tag Taxonomies & Custom Split Rules */}
                <div className="bg-surface-container-lowest rounded-2xl p-6 sm:p-7 shadow-sm border border-surface-container-high/40 flex flex-col gap-6">
                  <div className="flex items-center justify-between pb-2 border-b border-surface-container-low">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-surface-container-highest flex items-center justify-center text-on-surface">
                        <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
                      </div>
                      <div>
                        <h2 className="font-headline-sm text-lg font-bold text-on-surface">
                          Expense Taxonomies & Ledger Rules
                        </h2>
                        <p className="text-xs text-on-surface-variant">
                          Taxonomy tags, ledger currency, and settlement privacy settings.
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-surface-container-low text-on-surface-variant">
                      Step 3
                    </span>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold text-on-surface">Expense Category Taxonomies</label>
                      <span className="text-xs text-on-surface-variant">Click tag to remove</span>
                    </div>
                    <div className="flex flex-wrap gap-2 items-center">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-high text-on-surface text-xs font-semibold"
                        >
                          {tag}
                          <button
                            aria-label={`Remove ${tag} tag`}
                            className="text-outline hover:text-error"
                            type="button"
                            onClick={() => setTags(tags.filter((t) => t !== tag))}
                          >
                            <span className="material-symbols-outlined text-[15px]">close</span>
                          </button>
                        </span>
                      ))}
                      <button
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-bold hover:bg-primary-container hover:text-white transition-colors"
                        type="button"
                        onClick={() => setTagInputOpen(!tagInputOpen)}
                      >
                        <span className="material-symbols-outlined text-[16px]">add</span>
                        Add Tag
                      </button>
                    </div>
                    {tagInputOpen && (
                      <div className="flex items-center gap-2">
                        <input
                          className="flex-1 px-3 py-2 rounded-xl bg-surface-container-low border-0 text-sm text-on-surface focus:ring-2 focus:ring-primary/20"
                          maxLength={20}
                          type="text"
                          value={tagInput}
                          placeholder="New expense tag name…"
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") addTag();
                          }}
                        />
                        <button
                          className="px-3 py-2 rounded-xl bg-primary-fixed text-on-primary-fixed text-xs font-bold hover:bg-primary-container hover:text-white transition-colors"
                          type="button"
                          onClick={addTag}
                        >
                          Add
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold text-on-surface">Base Group Currency</label>
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-on-surface-variant font-numeric bg-surface-container-low px-2.5 py-1 rounded-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-container" />
                        ECB Rate: 1 USD = ₹83.24 (Synced 10m ago)
                      </div>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {CURRENCIES.map((c) => {
                        const selected = currency === c.code;
                        return (
                          <button
                            key={c.code}
                            className={`p-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                              selected
                                ? "bg-primary-fixed text-on-primary-fixed"
                                : "bg-surface-container-low hover:bg-surface-container text-on-surface"
                            }`}
                            type="button"
                            onClick={() => setCurrency(c.code)}
                          >
                            <span className="font-numeric font-bold">{c.symbol}</span>
                            {c.code}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    <label className="text-sm font-semibold text-on-surface">
                      Settlement Visibility & Balance Privacy
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        {
                          id: "public",
                          title: "Public Within Members",
                          desc: "All 6 group members see everyone's individual ledger entries and balances.",
                        },
                        {
                          id: "admin",
                          title: "Admin-Only Net View",
                          desc: "Participants only see their personal net debt and aggregated trip totals.",
                        },
                      ].map((opt) => {
                        const selected = privacy === opt.id;
                        return (
                          <label
                            key={opt.id}
                            className={`flex items-start gap-3 p-4 rounded-xl bg-surface-container-low cursor-pointer hover:bg-surface-container-high transition-colors border-2 ${
                              selected ? "border-primary/20" : "border-transparent"
                            }`}
                          >
                            <input
                              className="mt-0.5 accent-primary"
                              name="privacyPolicy"
                              type="radio"
                              checked={selected}
                              onChange={() => setPrivacy(opt.id)}
                            />
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-on-surface">{opt.title}</span>
                              <span className="text-[11px] text-on-surface-variant mt-0.5">{opt.desc}</span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 4. Notification Broadcast Settings */}
                <div className="bg-surface-container-lowest rounded-2xl p-6 sm:p-7 shadow-sm border border-surface-container-high/40 flex flex-col gap-5">
                  <div className="flex items-center justify-between pb-2 border-b border-surface-container-low">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed">
                        <span className="material-symbols-outlined text-[20px]">campaign</span>
                      </div>
                      <div>
                        <h2 className="font-headline-sm text-lg font-bold text-on-surface">
                          Notification Broadcast Settings
                        </h2>
                        <p className="text-xs text-on-surface-variant">
                          Control how and when members are notified of group changes.
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-surface-container-low text-on-surface-variant">
                      Step 4
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-container-low cursor-pointer hover:bg-surface-container-high transition-colors">
                      <input
                        className="mt-0.5 accent-primary"
                        type="checkbox"
                        checked={silentUpdate}
                        onChange={(e) => setSilentUpdate(e.target.checked)}
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-on-surface">Silent Update</span>
                        <span className="text-[11px] text-on-surface-variant mt-0.5">
                          Suppress push alerts for subtle copy or date edits.
                        </span>
                      </div>
                    </label>
                    <label className="flex items-start gap-3 p-3.5 rounded-xl bg-primary-fixed/30 cursor-pointer hover:bg-primary-fixed/50 transition-colors">
                      <input
                        className="mt-0.5 accent-primary"
                        type="checkbox"
                        checked={broadcastLog}
                        onChange={(e) => setBroadcastLog(e.target.checked)}
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-on-primary-fixed">Broadcast Changelog</span>
                        <span className="text-[11px] text-on-primary-fixed-variant mt-0.5">
                          Push summary to all 6 members upon publish.
                        </span>
                      </div>
                    </label>
                  </div>
                  <div className="p-3.5 rounded-xl bg-surface-container-low flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-secondary">chat_bubble</span>
                        Announcement Note to Group
                      </span>
                      <span className="text-[10px] text-on-surface-variant">Attached to push notice</span>
                    </div>
                    <input
                      className="bg-surface-container-lowest text-xs text-on-surface rounded-lg p-2.5 border-0 focus:ring-1 focus:ring-primary placeholder:text-outline"
                      type="text"
                      value={announcement}
                      placeholder="Add an optional organizer note (e.g. 'Hey everyone, updated cabin tags and dates!')"
                      onChange={(e) => setAnnouncement(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Sticky Live Sandbox */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container-high/40 flex flex-col gap-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[20px] text-primary">visibility</span>
                      <h3 className="font-headline-sm text-base font-bold text-on-surface">Live Preview Sandbox</h3>
                    </div>
                    <span className="font-numeric text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed tracking-wide uppercase">
                      Dynamic Sync
                    </span>
                  </div>

                  <div className="flex items-center bg-surface-container-low p-1 rounded-xl gap-1 text-xs">
                    {VIEW_TABS.map((tab) => {
                      const selected = viewTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          className={`flex-1 py-1.5 text-center rounded-lg transition-all ${
                            selected
                              ? "font-semibold bg-surface-container-lowest text-on-surface shadow-xs"
                              : "font-medium text-on-surface-variant hover:text-on-surface"
                          }`}
                          type="button"
                          onClick={() => setViewTab(tab.id)}
                        >
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>

                  <div
                    className={`rounded-2xl p-5 border border-surface-container-high/40 shadow-xs transition-all ${previewCardClass}`}
                  >
                    {viewTab === "dashboard" && (
                      <div className="flex flex-col gap-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-surface-container-lowest text-2xl flex items-center justify-center shadow-xs border border-surface-container-high/40">
                              {selectedIcon.icon}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <h4 className="font-bold text-base text-on-surface truncate">{previewName}</h4>
                              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-secondary text-on-secondary uppercase tracking-wider">
                                  {category}
                                </span>
                                <span className="text-xs text-outline-variant">•</span>
                                <span className="text-xs text-on-surface-variant font-medium">{previewDates}</span>
                              </div>
                            </div>
                          </div>
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide whitespace-nowrap ${accent.badgeClass}`}
                          >
                            Active Trip
                          </span>
                        </div>

                        <div className="w-full h-36 rounded-xl bg-gradient-to-br from-[#10b981] via-[#0284c7] to-[#6063ee] bg-cover bg-center relative overflow-hidden shadow-xs">
                          <div className="absolute inset-0 bg-inverse-surface/20" />
                          <div className="absolute bottom-2.5 left-2.5 bg-surface-container-lowest/90 backdrop-blur-md px-2.5 py-1 rounded-md text-on-surface text-xs font-semibold flex items-center gap-1.5 shadow-xs">
                            <span className="material-symbols-outlined text-[14px] text-tertiary">landscape</span>
                            {locationSnippet}
                          </div>
                          <div className="absolute top-2.5 right-2.5 bg-surface-container-lowest/90 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-on-surface">
                            Palisades Basecamp
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1 px-1">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider font-numeric">
                              TOTAL SPEND
                            </span>
                            <span className="font-numeric text-xl font-bold text-on-surface">{symbol}2,880.00</span>
                          </div>
                          <div className="flex flex-col text-right">
                            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider font-numeric">
                              YOUR POSITION
                            </span>
                            <span className="font-numeric text-xl font-bold text-primary">
                              +{symbol}140.00
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-medium"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-surface-container-high/40 bg-surface-container-lowest/60 p-3 rounded-xl">
                          <div className="flex items-center">
                            <div className="flex -space-x-2">
                              <div className="w-7 h-7 rounded-full bg-primary-container text-on-primary flex items-center justify-center text-xs font-bold ring-2 ring-surface-container-lowest">
                                AM
                              </div>
                              <div className="w-7 h-7 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-xs font-bold ring-2 ring-surface-container-lowest">
                                JL
                              </div>
                              <div className="w-7 h-7 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center text-xs font-bold ring-2 ring-surface-container-lowest">
                                RK
                              </div>
                              <div className="w-7 h-7 rounded-full bg-surface-container-highest text-on-surface flex items-center justify-center text-xs font-bold ring-2 ring-surface-container-lowest">
                                +3
                              </div>
                            </div>
                            <span className="ml-2.5 text-xs text-on-surface-variant font-medium">
                              6 active friends
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-primary text-xs font-semibold">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            Ledger Synced
                          </div>
                        </div>
                      </div>
                    )}

                    {viewTab === "explore" && (
                      <div className="flex flex-col items-stretch text-center">
                        <div className="h-16 rounded-xl bg-gradient-to-r from-[#10b981] via-[#0284c7] to-[#6063ee] relative overflow-hidden flex flex-col items-center justify-center gap-0.5">
                          <div className="absolute inset-0 bg-inverse-surface/20" />
                          <span className="relative text-[9px] font-bold uppercase tracking-[0.25em] text-white/80">
                            Tabsy Group Placard
                          </span>
                          <span className="relative text-sm font-extrabold uppercase tracking-[0.2em] text-white">
                            You're Invited
                          </span>
                        </div>

                        <div className="flex justify-center mt-3">
                          <div className="w-14 h-14 rounded-2xl bg-surface-container-lowest border border-surface-container-high/40 flex items-center justify-center text-3xl shadow-xs">
                            {selectedIcon.icon}
                          </div>
                        </div>

                        <div className="flex flex-col items-center gap-1.5 mt-2">
                          <h4 className="font-headline-md text-headline-md font-bold text-on-surface leading-tight">
                            {previewName}
                          </h4>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${accent.badgeClass}`}
                          >
                            {category}
                          </span>
                        </div>

                        <div className="mt-4 rounded-xl bg-surface-container-lowest border border-surface-container-high/60 px-4 flex flex-col divide-y divide-surface-container-low">
                          <div className="flex items-center gap-3 py-2.5">
                            <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined text-[16px] text-primary">
                                calendar_today
                              </span>
                            </div>
                            <div className="flex flex-col text-left">
                              <span className="text-[9px] font-bold uppercase tracking-wider text-outline">
                                Dates
                              </span>
                              <span className="text-xs font-semibold text-on-surface">{placardDates}</span>
                            </div>
                            {duration && (
                              <span className="ml-auto text-[10px] font-bold text-secondary bg-secondary-fixed px-1.5 py-0.5 rounded">
                                {duration} Days
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 py-2.5">
                            <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined text-[16px] text-tertiary">
                                location_on
                              </span>
                            </div>
                            <div className="flex flex-col text-left min-w-0">
                              <span className="text-[9px] font-bold uppercase tracking-wider text-outline">
                                Basecamp
                              </span>
                              <span className="text-xs font-semibold text-on-surface truncate">
                                {locationSnippet}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 py-2.5">
                            <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined text-[16px] text-secondary">group</span>
                            </div>
                            <div className="flex flex-col text-left">
                              <span className="text-[9px] font-bold uppercase tracking-wider text-outline">
                                Crew
                              </span>
                              <span className="text-xs font-semibold text-on-surface">
                                Hosted by Alex Morgan • 6 going
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t-2 border-dashed border-outline-variant/60 flex items-center gap-3 text-left">
                          <div className="bg-surface-container-lowest p-1.5 rounded-xl border border-surface-container-high/60 shrink-0">
                            <QrGlyph plain className="w-16 h-16 text-on-surface" />
                          </div>
                          <div className="flex flex-col gap-0.5 min-w-0">
                            <span className="text-xs font-bold text-on-surface">Scan to join the ledger</span>
                            <span className="text-[10px] text-on-surface-variant">
                              No app download needed — payments link instantly.
                            </span>
                            <span className="text-[11px] font-numeric font-semibold text-secondary truncate">
                              tabsy.me/join/tahoe-ski-2025
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {viewTab === "kiosk" && (
                      <div className="bg-surface-container-lowest rounded-xl border border-surface-container-high/60 p-4 flex flex-col gap-3">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-surface-container-low border border-surface-container-high/40 flex items-center justify-center text-2xl shrink-0">
                              {selectedIcon.icon}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-outline">
                                Group Fridge Pass
                              </span>
                              <span className="text-sm font-bold text-on-surface truncate">{previewName}</span>
                            </div>
                          </div>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider whitespace-nowrap ${accent.badgeClass}`}
                          >
                            {category}
                          </span>
                        </div>

                        <div className="relative border-t-2 border-dashed border-outline-variant/60 my-1">
                          <span className="absolute left-1/2 -top-2.5 -translate-x-1/2 bg-surface-container-lowest px-1.5 text-outline">
                            <span className="material-symbols-outlined text-[14px]">content_cut</span>
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-outline">
                              Passcode
                            </span>
                            <span className="font-numeric text-sm font-bold text-on-surface">{passcode}</span>
                          </div>
                          <div className="flex flex-col gap-0.5 min-w-0">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-outline">
                              Valid Thru
                            </span>
                            <span className="text-[11px] font-semibold text-on-surface truncate">
                              {previewDates}
                            </span>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-outline">Crew</span>
                            <span className="text-[11px] font-semibold text-on-surface">6 active</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2.5 border-t border-surface-container-high/40">
                          <span className="flex items-center gap-1.5 text-[10px] text-on-surface-variant">
                            <span className="material-symbols-outlined text-[14px] text-primary">vpn_key</span>
                            Physical access • all members
                          </span>
                          <span className="flex items-center gap-1.5 text-[10px] text-primary font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            Synced
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 pt-2 border-t border-surface-container-low">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-on-surface">Badge Accent Tint</span>
                      <span className="text-[11px] text-on-surface-variant font-medium">{accent.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {ACCENTS.map((a) => {
                        const selected = accent.id === a.id;
                        return (
                          <button
                            key={a.id}
                            className={`w-8 h-8 rounded-full ${a.swatch} transition-all ${
                              selected ? `ring-2 ring-offset-2 ${a.ring}` : "ring-0 ring-offset-2"
                            }`}
                            title={a.name}
                            type="button"
                            onClick={() => setAccent(a)}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Scan to Join & Cabin Pass */}
                <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 shadow-sm border border-surface-container-high/40 flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-surface-container-low">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary-fixed flex items-center justify-center text-on-primary-fixed shrink-0">
                        <span className="material-symbols-outlined text-[20px]">qr_code_2</span>
                      </div>
                      <div className="flex flex-col">
                        <h4 className="text-sm font-bold text-on-surface">Scan to Join & Group Pass</h4>
                        <span className="text-[11px] text-on-surface-variant">
                          Instant member & guest ledger onboarding
                        </span>
                      </div>
                    </div>
                    <span className="font-numeric text-[10px] font-bold px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed uppercase tracking-wide flex items-center gap-1.5 self-start sm:self-auto">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" />
                      Direct Join Active
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4 bg-surface-container-low p-4 rounded-xl border border-surface-container-high/40">
                    <div className="relative bg-surface-container-lowest p-2.5 rounded-2xl shadow-xs border border-surface-container-high/60 shrink-0 flex items-center justify-center">
                      <QrGlyph className="w-24 h-24 text-on-surface" />
                    </div>
                    <div className="flex-1 flex flex-col gap-2 text-center sm:text-left min-w-0">
                      <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                        <span className="font-numeric text-[11px] font-bold text-on-surface uppercase tracking-wider bg-surface-container-high px-2 py-1 rounded-md">
                          Passcode: {passcode}
                        </span>
                        <button
                          className="text-[10px] text-primary font-bold hover:underline inline-flex items-center gap-0.5"
                          type="button"
                          onClick={() => {
                            setPasscode(String(Math.floor(1000 + Math.random() * 9000)));
                            showToast("Passcode Reset", "QR code and cabin passcode updated.");
                          }}
                        >
                          <span className="material-symbols-outlined text-[13px]">refresh</span>
                          Reset Code
                        </button>
                      </div>
                      <button
                        className="font-numeric text-xs font-semibold text-secondary hover:underline truncate text-center sm:text-left"
                        type="button"
                        onClick={() => {
                          copyText("https://tabsy.me/join/tahoe-ski-2025");
                          showToast("Link Copied", "tabsy.me/join/tahoe-ski-2025 copied to clipboard.");
                        }}
                      >
                        tabsy.me/join/tahoe-ski-2025
                      </button>
                      <p className="text-[11px] text-on-surface-variant leading-relaxed">
                        Members and guests can scan to immediately link payment methods and access the group
                        ledger without account setup delays.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      className="px-3 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                      type="button"
                      onClick={() => {
                        copyText("https://tabsy.me/join/tahoe-ski-2025");
                        showToast("Join Link Copied", "Direct join link copied to clipboard!");
                      }}
                    >
                      <span className="material-symbols-outlined text-[16px]">link</span>
                      Copy Join Link
                    </button>
                    <button
                      className="px-3 py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-surface-container-high/60"
                      type="button"
                      onClick={() =>
                        showToast("Group Placard Prepared", "Ready to print or AirDrop to share with the group.")
                      }
                    >
                      <span className="material-symbols-outlined text-[16px] text-outline">print</span>
                      Print Group Placard
                    </button>
                  </div>
                </div>

                {/* Audit Trail & Revisions */}
                <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container-high/40 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface">
                        <span className="material-symbols-outlined text-[19px]">history</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-on-surface">Audit Trail & Revisions</h4>
                        <span className="text-[11px] text-on-surface-variant">Last updated by Alex Morgan</span>
                      </div>
                    </div>
                    <span className="font-numeric text-xs font-bold px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface">
                      v2.4 Live
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {REVISIONS.map((rev) => (
                      <div key={rev.version} className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-on-surface">Version {rev.version}</span>
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-surface-container-highest text-on-surface-variant">
                              {rev.note}
                            </span>
                          </div>
                          <span className="text-[11px] text-on-surface-variant">{rev.meta}</span>
                        </div>
                        <button
                          className="px-2.5 py-1 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-[11px] font-bold text-on-surface transition-colors"
                          type="button"
                          onClick={() =>
                            showToast(
                              `Rollback Preview — v${rev.version}`,
                              "Review the diff and confirm restore to make this version live."
                            )
                          }
                        >
                          Restore
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    className="inline-flex items-center gap-1.5 text-secondary hover:underline text-xs font-semibold self-start"
                    type="button"
                    onClick={() => showToast("Full Changelog Opened", "Viewing all 14 previous revisions.")}
                  >
                    <span className="material-symbols-outlined text-[16px]">manage_history</span>
                    View all 14 previous revisions
                  </button>
                </div>

                {/* Group Administration */}
                <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-surface-container-high/40 flex flex-col gap-3">
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    Group Administration
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      {
                        icon: "content_copy",
                        label: "Duplicate Group as Template",
                        toast: ["Group Duplicated", "Tahoe Ski Weekend copied as a reusable template."],
                      },
                      {
                        icon: "supervisor_account",
                        label: "Transfer Group Ownership",
                        toast: ["Ownership Transfer Opened", "Select a member to hand over host admin."],
                      },
                    ].map((row) => (
                      <button
                        key={row.label}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold flex items-center justify-between transition-colors"
                        type="button"
                        onClick={() => showToast(row.toast[0], row.toast[1])}
                      >
                        <span className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[17px] text-outline">{row.icon}</span>
                          {row.label}
                        </span>
                        <span className="material-symbols-outlined text-[16px] text-outline">chevron_right</span>
                      </button>
                    ))}
                    <button
                      className="w-full px-3.5 py-2.5 rounded-xl bg-error-container/40 hover:bg-error-container/70 text-error text-xs font-semibold flex items-center justify-between transition-colors"
                      type="button"
                      onClick={() =>
                        showToast("Archive Group Tab", "Requires host confirmation — archive action queued.")
                      }
                    >
                      <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[17px] text-error">archive</span>
                        Archive or Close Group Tab
                      </span>
                      <span className="material-symbols-outlined text-[16px] text-error">chevron_right</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-surface-container-lowest border border-outline-variant/60 shadow-xl p-4 rounded-2xl flex items-center gap-3 z-50">
          <div className="w-8 h-8 rounded-xl bg-primary-fixed text-on-primary-fixed flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[18px]">check</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-on-surface">{toast.title}</span>
            <span className="text-[11px] text-on-surface-variant">{toast.body}</span>
          </div>
        </div>
      )}
    </AppLayout>
  );
}