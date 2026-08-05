/**
 * TYPES DEFINITION FOR GPA MASTER REACT APPLICATION
 * 
 * Khái niệm React & TypeScript trong file này:
 * - Types/Interfaces giúp định nghĩa cấu trúc dữ liệu chặt chẽ (Type Safety).
 * - Giúp IDE gợi ý code (Autocomplete) và phát hiện lỗi ngay trong lúc gõ code (Compile-time checking).
 */

export interface GradeMapping {
  min: number;
  max: number;
  char: string;
  gpa4: number;
  description?: string;
}

export interface Course {
  id: string;
  name: string;
  credits: number;
  score10: number;
  charGrade: string;
  gpa4: number;
  note?: string;
}

export interface Semester {
  id: string;
  name: string;
  courses: Course[];
}

export interface GpaResult {
  gpa: number;
  credits: number;
  rank: 'Xuất sắc' | 'Giỏi' | 'Khá' | 'Trung bình' | 'Yếu' | 'Kém' | '-';
}

export interface CumulativeGpaResult extends GpaResult {
  totalSemesters: number;
}

export interface TargetPlannerInput {
  targetGpa: number;
  remainingCredits: number;
}

export interface TargetPlannerResult {
  requiredAvgGpa: number;
  isAchievable: boolean;
  message: string;
}
