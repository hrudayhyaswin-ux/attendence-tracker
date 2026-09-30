import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CSVAttendanceRow } from '../../types';
import Papa from 'papaparse';
import {
  UploadCloud,
  FileSpreadsheet,
  Download,
  AlertCircle,
  CheckCircle2,
  FileCheck,
  RefreshCw,
} from 'lucide-react';

export const BulkUpload: React.FC = () => {
  const { importCSVAttendance, students, courses } = useApp();

  const [parsedRows, setParsedRows] = useState<CSVAttendanceRow[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [importResult, setImportResult] = useState<{
    successCount: number;
    errorCount: number;
    errors: string[];
  } | null>(null);

  const handleFileUpload = (file: File) => {
    if (!file) return;
    setFileName(file.name);
    setImportResult(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows: CSVAttendanceRow[] = results.data.map((r: any) => ({
          rollNo: r.RollNo || r.rollNo || r['Roll Number'] || '',
          studentName: r.StudentName || r.studentName || r['Student Name'] || '',
          courseCode: r.CourseCode || r.courseCode || r['Course Code'] || '',
          date: r.Date || r.date || new Date().toISOString().split('T')[0],
          status: r.Status || r.status || 'Present',
          notes: r.Notes || r.notes || '',
        }));
        setParsedRows(rows);
      },
      error: (err) => {
        alert(`Failed to parse CSV file: ${err.message}`);
      },
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const downloadSampleTemplate = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const sampleCSV = `RollNo,StudentName,CourseCode,Date,Status,Notes
CS-2024-042,Alex Rivera,CS101,${todayStr},Present,On time
CS-2024-015,Liam Chen,CS101,${todayStr},Present,On time
CS-2024-089,Sophia Patel,CS101,${todayStr},Absent,Unexcused
CS-2024-033,Ethan Dubois,CS202,${todayStr},Late,10 mins delay
CS-2024-104,Emma Watson,CS202,${todayStr},Excused,Sick leave`;

    const blob = new Blob([sampleCSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'sample_attendance_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExecuteImport = () => {
    if (parsedRows.length === 0) return;
    const result = importCSVAttendance(parsedRows);
    setImportResult(result);
  };

  const handleReset = () => {
    setParsedRows([]);
    setFileName('');
    setImportResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <UploadCloud className="w-6 h-6 text-emerald-400" />
              <span>Bulk Attendance CSV Uploader</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Upload spreadsheets or CSV files to import attendance records in bulk for any class or date.
            </p>
          </div>

          <button
            onClick={downloadSampleTemplate}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-emerald-400 bg-emerald-950/80 hover:bg-emerald-900/60 border border-emerald-500/30 rounded-xl transition-all shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Download Sample CSV Template</span>
          </button>
        </div>
      </div>

      {/* Drag & Drop File Upload Zone */}
      {parsedRows.length === 0 ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`p-10 rounded-2xl border-2 border-dashed text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-4 ${
            isDragging
              ? 'border-emerald-400 bg-emerald-950/20 scale-[1.01]'
              : 'border-slate-800 hover:border-slate-700 bg-slate-900/40'
          }`}
        >
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-inner">
            <FileSpreadsheet className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-white">Drag & drop your CSV file here</h3>
            <p className="text-xs text-slate-400 mt-1">
              Supports <strong className="text-slate-200">.csv</strong> files with columns: RollNo, CourseCode, Date, Status
            </p>
          </div>

          <label className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm cursor-pointer shadow-lg shadow-emerald-600/30 transition-all">
            <span>Browse Computer</span>
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
            />
          </label>
        </div>
      ) : (
        /* Preview Table & Validation */
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="w-6 h-6 text-emerald-400" />
              <div>
                <h3 className="text-lg font-bold text-white">{fileName}</h3>
                <p className="text-xs text-slate-400">
                  Parsed <strong className="text-white">{parsedRows.length}</strong> attendance records ready for import
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-xl transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Upload Another File</span>
              </button>
              <button
                onClick={handleExecuteImport}
                className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg shadow-emerald-600/30 transition-all"
              >
                <FileCheck className="w-4 h-4" />
                <span>Confirm & Import Records</span>
              </button>
            </div>
          </div>

          {/* Import Execution Result Alert */}
          {importResult && (
            <div
              className={`p-4 rounded-xl border text-sm space-y-2 ${
                importResult.errorCount === 0
                  ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200'
                  : 'bg-amber-950/80 border-amber-500/40 text-amber-200'
              }`}
            >
              <div className="flex items-center gap-2 font-bold">
                {importResult.errorCount === 0 ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                )}
                <span>
                  Import Completed: {importResult.successCount} successful, {importResult.errorCount} failed.
                </span>
              </div>
              {importResult.errors.length > 0 && (
                <ul className="list-disc list-inside text-xs space-y-1 text-slate-300">
                  {importResult.errors.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Table Preview */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs text-slate-400 uppercase border-b border-slate-800">
                  <th className="pb-3 font-semibold">#</th>
                  <th className="pb-3 font-semibold">Roll Number</th>
                  <th className="pb-3 font-semibold">Student Name</th>
                  <th className="pb-3 font-semibold">Course Code</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Validation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {parsedRows.map((row, idx) => {
                  const studentExists = students.some(
                    (s) => s.rollNo.trim().toLowerCase() === (row.rollNo || '').trim().toLowerCase()
                  );
                  const courseExists = courses.some(
                    (c) => c.code.trim().toLowerCase() === (row.courseCode || '').trim().toLowerCase()
                  );
                  const isValid = studentExists && courseExists;

                  return (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 text-xs text-slate-500">{idx + 1}</td>
                      <td className="py-3 font-mono text-xs text-emerald-400 font-semibold">
                        {row.rollNo || '—'}
                      </td>
                      <td className="py-3 text-slate-200">{row.studentName || 'Auto-matched'}</td>
                      <td className="py-3 font-semibold text-indigo-400">{row.courseCode || '—'}</td>
                      <td className="py-3 text-slate-400 text-xs">{row.date}</td>
                      <td className="py-3">
                        <span
                          className={`px-2.5 py-1 text-xs font-semibold rounded-md ${
                            (row.status || '').toLowerCase().startsWith('p')
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : (row.status || '').toLowerCase().startsWith('a')
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        {isValid ? (
                          <span className="text-xs font-semibold text-emerald-400 flex items-center justify-end gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Valid
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-rose-400 flex items-center justify-end gap-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            {!studentExists ? 'Unmatched Roll' : 'Unmatched Code'}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
