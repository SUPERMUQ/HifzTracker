import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, LineChart, ShieldCheck, ArrowRight, Star, Sparkles, Flame, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-200 overflow-hidden relative">
      {/* Background Dot Grid */}
      <div className="absolute inset-0 bg-dot-grid pointer-events-none opacity-40" />

      {/* SOTD Ambient Glow Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 left-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-[140px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-1/4 w-96 h-96 bg-teal-500 rounded-full blur-[140px]" 
        />
      </div>

      {/* Top Navigation */}
      <nav className="fixed w-full z-50 transition-all duration-300 bg-[#07070b]/80 backdrop-blur-2xl border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-tr from-emerald-500/20 to-teal-500/10 p-2.5 rounded-2xl border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                <BookOpen className="h-6 w-6 text-emerald-400" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white font-display">
                Hifz <span className="text-emerald-400 font-normal">Tracker</span>
              </span>
            </div>

            {/* Auth CTAs */}
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-zinc-400 hover:text-white font-medium transition-colors text-sm px-3 py-2">
                Sign In
              </Link>
              <Link to="/login">
                <motion.button 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-emerald-950 px-6 py-2.5 rounded-2xl font-extrabold text-sm shadow-xl shadow-emerald-950/40 cursor-pointer"
                >
                  Get Started Free
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 lg:pt-48 lg:pb-32 px-4 z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-xs"
          >
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span>Award-Winning Standard for Quran Memorization</span>
          </motion.div>
          
          {/* Main Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl lg:text-7xl font-extrabold tracking-tight text-white font-display leading-none"
          >
            Master Your <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-200">
              Hifz Journey
            </span>
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg lg:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed"
          >
            A high-discipline, obsidian-dark tracking system engineered for Quran memorization students. Stay consistent, visualize your progress, and protect your streak.
          </motion.p>
          
          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4"
          >
            <Link to="/login">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                className="group flex items-center justify-center gap-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-emerald-950 px-8 py-4 rounded-2xl font-extrabold text-base shadow-2xl shadow-emerald-950/50 cursor-pointer"
              >
                <span>Launch Your Tracker</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Floating Mockup Preview Card */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl mx-auto mt-16 p-4 rounded-3xl bg-[#0c0c12]/90 border border-white/[0.1] shadow-2xl backdrop-blur-2xl relative"
        >
          <div className="flex items-center gap-2 pb-4 border-b border-white/[0.06] px-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="ml-4 text-xs font-mono text-zinc-500">hifz-tracker.app</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="bg-[#121218] p-5 rounded-2xl border border-white/[0.06] flex items-center gap-3">
              <Flame className="w-8 h-8 text-emerald-400" />
              <div>
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Active Streak</p>
                <p className="text-xl font-bold text-white font-display">14 Consecutive Days</p>
              </div>
            </div>
            <div className="bg-[#121218] p-5 rounded-2xl border border-white/[0.06] flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-amber-400" />
              <div>
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Surah Al-Baqarah</p>
                <p className="text-xl font-bold text-white font-display">Ayat 1 – 141 (Juz 1)</p>
              </div>
            </div>
            <div className="bg-[#121218] p-5 rounded-2xl border border-white/[0.06] flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Monthly Goal</p>
                <p className="text-xl font-bold text-white font-display">94% Completion</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Bento Grid Section */}
      <section className="py-24 bg-[#08080c] border-t border-white/[0.06] relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-white font-display tracking-tight">Built for SOTD Excellence</h2>
            <p className="text-zinc-400 max-w-xl mx-auto text-sm">Every element designed to simplify daily Quran revision and memorization logging.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div 
              whileHover={{ y: -6, transition: { type: "spring", stiffness: 400, damping: 25 } }}
              className="p-8 rounded-3xl bg-[#0c0c12]/90 border border-white/[0.08] hover:border-emerald-500/30 transition-all duration-300 relative overflow-hidden group shadow-xl"
            >
              <div className="w-14 h-14 bg-gradient-to-tr from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-white font-display mb-3">Structured Logging</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Log Sabaq (Hifz), Sabaqi (Revision), and Manzil (Reading) in seconds with instant Surah lookup and page autocompletion.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              whileHover={{ y: -6, transition: { type: "spring", stiffness: 400, damping: 25 } }}
              className="p-8 rounded-3xl bg-[#0c0c12]/90 border border-white/[0.08] hover:border-teal-500/30 transition-all duration-300 relative overflow-hidden group shadow-xl"
            >
              <div className="w-14 h-14 bg-gradient-to-tr from-teal-500/20 to-cyan-500/10 border border-teal-500/30 rounded-2xl flex items-center justify-center text-teal-400 mb-6 group-hover:scale-110 transition-transform">
                <LineChart className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-white font-display mb-3">Visual Heatmaps</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Review your monthly activity with interactive grid heatmaps and chronological timeline feeds.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              whileHover={{ y: -6, transition: { type: "spring", stiffness: 400, damping: 25 } }}
              className="p-8 rounded-3xl bg-[#0c0c12]/90 border border-white/[0.08] hover:border-amber-500/30 transition-all duration-300 relative overflow-hidden group shadow-xl"
            >
              <div className="w-14 h-14 bg-gradient-to-tr from-amber-500/20 to-yellow-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-white font-display mb-3">Firebase Protected</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Your memorization history is encrypted and synced across all your desktop and mobile browsers via Firebase Auth.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24 relative overflow-hidden border-t border-white/[0.06] bg-[#050505]">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10 space-y-6">
          <h2 className="text-4xl font-extrabold text-white font-display tracking-tight">Ready to elevate your Quran memorization?</h2>
          <p className="text-zinc-400 text-base max-w-xl mx-auto">Create your free account today and build lifelong consistency.</p>
          <Link to="/login" className="inline-block pt-2">
            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-emerald-950 px-8 py-4 rounded-2xl font-extrabold text-lg shadow-2xl shadow-emerald-950/50 cursor-pointer"
            >
              Create Account
            </motion.button>
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-[#030305] py-8 text-center text-zinc-600 text-xs border-t border-white/[0.04] font-mono">
        <p>&copy; {new Date().getFullYear()} Hifz Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
}

