import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import esES from 'antd/lib/locale/es_ES';
import { AuthProvider } from './contexts/AuthContext';
import RootRouter from './routes';
import './assets/styles/main.css';

function App() {
  return (
    <ConfigProvider locale={esES}>
      <Router>
        <AuthProvider>
          <RootRouter />
        </AuthProvider>
      </Router>
    </ConfigProvider>
  );
}

export default App;