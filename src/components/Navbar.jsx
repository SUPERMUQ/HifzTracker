import { NavLink } from "react-router-dom";
import { LayoutDashboard, BookOpen, Settings } from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", to: "/",        icon: LayoutDashboard },
  { label: "History",   to: "/history", icon: BookOpen        },
  { label: "Settings",  to: "/profile", icon: Settings        },
];

// Shared active/inactive style logic
const linkClasses = ({ isActive }) =>
  [
    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
    isActive
      ? "bg-emerald-800 text-white shadow-md shadow-emerald-900/20"
      : "text-stone-500 hover:bg-emerald-50 hover:text-emerald-800",
  ].join(" ");

// ─── Geometric ornament SVG (Islamic-inspired star motif) ─────────────────────
const StarOrnament = () => (
  <svg
    viewBox="0 0 40 40"
    className="w-7 h-7 text-emerald-600 opacity-90"
    fill="currentColor"
    aria-hidden="true"
  >
    <polygon points="20,2 23.5,14.5 36,14.5 25.5,22 29,34.5 20,27 11,34.5 14.5,22 4,14.5 16.5,14.5" />
  </svg>
);

// ─── Desktop Sidebar ──────────────────────────────────────────────────────────
const Sidebar = () => (
  <aside
    className="
      hidden md:flex
      fixed top-0 left-0 h-full w-64
      flex-col
      bg-white border-r border-stone-100
      shadow-[2px_0_24px_0_rgba(0,0,0,0.04)]
      z-30
    "
  >
    {/* Brand / Logo */}
    <div className="flex items-center gap-3 px-6 py-6 border-b border-stone-100">
      <StarOrnament />
      <div className="flex flex-col leading-tight">
        <span
          className="text-base font-bold tracking-tight text-emerald-900"
          style={{ fontFamily: "'Georgia', serif", letterSpacing: "-0.02em" }}
        >
          Hifz
        </span>
        <span className="text-[10px] uppercase tracking-widest text-stone-400 font-medium">
          Tracker
        </span>
      </div>
    </div>

    {/* Navigation links */}
    <nav className="flex flex-col gap-1 px-3 py-5 flex-1">
      <p className="px-3 mb-2 text-[10px] uppercase tracking-widest text-stone-300 font-semibold select-none">
        Menu
      </p>
      {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
        <NavLink key={to} to={to} end={to === "/"} className={linkClasses}>
          <Icon
            size={17}
            strokeWidth={1.75}
            className="shrink-0 transition-transform duration-200 group-hover:scale-110"
          />
          {label}
        </NavLink>
      ))}
    </nav>

    {/* Footer */}
    <div className="px-6 py-4 border-t border-stone-100">
      <p className="text-[10px] text-stone-300 leading-relaxed text-center select-none">
        بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
      </p>
    </div>
  </aside>
);

// ─── Mobile Bottom Navigation Bar ────────────────────────────────────────────
const BottomNav = () => (
  <nav
    className="
      md:hidden
      fixed bottom-0 left-0 right-0
      flex items-stretch
      bg-white border-t border-stone-100
      shadow-[0_-4px_24px_0_rgba(0,0,0,0.06)]
      z-30
      safe-area-inset-bottom
    "
    style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
  >
    {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
      <NavLink
        key={to}
        to={to}
        end={to === "/"}
        className={({ isActive }) =>
          [
            "flex-1 flex flex-col items-center justify-center gap-1 py-3 text-[10px] font-medium transition-all duration-200 active:scale-95",
            isActive
              ? "text-emerald-700"
              : "text-stone-400 hover:text-emerald-600",
          ].join(" ")
        }
      >
        {({ isActive }) => (
          <>
            <span
              className={[
                "flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200",
                isActive
                  ? "bg-emerald-800 text-white shadow-md shadow-emerald-900/25 scale-105"
                  : "text-stone-400",
              ].join(" ")}
            >
              <Icon size={18} strokeWidth={1.75} />
            </span>
            <span className={isActive ? "text-emerald-800 font-semibold" : ""}>
              {label}
            </span>
          </>
        )}
      </NavLink>
    ))}
  </nav>
);

// ─── Combined Export ──────────────────────────────────────────────────────────
export default function Navbar() {
  return (
    <>
      <Sidebar />
      <BottomNav />
    </>
  );
}