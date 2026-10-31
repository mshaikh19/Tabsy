import { useState } from "react";

export default function Landing() {
  const [currentBill, setCurrentBill] = useState(280);
  const [currentPeople, setCurrentPeople] = useState(4);
  const [currentTip, setCurrentTip] = useState(15);
  const [settled, setSettled] = useState(false);
  const [settledText, setSettledText] = useState("1-Click Settle Up");
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  const handleSettle = () => {
    if (!settled) {
      setSettledText("Settled! 🎉");
      setSettled(true);
      setTimeout(() => setSettledText("All Cleared ✓"), 1200);
    } else {
      setSettledText("1-Click Settle Up");
      setSettled(false);
    }
  };

  const totalWithTip = currentBill * (1 + currentTip / 100);
  const perPerson = totalWithTip / currentPeople;
  const payerGetsBack = totalWithTip - perPerson;

  const colors = [
    "bg-pastel-rose text-rose-900 border-rose-200",
    "bg-pastel-amber text-amber-950 border-amber-200",
    "bg-pastel-violet text-indigo-900 border-purple-200",
    "bg-pastel-sky text-sky-900 border-sky-200",
  ];

const billPercent = ((currentBill - 20) / (1500 - 20)) * 100;

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setEmailSubmitted(true);
  };

  return (
    <div className="bg-surface-ground font-sans text-ink antialiased selection:bg-pastel-violet-deep selection:text-white relative overflow-x-hidden min-h-screen">
      <header className="fixed top-4 left-0 right-0 z-50 px-4 md:px-8">
        <div className="max-w-[1240px] mx-auto bg-white border border-border-delicate rounded-full py-2.5 px-4 md:px-6 flex items-center justify-between gap-4 shadow-sm">
          <a className="flex items-center gap-2.5 shrink-0 group" href="#">
            <img alt="Tabsy" className="w-10 h-10 rounded-2xl shadow-xs group-hover:scale-105 transition-transform duration-200" src="/logo.svg" />
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-ink flex items-center gap-1.5 leading-none">
                Tabsy
                <span className="text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full bg-pastel-violet text-pastel-violet-deep border border-purple-200">Flat v2.5</span>
              </span>
              <span className="text-[10px] text-ink-muted font-medium mt-0.5">Collaborative expense settlement</span>
            </div>
          </a>
          <div className="hidden md:flex items-center flex-1 max-w-lg mx-2 bg-[#F6F4EE] border border-border-delicate rounded-full px-3 py-1.5 gap-2">
            <div className="w-6 h-6 rounded-full bg-pastel-violet flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[15px] text-pastel-violet-deep">search</span>
            </div>
            <input className="bg-transparent border-0 text-xs text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-0 flex-1 p-0" placeholder="Search tabs, receipts or balances..." type="text" />
            <div className="flex items-center gap-1 shrink-0 text-[11px] font-medium text-ink-muted pl-2 border-l border-zinc-200">
              <span className="text-ink-subtle">in:</span>
              <span className="px-2 py-0.5 rounded-full bg-white text-ink font-semibold shadow-xs text-[10px] cursor-pointer hover:bg-zinc-50 border border-border-delicate">Group Trips</span>
              <span className="px-2 py-0.5 rounded-full bg-transparent hover:bg-white text-ink-muted text-[10px] cursor-pointer transition-colors">Roommates</span>
              <span className="px-2 py-0.5 rounded-full bg-transparent hover:bg-white text-ink-muted text-[10px] cursor-pointer transition-colors">Dinners</span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold text-ink-muted">
              <a className="px-3 py-1.5 rounded-full hover:bg-zinc-100 hover:text-ink transition-colors" href="#features">Features</a>
              <a className="px-3 py-1.5 rounded-full hover:bg-zinc-100 hover:text-ink transition-colors" href="#calculator">Split Simulator</a>
            </nav>
            <a className="px-4 py-2 rounded-full bg-zinc-900 text-white text-xs font-bold hover:bg-zinc-800 transition-all shadow-xs flex items-center gap-1.5" href="/signup">
              <span>Start Free Tab</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </a>
            <div className="flex items-center bg-zinc-900 text-white rounded-full p-1 pl-2.5 gap-1.5 border border-zinc-800">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center">
                <span className="material-symbols-outlined text-[14px] text-white">person</span>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="relative z-10 pt-28 md:pt-32 pb-20 w-full max-w-[1240px] mx-auto px-4 sm:px-6 md:px-8 flex flex-col gap-16 md:gap-24">
        <section className="flex flex-col gap-8 md:gap-12">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto gap-4 pt-4">
            <div className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full border border-border-delicate shadow-xs">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-pastel-amber text-amber-900 text-xs font-bold">🌸</span>
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-800">Organic Settlement Engine</span>
              <span className="text-zinc-300">•</span>
              <span className="text-xs font-medium text-ink-muted">Zero awkward split chats</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-ink leading-[1.15]">
              Split bills without the drama.
              <br className="hidden sm:inline" />
              <span className="inline-block mt-2">
                <span className="px-3.5 py-1 rounded-2xl bg-pastel-amber text-zinc-900 border border-amber-200/80">One tab. All sorted.</span>
              </span>
            </h1>
            <p className="text-base sm:text-lg text-ink-muted max-w-xl font-normal leading-relaxed">
              Tabsy automatically groups expenses, renders live debt rings, and calculates optimal graph-settlements with soft organic ease.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a className="px-6 py-3.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-sm transition-all shadow-xs flex items-center gap-2 group" href="/signup">
                <span className="w-5 h-5 rounded-full bg-pastel-amber text-zinc-900 flex items-center justify-center text-xs">✨</span>
                <span>Create a Shared Tab</span>
              </a>
              <a className="px-6 py-3.5 rounded-full bg-white hover:bg-[#F6F4EE] text-ink font-semibold text-sm transition-all shadow-xs flex items-center gap-2 border border-border-delicate" href="#features">
                <span className="material-symbols-outlined text-[18px] text-pastel-rose-deep">play_circle</span>
                <span>Explore Live Ledger</span>
              </a>
            </div>
          </div>

          <div className="bg-white rounded-4xl p-5 md:p-8 border border-border-delicate shadow-sm relative overflow-hidden">
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border-delicate">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-pastel-amber flex items-center justify-center text-2xl border border-amber-200">🌴</div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl md:text-2xl font-bold text-ink">Goa Beach Trip 2025</h2>
                    <span className="px-3 py-0.5 rounded-full bg-pastel-emerald text-emerald-900 font-bold text-[11px] uppercase tracking-wider border border-emerald-300">Active Tab</span>
                  </div>
                  <p className="text-xs text-ink-muted">4 travelers • 14 group expenses recorded • Synchronized via WebSocket</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-[#FAF8F5] px-3.5 py-1.5 rounded-full border border-border-delicate">
                <div className="flex items-center -space-x-2">
                  <img alt="Arjun" className="h-8 w-8 rounded-full object-cover border-2 border-white shadow-xs" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFlyCBCYHFgrzdPRoAPhT_5lLI-EuRuYZbELTLAmTEG0joJEVwMD3bG0_vDRHDBrJ6El0ds_BbXfq6yx8tV0YFzpnwKx_FAJT6tJrIWbKfysYySC5WISrint32vbVL4dr6H6A3f-MSu3PwZyPGTTYbiMhgCAC9VgSPZYT3tjObAo0wE3xJcqXwCjipuTwhIxHA60ZT6HKL0aOTSkoOSoAgoDLiuuYQ86exyOj8zGM" />
                  <img alt="Sneha" className="h-8 w-8 rounded-full object-cover border-2 border-white shadow-xs" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgIvp04KXONtDUnXYLgDa-INuzUxPbxNoS3sBBtE0HkME9r4imOvMpDD9MEAXc2K3TIDdwOceEOxbpM3iPDeX5tTVDV4Iy8NNv2PalNZZKlUJL_ICzY0QKDOJ0rUxQFv0DA0yyRQwimcFn8d92tj7KE2mslFJE7849KCxD58-l5T9FFfcWdPs4ibMfIc17OcY1-3ynxgiaocAqaty_QS6mmEWr03sqhKjSYhpu3sM" />
                  <img alt="Rohan" className="h-8 w-8 rounded-full object-cover border-2 border-white shadow-xs" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzuJJ8W_lGEX1VsfL36QOD5bk7e2dSEvIQV0ZXfN9cIfvegZgbj2vEfUTIXpLGk3TtQdVtmPlLpC7mtgKnZgUoenIUtDwWU3yc7Lqk_6hZRmTj8HcOte83lc6Q3K8ETduVcmDqKxjB2zUH6PvsFUq-R9oAiwxmXu-_2y1FpMXa-AzID8z2LuzTY3rwpibBLSO_lT81Im3Qcq2SA_-v7pUnXhsMom--H0WBi4wnYe0" />
                  <div className="h-8 w-8 rounded-full bg-pastel-amber border-2 border-white flex items-center justify-center text-xs font-bold text-amber-900">+1</div>
                </div>
                <span className="text-xs font-semibold text-zinc-800 pl-1">All members connected</span>
              </div>
            </div>
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 items-start">
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="bg-[#FAF8F5] rounded-3xl p-6 flex flex-col items-center justify-center border border-border-delicate">
                  <div className="flex items-center justify-between w-full mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">Settlement Harmony</span>
                    <span className="px-2 py-0.5 rounded-full bg-pastel-violet text-pastel-violet-deep text-[10px] font-bold border border-purple-200">8.8 Score</span>
                  </div>
                  <div className="relative w-52 h-52 flex items-center justify-center my-1">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                      <circle cx="80" cy="80" fill="none" r="62" stroke="#EFECE6" strokeLinecap="round" strokeWidth="14" />
                      <circle cx="80" cy="80" fill="none" r="62" stroke="#34D399" strokeDasharray="120 390" strokeDashoffset="0" strokeLinecap="round" strokeWidth="14" />
                      <circle cx="80" cy="80" fill="none" r="62" stroke="#FBBF24" strokeDasharray="85 390" strokeDashoffset="-130" strokeLinecap="round" strokeWidth="14" />
                      <circle cx="80" cy="80" fill="none" r="62" stroke="#38BDF8" strokeDasharray="75 390" strokeDashoffset="-225" strokeLinecap="round" strokeWidth="14" />
                      <circle cx="80" cy="80" fill="none" r="62" stroke="#F472B6" strokeDasharray="60 390" strokeDashoffset="-310" strokeLinecap="round" strokeWidth="14" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-3xl font-extrabold tracking-tight text-ink font-mono">₹1,840</span>
                      <span className="text-[11px] font-bold text-emerald-900 bg-pastel-emerald px-2.5 py-0.5 rounded-full mt-1 border border-emerald-300">75% Cleared</span>
                      <span className="text-[10px] text-ink-subtle mt-0.5">₹2,460 Pool</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[11px] font-medium text-ink-muted">
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-border-delicate"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Airbnb</span>
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-border-delicate"><span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Dinners</span>
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-border-delicate"><span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span> Rental</span>
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-border-delicate"><span className="w-2.5 h-2.5 rounded-full bg-pink-400"></span> Fuel</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2.5">
                  <div className="bg-pastel-rose/80 border border-pink-200 rounded-2xl p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-rose-600 border border-pink-200">
                        <span className="material-symbols-outlined text-[18px]">verified</span>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-rose-950">Settled Balances</span>
                        <h4 className="text-lg font-bold text-ink font-mono">₹1,480.00</h4>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-rose-900 bg-white px-2.5 py-1 rounded-full border border-pink-200">+18% this trip</span>
                  </div>
                  <div className="bg-pastel-sky/80 border border-sky-200 rounded-2xl p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-sky-700 border border-sky-200">
                        <span className="material-symbols-outlined text-[18px]">sync_alt</span>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-sky-950">Incoming Settlement Requests</span>
                        <h4 className="text-lg font-bold text-ink font-mono">₹360.50</h4>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-sky-900 bg-white px-2.5 py-1 rounded-full border border-sky-200">2 pending</span>
                  </div>
                  <div className="bg-pastel-amber/80 border border-amber-200 rounded-2xl p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-amber-800 border border-amber-200">
                        <span className="material-symbols-outlined text-[18px]">bolt</span>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-amber-950">Smart Cash Flow Route</span>
                        <h4 className="text-lg font-bold text-ink">1 Transfer Left</h4>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-amber-900 bg-white px-2.5 py-1 rounded-full border border-amber-200">Graph Optimized</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="bg-[#FAF8F5] rounded-3xl p-5 md:p-6 flex flex-col gap-4 border border-border-delicate">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-ink">Active Ledger Feed</h3>
                      <p className="text-xs text-ink-muted">Real-time audited group entries with live split math</p>
                    </div>
                    <div className="flex items-center gap-1 bg-white p-1 rounded-full border border-border-delicate text-[11px] font-semibold">
                      <span className="px-2.5 py-0.5 rounded-full bg-zinc-900 text-white cursor-pointer shadow-xs">All</span>
                      <span className="px-2.5 py-0.5 rounded-full text-ink-muted hover:text-ink cursor-pointer transition-colors">Stays</span>
                      <span className="px-2.5 py-0.5 rounded-full text-ink-muted hover:text-ink cursor-pointer transition-colors">Meals</span>
                      <span className="px-2.5 py-0.5 rounded-full text-ink-muted hover:text-ink cursor-pointer transition-colors">Transit</span>
                    </div>
                  </div>
                  <div className="bg-white border border-border-delicate rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-pastel-emerald flex items-center justify-center text-emerald-800 border border-emerald-200">
                        <span className="material-symbols-outlined text-[20px]">villa</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-ink">Beach Villa, Goa</h4>
                        <p className="text-[11px] text-ink-muted">Paid by Arjun • Split 4 ways equally</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-ink font-mono">₹920.00</span>
                      <div className="text-[10px] font-bold text-emerald-800 bg-pastel-emerald px-2 py-0.5 rounded-full mt-0.5 border border-emerald-200">+₹690.00 returned</div>
                    </div>
                  </div>
                  <div className="bg-white border border-border-delicate rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-pastel-rose flex items-center justify-center text-rose-700 border border-rose-200">
                        <span className="material-symbols-outlined text-[20px]">restaurant</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-ink">Seafood Dinner &amp; Drinks</h4>
                        <p className="text-[11px] text-ink-muted">Paid by Sneha • 4 guests itemized</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-ink font-mono">₹240.00</span>
                      <div className="text-[10px] font-bold text-rose-800 bg-pastel-rose px-2 py-0.5 rounded-full mt-0.5 border border-rose-200">You owe ₹60.00</div>
                    </div>
                  </div>
                  <div className="bg-white border border-border-delicate rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-pastel-sky flex items-center justify-center text-sky-800 border border-sky-200">
                        <span className="material-symbols-outlined text-[20px]">directions_car</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-ink">7-Seater Van Rental + Fuel</h4>
                        <p className="text-[11px] text-ink-muted">Paid by Vikram • Split equally</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-ink font-mono">₹380.00</span>
                      <div className="text-[10px] font-bold text-sky-900 bg-pastel-sky px-2 py-0.5 rounded-full mt-0.5 border border-sky-200">Audited &amp; Verified</div>
                    </div>
                  </div>

                  <div className="bg-pastel-violet/70 border border-purple-200 rounded-2xl p-4 mt-1">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] text-pastel-violet-deep">alt_route</span>
                        <span className="text-xs font-bold text-indigo-950 uppercase tracking-wider">Graph Reduction Engine</span>
                      </div>
                      <span className="text-[10px] font-extrabold text-white bg-pastel-violet-deep px-2.5 py-0.5 rounded-full">3 Transfers → 1</span>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-border-delicate">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                        <span className="font-medium text-ink">Priya &amp; Sneha owe Arjun</span>
                        <span className="font-mono font-bold text-ink">₹360.50</span>
                      </div>
                      <button className="w-full sm:w-auto px-4 py-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer" onClick={handleSettle}>
                        <span className="material-symbols-outlined text-[16px] text-pastel-amber">magic_button</span>
                        <span>{settledText}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-8" id="features">
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-ink-muted">Smarter Collective Finance</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-ink">
              Crafted for groups who prefer harmony over spreadsheets
            </h2>
            <p className="text-sm sm:text-base text-ink-muted">
              Every micro-feature is tuned to make sharing expenses friendly, intuitive, and mathematically perfect.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-pastel-amber/50 border border-amber-200 rounded-3xl p-6 md:p-8 flex flex-col justify-between hover:border-amber-300 transition-colors">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-pastel-amber flex items-center justify-center text-amber-900 mb-6 border border-amber-300/60 shadow-xs">
                  <span className="material-symbols-outlined text-[28px]">receipt_long</span>
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 bg-white px-2.5 py-0.5 rounded-full border border-amber-200">Smart Capture</span>
                <h3 className="text-xl font-bold text-ink mt-2 mb-2">Instant Slip Ingestion</h3>
                <p className="text-sm text-ink-muted leading-relaxed">
                  Snap dinner or hotel receipts. Our multi-model OCR instantly parses line items, tips, tax, and splits them across members in seconds.
                </p>
              </div>
              <div className="mt-6 bg-white rounded-2xl p-3 border border-amber-200 flex items-center justify-between">
                <span className="text-xs font-semibold text-ink">Flexible Split Rules:</span>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pastel-rose text-rose-950 border border-rose-200">Equal 1/N</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pastel-amber text-amber-950 border border-amber-200">Itemized</span>
                </div>
              </div>
            </div>

            <div className="bg-pastel-violet/50 border border-purple-200 rounded-3xl p-6 md:p-8 flex flex-col justify-between hover:border-purple-300 transition-colors">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-pastel-violet flex items-center justify-center text-indigo-900 mb-6 border border-purple-200 shadow-xs">
                  <span className="material-symbols-outlined text-[28px]">hub</span>
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-900 bg-white px-2.5 py-0.5 rounded-full border border-purple-200">Graph Theory</span>
                <h3 className="text-xl font-bold text-ink mt-2 mb-2">Smart Debt Minimization</h3>
                <p className="text-sm text-ink-muted leading-relaxed">
                  Tangled debts automatically compress into the mathematically lowest number of cash transfers. Stop doing 14 awkward cross-repayments.
                </p>
              </div>
              <div className="mt-6 bg-white rounded-2xl p-3 border border-purple-200">
                <div className="flex items-center justify-between text-xs font-medium text-ink-muted mb-2">
                  <span>Transfer Compression</span>
                  <span className="font-bold text-pastel-violet-deep">67% fewer steps</span>
                </div>
                <div className="flex items-center justify-between px-2.5 py-1.5 bg-[#FAF8F5] rounded-xl text-xs border border-border-delicate">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
                    <span className="text-ink-muted line-through">12 transfers</span>
                  </div>
                  <span className="material-symbols-outlined text-[16px] text-pastel-violet-deep">arrow_right_alt</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                    <span className="font-bold text-ink">3 optimal payouts</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-pastel-emerald/50 border border-emerald-200 rounded-3xl p-6 md:p-8 flex flex-col justify-between hover:border-emerald-300 transition-colors">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-pastel-emerald flex items-center justify-center text-emerald-900 mb-6 border border-emerald-200 shadow-xs">
                  <span className="material-symbols-outlined text-[28px]">verified_user</span>
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 bg-white px-2.5 py-0.5 rounded-full border border-emerald-200">Real-time Audit</span>
                <h3 className="text-xl font-bold text-ink mt-2 mb-2">Transparent Ledger &amp; Audit</h3>
                <p className="text-sm text-ink-muted leading-relaxed">
                  Every edit, receipt attachment, exchange rate shift, and settlement logs an immutable event. Full clarity means zero dispute moments.
                </p>
              </div>
              <div className="mt-6 bg-white rounded-2xl p-3 border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="text-xs font-bold text-ink">ACID Consistency</span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-900 bg-pastel-emerald px-2.5 py-0.5 rounded-full border border-emerald-200">100% Synced</span>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-4xl p-6 md:p-10 border border-border-delicate shadow-sm" id="calculator">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 flex flex-col gap-6">
              <div>
                <div className="inline-flex items-center gap-2 bg-pastel-rose px-3 py-1 rounded-full border border-rose-200 text-[11px] font-bold text-rose-900 mb-2">
                  <span>🧮</span>
                  <span>Interactive Playground</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink">Test the Tabsy Split Engine</h2>
                <p className="text-xs sm:text-sm text-ink-muted mt-1">
                  Adjust group size, tip percentage, and bill total to see real-time member balance redistribution.
                </p>
              </div>
              <div className="bg-[#FAF8F5] border border-border-delicate rounded-2xl p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-ink" htmlFor="billSlider">Total Bill Amount</label>
                  <div className="flex items-center gap-1 text-3xl font-extrabold text-ink font-mono">
                    <span className="text-rose-600">₹</span>
                    <span>{currentBill.toLocaleString("en-IN")}</span>
                  </div>
                </div>
                <div className="relative pt-2">
                  <input
                    className="w-full h-3 rounded-full cursor-pointer appearance-none"
                    id="billSlider"
                    max="1500"
                    min="20"
                    step="5"
                    type="range"
                    value={currentBill}
                    style={{ background: `linear-gradient(to right, #E11D48 0%, #E11D48 ${billPercent}%, #E4E4E7 ${billPercent}%, #E4E4E7 100%)` }}
                    onChange={(e) => setCurrentBill(parseFloat(e.target.value))}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-medium text-ink-muted">
                  <span>₹20</span>
                  <span>₹750</span>
                  <span>₹1,500</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {[200, 500, 1000, 1500].map((v) => (
                    <button
                      key={v}
                      onClick={() => setCurrentBill(v)}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-colors ${
                        currentBill === v
                          ? "bg-zinc-900 text-white border-zinc-900"
                          : "bg-white text-ink border-border-delicate hover:bg-zinc-100"
                      }`}
                    >
                      ₹{v.toLocaleString("en-IN")}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#FAF8F5] border border-border-delicate rounded-2xl p-4 flex flex-col justify-between">
                  <span className="text-xs font-bold text-ink mb-2">Diners / Members</span>
                  <div className="flex items-center justify-between bg-white rounded-full p-1 border border-border-delicate">
                    <button className="w-8 h-8 rounded-full bg-[#FAF8F5] hover:bg-zinc-200 text-ink font-bold flex items-center justify-center transition-colors" onClick={() => setCurrentPeople((p) => Math.max(2, p - 1))}>
                      -
                    </button>
                    <div className="flex items-center gap-1 font-mono font-bold text-base text-ink">
                      <span>{currentPeople}</span>
                      <span className="text-xs font-normal text-ink-muted font-sans">people</span>
                    </div>
                    <button className="w-8 h-8 rounded-full bg-[#FAF8F5] hover:bg-zinc-200 text-ink font-bold flex items-center justify-center transition-colors" onClick={() => setCurrentPeople((p) => Math.min(12, p + 1))}>
                      +
                    </button>
                  </div>
                </div>
                <div className="bg-[#FAF8F5] border border-border-delicate rounded-2xl p-4 flex flex-col justify-between">
                  <span className="text-xs font-bold text-ink mb-2">Tip / Gratuity</span>
                  <div className="grid grid-cols-4 gap-1">
                    {[0, 10, 15, 20].map((t) => (
                      <button
                        key={t}
                        className={`tip-btn rounded-full py-1.5 text-xs font-bold border transition-colors ${
                          currentTip === t
                            ? "bg-zinc-900 text-white border-zinc-900 shadow-xs"
                            : "bg-white text-ink border-border-delicate hover:bg-zinc-100"
                        }`}
                        onClick={() => setCurrentTip(t)}
                      >
                        {t}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="bg-[#FAF8F5] border border-border-delicate rounded-3xl p-6 md:p-8">
                <div className="bg-white border border-border-delicate rounded-2xl p-6 shadow-xs flex flex-col gap-5">
                  <div className="flex items-center justify-between pb-3 border-b border-border-delicate">
                    <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">Settlement Formula</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-pastel-emerald text-emerald-800 text-[11px] font-bold border border-emerald-200">Instant Real-time</span>
                  </div>
                  <div className="bg-[#FAF8F5] rounded-2xl p-5 text-center border border-border-delicate flex flex-col items-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">Each Person Pays</span>
                    <div className="flex items-center justify-center gap-1 my-1">
                      <span className="text-2xl font-bold text-rose-600">₹</span>
                      <span className="text-5xl font-extrabold text-ink font-mono">{perPerson.toFixed(2)}</span>
                    </div>
                    <span className="text-xs font-medium text-ink-muted">Total with {currentTip}% tip: ₹{totalWithTip.toFixed(2)}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between bg-[#FAF8F5] px-3.5 py-2.5 rounded-2xl border border-border-delicate">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-pastel-emerald text-emerald-800 font-bold text-xs flex items-center justify-center border border-emerald-200">P1</span>
                        <span className="text-xs font-bold text-ink">Arjun (Payer)</span>
                      </div>
                      <span className="text-xs font-bold text-emerald-700 font-mono">+₹{payerGetsBack.toFixed(2)}</span>
                    </div>
                    {Array.from({ length: Math.max(0, currentPeople - 1) }, (_, i) => i + 2).map((n) => {
                      const colorClass = colors[(n - 2) % colors.length];
                      return (
                        <div key={n} className="flex items-center justify-between bg-[#FAF8F5] px-3.5 py-2.5 rounded-2xl border border-border-delicate">
                          <div className="flex items-center gap-2.5">
                            <span className={`w-6 h-6 rounded-full ${colorClass} font-bold text-xs flex items-center justify-center border`}>P{n}</span>
                            <span className="text-xs font-bold text-ink">Member {n}</span>
                          </div>
                          <span className="text-xs font-bold text-rose-600 font-mono">Owes ₹{perPerson.toFixed(2)}</span>
                        </div>
                      );
                    })}
                  </div>
                  <button className="w-full py-3 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer">
                    <span className="material-symbols-outlined text-[16px] text-pastel-amber">ios_share</span>
                    <span>Share This Split Calculation</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>


        <section className="flex flex-col gap-6">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">Loved by Nomads &amp; Roommates</span>
            <h3 className="text-2xl font-extrabold text-ink mt-1">Zero arguments, total transparency</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-border-delicate shadow-xs">
              <div className="flex items-center gap-1 text-amber-500 mb-3 text-sm">★★★★★</div>
              <p className="text-xs text-ink-muted leading-relaxed italic">
                "The 1-click graph reduction feature settled 42 transactions across 8 friends in Japan into just 4 transfers. Pure genius."
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-pastel-rose text-rose-800 font-bold text-xs flex items-center justify-center border border-rose-200">EM</div>
                <div>
                  <h5 className="text-xs font-bold text-ink">Elena Martinez</h5>
                  <p className="text-[10px] text-ink-muted">Travel Coordinator</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-3xl p-6 border border-border-delicate shadow-xs">
              <div className="flex items-center gap-1 text-amber-500 mb-3 text-sm">★★★★★</div>
              <p className="text-xs text-ink-muted leading-relaxed italic">
                "The pastel donut ring gives immediate peace of mind. Nobody has to hound anyone on WhatsApp anymore."
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-pastel-sky text-sky-800 font-bold text-xs flex items-center justify-center border border-sky-200">KJ</div>
                <div>
                  <h5 className="text-xs font-bold text-ink">Kai Jensen</h5>
                  <p className="text-[10px] text-ink-muted">Flatshare Lead, Berlin</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-3xl p-6 border border-border-delicate shadow-xs">
              <div className="flex items-center gap-1 text-amber-500 mb-3 text-sm">★★★★★</div>
              <p className="text-xs text-ink-muted leading-relaxed italic">
                "Receipt scanning parsed 12 line items and let us tag who drank cocktails vs who ordered appetizers in 15 seconds flat."
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-pastel-emerald text-emerald-800 font-bold text-xs flex items-center justify-center border border-emerald-200">SC</div>
                <div>
                  <h5 className="text-xs font-bold text-ink">Siddharth Chen</h5>
                  <p className="text-[10px] text-ink-muted">Product Designer</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full">
          <div className="bg-white rounded-4xl p-8 md:p-14 text-center shadow-xs border border-border-delicate">
            <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center gap-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pastel-emerald text-emerald-900 text-xs font-bold border border-emerald-300">
                <span>✨</span>
                <span>Free forever for personal tabs</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-ink">
                Ready to close the tab on awkward debt?
              </h2>
              <p className="text-sm text-ink-muted">
                Start a shared tab in 30 seconds. No app store downloads or sign-up walls for friends.
              </p>
              {emailSubmitted ? (
                <div className="w-full max-w-md text-center py-3 rounded-full bg-emerald-600 text-white font-bold text-xs">Tab Created! ✓</div>
              ) : (
                <form className="w-full max-w-md flex flex-col sm:flex-row items-center gap-2 mt-2" onSubmit={handleEmailSubmit}>
                  <input className="w-full rounded-full bg-[#FAF8F5] border border-border-delicate px-5 py-3 text-xs text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-zinc-900 shadow-2xs" placeholder="Enter your email" required type="email" />
                  <button className="w-full sm:w-auto shrink-0 px-6 py-3 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs transition-all shadow-xs cursor-pointer" type="submit">
                    Start Free Tab
                  </button>
                </form>
              )}
              <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-medium text-ink-muted pt-2">
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px] text-emerald-600">check_circle</span> No card required</span>
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px] text-emerald-600">check_circle</span> Instant invite link</span>
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px] text-emerald-600">check_circle</span> 256-bit safe</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t border-border-delicate bg-white">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 md:px-8 py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <img alt="Tabsy" className="w-8 h-8 rounded-xl" src="/logo.svg" />
                <span className="font-extrabold text-lg tracking-tight text-ink">Tabsy</span>
              </div>
              <p className="text-xs text-ink-muted leading-relaxed max-w-xs">
                Collaborative expense settlement for teams, trips, and shared living. Clear balances, minimal transfers, zero awkward chats.
              </p>
              <div className="flex items-center gap-2 mt-1">
                <a className="w-8 h-8 rounded-full bg-[#FAF8F5] border border-border-delicate flex items-center justify-center text-ink-muted hover:text-ink transition-colors" href="#" aria-label="Twitter">
                  <span className="material-symbols-outlined text-[16px]">alternate_email</span>
                </a>
                <a className="w-8 h-8 rounded-full bg-[#FAF8F5] border border-border-delicate flex items-center justify-center text-ink-muted hover:text-ink transition-colors" href="#" aria-label="GitHub">
                  <span className="material-symbols-outlined text-[16px]">code</span>
                </a>
                <a className="w-8 h-8 rounded-full bg-[#FAF8F5] border border-border-delicate flex items-center justify-center text-ink-muted hover:text-ink transition-colors" href="#" aria-label="LinkedIn">
                  <span className="material-symbols-outlined text-[16px]">work</span>
                </a>
              </div>
            </div>
            <div className="flex flex-col gap-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-ink mb-1">Product</h4>
              <a className="text-xs text-ink-muted hover:text-ink transition-colors" href="#features">Features</a>
              <a className="text-xs text-ink-muted hover:text-ink transition-colors" href="#calculator">Split Simulator</a>
              <a className="text-xs text-ink-muted hover:text-ink transition-colors" href="#">Pricing</a>
              <a className="text-xs text-ink-muted hover:text-ink transition-colors" href="#">Changelog</a>
            </div>
            <div className="flex flex-col gap-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-ink mb-1">Resources</h4>
              <a className="text-xs text-ink-muted hover:text-ink transition-colors" href="#">Documentation</a>
              <a className="text-xs text-ink-muted hover:text-ink transition-colors" href="#">API Reference</a>
              <a className="text-xs text-ink-muted hover:text-ink transition-colors" href="#">Guides</a>
              <a className="text-xs text-ink-muted hover:text-ink transition-colors" href="#">Support</a>
            </div>
            <div className="flex flex-col gap-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-ink mb-1">Company</h4>
              <a className="text-xs text-ink-muted hover:text-ink transition-colors" href="#">About</a>
              <a className="text-xs text-ink-muted hover:text-ink transition-colors" href="#">Blog</a>
              <a className="text-xs text-ink-muted hover:text-ink transition-colors" href="#">Careers</a>
              <a className="text-xs text-ink-muted hover:text-ink transition-colors" href="#">Contact</a>
            </div>
          </div>
        </div>
        <div className="border-t border-border-delicate bg-[#FAF8F5]">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 md:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-ink-muted">
            <span>© 2025 Tabsy Tech. All rights reserved.</span>
            <div className="flex items-center gap-4">
              <a className="hover:text-ink transition-colors" href="#">Privacy</a>
              <a className="hover:text-ink transition-colors" href="#">Terms</a>
              <a className="hover:text-ink transition-colors" href="#">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

