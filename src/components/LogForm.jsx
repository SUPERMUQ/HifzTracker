import React, { useState, useMemo } from 'react';
import { BookOpen, CheckCircle } from 'lucide-react';
import { addReadingLog } from '../firebase/logService';

// Master Database including exact Ayah counts and Madani starting pages
const SURAHS = [
  { id: 1, name: "1. Al-Fatihah", ayahs: 7, page: 1 }, { id: 2, name: "2. Al-Baqarah", ayahs: 286, page: 2 },
  { id: 3, name: "3. Ali 'Imran", ayahs: 200, page: 50 }, { id: 4, name: "4. An-Nisa", ayahs: 176, page: 77 },
  { id: 5, name: "5. Al-Ma'idah", ayahs: 120, page: 106 }, { id: 6, name: "6. Al-An'am", ayahs: 165, page: 128 },
  { id: 7, name: "7. Al-A'raf", ayahs: 206, page: 151 }, { id: 8, name: "8. Al-Anfal", ayahs: 75, page: 177 },
  { id: 9, name: "9. At-Tawbah", ayahs: 129, page: 187 }, { id: 10, name: "10. Yunus", ayahs: 109, page: 208 },
  { id: 11, name: "11. Hud", ayahs: 123, page: 221 }, { id: 12, name: "12. Yusuf", ayahs: 111, page: 235 },
  { id: 13, name: "13. Ar-Ra'd", ayahs: 43, page: 249 }, { id: 14, name: "14. Ibrahim", ayahs: 52, page: 255 },
  { id: 15, name: "15. Al-Hijr", ayahs: 99, page: 262 }, { id: 16, name: "16. An-Nahl", ayahs: 128, page: 267 },
  { id: 17, name: "17. Al-Isra", ayahs: 111, page: 282 }, { id: 18, name: "18. Al-Kahf", ayahs: 110, page: 293 },
  { id: 19, name: "19. Maryam", ayahs: 98, page: 305 }, { id: 20, name: "20. Taha", ayahs: 135, page: 312 },
  { id: 21, name: "21. Al-Anbiya", ayahs: 112, page: 322 }, { id: 22, name: "22. Al-Hajj", ayahs: 78, page: 332 },
  { id: 23, name: "23. Al-Mu'minun", ayahs: 118, page: 342 }, { id: 24, name: "24. An-Nur", ayahs: 64, page: 350 },
  { id: 25, name: "25. Al-Furqan", ayahs: 77, page: 359 }, { id: 26, name: "26. Ash-Shu'ara", ayahs: 227, page: 367 },
  { id: 27, name: "27. An-Naml", ayahs: 93, page: 377 }, { id: 28, name: "28. Al-Qasas", ayahs: 88, page: 385 },
  { id: 29, name: "29. Al-'Ankabut", ayahs: 69, page: 396 }, { id: 30, name: "30. Ar-Rum", ayahs: 60, page: 404 },
  { id: 31, name: "31. Luqman", ayahs: 34, page: 411 }, { id: 32, name: "32. As-Sajdah", ayahs: 30, page: 415 },
  { id: 33, name: "33. Al-Ahzab", ayahs: 73, page: 418 }, { id: 34, name: "34. Saba", ayahs: 54, page: 428 },
  { id: 35, name: "35. Fatir", ayahs: 45, page: 434 }, { id: 36, name: "36. Ya-Sin", ayahs: 83, page: 440 },
  { id: 37, name: "37. As-Saffat", ayahs: 182, page: 446 }, { id: 38, name: "38. Sad", ayahs: 88, page: 453 },
  { id: 39, name: "39. Az-Zumar", ayahs: 75, page: 458 }, { id: 40, name: "40. Ghafir", ayahs: 85, page: 467 },
  { id: 41, name: "41. Fussilat", ayahs: 54, page: 477 }, { id: 42, name: "42. Ash-Shura", ayahs: 53, page: 483 },
  { id: 43, name: "43. Az-Zukhruf", ayahs: 89, page: 489 }, { id: 44, name: "44. Ad-Dukhan", ayahs: 59, page: 496 },
  { id: 45, name: "45. Al-Jathiyah", ayahs: 37, page: 499 }, { id: 46, name: "46. Al-Ahqaf", ayahs: 35, page: 502 },
  { id: 47, name: "47. Muhammad", ayahs: 38, page: 507 }, { id: 48, name: "48. Al-Fath", ayahs: 29, page: 511 },
  { id: 49, name: "49. Al-Hujurat", ayahs: 18, page: 515 }, { id: 50, name: "50. Qaf", ayahs: 45, page: 518 },
  { id: 51, name: "51. Ad-Dhariyat", ayahs: 60, page: 520 }, { id: 52, name: "52. At-Tur", ayahs: 49, page: 523 },
  { id: 53, name: "53. An-Najm", ayahs: 62, page: 526 }, { id: 54, name: "54. Al-Qamar", ayahs: 55, page: 528 },
  { id: 55, name: "55. Ar-Rahman", ayahs: 78, page: 531 }, { id: 56, name: "56. Al-Waqi'ah", ayahs: 96, page: 534 },
  { id: 57, name: "57. Al-Hadid", ayahs: 29, page: 537 }, { id: 58, name: "58. Al-Mujadila", ayahs: 22, page: 542 },
  { id: 59, name: "59. Al-Hashr", ayahs: 24, page: 545 }, { id: 60, name: "60. Al-Mumtahanah", ayahs: 13, page: 549 },
  { id: 61, name: "61. As-Saff", ayahs: 14, page: 551 }, { id: 62, name: "62. Al-Jumu'ah", ayahs: 11, page: 553 },
  { id: 63, name: "63. Al-Munafiqun", ayahs: 11, page: 554 }, { id: 64, name: "64. At-Taghabun", ayahs: 18, page: 556 },
  { id: 65, name: "65. At-Talaq", ayahs: 12, page: 558 }, { id: 66, name: "66. At-Tahrim", ayahs: 12, page: 560 },
  { id: 67, name: "67. Al-Mulk", ayahs: 30, page: 562 }, { id: 68, name: "68. Al-Qalam", ayahs: 52, page: 564 },
  { id: 69, name: "69. Al-Haqqah", ayahs: 52, page: 566 }, { id: 70, name: "70. Al-Ma'arij", ayahs: 44, page: 568 },
  { id: 71, name: "71. Nuh", ayahs: 28, page: 570 }, { id: 72, name: "72. Al-Jinn", ayahs: 28, page: 572 },
  { id: 73, name: "73. Al-Muzzammil", ayahs: 20, page: 574 }, { id: 74, name: "74. Al-Muddaththir", ayahs: 56, page: 575 },
  { id: 75, name: "75. Al-Qiyamah", ayahs: 40, page: 577 }, { id: 76, name: "76. Al-Insan", ayahs: 31, page: 578 },
  { id: 77, name: "77. Al-Mursalat", ayahs: 50, page: 580 }, { id: 78, name: "78. An-Naba", ayahs: 40, page: 582 },
  { id: 79, name: "79. An-Nazi'at", ayahs: 46, page: 583 }, { id: 80, name: "80. 'Abasa", ayahs: 42, page: 585 },
  { id: 81, name: "81. At-Takwir", ayahs: 29, page: 586 }, { id: 82, name: "82. Al-Infitar", ayahs: 19, page: 587 },
  { id: 83, name: "83. Al-Mutaffifin", ayahs: 36, page: 587 }, { id: 84, name: "84. Al-Inshiqaq", ayahs: 25, page: 589 },
  { id: 85, name: "85. Al-Buruj", ayahs: 22, page: 590 }, { id: 86, name: "86. At-Tariq", ayahs: 17, page: 591 },
  { id: 87, name: "87. Al-A'la", ayahs: 19, page: 591 }, { id: 88, name: "88. Al-Ghashiyah", ayahs: 26, page: 592 },
  { id: 89, name: "89. Al-Fajr", ayahs: 30, page: 593 }, { id: 90, name: "90. Al-Balad", ayahs: 20, page: 594 },
  { id: 91, name: "91. Ash-Shams", ayahs: 15, page: 595 }, { id: 92, name: "92. Al-Lail", ayahs: 21, page: 595 },
  { id: 93, name: "93. Ad-Duhaa", ayahs: 11, page: 596 }, { id: 94, name: "94. Ash-Sharh", ayahs: 8, page: 596 },
  { id: 95, name: "95. At-Tin", ayahs: 8, page: 597 }, { id: 96, name: "96. Al-'Alaq", ayahs: 19, page: 597 },
  { id: 97, name: "97. Al-Qadr", ayahs: 5, page: 598 }, { id: 98, name: "98. Al-Bayyinah", ayahs: 8, page: 598 },
  { id: 99, name: "99. Az-Zalzalah", ayahs: 8, page: 599 }, { id: 100, name: "100. Al-'Adiyat", ayahs: 11, page: 599 },
  { id: 101, name: "101. Al-Qari'ah", ayahs: 11, page: 600 }, { id: 102, name: "102. At-Takathur", ayahs: 8, page: 600 },
  { id: 103, name: "103. Al-'Asr", ayahs: 3, page: 601 }, { id: 104, name: "104. Al-Humazah", ayahs: 9, page: 601 },
  { id: 105, name: "105. Al-Fil", ayahs: 5, page: 601 }, { id: 106, name: "106. Quraish", ayahs: 4, page: 602 },
  { id: 107, name: "107. Al-Ma'un", ayahs: 7, page: 602 }, { id: 108, name: "108. Al-Kawthar", ayahs: 3, page: 602 },
  { id: 109, name: "109. Al-Kafirun", ayahs: 6, page: 603 }, { id: 110, name: "110. An-Nasr", ayahs: 3, page: 603 },
  { id: 111, name: "111. Al-Masad", ayahs: 5, page: 603 }, { id: 112, name: "112. Al-Ikhlas", ayahs: 4, page: 604 },
  { id: 113, name: "113. Al-Falaq", ayahs: 5, page: 604 }, { id: 114, name: "114. An-Nas", ayahs: 6, page: 604 }
];

