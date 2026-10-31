import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Auth({ initialMode = "signup" }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState(initialMode);
  const [showPwd, setShowPwd] = useState(false);
  const [pwd, setPwd] = useState("");

  const isSignup = mode === "signup";

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-surface-ground font-sans text-ink antialiased flex flex-col overflow-hidden">
      <header className="fixed top-4 left-0 right-0 z-50 px-4 md:px-8">
        <div className="max-w-[1240px] mx-auto bg-white/80 backdrop-blur-md border border-border-delicate rounded-full py-2.5 px-4 md:px-6 flex items-center justify-between gap-4 shadow-sm">
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <img alt="Tabsy" className="w-9 h-9 rounded-xl group-hover:scale-105 transition-transform" src="/logo.svg" />
            <span className="font-extrabold text-lg tracking-tight text-ink">Tabsy</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1 text-xs font-semibold text-ink-muted">
            <Link className="px-3 py-1.5 rounded-full hover:bg-zinc-100 hover:text-ink transition-colors" to="/">Home</Link>
            <Link className="px-3 py-1.5 rounded-full hover:bg-zinc-100 hover:text-ink transition-colors" to="/#features">Features</Link>
            <Link className="px-3 py-1.5 rounded-full hover:bg-zinc-100 hover:text-ink transition-colors" to="/#calculator">Split Simulator</Link>
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={() => setMode(isSignup ? "login" : "signup")} className="px-4 py-2 rounded-full bg-white text-ink text-xs font-bold border border-border-delicate hover:bg-zinc-100 transition-all shadow-xs">
              {isSignup ? "Log in" : "Sign up"}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-6 overflow-hidden">
        <div className="text-center max-w-2xl mx-auto mb-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-border-delicate text-ink-muted text-[11px] font-bold mb-3 shadow-xs">
            <span>✨ All-in-One Access Hub</span>
            <span className="text-ink-subtle">·</span>
            <span>One tab. All sorted.</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-ink mb-2">Welcome to Tabsy ✨</h1>
          <p className="text-sm text-ink-muted">Pick up right where your group tabs left off, or start a fresh pool.</p>
        </div>

        <div className="flex justify-center mb-4">
          <div className="inline-flex p-1 bg-[#FAF8F5] border border-border-delicate rounded-full">
            <button onClick={() => setMode("login")} className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${!isSignup ? "bg-zinc-900 text-white shadow-xs" : "text-ink-muted hover:text-ink"}`}>Sign In</button>
            <button onClick={() => setMode("signup")} className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${isSignup ? "bg-zinc-900 text-white shadow-xs" : "text-ink-muted hover:text-ink"}`}>Create Account</button>
          </div>
        </div>

        <div className="relative w-full max-w-5xl overflow-hidden rounded-3xl">
          <div className="flex transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]" style={{ transform: isSignup ? "translateX(-50%)" : "translateX(0%)" }}>
            {/* LOGIN PANEL */}
            <div className="w-1/2 flex-shrink-0 px-2">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border-delicate shadow-sm flex flex-col">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-pastel-rose/60 text-rose-900 text-[10px] font-bold uppercase tracking-wider">Tabsy Ledger · Zero drama</span>
                  <div className="w-10 h-10 rounded-2xl bg-[#FAF8F5] border border-border-delicate flex items-center justify-center text-xl">🌸</div>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-ink mb-1">Log in to your balances</h2>
                <p className="text-sm text-ink-muted mb-5">Pick up right where your group tabs left off.</p>
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <button type="button" className="flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-[#FAF8F5] hover:bg-zinc-100 transition-colors text-ink font-semibold text-sm border border-border-delicate">
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                    </svg>
                    Google
                  </button>
                  <button type="button" className="flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-[#FAF8F5] hover:bg-zinc-100 transition-colors text-ink font-semibold text-sm border border-border-delicate">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.85-.92.04-2.01.62-2.65 1.37-.56.65-.1.06-1.72.88 0 1.9.99 2.82.97.98-.04" />
                    </svg>
                    Apple
                  </button>
                </div>
                <div className="relative flex items-center justify-center mb-4">
                  <div className="flex-1 h-px bg-border-delicate" />
                  <span className="px-3 text-xs text-ink-muted">or continue with email</span>
                  <div className="flex-1 h-px bg-border-delicate" />
                </div>
                <form className="space-y-3" onSubmit={handleSubmit}>
                  <div>
                    <label className="block text-sm font-semibold text-ink mb-1.5">Email address</label>
                    <input className="w-full px-4 py-3 rounded-2xl bg-[#FAF8F5] text-ink text-sm placeholder:text-ink-subtle focus:outline-none focus:bg-white focus:ring-2 focus:ring-zinc-900/10 transition-all border border-border-delicate" placeholder="arjun@example.com" type="email" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-ink mb-1.5">Password</label>
                    <input className="w-full px-4 py-3 rounded-2xl bg-[#FAF8F5] text-ink text-sm placeholder:text-ink-subtle focus:outline-none focus:bg-white focus:ring-2 focus:ring-zinc-900/10 transition-all border border-border-delicate" type={showPwd ? "text" : "password"} value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="Your password" />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <label className="flex items-center gap-2 cursor-pointer text-ink-muted">
                      <input className="sr-only peer" type="checkbox" />
                      <span className="w-4 h-4 rounded bg-[#FAF8F5] border border-border-delicate peer-checked:bg-zinc-900 flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-[12px] font-bold">check</span>
                      </span>
                      Remember me
                    </label>
                    <a className="font-semibold text-ink hover:underline" href="#">Forgot?</a>
                  </div>
                  <button type="submit" className="w-full py-3.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99]">
                    <span>Sign In to Tabsy</span>
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </button>
                </form>
                <div className="mt-4 bg-[#FAF8F5] rounded-2xl p-3 flex items-center gap-3 border border-border-delicate">
                  <span className="text-lg">🔒</span>
                  <div>
                    <p className="text-xs font-bold text-ink">Secure &amp; Private</p>
                    <p className="text-[10px] text-ink-muted">256-bit encrypted • No spam, ever</p>
                  </div>
                </div>
              </div>
            </div>
            {/* SIGNUP PANEL */}
            <div className="w-1/2 flex-shrink-0 px-2">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border-delicate shadow-sm flex flex-col">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-pastel-emerald/60 text-emerald-900 text-[10px] font-bold uppercase tracking-wider">No awkward IOU math ever</span>
                  <div className="w-10 h-10 rounded-2xl bg-[#FAF8F5] border border-border-delicate flex items-center justify-center text-xl">🌴</div>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-ink mb-1">Create your account</h2>
                <p className="text-sm text-ink-muted mb-5">Start splitting expenses with zero drama and instant settlement.</p>
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <button type="button" className="flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-[#FAF8F5] hover:bg-zinc-100 transition-colors text-ink font-semibold text-sm border border-border-delicate">
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                    </svg>
                    Google
                  </button>
                  <button type="button" className="flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-[#FAF8F5] hover:bg-zinc-100 transition-colors text-ink font-semibold text-sm border border-border-delicate">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.85-.92.04-2.01.62-2.65 1.37-.56.65-.1.06-1.72.88 0 1.9.99 2.82.97.98-.04" />
                    </svg>
                    Apple
                  </button>
                </div>
                <div className="relative flex items-center justify-center mb-4">
                  <div className="flex-1 h-px bg-border-delicate" />
                  <span className="px-3 text-xs text-ink-muted">or sign up with email</span>
                  <div className="flex-1 h-px bg-border-delicate" />
                </div>
                <form className="space-y-3" onSubmit={handleSubmit}>
                  <div>
                    <label className="block text-sm font-semibold text-ink mb-1.5">Your name</label>
                    <input className="w-full px-4 py-3 rounded-2xl bg-[#FAF8F5] text-ink text-sm placeholder:text-ink-subtle focus:outline-none focus:bg-white focus:ring-2 focus:ring-zinc-900/10 transition-all border border-border-delicate" placeholder="Arjun Sharma" type="text" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-ink mb-1.5">Email address</label>
                    <input className="w-full px-4 py-3 rounded-2xl bg-[#FAF8F5] text-ink text-sm placeholder:text-ink-subtle focus:outline-none focus:bg-white focus:ring-2 focus:ring-zinc-900/10 transition-all border border-border-delicate" placeholder="arjun@example.com" type="email" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-ink mb-1.5">Create password</label>
                    <input className="w-full px-4 py-3 rounded-2xl bg-[#FAF8F5] text-ink text-sm placeholder:text-ink-subtle focus:outline-none focus:bg-white focus:ring-2 focus:ring-zinc-900/10 transition-all border border-border-delicate" type={showPwd ? "text" : "password"} value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="At least 8 characters" />
                    <div className="mt-2 flex items-center gap-1.5">
                      <div className={`flex-1 h-1.5 rounded-full ${pwd.length >= 1 ? "bg-pastel-rose" : "bg-[#FAF8F5]"}`} />
                      <div className={`flex-1 h-1.5 rounded-full ${pwd.length >= 6 ? "bg-pastel-amber" : "bg-[#FAF8F5]"}`} />
                      <div className={`flex-1 h-1.5 rounded-full ${pwd.length >= 10 ? "bg-pastel-emerald" : "bg-[#FAF8F5]"}`} />
                    </div>
                  </div>
                  <button type="button" onClick={() => setShowPwd((s) => !s)} className="text-xs text-ink-muted hover:text-ink self-end -mt-1">
                    {showPwd ? "Hide password" : "Show password"}
                  </button>
                  <button type="submit" className="w-full py-3.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99]">
                    <span>Create Free Account</span>
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </button>
                </form>
                <div className="mt-4 bg-[#FAF8F5] rounded-2xl p-3 flex items-center justify-between gap-3 border border-border-delicate">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">✨</span>
                    <div>
                      <p className="text-xs font-bold text-ink">100% Free Forever</p>
                      <p className="text-[10px] text-ink-muted">Personal tabs • Instant invites</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-white border border-border-delicate text-[10px] font-bold text-ink">PRO-FREE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}