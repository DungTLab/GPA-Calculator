import React, { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { GradeMapping } from '../types';
import { DEFAULT_GRADE_MAPPING } from '../utils/gpaCalculator';

interface GradeScaleContextType {
  gradeMapping: GradeMapping[];
  updateGradeMapping: (newMapping: GradeMapping[]) => void;
  resetGradeMapping: () => void;
}

const GradeScaleContext = createContext<GradeScaleContextType | undefined>(undefined);

export const GradeScaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gradeMapping, setGradeMapping] = useLocalStorage<GradeMapping[]>(
    'gpa_grade_mapping_v1',
    DEFAULT_GRADE_MAPPING
  );

  const updateGradeMapping = (newMapping: GradeMapping[]) => {
    setGradeMapping(newMapping);
  };

  const resetGradeMapping = () => {
    setGradeMapping(DEFAULT_GRADE_MAPPING);
  };

  return (
    <GradeScaleContext.Provider value={{ gradeMapping, updateGradeMapping, resetGradeMapping }}>
      {children}
    </GradeScaleContext.Provider>
  );
};

export const useGradeScale = (): GradeScaleContextType => {
  const context = useContext(GradeScaleContext);
  if (!context) {
    throw new Error('useGradeScale phải được sử dụng trong <GradeScaleProvider>');
  }
  return context;
};
