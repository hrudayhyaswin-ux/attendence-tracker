import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Award,
  AlertTriangle,
  BookOpen,
  KeyRound,
  FileText,
  History,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

interface StudentDashboardProps {
  onNavigate: (tab: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigate }) => {
  const { currentStudent, courses, attendance } = useApp();

  // Calculate student overall stats
  const studentRecords = attendance.filter((a) => a.studentId === currentStudent.id);
  const totalClasses = studentRecords.length;
  const presentCount = studentRecords.filter((r) => r.status === 'present' || r.status === 'late').length;
  const overallPercentage = totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 100;

  // Subject-wise breakdown
  const subjectStats = courses.map((course) => {
    const cRecords = studentRecords.filter((r) => r.courseId === course.id);
    const cPresent = cRecords.filter((r) => r.status === 'present' || r.status === 'late').length;
    const cTotal = cRecords.length;
    const pct = cTotal > 0 ? Math.round((cPresent / cTotal) * 100) : 100;

    return {
      course,
      cTotal,
      cPresent,
      pct,
      isLow: pct < 75,
    };
  });

  const hasLowAttendance = subjectStats.some((s) => s.isLow) || overallPercentage < 75;

  return (
    <div className="space-y-6">
      {/* Welcome Banner Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-500/20 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-0"></div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={currentStudent.avatar}
              alt={currentStudent.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider mb-0.5">
                <Award className="w-4 h-4" />
                <span>Student Portal</span>
              </div>
              <h2 className="text-2xl font-extrabold text-white">{currentStudent.name}</h2>
              <p className="text-slate-400 text-xs mt-0.5">
                Roll No: <span className="font-mono text-indigo-300 font-semibold">{currentStudent.rollNo}</span> • {currentStudent.department} (Semester {currentStudent.semester})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('checkin')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all"
            >
              <KeyRound className="w-4 h-4" />
              <span>Passcode Self Check-in</span>
            </button>
            <button
              onClick={() => onNavigate('leave')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all"
            >
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>Apply for Leave</span>
            </button>
          </div>
        </div>
      </div>

      {/* Warning Banner if Attendance < 75% */}
      {hasLowAttendance && (
        <div className="p-5 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-200 flex items-start gap-4 shadow-lg animate-pulse">
          <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm text-white">Attendance Warning Alert</h4>
            <p className="text-xs text-rose-200 mt-1">
              Your attendance in one or more subjects is currently below the mandatory <strong>75% minimum threshold</strong>. Please attend upcoming lectures or submit valid leave documentation to prevent exam hall ticket locks.
            </p>
          </div>
        </div>
      )}

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overall Percentage Card */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 flex flex-col items-center justify-center text-center space-y-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overall Attendance</p>
          
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={overallPercentage >= 75 ? 'text-emerald-500' : 'text-rose-500'}
                strokeDasharray={`${overallPercentage}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-extrabold text-white">{overallPercentage}%</span>
              <span className="text-[10px] text-slate-400 font-medium">Cumulative</span>
            </div>
          </div>

          <p className="text-xs text-slate-400">
            Attended <strong className="text-white">{presentCount}</strong> out of <strong className="text-white">{totalClasses}</strong> total conducted classes.
          </p>
        </div>

        {/* Course Cards Breakdown */}
        <div className="lg:col-span-2 p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <span>Subject-wise Breakdown</span>
            </h3>
            <span className="text-xs text-slate-400 font-medium">Target: 75%+</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {subjectStats.map((sub) => (
              <div
                key={sub.course.id}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                      {sub.course.code}
                    </span>
                    <h4 className="text-sm font-bold text-white leading-snug">{sub.course.name}</h4>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                      sub.pct >= 85
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : sub.pct >= 75
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {sub.pct}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        sub.pct >= 75 ? 'bg-indigo-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${sub.pct}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 font-medium pt-0.5">
                    <span>{sub.cPresent} Attended</span>
                    <span>{sub.cTotal} Total</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
