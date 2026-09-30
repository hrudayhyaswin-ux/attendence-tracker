import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Download, Printer, Search, Filter, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const ReportsAnalytics: React.FC = () => {
  const { students, courses, attendance } = useApp();

  const [selectedCourseId, setSelectedCourseId] = useState<string>('all');
  const [thresholdFilter, setThresholdFilter] = useState<'all' | 'low' | 'good'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Calculate comprehensive report metrics per student
  const studentReports = students.map((student) => {
    // Filter records for student (and course if selected)
    const records = attendance.filter((a) => {
      const matchStudent = a.studentId === student.id;
      const matchCourse = selectedCourseId === 'all' || a.courseId === selectedCourseId;
      return matchStudent && matchCourse;
    });

    const totalClasses = records.length;
    const presentCount = records.filter((r) => r.status === 'present').length;
    const lateCount = records.filter((r) => r.status === 'late').length;
    const absentCount = records.filter((r) => r.status === 'absent').length;
    const excusedCount = records.filter((r) => r.status === 'excused').length;

    const attendedEffective = presentCount + lateCount;
    const percentage = totalClasses > 0 ? Math.round((attendedEffective / totalClasses) * 100) : 100;

    return {
      student,
      totalClasses,
      presentCount,
      lateCount,
      absentCount,
      excusedCount,
      percentage,
      isLow: percentage < 75,
    };
  });

  // Filter list
  const filteredReports = studentReports.filter((rep) => {
    const matchSearch =
      rep.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.student.rollNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchThreshold =
      thresholdFilter === 'all'
        ? true
        : thresholdFilter === 'low'
        ? rep.percentage < 75
        : rep.percentage >= 75;

    return matchSearch && matchThreshold;
  });

  const exportCSV = () => {
    const headers = ['RollNo,StudentName,Department,TotalClasses,Present,Late,Absent,Excused,AttendancePercentage,Status'];
    const rows = filteredReports.map(
      (r) =>
        `"${r.student.rollNo}","${r.student.name}","${r.student.department}",${r.totalClasses},${r.presentCount},${r.lateCount},${r.absentCount},${r.excusedCount},${r.percentage}%,"${r.isLow ? 'At Risk' : 'Satisfactory'}"`
    );

    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `attendance_report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-white">Attendance Reports & Analytics</h2>
            <p className="text-xs text-slate-400 mt-1">
              Generate detailed attendance percentage sheets and export official reports.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/30 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV Report</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print PDF</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Filter by Subject
            </label>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none"
            >
              <option value="all">All Subjects (Combined Summary)</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} — {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Attendance Threshold Filter
            </label>
            <select
              value={thresholdFilter}
              onChange={(e) => setThresholdFilter(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none"
            >
              <option value="all">All Students</option>
              <option value="low">At-Risk Students (&lt; 75%)</option>
              <option value="good">Satisfactory Students (&ge; 75%)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Search Student
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search name or roll no..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl pl-9 p-2.5 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Report Table */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-white">
          Student Attendance Percentage Summary ({filteredReports.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs text-slate-400 uppercase border-b border-slate-800">
                <th className="pb-3 font-semibold">Student</th>
                <th className="pb-3 font-semibold">Roll Number</th>
                <th className="pb-3 font-semibold text-center">Total Sessions</th>
                <th className="pb-3 font-semibold text-center">Present</th>
                <th className="pb-3 font-semibold text-center">Late</th>
                <th className="pb-3 font-semibold text-center">Absent</th>
                <th className="pb-3 font-semibold text-center">Excused</th>
                <th className="pb-3 font-semibold text-right">Attendance %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredReports.map((rep) => (
                <tr key={rep.student.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 font-medium text-slate-200 flex items-center gap-3">
                    <img
                      src={rep.student.avatar}
                      alt={rep.student.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span>{rep.student.name}</span>
                  </td>
                  <td className="py-3 text-slate-400 font-mono text-xs">{rep.student.rollNo}</td>
                  <td className="py-3 text-center text-slate-300 font-semibold">{rep.totalClasses}</td>
                  <td className="py-3 text-center text-emerald-400 font-semibold">{rep.presentCount}</td>
                  <td className="py-3 text-center text-amber-400 font-semibold">{rep.lateCount}</td>
                  <td className="py-3 text-center text-rose-400 font-semibold">{rep.absentCount}</td>
                  <td className="py-3 text-center text-sky-400 font-semibold">{rep.excusedCount}</td>
                  <td className="py-3 text-right">
                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-full ${
                        rep.percentage >= 85
                          ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                          : rep.percentage >= 75
                          ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                          : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
                      }`}
                    >
                      {rep.percentage}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
