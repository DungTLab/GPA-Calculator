import React, { useState, useEffect } from 'react';
import { Course } from '../types';

interface CourseFormProps {
  onAddCourse: (course: Omit<Course, 'id' | 'charGrade' | 'gpa4'>) => void;
  onUpdateCourse: (id: string, course: Omit<Course, 'id' | 'charGrade' | 'gpa4'>) => void;
  editingCourse: Course | null;
  onCancelEdit: () => void;
  onOpenGradeScaleModal: () => void;
}

/**
 * BÀI HỌC REACT: CONTROLLED COMPONENTS & EFFECT SYNC
 * 
 * 1. Controlled Component: Trạng thái của từng input (`name`, `credits`, `score10`) được quản lý 100% 
 *    bởi React State (`useState`). Mỗi khi ngõ phím, hàm `onChange` sẽ cập nhật state và re-render input.
 * 2. Synchronizing with `useEffect`: Khi click vào nút "Sửa môn", prop `editingCourse` thay đổi, 
 *    `useEffect` lắng nghe và tự động điền dữ liệu cũ vào các ô input.
 */
export const CourseForm: React.FC<CourseFormProps> = ({
  onAddCourse,
  onUpdateCourse,
  editingCourse,
  onCancelEdit,
  onOpenGradeScaleModal
}) => {
  const [name, setName] = useState('');
  const [credits, setCredits] = useState<number | ''>('');
  const [score10, setScore10] = useState<number | ''>('');

  useEffect(() => {
    if (editingCourse) {
      setName(editingCourse.name);
      setCredits(editingCourse.credits);
      setScore10(editingCourse.score10);
    } else {
      setName('');
      setCredits('');
      setScore10('');
    }
  }, [editingCourse]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (score10 === '' || score10 < 0 || score10 > 10) {
      alert('Điểm hệ 10 phải từ 0.0 đến 10.0');
      return;
    }

    if (credits === '' || credits < 1) {
      alert('Số tín chỉ phải lớn hơn 0');
      return;
    }

    const payload = {
      name: name.trim() || 'Môn học mới',
      credits: Number(credits),
      score10: Number(score10)
    };

    if (editingCourse) {
      onUpdateCourse(editingCourse.id, payload);
    } else {
      onAddCourse(payload);
    }

    // Reset form
    setName('');
    setCredits('');
    setScore10('');
  };

  return (
    <div className="glass-panel p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 transition-all">
      <div className="flex justify-between items-center mb-4 border-b border-slate-100 dark:border-slate-700 pb-3">
        <h2 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <i className="ph-bold ph-pencil-simple text-blue-500"></i>
          <span>{editingCourse ? 'Chỉnh sửa môn học' : 'Thêm môn học mới'}</span>
        </h2>
        <button
          type="button"
          onClick={onOpenGradeScaleModal}
          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          <i className="ph-bold ph-info"></i> Bảng quy đổi
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tên môn học */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
            Tên môn học
          </label>
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="VD: Toán cao cấp A1..."
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white outline-none transition-all"
              required
            />
            <i className="ph-bold ph-book-bookmark absolute left-3 top-3 text-slate-400 text-base"></i>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Số tín chỉ */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Số tín chỉ
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                step="1"
                value={credits}
                onChange={e => setCredits(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="VD: 3"
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white outline-none transition-all"
                required
              />
              <i className="ph-bold ph-books absolute left-3 top-3 text-slate-400 text-base"></i>
            </div>
          </div>

          {/* Điểm hệ 10 */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Điểm hệ 10
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={score10}
                onChange={e => setScore10(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="VD: 8.5"
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white outline-none transition-all"
                required
              />
              <i className="ph-bold ph-exam absolute left-3 top-3 text-slate-400 text-base"></i>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex gap-2">
          <button
            type="submit"
            className={`flex-1 font-semibold py-2.5 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-white ${
              editingCourse
                ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20'
                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
            }`}
          >
            <i className={editingCourse ? 'ph-bold ph-check' : 'ph-bold ph-plus'}></i>
            <span>{editingCourse ? 'Lưu thay đổi' : 'Thêm môn'}</span>
          </button>

          {editingCourse && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="px-3.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-all font-medium text-sm"
              title="Hủy thao tác"
            >
              Hủy
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
