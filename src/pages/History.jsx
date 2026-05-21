import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, BookOpen, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import LogModal from '../components/LogModal';
// Import your dynamic month query fetcher
import { getLogsByMonth } from '../firebase/logService';

// 1. FIXED: Accept the user prop passed down from App.jsx
export default function History({ user }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dbLogs, setDbLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

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
      setLoading(false);
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

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Maps calendar grid indexes back to a corresponding firestore entry
  const getLogForDay = (dayNum) => {
    if (!dayNum) return null;
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    return dbLogs.find(log => log.date === dateString) || null;
  };

  const handleTileClick = (dayNum) => {
    const log = getLogForDay(dayNum);
    if (log) {
      setSelectedLog(log);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 font-display">Reading History</h1>
          <p className="text-gray-500 mt-1">Review your past memorization checkpoints.</p>
        </div>
        
        {/* Month Selector Buttons */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-gray-100 shadow-sm">
          <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-50 rounded-lg text-gray-600 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-semibold px-2 text-gray-700 min-w-[120px] text-center">
            {monthNames[month]} {year}
          </span>
          <button onClick={handleNextMonth} className="p-2 hover:bg-gray-50 rounded-lg text-gray-600 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Calendar Card View */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-gray-400 font-medium animate-pulse">
            Syncing collection logs with Firestore...
          </div>
        ) : (
          <>
            {/* Days of the Week labels */}
            <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-gray-400 tracking-wider">
              {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map(d => <div key={d} className="py-1">{d}</div>)}
            </div>

            {/* Grid Days */}
            <div className="grid grid-cols-7 gap-2 sm:gap-3">
              {totalSlots.map((day, idx) => {
                const associatedLog = getLogForDay(day);
                return (
                  <div key={idx} className="aspect-square relative">
                    {day && (
                      <button
                        onClick={() => handleTileClick(day)}
                        className={`w-full h-full rounded-xl flex flex-col items-center justify-center font-semibold border text-sm transition-all
                          ${associatedLog 
                            ? 'bg-emerald-50 border-emerald-100 text-emerald-800 hover:bg-emerald-100' 
                            : 'bg-gray-50/50 border-gray-100 text-gray-600 hover:bg-gray-50 hover:border-gray-200'
                          }`}
                      >
                        <span>{day}</span>
                        {/* Dot Indicator */}
                        {associatedLog && (
                          <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-1"></span>
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

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