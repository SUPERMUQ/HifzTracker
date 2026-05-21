import React, { useState, useEffect } from 'react';
import LogForm from '../components/LogForm';
import { Trophy, Calendar, Target, Flame } from 'lucide-react';
import { subscribeToUserLogs } from '../firebase/logService';

const QURAN_VERSES = [
  {
    arabic: "وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ فَهَلْ مِن مُّدَّكِرٍ",
    english: "And We have certainly made the Quran easy for remembrance, so is there any who will remember?",
    surah: "Surah Al-Qamar",
    verse: "54:17"
  },
  {
    arabic: "وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا",
    english: "And recite the Quran with measured recitation.",
    surah: "Surah Al-Muzzammil",
    verse: "73:4"
  },
  {
    arabic: "إِنَّا نَحْنُ نَزَّلْنَا الذِّكْرَ وَإِنَّا لَهُ لَحَافِظُونَ",
    english: "Indeed, it is We who sent down the Quran and indeed, We will be its guardian.",
    surah: "Surah Al-Hijr",
    verse: "15:9"
  },
  {
    arabic: "بَلْ هُوَ آيَاتٌ بَيِّنَاتٌ فِي صُدُورِ الَّذِينَ أُوتُوا الْعِلْمَ",
    english: "Rather, the Quran is distinct verses [preserved] within the breasts of those who have been given knowledge.",
    surah: "Surah Al-Ankabut",
    verse: "29:49"
  }
];

