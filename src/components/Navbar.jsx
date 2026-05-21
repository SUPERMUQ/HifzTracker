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

// ─── Gold and Emerald Open Quran Book Logo ───────────────────────────────────
const QuranLogo = () => (
  <svg
    viewBox="0 0 64 64"
    className="w-8 h-8 filter drop-shadow-sm flex-shrink-0"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Rehal Book Stand (Gold) */}
    <path
      d="M12 48 L22 36 L32 44 L42 36 L52 48"
      stroke="#d97706"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20 48 L44 48"
      stroke="#d97706"
      strokeWidth="2"
      strokeLinecap="round"
    />

    {/* Book Pages Base (Emerald Shadow) */}
    <path
      d="M32 36 C24 30 16 32 8 38 L8 18 C16 12 24 10 32 16 C40 10 48 12 56 18 L56 38 C48 32 40 30 32 36 Z"
      fill="#065f46"
    />

    {/* Book Left Page (Emerald Light Gradient overlay) */}
    <path
      d="M32 16 C24 10 16 12 8 18 L8 36 C16 30 24 28 32 34 Z"
      fill="#047857"
      stroke="#fbbf24"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />

    {/* Book Right Page (Emerald Gradient overlay) */}
    <path
      d="M32 16 C40 10 48 12 56 18 L56 36 C48 30 40 28 32 34 Z"
      fill="#065f46"
      stroke="#fbbf24"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />

    {/* Calligraphic script marks inside Quran pages (Gold Lines) */}
    <path
      d="M14 22 H24 M12 26 H26 M14 30 H22"
      stroke="#fef08a"
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity="0.8"
    />
    <path
      d="M38 22 H48 M36 26 H50 M40 30 H48"
      stroke="#fef08a"
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity="0.8"
    />

    {/* Glowing Center Ayah Mark (Gold Star/Sparkle) */}
    <path
      d="M32 11 L33.5 14 L36.5 14 L34 16 L35.5 19 L32 17 L28.5 19 L30 16 L27.5 14 L30.5 14 Z"
      fill="#fbbf24"
    />
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
    <div className="flex items-center gap-3 px-6 py-5 border-b border-stone-100">
      <QuranLogo />
      <div className="flex flex-col leading-tight">
        <span
          className="text-base font-bold tracking-tight text-emerald-950 font-display"
          style={{ letterSpacing: "-0.01em" }}
        >
          Hifz
        </span>
        <span className="text-[10px] uppercase tracking-widest text-stone-400 font-extrabold">
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