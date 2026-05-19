import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

// We import your actual page components here
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";

// A quick temporary fallback for the Profile page
const Profile = () => (
  <div className="p-6 max-w-4xl mx-auto">
    <h1 className="text-3xl font-bold text-gray-800">Profile Settings</h1>
    <p className="text-gray-500 mt-1">Manage your goals and account customization details here.</p>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      {/* This wrapper layout keeps the Navbar fixed on the side (desktop) 
        or bottom (mobile) while letting our pages scroll beautifully.
      */}
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
        <Navbar />
        
        {/* Main Content View Area */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 pb-24 md:pb-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/history" element={<History />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}