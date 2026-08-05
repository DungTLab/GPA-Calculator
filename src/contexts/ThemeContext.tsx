import React, { createContext, useContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

/**
 * BÀI HỌC REACT: CONTEXT API & THEME MANAGEMENT
 * 
 * 1. `createContext`: Tạo ra một môi trường chứa dữ liệu dùng chung (ví dụ Theme Dark/Light).
 * 2. `Provider`: Component bọc ngoài cùng ứng dụng, chia sẻ state xuống tất cả các component con.
 * 3. `useContext`: Custom hook giúp các component con truy cập Theme ở bất kỳ đâu trong cây DOM 
 *    mà KHÔNG CẦN truyền prop qua nhiều cấp (Tránh hiện tượng Prop Drilling).
 */

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'dark');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme phải được sử dụng bên trong <ThemeProvider>');
  }
  return context;
};
