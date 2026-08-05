import React from 'react';
import { useGradeScale } from '../contexts/GradeScaleContext';

interface GradeScaleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * COMPONENT: GRADE SCALE MODAL
 * 
 * Bảng quy đổi điểm hệ 10 -> Điểm chữ -> Hệ 4
 * Cho phép xem chi tiết và reset về mặc định khi cần.
 */
export const GradeScaleModal: React.FC<GradeScaleModalProps> = ({ isOpen, onClose }) => {
  const { gradeMapping, resetGradeMapping } = useGradeScale();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden border border-slate-200 dark:border-slate-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
          <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <i className="ph-bold ph-scales text-blue-500"></i> Bảng quy đổi điểm tiêu chuẩn
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <i className="ph-bold ph-x text-lg"></i>
          </button>
        </div>

        {/* Content Table */}
        <div className="p-0 overflow-y-auto max-h-[60vh] custom-scrollbar">
          <table className="w-full text-xs sm:text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 font-semibold sticky top-0">
              <tr>
                <th className="px-4 py-3">Điểm hệ 10</th>
                <th className="px-4 py-3 text-center">Điểm chữ</th>
                <th className="px-4 py-3 text-center">Điểm hệ 4</th>
                <th className="px-4 py-3 text-right">Mô tả</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-slate-700 dark:text-slate-300">
              {gradeMapping.map((g, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  <td className="px-4 py-2.5 font-medium">
                    {g.min.toFixed(1)} - {g.max.toFixed(2)}
                  </td>
                  <td className="px-4 py-2.5 text-center font-bold text-blue-600 dark:text-blue-400">
                    {g.char}
                  </td>
                  <td className="px-4 py-2.5 text-center font-semibold">
                    {g.gpa4.toFixed(2)}
                  </td>
                  <td className="px-4 py-2.5 text-right text-slate-400 dark:text-slate-500 text-xs">
                    {g.description || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-700 flex gap-2">
          <button
            onClick={resetGradeMapping}
            className="px-3 py-2 text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            Khôi phục mặc định
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs sm:text-sm transition-colors"
          >
            Đóng bảng
          </button>
        </div>
      </div>
    </div>
  );
};
