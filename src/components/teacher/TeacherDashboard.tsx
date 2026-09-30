import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  BookOpen,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  UploadCloud,
  QrCode,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

interface TeacherDashboardProps {
  onNavigate: (tab: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onNavigate }) => {
  const { students, courses, attendance, currentTeacher } = useApp();

  // Calculate stats
  const totalStudents = students.length;
  const teacherCourses = courses.filter((c) => c.teacherId === currentTeacher.id || true); // Default all for demo
  const totalCourses = teacherCourses.length;

  const totalRecords = attendance.length;
  const presentRecords = attendance.filter((a) => a.status === 'present' || a.status === 'late').length;
  const overallPercentage = totalRecords > 0 ? Math.round((presentRecords / totalRecords) * 100) : 0;

  // Find students with low attendance (< 75%)
  const studentStatsMap: Record<string, { total: number; present: number }> = {};
  students.forEach((s) => {
    studentStatsMap[s.id] = { total: 0, present: 0 };
  });

  attendance.forEach((rec) => {
    if (studentStatsMap[rec.studentId]) {
      studentStatsMap[rec.studentId].total += 1;
      if (rec.status === 'present' || rec.status === 'late') {
        studentStatsMap[rec.studentId].present += 1;
      }
    }
  });

  const lowAttendanceStudents = students
    .map((s) => {
      const stats = studentStatsMap[s.id];
      const pct = stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 100;
      return { ...s, pct, total: stats.total, present: stats.present };
    })
    .filter((s) => s.pct < 75);

  // Chart data: Attendance by date (past 7 dates)
  const datesSet = Array.from(new Set(attendance.map((a) => a.date)))
    .sort()
    .slice(-7);

  const trendData = datesSet.map((dateStr) => {
    const dayRecords = attendance.filter((a) => a.date === dateStr);
    const dayPresent = dayRecords.filter((a) => a.status === 'present' || a.status === 'late').length;
    const dayTotal = dayRecords.length;
    const rate = dayTotal > 0 ? Math.round((dayPresent / dayTotal) * 100) : 0;

    // Display formatted date (e.g. Sep 28)
    const d = new Date(dateStr);
    const label = `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()}`;
    return { date: label, rate, present: dayPresent, total: dayTotal };
  });

  // Course wise breakdown chart data
  const courseData = teacherCourses.map((c) => {
    const cRecords = attendance.filter((a) => a.courseId === c.id);
    const cPresent = cRecords.filter((a) => a.status === 'present' || a.status === 'late').length;
    const rate = cRecords.length > 0 ? Math.round((cPresent / cRecords.length) * 100) : 0;
    return { name: c.code, fullName: c.name, rate };
  });

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950/50 to-slate-900 border border-emerald-500/20 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -z-0"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Teacher Dashboard</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-white">
              Welcome back, {currentTeacher.name}
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Here is your daily attendance summary and student engagement metrics.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('mark')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/30 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark Attendance Today</span>
            </button>
            <button
              onClick={() => onNavigate('upload')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition-all"
            >
              <UploadCloud className="w-4 h-4 text-emerald-400" />
              <span>Upload CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Enrolled</p>
            <h3 className="text-2xl font-extrabold text-white mt-1">{totalStudents}</h3>
            <p className="text-[11px] text-slate-400 mt-1">Across {totalCourses} active subjects</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Overall Attendance Rate */}
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overall Attendance</p>
            <h3 className="text-2xl font-extrabold text-white mt-1">{overallPercentage}%</h3>
            <p className="text-[11px] text-emerald-400 mt-1 font-medium flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Average class turnout
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Active Courses */}
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Subjects</p>
            <h3 className="text-2xl font-extrabold text-white mt-1">{totalCourses}</h3>
            <p className="text-[11px] text-slate-400 mt-1">Computer Science Dept</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        {/* Low Attendance Alert */}
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Students At Risk</p>
            <h3 className="text-2xl font-extrabold text-rose-400 mt-1">{lowAttendanceStudents.length}</h3>
            <p className="text-[11px] text-rose-400/80 mt-1 font-medium">&lt; 75% attendance threshold</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Trend Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Daily Attendance Trends</h3>
              <p className="text-xs text-slate-400">Turnout percentage over recent working days</p>
            </div>
            <span className="text-xs font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full">
              Live Updated
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} unit="%" tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="rate"
                  name="Attendance %"
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRate)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Course Comparison Bar Chart */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <div>
            <h3 className="text-lg font-bold text-white">Subject Turnout</h3>
            <p className="text-xs text-slate-400">Attendance comparison by course</p>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={courseData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} unit="%" tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                  }}
                />
                <Bar dataKey="rate" name="Turnout %" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* At-Risk Students & Quick Shortcuts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Low Attendance Alert Table */}
        <div className="lg:col-span-2 p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <h3 className="text-lg font-bold text-white">At-Risk Students (&lt; 75% Attendance)</h3>
            </div>
            <button
              onClick={() => onNavigate('reports')}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <span>View Full Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {lowAttendanceStudents.length === 0 ? (
            <div className="p-8 text-center bg-slate-900/50 rounded-xl border border-slate-800 text-slate-400">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="font-semibold text-sm">Great news!</p>
              <p className="text-xs text-slate-500">All students currently meet the minimum 75% attendance criterion.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-xs text-slate-400 uppercase border-b border-slate-800">
                    <th className="pb-3 font-semibold">Student</th>
                    <th className="pb-3 font-semibold">Roll No</th>
                    <th className="pb-3 font-semibold">Attended</th>
                    <th className="pb-3 font-semibold">Percentage</th>
                    <th className="pb-3 font-semibold text-right">Status Badge</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {lowAttendanceStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 font-medium text-slate-200 flex items-center gap-3">
                        <img src={s.avatar} alt={s.name} className="w-8 h-8 rounded-full object-cover" />
                        <span>{s.name}</span>
                      </td>
                      <td className="py-3 text-slate-400 font-mono text-xs">{s.rollNo}</td>
                      <td className="py-3 text-slate-300">
                        {s.present} / {s.total}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-rose-500 h-full rounded-full"
                              style={{ width: `${s.pct}%` }}
                            ></div>
                          </div>
                          <span className="font-bold text-rose-400 text-xs">{s.pct}%</span>
                        </div>
                      </td>
                      <td className="py-3 text-right">
                        <span className="px-2.5 py-1 text-xs font-semibold bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-full">
                          Warning Badge
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Launch Panel */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Quick Actions</h3>
            <p className="text-xs text-slate-400">Launch attendance tools instantly</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => onNavigate('live')}
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 group transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                  <QrCode className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-slate-200 group-hover:text-white">Live Code Passcode</p>
                  <p className="text-[11px] text-slate-400">Generate 6-digit code for self check-in</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => onNavigate('upload')}
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 group transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-slate-200 group-hover:text-white">Batch CSV Upload</p>
                  <p className="text-[11px] text-slate-400">Upload attendance spreadsheet files</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
