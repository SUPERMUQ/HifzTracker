import React, { useState } from 'react';
import { BookOpen, CheckCircle } from 'lucide-react';
// Import your database helper service
import { addReadingLog } from '../firebase/logService';

// Update the function parameter line to accept userId
export default function LogForm({ userId })  {
  const [formData, setFormData] = useState({
    type: 'Hifz',
    quranPage: '',
    surahName: '',
    startAyat: '',
    endAyat: '',
    notes: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Format today's date cleanly as YYYY-MM-DD for storage
    const todayStr = new Date().toISOString().split('T')[0];
    
    // Map your UI dropdown types to match the exact string keywords backend expects
    let dbType = "reading";
    if (formData.type === "Hifz") {
      dbType = "memorization";
    } else if (formData.type === "Muraja'ah") {
      dbType = "revision";
    } else if (formData.type === "Tilawah") {
      dbType = "reading";
    }
    
    // Prepare data structure perfectly matching database schema
    const logPayload = {
      date: todayStr,
      quranPage: Number(formData.quranPage),
      surahName: formData.surahName,
      startAyat: Number(formData.startAyat),
      endAyat: Number(formData.endAyat),
      type: dbType, // Passes the correctly mapped backend string validation filter
      notes: formData.notes
    };

    try {
  // Pass the real authenticated user UID straight to your logService handler!
  await addReadingLog(userId, logPayload);
      
      setShowSuccess(true);
      setFormData({
        type: 'Hifz',
        quranPage: '',
        surahName: '',
        startAyat: '',
        endAyat: '',
        notes: ''
      });
      setTimeout(() => setShowSuccess(false), 4000);
    } catch (error) {
      console.error("Error writing log entry to Firebase:", error);
      alert("Failed to save progress. Please double check that your Firestore security rules are set to test mode.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-xl bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Log Your Session</h2>
        <p className="text-sm text-gray-500 mt-1">Record your daily progress to maintain your streak.</p>
      </div>

      {showSuccess && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-3 animate-fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span className="text-sm font-medium">Progress successfully logged to Firestore! Keep up the amazing work.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Reading Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Reading Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all text-gray-800 font-medium"
          >
            <option value="Hifz">Hifz (New Memorization)</option>
            <option value="Muraja'ah">Muraja'ah (Revision)</option>
            <option value="Tilawah">Tilawah (Normal Reading)</option>
          </select>
        </div>

        {/* Page & Surah Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Quran Page</label>
            <input
              type="number"
              name="quranPage"
              value={formData.quranPage}
              onChange={handleChange}
              placeholder="e.g. 45"
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all text-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Surah Name</label>
            <input
              type="text"
              name="surahName"
              value={formData.surahName}
              onChange={handleChange}
              placeholder="e.g. Al-Baqarah"
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all text-gray-800"
            />
          </div>
        </div>

        {/* Ayat Range Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Start Ayat</label>
            <input
              type="number"
              name="startAyat"
              value={formData.startAyat}
              onChange={handleChange}
              placeholder="From"
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all text-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">End Ayat</label>
            <input
              type="number"
              name="endAyat"
              value={formData.endAyat}
              onChange={handleChange}
              placeholder="To"
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all text-gray-800"
            />
          </div>
        </div>

        {/* Personal Notes */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Personal Notes <span className="text-gray-400 font-normal">(Optional)</span></label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            placeholder="Reflections on today's reading..."
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all text-gray-800 resize-none"
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-emerald-800 hover:bg-emerald-900 disabled:bg-emerald-600 text-white font-semibold py-3.5 px-4 rounded-xl shadow-md transition-colors duration-200 flex items-center justify-center gap-2 mt-2"
        >
          <BookOpen className="w-5 h-5" />
          {isSubmitting ? "Logging progress..." : "Log Today's Progress"}
        </button>
      </form>
    </div>
  );
}