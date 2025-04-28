import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

const DashboardPage = lazy(() => import('../../pages/Dashboard'));

const DashboardRoutes = () => {
  return (
    <Routes>
      <Route index element={<DashboardPage />} />
    </Routes>
  );
};

export default DashboardRoutes;