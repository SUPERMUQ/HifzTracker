// src/components/LogForm.jsx
import { useState } from "react";
import {
  BookOpen,
  Hash,
  AlignLeft,
  ChevronDown,
  CheckCircle2,
  Loader2,
} from "lucide-react";

const READING_TYPES = [
  { value: "hifz",      label: "Hifz",       subtext: "Memorization"   },
  { value: "murajaah",  label: "Muraja'ah",  subtext: "Revision"       },
  { value: "tilawah",   label: "Tilawah",    subtext: "Recitation"     },
];

const INITIAL_STATE = {
  type:      "tilawah",
  quranPage: "",
  surahName: "",
  startAyat: "",
  endAyat:   "",
  notes:     "",
};

// ─── Reusable field wrapper ───────────────────────────────────────────────────
const Field = ({ label, icon: Icon, hint, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-800/70 select-none">
      {Icon && <Icon size={12} strokeWidth={2} className="text-emerald-600" />}
      {label}
      {hint && <span className="ml-auto normal-case tracking-normal font-normal text-stone-400">{hint}</span>}
    </label>
    {children}
  </div>
);

// ─── Shared input className ───────────────────────────────────────────────────
const inputCls = `
  w-full rounded-xl border border-stone-200 bg-white/80
  px-4 py-3 text-sm text-stone-800 placeholder-stone-300
  outline-none ring-0
  transition-all duration-200
  focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15
  hover:border-stone-300
`.trim();

// ─────────────────────────────────────────────────────────────────────────────

export default function LogForm() {
  const [form,       setForm]       = useState(INITIAL_STATE);
  const [submitting, setSubmitting] = useState(false);
  const [success,    setSuccess]    = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate async save (replace with addReadingLog call)
    await new Promise((r) => setTimeout(r, 900));

    console.log("📖 Session logged:", {
      ...form,
      date: new Date().toISOString().slice(0, 10),
    });

    setSubmitting(false);
    setSuccess(true);
    setForm(INITIAL_STATE);

    // Auto-dismiss success banner
    setTimeout(() => setSuccess(false), 3500);
  };

  return (
    <div className="relative">

      {/* ── Success banner ────────────────────────────────────────────────── */}
      <div
        className={`
          overflow-hidden transition-all duration-500 ease-in-out
          ${success ? "max-h-20 mb-5 opacity-100" : "max-h-0 mb-0 opacity-0"}
        `}
      >
        <div className="flex items-center gap-3 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-800">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <div>
            <span className="font-semibold">Session saved!</span>
            <span className="text-emerald-700/70 ml-1.5">May Allah bless your efforts. 🌿</span>
          </div>
        </div>
      </div>

      {/* ── Form card ─────────────────────────────────────────────────────── */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5"
        noValidate
      >

        {/* Reading Type — pill selector */}
        <Field label="Session Type" icon={BookOpen}>
          <div className="grid grid-cols-3 gap-2">
            {READING_TYPES.map(({ value, label, subtext }) => (
              <button
                key={value}
                type="button"
                onClick={() => setForm((p) => ({ ...p, type: value }))}
                className={`
                  relative flex flex-col items-center justify-center gap-0.5
                  rounded-xl border py-3 px-2 text-center
                  transition-all duration-200 select-none cursor-pointer
                  ${form.type === value
                    ? "border-emerald-600 bg-emerald-800 text-white shadow-md shadow-emerald-900/20"
                    : "border-stone-200 bg-white/80 text-stone-500 hover:border-emerald-300 hover:text-emerald-700"
                  }
                `}
              >
                <span className="text-sm font-semibold leading-tight">{label}</span>
                <span className={`text-[10px] leading-tight ${form.type === value ? "text-emerald-200" : "text-stone-400"}`}>
                  {subtext}
                </span>
              </button>
            ))}
          </div>
        </Field>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-stone-100" />
          <span className="text-[10px] uppercase tracking-widest text-stone-300 select-none">
            Session Details
          </span>
          <div className="flex-1 h-px bg-stone-100" />
        </div>

        {/* Surah Name + Page — side by side on sm+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Surah Name" icon={BookOpen}>
            <input
              type="text"
              name="surahName"
              value={form.surahName}
              onChange={handleChange}
              placeholder="e.g. Al-Baqarah"
              className={inputCls}
              autoComplete="off"
            />
          </Field>

          <Field label="Quran Page" icon={Hash} hint="1 – 604">
            <input
              type="number"
              name="quranPage"
              value={form.quranPage}
              onChange={handleChange}
              placeholder="e.g. 22"
              min={1}
              max={604}
              className={inputCls}
            />
          </Field>
        </div>

        {/* Start Ayat + End Ayat — always side by side */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Start Ayat" icon={Hash}>
            <input
              type="number"
              name="startAyat"
              value={form.startAyat}
              onChange={handleChange}
              placeholder="1"
              min={1}
              className={inputCls}
            />
          </Field>

          <Field label="End Ayat" icon={Hash}>
            <input
              type="number"
              name="endAyat"
              value={form.endAyat}
              onChange={handleChange}
              placeholder="5"
              min={1}
              className={inputCls}
            />
          </Field>
        </div>

        {/* Notes */}
        <Field label="Personal Notes" icon={AlignLeft} hint="Optional">
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Reflections, areas to review, du'a made…"
            rows={3}
            className={`${inputCls} resize-none leading-relaxed`}
          />
        </Field>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="
            mt-1 flex items-center justify-center gap-2
            rounded-xl bg-emerald-800 px-6 py-3.5
            text-sm font-semibold tracking-wide text-white
            shadow-md shadow-emerald-900/25
            transition-all duration-200
            hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-900/30 hover:-translate-y-px
            active:translate-y-0 active:shadow-md
            disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2
          "
        >
          {submitting
            ? <><Loader2 size={16} className="animate-spin" /> Saving…</>
            : <>Save Session ✦</>
          }
        </button>

      </form>
    </div>
  );
}