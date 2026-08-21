import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit2, Save, Trash2, BookOpen, Calendar, Compass, Hash, Bookmark } from 'lucide-react';
import { updateReadingLog, deleteReadingLog } from '../firebase/logService';

export default function LogModal({ log, onClose, onLogChange }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Convert database string format back to UI Dropdown format
  const getInitialUIType = (dbType) => {
    if (dbType === "memorization") return "Hifz";
    if (dbType === "revision") return "Muraja'ah";
    return "Tilawah";
  };

  const [editData, setEditData] = useState({
    type: getInitialUIType(log.type),
    quranPage: log.quranPage || '',
    surahName: log.surahName || '',
    startAyat: log.startAyat || '',
    endAyat: log.endAyat || '',
    notes: log.notes || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsProcessing(true);
    
    let dbType = "reading";
    if (editData.type === "Hifz") dbType = "memorization";
    else if (editData.type === "Muraja'ah") dbType = "revision";
    else if (editData.type === "Tilawah") dbType = "reading";

    const updatedPayload = {
      quranPage: Number(editData.quranPage),
      surahName: editData.surahName,
      startAyat: Number(editData.startAyat),
      endAyat: Number(editData.endAyat),
      type: dbType,
      notes: editData.notes
    };

    try {
      await updateReadingLog(log.id, updatedPayload);
      setIsEditing(false);
      if (onLogChange) onLogChange();
      onClose(); 
    } catch (error) {
      console.error("Error updating log:", error);
      alert("Failed to update log.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this log? This cannot be undone.");
    if (confirmDelete) {
      setIsProcessing(true);
      try {
        await deleteReadingLog(log.id);
        if (onLogChange) onLogChange();
        onClose();
      } catch (error) {
        console.error("Error deleting log:", error);
        alert("Failed to delete log.");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div 
          initial={{ scale: 0.94, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          className="relative z-10 bg-[#0c0c12] w-full max-w-lg rounded-3xl border border-white/[0.1] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Glow Accent */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/[0.08] bg-[#0f0f16]/60">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg font-display tracking-tight">Session Log Details</h3>
                <p className="text-xs text-zinc-400 font-mono mt-0.5 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-emerald-400" /> {log.date}
                </p>
              </div>
            </div>
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={onClose} 
              className="p-2 text-zinc-400 hover:text-white hover:bg-white/[0.06] rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto space-y-4">
            {!isEditing ? (
              /* --- VIEW MODE --- */
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="bg-[#121218] p-4 rounded-2xl border border-white/[0.06]">
                    <p className="text-[10px] font-mono text-zinc-500 font-semibold uppercase tracking-widest mb-1 flex items-center gap-1.5">
                      <Compass className="w-3 h-3 text-emerald-400" /> Surah
                    </p>
                    <p className="text-white font-bold text-base">{log.surahName}</p>
                  </div>
                  <div className="bg-[#121218] p-4 rounded-2xl border border-white/[0.06]">
                    <p className="text-[10px] font-mono text-zinc-500 font-semibold uppercase tracking-widest mb-1">Type</p>
                    <span className={`inline-block text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                      log.type === "memorization"
                        ? "text-amber-300 bg-amber-500/10 border-amber-500/20"
                        : log.type === "revision"
                        ? "text-blue-300 bg-blue-500/10 border-blue-500/20"
                        : "text-emerald-300 bg-emerald-500/10 border-emerald-500/20"
                    }`}>
                      {getInitialUIType(log.type)}
                    </span>
                  </div>
                  <div className="bg-[#121218] p-4 rounded-2xl border border-white/[0.06]">
                    <p className="text-[10px] font-mono text-zinc-500 font-semibold uppercase tracking-widest mb-1 flex items-center gap-1.5">
                      <Hash className="w-3 h-3 text-emerald-400" /> Mushaf Page
                    </p>
                    <p className="text-white font-bold text-base">Page {log.quranPage}</p>
                  </div>
                  <div className="bg-[#121218] p-4 rounded-2xl border border-white/[0.06]">
                    <p className="text-[10px] font-mono text-zinc-500 font-semibold uppercase tracking-widest mb-1 flex items-center gap-1.5">
                      <Bookmark className="w-3 h-3 text-emerald-400" /> Ayat Range
                    </p>
                    <p className="text-white font-bold text-base">Ayat {log.startAyat} – {log.endAyat}</p>
                  </div>
                </div>

                {log.notes && (
                  <div className="bg-[#121218] p-4 rounded-2xl border border-white/[0.06] space-y-1.5">
                    <p className="text-[10px] font-mono text-emerald-400 font-semibold uppercase tracking-widest">Personal Reflection</p>
                    <p className="text-sm text-zinc-300 leading-relaxed italic">"{log.notes}"</p>
                  </div>
                )}
              </div>
            ) : (
              /* --- EDIT MODE --- */
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono font-semibold text-zinc-400 uppercase tracking-widest mb-1.5">Category</label>
                  <select
                    name="type"
                    value={editData.type}
                    onChange={handleChange}
                    className="w-full px-3.5 py-3 bg-[#121218] border border-white/[0.08] rounded-xl text-sm text-white focus:border-emerald-500 outline-none"
                  >
                    <option value="Hifz">Hifz (New Memorization)</option>
                    <option value="Muraja'ah">Muraja'ah (Revision)</option>
                    <option value="Tilawah">Tilawah (Normal Reading)</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono font-semibold text-zinc-400 uppercase tracking-widest mb-1.5">Surah Name</label>
                    <input type="text" name="surahName" value={editData.surahName} onChange={handleChange} className="w-full px-3.5 py-2.5 bg-[#121218] border border-white/[0.08] rounded-xl text-sm text-white focus:border-emerald-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono font-semibold text-zinc-400 uppercase tracking-widest mb-1.5">Page</label>
                    <input type="number" name="quranPage" value={editData.quranPage} onChange={handleChange} className="w-full px-3.5 py-2.5 bg-[#121218] border border-white/[0.08] rounded-xl text-sm text-white focus:border-emerald-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono font-semibold text-zinc-400 uppercase tracking-widest mb-1.5">Start Ayat</label>
                    <input type="number" name="startAyat" value={editData.startAyat} onChange={handleChange} className="w-full px-3.5 py-2.5 bg-[#121218] border border-white/[0.08] rounded-xl text-sm text-white focus:border-emerald-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono font-semibold text-zinc-400 uppercase tracking-widest mb-1.5">End Ayat</label>
                    <input type="number" name="endAyat" value={editData.endAyat} onChange={handleChange} className="w-full px-3.5 py-2.5 bg-[#121218] border border-white/[0.08] rounded-xl text-sm text-white focus:border-emerald-500 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-semibold text-zinc-400 uppercase tracking-widest mb-1.5">Notes</label>
                  <textarea name="notes" value={editData.notes} onChange={handleChange} rows="3" className="w-full px-3.5 py-2.5 bg-[#121218] border border-white/[0.08] rounded-xl text-sm text-white focus:border-emerald-500 outline-none resize-none" />
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-4 border-t border-white/[0.08] bg-[#09090e] flex justify-end gap-3">
            {!isEditing ? (
              <>
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDelete}
                  className="px-4 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-500/10 rounded-xl transition-colors flex items-center gap-2 mr-auto cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" /> Delete Log
                </motion.button>
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditing(true)}
                  className="px-5 py-2.5 text-xs font-bold text-emerald-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 rounded-xl shadow-lg transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Edit2 className="w-4 h-4" /> Edit Record
                </motion.button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setIsEditing(false)}
                  disabled={isProcessing}
                  className="px-4 py-2.5 text-xs font-semibold text-zinc-400 hover:text-white bg-white/[0.05] rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  disabled={isProcessing}
                  className="px-5 py-2.5 text-xs font-bold text-emerald-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 rounded-xl shadow-lg transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" /> {isProcessing ? "Saving..." : "Save Changes"}
                </motion.button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}