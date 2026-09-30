import { Student, Teacher, Course, AttendanceRecord, LeaveApplication } from '../types';

export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 't1',
    name: 'Dr. Sarah Jenkins',
    email: 's.jenkins@university.edu',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    department: 'Computer Science & Engineering',
    title: 'Associate Professor',
  },
  {
    id: 't2',
    name: 'Prof. Marcus Vance',
    email: 'm.vance@university.edu',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    department: 'Software Engineering',
    title: 'Head of Department',
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 's1',
    name: 'Alex Rivera',
    rollNo: 'CS-2024-042',
    email: 'alex.rivera@student.edu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department: 'Computer Science',
    semester: 4,
  },
  {
    id: 's2',
    name: 'Liam Chen',
    rollNo: 'CS-2024-015',
    email: 'liam.chen@student.edu',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    department: 'Computer Science',
    semester: 4,
  },
  {
    id: 's3',
    name: 'Sophia Patel',
    rollNo: 'CS-2024-089',
    email: 'sophia.patel@student.edu',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    department: 'Computer Science',
    semester: 4,
  },
  {
    id: 's4',
    name: 'Ethan Dubois',
    rollNo: 'CS-2024-033',
    email: 'ethan.dubois@student.edu',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    department: 'Computer Science',
    semester: 4,
  },
  {
    id: 's5',
    name: 'Emma Watson',
    rollNo: 'CS-2024-104',
    email: 'emma.watson@student.edu',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    department: 'Computer Science',
    semester: 4,
  },
  {
    id: 's6',
    name: 'Noah Rodriguez',
    rollNo: 'CS-2024-071',
    email: 'noah.rodriguez@student.edu',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    department: 'Computer Science',
    semester: 4,
  }
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'c1',
    code: 'CS101',
    name: 'Data Structures & Algorithms',
    teacherId: 't1',
    schedule: 'Mon, Wed 09:00 AM',
    totalClasses: 28,
  },
  {
    id: 'c2',
    code: 'CS202',
    name: 'Full-Stack Web Development',
    teacherId: 't1',
    schedule: 'Tue, Thu 11:30 AM',
    totalClasses: 24,
  },
  {
    id: 'c3',
    code: 'CS303',
    name: 'Database Management Systems',
    teacherId: 't2',
    schedule: 'Mon, Fri 02:00 PM',
    totalClasses: 26,
  }
];

// Helper to generate past 14 days of realistic attendance
const today = new Date();
const formatDate = (d: Date) => d.toISOString().split('T')[0];

const generateInitialAttendance = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const courses = ['c1', 'c2', 'c3'];
  const students = ['s1', 's2', 's3', 's4', 's5', 's6'];
  
  // Generate for past 10 working days
  let count = 0;
  for (let i = 14; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    // skip weekends
    if (d.getDay() === 0 || d.getDay() === 6) continue;

    const dateStr = formatDate(d);

    courses.forEach(courseId => {
      students.forEach(studentId => {
        count++;
        // Determine status with realistic distribution (mostly present, some late/absent)
        let status: 'present' | 'absent' | 'late' | 'excused' = 'present';
        
        // Give Alex Rivera (s1) slightly low attendance in c3 for low-attendance alert testing
        if (studentId === 's1' && courseId === 'c3' && (i === 2 || i === 5 || i === 8 || i === 11)) {
          status = 'absent';
        } else if (studentId === 's4' && (i === 3 || i === 9)) {
          status = 'absent';
        } else if (studentId === 's6' && i === 1) {
          status = 'late';
        } else if (studentId === 's2' && i === 4) {
          status = 'excused';
        } else if (Math.random() < 0.08) {
          status = 'late';
        } else if (Math.random() < 0.05) {
          status = 'absent';
        }

        records.push({
          id: `att-${count}`,
          courseId,
          studentId,
          date: dateStr,
          status,
          markedBy: i === 0 ? 'teacher' : (count % 3 === 0 ? 'student-passcode' : 'teacher'),
          timestamp: new Date(d.getTime() + 9 * 3600 * 1000).toISOString(),
        });
      });
    });
  }

  return records;
};

export const INITIAL_ATTENDANCE: AttendanceRecord[] = generateInitialAttendance();

export const INITIAL_LEAVES: LeaveApplication[] = [
  {
    id: 'l1',
    studentId: 's1',
    studentName: 'Alex Rivera',
    courseId: 'c3',
    startDate: formatDate(new Date(Date.now() - 86400000 * 3)),
    endDate: formatDate(new Date(Date.now() - 86400000 * 2)),
    reason: 'Severe flu and fever. Doctor recommended 2 days rest.',
    category: 'medical',
    documentName: 'medical_certificate_alex.pdf',
    status: 'approved',
    submittedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'l2',
    studentId: 's4',
    studentName: 'Ethan Dubois',
    courseId: 'c1',
    startDate: formatDate(new Date(Date.now() + 86400000)),
    endDate: formatDate(new Date(Date.now() + 86400000 * 2)),
    reason: 'Participating in Inter-University Hackathon Competition',
    category: 'academic',
    documentName: 'hackathon_permission_letter.pdf',
    status: 'pending',
    submittedAt: new Date().toISOString(),
  }
];
