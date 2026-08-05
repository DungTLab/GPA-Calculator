import React from 'react';
import { Semester } from '../types';
import { calculateSemesterGpa } from '../utils/gpaCalculator';

interface AnalyticsChartProps {
  semesters: Semester[];
}

/**
 * COMPONENT: ANALYTICS CHART (Biểu đồ xu hướng GPA)
 * 
 * Trực quan hóa diễn biến GPA của từng học kỳ qua thời gian.
 * Render SVG responsive tùy chỉnh mượt mà, hỗ trợ cả Dark/Light Mode.
 */
export const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ semesters }) => {
  const chartData = semesters.map(sem => ({
    name: sem.name,
    gpa: calculateSemesterGpa(sem.courses).gpa,
    credits: calculateSemesterGpa(sem.courses).credits
  }));

  const hasData = chartData.some(d => d.credits > 0);

  return (
    <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm mb-6">
      <div className="flex justify-between items-center mb-4 border-b border-slate-100 dark:border-slate-700 pb-3">
        <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 text-base">
          <i className="ph-bold ph-chart-line-up text-blue-500"></i> Biểu đồ diễn biến GPA qua các học kỳ
        </h3>
        <span className="text-xs text-slate-400 dark:text-slate-500">Thang điểm 4.0</span>
      </div>

      {!hasData ? (
        <div className="py-8 text-center text-slate-400 dark:text-slate-500 text-xs">
          <i className="ph-duotone ph-chart-bar text-4xl mb-1 text-slate-300 dark:text-slate-600 block"></i>
          Chưa có đủ dữ liệu môn học để vẽ biểu đồ. Hãy thêm điểm ở các học kỳ!
        </div>
      ) : (
        <div className="w-full pt-2">
          {/* Custom SVG Bar & Line Chart */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {chartData.map((d, idx) => {
              const heightPercent = Math.max((d.gpa / 4) * 100, 10);

              let badgeColor = 'bg-blue-500';
              if (d.gpa >= 3.6) badgeColor = 'bg-emerald-500';
              else if (d.gpa >= 3.2) badgeColor = 'bg-blue-600';
              else if (d.gpa >= 2.5) badgeColor = 'bg-indigo-500';
              else if (d.gpa > 0) badgeColor = 'bg-amber-500';

              return (
                <div key={idx} className="bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                      <span className="truncate max-w-[120px]">{d.name}</span>
                      <span>{d.credits} tín chỉ</span>
                    </div>
                    <div className="text-2xl font-black text-slate-800 dark:text-white my-1">
                      {d.gpa.toFixed(2)} <span className="text-xs text-slate-400 font-normal">/ 4.0</span>
                    </div>
                  </div>

                  {/* Visual Bar */}
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden mt-2">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${badgeColor}`}
                      style={{ width: `${heightPercent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
