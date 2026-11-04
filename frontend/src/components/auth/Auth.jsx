import { useState } from "react";

export default function Auth({ initialMode = "signup" }) {
  const [isSignUp, setIsSignUp] = useState(initialMode === "signup");

  return (
    <div
      id="body-root"
      className={`bg-[#faf8ff] text-on-surface antialiased min-h-screen flex flex-col font-['Plus_Jakarta_Sans'] overflow-hidden ${
        isSignUp ? "sign-up-mode" : ""
      }`}
    >
      <style>{`
        @layer base { html, body { margin: 0; padding: 0; overflow: hidden; height: 100%; } body { overscroll-behavior: none; } }
        ::-webkit-scrollbar { display: none; }
        .auth-container { position: relative; overflow: hidden; transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1); }
        .form-panel { transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1); }
        .overlay-container { position: absolute; top: 0; left: 50%; width: 50%; height: 100%; overflow: hidden; transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1); z-index: 30; }
        .overlay-inner { position: relative; left: -100%; height: 100%; width: 200%; transform: translateX(0); transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1); }
        .overlay-side { position: absolute; top: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; width: 50%; text-align: center; transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1); }
        .overlay-left { left: 0; transform: translateX(-20%); }
        .overlay-right { right: 0; transform: translateX(0); }
        .sign-up-mode .overlay-container { transform: translateX(-100%); }
        .sign-up-mode .overlay-inner { transform: translateX(50%); }
        .sign-up-mode .overlay-left { transform: translateX(0); }
        .sign-up-mode .overlay-right { transform: translateX(20%); }
        .sign-up-mode .form-signin { transform: translateX(100%); opacity: 0; pointer-events: none; }
        .sign-up-mode .form-signup { transform: translateX(0); opacity: 1; pointer-events: auto; z-index: 5; }
        .form-signup { transform: translateX(-100%); opacity: 0; pointer-events: none; z-index: 1; }
        .form-signin { transform: translateX(0); opacity: 1; pointer-events: auto; z-index: 5; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } } .form-panel > div { animation: fadeInUp 0.4s cubic-bezier(0.22, 1, 0.36, 1) both; } @media (prefers-reduced-motion: reduce) { .auth-container, .form-panel, .overlay-container, .overlay-inner, .overlay-side { transition-duration: 0.01ms !important; } .form-panel > div { animation: none !important; } }
        @media (max-width: 1023px) { .overlay-container { display: none !important; } .form-signin, .form-signup { position: relative !important; width: 100% !important; transform: none !important; } .sign-up-mode .form-signin { display: none !important; } .sign-up-mode .form-signup { display: flex !important; opacity: 1 !important; } body:not(.sign-up-mode) .form-signup { display: none !important; } body:not(.sign-up-mode) .form-signin { display: flex !important; opacity: 1 !important; } }
      `}</style>
      <header className="fixed top-0 w-full z-50 bg-[#faf8ff]/90 backdrop-blur-md border-b border-[#efece6]">
        <div className="h-16 max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-container flex items-center justify-center shadow-sm">
              <img
                alt="Tabsy"
                className="w-7 h-7 rounded-lg"
                src="./assets/logo.svg"
              />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[17px] font-bold text-on-surface tracking-tight">
                Tabsy
              </span>
              <span className="hidden sm:inline-block text-[#efece6] select-none">
                |
              </span>
              <span className="hidden sm:inline-block text-xs font-medium text-on-surface-variant">
                One tab. All sorted.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              className="flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-on-surface transition-colors py-1.5 px-3 rounded-xl hover:bg-[#efece6]"
              href="#"
            >
              <span className="material-symbols-outlined text-[18px] text-outline">
                shield
              </span>
              <span>Help &amp; Security</span>
            </a>
          </div>
        </div>
      </header>

      <main className="w-full flex-1 pt-16 pb-8 bg-[#faf8ff] flex flex-col items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-4xl flex flex-col items-center">
          <div className="text-center max-w-xl mx-auto mb-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#eaedff] text-on-surface-variant text-[11px] font-bold font-['Inter'] tracking-wider uppercase shadow-sm mb-4">
              <span>All-in-One Access Hub</span>
              <span className="text-outline-variant font-normal">·</span>
              <span>One tab. All sorted.</span>
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold text-[#131b2e] tracking-tight mb-2">
              Welcome to Tabsy
            </h1>
            <p className="text-sm sm:text-base text-on-surface-variant">
              Pick up right where your group tabs left off, or start a fresh
              pool.
            </p>
          </div>

          <div
            className="auth-container w-full max-w-[900px] min-h-[600px] bg-white rounded-3xl border border-[#efece6] shadow-sm relative flex"
            id="authContainer"
          >
            {/* LEFT: SIGN IN */}
            <div className="form-panel form-signin w-full lg:w-1/2 p-7 sm:p-9 flex flex-col justify-between absolute lg:left-0 top-0 bottom-0 bg-white">
              <div>
                <div className="flex items-start justify-between gap-2 mb-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#fce4ec] text-[#ec4899] text-[11px] font-bold font-['Inter'] tracking-wider uppercase">
                    Tabsy Ledger v2.4 · Zero drama
                  </span>
                  <div className="w-10 h-10 rounded-2xl bg-[#fce4ec] flex items-center justify-center text-xl select-none"></div>
                </div>
                <h2 className="text-2xl font-bold text-[#131b2e] tracking-tight mb-1">
                  Log in to your balances
                </h2>
                <p className="text-xs sm:text-sm text-on-surface-variant mb-6">
                  Pick up right where your group tabs and settlements left off.
                </p>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button
                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-[#f2f3ff] hover:bg-[#eaedff] transition-colors text-xs font-semibold text-[#131b2e]"
                    type="button"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        fill="#EA4335"
                      />
                    </svg>
                    <span>Google</span>
                  </button>
                  <button
                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-[#f2f3ff] hover:bg-[#eaedff] transition-colors text-xs font-semibold text-[#131b2e]"
                    type="button"
                  >
                    <svg
                      className="w-4 h-4 shrink-0 fill-current text-[#131b2e]"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                    </svg>
                    <span>Apple</span>
                  </button>
                </div>
                <div className="relative flex items-center justify-center mb-4">
                  <div className="w-full h-px bg-[#eaedff]"></div>
                  <span className="absolute bg-white px-3 text-xs text-outline font-medium">
                    or continue with email
                  </span>
                </div>
                <form
                  className="space-y-4"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1">
                      Email address
                    </label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3.5 text-outline select-none text-[19px]">
                        alternate_email
                      </span>
                      <input
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#f2f3ff] text-sm text-on-surface placeholder:text-outline focus:outline-none focus:bg-[#eaedff] transition-colors"
                        type="email"
                        defaultValue="alex@tabsy.app"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1">
                      Password
                    </label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3.5 text-outline select-none text-[19px]">
                        key
                      </span>
                      <input
                        className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-[#f2f3ff] text-sm text-on-surface placeholder:text-outline focus:outline-none focus:bg-[#eaedff] transition-colors"
                        id="login-pass"
                        type="password"
                        defaultValue="Password123"
                      />
                      <button
                        className="absolute right-3.5 text-outline hover:text-on-surface transition-colors flex items-center justify-center"
                        onClick={() => {
                          const p = document.getElementById("login-pass");
                          if (p)
                            p.type =
                              p.type === "password" ? "text" : "password";
                        }}
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[19px]">
                          visibility
                        </span>
                      </button>
                    </div>
                  </div>
                  <div className="pt-1 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        checked
                        className="w-4 h-4 rounded-md accent-[#1e232f] cursor-pointer"
                        id="remember-me"
                        type="checkbox"
                      />
                      <label
                        className="text-xs text-on-surface-variant cursor-pointer select-none"
                        htmlFor="remember-me"
                      >
                        Remember me 30d
                      </label>
                    </div>
                    <a
                      className="text-xs text-secondary hover:underline font-semibold"
                      href="#"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <button
                    className="w-full py-3.5 px-6 rounded-2xl bg-[#1e232f] hover:bg-[#131720] text-white font-bold text-sm transition-all shadow-sm active:scale-[0.99] flex items-center justify-center gap-2 mt-2"
                    type="submit"
                  >
                    <span>Sign In to Tabsy</span>
                    <span className="material-symbols-outlined text-[18px]">
                      arrow_forward
                    </span>
                  </button>
                </form>
              </div>
              <div className="pt-4 text-center border-t border-[#efece6] mt-4 flex items-center justify-between">
                <span className="text-xs text-on-surface-variant">
                  Don't have an account?
                </span>
                <button
                  className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
                  onClick={() => setIsSignUp(true)}
                  type="button"
                >
                  <span>Create Account</span>
                  <span className="material-symbols-outlined text-[15px]">
                    arrow_forward
                  </span>
                </button>
              </div>
            </div>
            {/* RIGHT: SIGN UP */}
            <div className="form-panel form-signup w-full lg:w-1/2 p-7 sm:p-9 flex flex-col justify-between absolute lg:right-0 top-0 bottom-0 bg-white">
              <div>
                <div className="flex items-start justify-between gap-2 mb-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#e8f5e9] text-primary text-[11px] font-bold font-['Inter'] tracking-wider uppercase">
                    No awkward IOU math ever
                  </span>
                  <div className="w-10 h-10 rounded-2xl bg-[#e8f5e9] flex items-center justify-center text-xl select-none"></div>
                </div>
                <h2 className="text-2xl font-bold text-[#131b2e] tracking-tight mb-1">
                  Create your account
                </h2>
                <p className="text-xs sm:text-sm text-on-surface-variant mb-6">
                  Start splitting expenses with zero drama and instant
                  settlement.
                </p>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button
                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-[#f2f3ff] hover:bg-[#eaedff] transition-colors text-xs font-semibold text-[#131b2e]"
                    type="button"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        fill="#EA4335"
                      />
                    </svg>
                    <span>Google</span>
                  </button>
                  <button
                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-[#f2f3ff] hover:bg-[#eaedff] transition-colors text-xs font-semibold text-[#131b2e]"
                    type="button"
                  >
                    <svg
                      className="w-4 h-4 shrink-0 fill-current text-[#131b2e]"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                    </svg>
                    <span>Apple</span>
                  </button>
                </div>
                <div className="relative flex items-center justify-center mb-4">
                  <div className="w-full h-px bg-[#eaedff]"></div>
                  <span className="absolute bg-white px-3 text-xs text-outline font-medium">
                    or sign up with email
                  </span>
                </div>
                <form
                  className="space-y-3.5"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1">
                      Your Name{" "}
                      <span className="text-outline font-normal text-[11px]">
                        (what friends call you)
                      </span>
                    </label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3.5 text-outline select-none text-[19px]">
                        person
                      </span>
                      <input
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#f2f3ff] text-sm text-on-surface placeholder:text-outline focus:outline-none focus:bg-[#eaedff] transition-colors"
                        placeholder="Alex Morgan"
                        type="text"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1">
                      Email address
                    </label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3.5 text-outline select-none text-[19px]">
                        mail
                      </span>
                      <input
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#f2f3ff] text-sm text-on-surface placeholder:text-outline focus:outline-none focus:bg-[#eaedff] transition-colors"
                        placeholder="alex@wanderlust.io"
                        type="email"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1">
                      Create password
                    </label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3.5 text-outline select-none text-[19px]">
                        lock
                      </span>
                      <input
                        className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-[#f2f3ff] text-sm text-on-surface placeholder:text-outline focus:outline-none focus:bg-[#eaedff] transition-colors"
                        id="signup-pass"
                        type="password"
                        defaultValue="SuperSecure123"
                      />
                      <button
                        className="absolute right-3.5 text-outline hover:text-on-surface transition-colors flex items-center justify-center"
                        onClick={() => {
                          const p = document.getElementById("signup-pass");
                          if (p)
                            p.type =
                              p.type === "password" ? "text" : "password";
                        }}
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[19px]">
                          visibility
                        </span>
                      </button>
                    </div>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <div className="flex-1 h-1.5 rounded-full bg-primary-container"></div>
                      <div className="flex-1 h-1.5 rounded-full bg-primary-container"></div>
                      <div className="flex-1 h-1.5 rounded-full bg-[#eaedff]"></div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 pt-1">
                    <input
                      checked
                      className="mt-0.5 w-3.5 h-3.5 rounded accent-primary cursor-pointer"
                      id="tos-check"
                      type="checkbox"
                    />
                    <label
                      className="text-[11px] text-on-surface-variant cursor-pointer select-none leading-tight"
                      htmlFor="tos-check"
                    >
                      I agree to Tabsy's{" "}
                      <a
                        className="underline font-semibold hover:text-primary"
                        href="#"
                      >
                        Terms
                      </a>{" "}
                      and{" "}
                      <a
                        className="underline font-semibold hover:text-primary"
                        href="#"
                      >
                        Privacy Policy
                      </a>
                      .
                    </label>
                  </div>
                  <button
                    className="w-full py-3.5 px-6 rounded-2xl bg-[#1e232f] hover:bg-[#131720] text-white font-bold text-sm transition-all shadow-sm active:scale-[0.99] flex items-center justify-center gap-2 mt-2"
                    type="submit"
                  >
                    <span>Create Free Account</span>
                    <span className="material-symbols-outlined text-[18px]">
                      arrow_forward
                    </span>
                  </button>
                </form>
              </div>
              <div className="pt-4 text-center border-t border-[#efece6] mt-3 flex items-center justify-between">
                <span className="text-xs text-on-surface-variant">
                  Already have an account?
                </span>
                <button
                  className="text-xs font-bold text-secondary hover:underline inline-flex items-center gap-1"
                  onClick={() => setIsSignUp(false)}
                  type="button"
                >
                  <span>Log In</span>
                  <span className="material-symbols-outlined text-[15px]">
                    arrow_forward
                  </span>
                </button>
              </div>
            </div>
            {/* OVERLAY */}
            <div className="overlay-container hidden lg:block">
              <div className="overlay-inner">
                <div className="overlay-side overlay-left bg-[#fce4ec] px-10 py-12 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-3xl bg-white/70 flex items-center justify-center text-3xl shadow-sm mb-4"></div>
                  <span className="px-3.5 py-1 rounded-full bg-[#ffffff] text-[#ec4899] font-bold text-xs font-['Inter'] tracking-wider uppercase mb-4 shadow-xs">
                    Welcome Back Friend!
                  </span>
                  <h2 className="text-2xl font-extrabold text-[#131b2e] tracking-tight mb-2">
                    Already part of Tabsy?
                  </h2>
                  <p className="text-sm text-[#4a5568] max-w-xs mb-8 leading-relaxed">
                    Log in to view your pending balances, settle up with
                    roommates, and organize group expenses.
                  </p>
                  <button
                    className="py-3.5 px-8 rounded-2xl bg-[#1e232f] hover:bg-[#131720] text-white font-bold text-sm transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
                    onClick={() => setIsSignUp(false)}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      lock_open
                    </span>
                    <span>Sign In to Account</span>
                  </button>
                  <div className="mt-8 flex items-center gap-2 bg-white/60 px-3.5 py-1.5 rounded-full text-xs text-[#131b2e]">
                    <span className="material-symbols-outlined text-[16px] text-[#ec4899]">
                      check_circle
                    </span>
                    <span>Balances stay synced 24/7</span>
                  </div>
                </div>
                <div className="overlay-side overlay-right bg-[#e8f5e9] px-10 py-12 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-3xl bg-white/70 flex items-center justify-center text-3xl shadow-sm mb-4"></div>
                  <span className="px-3.5 py-1 rounded-full bg-[#ffffff] text-primary font-bold text-xs font-['Inter'] tracking-wider uppercase mb-4 shadow-xs">
                    100% Free Forever
                  </span>
                  <h2 className="text-2xl font-extrabold text-[#131b2e] tracking-tight mb-2">
                    New to Tabsy?
                  </h2>
                  <p className="text-sm text-[#4a5568] max-w-xs mb-8 leading-relaxed">
                    Create an account to split holiday trips, dinners, and flat
                    rent with zero drama and instant math!
                  </p>
                  <button
                    className="py-3.5 px-8 rounded-2xl bg-[#1e232f] hover:bg-[#131720] text-white font-bold text-sm transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
                    onClick={() => setIsSignUp(true)}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      person_add
                    </span>
                    <span>Create Free Account</span>
                  </button>
                  <div className="mt-8 flex items-center gap-2.5 bg-white/60 px-4 py-1.5 rounded-full">
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full bg-[#e8f5e9] text-primary flex items-center justify-center text-[10px] font-bold ring-2 ring-white">
                        AM
                      </div>
                      <div className="w-6 h-6 rounded-full bg-[#fce4ec] text-[#ec4899] flex items-center justify-center text-[10px] font-bold ring-2 ring-white">
                        SK
                      </div>
                      <div className="w-6 h-6 rounded-full bg-[#f3e5f5] text-[#8b5cf6] flex items-center justify-center text-[10px] font-bold ring-2 ring-white">
                        LN
                      </div>
                      <div className="w-6 h-6 rounded-full bg-[#e3f2fd] text-[#3b82f6] flex items-center justify-center text-[9px] font-bold ring-2 ring-white">
                        +12k
                      </div>
                    </div>
                    <span className="text-xs font-medium text-on-surface-variant">
                      Active roomies &amp; trips
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Footer Banner */}
            <div className="mt-8 text-center">
              <div className="inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-full bg-[#eaedff] text-on-surface-variant text-xs font-medium">
                <span className="material-symbols-outlined text-primary text-[18px]">
                  verified_user
                </span>
                <span>
                  256-bit bank-grade encryption for group settlement security ·
                  End-to-end synced
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
