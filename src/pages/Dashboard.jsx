import React from 'react';
import LogForm from '../components/LogForm';
import { Trophy, Calendar, Target, Flame } from 'lucide-react';

// Accept the user object from App.jsx
export default function Dashboard({ user }) {
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 font-display">Assalamu Alaikum,</h1>
        <p className="text-gray-500 mt-1">Track your daily progress and protect your streak.</p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-800">
            <Flame className="w-6 h-6 fill-current" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Current Streak</p>
            <p className="text-2xl font-bold text-gray-800">5 Days</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Pages</p>
            <p className="text-2xl font-bold text-gray-800">42</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Monthly Goal</p>
            <p className="text-2xl font-bold text-gray-800">80%</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sessions</p>
            <p className="text-2xl font-bold text-gray-800">18</p>
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