// src/pages/History.jsx
import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, BookOpen, Clock, FileText } from "lucide-react";
import LogModal from "../components/LogModal";

// ─── Mock log data ────────────────────────────────────────────────────────────
// Replace with real getLogsByMonth() Firestore calls when ready.
// Keys are "YYYY-MM-DD" strings.
function buildMockLogs(year, month) {
  const pad = (n) => String(n).padStart(2, "0");
  const key = (d) => `${year}-${pad(month)}-${pad(d)}`;
  return {
    [key(2)]:  { date: key(2),  type: "tilawah",  quranPage: 3,   surahName: "Al-Fatiha",    startAyat: 1,  endAyat: 7,   notes: "Beautiful recitation practice today. Focused on madd rules.", },
    [key(5)]:  { date: key(5),  type: "hifz",     quranPage: 45,  surahName: "Al-Baqarah",   startAyat: 255, endAyat: 257, notes: "Ayat al-Kursi completely memorised with proper tajweed.", },
    [key(9)]:  { date: key(9),  type: "murajaah", quranPage: 22,  surahName: "Al-Baqarah",   startAyat: 100, endAyat: 110, notes: "Revision went smoothly. Minor correction on ayat 107.", },
    [key(12)]: { date: key(12), type: "murajaah", quranPage: 30,  surahName: "Al-Baqarah",   startAyat: 130, endAyat: 145, notes: "", },
    [key(15)]: { date: key(15), type: "tilawah",  quranPage: 55,  surahName: "Al-Imran",     startAyat: 1,   endAyat: 20,  notes: "Read with a new tarteel pace — felt very focused.", },
    [key(18)]: { date: key(18), type: "hifz",     quranPage: 60,  surahName: "Al-Imran",     startAyat: 33,  endAyat: 41,  notes: "Memorised 9 ayat. Strong session, alhamdulillah.", },
    [key(21)]: { date: key(21), type: "tilawah",  quranPage: 75,  surahName: "An-Nisa",      startAyat: 1,   endAyat: 15,  notes: "", },
    [key(24)]: { date: key(24), type: "murajaah", quranPage: 88,  surahName: "Al-Maidah",    startAyat: 87,  endAyat: 100, notes: "Reviewed last two weeks of memorisation.", },
    [key(27)]: { date: key(27), type: "hifz",     quranPage: 95,  surahName: "Al-An'am",     startAyat: 1,   endAyat: 10,  notes: "Started new surah. Pronunciation of early ayat needs work.", },
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const TYPE_CONFIG = {
  hifz:     { label: "Hifz",      dot: "bg-violet-500",  badge: "bg-violet-50 text-violet-700 border-violet-200"  },
  murajaah: { label: "Muraja'ah", dot: "bg-amber-500",   badge: "bg-amber-50  text-amber-700  border-amber-200"   },
  tilawah:  { label: "Tilawah",   dot: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
};

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatMonthYear(year, month) {
  return new Date(year, month - 1, 1).toLocaleDateString("en-GB", {
    month: "long", year: "numeric",
  });
}

function formatDisplayDate(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long",
  });
}

function formatTime() {
  // Mock "logged at" time — replace with createdAt timestamp from Firestore
  return "09:45 AM";
}

// ─────────────────────────────────────────────────────────────────────────────

export default function History() {
  const today       = new Date();
  const [year,  setYear]  = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1); // 1-based
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalLog,     setModalLog]     = useState(null);

  const logs = useMemo(() => buildMockLogs(year, month), [year, month]);

  // Calendar grid construction
  const { days, firstDow } = useMemo(() => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDow    = new Date(year, month - 1, 1).getDay(); // 0=Sun
    return { days: daysInMonth, firstDow };
  }, [year, month]);

  const pad     = (n) => String(n).padStart(2, "0");
  const dateKey = (d) => `${year}-${pad(month)}-${pad(d)}`;

  const prevMonth = () => {
    if (month === 1) { setYear((y) => y - 1); setMonth(12); }
    else setMonth((m) => m - 1);
    setSelectedDate(null);
  };
  const nextMonth = () => {
    if (month === 12) { setYear((y) => y + 1); setMonth(1); }
    else setMonth((m) => m + 1);
    setSelectedDate(null);
  };

  const handleDayClick = (day) => {
    const key = dateKey(day);
    setSelectedDate(key);
    if (logs[key]) setModalLog(logs[key]);
  };

  const isToday = (day) =>
    day === today.getDate() &&
    month === today.getMonth() + 1 &&
    year  === today.getFullYear();

  const selectedLog = selectedDate ? logs[selectedDate] : null;

  return (
    <>
      {/* ── Modal ─────────────────────────────────────────────────────────── */}
      {modalLog && (
        <LogModal
          log={modalLog}
          onClose={() => setModalLog(null)}
          onEdit={(log) => console.log("Edit log:", log)}
        />
      )}

      {/* ── Page ──────────────────────────────────────────────────────────── */}
      <div
        className="min-h-screen px-4 py-8 sm:px-8 md:px-10"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 40% at 50% -5%, rgba(6,78,59,0.06) 0%, transparent 70%)",
        }}
      >
        <div className="max-w-2xl mx-auto flex flex-col gap-6">

          {/* ── Page header ───────────────────────────────────────────────── */}
          <header className="flex flex-col gap-1">
            <p className="text-[11px] uppercase tracking-widest text-stone-400 font-medium select-none">
              Your Journey
            </p>
            <h1
              className="text-3xl font-bold text-emerald-950 leading-tight"
              style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
            >
              History
            </h1>
            <p className="text-sm text-stone-400 mt-0.5">
              Browse your past sessions by month
            </p>
          </header>

          {/* ── Calendar card ─────────────────────────────────────────────── */}
          <section className="rounded-3xl border border-stone-100 bg-white/80 backdrop-blur-sm shadow-sm overflow-hidden">

            {/* Month navigation */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
              <button
                onClick={prevMonth}
                aria-label="Previous month"
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-stone-200 text-stone-500 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50 transition-all duration-150"
              >
                <ChevronLeft size={16} strokeWidth={2} />
              </button>

              <h2
                className="text-base font-bold text-emerald-950"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                {formatMonthYear(year, month)}
              </h2>

              <button
                onClick={nextMonth}
                aria-label="Next month"
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-stone-200 text-stone-500 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50 transition-all duration-150"
              >
                <ChevronRight size={16} strokeWidth={2} />
              </button>
            </div>

            {/* Day-of-week headers */}
            <div className="grid grid-cols-7 border-b border-stone-100">
              {DAY_NAMES.map((d) => (
                <div
                  key={d}
                  className="py-2.5 text-center text-[10px] font-semibold uppercase tracking-widest text-stone-400 select-none"
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Day tiles */}
            <div className="grid grid-cols-7 p-3 gap-1">

              {/* Leading empty cells */}
              {[...Array(firstDow)].map((_, i) => (
                <div key={`empty-${i}`} />
              ))}

              {/* Day cells */}
              {[...Array(days)].map((_, i) => {
                const day     = i + 1;
                const key     = dateKey(day);
                const hasLog  = Boolean(logs[key]);
                const logType = hasLog ? TYPE_CONFIG[logs[key].type] : null;
                const isSelected = selectedDate === key;
                const isTd    = isToday(day);

                return (
                  <button
                    key={day}
                    onClick={() => handleDayClick(day)}
                    aria-label={`${day} ${hasLog ? "— has log" : ""}`}
                    className={`
                      relative flex flex-col items-center justify-center
                      aspect-square rounded-xl
                      text-sm font-medium
                      transition-all duration-150 select-none
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-1
                      ${isSelected
                        ? "bg-emerald-800 text-white shadow-md shadow-emerald-900/25"
                        : isTd
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : "text-stone-700 hover:bg-stone-50 hover:text-emerald-700"
                      }
                    `}
                  >
                    <span className="leading-none">{day}</span>

                    {/* Activity dot */}
                    {hasLog && (
                      <span
                        className={`
                          mt-1 block h-1.5 w-1.5 rounded-full
                          ${isSelected ? "bg-emerald-300" : logType.dot}
                        `}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 px-6 py-3 border-t border-stone-100">
              {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
                <div key={key} className="flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
                  <span className="text-[11px] text-stone-400">{cfg.label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── Activity panel ────────────────────────────────────────────── */}
          <section className="min-h-[140px]">
            {!selectedDate ? (
              <div className="flex flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-stone-200 bg-white/50 py-12 text-center">
                <BookOpen size={22} strokeWidth={1.5} className="text-stone-300" />
                <p className="text-sm text-stone-400">Tap a day to see its activity</p>
              </div>
            ) : (
              <div
                className="rounded-3xl border border-stone-100 bg-white/80 backdrop-blur-sm shadow-sm overflow-hidden"
                style={{ animation: "fadeUp 0.2s ease-out both" }}
              >
                <style>{`
                  @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(8px); }
                    to   { opacity: 1; transform: translateY(0);    }
                  }
                `}</style>

                {/* Panel header */}
                <div className="px-6 py-4 border-b border-stone-100">
                  <p className="text-[11px] uppercase tracking-widest text-stone-400 font-semibold select-none">
                    Activity on
                  </p>
                  <h3
                    className="text-base font-bold text-emerald-950 mt-0.5"
                    style={{ fontFamily: "'Georgia', serif" }}
                  >
                    {formatDisplayDate(selectedDate)}
                  </h3>
                </div>

                <div className="px-6 py-5">
                  {!selectedLog ? (
                    /* No log for this day */
                    <div className="flex flex-col items-center gap-2 py-6 text-center">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-100">
                        <FileText size={18} strokeWidth={1.5} className="text-stone-400" />
                      </div>
                      <p className="text-sm font-medium text-stone-500">No session recorded</p>
                      <p className="text-xs text-stone-400">Nothing was logged on this day.</p>
                    </div>
                  ) : (
                    /* Preview card */
                    <button
                      onClick={() => setModalLog(selectedLog)}
                      className="
                        w-full text-left group
                        rounded-2xl border border-stone-100
                        bg-stone-50 hover:bg-emerald-50
                        hover:border-emerald-200
                        p-4 transition-all duration-200
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400
                      "
                      aria-label="Open log detail"
                    >
                      <div className="flex items-start gap-4">
                        {/* Icon block */}
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 group-hover:bg-emerald-200 transition-colors">
                          <BookOpen size={16} strokeWidth={1.75} className="text-emerald-700" />
                        </div>

                        {/* Details */}
                        <div className="flex flex-col gap-1 flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-stone-800 truncate">
                              {selectedLog.surahName}
                            </span>
                            {/* Type badge */}
                            <span
                              className={`
                                inline-flex items-center rounded-full border px-2.5 py-0.5
                                text-[10px] font-semibold uppercase tracking-wider shrink-0
                                ${TYPE_CONFIG[selectedLog.type]?.badge}
                              `}
                            >
                              {TYPE_CONFIG[selectedLog.type]?.label}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="flex items-center gap-1 text-xs text-stone-500">
                              <BookOpen size={11} className="text-emerald-600" />
                              Page {selectedLog.quranPage}
                            </span>
                            {selectedLog.startAyat && selectedLog.endAyat && (
                              <span className="text-xs text-stone-500">
                                Ayat {selectedLog.startAyat}–{selectedLog.endAyat}
                              </span>
                            )}
                            <span className="flex items-center gap-1 text-xs text-stone-400 ml-auto">
                              <Clock size={11} />
                              {formatTime()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Tap hint */}
                      <p className="mt-3 text-[11px] text-emerald-600/70 text-right group-hover:text-emerald-700 transition-colors">
                        Tap to view details →
                      </p>
                    </button>
                  )}
                </div>
              </div>
            )}
          </section>

          {/* Footer */}
          <footer className="text-center pb-4">
            <p className="text-[11px] text-stone-300 italic">
              "And remind, for indeed the reminder benefits the believer." — Adh-Dhariyat 51:55
            </p>
          </footer>

        </div>
      </div>
    </>
  );
}