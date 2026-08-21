import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { BookOpen, CheckCircle, AlertCircle, Calendar, Hash, Bookmark, MessageSquare, Compass, Sparkles } from 'lucide-react';
import { addReadingLog } from '../firebase/logService';

const SURAHS = [
  { id: 1, name: "Al-Fatihah", ayahs: 7, page: 1 }, { id: 2, name: "Al-Baqarah", ayahs: 286, page: 2 },
  { id: 3, name: "Ali 'Imran", ayahs: 200, page: 50 }, { id: 4, name: "An-Nisa", ayahs: 176, page: 77 },
  { id: 5, name: "Al-Ma'idah", ayahs: 120, page: 106 }, { id: 6, name: "Al-An'am", ayahs: 165, page: 128 },
  { id: 7, name: "Al-A'raf", ayahs: 206, page: 151 }, { id: 8, name: "Al-Anfal", ayahs: 75, page: 177 },
  { id: 9, name: "At-Tawbah", ayahs: 129, page: 187 }, { id: 10, name: "Yunus", ayahs: 109, page: 208 },
  { id: 11, name: "Hud", ayahs: 123, page: 221 }, { id: 12, name: "Yusuf", ayahs: 111, page: 235 },
  { id: 13, name: "Ar-Ra'd", ayahs: 43, page: 249 }, { id: 14, name: "Ibrahim", ayahs: 52, page: 255 },
  { id: 15, name: "Al-Hijr", ayahs: 99, page: 262 }, { id: 16, name: "An-Nahl", ayahs: 128, page: 267 },
  { id: 17, name: "Al-Isra", ayahs: 111, page: 282 }, { id: 18, name: "Al-Kahf", ayahs: 110, page: 293 },
  { id: 19, name: "Maryam", ayahs: 98, page: 305 }, { id: 20, name: "Taha", ayahs: 135, page: 312 },
  { id: 21, name: "Al-Anbiya", ayahs: 112, page: 322 }, { id: 22, name: "Al-Hajj", ayahs: 78, page: 332 },
  { id: 23, name: "Al-Mu'minun", ayahs: 118, page: 342 }, { id: 24, name: "An-Nur", ayahs: 64, page: 350 },
  { id: 25, name: "Al-Furqan", ayahs: 77, page: 359 }, { id: 26, name: "Ash-Shu'ara", ayahs: 227, page: 367 },
  { id: 27, name: "An-Naml", ayahs: 93, page: 377 }, { id: 28, name: "Al-Qasas", ayahs: 88, page: 385 },
  { id: 29, name: "Al-'Ankabut", ayahs: 69, page: 396 }, { id: 30, name: "Ar-Rum", ayahs: 60, page: 404 },
  { id: 31, name: "Luqman", ayahs: 34, page: 411 }, { id: 32, name: "As-Sajdah", ayahs: 30, page: 415 },
  { id: 33, name: "Al-Ahzab", ayahs: 73, page: 418 }, { id: 34, name: "Saba", ayahs: 54, page: 428 },
  { id: 35, name: "Fatir", ayahs: 45, page: 434 }, { id: 36, name: "Ya-Sin", ayahs: 83, page: 440 },
  { id: 37, name: "As-Saffat", ayahs: 182, page: 446 }, { id: 38, name: "Sad", ayahs: 88, page: 453 },
  { id: 39, name: "Az-Zumar", ayahs: 75, page: 458 }, { id: 40, name: "Ghafir", ayahs: 85, page: 467 },
  { id: 41, name: "Fussilat", ayahs: 54, page: 477 }, { id: 42, name: "Ash-Shura", ayahs: 53, page: 483 },
  { id: 43, name: "Az-Zukhruf", ayahs: 89, page: 489 }, { id: 44, name: "Ad-Dukhan", ayahs: 59, page: 496 },
  { id: 45, name: "Al-Jathiyah", ayahs: 37, page: 499 }, { id: 46, name: "Al-Ahqaf", ayahs: 35, page: 502 },
  { id: 47, name: "Muhammad", ayahs: 38, page: 507 }, { id: 48, name: "Al-Fath", ayahs: 29, page: 511 },
  { id: 49, name: "Al-Hujurat", ayahs: 18, page: 515 }, { id: 50, name: "Qaf", ayahs: 45, page: 518 },
  { id: 51, name: "Ad-Dhariyat", ayahs: 60, page: 520 }, { id: 52, name: "At-Tur", ayahs: 49, page: 523 },
  { id: 53, name: "An-Najm", ayahs: 62, page: 526 }, { id: 54, name: "Al-Qamar", ayahs: 55, page: 528 },
  { id: 55, name: "Ar-Rahman", ayahs: 78, page: 531 }, { id: 56, name: "Al-Waqi'ah", ayahs: 96, page: 534 },
  { id: 57, name: "Al-Hadid", ayahs: 29, page: 537 }, { id: 58, name: "Al-Mujadila", ayahs: 22, page: 542 },
  { id: 59, name: "Al-Hashr", ayahs: 24, page: 545 }, { id: 60, name: "Al-Mumtahanah", ayahs: 13, page: 549 },
  { id: 61, name: "As-Saff", ayahs: 14, page: 551 }, { id: 62, name: "Al-Jumu'ah", ayahs: 11, page: 553 },
  { id: 63, name: "Al-Munafiqun", ayahs: 11, page: 554 }, { id: 64, name: "At-Taghabun", ayahs: 18, page: 556 },
  { id: 65, name: "At-Talaq", ayahs: 12, page: 558 }, { id: 66, name: "At-Tahrim", ayahs: 12, page: 560 },
  { id: 67, name: "Al-Mulk", ayahs: 30, page: 562 }, { id: 68, name: "Al-Qalam", ayahs: 52, page: 564 },
  { id: 69, name: "Al-Haqqah", ayahs: 52, page: 566 }, { id: 70, name: "Al-Ma'arij", ayahs: 44, page: 568 },
  { id: 71, name: "Nuh", ayahs: 28, page: 570 }, { id: 72, name: "Al-Jinn", ayahs: 28, page: 572 },
  { id: 73, name: "Al-Muzzammil", ayahs: 20, page: 574 }, { id: 74, name: "Al-Muddaththir", ayahs: 56, page: 575 },
  { id: 75, name: "Al-Qiyamah", ayahs: 40, page: 577 }, { id: 76, name: "Al-Insan", ayahs: 31, page: 578 },
  { id: 77, name: "Al-Mursalat", ayahs: 50, page: 580 }, { id: 78, name: "An-Naba", ayahs: 40, page: 582 },
  { id: 79, name: "An-Nazi'at", ayahs: 46, page: 583 }, { id: 80, name: "'Abasa", ayahs: 42, page: 585 },
  { id: 81, name: "At-Takwir", ayahs: 29, page: 586 }, { id: 82, name: "Al-Infitar", ayahs: 19, page: 587 },
  { id: 83, name: "Al-Mutaffifin", ayahs: 36, page: 587 }, { id: 84, name: "Al-Inshiqaq", ayahs: 25, page: 589 },
  { id: 85, name: "Al-Buruj", ayahs: 22, page: 590 }, { id: 86, name: "At-Tariq", ayahs: 17, page: 591 },
  { id: 87, name: "Al-A'la", ayahs: 19, page: 591 }, { id: 88, name: "Al-Ghashiyah", ayahs: 26, page: 592 },
  { id: 89, name: "Al-Fajr", ayahs: 30, page: 593 }, { id: 90, name: "Al-Balad", ayahs: 20, page: 594 },
  { id: 91, name: "Ash-Shams", ayahs: 15, page: 595 }, { id: 92, name: "Al-Lail", ayahs: 21, page: 595 },
  { id: 93, name: "Ad-Duhaa", ayahs: 11, page: 596 }, { id: 94, name: "Ash-Sharh", ayahs: 8, page: 596 },
  { id: 95, name: "At-Tin", ayahs: 8, page: 597 }, { id: 96, name: "Al-'Alaq", ayahs: 19, page: 597 },
  { id: 97, name: "Al-Qadr", ayahs: 5, page: 598 }, { id: 98, name: "Al-Bayyinah", ayahs: 8, page: 598 },
  { id: 99, name: "Az-Zalzalah", ayahs: 8, page: 599 }, { id: 100, name: "Al-'Adiyat", ayahs: 11, page: 599 },
  { id: 101, name: "Al-Qari'ah", ayahs: 11, page: 600 }, { id: 102, name: "At-Takathur", ayahs: 8, page: 600 },
  { id: 103, name: "Al-'Asr", ayahs: 3, page: 601 }, { id: 104, name: "Al-Humazah", ayahs: 9, page: 601 },
  { id: 105, name: "Al-Fil", ayahs: 5, page: 601 }, { id: 106, name: "Quraish", ayahs: 4, page: 602 },
  { id: 107, name: "Al-Ma'un", ayahs: 7, page: 602 }, { id: 108, name: "Al-Kawthar", ayahs: 3, page: 602 },
  { id: 109, name: "Al-Kafirun", ayahs: 6, page: 603 }, { id: 110, name: "An-Nasr", ayahs: 3, page: 603 },
  { id: 111, name: "Al-Masad", ayahs: 5, page: 603 }, { id: 112, name: "Al-Ikhlas", ayahs: 4, page: 604 },
  { id: 113, name: "Al-Falaq", ayahs: 5, page: 604 }, { id: 114, name: "An-Nas", ayahs: 6, page: 604 }
];

