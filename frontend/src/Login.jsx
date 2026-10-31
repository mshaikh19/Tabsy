import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const [pwd, setPwd] = useState("");

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
            <Link to="/signup" className="px-4 py-2 rounded-full bg-zinc-900 text-white text-xs font-bold hover:bg-zinc-800 transition-all shadow-xs">
              Create account
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden pt-20">
        <aside className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-zinc-900 text-white flex-col justify-between p-10">
          <div className="flex items-center gap-2.5">
            <img alt="Tabsy" className="w-10 h-10 rounded-xl" src="/logo.svg" />
            <span className="font-extrabold text-2xl tracking-tight">Tabsy</span>
          </div>
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight leading-tight">
              Settle up in minutes,<br />not messages.
            </h2>
            <p className="text-sm text-white/70 mt-3 max-w-sm">
              Track group expenses, minimize transfers, and keep everyone in sync — all in one calm workspace.
            </p>
            <div className="mt-6 flex -space-x-2">
              <div className="h-9 w-9 rounded-full bg-pastel-rose text-rose-900 text-xs font-bold flex items-center justify-center border-2 border-zinc-900">JM</div>
              <div className="h-9 w-9 rounded-full bg-pastel-sky text-sky-900 text-xs font-bold flex items-center justify-center border-2 border-zinc-900">SK</div>
              <div className="h-9 w-9 rounded-full bg-pastel-amber text-amber-950 text-xs font-bold flex items-center justify-center border-2 border-zinc-900">TL</div>
            </div>
            <p className="text-xs text-white/60 mt-2">Joined by 12,000+ crews this month</p>
          </div>
          <p className="text-xs text-white/40">© 2025 Tabsy Tech</p>
        </aside>
        <div className="flex-1 flex items-center justify-center px-4 py-6 overflow-hidden">
          <div className="w-full max-w-md flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-border-delicate text-ink-muted text-[11px] font-bold mb-4 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-pastel-emerald-deep" />
            WELCOME BACK
          </div>

          <div className="w-full bg-white rounded-[28px] p-6 sm:p-8 border border-border-delicate shadow-sm flex flex-col">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#FAF8F5] border border-border-delicate mb-3 text-2xl">
                👋
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink">
                Welcome back
              </h1>
              <p className="text-sm text-ink-muted mt-2 max-w-sm mx-auto">
                Log in to continue settling expenses with your groups.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button type="button" className="flex-1 flex items-center justify-center gap-2.5 h-12 px-4 rounded-full bg-[#FAF8F5] hover:bg-zinc-100 text-ink font-semibold text-sm border border-border-delicate transition-all active:scale-[0.98]">
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                  <path d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z" fill="#EA4335" />
                  <path d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z" fill="#4285F4" />
                  <path d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.8 0 12s.7 3.3 1.9 5.7l3.7-2.9z" fill="#FBBC05" />
                  <path d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" fill="#34A853" />
                </svg>
                Google
              </button>
              <button type="button" className="flex-1 flex items-center justify-center gap-2.5 h-12 px-4 rounded-full bg-[#FAF8F5] hover:bg-zinc-100 text-ink font-semibold text-sm border border-border-delicate transition-all active:scale-[0.98]">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.42c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.06 1.71-.93 2.73 1 .08 2.01-.48 2.63-1.23z" />
                </svg>
                Apple
              </button>
            </div>

            <div className="flex items-center my-4">
              <div className="flex-1 h-px bg-border-delicate" />
              <span className="px-3 text-xs text-ink-muted font-medium">or log in with email</span>
              <div className="flex-1 h-px bg-border-delicate" />
            </div>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-ink" htmlFor="email">Email address</label>
                <div className="relative flex items-center">
                  <input
                    className="w-full h-12 px-4 rounded-2xl bg-[#FAF8F5] text-ink placeholder:text-ink-subtle text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-zinc-900/10 transition-all border border-border-delicate"
                    id="email"
                    placeholder="arjun@example.com"
                    required
                    type="email"
                  />
                  <span className="material-symbols-outlined absolute right-3 text-ink-muted pointer-events-none text-lg">mail</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-ink" htmlFor="password">Password</label>
                  <button type="button" className="text-xs text-ink-muted hover:text-ink transition-colors flex items-center gap-1" onClick={() => setShowPwd((s) => !s)}>
                    <span className="material-symbols-outlined text-[16px]">{showPwd ? "visibility_off" : "visibility"}</span>
                    {showPwd ? "Hide" : "Show"}
                  </button>
                </div>
                <div className="relative flex items-center">
                  <input
                    className="w-full h-12 px-4 rounded-2xl bg-[#FAF8F5] text-ink placeholder:text-ink-subtle text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-zinc-900/10 transition-all border border-border-delicate"
                    id="password"
                    placeholder="Your password"
                    required
                    type={showPwd ? "text" : "password"}
                    value={pwd}
                    onChange={(e) => setPwd(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mt-1">
                <label className="relative flex items-center cursor-pointer select-none gap-2">
                  <input className="sr-only peer" type="checkbox" />
                  <div className="w-4 h-4 rounded bg-[#FAF8F5] border border-border-delicate peer-checked:bg-zinc-900 flex items-center justify-center transition-all">
                    <span className="material-symbols-outlined text-white text-[12px] font-bold">check</span>
                  </div>
                  <span className="text-xs text-ink-muted">Remember me</span>
                </label>
                <a className="text-xs font-semibold text-ink hover:underline" href="#">Forgot password?</a>
              </div>

              <button type="submit" className="w-full h-14 mt-4 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99]">
                <span>Log In</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </form>

            <div className="text-center mt-6">
              <p className="text-sm text-ink-muted">
                Don't have an account?{" "}
                <Link to="/signup" className="text-ink font-semibold hover:underline ml-1">Sign up</Link>
              </p>
            </div>
          </div>

          <div className="w-full mt-4 bg-white rounded-2xl p-4 flex items-center justify-between gap-3 border border-border-delicate shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#FAF8F5] border border-border-delicate flex items-center justify-center text-sm flex-shrink-0">🔒</div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-ink">Secure &amp; Private</span>
                <span className="text-xs text-ink-muted">256-bit encrypted • No spam, ever</span>
              </div>
            </div>
          </div>
        </div>
        </div>
      </main>
    </div>
  );
}