export default function LogForm({ userId }) {
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    date: today,
    type: 'Hifz',
    quranPage: '1',
    surahName: SURAHS[0].name,
    startAyat: '1',
    endAyat: '1',
    notes: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate an array of 604 numbers for the page datalist
  const pages = useMemo(() => Array.from({ length: 604 }, (_, i) => i + 1), []);
  
  // Find the selected Surah object based on the current text input
  const selectedSurahInfo = useMemo(() => {
    return SURAHS.find(s => s.name === formData.surahName) || SURAHS[0];
  }, [formData.surahName]);

  // Generate exact number of ayah dropdown options dynamically
  const availableAyahs = useMemo(() => {
    return Array.from({ length: selectedSurahInfo.ayahs }, (_, i) => i + 1);
  }, [selectedSurahInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // SMART SYNC LOGIC
    if (name === "surahName") {
      const foundSurah = SURAHS.find(s => s.name === value);
      
      setFormData(prev => ({
        ...prev,
        [name]: value,
        // Automatically sync the page if they select a valid Surah!
        quranPage: foundSurah ? String(foundSurah.page) : prev.quranPage,
        startAyat: '1',
        endAyat: '1' // Reset ayats when surah text changes
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Safety Validation: Ensure they actually picked a valid Surah from the list
    const isValidSurah = SURAHS.some(s => s.name === formData.surahName);
    if (!isValidSurah) {
      alert("Please select a valid Surah name from the dropdown list.");
      setIsSubmitting(false);
      return;
    }

    let dbType = "reading";
    if (formData.type === "Hifz") dbType = "memorization";
    else if (formData.type === "Muraja'ah") dbType = "revision";
    else if (formData.type === "Tilawah") dbType = "reading";
    
    const logPayload = {
      date: formData.date, 
      quranPage: Number(formData.quranPage),
      surahName: formData.surahName,
      startAyat: Number(formData.startAyat),
      endAyat: Number(formData.endAyat),
      type: dbType,
      notes: formData.notes
    };

    try {
      await addReadingLog(userId, logPayload);
      setShowSuccess(true);
      setFormData({
        date: today,
        type: 'Hifz',
        quranPage: '1',
        surahName: SURAHS[0].name,
        startAyat: '1',
        endAyat: '1',
        notes: ''
      });
      setTimeout(() => setShowSuccess(false), 4000);
    } catch (error) {
      console.error("Error writing log entry:", error);
      alert("Failed to save progress.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-xl bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Log Your Session</h2>
        <p className="text-sm text-gray-500 mt-1">Record your progress to maintain your streak.</p>
      </div>

      {showSuccess && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-3 animate-fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span className="text-sm font-medium">Progress successfully logged to Firestore!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Date & Reading Type Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} max={today} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all text-gray-800 font-medium" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Reading Type</label>
            <select name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all text-gray-800 font-medium cursor-pointer">
              <option value="Hifz">Hifz (New Memorization)</option>
              <option value="Muraja'ah">Muraja'ah (Revision)</option>
              <option value="Tilawah">Tilawah (Normal Reading)</option>
            </select>
          </div>
        </div>

        {/* Page & Surah Row (Now Searchable Datalists) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Quran Page</label>
            <input 
              type="text" 
              list="pageList" 
              name="quranPage" 
              value={formData.quranPage} 
              onChange={handleChange} 
              placeholder="Search page..."
              autoComplete="off"
              required 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all text-gray-800"
            />
            <datalist id="pageList">
              {pages.map(page => <option key={page} value={page} />)}
            </datalist>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Surah Name</label>
            <input 
              type="text" 
              list="surahList" 
              name="surahName" 
              value={formData.surahName} 
              onChange={handleChange} 
              placeholder="Type to search..."
              autoComplete="off"
              required 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all text-gray-800"
            />
            <datalist id="surahList">
              {SURAHS.map(surah => <option key={surah.id} value={surah.name} />)}
            </datalist>
          </div>
        </div>

        {/* Ayat Range Row (Searchable Datalists synced dynamically) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Start Ayat</label>
            <input 
              type="text" 
              list="startAyatList" 
              name="startAyat" 
              value={formData.startAyat} 
              onChange={handleChange} 
              placeholder="Search ayat..."
              autoComplete="off"
              required 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all text-gray-800"
            />
            <datalist id="startAyatList">
              {availableAyahs.map(ayat => <option key={ayat} value={ayat} />)}
            </datalist>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">End Ayat</label>
            <input 
              type="text" 
              list="endAyatList" 
              name="endAyat" 
              value={formData.endAyat} 
              onChange={handleChange} 
              placeholder="Search ayat..."
              autoComplete="off"
              required 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all text-gray-800"
            />
            <datalist id="endAyatList">
              {availableAyahs.map(ayat => <option key={ayat} value={ayat} />)}
            </datalist>
          </div>
        </div>

        {/* Personal Notes */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Personal Notes <span className="text-gray-400 font-normal">(Optional)</span></label>
          <textarea name="notes" value={formData.notes} onChange={handleChange} rows="3" placeholder="Reflections on today's reading..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all text-gray-800 resize-none"></textarea>
        </div>

        {/* Submit Button */}
        <button type="submit" disabled={isSubmitting} className="w-full bg-emerald-800 hover:bg-emerald-900 disabled:bg-emerald-600 text-white font-semibold py-3.5 px-4 rounded-xl shadow-md transition-colors duration-200 flex items-center justify-center gap-2 mt-2">
          <BookOpen className="w-5 h-5" />
          {isSubmitting ? "Logging progress..." : "Log Progress"}
        </button>
      </form>
    </div>
  );
}