import { useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Semester, Course } from '../types';
import { calculateSemesterGpa, calculateCumulativeGpa, convertScore10ToGpa4 } from '../utils/gpaCalculator';
import { useGradeScale } from '../contexts/GradeScaleContext';

/**
 * BÀI HỌC REACT: `useMemo` & STATE ARCHITECTURE
 * 
 * 1. `useMemo`: Cực kỳ quan trọng để tối ưu hiệu năng. Nút thắt toán học (tính GPA từng kỳ & GPA tích lũy)
 *    chỉ được tính toán lại KHI `semesters` hoặc `activeSemesterId` thực sự thay đổi!
 * 2. Immutable State Update: Trong React, không bao giờ mutate trực tiếp mảng hay object
 *    (ví dụ: `semesters.push(...)` là SAI). Luôn sử dụng hàm biến đổi mảng không làm thay đổi mảng gốc (như `.map()`, `.filter()`, spread operator `[...]`).
 */

const INITIAL_SEMESTERS: Semester[] = [
  {
    id: 'sem-1',
    name: 'Học kỳ 1 (2024-2025)',
    courses: []
  }
];

export function useGPA() {
  const [semesters, setSemesters] = useLocalStorage<Semester[]>('gpa_semesters_v3', INITIAL_SEMESTERS);
  const [activeSemesterId, setActiveSemesterId] = useLocalStorage<string>('gpa_active_sem_id', INITIAL_SEMESTERS[0].id);
  const { gradeMapping } = useGradeScale();

  // Đảm bảo luôn có ít nhất 1 học kỳ được chọn
  const activeSemester = useMemo(() => {
    return semesters.find(s => s.id === activeSemesterId) || semesters[0] || INITIAL_SEMESTERS[0];
  }, [semesters, activeSemesterId]);

  // Tối ưu hiệu năng tính toán GPA cho học kỳ hiện tại
  const currentSemesterGpa = useMemo(() => {
    return calculateSemesterGpa(activeSemester ? activeSemester.courses : []);
  }, [activeSemester]);

  // Tối ưu hiệu năng tính toán GPA Tích lũy cho toàn bộ khóa học
  const cumulativeGpa = useMemo(() => {
    return calculateCumulativeGpa(semesters);
  }, [semesters]);

  // --- QUẢN LÝ HỌC KỲ ---
  const addSemester = (name: string) => {
    const newSem: Semester = {
      id: `sem-${Date.now()}`,
      name: name.trim() || `Học kỳ ${semesters.length + 1}`,
      courses: []
    };
    setSemesters(prev => [...prev, newSem]);
    setActiveSemesterId(newSem.id);
  };

  const deleteSemester = (id: string) => {
    if (semesters.length <= 1) {
      alert('Phải giữ lại ít nhất 1 học kỳ!');
      return;
    }
    setSemesters(prev => {
      const filtered = prev.filter(s => s.id !== id);
      if (activeSemesterId === id && filtered.length > 0) {
        setActiveSemesterId(filtered[0].id);
      }
      return filtered;
    });
  };

  const renameSemester = (id: string, newName: string) => {
    setSemesters(prev =>
      prev.map(s => (s.id === id ? { ...s, name: newName.trim() || s.name } : s))
    );
  };

  // --- QUẢN LÝ MÔN HỌC TRONG HỌC KỲ HIỆN TẠI ---
  const addCourse = (courseData: Omit<Course, 'id' | 'charGrade' | 'gpa4'>) => {
    const converted = convertScore10ToGpa4(courseData.score10, gradeMapping);
    const newCourse: Course = {
      ...courseData,
      id: `course-${Date.now()}`,
      charGrade: converted.char,
      gpa4: converted.gpa4
    };

    setSemesters(prev =>
      prev.map(sem => {
        if (sem.id === activeSemester.id) {
          return { ...sem, courses: [...sem.courses, newCourse] };
        }
        return sem;
      })
    );
  };

  const updateCourse = (id: string, courseData: Omit<Course, 'id' | 'charGrade' | 'gpa4'>) => {
    const converted = convertScore10ToGpa4(courseData.score10, gradeMapping);

    setSemesters(prev =>
      prev.map(sem => {
        if (sem.id === activeSemester.id) {
          return {
            ...sem,
            courses: sem.courses.map(c =>
              c.id === id
                ? {
                    ...c,
                    ...courseData,
                    charGrade: converted.char,
                    gpa4: converted.gpa4
                  }
                : c
            )
          };
        }
        return sem;
      })
    );
  };

  const deleteCourse = (id: string) => {
    setSemesters(prev =>
      prev.map(sem => {
        if (sem.id === activeSemester.id) {
          return {
            ...sem,
            courses: sem.courses.filter(c => c.id !== id)
          };
        }
        return sem;
      })
    );
  };

  const clearCurrentSemesterCourses = () => {
    setSemesters(prev =>
      prev.map(sem => (sem.id === activeSemester.id ? { ...sem, courses: [] } : sem))
    );
  };

  const replaceAllSemestersData = (newSemesters: Semester[]) => {
    if (newSemesters.length > 0) {
      setSemesters(newSemesters);
      setActiveSemesterId(newSemesters[0].id);
    }
  };

  return {
    semesters,
    activeSemester,
    activeSemesterId,
    setActiveSemesterId,
    currentSemesterGpa,
    cumulativeGpa,
    addSemester,
    deleteSemester,
    renameSemester,
    addCourse,
    updateCourse,
    deleteCourse,
    clearCurrentSemesterCourses,
    replaceAllSemestersData
  };
}
