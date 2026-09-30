import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { History, CheckCircle2, XCircle, Clock, FileCheck, Search } from 'lucide-react';

export const StudentHistory: React.FC = () => {
  const { currentStudent, courses, attendance } = useApp();

  const [selectedCourseId, setSelectedCourseId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const myAttendance = attendance.filter((a) => a.studentId === currentStudent.id);

  const filteredLogs = myAttendance.filter((rec) => {
    const matchCourse = selectedCourseId === 'all' || rec.courseId === selectedCourseId;
    const course = courses.find((c) => c.id === rec.courseId);
    const matchSearch =
      !searchQuery ||
      course?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course?.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.date.includes(searchQuery);

    return matchCourse && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <History className="w-6 h-6 text-indigo-400" />
              <span>Attendance History Log</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Complete history of recorded attendance entries for {currentStudent.name}.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Filter by Subject</label>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none"
            >
              <option value="all">All Subjects</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} — {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Search Date / Subject</label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl pl-9 p-2.5 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white">Records List ({filteredLogs.length})</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs text-slate-400 uppercase border-b border-slate-800">
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold">Subject Code</th>
                <th className="pb-3 font-semibold">Subject Name</th>
                <th className="pb-3 font-semibold">Marked Via</th>
                <th className="pb-3 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLogs.map((log) => {
                const course = courses.find((c) => c.id === log.courseId);
                return (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 font-mono text-xs text-slate-300">{log.date}</td>
                    <td className="py-3 font-bold text-indigo-400">{course?.code || '—'}</td>
                    <td className="py-3 text-slate-200">{course?.name || '—'}</td>
                    <td className="py-3 text-xs text-slate-400 capitalize">{log.markedBy.replace('-', ' ')}</td>
                    <td className="py-3 text-right">
                      <span
                        className={`px-3 py-1 text-xs font-bold rounded-full inline-flex items-center gap-1 ${
                          log.status === 'present'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : log.status === 'absent'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            : log.status === 'late'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                        }`}
                      >
                        {log.status === 'present' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {log.status === 'absent' && <XCircle className="w-3.5 h-3.5" />}
                        {log.status === 'late' && <Clock className="w-3.5 h-3.5" />}
                        {log.status === 'excused' && <FileCheck className="w-3.5 h-3.5" />}
                        <span className="capitalize">{log.status}</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
