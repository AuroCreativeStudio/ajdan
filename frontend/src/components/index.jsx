import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '../i18n';  // <<< important: import i18n here

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
