import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const EMOJIS = ["ðŸ¥‘", "ðŸŒ´", "ðŸŒ¸", "ðŸ±", "âš¡", "ðŸ"];
const CURRENCIES = [
  { code: "INR", flag: "ðŸ‡®ðŸ‡³", label: "INR (â‚¹)" },
  { code: "EUR", flag: "ðŸ‡ªðŸ‡º", label: "EUR (â‚¬)" },
  { code: "GBP", flag: "ðŸ‡¬ðŸ‡§", label: "GBP (Â£)" },
  { code: "CAD", flag: "ðŸ‡¨ðŸ‡¦", label: "CAD ($)" },
  { code: "JPY", flag: "ðŸ‡¯ðŸ‡µ", label: "JPY (Â¥)" },
];

export default function ProfileSetup() {
  const navigate = useNavigate();
  const [avatarEmoji, setAvatarEmoji] = useState("ðŸ¥‘");
  const [avatarImage, setAvatarImage] = useState(null);
  const [displayName, setDisplayName] = useState("Arjun Sharma");
  const [handle, setHandle] = useState("arjun");
  const [currency, setCurrency] = useState("INR");
  const fileInput = useRef(null);

  const openFilePicker = () => fileInput.current?.click();

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setAvatarImage(event.target.result);
    reader.readAsDataURL(file);
  };

  const handleNext = () => {
    const draft = { avatarEmoji, avatarImage, displayName, handle, currency };
    localStorage.setItem("tabsyProfileDraft", JSON.stringify(draft));
    navigate("/profile-setup/preferences");
  };

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen">
      <header className="fixed top-0 left-0 right-0 w-full z-40 bg-surface/85 backdrop-blur-md border-b border-surface-container">
        <div className="max-w-7xl mx-auto px-gutter-desktop h-16 flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <img alt="Tabsy" className="w-8 h-8 rounded-xl" src="./assets/logo.svg" />
            <span className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
              Tabsy
            </span>
            <span className="hidden sm:inline-block ml-space-xs px-2.5 py-0.5 rounded-full bg-bento-mint border border-bento-mint-border font-body-sm text-body-sm text-emerald-900 font-semibold">
              One tab. All sorted.
            </span>
          </div>
          <div className="flex items-center gap-space-md">
            <a
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container transition-colors"
              href="#"
            >
              <span className="material-symbols-outlined text-[16px] text-secondary">
                help
              </span>
              <span className="font-medium">Help &amp; Security</span>
            </a>
          </div>
        </div>
      </header>

      <main className="w-full h-screen pt-16 bg-surface overflow-y-auto">
        <div className="w-full max-w-4xl mx-auto px-margin sm:px-margin-tablet lg:px-margin-desktop py-space-md">
          <div className="flex items-center gap-space-sm mb-space-md">
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-2.5 rounded-full bg-primary-container" />
              <div className="w-12 h-2.5 rounded-full bg-surface-container" />
            </div>
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider font-bold">
              Step 2 of 2: Your Profile &amp; Preferences (Part 1)
            </span>
          </div>

          <div className="mb-space-lg">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-bento-purple border border-bento-purple-border text-purple-900 font-label-caps text-label-caps font-bold mb-2">
              <span>âœ¨ SETUP IN 60S</span>
            </div>
            <h1 className="font-headline-md text-headline-md sm:text-headline-lg font-bold text-on-surface tracking-tight flex items-center gap-2">
              <span>Set up your profile</span>
              <span className="inline-block">ðŸ‘¤</span>
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              Add your photo, name, handle, and currency to get started.
            </p>
          </div>

          <div className="bg-surface-container-lowest rounded-3xl p-space-md sm:p-space-lg border border-surface-container flex flex-col gap-space-md shadow-sm">
            <div className="bg-white border border-surface-container rounded-3xl p-space-md flex flex-col md:flex-row items-center md:items-start gap-space-md shadow-sm">
              <div className="relative group shrink-0">
                <div className="w-24 h-24 rounded-3xl bg-surface-container-low border border-surface-container flex items-center justify-center text-4xl select-none transition-transform duration-200 overflow-hidden">
                  {avatarImage ? (
                    <img src={avatarImage} alt="Avatar" className="w-full h-full object-cover rounded-3xl" />
                  ) : (
                    <span>{avatarEmoji}</span>
                  )}
                </div>
                <button
                  type="button"
                  aria-label="Upload photo"
                  onClick={openFilePicker}
                  className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-on-surface text-surface-container-lowest flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-transform"
                >
                  <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                </button>
                <input ref={fileInput} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
              </div>

              <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left gap-space-sm">
                <div className="flex items-center gap-2">
                  <h2 className="font-title-md text-title-md text-on-surface font-bold">Your Group Avatar</h2>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100/80 text-amber-900 font-label-caps text-label-caps font-bold">
                    PLAYFUL
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Tap a sticker badge or upload your personal snap.
                </p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
                  {EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => {
                        setAvatarEmoji(emoji);
                        setAvatarImage(null);
                      }}
                      className={`w-10 h-10 rounded-2xl text-xl flex items-center justify-center transition-transform active:scale-95 ${
                        !avatarImage && avatarEmoji === emoji
                          ? "bg-surface-container-low border-2 border-primary-container shadow-sm ring-2 ring-primary-container/20"
                          : "bg-surface-container-lowest border border-surface-container hover:bg-surface-container-low"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={openFilePicker}
                    className="ml-1 px-3 py-2 rounded-2xl bg-surface-container-lowest border border-surface-container font-label-caps text-label-caps text-on-surface hover:bg-surface-container-low transition-colors flex items-center gap-1.5 shadow-sm font-semibold"
                  >
                    <span className="material-symbols-outlined text-body-md text-on-surface-variant">file_upload</span>
                    <span>Upload</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
              <div className="p-space-md rounded-3xl bg-surface-container-low border border-surface-container flex flex-col gap-1.5">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase font-semibold flex items-center justify-between" htmlFor="display-name">
                  <span>Display Name</span>
                  <span className="text-emerald-700 text-label-caps font-bold">REQUIRED</span>
                </label>
                <div className="relative flex items-center mt-1">
                  <input
                    id="display-name"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full h-11 px-4 rounded-2xl bg-surface-container-lowest text-on-surface font-title-md text-title-md border border-surface-container placeholder:text-outline focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all"
                  />
                  <span className="material-symbols-outlined absolute right-3.5 text-on-surface-variant text-[18px] pointer-events-none">
                    badge
                  </span>
                </div>
              </div>

              <div className="p-space-md rounded-3xl bg-surface-container-low border border-surface-container flex flex-col gap-1.5">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase font-semibold flex items-center justify-between" htmlFor="handle">
                  <span>Tabsy Handle</span>
                  <span className="text-secondary font-bold text-label-caps">UNIQUE ID</span>
                </label>
                <div className="relative flex items-center mt-1">
                  <span className="absolute left-4 font-headline-sm text-headline-sm text-on-surface-variant font-bold">@</span>
                  <input
                    id="handle"
                    type="text"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    placeholder="username"
                    className="w-full h-11 pl-9 pr-10 rounded-2xl bg-surface-container-lowest text-on-surface font-title-md text-title-md border border-surface-container placeholder:text-outline focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                  />
                  <span className="material-symbols-outlined absolute right-3.5 text-primary-container text-[18px] pointer-events-none">
                    verified
                  </span>
                </div>
              </div>
            </div>

            <div className="p-space-md rounded-3xl bg-white border border-surface-container flex flex-col gap-space-sm shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label className="font-label-caps text-label-caps text-on-surface uppercase font-bold tracking-wider">
                    Default Group Currency
                  </label>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-caps text-label-caps font-bold">
                    MULTI-CURRENCY
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
                {CURRENCIES.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => setCurrency(c.code)}
                    className={`h-10 rounded-2xl font-headline-sm text-body-md flex items-center justify-center gap-2 transition-all whitespace-nowrap leading-none ${
                      currency === c.code
                        ? "bg-surface-container-low text-emerald-950 border-2 border-emerald-500 shadow-sm ring-2 ring-emerald-500/20 font-bold"
                        : "bg-white text-on-surface border border-surface-container hover:bg-surface-container-low font-semibold"
                    } ${c.code === "JPY" ? "col-span-2 sm:col-span-1" : ""}`}
                  >
                    <span className="text-base leading-none">{c.flag}</span>
                    <span className="leading-none">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-space-md flex justify-end border-t border-surface-container">
              <button
                type="button"
                onClick={handleNext}
                className="px-8 h-11 rounded-full bg-slate-900 text-surface-container-lowest font-headline-sm text-title-md font-bold flex items-center justify-center gap-2.5 shadow-lg hover:bg-slate-800 active:scale-95 transition-all"
              >
                <span>Next</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
