import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { AttendanceStatus } from '../../types';
import {
  CheckCircle2,
  XCircle,
  Clock,
  FileCheck,
  Search,
  Save,
  CheckCheck,
  Ban,
  Calendar as CalendarIcon,
} from 'lucide-react';

export const MarkAttendance: React.FC = () => {
  const { courses, students, attendance, markBatchAttendance } = useApp();

  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Local state map of studentId -> status
  const [statusMap, setStatusMap] = useState<Record<string, AttendanceStatus>>({});

  // Initialize statusMap whenever course or date changes
  useEffect(() => {
    const newMap: Record<string, AttendanceStatus> = {};
    students.forEach((s) => {
      // Find existing attendance for this student on selected course & date
      const existing = attendance.find(
        (a) => a.courseId === selectedCourseId && a.studentId === s.id && a.date === selectedDate
      );
      newMap[s.id] = existing ? existing.status : 'present'; // Default to present
    });
    setStatusMap(newMap);
  }, [selectedCourseId, selectedDate, attendance, students]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setStatusMap((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleMarkAll = (status: AttendanceStatus) => {
    const newMap: Record<string, AttendanceStatus> = {};
    students.forEach((s) => {
      newMap[s.id] = status;
    });
    setStatusMap(newMap);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId) return;
    markBatchAttendance(selectedCourseId, selectedDate, statusMap);
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);

  // Status counts summary
  const counts = {
    present: Object.values(statusMap).filter((s) => s === 'present').length,
    absent: Object.values(statusMap).filter((s) => s === 'absent').length,
    late: Object.values(statusMap).filter((s) => s === 'late').length,
    excused: Object.values(statusMap).filter((s) => s === 'excused').length,
  };

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-white">Daily Attendance Marker</h2>
            <p className="text-xs text-slate-400">
              Select class and date to record or modify student attendance.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleMarkAll('present')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/50 rounded-lg transition-all"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Mark All Present</span>
            </button>
            <button
              onClick={() => handleMarkAll('absent')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-rose-950/80 border border-rose-500/30 text-rose-400 hover:bg-rose-900/50 rounded-lg transition-all"
            >
              <Ban className="w-4 h-4" />
              <span>Mark All Absent</span>
            </button>
          </div>
        </div>

        {/* Selection Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Select Course */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Select Subject / Course
            </label>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-xl p-2.5 focus:outline-none focus:border-emerald-500 transition-all"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} — {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Select Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Attendance Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-xl p-2.5 focus:outline-none focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          {/* Search Student */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Search Student
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search by name or roll no..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-xl pl-9 p-2.5 focus:outline-none focus:border-emerald-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Live Counters */}
        <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-medium border-t border-slate-800/60">
          <span className="text-slate-400">Class Turnout Summary:</span>
          <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold">
            Present: {counts.present}
          </span>
          <span className="px-2.5 py-1 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 font-semibold">
            Absent: {counts.absent}
          </span>
          <span className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 font-semibold">
            Late: {counts.late}
          </span>
          <span className="px-2.5 py-1 rounded-md bg-sky-500/10 border border-sky-500/20 text-sky-400 font-semibold">
            Excused: {counts.excused}
          </span>
        </div>
      </div>

      {/* Student Grid / List Table */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">
            Students List ({filteredStudents.length}) — {selectedCourse?.code}
          </h3>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/30 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save & Submit Attendance</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs text-slate-400 uppercase border-b border-slate-800">
                <th className="pb-3 font-semibold">Student</th>
                <th className="pb-3 font-semibold">Roll Number</th>
                <th className="pb-3 font-semibold">Department</th>
                <th className="pb-3 font-semibold text-center">Status Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredStudents.map((student) => {
                const currentStatus = statusMap[student.id] || 'present';
                return (
                  <tr key={student.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 font-medium text-slate-200 flex items-center gap-3">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-700"
                      />
                      <div>
                        <p className="font-semibold text-white">{student.name}</p>
                        <p className="text-[11px] text-slate-400">{student.email}</p>
                      </div>
                    </td>
                    <td className="py-3 text-slate-300 font-mono text-xs">{student.rollNo}</td>
                    <td className="py-3 text-slate-400 text-xs">{student.department}</td>
                    <td className="py-3">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Present */}
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, 'present')}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            currentStatus === 'present'
                              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-400'
                              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Present</span>
                        </button>

                        {/* Absent */}
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, 'absent')}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            currentStatus === 'absent'
                              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 ring-2 ring-rose-400'
                              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                          }`}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Absent</span>
                        </button>

                        {/* Late */}
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, 'late')}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            currentStatus === 'late'
                              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30 ring-2 ring-amber-400'
                              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>Late</span>
                        </button>

                        {/* Excused */}
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, 'excused')}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            currentStatus === 'excused'
                              ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30 ring-2 ring-sky-400'
                              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                          }`}
                        >
                          <FileCheck className="w-3.5 h-3.5" />
                          <span>Excused</span>
                        </button>
                      </div>
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
