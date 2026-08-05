import React, { useState } from 'react';
import { Semester, TargetPlannerResult } from '../types';
import { calculateTargetGpaPlan } from '../utils/gpaCalculator';

interface TargetPlannerProps {
  semesters: Semester[];
}

/**
 * COMPONENT: TARGET GPA PLANNER
 * 
 * Giúp sinh viên hoạch định chiến lược học tập:
 * Nhập GPA mục tiêu (VD: 3.6 Xuất sắc) + Số tín chỉ còn lại -> Tính điểm GPA trung bình bắt buộc phải đạt!
 */
export const TargetPlanner: React.FC<TargetPlannerProps> = ({ semesters }) => {
  const [targetGpa, setTargetGpa] = useState<number>(3.6);
  const [remainingCredits, setRemainingCredits] = useState<number>(30);
  const [result, setResult] = useState<TargetPlannerResult | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const res = calculateTargetGpaPlan(semesters, Number(targetGpa), Number(remainingCredits));
    setResult(res);
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm mb-6">
      <div className="flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-slate-700 pb-3">
        <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl">
          <i className="ph-bold ph-target text-xl"></i>
        </div>
        <div>
          <h3 className="font-bold text-slate-800 dark:text-white text-base">
            Công cụ lập kế hoạch GPA mục tiêu
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Dự đoán điểm trung bình cần đạt trong các tín chỉ tiếp theo
          </p>
        </div>
      </div>

      <form onSubmit={handleCalculate} className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
            GPA Mục tiêu mong muốn
          </label>
          <input
            type="number"
            min="0"
            max="4"
            step="0.05"
            value={targetGpa}
            onChange={e => setTargetGpa(Number(e.target.value))}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-blue-600 dark:text-blue-400 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
            Số tín chỉ còn lại
          </label>
          <input
            type="number"
            min="1"
            step="1"
            value={remainingCredits}
            onChange={e => setRemainingCredits(Number(e.target.value))}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white outline-none"
            required
          />
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            className="w-full py-2 px-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-md shadow-amber-500/20 text-sm transition-all flex items-center justify-center gap-2"
          >
            <i className="ph-bold ph-calculator"></i> Tính kết quả
          </button>
        </div>
      </form>

      {/* Result Display */}
      {result && (
        <div
          className={`p-4 rounded-xl text-xs sm:text-sm animate-fade-in border ${
            result.isAchievable
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
              : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
          }`}
        >
          <div className="flex items-start gap-2.5">
            <i
              className={`text-xl mt-0.5 ${
                result.isAchievable ? 'ph-fill ph-check-circle text-emerald-500' : 'ph-fill ph-warning-circle text-rose-500'
              }`}
            ></i>
            <div>
              <p className="font-bold text-sm mb-1">
                {result.isAchievable ? 'Mục tiêu hoàn toàn KHẢ THI!' : 'Mục tiêu CẦN ĐIỀU CHỈNH!'}
              </p>
              <p className="leading-relaxed">{result.message}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
