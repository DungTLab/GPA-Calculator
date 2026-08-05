import React, { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { GradeScaleProvider } from './contexts/GradeScaleContext';
import { useGPA } from './hooks/useGPA';
import { Header } from './components/Header';
import { SemesterManager } from './components/SemesterManager';
import { StatsSummary } from './components/StatsSummary';
import { CourseForm } from './components/CourseForm';
import { CourseTable } from './components/CourseTable';
import { TargetPlanner } from './components/TargetPlanner';
import { AnalyticsChart } from './components/AnalyticsChart';
import { GradeScaleModal } from './components/GradeScaleModal';
import { ExportImportModal } from './components/ExportImportModal';
import { Course } from './types';

/**
 * BÀI HỌC REACT: MAIN APP COMPONENT & ARCHITECTURE
 * 
 * 1. App Content tách biệt: `MainAppContent` chứa toàn bộ UI chính và sử dụng `useGPA()`.
 * 2. Provider Pattern: `App` bọc `ThemeProvider` và `GradeScaleProvider` ở ngoài cùng.
 * 3. Lift State Up (Nâng trạng thái): State `editingCourse`, modal open states được quản lý ở App level.
 */

const MainAppContent: React.FC = () => {
  const {
    semesters,
    activeSemester,
    activeSemesterId,
    setActiveSemesterId,
    currentSemesterGpa,
    cumulativeGpa,
    addSemester,
    deleteSemester,
    addCourse,
    updateCourse,
    deleteCourse,
    clearCurrentSemesterCourses,
    replaceAllSemestersData
  } = useGPA();

  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isGradeScaleOpen, setIsGradeScaleOpen] = useState(false);
  const [isExportImportOpen, setIsExportImportOpen] = useState(false);

  const handleEditClick = (course: Course) => {
    setEditingCourse(course);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingCourse(null);
  };

  const handleUpdateCourseWithReset = (id: string, courseData: Omit<Course, 'id' | 'charGrade' | 'gpa4'>) => {
    updateCourse(id, courseData);
    setEditingCourse(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 flex flex-col items-center py-6 px-4 sm:px-6 transition-colors font-sans">
      {/* Header Bar */}
      <Header
        onOpenGradeScale={() => setIsGradeScaleOpen(true)}
        onOpenExportImport={() => setIsExportImportOpen(true)}
      />

      {/* Semester Selection Bar */}
      <SemesterManager
        semesters={semesters}
        activeSemesterId={activeSemesterId}
        onSelectSemester={(id) => {
          setActiveSemesterId(id);
          setEditingCourse(null);
        }}
        onAddSemester={addSemester}
        onDeleteSemester={deleteSemester}
      />

      {/* Main Grid Content */}
      <main className="w-full max-w-5xl space-y-6">
        {/* GPA Summary Cards */}
        <StatsSummary
          semesterGpa={currentSemesterGpa}
          cumulativeGpa={cumulativeGpa}
          semesterName={activeSemester.name}
        />

        {/* Form and Table Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Column */}
          <div className="lg:col-span-1">
            <CourseForm
              onAddCourse={addCourse}
              onUpdateCourse={handleUpdateCourseWithReset}
              editingCourse={editingCourse}
              onCancelEdit={handleCancelEdit}
              onOpenGradeScaleModal={() => setIsGradeScaleOpen(true)}
            />
          </div>

          {/* Table Column */}
          <div className="lg:col-span-2">
            <CourseTable
              courses={activeSemester.courses}
              onEditCourse={handleEditClick}
              onDeleteCourse={deleteCourse}
              onClearAll={clearCurrentSemesterCourses}
            />
          </div>
        </div>

        {/* Analytics Chart */}
        <AnalyticsChart semesters={semesters} />

        {/* Target GPA Planner */}
        <TargetPlanner semesters={semesters} />
      </main>

      {/* Modals */}
      <GradeScaleModal
        isOpen={isGradeScaleOpen}
        onClose={() => setIsGradeScaleOpen(false)}
      />

      <ExportImportModal
        isOpen={isExportImportOpen}
        onClose={() => setIsExportImportOpen(false)}
        semesters={semesters}
        onImportData={replaceAllSemestersData}
      />

      {/* Footer */}
      <footer className="mt-12 text-center text-xs text-slate-400 dark:text-slate-500 py-4 border-t border-slate-200 dark:border-slate-800 w-full max-w-5xl">
        GPA Master React App &bull; Học lập trình React bài bản với TypeScript
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <GradeScaleProvider>
        <MainAppContent />
      </GradeScaleProvider>
    </ThemeProvider>
  );
};

export default App;
