import React, { useState } from 'react';
import { signUpUser, loginUser } from '../firebase/authService';
import { ShieldCheck, Lock, Mail } from 'lucide-react';

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
      // Formats Firebase auth messages to be readable
      setErrorMsg(err.message.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-stone-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-emerald-700/10">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto text-emerald-800 shadow-inner mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 font-display">
            {isSignUp ? "Create Hifz Profile" : "Welcome Back"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {isSignUp ? "Register an account to securely save your logs" : "Sign in to resume your memorization journey"}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-xl">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleAuthSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all text-sm text-gray-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all text-sm text-gray-800"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-800 hover:bg-emerald-900 disabled:bg-emerald-600 text-white font-semibold py-3.5 px-4 rounded-xl shadow-md transition-colors text-sm mt-2"
          >
            {loading ? "Processing account..." : isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <div className="text-center mt-6 pt-6 border-t border-gray-100">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrorMsg('');
            }}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 hover:underline transition-colors"
          >
            {isSignUp ? "Already have an account? Sign In" : "Don't have an account yet? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}