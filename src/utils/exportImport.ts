import { Semester } from '../types';

/**
 * Xuất dữ liệu học kỳ ra file JSON để sao lưu / khôi phục
 */
export function exportToJson(semesters: Semester[], filename = 'gpa_data_backup.json') {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(semesters, null, 2)
  )}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  downloadAnchor.setAttribute('download', filename);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Xuất dữ liệu bảng điểm ra file CSV (có thể mở bằng Excel)
 */
export function exportToCsv(semesters: Semester[], filename = 'gpa_transcript.csv') {
  let csvContent = '\uFEFF'; // BOM UTF-8 để mở Excel không bị lỗi phông tiếng Việt
  csvContent += 'Học kỳ,Tên môn học,Số tín chỉ,Điểm hệ 10,Điểm chữ,Điểm hệ 4\n';

  semesters.forEach(sem => {
    sem.courses.forEach(c => {
      const row = [
        `"${sem.name.replace(/"/g, '""')}"`,
        `"${c.name.replace(/"/g, '""')}"`,
        c.credits,
        c.score10,
        `"${c.charGrade}"`,
        c.gpa4
      ].join(',');
      csvContent += row + '\n';
    });
  });

  const encodedUri = encodeURI(`data:text/csv;charset=utf-8,${csvContent}`);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
}

/**
 * Đọc file JSON upload và parse thành danh sách Semester
 */
export function importFromJsonFile(file: File): Promise<Semester[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          resolve(parsed);
        } else {
          reject(new Error('Định dạng dữ liệu file không hợp lệ!'));
        }
      } catch (err) {
        reject(new Error('Không thể đọc file JSON này. File có thể bị hỏng!'));
      }
    };
    reader.onerror = () => reject(new Error('Lỗi khi đọc file.'));
    reader.readAsText(file);
  });
}
