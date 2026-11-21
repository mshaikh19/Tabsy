import { Link } from "react-router-dom";

export default function Breadcrumbs({ items = [], status }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-body-sm text-on-surface-variant flex-wrap min-w-0">
        {items.map((it, i) => (
          <span key={`${it.label}-${i}`} className="flex items-center gap-2 min-w-0">
            {i > 0 && <span className="material-symbols-outlined text-[14px] text-outline shrink-0">chevron_right</span>}
            {it.to ? (
              <Link to={it.to} className="hover:text-primary transition-colors flex items-center gap-1 font-medium min-w-0">
                {it.icon && <span className="material-symbols-outlined text-[16px] shrink-0">{it.icon}</span>}
                <span className="break-words">{it.label}</span>
              </Link>
            ) : (
              <span className="text-[11px] bg-surface-container-high text-primary font-bold px-2 py-0.5 rounded-full font-label-caps break-words">{it.label}</span>
            )}
          </span>
        ))}
      </nav>

      {status && (
        <div className="flex items-center gap-2 bg-surface-container-lowest border border-surface-container px-3.5 py-1.5 rounded-full shadow-sm flex-wrap">
          {status.pulse !== false && <span className="w-2 h-2 rounded-full bg-primary-container animate-ping shrink-0" />}
          <span className="text-[11px] text-on-surface font-bold uppercase tracking-wider font-label-caps break-words">{status.label}</span>
          {status.note && (
            <>
              <span className="text-outline-variant">•</span>
              <span className="text-[12px] text-primary font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                {status.note}
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}