import React, { useState } from 'react';
import { Course } from '../types';

interface CourseTableProps {
  courses: Course[];
  onEditCourse: (course: Course) => void;
  onDeleteCourse: (id: string) => void;
  onClearAll: () => void;
}

/**
 * BÀI HỌC REACT: LIST RENDERING & KEYS
 * 
 * 1. Rendering Lists with `.map()`: Trong React, hiển thị danh sách các thẻ HTML bằng hàm `.map()`.
 * 2. The `key` Prop: Mỗi phần tử trong danh sách PHẢI có một `key` duy nhất (`c.id`). 
 *    `key` giúp React Virtual DOM phân biệt được dòng nào bị thêm, sửa, hoặc xóa để re-render đúng vị trí mà không cần render lại cả bảng!
 */
export const CourseTable: React.FC<CourseTableProps> = ({
  courses,
  onEditCourse,
  onDeleteCourse,
  onClearAll
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCourses = courses.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-full transition-colors">
      {/* Header Bar */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex flex-wrap justify-between items-center gap-3 bg-slate-50/50 dark:bg-slate-900/40">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 text-sm sm:text-base">
            <i className="ph-bold ph-table text-indigo-500"></i> Bảng điểm chi tiết
          </h3>
          <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs px-2.5 py-0.5 rounded-full font-bold">
            {courses.length} môn
          </span>
        </div>

        <div className="flex items-center gap-2 flex-1 max-w-xs ml-auto">
          {/* Search Box */}
          <div className="relative w-full">
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Tìm tên môn..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-blue-500"
            />
            <i className="ph-bold ph-magnifying-glass absolute left-2.5 top-2 text-slate-400 text-xs"></i>
          </div>

          {courses.length > 0 && (
            <button
              onClick={() => {
                if (confirm('Bạn có chắc muốn xóa tất cả môn trong học kỳ này?')) {
                  onClearAll();
                }
              }}
              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors text-xs font-semibold flex items-center gap-1 min-w-max"
              title="Xóa danh sách"
            >
              <i className="ph-bold ph-trash"></i> Xóa tất cả
            </button>
          )}
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-xs sm:text-sm text-left whitespace-nowrap">
          <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10 font-bold">
            <tr>
              <th className="px-4 py-3">Tên môn học</th>
              <th className="px-4 py-3 text-center">Tín chỉ</th>
              <th className="px-4 py-3 text-center">Điểm hệ 10</th>
              <th className="px-4 py-3 text-center">Điểm chữ</th>
              <th className="px-4 py-3 text-center">Điểm hệ 4</th>
              <th className="px-4 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
            {filteredCourses.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                    <i className="ph-duotone ph-notebook text-5xl mb-2 text-slate-300 dark:text-slate-600"></i>
                    <p className="font-medium text-sm text-slate-500 dark:text-slate-400">
                      {searchTerm ? 'Không tìm thấy môn học phù hợp' : 'Chưa có môn học nào trong học kỳ này'}
                    </p>
                    <p className="text-xs mt-0.5">Nhập môn học ở khung bên trái để bắt đầu tính điểm</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredCourses.map(c => {
                let gradeBg = 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300';
                if (c.charGrade.startsWith('A')) gradeBg = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400';
                else if (c.charGrade.startsWith('B')) gradeBg = 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400';
                else if (c.charGrade.startsWith('C')) gradeBg = 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400';
                else if (c.charGrade === 'F') gradeBg = 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400';

                return (
                  <tr key={c.id} className="group hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px]" title={c.name}>
                      {c.name}
                    </td>
                    <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-400">
                      {c.credits}
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-slate-700 dark:text-slate-200">
                      {c.score10}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-bold text-xs ${gradeBg}`}>
                        {c.charGrade}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-slate-600 dark:text-slate-300">
                      {c.gpa4}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onEditCourse(c)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/40 dark:hover:text-blue-400 rounded-lg transition-all"
                          title="Sửa môn này"
                        >
                          <i className="ph-bold ph-pencil-simple text-base"></i>
                        </button>
                        <button
                          onClick={() => onDeleteCourse(c.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/40 dark:hover:text-red-400 rounded-lg transition-all"
                          title="Xóa môn này"
                        >
                          <i className="ph-bold ph-trash text-base"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
