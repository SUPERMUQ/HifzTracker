import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
      <div className="min-h-screen bg-stone-50 flex items-center justify-center text-emerald-800 font-semibold animate-pulse">
        Verifying user session...
      </div>
    );
  }

  // Fallback Profile Page Component with a Log Out action button
  const Profile = () => (
    <div className="flex flex-col gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm max-w-xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-emerald-900">Profile Settings</h1>
        <p className="text-stone-500 text-sm mt-1">Logged in securely as:</p>
        <p className="text-gray-800 font-mono mt-1 text-sm bg-gray-50 p-2.5 rounded-lg border border-gray-200">{user?.email}</p>
      </div>
      <button 
        onClick={() => logoutUser()}
        className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-xl shadow-sm transition-colors text-sm"
      >
        Sign Out of Account
      </button>
    </div>
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
      <div className="min-h-screen bg-stone-50 flex flex-col md:flex-row">
        <Navbar />
        <main className="flex-1 pb-20 md:pb-0 md:ml-64 min-h-screen">
          <div className="h-1 w-full bg-gradient-to-r from-emerald-800 via-emerald-600 to-emerald-400 opacity-80" />
          <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
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