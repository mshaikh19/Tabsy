import { useEffect, useMemo, useRef, useState } from "react";

const CATEGORIES = [
  {
    id: "smileys",
    label: "Smileys",
    icon: "sentiment_satisfied",
    emojis: [
      ["😀", "grinning"], ["😃", "smiley"], ["😄", "smile"], ["😁", "grin"], ["😆", "laughing"],
      ["😅", "sweat_smile"], ["😂", "joy"], ["🤣", "rofl"], ["😊", "blush"], ["😇", "innocent"],
      ["🙂", "slight_smile"], ["😉", "wink"], ["😌", "relieved"], ["😍", "heart_eyes"], ["🥰", "smiling_hearts"],
      ["😘", "kissing_heart"], ["😜", "tongue_wink"], ["🤪", "zany"], ["🤨", "raised_eyebrow"], ["🧐", "monocle"],
      ["🤓", "nerd"], ["😎", "sunglasses"], ["🥳", "partying"], ["😏", "smirk"], ["😴", "sleeping"],
      ["🤔", "thinking"], ["🤗", "hugs"], ["🤫", "shushing"], ["🫡", "salute"], ["🥸", "disguised"],
    ],
  },
  {
    id: "travel",
    label: "Travel",
    icon: "flight",
    emojis: [
      ["✈️", "airplane"], ["🚗", "car"], ["🚕", "taxi"], ["🚌", "bus"], ["🚲", "bike"],
      ["🚂", "locomotive"], ["🚢", "ship"], ["⛵", "sailboat"], ["🚁", "helicopter"], ["🚀", "rocket"],
      ["🗺️", "map"], ["🧭", "compass"], ["🏔️", "mountain_snow"], ["⛰️", "mountain"], ["🌋", "volcano"],
      ["🏕️", "camping"], ["🏖️", "beach_umbrella"], ["🏝️", "island"], ["🏜️", "desert"], ["🌅", "sunrise"],
      ["🌄", "mountains_sunrise"], ["🌆", "cityscape"], ["🌃", "night_city"], ["🌉", "bridge"], ["🗽", "statue_liberty"],
      ["🗼", "tokyo_tower"], ["🏰", "castle"], ["🏯", "japanese_castle"], ["⛺", "tent"], ["🎿", "ski"],
      ["🏂", "snowboarder"], ["⛷️", "skier"], ["🛷", "sled"], ["🚗", "racing_car"], ["🛻", "pickup_truck"],
    ],
  },
  {
    id: "food",
    label: "Food",
    icon: "restaurant",
    emojis: [
      ["🍕", "pizza"], ["🍔", "burger"], ["🍟", "fries"], ["🌭", "hotdog"], ["🥪", "sandwich"],
      ["🌮", "taco"], ["🌯", "burrito"], ["🥗", "salad"], ["🍝", "spaghetti"], ["🍜", "ramen"],
      ["🍣", "sushi"], ["🍱", "bento"], ["🍤", "shrimp"], ["🍦", "ice_cream"], ["🍩", "donut"],
      ["🍪", "cookie"], ["🎂", "cake"], ["🍰", "cake_slice"], ["🍫", "chocolate"], ["🍿", "popcorn"],
      ["🥑", "avocado"], ["🍎", "apple"], ["🍌", "banana"], ["🍇", "grapes"], ["🍓", "strawberry"],
      ["☕", "coffee"], ["🍵", "tea"], ["🍺", "beer"], ["🍷", "wine"], ["🍸", "cocktail"], ["🥤", "cup_straw"],
    ],
  },
  {
    id: "activities",
    label: "Activities",
    icon: "sports_esports",
    emojis: [
      ["⚽", "soccer"], ["🏀", "basketball"], ["🏈", "football"], ["⚾", "baseball"], ["🎾", "tennis"],
      ["🏐", "volleyball"], ["🏓", "ping_pong"], ["🏸", "badminton"], ["🥊", "boxing"], ["🥋", "martial_arts"],
      ["⛳", "golf"], ["⛸️", "ice_skate"], ["🎣", "fishing"], ["🏊", "swimming"], ["🏄", "surfing"],
      ["🚴", "cycling"], ["🏋️", "weightlifting"], ["🧘", "yoga"], ["🏆", "trophy"], ["🥇", "medal"],
      ["🎯", "dart"], ["🎳", "bowling"], ["🎮", "video_game"], ["🎲", "game_die"], ["🧩", "puzzle"],
      ["🎨", "art"], ["🎬", "clapper"], ["🎤", "microphone"], ["🎧", "headphones"], ["🎸", "guitar"],
    ],
  },
  {
    id: "objects",
    label: "Objects",
    icon: "category",
    emojis: [
      ["💡", "bulb"], ["🔋", "battery"], ["🔌", "plug"], ["💻", "laptop"], ["🖥️", "desktop"],
      ["⌨️", "keyboard"], ["🖱️", "mouse"], ["📱", "iphone"], ["☎️", "telephone"], ["📺", "tv"],
      ["📷", "camera"], ["📸", "camera_flash"], ["🎥", "movie_camera"], ["⏰", "alarm_clock"], ["⌛", "hourglass"],
      ["⏳", "hourglass_flowing"], ["📅", "calendar"], ["📈", "chart_up"], ["📊", "bar_chart"], ["💰", "money_bag"],
      ["💳", "credit_card"], ["💎", "gem"], ["🔑", "key"], ["🔒", "lock"], ["🔨", "hammer"],
      ["🧲", "magnet"], ["🎁", "gift"], ["🎈", "balloon"], ["🎉", "tada"], ["✨", "sparkles"],
      ["🔥", "fire"], ["💧", "droplet"], ["🌈", "rainbow"], ["⭐", "star"], ["🌟", "star2"],
    ],
  },
  {
    id: "symbols",
    label: "Symbols",
    icon: "favorite",
    emojis: [
      ["❤️", "heart"], ["🧡", "orange_heart"], ["💛", "yellow_heart"], ["💚", "green_heart"], ["💙", "blue_heart"],
      ["💜", "purple_heart"], ["🖤", "black_heart"], ["🤍", "white_heart"], ["💯", "hundred"], ["✅", "check"],
      ["❌", "x"], ["⭕", "circle"], ["🔴", "red_circle"], ["🟢", "green_circle"], ["🔵", "blue_circle"],
      ["🟡", "yellow_circle"], ["🟠", "orange_circle"], ["🟣", "purple_circle"], ["⚫", "black_circle"], ["⚪", "white_circle"],
      ["🔔", "bell"], ["📢", "loudspeaker"], ["📣", "megaphone"], ["🏁", "checkered_flag"], ["🚩", "triangular_flag"],
      ["🎌", "crossed_flags"], ["💤", "zzz"], ["💬", "speech_balloon"], ["💭", "thought_balloon"], ["⌚", "watch"],
    ],
  },
];

