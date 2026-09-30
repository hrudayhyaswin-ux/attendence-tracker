import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ToastContainer } from './components/ToastContainer';

// Teacher Views
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { MarkAttendance } from './components/teacher/MarkAttendance';
import { BulkUpload } from './components/teacher/BulkUpload';
import { LiveSessionModal } from './components/teacher/LiveSessionModal';
import { ReportsAnalytics } from './components/teacher/ReportsAnalytics';
import { LeaveApprovals } from './components/teacher/LeaveApprovals';

// Student Views
import { StudentDashboard } from './components/student/StudentDashboard';
import { SelfCheckIn } from './components/student/SelfCheckIn';
import { LeaveApplicationModal } from './components/student/LeaveApplicationModal';
import { StudentHistory } from './components/student/StudentHistory';

// Modals
import { AddStudentModal } from './components/modals/AddStudentModal';
import { AddCourseModal } from './components/modals/AddCourseModal';

const MainContent: React.FC = () => {
  const { role } = useApp();
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);

  // Sync tab defaults if role switches
  React.useEffect(() => {
    setActiveTab('dashboard');
  }, [role]);

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 overflow-hidden selection:bg-emerald-500 selection:text-white">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenAddStudent={() => setIsAddStudentOpen(true)}
          onOpenAddCourse={() => setIsAddCourseOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {role === 'teacher' ? (
            <>
              {activeTab === 'dashboard' && <TeacherDashboard onNavigate={setActiveTab} />}
              {activeTab === 'mark' && <MarkAttendance />}
              {activeTab === 'upload' && <BulkUpload />}
              {activeTab === 'live' && <LiveSessionModal />}
              {activeTab === 'reports' && <ReportsAnalytics />}
              {activeTab === 'leaves' && <LeaveApprovals />}
            </>
          ) : (
            <>
              {activeTab === 'dashboard' && <StudentDashboard onNavigate={setActiveTab} />}
              {activeTab === 'checkin' && <SelfCheckIn />}
              {activeTab === 'leave' && <LeaveApplicationModal />}
              {activeTab === 'history' && <StudentHistory />}
            </>
          )}
        </main>
      </div>

      {/* Global Modals */}
      <AddStudentModal isOpen={isAddStudentOpen} onClose={() => setIsAddStudentOpen(false)} />
      <AddCourseModal isOpen={isAddCourseOpen} onClose={() => setIsAddCourseOpen(false)} />
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;
