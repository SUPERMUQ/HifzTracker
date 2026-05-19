// src/components/LogModal.jsx
import { X, BookOpen, ListOrdered, StickyNote, Tag, Pencil } from "lucide-react";
import { useEffect } from "react";

const TYPE_STYLES = {
  hifz:     { label: "Hifz",      bg: "bg-violet-50",  border: "border-violet-200", text: "text-violet-700"  },
  murajaah: { label: "Muraja'ah", bg: "bg-amber-50",   border: "border-amber-200",  text: "text-amber-700"   },
  tilawah:  { label: "Tilawah",   bg: "bg-emerald-50", border: "border-emerald-200",text: "text-emerald-700" },
};

function formatFullDate(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

// ─── Data row ────────────────────────────────────────────────────────────────
const DataRow = ({ icon: Icon, label, children }) => (
  <div className="flex gap-3">
    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-stone-100">
      <Icon size={14} strokeWidth={1.75} className="text-emerald-700" />
    </div>
    <div className="flex flex-col gap-0.5 min-w-0">
      <span className="text-[10px] uppercase tracking-widest font-semibold text-stone-400 select-none">
        {label}
      </span>
      <div className="text-sm text-stone-700 leading-snug">{children}</div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────

export default function LogModal({ log, onClose, onEdit }) {
  if (!log) return null;

  const typeStyle = TYPE_STYLES[log.type] ?? TYPE_STYLES.tilawah;

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(6, 25, 18, 0.55)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-label="Log detail"
    >
      {/* Panel — stop click propagation so backdrop-click-to-close works */}
      <div
        className="
          relative w-full max-w-md
          rounded-3xl bg-white
          shadow-2xl shadow-emerald-950/25
          overflow-hidden
          animate-[modal-in_0.22s_ease-out]
        "
        style={{
          animation: "modalIn 0.22s cubic-bezier(0.34,1.56,0.64,1) both",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <style>{`
          @keyframes modalIn {
            from { opacity: 0; transform: scale(0.94) translateY(12px); }
            to   { opacity: 1; transform: scale(1)    translateY(0);    }
          }
        `}</style>

        {/* ── Coloured header band ────────────────────────────────────────── */}
        <div className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 px-6 pt-6 pb-8">
          {/* Ornament */}
          <div className="pointer-events-none absolute -right-6 -top-6 opacity-[0.08]" aria-hidden="true">
            <svg viewBox="0 0 120 120" width="120" height="120" fill="white">
              <polygon points="60,3 72,42 113,42 80,66 92,105 60,81 28,105 40,66 7,42 48,42" />
            </svg>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="
              absolute top-4 right-4
              flex h-8 w-8 items-center justify-center
              rounded-full bg-white/10 text-white/70
              hover:bg-white/20 hover:text-white
              transition-all duration-150
            "
          >
            <X size={15} strokeWidth={2} />
          </button>

          {/* Date */}
          <p className="text-[11px] uppercase tracking-widest text-emerald-300/80 font-medium select-none">
            Session Record
          </p>
          <h2
            className="mt-1 text-xl font-bold text-white leading-tight"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            {formatFullDate(log.date)}
          </h2>

          {/* Activity badge */}
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3 py-1">
            <Tag size={11} className="text-emerald-300" />
            <span className="text-[11px] font-semibold text-emerald-200 uppercase tracking-wider">
              Activity Type:
            </span>
            <span className="text-[11px] font-bold text-white">
              {typeStyle.label}
            </span>
          </div>
        </div>

        {/* Pull-down card overlap */}
        <div className="-mt-4 mx-4 rounded-2xl bg-white border border-stone-100 shadow-sm shadow-stone-200/60 px-5 py-5 flex flex-col gap-4">

          {/* Page */}
          <DataRow icon={BookOpen} label="Location">
            <span className="font-semibold text-stone-800">Page {log.quranPage}</span>
          </DataRow>

          {/* Verses */}
          <DataRow icon={ListOrdered} label="Verses">
            <span>
              <span className="font-semibold text-stone-800">{log.surahName}</span>
              {log.startAyat && log.endAyat && (
                <span className="text-stone-500">
                  {" — "}Ayat {log.startAyat}–{log.endAyat}
                </span>
              )}
            </span>
          </DataRow>

          {/* Notes */}
          {log.notes && (
            <DataRow icon={StickyNote} label="Notes">
              <blockquote
                className="
                  mt-1 rounded-xl
                  border-l-2 border-emerald-400
                  bg-stone-50 px-4 py-3
                  text-sm text-stone-600 leading-relaxed italic
                "
              >
                "{log.notes}"
              </blockquote>
            </DataRow>
          )}
        </div>

        {/* ── Footer action ───────────────────────────────────────────────── */}
        <div className="px-4 py-4">
          <button
            onClick={() => { onEdit?.(log); onClose(); }}
            className="
              w-full flex items-center justify-center gap-2
              rounded-xl bg-emerald-800 px-6 py-3.5
              text-sm font-semibold tracking-wide text-white
              shadow-md shadow-emerald-900/20
              hover:bg-emerald-700 hover:-translate-y-px hover:shadow-lg
              active:translate-y-0
              transition-all duration-200
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2
            "
          >
            <Pencil size={14} strokeWidth={2} />
            Edit Log Entry
          </button>
        </div>
      </div>
    </div>
  );
}