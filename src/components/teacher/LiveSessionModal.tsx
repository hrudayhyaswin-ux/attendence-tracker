import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { QrCode, Play, StopCircle, Clock, Users, CheckCircle2, Copy } from 'lucide-react';

export const LiveSessionModal: React.FC = () => {
  const { courses, activeSession, createLiveSession, endLiveSession, attendance, students } = useApp();

  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || '');
  const [timeLeft, setTimeLeft] = useState<number>(600); // 10 minutes in seconds

  // Update timer countdown
  useEffect(() => {
    if (!activeSession || !activeSession.active) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expires = new Date(activeSession.expiresAt).getTime();
      const diff = Math.max(0, Math.floor((expires - now) / 1000));
      setTimeLeft(diff);

      if (diff <= 0) {
        endLiveSession();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeSession, endLiveSession]);

  const handleStartSession = () => {
    if (!selectedCourseId) return;
    createLiveSession(selectedCourseId);
    setTimeLeft(600);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Find students checked in for today via passcode on this course
  const todayStr = new Date().toISOString().split('T')[0];
  const checkedInRecords = activeSession
    ? attendance.filter(
        (a) => a.courseId === activeSession.courseId && a.date === todayStr && a.markedBy === 'student-passcode'
      )
    : [];

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-2">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <QrCode className="w-6 h-6 text-emerald-400" />
          <span>Live Class Check-in Passcode Generator</span>
        </h2>
        <p className="text-xs text-slate-400">
          Generate a temporary 6-digit passcode for students to mark their own attendance live during class.
        </p>
      </div>

      {!activeSession ? (
        /* Create New Session Card */
        <div className="p-8 rounded-2xl glass-panel border border-slate-800 text-center max-w-xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
            <QrCode className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white">Start Live Self Check-in</h3>
            <p className="text-xs text-slate-400 mt-1">
              Select your course to launch a 10-minute dynamic passcode session.
            </p>
          </div>

          <div className="text-left space-y-2">
            <label className="block text-xs font-semibold text-slate-400">Select Subject</label>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-xl p-3 focus:outline-none focus:border-emerald-500"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} — {c.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleStartSession}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 transition-all"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Launch Live Check-in Passcode</span>
          </button>
        </div>
      ) : (
        /* Active Running Session Screen */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Passcode Display Card */}
          <div className="lg:col-span-2 p-8 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-emerald-500/40 shadow-2xl flex flex-col items-center text-center space-y-6">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-400 text-xs font-semibold animate-pulse">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span>LIVE CHECK-IN IN PROGRESS</span>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                Student Self Check-in Code
              </p>
              <div className="text-5xl sm:text-6xl font-black font-mono tracking-widest text-emerald-400 my-4 bg-slate-950/80 px-8 py-4 rounded-2xl border border-emerald-500/30 shadow-inner inline-block select-all">
                {activeSession.code}
              </div>
              <p className="text-xs text-slate-400">
                Direct students to enter code <strong className="text-white">{activeSession.code}</strong> in their portal.
              </p>
            </div>

            {/* Countdown timer */}
            <div className="flex items-center gap-2 text-slate-300 bg-slate-800/60 px-4 py-2 rounded-xl border border-slate-700/60">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-medium">Session Expires In:</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">{formatTime(timeLeft)}</span>
            </div>

            {/* End session button */}
            <button
              onClick={endLiveSession}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-950/80 hover:bg-rose-900/80 border border-rose-500/30 text-rose-300 text-xs font-bold transition-all"
            >
              <StopCircle className="w-4 h-4" />
              <span>End Live Session Early</span>
            </button>
          </div>

          {/* Live Check-in Feed */}
          <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Live Check-ins ({checkedInRecords.length})</h3>
              </div>
              <span className="text-xs text-emerald-400 font-mono">Real-time</span>
            </div>

            {checkedInRecords.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs space-y-2">
                <Clock className="w-6 h-6 text-slate-600 mx-auto animate-spin" />
                <p>Waiting for students to check in...</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {checkedInRecords.map((rec) => {
                  const student = students.find((s) => s.id === rec.studentId);
                  return (
                    <div
                      key={rec.id}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={student?.avatar}
                          alt={student?.name}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-semibold text-white">{student?.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{student?.rollNo}</p>
                        </div>
                      </div>
                      <span className="flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Checked in
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
