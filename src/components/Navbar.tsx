import React from 'react';
import { useApp } from '../context/AppContext';
import { GraduationCap, ShieldCheck, UserCheck, RefreshCw, Radio } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    role,
    setRole,
    currentTeacher,
    currentStudent,
    teachers,
    students,
    setCurrentTeacherId,
    setCurrentStudentId,
    activeSession,
    resetDemoData,
  } = useApp();

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 px-4 lg:px-8 flex items-center justify-between">
      {/* Left logo & title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            EduPulse
          </h1>
          <p className="text-[11px] font-medium text-emerald-400 tracking-wide uppercase">
            Attendance Tracking & Upload Portal
          </p>
        </div>
      </div>

      {/* Middle: Active Session Live Indicator */}
      {activeSession && (
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-semibold animate-pulse">
          <Radio className="w-4 h-4 text-emerald-400" />
          <span>Live Check-in Active: Code <strong className="text-white tracking-wider font-mono text-sm ml-1">{activeSession.code}</strong></span>
        </div>
      )}

      {/* Right section: Role Switcher & User Profile */}
      <div className="flex items-center gap-3">
        {/* Reset Demo Data button */}
        <button
          onClick={resetDemoData}
          title="Reset to initial mock dataset"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-lg transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Demo</span>
        </button>

        {/* Role Toggle switch */}
        <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center shadow-inner">
          <button
            onClick={() => setRole('teacher')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              role === 'teacher'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Teacher</span>
          </button>
          <button
            onClick={() => setRole('student')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              role === 'student'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Student</span>
          </button>
        </div>

        {/* Profile Switcher dropdown */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <img
            src={role === 'teacher' ? currentTeacher.avatar : currentStudent.avatar}
            alt="Profile"
            className="w-9 h-9 rounded-full object-cover border-2 border-slate-700 shadow-sm"
          />
          <div className="hidden sm:block text-left">
            {role === 'teacher' ? (
              <select
                value={currentTeacher.id}
                onChange={(e) => setCurrentTeacherId(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer pr-1"
              >
                {teachers.map((t) => (
                  <option key={t.id} value={t.id} className="bg-slate-900 text-slate-200">
                    {t.name}
                  </option>
                ))}
              </select>
            ) : (
              <select
                value={currentStudent.id}
                onChange={(e) => setCurrentStudentId(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer pr-1"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id} className="bg-slate-900 text-slate-200">
                    {s.name} ({s.rollNo})
                  </option>
                ))}
              </select>
            )}
            <p className="text-[10px] text-slate-400 font-medium">
              {role === 'teacher' ? currentTeacher.title : `${currentStudent.department} • Sem ${currentStudent.semester}`}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
