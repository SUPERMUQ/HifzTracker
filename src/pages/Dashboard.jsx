import React, { useState, useEffect } from 'react';
import LogForm from '../components/LogForm';
import { Trophy, Calendar, Target, Flame } from 'lucide-react';
import { subscribeToUserLogs } from '../firebase/logService';

// Accept the user object from App.jsx
export default function Dashboard({ user }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;
    const unsubscribe = subscribeToUserLogs(user.uid, (data) => {
      setLogs(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user?.uid]);

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
      return <div className="h-8 w-16 bg-gray-100 rounded-lg animate-pulse mt-1" />;
    }
    return <p className="text-2xl font-bold text-gray-800">{val}{suffix}</p>;
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 font-display">Assalamu Alaikum,</h1>
        <p className="text-gray-500 mt-1">Track your daily progress and protect your streak.</p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Current Streak */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-800">
            <Flame className="w-6 h-6 fill-current" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Current Streak</p>
            {renderStatValue(streak, streak === 1 ? " Day" : " Days")}
          </div>
        </div>

        {/* Total Pages */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Pages</p>
            {renderStatValue(totalPages)}
          </div>
        </div>

        {/* Monthly Goal */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Monthly Goal</p>
            {renderStatValue(monthlyGoal, "%")}
          </div>
        </div>

        {/* Sessions */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sessions</p>
            {renderStatValue(sessions)}
          </div>
        </div>
      </div>

      {/* Session Type Breakdown Visual Component */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold text-gray-800 font-display">Session Type Distribution</h2>
          <p className="text-xs text-gray-400 mt-0.5">Visual breakdown of your Quranic engagement types</p>
        </div>

        {loading ? (
          <div className="space-y-4">
            <div className="h-4 bg-gray-100 rounded-full animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="h-16 bg-gray-50 border border-gray-100/50 rounded-xl animate-pulse" />
              <div className="h-16 bg-gray-50 border border-gray-100/50 rounded-xl animate-pulse" />
              <div className="h-16 bg-gray-50 border border-gray-100/50 rounded-xl animate-pulse" />
            </div>
          </div>
        ) : sessions === 0 ? (
          <div className="py-8 text-center text-gray-400 text-sm font-medium animate-fade-in">
            No session logs available. Start logging to see your distribution!
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            {/* Stacked Progress Bar */}
            <div className="w-full h-4 bg-gray-100/80 rounded-full overflow-hidden flex shadow-inner">
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
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Hifz</p>
                    <p className="text-sm font-semibold text-gray-400 mt-0.5">Memorization</p>
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
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Muraja'ah</p>
                    <p className="text-sm font-semibold text-gray-400 mt-0.5">Revision</p>
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
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tilawah</p>
                    <p className="text-sm font-semibold text-gray-400 mt-0.5">Reading</p>
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

      {/* Log Form Area — Inject the authentic user login ID */}
      <div className="pt-2">
        <LogForm userId={user?.uid} />
      </div>
    </div>
  );
}