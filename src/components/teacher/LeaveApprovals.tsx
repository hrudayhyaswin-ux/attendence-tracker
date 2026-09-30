import React from 'react';
import { useApp } from '../../context/AppContext';
import { FileText, CheckCircle2, XCircle, Clock, FileDown } from 'lucide-react';

export const LeaveApprovals: React.FC = () => {
  const { leaves, updateLeaveStatus, courses } = useApp();

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-2">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-emerald-400" />
          <span>Student Leave Applications & Absence Approvals</span>
        </h2>
        <p className="text-xs text-slate-400">
          Review medical notes and excuse requests submitted by students. Approved leaves automatically excuse attendance for that date range.
        </p>
      </div>

      <div className="space-y-4">
        {leaves.length === 0 ? (
          <div className="p-8 text-center glass-panel rounded-2xl border border-slate-800 text-slate-400">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="font-semibold text-sm">No leave applications pending!</p>
          </div>
        ) : (
          leaves.map((leave) => {
            const course = courses.find((c) => c.id === leave.courseId);
            return (
              <div
                key={leave.id}
                className="p-6 rounded-2xl glass-panel border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-base font-bold text-white">{leave.studentName}</h3>
                    <span className="px-2.5 py-0.5 text-xs font-semibold bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 rounded-md">
                      {course?.code || 'Course'}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                        leave.status === 'approved'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : leave.status === 'rejected'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {leave.status.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300">
                    <strong className="text-slate-400">Leave Period:</strong> {leave.startDate} to {leave.endDate}
                  </p>

                  <p className="text-xs text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    <strong className="text-slate-300">Reason ({leave.category}):</strong> {leave.reason}
                  </p>

                  {leave.documentName && (
                    <div className="flex items-center gap-2 text-xs text-emerald-400">
                      <FileDown className="w-4 h-4" />
                      <span>Attachment: {leave.documentName}</span>
                    </div>
                  )}
                </div>

                {leave.status === 'pending' && (
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => updateLeaveStatus(leave.id, 'approved')}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/30 transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve & Excuse</span>
                    </button>
                    <button
                      onClick={() => updateLeaveStatus(leave.id, 'rejected')}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-950 hover:bg-rose-900 border border-rose-500/30 text-rose-300 font-semibold text-xs transition-all"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
