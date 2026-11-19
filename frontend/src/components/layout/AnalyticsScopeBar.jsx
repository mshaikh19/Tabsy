import { Link } from "react-router-dom";
import { ANALYTICS_SCOPES } from "../../constants/analyticsScopes";

export default function AnalyticsScopeBar({ current, trailing = null }) {
  return (
    <div className="relative z-10 mt-3 pt-3 border-t border-surface-container flex items-center gap-1 overflow-x-auto">
      {ANALYTICS_SCOPES.map((s) =>
        s.label === current ? (
          <span
            key={s.label}
            className="px-3 py-1.5 rounded-xl text-xs whitespace-nowrap bg-primary-container text-on-primary-container font-semibold shadow-sm shrink-0"
            aria-current="page"
          >
            {s.label}
          </span>
        ) : (
          <Link
            key={s.label}
            to={s.to}
            className="px-3 py-1.5 rounded-xl text-xs whitespace-nowrap text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-medium transition-colors shrink-0"
          >
            {s.label}
          </Link>
        ),
      )}
      {trailing}
    </div>
  );
}