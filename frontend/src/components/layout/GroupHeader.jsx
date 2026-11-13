import { Link } from "react-router-dom";

export default function GroupHeader({
  title = "Tahoe Ski Weekend",
  subtitle,
  icon = "downhill_skiing",
  iconLabel = "Trips & Travel",
  dateLabel = "FEB 14 – FEB 18, 2025",
  locationLabel = "South Lake Tahoe, CA basecamp",
  breadcrumbs = [
    { label: "Groups", to: "/groups", icon: "grid_view" },
    { label: title, to: "/group-details" },
  ],
  currentLabel = "Group Expenses",
  actions,
  className,
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm shadow-zinc-900/5 border border-outline-variant/60 w-full px-4 py-3 sm:px-5 sm:py-3.5 sticky top-2 z-20 ${className || ""}`}
    >
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        {/* LEFT — Main highlight: heading + description */}
        <div className="flex flex-col gap-2 min-w-0 flex-1">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center flex-wrap gap-1.5 text-[11px] text-on-surface-variant"
          >
            {breadcrumbs.map((b, i) => {
              const content = (
                <>
                  {b.icon && (
                    <span className="material-symbols-outlined text-[13px]">
                      {b.icon}
                    </span>
                  )}
                  <span>{b.label}</span>
                </>
              );
              return (
                <span key={i} className="flex items-center gap-1.5">
                  {i > 0 && (
                    <span className="text-outline-variant font-bold">/</span>
                  )}
                  {!b.to || b.to === "#" ? (
                    <span className="text-on-surface font-semibold">
                      {content}
                    </span>
                  ) : (
                    <Link
                      className="hover:text-primary transition-colors flex items-center gap-1"
                      to={b.to}
                    >
                      {content}
                    </Link>
                  )}
                </span>
              );
            })}
            {currentLabel && (
              <>
                <span className="text-outline-variant font-bold">/</span>
                <span className="text-on-surface font-semibold">
                  {currentLabel}
                </span>
              </>
            )}
          </nav>

          <div className="flex flex-wrap items-center gap-1.5">
            {iconLabel && (
              <span className="px-2 py-0.5 rounded-full bg-primary-fixed/40 text-on-primary-fixed-variant font-label-caps text-label-caps uppercase flex items-center gap-1">
                <span className="material-symbols-outlined text-body-sm">{icon}</span>
                {iconLabel}
              </span>
            )}
            {dateLabel && (
              <span className="px-2 py-0.5 rounded-full bg-surface-container text-secondary font-label-caps text-label-caps flex items-center gap-1">
                <span className="material-symbols-outlined text-body-sm">calendar_today</span>
                {dateLabel}
              </span>
            )}
            {locationLabel && (
              <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-body-sm text-body-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-body-md">pin_drop</span>
                {locationLabel}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-0.5">
            <h1 className="text-xl sm:text-2xl font-extrabold text-on-surface tracking-tight flex items-center gap-2 leading-none">
              {title}
            </h1>
            {subtitle && (
              <p className="font-body-sm text-body-sm text-on-surface-variant max-w-2xl leading-snug line-clamp-2">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* RIGHT — Grouped action panel with hover-to-reveal */}
        <div className="shrink-0">
          <div className="flex flex-wrap items-center justify-end gap-0.5 bg-surface-container-low rounded-xl border border-outline-variant/60 shadow-sm p-1 group/actions">
            {actions}
          </div>
        </div>
      </div>
    </div>
  );
}