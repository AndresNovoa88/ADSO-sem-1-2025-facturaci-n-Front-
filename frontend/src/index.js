import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

//import './index.css';

// Nueva forma en React 18
const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
