import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Role,
  Student,
  Teacher,
  Course,
  AttendanceRecord,
  LeaveApplication,
  ActiveSession,
  CSVAttendanceRow,
  AttendanceStatus,
} from '../types';
import {
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
  INITIAL_COURSES,
  INITIAL_ATTENDANCE,
  INITIAL_LEAVES,
} from '../data/mockData';
import confetti from 'canvas-confetti';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  currentTeacher: Teacher;
  currentStudent: Student;
  setCurrentTeacherId: (id: string) => void;
  setCurrentStudentId: (id: string) => void;
  students: Student[];
  teachers: Teacher[];
  courses: Course[];
  attendance: AttendanceRecord[];
  leaves: LeaveApplication[];
  activeSession: ActiveSession | null;
  toasts: Toast[];
  addToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
  
  // Actions
  markSingleAttendance: (courseId: string, studentId: string, date: string, status: AttendanceStatus, notes?: string) => void;
  markBatchAttendance: (courseId: string, date: string, statusMap: Record<string, AttendanceStatus>) => void;
  importCSVAttendance: (rows: CSVAttendanceRow[]) => { successCount: number; errorCount: number; errors: string[] };
  createLiveSession: (courseId: string) => string;
  endLiveSession: () => void;
  checkInWithPasscode: (code: string) => { success: boolean; message: string };
  addStudent: (student: Omit<Student, 'id'>) => void;
  addCourse: (course: Omit<Course, 'id'>) => void;
  submitLeaveApplication: (leave: Omit<LeaveApplication, 'id' | 'status' | 'submittedAt'>) => void;
  updateLeaveStatus: (leaveId: string, status: 'approved' | 'rejected') => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ROLE: 'ep_role',
  TEACHER_ID: 'ep_teacher_id',
  STUDENT_ID: 'ep_student_id',
  STUDENTS: 'ep_students',
  COURSES: 'ep_courses',
  ATTENDANCE: 'ep_attendance',
  LEAVES: 'ep_leaves',
  SESSION: 'ep_active_session',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<Role>(() => {
    return (localStorage.getItem(STORAGE_KEYS.ROLE) as Role) || 'teacher';
  });

  const [teacherId, setTeacherId] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.TEACHER_ID) || 't1';
  });

  const [studentId, setStudentId] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.STUDENT_ID) || 's1';
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [teachers] = useState<Teacher[]>(INITIAL_TEACHERS);

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COURSES);
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [leaves, setLeaves] = useState<LeaveApplication[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LEAVES);
    return saved ? JSON.parse(saved) : INITIAL_LEAVES;
  });

  const [activeSession, setActiveSession] = useState<ActiveSession | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SESSION);
    return saved ? JSON.parse(saved) : null;
  });

  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TEACHER_ID, teacherId);
  }, [teacherId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENT_ID, studentId);
  }, [studentId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LEAVES, JSON.stringify(leaves));
  }, [leaves]);

  useEffect(() => {
    if (activeSession) {
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(activeSession));
    } else {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    }
  }, [activeSession]);

  const addToast = (message: string, type: Toast['type'] = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    addToast(`Switched to ${newRole === 'teacher' ? 'Teacher Portal' : 'Student Portal'}`, 'info');
  };

  const currentTeacher = teachers.find((t) => t.id === teacherId) || teachers[0];
  const currentStudent = students.find((s) => s.id === studentId) || students[0];

  const markSingleAttendance = (
    courseId: string,
    studentId: string,
    date: string,
    status: AttendanceStatus,
    notes?: string
  ) => {
    setAttendance((prev) => {
      const existingIdx = prev.findIndex(
        (a) => a.courseId === courseId && a.studentId === studentId && a.date === date
      );
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          status,
          notes: notes || updated[existingIdx].notes,
          timestamp: new Date().toISOString(),
        };
        return updated;
      } else {
        const newRecord: AttendanceRecord = {
          id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          courseId,
          studentId,
          date,
          status,
          notes,
          markedBy: 'teacher',
          timestamp: new Date().toISOString(),
        };
        return [newRecord, ...prev];
      }
    });
  };

  const markBatchAttendance = (courseId: string, date: string, statusMap: Record<string, AttendanceStatus>) => {
    const course = courses.find((c) => c.id === courseId);
    let updatedCount = 0;
    
    setAttendance((prev) => {
      const newArr = [...prev];
      Object.entries(statusMap).forEach(([stId, status]) => {
        const idx = newArr.findIndex((a) => a.courseId === courseId && a.studentId === stId && a.date === date);
        if (idx >= 0) {
          newArr[idx] = {
            ...newArr[idx],
            status,
            timestamp: new Date().toISOString(),
          };
        } else {
          newArr.push({
            id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            courseId,
            studentId: stId,
            date,
            status,
            markedBy: 'teacher',
            timestamp: new Date().toISOString(),
          });
        }
        updatedCount++;
      });
      return newArr;
    });

    addToast(`Saved attendance for ${updatedCount} students in ${course?.code || 'course'}`, 'success');
  };

  const importCSVAttendance = (rows: CSVAttendanceRow[]) => {
    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    const newRecords: AttendanceRecord[] = [];

    rows.forEach((row, index) => {
      const rowNum = index + 1;
      if (!row.rollNo || !row.courseCode || !row.date || !row.status) {
        errors.push(`Row ${rowNum}: Missing required fields (rollNo, courseCode, date, status)`);
        errorCount++;
        return;
      }

      // Match student by Roll No
      const student = students.find(
        (s) => s.rollNo.trim().toLowerCase() === row.rollNo.trim().toLowerCase()
      );
      if (!student) {
        errors.push(`Row ${rowNum}: Student with Roll No "${row.rollNo}" not found`);
        errorCount++;
        return;
      }

      // Match course by Code
      const course = courses.find(
        (c) => c.code.trim().toLowerCase() === row.courseCode.trim().toLowerCase()
      );
      if (!course) {
        errors.push(`Row ${rowNum}: Course Code "${row.courseCode}" not found`);
        errorCount++;
        return;
      }

      // Validate Status
      const statusNormalized = row.status.trim().toLowerCase();
      let finalStatus: AttendanceStatus = 'present';
      if (['present', 'p', '1', 'yes'].includes(statusNormalized)) finalStatus = 'present';
      else if (['absent', 'a', '0', 'no'].includes(statusNormalized)) finalStatus = 'absent';
      else if (['late', 'l'].includes(statusNormalized)) finalStatus = 'late';
      else if (['excused', 'e'].includes(statusNormalized)) finalStatus = 'excused';
      else {
        errors.push(`Row ${rowNum}: Invalid status "${row.status}". Use Present, Absent, Late, or Excused.`);
        errorCount++;
        return;
      }

      newRecords.push({
        id: `att-csv-${Date.now()}-${index}`,
        courseId: course.id,
        studentId: student.id,
        date: row.date.trim(),
        status: finalStatus,
        notes: row.notes || 'Imported via CSV',
        markedBy: 'csv-upload',
        timestamp: new Date().toISOString(),
      });
      successCount++;
    });

    if (newRecords.length > 0) {
      setAttendance((prev) => {
        const map = new Map<string, AttendanceRecord>();
        prev.forEach((rec) => map.set(`${rec.courseId}-${rec.studentId}-${rec.date}`, rec));
        newRecords.forEach((rec) => map.set(`${rec.courseId}-${rec.studentId}-${rec.date}`, rec));
        return Array.from(map.values());
      });
      addToast(`Successfully imported ${successCount} attendance records!`, 'success');
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    }

    return { successCount, errorCount, errors };
  };

  const createLiveSession = (courseId: string) => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes
    const session: ActiveSession = {
      code,
      courseId,
      createdAt: new Date().toISOString(),
      expiresAt,
      active: true,
    };
    setActiveSession(session);
    addToast(`Live session code ${code} generated! Expires in 10 mins.`, 'success');
    return code;
  };

  const endLiveSession = () => {
    setActiveSession(null);
    addToast('Live session ended.', 'info');
  };

  const checkInWithPasscode = (code: string) => {
    if (!activeSession || !activeSession.active) {
      return { success: false, message: 'No active check-in session right now.' };
    }

    if (new Date() > new Date(activeSession.expiresAt)) {
      setActiveSession(null);
      return { success: false, message: 'Session passcode has expired.' };
    }

    if (code.trim() !== activeSession.code) {
      return { success: false, message: 'Invalid 6-digit session code. Please try again.' };
    }

    const todayStr = new Date().toISOString().split('T')[0];
    markSingleAttendance(activeSession.courseId, currentStudent.id, todayStr, 'present', 'Self check-in via passcode');

    confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    addToast(`Checked in successfully for ${courses.find(c => c.id === activeSession.courseId)?.code || 'class'}!`, 'success');
    return { success: true, message: 'Attendance marked successfully!' };
  };

  const addStudent = (newSt: Omit<Student, 'id'>) => {
    const student: Student = {
      ...newSt,
      id: `s${Date.now()}`,
    };
    setStudents((prev) => [...prev, student]);
    addToast(`Added new student: ${student.name}`, 'success');
  };

  const addCourse = (newCr: Omit<Course, 'id'>) => {
    const course: Course = {
      ...newCr,
      id: `c${Date.now()}`,
    };
    setCourses((prev) => [...prev, course]);
    addToast(`Created new course: ${course.code} - ${course.name}`, 'success');
  };

  const submitLeaveApplication = (leave: Omit<LeaveApplication, 'id' | 'status' | 'submittedAt'>) => {
    const newLeave: LeaveApplication = {
      ...leave,
      id: `leave-${Date.now()}`,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };
    setLeaves((prev) => [newLeave, ...prev]);
    addToast('Leave application submitted successfully!', 'success');
  };

  const updateLeaveStatus = (leaveId: string, status: 'approved' | 'rejected') => {
    setLeaves((prev) =>
      prev.map((l) => {
        if (l.id === leaveId) {
          if (status === 'approved') {
            // Also automatically mark student as excused for dates in range if date fits
            const courseId = l.courseId;
            const studentId = l.studentId;
            let d = new Date(l.startDate);
            const endDate = new Date(l.endDate);
            while (d <= endDate) {
              const dateStr = d.toISOString().split('T')[0];
              markSingleAttendance(courseId, studentId, dateStr, 'excused', `Approved Leave: ${l.reason}`);
              d.setDate(d.getDate() + 1);
            }
          }
          return { ...l, status };
        }
        return l;
      })
    );
    addToast(`Leave request ${status}`, status === 'approved' ? 'success' : 'info');
  };

  const resetDemoData = () => {
    localStorage.clear();
    setStudents(INITIAL_STUDENTS);
    setCourses(INITIAL_COURSES);
    setAttendance(INITIAL_ATTENDANCE);
    setLeaves(INITIAL_LEAVES);
    setActiveSession(null);
    setRoleState('teacher');
    setTeacherId('t1');
    setStudentId('s1');
    addToast('Reset to original demo dataset!', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        currentTeacher,
        currentStudent,
        setCurrentTeacherId: setTeacherId,
        setCurrentStudentId: setStudentId,
        students,
        teachers,
        courses,
        attendance,
        leaves,
        activeSession,
        toasts,
        addToast,
        removeToast,
        markSingleAttendance,
        markBatchAttendance,
        importCSVAttendance,
        createLiveSession,
        endLiveSession,
        checkInWithPasscode,
        addStudent,
        addCourse,
        submitLeaveApplication,
        updateLeaveStatus,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
