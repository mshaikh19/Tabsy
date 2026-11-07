import AppLayout from "../components/layout/AppLayout";

export default function QuickActions() {
  const [activeFlow, setActiveFlow] = useState(() => {
    return localStorage.getItem("quickActionsFlow") || "expense";
  });

  const handleFlowChange = (flow) => {
    setActiveFlow(flow);
    localStorage.setItem("quickActionsFlow", flow);
  };

  return (
    <AppLayout>
      <main className="w-full pt-4 bg-surface">
        <div className="max-w-7xl mx-auto w-full px-6 lg:px-12 py-8 flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-1">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-primary-container/20 text-on-primary-container font-label-caps text-label-caps font-bold">
                  MODULAR STUDIO
                </span>
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                  Dual Flow Fast Engine
                </span>
              </div>
              <h1 className="font-headline-lg text-headline-lg tracking-tight text-on-surface">
                Quick Actions Studio
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Log multi-party splits with real-time sliders, dispatch smart nudges, or settle debts in one click.
              </p>
            </div>
            <div className="flex items-center gap-3 bg-surface-container-low px-4 py-2 rounded-full self-start md:self-auto border border-surface-container-high/60">
              <span className="flex h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Live Hub: <strong className="text-on-surface font-semibold">4 active groups</strong>
              </span>
              <span className="text-outline-variant">•</span>
              <span className="font-label-caps text-label-caps text-primary font-bold uppercase">Ready</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <section className="lg:col-span-7 flex flex-col gap-6">
              <div className="bg-surface-container-lowest p-2 rounded-2xl shadow-sm border border-surface-container flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleFlowChange("expense")}
                  className={`action-tab-btn flex-1 py-3 px-3.5 rounded-xl font-title-md text-body-md flex items-center justify-center gap-2 transition-all ${
                    activeFlow === "expense"
                      ? "font-semibold bg-pastel-mint text-on-primary-container border border-pastel-mint-border shadow-xs"
                      : "font-medium text-on-surface-variant hover:text-on-surface hover:bg-pastel-sky/60"
                  }`}
                >
                  <span className="w-6 h-6 rounded-lg bg-primary-container flex items-center justify-center text-on-primary font-bold text-sm">
                    +
                  </span>
                  <span>Add Expense</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleFlowChange("tab")}
                  className={`action-tab-btn flex-1 py-3 px-3.5 rounded-xl font-title-md text-body-md flex items-center justify-center gap-2 transition-all ${
                    activeFlow === "tab"
                      ? "font-semibold bg-pastel-sky text-on-secondary-fixed border border-pastel-sky-border shadow-xs"
                      : "font-medium text-on-surface-variant hover:text-on-surface hover:bg-pastel-sky/60"
                  }`}
                >
                  <span className="text-base">🌴</span>
                  <span>Create Tab</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleFlowChange("settle")}
                  className={`action-tab-btn flex-1 py-3 px-3.5 rounded-xl font-title-md text-body-md flex items-center justify-center gap-2 transition-all ${
                    activeFlow === "settle"
                      ? "font-semibold bg-pastel-buttercup text-on-surface border border-pastel-buttercup-border shadow-xs"
                      : "font-medium text-on-surface-variant hover:text-on-surface hover:bg-pastel-buttercup/60"
                  }`}
                >
                  <span className="text-base">⚡</span>
                  <span>Instant Settle</span>
                </button>
              </div>

              {activeFlow === "expense" && (
              <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-7 shadow-sm border border-surface-container flex flex-col gap-6">
                <div className="bg-pastel-mint/40 border border-pastel-mint-border/80 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <span className="font-label-caps text-label-caps uppercase text-on-primary-fixed-variant font-bold tracking-wider mb-1">
                      Expense Amount
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-headline-lg text-headline-lg font-bold text-primary">₹</span>
                      <input
                        className="font-headline-lg text-headline-lg font-bold text-on-surface bg-transparent border-0 focus:outline-none w-48 sm:w-56 tracking-tight p-0"
                        step="0.01"
                        type="number"
                        defaultValue="142.80"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <div className="relative bg-surface-container-lowest rounded-xl px-3 py-2 shadow-xs border border-surface-container-high">
                      <select className="bg-transparent font-title-md text-body-md text-on-surface pr-6 focus:outline-none appearance-none cursor-pointer">
                        <option>INR (₹)</option>
                        <option>EUR (€)</option>
                        <option>GBP (Â£)</option>
                        <option>JPY (Â¥)</option>
                      </select>
                      <span className="material-symbols-outlined text-on-surface-variant absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[18px]">
                        expand_more
                      </span>
                    </div>
                    <span className="px-2.5 py-1.5 bg-surface-container-lowest text-on-surface-variant font-body-sm text-body-sm rounded-xl border border-surface-container-high">
                      Today
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold">
                      Merchant / Description
                    </label>
                    <div className="flex items-center bg-surface-container-low px-3.5 py-2.5 rounded-xl border border-transparent focus-within:border-primary-container transition-all">
                      <input
                        className="bg-transparent w-full text-on-surface font-title-md text-body-md focus:outline-none placeholder:text-on-surface-variant/50"
                        placeholder="e.g. Tapas &amp; Sangria"
                        type="text"
                        defaultValue="El Born Tapas Bar"
                      />
                      <span className="text-xl ml-2">🍷</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold">
                      Category Tag
                    </label>
                    <div className="flex items-center gap-1.5">
                      <button className="px-3 py-2 rounded-xl text-body-sm font-semibold bg-pastel-peach text-on-surface border border-pastel-peach-border flex items-center gap-1.5" type="button">
                        <span>🍕</span>
                        <span>Food &amp; Drinks</span>
                      </button>
                      <button className="px-3 py-2 rounded-xl text-body-sm font-medium text-on-surface-variant bg-surface-container-low hover:bg-surface-container border border-transparent transition-all flex items-center gap-1.5" type="button">
                        <span>✈️</span>
                        <span>Travel</span>
                      </button>
                      <button className="px-2.5 py-2 rounded-xl text-body-sm font-medium text-on-surface-variant bg-surface-container-low hover:bg-surface-container border border-transparent transition-all flex items-center gap-1" type="button">
                        <span>🏠</span>
                        <span>Flat</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label className="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold">
                      Destination Shared Tab
                    </label>
                    <span className="font-body-sm text-body-sm text-primary font-semibold">Active in 4 groups</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <button className="p-3 rounded-2xl border-2 border-primary bg-pastel-mint/30 flex items-center gap-3 text-left transition-all" type="button">
                      <span className="w-10 h-10 rounded-xl bg-surface-container-lowest flex items-center justify-center text-xl shadow-xs">🌴</span>
                      <div className="flex flex-col overflow-hidden">
                        <span className="font-title-md text-body-md text-on-surface font-semibold truncate">Goa Beach Trip</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">5 members</span>
                      </div>
                    </button>
                    <button className="p-3 rounded-2xl border border-surface-container bg-surface-container-low hover:bg-surface-container flex items-center gap-3 text-left transition-all" type="button">
                      <span className="w-10 h-10 rounded-xl bg-surface-container-lowest flex items-center justify-center text-xl shadow-xs">🏠</span>
                      <div className="flex flex-col overflow-hidden">
                        <span className="font-title-md text-body-md text-on-surface font-semibold truncate">Mumbai Flat 4B</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">3 members</span>
                      </div>
                    </button>
                    <button className="p-3 rounded-2xl border border-surface-container bg-surface-container-low hover:bg-surface-container flex items-center gap-3 text-left transition-all" type="button">
                      <span className="w-10 h-10 rounded-xl bg-surface-container-lowest flex items-center justify-center text-xl shadow-xs">🌸</span>
                      <div className="flex flex-col overflow-hidden">
                        <span className="font-title-md text-body-md text-on-surface font-semibold truncate">Delhi 2026</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">4 members</span>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold">
                        Interactive Split Matrix
                      </label>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Customize weight per participant in real-time.
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 bg-surface-container-low p-1 rounded-xl">
                      <button className="px-2.5 py-1 rounded-lg font-body-sm text-body-sm font-semibold bg-surface-container-lowest text-on-surface shadow-xs" type="button">
                        Equal
                      </button>
                      <button className="px-2.5 py-1 rounded-lg font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface" type="button">
                        Weighted
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {[
                      { initials: "AC", name: "Arjun Sharma", note: "Drinks + Tapas", bg: "bg-pastel-sky", text: "text-secondary", amount: "₹35.70" },
                      { initials: "SM", name: "Sarah Miller", note: "Full share", bg: "bg-pastel-peach", text: "text-tertiary", amount: "₹35.70" },
                      { initials: "LV", name: "Leo Vance", note: "Shared dessert", bg: "bg-pastel-buttercup", text: "text-on-surface", amount: "₹35.70" },
                      { initials: "ML", name: "Maya Lin", note: "Non-alcoholic drinks", bg: "bg-pastel-lavender", text: "text-secondary-container", amount: "₹35.70" },
                    ].map((m) => (
                      <div key={m.name} className="member-row flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-surface-container-low rounded-2xl transition-all">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="member-check w-4 h-4 rounded text-primary focus:ring-primary-container border-outline-variant cursor-pointer"
                          />
                          <div className={`w-8 h-8 rounded-full ${m.bg} ${m.text} font-label-caps text-label-caps font-bold flex items-center justify-center`}>
                            {m.initials}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-title-md text-body-md text-on-surface font-semibold">{m.name}</span>
                            <span className="font-body-sm text-body-sm text-on-surface-variant">{m.note}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                          <input
                            type="range"
                            min="10"
                            max="100"
                            defaultValue="50"
                            className="weight-slider w-28 sm:w-32 h-1.5 bg-surface-container-highest rounded-lg appearance-none cursor-pointer"
                          />
                          <span className={`member-pill px-3 py-1 rounded-xl ${m.bg} ${m.text} font-numeric-balance-md text-body-md font-bold min-w-[70px] text-right`}>
                            {m.amount}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-2 border-dashed border-pastel-mint-border bg-pastel-mint/20 hover:bg-pastel-mint/40 rounded-2xl p-5 text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-2 group">
                  <div className="w-12 h-12 rounded-2xl bg-surface-container-lowest border border-pastel-mint-border flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-primary text-[26px]">photo_camera</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-title-md text-body-md text-on-surface font-semibold">
                      Drag &amp; Drop or Tap to Scan Receipt Slip
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      OCR engine auto-detects line items, subtotal, tip &amp; sales tax
                    </span>
                  </div>
                  <span className="px-2.5 py-1 bg-surface-container-lowest text-primary font-label-caps text-label-caps rounded-full font-bold uppercase tracking-wider shadow-xs">
                    Auto-Itemize Active
                  </span>
                </div>

                <button className="w-full py-4 px-5 rounded-2xl bg-primary hover:bg-on-primary-container text-on-primary font-title-md text-title-md font-semibold shadow-sm transition-all flex items-center justify-center gap-2" type="button">
                  <span>Record &amp; Split Expense</span>
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </button>
              </div>
              )}
              {activeFlow === "tab" && (
                <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-7 shadow-sm border border-surface-container flex flex-col gap-6">
                  <div className="bg-pastel-sky/40 border border-pastel-sky-border/80 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 flex-1">
                      <div className="relative group cursor-pointer">
                        <div className="w-14 h-14 rounded-2xl bg-surface-container-lowest border border-pastel-sky-border flex items-center justify-center text-3xl shadow-xs">
                          🍋
                        </div>
                        <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-label-caps font-bold shadow-xs">
                          ✎
                        </span>
                      </div>
                      <div className="flex flex-col flex-1">
                        <span className="font-label-caps text-label-caps uppercase text-secondary font-bold tracking-wider mb-1">
                          Group Tab Name
                        </span>
                        <input
                          className="font-headline-md text-headline-md font-bold text-on-surface bg-transparent border-0 focus:outline-none w-full tracking-tight p-0 placeholder:text-on-surface-variant/40"
                          placeholder="e.g. Amalfi Coast Summer"
                          type="text"
                          defaultValue="Amalfi Coast Summer 🍋"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 self-start sm:self-auto bg-surface-container-lowest px-2.5 py-1.5 rounded-xl border border-surface-container-high">
                      {["🍋", "✈️", "🍕", "🏠", "🎉"].map((e) => (
                        <button
                          key={e}
                          type="button"
                          className="hover:scale-125 transition-transform text-lg"
                        >
                          {e}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold">
                      Category &amp; Theme
                    </label>
                    <div className="flex flex-wrap items-center gap-2">
                      {[
                        { e: "🏖️ï¸", l: "Vacation" },
                        { e: "🏠", l: "Roommates" },
                        { e: "💼", l: "Project" },
                        { e: "🎪", l: "Event" },
                        { e: "🍷", l: "Dining" },
                      ].map((c) => (
                        <button
                          key={c.l}
                          type="button"
                          className="px-3 py-2 rounded-xl text-body-sm font-medium text-on-surface-variant bg-surface-container-low hover:bg-surface-container border border-transparent transition-all flex items-center gap-1.5"
                        >
                          <span>{c.e}</span>
                          <span>{c.l}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold">
                        Base Tab Currency
                      </label>
                      <div className="relative bg-surface-container-low rounded-xl px-3.5 py-2.5 border border-transparent focus-within:border-secondary transition-all">
                        <select className="bg-transparent w-full text-on-surface font-title-md text-body-md focus:outline-none appearance-none cursor-pointer pr-6">
                          <option>EUR (€) - European Euro</option>
                          <option>INR (₹) - Indian Rupee</option>
                          <option>GBP (Â£) - British Pound</option>
                          <option>JPY (Â¥) - Japanese Yen</option>
                        </select>
                        <span className="material-symbols-outlined text-on-surface-variant absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[18px]">
                          expand_more
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold">
                        Default Split Logic
                      </label>
                      <div className="relative bg-surface-container-low rounded-xl px-3.5 py-2.5 border border-transparent focus-within:border-secondary transition-all">
                        <select className="bg-transparent w-full text-on-surface font-title-md text-body-md focus:outline-none appearance-none cursor-pointer pr-6">
                          <option>Equal 1/N Share (Default)</option>
                          <option>Custom Percentage Split</option>
                          <option>Weighted Points &amp; Shares</option>
                          <option>Exact Amount Breakdown</option>
                        </select>
                        <span className="material-symbols-outlined text-on-surface-variant absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[18px]">
                          expand_more
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                      <label className="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold">
                        Invite Initial Members
                      </label>
                      <span className="font-body-sm text-body-sm text-secondary font-semibold cursor-pointer hover:underline">
                        + Copy Direct Invite Link
                      </span>
                    </div>
                    <div className="bg-surface-container-low p-4 rounded-2xl flex flex-wrap items-center gap-3 border border-transparent focus-within:border-secondary transition-all">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pastel-mint text-on-primary-container text-body-sm font-semibold border border-pastel-mint-border">
                        You (Organizer)
                      </span>
                      {["@alex", "@sarah", "@leo"].map((h) => (
                        <span
                          key={h}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pastel-sky text-secondary text-body-sm font-semibold border border-pastel-sky-border"
                        >
                          {h}
                          <button type="button" className="hover:text-on-surface">
                            ×
                          </button>
                        </span>
                      ))}
                      <input
                        className="bg-transparent flex-1 min-w-[130px] text-body-sm text-on-surface focus:outline-none placeholder:text-on-surface-variant/50 px-2 py-1"
                        placeholder="Add email or @handle..."
                        type="text"
                      />
                    </div>
                    <div className="flex items-center justify-between text-body-sm text-on-surface-variant px-1">
                      <span>
                        Quick add friends:{" "}
                        <button type="button" className="text-secondary font-semibold hover:underline">
                          + Maya
                        </button>
                        ,{" "}
                        <button type="button" className="text-secondary font-semibold hover:underline">
                          + Chloe
                        </button>
                        ,{" "}
                        <button type="button" className="text-secondary font-semibold hover:underline">
                          + David
                        </button>
                      </span>
                      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                        4 confirmed
                      </span>
                    </div>
                  </div>

                  <div className="bg-surface-container-low rounded-2xl p-4 border border-surface-container flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🎯</span>
                        <span className="font-title-md text-body-md text-on-surface font-semibold">
                          Target Budget &amp; Initial Pool
                        </span>
                      </div>
                      <span className="font-label-caps text-label-caps text-secondary font-bold uppercase bg-pastel-sky px-2.5 py-0.5 rounded-full">
                        Optional
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                      <div className="bg-surface-container-lowest p-3 rounded-xl border border-surface-container flex flex-col">
                        <span className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">
                          Target Total Budget
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="font-numeric-balance-md text-numeric-balance-md text-on-surface font-bold">
                            ₹
                          </span>
                          <input
                            className="font-numeric-balance-md text-numeric-balance-md font-bold text-on-surface bg-transparent focus:outline-none w-full"
                            type="number"
                            defaultValue="1600"
                          />
                        </div>
                      </div>
                      <div className="bg-pastel-sky/60 p-3 rounded-xl border border-pastel-sky-border flex flex-col">
                        <span className="font-label-caps text-label-caps text-secondary uppercase mb-1">
                          Estimated Per Member
                        </span>
                        <span className="font-numeric-balance-md text-numeric-balance-md text-secondary font-bold">
                          ₹400.00 / person
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <button className="w-full sm:flex-1 py-4 px-5 rounded-2xl bg-secondary hover:bg-on-secondary-fixed-variant text-on-secondary font-title-md text-title-md font-semibold shadow-sm transition-all flex items-center justify-center gap-2" type="button">
                      <span>Launch Shared Tab</span>
                      <span className="text-lg">🚀</span>
                    </button>
                    <button className="w-full sm:w-auto py-4 px-6 rounded-2xl bg-surface-container-low hover:bg-surface-container text-on-surface font-title-md text-title-md font-medium transition-colors" type="button">
                      Save Draft
                    </button>
                  </div>
                </div>
              )}
              {activeFlow === "settle" && (
                <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-7 shadow-sm border border-surface-container flex flex-col gap-6">
                  <div className="bg-pastel-buttercup/50 border border-pastel-buttercup-border/90 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-col">
                      <span className="font-label-caps text-label-caps uppercase text-on-surface font-bold tracking-wider mb-1">
                        Net Settlement Pool
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="font-numeric-balance-lg text-numeric-balance-lg font-bold text-tertiary">
                          -₹24.30
                        </span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">
                          (Net balance to clear today)
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col text-right">
                        <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                          You Owe
                        </span>
                        <span className="font-numeric-balance-md text-numeric-balance-md font-bold text-tertiary">
                          ₹80.50
                        </span>
                      </div>
                      <div className="h-8 w-px bg-surface-container-highest" />
                      <div className="flex flex-col text-right">
                        <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                          You Are Owed
                        </span>
                        <span className="font-numeric-balance-md text-numeric-balance-md font-bold text-primary">
                          ₹56.20
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-pastel-mint/30 border border-pastel-mint-border rounded-2xl p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-surface-container-lowest border border-pastel-mint-border flex items-center justify-center text-primary text-base shadow-xs">
                        <span className="material-symbols-outlined text-[20px]">alt_route</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-title-md text-body-md text-on-surface font-semibold">
                          Min-Cost Graph Optimization Active
                        </span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">
                          Tabsy reduced 5 circular transactions down to 2 direct settlements.
                        </span>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                    </label>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <label className="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold">
                        1-Tap Clearance Items
                      </label>
                      <span className="font-body-sm text-body-sm text-primary font-semibold">
                        2 ready for clearance
                      </span>
                    </div>
                    <div className="flex flex-col gap-3">
                      {[
                        { initials: "CW", name: "Chloe Wang", sub: "Sushi Dinner in Shinjuku • Tokyo 2026", amount: "₹38.50", bg: "bg-pastel-peach", text: "text-tertiary" },
                        { initials: "ML", name: "Maya Lin", sub: "Shared Uber from Airport • Goa Beach Trip", amount: "₹42.00", bg: "bg-pastel-lavender", text: "text-secondary" },
                      ].map((c) => (
                        <div key={c.name} className="bg-surface-container-low rounded-2xl p-4 border border-surface-container flex flex-col gap-3 transition-all">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full ${c.bg} ${c.text} font-label-caps text-label-caps font-bold flex items-center justify-center text-sm shadow-xs`}>
                                {c.initials}
                              </div>
                              <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                  <span className="font-title-md text-body-md text-on-surface font-semibold">{c.name}</span>
                                  <span className="px-2 py-0.5 rounded-full bg-pastel-peach text-tertiary font-label-caps text-label-caps font-bold uppercase">
                                    To Pay
                                  </span>
                                </div>
                                <span className="font-body-sm text-body-sm text-on-surface-variant">{c.sub}</span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="font-numeric-balance-md text-numeric-balance-md text-tertiary font-bold">
                                {c.amount}
                              </span>
                              <span className="font-body-sm text-body-sm text-on-surface-variant">You owe</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-surface-container-high/60">
                            <button className="py-2.5 px-3 rounded-xl bg-surface-container-lowest hover:bg-pastel-mint border border-surface-container text-on-surface font-body-sm text-body-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs" type="button">
                              <span className="material-symbols-outlined text-[18px]">payments</span>
                              <span>Paytm</span>
                            </button>
                            <button className="py-2.5 px-3 rounded-xl bg-surface-container-lowest hover:bg-pastel-sky border border-surface-container text-on-surface font-body-sm text-body-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs" type="button">
                              <span className="material-symbols-outlined text-[18px]">qr_code</span>
                              <span>Google Pay</span>
                            </button>
                          </div>
                        </div>
                      ))}
                      <div className="bg-surface-container-low rounded-2xl p-4 border border-surface-container flex flex-col gap-3 transition-all">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-pastel-sky text-secondary font-label-caps text-label-caps font-bold flex items-center justify-center text-sm shadow-xs">
                              DA
                            </div>
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <span className="font-title-md text-body-md text-on-surface font-semibold">David Ahn</span>
                                <span className="px-2 py-0.5 rounded-full bg-pastel-mint text-on-primary-container font-label-caps text-label-caps font-bold uppercase">
                                  To Collect
                                </span>
                              </div>
                              <span className="font-body-sm text-body-sm text-on-surface-variant">Concert Tickets &amp; Rides • Flatmates #402</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="font-numeric-balance-md text-numeric-balance-md text-primary font-bold">
                              +₹56.20
                            </span>
                            <span className="font-body-sm text-body-sm text-primary font-medium">Owes you</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-surface-container-high/60">
                          <button className="py-2.5 px-3 rounded-xl bg-surface-container-lowest hover:bg-pastel-buttercup border border-surface-container text-on-surface font-body-sm text-body-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs" type="button">
                            <span className="text-sm">💬</span>
                            <span>Ping via WhatsApp</span>
                          </button>
                          <button className="py-2.5 px-3 rounded-xl bg-secondary text-on-secondary font-body-sm text-body-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs hover:bg-on-secondary-fixed-variant" type="button">
                            <span className="material-symbols-outlined text-[16px]">send</span>
                            <span>Send 1-Tap Reminder</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <button className="w-full sm:flex-1 py-4 px-5 rounded-2xl bg-tertiary hover:bg-on-tertiary-container text-on-tertiary font-title-md text-title-md font-semibold shadow-sm transition-all flex items-center justify-center gap-2" type="button">
                      <span>Settle All Ready Debts (₹80.50)</span>
                      <span className="text-lg">⚡</span>
                    </button>
                    <button className="w-full sm:w-auto py-4 px-6 rounded-2xl bg-surface-container-low hover:bg-surface-container text-on-surface font-title-md text-body-md font-semibold transition-colors" type="button">
                      <span className="material-symbols-outlined text-[18px]">download</span>
                    </button>
                  </div>
                </div>
              )}
            </section>

            <aside className="lg:col-span-5 flex flex-col gap-6">
              <div className="bg-pastel-peach/50 border border-pastel-peach-border rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-2xl bg-surface-container-lowest flex items-center justify-center text-xl shadow-xs">💳</span>
                    <div>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface tracking-tight">Smart Settle Queue</h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">2 debts ready for instant clearance</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-tertiary-container/30 text-on-tertiary-container font-label-caps text-label-caps font-bold uppercase">
                    To Pay
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-xs flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-pastel-peach text-tertiary font-label-caps text-label-caps font-bold flex items-center justify-center">
                          CW
                        </div>
                        <div>
                          <span className="font-title-md text-body-md text-on-surface font-semibold block">Chloe Wang</span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">Sushi Dinner in Shinjuku</span>
                        </div>
                      </div>
                      <span className="font-numeric-balance-md text-numeric-balance-md text-tertiary font-bold">₹38.50</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-surface-container-low">
                      <button className="py-2 px-3 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-body-sm text-body-sm font-semibold flex items-center justify-center gap-1.5 transition-colors" type="button">
                        <span className="material-symbols-outlined text-[16px]">payments</span>
                        <span>Paytm</span>
                      </button>
                      <button className="py-2 px-3 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-body-sm text-body-sm font-semibold flex items-center justify-center gap-1.5 transition-colors" type="button">
                        <span className="material-symbols-outlined text-[16px]">qr_code</span>
                        <span>Google Pay</span>
                      </button>
                    </div>
                  </div>
                  <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-xs flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-pastel-lavender text-secondary font-label-caps text-label-caps font-bold flex items-center justify-center">
                          ML
                        </div>
                        <div>
                          <span className="font-title-md text-body-md text-on-surface font-semibold block">Maya Lin</span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">Shared Uber from Airport</span>
                        </div>
                      </div>
                      <span className="font-numeric-balance-md text-numeric-balance-md text-tertiary font-bold">₹42.00</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-surface-container-low">
                      <button className="py-2 px-3 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-body-sm text-body-sm font-semibold flex items-center justify-center gap-1.5 transition-colors" type="button">
                        <span className="material-symbols-outlined text-[16px]">payments</span>
                        <span>Paytm</span>
                      </button>
                      <button className="py-2 px-3 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-body-sm text-body-sm font-semibold flex items-center justify-center gap-1.5 transition-colors" type="button">
                        <span className="material-symbols-outlined text-[16px]">qr_code</span>
                        <span>Google Pay</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-pastel-sky/50 border border-pastel-sky-border rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-2xl bg-surface-container-lowest flex items-center justify-center text-xl shadow-xs">🔔”</span>
                    <div>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface tracking-tight">Fast Nudge Dispatcher</h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">Friends who owe you money</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-caps text-label-caps font-bold uppercase">
                    Incoming
                  </span>
                </div>
                <div className="flex flex-col gap-2.5">
                  {[
                    { initials: "DA", name: "David Ahn", amount: "₹56.20", bg: "bg-pastel-sky", text: "text-secondary" },
                    { initials: "EK", name: "Elena Rostova", amount: "₹24.00", bg: "bg-pastel-mint", text: "text-primary" },
                    { initials: "TL", name: "Tomás Lopez", amount: "₹19.80", bg: "bg-pastel-buttercup", text: "text-on-surface" },
                  ].map((n) => (
                    <div key={n.name} className="bg-surface-container-lowest p-3.5 rounded-2xl flex items-center justify-between shadow-xs">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full ${n.bg} ${n.text} font-label-caps text-label-caps font-bold flex items-center justify-center`}>
                          {n.initials}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-title-md text-body-md text-on-surface font-semibold">{n.name}</span>
                          <span className="font-body-sm text-body-sm text-primary font-bold">
                            Owes you {n.amount}
                          </span>
                        </div>
                      </div>
                      <button className="px-3 py-1.5 rounded-xl bg-pastel-sky text-secondary font-body-sm text-body-sm font-semibold hover:bg-pastel-sky/80 transition-colors flex items-center gap-1 shadow-xs" type="button">
                        <span className="material-symbols-outlined text-body-md">send</span>
                        <span>Ping</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-pastel-buttercup/50 border border-pastel-buttercup-border rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-2xl bg-surface-container-lowest flex items-center justify-center text-xl shadow-xs">⏱️</span>
                    <div>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface tracking-tight">Recent Quick Logs</h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">Live audit stream with reversible undo</p>
                    </div>
                  </div>
                  <span className="font-label-caps text-label-caps text-on-surface-variant font-bold uppercase">Realtime</span>
                </div>
                <div className="flex flex-col gap-2.5">
                  {[
                    { emoji: "🧾", bg: "bg-pastel-mint", title: "Tapas & Sangria (₹142.80)", sub: "2 mins ago • Barcelona Trip" },
                    { emoji: "⚡", bg: "bg-pastel-peach", title: "Settled ₹80.50 to Alex", sub: "42 mins ago • Paytm" },
                    { emoji: "🌴", bg: "bg-pastel-sky", title: "Created Goa 2026 Tab", sub: "3 hours ago • 4 invited" },
                  ].map((log) => (
                    <div key={log.title} className="bg-surface-container-lowest p-3.5 rounded-2xl flex items-center justify-between shadow-xs">
                      <div className="flex items-center gap-2.5">
                        <span className={`text-base p-1.5 rounded-lg ${log.bg}`}>{log.emoji}</span>
                        <div className="flex flex-col">
                          <span className="font-title-md text-body-md text-on-surface font-semibold">{log.title}</span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">{log.sub}</span>
                        </div>
                      </div>
                      <button className="px-2.5 py-1 rounded-lg bg-surface-container-low hover:bg-error-container text-on-surface-variant hover:text-on-error-container font-body-sm text-body-sm font-semibold transition-colors flex items-center gap-1" type="button">
                        <span className="material-symbols-outlined text-body-md">undo</span>
                        <span>Undo</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>

          <section className="w-full bg-surface-container-lowest rounded-3xl p-6 lg:p-7 shadow-sm border border-surface-container">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex items-center gap-4 max-w-sm">
                <div className="w-12 h-12 rounded-2xl bg-pastel-buttercup border border-pastel-buttercup-border flex items-center justify-center text-2xl shadow-xs">
                  🧮
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface tracking-tight">Mental Math Quick Split</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Instant on-the-fly bill sanity check with custom tip presets.
                  </p>
                </div>
              </div>
              <div className="flex-1 w-full grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-surface-container-low p-3.5 rounded-2xl flex flex-col justify-center border border-transparent focus-within:border-primary-container">
                  <span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold mb-1">
                    Subtotal
                  </span>
                  <div className="flex items-center">
                    <span className="font-numeric-balance-md text-numeric-balance-md text-on-surface font-bold mr-1">₹</span>
                    <input
                      className="w-full bg-transparent font-numeric-balance-md text-numeric-balance-md text-on-surface font-bold focus:outline-none"
                      type="number"
                      defaultValue="120"
                    />
                  </div>
                </div>
                <div className="bg-surface-container-low p-3.5 rounded-2xl flex flex-col justify-center">
                  <span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold mb-1">
                    Tip Rate
                  </span>
                  <div className="flex items-center justify-between gap-1">
                    <button className="tip-rate-btn px-2.5 py-1 rounded-lg font-label-caps text-label-caps font-bold text-on-surface-variant hover:text-on-surface transition-all" type="button">
                      15%
                    </button>
                    <button className="tip-rate-btn px-2.5 py-1 rounded-lg font-label-caps text-label-caps font-bold bg-surface-container-lowest text-on-surface shadow-xs" type="button">
                      18%
                    </button>
                    <button className="tip-rate-btn px-2.5 py-1 rounded-lg font-label-caps text-label-caps font-bold text-on-surface-variant hover:text-on-surface transition-all" type="button">
                      20%
                    </button>
                  </div>
                </div>
                <div className="bg-surface-container-low p-3.5 rounded-2xl flex flex-col justify-center">
                  <span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold mb-1">
                    Split Between
                  </span>
                  <div className="flex items-center justify-between">
                    <button className="w-7 h-7 rounded-lg bg-surface-container-lowest flex items-center justify-center text-on-surface hover:bg-surface-container font-bold shadow-xs transition-colors" type="button">
                      -
                    </button>
                    <span className="font-numeric-balance-md text-numeric-balance-md text-on-surface font-bold">4</span>
                    <button className="w-7 h-7 rounded-lg bg-surface-container-lowest flex items-center justify-center text-on-surface hover:bg-surface-container font-bold shadow-xs transition-colors" type="button">
                      +
                    </button>
                  </div>
                </div>
                <div className="bg-pastel-mint border border-pastel-mint-border p-3.5 rounded-2xl flex flex-col justify-center">
                  <span className="font-label-caps text-label-caps uppercase text-on-primary-fixed-variant font-bold mb-0.5">
                    Each Pays
                  </span>
                  <div className="flex items-baseline">
                    <span className="font-numeric-balance-lg text-numeric-balance-lg text-primary font-bold tracking-tight">
                      ₹35.40
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="fixed bottom-6 right-6 z-50 transform translate-y-24 opacity-0 transition-all duration-300 pointer-events-none flex items-center gap-3 bg-inverse-surface text-inverse-on-surface px-5 py-3.5 rounded-2xl shadow-xl">
            <span className="material-symbols-outlined text-primary-fixed text-[20px]">check_circle</span>
            <span className="font-body-md text-body-md font-medium">Action processed</span>
          </div>
        </div>
      </main>

      <footer className="w-full bg-surface-container-low mt-16 border-t border-surface-container">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-body-md">receipt_long</span>
            </div>
            <span className="font-title-md text-title-md text-on-surface">Tabsy</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant ml-2">
              Â© 2025 All tabs settled effortlessly.
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors" href="#">
              Overview
            </a>
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors" href="#">
              Group Balances
            </a>
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors" href="#">
              Settings
            </a>
          </div>
        </div>
      </footer>
    </AppLayout>
  );
}

