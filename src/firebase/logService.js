// src/firebase/logService.js
// ─────────────────────────────────────────────────────────────────────────────
// Firestore helpers for reading/memorization logs
//
// COLLECTION STRUCTURE:
//   logs/
//     {auto-id}/
//       userId    : string   — the authenticated user's UID
//       date      : string   — "YYYY-MM-DD"  (used for month-range queries)
//       quranPage : number   — mushaf page number (1–604)
//       surahName : string   — e.g. "Al-Baqarah"
//       startAyat : number   — first ayat of the session
//       endAyat   : number   — last ayat of the session
//       type      : string   — "reading" | "memorization" | "revision"
//       notes     : string   — optional free-text notes
//       createdAt : Timestamp — server timestamp, set automatically
// ─────────────────────────────────────────────────────────────────────────────

import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "./config";

/** The top-level Firestore collection reference */
const LOGS_COLLECTION = "logs";

// ─── addReadingLog ────────────────────────────────────────────────────────────
/**
 * Saves a new reading/memorization log for the given user.
 *
 * @param {string} userId - The authenticated user's UID (from Firebase Auth).
 * @param {Object} logData - The session details to store.
 * @param {string} logData.date       - Date string in "YYYY-MM-DD" format.
 * @param {number} logData.quranPage  - Mushaf page number (1–604).
 * @param {string} logData.surahName  - Name of the surah (e.g. "Al-Fatiha").
 * @param {number} logData.startAyat  - Starting ayat number of the session.
 * @param {number} logData.endAyat    - Ending ayat number of the session.
 * @param {string} logData.type       - Session type: "reading" | "memorization" | "revision".
 * @param {string} [logData.notes=""] - Optional personal notes about the session.
 *
 * @returns {Promise<string>} The Firestore document ID of the newly created log.
 * @throws  Will throw if Firestore write fails (network error, permission denied, etc.)
 *
 * @example
 *   const docId = await addReadingLog(user.uid, {
 *     date:      "2026-05-19",
 *     quranPage: 2,
 *     surahName: "Al-Baqarah",
 *     startAyat: 1,
 *     endAyat:   5,
 *     type:      "memorization",
 *     notes:     "Focused on tajweed for ayat 3–5.",
 *   });
 */
export async function addReadingLog(userId, logData) {
  if (!userId) throw new Error("addReadingLog: userId is required.");

  const {
    date,
    quranPage,
    surahName,
    startAyat,
    endAyat,
    type,
    notes = "",
  } = logData;

  // Basic validation — keeps bad data out of Firestore
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error('addReadingLog: date must be a string in "YYYY-MM-DD" format.');
  }
  if (!["reading", "memorization", "revision"].includes(type)) {
    throw new Error('addReadingLog: type must be "reading", "memorization", or "revision".');
  }

  const docRef = await addDoc(collection(db, LOGS_COLLECTION), {
    userId,
    date,
    quranPage,
    surahName,
    startAyat,
    endAyat,
    type,
    notes,
    createdAt: serverTimestamp(), // set by Firestore server — tamper-proof
  });

  return docRef.id;
}

// ─── getLogsByMonth ───────────────────────────────────────────────────────────
/**
 * Retrieves all logs for a given user within a specific calendar month.
 *
 * Firestore does not support native LIKE queries, so this uses a
 * lexicographic range trick on the ISO date string:
 *   date >= "2026-05-00"  AND  date <= "2026-05-99"
 * This safely matches every "2026-05-DD" date without a composite index.
 *
 * @param {string} userId       - The authenticated user's UID.
 * @param {string} yearMonthStr - Month string in "YYYY-MM" format (e.g. "2026-05").
 *
 * @returns {Promise<Array<Object>>} Array of log objects, each including its Firestore `id`.
 *                                   Returns an empty array if no logs exist for that month.
 * @throws  Will throw if the Firestore query fails.
 *
 * @example
 *   const logs = await getLogsByMonth(user.uid, "2026-05");
 *   // logs → [{ id: "abc123", date: "2026-05-19", surahName: "Al-Baqarah", ... }, ...]
 */
export async function getLogsByMonth(userId, yearMonthStr) {
  if (!userId) throw new Error("getLogsByMonth: userId is required.");
  if (!yearMonthStr || !/^\d{4}-\d{2}$/.test(yearMonthStr)) {
    throw new Error('getLogsByMonth: yearMonthStr must be in "YYYY-MM" format.');
  }

  // Lexicographic range that covers every day in the given month
  const startDate = `${yearMonthStr}-00`; // "2026-05-00" — just before the 1st
  const endDate   = `${yearMonthStr}-99`; // "2026-05-99" — just after the 31st

  const logsRef = collection(db, LOGS_COLLECTION);

  const q = query(
    logsRef,
    where("userId", "==", userId),
    where("date",   ">=", startDate),
    where("date",   "<=", endDate),
    orderBy("date", "asc"), // chronological order within the month
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}