const EMPTY_FORM = {
  date: '',
  type: 'Hifz',
  quranPage: '',
  surahName: '',
  startAyat: '',
  endAyat: '',
  notes: ''
};

const sessionTypes = [
  { id: 'Hifz', label: 'Hifz', desc: 'Memorization', color: 'emerald' },
  { id: "Muraja'ah", label: "Muraja'ah", desc: 'Revision', color: 'amber' },
  { id: 'Tilawah', label: 'Tilawah', desc: 'Reading', color: 'blue' }
];

// Inline validation error component
const FieldError = ({ message }) =>
  message ? (
    <motion.p 
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-400 font-mono"
    >
      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
      {message}
    </motion.p>
  ) : null;

// Dark SOTD Input base classes
const inputBase =
  "w-full pl-10 pr-4 py-3 bg-[#121218] border rounded-2xl text-sm text-zinc-100 placeholder-zinc-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/80 font-sans";
const inputNormal = `${inputBase} border-white/[0.08] hover:border-white/[0.15]`;
const inputError  = `${inputBase} border-red-500/40 bg-red-950/10 focus:ring-red-500/20 focus:border-red-500`;

export default function LogForm({ userId }) {
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const [formData, setFormData] = useState({
    ...EMPTY_FORM,
    date: today
  });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pages = useMemo(() => Array.from({ length: 604 }, (_, i) => i + 1), []);

  const selectedSurahInfo = useMemo(() => {
    return SURAHS.find(s => s.name === formData.surahName) || null;
  }, [formData.surahName]);

  const availableAyahs = useMemo(() => {
    if (!selectedSurahInfo) return Array.from({ length: 286 }, (_, i) => i + 1);
    return Array.from({ length: selectedSurahInfo.ayahs }, (_, i) => i + 1);
  }, [selectedSurahInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    if (name === "surahName") {
      const foundSurah = SURAHS.find(s => s.name === value);
      setFormData(prev => ({
        ...prev,
        surahName: value,
        quranPage: foundSurah ? String(foundSurah.page) : prev.quranPage,
        startAyat: '',
        endAyat: '',
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.date) newErrors.date = 'Please select a date.';
    if (!formData.surahName) {
      newErrors.surahName = 'Please select a Surah.';
    } else if (!SURAHS.some(s => s.name === formData.surahName)) {
      newErrors.surahName = 'Please choose a valid Surah from the list.';
    }
    if (!formData.quranPage) newErrors.quranPage = 'Please enter a page number.';
    if (!formData.startAyat) newErrors.startAyat = 'Please enter a start ayat.';
    if (!formData.endAyat) newErrors.endAyat = 'Please enter an end ayat.';
    if (formData.startAyat && formData.endAyat && Number(formData.endAyat) < Number(formData.startAyat)) {
      newErrors.endAyat = 'End ayat must be ≥ start ayat.';
    }
    return newErrors;
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#34d399', '#f59e0b', '#fbbf24']
      });
    } catch {
      // fallback
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    let dbType = "reading";
    if (formData.type === "Hifz") dbType = "memorization";
    else if (formData.type === "Muraja'ah") dbType = "revision";

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
      triggerConfetti();
      setFormData({ ...EMPTY_FORM, date: today });
      setErrors({});
      setTimeout(() => setShowSuccess(false), 4000);
    } catch (error) {
      console.error("Error writing log entry:", error);
      setErrors({ submit: 'Failed to save progress. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full"
    >
      {/* SOTD Bento Card */}
      <div className="bg-[#0c0c12]/90 rounded-3xl border border-white/[0.08] shadow-2xl backdrop-blur-xl overflow-hidden relative">
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="px-7 pt-7 pb-5 border-b border-white/[0.06] bg-gradient-to-r from-emerald-500/[0.04] to-transparent">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 bg-gradient-to-tr from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-950/40 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight font-display tracking-tight">Log Today's Session</h2>
              <p className="text-xs text-zinc-400 mt-0.5 font-medium">Keep your momentum alive and protect your streak.</p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="px-7 py-6 space-y-6">

          {/* Banners */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-2xl flex items-center gap-3 text-xs font-medium"
              >
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>MashaAllah! Progress logged successfully. Streak preserved!</span>
              </motion.div>
            )}

            {errors.submit && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 bg-red-500/10 border border-red-500/30 text-red-300 rounded-2xl flex items-center gap-3 text-xs font-medium"
              >
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <span>{errors.submit}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Segmented control for Reading Type with Morphing layoutId */}
          <div>
            <label className="block text-[10px] font-mono font-semibold text-zinc-400 uppercase tracking-widest mb-2.5">
              Session Category
            </label>
            <div className="grid grid-cols-3 gap-2 bg-[#121218] p-1.5 rounded-2xl border border-white/[0.06]">
              {sessionTypes.map((typeObj) => {
                const isActive = formData.type === typeObj.id;

                return (
                  <button
                    key={typeObj.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: typeObj.id }))}
                    className="relative py-2.5 px-2 rounded-xl text-center cursor-pointer focus:outline-none transition-colors duration-200"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="sessionTypePill"
                        className={`absolute inset-0 rounded-xl shadow-lg ${
                          typeObj.color === 'emerald'
                            ? "bg-gradient-to-r from-emerald-600 to-teal-600 border border-emerald-400/40"
                            : typeObj.color === 'amber'
                            ? "bg-gradient-to-r from-amber-600 to-yellow-600 border border-amber-400/40"
                            : "bg-gradient-to-r from-blue-600 to-cyan-600 border border-blue-400/40"
                        }`}
                        transition={{ type: "spring", stiffness: 400, damping: 28 }}
                      />
                    )}
                    <span className={`relative z-10 block text-xs tracking-tight ${isActive ? "font-bold text-white" : "font-medium text-zinc-400 hover:text-zinc-200"}`}>
                      {typeObj.label}
                    </span>
                    <span className={`relative z-10 block text-[9px] mt-0.5 font-mono uppercase tracking-wider ${isActive ? "text-white/80 font-semibold" : "text-zinc-600"}`}>
                      {typeObj.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Selector */}
          <div>
            <label className="block text-[10px] font-mono font-semibold text-zinc-400 uppercase tracking-widest mb-1.5">
              Session Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <Calendar className="w-4 h-4" />
              </div>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                max={today}
                className={errors.date ? inputError : inputNormal}
              />
            </div>
            <FieldError message={errors.date} />
          </div>

          {/* Divider */}
          <div className="border-t border-white/[0.06]" />

          {/* Surah Name & Page */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono font-semibold text-zinc-400 uppercase tracking-widest mb-1.5">
                Surah Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <Compass className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  list="surahList"
                  name="surahName"
                  value={formData.surahName}
                  onChange={handleChange}
                  placeholder="Search surah..."
                  autoComplete="off"
                  className={errors.surahName ? inputError : inputNormal}
                />
              </div>
              <datalist id="surahList">
                {SURAHS.map(surah => <option key={surah.id} value={surah.name} />)}
              </datalist>
              <FieldError message={errors.surahName} />
            </div>

            <div>
              <label className="block text-[10px] font-mono font-semibold text-zinc-400 uppercase tracking-widest mb-1.5">
                Quran Page {selectedSurahInfo && (
                  <span className="ml-1 text-emerald-400 normal-case font-mono font-normal text-[10px]">
                    (p.{selectedSurahInfo.page})
                  </span>
                )}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <Hash className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  list="pageList"
                  name="quranPage"
                  value={formData.quranPage}
                  onChange={handleChange}
                  placeholder="e.g. 1 – 604"
                  autoComplete="off"
                  className={errors.quranPage ? inputError : inputNormal}
                />
              </div>
              <datalist id="pageList">
                {pages.map(page => <option key={page} value={page} />)}
              </datalist>
              <FieldError message={errors.quranPage} />
            </div>
          </div>

          {/* Ayat Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono font-semibold text-zinc-400 uppercase tracking-widest mb-1.5">
                Start Ayat {selectedSurahInfo && (
                  <span className="ml-1 text-zinc-500 normal-case font-mono text-[10px]">
                    (1–{selectedSurahInfo.ayahs})
                  </span>
                )}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <Bookmark className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  list="startAyatList"
                  name="startAyat"
                  value={formData.startAyat}
                  onChange={handleChange}
                  placeholder="Start ayat..."
                  autoComplete="off"
                  className={errors.startAyat ? inputError : inputNormal}
                />
              </div>
              <datalist id="startAyatList">
                {availableAyahs.map(ayat => <option key={ayat} value={ayat} />)}
              </datalist>
              <FieldError message={errors.startAyat} />
            </div>

            <div>
              <label className="block text-[10px] font-mono font-semibold text-zinc-400 uppercase tracking-widest mb-1.5">
                End Ayat
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <Bookmark className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  list="endAyatList"
                  name="endAyat"
                  value={formData.endAyat}
                  onChange={handleChange}
                  placeholder="End ayat..."
                  autoComplete="off"
                  className={errors.endAyat ? inputError : inputNormal}
                />
              </div>
              <datalist id="endAyatList">
                {availableAyahs.map(ayat => <option key={ayat} value={ayat} />)}
              </datalist>
              <FieldError message={errors.endAyat} />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[10px] font-mono font-semibold text-zinc-400 uppercase tracking-widest mb-1.5">
              Personal Reflection <span className="text-zinc-600 font-sans normal-case text-xs">— optional</span>
            </label>
            <div className="relative">
              <div className="absolute top-3.5 left-3.5 pointer-events-none text-zinc-500">
                <MessageSquare className="w-4 h-4" />
              </div>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                placeholder="Reflections on tajweed, memorization difficulty, or teacher feedback..."
                className={`${inputNormal} pl-10 resize-none`}
              />
            </div>
          </div>
        </div>

        {/* Footer / Submit Button */}
        <div className="px-7 pb-7">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.96, transition: { type: "spring", stiffness: 500, damping: 15 } }}
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:from-emerald-600 active:to-teal-600 disabled:opacity-50 text-emerald-950 font-extrabold py-3.5 px-4 rounded-2xl shadow-xl shadow-emerald-950/40 transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer focus:outline-none focus:ring-4 focus:ring-emerald-500/20 text-sm tracking-wide"
          >
            <Sparkles className="w-4 h-4 fill-emerald-950" />
            {isSubmitting ? "Recording Milestone..." : "Save Session Log"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}