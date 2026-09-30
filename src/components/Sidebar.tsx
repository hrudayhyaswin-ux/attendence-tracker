import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  CheckSquare,
  UploadCloud,
  QrCode,
  BarChart3,
  FileText,
  KeyRound,
  History,
  UserPlus,
  BookPlus,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAddStudent: () => void;
  onOpenAddCourse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddStudent,
  onOpenAddCourse,
}) => {
  const { role, leaves } = useApp();
  const pendingLeavesCount = leaves.filter((l) => l.status === 'pending').length;

  const teacherNavItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'mark', label: 'Mark Attendance', icon: CheckSquare },
    { id: 'upload', label: 'Upload Attendance (CSV)', icon: UploadCloud },
    { id: 'live', label: 'Live Session Passcode', icon: QrCode },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'leaves', label: 'Leave Requests', icon: FileText, badge: pendingLeavesCount },
  ];

  const studentNavItems = [
    { id: 'dashboard', label: 'My Attendance Overview', icon: LayoutDashboard },
    { id: 'checkin', label: 'Self Check-in (Passcode)', icon: KeyRound },
    { id: 'leave', label: 'Apply for Leave', icon: FileText },
    { id: 'history', label: 'Attendance History', icon: History },
  ];

  const navItems = role === 'teacher' ? teacherNavItems : studentNavItems;

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-900/60 backdrop-blur-md shrink-0 hidden md:flex flex-col justify-between p-4">
      <div className="space-y-6">
        {/* Navigation Category Header */}
        <div>
          <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase px-3 mb-2">
            {role === 'teacher' ? 'Teacher Management' : 'Student Portal'}
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? role === 'teacher'
                        ? 'bg-emerald-600/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                        : 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? (role === 'teacher' ? 'text-emerald-400' : 'text-indigo-400') : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-2 py-0.5 text-xs font-bold bg-rose-500 text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick Admin Actions for Teacher */}
        {role === 'teacher' && (
          <div className="pt-4 border-t border-slate-800/80">
            <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase px-3 mb-2">
              Management
            </p>
            <div className="space-y-1.5">
              <button
                onClick={onOpenAddStudent}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-emerald-400 hover:bg-slate-800/60 rounded-xl transition-all"
              >
                <UserPlus className="w-4 h-4 text-emerald-500" />
                <span>Add New Student</span>
              </button>
              <button
                onClick={onOpenAddCourse}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-indigo-400 hover:bg-slate-800/60 rounded-xl transition-all"
              >
                <BookPlus className="w-4 h-4 text-indigo-500" />
                <span>Add New Course</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer System Info */}
      <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 text-xs text-slate-400 space-y-1">
        <div className="flex items-center justify-between font-medium">
          <span className="text-slate-300">System Status</span>
          <span className="flex items-center gap-1 text-emerald-400 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            Online
          </span>
        </div>
        <p className="text-[11px] text-slate-500">Local DB Active • Version 1.0</p>
      </div>
    </aside>
  );
};
