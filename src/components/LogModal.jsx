import React, { useState } from 'react';
import { X, Edit2, Save, Trash2, BookOpen } from 'lucide-react';
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
    
    // Map UI dropdown back to the exact strings the database requires
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
      // log.id is automatically fetched when you pull logs from Firestore
      await updateReadingLog(log.id, updatedPayload);
      setIsEditing(false); // Turn off edit mode
      // Note: A page refresh will automatically pull the new data
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-800 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-lg">Reading Details</h3>
              <p className="text-xs text-gray-500 font-medium">{log.date}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {!isEditing ? (
            /* --- VIEW MODE --- */
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Surah</p>
                  <p className="text-gray-800 font-semibold">{log.surahName}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Type</p>
                  <p className="text-emerald-700 font-semibold">{getInitialUIType(log.type)}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Page</p>
                  <p className="text-gray-800 font-semibold">{log.quranPage}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Ayat Range</p>
                  <p className="text-gray-800 font-semibold">{log.startAyat} - {log.endAyat}</p>
                </div>
              </div>
              {log.notes && (
                <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                  <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-1.5">Personal Notes</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{log.notes}</p>
                </div>
              )}
            </div>
          ) : (
            /* --- EDIT MODE --- */
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Reading Type</label>
                <select
                  name="type"
                  value={editData.type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none text-sm"
                >
                  <option value="Hifz">Hifz (New Memorization)</option>
                  <option value="Muraja'ah">Muraja'ah (Revision)</option>
                  <option value="Tilawah">Tilawah (Normal Reading)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Surah Name</label>
                  <input type="text" name="surahName" value={editData.surahName} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Page</label>
                  <input type="number" name="quranPage" value={editData.quranPage} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Start Ayat</label>
                  <input type="number" name="startAyat" value={editData.startAyat} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">End Ayat</label>
                  <input type="number" name="endAyat" value={editData.endAyat} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Notes</label>
                <textarea name="notes" value={editData.notes} onChange={handleChange} rows="2" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none"></textarea>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer (Action Buttons) */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-2">
          {!isEditing ? (
            <>
              <button 
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-2 mr-auto"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
              <button 
                onClick={() => setIsEditing(true)}
                className="px-5 py-2 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-sm transition-colors flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" /> Edit Record
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setIsEditing(false)}
                disabled={isProcessing}
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-200 bg-gray-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={isProcessing}
                className="px-5 py-2 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> {isProcessing ? "Saving..." : "Save Changes"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}