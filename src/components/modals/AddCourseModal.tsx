import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, BookPlus } from 'lucide-react';

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddCourseModal: React.FC<AddCourseModalProps> = ({ isOpen, onClose }) => {
  const { addCourse, currentTeacher } = useApp();

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [schedule, setSchedule] = useState('Mon, Wed 10:00 AM');
  const [totalClasses, setTotalClasses] = useState(24);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !name) return;

    addCourse({
      code,
      name,
      teacherId: currentTeacher.id,
      schedule,
      totalClasses,
    });

    setCode('');
    setName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="p-6 rounded-2xl glass-panel border border-slate-700 max-w-md w-full space-y-4 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <BookPlus className="w-5 h-5 text-indigo-400" />
            <span>Add New Course / Subject</span>
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-400 mb-1">Course Code</label>
            <input
              type="text"
              placeholder="e.g. CS404"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 p-2.5 rounded-xl focus:outline-none focus:border-indigo-500 font-mono"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-400 mb-1">Course Name</label>
            <input
              type="text"
              placeholder="e.g. Artificial Intelligence & ML"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 p-2.5 rounded-xl focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-400 mb-1">Class Schedule</label>
            <input
              type="text"
              placeholder="e.g. Mon, Wed 10:00 AM"
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 p-2.5 rounded-xl focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-400 mb-1">Total Scheduled Classes</label>
            <input
              type="number"
              value={totalClasses}
              onChange={(e) => setTotalClasses(parseInt(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 p-2.5 rounded-xl focus:outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold bg-slate-800 text-slate-300 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md"
            >
              Create Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
