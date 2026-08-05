import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

/**
 * BÀI HỌC REACT: REACT 18 ROOT RENDER
 * 
 * 1. `ReactDOM.createRoot`: Phương thức mới của React 18 khởi tạo cây Virtual DOM gắn vào `<div id="root">`.
 * 2. `React.StrictMode`: Thẻ hỗ trợ trong môi trường development để phát hiện lỗi tiềm ẩn, 
 *    cảnh báo side-effects không an toàn.
 */

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
