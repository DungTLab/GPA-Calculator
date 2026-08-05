import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  onOpenGradeScale: () => void;
  onOpenExportImport: () => void;
}

/**
 * BÀI HỌC REACT: COMPONENT & PROPS
 * 
 * 1. Component `Header` là một Functional Component nguyên tử (Pure Presentational Component).
 * 2. `HeaderProps` định nghĩa kiểu dữ liệu của Props nhận vào từ cha (`App.tsx`).
 * 3. Sử dụng `useTheme()` custom hook để thay đổi giao diện sáng/tối.
 */
export const Header: React.FC<HeaderProps> = ({ onOpenGradeScale, onOpenExportImport }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="w-full max-w-5xl mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Brand Title */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-2xl shadow-sm border border-blue-500/20">
          <i className="ph-fill ph-calculator text-3xl"></i>
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
            GPA Master <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 font-semibold border border-blue-200 dark:border-blue-800">React v2.0</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Quản lý đa học kỳ & Tính toán GPA tích lũy chính xác
          </p>
        </div>
      </div>

      {/* Quick Action Tools */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenGradeScale}
          className="px-3 py-2 text-xs sm:text-sm font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-all flex items-center gap-1.5 shadow-sm"
          title="Bảng quy đổi điểm"
        >
          <i className="ph-bold ph-scales text-blue-500 text-base"></i>
          <span>Thang điểm</span>
        </button>

        <button
          onClick={onOpenExportImport}
          className="px-3 py-2 text-xs sm:text-sm font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-all flex items-center gap-1.5 shadow-sm"
          title="Xuất/Nhập dữ liệu"
        >
          <i className="ph-bold ph-export text-emerald-500 text-base"></i>
          <span>Sao lưu</span>
        </button>

        <button
          onClick={toggleTheme}
          className="p-2.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-yellow-400 border border-slate-200 dark:border-slate-700 rounded-xl hover:scale-105 transition-all shadow-sm focus:outline-none"
          title={theme === 'dark' ? 'Chuyển sang Chế độ sáng' : 'Chuyển sang Chế độ tối'}
        >
          {theme === 'dark' ? (
            <i className="ph-fill ph-sun text-xl"></i>
          ) : (
            <i className="ph-fill ph-moon text-xl text-slate-600"></i>
          )}
        </button>
      </div>
    </header>
  );
};
