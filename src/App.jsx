import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

// --- Page Placeholders ---
// Replace these with your actual page components
const Dashboard = () => (
  <div className="flex flex-col gap-2 p-6">
    <h1 className="text-2xl font-semibold text-emerald-900 font-display">Dashboard</h1>
    <p className="text-stone-500 text-sm">Track your daily Quran memorization and reading progress.</p>
  </div>
);

const History = () => (
  <div className="flex flex-col gap-2 p-6">
    <h1 className="text-2xl font-semibold text-emerald-900 font-display">History</h1>
    <p className="text-stone-500 text-sm">Review your past sessions and milestones.</p>
  </div>
);

const Profile = () => (
  <div className="flex flex-col gap-2 p-6">
    <h1 className="text-2xl font-semibold text-emerald-900 font-display">Profile</h1>
    <p className="text-stone-500 text-sm">Manage your account and preferences.</p>
  </div>
);
// --- End Page Placeholders ---

export default function App() {
  return (
    <BrowserRouter>
      {/*
       * Layout shell:
       *  - md+: sidebar (64px wide) + scrollable main content area
       *  - mobile: full-width main content + fixed bottom nav bar
       */}
      <div className="min-h-screen bg-stone-50 flex flex-col md:flex-row">
        <Navbar />

        {/* Main content — offset by sidebar on desktop, offset by bottom nav on mobile */}
        <main className="flex-1 pb-20 md:pb-0 md:ml-64 min-h-screen">
          {/* Subtle decorative header stripe */}
          <div className="h-1 w-full bg-gradient-to-r from-emerald-800 via-emerald-600 to-emerald-400 opacity-80" />

          <div className="max-w-4xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/history" element={<History />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}