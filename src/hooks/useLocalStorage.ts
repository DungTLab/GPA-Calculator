import { useState, useEffect } from 'react';

/**
 * CUSTOM HOOK: useLocalStorage
 * 
 * BÀI HỌC REACT:
 * 1. Custom Hook là gì? Là một hàm JavaScript tự định nghĩa có tên bắt đầu bằng `use`, 
 *    cho phép tái sử dụng logic chứa các React Hooks khác (như useState, useEffect).
 * 2. `useState` nhận một initializer function (`() => ...`) để chỉ đọc từ localStorage 1 lần duy nhất 
 *    khi component mount, giúp tăng hiệu năng ứng dụng.
 * 3. `useEffect` tự động chạy lại mỗi khi `key` hoặc `storedValue` thay đổi để lưu vào localStorage.
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Lỗi khi đọc key "${key}" từ localStorage:`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Lỗi khi ghi key "${key}" vào localStorage:`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
