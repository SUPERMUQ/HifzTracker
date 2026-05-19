// src/pages/Dashboard.jsx
import { Flame, Star, BookOpen, Target, TrendingUp } from "lucide-react";
import LogForm from "../components/LogForm";

// ─── Mock data (replace with real Firestore data later) ──────────────────────
const STREAK      = 7;
const PAGES_TODAY = 4;
const TOTAL_PAGES = 312;
const GOAL_PAGES  = 604;
const COMPLETION  = Math.round((TOTAL_PAGES / GOAL_PAGES) * 100);

// ─── Tiny stat card ───────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, value, label, accent = false }) => (
  <div
    className={`
      flex flex-col gap-1 rounded-2xl border p-4
      ${accent
        ? "bg-emerald-800 border-emerald-700 text-white"
        : "bg-white/70 border-stone-100 text-stone-700"
      }
    `}
  >
    <Icon
      size={16}
      strokeWidth={1.75}
      className={accent ? "text-emerald-300" : "text-emerald-600"}
    />
    <span className={`text-2xl font-bold leading-none mt-1 ${accent ? "text-white" : "text-stone-800"}`}>
      {value}
    </span>
    <span className={`text-[11px] font-medium uppercase tracking-widest ${accent ? "text-emerald-300" : "text-stone-400"}`}>
      {label}
    </span>
  </div>
);

// ─── Progress bar ─────────────────────────────────────────────────────────────
const ProgressBar = ({ value, max, label, sublabel }) => {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-baseline">
        <span className="text-xs font-semibold uppercase tracking-widest text-stone-500">{label}</span>
        <span className="text-xs text-stone-400">{sublabel}</span>
      </div>
      <div className="relative h-2 w-full rounded-full bg-stone-100 overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-emerald-700 to-emerald-400 transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-right text-[11px] text-stone-400">{pct}% complete</span>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div
      className="min-h-screen px-4 py-8 sm:px-8 md:px-10"
      style={{
        backgroundImage: `
          radial-gradient(ellipse 80% 50% at 50% -10%, rgba(6,78,59,0.07) 0%, transparent 70%),
          radial-gradient(ellipse 60% 40% at 100% 80%, rgba(6,78,59,0.04) 0%, transparent 60%)
        `,
      }}
    >
      <div className="max-w-2xl mx-auto flex flex-col gap-6">

        {/* ── Page header ───────────────────────────────────────────────── */}
        <header className="flex flex-col gap-1">
          <p className="text-[11px] uppercase tracking-widest text-stone-400 font-medium select-none">
            {today}
          </p>
          <h1
            className="text-3xl font-bold text-emerald-950 leading-tight"
            style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
          >
            Daily Dashboard
          </h1>
          <p className="text-sm text-stone-500 mt-0.5">
            بِسْمِ ٱللَّٰهِ — Begin with the name of Allah
          </p>
        </header>

        {/* ── Daily Progress Card ────────────────────────────────────────── */}
        <section
          className="
            relative overflow-hidden rounded-3xl
            bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950
            p-6 text-white shadow-xl shadow-emerald-900/30
          "
          aria-label="Daily streak card"
        >
          {/* Background geometric ornament */}
          <div
            className="pointer-events-none absolute -right-8 -top-8 opacity-[0.07]"
            aria-hidden="true"
          >
            <svg viewBox="0 0 160 160" width="160" height="160" fill="white">
              <polygon points="80,4 94,56 148,56 104,88 118,140 80,108 42,140 56,88 12,56 66,56" />
            </svg>
          </div>
          <div
            className="pointer-events-none absolute -left-10 -bottom-10 opacity-[0.05]"
            aria-hidden="true"
          >
            <svg viewBox="0 0 200 200" width="200" height="200" fill="white">
              <polygon points="100,4 118,70 188,70 132,110 152,176 100,136 48,176 68,110 12,70 82,70" />
            </svg>
          </div>

          <div className="relative flex flex-col gap-5">
            {/* Streak badge */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-2xl bg-amber-400/20 border border-amber-400/30 px-4 py-2.5">
                <Flame size={22} className="text-amber-400 drop-shadow-sm" fill="currentColor" />
                <span className="text-xl font-bold text-amber-300 leading-none">{STREAK}</span>
                <span className="text-sm text-amber-200/80 font-medium leading-none">Day Streak!</span>
              </div>
              <div className="flex -space-x-1 ml-auto">
                {[...Array(Math.min(STREAK, 5))].map((_, i) => (
                  <span
                    key={i}
                    className="inline-flex w-6 h-6 rounded-full bg-amber-400/30 border border-amber-400/20 items-center justify-center"
                  >
                    <Star size={10} className="text-amber-300" fill="currentColor" />
                  </span>
                ))}
              </div>
            </div>

            {/* Stat grid */}
            <div className="grid grid-cols-3 gap-3">
              <StatCard icon={BookOpen}   value={PAGES_TODAY} label="Today"   accent />
              <StatCard icon={TrendingUp} value={TOTAL_PAGES} label="Pages"          />
              <StatCard icon={Target}     value={`${COMPLETION}%`} label="Progress"  />
            </div>

            {/* Khatm progress */}
            <div
              className="rounded-2xl bg-white/[0.07] border border-white/10 p-4"
            >
              <ProgressBar
                value={TOTAL_PAGES}
                max={GOAL_PAGES}
                label="Khatm Progress"
                sublabel={`${TOTAL_PAGES} / ${GOAL_PAGES} pages`}
              />
            </div>
          </div>
        </section>

        {/* ── Log Session card ───────────────────────────────────────────── */}
        <section
          className="
            rounded-3xl border border-stone-100
            bg-white/80 backdrop-blur-sm
            shadow-sm shadow-stone-200/80
            overflow-hidden
          "
          aria-label="Log session form"
        >
          {/* Card header */}
          <div className="flex items-center gap-3 border-b border-stone-100 px-6 py-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-100">
              <BookOpen size={16} strokeWidth={1.75} className="text-emerald-700" />
            </div>
            <div>
              <h2
                className="text-base font-bold text-emerald-950 leading-tight"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                Log Your Session
              </h2>
              <p className="text-[11px] text-stone-400">
                Record today's reading or memorization
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="px-6 py-6">
            <LogForm />
          </div>
        </section>

        {/* ── Footer hadith ──────────────────────────────────────────────── */}
        <footer className="text-center pb-4">
          <p className="text-[11px] text-stone-400 italic leading-relaxed max-w-sm mx-auto">
            "The best of you are those who learn the Quran and teach it."
            <span className="block not-italic text-stone-300 mt-0.5">— Sahih al-Bukhari</span>
          </p>
        </footer>

      </div>
    </div>
  );
}