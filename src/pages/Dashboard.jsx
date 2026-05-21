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

      {/* Log Form Area — Inject the authentic user login ID */}
      <div className="pt-2">
        <LogForm userId={user?.uid} />
      </div>
    </div>
  );
}