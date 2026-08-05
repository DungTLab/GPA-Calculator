import React, { useState } from 'react';
import { Semester } from '../types';

interface SemesterManagerProps {
  semesters: Semester[];
  activeSemesterId: string;
  onSelectSemester: (id: string) => void;
  onAddSemester: (name: string) => void;
  onDeleteSemester: (id: string) => void;
}

/**
 * BÀI HỌC REACT: CONDITIONAL RENDERING & INTERACTIVE STATE
 * 
 * 1. Controlled Form State: `isAdding` và `newSemName` quản lý chế độ thêm mới inline.
 * 2. Render theo điều kiện: Dùng `semesters.map()` để tạo tab linh hoạt.
 */
export const SemesterManager: React.FC<SemesterManagerProps> = ({
  semesters,
  activeSemesterId,
  onSelectSemester,
  onAddSemester,
  onDeleteSemester
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newSemName, setNewSemName] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSemName.trim()) return;
    onAddSemester(newSemName);
    setNewSemName('');
    setIsAdding(false);
  };

  return (
    <div className="w-full max-w-5xl mb-6 bg-white dark:bg-slate-800 p-2 sm:p-3 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-2 overflow-x-auto custom-scrollbar">
      <div className="flex items-center gap-1.5 min-w-max">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 flex items-center gap-1">
          <i className="ph-bold ph-folder-open text-base"></i> Học kỳ:
        </span>

        {semesters.map(sem => {
          const isActive = sem.id === activeSemesterId;
          const courseCount = sem.courses.length;

          return (
            <div key={sem.id} className="relative group inline-flex items-center">
              <button
                onClick={() => onSelectSemester(sem.id)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>{sem.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {courseCount}
                </span>
              </button>

              {/* Nút xóa học kỳ (chỉ xuất hiện nếu có trên 1 học kỳ) */}
              {semesters.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Bạn có chắc muốn xóa "${sem.name}" và toàn bộ điểm môn học trong học kỳ này?`)) {
                      onDeleteSemester(sem.id);
                    }
                  }}
                  className={`ml-1 p-1 text-slate-400 hover:text-red-500 rounded-md transition-colors opacity-0 group-hover:opacity-100 ${
                    isActive ? 'text-white/80 hover:text-white' : ''
                  }`}
                  title="Xóa học kỳ này"
                >
                  <i className="ph-bold ph-x text-xs"></i>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Form thêm học kỳ nhanh */}
      {isAdding ? (
        <form onSubmit={handleAddSubmit} className="flex items-center gap-1 min-w-max animate-fade-in">
          <input
            type="text"
            value={newSemName}
            onChange={e => setNewSemName(e.target.value)}
            placeholder="Tên học kỳ..."
            className="px-3 py-1.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border border-blue-500 rounded-xl text-slate-800 dark:text-white outline-none"
            autoFocus
          />
          <button
            type="submit"
            className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs font-medium"
          >
            Lưu
          </button>
          <button
            type="button"
            onClick={() => setIsAdding(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 text-xs"
          >
            Hủy
          </button>
        </form>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="px-3 py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all border border-dashed border-blue-300 dark:border-blue-800 flex items-center gap-1.5 min-w-max ml-auto"
        >
          <i className="ph-bold ph-plus"></i> Thêm kỳ mới
        </button>
      )}
    </div>
  );
};
