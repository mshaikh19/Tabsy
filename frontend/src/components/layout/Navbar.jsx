import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="fixed top-0 w-full z-50 bg-[#fcfbfe]/90 backdrop-blur-md border-b border-surface-container">
      <div className="h-16 max-w-6xl mx-auto px-6 lg:px-10 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <Link className="flex items-center gap-2.5 group shrink-0" to="/">
            <div className="w-9 h-9 rounded-2xl bg-primary flex items-center justify-center text-on-primary shadow-sm">
              <span className="material-symbols-outlined text-[20px] font-bold">receipt_long</span>
            </div>
            <span className="font-headline-sm text-headline-sm tracking-tight text-on-surface font-extrabold">
              tabsy
            </span>
          </Link>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low border border-surface-container text-body-sm hover:border-outline-variant transition-colors cursor-pointer whitespace-nowrap shrink-0">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="font-title-md text-[13px] text-on-surface">Goa Squad</span>
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">unfold_more</span>
          </div>
          <nav className="hidden lg:flex items-center gap-2 bg-surface-container-low p-1 rounded-full border border-surface-container ml-2">
            <Link className="px-3 py-1.5 rounded-full font-body-md text-body-md whitespace-nowrap text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors" to="/dashboard">
              Dashboard
            </Link>
            <Link className="px-3 py-1.5 rounded-full transition-all whitespace-nowrap bg-surface-container-lowest text-on-surface font-title-md shadow-sm" to="/activity">
              Activity
            </Link>
            <Link className="px-3 py-1.5 rounded-full font-body-md text-body-md whitespace-nowrap text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors" to="/dashboard">
              Balances
            </Link>
            <Link className="px-3 py-1.5 rounded-full font-body-md text-body-md whitespace-nowrap text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors" to="/dashboard">
              Transactions
            </Link>
            <Link className="px-3 py-1.5 rounded-full font-body-md text-body-md whitespace-nowrap text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors" to="/quick-actions">
              Quick Actions
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-macaron-mint border border-macaron-mint-border rounded-full">
            <span className="font-label-caps text-label-caps uppercase text-primary font-bold">You Owe</span>
            <span className="font-numeric-balance-md text-numeric-balance-md text-primary font-bold">₹42.50</span>
          </div>
          <Link className="relative w-9 h-9 rounded-full bg-surface-container-lowest border border-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors shadow-sm" to="/activity">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-tertiary ring-2 ring-surface-container-lowest" />
          </Link>
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-on-primary ring-2 ring-primary/20 cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">person</span>
          </div>
        </div>
      </div>
    </header>
  );
}