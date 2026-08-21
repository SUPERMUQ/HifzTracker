import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signUpUser, loginUser } from '../firebase/authService';
import { ShieldCheck, Lock, Mail, Sparkles } from 'lucide-react';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isSignUp) {
        await signUpUser(email, password);
      } else {
        await loginUser(email, password);
      }
    } catch (err) {
      setErrorMsg(err.message.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Dot Grid */}
      <div className="absolute inset-0 bg-dot-grid pointer-events-none opacity-40" />

      {/* SOTD Glow Orbs */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-[#0c0c12]/90 rounded-3xl shadow-2xl p-8 sm:p-9 border border-white/[0.1] backdrop-blur-2xl relative z-10 overflow-hidden"
      >
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-8 space-y-3">
          <div className="w-14 h-14 bg-gradient-to-tr from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto text-emerald-400 shadow-xl">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white font-display tracking-tight">
              {isSignUp ? "Create Hifz Profile" : "Welcome Back"}
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              {isSignUp ? "Register an account to securely save your logs" : "Sign in to resume your Quran memorization journey"}
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-5 p-3.5 bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono rounded-2xl"
            >
              {errorMsg}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleAuthSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-mono font-semibold text-zinc-400 uppercase tracking-widest mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-11 pr-4 py-3 bg-[#121218] border border-white/[0.08] rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 text-sm text-white placeholder-zinc-500 transition-all font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono font-semibold text-zinc-400 uppercase tracking-widest mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-[#121218] border border-white/[0.08] rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 text-sm text-white placeholder-zinc-500 transition-all font-sans"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.96 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:from-emerald-600 active:to-teal-600 disabled:opacity-50 text-emerald-950 font-extrabold py-3.5 px-4 rounded-2xl shadow-xl shadow-emerald-950/50 transition-all text-sm mt-3 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 fill-emerald-950" />
            {loading ? "Processing account..." : isSignUp ? "Create Account" : "Sign In to Dashboard"}
          </motion.button>
        </form>

        <div className="text-center mt-6 pt-6 border-t border-white/[0.06]">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrorMsg('');
            }}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 hover:underline transition-colors cursor-pointer"
          >
            {isSignUp ? "Already have an account? Sign In" : "Don't have an account yet? Sign Up"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}