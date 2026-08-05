import React from 'react';
import { GpaResult, CumulativeGpaResult } from '../types';

interface StatsSummaryProps {
  semesterGpa: GpaResult;
  cumulativeGpa: CumulativeGpaResult;
  semesterName: string;
}

/**
 * BÀI HỌC REACT: PRESENTATIONAL COMPONENTS
 * 
 * Component này nhận dữ liệu kết quả từ Props và chỉ đảm nhận việc render UI đẹp mắt.
 * Tách biệt hoàn toàn phần Logic tính toán (Hook/Utils) khỏi giao diện (JSX).
 */
export const StatsSummary: React.FC<StatsSummaryProps> = ({
  semesterGpa,
  cumulativeGpa,
  semesterName
}) => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {/* Semester GPA Card */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-900 rounded-2xl p-5 text-white shadow-lg shadow-blue-500/10 relative overflow-hidden flex flex-col justify-between">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-28 h-28 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

        <div>
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-blue-100/90 flex items-center gap-1.5">
              <i className="ph-fill ph-bookmarks"></i> GPA Học kỳ ({semesterName})
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/20 font-bold backdrop-blur-sm">
              {semesterGpa.rank}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              {semesterGpa.gpa.toFixed(2)}
            </span>
            <span className="text-blue-200 text-sm font-medium">/ 4.00</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/15 flex justify-between items-center text-xs text-blue-100">
          <span>Tổng số tín chỉ học kỳ:</span>
          <span className="font-bold text-sm text-white">{semesterGpa.credits} tín chỉ</span>
        </div>
      </div>

      {/* Cumulative GPA Card */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 dark:from-emerald-700 dark:to-teal-900 rounded-2xl p-5 text-white shadow-lg shadow-emerald-500/10 relative overflow-hidden flex flex-col justify-between">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-28 h-28 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

        <div>
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-emerald-100/90 flex items-center gap-1.5">
              <i className="ph-fill ph-trophy"></i> GPA Tích lũy (Toàn khóa)
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/20 font-bold backdrop-blur-sm">
              {cumulativeGpa.rank}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              {cumulativeGpa.gpa.toFixed(2)}
            </span>
            <span className="text-emerald-200 text-sm font-medium">/ 4.00</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/15 flex justify-between items-center text-xs text-emerald-100">
          <span>Tích lũy {cumulativeGpa.totalSemesters} kỳ:</span>
          <span className="font-bold text-sm text-white">{cumulativeGpa.credits} tín chỉ</span>
        </div>
      </div>
    </div>
  );
};
