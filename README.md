# EduPulse — Attendance Tracking & Uploading Portal 📊

A modern, full-featured web application designed for both **Teachers** and **Students** to track, mark, upload, and analyze attendance.

## 🚀 Features

### 👩‍🏫 Teacher Portal
- **Dashboard Analytics**: Real-time stats, attendance trends chart (Recharts), turnout by subject, and low-attendance (<75%) warning list.
- **Daily Attendance Marker**: Interactive student grid to mark `Present`, `Absent`, `Late`, or `Excused` with single-click batch actions.
- **Bulk CSV Uploading**: Drag-and-drop file uploader with PapaParse parsing, downloadable sample template (`sample_attendance_template.csv`), preview table, and validation checks.
- **Live Passcode Generator**: Generate 6-digit self check-in codes with 10-minute countdown timers for in-class student check-in.
- **Reports & Analytics**: Filter attendance records by subject or threshold; export official reports to CSV or print to PDF.
- **Leave Request Approvals**: Review medical certificates and excuse applications submitted by students.

### 👨‍🎓 Student Portal
- **My Attendance Overview**: Visual attendance ring gauge, target warning banner (<75%), and subject-wise breakdown progress bars.
- **Self Check-in**: Enter active 6-digit session code broadcasted by professor during class.
- **Leave Applications**: Submit medical or personal leave requests with file attachments.
- **Attendance History**: Complete filterable log of past attendance records.

---

## 🛠️ How to Run

1. Open Terminal and navigate to the project directory:
   ```bash
   cd ~/Desktop/attendance-tracker
   ```

2. Start the development web server:
   ```bash
   npm run dev
   ```

3. Open the URL displayed in the terminal (usually `http://localhost:3000`).

---

## 🎨 Technology Stack & Design Palette
- **Frontend Framework**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS + Custom Glassmorphism Theme
- **Color Palette**: Deep Slate (`slate-950`), Emerald Accent (`emerald-500`), Indigo Accent (`indigo-500`), Rose Alerts (`rose-500`)
- **Charts & Visuals**: Recharts + Canvas Confetti + Lucide React Icons
- **Data Persistence**: Browser `LocalStorage` with instant "Reset Demo Data" option.
