import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { KeyRound, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export const SelfCheckIn: React.FC = () => {
  const { activeSession, checkInWithPasscode, courses, currentStudent } = useApp();
  const [code, setCode] = useState<string>('');
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const activeCourse = activeSession
    ? courses.find((c) => c.id === activeSession.courseId)
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;
    const res = checkInWithPasscode(code);
    setResult(res);
    if (res.success) {
      setCode('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-2">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <KeyRound className="w-6 h-6 text-indigo-400" />
          <span>Passcode Self Check-in</span>
        </h2>
        <p className="text-xs text-slate-400">
          Enter the 6-digit passcode displayed by your professor during class to instantly record your attendance.
        </p>
      </div>

      <div className="p-8 rounded-2xl glass-panel border border-slate-800 text-center max-w-xl mx-auto space-y-6">
        {activeSession ? (
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
            <span>
              Active Class Check-in Session for <strong>{activeCourse?.code} ({activeCourse?.name})</strong>
            </span>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-xs font-medium">
            No live passcode session is currently broadcasted by teachers.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">
              Enter 6-Digit Class Passcode
            </label>
            <input
              type="text"
              maxLength={6}
              placeholder="e.g. 849201"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              className="w-full text-center text-3xl font-mono tracking-widest font-extrabold bg-slate-950 border border-slate-700 text-indigo-300 rounded-2xl py-4 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 shadow-inner"
            />
          </div>

          <button
            type="submit"
            disabled={!code || code.length !== 6}
            className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Submit Passcode & Check-in</span>
          </button>
        </form>

        {result && (
          <div
            className={`p-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 ${
              result.success
                ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/80 border-rose-500/40 text-rose-300'
            }`}
          >
            {result.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400" />
            )}
            <span>{result.message}</span>
          </div>
        )}
      </div>
    </div>
  );
};
