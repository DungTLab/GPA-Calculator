import { Course, Semester, GpaResult, CumulativeGpaResult, GradeMapping, TargetPlannerResult } from '../types';

/**
 * THANG ĐIỂM CHUẨN MẶC ĐỊNH (DEFAULT GRADING SCALE)
 */
export const DEFAULT_GRADE_MAPPING: GradeMapping[] = [
  { min: 9.0, max: 10.0, char: 'A+', gpa4: 4.0, description: 'Xuất sắc' },
  { min: 8.5, max: 8.99, char: 'A', gpa4: 3.75, description: 'Giỏi' },
  { min: 8.0, max: 8.49, char: 'A-', gpa4: 3.5, description: 'Giỏi' },
  { min: 7.5, max: 7.99, char: 'B+', gpa4: 3.25, description: 'Khá' },
  { min: 7.0, max: 7.49, char: 'B', gpa4: 3.0, description: 'Khá' },
  { min: 6.5, max: 6.99, char: 'B-', gpa4: 2.75, description: 'Khá' },
  { min: 6.0, max: 6.49, char: 'C+', gpa4: 2.5, description: 'Trung bình' },
  { min: 5.5, max: 5.99, char: 'C', gpa4: 2.25, description: 'Trung bình' },
  { min: 5.0, max: 5.49, char: 'C-', gpa4: 2.0, description: 'Trung bình' },
  { min: 4.0, max: 4.99, char: 'D+', gpa4: 1.5, description: 'Yếu' },
  { min: 0.0, max: 3.99, char: 'F', gpa4: 0.0, description: 'Kém (Trượt)' }
];

/**
 * Quy đổi điểm Hệ 10 sang Điểm Chữ và Hệ 4 dựa theo bảng thang điểm
 */
export function convertScore10ToGpa4(score10: number, mapping: GradeMapping[] = DEFAULT_GRADE_MAPPING): { char: string; gpa4: number } {
  for (const grade of mapping) {
    if (score10 >= grade.min && score10 <= grade.max) {
      return { char: grade.char, gpa4: grade.gpa4 };
    }
  }
  if (score10 >= 9.0) return { char: mapping[0].char, gpa4: mapping[0].gpa4 };
  return { char: mapping[mapping.length - 1].char, gpa4: mapping[mapping.length - 1].gpa4 };
}

/**
 * Xếp loại học lực dựa trên GPA hệ 4
 */
export function getRankFromGpa(gpa: number): GpaResult['rank'] {
  if (gpa >= 3.6) return 'Xuất sắc';
  if (gpa >= 3.2) return 'Giỏi';
  if (gpa >= 2.5) return 'Khá';
  if (gpa >= 2.0) return 'Trung bình';
  if (gpa >= 1.0) return 'Yếu';
  if (gpa > 0) return 'Kém';
  return '-';
}

/**
 * Tính toán GPA cho một Học Kỳ cụ thể (Semester GPA)
 * 
 * Công thức: GPA = SUM(Điểm hệ 4 * Số tín chỉ) / SUM(Số tín chỉ)
 */
export function calculateSemesterGpa(courses: Course[]): GpaResult {
  if (!courses || courses.length === 0) {
    return { gpa: 0, credits: 0, rank: '-' };
  }

  let totalWeightedScore = 0;
  let totalCredits = 0;

  courses.forEach(c => {
    totalWeightedScore += c.gpa4 * c.credits;
    totalCredits += c.credits;
  });

  const gpa = totalCredits > 0 ? Number((totalWeightedScore / totalCredits).toFixed(2)) : 0;
  const rank = getRankFromGpa(gpa);

  return { gpa, credits: totalCredits, rank };
}

/**
 * Tính toán GPA Tích Lũy toàn bộ các Học Kỳ (Cumulative GPA)
 */
export function calculateCumulativeGpa(semesters: Semester[]): CumulativeGpaResult {
  if (!semesters || semesters.length === 0) {
    return { gpa: 0, credits: 0, rank: '-', totalSemesters: 0 };
  }

  let totalWeightedScore = 0;
  let totalCredits = 0;
  let activeSemestersCount = 0;

  semesters.forEach(sem => {
    if (sem.courses.length > 0) activeSemestersCount++;
    sem.courses.forEach(c => {
      totalWeightedScore += c.gpa4 * c.credits;
      totalCredits += c.credits;
    });
  });

  const gpa = totalCredits > 0 ? Number((totalWeightedScore / totalCredits).toFixed(2)) : 0;
  const rank = getRankFromGpa(gpa);

  return {
    gpa,
    credits: totalCredits,
    rank,
    totalSemesters: activeSemestersCount
  };
}

/**
 * Công cụ dự đoán GPA mục tiêu (Target GPA Planner)
 * 
 * Tính xem các tín chỉ còn lại cần đạt GPA trung bình bao nhiêu để đạt được Target GPA mong muốn.
 * Công thức: Target_Weighted = Target_GPA * (Current_Credits + Remaining_Credits)
 * Required_GPA = (Target_Weighted - Current_Weighted) / Remaining_Credits
 */
export function calculateTargetGpaPlan(
  currentSemesters: Semester[],
  targetGpa: number,
  remainingCredits: number
): TargetPlannerResult {
  const currentCumulative = calculateCumulativeGpa(currentSemesters);
  const currentCredits = currentCumulative.credits;
  const currentGpa = currentCumulative.gpa;

  if (remainingCredits <= 0) {
    return {
      requiredAvgGpa: 0,
      isAchievable: false,
      message: 'Số tín chỉ còn lại phải lớn hơn 0!'
    };
  }

  const totalCredits = currentCredits + remainingCredits;
  const totalPointsNeeded = targetGpa * totalCredits;
  const currentPointsEarned = currentGpa * currentCredits;
  const pointsNeededFromRemaining = totalPointsNeeded - currentPointsEarned;

  const requiredAvgGpa = Number((pointsNeededFromRemaining / remainingCredits).toFixed(2));

  if (requiredAvgGpa > 4.0) {
    return {
      requiredAvgGpa,
      isAchievable: false,
      message: `Rất tiếc! Để đạt GPA ${targetGpa.toFixed(2)}, bạn cần đạt GPA trung bình ${requiredAvgGpa} cho ${remainingCredits} tín chỉ còn lại (vượt quá mức tối đa 4.0).`
    };
  }

  if (requiredAvgGpa <= 0) {
    return {
      requiredAvgGpa: 0,
      isAchievable: true,
      message: `Chúc mừng! Với GPA hiện tại (${currentGpa}), bạn chắc chắn đã đạt mục tiêu ${targetGpa.toFixed(2)} ngay cả khi chỉ cần qua môn.`
    };
  }

  return {
    requiredAvgGpa,
    isAchievable: true,
    message: `Để đạt GPA mục tiêu ${targetGpa.toFixed(2)}, bạn cần duy trì GPA trung bình tối thiểu là ${requiredAvgGpa} / 4.0 trong ${remainingCredits} tín chỉ tiếp theo.`
  };
}
