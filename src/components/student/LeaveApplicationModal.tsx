import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FileText, Send, Upload, CheckCircle2 } from 'lucide-react';

export const LeaveApplicationModal: React.FC = () => {
  const { currentStudent, courses, submitLeaveApplication, leaves } = useApp();

  const [courseId, setCourseId] = useState<string>(courses[0]?.id || '');
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<'medical' | 'personal' | 'academic' | 'other'>('medical');
  const [reason, setReason] = useState<string>('');
  const [documentName, setDocumentName] = useState<string>('');

  const myLeaves = leaves.filter((l) => l.studentId === currentStudent.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason || !courseId) return;

    submitLeaveApplication({
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      courseId,
      startDate,
      endDate,
      category,
      reason,
      documentName: documentName || undefined,
    });

    setReason('');
    setDocumentName('');
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-2">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-indigo-400" />
          <span>Apply for Absence / Medical Leave</span>
        </h2>
        <p className="text-xs text-slate-400">
          Submit leave documentation to excuse absences in your subjects.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Card */}
        <div className="lg:col-span-2 p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white">New Leave Application</h3>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Select Subject</label>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-indigo-500"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} — {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Leave Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none"
              >
                <option value="medical">Medical / Health Reason</option>
                <option value="academic">Academic / Hackathon Event</option>
                <option value="personal">Personal / Family Emergency</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Detailed Reason</label>
              <textarea
                rows={3}
                placeholder="Explain the reason for your leave request..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Upload Document (Optional PDF / Medical Certificate)</label>
              <div className="flex items-center gap-3">
                <label className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl cursor-pointer border border-slate-700 flex items-center gap-2">
                  <Upload className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Choose File</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setDocumentName(e.target.files[0].name);
                      }
                    }}
                  />
                </label>
                <span className="text-slate-400 text-xs italic">
                  {documentName || 'No document selected'}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Submit Application</span>
            </button>
          </form>
        </div>

        {/* My Applications History List */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white">Application Status</h3>

          <div className="space-y-3">
            {myLeaves.length === 0 ? (
              <p className="text-xs text-slate-500 italic text-center py-4">No leave applications submitted yet.</p>
            ) : (
              myLeaves.map((l) => (
                <div key={l.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200">{l.startDate} to {l.endDate}</span>
                    <span
                      className={`px-2 py-0.5 font-bold rounded-full text-[10px] ${
                        l.status === 'approved'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : l.status === 'rejected'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {l.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-slate-400 line-clamp-2">{l.reason}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
