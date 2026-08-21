import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutDashboard, BookOpen, Settings, Sparkles } from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", to: "/",        icon: LayoutDashboard },
  { label: "History",   to: "/history", icon: BookOpen        },
  { label: "Settings",  to: "/profile", icon: Settings        },
];

// ─── Gold and Emerald Open Quran Book Logo ───────────────────────────────────
const QuranLogo = () => (
  <div className="relative group">
    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-amber-500 rounded-2xl blur-md opacity-25 group-hover:opacity-60 transition duration-500" />
    <svg
      viewBox="0 0 64 64"
      className="w-9 h-9 relative filter drop-shadow-md flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Rehal Book Stand (Gold) */}
      <path
        d="M12 48 L22 36 L32 44 L42 36 L52 48"
        stroke="#f59e0b"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 48 L44 48"
        stroke="#f59e0b"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Book Pages Base (Emerald Shadow) */}
      <path
        d="M32 36 C24 30 16 32 8 38 L8 18 C16 12 24 10 32 16 C40 10 48 12 56 18 L56 38 C48 32 40 30 32 36 Z"
        fill="#044e3a"
      />

      {/* Book Left Page (Emerald Light Gradient overlay) */}
      <path
        d="M32 16 C24 10 16 12 8 18 L8 36 C16 30 24 28 32 34 Z"
        fill="#059669"
        stroke="#fbbf24"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Book Right Page (Emerald Gradient overlay) */}
      <path
        d="M32 16 C40 10 48 12 56 18 L56 36 C48 30 40 28 32 34 Z"
        fill="#047857"
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
        opacity="0.85"
      />
      <path
        d="M38 22 H48 M36 26 H50 M40 30 H48"
        stroke="#fef08a"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.85"
      />

      {/* Glowing Center Ayah Mark (Gold Star/Sparkle) */}
      <path
        d="M32 11 L33.5 14 L36.5 14 L34 16 L35.5 19 L32 17 L28.5 19 L30 16 L27.5 14 L30.5 14 Z"
        fill="#fbbf24"
      />
    </svg>
  </div>
);

// ─── Desktop Sidebar ──────────────────────────────────────────────────────────
const Sidebar = () => {
  const location = useLocation();

  return (
    <aside
      className="
        hidden md:flex
        fixed top-0 left-0 h-full w-64
        flex-col
        bg-[#09090d]/90 backdrop-blur-2xl
        border-r border-white/[0.08]
        z-40
      "
    >
      {/* Brand / Logo */}
      <div className="flex items-center gap-3.5 px-6 py-6 border-b border-white/[0.06]">
        <QuranLogo />
        <div className="flex flex-col leading-tight">
          <span
            className="text-lg font-extrabold tracking-tight text-white font-display flex items-center gap-1.5"
          >
            Hifz <span className="text-emerald-400 font-normal">Tracker</span>
          </span>
          <span className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 font-mono font-semibold">
            SOTD Edition
          </span>
        </div>
      </div>

      {/* Navigation links */}
      <nav className="flex flex-col gap-1.5 px-4 py-6 flex-1">
        <p className="px-3 mb-2 text-[10px] uppercase tracking-widest text-zinc-600 font-mono font-semibold select-none">
          Navigation
        </p>
        {NAV_ITEMS.map(({ label, to, icon: Icon }) => {
          const isActive = to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

          return (
            <NavLink key={to} to={to} className="relative group">
              {isActive && (
                <motion.div
                  layoutId="sidebarActivePill"
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <motion.div
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.98 }}
                className={`relative flex items-center gap-3.5 rounded-2xl px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "text-emerald-300 font-semibold"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]"
                }`}
              >
                <Icon
                  size={18}
                  strokeWidth={isActive ? 2 : 1.75}
                  className={`shrink-0 transition-transform duration-200 ${
                    isActive ? "text-emerald-400" : "text-zinc-400 group-hover:text-zinc-200"
                  }`}
                />
                <span className="tracking-wide">{label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
                )}
              </motion.div>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Quote */}
      <div className="px-6 py-5 border-t border-white/[0.06] bg-[#060609]/50">
        <div className="flex items-center gap-2 mb-1.5 text-emerald-400/90 text-[11px] font-mono">
          <Sparkles className="w-3 h-3" />
          <span>Ayah of Light</span>
        </div>
        <p className="text-[11px] text-zinc-400 font-serif leading-relaxed italic select-none">
          "‏وَقُل رَّبِّ زِدْنِي عِلْمً"
        </p>
        <p className="text-[9px] text-zinc-600 font-mono mt-1">My Lord, increase me in knowledge.</p>
      </div>
    </aside>
  );
};

// ─── Mobile Bottom Navigation Bar ────────────────────────────────────────────
const BottomNav = () => {
  const location = useLocation();

  return (
    <nav
      className="
        md:hidden
        fixed bottom-3 left-4 right-4
        flex items-center justify-around
        bg-[#0c0c12]/90 backdrop-blur-2xl
        border border-white/[0.1]
        rounded-3xl shadow-2xl shadow-black/80
        z-50 py-2 px-3
      "
    >
      {NAV_ITEMS.map(({ label, to, icon: Icon }) => {
        const isActive = to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

        return (
          <NavLink
            key={to}
            to={to}
            className="relative flex-1 flex flex-col items-center justify-center py-1 text-[11px] font-medium"
          >
            {isActive && (
              <motion.div
                layoutId="bottomNavActive"
                className="absolute inset-0 rounded-2xl bg-emerald-500/15 border border-emerald-500/30"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <motion.div
              whileTap={{ scale: 0.9 }}
              className={`relative z-10 flex flex-col items-center gap-1 ${
                isActive ? "text-emerald-400 font-semibold" : "text-zinc-500"
              }`}
            >
              <Icon size={19} strokeWidth={isActive ? 2 : 1.75} />
              <span className="text-[10px] tracking-wide">{label}</span>
            </motion.div>
          </NavLink>
        );
      })}
    </nav>
  );
};

// ─── Combined Export ──────────────────────────────────────────────────────────
export default function Navbar() {
  return (
    <>
      <Sidebar />
      <BottomNav />
    </>
  );
}