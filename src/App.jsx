import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, User as UserIcon, Shield, Mail, Sparkles } from "lucide-react";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import AuthPage from "./pages/AuthPage";
import LandingPage from "./pages/LandingPage";
import { subscribeToAuthChanges, logoutUser } from "./firebase/authService";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if a user session already exists when the app opens
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-zinc-300 font-sans relative overflow-hidden">
        {/* Background Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-5 z-10"
        >
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.2)]">
              <Sparkles className="w-8 h-8 text-emerald-400 animate-pulse" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm font-medium tracking-wide text-zinc-300">Initializing Hifz Tracker</p>
            <p className="text-[11px] font-mono uppercase tracking-widest text-zinc-600">Verifying Session...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Fallback Profile Page Component with a Log Out action button
  const Profile = () => (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-xl mx-auto space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight font-display">Account Settings</h1>
          <p className="text-zinc-400 text-xs mt-1">Manage your active session and preferences.</p>
        </div>
        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[10px] font-mono uppercase tracking-widest flex items-center gap-1.5">
          <Shield className="w-3 h-3" /> Protected
        </span>
      </div>

      <div className="p-6 rounded-3xl bg-[#0d0d12]/90 border border-white/[0.08] shadow-2xl backdrop-blur-xl space-y-6 relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <UserIcon className="w-7 h-7" />
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Logged in as</p>
            <p className="text-white font-medium text-base mt-0.5">{user?.email}</p>
          </div>
        </div>

        <div className="pt-4 border-t border-white/[0.06] space-y-4">
          <div className="flex items-center justify-between text-xs text-zinc-400 bg-[#121218] p-3.5 rounded-xl border border-white/[0.04]">
            <span className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-zinc-500" /> Authentication Provider
            </span>
            <span className="font-mono text-zinc-300">Firebase Auth</span>
          </div>

          <motion.button 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => logoutUser()}
            className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-semibold py-3 px-4 rounded-2xl transition-all text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-950/20"
          >
            <LogOut className="w-4 h-4" /> Sign Out of Account
          </motion.button>
        </div>
      </div>
    </motion.div>
  );

  // Unauthenticated Routes
  if (!user) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    );
  }

  // Authenticated Routes
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col md:flex-row font-sans relative selection:bg-emerald-500/30 selection:text-emerald-200">
        {/* Subtle Ambient Dot Grid */}
        <div className="fixed inset-0 bg-dot-grid pointer-events-none opacity-40" />

        {/* Global Ambient Glow */}
        <div className="fixed top-0 left-1/3 w-[600px] h-[400px] bg-emerald-500/[0.04] rounded-full blur-[140px] pointer-events-none" />
        <div className="fixed bottom-0 right-1/4 w-[500px] h-[350px] bg-teal-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

        <Navbar />

        <main className="flex-1 pb-24 md:pb-8 md:ml-64 min-h-screen relative z-10">
          {/* SOTD Glowing top accent line */}
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent opacity-80" />

          <div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-8 lg:p-10">
            <Routes>
              <Route path="/" element={<Dashboard user={user} />} />
              <Route path="/history" element={<History user={user} />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}