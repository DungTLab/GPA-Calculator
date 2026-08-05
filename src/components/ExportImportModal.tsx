import React, { useRef } from 'react';
import { Semester } from '../types';
import { exportToJson, exportToCsv, importFromJsonFile } from '../utils/exportImport';

interface ExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  semesters: Semester[];
  onImportData: (semesters: Semester[]) => void;
}

/**
 * COMPONENT: EXPORT & IMPORT MODAL
 * 
 * Cho phép người dùng lưu trữ dữ liệu dạng JSON/Excel và nhập lại file sao lưu.
 */
export const ExportImportModal: React.FC<ExportImportModalProps> = ({
  isOpen,
  onClose,
  semesters,
  onImportData
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExportJson = () => {
    exportToJson(semesters);
  };

  const handleExportCsv = () => {
    exportToCsv(semesters);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await importFromJsonFile(file);
      if (confirm(`Tìm thấy ${data.length} học kỳ trong file! Bạn có muốn khôi phục dữ liệu này không?`)) {
        onImportData(data);
        alert('Khôi phục dữ liệu thành công!');
        onClose();
      }
    } catch (err: any) {
      alert(err.message || 'Lỗi khi nhập file!');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 dark:border-slate-700">
        <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
          <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <i className="ph-bold ph-export text-emerald-500"></i> Sao lưu & Khôi phục dữ liệu
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <i className="ph-bold ph-x text-lg"></i>
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Export Options */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Xuất dữ liệu
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleExportJson}
                className="p-3 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-all flex flex-col items-center text-center group"
              >
                <i className="ph-bold ph-file-code text-2xl text-blue-500 group-hover:scale-110 transition-transform mb-1"></i>
                <span className="text-xs font-bold text-slate-800 dark:text-white">Xuất JSON (Backup)</span>
                <span className="text-[10px] text-slate-400">Đầy đủ cấu trúc học kỳ</span>
              </button>

              <button
                onClick={handleExportCsv}
                className="p-3 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-all flex flex-col items-center text-center group"
              >
                <i className="ph-bold ph-file-xls text-2xl text-emerald-500 group-hover:scale-110 transition-transform mb-1"></i>
                <span className="text-xs font-bold text-slate-800 dark:text-white">Xuất Excel (CSV)</span>
                <span className="text-[10px] text-slate-400">Dễ dàng xem & in ấn</span>
              </button>
            </div>
          </div>

          {/* Import Options */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Nhập dữ liệu
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
            >
              <i className="ph-bold ph-upload-simple text-lg"></i>
              <span>Chọn file JSON để khôi phục</span>
            </button>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-700">
          <button
            onClick={onClose}
            className="w-full py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 font-semibold text-xs sm:text-sm transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