export default function EmojiPicker({ anchorRef, onSelect, onClose }) {
  const [active, setActive] = useState("smileys");
  const [query, setQuery] = useState("");
  const panelRef = useRef(null);

  useEffect(() => {
    function onPointerDown(e) {
      if (panelRef.current?.contains(e.target)) return;
      if (anchorRef?.current?.contains(e.target)) return;
      onClose();
    }
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [anchorRef, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CATEGORIES.find((c) => c.id === active)?.emojis ?? [];
    return CATEGORIES.flatMap((c) => c.emojis).filter(([, name]) => name.includes(q));
  }, [active, query]);

  return (
    <div
      ref={panelRef}
      className="absolute left-0 top-full mt-2 z-50 w-full max-w-md rounded-2xl border border-surface-container-high/60 bg-surface-container-lowest p-3 shadow-xl flex flex-col gap-2.5"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-[16px]">add_reaction</span>
          </div>
          <span className="text-sm font-bold text-on-surface">Pick an Emoji</span>
        </div>
        <button
          aria-label="Close emoji picker"
          className="w-7 h-7 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface flex items-center justify-center transition-colors shrink-0"
          type="button"
          onClick={onClose}
        >
          <span className="material-symbols-outlined text-[16px]">close</span>
        </button>
      </div>

      <div className="flex items-center gap-2 bg-surface-container-low rounded-xl px-3 py-2">
        <span className="material-symbols-outlined text-[18px] text-outline">search</span>
        <input
          className="w-full bg-transparent font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none"
          placeholder="Search emoji…"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button
            aria-label="Clear search"
            className="text-outline hover:text-on-surface transition-colors"
            type="button"
            onClick={() => setQuery("")}
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        )}
      </div>

        {!query && (
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
            {CATEGORIES.map((cat) => {
              const selected = active === cat.id;
              return (
                <button
                  key={cat.id}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full font-body-sm text-body-sm whitespace-nowrap transition-all shrink-0 ${
                    selected
                      ? "bg-primary-fixed text-on-primary-fixed font-semibold"
                      : "bg-surface-container-low text-on-surface-variant hover:text-on-surface"
                  }`}
                  type="button"
                  onClick={() => setActive(cat.id)}
                >
                  <span className="material-symbols-outlined text-[15px]">{cat.icon}</span>
                  {cat.label}
                </button>
              );
            })}
          </div>
        )}

        <div className="max-h-64 overflow-y-auto pr-0.5">
          {results.length > 0 ? (
            <div className="grid grid-cols-8 sm:grid-cols-10 gap-1">
              {results.map(([emoji, name]) => (
                <button
                  key={name}
                  className="text-2xl p-1.5 rounded-lg hover:bg-surface-container transition-colors flex items-center justify-center"
                  title={name}
                  type="button"
                  onClick={() => onSelect(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center text-on-surface-variant font-body-sm text-body-sm">
              No emoji found for “{query}”
            </div>
          )}
        </div>

        <span className="font-label-caps text-label-caps uppercase tracking-wider text-outline">
          {results.length} emoji{results.length === 1 ? "" : "s"} available
        </span>
    </div>
  );
}