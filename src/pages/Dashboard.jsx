import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LogForm from '../components/LogForm';
import { Trophy, Calendar, Target, Flame, ChevronLeft, ChevronRight, Sparkles, BookOpen, Activity } from 'lucide-react';
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
    }, 12000);
    return () => clearInterval(timer);
  }, []);

  // Dynamic calculations
  const streak = calculateStreak(logs);
  const totalPages = calculateTotalPages(logs);
  const monthlyGoal = calculateMonthlyGoal(logs);
  const sessions = logs.length;

  const typeCounts = logs.reduce((acc, log) => {
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
        checkDate.setDate(checkDate.getDate() - 1);
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
    const currentMonth = now.getMonth();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const currentMonthPrefix = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
    const thisMonthLogs = logsList.filter(log => log.date.startsWith(currentMonthPrefix));
    const uniqueDays = new Set(thisMonthLogs.map(log => log.date)).size;

    return daysInMonth > 0 ? Math.round((uniqueDays / daysInMonth) * 100) : 0;
  }

  const renderStatValue = (val, suffix = "") => {
    if (loading) {
      return <div className="h-8 w-16 bg-white/[0.06] rounded-xl animate-pulse mt-1" />;
    }
    return (
      <p className="text-3xl font-extrabold text-white tracking-tight font-display mt-0.5">
        {val}<span className="text-emerald-400 text-lg font-normal ml-0.5">{suffix}</span>
      </p>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-8 max-w-6xl mx-auto"
    >
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight font-display flex items-center gap-2">
            Assalamu Alaikum <span className="text-emerald-400 text-xl font-normal">✨</span>
          </h1>
          <p className="text-zinc-400 mt-1 text-sm font-medium">Track your daily Quran checkpoints and protect your streak.</p>
        </div>
        <div className="flex items-center gap-2 bg-[#0c0c12] border border-white/[0.08] px-4 py-2 rounded-2xl">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono text-zinc-300">Live Firebase Cloud Sync</span>
        </div>
      </div>

      {/* SOTD Premium Quranic Welcome Hero Bento Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#091510] via-[#0b1016] to-[#07090e] rounded-3xl p-7 md:p-9 shadow-2xl border border-emerald-500/20">
        {/* Geometric Islamic SVG Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.06] mix-blend-overlay pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="islamic-star-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M30 0 L60 30 L30 60 L0 30 Z" fill="none" stroke="#fbbf24" strokeWidth="0.75" />
                <circle cx="30" cy="30" r="10" fill="none" stroke="#fbbf24" strokeWidth="0.75" />
                <circle cx="30" cy="30" r="3" fill="#fbbf24" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#islamic-star-pattern)" />
          </svg>
        </div>

        {/* Ambient Glows */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 bg-emerald-500/10 backdrop-blur-md rounded-full text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400 border border-emerald-500/25 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-emerald-400" /> Daily Quran Inspiration
              </span>
              <span className="px-3 py-1 bg-amber-500/10 backdrop-blur-md rounded-full text-[10px] font-mono font-bold uppercase tracking-widest text-amber-300 border border-amber-500/20">
                القرآن الكريم
              </span>
            </div>

            {/* Verse Content with AnimatePresence */}
            <div className="space-y-3 min-h-[6rem] flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentVerseIndex}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-3"
                >
                  <p 
                    className="text-2xl md:text-3xl font-bold leading-loose text-right text-amber-200/95 drop-shadow-[0_2px_10px_rgba(245,158,11,0.2)]" 
                    style={{ fontFamily: "'Amiri', serif" }}
                  >
                    {QURAN_VERSES[currentVerseIndex].arabic}
                  </p>
                  <div className="space-y-1">
                    <p className="text-sm md:text-base font-medium text-zinc-300 leading-relaxed italic">
                      "{QURAN_VERSES[currentVerseIndex].english}"
                    </p>
                    <p className="text-[11px] font-mono font-semibold text-emerald-400/90 uppercase tracking-widest">
                      — {QURAN_VERSES[currentVerseIndex].surah} ({QURAN_VERSES[currentVerseIndex].verse})
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Interactive Navigation controls */}
          <div className="flex items-center md:flex-col gap-3 justify-end self-end md:self-center shrink-0">
            <div className="flex gap-1.5 bg-black/40 p-1.5 rounded-2xl border border-white/[0.08] backdrop-blur-md">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentVerseIndex((prev) => (prev - 1 + QURAN_VERSES.length) % QURAN_VERSES.length)}
                className="p-2 hover:bg-white/[0.08] rounded-xl transition-colors text-zinc-300 cursor-pointer"
                aria-label="Previous verse"
              >
                <ChevronLeft className="w-4 h-4 text-emerald-400" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentVerseIndex((prev) => (prev + 1) % QURAN_VERSES.length)}
                className="p-2 hover:bg-white/[0.08] rounded-xl transition-colors text-zinc-300 cursor-pointer"
                aria-label="Next verse"
              >
                <ChevronRight className="w-4 h-4 text-emerald-400" />
              </motion.button>
            </div>

            {/* Dot Indicators */}
            <div className="flex gap-1.5 justify-center mt-1">
              {QURAN_VERSES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentVerseIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentVerseIndex ? "w-5 bg-amber-400 shadow-[0_0_8px_#f59e0b]" : "w-1.5 bg-white/20 hover:bg-white/40"
                  }`}
                  aria-label={`Go to verse ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main 12-Column SOTD Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Bento Stats Grid & Breakdown (7/12 width) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Quick Stats Bento Grid (2x2) */}
          <div className="grid grid-cols-2 gap-4">
            {/* Current Streak */}
            <motion.div 
              whileHover={{ y: -4, transition: { type: "spring", stiffness: 400, damping: 25 } }}
              className="bg-[#0c0c12]/90 p-6 rounded-3xl border border-white/[0.08] shadow-xl backdrop-blur-xl flex flex-col justify-between relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/15 transition-all duration-500" />
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-tr from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-400 shadow-md">
                  <Flame className="w-6 h-6 fill-emerald-400" />
                </div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-semibold">Activity</span>
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-semibold">Active Streak</p>
                {renderStatValue(streak, streak === 1 ? " Day" : " Days")}
              </div>
            </motion.div>

            {/* Total Pages */}
            <motion.div 
              whileHover={{ y: -4, transition: { type: "spring", stiffness: 400, damping: 25 } }}
              className="bg-[#0c0c12]/90 p-6 rounded-3xl border border-white/[0.08] shadow-xl backdrop-blur-xl flex flex-col justify-between relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/15 transition-all duration-500" />
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-tr from-amber-500/20 to-yellow-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center text-amber-400 shadow-md">
                  <Trophy className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-semibold">Mushaf</span>
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-semibold">Total Pages</p>
                {renderStatValue(totalPages, " pages")}
              </div>
            </motion.div>

            {/* Monthly Goal */}
            <motion.div 
              whileHover={{ y: -4, transition: { type: "spring", stiffness: 400, damping: 25 } }}
              className="bg-[#0c0c12]/90 p-6 rounded-3xl border border-white/[0.08] shadow-xl backdrop-blur-xl flex flex-col justify-between relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-28 h-28 bg-blue-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-500/15 transition-all duration-500" />
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-tr from-blue-500/20 to-cyan-500/10 border border-blue-500/30 rounded-2xl flex items-center justify-center text-blue-400 shadow-md">
                  <Target className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-semibold">Consistency</span>
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-semibold">Monthly Rate</p>
                {renderStatValue(monthlyGoal, "%")}
              </div>
            </motion.div>

            {/* Sessions */}
            <motion.div 
              whileHover={{ y: -4, transition: { type: "spring", stiffness: 400, damping: 25 } }}
              className="bg-[#0c0c12]/90 p-6 rounded-3xl border border-white/[0.08] shadow-xl backdrop-blur-xl flex flex-col justify-between relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-28 h-28 bg-purple-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-purple-500/15 transition-all duration-500" />
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-tr from-purple-500/20 to-indigo-500/10 border border-purple-500/30 rounded-2xl flex items-center justify-center text-purple-400 shadow-md">
                  <Calendar className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-semibold">History</span>
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-semibold">Total Sessions</p>
                {renderStatValue(sessions, " logs")}
              </div>
            </motion.div>
          </div>

          {/* Session Type Breakdown Visual Bento Component */}
          <div className="bg-[#0c0c12]/90 p-7 rounded-3xl border border-white/[0.08] shadow-xl backdrop-blur-xl space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white font-display tracking-tight flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-400" /> Session Distribution
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5 font-medium">Visual breakdown of your Quranic engagement types</p>
              </div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Real-time</span>
            </div>

            {loading ? (
              <div className="space-y-4">
                <div className="h-4 bg-white/[0.06] rounded-full animate-pulse" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="h-20 bg-white/[0.03] border border-white/[0.06] rounded-2xl animate-pulse" />
                  <div className="h-20 bg-white/[0.03] border border-white/[0.06] rounded-2xl animate-pulse" />
                  <div className="h-20 bg-white/[0.03] border border-white/[0.06] rounded-2xl animate-pulse" />
                </div>
              </div>
            ) : sessions === 0 ? (
              <div className="py-10 text-center text-zinc-500 text-xs font-mono">
                No session logs available yet. Submit your first log to view breakdown metrics!
              </div>
            ) : (
              <div className="space-y-6">
                {/* Stacked Progress Bar */}
                <div className="w-full h-4 bg-[#14141c] rounded-full overflow-hidden flex border border-white/[0.06]">
                  {typeCounts.memorization > 0 && (
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${memorizationPct}%` }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full relative group cursor-help"
                      title={`Hifz: ${typeCounts.memorization} sessions (${memorizationPct}%)`}
                    />
                  )}
                  {typeCounts.revision > 0 && (
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${revisionPct}%` }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full relative group cursor-help"
                      title={`Muraja'ah: ${typeCounts.revision} sessions (${revisionPct}%)`}
                    />
                  )}
                  {typeCounts.reading > 0 && (
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${readingPct}%` }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full relative group cursor-help"
                      title={`Tilawah: ${typeCounts.reading} sessions (${readingPct}%)`}
                    />
                  )}
                </div>

                {/* Interactive Grid Legend */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Hifz */}
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="bg-[#121218] p-4 rounded-2xl border border-white/[0.06] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-3.5 h-3.5 bg-emerald-400 rounded-full shadow-[0_0_10px_#10b981]" />
                      <div>
                        <p className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">Hifz</p>
                        <p className="text-xs font-medium text-zinc-500">Memorization</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-white font-display">{typeCounts.memorization}</p>
                      <p className="text-[10px] font-mono text-emerald-400">{memorizationPct}%</p>
                    </div>
                  </motion.div>

                  {/* Muraja'ah */}
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="bg-[#121218] p-4 rounded-2xl border border-white/[0.06] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-3.5 h-3.5 bg-amber-400 rounded-full shadow-[0_0_10px_#f59e0b]" />
                      <div>
                        <p className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">Muraja'ah</p>
                        <p className="text-xs font-medium text-zinc-500">Revision</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-white font-display">{typeCounts.revision}</p>
                      <p className="text-[10px] font-mono text-amber-400">{revisionPct}%</p>
                    </div>
                  </motion.div>

                  {/* Tilawah */}
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="bg-[#121218] p-4 rounded-2xl border border-white/[0.06] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-3.5 h-3.5 bg-blue-400 rounded-full shadow-[0_0_10px_#3b82f6]" />
                      <div>
                        <p className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">Tilawah</p>
                        <p className="text-xs font-medium text-zinc-500">Reading</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-white font-display">{typeCounts.reading}</p>
                      <p className="text-[10px] font-mono text-blue-400">{readingPct}%</p>
                    </div>
                  </motion.div>
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
    </motion.div>
  );
}