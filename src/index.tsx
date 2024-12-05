import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

declare const module: NodeModule & {
  hot?: {
    accept(path: string, callback: () => void): void;
  };
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// 添加热重载支持
if (module.hot) {
  module.hot.accept('./App', () => {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  });
} 