// Accept the user object from App.jsx
export default function Dashboard({ user }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);

  useEffect(() => {
    if (!user?.uid) return;
    const unsubscribe = subscribeToUserLogs(user.uid, (data) => {
      setLogs(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user?.uid]);

  // Verse rotation timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentVerseIndex((prev) => (prev + 1) % QURAN_VERSES.length);
    }, 12000); // Rotate every 12 seconds
    return () => clearInterval(timer);
  }, []);

  // --- Dynamic Stats Calculations ---

  // 1. Current Streak: Consecutive days of logs ending today or yesterday
  const streak = calculateStreak(logs);

  // 2. Total Pages: Number of unique mushaf pages read/memorized
  const totalPages = calculateTotalPages(logs);

  // 3. Monthly Goal: Habit consistency percentage for the current month
  const monthlyGoal = calculateMonthlyGoal(logs);

  // 4. Sessions: Total count of recorded logs
  const sessions = logs.length;

  // --- Session Type Breakdown Calculations ---
  const typeCounts = logs.reduce((acc, log) => {
    // Map standard database type strings
    const type = log.type || "reading";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, { memorization: 0, revision: 0, reading: 0 });

  const getPercentage = (count) => {
    if (sessions === 0) return 0;
    return Math.round((count / sessions) * 100);
  };

  const memorizationPct = getPercentage(typeCounts.memorization);
  const revisionPct = getPercentage(typeCounts.revision);
  const readingPct = getPercentage(typeCounts.reading);

  function calculateStreak(logsList) {
    if (!logsList || logsList.length === 0) return 0;

    // Extract unique dates of activity ("YYYY-MM-DD")
    const activeDates = new Set(logsList.map(log => log.date));

    const formatDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    const now = new Date();
    const todayStr = formatDate(now);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = formatDate(yesterday);

    let checkDate = null;
    if (activeDates.has(todayStr)) {
      checkDate = now;
    } else if (activeDates.has(yesterdayStr)) {
      checkDate = yesterday;
    } else {
      return 0;
    }

    let currentStreak = 0;
    while (true) {
      const dateStr = formatDate(checkDate);
      if (activeDates.has(dateStr)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1); // move back 1 day
      } else {
        break;
      }
    }
    return currentStreak;
  }

  function calculateTotalPages(logsList) {
    if (!logsList || logsList.length === 0) return 0;
    const uniquePages = new Set(logsList.map(log => log.quranPage));
    return uniquePages.size;
  }

  function calculateMonthlyGoal(logsList) {
    if (!logsList || logsList.length === 0) return 0;

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const currentMonthPrefix = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
    const thisMonthLogs = logsList.filter(log => log.date.startsWith(currentMonthPrefix));

    const uniqueDays = new Set(thisMonthLogs.map(log => log.date)).size;

    return daysInMonth > 0 ? Math.round((uniqueDays / daysInMonth) * 100) : 0;
  }

  // Premium helper for rendering statistics with clean animations/skeleton states
  const renderStatValue = (val, suffix = "") => {
    if (loading) {
      return <div className="h-8 w-16 bg-stone-100 rounded-lg animate-pulse mt-1" />;
    }
    return <p className="text-3xl font-extrabold text-stone-800 tracking-tight">{val}{suffix}</p>;
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-stone-800 tracking-tight">Assalamu Alaikum,</h1>
          <p className="text-stone-500 mt-1 font-medium">Track your daily progress and protect your streak.</p>
        </div>
      </div>

      {/* Premium Quranic Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 text-white rounded-3xl p-6 md:p-8 shadow-xl shadow-emerald-950/20 border border-emerald-700/20">
        {/* Geometric Islamic SVG Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="islamic-star-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M30 0 L60 30 L30 60 L0 30 Z" fill="none" stroke="#fbbf24" strokeWidth="0.75" />
                <path d="M0 0 L60 60 M60 0 L0 60" fill="none" stroke="#fbbf24" strokeWidth="0.5" strokeDasharray="2,2" />
                <circle cx="30" cy="30" r="10" fill="none" stroke="#fbbf24" strokeWidth="0.75" />
                <circle cx="30" cy="30" r="4" fill="#fbbf24" />
                <rect x="15" y="15" width="30" height="30" fill="none" stroke="#fbbf24" strokeWidth="0.5" transform="rotate(45 30 30)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#islamic-star-pattern)" />
          </svg>
        </div>

        {/* Ambient Glows */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-emerald-800/80 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-wider text-emerald-200 border border-emerald-700/40">
                Inspiration of the Day
              </span>
              <span className="px-3 py-1 bg-amber-500/20 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-wider text-amber-300 border border-amber-500/30">
                القرآن الكريم
              </span>
            </div>

            {/* Verse Content */}
            <div className="space-y-3 transition-all duration-500 ease-in-out">
              <p 
                className="text-2xl md:text-3xl font-bold leading-loose text-right text-amber-200/90 drop-shadow-sm min-h-[4rem] md:min-h-[3rem] flex items-center justify-end" 
                style={{ fontFamily: "'Amiri', serif" }}
              >
                {QURAN_VERSES[currentVerseIndex].arabic}
              </p>
              <div className="space-y-1">
                <p className="text-sm md:text-base font-medium text-emerald-50 leading-relaxed italic">
                  "{QURAN_VERSES[currentVerseIndex].english}"
                </p>
                <p className="text-[11px] font-bold text-amber-400/90 uppercase tracking-widest">
                  — {QURAN_VERSES[currentVerseIndex].surah} ({QURAN_VERSES[currentVerseIndex].verse})
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Navigation controls */}
          <div className="flex items-center md:flex-col gap-3 justify-end self-end md:self-center">
            <div className="flex gap-1 bg-emerald-950/40 p-1 rounded-full border border-emerald-800/40">
              <button
                onClick={() => setCurrentVerseIndex((prev) => (prev - 1 + QURAN_VERSES.length) % QURAN_VERSES.length)}
                className="p-2 hover:bg-emerald-850 rounded-full transition-colors focus:outline-none cursor-pointer"
                aria-label="Previous verse"
              >
                <svg className="w-4 h-4 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setCurrentVerseIndex((prev) => (prev + 1) % QURAN_VERSES.length)}
                className="p-2 hover:bg-emerald-850 rounded-full transition-colors focus:outline-none cursor-pointer"
                aria-label="Next verse"
              >
                <svg className="w-4 h-4 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Dot Indicators */}
            <div className="flex gap-1.5 justify-center mt-1">
              {QURAN_VERSES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentVerseIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentVerseIndex ? "w-4 bg-amber-400" : "w-1.5 bg-emerald-850 hover:bg-emerald-700"
                  }`}
                  aria-label={`Go to verse ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main 12-Column Responsive Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Stats Grid & Breakdown (7/12 width) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Current Streak */}
            <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm flex items-center gap-4 transition-all duration-200 hover:shadow-md hover:border-stone-200/60">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-800">
                <Flame className="w-6 h-6 fill-current" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Current Streak</p>
                {renderStatValue(streak, streak === 1 ? " Day" : " Days")}
              </div>
            </div>

            {/* Total Pages */}
            <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm flex items-center gap-4 transition-all duration-200 hover:shadow-md hover:border-stone-200/60">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Total Pages</p>
                {renderStatValue(totalPages)}
              </div>
            </div>

            {/* Monthly Goal */}
            <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm flex items-center gap-4 transition-all duration-200 hover:shadow-md hover:border-stone-200/60">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Monthly Goal</p>
                {renderStatValue(monthlyGoal, "%")}
              </div>
            </div>

            {/* Sessions */}
            <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm flex items-center gap-4 transition-all duration-200 hover:shadow-md hover:border-stone-200/60">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Sessions</p>
                {renderStatValue(sessions)}
              </div>
            </div>
          </div>

          {/* Session Type Breakdown Visual Component */}
          <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-stone-850 font-display">Session Type Distribution</h2>
              <p className="text-xs text-stone-400 mt-0.5 font-medium">Visual breakdown of your Quranic engagement types</p>
            </div>

            {loading ? (
              <div className="space-y-4">
                <div className="h-4 bg-stone-100 rounded-full animate-pulse" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="h-16 bg-stone-50 border border-stone-100/50 rounded-xl animate-pulse" />
                  <div className="h-16 bg-stone-50 border border-stone-100/50 rounded-xl animate-pulse" />
                  <div className="h-16 bg-stone-50 border border-stone-100/50 rounded-xl animate-pulse" />
                </div>
              </div>
            ) : sessions === 0 ? (
              <div className="py-8 text-center text-stone-400 text-sm font-medium animate-fade-in">
                No session logs available. Start logging to see your distribution!
              </div>
            ) : (
              <div className="space-y-6 animate-fade-in">
                {/* Stacked Progress Bar */}
                <div className="w-full h-4 bg-stone-100/80 rounded-full overflow-hidden flex shadow-inner">
                  {typeCounts.memorization > 0 && (
                    <div 
                      style={{ width: `${memorizationPct}%` }} 
                      className="bg-emerald-600 transition-all duration-500 hover:brightness-95 cursor-help"
                      title={`Hifz: ${typeCounts.memorization} sessions (${memorizationPct}%)`}
                    />
                  )}
                  {typeCounts.revision > 0 && (
                    <div 
                      style={{ width: `${revisionPct}%` }} 
                      className="bg-amber-500 transition-all duration-500 hover:brightness-95 cursor-help"
                      title={`Muraja'ah: ${typeCounts.revision} sessions (${revisionPct}%)`}
                    />
                  )}
                  {typeCounts.reading > 0 && (
                    <div 
                      style={{ width: `${readingPct}%` }} 
                      className="bg-blue-500 transition-all duration-500 hover:brightness-95 cursor-help"
                      title={`Tilawah: ${typeCounts.reading} sessions (${readingPct}%)`}
                    />
                  )}
                </div>

                {/* Interactive Grid Legend */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Hifz */}
                  <div className="bg-emerald-50/20 hover:bg-emerald-50/40 p-4 rounded-2xl border border-emerald-100/30 transition-all duration-300 flex items-center justify-between group cursor-default">
                    <div className="flex items-center gap-3">
                      <span className="w-3.5 h-3.5 bg-emerald-600 rounded-full ring-4 ring-emerald-50 group-hover:scale-110 transition-transform duration-200" />
                      <div>
                        <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Hifz</p>
                        <p className="text-xs font-semibold text-stone-400 mt-0.5">Memorization</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-emerald-800">{typeCounts.memorization}</p>
                      <p className="text-xs font-medium text-emerald-600/80">{memorizationPct}%</p>
                    </div>
                  </div>

                  {/* Muraja'ah */}
                  <div className="bg-amber-50/10 hover:bg-amber-50/30 p-4 rounded-2xl border border-amber-100/20 transition-all duration-300 flex items-center justify-between group cursor-default">
                    <div className="flex items-center gap-3">
                      <span className="w-3.5 h-3.5 bg-amber-500 rounded-full ring-4 ring-amber-50 group-hover:scale-110 transition-transform duration-200" />
                      <div>
                        <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Muraja'ah</p>
                        <p className="text-xs font-semibold text-stone-400 mt-0.5">Revision</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-amber-800">{typeCounts.revision}</p>
                      <p className="text-xs font-medium text-amber-600/80">{revisionPct}%</p>
                    </div>
                  </div>

                  {/* Tilawah */}
                  <div className="bg-blue-50/10 hover:bg-blue-50/30 p-4 rounded-2xl border border-blue-100/20 transition-all duration-300 flex items-center justify-between group cursor-default">
                    <div className="flex items-center gap-3">
                      <span className="w-3.5 h-3.5 bg-blue-500 rounded-full ring-4 ring-blue-50 group-hover:scale-110 transition-transform duration-200" />
                      <div>
                        <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Tilawah</p>
                        <p className="text-xs font-semibold text-stone-400 mt-0.5">Reading</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-800">{typeCounts.reading}</p>
                      <p className="text-xs font-medium text-blue-600/80">{readingPct}%</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Redesigned Log Form (5/12 width) */}
        <div className="lg:col-span-5">
          <LogForm userId={user?.uid} />
        </div>
      </div>
    </div>
  );
}