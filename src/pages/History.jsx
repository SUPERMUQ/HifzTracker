import React, { useState, useEffect } from 'react';
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

  // Load live user data from Firestore whenever the month grid flips
  const fetchMonthlyLogs = React.useCallback(async () => {
    if (!user?.uid) return; 

    setLoading(true);
    // Format argument format as: "YYYY-MM"
    const yearMonthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
    try {
      const data = await getLogsByMonth(user.uid, yearMonthStr);
      setDbLogs(data);
    } catch (error) {
      console.error("Error reading log history:", error);
    } finally {
      // Small artificial delay to avoid flicker and display the beautiful skeleton transitions smoothly
      setTimeout(() => {
        setLoading(false);
      }, 350);
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

  // Maps calendar grid indexes back to all corresponding firestore entries
  const getLogsForDay = (dayNum) => {
    if (!dayNum) return [];
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    return dbLogs.filter(log => log.date === dateString);
  };

  const handleTileClick = (dayNum) => {
    const dayLogs = getLogsForDay(dayNum);
    if (dayLogs.length > 0) {
      // Open details for the first log.
      // If there are multiple, the user can review them chronologically or edit
      setSelectedLog(dayLogs[0]);
      setIsModalOpen(true);
    }
  };

  // --- Dynamic Monthly Statistics Calculations ---
  const totalSessions = dbLogs.length;
  const uniqueActiveDays = new Set(dbLogs.map(log => log.date)).size;
  const consistencyRate = daysInMonth > 0 ? Math.round((uniqueActiveDays / daysInMonth) * 100) : 0;
  
  // Total unique mushaf pages read/memorized this month
  const totalUniquePages = new Set(dbLogs.map(log => log.quranPage)).size;

  // Session Type Breakdown Focus
  const typeCounts = dbLogs.reduce((acc, log) => {
    const t = log.type || "reading";
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, { memorization: 0, revision: 0, reading: 0 });

  let primaryFocus = "None";
  let focusColor = "text-stone-500 bg-stone-50 border-stone-100/50";
  if (totalSessions > 0) {
    const maxVal = Math.max(typeCounts.memorization, typeCounts.revision, typeCounts.reading);
    if (maxVal === typeCounts.memorization) {
      primaryFocus = "Hifz";
      focusColor = "text-amber-700 bg-amber-50/80 border-amber-100";
    } else if (maxVal === typeCounts.revision) {
      primaryFocus = "Muraja'ah";
      focusColor = "text-blue-700 bg-blue-50/80 border-blue-100";
    } else {
      primaryFocus = "Tilawah";
      focusColor = "text-emerald-700 bg-emerald-50/80 border-emerald-100";
    }
  }

  // Monthly level streak calculation
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

  // Color logic mapping for calendar cells
  const getTileStyles = (dayLogs) => {
    if (dayLogs.length === 0) {
      return "bg-gray-50/40 border-gray-100/70 text-gray-500 hover:bg-gray-50 hover:border-gray-200";
    }
    
    const hasHifz = dayLogs.some(l => l.type === 'memorization');
    const hasRevision = dayLogs.some(l => l.type === 'revision');
    
    if (hasHifz) {
      return "bg-amber-50/60 border-amber-100/80 text-amber-800 hover:bg-amber-100/60 shadow-sm shadow-amber-100/10";
    }
    if (hasRevision) {
      return "bg-blue-50/60 border-blue-100/80 text-blue-800 hover:bg-blue-100/60 shadow-sm shadow-blue-100/10";
    }
    return "bg-emerald-50/60 border-emerald-100/80 text-emerald-800 hover:bg-emerald-100/60 shadow-sm shadow-emerald-100/10";
  };

  // Skeletons
  const StatSkeleton = () => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm animate-pulse flex items-center gap-4">
          <div className="w-11 h-11 bg-stone-100 rounded-xl shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-3 bg-stone-100 rounded w-16" />
            <div className="h-6 bg-stone-100 rounded w-12" />
          </div>
        </div>
      ))}
    </div>
  );

  const BoardSkeleton = () => (
    <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm space-y-6">
      <div className="flex justify-between items-center">
        <div className="h-6 bg-stone-100 rounded w-1/4 animate-pulse" />
        <div className="h-8 bg-stone-100 rounded w-32 animate-pulse" />
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-stone-300 tracking-wider">
        {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map(d => <div key={d} className="py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-2 sm:gap-3">
        {Array.from({ length: 31 }).map((_, idx) => (
          <div key={idx} className="aspect-square bg-stone-50/50 border border-stone-100/40 rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  );

  // Motivational Empty State
  const EmptyState = () => (
    <div className="bg-white rounded-3xl border border-stone-100 p-12 text-center shadow-sm flex flex-col items-center justify-center space-y-5 animate-fade-in">
      <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-700 shadow-inner">
        <BookOpen className="w-7 h-7" />
      </div>
      <div className="space-y-2 max-w-md">
        <h3 className="text-xl font-bold text-stone-800 font-display">No footprints recorded yet</h3>
        <p className="text-sm text-stone-400 leading-relaxed">
          No Quranic sessions were logged for <span className="font-semibold text-emerald-800">{monthNames[month]} {year}</span>. Every milestone starts with a single verse.
        </p>
      </div>
      <div className="pt-2 text-xs text-stone-300 font-serif italic select-none">
        "Recite in the name of your Lord who created" (96:1)
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 font-display">Reading History</h1>
          <p className="text-gray-500 mt-1">Review your past Quranic checkpoints and statistics.</p>
        </div>
        
        {/* Navigation & Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Today Button */}
          <button 
            onClick={handleGoToToday}
            disabled={isCurrentMonth()}
            className={`p-2 px-3 text-xs font-bold rounded-xl border flex items-center gap-1.5 transition-all
              ${isCurrentMonth()
                ? "bg-stone-50 border-stone-100 text-stone-300 cursor-not-allowed"
                : "bg-white border-stone-200 text-stone-700 hover:bg-stone-50 hover:border-stone-300 cursor-pointer shadow-sm active:scale-95"
              }`}
            title="Go to current month"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Today
          </button>

          {/* Month Selector Buttons */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-stone-100 shadow-sm">
            <button onClick={handlePrevMonth} className="p-2 hover:bg-stone-50 rounded-lg text-gray-600 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold px-2 text-gray-700 min-w-[120px] text-center text-sm">
              {monthNames[month]} {year}
            </span>
            <button onClick={handleNextMonth} className="p-2 hover:bg-stone-50 rounded-lg text-gray-600 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* --- Monthly Stats Deck --- */}
      {loading ? (
        <StatSkeleton />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
          {/* Consistency card */}
          <div className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-800">
              <Target className="w-5.5 h-5.5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Consistency</p>
              <p className="text-xl font-bold text-gray-800 mt-0.5">{consistencyRate}%</p>
            </div>
          </div>

          {/* Unique Pages Card */}
          <div className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-11 h-11 bg-purple-50 rounded-xl flex items-center justify-center text-purple-700">
              <Trophy className="w-5.5 h-5.5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pages Read</p>
              <p className="text-xl font-bold text-gray-800 mt-0.5">{totalUniquePages}</p>
            </div>
          </div>

          {/* Primary Focus Card */}
          <div className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center text-blue-700">
              <Award className="w-5.5 h-5.5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Primary Focus</p>
              <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full border mt-1 ${focusColor}`}>
                {primaryFocus}
              </span>
            </div>
          </div>

          {/* Monthly Streak Card */}
          <div className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-11 h-11 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
              <Flame className="w-5.5 h-5.5 fill-current" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Month Streak</p>
              <p className="text-xl font-bold text-gray-800 mt-0.5">{maxStreak} {maxStreak === 1 ? "day" : "days"}</p>
            </div>
          </div>
        </div>
      )}

      {/* --- Main Dashboard Container with View Toggles --- */}
      {loading ? (
        <BoardSkeleton />
      ) : dbLogs.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-4 animate-fade-in">
          {/* Tabs Selector Navigation */}
          <div className="flex justify-between items-center bg-white p-2.5 rounded-2xl border border-stone-100 shadow-sm">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span className="text-xs font-bold text-stone-700">Log view mode</span>
            </div>

            <div className="flex p-0.5 bg-stone-100 rounded-xl shrink-0">
              <button 
                onClick={() => setActiveView('calendar')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer
                  ${activeView === 'calendar' 
                    ? "bg-white text-emerald-800 shadow-sm font-bold" 
                    : "text-stone-500 hover:text-stone-800"
                  }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" /> Grid Map
              </button>
              <button 
                onClick={() => setActiveView('timeline')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer
                  ${activeView === 'timeline' 
                    ? "bg-white text-emerald-800 shadow-sm font-bold" 
                    : "text-stone-500 hover:text-stone-800"
                  }`}
              >
                <List className="w-3.5 h-3.5" /> Timeline Feed
              </button>
            </div>
          </div>

          {/* View Render Area */}
          {activeView === 'calendar' ? (
            /* --- CALENDAR GRID VIEW --- */
            <div className="bg-white rounded-3xl border border-stone-100 p-6 shadow-sm">
              {/* Week Headers */}
              <div className="grid grid-cols-7 gap-2 mb-3 text-center text-xs font-extrabold text-stone-300 tracking-wider">
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
                          <button
                            onClick={() => handleTileClick(day)}
                            className={`w-full h-full rounded-2xl flex flex-col items-center justify-center font-bold border text-sm transition-all duration-300 relative ${getTileStyles(dayLogs)}`}
                          >
                            <span>{day}</span>
                            
                            {/* Session indicators (colored dots stacked) */}
                            {dayLogs.length > 0 && (
                              <div className="flex gap-1 mt-1 justify-center max-w-full overflow-hidden">
                                {dayLogs.slice(0, 3).map((log, i) => {
                                  let dotColor = "bg-emerald-500";
                                  if (log.type === "memorization") dotColor = "bg-amber-500 animate-pulse";
                                  if (log.type === "revision") dotColor = "bg-blue-500";
                                  return (
                                    <span key={log.id || i} className={`w-1.5 h-1.5 rounded-full ring-0.5 ring-white/10 ${dotColor}`} />
                                  );
                                })}
                                {dayLogs.length > 3 && (
                                  <span className="text-[8px] leading-none text-stone-400 font-extrabold">+</span>
                                )}
                              </div>
                            )}
                          </button>

                          {/* --- Pure CSS Interactive Hover Tooltip --- */}
                          {dayLogs.length > 0 && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 hidden group-hover:block z-30 bg-stone-900/95 backdrop-blur-md text-white text-xs p-3.5 rounded-2xl shadow-xl pointer-events-none transition-all duration-300 animate-fade-in">
                              {/* Tooltip arrow decoration */}
                              <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-stone-900/95" />
                              
                              {/* Date Heading */}
                              <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-2">
                                <span className="font-bold text-emerald-400">
                                  {dayNames[new Date(year, month, day).getDay()]}
                                </span>
                                <span className="text-[10px] text-stone-300 font-medium">
                                  {monthNames[month].slice(0, 3)} {day}, {year}
                                </span>
                              </div>

                              {/* Day log items details */}
                              <div className="space-y-2.5 max-h-[160px] overflow-y-auto pr-1">
                                {dayLogs.map((log, i) => (
                                  <div key={log.id || i} className="flex flex-col gap-0.5 border-l-2 border-emerald-500 pl-2">
                                    <div className="flex justify-between items-center">
                                      <span className="font-bold text-stone-100 text-[11px] truncate max-w-[120px]">{log.surahName}</span>
                                      <span className={`text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-md ${
                                        log.type === "memorization" 
                                          ? "text-amber-300 bg-amber-950/40"
                                          : log.type === "revision"
                                          ? "text-blue-300 bg-blue-950/40"
                                          : "text-emerald-300 bg-emerald-950/40"
                                      }`}>
                                        {log.type === "memorization" ? "Hifz" : log.type === "revision" ? "Muraja'ah" : "Tilawah"}
                                      </span>
                                    </div>
                                    <div className="text-[10px] text-stone-300 flex justify-between">
                                      <span>Page {log.quranPage}</span>
                                      {log.startAyat && log.endAyat ? (
                                        <span className="text-stone-400">Ayat {log.startAyat}-{log.endAyat}</span>
                                      ) : null}
                                    </div>
                                    {log.notes && (
                                      <p className="text-[9px] text-stone-400 italic truncate mt-0.5">"{log.notes}"</p>
                                    )}
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
            /* --- CHRONOLOGICAL TIMELINE TIMELINE FEED VIEW --- */
            <div className="relative before:absolute before:inset-y-0 before:left-5 before:w-0.5 before:bg-stone-100 py-3 space-y-4">
              {dbLogs.map((log, idx) => {
                const logDate = new Date(log.date);
                const dayName = dayNames[logDate.getDay()];
                const dayNum = logDate.getDate();

                let typeColor = "text-emerald-700 bg-emerald-50 border-emerald-100/60";
                let typeDot = "bg-emerald-600 ring-emerald-100";
                let label = "Tilawah";
                
                if (log.type === "memorization") {
                  typeColor = "text-amber-700 bg-amber-50 border-amber-100/60";
                  typeDot = "bg-amber-500 ring-amber-100";
                  label = "Hifz";
                } else if (log.type === "revision") {
                  typeColor = "text-blue-700 bg-blue-50 border-blue-100/60";
                  typeDot = "bg-blue-500 ring-blue-100";
                  label = "Muraja'ah";
                }

                return (
                  <div key={log.id || idx} className="relative pl-12 group">
                    {/* Timeline Dot */}
                    <div className={`absolute left-2.5 top-3 w-5 h-5 rounded-full border-2 border-white ring-4 ${typeDot} z-10 transition-transform duration-300 group-hover:scale-125`} />
                    
                    {/* Log details Card */}
                    <div 
                      onClick={() => {
                        setSelectedLog(log);
                        setIsModalOpen(true);
                      }}
                      className="bg-white hover:bg-stone-50/40 p-5 rounded-3xl border border-stone-100/80 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2.5">
                          <span className={`text-[9px] uppercase font-extrabold tracking-widest px-2.5 py-0.5 rounded-full border ${typeColor}`}>
                            {label}
                          </span>
                          <span className="text-xs text-stone-400 font-medium">
                            {dayName}, {monthNames[month]} {dayNum}
                          </span>
                        </div>
                        
                        <h3 className="text-lg font-bold text-stone-800 font-display pt-0.5">
                          Surah {log.surahName}
                        </h3>
                        
                        <div className="flex items-center gap-4 text-xs font-semibold text-stone-500">
                          <span className="flex items-center gap-1.5">
                            <BookOpen className="w-4 h-4 text-stone-400" /> Page {log.quranPage}
                          </span>
                          {log.startAyat && log.endAyat ? (
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4 text-stone-400" /> Ayat {log.startAyat} - {log.endAyat}
                            </span>
                          ) : null}
                        </div>

                        {log.notes && (
                          <div className="bg-stone-50/60 p-2.5 px-3 rounded-xl border border-stone-100/60 mt-2 text-xs text-stone-400 leading-relaxed italic max-w-2xl">
                            "{log.notes}"
                          </div>
                        )}
                      </div>
                      
                      <button className="text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 px-3.5 py-2 rounded-xl border border-emerald-100/30 transition-colors self-end sm:self-center shrink-0">
                        Open Details
                      </button>
                    </div>
                  </div>
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
    </div>
  );
}