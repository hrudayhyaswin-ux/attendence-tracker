export type Role = 'teacher' | 'student';

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface Student {
  id: string;
  name: string;
  rollNo: string;
  email: string;
  avatar: string;
  department: string;
  semester: number;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  avatar: string;
  department: string;
  title: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  teacherId: string;
  schedule: string;
  totalClasses: number;
}

export interface AttendanceRecord {
  id: string;
  courseId: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  notes?: string;
  markedBy: string; // 'teacher' or 'student-passcode' or 'csv-upload'
  timestamp: string;
}

export interface ActiveSession {
  code: string;
  courseId: string;
  createdAt: string;
  expiresAt: string;
  active: boolean;
}

export interface LeaveApplication {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  startDate: string;
  endDate: string;
  reason: string;
  category: 'medical' | 'personal' | 'academic' | 'other';
  documentName?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export interface CSVAttendanceRow {
  rollNo: string;
  studentName?: string;
  courseCode: string;
  date: string;
  status: string;
  notes?: string;
}
