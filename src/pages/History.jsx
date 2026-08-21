import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  BookOpen, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Award, 
  Trophy, 
  Target, 
  Flame, 
  RotateCcw, 
  LayoutGrid, 
  List,
  Sparkles
} from 'lucide-react';
import LogModal from '../components/LogModal';
import { getLogsByMonth } from '../firebase/logService';

export default function History({ user }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dbLogs, setDbLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('calendar'); // 'calendar' | 'timeline'

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const fetchMonthlyLogs = React.useCallback(async () => {
    if (!user?.uid) return; 

    setLoading(true);
    const yearMonthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
    try {
      const data = await getLogsByMonth(user.uid, yearMonthStr);
      setDbLogs(data);
    } catch (error) {
      console.error("Error reading log history:", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  }, [user?.uid, year, month]);

  useEffect(() => {
    fetchMonthlyLogs();
  }, [fetchMonthlyLogs]); 

  // Calendar rendering computations
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dayCells = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => null);
  const totalSlots = [...blanks, ...dayCells];

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleGoToToday = () => {
    setCurrentDate(new Date());
  };

  const isCurrentMonth = () => {
    const today = new Date();
    return year === today.getFullYear() && month === today.getMonth();
  };

  const getLogsForDay = (dayNum) => {
    if (!dayNum) return [];
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    return dbLogs.filter(log => log.date === dateString);
  };

  const handleTileClick = (dayNum) => {
    const dayLogs = getLogsForDay(dayNum);
    if (dayLogs.length > 0) {
      setSelectedLog(dayLogs[0]);
      setIsModalOpen(true);
    }
  };

  // Stats
  const totalSessions = dbLogs.length;
  const uniqueActiveDays = new Set(dbLogs.map(log => log.date)).size;
  const consistencyRate = daysInMonth > 0 ? Math.round((uniqueActiveDays / daysInMonth) * 100) : 0;
  const totalUniquePages = new Set(dbLogs.map(log => log.quranPage)).size;

  const typeCounts = dbLogs.reduce((acc, log) => {
    const t = log.type || "reading";
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, { memorization: 0, revision: 0, reading: 0 });

  let primaryFocus = "None";
  let focusColor = "text-zinc-400 bg-zinc-800/40 border-white/[0.08]";
  if (totalSessions > 0) {
    const maxVal = Math.max(typeCounts.memorization, typeCounts.revision, typeCounts.reading);
    if (maxVal === typeCounts.memorization) {
      primaryFocus = "Hifz Focus";
      focusColor = "text-amber-300 bg-amber-500/15 border-amber-500/30";
    } else if (maxVal === typeCounts.revision) {
      primaryFocus = "Revision Focus";
      focusColor = "text-blue-300 bg-blue-500/15 border-blue-500/30";
    } else {
      primaryFocus = "Tilawah Focus";
      focusColor = "text-emerald-300 bg-emerald-500/15 border-emerald-500/30";
    }
  }

  let maxStreak = 0;
  let currentStreak = 0;
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const hasLog = dbLogs.some(log => log.date === dateStr);
    if (hasLog) {
      currentStreak++;
      if (currentStreak > maxStreak) {
        maxStreak = currentStreak;
      }
    } else {
      currentStreak = 0;
    }
  }

  // Tile styles
  const getTileStyles = (dayLogs) => {
    if (dayLogs.length === 0) {
      return "bg-[#101016]/40 border-white/[0.05] text-zinc-600 hover:bg-[#151520] hover:border-white/[0.1]";
    }
    
    const hasHifz = dayLogs.some(l => l.type === 'memorization');
    const hasRevision = dayLogs.some(l => l.type === 'revision');
    
    if (hasHifz) {
      return "bg-amber-500/15 border-amber-500/30 text-amber-200 hover:bg-amber-500/25 shadow-[0_0_15px_rgba(245,158,11,0.15)]";
    }
    if (hasRevision) {
      return "bg-blue-500/15 border-blue-500/30 text-blue-200 hover:bg-blue-500/25 shadow-[0_0_15px_rgba(59,130,246,0.15)]";
    }
    return "bg-emerald-500/15 border-emerald-500/30 text-emerald-200 hover:bg-emerald-500/25 shadow-[0_0_15px_rgba(16,185,129,0.15)]";
  };

  // Skeletons
  const StatSkeleton = () => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-[#0c0c12]/90 p-5 rounded-3xl border border-white/[0.08] animate-pulse flex items-center gap-4">
          <div className="w-11 h-11 bg-white/[0.06] rounded-2xl shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-3 bg-white/[0.06] rounded w-16" />
            <div className="h-6 bg-white/[0.06] rounded w-12" />
          </div>
        </div>
      ))}
    </div>
  );

  const BoardSkeleton = () => (
    <div className="bg-[#0c0c12]/90 rounded-3xl border border-white/[0.08] p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="h-6 bg-white/[0.06] rounded w-1/4 animate-pulse" />
        <div className="h-8 bg-white/[0.06] rounded w-32 animate-pulse" />
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-xs font-mono text-zinc-600">
        {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map(d => <div key={d} className="py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-2 sm:gap-3">
        {Array.from({ length: 31 }).map((_, idx) => (
          <div key={idx} className="aspect-square bg-white/[0.03] border border-white/[0.05] rounded-2xl animate-pulse" />
        ))}
      </div>
    </div>
  );

  const EmptyState = () => (
    <div className="bg-[#0c0c12]/90 rounded-3xl border border-white/[0.08] p-12 text-center shadow-2xl flex flex-col items-center justify-center space-y-5">
      <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400">
        <BookOpen className="w-7 h-7" />
      </div>
      <div className="space-y-2 max-w-md">
        <h3 className="text-xl font-bold text-white font-display">No Footprints Logged Yet</h3>
        <p className="text-xs text-zinc-400 leading-relaxed">
          No Quranic sessions were logged for <span className="font-bold text-emerald-400">{monthNames[month]} {year}</span>. Start recording to build your consistency record.
        </p>
      </div>
      <div className="pt-2 text-xs text-zinc-600 font-serif italic select-none">
        "Recite in the name of your Lord who created" (96:1)
      </div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-6xl mx-auto space-y-6 pb-12"
    >
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white font-display tracking-tight">Reading Log History</h1>
          <p className="text-zinc-400 text-xs mt-1">Review past checkpoints, track consistency, and inspect details.</p>
        </div>
        
        {/* Navigation & Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={handleGoToToday}
            disabled={isCurrentMonth()}
            className={`p-2.5 px-4 text-xs font-mono font-bold rounded-2xl border flex items-center gap-1.5 transition-all
              ${isCurrentMonth()
                ? "bg-white/[0.03] border-white/[0.05] text-zinc-600 cursor-not-allowed"
                : "bg-[#0c0c12] border-white/[0.1] text-zinc-200 hover:border-emerald-500/40 cursor-pointer shadow-lg active:scale-95"
              }`}
          >
            <RotateCcw className="w-3.5 h-3.5" /> Today
          </motion.button>

          <div className="flex items-center gap-1 bg-[#0c0c12] p-1.5 rounded-2xl border border-white/[0.1] shadow-lg">
            <button onClick={handlePrevMonth} className="p-2 hover:bg-white/[0.08] rounded-xl text-zinc-400 hover:text-white transition-colors cursor-pointer">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-bold px-3 text-white min-w-[130px] text-center text-xs font-mono">
              {monthNames[month]} {year}
            </span>
            <button onClick={handleNextMonth} className="p-2 hover:bg-white/[0.08] rounded-xl text-zinc-400 hover:text-white transition-colors cursor-pointer">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Monthly Stats Bento Deck */}
      {loading ? (
        <StatSkeleton />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div whileHover={{ y: -3 }} className="bg-[#0c0c12]/90 p-5 rounded-3xl border border-white/[0.08] shadow-xl flex items-center gap-4">
            <div className="w-11 h-11 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 shrink-0">
              <Target className="w-5.5 h-5.5" />
            </div>
            <div>
              <p className="text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-widest">Consistency</p>
              <p className="text-xl font-extrabold text-white font-display mt-0.5">{consistencyRate}%</p>
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -3 }} className="bg-[#0c0c12]/90 p-5 rounded-3xl border border-white/[0.08] shadow-xl flex items-center gap-4">
            <div className="w-11 h-11 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center text-purple-400 shrink-0">
              <Trophy className="w-5.5 h-5.5" />
            </div>
            <div>
              <p className="text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-widest">Unique Pages</p>
              <p className="text-xl font-extrabold text-white font-display mt-0.5">{totalUniquePages}</p>
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -3 }} className="bg-[#0c0c12]/90 p-5 rounded-3xl border border-white/[0.08] shadow-xl flex items-center gap-4">
            <div className="w-11 h-11 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 shrink-0">
              <Award className="w-5.5 h-5.5" />
            </div>
            <div>
              <p className="text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-widest">Primary Focus</p>
              <span className={`inline-block text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border mt-1 ${focusColor}`}>
                {primaryFocus}
              </span>
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -3 }} className="bg-[#0c0c12]/90 p-5 rounded-3xl border border-white/[0.08] shadow-xl flex items-center gap-4">
            <div className="w-11 h-11 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center text-amber-400 shrink-0">
              <Flame className="w-5.5 h-5.5 fill-amber-400" />
            </div>
            <div>
              <p className="text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-widest">Max Streak</p>
              <p className="text-xl font-extrabold text-white font-display mt-0.5">{maxStreak} {maxStreak === 1 ? "day" : "days"}</p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Main Container */}
      {loading ? (
        <BoardSkeleton />
      ) : dbLogs.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-5">
          {/* Tabs Selector with Morphing layoutId */}
          <div className="flex justify-between items-center bg-[#0c0c12]/90 p-2 rounded-3xl border border-white/[0.08]">
            <div className="flex items-center gap-2 pl-3">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono text-zinc-300">Visualization Mode</span>
            </div>

            <div className="flex p-1 bg-[#121218] rounded-2xl shrink-0">
              <button 
                onClick={() => setActiveView('calendar')}
                className="relative flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-xl transition-colors cursor-pointer"
              >
                {activeView === 'calendar' && (
                  <motion.div
                    layoutId="historyViewMode"
                    className="absolute inset-0 bg-emerald-500/20 border border-emerald-500/40 rounded-xl"
                    transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  />
                )}
                <span className={`relative z-10 flex items-center gap-1.5 ${activeView === 'calendar' ? "text-emerald-300 font-bold" : "text-zinc-400"}`}>
                  <LayoutGrid className="w-3.5 h-3.5" /> Grid Heatmap
                </span>
              </button>

              <button 
                onClick={() => setActiveView('timeline')}
                className="relative flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-xl transition-colors cursor-pointer"
              >
                {activeView === 'timeline' && (
                  <motion.div
                    layoutId="historyViewMode"
                    className="absolute inset-0 bg-emerald-500/20 border border-emerald-500/40 rounded-xl"
                    transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  />
                )}
                <span className={`relative z-10 flex items-center gap-1.5 ${activeView === 'timeline' ? "text-emerald-300 font-bold" : "text-zinc-400"}`}>
                  <List className="w-3.5 h-3.5" /> Timeline Feed
                </span>
              </button>
            </div>
          </div>

          {/* View Render Area */}
          {activeView === 'calendar' ? (
            /* --- CALENDAR HEATMAP BENTO GRID --- */
            <div className="bg-[#0c0c12]/90 rounded-3xl border border-white/[0.08] p-7 shadow-2xl">
              {/* Week Headers */}
              <div className="grid grid-cols-7 gap-2 mb-4 text-center text-xs font-mono font-bold text-zinc-500 tracking-widest">
                {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map(d => <div key={d} className="py-1">{d}</div>)}
              </div>

              {/* Grid Cells */}
              <div className="grid grid-cols-7 gap-2 sm:gap-3">
                {totalSlots.map((day, idx) => {
                  const dayLogs = getLogsForDay(day);
                  
                  return (
                    <div key={idx} className="aspect-square relative group">
                      {day && (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleTileClick(day)}
                            className={`w-full h-full rounded-2xl flex flex-col items-center justify-center font-bold border text-sm transition-all duration-200 relative ${getTileStyles(dayLogs)}`}
                          >
                            <span>{day}</span>
                            
                            {/* Session indicators */}
                            {dayLogs.length > 0 && (
                              <div className="flex gap-1 mt-1 justify-center max-w-full overflow-hidden">
                                {dayLogs.slice(0, 3).map((log, i) => {
                                  let dotColor = "bg-emerald-400";
                                  if (log.type === "memorization") dotColor = "bg-amber-400 shadow-[0_0_6px_#f59e0b]";
                                  if (log.type === "revision") dotColor = "bg-blue-400 shadow-[0_0_6px_#3b82f6]";
                                  return (
                                    <span key={log.id || i} className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                                  );
                                })}
                                {dayLogs.length > 3 && (
                                  <span className="text-[8px] leading-none text-zinc-400 font-mono font-bold">+</span>
                                )}
                              </div>
                            )}
                          </motion.button>

                          {/* SOTD Hover Tooltip */}
                          {dayLogs.length > 0 && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 hidden group-hover:block z-40 bg-[#09090e]/95 backdrop-blur-xl border border-white/[0.12] text-white text-xs p-4 rounded-2xl shadow-2xl pointer-events-none transition-all duration-300">
                              <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-[#09090e]" />
                              
                              <div className="flex justify-between items-center border-b border-white/[0.08] pb-2 mb-2">
                                <span className="font-bold text-emerald-400 font-mono">
                                  {dayNames[new Date(year, month, day).getDay()]}
                                </span>
                                <span className="text-[10px] text-zinc-400 font-mono">
                                  {monthNames[month].slice(0, 3)} {day}, {year}
                                </span>
                              </div>

                              <div className="space-y-2.5 max-h-[160px] overflow-y-auto pr-1">
                                {dayLogs.map((log, i) => (
                                  <div key={log.id || i} className="flex flex-col gap-0.5 border-l-2 border-emerald-400 pl-2.5">
                                    <div className="flex justify-between items-center">
                                      <span className="font-bold text-white text-xs truncate max-w-[120px]">{log.surahName}</span>
                                      <span className={`text-[9px] font-mono uppercase tracking-wider font-bold px-1.5 py-0.5 rounded-md ${
                                        log.type === "memorization" 
                                          ? "text-amber-300 bg-amber-500/15"
                                          : log.type === "revision"
                                          ? "text-blue-300 bg-blue-500/15"
                                          : "text-emerald-300 bg-emerald-500/15"
                                      }`}>
                                        {log.type === "memorization" ? "Hifz" : log.type === "revision" ? "Muraja'ah" : "Tilawah"}
                                      </span>
                                    </div>
                                    <div className="text-[10px] text-zinc-400 flex justify-between font-mono">
                                      <span>Page {log.quranPage}</span>
                                      {log.startAyat && log.endAyat ? (
                                        <span className="text-zinc-500">Ayat {log.startAyat}-{log.endAyat}</span>
                                      ) : null}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* --- CHRONOLOGICAL TIMELINE FEED VIEW --- */
            <div className="relative before:absolute before:inset-y-0 before:left-5 before:w-0.5 before:bg-white/[0.08] py-3 space-y-4">
              {dbLogs.map((log, idx) => {
                const logDate = new Date(log.date);
                const dayName = dayNames[logDate.getDay()];
                const dayNum = logDate.getDate();

                let typeColor = "text-emerald-300 bg-emerald-500/15 border-emerald-500/30";
                let typeDot = "bg-emerald-400 shadow-[0_0_12px_#10b981]";
                let label = "Tilawah";
                
                if (log.type === "memorization") {
                  typeColor = "text-amber-300 bg-amber-500/15 border-amber-500/30";
                  typeDot = "bg-amber-400 shadow-[0_0_12px_#f59e0b]";
                  label = "Hifz";
                } else if (log.type === "revision") {
                  typeColor = "text-blue-300 bg-blue-500/15 border-blue-500/30";
                  typeDot = "bg-blue-400 shadow-[0_0_12px_#3b82f6]";
                  label = "Muraja'ah";
                }

                return (
                  <motion.div 
                    key={log.id || idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.03 }}
                    className="relative pl-12 group"
                  >
                    {/* Timeline Dot */}
                    <div className={`absolute left-2.5 top-5 w-5 h-5 rounded-full border-2 border-[#050505] ${typeDot} z-10 transition-transform duration-300 group-hover:scale-125`} />
                    
                    {/* Log details Card */}
                    <motion.div 
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => {
                        setSelectedLog(log);
                        setIsModalOpen(true);
                      }}
                      className="bg-[#0c0c12]/90 hover:bg-[#12121c] p-6 rounded-3xl border border-white/[0.08] shadow-xl transition-all duration-300 cursor-pointer flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-3">
                          <span className={`text-[9px] font-mono uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full border ${typeColor}`}>
                            {label}
                          </span>
                          <span className="text-xs text-zinc-400 font-mono">
                            {dayName}, {monthNames[month]} {dayNum}
                          </span>
                        </div>
                        
                        <h3 className="text-lg font-bold text-white font-display pt-0.5">
                          Surah {log.surahName}
                        </h3>
                        
                        <div className="flex items-center gap-4 text-xs font-medium text-zinc-400 font-mono">
                          <span className="flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-emerald-400" /> Page {log.quranPage}
                          </span>
                          {log.startAyat && log.endAyat ? (
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-emerald-400" /> Ayat {log.startAyat} – {log.endAyat}
                            </span>
                          ) : null}
                        </div>

                        {log.notes && (
                          <div className="bg-[#121218] p-3 rounded-xl border border-white/[0.04] mt-2 text-xs text-zinc-300 italic max-w-2xl">
                            "{log.notes}"
                          </div>
                        )}
                      </div>
                      
                      <button className="text-xs font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 px-4 py-2.5 rounded-2xl border border-emerald-500/25 transition-colors self-end sm:self-center shrink-0 cursor-pointer">
                        Open Details
                      </button>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modal Detail View Sheet */}
      {isModalOpen && selectedLog && (
        <LogModal 
          log={selectedLog} 
          onClose={() => {
            setIsModalOpen(false);
            setSelectedLog(null);
          }} 
          onLogChange={fetchMonthlyLogs}
        />
      )}
    </motion.div>
  );
}